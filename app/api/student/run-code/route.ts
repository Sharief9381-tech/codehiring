/**
 * POST /api/student/run-code
 * Execution chain (tries in order, falls back automatically):
 *
 *  1. Our Docker/isolate executor (EXECUTOR_URL) — fastest, fully sandboxed
 *     Local dev: runs in WSL2. Production: deploy code-executor/ to any Linux VPS.
 *
 *  2. Piston API (https://emkc.org/api/v2/piston) — FREE, no API key needed,
 *     supports 30+ languages. Works on Vercel with zero config.
 *
 *  3. Judge0 via RapidAPI (JUDGE0_RAPIDAPI_KEY) — backup, free tier 50 req/day
 *
 * For Vercel deployments: Piston handles all execution automatically.
 * Set EXECUTOR_URL in Vercel env vars only if you have a dedicated VPS.
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

// -- Language-aware time limits (ms) ------------------------------------------
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

// ── 1. Our own Docker/isolate executor ───────────────────────────────────────
let _resolvedExecutorUrl: string | null = null

async function executeViaDocker(code: string, language: string, stdin: string, timeoutMs: number) {
  const configured = process.env.EXECUTOR_URL?.trim()
  if (!configured) throw new Error("EXECUTOR_URL not set")

  // Try configured URL; on Windows dev auto-detect WSL2 IP as fallback
  let executorUrl = _resolvedExecutorUrl
  if (!executorUrl) {
    try {
      const r = await fetch(`${configured}/health`, { signal: AbortSignal.timeout(2000) })
      if (r.ok) { _resolvedExecutorUrl = configured; executorUrl = configured }
    } catch {}
  }
  if (!executorUrl) {
    // Auto-detect WSL2 IP (dev-only fallback)
    try {
      const { exec } = await import("child_process")
      const { promisify } = await import("util")
      const { stdout } = await promisify(exec)(
        "wsl.exe -e bash -c \"ip addr show eth0 | grep 'inet ' | awk '{print $2}' | cut -d/ -f1\"",
        { timeout: 3000 }
      )
      const wslIp = stdout.trim()
      if (wslIp) {
        const port = new URL(configured).port || "4000"
        const wslUrl = `http://${wslIp}:${port}`
        const r2 = await fetch(`${wslUrl}/health`, { signal: AbortSignal.timeout(2000) })
        if (r2.ok) { _resolvedExecutorUrl = wslUrl; executorUrl = wslUrl }
      }
    } catch {}
  }
  if (!executorUrl) throw new Error(`Executor unreachable: ${configured}`)

  const secret = process.env.EXECUTOR_SECRET ?? "codehiring-executor-secret"
  const langKey = LANG_KEY[language] ?? language.toLowerCase()
  const res = await fetch(`${executorUrl}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${secret}` },
    body: JSON.stringify({ code, language: langKey, stdin, timeoutMs }),
    signal: AbortSignal.timeout(timeoutMs + 10000),
  })
  if (!res.ok) throw new Error(`Executor ${res.status}: ${await res.text().catch(() => "")}`)
  const d = await res.json()
  return { output: d.output ?? "", error: d.error ?? "", runtimeMs: d.runtimeMs ?? 0, tle: d.tle ?? false }
}

// ── 2. Piston API — free, no key, works on Vercel ────────────────────────────
// https://github.com/engineer-man/piston
// Public instance: https://emkc.org/api/v2/piston
const PISTON_LANGUAGES: Record<string, { language: string; version: string }> = {
  python:     { language: "python",     version: "3.10.0"  },
  javascript: { language: "javascript", version: "18.15.0" },
  typescript: { language: "typescript", version: "5.0.3"   },
  java:       { language: "java",       version: "15.0.2"  },
  "c++":      { language: "c++",        version: "10.2.0"  },
  c:          { language: "c",          version: "10.2.0"  },
  "c#":       { language: "csharp",     version: "6.12.0"  },
  go:         { language: "go",         version: "1.16.2"  },
  kotlin:     { language: "kotlin",     version: "1.8.20"  },
  swift:      { language: "swift",      version: "5.3.3"   },
}

// Filename mapping (Piston needs correct filename per language)
const PISTON_FILENAMES: Record<string, string> = {
  python: "main.py", javascript: "main.js", typescript: "main.ts",
  java: "Main.java", "c++": "main.cpp", c: "main.c",
  csharp: "main.cs", go: "main.go", kotlin: "main.kt", swift: "main.swift",
}

async function executeViaPiston(code: string, language: string, stdin: string, timeoutMs: number) {
  const langKey = language.toLowerCase()
  const pistonLang = PISTON_LANGUAGES[langKey]
  if (!pistonLang) throw new Error(`Piston: unsupported language "${language}"`)

  const filename = PISTON_FILENAMES[pistonLang.language] ?? "main.py"

  const start = Date.now()
  const res = await fetch("https://emkc.org/api/v2/piston/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: pistonLang.language,
      version:  pistonLang.version,
      files:    [{ name: filename, content: code }],
      stdin:    stdin || "",
      run_timeout: Math.min(timeoutMs, 10000),
      compile_timeout: 15000,
    }),
    signal: AbortSignal.timeout(timeoutMs + 15000),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`Piston error ${res.status}: ${body.slice(0, 200)}`)
  }

  const data = await res.json()
  const runtimeMs = Date.now() - start

  // Piston response: { run: { stdout, stderr, code, signal }, compile?: { stdout, stderr } }
  const compileErr = data.compile?.stderr?.trim() || data.compile?.stdout?.trim() || ""
  const stdout     = data.run?.stdout?.trim()  ?? ""
  const stderr     = data.run?.stderr?.trim()  ?? ""
  const exitCode   = data.run?.code   ?? 0
  const signal     = data.run?.signal ?? null

  // Detect TLE (Piston kills with SIGKILL on timeout)
  const tle = signal === "SIGKILL" || signal === "SIGTERM"

  let error = ""
  if (compileErr) {
    error = `Compilation Error:\n${compileErr}`
  } else if (tle) {
    error = "Time Limit Exceeded"
  } else if (stderr && exitCode !== 0) {
    error = stderr
  }

  return { output: stdout, error, runtimeMs, tle }
}

// ── 3. Judge0 via RapidAPI ────────────────────────────────────────────────────
const JUDGE0_LANGUAGE_IDS: Record<string, number> = {
  python: 71, javascript: 63, typescript: 74,
  java: 62, "c++": 54, c: 50, "c#": 51, go: 60, kotlin: 78, swift: 83,
}

async function executeViaJudge0(code: string, language: string, stdin: string, timeoutMs: number) {
  const apiKey = process.env.JUDGE0_RAPIDAPI_KEY
  if (!apiKey) throw new Error("Judge0 API key not configured")

  const langKey = language.toLowerCase()
  const langId  = JUDGE0_LANGUAGE_IDS[langKey] ?? 71

  const res = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    },
    body: JSON.stringify({
      source_code: code, language_id: langId, stdin: stdin || "",
      cpu_time_limit: Math.min(timeoutMs / 1000, 5), memory_limit: 128000,
    }),
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`Judge0 error: ${res.status}`)
  const data = await res.json()

  return {
    output:    data.stdout?.trim() ?? "",
    error:     data.stderr?.trim() || data.compile_output?.trim() || "",
    runtimeMs: data.time ? Math.round(Number(data.time) * 1000) : 0,
    tle:       data.status?.id === 5,
  }
}

// ── Main execution dispatcher — tries each provider in order ─────────────────
async function executeCode(code: string, language: string, stdin: string, timeoutMs: number) {
  const errors: string[] = []

  // 1. Try our own Docker executor if EXECUTOR_URL is set
  if (process.env.EXECUTOR_URL?.trim()) {
    try {
      return await executeViaDocker(code, language, stdin, timeoutMs)
    } catch (e: any) {
      errors.push(`Docker: ${e.message?.slice(0, 80)}`)
      console.warn("[run-code] Docker executor failed:", e.message?.slice(0, 80))
    }
  }

  // 2. Try Piston (free, no key, always available on Vercel)
  try {
    console.log("[run-code] Using Piston API")
    return await executeViaPiston(code, language, stdin, timeoutMs)
  } catch (e: any) {
    errors.push(`Piston: ${e.message?.slice(0, 80)}`)
    console.warn("[run-code] Piston failed:", e.message?.slice(0, 80))
  }

  // 3. Try Judge0 as last resort
  if (process.env.JUDGE0_RAPIDAPI_KEY) {
    try {
      console.log("[run-code] Using Judge0 API")
      return await executeViaJudge0(code, language, stdin, timeoutMs)
    } catch (e: any) {
      errors.push(`Judge0: ${e.message?.slice(0, 80)}`)
      console.warn("[run-code] Judge0 failed:", e.message?.slice(0, 80))
    }
  }

  throw new Error(`All executors failed: ${errors.join(" | ")}`)
}

// -- Extract actual method name from student's Python code --------------------
// The AI generates tests calling e.g. sol.containsDuplicate(...)
// but the student's starter has def solve(self, ...) - we need to patch the call.
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

// -- Build test cases -----------------------------------------------------------
// Function-style: AI provides complete test scripts (pythonTest1..4) + expected outputs
// stdin-style: uses input/input2/input3/input4 + output/output2/output3/output4
function buildTestCases(
  problem: any,
  count: number,
  language: string,
  studentCode?: string
): Array<{ input: string; expected: string; isPublic: boolean; isScript?: boolean }> {
  // Function-style (LeetCode) - use AI-generated test scripts
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
      // Unescape \\n -> real newlines (AI sometimes returns escaped strings)
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

  // Fallback: no pythonTest scripts available yet - run code with empty stdin and pass if no error
  const pub = { input: problem.input ?? "", expected: problem.output ?? "", isPublic: true }
  const cases = [pub, pub, pub, pub]
  return cases.slice(0, count).map((c, i) => ({ ...c, isPublic: i < 2 }))
}

// -- POST handler --------------------------------------------------------------
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
          ? `${code}\n\n# -- test harness --\n${tc.input}`
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
      summary:      allPassed ? `${total}/${total} passed v` : `${passedCount}/${total} passed`,
    })

  } catch (err: any) {
    console.error("run-code error:", err)
    return NextResponse.json({ error: err.message ?? "Failed to run code" }, { status: 500 })
  }
}
