/**
 * Admin feedback moderation
 * GET   /api/admin/feedback           — list all feedback
 * PATCH /api/admin/feedback?id=&status= — approve or reject
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { FeedbackModel } from "@/lib/models/feedback"

async function requireAdmin() {
  const user = await getCurrentUser()
  return user?.role === "admin" ? user : null
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const feedback = await FeedbackModel.findAll()
    return NextResponse.json({ feedback })
  } catch {
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const status = searchParams.get("status") as "approved" | "rejected"
    if (!id || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid params" }, { status: 400 })
    }
    await FeedbackModel.updateStatus(id, status)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to update feedback" }, { status: 500 })
  }
}
