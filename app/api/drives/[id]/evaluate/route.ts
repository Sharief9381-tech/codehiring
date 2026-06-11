/**
 * POST /api/drives/[id]/evaluate — Step 7: AI-powered evaluation & ranking
 * Called after submission — evaluates coding/SQL/case study with Groq
 * Also recomputes rankings across all submissions
 */
import { NextResponse } from "next/server"
import { AssessmentModel } from "@/lib/models/assessment"
import { DriveModel } from "@/lib/models/drive"
import { isDatabaseAvailable } from "@/lib/database"

async function aiEvaluateCode(code: string, question: any, groqKey: string): Promise<number> {
  try {
    const prompt = `You are a code evaluator for a technical assessment.
Question: ${question.title}
Description: ${question.description}
Candidate's code:
\`\`\`
${code}
\`\`\`
Test cases: ${JSON.stringify(question.testCases?.filter((t: any) => !t.isHidden) || [])}

Rate the code from 0 to ${question.points} based on:
- Correctness (passes test cases)
- Time complexity
- Code quality and readability
- Edge case handling

Respond with ONLY a JSON object: {"score": <number>, "feedback": "<brief>", "quality": <0-10>}`

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${groqKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 200,
      }),
    })
    if (!res.ok) return Math.round(question.points * 0.5)
    const data = await res.json()
    const text = data.choices?.[0]?.message?.content || "{}"
    const parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || "{}")
    return Math.min(question.points, Math.max(0, parsed.score || 0))
  } catch {
    return Math.round(question.points * 0.5)
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isDatabaseAvailable()) return NextResponse.json({ error: "DB unavailable" }, { status: 503 })

    const { id: driveId } = await params
    const { attemptId } = await req.json()

    const drive = await DriveModel.findById(driveId)
    if (!drive?.assessmentId) return NextResponse.json({ error: "No assessment" }, { status: 404 })

    const [assessment, attempt] = await Promise.all([
      AssessmentModel.findById(drive.assessmentId),
      AssessmentModel.findAttemptById(attemptId),
    ])
    if (!assessment || !attempt) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const groqKey = process.env.GROQ_API_KEY
    let additionalScore = 0
    const aiStrengths: string[] = []
    const aiWeaknesses: string[] = []

    // Evaluate coding/SQL/case_study answers with AI
    if (groqKey) {
      for (const section of assessment.sections) {
        if (!["coding", "sql", "case_study"].includes(section.type)) continue
        for (const q of section.questions) {
          const answer = attempt.answers.find(a => a.questionId === q._id)
          if (!answer?.code && !answer?.text) continue
          const code = answer.code || answer.text || ""
          const pts = await aiEvaluateCode(code, q, groqKey)
          additionalScore += pts
          if (pts >= q.points * 0.8) aiStrengths.push(q.title)
          else aiWeaknesses.push(q.title)
        }
      }
    }

    const newTotal  = attempt.totalScore + additionalScore
    const newMax    = attempt.totalMax
    const newPct    = newMax > 0 ? Math.round((newTotal / newMax) * 100) : 0

    await AssessmentModel.updateAttempt(attemptId, {
      totalScore: newTotal,
      percentage: newPct,
      status: "evaluated",
      passed: newPct >= assessment.passingScore,
      aiEvaluation: {
        strengths: aiStrengths,
        weaknesses: aiWeaknesses,
        summary: `Scored ${newPct}% — ${newPct >= assessment.passingScore ? "Passed" : "Did not pass"}`,
      },
    })

    // Recompute rankings for all evaluated attempts
    await AssessmentModel.computeRankings(drive.assessmentId)

    // Update applicant score in drive
    const updatedAttempt = await AssessmentModel.findAttemptById(attemptId)
    await DriveModel.updateApplicantStatus(driveId, attempt.studentId, "applied", {
      assessmentScore: newPct,
      assessmentRank: updatedAttempt?.rank,
    })

    return NextResponse.json({ success: true, score: newPct, rank: updatedAttempt?.rank })
  } catch (err) {
    console.error("Evaluate error:", err)
    return NextResponse.json({ error: "Evaluation failed" }, { status: 500 })
  }
}
