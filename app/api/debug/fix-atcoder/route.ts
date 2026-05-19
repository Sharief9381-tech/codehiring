import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { fetchAtCoderStats } from "@/lib/platforms/atcoder"

export async function POST() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const student = await UserModel.findById(user._id as string)
    const linkedPlatforms = (student as any)?.linkedPlatforms || {}

    const atcoderConnections = Object.entries(linkedPlatforms).filter(([platformId]) =>
      platformId.toLowerCase() === 'atcoder'
    )

    if (atcoderConnections.length === 0) {
      return NextResponse.json({ success: true, message: "No AtCoder connections found to fix" })
    }

    const results = []

    for (const [platformId, platformData] of atcoderConnections) {
      const pd = platformData as any
      if (!pd?.username) continue

      let cleanUsername = pd.username
      if (cleanUsername.includes('atcoder.jp/users/')) {
        const match = cleanUsername.match(/atcoder\.jp\/users\/([^\/\?]+)/)
        if (match) cleanUsername = match[1]
      }

      try {
        const freshStats = await fetchAtCoderStats(cleanUsername)
        if (freshStats) {
          await UserModel.update(user._id as string, {
            [`linkedPlatforms.${platformId}.username`]: cleanUsername,
            [`linkedPlatforms.${platformId}.lastSync`]: new Date(),
            [`linkedPlatforms.${platformId}.stats`]: freshStats
          })
          results.push({ platformId, success: true, oldUsername: pd.username, newUsername: cleanUsername, stats: freshStats })
        } else {
          results.push({ platformId, success: false, error: "Failed to fetch fresh stats" })
        }
      } catch (error) {
        results.push({ platformId, success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    return NextResponse.json({ success: true, message: "AtCoder connections fix completed", results })
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fix AtCoder connections: ${error instanceof Error ? error.message : 'Unknown error'}`, success: false },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "AtCoder Fix Endpoint",
    usage: "POST to fix existing AtCoder connections with real stats"
  })
}
