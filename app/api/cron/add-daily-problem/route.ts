/**
 * GET/POST /api/cron/add-daily-problem
 *
 * Runs once per day (via Vercel cron at 7 AM IST / 1:30 AM UTC).
 * Generates one NEW unique coding problem via AI and adds it to MongoDB.
 * Students see it in their problems list with a "New" badge.
 *
 * Collection: daily_new_problems
 * Each doc: { dateKey, problemId, title, difficulty, topic, problem: {...}, addedAt }
 */

import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

// ── Topic + difficulty rotation ───────────────────────────────────────────────
const TOPICS = [
  { topic: "Arrays",               difficulty: "Easy"   },
  { topic: "Strings",              difficulty: "Easy"   },
  { topic: "Hashing",              difficulty: "Medium" },
  { topic: "Two Pointers",         difficulty: "Easy"   },
  { topic: "Sliding Window",       difficulty: "Medium" },
  { topic: "Linked List",          difficulty: "Medium" },
  { topic: "Stack",                difficulty: "Easy"   },
  { topic: "Queue",                difficulty: "Medium" },
  { topic: "Binary Search",        difficulty: "Medium" },
  { topic: "Sorting",              difficulty: "Easy"   },
  { topic: "Prefix Sum",           difficulty: "Easy"   },
  { topic: "Recursion",            difficulty: "Medium" },
  { topic: "Backtracking",         difficulty: "Hard"   },
  { topic: "Tree",                 difficulty: "Medium" },
  { topic: "Binary Tree",          difficulty: "Medium" },
  { topic: "BST",                  difficulty: "Medium" },
  { topic: "Heap",                 difficulty: "Hard"   },
  { topic: "Graph",                difficulty: "Medium" },
  { topic: "Greedy Algorithms",    difficulty: "Medium" },
  { topic: "Dynamic Programming",  difficulty: "Hard"   },
  { topic: "Trie",                 difficulty: "Hard"   },
  { topic: "Matrix",               difficulty: "Medium" },
  { topic: "Deque",                difficulty: "Hard"   },
  { topic: "Bit Manipulation",     difficulty: "Medium" },
  { topic: "Math & Number Theory", difficulty: "Medium" },
  { topic: "Intervals",            difficulty: "Medium" },
  { topic: "Monotonic Stack",      difficulty: "Hard"   },
  { topic: "Union Find",           difficulty: "Hard"   },
  { topic: "Segment Tree",         difficulty: "Hard"   },
  { topic: "Arrays",               difficulty: "Hard"   },
]

function getTodayKey(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`
}

function getDayOfYear(): number {
  const now   = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  return Math.floor((now.getTime() - start.getTime()) / 86400000)
}

// ── AI generation ─────────────────────────────────────────────────────────────
async function generateProblem(
  topic: string,
  difficulty: string,
  recentTitles: string[],
  dayOfYear: number
): Promise<any> {
  const avoidList = recentTitles.slice(0, 30).join(", ")

  const prompt = `Generate a unique coding problem for a daily challenge.

Topic: ${topic}
Difficulty: ${difficulty}
Day seed: ${dayOfYear}
AVOID these recent titles: ${avoidList || "none"}

RULES:
- stdin/stdout format (students write complete programs reading from stdin)
- Arrays: space-separated on one line. E.g. "3 1 4 1 5"
- Multiple inputs: separate lines
- All 5 test cases must have CORRECT expected outputs - double-check each one
- Problem must be UNIQUE and NOT a copy of common LeetCode problems

Return ONLY valid JSON, no markdown:
{
  "title": "Unique problem title (5-8 words)",
  "desc": "Clear 2-3 sentence description. Use backticks for variable names.",
  "inputFormat": "Exact description of stdin lines",
  "outputFormat": "Exact description of what to print",
  "constraints": ["constraint1", "constraint2", "constraint3"],
  "examples": [
    {"input": "stdin example", "output": "expected", "explanation": "why"},
    {"input": "stdin example 2", "output": "expected 2", "explanation": "why"}
  ],
  "pythonStarter": "# read input\\n# write solution\\n# print output\\n",
  "jsStarter": "const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\\\n');\\n// write solution\\n",
  "tsStarter": "const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\\\n');\\n// write solution\\n",
  "javaStarter": "import java.util.*;\\npublic class Main {\\n    public static void main(String[] args) {\\n        Scanner sc = new Scanner(System.in);\\n        // write solution\\n    }\\n}",
  "cppStarter": "#include<bits/stdc++.h>\\nusing namespace std;\\nint main(){\\n    // write solution\\n    return 0;\\n}",
  "testCases": [
    {"stdin": "test input 1", "expected": "output 1", "isPublic": true},
    {"stdin": "test input 2", "expected": "output 2", "isPublic": true},
    {"stdin": "edge case",    "expected": "output 3", "isPublic": false},
    {"stdin": "larger input", "expected": "output 4", "isPublic": false},
    {"stdin": "boundary",     "expected": "output 5", "isPublic": false}
  ]
}`

  const geminiKeys = [
    process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
  ].filter(Boolean) as string[]

  // Try Gemini keys
  for (const key of geminiKeys) {
    try {
      const r = await fetch(`${GEMINI_URL}?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 2000, temperature: 0.7 },
        }),
        signal: AbortSignal.timeout(30000),
      })
      if (r.ok) {
        const d = await r.json()
        let raw = d.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ""
        raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
        if (raw) {
          const parsed = JSON.parse(raw)
          // Fix escaped newlines in starters
          for (const k of ["pythonStarter","jsStarter","tsStarter","javaStarter","cppStarter"]) {
            if (typeof parsed[k] === "string") {
              parsed[k] = parsed[k].replace(/\\n/g, "\n").replace(/\\t/g, "    ")
            }
          }
          return parsed
        }
      } else if (r.status === 429 || r.status === 403) {
        continue // try next key
      }
    } catch { continue }
  }

  // Fallback: OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], temperature: 0.7, max_tokens: 2000 }),
        signal: AbortSignal.timeout(30000),
      })
      if (r.ok) {
        const d = await r.json()
        let raw = d.choices?.[0]?.message?.content?.trim() ?? ""
        raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
        if (raw) return JSON.parse(raw)
      }
    } catch {}
  }

  // Fallback: Groq
  if (process.env.GROQ_API_KEY) {
    try {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
        body: JSON.stringify({ model: "openai/gpt-oss-20b", messages: [{ role: "user", content: prompt }], temperature: 0.7, max_tokens: 2000 }),
        signal: AbortSignal.timeout(30000),
      })
      if (r.ok) {
        const d = await r.json()
        let raw = d.choices?.[0]?.message?.content?.trim() ?? ""
        raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
        if (raw) return JSON.parse(raw)
      }
    } catch {}
  }

  return null
}

