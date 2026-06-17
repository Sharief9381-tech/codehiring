/**
 * GET /api/student/assessment-leaderboard?company=tcs
 * Returns top 20 scores for a company + current user's rank
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDatabase } from "@/lib/database"

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const company = searchParams.get("company") ?? ""

    const db = await getDatabase()

    // Best score per user for this company
    const pipeline = [
      { $match: { company } },
      { $sort: { overallScore: -1, completedAt: 1 } },
      { $group: {
          _id: "$userId",
          bestScore: { $first: "$overallScore" },
          userName: { $first: "$userName" },
          collegeCode: { $first: "$collegeCode" },
          attempts: { $sum: 1 },
          lastAttempt: { $first: "$completedAt" },
          percentile: { $first: "$percentile" },
          readinessScore: { $first: "$readinessScore" },
      }},
      { $sort: { bestScore: -1 } },
      { $limit: 50 },
    ]

    const top = await db.collection("assessment_history").aggregate(pipeline).toArray()

    // Add rank numbers
    const leaderboard = top.map((e: any, i: number) => ({
      rank: i + 1,
      userId: e._id,
      userName: e.userName,
      collegeCode: e.collegeCode,
      bestScore: e.bestScore,
      attempts: e.attempts,
      lastAttempt: e.lastAttempt,
      readinessScore: e.readinessScore,
      isCurrentUser: e._id === user._id?.toString(),
    }))

    // Current user's rank (even if outside top 50)
    const userEntry = leaderboard.find(e => e.isCurrentUser)
    let userRank = userEntry?.rank ?? null

    if (!userRank) {
      const betterCount = await db.collection("assessment_history").aggregate([
        { $match: { company } },
        { $group: { _id: "$userId", bestScore: { $max: "$overallScore" } } },
        { $match: { bestScore: { $gt: 0 } } },
        { $count: "total" },
      ]).toArray()
      const userBest = await db.collection("assessment_history")
        .find({ company, userId: user._id?.toString() })
        .sort({ overallScore: -1 })
        .limit(1)
        .toArray()

      if (userBest.length > 0) {
        const aboveMe = await db.collection("assessment_history").aggregate([
          { $match: { company } },
          { $group: { _id: "$userId", bestScore: { $max: "$overallScore" } } },
          { $match: { bestScore: { $gt: userBest[0].overallScore } } },
          { $count: "total" },
        ]).toArray()
        userRank = (aboveMe[0]?.total ?? 0) + 1
      }
    }

    const totalParticipants = await db.collection("assessment_history")
      .distinct("userId", { company })
      .then((ids: any[]) => ids.length)

    return NextResponse.json({ leaderboard, userRank, totalParticipants, company })
  } catch (err) {
    console.error("Leaderboard error:", err)
    return NextResponse.json({ leaderboard: [], userRank: null, totalParticipants: 0 })
  }
}
