/**
 * POST /api/student/problem-detail
 * Returns static problem data from PROBLEM_BANK.
 * No AI generation — all problems are hardcoded with proper
 * descriptions, examples, constraints, and test cases.
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { TOPIC_QUESTIONS } from "@/lib/topic-questions"
import { getProblem, PROBLEM_BANK } from "@/lib/problem-bank"

// Build a flat map of problemId → { title, topic, difficulty }
const PROBLEM_MAP: Record<string, { title: string; topic: string; difficulty: string }> = {}
for (const topic of TOPIC_QUESTIONS) {
  for (const q of topic.questions) {
    PROBLEM_MAP[q.id] = { title: q.title, topic: topic.label, difficulty: q.difficulty }
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const body = await req.json()
    let title      = body.title as string | undefined
    let difficulty = body.difficulty ?? "Medium"

    if (!title && body.problemId) {
      const meta = PROBLEM_MAP[body.problemId]
      if (!meta) return NextResponse.json({ error: "Unknown problemId" }, { status: 404 })
      title      = meta.title
      difficulty = meta.difficulty
    }

    if (!title) return NextResponse.json({ error: "title or problemId required" }, { status: 400 })

    // Look up in static bank
    const sp = getProblem(title)
    if (sp) {
      // Normalise into the shape the editor expects
      const problem = {
        title:         sp.title,
        difficulty:    sp.difficulty,
        badge:         sp.difficulty,
        desc:          sp.desc,
        inputFormat:   sp.functionSignature ? `Function signature:\n${sp.functionSignature}` : "",
        outputFormat:  "",
        constraints:   sp.constraints,
        input:         sp.examples[0]?.input  ?? "",
        output:        sp.examples[0]?.output ?? "",
        explain:       sp.examples[0]?.explanation ?? "",
        input2:        sp.examples[1]?.input  ?? "",
        output2:       sp.examples[1]?.output ?? "",
        explain2:      sp.examples[1]?.explanation ?? "",
        // Test cases for run-code (script-based, no AI needed)
        pythonTest1:   sp.testCases[0]?.script   ?? "",
        expectedTest1: sp.testCases[0]?.expected ?? "",
        pythonTest2:   sp.testCases[1]?.script   ?? "",
        expectedTest2: sp.testCases[1]?.expected ?? "",
        pythonTest3:   sp.testCases[2]?.script   ?? "",
        expectedTest3: sp.testCases[2]?.expected ?? "",
        pythonTest4:   sp.testCases[3]?.script   ?? "",
        expectedTest4: sp.testCases[3]?.expected ?? "",
        // Starter code per language
        starters:      sp.starters,
        examples:      sp.examples,
        static:        true,
      }
      return NextResponse.json({ problem, fromCache: false, static: true })
    }

    // Fallback — problem not in bank yet, return minimal stub
    return NextResponse.json({
      problem: {
        title,
        difficulty,
        badge:       difficulty,
        desc:        `Solve the ${title} problem.`,
        inputFormat: "",
        outputFormat:"",
        constraints: ["See LeetCode for full constraints."],
        input:  "", output:  "", explain: "",
        input2: "", output2: "",
        pythonTest1: "", expectedTest1: "",
        pythonTest2: "", expectedTest2: "",
        pythonTest3: "", expectedTest3: "",
        pythonTest4: "", expectedTest4: "",
        starters: {},
        examples: [],
        static: false,
      },
      fromCache: false,
      static: false,
    })
  } catch (err) {
    console.error("problem-detail error:", err)
    return NextResponse.json({ error: "Failed to load problem" }, { status: 500 })
  }
}
