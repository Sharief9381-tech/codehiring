/**
 * POST /api/student/problem-detail
 * Returns problem data. Flow:
 * 1. Check static problem-bank - if fully detailed (has testCases), return instantly
 * 2. Check MongoDB cache - if cached full version exists, return it
 * 3. Generate via Groq/OpenAI, cache in MongoDB, return
 *
 * This means stub problems auto-generate the first time any student opens them,
 * then are cached forever - no manual work needed.
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDatabase } from "@/lib/database"
import { TOPIC_QUESTIONS } from "@/lib/topic-questions"
import { getProblem } from "@/lib/problem-bank"

// Build a flat map of problemId -> { title, topic, difficulty }
const PROBLEM_MAP: Record<string, { title: string; topic: string; difficulty: string }> = {}
for (const topic of TOPIC_QUESTIONS) {
  for (const q of topic.questions) {
    PROBLEM_MAP[q.id] = { title: q.title, topic: topic.label, difficulty: q.difficulty }
  }
}

// -- AI generation -------------------------------------------------------------
async function generateProblem(title: string, difficulty: string): Promise<any> {
  const groqKey   = process.env.GROQ_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY

  const prompt = `Generate a complete LeetCode-style coding problem for "${title}" (${difficulty} difficulty).
Return ONLY valid JSON (no markdown):
{
  "desc": "2-3 sentence description with backtick inline code",
  "inputFormat": "A clear 1-2 sentence description of the input format. E.g. 'The first line contains an integer n. The second line contains n space-separated integers representing the array.'",
  "outputFormat": "A clear 1 sentence description of the output. E.g. 'Print a single integer representing the answer.' or 'Return the indices as a list of two integers.'",
  "examples": [
    {"input": "readable input like nums=[1,2,3]", "output": "expected output", "explanation": "brief one sentence"},
    {"input": "second input", "output": "second output"}
  ],
  "constraints": ["1 <= n <= 10^5", "second constraint", "Time limit: 2s"],
  "functionSignature": "def methodName(self, param: Type) -> ReturnType:",
  "pythonStarter": "from typing import List, Optional\\n\\nclass Solution:\\n    def methodName(self, param: Type) -> ReturnType:\\n        pass",
  "jsStarter": "var methodName = function(param) {\\n    \\n};",
  "tsStarter": "function methodName(param: Type): ReturnType {\\n    \\n};",
  "javaStarter": "class Solution {\\n    public ReturnType methodName(Type param) {\\n        \\n    }\\n}",
  "cppStarter": "class Solution {\\npublic:\\n    ReturnType methodName(Type param) {\\n        \\n    }\\n};",
  "testCases": [
    {"script": "sol = Solution()\\nprint(sol.methodName(arg1))", "expected": "out1", "isPublic": true},
    {"script": "sol = Solution()\\nprint(sol.methodName(arg2))", "expected": "out2", "isPublic": true},
    {"script": "sol = Solution()\\nprint(sol.methodName(arg3))", "expected": "out3", "isPublic": false},
    {"script": "sol = Solution()\\nprint(sol.methodName(arg4))", "expected": "out4", "isPublic": false}
  ]
}
Use real concrete values in testCases. No backslashes inside expected strings.`

  const call = async (key: string, url: string, model: string) => {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], temperature: 0.2, max_tokens: 1000 }),
      signal: AbortSignal.timeout(20000),
    })
    if (!r.ok) throw new Error(`${r.status}`)
    const d = await r.json()
    let raw = d.choices?.[0]?.message?.content?.trim() ?? ""
    raw = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
    const p = JSON.parse(raw)
    // Unescape \\n -> real newlines
    for (const k of ["pythonStarter","jsStarter","tsStarter","javaStarter","cppStarter"]) {
      if (typeof p[k] === "string") p[k] = p[k].replace(/\\n/g, "\n").replace(/\\t/g, "    ")
    }
    if (p.testCases) {
      p.testCases = p.testCases.map((tc: any) => ({
        ...tc,
        script: String(tc.script).replace(/\\n/g, "\n"),
        expected: String(tc.expected),
      }))
    }
    return p
  }

  let data: any = null
  if (groqKey) {
    try { data = await call(groqKey, "https://api.groq.com/openai/v1/chat/completions", "llama-3.3-70b-versatile") } catch {}
  }
  if (!data && openaiKey) {
    try { data = await call(openaiKey, "https://api.openai.com/v1/chat/completions", "gpt-4o-mini") } catch {}
  }
  return data
}

// -- Convert static bank entry + AI data to wire format -----------------------
function bankToWire(sp: any, title: string, difficulty: string) {
  return {
    title,
    difficulty,
    badge: difficulty,
    desc:          sp.desc          ?? `Solve the ${title} problem.`,
    inputFormat:   sp.inputFormat   ?? (sp.functionSignature ? `Function signature: ${sp.functionSignature}` : ""),
    outputFormat:  sp.outputFormat  ?? "",
    constraints:   sp.constraints   ?? [],
    input:         sp.examples?.[0]?.input  ?? "",
    output:        sp.examples?.[0]?.output ?? "",
    explain:       sp.examples?.[0]?.explanation ?? "",
    input2:        sp.examples?.[1]?.input  ?? "",
    output2:       sp.examples?.[1]?.output ?? "",
    examples:      sp.examples      ?? [],
    starters:      sp.starters      ?? {},
    // Test cases for run-code
    pythonTest1:   sp.testCases?.[0]?.script   ?? "",
    expectedTest1: sp.testCases?.[0]?.expected ?? "",
    pythonTest2:   sp.testCases?.[1]?.script   ?? "",
    expectedTest2: sp.testCases?.[1]?.expected ?? "",
    pythonTest3:   sp.testCases?.[2]?.script   ?? "",
    expectedTest3: sp.testCases?.[2]?.expected ?? "",
    pythonTest4:   sp.testCases?.[3]?.script   ?? "",
    expectedTest4: sp.testCases?.[3]?.expected ?? "",
    static: true,
  }
}

// -- POST handler --------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const body = await req.json()
    let title      = body.title as string | undefined
    let difficulty = (body.difficulty as string) ?? "Medium"

    if (!title && body.problemId) {
      const meta = PROBLEM_MAP[body.problemId]
      if (meta) {
        title      = meta.title
        difficulty = meta.difficulty
      } else if (body.problemId.startsWith("daily-")) {
        // Synthetic daily challenge ID - convert back to title
        title = body.problemId
          .replace(/^daily-/, "")
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c: string) => c.toUpperCase())
        difficulty = body.difficulty ?? "Medium"
      } else {
        return NextResponse.json({ error: "Unknown problemId" }, { status: 404 })
      }
    }
    if (!title) return NextResponse.json({ error: "title or problemId required" }, { status: 400 })

    // -- 1. Check static bank --------------------------------------------------
    const sp = getProblem(title)
    if (sp && sp.testCases && sp.testCases.length > 0) {
      // Fully detailed static entry - return immediately
      return NextResponse.json({ problem: bankToWire(sp, title, difficulty), fromCache: false, source: "static" })
    }

    // -- 2. Check MongoDB cache ------------------------------------------------
    const db = await getDatabase()
    const cacheKey = title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    const cached = await db.collection("problem_details_v3").findOne({ cacheKey })
    if (cached?.problem?.pythonTest1) {
      return NextResponse.json({ problem: cached.problem, fromCache: true, source: "db" })
    }

    // -- 3. Generate via AI ----------------------------------------------------
    const aiData = await generateProblem(title, difficulty)

    if (!aiData) {
      // AI unavailable - return stub with whatever static data we have
      const stubProblem = sp ? bankToWire(sp, title, difficulty) : {
        title, difficulty, badge: difficulty,
        desc: `Solve the ${title} problem.`,
        inputFormat: "", outputFormat: "", constraints: [],
        input: "", output: "", explain: "", input2: "", output2: "",
        examples: [], starters: {},
        pythonTest1: "", expectedTest1: "",
        pythonTest2: "", expectedTest2: "",
        pythonTest3: "", expectedTest3: "",
        pythonTest4: "", expectedTest4: "",
        static: false,
      }
      return NextResponse.json({ problem: stubProblem, fromCache: false, source: "stub" })
    }

    // Merge AI data with any existing static data
    const merged = {
      title, difficulty, badge: difficulty,
      desc:          aiData.desc          ?? sp?.desc ?? `Solve the ${title} problem.`,
      inputFormat:   aiData.inputFormat   ?? (aiData.functionSignature ? `Function signature: ${aiData.functionSignature}` : ""),
      outputFormat:  aiData.outputFormat  ?? aiData.outputDescription ?? "",
      constraints:   aiData.constraints   ?? sp?.constraints ?? [],
      input:         aiData.examples?.[0]?.input  ?? sp?.examples?.[0]?.input  ?? "",
      output:        aiData.examples?.[0]?.output ?? sp?.examples?.[0]?.output ?? "",
      explain:       aiData.examples?.[0]?.explanation ?? "",
      input2:        aiData.examples?.[1]?.input  ?? "",
      output2:       aiData.examples?.[1]?.output ?? "",
      examples:      aiData.examples ?? [],
      starters: {
        Python:     aiData.pythonStarter ?? sp?.starters?.Python     ?? "class Solution:\n    def solve(self):\n        pass\n",
        JavaScript: aiData.jsStarter     ?? sp?.starters?.JavaScript ?? "var solve = function() {\n    \n};\n",
        TypeScript: aiData.tsStarter     ?? sp?.starters?.TypeScript ?? "function solve(): void {\n};\n",
        Java:       aiData.javaStarter   ?? sp?.starters?.Java       ?? "class Solution {\n    public void solve() {}\n}\n",
        "C++":      aiData.cppStarter    ?? sp?.starters?.["C++"]    ?? "class Solution {\npublic:\n    void solve() {}\n};\n",
      },
      pythonTest1:   aiData.testCases?.[0]?.script   ?? "",
      expectedTest1: aiData.testCases?.[0]?.expected ?? "",
      pythonTest2:   aiData.testCases?.[1]?.script   ?? "",
      expectedTest2: aiData.testCases?.[1]?.expected ?? "",
      pythonTest3:   aiData.testCases?.[2]?.script   ?? "",
      expectedTest3: aiData.testCases?.[2]?.expected ?? "",
      pythonTest4:   aiData.testCases?.[3]?.script   ?? "",
      expectedTest4: aiData.testCases?.[3]?.expected ?? "",
      static: false,
    }

    // Cache in MongoDB so next request is instant
    await db.collection("problem_details_v3").updateOne(
      { cacheKey },
      { $set: { cacheKey, problem: merged, generatedAt: new Date() } },
      { upsert: true }
    )

    return NextResponse.json({ problem: merged, fromCache: false, source: "ai" })

  } catch (err: any) {
    console.error("problem-detail error:", err)
    return NextResponse.json({ error: "Failed to load problem" }, { status: 500 })
  }
}
