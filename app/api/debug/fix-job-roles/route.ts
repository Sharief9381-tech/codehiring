/**
 * GET /api/debug/fix-job-roles
 * One-time fix: sets postedByRole on all jobs that are missing it.
 * Jobs with a recruiterId from a recruiter user → "recruiter"
 * Jobs with a recruiterId from a college user → "college"
 */
import { NextResponse } from "next/server"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"

export async function GET() {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ error: "DB not available" }, { status: 503 })
  }

  try {
    const db = await getDatabase()

    // Find all jobs missing postedByRole
    const jobs = await db.collection("jobs").find({
      $or: [{ postedByRole: { $exists: false } }, { postedByRole: null }]
    }).toArray()

    console.log("Jobs missing postedByRole:", jobs.length)

    let fixedAsRecruiter = 0
    let fixedAsCollege = 0

    for (const job of jobs) {
      if (!job.recruiterId) continue

      // Look up the poster
      const poster = await db.collection("users").findOne({
        _id: job.recruiterId instanceof Object ? job.recruiterId : new (require("mongodb").ObjectId)(job.recruiterId)
      })

      const role = poster?.role === "college" ? "college" : "recruiter"
      await db.collection("jobs").updateOne(
        { _id: job._id },
        { $set: { postedByRole: role } }
      )

      if (role === "recruiter") fixedAsRecruiter++
      else fixedAsCollege++
    }

    // Also show current state
    const allJobs = await db.collection("jobs").find({ status: "active" }).toArray()
    const summary = allJobs.map(j => ({
      title: j.title,
      postedByRole: j.postedByRole,
      status: j.status,
    }))

    return NextResponse.json({
      fixed: { recruiter: fixedAsRecruiter, college: fixedAsCollege },
      allActiveJobs: summary,
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
