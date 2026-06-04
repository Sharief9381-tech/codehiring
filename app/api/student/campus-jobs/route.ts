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

    console.log("campus-jobs: total active jobs:", allJobs.length)
    console.log("campus-jobs: postedByRole values:", allJobs.map((j: any) => ({ id: j._id, role: j.postedByRole, title: j.title })))

    // On-campus: posted by a college, matching the student's college code
    const onCampus = allJobs.filter((j: any) =>
      j.postedByRole === "college" &&
      (!j.collegeCode || j.collegeCode === collegeCode)
    )

    // Off-campus: posted by recruiters
    // Also include jobs with no postedByRole (legacy jobs before the field was added)
    const offCampus = allJobs.filter((j: any) =>
      j.postedByRole === "recruiter" || (!j.postedByRole && j.recruiterId)
    )

    return NextResponse.json({ onCampus, offCampus })
  } catch (error) {
    console.error("GET /api/student/campus-jobs error:", error)
    return NextResponse.json({ onCampus: [], offCampus: [] })
  }
}
