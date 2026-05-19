import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { getDatabase } from "@/lib/database"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { platform, username, isCustom } = await request.json()
    if (!platform || !username) {
      return NextResponse.json({ error: "Platform and username are required" }, { status: 400 })
    }

    const userId = user._id as string
    await UserModel.update(userId, {
      [`linkedPlatforms.${platform.toLowerCase()}`]: {
        username,
        linkedAt: new Date(),
        isActive: true,
      },
    })

    return NextResponse.json({ success: true, message: `Successfully linked ${platform}`, isCustom: isCustom || false })
  } catch (error) {
    console.error("Link platform error:", error)
    return NextResponse.json({ error: "Failed to link platform" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { platform } = await request.json()
    if (!platform) return NextResponse.json({ error: "Platform is required" }, { status: 400 })

    const userId = user._id as string
    const db = await getDatabase()
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $unset: { [`linkedPlatforms.${platform.toLowerCase()}`]: "" }, $set: { updatedAt: new Date() } }
    )

    return NextResponse.json({ success: true, message: `Successfully unlinked ${platform}` })
  } catch (error) {
    console.error("Unlink platform error:", error)
    return NextResponse.json({ error: "Failed to unlink platform" }, { status: 500 })
  }
}
