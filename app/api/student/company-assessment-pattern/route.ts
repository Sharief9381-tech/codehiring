/**
 * GET /api/student/company-assessment-pattern?company=tcs
 * POST /api/student/company-assessment-pattern  { company: "tcs" }
 *
 * Returns the latest cached assessment pattern for a company.
 * If not cached (or stale), fetches live from web + AI, then caches 7 days.
 *
 * Also performs a fresh Google search to verify the latest exam pattern
 * before returning, so the student always sees up-to-date information.
 */

import { NextResponse } from "next/server"
import { getCompanyPattern, type CompanyPattern } from "@/lib/rag/company-pattern"
import { ALL_COMPANIES } from "@/lib/companies-data"
import { getDatabase } from "@/lib/database"

const FRESH_SEARCH_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days before re-searching

// ── Google Search for latest exam pattern ─────────────────────────────────────
async function searchLatestPattern(companyName: string, companyId: string): Promise<{ urls: string[]; snippets: string }> {
  const apiKey = process.env.GOOGLE_API_KEY
  const cx     = process.env.GOOGLE_SEARCH_CX

  const snippets: string[] = []
  const urls: string[] = []

  // Try Google Custom Search first
  if (apiKey && cx) {
    try {
      const query = `${companyName} campus recruitment test pattern 2025 sections questions time`
      const res = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=5`,
        { signal: AbortSignal.timeout(6000) }
      )
      if (res.ok) {
        const data = await res.json()
        for (const item of (data.items ?? [])) {
          urls.push(item.link)
          if (item.snippet) snippets.push(`[${item.displayLink}] ${item.snippet}`)
        }
      }
    } catch {}
  }

  // DuckDuckGo fallback
  if (snippets.length === 0) {
    try {
      const query = `${companyName} placement test pattern 2025 sections aptitude coding`
      const res = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`,
        { signal: AbortSignal.timeout(5000) }
      )
      if (res.ok) {
        const d = await res.json()
        if (d.AbstractText) snippets.push(d.AbstractText)
        for (const topic of (d.RelatedTopics ?? []).slice(0, 3)) {
          if (topic.Text) snippets.push(topic.Text)
          if (topic.FirstURL) urls.push(topic.FirstURL)
        }
      }
    } catch {}
  }

  return { urls: urls.slice(0, 5), snippets: snippets.join("\n") }
}

// ── Fetch page content ────────────────────────────────────────────────────────
async function fetchPage(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 Chrome/121.0.0.0 Safari/537.36" },
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) return ""
    const html = await res.text()
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s{3,}/g, "\n")
      .trim()
      .slice(0, 4000)
  } catch {
    return ""
  }
}

// ── AI extraction of pattern from web content ─────────────────────────────────
async function extractPatternWithAI(
  companyName: string,
  webContent: string
): Promise<Partial<CompanyPattern> | null> {
  const openaiKey = process.env.OPENAI_API_KEY
  const groqKey   = process.env.GROQ_API_KEY
  if (!openaiKey && !groqKey) return null
  if (!webContent.trim()) return null

  const prompt = `You are analyzing the latest ${companyName} campus placement / online assessment pattern from web data.
Extract the CURRENT (2024-2025) exam pattern. Return ONLY valid JSON, no markdown:

{
  "totalQuestions": <number>,
  "totalTime": <minutes>,
  "sections": [
    {
      "id": "<one of: quantitative|advanced-aptitude|verbal|basic-coding|advanced-coding>",
      "name": "<official section name>",
      "questions": <count>,
      "timeMinutes": <minutes>,
      "difficulty": "<Easy|Easy-Medium|Medium|Medium-Hard|Hard>",
      "topics": ["topic1","topic2"],
      "isCoding": <true|false>
    }
  ],
  "notes": "<important notes about the exam>",
  "year": 2025
}

RULES:
- section id must be exactly one of: quantitative, advanced-aptitude, verbal, basic-coding, advanced-coding
- basic-coding = MCQ programming logic questions (NOT actual coding)
- advanced-coding = actual code-writing problems
- If the content has no useful data, return null
- Only use sections that actually exist in the exam

WEB CONTENT:
${webContent.slice(0, 4000)}`

  const tryAI = async (url: string, key: string, model: string) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 1000,
      }),
      signal: AbortSignal.timeout(20000),
    })
    if (!res.ok) return null
    const d = await res.json()
    const raw = d.choices?.[0]?.message?.content?.trim() ?? ""
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) return null
    return JSON.parse(match[0])
  }

  try {
    if (openaiKey) {
      const data = await tryAI("https://api.openai.com/v1/chat/completions", openaiKey, "gpt-4o-mini").catch(() => null)
      if (data?.sections?.length > 0) return data
    }
    if (groqKey) {
      const data = await tryAI("https://api.groq.com/openai/v1/chat/completions", groqKey, "groq/compound-mini").catch(() => null)
      if (data?.sections?.length > 0) return data
    }
  } catch {}
  return null
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const companyId = searchParams.get("company") ?? ""
  return handleRequest(companyId)
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  return handleRequest(body.company ?? "")
}

