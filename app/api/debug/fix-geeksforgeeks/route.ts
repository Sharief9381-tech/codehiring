import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { fetchGeeksforGeeksStats } from "@/lib/platforms/geeksforgeeks"

export async function POST() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const student = await UserModel.findById(user._id as string)
    const linkedPlatforms = (student as any)?.linkedPlatforms || {}

    const geeksConnections = Object.entries(linkedPlatforms).filter(([platformId]) => {
      const key = platformId.toLowerCase()
      return key === 'geeksforgeeks' || key.includes('geek')
    })

    if (geeksConnections.length === 0) {
      return NextResponse.json({ success: true, message: "No GeeksforGeeks connections found to fix" })
    }

    const results = []

    for (const [platformId, platformData] of geeksConnections) {
      const pd = platformData as any
      if (!pd?.username) continue

      try {
        const freshStats = await fetchGeeksforGeeksStats(pd.username)
        if (freshStats) {
          await UserModel.update(user._id as string, {
            [`linkedPlatforms.${platformId}.lastSync`]: new Date(),
            [`linkedPlatforms.${platformId}.stats`]: freshStats
          })
          results.push({ platformId, success: true, stats: freshStats })
        } else {
          results.push({ platformId, success: false, error: "Failed to fetch fresh stats" })
        }
      } catch (error) {
        results.push({ platformId, success: false, error: error instanceof Error ? error.message : 'Unknown error' })
      }
    }

    return NextResponse.json({ success: true, message: "GeeksforGeeks connections fix completed", results })
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fix GeeksforGeeks connections: ${error instanceof Error ? error.message : 'Unknown error'}`, success: false },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "GeeksforGeeks Fix Endpoint",
    usage: "POST to fix existing GeeksforGeeks connections with fresh stats"
  })
}
