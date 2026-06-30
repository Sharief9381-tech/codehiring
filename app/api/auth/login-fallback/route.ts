import { NextResponse } from "next/server"
import { findUserByEmail, verifyPassword, createSession } from "@/lib/auth-fallback"
import type { UserRole } from "@/lib/types"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const user = await findUserByEmail(email)

    // Auto-create admin user if logging in with admin email and user doesn't exist
    if (!user && email === "sharief9381@gmail.com") {
      try {
        const { createCollege } = await import("@/lib/auth-fallback")
        const adminUser = await createCollege({
          name: "System Administrator",
          email: "sharief9381@gmail.com",
          password: "12341234",
          role: "college",
          collegeName: "CodeTrack System",
          collegeCode: "ADMIN",
          location: "System",
          website: "https://codetrack.com",
          placementOfficerName: "System Admin",
          placementOfficerEmail: "sharief9381@gmail.com",
          totalStudents: 0,
          departments: ["System Administration"],
        })

        const isValidPassword = await verifyPassword(password, adminUser.password as string)
        if (!isValidPassword) {
          return NextResponse.json(
            { error: "Invalid email or password" },
            { status: 401 }
          )
        }

        const token = await createSession(adminUser._id as string, adminUser.role as UserRole)

        const cookieStore = await cookies()
        cookieStore.set("session_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
        })

        const { password: _, ...userWithoutPassword } = adminUser

        return NextResponse.json({
          success: true,
          user: userWithoutPassword,
          redirectTo: "/admin",
          message: "Admin user created and logged in successfully (using fallback storage)"
        })
      } catch (createError) {
        console.error("Failed to auto-create admin in fallback:", createError)
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        )
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const isValidPassword = await verifyPassword(password, user.password as string)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const token = await createSession(user._id as string, user.role as UserRole)

    const redirectTo = user.email === "sharief9381@gmail.com" ? "/admin" : `/${user.role}/dashboard`

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

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      redirectTo,
      message: "Login successful (using fallback storage)"
    })
  } catch (error) {
    console.error("Fallback login error:", error)
    return NextResponse.json(
      { error: "Failed to login" },
      { status: 500 }
    )
  }
}
