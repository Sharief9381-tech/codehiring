/**
 * POST /api/admin/clear-problem-cache
 * Clears cached problem details + resets all users' dailyActivity so the
 * heatmap starts fresh from today onwards.
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

    // Clear v8 stub entries
    const v8result = await db.collection("problem_details_v8").deleteMany({
      $or: [
        { "problem.desc": { $regex: "^Solve the ", $options: "i" } },
        { "problem.inputFormat": "" },
        { "problem.outputFormat": "" },
        { "problem.desc": { $exists: false } },
      ]
    })
    total += v8result.deletedCount

    // Reset ALL users' dailyActivity — heatmap starts fresh from today
    const activityResult = await db.collection("first_year_progress").updateMany(
      {},
      { $set: { dailyActivity: {}, streak: 0, lastActivity: null } }
    )

    return NextResponse.json({
      ok: true,
      deleted: total,
      v8Cleared: v8result.deletedCount,
      activityReset: activityResult.modifiedCount,
      message: `Cleared ${total} cached entries. Reset activity for ${activityResult.modifiedCount} users. Heatmap now starts fresh.`,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
