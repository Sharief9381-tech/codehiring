/**
 * POST   /api/recruiter/shortlists/[id]/candidates  — add a candidate
 * DELETE /api/recruiter/shortlists/[id]/candidates  — remove a candidate (body: { studentId })
 * PATCH  /api/recruiter/shortlists/[id]/candidates  — update candidate stage (body: { studentId, stage, scheduledDate? })
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isDatabaseAvailable } from "@/lib/database"
import { ShortlistModel } from "@/lib/models/shortlist"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
    }

    const shortlist = await ShortlistModel.findById(params.id)
    if (!shortlist || shortlist.recruiterId !== user._id?.toString()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const body = await request.json()
    const { studentId, name, college, branch, year, matchScore } = body

    if (!studentId || !name) {
      return NextResponse.json({ error: "studentId and name are required" }, { status: 400 })
    }

    // Prevent duplicates
    if (shortlist.candidates.some((c) => c.studentId === studentId)) {
      return NextResponse.json({ error: "Candidate already in shortlist" }, { status: 409 })
    }

    await ShortlistModel.addCandidate(params.id, {
      studentId,
      name,
      college: college ?? "",
      branch: branch ?? "",
      year: year ?? undefined,
      matchScore: matchScore ?? 0,
      stage: "Screening",
      addedAt: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("POST /api/recruiter/shortlists/[id]/candidates error:", error)
    return NextResponse.json({ error: "Failed to add candidate" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isDatabaseAvailable()) {
      return NextResponse.json({ success: true })
    }

    const shortlist = await ShortlistModel.findById(params.id)
    if (!shortlist || shortlist.recruiterId !== user._id?.toString()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const body = await request.json()
    const { studentId } = body
    if (!studentId) {
      return NextResponse.json({ error: "studentId is required" }, { status: 400 })
    }

    await ShortlistModel.removeCandidate(params.id, studentId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/recruiter/shortlists/[id]/candidates error:", error)
    return NextResponse.json({ error: "Failed to remove candidate" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isDatabaseAvailable()) {
      return NextResponse.json({ success: true })
    }

    const shortlist = await ShortlistModel.findById(params.id)
    if (!shortlist || shortlist.recruiterId !== user._id?.toString()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const body = await request.json()
    const { studentId, stage, scheduledDate } = body
    if (!studentId || !stage) {
      return NextResponse.json({ error: "studentId and stage are required" }, { status: 400 })
    }

    await ShortlistModel.updateCandidateStage(params.id, studentId, stage, scheduledDate)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PATCH /api/recruiter/shortlists/[id]/candidates error:", error)
    return NextResponse.json({ error: "Failed to update candidate stage" }, { status: 500 })
  }
}
