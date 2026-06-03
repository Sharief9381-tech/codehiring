/**
 * GET /api/recruiter/jobs/[id]/applicants
 * Returns all applicants for a specific job (recruiter only).
 * PATCH — update applicant status (shortlist/reject/hire)
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"
import { ObjectId } from "mongodb"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isDatabaseAvailable()) return NextResponse.json({ applicants: [] })

    const { id } = await params
    const db = await getDatabase()
    const job = await db.collection("jobs").findOne(
      { _id: new ObjectId(id), recruiterId: user._id?.toString() },
      { projection: { applicants: 1, title: 1, companyName: 1, applications: 1 } }
    )

    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 })

    return NextResponse.json({
      jobTitle: job.title,
      companyName: job.companyName,
      applicants: job.applicants ?? [],
      total: job.applications ?? 0,
    })
  } catch (error) {
    console.error("Applicants GET error:", error)
    return NextResponse.json({ error: "Failed to fetch applicants" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { studentId, status } = await request.json()

    if (!studentId || !status) {
      return NextResponse.json({ error: "studentId and status required" }, { status: 400 })
    }

    const db = await getDatabase()
    await db.collection("jobs").updateOne(
      { _id: new ObjectId(id), "applicants.studentId": studentId },
      { $set: { "applicants.$.status": status, updatedAt: new Date() } }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Applicants PATCH error:", error)
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
  }
}
