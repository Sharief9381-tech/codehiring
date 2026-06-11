import { NextResponse } from "next/server"
import { JobModel } from "@/lib/models/job"
import { isDatabaseAvailable } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"

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
    const job = await JobModel.findById(id)
    if (!job || job.recruiterId !== (user as any)._id?.toString()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    const body = await request.json()
    await JobModel.update(id, body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PATCH /api/recruiter/jobs/[id] error:", error)
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
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
    const job = await JobModel.findById(id)
    if (!job || job.recruiterId !== (user as any)._id?.toString()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    await JobModel.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/recruiter/jobs/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 })
  }
}
