/**
 * POST /api/auth/verify-otp
 * Verifies a 6-digit OTP.
 *
 * Body: { email: string, otp: string }
 * Returns: { success: true } or { error: string }
 *
 * Security:
 *  - Max 5 attempts (account locked after that, must resend)
 *  - OTP expires after 10 minutes
 *  - Marks as verified in DB on success
 */
import { NextResponse } from "next/server"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"

const MAX_ATTEMPTS = 5

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
    }

    if (!/^\d{4}$/.test(otp)) {
      return NextResponse.json({ error: "OTP must be 4 digits" }, { status: 400 })
    }

    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
    }

    const db = await getDatabase()
    const otps = db.collection("email_otps")

    const record = await otps.findOne({ email })

    if (!record) {
      return NextResponse.json({ error: "No OTP found for this email. Please request a new code." }, { status: 400 })
    }

    // Check expiry
    if (new Date(record.otpExpires) < new Date()) {
      await otps.deleteOne({ email })
      return NextResponse.json({ error: "OTP has expired. Please request a new code." }, { status: 400 })
    }

    // Check attempts
    if (record.attempts >= MAX_ATTEMPTS) {
      await otps.deleteOne({ email })
      return NextResponse.json({ error: "Too many incorrect attempts. Please request a new code." }, { status: 429 })
    }

    // Verify OTP
    if (record.otp !== otp) {
      const newAttempts = (record.attempts || 0) + 1
      const remaining = MAX_ATTEMPTS - newAttempts
      await otps.updateOne({ email }, { $inc: { attempts: 1 } })
      return NextResponse.json({
        error: `Incorrect code. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`,
        attemptsLeft: remaining,
      }, { status: 400 })
    }

    // Success — mark as verified
    await otps.updateOne({ email }, { $set: { verified: true, verifiedAt: new Date() } })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("verify-otp error:", err)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
