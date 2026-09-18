/**
 * POST /api/admin/refresh-patterns
 * Fetches and caches the latest hiring patterns for specified companies (or all).
 * Body: { companies?: string[], secret? }
 *
 * GET /api/admin/refresh-patterns?company=tcs
 * Returns the cached pattern for a specific company.
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { ALL_COMPANIES } from "@/lib/companies-data"
import { getCompanyPattern } from "@/lib/rag/company-pattern"
import { getDatabase } from "@/lib/database"

function isAdmin(user: any) {
  return user?.role === "admin" || user?.email === "sharief9381@gmail.com"
}

export async function GET(req: Request) {
  const user = await getCurrentUser()
  const url = new URL(req.url)
  const secret = url.searchParams.get("secret")
  const hasSecret = secret === process.env.SEED_SECRET || secret === process.env.NEXTAUTH_SECRET

  if (!isAdmin(user) && !hasSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const company = url.searchParams.get("company")

  const db = await getDatabase()
  const col = db.collection("company_patterns")

  if (company) {
    const pattern = await col.findOne({ company }, { projection: { _id: 0 } })
    return NextResponse.json({ pattern })
  }

  // Return all cached patterns summary
  const all = await col.find({}, { projection: { company: 1, companyName: 1, fetchedAt: 1, totalQuestions: 1, totalTime: 1, "sections.id": 1, "sections.questions": 1 } }).toArray()
  return NextResponse.json({ patterns: all, total: all.length })
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  const body = await req.json().catch(() => ({}))
  const hasSecret = body.secret === process.env.SEED_SECRET || body.secret === process.env.NEXTAUTH_SECRET

  if (!isAdmin(user) && !hasSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const targetIds: string[] = body.companies ?? ALL_COMPANIES.slice(0, 20).map(c => c.id) // default: first 20

  const results: { company: string; status: string; sections?: number }[] = []

  for (const companyId of targetIds) {
    const co = ALL_COMPANIES.find(c => c.id === companyId)
    if (!co) { results.push({ company: companyId, status: "not_found" }); continue }

    try {
      const pattern = await getCompanyPattern(companyId, co.name)
      if (pattern) {
        results.push({ company: companyId, status: "ok", sections: pattern.sections.length })
      } else {
        results.push({ company: companyId, status: "failed" })
      }
    } catch (e: any) {
      results.push({ company: companyId, status: "error: " + e.message?.slice(0, 50) })
    }

    // Small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 500))
  }

  const ok = results.filter(r => r.status === "ok").length
  return NextResponse.json({
    success: true,
    fetched: ok,
    total: targetIds.length,
    results,
  })
}
