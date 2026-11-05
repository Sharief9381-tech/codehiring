/**
 * GET /api/public/top-colleges
 *
 * Aggregates students grouped by collegeCode, joins with `colleges` collection
 * where status is "verified", and returns the top 8 by student count.
 *
 * Response:
 * {
 *   colleges: { code, name, short, count }[]
 *   totalColleges: number   — distinct verified college codes with ≥1 student
 *   totalStudents: number   — students whose collegeCode resolves to a verified college
 * }
 *
 * Sample:
 * {
 *   "colleges": [
 *     { "code": "RVRJC", "name": "RVR & JC College of Engineering", "short": "RVR & JC", "count": 342 },
 *     { "code": "ADTPU", "name": "Aditya University", "short": "Aditya Univ", "count": 210 }
 *   ],
 *   "totalColleges": 18,
 *   "totalStudents": 2841
 * }
 *
 * Cache: s-maxage=3600, stale-while-revalidate=86400
 */

import { NextResponse } from "next/server"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"

export const revalidate = 3600  // ISR: re-generate every hour

export async function GET() {
  if (!isDatabaseAvailable()) {
    return NextResponse.json(
      { colleges: [], totalColleges: 0, totalStudents: 0 },
      { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" } }
    )
  }

  try {
    const db = await getDatabase()

    // Aggregate students by collegeCode, then join to `colleges` for verified ones only
    const rows = await db.collection("users").aggregate([
      // 1. Students with a non-empty collegeCode
      { $match: { role: "student", collegeCode: { $exists: true, $nin: [null, ""] } } },

      // 2. Group by code, count students
      { $group: { _id: "$collegeCode", count: { $sum: 1 } } },

      // 3. Join to `colleges` collection for verified status + display info
      { $lookup: {
          from:         "colleges",
          localField:   "_id",
          foreignField: "code",
          as:           "meta",
      }},

      // 4. Keep only verified colleges
      { $match: { "meta.0.status": "verified" } },

      // 5. Sort descending by student count
      { $sort: { count: -1 } },

      // 6. Project final shape
      { $project: {
          _id:   0,
          code:  "$_id",
          name:  { $arrayElemAt: ["$meta.name",  0] },
          short: { $arrayElemAt: ["$meta.short", 0] },
          count: 1,
      }},
    ]).toArray()

    const top8         = rows.slice(0, 8)
    const totalColleges = rows.length
    const totalStudents = rows.reduce((s, r) => s + (r.count ?? 0), 0)

    return NextResponse.json(
      { colleges: top8, totalColleges, totalStudents },
      { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" } }
    )
  } catch (err) {
    console.error("[top-colleges]", err)
    return NextResponse.json(
      { colleges: [], totalColleges: 0, totalStudents: 0 },
      { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" } }
    )
  }
}
