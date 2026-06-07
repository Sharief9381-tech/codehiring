import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "college") return NextResponse.json({ announcements: [] })
    if (!isDatabaseAvailable()) return NextResponse.json({ announcements: [] })
    const db = await getDatabase()
    const docs = await db.collection("announcements")
      .find({ collegeCode: (user as any).collegeCode })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()
    return NextResponse.json({ announcements: docs.map(d => ({ ...d, id: d._id?.toString() })) })
  } catch {
    return NextResponse.json({ announcements: [] })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "college") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (!isDatabaseAvailable()) return NextResponse.json({ error: "DB unavailable" }, { status: 503 })
    const body = await req.json()
    const db = await getDatabase()
    const doc = {
      ...body,
      collegeCode: (user as any).collegeCode,
      collegeName: (user as any).collegeName,
      createdBy: user._id?.toString(),
      createdAt: new Date(),
      pinned: false,
    }
    await db.collection("announcements").insertOne(doc)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
