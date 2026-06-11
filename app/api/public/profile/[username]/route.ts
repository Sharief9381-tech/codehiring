/**
 * GET /api/public/profile/[username]
 * Returns a public student profile by name slug or email prefix.
 * No auth required — safe fields only.
 */
import { NextResponse } from "next/server"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"
import { computeCodeHiringScore } from "@/lib/score"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 })
  }

  try {
    const db = await getDatabase()
    const { username } = await params
    const slug = username.toLowerCase()

    // Search by name slug (lowercase, spaces→hyphens) or email prefix
    const students = await db
      .collection("users")
      .find({ role: "student" }, { projection: { password: 0 } })
      .toArray()

    const student = students.find((s) => {
      const nameSlug = s.name?.toLowerCase().replace(/\s+/g, "-")
      const emailPrefix = s.email?.split("@")[0]?.toLowerCase()
      return nameSlug === slug || emailPrefix === slug
    })

    if (!student) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Compute stats
    let totalProblems = 0, highestRating = 0, githubContributions = 0, contests = 0
    const platformSummary: Record<string, any> = {}

    Object.entries(student.linkedPlatforms || {}).forEach(([pid, data]: [string, any]) => {
      if (!data) return
      const s = data.stats
      const username = data.username || ""
      if (!s) { platformSummary[pid] = { username, connected: true }; return }

      const problems = s.totalSolved || s.problemsSolved || 0
      const rating = Math.max(s.rating || 0, s.currentRating || 0, s.highestRating || 0, s.contestRating || 0)
      const contribs = pid === "github" ? (s.totalContributions || 0) : 0

      totalProblems += problems
      if (pid === "github") githubContributions = contribs
      if (rating > highestRating) highestRating = rating
      contests += s.contests?.length || s.contestsParticipated || s.attendedContestsCount || 0

      platformSummary[pid] = { username, problems, rating, contributions: contribs }
    })

    const codetrackScore = computeCodeHiringScore(student)

    return NextResponse.json({
      profile: {
        name: student.name,
        branch: student.branch || "",
        collegeCode: student.collegeCode || "",
        graduationYear: student.graduationYear || null,
        skills: student.skills || [],
        isOpenToWork: student.isOpenToWork || false,
        linkedinUrl: student.linkedinUrl || null,
        joinedAt: student.createdAt,
      },
      stats: { totalProblems, highestRating, githubContributions, contests },
      platforms: platformSummary,
      codetrackScore,
      slug: student.name?.toLowerCase().replace(/\s+/g, "-"),
    })
  } catch (error) {
    console.error("Public profile error:", error)
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 })
  }
}
