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
    const linkedPlatforms = (student as any)?.linkedPlatforms || {}

    const clearUpdates: Record<string, any> = {}
    for (const platformId of Object.keys(linkedPlatforms)) {
      if (linkedPlatforms[platformId]) {
        clearUpdates[`linkedPlatforms.${platformId}.stats`] = null
        clearUpdates[`linkedPlatforms.${platformId}.lastSync`] = null
      }
    }

    if (Object.keys(clearUpdates).length > 0) {
      await UserModel.update(userId, clearUpdates)
    }

    const syncResults = await PlatformSyncService.syncUserPlatforms(userId)
    const successful = syncResults.filter((r: any) => r.success).length
    const failed = syncResults.filter((r: any) => !r.success).length

    return NextResponse.json({
      success: true,
      message: "Cleared fake stats and synced with real data",
      results: syncResults,
      summary: {
        clearedPlatforms: Object.keys(clearUpdates).length / 2,
        syncedSuccessfully: successful,
        syncFailed: failed,
        totalPlatforms: syncResults.length
      },
      timestamp: new Date()
    })
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to clear fake stats: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const student = await UserModel.findById(user._id as string)
    const linkedPlatforms = (student as any)?.linkedPlatforms || {}

    const analysis: Record<string, any> = {}
    for (const [platformId, platformData] of Object.entries(linkedPlatforms)) {
      if (platformData && typeof platformData === 'object' && 'stats' in platformData) {
        const pd = platformData as any
        analysis[platformId] = {
          hasStats: !!pd.stats,
          lastSync: pd.lastSync,
          statsKeys: pd.stats ? Object.keys(pd.stats) : [],
          potentiallyFake: !pd.lastSync || (pd.stats && Object.keys(pd.stats).length > 0 && !pd.lastSync)
        }
      }
    }

    return NextResponse.json({
      linkedPlatforms: Object.keys(linkedPlatforms),
      analysis,
      recommendation: "Use POST to clear fake stats and fetch real data"
    })
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to analyze stats: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
