/**
 * POST /api/notifications/read?id=xxx  — mark one notification as read
 * POST /api/notifications/read?all=1   — mark all as read
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { NotificationModel } from "@/lib/models/notification"
import { isDatabaseAvailable } from "@/lib/database"

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isDatabaseAvailable()) return NextResponse.json({ success: true })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  const all = searchParams.get("all")
  const userId = user._id?.toString() ?? ""

  try {
    if (all) {
      await NotificationModel.markAllRead(userId)
    } else if (id) {
      await NotificationModel.markRead(id, userId)
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Notifications read error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
