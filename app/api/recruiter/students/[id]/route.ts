/**
 * GET /api/recruiter/students/[id]
 * Returns the full profile of a student for the recruiter candidate overview.
 * Strips password. Accessible only to authenticated recruiters.
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isDatabaseAvailable } from "@/lib/database"
import { UserModel } from "@/lib/models/user"

export async function GET(
  _request: Request,
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

    const student = await UserModel.findById(params.id)
    if (!student || student.role !== "student") {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Strip password
    const { password, ...safe } = student as any

    return NextResponse.json({ student: safe })
  } catch (error) {
    console.error("GET /api/recruiter/students/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 })
  }
}
