/**
 * POST /api/admin/clear-problem-cache
 * Clears cached problem details + resets ONLY dailyActivity (the coding heatmap).
 * XP, badges, streaks, completed problems — all untouched.
 */
import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"

export async function POST() {
  try {
    const db = await getDatabase()

    // Clear old problem detail caches
    const collections = [
      "problem_details_v2", "problem_details_v3", "problem_details_v4",
      "problem_details_v5", "problem_details_v6", "problem_details_v7",
    ]
    let total = 0
    for (const col of collections) {
      try {
        const r = await db.collection(col).deleteMany({})
        total += r.deletedCount
      } catch {}
    }

    // Clear v8 stub entries (bad descriptions only)
    const v8result = await db.collection("problem_details_v8").deleteMany({
      $or: [
        { "problem.desc": { $regex: "^Solve the ", $options: "i" } },
        { "problem.inputFormat": "" },
        { "problem.outputFormat": "" },
        { "problem.desc": { $exists: false } },
      ]
    })
    total += v8result.deletedCount

    // Reset ONLY dailyActivity for all users — nothing else changes
    const activityResult = await db.collection("first_year_progress").updateMany(
      {},
      { $set: { dailyActivity: {} } }
    )

    return NextResponse.json({
      ok: true,
      deleted: total,
      v8Cleared: v8result.deletedCount,
      activityReset: activityResult.modifiedCount,
      message: `Cleared ${total} problem cache entries. Reset coding activity for ${activityResult.modifiedCount} users. XP/badges/streaks untouched.`,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
