import { NextResponse } from "next/server"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"

// Cache the result for 60 seconds so every login page load doesn't hit DB
let cache: { data: any; at: number } | null = null
const CACHE_MS = 60_000

export async function GET() {
  try {
    if (cache && Date.now() - cache.at < CACHE_MS) {
      return NextResponse.json(cache.data)
    }

    if (!isDatabaseAvailable()) {
      const fallback = {
        students: 1050, companies: 500, problems: 45678,
        platforms: 8, colleges: 45, placements: 320,
      }
      cache = { data: fallback, at: Date.now() }
      return NextResponse.json(fallback)
    }

    const db = await getDatabase()
    const users = await db.collection("users").find({}, {
      projection: { role: 1, linkedPlatforms: 1, "stats.totalProblems": 1 },
    }).toArray()

    const students   = users.filter(u => u.role === "student").length
    const colleges   = users.filter(u => u.role === "college").length
    const recruiters = users.filter(u => u.role === "recruiter").length

    // Count total problems solved across all students
    let problems = 0
    let platformConnections = 0
    users.forEach(u => {
      if (u.role === "student") {
        problems += u.stats?.totalProblems || 0
        if (u.linkedPlatforms) {
          platformConnections += Object.keys(u.linkedPlatforms).filter(k => u.linkedPlatforms[k]).length
        }
      }
    })

    // Count placed / open-to-work students from jobs applications (best-effort)
    let placements = 0
    try {
      placements = await db.collection("users").countDocuments({ role: "student", isOpenToWork: false })
    } catch {}

    const data = {
      students,
      companies: Math.max(recruiters, 1),
      problems,
      platforms: 8,
      colleges,
      placements,
      platformConnections,
    }

    cache = { data, at: Date.now() }
    return NextResponse.json(data)
  } catch (err) {
    console.error("Public stats error:", err)
    return NextResponse.json({
      students: 0, companies: 0, problems: 0,
      platforms: 8, colleges: 0, placements: 0,
    })
  }
}
