import { NextResponse } from "next/server"
import { isDatabaseAvailable } from "@/lib/database"
import { hashPassword, findUserByResetToken, updateUser } from "@/lib/auth"
import { findUserByResetToken as fallbackFindUserByResetToken, updateUser as fallbackUpdateUser } from "@/lib/auth-fallback"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()
    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    let user = null
    try {
      if (isDatabaseAvailable()) {
        user = await findUserByResetToken(token)
      }
    } catch (dbError) {
      console.log("Database unavailable, falling back to in-memory storage", dbError)
    }

    if (!user) {
      console.log("[RESET PASSWORD] Trying fallback storage for token:", token)
      user = await fallbackFindUserByResetToken(token)
      console.log("[RESET PASSWORD] Fallback result:", user ? "User found" : "User not found")
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
    }

    const userId = user._id?.toString()
    if (!userId) {
      return NextResponse.json({ error: "Invalid user record" }, { status: 400 })
    }

    try {
      if (isDatabaseAvailable()) {
        await updateUser(userId, { password: hashedPassword, resetToken: null, resetTokenExpires: null })
      }
    } catch (dbError) {
      console.log("Database update failed, using fallback", dbError)
    }

    await fallbackUpdateUser(userId, { password: hashedPassword, resetToken: null, resetTokenExpires: null })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}
