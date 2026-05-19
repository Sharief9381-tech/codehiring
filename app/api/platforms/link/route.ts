import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { platform, username, platformUrl } = await request.json()
    if (!platform || !username) {
      return NextResponse.json({ error: "Platform and username are required" }, { status: 400 })
    }

    const userId = user._id as string
    await UserModel.update(userId, {
      [`linkedPlatforms.${platform}`]: {
        username,
        linkedAt: new Date(),
        isActive: true,
        ...(platformUrl ? { platformUrl } : {}),
      },
    })

    return NextResponse.json({ success: true, message: `Successfully linked ${platform}`, platform, username })
  } catch (error) {
    console.error("Link platform error:", error)
    return NextResponse.json({ error: `Failed to link platform: ${error instanceof Error ? error.message : "Unknown error"}` }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { platform } = await request.json()
    if (!platform) return NextResponse.json({ error: "Platform is required" }, { status: 400 })

    const userId = user._id as string
    const { getDatabase } = await import("@/lib/database")
    const { ObjectId } = await import("mongodb")
    const db = await getDatabase()
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $unset: { [`linkedPlatforms.${platform}`]: "" }, $set: { updatedAt: new Date() } }
    )

    return NextResponse.json({ success: true, message: `Successfully unlinked ${platform}` })
  } catch (error) {
    console.error("Unlink platform error:", error)
    return NextResponse.json({ error: `Failed to unlink platform: ${error instanceof Error ? error.message : "Unknown error"}` }, { status: 500 })
  }
}
