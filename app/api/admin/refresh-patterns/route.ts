/**
 * POST /api/admin/refresh-patterns
 * Seeds hiring patterns for all 189 companies (or specified subset).
 * Uses hardcoded accurate fallbacks — instant, no rate limits.
 * For specific companies, also tries live web fetch.
 *
 * Body: { companies?: string[], liveOnly?: boolean, secret? }
 * GET  /api/admin/refresh-patterns?company=tcs  — view cached pattern
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { ALL_COMPANIES } from "@/lib/companies-data"
import { getCompanyPattern, seedAllCompanyPatterns } from "@/lib/rag/company-pattern"
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

  const all = await col.find({}, { projection: { company: 1, companyName: 1, source: 1, fetchedAt: 1, totalQuestions: 1, totalTime: 1 } }).toArray()
  return NextResponse.json({ patterns: all, total: all.length, allCompanies: ALL_COMPANIES.length })
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  const body = await req.json().catch(() => ({}))
  const hasSecret = body.secret === process.env.SEED_SECRET || body.secret === process.env.NEXTAUTH_SECRET
  if (!isAdmin(user) && !hasSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const specificCompanies: string[] | undefined = body.companies
  const liveOnly: boolean = body.liveOnly ?? false

  // If specific companies with liveOnly — fetch live patterns for those
  if (specificCompanies?.length && liveOnly) {
    const results = []
    for (const companyId of specificCompanies) {
      const co = ALL_COMPANIES.find(c => c.id === companyId)
      if (!co) { results.push({ company: companyId, status: "not_found" }); continue }
      try {
        const pattern = await getCompanyPattern(companyId, co.name)
        results.push({ company: companyId, status: pattern ? "ok" : "failed", sections: pattern?.sections.length ?? 0 })
      } catch (e: any) {
        results.push({ company: companyId, status: "error: " + e.message?.slice(0, 50) })
      }
      await new Promise(r => setTimeout(r, 300))
    }
    return NextResponse.json({ success: true, fetched: results.filter(r => r.status === "ok").length, total: specificCompanies.length, results })
  }

  // Default: bulk seed ALL 189 companies using category fallbacks (fast, no rate limits)
  const targetCompanies = specificCompanies
    ? ALL_COMPANIES.filter(c => specificCompanies.includes(c.id))
    : ALL_COMPANIES

  try {
    const seeded = await seedAllCompanyPatterns(
      targetCompanies.map(c => ({
        id: c.id, name: c.name, category: c.category,
        sections: c.sections, duration: c.duration, questions: c.questions,
      }))
    )

    return NextResponse.json({
      success: true,
      seeded,
      total: targetCompanies.length,
      message: `Seeded ${seeded} company patterns into MongoDB`,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
