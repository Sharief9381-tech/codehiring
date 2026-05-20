/**
 * Recruiter jobs API
 * GET  /api/recruiter/jobs          — list all jobs posted by this recruiter
 * POST /api/recruiter/jobs          — create a new job posting
 */
import { NextResponse } from "next/server"
import { JobModel } from "@/lib/models/job"
import { isDatabaseAvailable } from "@/lib/database"

// In-memory fallback store when DB is unavailable
const memJobs: any[] = []

export async function GET() {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ jobs: memJobs })
    }
    const jobs = await JobModel.findAll()
    return NextResponse.json({ jobs })
  } catch (error) {
    console.error("GET /api/recruiter/jobs error:", error)
    return NextResponse.json({ jobs: memJobs })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title, type, location, salary, description,
      skills, deadline, minProblems, minRating, minCGPA,
      status = "active",
      // Recruiter identity — passed from the client
      recruiterName = "Recruiter",
      companyName = "Company",
      companyWebsite = "",
    } = body

    if (!title || !type || !location || !description) {
      return NextResponse.json(
        { error: "title, type, location, and description are required" },
        { status: 400 }
      )
    }

    const jobData = {
      recruiterId: "demo-recruiter",
      recruiterName,
      companyName,
      companyWebsite,
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
      status,
    }

    if (!isDatabaseAvailable()) {
      const newJob = {
        ...jobData,
        _id: `mem-${Date.now()}`,
        applications: 0,
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      memJobs.unshift(newJob)
      return NextResponse.json({ success: true, job: newJob }, { status: 201 })
    }

    const job = await JobModel.create(jobData)
    return NextResponse.json({ success: true, job }, { status: 201 })
  } catch (error) {
    console.error("POST /api/recruiter/jobs error:", error)
    return NextResponse.json(
      { error: "Failed to create job posting" },
      { status: 500 }
    )
  }
}
