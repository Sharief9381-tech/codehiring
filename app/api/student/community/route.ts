/**
 * GET /api/student/community
 * Returns community data: Discord URL and senior stories.
 * Falls back to defaults if DB is unavailable.
 */
import { NextResponse } from "next/server"
import { SiteConfigModel } from "@/lib/models/site-config"

export async function GET() {
  try {
    const config = await SiteConfigModel.get()
    return NextResponse.json({
      discordUrl: config.communityDiscordUrl,
      seniorStories: config.seniorStories,
    })
  } catch {
    const defaults = SiteConfigModel.getDefault()
    return NextResponse.json({
      discordUrl: defaults.communityDiscordUrl,
      seniorStories: defaults.seniorStories,
    })
  }
}
