/**
 * POST /api/drives/[id]/apply — Step 5: Candidate applies to drive
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { DriveModel } from "@/lib/models/drive"
import { UserModel } from "@/lib/models/user"
import { isDatabaseAvailable } from "@/lib/database"

function getStats(student: any) {
  let totalProblems = 0, highestRating = 0
  Object.entries(student.linkedPlatforms || {}).forEach(([, data]: [string, any]) => {
    if (!data?.stats) return
    const s = data.stats
    totalProblems += s.totalSolved || s.problemsSolved || 0
    const r = Math.max(s.rating || 0, s.currentRating || 0, s.highestRating || 0)
    if (r > highestRating) highestRating = r
  })
  return { totalProblems, highestRating }
}

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "student") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!isDatabaseAvailable()) return NextResponse.json({ error: "DB unavailable" }, { status: 503 })

    const { id } = await params
    const drive = await DriveModel.findById(id)
    if (!drive) return NextResponse.json({ error: "Drive not found" }, { status: 404 })
    if (!["active", "assessment"].includes(drive.status)) return NextResponse.json({ error: "Applications closed" }, { status: 400 })

    // Check deadline
    if (drive.applicationDeadline && new Date(drive.applicationDeadline) < new Date()) {
      return NextResponse.json({ error: "Application deadline passed" }, { status: 400 })
    }

    // Check already applied
    const alreadyApplied = drive.applicants?.some(a => a.studentId === user._id?.toString())
    if (alreadyApplied) return NextResponse.json({ error: "Already applied", alreadyApplied: true }, { status: 400 })

    const student = await UserModel.findById(user._id as string) as any
    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 })

    const { totalProblems, highestRating } = getStats(student)

    await DriveModel.addApplicant(id, {
      studentId: user._id as string,
      name: student.name,
      email: student.email,
      college: student.collegeCode || student.collegeName || "",
      branch: student.branch,
      graduationYear: student.graduationYear,
      skills: student.skills || [],
      totalProblems,
      highestRating,
      appliedAt: new Date(),
      status: "applied",
    })

    return NextResponse.json({ success: true, message: "Application submitted successfully" })
  } catch (err) {
    console.error("Drive apply error:", err)
    return NextResponse.json({ error: "Failed to apply" }, { status: 500 })
  }
}
