/**
 * /api/drives
 * POST creates a drive — goes live immediately (status=active, no review needed)
 * GET - list drives (admin: all, recruiter: own, student: eligible)
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { DriveModel } from "@/lib/models/drive"
import { isDatabaseAvailable } from "@/lib/database"

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!isDatabaseAvailable()) return NextResponse.json({ drives: [] })

    let drives: any[]
    if (user.role === "admin") {
      drives = await DriveModel.findAll()
    } else if (user.role === "recruiter") {
      drives = await DriveModel.findByRecruiter(user._id as string)
    } else if (user.role === "student") {
      const u = user as any
      drives = await DriveModel.findEligibleFor({
        graduationYear: u.graduationYear,
        degree: u.degree,
        branch: u.branch,
        skills: u.skills,
        collegeCode: u.collegeCode,
      })
    } else if (user.role === "college") {
      const u = user as any
      drives = await DriveModel.findAll({
        $or: [{ "eligibility.collegeCodes": u.collegeCode }, { "eligibility.collegeCodes": { $size: 0 } }],
        status: { $ne: "cancelled" },
      })
    } else {
      drives = []
    }

    return NextResponse.json({ drives })
  } catch (error) {
    console.error("Drives GET error:", error)
    return NextResponse.json({ error: "Failed to fetch drives" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== "recruiter" && user.role !== "college")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!isDatabaseAvailable()) return NextResponse.json({ error: "DB unavailable" }, { status: 503 })

    const body = await req.json()
    const {
      title, type, description, location, salary, openPositions,
      hiringTimeline, applicationDeadline, assessmentDate, resultDate,
      joiningDate, selectionProcess, eligibility,
    } = body

    if (!title || !type || !description || !location) {
      return NextResponse.json({ error: "title, type, description and location are required" }, { status: 400 })
    }

    const u = user as any
    const drive = await DriveModel.create({
      recruiterId: user._id as string,
      recruiterName: u.name,
      companyName: body.companyName || u.companyName || u.name,
      companyWebsite: u.companyWebsite,
      postedByRole: user.role,
      title,
      type: type || "Full-time",
      description,
      location,
      salary: salary || "Competitive",
      openPositions: openPositions || 1,
      hiringTimeline: hiringTimeline || "",
      applicationDeadline: applicationDeadline || "",
      assessmentDate,
      resultDate,
      joiningDate,
      selectionProcess: selectionProcess || ["Online Assessment", "Technical Interview", "HR Interview"],
      eligibility: eligibility || {},
      status: "active",   // goes live immediately — no admin review needed
      statusHistory: [{ status: "active", at: new Date(), note: "Drive created and published" }],
    })

    return NextResponse.json({ drive }, { status: 201 })
  } catch (error) {
    console.error("Drives POST error:", error)
    return NextResponse.json({ error: "Failed to create drive" }, { status: 500 })
  }
}
