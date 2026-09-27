/**
 * GET /api/student/company-assessment-pattern?company=tcs
 * POST /api/student/company-assessment-pattern  { company: "tcs" }
 *
 * Returns the latest assessment pattern for a company.
 *
 * Priority order:
 * 1. Semantic search in pattern_embeddings (vector store) — instant, rich context
 * 2. MongoDB company_patterns cache (7-day) — structured, fast
 * 3. Live web search + AI extraction — freshest but slow (~5s)
 * 4. Hardcoded fallback patterns — always available
 */

import { NextResponse } from "next/server"
import { ALL_COMPANIES } from "@/lib/companies-data"
import { getDatabase } from "@/lib/database"
import { getCompanyPattern, type CompanyPattern } from "@/lib/rag/company-pattern"
import {
  semanticPatternSearch,
  getCompanyPatternSections,
  upsertPatternDocsBulk,
  buildPatternText,
  type PatternDoc,
} from "@/lib/rag/pattern-search"

const CACHE_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days

// ── Default section config ────────────────────────────────────────────────────
const DEFAULT_SECTION: Record<string, { name: string; questions: number; timeMinutes: number; difficulty: string; isCoding: boolean }> = {
  "quantitative":      { name: "Quantitative Aptitude", questions: 15, timeMinutes: 20, difficulty: "Medium",      isCoding: false },
  "advanced-aptitude": { name: "Logical Reasoning",     questions: 12, timeMinutes: 20, difficulty: "Medium",      isCoding: false },
  "verbal":            { name: "Verbal Ability",         questions: 10, timeMinutes: 15, difficulty: "Easy-Medium", isCoding: false },
  "basic-coding":      { name: "Basic Coding",           questions: 1,  timeMinutes: 20, difficulty: "Easy",        isCoding: true  },
  "advanced-coding":   { name: "Advanced Coding",        questions: 2,  timeMinutes: 30, difficulty: "Medium",      isCoding: true  },
  "logical":           { name: "Logical Reasoning",      questions: 12, timeMinutes: 20, difficulty: "Medium",      isCoding: false },
  "coding":            { name: "Coding",                 questions: 2,  timeMinutes: 30, difficulty: "Medium",      isCoding: true  },
}

