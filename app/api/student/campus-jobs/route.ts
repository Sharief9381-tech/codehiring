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

    // On-campus: posted by a college, matching the student's college code
    const onCampus = allJobs.filter((j: any) =>
      j.postedByRole === "college" &&
      (!j.collegeCode || j.collegeCode === collegeCode)
    )

    // Off-campus: posted by recruiters
    const offCampus = allJobs.filter((j: any) => j.postedByRole === "recruiter")

    return NextResponse.json({ onCampus, offCampus })
  } catch (error) {
    console.error("GET /api/student/campus-jobs error:", error)
    return NextResponse.json({ onCampus: [], offCampus: [] })
  }
}
