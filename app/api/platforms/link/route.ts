import { NextResponse } from "next/server"
import { linkDemoPlatform, unlinkDemoPlatform } from "@/lib/demo-db"

export async function POST(request: Request) {
  try {
    const { platform, username, platformUrl } = await request.json()
    if (!platform || !username) {
      return NextResponse.json({ error: "Platform and username are required" }, { status: 400 })
    }
    await linkDemoPlatform(platform, username, platformUrl)
    return NextResponse.json({ success: true, message: `Successfully linked ${platform}`, platform, username })
  } catch (error) {
    console.error("Link platform error:", error)
    return NextResponse.json({ error: `Failed to link platform: ${error instanceof Error ? error.message : "Unknown error"}` }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { platform } = await request.json()
    if (!platform) return NextResponse.json({ error: "Platform is required" }, { status: 400 })
    await unlinkDemoPlatform(platform)
    return NextResponse.json({ success: true, message: `Successfully unlinked ${platform}` })
  } catch (error) {
    console.error("Unlink platform error:", error)
    return NextResponse.json({ error: `Failed to unlink platform: ${error instanceof Error ? error.message : "Unknown error"}` }, { status: 500 })
  }
}
