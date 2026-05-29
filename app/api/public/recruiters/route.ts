import { NextResponse } from "next/server"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"

export const revalidate = 60

export async function GET() {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ recruiters: [] })
  }
  try {
    const db = await getDatabase()
    const docs = await db
      .collection("users")
      .find(
        { role: "recruiter" },
        { projection: { password: 0 } }
      )
      .sort({ createdAt: -1 })
      .toArray()

    const recruiters = docs.map((d) => ({
      _id: d._id?.toString(),
      name: d.name,
      companyName: d.companyName ?? "",
      companyWebsite: d.companyWebsite ?? null,
      companySize: d.companySize ?? null,
      industry: d.industry ?? null,
      designation: d.designation ?? "",
      hiringFor: d.hiringFor ?? [],
      preferredSkills: d.preferredSkills ?? [],
    }))

    return NextResponse.json({ recruiters })
  } catch (error) {
    console.error("Public recruiters API error:", error)
    return NextResponse.json({ recruiters: [] })
  }
}
