/**
 * POST /api/student/evaluate-code
 * Evaluates student-written code for a daily challenge using OpenAI.
 * Body: { code, language, problem: { title, desc, input, output, explain } }
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { code, language = "Python", problem } = await req.json()
    if (!code?.trim()) return NextResponse.json({ error: "No code provided" }, { status: 400 })
    if (!problem)       return NextResponse.json({ error: "No problem provided" }, { status: 400 })

    const key = process.env.OPENAI_API_KEY
    if (!key) return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })

    const prompt = `You are a coding evaluator for beginner CS students. Evaluate the following ${language} code submitted for this problem.

PROBLEM: ${problem.title}
Description: ${problem.desc}
Example Input: ${problem.input}
Expected Output: ${problem.output}
Explanation: ${problem.explain}

STUDENT'S CODE:
\`\`\`${language.toLowerCase()}
${code}
\`\`\`

Evaluate the code and respond ONLY with a valid JSON object (no markdown, no explanation outside JSON):
{
  "correct": true or false,
  "score": number from 0-100,
  "verdict": "Accepted" | "Wrong Answer" | "Partial" | "Syntax Error" | "Logic Error",
  "feedback": "2-4 sentences of clear, encouraging feedback for a beginner. Mention what they did right and what to fix.",
  "hint": "One specific hint if incorrect, empty string if correct",
  "timeComplexity": "e.g. O(n) or unknown",
  "improvements": ["up to 2 short improvement suggestions, empty array if perfect"]
}`

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 600,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: `OpenAI error: ${res.status}`, detail: err }, { status: 500 })
    }

    const data    = await res.json()
    const raw     = data.choices?.[0]?.message?.content?.trim() ?? ""
    const cleaned = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
    const result  = JSON.parse(cleaned)

    return NextResponse.json({ success: true, result })
  } catch (err) {
    console.error("evaluate-code error:", err)
    return NextResponse.json({ error: "Evaluation failed", detail: String(err) }, { status: 500 })
  }
}
