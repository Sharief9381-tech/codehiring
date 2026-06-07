/**
 * GET /api/auth/verify-email?token=xxx
 * Verifies the user's email using the token.
 */
import { NextResponse } from "next/server"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")
    if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 })

    if (!isDatabaseAvailable()) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
    }

    const db = await getDatabase()
    const user = await db.collection("users").findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { emailVerified: true, emailVerificationToken: null, emailVerificationExpires: null, updatedAt: new Date() } }
    )

    return NextResponse.json({ success: true, email: user.email })
  } catch (error) {
    console.error("Verify email error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
