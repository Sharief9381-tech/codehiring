import { NextResponse } from "next/server"
import { getDemoStudent, DEMO_STUDENT_ID } from "@/lib/demo-db"
import { PlatformSyncService } from "@/lib/services/platform-sync"

export async function POST() {
  try {
    const user = await getDemoStudent()
    if (!user) {
      return NextResponse.json({ success: true, results: [], summary: { total: 0, successful: 0, failed: 0 } })
    }

    const linkedPlatforms = user.linkedPlatforms || {}
    const total = Object.keys(linkedPlatforms).length

    if (total === 0) {
      return NextResponse.json({ success: true, results: [], summary: { total: 0, successful: 0, failed: 0 } })
    }

    const results = await PlatformSyncService.syncUserPlatforms(DEMO_STUDENT_ID)
    const successful = results.filter((r: any) => r.success).length

    return NextResponse.json({
      success: true,
      results,
      syncedAt: new Date(),
      summary: { total: results.length, successful, failed: results.length - successful },
    })
  } catch (error) {
    console.error("Platform sync error:", error)
    return NextResponse.json({ error: `Failed to sync: ${error instanceof Error ? error.message : "Unknown error"}` }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await getDemoStudent()
    return NextResponse.json({
      linkedPlatforms: user?.linkedPlatforms || {},
      stats: user?.stats || {},
      lastSync: user?.updatedAt || null,
    })
  } catch {
    return NextResponse.json({ linkedPlatforms: {}, stats: {}, lastSync: null })
  }
}