// ── Handler ───────────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  return POST(req)
}

export async function POST(req: Request) {
  // Optional secret check
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get("authorization") ?? req.headers.get("x-cron-secret") ?? ""
    if (auth.replace("Bearer ", "") !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  const db       = await getDatabase()
  const col      = db.collection("daily_new_problems")
  const todayKey = getTodayKey()
  const dayOfYear = getDayOfYear()

  // Skip if already added today
  const existing = await col.findOne({ dateKey: todayKey })
  if (existing) {
    return NextResponse.json({ skipped: true, reason: "Already added today", title: existing.title })
  }

  // Get recent titles to avoid duplicates
  const recent = await col.find({}, { projection: { title: 1 } })
    .sort({ addedAt: -1 }).limit(60).toArray()
  const recentTitles = recent.map((d: any) => d.title)

  // Pick today's topic + difficulty
  const { topic, difficulty } = TOPICS[dayOfYear % TOPICS.length]

  const aiData = await generateProblem(topic, difficulty, recentTitles, dayOfYear)
  if (!aiData) {
    return NextResponse.json({ error: "AI generation failed — all providers exhausted" }, { status: 500 })
  }

  const title = aiData.title ?? `${topic} Challenge — Day ${dayOfYear}`
  const cacheKey = title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  const problemId = `daily-new-${cacheKey}`

  const tc = (i: number) => aiData.testCases?.[i]

  const problem = {
    title,
    difficulty,
    badge: difficulty,
    topic,
    desc:         aiData.desc         ?? title,
    inputFormat:  aiData.inputFormat  ?? "Read input from stdin.",
    outputFormat: aiData.outputFormat ?? "Print the answer on a single line.",
    constraints:  Array.isArray(aiData.constraints) ? aiData.constraints : [],
    examples:     Array.isArray(aiData.examples)    ? aiData.examples    : [],
    starters: {
      Python:     aiData.pythonStarter ?? "# Read input\n# Write solution\nprint()\n",
      JavaScript: aiData.jsStarter     ?? "const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');\n// Write solution\n",
      TypeScript: aiData.tsStarter     ?? "const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');\n// Write solution\n",
      Java:       aiData.javaStarter   ?? "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}",
      "C++":      aiData.cppStarter    ?? "#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n    return 0;\n}",
    },
    stdin1:    tc(0)?.stdin    ?? aiData.examples?.[0]?.input ?? "",
    expected1: tc(0)?.expected ?? aiData.examples?.[0]?.output ?? "",
    public1:   true,
    stdin2:    tc(1)?.stdin    ?? aiData.examples?.[1]?.input ?? "",
    expected2: tc(1)?.expected ?? aiData.examples?.[1]?.output ?? "",
    public2:   true,
    stdin3:    tc(2)?.stdin    ?? "",
    expected3: tc(2)?.expected ?? "",
    public3:   false,
    stdin4:    tc(3)?.stdin    ?? "",
    expected4: tc(3)?.expected ?? "",
    public4:   false,
    stdin5:    tc(4)?.stdin    ?? "",
    expected5: tc(4)?.expected ?? "",
    public5:   false,
    isNew: true,
  }

  // Save to daily_new_problems collection
  await col.insertOne({
    dateKey:   todayKey,
    problemId,
    cacheKey,
    title,
    difficulty,
    topic,
    problem,
    addedAt: new Date(),
  })

  // Also cache in problem_details_v8 so the problem editor loads it instantly
  await db.collection("problem_details_v8").updateOne(
    { cacheKey },
    { $set: { cacheKey, problem, generatedAt: new Date() } },
    { upsert: true }
  )

  return NextResponse.json({
    success: true,
    title,
    difficulty,
    topic,
    dateKey: todayKey,
    problemId,
  })
}
