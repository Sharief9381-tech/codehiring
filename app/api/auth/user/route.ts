import { NextResponse } from "next/server"
import { getCurrentUserWithReason } from "@/lib/auth"

export async function GET() {
  const { user, reason } = await getCurrentUserWithReason()

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated", reason: reason ?? "not_authenticated" },
      { status: 401 }
    )
  }

  return NextResponse.json({ user })
}
