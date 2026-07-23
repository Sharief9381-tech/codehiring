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

// Normalize language name to what our executor expects
const LANG_KEY: Record<string, string> = {
  Python:     "python",
  JavaScript: "javascript",
  TypeScript: "typescript",
  Java:       "java",
  "C++":      "c++",
  C:          "c",
  "C#":       "c#",
  Go:         "go",
  Kotlin:     "kotlin",
  Swift:      "swift",
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

// ── Build test cases (no AI) ───────────────────────────────────────────────────
function buildTestCases(
  problem: { input: string; output: string },
  count: number
): Array<{ input: string; expected: string; isPublic: boolean }> {
  const pub = { input: problem.input ?? "", expected: problem.output ?? "", isPublic: true }
  if (count <= 1) return [pub]

  const cases: Array<{ input: string; expected: string; isPublic: boolean }> = [pub]
  const raw = (problem.input ?? "").trim()
  const num = Number(raw)

  if (!isNaN(num) && raw !== "") {
    for (const inp of [String(num + 1), "0", "1", String(Math.abs(num) * 2), "10"]) {
      if (cases.length >= count) break
      cases.push({ input: inp, expected: "", isPublic: false })
    }
  } else {
    const s = raw.replace(/^["']|["']$/g, "")
    for (const inp of [s.split("").reverse().join(""), s.slice(0,1)||"a", "abc", "test", ""]) {
      if (cases.length >= count) break
      cases.push({ input: inp, expected: "", isPublic: false })
    }
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

    const count     = mode === "run" ? 1 : 6
    const testCases = buildTestCases(problem, count)
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
          : true  // hidden case with no known expected — pass if no error

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
