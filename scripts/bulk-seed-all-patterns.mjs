/**
 * Bulk seed all company assessment patterns via live web search + AI.
 * Calls the company-assessment-pattern API for each company sequentially.
 * Results are cached in MongoDB company_patterns + pattern_embeddings.
 *
 * Run AFTER deploying to Vercel:
 *   VERCEL_URL=https://your-app.vercel.app node scripts/bulk-seed-all-patterns.mjs
 *
 * Or run locally with the dev server running on port 3000:
 *   node scripts/bulk-seed-all-patterns.mjs
 */
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

const BASE_URL = process.env.VERCEL_URL
  ? (process.env.VERCEL_URL.startsWith("http") ? process.env.VERCEL_URL : `https://${process.env.VERCEL_URL}`)
  : "http://localhost:3000"

const ALL_COMPANIES = [
  // IT Services
  "tcs","infosys","wipro","cognizant","capgemini","accenture","hcl","tech-mahindra",
  "mphasis","hexaware","ltimindtree","zensar","persistent","cyient","birlasoft",
  "sonata","tata-elxsi","nisum","xoriant","mastech","3i-infotech","infoedge","niit-tech",
  // Product
  "amazon","microsoft","google","meta","apple","adobe","oracle","atlassian","salesforce",
  "qualcomm","nvidia","intel","intuit","cisco","samsung","palo-alto","servicenow",
  "linkedin","uber","stripe","snowflake","databricks","thoughtworks",
  // Startups
  "flipkart","swiggy","zomato","paytm","phonepe","razorpay","groww","meesho","myntra",
  "ola","freshworks","zoho","browserstack","dream11","cred","zepto","byjus","unacademy",
  "makemytrip","sharechat","zerodha","postman","urban-company","cleartax",
  // Consulting
  "deloitte","pwc","kpmg","ey","mckinsey","bcg","bain","oliver-wyman","genpact",
  "fractal","mu-sigma","tiger-analytics","latentview","wns","exl",
  // BFSI
  "jpmorgan","goldman-sachs","morgan-stanley","deutsche-bank","barclays","hsbc",
  "citi","nomura","amex","mastercard","visa","icici","hdfc","axis","sbi",
  // Core Engg
  "tata-motors","l-and-t","bhel","ongc","ntpc","iocl","gail","bpcl",
  "maruti-suzuki","mahindra","bosch","siemens","honeywell","ge","caterpillar","cummins",
]

async function fetchPattern(companyId) {
  const res = await fetch(`${BASE_URL}/api/student/company-assessment-pattern`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ company: companyId }),
    signal: AbortSignal.timeout(30000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

async function main() {
  console.log(`🌐 Base URL: ${BASE_URL}`)
  console.log(`📦 Processing ${ALL_COMPANIES.length} companies...\n`)

  const results = { success: 0, webFresh: 0, cached: 0, failed: 0, errors: [] }

  for (let i = 0; i < ALL_COMPANIES.length; i++) {
    const id = ALL_COMPANIES[i]
    process.stdout.write(`[${String(i+1).padStart(3)}/${ALL_COMPANIES.length}] ${id.padEnd(20)} `)

    try {
      const data = await fetchPattern(id)
      const sections = data.pattern?.sections?.length ?? 0
      const source = data.source ?? data.pattern?.source ?? "?"

      if (source === "web+ai") {
        results.webFresh++
        console.log(`✅ WEB  (${sections} sections, ${data.pattern?.totalQuestions}Q, ${data.pattern?.totalTime}min)`)
      } else if (source === "semantic-exact" || source === "cache") {
        results.cached++
        console.log(`📦 CACHE (${sections} sections)`)
      } else {
        results.cached++
        console.log(`📋 ${source.toUpperCase()} (${sections} sections)`)
      }
      results.success++
    } catch (e) {
      results.failed++
      results.errors.push(`${id}: ${e.message}`)
      console.log(`❌ FAIL  (${e.message.slice(0, 50)})`)
    }

    // Rate limit: 2s between requests to avoid hammering Google Search API
    if (i < ALL_COMPANIES.length - 1) await new Promise(r => setTimeout(r, 2000))
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Success : ${results.success}
🌐 Web+AI  : ${results.webFresh}  (freshly fetched from web)
📦 Cached  : ${results.cached}   (from DB / fallback)
❌ Failed  : ${results.failed}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

  if (results.errors.length > 0) {
    console.log("\nErrors:")
    results.errors.forEach(e => console.log(" -", e))
  }
}

main().catch(e => { console.error("❌", e.message); process.exit(1) })
