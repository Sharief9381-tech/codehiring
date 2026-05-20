/**
 * Student jobs API
 * GET /api/student/jobs?skills=Python,Java&problems=150&rating=1400&platforms=3&openToWork=true
 *
 * Returns all active jobs sorted by match score for the given student profile.
 * The student profile params are passed as query params (no auth needed).
 */
import { NextResponse } from "next/server"
import { JobModel } from "@/lib/models/job"
import { matchJobsToStudent } from "@/lib/services/job-matcher"
import { isDatabaseAvailable } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Student profile from query params
    const skillsParam = searchParams.get("skills") || ""
    const skills = skillsParam ? skillsParam.split(",").map((s) => s.trim()).filter(Boolean) : []
    const totalProblems = Number(searchParams.get("problems") || 0)
    const rating = Number(searchParams.get("rating") || 0)
    const platformCount = Number(searchParams.get("platforms") || 0)
    const isOpenToWork = searchParams.get("openToWork") !== "false"

    const studentProfile = { skills, totalProblems, rating, platformCount, isOpenToWork }

    if (!isDatabaseAvailable()) {
      return NextResponse.json({ jobs: [], matchProfile: studentProfile })
    }

    const allJobs = await JobModel.findAll({ status: "active" })
    const matched = matchJobsToStudent(studentProfile, allJobs)

    return NextResponse.json({ jobs: matched, matchProfile: studentProfile })
  } catch (error) {
    console.error("GET /api/student/jobs error:", error)
    return NextResponse.json({ jobs: [], error: "Failed to fetch jobs" })
  }
}
