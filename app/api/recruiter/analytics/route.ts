/**
 * GET /api/recruiter/analytics
 * Returns real analytics data for the recruiter.
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
      return NextResponse.json({ empty: true })
    }

    const recruiterId = user._id?.toString() ?? ""

    const [jobs, shortlists] = await Promise.all([
      JobModel.findAll({ recruiterId }),
      ShortlistModel.findByRecruiter(recruiterId),
    ])

    const allCandidates = shortlists.flatMap((s) => s.candidates)
    const totalShortlisted = allCandidates.length

    // Hiring funnel
    const stages = ["Screening", "Technical Interview", "HR Interview", "Offer Sent", "Accepted"]
    const hiringFunnel = stages.map((stage) => ({
      name: stage,
      value: allCandidates.filter((c) => {
        // Funnel is cumulative — count everyone who reached this stage or beyond
        const stageIndex = stages.indexOf(stage)
        const candidateIndex = stages.indexOf(c.stage)
        return candidateIndex >= stageIndex
      }).length,
    }))

    // Total applications across all jobs
    const totalApplications = jobs.reduce((sum, j) => sum + (j.applications ?? 0), 0)
    const totalHired = allCandidates.filter((c) => c.stage === "Accepted").length
    const totalOffered = allCandidates.filter((c) => ["Offer Sent", "Accepted"].includes(c.stage)).length

    // Conversion rate: hired / total applications
    const conversionRate = totalApplications > 0
      ? ((totalHired / totalApplications) * 100).toFixed(1)
      : "0.0"

    // Offer acceptance rate
    const offerAcceptance = totalOffered > 0
      ? Math.round((totalHired / totalOffered) * 100)
      : 0

    // Jobs by status
    const activeJobs = jobs.filter((j) => j.status === "active").length
    const closedJobs = jobs.filter((j) => j.status === "closed").length
    const draftJobs = jobs.filter((j) => j.status === "draft").length

    // Weekly application trend (last 6 weeks based on job createdAt as proxy)
    const now = new Date()
    const weeklyTrend = Array.from({ length: 6 }, (_, i) => {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - (5 - i) * 7)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 7)

      const weekJobs = jobs.filter((j) => {
        const created = new Date(j.createdAt)
        return created >= weekStart && created < weekEnd
      })
      const applications = weekJobs.reduce((sum, j) => sum + (j.applications ?? 0), 0)

      return {
        week: `W${i + 1}`,
        applications,
        shortlisted: allCandidates.filter((c) => {
          const added = new Date(c.addedAt)
          return added >= weekStart && added < weekEnd
        }).length,
      }
    })

    // Stage breakdown for pipeline
    const stageBreakdown = ["Screening", "Technical Interview", "HR Interview", "Offer Sent", "Accepted", "Rejected"].map(
      (stage) => ({
        stage,
        count: allCandidates.filter((c) => c.stage === stage).length,
      })
    )

    return NextResponse.json({
      summary: {
        conversionRate,
        offerAcceptance,
        totalHired,
        totalOffered,
        activeJobs,
        closedJobs,
        draftJobs,
        totalApplications,
        totalShortlisted,
      },
      hiringFunnel,
      weeklyTrend,
      stageBreakdown,
    })
  } catch (error) {
    console.error("GET /api/recruiter/analytics error:", error)
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 })
  }
}
