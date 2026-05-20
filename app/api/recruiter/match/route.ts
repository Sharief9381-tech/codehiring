/**
 * GET /api/recruiter/match?studentId=X&jobId=Y
 *
 * Returns a real-time match score between a student and a job.
 * If the student's platform data is stale (>1 hour), triggers a background sync first.
 * Always computes the score from the latest aggregated stats.
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isDatabaseAvailable } from "@/lib/database"
import { UserModel } from "@/lib/models/user"
import { JobModel } from "@/lib/models/job"
import { aggregateStudentStats, computeLiveMatchScore } from "@/lib/services/stats-aggregator"
import { PlatformSyncService } from "@/lib/services/platform-sync"

const STALE_THRESHOLD_MS = 60 * 60 * 1000 // 1 hour

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")
    const jobId = searchParams.get("jobId")

    if (!studentId || !jobId) {
      return NextResponse.json({ error: "studentId and jobId are required" }, { status: 400 })
    }

    const [student, job] = await Promise.all([
      UserModel.findById(studentId),
      JobModel.findById(jobId),
    ])

    if (!student || student.role !== "student") {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Check if any platform data is stale
    const linkedPlatforms = (student.linkedPlatforms ?? {}) as Record<string, any>
    const platformCount = Object.keys(linkedPlatforms).filter(
      (k) => linkedPlatforms[k]?.isActive
    ).length

    const isStale = Object.values(linkedPlatforms).some((p: any) => {
      if (!p?.lastSync) return true
      return Date.now() - new Date(p.lastSync).getTime() > STALE_THRESHOLD_MS
    })

    let stats = student.stats

    if (isStale && platformCount > 0) {
      // Trigger background sync + re-aggregate
      try {
        await PlatformSyncService.syncUserPlatforms(studentId)
        // aggregateStudentStats is called inside syncUserPlatforms now
        const freshUser = await UserModel.findById(studentId)
        stats = freshUser?.stats ?? stats
      } catch (syncErr) {
        console.error("Background sync failed:", syncErr)
        // Fall back to existing stats
        if (!stats) {
          stats = await aggregateStudentStats(studentId)
        }
      }
    } else if (!stats || stats.totalProblems === 0) {
      // Stats never computed — aggregate from existing platform data
      stats = await aggregateStudentStats(studentId)
    }

    const finalStats = stats ?? {
      totalProblems: 0,
      easyProblems: 0,
      mediumProblems: 0,
      hardProblems: 0,
      githubContributions: 0,
      contestsParticipated: 0,
      rating: 0,
    }

    const result = computeLiveMatchScore(
      finalStats,
      student.skills ?? [],
      student.isOpenToWork ?? false,
      platformCount,
      job
    )

    // Platform-level stats for transparency
    const platformStats = Object.entries(linkedPlatforms)
      .filter(([, p]: [string, any]) => p?.isActive && p?.stats)
      .map(([platformId, p]: [string, any]) => ({
        platform: platformId,
        username: p.username,
        lastSync: p.lastSync,
        problems:
          p.stats?.totalSolved ??
          p.stats?.problemsSolved ??
          p.stats?.solved ??
          0,
        rating:
          p.stats?.rating ??
          p.stats?.currentRating ??
          p.stats?.algorithmRating ??
          0,
      }))

    return NextResponse.json({
      studentId,
      jobId,
      matchScore: result.score,
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills,
      breakdown: result.breakdown,
      stats: finalStats,
      platformStats,
      synced: isStale,
      computedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("GET /api/recruiter/match error:", error)
    return NextResponse.json({ error: "Failed to compute match score" }, { status: 500 })
  }
}
