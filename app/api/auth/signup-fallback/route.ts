import { NextResponse } from "next/server"
import { createStudent, createCollege, createRecruiter, createSession, findUserByEmail } from "@/lib/auth-fallback"
import type { UserRole } from "@/lib/types"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name, role, ...additionalData } = body

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const validRoles: UserRole[] = ["student", "college", "recruiter"]
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      )
    }

    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    let user: any

    if (role === "student") {
      const userData = {
        email,
        password,
        name,
        role: "student" as const,
        collegeCode: additionalData.collegeCode || "",
        rollNumber: additionalData.rollNumber || "",
        graduationYear: parseInt(additionalData.graduationYear) || new Date().getFullYear() + 4,
        branch: additionalData.branch || "",
        linkedPlatforms: {},
        stats: {
          totalProblems: 0,
          easyProblems: 0,
          mediumProblems: 0,
          hardProblems: 0,
          githubContributions: 0,
          contestsParticipated: 0,
          rating: 0,
        },
        skills: [],
        isOpenToWork: true,
      }
      user = await createStudent(userData)
    } else if (role === "college") {
      const userData = {
        email,
        password,
        name,
        role: "college" as const,
        collegeName: additionalData.collegeName || name,
        collegeCode: additionalData.collegeCode || "",
        location: additionalData.location || "",
        website: additionalData.website || "",
        placementOfficerName: additionalData.placementOfficerName || "",
        placementOfficerEmail: additionalData.placementOfficerEmail || "",
        totalStudents: 0,
        departments: additionalData.departments || [],
      }
      user = await createCollege(userData)
    } else if (role === "recruiter") {
      const userData = {
        email,
        password,
        name,
        role: "recruiter" as const,
        companyName: additionalData.companyName || "",
        companyWebsite: additionalData.companyWebsite || "",
        companySize: additionalData.companySize || "",
        industry: additionalData.industry || "",
        designation: additionalData.designation || "",
        hiringFor: additionalData.hiringFor || [],
        preferredSkills: additionalData.preferredSkills || [],
      }
      user = await createRecruiter(userData)
    }

    const token = await createSession(user._id as string, role)

    const cookieStore = await cookies()
    cookieStore.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    const redirectTo = `/${role}/dashboard`

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      redirectTo,
      message: "Account created successfully (using fallback storage)"
    })
  } catch (error) {
    console.error("Fallback signup error:", error)
    const message = error instanceof Error ? error.message : "Failed to create account"
    return NextResponse.json({
      error: `Signup failed: ${message}`,
    }, { status: 500 })
  }
}
