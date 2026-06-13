/**
 * POST /api/debug/rescan-achievements
 * Re-scans all students and rebuilds their achievements from scratch.
 */
import { NextResponse } from "next/server"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"
import { detectNewAchievements } from "@/lib/services/achievements"

export async function POST() {
  if (!isDatabaseAvailable()) return NextResponse.json({ error: "DB unavailable" }, { status: 503 })

  const db = await getDatabase()
  const students = await db.collection("users").find({ role: "student" }).toArray()
  let updated = 0

  for (const s of students) {
    // Clear existing and re-detect from all platforms
    const fresh = { ...s, achievements: [] }
    const platforms = Object.keys(s.linkedPlatforms ?? {}).filter(k => (s.linkedPlatforms ?? {})[k])
    platforms.push("all")

    let achievements: any[] = []
    for (const pid of platforms) {
      const result = detectNewAchievements({ ...fresh, achievements }, pid)
      fresh.achievements = result
      achievements = result
    }

    await db.collection("users").updateOne(
      { _id: s._id },
      { $set: { achievements, updatedAt: new Date() } }
    )
    updated++
  }

  return NextResponse.json({ success: true, updated })
}
