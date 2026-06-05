import { NextResponse } from "next/server"
import { isDatabaseAvailable } from "@/lib/database"
import { hashPassword, findUserByResetToken, clearPasswordResetToken, updateUser } from "@/lib/auth"
import { findUserByResetToken as fallbackFindUserByResetToken, updateUser as fallbackUpdateUser } from "@/lib/auth-fallback"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()
    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    if (isDatabaseAvailable()) {
      const user = await findUserByResetToken(token)
      if (!user) {
        return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
      }
      await updateUser(user._id as string, { password: hashedPassword, resetToken: null, resetTokenExpires: null })
      return NextResponse.json({ success: true })
    }

    const user = await fallbackFindUserByResetToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
    }

    await fallbackUpdateUser(user._id as string, { password: hashedPassword, resetToken: null, resetTokenExpires: null })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}
