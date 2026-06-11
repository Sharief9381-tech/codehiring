import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isDatabaseAvailable } from "@/lib/database"
import { UserModel } from "@/lib/models/user"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
    }
    const { id } = await params
    const student = await UserModel.findById(id)
    if (!student || student.role !== "student") {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }
    const { password, ...safe } = student as any
    return NextResponse.json({ student: safe })
  } catch (error) {
    console.error("GET /api/recruiter/students/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 })
  }
}
