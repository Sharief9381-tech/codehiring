/**
 * Direct pattern seeder — bypasses API, does web search + AI extraction
 * directly in Node.js for all companies. No server needed.
 * Run: node scripts/direct-seed-patterns.mjs
 */
import { MongoClient } from "mongodb"
import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))
function loadEnv(p) {
  try {
    for (const line of readFileSync(p, "utf8").split("\n")) {
      const eq = line.indexOf("="); if (eq < 0 || line.trim().startsWith("#")) continue
      const k = line.slice(0, eq).trim(), v = line.slice(eq + 1).trim()
      if (k && !process.env[k]) process.env[k] = v
    }
  } catch {}
}
loadEnv(join(__dirname, "../.env"))

const GOOGLE_KEY = process.env.GOOGLE_API_KEY
const GOOGLE_CX  = process.env.GOOGLE_SEARCH_CX
const GROQ_KEY   = process.env.GROQ_API_KEY
const OPENAI_KEY = process.env.OPENAI_API_KEY

// 256-dim hash embedding
const VOCAB = 256
function hashEmbed(text) {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w.length > 2)
  const vec = new Array(VOCAB).fill(0)
  for (const w of words) { let h = 5381; for (let i = 0; i < w.length; i++) h = ((h << 5) + h) + w.charCodeAt(i); vec[Math.abs(h) % VOCAB] += 1 }
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1
  return vec.map(v => v / norm)
}

function buildEmbedText(cn, sid, sn, topics, q, t, diff, notes) {
  return [`${cn} campus placement exam 2025`, `Section: ${sn} (${sid})`,
    `Questions: ${q}, Time: ${t} minutes`, `Difficulty: ${diff}`,
    topics.length > 0 ? `Topics: ${topics.join(", ")}` : "",
    notes ? `Notes: ${notes}` : "", `Exam pattern for ${cn} online assessment recruitment test`
  ].filter(Boolean).join("\n")
}

// Google search — skip if key is invalid (not starting with AIza)
async function googleSearch(query) {
  if (!GOOGLE_KEY || !GOOGLE_CX || !GOOGLE_KEY.startsWith("AIza")) return { urls: [], snippets: "" }
  try {
    const res = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(query)}&num=5`,
      { signal: AbortSignal.timeout(6000) }
    )
    if (!res.ok) return { urls: [], snippets: "" }
    const data = await res.json()
    const urls = (data.items ?? []).map(i => i.link)
    const snippets = (data.items ?? []).map(i => `[${i.displayLink}] ${i.snippet ?? ""}`).join("\n")
    return { urls, snippets }
  } catch { return { urls: [], snippets: "" } }
}

// Build direct scrape URLs from known placement sites
function getDirectUrls(companyId, companyName) {
  const slug = companyId.replace(/-/g, "_")
  const name = companyName.toLowerCase().replace(/\s+/g, "-")
  return [
    `https://prepinsta.com/${slug}/`,
    `https://prepinsta.com/${name}/`,
    `https://www.indiabix.com/aptitude/${slug}-placement-papers/`,
    `https://www.geeksforgeeks.org/${name}-interview-preparation/`,
    `https://www.geeksforgeeks.org/${name}-placement-preparation/`,
    `https://placement.freshersworld.com/placement-papers/${name}`,
    `https://www.careerride.com/placement-paper-${name}.aspx`,
  ]
}

