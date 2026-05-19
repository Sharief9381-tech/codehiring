import { NextResponse } from "next/server"
import { getDemoStudent, DEMO_STUDENT_ID } from "@/lib/demo-db"
import { PlatformAggregator } from "@/lib/services/platform-aggregator"

export async function POST() {
  try {
    const user = await getDemoStudent()
    if (!user) return NextResponse.json({ error: "No platforms linked" }, { status: 400 })

    const linkedPlatforms = (user.linkedPlatforms || {}) as Record<string, any>
    const platformUsernames: Record<string, string> = {}
    for (const [platform, data] of Object.entries(linkedPlatforms)) {
      if (data) platformUsernames[platform] = typeof data === 'string' ? data : data.username
    }

    if (Object.keys(platformUsernames).length === 0) {
      return NextResponse.json({ error: "No platforms linked" }, { status: 400 })
    }

    const aggregatedStats = await PlatformAggregator.updateUserAggregatedStats(DEMO_STUDENT_ID, platformUsernames)
    return NextResponse.json({ success: true, stats: aggregatedStats, message: "Stats synchronized successfully" })
  } catch (error) {
    console.error("Sync stats error:", error)
    return NextResponse.json({ error: "Failed to sync stats" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await getDemoStudent()
    return NextResponse.json({
      stats: (user as any)?.aggregatedStats || null,
      lastUpdate: (user as any)?.lastStatsUpdate || null,
      hasStats: !!(user as any)?.aggregatedStats,
    })
  } catch {
    return NextResponse.json({ stats: null, lastUpdate: null, hasStats: false })
  }
}
