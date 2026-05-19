import { NextResponse } from "next/server"
import { Analytics } from "@/lib/analytics"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') as 'today' | 'week' | 'month' | 'all' || 'week'

    const analytics = await Analytics.getAnalytics(timeRange)

    return NextResponse.json({
      success: true,
      data: analytics,
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, page, action, metadata } = body

    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    await Analytics.track({
      type,
      page,
      action,
      metadata: metadata || {},
    }, {
      ip: Array.isArray(ip) ? ip[0] : ip,
      userAgent,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics tracking error:", error)
    return NextResponse.json(
      { error: "Failed to track event" },
      { status: 500 }
    )
  }
}
