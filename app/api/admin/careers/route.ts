/**
 * Admin CRUD for career postings
 * GET    /api/admin/careers         — list all (including inactive)
 * POST   /api/admin/careers         — create new posting
 * PATCH  /api/admin/careers?id=     — update posting
 * DELETE /api/admin/careers?id=     — delete posting
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { CareerModel } from "@/lib/models/career"
import { isDatabaseAvailable } from "@/lib/database"

async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") return null
  return user
}

export async function GET() {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!isDatabaseAvailable()) return NextResponse.json({ careers: [] })
  try {
    const careers = await CareerModel.findAll(false)
    return NextResponse.json({ careers })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch careers" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await req.json()
    const { title, team, location, type, desc, active = true } = body
    if (!title || !team || !location || !type || !desc) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    const career = await CareerModel.create({ title, team, location, type, desc, active })
    return NextResponse.json({ career }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create posting" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    const body = await req.json()
    await CareerModel.update(id, body)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update posting" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    await CareerModel.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete posting" }, { status: 500 })
  }
}
