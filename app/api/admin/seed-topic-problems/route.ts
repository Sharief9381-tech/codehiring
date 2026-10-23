/**
 * POST /api/admin/seed-topic-problems
 * Pre-generates full problem details for all 720 topic problems and caches in MongoDB.
 *
 * Body: {
 *   secret: string          — NEXTAUTH_SECRET
 *   topic?: string          — optional: seed only one topic track (e.g. "arrays")
 *   batchSize?: number      — problems per AI call (default 5, max 10)
 *   overwrite?: boolean     — re-generate even if already cached (default false)
 * }
 *
 * Returns progress per topic.
 * Call repeatedly (or with different topics) to seed all 720 problems.
 */

import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"
import { TOPIC_QUESTIONS } from "@/lib/topic-questions"

const GROQ_URL   = "https://api.groq.com/openai/v1/chat/completions"
const OPENAI_URL = "https://api.openai.com/v1/chat/completions"
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

// ---------------------------------------------------------------------------
// AI caller — Gemini → OpenAI → Groq
// ---------------------------------------------------------------------------
async function callAI(prompt: string): Promise<string> {
  const stripThink = (s: string) => s.replace(/<think>[\s\S]*?<\/think>/gi, "").trim()

  // 1. Gemini 2.0 Flash
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (geminiKey) {
    try {
      const r = await fetch(`${GEMINI_URL}?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 3000, temperature: 0.2 },
        }),
        signal: AbortSignal.timeout(30000),
      })
      if (r.ok) {
        const d = await r.json()
        const t = d.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ""
        if (t) return t
      }
    } catch {}
  }

  // 2. OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      const r = await fetch(OPENAI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], temperature: 0.2, max_tokens: 3000 }),
        signal: AbortSignal.timeout(30000),
      })
      if (r.ok) {
        const d = await r.json()
        const t = d.choices?.[0]?.message?.content?.trim() ?? ""
        if (t) return t
      }
    } catch {}
  }

  // 3. Groq
  if (process.env.GROQ_API_KEY) {
    try {
      const r = await fetch(GROQ_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
        body: JSON.stringify({ model: "openai/gpt-oss-20b", messages: [{ role: "user", content: prompt }], temperature: 0.2, max_tokens: 3000 }),
        signal: AbortSignal.timeout(30000),
      })
      if (r.ok) {
        const d = await r.json()
        const t = d.choices?.[0]?.message?.content?.trim() ?? ""
        if (t) return stripThink(t)
      }
    } catch {}
  }

  throw new Error("No AI provider available")
}

// ---------------------------------------------------------------------------
// Prompt builder — generates a batch of problems in one call
// ---------------------------------------------------------------------------
function buildPrompt(problems: Array<{ title: string; difficulty: string; topic: string }>): string {
  const list = problems
    .map((p, i) => `${i + 1}. "${p.title}" — ${p.difficulty} — Topic: ${p.topic}`)
    .join("\n")

  return `Generate complete coding problem details for these ${problems.length} problems:

${list}

RULES (stdin/stdout format — students write complete programs):
- Input: plain numbers or strings only. No "nums=[1,2,3]" notation.
- Arrays: one line, space-separated. E.g. "2 7 11 15"
- Multiple inputs: separate lines. E.g. Two Sum: line1="2 7 11 15" line2="9"
- outputFormat: describe exactly what to print to stdout
- All 5 testCases must have CORRECT expected outputs — double check each one
- Starter code must be stdin/stdout style (no class Solution, no function signatures)

Return ONLY a valid JSON array, no markdown, no explanation:
[
  {
    "title": "exact problem title from the list",
    "desc": "2-3 sentence clear problem description. Use backticks for variable names like \`nums\`. State what is given and what to return/print.",
    "inputFormat": "Exact description of stdin. E.g. 'First line: n space-separated integers. Second line: integer target.'",
    "outputFormat": "Exact description of what to print. E.g. 'Print two space-separated 0-indexed positions.'",
    "constraints": ["1 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
    "examples": [
      {"input": "plain stdin e.g. 2 7 11 15\\n9", "output": "0 1", "explanation": "nums[0]+nums[1]=9"},
      {"input": "plain stdin second example", "output": "expected", "explanation": "brief why"}
    ],
    "pythonStarter": "# read input then print answer\\nnums = list(map(int, input().split()))\\n# Write your solution here\\n",
    "jsStarter": "const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\\\n');\\nconst nums = lines[0].split(' ').map(Number);\\n// Write your solution here\\n",
    "tsStarter": "const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\\\n');\\nconst nums = lines[0].split(' ').map(Number);\\n// Write your solution here\\n",
    "javaStarter": "import java.util.*;\\npublic class Main {\\n    public static void main(String[] args) {\\n        Scanner sc = new Scanner(System.in);\\n        // Write your solution here\\n    }\\n}",
    "cppStarter": "#include<bits/stdc++.h>\\nusing namespace std;\\nint main(){\\n    // Write your solution here\\n    return 0;\\n}",
    "testCases": [
      {"stdin": "plain stdin matching inputFormat", "expected": "correct output", "isPublic": true},
      {"stdin": "second test plain stdin", "expected": "correct output", "isPublic": true},
      {"stdin": "edge case", "expected": "correct output", "isPublic": false},
      {"stdin": "larger input", "expected": "correct output", "isPublic": false},
      {"stdin": "boundary case", "expected": "correct output", "isPublic": false}
    ]
  }
]

IMPORTANT: Return exactly ${problems.length} objects in the array, one per problem title listed above. Verify all expected outputs are mathematically correct.`
}

// ---------------------------------------------------------------------------
// Build wire format from AI data
// ---------------------------------------------------------------------------
function buildProblemDoc(ai: any, title: string, difficulty: string, cacheKey: string) {
  const fixStarter = (s: string) =>
    typeof s === "string" ? s.replace(/\\n/g, "\n").replace(/\\t/g, "    ") : ""

  const tc = (i: number) => ai.testCases?.[i]

  return {
    cacheKey,
    title: ai.title ?? title,
    difficulty,
    badge: difficulty,
    desc:         ai.desc         ?? title,
    inputFormat:  ai.inputFormat  ?? "Read input from stdin.",
    outputFormat: ai.outputFormat ?? "Print the answer on a single line.",
    constraints:  Array.isArray(ai.constraints) ? ai.constraints : [],
    examples:     Array.isArray(ai.examples)    ? ai.examples    : [],
    starters: {
      Python:     fixStarter(ai.pythonStarter) || `nums = list(map(int, input().split()))\n# Write your solution here\n`,
      JavaScript: fixStarter(ai.jsStarter)     || `const nums = require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);\n// Write your solution here\n`,
      TypeScript: fixStarter(ai.tsStarter)     || `const nums = require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);\n// Write your solution here\n`,
      Java:       fixStarter(ai.javaStarter)   || `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n    }\n}`,
      "C++":      fixStarter(ai.cppStarter)    || `#include<bits/stdc++.h>\nusing namespace std;\nint main(){\n    // Write your solution here\n    return 0;\n}`,
    },
    stdin1:    tc(0)?.stdin    ?? ai.examples?.[0]?.input ?? "",
    expected1: tc(0)?.expected ?? ai.examples?.[0]?.output ?? "",
    public1:   tc(0)?.isPublic !== false,
    stdin2:    tc(1)?.stdin    ?? ai.examples?.[1]?.input ?? "",
    expected2: tc(1)?.expected ?? ai.examples?.[1]?.output ?? "",
    public2:   tc(1)?.isPublic !== false,
    stdin3:    tc(2)?.stdin    ?? "",
    expected3: tc(2)?.expected ?? "",
    public3:   tc(2)?.isPublic === true,
    stdin4:    tc(3)?.stdin    ?? "",
    expected4: tc(3)?.expected ?? "",
    public4:   tc(3)?.isPublic === true,
    stdin5:    tc(4)?.stdin    ?? "",
    expected5: tc(4)?.expected ?? "",
    public5:   tc(4)?.isPublic === true,
    generatedAt: new Date(),
    seeded: true,
  }
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body      = await req.json()
    const secret    = body.secret ?? ""
    const topicFilter: string | undefined = body.topic
    const batchSize = Math.min(body.batchSize ?? 5, 10)
    const overwrite = body.overwrite === true

    if (secret !== process.env.NEXTAUTH_SECRET && secret !== process.env.SEED_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const col = db.collection("problem_details_v8")

    // Build list of all problems to seed
    const allProblems: Array<{
      title: string
      difficulty: string
      topic: string
      cacheKey: string
    }> = []

    for (const topic of TOPIC_QUESTIONS) {
      if (topicFilter && topic.track !== topicFilter) continue
      for (const q of topic.questions) {
        allProblems.push({
          title:      q.title,
          difficulty: q.difficulty,
          topic:      topic.label,
          cacheKey:   q.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        })
      }
    }

    // Check which already have good cached data
    const existingKeys = new Set<string>()
    if (!overwrite) {
      const existing = await col
        .find(
          {
            cacheKey: { $in: allProblems.map(p => p.cacheKey) },
            "problem.desc": { $exists: true, $not: /^Solve the /i },
            "problem.inputFormat": { $exists: true, $ne: "" },
          },
          { projection: { cacheKey: 1 } }
        )
        .toArray()
      existing.forEach(e => existingKeys.add(e.cacheKey))
    }

    const toSeed = allProblems.filter(p => !existingKeys.has(p.cacheKey))

    if (toSeed.length === 0) {
      return NextResponse.json({
        ok: true,
        message: "All problems already seeded",
        total: allProblems.length,
        seeded: 0,
        skipped: allProblems.length,
      })
    }

    // Process in batches
    let seeded = 0
    let errors = 0
    const results: Record<string, number> = {}

    for (let i = 0; i < toSeed.length; i += batchSize) {
      const batch = toSeed.slice(i, i + batchSize)

      try {
        const prompt = buildPrompt(batch)
        const raw    = await callAI(prompt)
        const clean  = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
        const parsed: any[] = JSON.parse(clean)

        if (!Array.isArray(parsed)) throw new Error("Expected array")

        for (const ai of parsed) {
          // Match to the correct problem in batch
          const matched = batch.find(
            b => b.title.toLowerCase() === (ai.title ?? "").toLowerCase()
          ) ?? batch[parsed.indexOf(ai)]

          if (!matched) continue

          const doc = buildProblemDoc(ai, matched.title, matched.difficulty, matched.cacheKey)

          await col.updateOne(
            { cacheKey: matched.cacheKey },
            { $set: { cacheKey: matched.cacheKey, problem: doc, generatedAt: new Date() } },
            { upsert: true }
          )

          seeded++
          results[matched.topic] = (results[matched.topic] ?? 0) + 1
        }
      } catch (e: any) {
        console.error(`[seed-topic-problems] batch ${i}-${i + batchSize} failed:`, e.message)
        errors += batch.length
      }

      // Rate limit pause between batches
      if (i + batchSize < toSeed.length) {
        await new Promise(r => setTimeout(r, 1000))
      }
    }

    return NextResponse.json({
      ok: true,
      total:   allProblems.length,
      pending: toSeed.length,
      seeded,
      errors,
      skipped: existingKeys.size,
      byTopic: results,
      message: `Seeded ${seeded} problems. ${errors} failed. Call again to retry failed ones.`,
    })

  } catch (err: any) {
    console.error("[seed-topic-problems] error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// GET — check seeding progress
export async function GET(req: Request) {
  const url    = new URL(req.url)
  const secret = url.searchParams.get("secret") ?? ""

  if (secret !== process.env.NEXTAUTH_SECRET && secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const db  = await getDatabase()
  const col = db.collection("problem_details_v8")

  const total   = TOPIC_QUESTIONS.reduce((s, t) => s + t.questions.length, 0)
  const seeded  = await col.countDocuments({ "problem.seeded": true })
  const hasDesc = await col.countDocuments({
    "problem.desc": { $exists: true, $not: { $regex: "^Solve the " } },
  })

  const byTopic: Record<string, { total: number; seeded: number }> = {}
  for (const t of TOPIC_QUESTIONS) {
    const keys = t.questions.map(q => q.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"))
    const count = await col.countDocuments({
      cacheKey: { $in: keys },
      "problem.desc": { $exists: true, $not: { $regex: "^Solve the " } },
    })
    byTopic[t.label] = { total: t.questions.length, seeded: count }
  }

  return NextResponse.json({
    total,
    seeded,
    hasDesc,
    percent: Math.round((hasDesc / total) * 100),
    byTopic,
    remaining: total - hasDesc,
  })
}
