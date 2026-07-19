/**
 * POST /api/student/reset-progress
 * Resets all first-year learning progress for the current user.
 * Clears XP, streak, badges, challenges, milestones — fresh start.
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDatabase } from "@/lib/database"

export async function POST() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const db  = await getDatabase()
    const uid = user._id?.toString() ?? ""

    // Reset first_year_progress
    await db.collection("first_year_progress").updateOne(
      { userId: uid },
      {
        $set: {
          completed: [],
          completedBadges: [],
          completedChallenges: [],
          streak: 0,
          lastActivity: null,
          totalXP: 0,
          monthlyChallengesSolved: 0,
          onboardingSkillLevel: null,
          onboardingDone: false,
          badgeTried: {},
          updatedAt: new Date(),
        },
      }
    )

    // Clear cached debug + project challenges for this user
    await db.collection("debug_challenges").deleteOne({ userId: uid })
    await db.collection("project_challenges").deleteOne({ userId: uid })

    return NextResponse.json({ success: true, message: "Progress reset successfully" })
  } catch (err) {
    console.error("reset-progress error:", err)
    return NextResponse.json({ error: "Reset failed" }, { status: 500 })
  }
}