// DuckDuckGo fallback
async function ddgSearch(query) {
  try {
    const res = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`,
      { signal: AbortSignal.timeout(5000) }
    )
    if (!res.ok) return { urls: [], snippets: "" }
    const d = await res.json()
    const snippets = [d.AbstractText, ...(d.RelatedTopics ?? []).slice(0, 3).map(t => t.Text)].filter(Boolean).join("\n")
    const urls = (d.RelatedTopics ?? []).slice(0, 3).map(t => t.FirstURL).filter(Boolean)
    return { urls, snippets }
  } catch { return { urls: [], snippets: "" } }
}

// Fetch page text
async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 Chrome/121.0.0.0 Safari/537.36" },
      signal: AbortSignal.timeout(7000),
    })
    if (!res.ok) return ""
    const html = await res.text()
    return html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ").replace(/\s{3,}/g, "\n").trim().slice(0, 3000)
  } catch { return "" }
}

// AI extraction
async function extractWithAI(companyName, text) {
  if (!text.trim() || text.length < 100) return null
  const prompt = `Extract the CURRENT (2024-2025) campus placement/online assessment pattern for ${companyName}.
Return ONLY valid JSON (no markdown, no explanation):
{"totalQuestions":<n>,"totalTime":<minutes>,"sections":[{"id":"<quantitative|advanced-aptitude|verbal|basic-coding|advanced-coding>","name":"<official name>","questions":<n>,"timeMinutes":<n>,"difficulty":"<Easy|Easy-Medium|Medium|Medium-Hard|Hard>","topics":["topic1","topic2"],"isCoding":<bool>}],"notes":"<important notes>","year":2025}
Rules: basic-coding=MCQ programming logic (NOT actual coding). advanced-coding=actual code writing.
Return null if no useful data.
CONTENT:\n${text.slice(0, 3500)}`

  const tryAI = async (url, key, model) => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
        body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], temperature: 0.1, max_tokens: 800 }),
        signal: AbortSignal.timeout(20000),
      })
      if (!res.ok) return null
      const d = await res.json()
      const raw = d.choices?.[0]?.message?.content?.trim() ?? ""
      const m = raw.match(/\{[\s\S]*\}/)
      if (!m) return null
      const parsed = JSON.parse(m[0])
      return parsed?.sections?.length > 0 ? parsed : null
    } catch { return null }
  }

  if (OPENAI_KEY) {
    const d = await tryAI("https://api.openai.com/v1/chat/completions", OPENAI_KEY, "gpt-4o-mini")
    if (d) return d
  }
  if (GROQ_KEY) {
    const d = await tryAI("https://api.groq.com/openai/v1/chat/completions", GROQ_KEY, "groq/compound-mini")
    if (d) return d
  }
  return null
}

// All companies with name + category
const ALL_COMPANIES = [
  {id:"tcs",name:"TCS"},{id:"infosys",name:"Infosys"},{id:"wipro",name:"Wipro"},
  {id:"cognizant",name:"Cognizant"},{id:"capgemini",name:"Capgemini"},{id:"accenture",name:"Accenture"},
  {id:"hcl",name:"HCL Technologies"},{id:"tech-mahindra",name:"Tech Mahindra"},{id:"mphasis",name:"Mphasis"},
  {id:"hexaware",name:"Hexaware"},{id:"ltimindtree",name:"LTIMindtree"},{id:"zensar",name:"Zensar"},
  {id:"persistent",name:"Persistent Systems"},{id:"cyient",name:"Cyient"},{id:"birlasoft",name:"Birlasoft"},
  {id:"sonata",name:"Sonata Software"},{id:"tata-elxsi",name:"Tata Elxsi"},{id:"nisum",name:"Nisum"},
  {id:"amazon",name:"Amazon"},{id:"microsoft",name:"Microsoft"},{id:"google",name:"Google"},
  {id:"meta",name:"Meta"},{id:"apple",name:"Apple"},{id:"adobe",name:"Adobe"},
  {id:"oracle",name:"Oracle"},{id:"atlassian",name:"Atlassian"},{id:"salesforce",name:"Salesforce"},
  {id:"qualcomm",name:"Qualcomm"},{id:"nvidia",name:"NVIDIA"},{id:"intel",name:"Intel"},
  {id:"intuit",name:"Intuit"},{id:"cisco",name:"Cisco"},{id:"samsung",name:"Samsung RnD"},
  {id:"linkedin",name:"LinkedIn"},{id:"uber",name:"Uber"},{id:"flipkart",name:"Flipkart"},
  {id:"swiggy",name:"Swiggy"},{id:"zomato",name:"Zomato"},{id:"paytm",name:"Paytm"},
  {id:"phonepe",name:"PhonePe"},{id:"razorpay",name:"Razorpay"},{id:"freshworks",name:"Freshworks"},
  {id:"zoho",name:"Zoho"},{id:"dream11",name:"Dream11"},{id:"cred",name:"CRED"},
  {id:"deloitte",name:"Deloitte"},{id:"pwc",name:"PwC"},{id:"kpmg",name:"KPMG"},
  {id:"ey",name:"EY"},{id:"mckinsey",name:"McKinsey"},{id:"bcg",name:"BCG"},
  {id:"jpmorgan",name:"JP Morgan"},{id:"goldman-sachs",name:"Goldman Sachs"},
  {id:"morgan-stanley",name:"Morgan Stanley"},{id:"barclays",name:"Barclays"},
  {id:"icici",name:"ICICI Bank"},{id:"hdfc",name:"HDFC Bank"},{id:"sbi",name:"SBI"},
  {id:"tata-motors",name:"Tata Motors"},{id:"bosch",name:"Bosch"},{id:"siemens",name:"Siemens"},
  {id:"honeywell",name:"Honeywell"},{id:"maruti-suzuki",name:"Maruti Suzuki"},
]

async function seedCompany(db, company) {
  // Try direct scrape URLs first (no API key needed)
  const directUrls = getDirectUrls(company.id, company.name)
  let combined = ""

  // Fetch top 3 direct URLs concurrently
  const pages = await Promise.allSettled(directUrls.slice(0, 3).map(fetchPage))
  for (const r of pages) {
    if (r.status === "fulfilled" && r.value.length > 200) {
      combined += "\n\n" + r.value.slice(0, 1500)
    }
  }

  // DuckDuckGo as supplement
  if (combined.length < 300) {
    const { snippets: dSnippets, urls: dUrls } = await ddgSearch(`${company.name} campus placement test 2025 pattern sections`)
    combined = dSnippets + combined
    if (dUrls.length > 0) {
      const ddgPages = await Promise.allSettled(dUrls.slice(0, 2).map(fetchPage))
      for (const r of ddgPages) {
        if (r.status === "fulfilled" && r.value.length > 200) combined += "\n\n" + r.value.slice(0, 1000)
      }
    }
  }

  // Google search (if valid key)
  if (combined.length < 300) {
    const { urls: gUrls, snippets: gSnippets } = await googleSearch(`${company.name} campus recruitment online assessment test pattern 2025 sections questions`)
    combined = gSnippets + combined
    if (gUrls.length > 0) {
      const gPages = await Promise.allSettled(gUrls.slice(0, 2).map(fetchPage))
      for (const r of gPages) {
        if (r.status === "fulfilled" && r.value.length > 200) combined += "\n\n" + r.value.slice(0, 1000)
      }
    }
  }

  const extracted = await extractWithAI(company.name, combined)

  if (!extracted?.sections?.length) return { source: "skipped", sections: 0 }

  const pattern = {
    company: company.id,
    companyName: company.name,
    fetchedAt: new Date(),
    source: "web+ai",
    totalQuestions: extracted.totalQuestions ?? extracted.sections.reduce((s, sec) => s + (sec.questions ?? 0), 0),
    totalTime: extracted.totalTime ?? extracted.sections.reduce((s, sec) => s + (sec.timeMinutes ?? 0), 0),
    sections: extracted.sections,
    notes: extracted.notes ?? "",
    updatedAt: new Date(),
  }

  // Save to company_patterns
  await db.collection("company_patterns").updateOne(
    { company: company.id },
    { $set: pattern },
    { upsert: true }
  )

  // Save to pattern_embeddings
  const ops = extracted.sections.map(s => {
    const text = buildEmbedText(company.name, s.id, s.name, s.topics ?? [], s.questions, s.timeMinutes, s.difficulty, pattern.notes)
    const embedding = hashEmbed(text)
    return {
      updateOne: {
        filter: { company: company.id, sectionId: s.id },
        update: {
          $set: { company: company.id, companyName: company.name, sectionId: s.id, sectionName: s.name,
            questions: s.questions, timeMinutes: s.timeMinutes, difficulty: s.difficulty,
            topics: s.topics ?? [], isCoding: s.isCoding, year: 2025, notes: pattern.notes,
            source: "web+ai", textContent: text, embedding, updatedAt: new Date() },
          $setOnInsert: { createdAt: new Date() },
        },
        upsert: true,
      },
    }
  })
  await db.collection("pattern_embeddings").bulkWrite(ops, { ordered: false })

  return { source: "web+ai", sections: extracted.sections.length }
}

async function main() {
  console.log("🔌 Connecting to MongoDB...")
  const client = new MongoClient(process.env.MONGODB_URI)
  await client.connect()
  const db = client.db("codetrack")

  console.log(`📦 Processing ${ALL_COMPANIES.length} companies with live web search...\n`)
  const stats = { webAI: 0, skipped: 0, failed: 0 }

  for (let i = 0; i < ALL_COMPANIES.length; i++) {
    const co = ALL_COMPANIES[i]
    process.stdout.write(`[${String(i + 1).padStart(2)}/${ALL_COMPANIES.length}] ${co.name.padEnd(22)} `)
    try {
      const result = await seedCompany(db, co)
      if (result.source === "web+ai") {
        stats.webAI++
        console.log(`✅ WEB+AI  (${result.sections} sections)`)
      } else {
        stats.skipped++
        console.log(`⏭️  SKIPPED (no web data found)`)
      }
    } catch (e) {
      stats.failed++
      console.log(`❌ FAIL    (${e.message.slice(0, 40)})`)
    }
    // 1.5s between companies to respect Google API rate limits (100 queries/day free)
    if (i < ALL_COMPANIES.length - 1) await new Promise(r => setTimeout(r, 1500))
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Web+AI : ${stats.webAI}
⏭️  Skipped: ${stats.skipped}
❌ Failed : ${stats.failed}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

  await client.close()
}

main().catch(e => { console.error("❌", e.message); process.exit(1) })
