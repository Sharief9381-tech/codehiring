/**
 * POST /api/drives/[id]/interview — Step 10: Schedule interview for a candidate
 * GET  — list all interviews for a drive
 * PATCH — update interview result/feedback
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { DriveModel } from "@/lib/models/drive"
import { isDatabaseAvailable, getDatabase } from "@/lib/database"
import { ObjectId } from "mongodb"

const COLLECTION = "interviews"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!isDatabaseAvailable()) return NextResponse.json({ interviews: [] })
    const { id } = await params
    const db = await getDatabase()
    const interviews = await db.collection(COLLECTION).find({ driveId: id }).sort({ scheduledAt: 1 }).toArray()
    return NextResponse.json({ interviews: interviews.map(d => ({ ...d, _id: d._id?.toString() })) })
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

    const { id: driveId } = await params
    const {
      studentId, studentName, studentEmail,
      scheduledAt, durationMinutes, type,
      interviewerName, meetLink, notes,
    } = await req.json()

    const db = await getDatabase()
    const now = new Date()

    const interview = {
      driveId,
      recruiterId: user._id as string,
      studentId,
      studentName,
      studentEmail,
      scheduledAt: new Date(scheduledAt),
      durationMinutes: durationMinutes || 45,
      type: type || "Technical",   // Technical | HR | Panel
      status: "scheduled",          // scheduled | completed | cancelled | no_show
      interviewerName,
      meetLink,
      notes,
      result: null,                 // pass | fail | hold
      feedback: null,
      rating: null,                 // 1-5
      createdAt: now,
      updatedAt: now,
    }

    const res = await db.collection(COLLECTION).insertOne(interview)

    // Update applicant stage in drive
    await DriveModel.updateApplicantStatus(driveId, studentId, "applied", {
      interviewStage: type || "Technical",
    })

    // Send notification (non-blocking)
    if (studentEmail) {
      console.log(`Interview scheduled: ${studentEmail} @ ${scheduledAt}`)
    }

    return NextResponse.json({ success: true, interviewId: res.insertedId.toString() }, { status: 201 })
  } catch (err) {
    console.error("Interview schedule error:", err)
    return NextResponse.json({ error: "Failed to schedule interview" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== "recruiter" && user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!isDatabaseAvailable()) return NextResponse.json({ error: "DB unavailable" }, { status: 503 })

    const { interviewId, status, result, feedback, rating } = await req.json()
    const db = await getDatabase()

    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(interviewId) },
      { $set: { status, result, feedback, rating, updatedAt: new Date() } }
    )

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
