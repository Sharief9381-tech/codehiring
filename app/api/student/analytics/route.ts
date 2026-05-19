import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { AnalyticsService } from "@/lib/services/analytics"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const analytics = await AnalyticsService.getPersonalAnalytics(user._id as string)
    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Get analytics error:", error)
    return NextResponse.json({
      hasStats: false,
      message: "Connect platforms and sync stats to see detailed analytics",
      linkedPlatforms: [],
      totalPlatforms: 0,
    })
  }
}
