/**
 * POST /api/student/run-code
 * Runs student code against test cases (1 public + 5 hidden).
 * Uses AI to generate test cases from the problem, then evaluates each.
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

interface TestCase {
  input: string
  expectedOutput: string
  isPublic: boolean
}

interface TestResult {
  input: string
  expectedOutput: string
  actualOutput: string
  passed: boolean
  isPublic: boolean
  error?: string
}

async function generateTestCases(problem: any, lang: string): Promise<TestCase[]> {
  const groqKey = process.env.GROQ_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY

  const prompt = `Generate exactly 6 test cases for this coding problem in ${lang}.

Problem: ${problem.title}
Description: ${problem.desc}
Public example: Input="${problem.input}" Output="${problem.output}"

Rules:
- Test case 1 (public): Use exactly the given example: input="${problem.input}", output="${problem.output}"
- Test cases 2-6 (hidden): Generate 5 varied cases including edge cases (empty, single char, numbers, special cases)
- Keep inputs and outputs SHORT and precise
- Output must be exact expected output string (no extra spaces/newlines unless required)

Return ONLY valid JSON array, no markdown:
[
  {"input": "racecar", "expectedOutput": "true", "isPublic": true},
  {"input": "hello", "expectedOutput": "false", "isPublic": false},
  {"input": "a", "expectedOutput": "true", "isPublic": false},
  {"input": "ab", "expectedOutput": "false", "isPublic": false},
  {"input": "", "expectedOutput": "true", "isPublic": false},
  {"input": "abcba", "expectedOutput": "true", "isPublic": false}
]`

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
    return r.json()
  }

  let data: any = null
  if (groqKey) {
    try { data = await call(groqKey, "https://api.groq.com/openai/v1/chat/completions", "llama-3.3-70b-versatile") }
    catch { /* fallback */ }
  }
  if (!data && openaiKey) {
    data = await call(openaiKey, "https://api.openai.com/v1/chat/completions", "gpt-4o-mini")
  }

  if (!data) throw new Error("No AI provider")
  const raw = data.choices?.[0]?.message?.content?.trim() ?? ""
  const clean = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
  return JSON.parse(clean)
}

async function evaluateAgainstTestCases(
  code: string, lang: string, problem: any, testCases: TestCase[]
): Promise<TestResult[]> {
  const groqKey = process.env.GROQ_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY

  const prompt = `You are evaluating ${lang} code against test cases.

Problem: ${problem.title}
Code:
\`\`\`${lang.toLowerCase()}
${code}
\`\`\`

Test cases to evaluate (simulate running the code mentally):
${testCases.map((t, i) => `${i + 1}. Input: "${t.input}" → Expected: "${t.expectedOutput}"`).join("\n")}

For each test case, determine what the code would actually output when given that input.
Consider edge cases carefully.

Return ONLY valid JSON array with exactly ${testCases.length} results:
[
  {"actualOutput": "true", "passed": true},
  {"actualOutput": "false", "passed": true},
  ...
]`

  const call = async (key: string, url: string, model: string) => {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 600,
      }),
    })
    if (!r.ok) throw new Error(`${r.status}`)
    return r.json()
  }

  let data: any = null
  if (groqKey) {
    try { data = await call(groqKey, "https://api.groq.com/openai/v1/chat/completions", "llama-3.3-70b-versatile") }
    catch { /* fallback */ }
  }
  if (!data && openaiKey) {
    data = await call(openaiKey, "https://api.openai.com/v1/chat/completions", "gpt-4o-mini")
  }

  if (!data) throw new Error("No AI provider")
  const raw = data.choices?.[0]?.message?.content?.trim() ?? ""
  const clean = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
  const results = JSON.parse(clean)

  return testCases.map((tc, i) => ({
    input: tc.input,
    expectedOutput: tc.expectedOutput,
    actualOutput: results[i]?.actualOutput ?? "error",
    passed: results[i]?.passed ?? false,
    isPublic: tc.isPublic,
  }))
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { code, language = "Python", problem, mode = "run" } = await req.json()
    if (!code?.trim()) return NextResponse.json({ error: "No code provided" }, { status: 400 })
    if (!problem) return NextResponse.json({ error: "No problem provided" }, { status: 400 })

    // Generate all 6 test cases
    const allTestCases = await generateTestCases(problem, language)

    // "run" mode = only public test case, "submit" mode = all 6
    const testCases = mode === "run"
      ? allTestCases.filter(t => t.isPublic)
      : allTestCases

    // Evaluate code against selected test cases
    const results = await evaluateAgainstTestCases(code, language, problem, testCases)

    const passed = results.filter(r => r.passed).length
    const total = results.length
    const allPassed = passed === total
    const publicPassed = results.find(r => r.isPublic)?.passed ?? false

    return NextResponse.json({
      success: true,
      results,
      passed,
      total,
      allPassed,
      publicPassed,
      mode,
      summary: allPassed
        ? `${total}/${total} passed ✓`
        : `${passed}/${total} passed`,
    })
  } catch (err) {
    console.error("run-code error:", err)
    return NextResponse.json({ error: "Failed to run tests", detail: String(err) }, { status: 500 })
  }
}
