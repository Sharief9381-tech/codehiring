/**
 * POST /api/admin/clear-problem-cache
 * Deletes all old cached problem details so they regenerate with correct stdin format.
 * One-time use — run once then problems will regenerate on first access.
 */
import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"

export async function POST() {
  try {
    const db = await getDatabase()

    // Delete all old collections with wrong format
    const collections = ["problem_details_v2","problem_details_v3","problem_details_v4","problem_details_v5","problem_details_v6","problem_details_v7"]

    let total = 0
    for (const col of collections) {
      try {
        const result = await db.collection(col).deleteMany({})
        total += result.deletedCount
        console.log("[clear-cache]", col, "deleted:", result.deletedCount)
      } catch {}
    }

    return NextResponse.json({ ok: true, deleted: total, message: "All old problem caches cleared. Problems will regenerate on next access." })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
