/**
 * POST /api/student/jobs/apply
 * Records a student's application against a job.
 * Stores applicant details in the job document and increments the counter.
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"
import { ObjectId } from "mongodb"

function getStudentStats(student: any) {
  let totalProblems = 0, highestRating = 0, githubContributions = 0
  Object.entries(student.linkedPlatforms || {}).forEach(([pid, data]: [string, any]) => {
    if (!data?.stats) return
    const s = data.stats
    totalProblems += s.totalSolved || s.problemsSolved || 0
    if (pid === "github") githubContributions = s.totalContributions || 0
    const r = Math.max(s.rating || 0, s.currentRating || 0, s.highestRating || 0, s.contestRating || 0)
    if (r > highestRating) highestRating = r
  })
  return { totalProblems, highestRating, githubContributions }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { jobId } = await request.json()
    if (!jobId) return NextResponse.json({ error: "jobId required" }, { status: 400 })

    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: "DB unavailable" }, { status: 503 })
    }

    const db = await getDatabase()

    // Check job exists and is active
    const job = await db.collection("jobs").findOne({ _id: new ObjectId(jobId), status: "active" })
    if (!job) return NextResponse.json({ error: "Job not found or closed" }, { status: 404 })

    // Check already applied
    const alreadyApplied = (job.applicants ?? []).some(
      (a: any) => a.studentId === user._id?.toString()
    )
    if (alreadyApplied) {
      return NextResponse.json({ error: "Already applied", alreadyApplied: true }, { status: 400 })
    }

    // Get student details
    const student = await UserModel.findById(user._id as string)
    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 })

    const stats = getStudentStats(student)
    const platforms = Object.keys((student as any).linkedPlatforms || {}).filter(
      k => (student as any).linkedPlatforms[k]
    )

    const applicant = {
      studentId: user._id?.toString(),
      name: student.name,
      email: student.email,
      college: (student as any).collegeCode || "",
      branch: (student as any).branch || "",
      graduationYear: (student as any).graduationYear || null,
      skills: (student as any).skills || [],
      platforms,
      totalProblems: stats.totalProblems,
      highestRating: stats.highestRating,
      githubContributions: stats.githubContributions,
      linkedinUrl: (student as any).linkedinUrl || null,
      isGraduate: !!(student as any).isGraduate,
      appliedAt: new Date(),
      status: "applied", // applied | shortlisted | rejected | hired
    }

    // Add applicant to job
    await db.collection("jobs").updateOne(
      { _id: new ObjectId(jobId) },
      {
        $push: { applicants: applicant } as any,
        $inc: { applications: 1 },
        $set: { updatedAt: new Date() },
      }
    )

    return NextResponse.json({ success: true, message: "Application submitted successfully" })
  } catch (error) {
    console.error("Apply error:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}
