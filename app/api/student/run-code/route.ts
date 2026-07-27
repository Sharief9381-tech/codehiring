/**
 * POST /api/student/run-code
 * Uses our own Docker-based execution engine (code-executor/server.mjs).
 *
 * Setup:
 *  1. Deploy code-executor/ to a Linux VPS with Docker installed
 *  2. Set EXECUTOR_URL and EXECUTOR_SECRET in .env
 *  3. Run: node setup.mjs (pulls Docker images)
 *  4. Run: node server.mjs (starts the executor)
 *
 * Local dev (Windows): Docker sandboxing requires Linux.
 *   → Run the executor inside WSL2 or a Linux VM.
 *   → Or use the dev fallback below (child_process direct exec — no sandbox).
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDatabase } from "@/lib/database"

// ── Language-aware time limits (ms) ──────────────────────────────────────────
const LANG_TIMEOUT: Record<string, number> = {
  Python:     5000,
  JavaScript: 3000,
  TypeScript: 4000,
  Java:       5000,
  "C++":      2000,
  C:          2000,
  "C#":       4000,
  Go:         2000,
  Kotlin:     5000,
  Swift:      5000,
}

const LANG_KEY: Record<string, string> = {
  Python:"python",JavaScript:"javascript",TypeScript:"typescript",
  Java:"java","C++":"c++",C:"c","C#":"c#",Go:"go",Kotlin:"kotlin",Swift:"swift",
}

// ── Execute code ──────────────────────────────────────────────────────────────
async function executeCode(code: string, language: string, stdin: string, timeoutMs: number) {
  const executorUrl    = process.env.EXECUTOR_URL
  const executorSecret = process.env.EXECUTOR_SECRET ?? "codehiring-executor-secret"
  if (!executorUrl) throw new Error("EXECUTOR_URL not set")
  const langKey = LANG_KEY[language] ?? language.toLowerCase()
  const res = await fetch(`${executorUrl}/execute`, {
    method: "POST",
    headers: { "Content-Type":"application/json", "Authorization":`Bearer ${executorSecret}` },
    body: JSON.stringify({ code, language: langKey, stdin, timeoutMs }),
    signal: AbortSignal.timeout(timeoutMs + 10000),
  })
  if (!res.ok) throw new Error(`Executor error ${res.status}`)
  const data = await res.json()
  return { output: data.output ?? "", error: data.error ?? "", runtimeMs: data.runtimeMs ?? 0, tle: data.tle ?? false }
}

// ── Generate test cases with AI (input + expected output) ──────────────────────
async function generateTestCasesWithAI(problem: any, count: number): Promise<Array<{input:string;expected:string;isPublic:boolean}>> {
  const groqKey   = process.env.GROQ_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY

  const prompt = `Generate exactly ${count} test cases for this coding problem.

Problem: ${problem.title}
Description: ${problem.desc}
Input format: ${problem.inputFormat || "Standard stdin input"}
Output format: ${problem.outputFormat || "Standard stdout output"}
Example: Input="${problem.input}" → Output="${problem.output}"

Rules:
- Test 1: Use the exact public example (input="${problem.input}", expected="${problem.output}")
${problem.input2 ? `- Test 2: Use the second example (input="${problem.input2}", expected="${problem.output2}")` : ""}
- Remaining tests: edge cases with correct expected outputs
- ALL expected outputs must be CORRECT (verify them yourself)
- Input/output format must match exactly

Return ONLY a JSON array:
[{"input":"...","expected":"...","isPublic":true},{"input":"...","expected":"...","isPublic":false}]`

  const call = async (key: string, url: string, model: string) => {
    const r = await fetch(url, {
      method:"POST", headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},
      body: JSON.stringify({ model, messages:[{role:"user",content:prompt}], temperature:0.1, max_tokens:600 }),
    })
    if (!r.ok) throw new Error(`${r.status}`)
    const d = await r.json()
    const raw = (d.choices?.[0]?.message?.content ?? "").trim().replace(/^```(?:json)?\n?/i,"").replace(/\n?```$/i,"").trim()
    return JSON.parse(raw)
  }

  let result = null
  if (groqKey)   { try { result = await call(groqKey,   "https://api.groq.com/openai/v1/chat/completions", "llama-3.3-70b-versatile") } catch {} }
  if (!result && openaiKey) { try { result = await call(openaiKey, "https://api.openai.com/v1/chat/completions", "gpt-4o-mini") } catch {} }

  if (!result || !Array.isArray(result)) throw new Error("AI failed to generate test cases")
  return result.map((tc: any, i: number) => ({
    input:    tc.input    ?? problem.input ?? "",
    expected: tc.expected ?? "",
    isPublic: i < 2,
  }))
}

// ── Build test cases — cached in DB per problem ────────────────────────────────
async function buildTestCasesWithCache(
  problem: any, count: number
): Promise<Array<{input:string;expected:string;isPublic:boolean}>> {
  const problemKey = problem.title?.toLowerCase().replace(/\s+/g,"-") ?? "unknown"

  // Try DB cache first
  try {
    const db     = await getDatabase()
    const cached = await db.collection("problem_test_cases").findOne({ problemKey })
    if (cached?.testCases?.length >= count) {
      const tcs = cached.testCases.slice(0, count)
      return tcs.map((tc: any, i: number) => ({ ...tc, isPublic: i < 2 }))
    }
  } catch {}

  // Generate with AI
  let testCases: Array<{input:string;expected:string;isPublic:boolean}>
  try {
    testCases = await generateTestCasesWithAI(problem, Math.max(count, 6))
  } catch {
    // Fallback: use known public examples only
    const pub  = { input: problem.input ?? "", expected: problem.output ?? "", isPublic: true }
    const pub2 = problem.input2 ? { input: problem.input2, expected: problem.output2 ?? "", isPublic: true } : pub
    testCases  = [pub, pub2, pub, pub, pub, pub].slice(0, count)
  }

  // Cache in DB
  try {
    const db = await getDatabase()
    await db.collection("problem_test_cases").updateOne(
      { problemKey },
      { $set: { problemKey, testCases, generatedAt: new Date() } },
      { upsert: true }
    )
  } catch {}

  return testCases.slice(0, count).map((tc, i) => ({ ...tc, isPublic: i < 2 }))
}

// ── Call our own execution engine ─────────────────────────────────────────────
async function executeCode(
  code: string,
  language: string,
  stdin: string,
  timeoutMs: number
): Promise<{ output: string; error: string; runtimeMs: number; tle: boolean }> {
  const executorUrl    = process.env.EXECUTOR_URL
  const executorSecret = process.env.EXECUTOR_SECRET ?? "codehiring-executor-secret"

  if (!executorUrl) {
    throw new Error(
      "EXECUTOR_URL not set in .env.\n" +
      "Deploy code-executor/ to a Linux VPS and set EXECUTOR_URL=http://your-vps:4000"
    )
  }

  const langKey = LANG_KEY[language] ?? language.toLowerCase()

  const res = await fetch(`${executorUrl}/execute`, {
    method:  "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${executorSecret}`,
    },
    body: JSON.stringify({ code, language: langKey, stdin, timeoutMs }),
    signal: AbortSignal.timeout(timeoutMs + 10000), // total HTTP timeout
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Executor error ${res.status}: ${txt.slice(0, 200)}`)
  }

  const data = await res.json()
  return {
    output:    data.output ?? "",
    error:     data.error  ?? "",
    runtimeMs: data.runtimeMs ?? 0,
    tle:       data.tle ?? false,
  }
}

// ── Build test cases ───────────────────────────────────────────────────────────
// All test cases have known expected outputs (stored from AI generation)
// Public = first 2, Hidden = remaining
function buildTestCases(
  problem: { input: string; output: string; input2?: string; output2?: string; input3?: string; output3?: string; input4?: string; output4?: string },
  count: number
): Array<{ input: string; expected: string; isPublic: boolean }> {
  const cases: Array<{ input: string; expected: string; isPublic: boolean }> = []

  // Add all available test cases (up to 4 with known expected)
  if (problem.input)  cases.push({ input: problem.input,  expected: problem.output  ?? "", isPublic: true  })
  if (problem.input2) cases.push({ input: problem.input2, expected: problem.output2 ?? "", isPublic: true  })
  if (problem.input3) cases.push({ input: problem.input3, expected: problem.output3 ?? "", isPublic: false })
  if (problem.input4) cases.push({ input: problem.input4, expected: problem.output4 ?? "", isPublic: false })

  // Fill remaining with repeats of public test (if not enough stored)
  while (cases.length < count) {
    cases.push({ input: problem.input ?? "", expected: problem.output ?? "", isPublic: false })
  }

  return cases.slice(0, count)
}

// ── POST handler ──────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { code, language = "Python", problem, mode = "run" } = await req.json()
    if (!code?.trim()) return NextResponse.json({ error: "No code provided" }, { status: 400 })
    if (!problem)      return NextResponse.json({ error: "No problem provided" }, { status: 400 })

    // Check executor is configured
    if (!process.env.EXECUTOR_URL) {
      return NextResponse.json({
        error:   "Execution engine not configured.",
        detail:  "Deploy code-executor/ to a Linux VPS, then set EXECUTOR_URL in .env",
        docsUrl: "See code-executor/README.md for full setup instructions",
      }, { status: 503 })
    }

    const count     = mode === "run" ? 2 : 6
    const testCases = mode === "run"
      ? [
          { input: problem.input ?? "", expected: problem.output ?? "", isPublic: true },
          problem.input2 ? { input: problem.input2, expected: problem.output2 ?? "", isPublic: true } : { input: problem.input ?? "", expected: problem.output ?? "", isPublic: true },
        ]
      : await buildTestCasesWithCache(problem, 6)
    const timeout   = LANG_TIMEOUT[language] ?? 5000

    // Run sequentially — our executor handles one at a time per container
    const results = []
    for (const tc of testCases) {
      let output = "", error = "", runtimeMs = 0, tle = false

      try {
        ;({ output, error, runtimeMs, tle } = await executeCode(code, language, tc.input, timeout))
      } catch (e: any) {
        error = e.message ?? "Execution error"
      }

      const actual      = output.trim()
      const expected    = tc.expected.trim()
      const hasExpected = expected !== ""
      const normalize   = (s: string) => s.replace(/\r\n/g, "\n").toLowerCase().replace(/\s+/g, " ").trim()
      const isErr       = !!error && !tle

      const passed = tle || isErr
        ? false
        : hasExpected
          ? normalize(actual) === normalize(expected)
          : !isErr  // fallback: pass if no error (old cases without stored expected)

      results.push({
        input:          tc.input,
        expectedOutput: tc.expected || "(hidden)",
        actualOutput:   tle ? "Time Limit Exceeded" : isErr ? `Error: ${error}` : actual,
        passed,
        isPublic:       tc.isPublic,
        runtimeMs,
        tle,
        error: error || undefined,
      })
    }

    const passedCount  = results.filter(r => r.passed).length
    const total        = results.length
    const allPassed    = passedCount === total
    const publicPassed = results[0]?.passed ?? false
    const maxRuntime   = Math.max(...results.map(r => r.runtimeMs ?? 0))

    return NextResponse.json({
      success:      true,
      results,
      passed:       passedCount,
      total,
      allPassed,
      publicPassed,
      mode,
      runtimeMs:    maxRuntime,
      timeLimit:    timeout,
      language,
      summary:      allPassed ? `${total}/${total} passed ✓` : `${passedCount}/${total} passed`,
    })

  } catch (err: any) {
    console.error("run-code error:", err)
    return NextResponse.json({ error: err.message ?? "Failed to run code" }, { status: 500 })
  }
}
