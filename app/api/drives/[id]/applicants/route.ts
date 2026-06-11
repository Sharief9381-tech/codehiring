/**
 * GET /api/drives/[id]/applicants
 * Returns the full applicant list for a drive.
 *
 * Flow A (college drive): College views all applicants — no assessment required
 * Flow B (recruiter drive): Company views shortlisted candidates after AI assessment
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
    if (!isDatabaseAvailable()) return NextResponse.json({ applicants: [] })

    const { id } = await params
    const drive: any = await DriveModel.findById(id)
    if (!drive) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const isCollegeDrive   = drive.postedByRole === "college"
    const isRecruiterDrive = drive.postedByRole === "recruiter" || !drive.postedByRole

    // College: can see all applicants from their own drives
    if (user.role === "college" && isCollegeDrive) {
      return NextResponse.json({
        applicants: drive.applicants || [],
        total: drive.applicants?.length || 0,
        driveSource: "college",
        message: "All candidates who applied to your campus drive",
      })
    }

    // Recruiter: sees shortlisted candidates after assessment
    if (user.role === "recruiter" && isRecruiterDrive) {
      const shortlisted = (drive.applicants || [])
        .filter((a: any) => a.status === "shortlisted" || a.status === "hired" || a.status === "offer_sent")
        .sort((a: any, b: any) => (b.assessmentScore ?? 0) - (a.assessmentScore ?? 0))

      // Get assessment details if available
      let assessmentStats = null
      if (drive.assessmentId) {
        const attempts = await AssessmentModel.findAttemptsByAssessment(drive.assessmentId)
        assessmentStats = {
          totalAttempts: attempts.length,
          avgScore: attempts.length
            ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length)
            : 0,
          passRate: attempts.length
            ? Math.round((attempts.filter(a => a.passed).length / attempts.length) * 100)
            : 0,
        }
      }

      return NextResponse.json({
        applicants: shortlisted,
        total: shortlisted.length,
        totalApplied: drive.applicationCount,
        driveSource: "recruiter",
        assessmentStats,
        message: `${shortlisted.length} candidates shortlisted from ${drive.applicationCount} applications after AI-proctored assessment`,
      })
    }

    // Admin can see all
    if (user.role === "admin") {
      return NextResponse.json({ applicants: drive.applicants || [], total: drive.applicants?.length || 0 })
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  } catch (err) {
    console.error("Applicants GET error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
