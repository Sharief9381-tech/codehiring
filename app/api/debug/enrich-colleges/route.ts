/**
 * POST /api/debug/enrich-colleges
 * One-time utility: enriches auto-created college entries with real names
 * fetched from the Hipolabs universities API.
 */
import { NextResponse } from "next/server"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"

export async function POST() {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ error: "DB unavailable" }, { status: 503 })
  }

  try {
    const db = await getDatabase()
    const autoCols = await db
      .collection("users")
      .find({ role: "college", isAutoCreated: true })
      .toArray()

    const results: any[] = []

    for (const col of autoCols) {
      const code = col.collegeCode ?? ""
      if (!code) continue

      let resolvedName = col.collegeName ?? code
      let resolvedWebsite = col.website ?? null
      let resolvedLocation = col.location ?? ""

      try {
        const res = await fetch(
          `http://universities.hipolabs.com/search?name=${encodeURIComponent(code)}`,
          { signal: AbortSignal.timeout(5000) }
        )
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            const indian = data.find((r: any) => r.country === "India") ?? data[0]
            resolvedName = indian.name ?? resolvedName
            resolvedWebsite = indian.web_pages?.[0] ?? resolvedWebsite
            resolvedLocation = indian.country ?? resolvedLocation
          }
        }
      } catch {
        // skip
      }

      await db.collection("users").updateOne(
        { _id: col._id },
        {
          $set: {
            collegeName: resolvedName,
            name: resolvedName,
            website: resolvedWebsite,
            location: resolvedLocation,
            updatedAt: new Date(),
          },
        }
      )

      results.push({ code, resolvedName })
    }

    return NextResponse.json({ enriched: results.length, results })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
