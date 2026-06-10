/**
 * Recruiter jobs API
 * GET  /api/recruiter/jobs  — list jobs posted by the logged-in recruiter
 * POST /api/recruiter/jobs  — create a new job posting
 */
import { NextResponse } from "next/server"
import { JobModel } from "@/lib/models/job"
import { isDatabaseAvailable } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isDatabaseAvailable()) {
      return NextResponse.json({ jobs: [] })
    }

    const jobs = await JobModel.findAll({ recruiterId: user._id?.toString() })
    return NextResponse.json({ jobs })
  } catch (error) {
    console.error("GET /api/recruiter/jobs error:", error)
    return NextResponse.json({ jobs: [] })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const recruiter = user as any
    const body = await request.json()
    const {
      title, type, location, salary, description,
      skills, deadline, minProblems, minRating, minCGPA,
      status = "active",
      allowedBranches, allowedGradYears, allowedDegrees,
    } = body

    if (!title || !type || !location || !description) {
      return NextResponse.json(
        { error: "title, type, location, and description are required" },
        { status: 400 }
      )
    }

    const jobData = {
      recruiterId: recruiter._id?.toString() ?? "",
      recruiterName: recruiter.name,
      companyName: body.companyName || recruiter.companyName || "",
      companyWebsite: recruiter.companyWebsite ?? "",
      postedByRole: "recruiter" as const,
      title,
      type,
      location,
      salary: salary || "Not specified",
      description,
      skills: Array.isArray(skills)
        ? skills
        : (skills as string || "").split(",").map((s: string) => s.trim()).filter(Boolean),
      deadline: deadline || undefined,
      minProblems: minProblems ? Number(minProblems) : 0,
      minRating: minRating ? Number(minRating) : 0,
      minCGPA: minCGPA ? Number(minCGPA) : 0,
      allowedBranches: allowedBranches
        ? (Array.isArray(allowedBranches) ? allowedBranches : String(allowedBranches).split(",").map((s: string) => s.trim()).filter(Boolean))
        : [],
      allowedGradYears: allowedGradYears
        ? (Array.isArray(allowedGradYears) ? allowedGradYears : String(allowedGradYears).split(",").map((s: string) => Number(s.trim())).filter(Boolean))
        : [],
      allowedDegrees: allowedDegrees
        ? (Array.isArray(allowedDegrees) ? allowedDegrees : String(allowedDegrees).split(",").map((s: string) => s.trim()).filter(Boolean))
        : [],
      status,
    }

    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
    }

    const job = await JobModel.create(jobData)
    return NextResponse.json({ success: true, job }, { status: 201 })
  } catch (error) {
    console.error("POST /api/recruiter/jobs error:", error)
    return NextResponse.json({ error: "Failed to create job posting" }, { status: 500 })
  }
}
