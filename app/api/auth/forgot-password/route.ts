import { NextResponse } from "next/server"
import { isDatabaseAvailable } from "@/lib/database"
import { findUserByEmail, generateToken, updateUser } from "@/lib/auth"
import { findUserByEmail as fallbackFindUserByEmail, updateUser as fallbackUpdateUser, generateId } from "@/lib/auth-fallback"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const resetToken = await generateToken()
    const resetLink = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/reset-password/${resetToken}`
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60)

    let user = null
    try {
      if (isDatabaseAvailable()) {
        user = await findUserByEmail(email)
        if (user) {
          const userId = user._id?.toString()
          if (userId) {
            await updateUser(userId, {
              resetToken,
              resetTokenExpires: expiresAt,
            })
          }
        }
      }
    } catch {
      // DB unavailable, will fall through to fallback
    }

    if (!user) {
      user = await fallbackFindUserByEmail(email)
      if (user) {
        const userId = user._id?.toString()
        if (userId) {
          await fallbackUpdateUser(userId, {
            resetToken,
            resetTokenExpires: expiresAt,
          })
        }
      } else {
        const tempUserId = await generateId()
        await fallbackUpdateUser(tempUserId, {
          _id: tempUserId,
          email,
          password: "",
          name: email.split("@")[0],
          role: "student",
          resetToken,
          resetTokenExpires: expiresAt,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    }

    // Send email if configured
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    if (RESEND_API_KEY && user) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "CodeHiring <onboarding@resend.dev>",
          to: [email],
          subject: "Reset your CodeHiring password",
          html: `
            <h2>Password Reset Request</h2>
            <p>Hi,</p>
            <p>We received a request to reset your CodeHiring password. Click the link below to choose a new password:</p>
            <p><a href="${resetLink}">${resetLink}</a></p>
            <p>This link will expire in one hour.</p>
            <p>If you didn't request it, you can ignore this email.</p>
          `,
        }),
      }).catch((error) => {
        console.error("Resend email failed:", error)
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
