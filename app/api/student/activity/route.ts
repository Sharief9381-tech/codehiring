import { NextResponse } from "next/server"
import { getDemoStudent } from "@/lib/demo-db"

export async function GET() {
  try {
    const student = await getDemoStudent()
    const activity = (student as any)?.recentActivity || []
    return NextResponse.json({ activity: activity.slice(0, 5) })
  } catch {
    return NextResponse.json({ activity: [] })
  }
}
