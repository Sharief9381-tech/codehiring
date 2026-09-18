/**
 * POST /api/admin/scrape-pyq
 * Admin-only: scrapes IndiaBix/PrepInsta for real PYQs and saves them to MongoDB
 * Body: { company, section, count?, secret? }
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getPYQCollection } from "@/lib/models/pyq"
import { ALL_COMPANIES } from "@/lib/companies-data"

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions"

// Source URLs per company/section
const SCRAPE_SOURCES: Record<string, Record<string, string[]>> = {
  tcs: {
    quantitative:      ["https://www.indiabix.com/aptitude/tcs-placement-papers/", "https://prepinsta.com/tcs-nqt/quantitative-aptitude/"],
    "advanced-aptitude": ["https://www.indiabix.com/verbal-reasoning/tcs-placement-papers/", "https://prepinsta.com/tcs-nqt/reasoning/"],
    verbal:            ["https://www.indiabix.com/verbal-ability/tcs-placement-papers/"],
  },
  infosys: {
    quantitative:      ["https://www.indiabix.com/aptitude/infosys-placement-papers/", "https://prepinsta.com/infosys/aptitude/"],
    "advanced-aptitude": ["https://prepinsta.com/infosys/reasoning/"],
    verbal:            ["https://prepinsta.com/infosys/verbal-ability/"],
  },
  wipro: {
    quantitative:      ["https://www.indiabix.com/aptitude/wipro-placement-papers/", "https://prepinsta.com/wipro/aptitude/"],
    "advanced-aptitude": ["https://prepinsta.com/wipro/reasoning/"],
  },
  cognizant: {
    quantitative:      ["https://www.indiabix.com/aptitude/cognizant-placement-papers/", "https://prepinsta.com/cognizant/aptitude/"],
    "advanced-aptitude": ["https://prepinsta.com/cognizant/reasoning/"],
  },
  capgemini: {
    quantitative:      ["https://prepinsta.com/capgemini/aptitude/"],
    "advanced-aptitude": ["https://prepinsta.com/capgemini/reasoning/"],
  },
  accenture: {
    quantitative:      ["https://prepinsta.com/accenture/aptitude/"],
    "advanced-aptitude": ["https://prepinsta.com/accenture/reasoning/"],
  },
  hcl: {
    quantitative:      ["https://prepinsta.com/hcl/aptitude/"],
  },
  "tech-mahindra": {
    quantitative:      ["https://prepinsta.com/tech-mahindra/aptitude/"],
  },
  amazon:    { "basic-coding": ["https://www.geeksforgeeks.org/amazon-interview-preparation/"] },
  microsoft: { "basic-coding": ["https://www.geeksforgeeks.org/microsoft-interview-preparation/"] },
  google:    { "basic-coding": ["https://www.geeksforgeeks.org/google-interview-preparation/"] },
}

async function fetchPageText(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return ""
    const html = await res.text()
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/&#?\w+;/g, " ")
      .replace(/\s{3,}/g, "\n")
      .trim()
      .slice(0, 8000)
  } catch { return "" }
}

async function extractWithGroq(rawText: string, company: string, section: string, count: number): Promise<any[]> {
  if (!process.env.GROQ_API_KEY) return []

  const prompt = `Extract real MCQ placement questions from this scraped text.
Company: ${company.toUpperCase()}, Section: ${section}

TEXT:
${rawText.slice(0, 5000)}

Extract up to ${count} real questions. If not enough, generate in the same style.
Return ONLY valid JSON array:
[{"question":"...","options":["A","B","C","D"],"correct":0,"explanation":"step-by-step","topic":"topic name","difficulty":"Easy|Medium|Hard","year":2024}]`

  const res = await fetch(GROQ_API, {
    method: "POST",
    headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "groq/compound-mini", messages: [{ role: "user", content: prompt }], temperature: 0.3, max_tokens: 4000 }),
    signal: AbortSignal.timeout(30000),
  })
  if (!res.ok) return []
  const data = await res.json()
  const raw = data.choices?.[0]?.message?.content?.trim() ?? ""
  const json = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
  try { return JSON.parse(json) } catch { return [] }
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  const body = await req.json().catch(() => ({}))

  // Allow both admin UI and direct API call with secret
  const isAdmin = user?.role === "admin" || user?.email === "sharief9381@gmail.com"
  const hasSecret = body.secret === process.env.SEED_SECRET || body.secret === process.env.NEXTAUTH_SECRET
  if (!isAdmin && !hasSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { company, section, count = 10 } = body
  if (!company || !section) return NextResponse.json({ error: "company and section required" }, { status: 400 })

  const companyName = ALL_COMPANIES.find(c => c.id === company)?.name ?? company.toUpperCase()
  const sources = SCRAPE_SOURCES[company]?.[section]
  if (!sources?.length) return NextResponse.json({ error: `No scrape sources for ${company}/${section}` }, { status: 400 })

  // Fetch pages
  let rawText = ""
  for (const url of sources) {
    const text = await fetchPageText(url)
    if (text.length > 300) rawText += `\n\n--- ${url} ---\n${text}`
    if (rawText.length > 12000) break
  }
  if (!rawText) return NextResponse.json({ error: "Could not fetch source pages" }, { status: 422 })

  // Extract questions
  const extracted = await extractWithGroq(rawText, company, section, count)
  if (!extracted.length) return NextResponse.json({ error: "No questions extracted" }, { status: 422 })

  // Save to MongoDB as pending
  const col = await getPYQCollection()
  const docs = extracted.map(q => ({
    company, companyName, section,
    topic: q.topic ?? "General",
    difficulty: (["Easy","Medium","Hard"].includes(q.difficulty) ? q.difficulty : "Medium") as any,
    year: q.year ?? new Date().getFullYear(),
    question: q.question,
    options: Array.isArray(q.options) ? q.options : [],
    correct: Number(q.correct ?? 0),
    explanation: q.explanation ?? "",
    status: "pending" as const,
    source: "scraper" as const,
    submittedAt: new Date(),
    ragSeeded: false,
    upvotes: 0,
    reportCount: 0,
  }))

  const result = await col.insertMany(docs, { ordered: false }).catch(e => ({ insertedCount: 0, error: e.message }))

  return NextResponse.json({
    success: true,
    scraped: extracted.length,
    saved: (result as any).insertedCount ?? 0,
    message: `Scraped ${extracted.length} questions, saved as pending for admin review`,
  })
}
