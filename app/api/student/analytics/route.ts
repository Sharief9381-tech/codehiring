import { NextResponse } from "next/server"
import { getDemoStudent, serializeDemoDoc, DEMO_STUDENT_ID } from "@/lib/demo-db"
import { AnalyticsService } from "@/lib/services/analytics"

export async function GET() {
  try {
    const analytics = await AnalyticsService.getPersonalAnalytics(DEMO_STUDENT_ID)
    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Get analytics error:", error)
    // Return a minimal no-stats response instead of 500
    return NextResponse.json({
      hasStats: false,
      message: "Connect platforms and sync stats to see detailed analytics",
      linkedPlatforms: [],
      totalPlatforms: 0,
    })
  }
}
