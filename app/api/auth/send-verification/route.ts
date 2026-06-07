/**
 * POST /api/auth/send-verification
 * Sends an email verification link to the logged-in user.
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { isDatabaseAvailable } from "@/lib/database"
import { generateToken } from "@/lib/auth"

export async function POST() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    if ((user as any).emailVerified) {
      return NextResponse.json({ error: "Email already verified" }, { status: 400 })
    }

    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
    }

    const token = await generateToken()
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

    await UserModel.update(user._id as string, {
      emailVerificationToken: token,
      emailVerificationExpires: expires,
    })

    const verifyUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/verify-email?token=${token}`

    const RESEND_KEY = process.env.RESEND_API_KEY
    if (RESEND_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "CodeHiring <onboarding@resend.dev>",
          to: [user.email],
          subject: "Verify your CodeHiring email",
          html: `
            <h2>Verify your email</h2>
            <p>Hi ${user.name},</p>
            <p>Click the link below to verify your email address. This link expires in 24 hours.</p>
            <p><a href="${verifyUrl}" style="background:#7c3aed;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Verify Email</a></p>
            <p>Or copy: ${verifyUrl}</p>
            <p>If you didn't request this, you can safely ignore it.</p>
          `,
        }),
      }).catch(() => {})
    } else {
      console.log(`[EMAIL VERIFY] To: ${user.email} | URL: ${verifyUrl}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Send verification error:", error)
    return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 })
  }
}
