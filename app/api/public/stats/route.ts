import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"

// Short cache — 30 seconds only, always try real DB first
let cache: { data: any; at: number; isReal: boolean } | null = null
const CACHE_MS = 30_000

export async function GET() {
  // Serve real-data cache if fresh
  if (cache?.isReal && Date.now() - cache.at < CACHE_MS) {
    return NextResponse.json(cache.data)
  }

  try {
    const db = await getDatabase()
    const users = await db.collection("users").find({}, {
      projection: { role: 1, linkedPlatforms: 1, "stats.totalProblems": 1 },
    }).toArray()

    const students   = users.filter(u => u.role === "student").length
    const colleges   = users.filter(u => u.role === "college").length
    const recruiters = users.filter(u => u.role === "recruiter").length

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

    let placements = 0
    try {
      placements = await db.collection("users").countDocuments({ role: "student", isOpenToWork: false })
    } catch {}

    const data = { students, companies: Math.max(recruiters, 1), problems, platforms: 8, colleges, placements, platformConnections }
    cache = { data, at: Date.now(), isReal: true }
    return NextResponse.json(data)
  } catch (err) {
    console.error("Public stats error:", err)
    // Never cache fallback data — always retry DB next request
    return NextResponse.json({
      students: 0, companies: 0, problems: 0,
      platforms: 8, colleges: 0, placements: 0,
    })
  }
}
