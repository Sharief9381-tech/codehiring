/**
 * POST /api/student/evaluate-code
 * Evaluates student code using Mistral (primary) → Groq → OpenAI fallback chain.
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { code, language = "Python", problem } = await req.json()
    if (!code?.trim()) return NextResponse.json({ error: "No code provided" }, { status: 400 })
    if (!problem)      return NextResponse.json({ error: "No problem provided" }, { status: 400 })

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
  "feedback": "2-4 sentences of clear, encouraging feedback. Mention what they did right and what to fix.",
  "hint": "One specific hint if incorrect, empty string if correct",
  "timeComplexity": "e.g. O(n) or unknown",
  "improvements": ["up to 2 short improvement suggestions, empty array if perfect"]
}`

    const call = async (apiKey: string, url: string, model: string) => {
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 600,
        }),
      })
      if (!r.ok) throw new Error(`${r.status}`)
      return r.json()
    }

    const mistralKey = process.env.MISTRAL_API_KEY
    const groqKey    = process.env.GROQ_API_KEY
    const openaiKey  = process.env.OPENAI_API_KEY

    let data: any = null

    // 1. Mistral (primary)
    if (mistralKey) {
      try {
        data = await call(mistralKey, "https://api.mistral.ai/v1/chat/completions", "mistral-small-latest")
      } catch { /* fall through */ }
    }

    // 2. Groq fallback
    if (!data && groqKey) {
      try {
        data = await call(groqKey, "https://api.groq.com/openai/v1/chat/completions", "llama-3.3-70b-versatile")
      } catch { /* fall through */ }
    }

    // 3. OpenAI last resort
    if (!data && openaiKey) {
      try {
        data = await call(openaiKey, "https://api.openai.com/v1/chat/completions", "gpt-4o-mini")
      } catch (e: any) {
        return NextResponse.json({ error: `All AI providers failed` }, { status: 500 })
      }
    }

    if (!data) {
      return NextResponse.json({ error: "No AI provider available. Add MISTRAL_API_KEY or GROQ_API_KEY to .env" }, { status: 500 })
    }

    const raw     = data.choices?.[0]?.message?.content?.trim() ?? ""
    const cleaned = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
    const result  = JSON.parse(cleaned)

    return NextResponse.json({ success: true, result })
  } catch (err) {
    console.error("evaluate-code error:", err)
    return NextResponse.json({ error: "Evaluation failed", detail: String(err) }, { status: 500 })
  }
}
