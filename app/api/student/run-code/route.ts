/**
 * POST /api/student/run-code
 * REAL code execution using Piston API (free, no auth, sandboxed).
 * mode: "run" = public test only, "submit" = all 6 tests
 * 
 * Flow:
 * 1. Generate test cases using AI (once)
 * 2. Execute code against each test case using Piston (real execution)
 * 3. Compare actual output with expected
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

// Piston API — free, open-source, sandboxed code runner
const PISTON_API = "https://emkc.org/api/v2/piston/execute"

// Map language names to Piston language + version
const PISTON_LANG: Record<string, { language: string; version: string }> = {
  Python:     { language: "python",     version: "3.10.0"  },
  JavaScript: { language: "javascript", version: "18.15.0" },
  TypeScript: { language: "typescript", version: "5.0.3"   },
  Java:       { language: "java",       version: "15.0.2"  },
  "C++":      { language: "c++",        version: "10.2.0"  },
  C:          { language: "c",          version: "10.2.0"  },
  "C#":       { language: "csharp",     version: "6.12.0"  },
  Go:         { language: "go",         version: "1.16.2"  },
  Kotlin:     { language: "kotlin",     version: "1.8.20"  },
  Swift:      { language: "swift",      version: "5.3.3"   },
}

// Execute code with stdin using Piston
async function executeCode(code: string, lang: string, stdin: string): Promise<{ output: string; error: string }> {
  const pistonLang = PISTON_LANG[lang]
  if (!pistonLang) return { output: "", error: `Unsupported language: ${lang}` }

  try {
    const res = await fetch(PISTON_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: pistonLang.language,
        version:  pistonLang.version,
        files:    [{ content: code }],
        stdin:    stdin,
        run_timeout: 5000,  // 5 second timeout
        compile_timeout: 10000,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return { output: "", error: `Execution failed: ${res.status} ${err.slice(0, 100)}` }
    }

    const data = await res.json()
    const run = data.run ?? {}
    const output = (run.stdout ?? "").trim()
    const error  = (run.stderr ?? "").trim() || (run.code !== 0 ? `Exit code ${run.code}` : "")
    return { output, error }
  } catch (e: any) {
    return { output: "", error: e.message ?? "Network error" }
  }
}

// Use AI to generate test cases (inputs + expected outputs)
async function generateTestCases(problem: any, lang: string, count: number): Promise<Array<{ input: string; expected: string; isPublic: boolean }>> {
  const groqKey   = process.env.GROQ_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY

  const prompt = `Generate exactly ${count} test case(s) for this coding problem.

Problem: ${problem.title}
Description: ${problem.desc}
Public example: Input="${problem.input}" → Output="${problem.output}"

Rules:
- Test 1: Use exactly the public example
${count > 1 ? "- Tests 2+: Edge cases (empty string, single char, all same chars, numbers only, etc.)" : ""}
- Input should be what the program reads from stdin
- Expected output should be exact (trimmed, no trailing newline)

Return ONLY valid JSON array:
[{"input":"racecar","expected":"true","isPublic":true}${count > 1 ? ',{"input":"hello","expected":"false","isPublic":false}' : ""}]`

  const call = async (key: string, url: string, model: string) => {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 400,
      }),
    })
    if (!r.ok) throw new Error(`${r.status}`)
    const d = await r.json()
    const raw = d.choices?.[0]?.message?.content?.trim() ?? ""
    return raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
  }

  let raw = ""
  if (openaiKey) { try { raw = await call(openaiKey, "https://api.openai.com/v1/chat/completions", "gpt-4o-mini") } catch {} }
  if (!raw && groqKey) { try { raw = await call(groqKey, "https://api.groq.com/openai/v1/chat/completions", "llama-3.3-70b-versatile") } catch {} }

  if (!raw) throw new Error("AI unavailable for test case generation")
  return JSON.parse(raw)
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { code, language = "Python", problem, mode = "run" } = await req.json()
    if (!code?.trim()) return NextResponse.json({ error: "No code provided" }, { status: 400 })
    if (!problem)      return NextResponse.json({ error: "No problem provided" }, { status: 400 })

    const count = mode === "run" ? 1 : 6

    // Step 1: Generate test cases via AI
    let testCases: Array<{ input: string; expected: string; isPublic: boolean }>
    try {
      testCases = await generateTestCases(problem, language, count)
    } catch {
      // Fallback: use only the public example
      testCases = [{ input: problem.input ?? "", expected: problem.output ?? "", isPublic: true }]
    }

    // Ensure first is public
    if (testCases.length > 0) testCases[0].isPublic = true

    // Step 2: Execute code against each test case using Piston
    const results = await Promise.all(
      testCases.map(async (tc) => {
        const { output, error } = await executeCode(code, language, tc.input)
        const actualOutput = output.trim()
        const expectedOutput = tc.expected.trim()

        // Flexible comparison — case-insensitive for boolean outputs
        const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim()
        const passed = normalize(actualOutput) === normalize(expectedOutput)

        return {
          input:          tc.input,
          expectedOutput: tc.expected,
          actualOutput:   error ? `Error: ${error}` : actualOutput,
          passed,
          isPublic:       tc.isPublic,
          error:          error || undefined,
        }
      })
    )

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
