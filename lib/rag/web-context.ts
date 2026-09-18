/**
 * Live web context fetcher for RAG
 * Uses Google Custom Search to dynamically discover sources for ANY company+section.
 * Falls back to direct URL fetching from known placement sites.
 * Results cached in MongoDB for 24h.
 */

import { getDatabase } from "@/lib/database"

const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

// ── Section query terms for search ───────────────────────────────────────────
const SECTION_QUERY_TERMS: Record<string, string> = {
  "quantitative":        "quantitative aptitude placement paper questions answers",
  "advanced-aptitude":   "logical reasoning placement paper questions answers",
  "verbal":              "verbal ability english placement paper questions",
  "basic-coding":        "programming questions placement paper coding mcq",
  "advanced-coding":     "coding interview questions DSA problems",
  "logical":             "logical reasoning placement paper questions answers",
  "coding":              "coding interview questions placement paper",
}

// ── Known good sources per section type ──────────────────────────────────────
const KNOWN_SOURCES: Record<string, string[]> = {
  aptitude: [
    "prepinsta.com",
    "indiabix.com",
    "geeksforgeeks.org",
    "placement.freshersworld.com",
    "careercup.com",
    "javatpoint.com/placement-papers",
    "m4maths.com",
    "examveda.com",
    "sawaal.com",
    "wisdomjobs.com",
    "tutorialspoint.com/placement_papers",
    "placementpaperz.com",
    "careerride.com",
  ],
  coding: [
    "geeksforgeeks.org",
    "leetcode.com",
    "hackerrank.com",
    "interviewbit.com",
    "prepinsta.com",
    "codingninjas.com",
    "takeuforward.org",
  ],
}

// ── Google Custom Search ──────────────────────────────────────────────────────
async function googleSearch(query: string): Promise<string[]> {
  const apiKey = process.env.GOOGLE_API_KEY
  const cx     = process.env.GOOGLE_SEARCH_CX // Custom Search Engine ID

  if (!apiKey || !cx) return []

  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=5`
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return []
    const data = await res.json()
    return (data.items ?? []).map((item: any) => item.link as string).filter(Boolean)
  } catch {
    return []
  }
}

// ── DuckDuckGo instant answer (no API key needed) ─────────────────────────────
async function duckDuckGoSearch(query: string): Promise<string[]> {
  try {
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
      { signal: AbortSignal.timeout(5000), headers: { "User-Agent": "CodeHiring/1.0" } }
    )
    if (!res.ok) return []
    const data = await res.json()

    const urls: string[] = []
    // AbstractURL and RelatedTopics
    if (data.AbstractURL) urls.push(data.AbstractURL)
    for (const topic of (data.RelatedTopics ?? [])) {
      if (topic.FirstURL) urls.push(topic.FirstURL)
    }
    return urls.slice(0, 5)
  } catch {
    return []
  }
}

// ── Build fallback URLs from known sources ────────────────────────────────────
function buildFallbackUrls(company: string, section: string): string[] {
  const isCoding = section.includes("coding")
  const sources  = isCoding ? KNOWN_SOURCES.coding : KNOWN_SOURCES.aptitude
  const sectionSlug = section.replace("-", "_")

  return [
    `https://prepinsta.com/${company.replace("-", "_")}/aptitude/`,
    `https://prepinsta.com/${company}/${isCoding ? "coding" : "aptitude"}/`,
    `https://www.indiabix.com/aptitude/${company}-placement-papers/`,
    `https://www.geeksforgeeks.org/${company}-interview-preparation/`,
    `https://placement.freshersworld.com/placement-papers/${company}`,
    `https://www.careerride.com/placement-paper-${company}.aspx`,
  ]
}

// ── Fetch and extract readable text from a URL ───────────────────────────────
async function fetchPageText(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/121.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(7000),
    })
    if (!res.ok) return ""
    const html = await res.text()
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
      .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/&#?\w+;/g, " ")
      .replace(/\s{3,}/g, "\n")
      .trim()

    // Only return if it contains question-like content
    const hasQuestions = /\b(question|answer|option|choose|find|calculate|select|correct)\b/i.test(text)
    if (!hasQuestions || text.length < 200) return ""

    return text.slice(0, 5000)
  } catch {
    return ""
  }
}

// ── Main function: get live web context with caching ──────────────────────────
export async function getLiveWebContext(company: string, section: string): Promise<string> {
  const cacheKey = `webctx:${company}:${section}`

  // 1. Check cache
  try {
    const db = await getDatabase()
    const cache = db.collection("rag_web_cache")
    const cached = await cache.findOne({ key: cacheKey })
    if (cached?.content && (Date.now() - new Date(cached.fetchedAt).getTime()) < CACHE_TTL_MS) {
      return cached.content
    }
  } catch {}

  // 2. Build search query
  const sectionTerm = SECTION_QUERY_TERMS[section] ?? "placement paper questions answers"
  const companyName = company.replace(/-/g, " ")
  const searchQuery = `${companyName} ${sectionTerm} site:prepinsta.com OR site:indiabix.com OR site:geeksforgeeks.org`

  // 3. Try Google Search → DuckDuckGo → fallback URLs
  let urls: string[] = []

  const googleUrls = await googleSearch(searchQuery)
  if (googleUrls.length > 0) {
    urls = googleUrls
  } else {
    const ddgUrls = await duckDuckGoSearch(`${companyName} ${sectionTerm}`)
    urls = ddgUrls.length > 0 ? ddgUrls : buildFallbackUrls(company, section)
  }

  // 4. Fetch top 3 URLs concurrently
  const fetchPromises = urls.slice(0, 3).map(url => fetchPageText(url))
  const results = await Promise.allSettled(fetchPromises)

  const texts: string[] = []
  for (let i = 0; i < results.length; i++) {
    const r = results[i]
    if (r.status === "fulfilled" && r.value.length > 100) {
      const hostname = (() => { try { return new URL(urls[i]).hostname } catch { return urls[i] } })()
      texts.push(`[${hostname}]\n${r.value.slice(0, 2000)}`)
    }
  }

  const combined = texts.join("\n\n---\n\n")

  // 5. Cache the result
  if (combined) {
    try {
      const db = await getDatabase()
      const cache = db.collection("rag_web_cache")
      await cache.updateOne(
        { key: cacheKey },
        { $set: { key: cacheKey, content: combined, fetchedAt: new Date(), urlsUsed: urls.slice(0, 3) } },
        { upsert: true }
      )
    } catch {}
  }

  return combined
}

/**
 * Format live web content as RAG context string for the AI prompt.
 */
export function formatWebContext(webText: string, company: string, section: string): string {
  if (!webText.trim()) return ""
  return `LIVE WEB CONTEXT — ${company.toUpperCase()} ${section.toUpperCase()} (fetched from placement paper websites):
${webText.slice(0, 4000)}

Use the above real question patterns to generate authentic ${company.toUpperCase()} ${section} assessment questions.`
}