async function handleRequest(companyId: string) {
  if (!companyId) return NextResponse.json({ error: "company required" }, { status: 400 })

  const companyEntry = ALL_COMPANIES.find(c => c.id === companyId)
  if (!companyEntry) return NextResponse.json({ error: "unknown company" }, { status: 404 })

  const companyName = companyEntry.name

  // ── Check if we have a fresh live-fetched pattern in MongoDB ──────────────
  let existingPattern: CompanyPattern | null = null
  try {
    const db = await getDatabase()
    const cached = await db.collection("company_patterns").findOne({ company: companyId })
    if (cached) {
      existingPattern = cached as unknown as CompanyPattern
      const age = Date.now() - new Date(cached.fetchedAt ?? cached.updatedAt).getTime()
      if (age < FRESH_SEARCH_TTL && cached.source === "web+ai") {
        // Fresh web-fetched pattern exists — return immediately
        return NextResponse.json({
          pattern: existingPattern,
          fresh: true,
          source: "cache",
        })
      }
    }
  } catch {}

  // ── Perform live web search for latest exam pattern ──────────────────────
  let livePattern: Partial<CompanyPattern> | null = null
  let searchSource = "fallback"

  try {
    const { urls, snippets } = await searchLatestPattern(companyName, companyId)

    // Fetch page content from top search results concurrently
    let combinedText = snippets
    if (urls.length > 0) {
      const pageTexts = await Promise.allSettled(urls.slice(0, 3).map(url => fetchPage(url)))
      for (const result of pageTexts) {
        if (result.status === "fulfilled" && result.value.length > 300) {
          combinedText += "\n\n" + result.value.slice(0, 2000)
        }
      }
    }

    if (combinedText.trim().length > 100) {
      const extracted = await extractPatternWithAI(companyName, combinedText)
      if (extracted?.sections?.length > 0) {
        livePattern = extracted
        searchSource = "web+ai"
      }
    }
  } catch (e) {
    console.warn("Live pattern search failed:", e)
  }

  // ── Get base pattern (fallback if live failed) ────────────────────────────
  const basePattern = await getCompanyPattern(companyId, companyName)

  // ── Merge: live takes priority, fall back to cached/static ───────────────
  const finalPattern: CompanyPattern = {
    company:        companyId,
    companyName,
    fetchedAt:      new Date(),
    source:         livePattern?.sections?.length ? searchSource : (basePattern?.source ?? "fallback"),
    totalQuestions: livePattern?.totalQuestions ?? basePattern?.totalQuestions ?? companyEntry.questions,
    totalTime:      livePattern?.totalTime      ?? basePattern?.totalTime      ?? companyEntry.duration,
    sections:       (livePattern?.sections?.length ? livePattern.sections : basePattern?.sections) ?? [],
    notes:          (livePattern as any)?.notes ?? basePattern?.notes ?? "",
  }

  // If no sections at all, fall back to what's in companies-data
  if (finalPattern.sections.length === 0) {
    const SECTION_CONFIG: Record<string, { name: string; questions: number; timeMinutes: number; difficulty: string; isCoding: boolean }> = {
      "quantitative":    { name: "Quantitative Aptitude", questions: 15, timeMinutes: 20, difficulty: "Medium",      isCoding: false },
      "advanced-aptitude": { name: "Logical Reasoning",  questions: 12, timeMinutes: 20, difficulty: "Medium",      isCoding: false },
      "verbal":          { name: "Verbal Ability",        questions: 10, timeMinutes: 15, difficulty: "Easy-Medium", isCoding: false },
      "basic-coding":    { name: "Basic Coding",          questions: 1,  timeMinutes: 20, difficulty: "Easy",        isCoding: true  },
      "advanced-coding": { name: "Advanced Coding",       questions: 2,  timeMinutes: 30, difficulty: "Medium",      isCoding: true  },
      "logical":         { name: "Logical Reasoning",     questions: 12, timeMinutes: 20, difficulty: "Medium",      isCoding: false },
      "coding":          { name: "Coding",                questions: 2,  timeMinutes: 30, difficulty: "Medium",      isCoding: true  },
    }
    finalPattern.sections = companyEntry.sections.map(s => ({
      id: s,
      topics: [],
      ...(SECTION_CONFIG[s] ?? { name: s, questions: 5, timeMinutes: 15, difficulty: "Medium", isCoding: false }),
    }))
  }

  // ── Save updated pattern to MongoDB ─────────────────────────────────────
  try {
    const db = await getDatabase()
    await db.collection("company_patterns").updateOne(
      { company: companyId },
      { $set: { ...finalPattern, updatedAt: new Date() } },
      { upsert: true }
    )
  } catch {}

  return NextResponse.json({
    pattern: finalPattern,
    fresh: !!livePattern?.sections?.length,
    source: finalPattern.source,
  })
}
