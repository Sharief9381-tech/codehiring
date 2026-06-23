/**
 * GET /api/student/first-year-leaderboard
 * Returns top first-year students ranked by XP
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDatabase } from "@/lib/database"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const db = await getDatabase()
    const now = new Date()
    const curYear = now.getFullYear()
    const acYear = now.getMonth() >= 4 ? curYear : curYear - 1

    // Find all students graduating in 4+ years from now (1st year)
    const firstYearGradYears = [acYear + 3, acYear + 4, acYear + 5]

    const firstYearUsers = await db.collection("users")
      .find({ role: "student", graduationYear: { $in: firstYearGradYears } }, { projection: { _id: 1, name: 1 } })
      .toArray()

    const userIds = firstYearUsers.map((u: any) => u._id?.toString())
    const userMap: Record<string, string> = {}
    firstYearUsers.forEach((u: any) => { userMap[u._id?.toString()] = u.name })

    // Get progress for all first-year students
    const progressDocs = await db.collection("first_year_progress")
      .find({ userId: { $in: userIds } })
      .sort({ totalXP: -1 })
      .limit(20)
      .toArray()

    const currentUserId = user._id?.toString()

    const leaderboard = progressDocs.map((p: any, i: number) => ({
      rank: i + 1,
      userId: p.userId,
      userName: userMap[p.userId] ?? "Student",
      totalXP: p.totalXP ?? 0,
      streak: p.streak ?? 0,
      completed: (p.completed ?? []).length,
      isCurrentUser: p.userId === currentUserId,
    }))

    return NextResponse.json({ leaderboard })
  } catch (err) {
    console.error("First year leaderboard error:", err)
    return NextResponse.json({ leaderboard: [] })
  }
}
