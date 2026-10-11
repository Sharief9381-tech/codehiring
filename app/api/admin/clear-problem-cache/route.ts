/**
 * POST /api/admin/clear-problem-cache
 * Clears all cached problem details so they regenerate with correct content.
 * Run this once after deploying a fix to problem-detail route.
 */
import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"

export async function POST() {
  try {
    const db = await getDatabase()

    // Clear all versions
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

    // Clear v8 entries that have stub content (bad desc starting with "Solve the")
    const v8result = await db.collection("problem_details_v8").deleteMany({
      $or: [
        { "problem.desc": { $regex: "^Solve the ", $options: "i" } },
        { "problem.inputFormat": "" },
        { "problem.outputFormat": "" },
        { "problem.desc": { $exists: false } },
      ]
    })
    total += v8result.deletedCount

    return NextResponse.json({
      ok: true,
      deleted: total,
      v8Cleared: v8result.deletedCount,
      message: `Cleared ${total} cached entries. Problems will regenerate on next access.`,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
