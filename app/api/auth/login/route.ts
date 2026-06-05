import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { isDatabaseAvailable } from "@/lib/database"
import { Analytics, getVisitorInfo } from "@/lib/analytics"
import { findUserByEmail, verifyPassword, createSession } from "@/lib/auth"
import type { UserRole } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Fallback if DB not available
    if (!isDatabaseAvailable()) {
      const fallbackResponse = await fetch(
        `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/login-fallback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      )
      const fallbackData = await fallbackResponse.json()
      return NextResponse.json(fallbackData, { status: fallbackResponse.status })
    }

    // Get cookie store once
    const cookieStore = await cookies()

    let user = await findUserByEmail(email)

    // Auto-create admin if email matches and user doesn't exist
    if (!user && email === "sharief9381@gmail.com") {
      try {
        const { createCollege } = await import("@/lib/auth")
        user = await createCollege({
          name: "System Administrator",
          email: "sharief9381@gmail.com",
          password: "12341234",
          role: "college",
          collegeName: "CodeHiring System",
          collegeCode: "ADMIN",
          location: "System",
          website: "https://codehiring.io",
          placementOfficerName: "System Admin",
          placementOfficerEmail: "sharief9381@gmail.com",
          totalStudents: 0,
          departments: ["System Administration"],
        })
      } catch (createError) {
        console.error("Auto-create admin failed:", createError)
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const isValidPassword = await verifyPassword(password, user.password as string)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const token = await createSession(user._id as string, user.role as UserRole)
    const redirectTo = user.email === "sharief9381@gmail.com" ? "/admin" : `/${user.role}/dashboard`

    cookieStore.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    })

    const { password: _, ...userWithoutPassword } = user

    // Track analytics (non-blocking)
    const visitorInfo = getVisitorInfo(request)
    Analytics.track({
      type: "user_login",
      userId: user._id?.toString(),
      userRole: user.role,
      metadata: { email: user.email, name: user.name },
    }, visitorInfo).catch(() => {})

    return NextResponse.json({ success: true, user: userWithoutPassword, redirectTo })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Failed to login" }, { status: 500 })
  }
}
