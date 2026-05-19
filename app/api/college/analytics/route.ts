import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { AnalyticsService } from "@/lib/services/analytics"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "college") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const analytics = await AnalyticsService.getEnhancedStudentAnalytics(user._id as string)

    return NextResponse.json({
      ...analytics,
      college: {
        name: (user as any).collegeName,
        code: (user as any).collegeCode
      }
    })
  } catch (error) {
    console.error("Get college analytics error:", error)
    return NextResponse.json(
      { error: "Failed to get analytics" },
      { status: 500 }
    )
  }
}
