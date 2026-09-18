/**
 * Company Hiring Pattern Fetcher
 * Uses RAG (web scraping + AI) to discover the current hiring pattern
 * for any company dynamically. Results cached in MongoDB for 7 days.
 *
 * Pattern includes: sections, question counts, time limits, topics, difficulty
 */

import { getDatabase } from "@/lib/database"

const PATTERN_CACHE_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days

export interface CompanyPattern {
  company:      string
  companyName:  string
  fetchedAt:    Date
  source:       string
  totalQuestions: number
  totalTime:    number // minutes
  sections: Array<{
    id:         string
    name:       string
    questions:  number
    timeMinutes: number
    difficulty: string
    topics:     string[]
    isCoding:   boolean
  }>
  notes:        string  // e.g. "No negative marking", "Sectional cutoffs"
}

// ── Fetch hiring pattern via Google Search + web scraping ─────────────────────
async function fetchPatternFromWeb(company: string, companyName: string): Promise<string> {
  const queries = [
    `${companyName} hiring pattern 2024 2025 exam sections questions time`,
    `${companyName} campus placement test pattern syllabus`,
    `${companyName} NQT OA online assessment pattern`,
  ]

  // Try Google Custom Search
  const googleKey = process.env.GOOGLE_API_KEY
  const googleCx  = process.env.GOOGLE_SEARCH_CX
  let urls: string[] = []

  if (googleKey && googleCx) {
    for (const query of queries.slice(0, 2)) {
      try {
        const res = await fetch(
          `https://www.googleapis.com/customsearch/v1?key=${googleKey}&cx=${googleCx}&q=${encodeURIComponent(query)}&num=3`,
          { signal: AbortSignal.timeout(5000) }
        )
        if (res.ok) {
          const data = await res.json()
          urls.push(...(data.items ?? []).map((i: any) => i.link))
        }
      } catch {}
    }
  }

  // Fallback: DuckDuckGo
  if (!urls.length) {
    try {
      const q = `${companyName} hiring pattern 2024 exam sections questions`
      const res = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1`,
        { signal: AbortSignal.timeout(5000) }
      )
      if (res.ok) {
        const d = await res.json()
        if (d.AbstractText) return d.AbstractText
        for (const t of d.RelatedTopics ?? []) {
          if (t.FirstURL) urls.push(t.FirstURL)
        }
      }
    } catch {}
  }

  // Fetch page content
  let combined = ""
  for (const url of urls.slice(0, 3)) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 Chrome/121.0.0.0 Safari/537.36" },
        signal: AbortSignal.timeout(7000),
      })
      if (!res.ok) continue
      const html = await res.text()
      const text = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s{3,}/g, "\n").trim().slice(0, 4000)

      if (/(section|question|aptitude|logical|verbal|coding|time|minutes|pattern)/i.test(text)) {
        combined += `\n[${new URL(url).hostname}]\n${text.slice(0, 2000)}\n`
      }
    } catch {}
    if (combined.length > 5000) break
  }

  return combined
}

// ── Use AI to extract structured pattern from web content ─────────────────────
async function extractPatternWithAI(
  company: string,
  companyName: string,
  webContent: string
): Promise<CompanyPattern | null> {
  const groqKey   = process.env.GROQ_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY
  if (!groqKey && !openaiKey) return null

  const prompt = `Extract the hiring/campus placement test pattern for ${companyName} from the content below.

WEB CONTENT:
${webContent.slice(0, 4000)}

Return ONLY valid JSON:
{
  "totalQuestions": <number>,
  "totalTime": <minutes>,
  "sections": [
    {
      "id": "quantitative",
      "name": "Quantitative Aptitude",
      "questions": 20,
      "timeMinutes": 40,
      "difficulty": "Medium",
      "topics": ["Percentages", "Time & Work", "Probability"],
      "isCoding": false
    }
  ],
  "notes": "No negative marking. Sectional cutoffs apply.",
  "source": "url or website name"
}

Section id must be one of: quantitative, advanced-aptitude, verbal, basic-coding, advanced-coding
If content doesn't have specific info, use reasonable defaults based on ${companyName}'s known pattern.`

  const call = async (url: string, key: string, model: string) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
      body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], temperature: 0.1, max_tokens: 1000 }),
      signal: AbortSignal.timeout(20000),
    })
    if (!res.ok) return null
    const d = await res.json()
    const raw = d.choices?.[0]?.message?.content?.trim() ?? ""
    const json = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
    return JSON.parse(json)
  }

  try {
    let data = null
    if (groqKey) {
      try { data = await call("https://api.groq.com/openai/v1/chat/completions", groqKey, "groq/compound-mini") } catch {}
    }
    if (!data && openaiKey) {
      try { data = await call("https://api.openai.com/v1/chat/completions", openaiKey, "gpt-4o-mini") } catch {}
    }
    if (!data) return null

    return {
      company,
      companyName,
      fetchedAt: new Date(),
      source: data.source ?? "web",
      totalQuestions: data.totalQuestions ?? 60,
      totalTime: data.totalTime ?? 60,
      sections: data.sections ?? [],
      notes: data.notes ?? "",
    }
  } catch {
    return null
  }
}

// ── Main: get company pattern with 7-day cache ────────────────────────────────
export async function getCompanyPattern(
  company: string,
  companyName: string
): Promise<CompanyPattern | null> {
  const cacheKey = `pattern:${company}`

  // 1. Check cache
  try {
    const db = await getDatabase()
    const cache = db.collection("company_patterns")
    const cached = await cache.findOne({ company })
    if (cached && (Date.now() - new Date(cached.fetchedAt).getTime()) < PATTERN_CACHE_TTL) {
      return cached as unknown as CompanyPattern
    }
  } catch {}

  // 2. Fetch from web
  const webContent = await fetchPatternFromWeb(company, companyName)
  if (!webContent) return null

  // 3. Extract with AI
  const pattern = await extractPatternWithAI(company, companyName, webContent)
  if (!pattern) return null

  // 4. Cache it
  try {
    const db = await getDatabase()
    await db.collection("company_patterns").updateOne(
      { company },
      { $set: { ...pattern, updatedAt: new Date() } },
      { upsert: true }
    )
  } catch {}

  return pattern
}

/**
 * Convert a fetched pattern to SECTION_QTY format for generate-assessment.
 * Returns a map of sectionId -> questionCount.
 */
export function patternToSectionQty(pattern: CompanyPattern): Record<string, number> {
  const qty: Record<string, number> = {}
  for (const section of pattern.sections) {
    qty[section.id] = section.questions
  }
  return qty
}

/**
 * Convert a fetched pattern to section topics override format.
 */
export function patternToTopicOverrides(pattern: CompanyPattern): Record<string, { topics: string[]; difficulty: string }> {
  const overrides: Record<string, any> = {}
  for (const section of pattern.sections) {
    if (section.topics?.length > 0) {
      overrides[section.id] = {
        topics: section.topics,
        difficulty: section.difficulty ?? "Medium",
      }
    }
  }
  return overrides
}
