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

const LANG_KEY: Record<string, string> = {
  Python:"python",JavaScript:"javascript",TypeScript:"typescript",
  Java:"java","C++":"c++",C:"c","C#":"c#",Go:"go",Kotlin:"kotlin",Swift:"swift",
}

// ── Resolve executor URL (handles localhost → WSL2 IP fallback) ───────────────
// On Windows dev, EXECUTOR_URL=localhost:4000 fails because the executor runs in WSL2.
// We try the configured URL first, then fall back to auto-detecting the WSL2 IP.
let _resolvedExecutorUrl: string | null = null

// Reset cache on module reload (new URL in env)
const _configuredUrl = process.env.EXECUTOR_URL ?? ""

async function resolveExecutorUrl(): Promise<string> {
  const configured = process.env.EXECUTOR_URL ?? ""
  if (!configured) throw new Error("EXECUTOR_URL not set")

  // Already resolved and cached
  if (_resolvedExecutorUrl) return _resolvedExecutorUrl

  // Try configured URL first
  try {
    const r = await fetch(`${configured}/health`, { signal: AbortSignal.timeout(2000) })
    if (r.ok) { _resolvedExecutorUrl = configured; return configured }
  } catch {}

  // Configured URL failed — try to find WSL2 IP automatically
  // WSL2 gateway is reachable at the Windows host IP on the virtual switch
  // We check common WSL2 subnet ranges (172.16–31.x.x)
  const { exec } = await import("child_process")
  const { promisify } = await import("util")
  const execAsync = promisify(exec)

  try {
    // Get WSL2 IP from within WSL
    const { stdout } = await execAsync(
      "wsl.exe -e bash -c \"ip addr show eth0 | grep 'inet ' | awk '{print $2}' | cut -d/ -f1\"",
      { timeout: 3000 }
    )
    const wslIp = stdout.trim()
    if (wslIp) {
      const port = new URL(configured).port || "4000"
      const wslUrl = `http://${wslIp}:${port}`
      try {
        const r2 = await fetch(`${wslUrl}/health`, { signal: AbortSignal.timeout(2000) })
        if (r2.ok) {
          console.log(`[executor] WSL2 fallback: using ${wslUrl}`)
          _resolvedExecutorUrl = wslUrl
          return wslUrl
        }
      } catch {}
    }
  } catch {}

  throw new Error(`Executor unreachable. Configured: ${configured}. Is the executor running in WSL2? Run: node /path/to/code-executor/server.mjs`)
}

// ── Execute code ──────────────────────────────────────────────────────────────
async function executeCode(code: string, language: string, stdin: string, timeoutMs: number) {
  const executorUrl    = await resolveExecutorUrl()
  const executorSecret = process.env.EXECUTOR_SECRET ?? "codehiring-executor-secret"
  const langKey = LANG_KEY[language] ?? language.toLowerCase()
  const res = await fetch(`${executorUrl}/execute`, {
    method: "POST",
    headers: { "Content-Type":"application/json", "Authorization":`Bearer ${executorSecret}` },
    body: JSON.stringify({ code, language: langKey, stdin, timeoutMs }),
    signal: AbortSignal.timeout(timeoutMs + 10000),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`Executor error ${res.status}: ${body}`)
  }
  const data = await res.json()
  return { output: data.output ?? "", error: data.error ?? "", runtimeMs: data.runtimeMs ?? 0, tle: data.tle ?? false }
}

// ── Extract actual method name from student's Python code ────────────────────
// The AI generates tests calling e.g. sol.containsDuplicate(...)
// but the student's starter has def solve(self, ...) — we need to patch the call.
function extractPythonMethodName(code: string): string | null {
  // Match: def methodName(self, ...)  inside a class
  const match = code.match(/class\s+Solution[\s\S]*?def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(self/)
  return match?.[1] ?? null
}

// Patch test script: replace sol.anyMethodName(...) with sol.actualMethod(...)
function patchTestScript(script: string, actualMethod: string): string {
  // Replace sol.<anything>( with sol.<actualMethod>(
  return script.replace(/\bsol\s*\.\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\(/g, `sol.${actualMethod}(`)
}

// ── Build test cases ───────────────────────────────────────────────────────────
// Function-style: AI provides complete test scripts (pythonTest1..4) + expected outputs
// stdin-style: uses input/input2/input3/input4 + output/output2/output3/output4
function buildTestCases(
  problem: any,
  count: number,
  language: string,
  studentCode?: string
): Array<{ input: string; expected: string; isPublic: boolean; isScript?: boolean }> {
  // Function-style (LeetCode) — use AI-generated test scripts
  if (problem.pythonTest1 && language === "Python") {
    // Extract actual method name from student code to patch test scripts
    const actualMethod = studentCode ? extractPythonMethodName(studentCode) : null

    const tests = [
      { script: problem.pythonTest1, expected: String(problem.expectedTest1 ?? ""), isPublic: true },
      { script: problem.pythonTest2, expected: String(problem.expectedTest2 ?? ""), isPublic: true },
      { script: problem.pythonTest3, expected: String(problem.expectedTest3 ?? ""), isPublic: false },
      { script: problem.pythonTest4, expected: String(problem.expectedTest4 ?? ""), isPublic: false },
    ].filter(t => t.script && t.script.trim())

    return tests.slice(0, count).map(t => {
      // Unescape \\n → real newlines (AI sometimes returns escaped strings)
      const rawScript = t.script.replace(/\\n/g, "\n").replace(/\\t/g, "\t")
      // Patch method name mismatch if we found one
      const script = actualMethod ? patchTestScript(rawScript, actualMethod) : rawScript
      return {
        input:    script,
        expected: t.expected,
        isPublic: t.isPublic,
        isScript: true,
      }
    })
  }

  // Fallback: no pythonTest scripts available yet — run code with empty stdin and pass if no error
  const pub = { input: problem.input ?? "", expected: problem.output ?? "", isPublic: true }
  const cases = [pub, pub, pub, pub]
  return cases.slice(0, count).map((c, i) => ({ ...c, isPublic: i < 2 }))
}

// ── POST handler ──────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { code, language = "Python", problem, mode = "run" } = await req.json()
    if (!code?.trim()) return NextResponse.json({ error: "No code provided" }, { status: 400 })
    if (!problem)      return NextResponse.json({ error: "No problem provided" }, { status: 400 })

    const count     = mode === "run" ? 2 : 4
    const testCases = buildTestCases(problem, count, language, code)
    const timeout   = LANG_TIMEOUT[language] ?? 5000

    const results = []
    for (const tc of testCases) {
      let output = "", error = "", runtimeMs = 0, tle = false

      try {
        // Script mode: student code + test harness appended
        const codeToRun = (tc as any).isScript
          ? `${code}\n\n# ── test harness ──\n${tc.input}`
          : code
        const stdin = (tc as any).isScript ? "" : tc.input
        console.log("[run-code] codeToRun preview:\n", codeToRun.slice(0, 400))
        ;({ output, error, runtimeMs, tle } = await executeCode(codeToRun, language, stdin, timeout))
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
