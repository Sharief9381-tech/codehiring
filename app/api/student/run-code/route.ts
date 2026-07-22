/**
 * POST /api/student/run-code
 * Generates test cases AND evaluates code in a single AI call.
 * mode: "run" = public test only, "submit" = all 6 tests
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

async function aiCall(key: string, url: string, model: string, prompt: string): Promise<any> {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 800,
    }),
  })
  if (!r.ok) {
    const errText = await r.text()
    throw new Error(`HTTP ${r.status}: ${errText.slice(0, 200)}`)
  }
  const data = await r.json()
  const raw = data.choices?.[0]?.message?.content?.trim() ?? ""
  if (!raw) throw new Error("Empty response from AI")
  return raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { code, language = "Python", problem, mode = "run" } = await req.json()
    if (!code?.trim()) return NextResponse.json({ error: "No code provided" }, { status: 400 })
    if (!problem)      return NextResponse.json({ error: "No problem provided" }, { status: 400 })

    const count = mode === "run" ? 1 : 6

    const prompt = `You are evaluating ${language} code for a coding problem.

PROBLEM: ${problem.title}
Description: ${problem.desc}
Public example: Input="${problem.input}" → Output="${problem.output}"

STUDENT CODE:
\`\`\`${language.toLowerCase()}
${code}
\`\`\`

Task: Generate ${count} test case(s) and evaluate the code against each.
${mode === "run"
  ? "Test case 1: Use exactly the public example (input=\"" + problem.input + "\", expected=\"" + problem.output + "\")."
  : `Test case 1: Use the public example (input="${problem.input}", expected="${problem.output}").
Test cases 2-6: Generate 5 varied hidden cases (edge cases: empty, single char, special values, etc.).`}

For each test case:
1. Determine what the code would actually output for that input (simulate execution mentally)
2. Compare actual vs expected

Return ONLY valid JSON array with exactly ${count} objects:
[
  {
    "input": "racecar",
    "expectedOutput": "true",
    "actualOutput": "true",
    "passed": true,
    "isPublic": true
  }
]

Rules:
- isPublic = true only for test case 1
- passed = (actualOutput === expectedOutput) after trimming whitespace
- Keep inputs and outputs SHORT strings`

    const groqKey    = process.env.GROQ_API_KEY
    const openaiKey  = process.env.OPENAI_API_KEY
    const mistralKey = process.env.MISTRAL_API_KEY

    let raw: string | null = null

    // OpenAI first (most reliable for code evaluation)
    if (openaiKey) {
      try {
        raw = await aiCall(openaiKey, "https://api.openai.com/v1/chat/completions", "gpt-4o-mini", prompt)
      } catch (e) {
        console.error("OpenAI failed:", e)
      }
    }
    // Groq fallback
    if (!raw && groqKey) {
      try {
        raw = await aiCall(groqKey, "https://api.groq.com/openai/v1/chat/completions", "llama-3.3-70b-versatile", prompt)
      } catch (e) {
        console.error("Groq failed:", e)
      }
    }
    // Mistral last resort
    if (!raw && mistralKey) {
      try {
        raw = await aiCall(mistralKey, "https://api.mistral.ai/v1/chat/completions", "mistral-small-latest", prompt)
      } catch (e) {
        console.error("Mistral failed:", e)
      }
    }

    if (!raw) {
      return NextResponse.json({ error: "All AI providers failed. Check API keys and try again." }, { status: 500 })
    }

    let results: any[]
    try {
      results = JSON.parse(raw)
    } catch {
      console.error("Failed to parse AI response:", raw.slice(0, 300))
      return NextResponse.json({ error: "AI returned invalid format. Please try again." }, { status: 500 })
    }

    // Ensure isPublic is set correctly
    results.forEach((r, i) => { r.isPublic = i === 0 })

    const passed    = results.filter(r => r.passed).length
    const total     = results.length
    const allPassed = passed === total
    const publicPassed = results[0]?.passed ?? false

    return NextResponse.json({
      success: true,
      results,
      passed,
      total,
      allPassed,
      publicPassed,
      mode,
      summary: allPassed ? `${total}/${total} passed ✓` : `${passed}/${total} passed`,
    })
  } catch (err) {
    console.error("run-code error:", err)
    return NextResponse.json({ error: "Failed to run tests", detail: String(err) }, { status: 500 })
  }
}
