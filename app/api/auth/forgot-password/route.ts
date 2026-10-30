import { NextResponse } from "next/server"
import { isDatabaseAvailable } from "@/lib/database"
import { findUserByEmail, generateToken, updateUser } from "@/lib/auth"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Only process if user exists
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ success: true }) // silent success
    }

    const user = await findUserByEmail(email).catch(() => null)
    if (!user) {
      // Don't reveal whether email exists
      return NextResponse.json({ success: true })
    }

    const resetToken = await generateToken()
    const resetLink = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/reset-password/${resetToken}`
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    const userId = user._id?.toString()
    if (userId) {
      await updateUser(userId, { resetToken, resetTokenExpires: expiresAt })
    }

    // Send via Gmail SMTP
    const gmailUser = process.env.GMAIL_USER
    const gmailPass = process.env.GMAIL_APP_PASSWORD

    if (gmailUser && gmailPass) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmailUser, pass: gmailPass },
      })

      await transporter.sendMail({
        from: `"CodeHiring" <${gmailUser}>`,
        to: email,
        subject: "Reset your CodeHiring password",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f9f9f9;border-radius:12px">
            <h2 style="color:#4f46e5;margin-bottom:8px">Reset Your Password</h2>
            <p style="color:#374151">Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
            <a href="${resetLink}" style="display:inline-block;margin:20px 0;padding:12px 28px;background:#4f46e5;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
              Reset Password
            </a>
            <p style="color:#6b7280;font-size:13px">If you didn't request this, ignore this email. Your password won't change.</p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
            <p style="color:#9ca3af;font-size:12px">CodeHiring — Campus Placement & Career Platform</p>
          </div>
        `,
      }).catch(err => console.error("Gmail send failed:", err))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
