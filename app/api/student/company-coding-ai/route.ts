/**
 * POST /api/student/company-coding-ai
 * AI model that generates coding questions mimicking a specific company's real OA style.
 * Uses the static problem banks (service-company-problems, fintech-problem-bank,
 * it-services-problems) as RAG training context to teach the AI the exact company style.
 *
 * Body: { company: string, count?: number, difficulty?: string }
 * Returns: { questions: CodingQuestion[], company: string, style: string }
 */

import { NextResponse } from "next/server"
import { SERVICE_PROBLEM_BANK } from "@/lib/service-company-problems"
import { FINTECH_PROBLEM_BANK } from "@/lib/fintech-problem-bank"
import { ALL_COMPANIES } from "@/lib/companies-data"

// ── Helpers ─────────────────────────────────────────────────────────────────

const GROQ_API   = "https://api.groq.com/openai/v1/chat/completions"
const OPENAI_API = "https://api.openai.com/v1/chat/completions"

async function callAI(systemPrompt: string, userPrompt: string, maxTokens = 6000): Promise<string> {
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user",   content: userPrompt },
  ]

  if (process.env.OPENAI_API_KEY) {
    try {
      const res = await fetch(OPENAI_API, {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o-mini", messages, temperature: 0.8, max_tokens: maxTokens }),
      })
      if (res.ok) {
        const data = await res.json()
        const text = data.choices?.[0]?.message?.content?.trim()
        if (text) return text
      }
    } catch {}
  }

  if (process.env.GROQ_API_KEY) {
    const res = await fetch(GROQ_API, {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages, temperature: 0.8, max_tokens: maxTokens }),
    })
    if (res.ok) {
      const data = await res.json()
      return data.choices?.[0]?.message?.content?.trim() ?? ""
    }
  }
  throw new Error("No AI provider available")
}

// ── RAG Context Builder ──────────────────────────────────────────────────────

/**
 * Extracts up to `limit` problems from our static banks that match the given
 * company (or fall back to category-similar companies).
 * Returns a rich context string the AI uses to learn the company's style.
 */
function buildCodingRAGContext(companyId: string, limit = 5): {
  context: string
  styleProfile: string
  exampleProblems: any[]
} {
  // Normalise the id: "tech-mahindra" -> "techmahindra"
  const normId = companyId.replace(/-/g, "")

  // Collect matching problems from all banks
  const allBanks: Record<string, any> = {
    ...SERVICE_PROBLEM_BANK,
    ...FINTECH_PROBLEM_BANK,
  }

  // Try IT_SERVICES_PROBLEM_BANK (may not be fully generated yet, safe require)
  try {
    const { IT_SERVICES_PROBLEM_BANK } = require("@/lib/it-services-problems")
    Object.assign(allBanks, IT_SERVICES_PROBLEM_BANK)
  } catch {}

  // Find direct company match
  const direct = Object.values(allBanks).filter(
    (p: any) => p.company === normId || p.company === companyId
  ) as any[]

  // If no direct match, find the company's category and use same-category problems
  const co = ALL_COMPANIES.find(c => c.id === companyId)
  let categoryProblems: any[] = []
  if (direct.length < 3 && co?.category) {
    const similarIds = ALL_COMPANIES
      .filter(c => c.category === co.category && c.id !== companyId)
      .map(c => c.id.replace(/-/g, ""))
    categoryProblems = Object.values(allBanks).filter(
      (p: any) => similarIds.includes(p.company)
    ) as any[]
  }

  const pool = direct.length >= 3 ? direct : [...direct, ...categoryProblems]
  // Shuffle and take limit
  const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, limit)

  if (shuffled.length === 0) {
    return { context: "", styleProfile: "general", exampleProblems: [] }
  }

  // Build a style profile from the pool
  const patterns = [...new Set(shuffled.map((p: any) => p.pattern))]
  const difficulties = shuffled.map((p: any) => p.difficulty)
  const easyCount  = difficulties.filter(d => d === "Easy").length
  const mediumCount = difficulties.filter(d => d === "Medium").length
  const hardCount  = difficulties.filter(d => d === "Hard").length
  const styleProfile = `Patterns: ${patterns.slice(0,6).join(", ")} | Difficulty mix: Easy=${easyCount} Medium=${mediumCount} Hard=${hardCount}`

  // Format examples for the prompt
  const examplesText = shuffled.map((p: any, i: number) => `
--- EXAMPLE ${i+1} ---
Title: ${p.title}
Difficulty: ${p.difficulty}
Pattern: ${p.pattern}
Description: ${p.desc}
Example Input/Output:
${p.examples?.map((e: any) => `  Input: ${e.input}\n  Output: ${e.output}${e.explanation ? `\n  Why: ${e.explanation}` : ""}`).join("\n") ?? "N/A"}
Constraints: ${p.constraints?.join(", ") ?? "Standard constraints"}
`.trim()).join("\n\n")

  const context = `
REAL CODING PROBLEMS FROM ${(co?.name ?? companyId).toUpperCase()} CAMPUS HIRING (${co?.category ?? "Tech"}):

${examplesText}

COMPANY STYLE PROFILE:
- Preferred patterns: ${patterns.slice(0,4).join(", ")}
- Difficulty distribution: ${easyCount} Easy, ${mediumCount} Medium, ${hardCount} Hard
- Assessment type: ${co?.desc ?? "Online Assessment"}
- Target roles: ${co?.roles?.join(", ") ?? "Software Engineer"}
- Duration: ${co?.duration ?? 90} minutes, ${co?.questions ?? 3} questions
`.trim()

  return { context, styleProfile, exampleProblems: shuffled }
}

