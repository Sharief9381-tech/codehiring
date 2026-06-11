import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isDatabaseAvailable } from "@/lib/database"
import { ShortlistModel } from "@/lib/models/shortlist"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!isDatabaseAvailable()) return NextResponse.json({ success: true })

    const { id } = await params
    const shortlist = await ShortlistModel.findById(id)
    const recruiterId = (user as any)._id?.toString() ?? ""
    if (!shortlist || shortlist.recruiterId !== recruiterId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    const body = await request.json()
    await ShortlistModel.update(id, body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PATCH /api/recruiter/shortlists/[id] error:", error)
    return NextResponse.json({ error: "Failed to update shortlist" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!isDatabaseAvailable()) return NextResponse.json({ success: true })

    const { id } = await params
    const shortlist = await ShortlistModel.findById(id)
    const recruiterId = (user as any)._id?.toString() ?? ""
    if (!shortlist || shortlist.recruiterId !== recruiterId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    await ShortlistModel.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/recruiter/shortlists/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete shortlist" }, { status: 500 })
  }
}
