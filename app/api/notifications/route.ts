/**
 * GET  /api/notifications        — get notifications for current user
 * POST /api/notifications/read   — mark one or all as read
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { NotificationModel } from "@/lib/models/notification"
import { isDatabaseAvailable } from "@/lib/database"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isDatabaseAvailable()) return NextResponse.json({ notifications: [], unread: 0 })

  try {
    const userId = user._id?.toString() ?? ""
    const [notifications, unread] = await Promise.all([
      NotificationModel.findByUser(userId, 20),
      NotificationModel.countUnread(userId),
    ])
    return NextResponse.json({ notifications, unread })
  } catch (error) {
    console.error("Notifications GET error:", error)
    return NextResponse.json({ notifications: [], unread: 0 })
  }
}