// ── System Prompt ────────────────────────────────────────────────────────────

function buildSystemPrompt(companyName: string, category: string): string {
  const styleGuide: Record<string, string> = {
    "IT Services": `
- Problems are straightforward with clear examples
- Focus on implementation over complex algorithms
- Always provide 2 examples per problem
- Constraints are moderate (arrays up to 10^4, strings up to 10^3)
- Include a follow-up hint or note about time complexity
- Prefer problems solvable in under 20 minutes`,

    "Product": `
- Problems test algorithmic depth — expect BFS/DFS, DP, design patterns
- Constraints are large (10^5 to 10^6), requiring optimal solutions
- Include edge cases in the examples
- Problems often have real-world framing (e.g., "design a system", "optimize a feed")
- At least 1 Hard problem per set
- Code must be correct and efficient — O(n log n) or better`,

    "Startups": `
- Problems mix product thinking with DSA
- Often involve real-world scenarios (ride sharing, food delivery, payments)
- Medium to Hard difficulty
- Fast-paced: problems should be solvable in 30-45 minutes
- Emphasize clean code and edge case handling`,

    "BFSI": `
- Problems often involve financial calculations, transactions, or data streams
- Mix of DSA and system design concepts
- Include problems involving sorting, searching, and aggregation
- Medium difficulty with one Hard problem
- Real-world framing: e.g., "given a list of transactions..."`,

    "Consulting": `
- Problems test basic algorithm knowledge and problem decomposition
- Focus on clarity of solution over performance
- Easy to Medium difficulty
- Data manipulation, sorting, filtering are common
- Include a case-study style framing where possible`,

    "Core Engg": `
- Emphasis on low-level programming: bit manipulation, memory management
- C/C++ style problems common
- Include problems on embedded systems patterns
- Medium difficulty, technically precise constraints
- Focus on efficiency and system-level thinking`,

    "Default": `
- Balanced mix of Easy and Medium problems
- Clear problem statements with 2 examples
- Standard DSA topics: arrays, strings, sorting, basic DP
- Solvable within the assessment time limit`,
  }

  const guide = styleGuide[category] || styleGuide["Default"]

  return `You are an expert assessment question designer who has studied thousands of real ${companyName} coding rounds.

Your job is to generate NEW coding questions that feel EXACTLY like real ${companyName} OA problems.

STYLE GUIDELINES FOR ${companyName.toUpperCase()}:
${guide}

STRICT OUTPUT RULES:
1. Return ONLY a valid JSON array — no markdown, no code blocks, no extra text
2. Each question must follow the exact schema provided
3. Problem statements must be clear, unambiguous, and testable
4. Examples must be correct — verify input/output manually before including
5. Do NOT copy the example problems — create fresh, original variations inspired by the style
6. Vary the topics across the set — no two problems on the same exact topic`
}

