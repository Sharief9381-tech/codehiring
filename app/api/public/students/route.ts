import { NextResponse } from "next/server"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"

export const revalidate = 60

export async function GET() {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ students: [] })
  }
  try {
    const db = await getDatabase()
    const docs = await db
      .collection("users")
      .find(
        { role: "student" },
        {
          projection: {
            password: 0,
            linkedPlatforms: 0, // omit raw platform data for public view
          },
        }
      )
      .sort({ "stats.totalProblems": -1 })
      .limit(200)
      .toArray()

    const students = docs.map((d) => ({
      _id: d._id?.toString(),
      name: d.name,
      collegeCode: d.collegeCode ?? "",
      branch: d.branch ?? "",
      graduationYear: d.graduationYear ?? null,
      skills: d.skills ?? [],
      isOpenToWork: d.isOpenToWork ?? false,
      linkedinUrl: d.linkedinUrl ?? null,
      stats: {
        totalProblems: d.stats?.totalProblems ?? 0,
        rating: d.stats?.rating ?? 0,
        githubContributions: d.stats?.githubContributions ?? 0,
        contestsParticipated: d.stats?.contestsParticipated ?? 0,
        easyProblems: d.stats?.easyProblems ?? 0,
        mediumProblems: d.stats?.mediumProblems ?? 0,
        hardProblems: d.stats?.hardProblems ?? 0,
      },
    }))

    return NextResponse.json({ students })
  } catch (error) {
    console.error("Public students API error:", error)
    return NextResponse.json({ students: [] })
  }
}
