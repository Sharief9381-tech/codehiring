/**
 * GET  /api/recruiter/shortlists  — list all shortlists for the recruiter
 * POST /api/recruiter/shortlists  — create a new shortlist
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isDatabaseAvailable } from "@/lib/database"
import { ShortlistModel } from "@/lib/models/shortlist"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isDatabaseAvailable()) {
      return NextResponse.json({ shortlists: [] })
    }

    const shortlists = await ShortlistModel.findByRecruiter(user._id?.toString() ?? "")
    return NextResponse.json({ shortlists })
  } catch (error) {
    console.error("GET /api/recruiter/shortlists error:", error)
    return NextResponse.json({ error: "Failed to load shortlists" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
    }

    const body = await request.json()
    const { name, description } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const shortlist = await ShortlistModel.create({
      recruiterId: user._id?.toString() ?? "",
      name: name.trim(),
      description: description?.trim() ?? "",
      status: "active",
      candidates: [],
    })

    return NextResponse.json({ success: true, shortlist }, { status: 201 })
  } catch (error) {
    console.error("POST /api/recruiter/shortlists error:", error)
    return NextResponse.json({ error: "Failed to create shortlist" }, { status: 500 })
  }
}
