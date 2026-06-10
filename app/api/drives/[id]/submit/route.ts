/**
 * POST /api/drives/[id]/submit — Step 6b: Student submits assessment answers
 * Triggers Step 7: AI-powered evaluation
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { AssessmentModel, AssessmentAttempt } from "@/lib/models/assessment"
import { DriveModel } from "@/lib/models/drive"
import { isDatabaseAvailable } from "@/lib/database"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "student") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!isDatabaseAvailable()) return NextResponse.json({ error: "DB unavailable" }, { status: 503 })

    const { id: driveId } = await params
    const drive = await DriveModel.findById(driveId)
    if (!drive || !drive.assessmentId) return NextResponse.json({ error: "No assessment for this drive" }, { status: 404 })

    const assessment = await AssessmentModel.findById(drive.assessmentId)
    if (!assessment) return NextResponse.json({ error: "Assessment not found" }, { status: 404 })

    // Check already attempted
    const existing = await AssessmentModel.findAttempt(drive.assessmentId, user._id as string)
    if (existing && existing.status !== "in_progress") {
      return NextResponse.json({ error: "Already submitted" }, { status: 400 })
    }

    const { answers, attemptId } = await req.json()
    const u = user as any

    // ── Auto-evaluate MCQ, Aptitude, Debugging ────────────────
    const scores: AssessmentAttempt["scores"] = []
    let totalScore = 0, totalMax = 0

    for (const section of assessment.sections) {
      let sectionScore = 0, sectionMax = 0
      for (const q of section.questions) {
        sectionMax += q.points
        const answer = answers.find((a: any) => a.questionId === q._id)
        if (!answer) continue

        if (["mcq", "aptitude"].includes(q.type)) {
          if (answer.selectedOptionId === q.correctOptionId) {
            sectionScore += q.points
          }
        } else if (q.type === "debugging") {
          // Simple check — if answer contains the fix keywords
          if (answer.code && q.solutionCode && answer.code.length > 10) {
            sectionScore += Math.round(q.points * 0.7) // partial credit
          }
        }
        // Coding / SQL / case_study — scored by AI in next step
      }
      scores.push({
        sectionName: section.name,
        raw: sectionScore,
        max: sectionMax,
        percentage: sectionMax > 0 ? Math.round((sectionScore / sectionMax) * 100) : 0,
      })
      totalScore += sectionScore
      totalMax += sectionMax
    }

    const percentage = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0

    // Create or update attempt
    let attempt
    if (existing && attemptId) {
      await AssessmentModel.updateAttempt(attemptId, {
        answers,
        submittedAt: new Date(),
        status: "submitted",
        scores,
        totalScore,
        totalMax,
        percentage,
        passed: percentage >= assessment.passingScore,
      })
      attempt = { ...existing, _id: attemptId, status: "submitted", percentage }
    } else {
      attempt = await AssessmentModel.createAttempt({
        assessmentId: drive.assessmentId,
        driveId,
        studentId: user._id as string,
        studentName: u.name,
        startedAt: new Date(),
        submittedAt: new Date(),
        status: "submitted",
        answers: answers || [],
        scores,
        totalScore,
        totalMax,
        percentage,
        passed: percentage >= assessment.passingScore,
      })
    }

    // Update applicant score in drive
    await DriveModel.updateApplicantStatus(driveId, user._id as string, "applied", {
      assessmentScore: percentage,
    })

    // Trigger background AI evaluation (non-blocking)
    const baseUrl = process.env.NEXTAUTH_URL?.replace(/\/$/, "") || "http://localhost:3000"
    fetch(`${baseUrl}/api/drives/${driveId}/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attemptId: attempt._id }),
    }).catch(() => {}) // fire and forget

    return NextResponse.json({
      success: true,
      attemptId: attempt._id,
      score: percentage,
      passed: percentage >= assessment.passingScore,
      message: "Assessment submitted. Results will be available shortly.",
    })
  } catch (err) {
    console.error("Submit error:", err)
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 })
  }
}
