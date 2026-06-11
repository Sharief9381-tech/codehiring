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
        const { UserModel } = await import("@/lib/models/user")
        const { hashPassword } = await import("@/lib/auth")
        const hashed = await hashPassword("12341234")
        user = await UserModel.create({
          name: "System Administrator",
          email: "sharief9381@gmail.com",
          password: hashed,
          role: "admin",
        })
      } catch (createError) {
        console.error("Auto-create admin failed:", createError)
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
      }
    }

    // If existing user has wrong role, upgrade to admin
    if (user && email === "sharief9381@gmail.com" && (user.role as string) !== "admin") {
      try {
        const { UserModel } = await import("@/lib/models/user")
        await UserModel.update(user._id?.toString() ?? "", { role: "admin" })
        user = { ...user, role: "admin" as any }
      } catch { /* non-fatal */ }
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const isValidPassword = await verifyPassword(password, user.password as string)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const token = await createSession(user._id?.toString() as string, user.role as UserRole)
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
