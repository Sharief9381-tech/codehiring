import { NextResponse } from "next/server"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"

export async function POST(request: Request) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ success: false, error: "MongoDB not available" }, { status: 400 })
    }

    const { preserveEmail } = await request.json()

    if (!preserveEmail) {
      return NextResponse.json({ success: false, error: "preserveEmail is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const details: string[] = []

    // Delete all users except the preserved one
    const userResult = await db.collection('users').deleteMany({ email: { $ne: preserveEmail } })
    details.push(`users: deleted ${userResult.deletedCount} (kept ${preserveEmail})`)

    // Clear all other collections entirely
    const otherCollections = ['sessions', 'platforms', 'analytics', 'stats', 'leaderboard', 'activity']
    for (const col of otherCollections) {
      try {
        const result = await db.collection(col).deleteMany({})
        if (result.deletedCount > 0) {
          details.push(`${col}: deleted ${result.deletedCount}`)
        }
      } catch {
        // collection may not exist, skip
      }
    }

    // Also clear any remaining collections not listed above (except users)
    const allCollections = await db.listCollections().toArray()
    for (const col of allCollections) {
      if (col.name !== 'users' && !otherCollections.includes(col.name)) {
        const result = await db.collection(col.name).deleteMany({})
        if (result.deletedCount > 0) {
          details.push(`${col.name}: deleted ${result.deletedCount}`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Database cleared. Preserved user: ${preserveEmail}`,
      details
    })
  } catch (error) {
    console.error("clear-except-king error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
