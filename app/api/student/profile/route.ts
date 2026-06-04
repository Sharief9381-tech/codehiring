import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"

// Allowed fields a student can update
const ALLOWED_FIELDS = [
  "name", "phone", "location", "bio",
  "collegeName", "branch", "rollNumber", "degree",
  "graduationYear",   // allowed only if not already set (enforced client-side)
  "skills", "linkedinUrl", "githubUrl", "portfolioUrl", "twitterUrl",
  "isOpenToWork",
]

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const body = await request.json()

    // Only pick allowed fields to prevent overwriting sensitive data
    const updates: Record<string, any> = {}
    for (const field of ALLOWED_FIELDS) {
      if (body[field] !== undefined) {
        updates[field] = body[field]
      }
    }

    // Prevent overwriting graduationYear if already set
    if (updates.graduationYear) {
      const existing = await UserModel.findById(user._id as string)
      if (existing && (existing as any).graduationYear) {
        delete updates.graduationYear
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    await UserModel.update(user._id as string, updates)

    return NextResponse.json({ success: true, message: "Profile updated successfully" })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json(
      { error: `Failed to update profile: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const student = await UserModel.findById(user._id as string)
    if (!student) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const { password, ...safe } = student as any
    return NextResponse.json({ user: safe })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}
