/**
 * POST /api/student/run-code
 * Executes student code via the CodeHiring Execution Engine on Render.com.
 *
 * Executor: https://code-executor-ry2k.onrender.com  (set via EXECUTOR_URL)
 * Local dev: set EXECUTOR_URL=http://172.x.x.x:4000  (WSL2 IP)
 *
 * Environment variables:
 *   EXECUTOR_URL     — URL of the running code-executor server (required)
 *   EXECUTOR_SECRET  — Bearer token (default: codehiring-executor-secret)
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

// ── Language time limits (ms) ─────────────────────────────────────────────────
const LANG_TIMEOUT: Record<string, number> = {
  Python:     5000,
  JavaScript: 3000,
  TypeScript: 4000,
  Java:       6000,
  "C++":      3000,
  C:          3000,
  "C#":       5000,
  Go:         3000,
  Kotlin:     6000,
  Swift:      6000,
}

// Normalize language name for the executor
const LANG_KEY: Record<string, string> = {
  Python: "python", JavaScript: "javascript", TypeScript: "typescript",
  Java: "java", "C++": "c++", C: "c", "C#": "csharp",
  Go: "go", Kotlin: "kotlin", Swift: "swift",
}

// ── Call the Render executor ──────────────────────────────────────────────────
async function executeCode(
  code: string,
  language: string,
  stdin: string,
  timeoutMs: number
) {
  const executorUrl = process.env.EXECUTOR_URL?.trim()
  if (!executorUrl) {
    throw new Error(
      "EXECUTOR_URL is not set. " +
      "Add EXECUTOR_URL=https://code-executor-ry2k.onrender.com to your environment variables."
    )
  }

  const secret  = process.env.EXECUTOR_SECRET ?? "codehiring-executor-secret"
  const langKey = LANG_KEY[language] ?? language.toLowerCase()

  const res = await fetch(`${executorUrl}/execute`, {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${secret}`,
    },
    body: JSON.stringify({ code, language: langKey, stdin, timeoutMs }),
    signal: AbortSignal.timeout(timeoutMs + 15000), // extra buffer for Render cold start
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`Executor error ${res.status}: ${body.slice(0, 200)}`)
  }

  const data = await res.json()
  return {
    output:    data.output    ?? "",
    error:     data.error     ?? "",
    runtimeMs: data.runtimeMs ?? 0,
    tle:       data.tle       ?? false,
  }
}

// ── Extract Python method name from student's Solution class ──────────────────
function extractPythonMethodName(code: string): string | null {
  const match = code.match(/class\s+Solution[\s\S]*?def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(self/)
  return match?.[1] ?? null
}

// Patch test script: replace sol.<any>( → sol.<actualMethod>(
function patchTestScript(script: string, method: string): string {
  return script.replace(/\bsol\s*\.\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\(/g, `sol.${method}(`)
}

// ── Build test cases from problem data ────────────────────────────────────────
function buildTestCases(
  problem: any,
  count: number,
  language: string,
  studentCode?: string
): Array<{ input: string; expected: string; isPublic: boolean; isScript?: boolean }> {

  // New stdin-based format (stdin1..5 / expected1..5) — 2 public + 3 hidden
  if (problem.stdin1 !== undefined) {
    const cases = [
      { input: problem.stdin1 ?? "", expected: problem.expected1 ?? "", isPublic: problem.public1 !== false },
      { input: problem.stdin2 ?? "", expected: problem.expected2 ?? "", isPublic: problem.public2 !== false },
      { input: problem.stdin3 ?? "", expected: problem.expected3 ?? "", isPublic: problem.public3 === true },
      { input: problem.stdin4 ?? "", expected: problem.expected4 ?? "", isPublic: problem.public4 === true },
      { input: problem.stdin5 ?? "", expected: problem.expected5 ?? "", isPublic: problem.public5 === true },
    ].filter(c => c.input.trim() !== "")

    return cases.slice(0, count).map(c => ({
      input:    c.input,
      expected: c.expected,
      isPublic: c.isPublic,
      isScript: false,
    }))
  }

  // Legacy LeetCode-style Python test scripts
  if (problem.pythonTest1 && language === "Python") {
    const actualMethod = studentCode ? extractPythonMethodName(studentCode) : null
    const tests = [
      { script: problem.pythonTest1, expected: String(problem.expectedTest1 ?? ""), isPublic: true  },
      { script: problem.pythonTest2, expected: String(problem.expectedTest2 ?? ""), isPublic: true  },
      { script: problem.pythonTest3, expected: String(problem.expectedTest3 ?? ""), isPublic: true  },
      { script: problem.pythonTest4, expected: String(problem.expectedTest4 ?? ""), isPublic: true  },
    ].filter(t => t.script?.trim())
    return tests.slice(0, count).map(t => {
      const raw    = t.script.replace(/\\n/g, "\n").replace(/\\t/g, "\t")
      const script = actualMethod ? patchTestScript(raw, actualMethod) : raw
      return { input: script, expected: t.expected, isPublic: true, isScript: true }
    })
  }

  // stdin-style fallback
  const pub = { input: problem.input ?? "", expected: problem.output ?? "", isPublic: true }
  return Array.from({ length: count }, () => ({ ...pub }))
}

// ── POST handler ──────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { code, language = "Python", problem, mode = "run" } = await req.json()
    if (!code?.trim()) return NextResponse.json({ error: "No code provided" },    { status: 400 })
    if (!problem)      return NextResponse.json({ error: "No problem provided" }, { status: 400 })

    const count     = mode === "run" ? 2 : 5  // run=2 public cases, submit=all 5
    const testCases = buildTestCases(problem, count, language, code)
    const timeout   = LANG_TIMEOUT[language] ?? 5000

    const results = []
    for (const tc of testCases) {
      let output = "", error = "", runtimeMs = 0, tle = false

      try {
        // Script mode (legacy): student code + test harness appended
        const codeToRun = (tc as any).isScript
          ? `${code}\n\n# -- test harness --\n${tc.input}`
          : code
        const stdin = (tc as any).isScript ? "" : tc.input
        console.log("[run-code] tc", testCases.indexOf(tc), "stdin:", JSON.stringify(stdin?.slice(0,30)), "lang:", language)
        ;({ output, error, runtimeMs, tle } = await executeCode(codeToRun, language, stdin, timeout))
      } catch (e: any) {
        error = e.message ?? "Execution error"
      }

      // Clean up Python tracebacks — strip file paths, show only the error type + message
      const cleanError = (err: string) => {
        if (!err) return err
        // Extract just the last meaningful line: "EOFError: EOF when reading a line"
        const lines = err.split("\n").map(l => l.trim()).filter(Boolean)
        // Find the actual error line (last non-empty line or line with "Error:")
        const errorLine = lines.findLast(l => /^(\w+Error|Exception|SyntaxError|ValueError|TypeError|NameError|IndexError|KeyError|AttributeError|RuntimeError|RecursionError|ZeroDivisionError|MemoryError|TimeoutError|OverflowError|AssertionError|NotImplementedError|OSError|ImportError)/.test(l))
        if (errorLine) return errorLine
        // Fallback: return last line
        return lines[lines.length - 1] ?? err
      }

      const raw         = output.trim()
      // If stdout contains a Python traceback, treat it as an error
      const hasTraceback = raw.startsWith("Traceback") || raw.startsWith("Error:") || /^\w+Error:/.test(raw)
      const actual      = hasTraceback ? "" : raw
      const effectiveErr = cleanError(error || (hasTraceback ? raw : ""))
      const expected    = tc.expected.trim()
      const hasExpected = expected !== ""
      const isErr       = (!!effectiveErr) && !tle
      const normalize   = (s: string) =>
        s.replace(/\r\n/g, "\n").toLowerCase().replace(/\s+/g, " ").trim()

      const passed = tle || isErr
        ? false
        : hasExpected
          ? normalize(actual) === normalize(expected)
          : !isErr

      results.push({
        input:          tc.input,
        expectedOutput: tc.expected || "(hidden)",
        actualOutput:   tle ? "Time Limit Exceeded" : isErr ? "" : actual,
        passed,
        isPublic:       tc.isPublic,
        runtimeMs,
        tle,
        error:          effectiveErr || undefined,
      })
    }

    const passedCount  = results.filter(r => r.passed).length
    const total        = results.length
    const allPassed    = passedCount === total
    const maxRuntime   = Math.max(...results.map(r => r.runtimeMs ?? 0))

    return NextResponse.json({
      success:     true,
      results,
      passed:      passedCount,
      total,
      allPassed,
      publicPassed: results[0]?.passed ?? false,
      mode,
      runtimeMs:   maxRuntime,
      timeLimit:   timeout,
      language,
      summary:     allPassed ? `${total}/${total} passed ✓` : `${passedCount}/${total} passed`,
    })

  } catch (err: any) {
    console.error("run-code error:", err)
    return NextResponse.json({ error: err.message ?? "Failed to run code" }, { status: 500 })
  }
}
