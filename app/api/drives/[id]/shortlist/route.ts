/**
 * POST /api/drives/[id]/shortlist — Step 8: Generate shortlist from assessment scores
 * GET  — fetch current shortlist
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
    const drive = await DriveModel.findById(id)
    if (!drive) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const shortlisted = (drive.applicants || []).filter(a => a.status === "shortlisted")
      .sort((a, b) => (b.assessmentScore ?? 0) - (a.assessmentScore ?? 0))
    return NextResponse.json({ shortlisted, total: shortlisted.length })
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
    const { topN, minScore, studentIds } = await req.json()
    // topN: take top N candidates
    // minScore: minimum assessment score %
    // studentIds: manually selected

    const drive = await DriveModel.findById(id)
    if (!drive) return NextResponse.json({ error: "Drive not found" }, { status: 404 })

    let toShortlist: string[] = []

    if (studentIds?.length) {
      // Manual selection
      toShortlist = studentIds
    } else if (drive.assessmentId) {
      // Auto from assessment scores
      const attempts = await AssessmentModel.findAttemptsByAssessment(drive.assessmentId)
      const passed = attempts
        .filter(a => a.status === "evaluated" && (!minScore || a.percentage >= minScore))
        .sort((a, b) => (b.percentage - a.percentage) || (a.rank ?? 999) - (b.rank ?? 999))
        .slice(0, topN || drive.openPositions * 3)
      toShortlist = passed.map(a => a.studentId)
    } else {
      // No assessment — shortlist by CodeHiring score
      const sorted = (drive.applicants || [])
        .filter(a => a.status === "applied")
        .sort((a, b) => (b.codeHiringScore ?? 0) - (a.codeHiringScore ?? 0))
        .slice(0, topN || drive.openPositions * 3)
      toShortlist = sorted.map(a => a.studentId)
    }

    // Update all applicants
    const db_ops = toShortlist.map(studentId =>
      DriveModel.updateApplicantStatus(id, studentId, "shortlisted")
    )
    await Promise.all(db_ops)

    // Reject non-shortlisted applied candidates
    const allApplicants = drive.applicants || []
    const rejectOps = allApplicants
      .filter(a => a.status === "applied" && !toShortlist.includes(a.studentId))
      .map(a => DriveModel.updateApplicantStatus(id, a.studentId, "rejected"))
    await Promise.all(rejectOps)

    // Advance drive status
    await DriveModel.advanceStatus(id, "shortlisted", `Shortlisted ${toShortlist.length} candidates`)
    await DriveModel.update(id, { shortlistedCount: toShortlist.length })

    return NextResponse.json({
      success: true,
      shortlistedCount: toShortlist.length,
      message: `${toShortlist.length} candidates shortlisted`,
    })
  } catch (err) {
    console.error("Shortlist error:", err)
    return NextResponse.json({ error: "Failed to generate shortlist" }, { status: 500 })
  }
}
