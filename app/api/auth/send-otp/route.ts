/**
 * POST /api/auth/send-otp
 * Generates a 6-digit OTP, stores it in MongoDB, and sends via Resend.
 *
 * Body: { email: string, name?: string, purpose?: "signup" | "login" | "reset" }
 *
 * Security:
 *  - 6-digit OTP
 *  - 10 minute expiry
 *  - Max 5 verification attempts
 *  - 60 second resend cooldown
 */
import { NextResponse } from "next/server"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"
import { sendEmail, otpEmailHtml } from "@/lib/email"

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
  try {
    const { email, name, purpose = "signup" } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
    }

    const db = await getDatabase()
    const otps = db.collection("email_otps")

    // Check resend cooldown (60 seconds)
    const existing = await otps.findOne({ email })
    if (existing?.lastSent) {
      const elapsed = Date.now() - new Date(existing.lastSent).getTime()
      if (elapsed < 60_000) {
        const remaining = Math.ceil((60_000 - elapsed) / 1000)
        return NextResponse.json(
          { error: `Please wait ${remaining} seconds before requesting a new code` },
          { status: 429 }
        )
      }
    }

    const otp = generateOTP()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    const now = new Date()

    // Upsert OTP document
    await otps.updateOne(
      { email },
      {
        $set: {
          email,
          otp,
          otpExpires,
          verified: false,
          attempts: 0,
          lastSent: now,
          purpose,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    )

    // Send email
    const { success, error } = await sendEmail({
      to: email,
      subject: "Your CodeHiring verification code",
      html: otpEmailHtml(otp, name),
    })

    if (!success) {
      console.error("OTP email failed:", error)
      // In dev with no Resend key — return OTP in response for testing
      if (!process.env.RESEND_API_KEY) {
        console.log(`[DEV OTP] ${email} → ${otp}`)
        return NextResponse.json({ success: true, dev: true, otp })
      }
      return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("send-otp error:", err)
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
  }
}
