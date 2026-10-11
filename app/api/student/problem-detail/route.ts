/**
 * POST /api/student/problem-detail
 * Returns problem data. Priority:
 * 1. STDIN_BANK entries (10 hand-crafted problems, instant, no AI)
 * 2. MongoDB cache (AI-generated, cached after first visit)
 * 3. Static bank desc + AI-generated stdin test cases (merged)
 * 4. Pure AI generation for unknown problems
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

// Default stdin starters (used when static bank has old class-based starters)
function defaultStarters(title: string) {
  return {
    Python:
      `# ${title}\n` +
      `# Read input from stdin, print answer to stdout\n` +
      `nums = list(map(int, input().split()))\n` +
      `# Write your solution here\n`,
    JavaScript:
      `// ${title}\n` +
      `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');\n` +
      `const nums = lines[0].split(' ').map(Number);\n` +
      `// Write your solution here\n`,
    TypeScript:
      `// ${title}\n` +
      `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');\n` +
      `const nums = lines[0].split(' ').map(Number);\n` +
      `// Write your solution here\n`,
    Java:
      `import java.util.*;\n` +
      `public class Main {\n` +
      `    public static void main(String[] args) {\n` +
      `        Scanner sc = new Scanner(System.in);\n` +
      `        // Read: int n = sc.nextInt(); or String line = sc.nextLine();\n` +
      `        // Write your solution here\n` +
      `    }\n` +
      `}`,
    "C++":
      `#include<bits/stdc++.h>\n` +
      `using namespace std;\n` +
      `int main(){\n` +
      `    // Read input, write solution, print output\n` +
      `    return 0;\n` +
      `}`,
  }
}

// Check if starters look like stdin format (not class-based)
function isStdinStarter(s: string): boolean {
  if (!s) return false
  return !s.includes("class Solution") && !s.includes("class Main {")
}

// -- AI generation -------------------------------------------------------------
async function generateProblem(title: string, difficulty: string, existingDesc?: string): Promise<any> {
  const groqKey   = process.env.GROQ_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY

  const descHint = existingDesc
    ? `Problem description: ${existingDesc.slice(0, 300)}`
    : `Generate a description for: ${title}`

  const prompt = `You are generating a coding problem in stdin/stdout format.

Problem: ${title} (${difficulty})
${descHint}

RULES:
- Students write complete programs that read from stdin and print to stdout
- No LeetCode class/function signatures
- Input must be plain numbers or strings, not "nums=[1,2,3]" notation
- Arrays: one line, space-separated. E.g. "2 7 11 15"
- Multiple inputs: separate lines. E.g. line1="2 7 11 15", line2="9" for Two Sum
- inputFormat: describe stdin exactly
- outputFormat: describe what to print

Return ONLY valid JSON, no markdown:
{
  "desc": "Clear problem statement with backticks for variable names like \`nums\`.",
  "inputFormat": "Exact stdin description.",
  "outputFormat": "Exact stdout description.",
  "examples": [
    {"input": "plain numbers", "output": "answer", "explanation": "brief"},
    {"input": "plain numbers", "output": "answer", "explanation": "brief"}
  ],
  "constraints": ["1 <= n <= 10^5"],
  "pythonStarter": "nums = list(map(int, input().split()))\\n# Write your solution here\\n",
  "jsStarter": "const nums = require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);\\n// Write your solution here\\n",
  "tsStarter": "const nums = require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);\\n// Write your solution here\\n",
  "javaStarter": "import java.util.*;\\npublic class Main {\\n    public static void main(String[] args) {\\n        Scanner sc = new Scanner(System.in);\\n        // Write your solution here\\n    }\\n}",
  "cppStarter": "#include<bits/stdc++.h>\\nusing namespace std;\\nint main(){\\n    // Write your solution here\\n    return 0;\\n}",
  "testCases": [
    {"stdin": "plain numbers", "expected": "correct output", "isPublic": true},
    {"stdin": "plain numbers", "expected": "correct output", "isPublic": true},
    {"stdin": "edge case", "expected": "correct output", "isPublic": false},
    {"stdin": "larger input", "expected": "correct output", "isPublic": false},
    {"stdin": "boundary", "expected": "correct output", "isPublic": false}
  ]
}`

  const stripThink = (s: string) => s.replace(/<think>[\s\S]*?<\/think>/gi, "").trim()

  const call = async (key: string, url: string, model: string) => {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 1400,
      }),
      signal: AbortSignal.timeout(25000),
    })
    if (!r.ok) throw new Error("HTTP " + r.status + " from " + url)
    const d = await r.json()
    let raw: string = d.choices?.[0]?.message?.content?.trim() ?? ""
    raw = stripThink(raw)
    raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
    const p = JSON.parse(raw)
    for (const k of ["pythonStarter","jsStarter","tsStarter","javaStarter","cppStarter"]) {
      if (typeof p[k] === "string") p[k] = p[k].replace(/\\n/g, "\n").replace(/\\t/g, "    ")
    }
    if (Array.isArray(p.testCases)) {
      p.testCases = p.testCases.map((tc: any) => ({
        stdin:    String(tc.stdin ?? "").replace(/\\n/g, "\n"),
        expected: String(tc.expected ?? ""),
        isPublic: tc.isPublic !== false,
      }))
    }
    return p
  }

  let data: any = null
  if (groqKey) {
    try {
      data = await call(groqKey, "https://api.groq.com/openai/v1/chat/completions", "qwen/qwen3.6-27b")
    } catch (e) {
      console.error("[problem-detail] Groq failed:", (e as Error).message)
    }
  }
  if (!data && openaiKey) {
    try {
      data = await call(openaiKey, "https://api.openai.com/v1/chat/completions", "gpt-4o-mini")
    } catch (e) {
      console.error("[problem-detail] OpenAI failed:", (e as Error).message)
    }
  }
  return data
}

// -- Wire format builder -------------------------------------------------------
function buildWire(
  title: string,
  difficulty: string,
  source: {
    desc?: string
    inputFormat?: string
    outputFormat?: string
    constraints?: string[]
    examples?: any[]
    starters?: Record<string, string>
    testCases?: any[]
  }
) {
  const tc = (i: number) => source.testCases?.[i]
  const starters = source.starters ?? {}

  // Use stdin starters if available, otherwise fall back to defaults
  const finalStarters = {
    Python:     isStdinStarter(starters.Python     ?? "") ? starters.Python     : defaultStarters(title).Python,
    JavaScript: isStdinStarter(starters.JavaScript ?? "") ? starters.JavaScript : defaultStarters(title).JavaScript,
    TypeScript: isStdinStarter(starters.TypeScript ?? "") ? starters.TypeScript : defaultStarters(title).TypeScript,
    Java:       isStdinStarter(starters.Java        ?? "") ? starters.Java       : defaultStarters(title).Java,
    "C++":      isStdinStarter(starters["C++"]      ?? "") ? starters["C++"]     : defaultStarters(title)["C++"],
  }

  return {
    title,
    difficulty,
    badge: difficulty,
    desc:         source.desc         ?? title,
    inputFormat:  source.inputFormat  ?? "Read input from stdin as described in the problem.",
    outputFormat: source.outputFormat ?? "Print the answer on a single line.",
    constraints:  source.constraints  ?? [],
    examples:     source.examples     ?? [],
    starters:     finalStarters,
    stdin1:    tc(0)?.stdin ?? source.examples?.[0]?.input ?? "",
    expected1: tc(0)?.expected ?? source.examples?.[0]?.output ?? "",
    public1:   tc(0)?.isPublic !== false,
    stdin2:    tc(1)?.stdin ?? source.examples?.[1]?.input ?? "",
    expected2: tc(1)?.expected ?? source.examples?.[1]?.output ?? "",
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

    // -- 1. Static bank with stdin test cases (hand-crafted) -------------------
    const sp = getProblem(title)
    const hasStdinTestCases = sp?.testCases?.some((tc: any) => tc.stdin !== undefined)
    if (sp && hasStdinTestCases) {
      return NextResponse.json({
        problem: buildWire(title, difficulty, {
          desc:        sp.desc,
          inputFormat: (sp as any).inputFormat,
          outputFormat:(sp as any).outputFormat,
          constraints: sp.constraints,
          examples:    sp.examples,
          starters:    sp.starters,
          testCases:   sp.testCases as any,
        }),
        fromCache: false,
        source: "static",
      })
    }

    // -- 2. MongoDB cache ------------------------------------------------------
    const db = await getDatabase()
    const cacheKey = title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    const cached = await db.collection("problem_details_v8").findOne({ cacheKey })
    if (
      cached?.problem?.desc?.trim() &&
      cached?.problem?.desc !== `Solve the ${title} problem.` &&
      cached?.problem?.inputFormat?.trim() &&
      cached?.problem?.outputFormat?.trim()
    ) {
      return NextResponse.json({ problem: cached.problem, fromCache: true, source: "db" })
    }

    // -- 3. AI generation (with static bank desc as hint) ----------------------
    const aiData = await generateProblem(title, difficulty, sp?.desc)

    if (!aiData) {
      // AI failed — still return static bank description if available so
      // the student sees the problem text even without working test cases
      if (sp?.desc) {
        const partial = buildWire(title, difficulty, {
          desc:        sp.desc,
          constraints: sp.constraints,
          examples:    sp.examples,
          starters:    sp.starters,
        })
        return NextResponse.json({ problem: partial, fromCache: false, source: "static-partial" })
      }
      // Nothing at all — minimal stub
      return NextResponse.json({
        problem: buildWire(title, difficulty, {
          desc: `${title}: Read the input, compute the answer, and print it.`,
        }),
        fromCache: false,
        source: "stub",
      })
    }

    // -- 4. Merge: prefer AI for inputFormat/outputFormat/testCases,
    //             prefer static bank for desc/examples/constraints if richer  --
    const merged = buildWire(title, difficulty, {
      // Use static bank description if it's more detailed than AI's
      desc:        (sp?.desc && sp.desc.length > (aiData.desc?.length ?? 0))
                     ? sp.desc : (aiData.desc ?? sp?.desc ?? title),
      inputFormat:  aiData.inputFormat  ?? "",
      outputFormat: aiData.outputFormat ?? "",
      constraints:  aiData.constraints  ?? sp?.constraints ?? [],
      // Use static bank examples for display (they have nice LeetCode-style formatting)
      // but AI test cases for execution (they're in stdin format)
      examples:    sp?.examples?.length ? sp.examples : (aiData.examples ?? []),
      starters:    {
        Python:     aiData.pythonStarter,
        JavaScript: aiData.jsStarter,
        TypeScript: aiData.tsStarter,
        Java:       aiData.javaStarter,
        "C++":      aiData.cppStarter,
      },
      testCases: aiData.testCases ?? [],
    })

    // Cache it
    await db.collection("problem_details_v8").updateOne(
      { cacheKey },
      { $set: { cacheKey, problem: merged, generatedAt: new Date() } },
      { upsert: true }
    )

    return NextResponse.json({ problem: merged, fromCache: false, source: "ai" })

  } catch (err: any) {
    console.error("[problem-detail] error:", err)
    return NextResponse.json({ error: "Failed to load problem" }, { status: 500 })
  }
}
