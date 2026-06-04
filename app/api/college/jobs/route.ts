/**
 * College jobs API
 * GET  /api/college/jobs  — list jobs posted by the logged-in college
 * POST /api/college/jobs  — create a new on-campus job/drive
 */
import { NextResponse } from "next/server"
import { JobModel } from "@/lib/models/job"
import { isDatabaseAvailable } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "college") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isDatabaseAvailable()) {
      return NextResponse.json({ jobs: [] })
    }

    const jobs = await JobModel.findAll({ recruiterId: user._id?.toString() })
    return NextResponse.json({ jobs })
  } catch (error) {
    console.error("GET /api/college/jobs error:", error)
    return NextResponse.json({ jobs: [] })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "college") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const college = user as any
    const body = await request.json()
    const {
      title, type, location, salary, description,
      skills, deadline, minProblems, minRating, minCGPA,
      status = "active",
      applyUrl = "",
    } = body

    if (!title || !type || !description) {
      return NextResponse.json(
        { error: "title, type, and description are required" },
        { status: 400 }
      )
    }

    const jobData = {
      recruiterId: college._id?.toString() ?? "",
      recruiterName: college.name,
      companyName: college.collegeName ?? college.name,
      companyWebsite: college.website ?? "",
      applyUrl: applyUrl || undefined,
      postedByRole: "college" as const,
      collegeCode: college.collegeCode ?? "",
      title,
      type,
      location: location || college.location || "On Campus",
      salary: salary || "Not disclosed",
      description,
      skills: Array.isArray(skills)
        ? skills
        : (skills as string || "").split(",").map((s: string) => s.trim()).filter(Boolean),
      deadline: deadline || undefined,
      minProblems: minProblems ? Number(minProblems) : 0,
      minRating: minRating ? Number(minRating) : 0,
      minCGPA: minCGPA ? Number(minCGPA) : 0,
      status,
    }

    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
    }

    const job = await JobModel.create(jobData)
    return NextResponse.json({ success: true, job }, { status: 201 })
  } catch (error) {
    console.error("POST /api/college/jobs error:", error)
    return NextResponse.json({ error: "Failed to create job posting" }, { status: 500 })
  }
}
