import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const student = await UserModel.findById(user._id as string)
    const linkedPlatforms = (student as any)?.linkedPlatforms || {}

    return NextResponse.json({
      userId: user._id,
      linkedPlatforms,
      linkedPlatformsKeys: Object.keys(linkedPlatforms),
    })
  } catch (error) {
    console.error("Debug platforms error:", error)
    return NextResponse.json({ error: "Failed to get debug info" }, { status: 500 })
  }
}
