/**
 * GET /api/admin/drives — list all drives pending review
 * Admin verification dashboard
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { DriveModel } from "@/lib/models/drive"
import { isDatabaseAvailable } from "@/lib/database"

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 401 })
    if (!isDatabaseAvailable()) return NextResponse.json({ drives: [] })

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status") || "pending_review"
    const drives = status === "all"
      ? await DriveModel.findAll()
      : await DriveModel.findAll({ status })

    return NextResponse.json({ drives })
  } catch (err) {
    console.error("Admin drives GET error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
