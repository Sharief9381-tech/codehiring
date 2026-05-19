import { NextResponse } from "next/server"
import { DEMO_STUDENT } from "@/lib/demo-user"

export async function GET() {
  try {
    const user = DEMO_STUDENT
    return NextResponse.json({
      userId: user._id,
      linkedPlatforms: user.linkedPlatforms,
      linkedPlatformsKeys: user.linkedPlatforms ? Object.keys(user.linkedPlatforms) : [],
    })
  } catch (error) {
    console.error("Debug platforms error:", error)
    return NextResponse.json({ error: "Failed to get debug info" }, { status: 500 })
  }
}