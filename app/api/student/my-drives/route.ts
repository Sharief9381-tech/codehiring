/**
 * GET /api/student/my-drives — student's application status across all drives
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isDatabaseAvailable, getDatabase } from "@/lib/database"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "student") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!isDatabaseAvailable()) return NextResponse.json({ drives: [] })

    const db = await getDatabase()
    const studentId = user._id?.toString()

    // Find all drives where student has applied
    const drives = await db.collection("drives").find(
      { "applicants.studentId": studentId },
      { projection: { title: 1, companyName: 1, status: 1, type: 1, salary: 1, "applicants.$": 1, assessmentId: 1 } }
    ).toArray()

    const result = drives.map(d => {
      const applicant = d.applicants?.[0]
      return {
        _id: d._id.toString(),
        title: d.title,
        companyName: d.companyName,
        status: d.status,
        type: d.type,
        salary: d.salary,
        assessmentId: d.assessmentId,
        myStatus: applicant?.status,
        assessmentScore: applicant?.assessmentScore,
        assessmentRank: applicant?.assessmentRank,
        appliedAt: applicant?.appliedAt,
      }
    })

    return NextResponse.json({ drives: result })
  } catch (err) {
    console.error("My drives error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