// ── Main Handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const companyId: string = body.company ?? ""
    const count: number = Math.min(body.count ?? 3, 5)
    const requestedDiff: string = body.difficulty ?? ""

    if (!companyId) {
      return NextResponse.json({ error: "company is required" }, { status: 400 })
    }

    const co = ALL_COMPANIES.find(c => c.id === companyId)
    const companyName = co?.name ?? companyId
    const category = co?.category ?? "IT Services"

    // Build RAG context from static banks
    const { context, styleProfile, exampleProblems } = buildCodingRAGContext(companyId, 6)

    // If no AI provider, return static examples directly
    if (!process.env.GROQ_API_KEY && !process.env.OPENAI_API_KEY) {
      if (exampleProblems.length > 0) {
        return NextResponse.json({
          questions: exampleProblems.slice(0, count).map((p, i) => ({
            id: i + 1,
            title: p.title,
            difficulty: p.difficulty,
            statement: p.desc,
            constraints: p.constraints?.join(", ") ?? "",
            example: p.examples?.[0] ? {
              input: p.examples[0].input,
              output: p.examples[0].output,
              explanation: p.examples[0].explanation ?? "",
            } : { input: "", output: "", explanation: "" },
            hints: [`Pattern: ${p.pattern}`],
            topic: p.pattern,
          })),
          company: companyName,
          style: styleProfile,
          source: "static_bank",
        })
      }
      return NextResponse.json({ error: "No AI provider and no static problems found" }, { status: 503 })
    }

    const systemPrompt = buildSystemPrompt(companyName, category)

    const difficultyInstruction = requestedDiff
      ? `All questions must be ${requestedDiff} difficulty.`
      : `Match the difficulty distribution shown in the examples above.`

    const userPrompt = `
${context ? context + "\n\n" : ""}Generate ${count} NEW coding problems for ${companyName}'s online assessment.

REQUIREMENTS:
- ${difficultyInstruction}
- Each problem must feel like it came from ${companyName}'s real OA
- Style profile to match: ${styleProfile || "standard campus coding assessment"}
- Use varied patterns: do not repeat the same algorithmic pattern twice
- For each problem, ensure the example input/output is 100% correct

Return ONLY this JSON array (no markdown, no explanation):
[
  {
    "id": 1,
    "title": "Descriptive problem title",
    "difficulty": "Easy|Medium|Hard",
    "topic": "pattern name (e.g. Sliding Window, DP, Graph BFS)",
    "statement": "Full problem description. Clearly state what is given and what to return. Include all edge cases.",
    "constraints": "1 <= n <= 10^5 (one constraint per line or comma separated)",
    "example": {
      "input": "specific input values",
      "output": "correct output",
      "explanation": "step-by-step why this output is correct"
    },
    "hints": ["hint 1 — algorithmic approach", "hint 2 — edge case to consider"]
  }
]`

    const raw = await callAI(systemPrompt, userPrompt, 5000)
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
    const parsed = JSON.parse(cleaned)
    const questions = Array.isArray(parsed) ? parsed : (parsed.questions ?? [])

    return NextResponse.json({
      questions,
      company: companyName,
      style: styleProfile,
      source: "ai_generated",
      examplesUsed: exampleProblems.length,
    })

  } catch (err: any) {
    console.error("company-coding-ai error:", err)
    return NextResponse.json({ error: err.message ?? "Generation failed" }, { status: 500 })
  }
}
