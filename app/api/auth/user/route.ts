import { NextResponse } from "next/server"
import { getDemoStudent, serializeDemoDoc } from "@/lib/demo-db"
import { DEMO_STUDENT } from "@/lib/demo-user"

export async function GET() {
  try {
    const doc = await getDemoStudent()
    if (doc) {
      return NextResponse.json({ user: serializeDemoDoc(doc) })
    }
  } catch (e) {
    console.error("Failed to load demo student from DB:", e)
  }
  // Fallback to static demo user if DB unavailable
  return NextResponse.json({ user: DEMO_STUDENT })
}
