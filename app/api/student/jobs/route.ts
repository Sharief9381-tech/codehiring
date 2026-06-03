/**
 * Student jobs API
 * GET /api/student/jobs?skills=Python,Java&problems=150&rating=1400&platforms=3&openToWork=true
 *
 * Returns ONLY jobs the student is eligible for (meets ALL recruiter requirements).
 * Sorted by match score descending.
 */
import { NextResponse } from "next/server"
import { JobModel } from "@/lib/models/job"
import { matchJobsToStudent } from "@/lib/services/job-matcher"
import { isDatabaseAvailable } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"

function getStudentStats(student: any) {
  let totalProblems = 0, rating = 0
  Object.entries(student.linkedPlatforms || {}).forEach(([pid, data]: [string, any]) => {
    if (!data?.stats) return
    const s = data.stats
    totalProblems += s.totalSolved || s.problemsSolved || 0
    const r = Math.max(s.rating || 0, s.currentRating || 0, s.highestRating || 0, s.contestRating || 0)
    if (r > rating) rating = r
  })
  return { totalProblems, rating }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Try to get real stats from DB (more accurate than client-sent params)
    let totalProblems = Number(searchParams.get("problems") || 0)
    let rating = Number(searchParams.get("rating") || 0)
    let skills: string[] = []
    let platformCount = Number(searchParams.get("platforms") || 0)
    let isOpenToWork = searchParams.get("openToWork") !== "false"
    let minCGPA = 0 // future use

    try {
      const user = await getCurrentUser()
      if (user) {
        const student = await UserModel.findById(user._id as string)
        if (student) {
          const realStats = getStudentStats(student)
          totalProblems = realStats.totalProblems
          rating = realStats.rating
          skills = (student as any).skills || []
          platformCount = Object.keys((student as any).linkedPlatforms || {}).filter(
            k => (student as any).linkedPlatforms[k]
          ).length
          isOpenToWork = (student as any).isOpenToWork ?? true
        }
      }
    } catch {
      // Fall back to query params if auth fails
      const skillsParam = searchParams.get("skills") || ""
      skills = skillsParam ? skillsParam.split(",").map(s => s.trim()).filter(Boolean) : []
    }

    const studentProfile = { skills, totalProblems, rating, platformCount, isOpenToWork }

    if (!isDatabaseAvailable()) {
      return NextResponse.json({ jobs: [], matchProfile: studentProfile })
    }

    const allJobs = await JobModel.findAll({ status: "active" })

    // ── Eligibility filter: student must meet ALL recruiter requirements ──────
    const studentBranch = ((student as any)?.branch || "").toUpperCase()
    const studentGradYear = Number((student as any)?.graduationYear) || 0
    const studentDegree = ((student as any)?.degree || "").trim()

    const eligibleJobs = allJobs.filter((job: any) => {
      // Minimum problems check
      if ((job.minProblems ?? 0) > 0 && totalProblems < (job.minProblems ?? 0)) return false
      // Minimum rating check
      if ((job.minRating ?? 0) > 0 && rating < (job.minRating ?? 0)) return false
      // Minimum CGPA check
      if ((job.minCGPA ?? 0) > 0 && minCGPA < (job.minCGPA ?? 0)) return false
      // Graduation year check
      if ((job.allowedGradYears ?? []).length > 0 && studentGradYear > 0) {
        if (!job.allowedGradYears.includes(studentGradYear)) return false
      }
      // Branch check
      if ((job.allowedBranches ?? []).length > 0 && studentBranch) {
        const allowed = job.allowedBranches.map((b: string) => b.toUpperCase())
        if (!allowed.includes(studentBranch)) return false
      }
      // Degree check
      if ((job.allowedDegrees ?? []).length > 0 && studentDegree) {
        const allowed = job.allowedDegrees.map((d: string) => d.toLowerCase())
        if (!allowed.includes(studentDegree.toLowerCase())) return false
      }
      return true
    })
    // Compute match scores for eligible jobs only
    const matched = matchJobsToStudent(studentProfile, eligibleJobs)

    return NextResponse.json({
      jobs: matched,
      matchProfile: studentProfile,
      totalJobs: allJobs.length,
      eligibleJobs: eligibleJobs.length,
    })
  } catch (error) {
    console.error("GET /api/student/jobs error:", error)
    return NextResponse.json({ jobs: [], error: "Failed to fetch jobs" })
  }
}
