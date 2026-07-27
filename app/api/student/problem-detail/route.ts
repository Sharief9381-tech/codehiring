/**
 * POST /api/student/problem-detail
 * Given a problem title + topic, returns a full problem statement
 * with input format, output format, constraints, example I/O.
 * Used by the topic coding grid to open problems in our own editor.
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDatabase } from "@/lib/database"
import { TOPIC_QUESTIONS } from "@/lib/topic-questions"

// Build a flat map of problemId → { title, topic, difficulty }
const PROBLEM_MAP: Record<string, { title: string; topic: string; difficulty: string }> = {}
for (const topic of TOPIC_QUESTIONS) {
  for (const q of topic.questions) {
    PROBLEM_MAP[q.id] = { title: q.title, topic: topic.label, difficulty: q.difficulty }
  }
}

async function generateProblem(title: string, topic: string, difficulty: string): Promise<any> {
  const groqKey   = process.env.GROQ_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY

  const prompt = `Generate a complete coding problem for: "${title}"

Topic: ${topic}
Difficulty: ${difficulty}

Return ONLY a valid JSON object, no markdown:
{
  "title": "${title}",
  "desc": "2-3 sentence clear problem description explaining what to do",
  "inputFormat": "Describe exactly what the input looks like",
  "outputFormat": "Describe exactly what to print/return",
  "constraints": ["1 <= n <= 10^5", "Time limit: 2s", "Memory: 256 MB"],
  "input": "First example input (exact, ready to pipe to stdin)",
  "output": "Correct output for the first example",
  "input2": "Second example input (different values, same format)",
  "output2": "Correct output for the second example",
  "input3": "Third edge-case input (boundary value or special case)",
  "output3": "Correct output for the third example",
  "input4": "Fourth input (larger or more complex case)",
  "output4": "Correct output for the fourth example",
  "explain": "One sentence explaining why the first output is correct"
}`

  const call = async (key: string, url: string, model: string) => {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 800,
      }),
    })
    if (!r.ok) throw new Error(`${r.status}`)
    const d = await r.json()
    const raw = d.choices?.[0]?.message?.content?.trim() ?? ""
    return raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
  }

  let raw = ""
  if (groqKey)   { try { raw = await call(groqKey,   "https://api.groq.com/openai/v1/chat/completions", "llama-3.3-70b-versatile") } catch {} }
  if (!raw && openaiKey) { try { raw = await call(openaiKey, "https://api.openai.com/v1/chat/completions", "gpt-4o-mini") } catch {} }
  if (!raw) throw new Error("AI unavailable")

  return JSON.parse(raw)
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const body = await req.json()

    // Support both: { title, topic, difficulty } and { problemId }
    let title      = body.title
    let topic      = body.topic      ?? "DSA"
    let difficulty = body.difficulty ?? "Medium"

    if (!title && body.problemId) {
      const meta = PROBLEM_MAP[body.problemId]
      if (!meta) return NextResponse.json({ error: "Unknown problemId" }, { status: 404 })
      title      = meta.title
      topic      = meta.topic
      difficulty = meta.difficulty
    }

    if (!title) return NextResponse.json({ error: "title or problemId required" }, { status: 400 })

    // Cache in DB — only use cache if it has input3 field (latest format with 4 test cases)
    const db       = await getDatabase()
    const cacheKey = `${title.toLowerCase().replace(/\s+/g, "-")}`
    const cached   = await db.collection("problem_details").findOne({ cacheKey })
    if (cached?.problem && cached.problem.input3 && cached.problem.input3 !== "") {
      return NextResponse.json({ problem: cached.problem, fromCache: true })
    }
    // Stale cache — delete and regenerate
    if (cached) {
      await db.collection("problem_details").deleteOne({ cacheKey })
    }

    const problem = await generateProblem(title, topic ?? "DSA", difficulty)

    // Cache it
    await db.collection("problem_details").updateOne(
      { cacheKey },
      { $set: { cacheKey, problem, generatedAt: new Date() } },
      { upsert: true }
    )

    return NextResponse.json({ problem, fromCache: false })
  } catch (err) {
    console.error("problem-detail error:", err)
    return NextResponse.json({ error: "Failed to generate problem" }, { status: 500 })
  }
}
