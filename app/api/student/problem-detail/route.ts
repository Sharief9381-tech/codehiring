/**
 * POST /api/student/problem-detail
 * Returns problem data. Flow:
 * 1. Check static problem-bank (instant, no AI needed)
 * 2. Check MongoDB cache
 * 3. Generate via Groq/OpenAI, cache in MongoDB, return
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
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY

  const prompt = `Generate a complete coding problem for: ${title} (${difficulty} difficulty).

FORMAT: stdin/stdout (no LeetCode function signatures — students write full programs).

RULES:
- Input is plain numbers only. No "nums =" or "[1,2,3]" notation.
- Arrays on one line space-separated. Multiple values on separate lines.
- Two Sum example: line1="2 7 11 15" (array), line2="9" (target) -> output="0 1"
- Single array example: line1="4 1 2 1 2" -> output="4"
- inputFormat: describe exactly how to read stdin
- outputFormat: describe exactly what to print

Return ONLY valid JSON (no markdown, no explanation):
{
  "desc": "Clear problem description using backticks for variable names like \`nums\`.",
  "inputFormat": "First line: n space-separated integers.",
  "outputFormat": "Print the answer on a single line.",
  "examples": [
    {"input": "4 1 2 1 2", "output": "4", "explanation": "4 appears only once"},
    {"input": "2 2 1", "output": "1", "explanation": "1 appears only once"}
  ],
  "constraints": ["1 <= n <= 3*10^4", "Each element appears twice except one"],
  "pythonStarter": "nums = list(map(int, input().split()))\\n# Write your solution here\\n",
  "jsStarter": "const nums = require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);\\n// Write your solution here\\n",
  "tsStarter": "const nums = require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);\\n// Write your solution here\\n",
  "javaStarter": "import java.util.*;\\npublic class Main {\\n    public static void main(String[] args) {\\n        Scanner sc = new Scanner(System.in);\\n        int[] nums = Arrays.stream(sc.nextLine().split(\\" \\")).mapToInt(Integer::parseInt).toArray();\\n        // Write your solution here\\n    }\\n}",
  "cppStarter": "#include<bits/stdc++.h>\\nusing namespace std;\\nint main(){\\n    int x; vector<int> nums;\\n    while(cin>>x) nums.push_back(x);\\n    // Write your solution here\\n    return 0;\\n}",
  "testCases": [
    {"stdin": "4 1 2 1 2", "expected": "4", "isPublic": true},
    {"stdin": "2 2 1", "expected": "1", "isPublic": true},
    {"stdin": "1", "expected": "1", "isPublic": false},
    {"stdin": "4 2 3 3 2", "expected": "4", "isPublic": false},
    {"stdin": "7 3 5 3 5 7 9", "expected": "9", "isPublic": false}
  ]
}

CRITICAL: Use the actual correct test cases for "${title}", not the Single Number examples above.
All stdin values must be plain numbers only.`

  const stripThink = (s: string) => s.replace(/<think>[\s\S]*?<\/think>/gi, "").trim()

  // Standard OpenAI-compatible call
  const callOpenAI = async (key: string, url: string, model: string) => {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
      body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], temperature: 0.2, max_tokens: 1400 }),
      signal: AbortSignal.timeout(25000),
    })
    if (!r.ok) throw new Error("HTTP " + r.status)
    const d = await r.json()
    let raw = stripThink(d.choices?.[0]?.message?.content?.trim() ?? "")
    raw = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
    return parseResult(raw)
  }

  // Gemini call
  const callGemini = async (key: string) => {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1400, temperature: 0.2 },
        }),
        signal: AbortSignal.timeout(25000),
      }
    )
    if (!r.ok) throw new Error("Gemini HTTP " + r.status)
    const d = await r.json()
    let raw = d.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ""
    raw = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
    return parseResult(raw)
  }

  const parseResult = (raw: string) => {
    const p = JSON.parse(raw)
    for (const k of ["pythonStarter","jsStarter","tsStarter","javaStarter","cppStarter"]) {
      if (typeof p[k] === "string") p[k] = p[k].replace(/\\n/g, "\n").replace(/\\t/g, "    ")
    }
    if (p.testCases) {
      p.testCases = p.testCases.map((tc: any) => ({
        stdin:    String(tc.stdin ?? "").replace(/\\n/g, "\n"),
        expected: String(tc.expected ?? ""),
        isPublic: tc.isPublic !== false,
      }))
    }
    return p
  }

  // Try in order: Gemini → OpenAI → Groq
  if (geminiKey) {
    try { return await callGemini(geminiKey) } catch (e) {
      console.error("[problem-detail] Gemini failed:", (e as Error).message)
    }
  }
  if (openaiKey) {
    try { return await callOpenAI(openaiKey, "https://api.openai.com/v1/chat/completions", "gpt-4o-mini") } catch (e) {
      console.error("[problem-detail] OpenAI failed:", (e as Error).message)
    }
  }
  if (groqKey) {
    try { return await callOpenAI(groqKey, "https://api.groq.com/openai/v1/chat/completions", "qwen/qwen3.6-27b") } catch (e) {
      console.error("[problem-detail] Groq failed:", (e as Error).message)
    }
  }
  return null
}

// -- Convert static bank entry to wire format ----------------------------------
function bankToWire(sp: any, title: string, difficulty: string) {
  const tc = (i: number) => sp.testCases?.[i]
  return {
    title,
    difficulty,
    badge: difficulty,
    desc:         sp.desc         ?? "Solve the " + title + " problem.",
    inputFormat:  sp.inputFormat  ?? "",
    outputFormat: sp.outputFormat ?? "",
    constraints:  sp.constraints  ?? [],
    examples:     sp.examples     ?? [],
    starters:     sp.starters     ?? {},
    stdin1:    tc(0)?.stdin ?? sp.examples?.[0]?.input ?? "",
    expected1: tc(0)?.expected ?? sp.examples?.[0]?.output ?? "",
    public1:   tc(0)?.isPublic !== false,
    stdin2:    tc(1)?.stdin ?? sp.examples?.[1]?.input ?? "",
    expected2: tc(1)?.expected ?? sp.examples?.[1]?.output ?? "",
    public2:   tc(1)?.isPublic !== false,
    stdin3:    tc(2)?.stdin ?? "",
    expected3: tc(2)?.expected ?? "",
    public3:   tc(2)?.isPublic === true,
    stdin4:    tc(3)?.stdin ?? "",
    expected4: tc(3)?.expected ?? "",
    public4:   tc(3)?.isPublic === true,
    stdin5:    tc(4)?.stdin ?? "",
    expected5: tc(4)?.expected ?? "",
    public5:   tc(4)?.isPublic === true,
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

    // -- 1. Static bank --------------------------------------------------------
    const sp = getProblem(title)
    if (sp?.testCases?.length) {
      return NextResponse.json({ problem: bankToWire(sp, title, difficulty), fromCache: false, source: "static" })
    }

    // -- 2. MongoDB cache ------------------------------------------------------
    const db = await getDatabase()
    const cacheKey = title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    const cached = await db.collection("problem_details_v8").findOne({ cacheKey })
    if (
      cached?.problem?.stdin1?.trim() &&
      cached?.problem?.inputFormat?.trim() &&
      cached?.problem?.outputFormat?.trim()
    ) {
      return NextResponse.json({ problem: cached.problem, fromCache: true, source: "db" })
    }

    // -- 3. AI generation ------------------------------------------------------
    const aiData = await generateProblem(title, difficulty)

    if (!aiData) {
      // Return a helpful stub so the editor at least shows something
      const stub = {
        title, difficulty, badge: difficulty,
        desc: `Given a ${difficulty.toLowerCase()} problem: ${title}. Read the input, compute the answer, and print it.`,
        inputFormat: "Read input from stdin as described in the problem.",
        outputFormat: "Print the answer on a single line.",
        constraints: [],
        examples: [],
        starters: {
          Python:     "# Read input\n# Write your solution\n# Print output\n",
          JavaScript: "const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');\n// Write your solution here\n",
          TypeScript: "const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');\n// Write your solution here\n",
          Java:       "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n    }\n}",
          "C++":      "#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n    // Write your solution here\n    return 0;\n}",
        },
        stdin1: "", expected1: "", public1: true,
        stdin2: "", expected2: "", public2: false,
        stdin3: "", expected3: "", public3: false,
        static: false,
      }
      return NextResponse.json({ problem: stub, fromCache: false, source: "stub" })
    }

    // -- Merge and cache -------------------------------------------------------
    const tc = (i: number) => aiData.testCases?.[i]
    const merged = {
      title, difficulty, badge: difficulty,
      desc:         aiData.desc         ?? sp?.desc ?? title,
      inputFormat:  aiData.inputFormat  ?? "",
      outputFormat: aiData.outputFormat ?? "",
      constraints:  aiData.constraints  ?? sp?.constraints ?? [],
      examples:     aiData.examples     ?? sp?.examples     ?? [],
      starters: {
        Python:     aiData.pythonStarter ?? "nums = list(map(int, input().split()))\n# Write your solution here\n",
        JavaScript: aiData.jsStarter     ?? "const nums = require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);\n// Write your solution here\n",
        TypeScript: aiData.tsStarter     ?? "const nums = require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);\n// Write your solution here\n",
        Java:       aiData.javaStarter   ?? "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n    }\n}",
        "C++":      aiData.cppStarter    ?? "#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n    // Write your solution here\n    return 0;\n}",
      },
      stdin1:    tc(0)?.stdin ?? aiData.examples?.[0]?.input ?? "",
      expected1: tc(0)?.expected ?? aiData.examples?.[0]?.output ?? "",
      public1:   tc(0)?.isPublic !== false,
      stdin2:    tc(1)?.stdin ?? aiData.examples?.[1]?.input ?? "",
      expected2: tc(1)?.expected ?? aiData.examples?.[1]?.output ?? "",
      public2:   tc(1)?.isPublic !== false,
      stdin3:    tc(2)?.stdin ?? "",
      expected3: tc(2)?.expected ?? "",
      public3:   tc(2)?.isPublic === true,
      stdin4:    tc(3)?.stdin ?? "",
      expected4: tc(3)?.expected ?? "",
      public4:   tc(3)?.isPublic === true,
      stdin5:    tc(4)?.stdin ?? "",
      expected5: tc(4)?.expected ?? "",
      public5:   tc(4)?.isPublic === true,
      static: false,
    }

    await db.collection("problem_details_v8").updateOne(
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
