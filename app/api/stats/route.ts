import { NextResponse } from "next/server"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"

export const revalidate = 60 // cache for 60 seconds

export async function GET() {
  // Fallback values shown when DB is unavailable
  const fallback = {
    students: 0,
    colleges: 0,
    recruiters: 0,
    drives: 0,
    problemsSolved: 0,
    applications: 0,
    platformConnections: 0,
  }

  if (!isDatabaseAvailable()) {
    return NextResponse.json(fallback)
  }

  try {
    const db = await getDatabase()

    const [roleCounts, driveCounts, problemsResult, applicantsResult, connectionsResult] =
      await Promise.all([
        // User counts by role
        db
          .collection("users")
          .aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }])
          .toArray(),

        // Drive counts (all statuses)
        db.collection("drives").countDocuments(),

        // Total problems solved across all students
        db
          .collection("users")
          .aggregate([
            { $match: { role: "student" } },
            {
              $group: {
                _id: null,
                total: {
                  $sum: {
                    $ifNull: [
                      "$aggregatedStats.totalProblems",
                      { $ifNull: ["$stats.totalProblems", 0] },
                    ],
                  },
                },
              },
            },
          ])
          .toArray(),

        // Total drive applicants
        db
          .collection("drives")
          .aggregate([
            { $project: { count: { $size: { $ifNull: ["$applicants", []] } } } },
            { $group: { _id: null, total: { $sum: "$count" } } },
          ])
          .toArray(),

        // Total platform connections
        db
          .collection("users")
          .aggregate([
            { $match: { role: "student", linkedPlatforms: { $exists: true } } },
            {
              $project: {
                connections: { $size: { $objectToArray: { $ifNull: ["$linkedPlatforms", {}] } } },
              },
            },
            { $group: { _id: null, total: { $sum: "$connections" } } },
          ])
          .toArray(),
      ])

    // Map role counts
    const roleMap: Record<string, number> = {}
    for (const r of roleCounts) {
      if (r._id) roleMap[r._id as string] = r.count
    }

    return NextResponse.json({
      students: roleMap["student"] ?? 0,
      colleges: roleMap["college"] ?? 0,
      recruiters: roleMap["recruiter"] ?? 0,
      drives: driveCounts ?? 0,
      problemsSolved: problemsResult[0]?.total ?? 0,
      applications: applicantsResult[0]?.total ?? 0,
      platformConnections: connectionsResult[0]?.total ?? 0,
    })
  } catch (error) {
    console.error("Stats API error:", error)
    return NextResponse.json(fallback)
  }
}
