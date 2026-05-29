import { NextResponse } from "next/server"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"

export const revalidate = 30

export async function GET() {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ drives: [] })
  }
  try {
    const db = await getDatabase()

    // Fetch from both drives and jobs collections
    const [drives, jobs] = await Promise.all([
      db
        .collection("drives")
        .find(
          { status: { $in: ["open", "shortlisting", "assessment"] } },
          { projection: { applicants: 0 } }
        )
        .sort({ createdAt: -1 })
        .toArray(),

      db
        .collection("jobs")
        .find(
          { status: "active" },
          { projection: { password: 0 } }
        )
        .sort({ createdAt: -1 })
        .toArray(),
    ])

    const formatted = [
      ...drives.map((d) => ({
        _id: d._id?.toString(),
        source: "drive",
        title: d.title ?? "",
        companyName: d.companyName ?? "",
        role: d.role ?? "",
        type: d.type ?? "Full-time",
        location: d.location ?? "",
        salary: d.salary ?? null,
        skills: d.skills ?? [],
        deadline: d.deadline ?? null,
        status: d.status ?? "open",
        minProblems: d.minProblems ?? 0,
        minRating: d.minRating ?? 0,
        applicantCount: Array.isArray(d.applicants) ? d.applicants.length : 0,
        description: d.description ?? "",
      })),
      ...jobs.map((j) => ({
        _id: j._id?.toString(),
        source: "job",
        title: j.title ?? "",
        companyName: j.companyName ?? "",
        role: j.title ?? "",
        type: j.type ?? "Full-time",
        location: j.location ?? "",
        salary: j.salary ?? null,
        skills: j.skills ?? [],
        deadline: j.deadline ?? null,
        status: "open",
        minProblems: j.minProblems ?? 0,
        minRating: j.minRating ?? 0,
        applicantCount: j.applications ?? 0,
        description: j.description ?? "",
      })),
    ]

    return NextResponse.json({ drives: formatted })
  } catch (error) {
    console.error("Public drives API error:", error)
    return NextResponse.json({ drives: [] })
  }
}
