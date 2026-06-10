/**
 * /api/drives/[id] — GET, PATCH, DELETE a specific drive
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { DriveModel, DriveStatus } from "@/lib/models/drive"
import { isDatabaseAvailable } from "@/lib/database"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { id } = await params
    const drive = await DriveModel.findById(id)
    if (!drive) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ drive })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!isDatabaseAvailable()) return NextResponse.json({ error: "DB unavailable" }, { status: 503 })

    const { id } = await params
    const body = await req.json()

    // Advance workflow status (admin or recruiter)
    if (body.status) {
      await DriveModel.advanceStatus(id, body.status as DriveStatus, body.note)
    } else {
      await DriveModel.update(id, body)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== "recruiter" && user.role !== "admin")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { id } = await params
    await DriveModel.delete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