// ── Google Search ─────────────────────────────────────────────────────────────
async function googleSearch(query: string): Promise<{ urls: string[]; snippets: string }> {
  const apiKey = process.env.GOOGLE_API_KEY
  const cx     = process.env.GOOGLE_SEARCH_CX
  const snippets: string[] = []
  const urls: string[] = []

  if (apiKey && cx) {
    try {
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

  if (snippets.length === 0) {
    try {
      const res = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`,
        { signal: AbortSignal.timeout(5000) }
      )
      if (res.ok) {
        const d = await res.json()
        if (d.AbstractText) snippets.push(d.AbstractText)
        for (const t of (d.RelatedTopics ?? []).slice(0, 3)) {
          if (t.Text) snippets.push(t.Text)
          if (t.FirstURL) urls.push(t.FirstURL)
        }
      }
    } catch {}
  }

  return { urls: urls.slice(0, 5), snippets: snippets.join("\n") }
}

// ── Fetch page text ───────────────────────────────────────────────────────────
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
  } catch { return "" }
}

// ── AI extraction ─────────────────────────────────────────────────────────────
async function extractWithAI(companyName: string, text: string): Promise<Partial<CompanyPattern> | null> {
  const openaiKey = process.env.OPENAI_API_KEY
  const groqKey   = process.env.GROQ_API_KEY
  if (!openaiKey && !groqKey) return null
  if (text.trim().length < 100) return null

  const prompt = `Extract the CURRENT (2024-2025) campus placement test pattern for ${companyName}.
Return ONLY valid JSON (no markdown):
{
  "totalQuestions": <number>,
  "totalTime": <minutes>,
  "sections": [{"id":"<quantitative|advanced-aptitude|verbal|basic-coding|advanced-coding>","name":"<official name>","questions":<n>,"timeMinutes":<n>,"difficulty":"<Easy|Medium|Hard>","topics":["topic"],"isCoding":<bool>}],
  "notes": "<important notes>",
  "year": 2025
}

Rules:
- basic-coding = MCQ programming logic (not actual coding)
- advanced-coding = actual code-writing problems
- Return null if no useful data found

CONTENT:
${text.slice(0, 4000)}`

  const tryAI = async (url: string, key: string, model: string) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
      body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], temperature: 0.1, max_tokens: 1000 }),
      signal: AbortSignal.timeout(20000),
    })
    if (!res.ok) return null
    const d = await res.json()
    const raw = d.choices?.[0]?.message?.content?.trim() ?? ""
    const m = raw.match(/\{[\s\S]*\}/)
    if (!m) return null
    return JSON.parse(m[0])
  }

  try {
    if (openaiKey) {
      const d = await tryAI("https://api.openai.com/v1/chat/completions", openaiKey, "gpt-4o-mini").catch(() => null)
      if (d?.sections?.length > 0) return d
    }
    if (groqKey) {
      const d = await tryAI("https://api.groq.com/openai/v1/chat/completions", groqKey, "groq/compound-mini").catch(() => null)
      if (d?.sections?.length > 0) return d
    }
  } catch {}
  return null
}

// ── Convert PatternDocs (from vector store) → CompanyPattern ─────────────────
function docsToPattern(docs: PatternDoc[], companyId: string, companyName: string): CompanyPattern {
  return {
    company:        companyId,
    companyName,
    fetchedAt:      new Date(),
    source:         docs[0]?.source ?? "semantic",
    totalQuestions: docs.reduce((s, d) => s + (d.questions ?? 0), 0),
    totalTime:      docs.reduce((s, d) => s + (d.timeMinutes ?? 0), 0),
    sections:       docs.map(d => ({
      id:          d.sectionId,
      name:        d.sectionName,
      questions:   d.questions,
      timeMinutes: d.timeMinutes,
      difficulty:  d.difficulty,
      topics:      d.topics ?? [],
      isCoding:    d.isCoding,
    })),
    notes: docs[0]?.notes ?? "",
  }
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  return handleRequest(searchParams.get("company") ?? "")
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

  // ── Step 1: Semantic search in pattern_embeddings (vector store) ──────────
  // This is the fastest and richest path when embeddings have been seeded
  if (process.env.OPENAI_API_KEY) {
    try {
      const semanticQuery = `${companyName} campus placement exam 2025 sections questions topics`
      const docs = await getCompanyPatternSections(companyId)

      if (docs.length > 0) {
        // We have exact company docs — return them directly (no vector search needed)
        const pattern = docsToPattern(docs, companyId, companyName)
        return NextResponse.json({ pattern, fresh: false, source: "semantic-exact" })
      }

      // No exact docs — do cross-company semantic search to find similar patterns
      const similar = await semanticPatternSearch(semanticQuery, undefined, 15)
      // Filter to sections that match what this company should have
      const companyExpected = companyEntry.sections
      const relevantDocs = similar.filter(d => companyExpected.includes(d.sectionId))

      if (relevantDocs.length > 0) {
        // Use the semantically found sections but replace company metadata
        const remapped = relevantDocs.map(d => ({ ...d, company: companyId, companyName }))
        const pattern = docsToPattern(remapped, companyId, companyName)
        return NextResponse.json({ pattern, fresh: false, source: "semantic-similar" })
      }
    } catch (e) {
      console.warn("Semantic search failed, continuing to other sources:", e)
    }
  }

  // ── Step 2: MongoDB company_patterns cache ────────────────────────────────
  try {
    const db = await getDatabase()
    const cached = await db.collection("company_patterns").findOne({ company: companyId })
    if (cached) {
      const age = Date.now() - new Date(cached.fetchedAt ?? cached.updatedAt ?? 0).getTime()
      if (age < CACHE_TTL && cached.sections?.length > 0) {
        // Fresh cache — embed into vector store for future semantic searches
        if (process.env.OPENAI_API_KEY) {
          embedPatternInBackground(companyId, companyName, cached as unknown as CompanyPattern)
        }
        return NextResponse.json({
          pattern: cached,
          fresh: cached.source === "web+ai",
          source: "cache",
        })
      }
    }
  } catch {}

  // ── Step 3: Live web search + AI extraction ───────────────────────────────
  let webPattern: Partial<CompanyPattern> | null = null
  try {
    const query = `${companyName} campus recruitment test pattern 2025 sections questions time`
    const { urls, snippets } = await googleSearch(query)

    let combinedText = snippets
    if (urls.length > 0) {
      const pages = await Promise.allSettled(urls.slice(0, 3).map(fetchPage))
      for (const r of pages) {
        if (r.status === "fulfilled" && r.value.length > 300) {
          combinedText += "\n\n" + r.value.slice(0, 2000)
        }
      }
    }

    if (combinedText.trim().length > 100) {
      webPattern = await extractWithAI(companyName, combinedText)
    }
  } catch (e) {
    console.warn("Web search failed:", e)
  }

  // ── Step 4: Fallback ──────────────────────────────────────────────────────
  const basePattern = await getCompanyPattern(companyId, companyName)

  const finalPattern: CompanyPattern = {
    company:        companyId,
    companyName,
    fetchedAt:      new Date(),
    source:         webPattern?.sections?.length ? "web+ai" : (basePattern?.source ?? "fallback"),
    totalQuestions: webPattern?.totalQuestions ?? basePattern?.totalQuestions ?? companyEntry.questions,
    totalTime:      webPattern?.totalTime      ?? basePattern?.totalTime      ?? companyEntry.duration,
    sections:       (webPattern?.sections?.length ? webPattern.sections : basePattern?.sections) ?? [],
    notes:          (webPattern as any)?.notes ?? basePattern?.notes ?? "",
  }

  // Fill in missing sections from companies-data
  if (finalPattern.sections.length === 0) {
    finalPattern.sections = companyEntry.sections.map(s => ({
      id: s, topics: [],
      ...(DEFAULT_SECTION[s] ?? { name: s, questions: 5, timeMinutes: 15, difficulty: "Medium", isCoding: false }),
    }))
  }

  // Save to MongoDB cache
  try {
    const db = await getDatabase()
    await db.collection("company_patterns").updateOne(
      { company: companyId },
      { $set: { ...finalPattern, updatedAt: new Date() } },
      { upsert: true }
    )
  } catch {}

  // Embed into vector store in background for future semantic searches
  if (process.env.OPENAI_API_KEY && finalPattern.sections.length > 0) {
    embedPatternInBackground(companyId, companyName, finalPattern)
  }

  return NextResponse.json({
    pattern: finalPattern,
    fresh:   !!webPattern?.sections?.length,
    source:  finalPattern.source,
  })
}

// ── Background embedding (non-blocking) ──────────────────────────────────────
function embedPatternInBackground(
  companyId: string,
  companyName: string,
  pattern: CompanyPattern
) {
  const docs = pattern.sections.map(s => ({
    company:     companyId,
    companyName,
    sectionId:   s.id,
    sectionName: s.name,
    questions:   s.questions,
    timeMinutes: s.timeMinutes,
    difficulty:  s.difficulty,
    topics:      s.topics ?? [],
    isCoding:    s.isCoding,
    year:        2025,
    notes:       pattern.notes ?? "",
    source:      pattern.source ?? "fallback",
  }))

  upsertPatternDocsBulk(docs).catch(e => {
    console.warn("Background pattern embedding failed:", e)
  })
}
