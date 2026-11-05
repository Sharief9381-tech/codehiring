/**
 * GET /api/public/colleges/search?q=<query>
 * Returns up to 8 verified colleges matching code, short, name, or aliases.
 * Response: { colleges: { code, name, short }[] }
 */

import { NextResponse } from "next/server"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"
import { normalizeCode } from "@/lib/colleges"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get("q") ?? "").trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ colleges: [] })
  }

  if (!isDatabaseAvailable()) {
    return NextResponse.json({ colleges: [] })
  }

  try {
    const db      = await getDatabase()
    const upper   = q.toUpperCase()
    const norm    = normalizeCode(q)

    // Match on code prefix, name/short contains, or aliases prefix
    const docs = await db.collection("colleges")
      .find({
        status: "verified",
        $or: [
          { code:    { $regex: `^${norm}`,   $options: "i" } },
          { short:   { $regex: q,            $options: "i" } },
          { name:    { $regex: q,            $options: "i" } },
          { aliases: { $elemMatch: { $regex: `^${norm}`, $options: "i" } } },
        ],
      })
      .limit(8)
      .project({ code: 1, name: 1, short: 1 })
      .toArray()

    return NextResponse.json({
      colleges: docs.map(d => ({ code: d.code, name: d.name, short: d.short })),
    })
  } catch (err) {
    console.error("[colleges/search]", err)
    return NextResponse.json({ colleges: [] })
  }
}
