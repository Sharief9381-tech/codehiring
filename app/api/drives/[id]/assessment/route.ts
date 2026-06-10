/**
 * POST /api/drives/[id]/assessment — Step 6: Create/attach assessment to drive
 * GET  — fetch assessment config for a drive
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { DriveModel } from "@/lib/models/drive"
import { AssessmentModel } from "@/lib/models/assessment"
import { isDatabaseAvailable } from "@/lib/database"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { id } = await params
    const assessment = await AssessmentModel.findByDrive(id)
    if (!assessment) return NextResponse.json({ error: "No assessment found" }, { status: 404 })
    // Hide correct answers from students
    if (user.role === "student") {
      const safe = {
        ...assessment,
        sections: assessment.sections.map(s => ({
          ...s,
          questions: s.questions.map(q => ({
            ...q,
            correctOptionId: undefined,
            solutionCode: undefined,
            testCases: q.testCases?.map(tc => ({ ...tc, expectedOutput: tc.isHidden ? "hidden" : tc.expectedOutput })),
          })),
        })),
      }
      return NextResponse.json({ assessment: safe })
    }
    return NextResponse.json({ assessment })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== "recruiter" && user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!isDatabaseAvailable()) return NextResponse.json({ error: "DB unavailable" }, { status: 503 })

    const { id } = await params
    const drive = await DriveModel.findById(id)
    if (!drive) return NextResponse.json({ error: "Drive not found" }, { status: 404 })

    const body = await req.json()
    const { title, description, totalTime, passingScore, sections, instructions, shuffleQuestions, showResultsAfter } = body

    // Calculate totalPoints from sections
    const totalPoints = (sections || []).reduce((sum: number, s: any) =>
      sum + (s.questions || []).reduce((qs: number, q: any) => qs + (q.points || 1), 0), 0)

    const assessment = await AssessmentModel.create({
      driveId: id,
      recruiterId: user._id as string,
      title: title || `${drive.title} - Assessment`,
      description,
      totalTime: totalTime || 90,
      totalPoints,
      passingScore: passingScore || 60,
      sections: sections || [],
      status: "draft",
      instructions,
      allowedAttempts: 1,
      shuffleQuestions: shuffleQuestions ?? true,
      showResultsAfter: showResultsAfter ?? false,
    })

    // Link to drive
    await DriveModel.update(id, { assessmentId: assessment._id as string })

    return NextResponse.json({ assessment }, { status: 201 })
  } catch (err) {
    console.error("Assessment create error:", err)
    return NextResponse.json({ error: "Failed to create assessment" }, { status: 500 })
  }
}
