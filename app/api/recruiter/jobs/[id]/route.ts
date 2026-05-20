/**
 * Single job management
 * PATCH  /api/recruiter/jobs/[id]  — update job (status, fields)
 * DELETE /api/recruiter/jobs/[id]  — delete job
 */
import { NextResponse } from "next/server"
import { JobModel } from "@/lib/models/job"
import { isDatabaseAvailable } from "@/lib/database"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ success: true })
    }
    const body = await request.json()
    await JobModel.update(params.id, body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PATCH /api/recruiter/jobs/[id] error:", error)
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ success: true })
    }
    await JobModel.delete(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/recruiter/jobs/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 })
  }
}
