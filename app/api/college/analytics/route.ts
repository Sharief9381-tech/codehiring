import { NextResponse } from "next/server"
import { DEMO_COLLEGE } from "@/lib/demo-user"
import { AnalyticsService } from "@/lib/services/analytics"

export async function GET() {
  try {
    const analytics = await AnalyticsService.getEnhancedStudentAnalytics(DEMO_COLLEGE._id as string)

    return NextResponse.json({
      ...analytics,
      college: {
        name: (DEMO_COLLEGE as any).collegeName,
        code: (DEMO_COLLEGE as any).collegeCode
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
