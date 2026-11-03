/**
 * POST /api/student/generate-practice-questions
 *
 * Generates practice questions for a topic sorted Easy → Medium → Hard.
 * Uses existing static bank questions as style reference for AI generation.
 * Caches results in MongoDB (24h TTL) per topic+section.
 *
 * Body: {
 *   topic:    string   — topic name e.g. "Percentages", "Grammar", "Arrays"
 *   section:  string   — "aptitude" | "verbal" | "coding" | "logical"
 *   count?:   number   — per difficulty level (default 5 each = 15 total)
 * }
 */

import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDatabase } from "@/lib/database"

const GEMINI_KEYS = () => [
  process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
].filter(Boolean) as string[]

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent"

// ── Call AI with key rotation ─────────────────────────────────────────────────
async function callAI(prompt: string): Promise<string> {
  // Try Gemini keys first
  for (const key of GEMINI_KEYS()) {
    try {
      const r = await fetch(`${GEMINI_URL}?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 3000, temperature: 0.7 },
        }),
        signal: AbortSignal.timeout(30000),
      })
      if (r.ok) {
        const d = await r.json()
        const text = d.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ""
        if (text.length > 50) return text
      } else if (r.status === 429 || r.status === 403) {
        continue // try next key
      }
    } catch { continue }
  }

  // OpenAI fallback
  if (process.env.OPENAI_API_KEY) {
    try {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], temperature: 0.7, max_tokens: 3000 }),
        signal: AbortSignal.timeout(30000),
      })
      if (r.ok) {
        const d = await r.json()
        return d.choices?.[0]?.message?.content?.trim() ?? ""
      }
    } catch {}
  }

  // Groq fallback
  if (process.env.GROQ_API_KEY) {
    try {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
        body: JSON.stringify({ model: "openai/gpt-oss-20b", messages: [{ role: "user", content: prompt }], temperature: 0.7, max_tokens: 3000 }),
        signal: AbortSignal.timeout(30000),
      })
      if (r.ok) {
        const d = await r.json()
        return d.choices?.[0]?.message?.content?.trim() ?? ""
      }
    } catch {}
  }

  throw new Error("All AI providers failed")
}

// ── Parse AI response ─────────────────────────────────────────────────────────
function parseQuestions(raw: string): any[] {
  const clean = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
  const parsed = JSON.parse(clean)
  if (!Array.isArray(parsed)) throw new Error("Expected array")
  return parsed
}

// ── Build prompt based on section type ───────────────────────────────────────
function buildPrompt(
  topic: string,
  section: string,
  difficulty: "Easy" | "Medium" | "Hard",
  count: number,
  sampleQuestions: string
): string {
  const isCoding = section === "coding"
  const isVerbal = section === "verbal"

  if (isCoding) {
    return `Generate ${count} unique coding MCQ questions about "${topic}" at ${difficulty} difficulty level.
These are concept/theory-based MCQ questions (NOT full coding problems).

${sampleQuestions ? `STYLE REFERENCE (do NOT copy, just match style/depth):\n${sampleQuestions}\n` : ""}

RULES:
- Questions test understanding of ${topic} algorithms/concepts
- ${difficulty === "Easy" ? "Basic definitions, simple examples, time complexity" : difficulty === "Medium" ? "Tricky edge cases, algorithm steps, comparisons" : "Advanced analysis, optimization, complex scenarios"}
- 4 options each, only one correct
- Clear step-by-step explanation

Return ONLY valid JSON array, no markdown:
[
  {
    "question": "question text",
    "options": ["A", "B", "C", "D"],
    "correct": 0,
    "explanation": "why this answer is correct",
    "topic": "${topic}",
    "difficulty": "${difficulty}"
  }
]
Generate EXACTLY ${count} questions.`
  }

  if (isVerbal) {
    return `Generate ${count} unique English verbal/grammar MCQ questions about "${topic}" at ${difficulty} level.

${sampleQuestions ? `STYLE REFERENCE (do NOT copy, just match style):\n${sampleQuestions}\n` : ""}

RULES:
- Topic: ${topic}
- ${difficulty === "Easy" ? "Basic rules, common usage, simple sentences" : difficulty === "Medium" ? "Intermediate grammar, less common idioms, moderate vocabulary" : "Advanced usage, complex structures, rare idioms"}
- 4 options, one correct
- Include explanation
${topic === "Reading Comprehension" ? '- Include a "passage" field with a short 80-120 word paragraph\n- Question should ask about the passage' : ""}

Return ONLY valid JSON array:
[
  {
    "question": "question text",
    ${topic === "Reading Comprehension" ? '"passage": "short passage text here",' : ""}
    "options": ["A", "B", "C", "D"],
    "correct": 0,
    "explanation": "explanation",
    "topic": "${topic}",
    "difficulty": "${difficulty}"
  }
]
Generate EXACTLY ${count} questions.`
  }

  // Aptitude / Logical
  return `Generate ${count} unique aptitude/reasoning MCQ questions about "${topic}" at ${difficulty} level.

${sampleQuestions ? `STYLE REFERENCE (same style/format, do NOT copy these):\n${sampleQuestions}\n` : ""}

RULES:
- Topic: ${topic}
- ${difficulty === "Easy" ? "Direct formulas, simple 1-step calculations, basic concepts" : difficulty === "Medium" ? "2-3 step calculations, moderate complexity, typical placement level" : "Multi-step reasoning, tricky questions, hard placement level"}
- 4 plausible options (avoid obviously wrong distractors)
- Explanation must show step-by-step working
- Numbers must be realistic and clean (avoid fractions unless the topic requires)

Return ONLY valid JSON array, no markdown:
[
  {
    "question": "complete question text with all numbers",
    "options": ["option A", "option B", "option C", "option D"],
    "correct": 0,
    "explanation": "Step 1: ... Step 2: ... Answer = ...",
    "topic": "${topic}",
    "difficulty": "${difficulty}"
  }
]
Generate EXACTLY ${count} questions.`
}

// ── Get sample questions from static banks ───────────────────────────────────
async function getSampleQuestions(topic: string, section: string): Promise<string> {
  try {
    const samples: string[] = []

    if (section === "aptitude" || section === "logical") {
      const { QUANTITATIVE_BANK } = await import("@/lib/quantitative-reasoning")
      const topicQs = QUANTITATIVE_BANK.filter(q =>
        q.topic.toLowerCase() === topic.toLowerCase()
      ).slice(0, 4)

      for (const q of topicQs) {
        samples.push(
          `Q: ${q.question}\nOptions: ${q.options.join(" | ")}\nAnswer: ${["A","B","C","D"][q.correct]}\nExplanation: ${q.explanation}\nDifficulty: ${q.difficulty}`
        )
      }
    }

    if (section === "verbal") {
      const { COMMUNICATION_BANK } = await import("@/lib/communication-bank")
      const topicQs = COMMUNICATION_BANK.filter(q =>
        q.topic.toLowerCase() === topic.toLowerCase()
      ).slice(0, 4)

      for (const q of topicQs) {
        samples.push(
          `Q: ${q.question}\nOptions: ${q.options.join(" | ")}\nAnswer: ${["A","B","C","D"][q.correct]}\nDifficulty: ${q.difficulty}`
        )
      }
    }

    return samples.join("\n---\n")
  } catch {
    return ""
  }
}

// ── POST handler ──────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const body    = await req.json()
    const topic   = String(body.topic   ?? "").trim()
    const section = String(body.section ?? "aptitude").trim()
    const perDiff = Math.min(Number(body.count ?? 5), 10)

    if (!topic) return NextResponse.json({ error: "topic required" }, { status: 400 })

    const db      = await getDatabase()
    const col     = db.collection("practice_questions_cache")
    const cacheKey = `${section}__${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-")}__v1`

    // ── Check cache (24h TTL) ─────────────────────────────────────────────────
    const cached = await col.findOne({ cacheKey })
    if (cached?.questions?.length >= perDiff * 3) {
      const sorted = sortEasyToHard(cached.questions)
      return NextResponse.json({ questions: sorted, source: "cache", topic, section })
    }

    // ── Get sample questions from static bank ─────────────────────────────────
    const samples = await getSampleQuestions(topic, section)

    // ── Generate questions for each difficulty ────────────────────────────────
    const allQuestions: any[] = []

    for (const diff of ["Easy", "Medium", "Hard"] as const) {
      try {
        const prompt = buildPrompt(topic, section, diff, perDiff, samples)
        const raw    = await callAI(prompt)
        const parsed = parseQuestions(raw)

        const questions = parsed.slice(0, perDiff).map((q: any, i: number) => ({
          id:          `${cacheKey}-${diff.toLowerCase()}-${i + 1}`,
          question:    q.question ?? "",
          options:     Array.isArray(q.options) ? q.options : [],
          correct:     typeof q.correct === "number" ? q.correct : 0,
          explanation: q.explanation ?? "",
          topic:       q.topic ?? topic,
          difficulty:  diff,
          passage:     q.passage ?? undefined,
          section,
        }))

        allQuestions.push(...questions)
      } catch (e) {
        console.error(`[generate-practice-questions] ${diff} failed for ${topic}:`, e)
        // Continue — partial results are OK
      }
    }

    if (allQuestions.length === 0) {
      return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 })
    }

    // ── Cache result (24h) ────────────────────────────────────────────────────
    await col.updateOne(
      { cacheKey },
      { $set: { cacheKey, topic, section, questions: allQuestions, generatedAt: new Date() } },
      { upsert: true }
    )

    const sorted = sortEasyToHard(allQuestions)
    return NextResponse.json({ questions: sorted, source: "ai", topic, section, total: sorted.length })

  } catch (err: any) {
    console.error("[generate-practice-questions]", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ── Sort Easy → Medium → Hard ─────────────────────────────────────────────────
function sortEasyToHard(questions: any[]): any[] {
  const order: Record<string, number> = { Easy: 0, Medium: 1, Hard: 2 }
  return [...questions].sort((a, b) => (order[a.difficulty] ?? 1) - (order[b.difficulty] ?? 1))
}
