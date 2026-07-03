/**
 * POST /api/student/badge-try
 * Called when a student clicks "Try" on a badge question.
 * Records a snapshot of their current problem count so we can
 * detect when they've solved a new problem after clicking.
 *
 * Body: { badgeId: string }
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDatabase } from "@/lib/database"
import { ObjectId } from "mongodb"

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { badgeId } = await req.json()
    if (!badgeId) return NextResponse.json({ error: "badgeId required" }, { status: 400 })

    const db  = await getDatabase()
    const uid = user._id?.toString() ?? ""

    // Get current problem count
    const student = await db.collection("users").findOne(
      { _id: new ObjectId(uid) },
      { projection: { stats: 1, linkedPlatforms: 1 } }
    )

    const easyProblems  = student?.stats?.easyProblems  ?? 0
    const totalProblems = student?.stats?.totalProblems ?? 0
    const lcEasy        = student?.linkedPlatforms?.leetcode?.stats?.easySolved  ?? 0
    const lcMedium      = student?.linkedPlatforms?.leetcode?.stats?.mediumSolved ?? 0
    const totalNow      = Math.max(totalProblems, easyProblems + lcMedium, lcEasy + lcMedium)

    // Record the snapshot — upsert so retrying overwrites
    await db.collection("first_year_progress").updateOne(
      { userId: uid },
      {
        $set: {
          [`badgeTried.${badgeId}`]: {
            totalAtClick: totalNow,
            clickedAt: new Date(),
          },
          updatedAt: new Date(),
        },
      }
    )

    return NextResponse.json({ success: true, totalAtClick: totalNow })
  } catch (err) {
    console.error("badge-try error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
