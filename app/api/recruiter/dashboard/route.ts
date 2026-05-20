/**
 * GET /api/recruiter/dashboard
 * Returns real-time stats for the recruiter dashboard.
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isDatabaseAvailable } from "@/lib/database"
import { JobModel } from "@/lib/models/job"
import { ShortlistModel } from "@/lib/models/shortlist"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isDatabaseAvailable()) {
      return NextResponse.json({
        activeJobs: 0,
        totalApplications: 0,
        totalShortlisted: 0,
        totalInterviewed: 0,
        shortlists: [],
        pipeline: [],
      })
    }

    const recruiterId = user._id?.toString() ?? ""

    const [jobs, shortlists] = await Promise.all([
      JobModel.findAll({ recruiterId }),
      ShortlistModel.findByRecruiter(recruiterId),
    ])

    const activeJobs = jobs.filter((j) => j.status === "active").length
    const totalApplications = jobs.reduce((sum, j) => sum + (j.applications ?? 0), 0)

    // Flatten all candidates across all shortlists
    const allCandidates = shortlists.flatMap((s) => s.candidates)
    const totalShortlisted = allCandidates.length
    const totalInterviewed = allCandidates.filter((c) =>
      ["Technical Interview", "HR Interview", "Offer Sent", "Accepted"].includes(c.stage)
    ).length

    // Pipeline stage counts
    const stageOrder = ["Screening", "Technical Interview", "HR Interview", "Offer Sent", "Accepted", "Rejected"]
    const pipeline = stageOrder.map((stage) => ({
      stage,
      count: allCandidates.filter((c) => c.stage === stage).length,
    }))

    // Recent shortlists (last 4)
    const recentShortlists = shortlists.slice(0, 4).map((s) => ({
      _id: s._id,
      name: s.name,
      candidates: s.candidates.length,
      status: s.status,
      updatedAt: s.updatedAt,
    }))

    return NextResponse.json({
      activeJobs,
      totalApplications,
      totalShortlisted,
      totalInterviewed,
      shortlists: recentShortlists,
      pipeline,
    })
  } catch (error) {
    console.error("GET /api/recruiter/dashboard error:", error)
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 })
  }
}
