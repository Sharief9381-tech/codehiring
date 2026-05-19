import { NextResponse } from "next/server"
import { DEMO_STUDENT } from "@/lib/demo-user"

export async function GET() {
  return NextResponse.json({
    user: DEMO_STUDENT,
    message: "User data retrieved (demo mode)"
  })
}
