import { NextResponse } from "next/server"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"

export const revalidate = 60

export async function GET() {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ colleges: [] })
  }
  try {
    const db = await getDatabase()

    const [collegeDocs, studentCounts] = await Promise.all([
      db
        .collection("users")
        .find({ role: "college" }, { projection: { password: 0 } })
        .sort({ createdAt: -1 })
        .toArray(),

      // Count students per collegeCode
      db
        .collection("users")
        .aggregate([
          { $match: { role: "student", collegeCode: { $exists: true, $ne: "" } } },
          { $group: { _id: "$collegeCode", count: { $sum: 1 } } },
        ])
        .toArray(),
    ])

    const countMap: Record<string, number> = {}
    for (const row of studentCounts) {
      if (row._id) countMap[row._id] = row.count
    }

    const colleges = collegeDocs.map((d) => ({
      _id: d._id?.toString(),
      name: d.name,
      collegeName: d.collegeName ?? d.name,
      collegeCode: d.collegeCode ?? "",
      location: d.location ?? "",
      website: d.website ?? null,
      departments: d.departments ?? [],
      totalStudents: countMap[d.collegeCode] ?? d.totalStudents ?? 0,
      placementOfficerName: d.placementOfficerName ?? null,
      isAutoCreated: d.isAutoCreated ?? false,
    }))

    return NextResponse.json({ colleges })
  } catch (error) {
    console.error("Public colleges API error:", error)
    return NextResponse.json({ colleges: [] })
  }
}
