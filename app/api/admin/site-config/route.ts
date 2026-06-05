/**
 * Admin API for landing page site config
 * GET   /api/admin/site-config  — fetch current config
 * POST  /api/admin/site-config  — update config (partial upsert)
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { SiteConfigModel } from "@/lib/models/site-config"

async function requireAdmin() {
  const user = await getCurrentUser()
  return user?.role === "admin" ? user : null
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const config = await SiteConfigModel.get()
  return NextResponse.json({ config })
}

export async function POST(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const body = await req.json()
    await SiteConfigModel.upsert(body)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update config" }, { status: 500 })
  }
}
