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

  const prompt = [
    "Generate a coding problem for: " + title + " (" + difficulty + " difficulty).",
    "",
    "STRICT RULES:",
    "1. Input is ALWAYS a single line of space-separated integers (e.g. '0 1 0 3 12')",
    "2. NO separate n on first line. The student reads ALL input from ONE line.",
    "3. Python starter MUST be: arr = list(map(int, input().split()))",
    "4. The student writes a complete stdin/stdout program",
    "",
    "Return ONLY valid JSON:",
    "{",
    '  "desc": "Problem description.",',
    '  "inputFormat": "A single line of space-separated integers.",',
    '  "outputFormat": "What to print.",',
    '  "examples": [',
    '    {"input": "space separated integers on ONE line", "output": "expected output", "explanation": "brief"},',
    '    {"input": "second test input", "output": "expected output", "explanation": "brief"}',
    "  ],",
    '  "constraints": ["Array length constraint", "Value constraint"],',
    '  "pythonStarter": "arr = list(map(int, input().split()))\\n# Write your solution here\\n",',
    '  "jsStarter": "const arr = require(\'fs\').readFileSync(\'/dev/stdin\',\'utf8\').trim().split(\' \').map(Number);\\n// Write your solution here\\n",',
    '  "tsStarter": "const arr = require(\'fs\').readFileSync(\'/dev/stdin\',\'utf8\').trim().split(\' \').map(Number);\\n// Write your solution here\\n",',
    '  "javaStarter": "import java.util.*;\\npublic class Main {\\n    public static void main(String[] args) {\\n        Scanner sc = new Scanner(System.in);\\n        String[] parts = sc.nextLine().split(\\" \\");\\n        int[] arr = Arrays.stream(parts).mapToInt(Integer::parseInt).toArray();\\n        // Write your solution here\\n    }\\n}",',
    '  "cppStarter": "#include<bits/stdc++.h>\\nusing namespace std;\\nint main(){\\n    int x; vector<int> arr;\\n    while(cin>>x) arr.push_back(x);\\n    // Write your solution here\\n    return 0;\\n}",',
    '  "testCases": [',
    '    {"stdin": "space separated integers", "expected": "expected output", "isPublic": true},',
    '    {"stdin": "another single line", "expected": "expected output", "isPublic": true},',
    '    {"stdin": "edge case single line", "expected": "expected output", "isPublic": false},',
    '    {"stdin": "larger input single line", "expected": "expected output", "isPublic": false},',
    '    {"stdin": "boundary case single line", "expected": "expected output", "isPublic": false}',
    "  ]",
    "}",
    "",
    "CRITICAL: ALL stdin values must be a SINGLE LINE of space-separated integers. Never use multiple lines.",
  ].join("\n")

  const call = async (key: string, url: string, model: string) => {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
      body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], temperature: 0.2, max_tokens: 1000 }),
      signal: AbortSignal.timeout(20000),
    })
    if (!r.ok) throw new Error("HTTP " + r.status)
    const d = await r.json()
    let raw: string = d.choices?.[0]?.message?.content?.trim() ?? ""
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
        isPublic: tc.isPublic !== false,  // default public unless explicitly false
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
    desc:          sp.desc          ?? "Solve the " + title + " problem.",
    inputFormat:   sp.inputFormat   ?? "",
    outputFormat:  sp.outputFormat  ?? "",
    constraints:   sp.constraints   ?? [],
    examples:      sp.examples      ?? [],
    starters:      sp.starters      ?? {},
    // 2 public + 3 hidden test cases
    stdin1:    tc(0)?.stdin ?? sp.examples?.[0]?.input ?? "",
    expected1: tc(0)?.expected ?? sp.examples?.[0]?.output ?? "",
    public1:   tc(0)?.isPublic !== false,
    stdin2:    tc(1)?.stdin ?? sp.examples?.[1]?.input ?? "",
    expected2: tc(1)?.expected ?? sp.examples?.[1]?.output ?? "",
    public2:   tc(1)?.isPublic !== false,
    stdin3:    tc(2)?.stdin ?? "",
    expected3: tc(2)?.expected ?? "",
    public3:   tc(2)?.isPublic === true,   // default hidden
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
    const cached = await db.collection("problem_details_v6").findOne({ cacheKey })
    if (cached?.problem?.stdin1 !== undefined && cached?.problem?.stdin3) {
      return NextResponse.json({ problem: cached.problem, fromCache: true, source: "db" })
    }

    // -- 3. Generate via AI ----------------------------------------------------
    const aiData = await generateProblem(title, difficulty)

    if (!aiData) {
      // AI unavailable - return stub with whatever static data we have
      const stubProblem = sp ? bankToWire(sp, title, difficulty) : {
        title, difficulty, badge: difficulty,
        desc: "Solve the " + title + " problem.",
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
      desc:          aiData.desc          ?? sp?.desc ?? "Solve the " + title + " problem.",
      inputFormat:   aiData.inputFormat   ?? "",
      outputFormat:  aiData.outputFormat  ?? aiData.outputDescription ?? "",
      constraints:   aiData.constraints   ?? sp?.constraints ?? [],
      examples:      aiData.examples ?? sp?.examples ?? [],
      starters: {
        Python:     aiData.pythonStarter ?? sp?.starters?.Python     ?? "arr = list(map(int, input().split()))\n# Write your solution here\n",
        JavaScript: aiData.jsStarter     ?? sp?.starters?.JavaScript ?? "const arr = require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);\n// Write your solution here\n",
        TypeScript: aiData.tsStarter     ?? sp?.starters?.TypeScript ?? "const arr = require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);\n// Write your solution here\n",
        Java:       aiData.javaStarter   ?? sp?.starters?.Java       ?? "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int[] arr = Arrays.stream(sc.nextLine().split(\" \")).mapToInt(Integer::parseInt).toArray();\n        // Write your solution here\n    }\n}",
        "C++":      aiData.cppStarter    ?? sp?.starters?.["C++"]    ?? "#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n    int x; vector<int> arr;\n    while(cin>>x) arr.push_back(x);\n    // Write your solution here\n    return 0;\n}",
      },
    // Stdin-based test cases — 2 public + 3 hidden
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

    // Cache in MongoDB
    await db.collection("problem_details_v5").updateOne(
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
