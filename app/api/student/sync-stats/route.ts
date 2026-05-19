import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { PlatformAggregator } from "@/lib/services/platform-aggregator"

export async function POST() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const userId = user._id as string
    const student = await UserModel.findById(userId)
    if (!student) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const linkedPlatforms = ((student as any).linkedPlatforms || {}) as Record<string, any>
    const platformUsernames: Record<string, string> = {}
    for (const [platform, data] of Object.entries(linkedPlatforms)) {
      if (data) platformUsernames[platform] = typeof data === 'string' ? data : data.username
    }

    if (Object.keys(platformUsernames).length === 0) {
      return NextResponse.json({ error: "No platforms linked" }, { status: 400 })
    }

    const aggregatedStats = await PlatformAggregator.updateUserAggregatedStats(userId, platformUsernames)
    return NextResponse.json({ success: true, stats: aggregatedStats, message: "Stats synchronized successfully" })
  } catch (error) {
    console.error("Sync stats error:", error)
    return NextResponse.json({ error: "Failed to sync stats" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const student = await UserModel.findById(user._id as string)
    return NextResponse.json({
      stats: (student as any)?.aggregatedStats || null,
      lastUpdate: (student as any)?.lastStatsUpdate || null,
      hasStats: !!(student as any)?.aggregatedStats,
    })
  } catch {
    return NextResponse.json({ stats: null, lastUpdate: null, hasStats: false })
  }
}
