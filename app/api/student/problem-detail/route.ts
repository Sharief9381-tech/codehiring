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

  const prompt = `Generate a complete coding problem for "${title}" (${difficulty} difficulty) that reads from STDIN.

IMPORTANT: The problem must use standard input/output (stdin/stdout), NOT function signatures or classes.
The student writes a complete program that reads input and prints output.

Return ONLY valid JSON (no markdown):
{
  "desc": "2-3 sentence description. Use backtick for variable names like \`n\` and \`nums\`.",
  "inputFormat": "Describe stdin format. E.g. 'The first line contains an integer n. The second line contains n space-separated integers.'",
  "outputFormat": "Describe stdout format. E.g. 'Print the answer on a single line.' or 'Print n space-separated integers.'",
  "examples": [
    {"input": "actual stdin value matching inputFormat, e.g. 7\\n3 5 -1 2 8 -1 7", "output": "actual stdout value matching outputFormat", "explanation": "brief explanation"},
    {"input": "second stdin", "output": "second stdout", "explanation": "brief"}
  ],
  "constraints": ["1 <= n <= 10^5", "other constraint"],
  "pythonStarter": "n = int(input())\\nnums = list(map(int, input().split()))\\n# Write your solution here\\n",
  "jsStarter": "const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\\\n');\\nconst n = parseInt(lines[0]);\\nconst nums = lines[1].split(' ').map(Number);\\n// Write your solution here\\n",
  "tsStarter": "const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\\\n');\\nconst n = parseInt(lines[0]);\\nconst nums = lines[1].split(' ').map(Number);\\n// Write your solution here\\n",
  "javaStarter": "import java.util.*;\\npublic class Main {\\n    public static void main(String[] args) {\\n        Scanner sc = new Scanner(System.in);\\n        int n = sc.nextInt();\\n        int[] nums = new int[n];\\n        for(int i=0;i<n;i++) nums[i]=sc.nextInt();\\n        // Write your solution here\\n    }\\n}",
  "cppStarter": "#include<bits/stdc++.h>\\nusing namespace std;\\nint main(){\\n    int n; cin>>n;\\n    vector<int> nums(n);\\n    for(int i=0;i<n;i++) cin>>nums[i];\\n    // Write your solution here\\n    return 0;\\n}",
  "testCases": [
    {"stdin": "actual stdin for test 1", "expected": "expected stdout for test 1"},
    {"stdin": "actual stdin for test 2", "expected": "expected stdout for test 2"},
    {"stdin": "actual stdin for test 3", "expected": "expected stdout for test 3"},
    {"stdin": "actual stdin for test 4", "expected": "expected stdout for test 4"}
  ]
}

Rules:
- testCases must have EXACTLY 4 entries with real concrete values
- stdin must match the inputFormat exactly
- expected must match the outputFormat exactly
- All test cases are visible to the student (no hidden cases)
- No backslashes inside expected strings
- Unescape newlines properly: use \\n for newlines in stdin strings`

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
        stdin:    String(tc.stdin ?? tc.script ?? "").replace(/\\n/g, "\n"),
        expected: String(tc.expected ?? ""),
        isPublic: true,  // all test cases are public — no hidden
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
  // Support both old pythonTest (script) format and new stdin format
  const tc = (i: number) => sp.testCases?.[i]
  return {
    title,
    difficulty,
    badge: difficulty,
    desc:          sp.desc          ?? `Solve the ${title} problem.`,
    inputFormat:   sp.inputFormat   ?? "",
    outputFormat:  sp.outputFormat  ?? "",
    constraints:   sp.constraints   ?? [],
    examples:      sp.examples      ?? [],
    starters:      sp.starters      ?? {},
    // Stdin-based test cases (new format) — all public
    stdin1:    tc(0)?.stdin    ?? tc(0)?.script   ?? sp.examples?.[0]?.input  ?? "",
    expected1: tc(0)?.expected ?? sp.examples?.[0]?.output ?? "",
    stdin2:    tc(1)?.stdin    ?? tc(1)?.script   ?? sp.examples?.[1]?.input  ?? "",
    expected2: tc(1)?.expected ?? sp.examples?.[1]?.output ?? "",
    stdin3:    tc(2)?.stdin    ?? tc(2)?.script   ?? "",
    expected3: tc(2)?.expected ?? "",
    stdin4:    tc(3)?.stdin    ?? tc(3)?.script   ?? "",
    expected4: tc(3)?.expected ?? "",
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
    const cached = await db.collection("problem_details_v4").findOne({ cacheKey })
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
    const tc = (i: number) => aiData.testCases?.[i]
    const merged = {
      title, difficulty, badge: difficulty,
      desc:          aiData.desc          ?? sp?.desc ?? `Solve the ${title} problem.`,
      inputFormat:   aiData.inputFormat   ?? "",
      outputFormat:  aiData.outputFormat  ?? aiData.outputDescription ?? "",
      constraints:   aiData.constraints   ?? sp?.constraints ?? [],
      examples:      aiData.examples ?? sp?.examples ?? [],
      starters: {
        Python:     aiData.pythonStarter ?? sp?.starters?.Python     ?? "n = int(input())\nnums = list(map(int, input().split()))\n# Write your solution here\n",
        JavaScript: aiData.jsStarter     ?? sp?.starters?.JavaScript ?? "const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');\nconst n = parseInt(lines[0]);\nconst nums = lines[1].split(' ').map(Number);\n// Write your solution here\n",
        TypeScript: aiData.tsStarter     ?? sp?.starters?.TypeScript ?? "const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');\nconst n = parseInt(lines[0]);\n// Write your solution here\n",
        Java:       aiData.javaStarter   ?? sp?.starters?.Java       ?? "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // Write your solution here\n    }\n}",
        "C++":      aiData.cppStarter    ?? sp?.starters?.["C++"]    ?? "#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n    int n; cin>>n;\n    // Write your solution here\n    return 0;\n}",
      },
      // Stdin-based test cases — all public
      stdin1:    tc(0)?.stdin ?? aiData.examples?.[0]?.input ?? "",
      expected1: tc(0)?.expected ?? aiData.examples?.[0]?.output ?? "",
      stdin2:    tc(1)?.stdin ?? aiData.examples?.[1]?.input ?? "",
      expected2: tc(1)?.expected ?? aiData.examples?.[1]?.output ?? "",
      stdin3:    tc(2)?.stdin ?? "",
      expected3: tc(2)?.expected ?? "",
      stdin4:    tc(3)?.stdin ?? "",
      expected4: tc(3)?.expected ?? "",
      static: false,
    }

    // Cache in MongoDB
    await db.collection("problem_details_v4").updateOne(
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
