import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const student = await UserModel.findById(user._id as string)
    const activity = (student as any)?.recentActivity || []
    return NextResponse.json({ activity: activity.slice(0, 5) })
  } catch {
    return NextResponse.json({ activity: [] })
  }
}
