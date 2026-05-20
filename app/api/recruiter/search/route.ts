/**
 * GET /api/recruiter/search
 * Search real students from MongoDB with optional filters.
 * Stats are always read from user.stats (kept fresh by platform sync + aggregator).
 *
 * Query params:
 *   q           — name/skill keyword
 *   minProblems — number
 *   minRating   — number
 *   skills      — comma-separated list
 *   colleges    — comma-separated list
 *   openToWork  — "true"
 *   sort        — "match" | "problems" | "rating"
 *   jobId       — compute match score against this specific job
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isDatabaseAvailable } from "@/lib/database"
import { UserModel } from "@/lib/models/user"
import { JobModel } from "@/lib/models/job"
import { computeMatchScore } from "@/lib/services/job-matcher"
import { aggregateStudentStats } from "@/lib/services/stats-aggregator"

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isDatabaseAvailable()) {
      return NextResponse.json({ candidates: [] })
    }

    const { searchParams } = new URL(request.url)
    const q = searchParams.get("q") ?? ""
    const minProblems = Number(searchParams.get("minProblems") ?? 0)
    const minRating = Number(searchParams.get("minRating") ?? 0)
    const skillsParam = searchParams.get("skills") ?? ""
    const collegesParam = searchParams.get("colleges") ?? ""
    const openToWork = searchParams.get("openToWork")
    const sort = searchParams.get("sort") ?? "match"
    const jobId = searchParams.get("jobId")

    const job = jobId ? await JobModel.findById(jobId) : null
    const students = await UserModel.findByRole("student")

    const filterSkills = skillsParam
      ? skillsParam.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
      : []
    const filterColleges = collegesParam
      ? collegesParam.split(",").map((c) => c.trim().toLowerCase()).filter(Boolean)
      : []

    // For students whose stats are missing/zero but have linked platforms,
    // re-aggregate from stored platform data (fast — no external API calls)
    const studentsWithStats = await Promise.all(
      students.map(async (s) => {
        const hasLinkedPlatforms =
          Object.keys(s.linkedPlatforms ?? {}).length > 0
        const statsEmpty =
          !s.stats || (s.stats.totalProblems === 0 && s.stats.rating === 0)

        if (hasLinkedPlatforms && statsEmpty) {
          try {
            const freshStats = await aggregateStudentStats(s._id!.toString())
            return { ...s, stats: freshStats }
          } catch {
            return s
          }
        }
        return s
      })
    )

    const results = studentsWithStats
      .filter((s) => {
        // Keyword search
        if (q) {
          const qLower = q.toLowerCase()
          const nameMatch = s.name?.toLowerCase().includes(qLower)
          const skillMatch = (s.skills as string[] ?? []).some((sk: string) =>
            sk.toLowerCase().includes(qLower)
          )
          const collegeMatch =
            (s as any).collegeName?.toLowerCase().includes(qLower) ||
            s.collegeCode?.toLowerCase().includes(qLower)
          if (!nameMatch && !skillMatch && !collegeMatch) return false
        }

        const totalProblems = s.stats?.totalProblems ?? 0
        const rating = s.stats?.rating ?? 0

        if (totalProblems < minProblems) return false
        if (rating < minRating) return false

        if (filterSkills.length > 0) {
          const studentSkills = (s.skills as string[] ?? []).map((sk: string) =>
            sk.toLowerCase()
          )
          if (!filterSkills.some((fs) => studentSkills.includes(fs))) return false
        }

        if (filterColleges.length > 0) {
          const collegeName = (
            (s as any).collegeName ?? s.collegeCode ?? ""
          ).toLowerCase()
          if (!filterColleges.some((fc) => collegeName.includes(fc))) return false
        }

        if (openToWork === "true" && !(s as any).isOpenToWork) return false

        return true
      })
      .map((s) => {
        const totalProblems = s.stats?.totalProblems ?? 0
        const rating = s.stats?.rating ?? 0
        const linkedPlatforms = (s.linkedPlatforms ?? {}) as Record<string, any>
        const platformCount = Object.keys(linkedPlatforms).filter(
          (k) => linkedPlatforms[k]?.isActive
        ).length

        let matchScore = 0
        if (job) {
          matchScore = computeMatchScore(
            {
              skills: s.skills ?? [],
              totalProblems,
              rating,
              platformCount,
              isOpenToWork: (s as any).isOpenToWork ?? false,
            },
            job
          )
        } else {
          // Generic activity score when no job is specified
          matchScore = Math.min(
            100,
            Math.round(
              Math.min(totalProblems / 5, 40) +
                Math.min(rating / 30, 40) +
                (platformCount > 0 ? 10 : 0) +
                ((s as any).isOpenToWork ? 10 : 0)
            )
          )
        }

        const platforms = Object.keys(linkedPlatforms).filter(
          (k) => linkedPlatforms[k]?.isActive
        )

        // Last sync time across all platforms
        const lastSyncTimes = Object.values(linkedPlatforms)
          .map((p: any) => p?.lastSync)
          .filter(Boolean)
          .map((t) => new Date(t).getTime())
        const lastSync =
          lastSyncTimes.length > 0
            ? new Date(Math.max(...lastSyncTimes)).toISOString()
            : null

        return {
          _id: s._id?.toString(),
          name: s.name,
          college: (s as any).collegeName ?? s.collegeCode ?? "Unknown",
          branch: (s as any).branch ?? "",
          year: (s as any).graduationYear ?? null,
          matchScore,
          problems: totalProblems,
          rating,
          skills: s.skills ?? [],
          platforms,
          isOpenToWork: (s as any).isOpenToWork ?? false,
          linkedinUrl: (s as any).linkedinUrl ?? null,
          lastSync,
          stats: {
            totalProblems,
            easyProblems: s.stats?.easyProblems ?? 0,
            mediumProblems: s.stats?.mediumProblems ?? 0,
            hardProblems: s.stats?.hardProblems ?? 0,
            githubContributions: s.stats?.githubContributions ?? 0,
            contestsParticipated: s.stats?.contestsParticipated ?? 0,
            rating,
          },
        }
      })

    results.sort((a, b) => {
      if (sort === "problems") return b.problems - a.problems
      if (sort === "rating") return b.rating - a.rating
      return b.matchScore - a.matchScore
    })

    return NextResponse.json({ candidates: results, total: results.length })
  } catch (error) {
    console.error("GET /api/recruiter/search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
