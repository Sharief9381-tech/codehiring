import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { PlatformSyncService } from "@/lib/services/platform-sync"

export async function POST() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const userId = user._id as string
    const student = await UserModel.findById(userId)
    if (!student) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const linkedPlatforms = (student as any).linkedPlatforms || {}
    const total = Object.keys(linkedPlatforms).length

    if (total === 0) {
      return NextResponse.json({ success: true, results: [], summary: { total: 0, successful: 0, failed: 0 } })
    }

    const results = await PlatformSyncService.syncUserPlatforms(userId)
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
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const student = await UserModel.findById(user._id as string)
    return NextResponse.json({
      linkedPlatforms: (student as any)?.linkedPlatforms || {},
      stats: (student as any)?.stats || {},
      lastSync: (student as any)?.updatedAt || null,
    })
  } catch {
    return NextResponse.json({ linkedPlatforms: {}, stats: {}, lastSync: null })
  }
}
