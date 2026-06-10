/**
 * GET /api/student/campus-jobs
 * Returns active jobs split into:
 *   - onCampus:  posted by colleges (postedByRole === "college")
 *   - offCampus: posted by recruiters (postedByRole === "recruiter")
 * Filtered to only jobs the student is eligible for.
 */
import { NextResponse } from "next/server"
import { JobModel } from "@/lib/models/job"
import { isDatabaseAvailable } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ onCampus: [], offCampus: [] })
    }

    const user = await getCurrentUser()
    if (!user || user.role !== "student") {
      return NextResponse.json({ onCampus: [], offCampus: [] })
    }

    const student = await UserModel.findById(user._id as string)
    if (!student) return NextResponse.json({ onCampus: [], offCampus: [] })

    const collegeCode = (student as any).collegeCode || ""
    const allJobs = await JobModel.findAll({ status: "active" })

    // On-campus: posted by a college, matching the student's college code
    const onCampus = allJobs.filter((j: any) =>
      j.postedByRole === "college" &&
      (!j.collegeCode || j.collegeCode === collegeCode)
    )

    // Off-campus: posted by recruiters
    const offCampus = allJobs.filter((j: any) =>
      j.postedByRole === "recruiter" || (!j.postedByRole && j.recruiterId)
    )

    // Fetch college info + announcements for the student
    let collegeInfo: any = null
    let announcements: any[] = []
    if (collegeCode) {
      try {
        const db = await import("@/lib/database").then(m => m.getDatabase())
        const college = await db.collection("users").findOne({ role: "college", collegeCode })
        if (college) {
          collegeInfo = {
            name: college.collegeName ?? college.name,
            code: college.collegeCode,
            location: college.location,
            tpoName: college.placementOfficerName,
            tpoEmail: college.placementOfficerEmail,
          }
          // Fetch recent announcements from the college's announcement collection
          const annDocs = await db.collection("announcements")
            .find({ collegeCode, $or: [{ audience: "all" }, { branch: (student as any).branch }] })
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray()
          announcements = annDocs.map((a: any) => ({
            id: a._id?.toString(),
            title: a.title,
            message: a.message,
            type: a.type ?? "general",
            createdAt: a.createdAt,
          }))
        }
      } catch { /* non-fatal */ }
    }

    return NextResponse.json({ onCampus, offCampus, collegeInfo, announcements })
  } catch (error) {
    console.error("GET /api/student/campus-jobs error:", error)
    return NextResponse.json({ onCampus: [], offCampus: [] })
  }
}
