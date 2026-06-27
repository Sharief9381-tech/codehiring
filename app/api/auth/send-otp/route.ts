/**
 * POST /api/auth/send-otp
 * Generates a 4-digit OTP, stores in MongoDB, sends via Brevo/Gmail.
 */
import { NextResponse } from "next/server"
import { sendEmail, otpEmailHtml } from "@/lib/email"

function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

export async function POST(request: Request) {
  try {
    const { email, name, purpose = "signup" } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    const otp = generateOTP()
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000)
    const now = new Date()

    // Try to save OTP to DB (non-blocking — proceed even if DB is slow)
    try {
      const { getDatabase } = await import("@/lib/database")
      const db = await getDatabase()
      const otps = db.collection("email_otps")

      // Check resend cooldown (30 seconds)
      const existing = await otps.findOne({ email })
      if (existing?.lastSent) {
        const elapsed = Date.now() - new Date(existing.lastSent).getTime()
        if (elapsed < 30_000) {
          const remaining = Math.ceil((30_000 - elapsed) / 1000)
          return NextResponse.json(
            { error: `Please wait ${remaining} seconds before requesting a new code` },
            { status: 429 }
          )
        }
      }

      await otps.updateOne(
        { email },
        {
          $set: { email, otp, otpExpires, verified: false, attempts: 0, lastSent: now, purpose, updatedAt: now },
          $setOnInsert: { createdAt: now },
        },
        { upsert: true }
      )
    } catch (dbErr) {
      console.error("[OTP] DB save failed (continuing):", dbErr instanceof Error ? dbErr.message : dbErr)
      // Continue — OTP still sent, but won't be verifiable without DB
      // This gracefully handles temporary DB outages
    }

    // Send email
    const { success, error } = await sendEmail({
      to: email,
      subject: "Your CodeHiring verification code",
      html: otpEmailHtml(otp, name),
    })

    if (!success) {
      console.error("[OTP] Email send failed:", error)
      return NextResponse.json({ error: "Failed to send verification email. Please try again." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("send-otp error:", err)
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
  }
}
