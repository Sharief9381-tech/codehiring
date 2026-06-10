/**
 * POST /api/drives/[id]/notify — Step 4: Notify eligible candidates
 * Finds eligible students and sends them notifications
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { DriveModel } from "@/lib/models/drive"
import { isDatabaseAvailable, getDatabase } from "@/lib/database"

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== "recruiter" && user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!isDatabaseAvailable()) return NextResponse.json({ error: "DB unavailable" }, { status: 503 })

    const { id } = await params
    const drive = await DriveModel.findById(id)
    if (!drive) return NextResponse.json({ error: "Drive not found" }, { status: 404 })
    if (!["active", "verified"].includes(drive.status)) {
      return NextResponse.json({ error: "Drive must be active to notify candidates" }, { status: 400 })
    }

    const db = await getDatabase()
    const e = drive.eligibility

    // Build MongoDB query for eligible students
    const query: Record<string, any> = { role: "student" }
    if (e.graduationYears?.length) query.graduationYear = { $in: e.graduationYears }
    if (e.branches?.length) query.branch = { $in: e.branches }
    if (e.minCGPA) query.cgpa = { $gte: e.minCGPA }
    if (e.collegeCodes?.length) query.collegeCode = { $in: e.collegeCodes }

    const eligibleStudents = await db.collection("users").find(query, {
      projection: { _id: 1, name: 1, email: 1, collegeCode: 1 }
    }).toArray()

    // Create notifications for each eligible student
    const now = new Date()
    const notifications = eligibleStudents.map(s => ({
      userId: s._id.toString(),
      type: "hiring_drive",
      title: `New Hiring Drive: ${drive.title}`,
      message: `${drive.companyName} is hiring for ${drive.title}. Apply before ${drive.applicationDeadline ? new Date(drive.applicationDeadline).toLocaleDateString() : "the deadline"}.`,
      link: `/student/drives`,
      driveId: id,
      read: false,
      createdAt: now,
    }))

    if (notifications.length > 0) {
      await db.collection("notifications").insertMany(notifications)
    }

    // Update notified count
    await DriveModel.update(id, { notifiedCount: eligibleStudents.length })

    return NextResponse.json({
      success: true,
      notified: eligibleStudents.length,
      message: `${eligibleStudents.length} eligible candidates notified`,
    })
  } catch (err) {
    console.error("Notify error:", err)
    return NextResponse.json({ error: "Failed to notify candidates" }, { status: 500 })
  }
}
