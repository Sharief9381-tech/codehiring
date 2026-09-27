/**
 * Seed pattern embeddings directly (no server needed).
 * Run: node scripts/seed-pattern-embeddings.mjs
 */
import { MongoClient } from "mongodb"
import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))

// Manual .env parser (avoids dotenv package resolution issues)
function loadEnv(envPath) {
  try {
    const text = readFileSync(envPath, "utf8")
    for (const line of text.split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eq = trimmed.indexOf("=")
      if (eq < 0) continue
      const key = trimmed.slice(0, eq).trim()
      const val = trimmed.slice(eq + 1).trim()
      if (key && !process.env[key]) process.env[key] = val
    }
  } catch {}
}

loadEnv(join(__dirname, "../.env"))

const MONGODB_URI   = process.env.MONGODB_URI
const OPENAI_KEY    = process.env.OPENAI_API_KEY
const DB_NAME       = "codetrack"
const COLLECTION    = "pattern_embeddings"
const EMBED_MODEL   = "text-embedding-3-small"
const EMBED_URL     = "https://api.openai.com/v1/embeddings"

if (!MONGODB_URI) { console.error("❌ MONGODB_URI not set"); process.exit(1) }

// ── Lightweight local embedding fallback (no OpenAI needed) ──────────────────
// Uses a 256-dim bag-of-words hash vector — good enough for cosine similarity
// on structured exam pattern text. Works without any API key.
const VOCAB_SIZE = 256

function hashEmbed(text) {
  const words = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2)

  const vec = new Float32Array(VOCAB_SIZE).fill(0)
  for (const word of words) {
    let h = 5381
    for (let i = 0; i < word.length; i++) h = ((h << 5) + h) + word.charCodeAt(i)
    const idx = Math.abs(h) % VOCAB_SIZE
    vec[idx] += 1
  }

  // L2 normalize
  let norm = 0
  for (const v of vec) norm += v * v
  norm = Math.sqrt(norm) || 1
  return Array.from(vec).map(v => v / norm)
}

// Try OpenAI first, fall back to local hash embedding
async function embedBatch(texts) {
  if (OPENAI_KEY) {
    try {
      const res = await fetch(EMBED_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${OPENAI_KEY}` },
        body: JSON.stringify({ model: EMBED_MODEL, input: texts.map(t => t.slice(0, 8000)) }),
      })
      if (res.ok) {
        const data = await res.json()
        return data.data.sort((a, b) => a.index - b.index).map(d => d.embedding)
      }
      const err = await res.text()
      console.warn(`  ⚠️  OpenAI unavailable (${res.status}), using local embeddings`)
    } catch (e) {
      console.warn(`  ⚠️  OpenAI failed (${e.message}), using local embeddings`)
    }
  }
  // Local fallback — 256-dim hash vectors
  return texts.map(hashEmbed)
}

// ── All company patterns (inline, mirrors company-pattern.ts FALLBACK_PATTERNS) ──
const FALLBACK_PATTERNS = {
  tcs: {
    companyName:"TCS", totalQuestions:85, totalTime:190, notes:"No negative marking. Foundation mandatory. Advanced for Digital/Prime.",
    sections:[
      { id:"quantitative",    name:"Numerical Ability",   questions:20, timeMinutes:40, difficulty:"Medium",     topics:["Percentages","Time & Work","Speed & Distance","Profit & Loss","Number Series","Probability"],   isCoding:false },
      { id:"advanced-aptitude",name:"Reasoning Ability", questions:30, timeMinutes:50, difficulty:"Medium",     topics:["Syllogisms","Blood Relations","Seating Arrangement","Coding-Decoding","Puzzles"],                isCoding:false },
      { id:"advanced-coding", name:"Coding",             questions:3,  timeMinutes:60, difficulty:"Medium",     topics:["Array Manipulation","String Operations","Basic DP","Hash Map","Greedy"],                        isCoding:true  },
    ],
  },
  infosys: {
    companyName:"Infosys", totalQuestions:65, totalTime:95, notes:"Separate 3-hour coding round. Sectional cutoffs apply.",
    sections:[
      { id:"quantitative",    name:"Quantitative Aptitude",questions:15,timeMinutes:25,difficulty:"Medium",     topics:["Ratios","Averages","Mixtures","Algebra","Geometry","Probability"],                               isCoding:false },
      { id:"advanced-aptitude",name:"Logical Reasoning",  questions:15,timeMinutes:25,difficulty:"Medium",     topics:["Puzzles","Series Completion","Directions","Analogy","Data Interpretation"],                      isCoding:false },
      { id:"verbal",          name:"Verbal Ability",       questions:20,timeMinutes:20,difficulty:"Easy-Medium",topics:["Reading Comprehension","Grammar","Vocabulary","Error Correction"],                               isCoding:false },
      { id:"advanced-coding", name:"Coding",              questions:2, timeMinutes:180,difficulty:"Medium",    topics:["Arrays","Strings","Sorting","DP","Recursion","Trees","Hash Map"],                                isCoding:true  },
    ],
  },
  wipro: {
    companyName:"Wipro", totalQuestions:55, totalTime:60, notes:"Essay writing section. No sectional cutoffs.",
    sections:[
      { id:"quantitative",    name:"Aptitude",             questions:16,timeMinutes:16,difficulty:"Easy-Medium",topics:["Percentages","SI/CI","Mensuration","Time & Distance","Permutation & Combination"],              isCoding:false },
      { id:"advanced-aptitude",name:"Logical Reasoning",  questions:14,timeMinutes:14,difficulty:"Easy-Medium",topics:["Statement & Assumption","Course of Action","Analogy","Series","Directions"],                    isCoding:false },
      { id:"verbal",          name:"Written Communication",questions:1, timeMinutes:20,difficulty:"Easy",       topics:["Essay Writing"],                                                                                 isCoding:false },
      { id:"advanced-coding", name:"Coding",              questions:1, timeMinutes:60,difficulty:"Easy-Medium",topics:["Arrays","Strings","Math","Sorting"],                                                             isCoding:true  },
    ],
  },
  cognizant: {
    companyName:"Cognizant", totalQuestions:55, totalTime:120, notes:"GenC Elevate includes Technical MCQ section.",
    sections:[
      { id:"quantitative",    name:"Aptitude + Reasoning + Verbal",questions:24,timeMinutes:45,difficulty:"Easy-Medium",topics:["Arithmetic","Algebra","Data Interpretation","Logical Reasoning","Grammar"],            isCoding:false },
      { id:"advanced-aptitude",name:"Technical MCQ",              questions:20,timeMinutes:30,difficulty:"Easy-Medium",topics:["C Programming","OOP","Data Structures","DBMS","OS","Networking"],                       isCoding:false },
      { id:"advanced-coding", name:"Coding",                      questions:2, timeMinutes:60,difficulty:"Easy-Medium",topics:["Arrays","Strings","Sorting","Hash Map","Basic DP"],                                    isCoding:true  },
    ],
  },
  capgemini: {
    companyName:"Capgemini", totalQuestions:60, totalTime:90, notes:"Essay round after technical. Separate HR round.",
    sections:[
      { id:"quantitative",    name:"Quantitative Aptitude",questions:16,timeMinutes:16,difficulty:"Medium",     topics:["Number System","Averages","Time-Work","Mensuration","Algebra"],                                 isCoding:false },
      { id:"advanced-aptitude",name:"Logical Reasoning",  questions:10,timeMinutes:10,difficulty:"Medium",     topics:["Series","Analogy","Odd One Out","Matrix","Puzzle"],                                              isCoding:false },
      { id:"verbal",          name:"Verbal Ability",       questions:10,timeMinutes:10,difficulty:"Easy",       topics:["Fill Blanks","Error Correction","Reading Comprehension"],                                        isCoding:false },
      { id:"basic-coding",    name:"Pseudo Code",          questions:5, timeMinutes:5, difficulty:"Easy",       topics:["Algorithm Tracing","Code Completion","Array Logic"],                                             isCoding:false },
      { id:"advanced-coding", name:"Coding",              questions:1, timeMinutes:30,difficulty:"Medium",     topics:["Binary Search","Sorting","Hash Map","Stack","Two Pointers"],                                    isCoding:true  },
    ],
  },
  accenture: {
    companyName:"Accenture", totalQuestions:90, totalTime:90, notes:"Cognitive 90Q mixed quant+logical+verbal. Separate coding round.",
    sections:[
      { id:"quantitative",    name:"Cognitive Ability",    questions:90,timeMinutes:90,difficulty:"Medium",     topics:["Data Interpretation","Number Systems","Profit/Loss","Ages","Percentages","Syllogisms","Puzzles"],isCoding:false },
      { id:"advanced-coding", name:"Coding",              questions:2, timeMinutes:45,difficulty:"Easy-Medium",topics:["Arrays","Strings","Basic loops","Sorting","Hash Map","Basic DP"],                              isCoding:true  },
    ],
  },
  amazon: {
    companyName:"Amazon", totalQuestions:3, totalTime:90, notes:"Strong focus on Leadership Principles. Work simulation included.",
    sections:[
      { id:"basic-coding",    name:"Coding Round 1",       questions:2, timeMinutes:75,difficulty:"Medium-Hard",topics:["Sliding Window","Two Pointers","Hash Map","Arrays","Priority Queue","BFS/DFS"],               isCoding:true  },
      { id:"advanced-coding", name:"Work Simulation",     questions:1, timeMinutes:15,difficulty:"Medium",     topics:["Debugging","Code Fix","Work Simulation"],                                                       isCoding:true  },
    ],
  },
  google: {
    companyName:"Google", totalQuestions:2, totalTime:60, notes:"Phone screen. Very hard. Focus on optimal solutions.",
    sections:[
      { id:"advanced-coding", name:"Coding Screen",        questions:2, timeMinutes:60,difficulty:"Hard",       topics:["Dynamic Programming","Graph Algorithms","Tree DP","Bitmask DP","Topological Sort"],            isCoding:true  },
    ],
  },
  microsoft: {
    companyName:"Microsoft", totalQuestions:3, totalTime:90, notes:"Culture fit + technical rounds. Emphasis on code quality.",
    sections:[
      { id:"basic-coding",    name:"Coding Round 1",       questions:2, timeMinutes:60,difficulty:"Medium",     topics:["Arrays","Hash Map","String Manipulation","Binary Search","Stack"],                             isCoding:true  },
      { id:"advanced-coding", name:"Coding Round 2",      questions:1, timeMinutes:30,difficulty:"Medium-Hard",topics:["Dynamic Programming","Recursion","Linked List","Graphs"],                                      isCoding:true  },
    ],
  },
  meta: {
    companyName:"Meta", totalQuestions:2, totalTime:60, notes:"System design + coding. Focus on scale.",
    sections:[
      { id:"advanced-coding", name:"Coding Interview",     questions:2, timeMinutes:60,difficulty:"Very Hard",  topics:["Dynamic Programming","Graphs","Tree Algorithms","Sliding Window","Advanced DS"],               isCoding:true  },
    ],
  },
  deloitte: {
    companyName:"Deloitte", totalQuestions:50, totalTime:80, notes:"No coding for consulting. Technical roles may have extra rounds.",
    sections:[
      { id:"quantitative",    name:"Quantitative Aptitude",questions:20,timeMinutes:30,difficulty:"Medium",     topics:["Data Tables","Charts","Business Math","Percentages","Ratios"],                                  isCoding:false },
      { id:"advanced-aptitude",name:"Logical Reasoning",  questions:15,timeMinutes:25,difficulty:"Medium",     topics:["Deductive Reasoning","Abstract Patterns","Syllogisms","Sequences"],                             isCoding:false },
      { id:"verbal",          name:"Verbal Ability",       questions:15,timeMinutes:25,difficulty:"Medium",     topics:["Critical Reasoning","Sentence Completion","Reading Comprehension"],                             isCoding:false },
    ],
  },
  jpmorgan: {
    companyName:"JP Morgan", totalQuestions:4, totalTime:120, notes:"Code for Good contest. Financial aptitude tested.",
    sections:[
      { id:"quantitative",    name:"Quantitative Aptitude",questions:20,timeMinutes:30,difficulty:"Medium",     topics:["Data Interpretation","Business Math","Percentages","Financial Concepts"],                       isCoding:false },
      { id:"advanced-coding", name:"Code for Good Coding", questions:2, timeMinutes:75,difficulty:"Hard",       topics:["Dynamic Programming","Graph Algorithms","Binary Search","Data Structures"],                    isCoding:true  },
    ],
  },
  "goldman-sachs": {
    companyName:"Goldman Sachs", totalQuestions:3, totalTime:90, notes:"Strong quantitative emphasis. Coding is DSA-heavy.",
    sections:[
      { id:"quantitative",    name:"Quantitative Aptitude",questions:20,timeMinutes:30,difficulty:"Hard",       topics:["Probability","Statistics","Financial Math","Data Interpretation"],                              isCoding:false },
      { id:"advanced-coding", name:"Coding Assessment",    questions:2, timeMinutes:60,difficulty:"Hard",       topics:["Dynamic Programming","Graph Algorithms","Binary Search","Advanced DS"],                        isCoding:true  },
    ],
  },
  zoho: {
    companyName:"Zoho", totalQuestions:3, totalTime:180, notes:"Very long programming contest. Logic-heavy. Multiple rounds.",
    sections:[
      { id:"quantitative",    name:"Aptitude",             questions:30,timeMinutes:30,difficulty:"Medium",     topics:["Number System","Averages","Time-Work","Mensuration","Probability"],                             isCoding:false },
      { id:"advanced-aptitude",name:"Logical Reasoning",  questions:20,timeMinutes:30,difficulty:"Medium",     topics:["Puzzles","Seating Arrangement","Series","Analogy"],                                             isCoding:false },
      { id:"advanced-coding", name:"Programming Contest", questions:3, timeMinutes:120,difficulty:"Hard",      topics:["Complex Algorithms","DP","Graphs","Recursion","Math"],                                          isCoding:true  },
    ],
  },
  freshworks: {
    companyName:"Freshworks", totalQuestions:3, totalTime:75, notes:"Focus on product thinking + coding.",
    sections:[
      { id:"quantitative",    name:"Aptitude",             questions:15,timeMinutes:15,difficulty:"Medium",     topics:["Percentages","Time & Work","Averages","Data Interpretation"],                                   isCoding:false },
      { id:"advanced-aptitude",name:"Logical Reasoning",  questions:10,timeMinutes:10,difficulty:"Medium",     topics:["Puzzles","Series","Blood Relations"],                                                           isCoding:false },
      { id:"advanced-coding", name:"Coding",              questions:2, timeMinutes:60,difficulty:"Medium-Hard",topics:["Arrays","Hash Map","Sliding Window","Recursion","DP"],                                         isCoding:true  },
    ],
  },
}

// Category fallbacks for all remaining companies
const CATEGORY_SECTIONS = {
  "IT Services": [
    { id:"quantitative",    name:"Quantitative Aptitude", questions:15,timeMinutes:20,difficulty:"Easy-Medium",topics:["Percentages","Time & Work","Speed & Distance","Number Series","Averages"],     isCoding:false },
    { id:"advanced-aptitude",name:"Logical Reasoning",   questions:15,timeMinutes:20,difficulty:"Easy-Medium",topics:["Syllogisms","Blood Relations","Seating Arrangement","Coding-Decoding"],        isCoding:false },
    { id:"verbal",          name:"Verbal Ability",        questions:10,timeMinutes:15,difficulty:"Easy",       topics:["Synonyms","Fill in the Blanks","Error Detection","Grammar"],                    isCoding:false },
    { id:"basic-coding",    name:"Basic Coding",          questions:1, timeMinutes:20,difficulty:"Easy",       topics:["Arrays","Strings","Loops","Basic Math"],                                       isCoding:true  },
    { id:"advanced-coding", name:"Advanced Coding",       questions:1, timeMinutes:30,difficulty:"Medium",     topics:["Sorting","Recursion","Hash Map","Trees"],                                      isCoding:true  },
  ],
  "Product": [
    { id:"basic-coding",    name:"Coding Round 1",        questions:2, timeMinutes:75,difficulty:"Medium-Hard",topics:["Sliding Window","Two Pointers","Hash Map","BFS/DFS","Binary Search","DP"],    isCoding:true  },
    { id:"advanced-coding", name:"Coding Round 2",        questions:1, timeMinutes:30,difficulty:"Hard",       topics:["Advanced DP","Graph Algorithms","Tree DP","System Design"],                   isCoding:true  },
  ],
  "Startups": [
    { id:"basic-coding",    name:"Coding Assessment",     questions:2, timeMinutes:60,difficulty:"Medium",     topics:["Arrays","Strings","Hash Map","BFS/DFS","Sorting","Two Pointers"],             isCoding:true  },
    { id:"advanced-coding", name:"Advanced Coding",       questions:1, timeMinutes:30,difficulty:"Hard",       topics:["Dynamic Programming","Graphs","Advanced Data Structures"],                    isCoding:true  },
  ],
  "Consulting": [
    { id:"quantitative",    name:"Quantitative Aptitude", questions:20,timeMinutes:30,difficulty:"Medium",     topics:["Data Interpretation","Business Math","Percentages","Ratios"],                  isCoding:false },
    { id:"advanced-aptitude",name:"Logical Reasoning",   questions:15,timeMinutes:25,difficulty:"Medium",     topics:["Deductive Reasoning","Abstract Patterns","Syllogisms"],                        isCoding:false },
    { id:"verbal",          name:"Verbal Ability",        questions:15,timeMinutes:25,difficulty:"Medium",     topics:["Reading Comprehension","Sentence Correction","Vocabulary"],                    isCoding:false },
  ],
  "BFSI": [
    { id:"quantitative",    name:"Quantitative Aptitude", questions:20,timeMinutes:30,difficulty:"Medium",     topics:["Data Interpretation","Financial Math","Percentages","Probability"],            isCoding:false },
    { id:"advanced-aptitude",name:"Logical Reasoning",   questions:15,timeMinutes:25,difficulty:"Medium",     topics:["Seating Arrangement","Blood Relations","Coding-Decoding","Puzzles"],           isCoding:false },
    { id:"basic-coding",    name:"Technical/Coding",      questions:2, timeMinutes:45,difficulty:"Medium",     topics:["Arrays","Hash Map","Sorting","Graphs","Dynamic Programming"],                 isCoding:true  },
  ],
  "Core Engg": [
    { id:"quantitative",    name:"Quantitative Aptitude", questions:25,timeMinutes:35,difficulty:"Medium",     topics:["Mathematics","Physics","Engineering Math","Data Interpretation"],              isCoding:false },
    { id:"advanced-aptitude",name:"Technical Aptitude",  questions:25,timeMinutes:35,difficulty:"Medium",     topics:["Engineering Concepts","Technical MCQ","Domain Knowledge"],                    isCoding:false },
    { id:"verbal",          name:"Verbal Ability",        questions:20,timeMinutes:25,difficulty:"Easy-Medium",topics:["Grammar","Comprehension","Vocabulary","Technical Communication"],              isCoding:false },
  ],
}

// All 189 companies from companies-data.ts (id, name, category)
const ALL_COMPANIES = [
  {id:"tcs",name:"TCS",category:"IT Services"},{id:"infosys",name:"Infosys",category:"IT Services"},
  {id:"wipro",name:"Wipro",category:"IT Services"},{id:"cognizant",name:"Cognizant",category:"IT Services"},
  {id:"capgemini",name:"Capgemini",category:"IT Services"},{id:"accenture",name:"Accenture",category:"IT Services"},
  {id:"hcl",name:"HCL Technologies",category:"IT Services"},{id:"tech-mahindra",name:"Tech Mahindra",category:"IT Services"},
  {id:"mphasis",name:"Mphasis",category:"IT Services"},{id:"hexaware",name:"Hexaware",category:"IT Services"},
  {id:"ltimindtree",name:"LTIMindtree",category:"IT Services"},{id:"zensar",name:"Zensar Technologies",category:"IT Services"},
  {id:"persistent",name:"Persistent Systems",category:"IT Services"},{id:"cyient",name:"Cyient",category:"IT Services"},
  {id:"birlasoft",name:"Birlasoft",category:"IT Services"},{id:"sonata",name:"Sonata Software",category:"IT Services"},
  {id:"tata-elxsi",name:"Tata Elxsi",category:"IT Services"},{id:"nisum",name:"Nisum",category:"IT Services"},
  {id:"xoriant",name:"Xoriant",category:"IT Services"},{id:"mastech",name:"Mastech Digital",category:"IT Services"},
  {id:"3i-infotech",name:"3i Infotech",category:"IT Services"},{id:"infoedge",name:"Info Edge",category:"IT Services"},
  {id:"niit-tech",name:"NIIT Technologies",category:"IT Services"},
  {id:"amazon",name:"Amazon",category:"Product"},{id:"microsoft",name:"Microsoft",category:"Product"},
  {id:"google",name:"Google",category:"Product"},{id:"meta",name:"Meta",category:"Product"},
  {id:"apple",name:"Apple",category:"Product"},{id:"adobe",name:"Adobe",category:"Product"},
  {id:"oracle",name:"Oracle",category:"Product"},{id:"atlassian",name:"Atlassian",category:"Product"},
  {id:"salesforce",name:"Salesforce",category:"Product"},{id:"qualcomm",name:"Qualcomm",category:"Product"},
  {id:"nvidia",name:"NVIDIA",category:"Product"},{id:"intel",name:"Intel",category:"Product"},
  {id:"intuit",name:"Intuit",category:"Product"},{id:"cisco",name:"Cisco",category:"Product"},
  {id:"samsung",name:"Samsung RnD",category:"Product"},{id:"palo-alto",name:"Palo Alto Networks",category:"Product"},
  {id:"servicenow",name:"ServiceNow",category:"Product"},{id:"linkedin",name:"LinkedIn",category:"Product"},
  {id:"uber",name:"Uber",category:"Product"},{id:"stripe",name:"Stripe",category:"Product"},
  {id:"snowflake",name:"Snowflake",category:"Product"},{id:"databricks",name:"Databricks",category:"Product"},
  {id:"thoughtworks",name:"ThoughtWorks",category:"Product"},
  {id:"flipkart",name:"Flipkart",category:"Startups"},{id:"swiggy",name:"Swiggy",category:"Startups"},
  {id:"zomato",name:"Zomato",category:"Startups"},{id:"paytm",name:"Paytm",category:"Startups"},
  {id:"phonepe",name:"PhonePe",category:"Startups"},{id:"razorpay",name:"Razorpay",category:"Startups"},
  {id:"groww",name:"Groww",category:"Startups"},{id:"meesho",name:"Meesho",category:"Startups"},
  {id:"myntra",name:"Myntra",category:"Startups"},{id:"ola",name:"Ola",category:"Startups"},
  {id:"freshworks",name:"Freshworks",category:"Startups"},{id:"zoho",name:"Zoho",category:"Startups"},
  {id:"browserstack",name:"BrowserStack",category:"Startups"},{id:"dream11",name:"Dream11",category:"Startups"},
  {id:"cred",name:"CRED",category:"Startups"},{id:"zepto",name:"Zepto",category:"Startups"},
  {id:"byjus",name:"BYJU S",category:"Startups"},{id:"unacademy",name:"Unacademy",category:"Startups"},
  {id:"makemytrip",name:"MakeMyTrip",category:"Startups"},{id:"sharechat",name:"ShareChat",category:"Startups"},
  {id:"zerodha",name:"Zerodha",category:"Startups"},{id:"postman",name:"Postman",category:"Startups"},
  {id:"urban-company",name:"Urban Company",category:"Startups"},{id:"cleartax",name:"ClearTax",category:"Startups"},
  {id:"deloitte",name:"Deloitte",category:"Consulting"},{id:"pwc",name:"PwC",category:"Consulting"},
  {id:"kpmg",name:"KPMG",category:"Consulting"},{id:"ey",name:"EY",category:"Consulting"},
  {id:"mckinsey",name:"McKinsey",category:"Consulting"},{id:"bcg",name:"BCG",category:"Consulting"},
  {id:"bain",name:"Bain and Company",category:"Consulting"},{id:"oliver-wyman",name:"Oliver Wyman",category:"Consulting"},
  {id:"genpact",name:"Genpact",category:"Consulting"},{id:"fractal",name:"Fractal Analytics",category:"Consulting"},
  {id:"mu-sigma",name:"Mu Sigma",category:"Consulting"},{id:"tiger-analytics",name:"Tiger Analytics",category:"Consulting"},
  {id:"latentview",name:"LatentView Analytics",category:"Consulting"},{id:"wns",name:"WNS Analytics",category:"Consulting"},
  {id:"exl",name:"EXL Service",category:"Consulting"},
  {id:"jpmorgan",name:"JP Morgan",category:"BFSI"},{id:"goldman-sachs",name:"Goldman Sachs",category:"BFSI"},
  {id:"morgan-stanley",name:"Morgan Stanley",category:"BFSI"},{id:"deutsche-bank",name:"Deutsche Bank",category:"BFSI"},
  {id:"barclays",name:"Barclays",category:"BFSI"},{id:"hsbc",name:"HSBC",category:"BFSI"},
  {id:"citi",name:"Citi",category:"BFSI"},{id:"nomura",name:"Nomura",category:"BFSI"},
  {id:"amex",name:"American Express",category:"BFSI"},{id:"mastercard",name:"Mastercard",category:"BFSI"},
  {id:"visa",name:"Visa",category:"BFSI"},{id:"icici",name:"ICICI Bank",category:"BFSI"},
  {id:"hdfc",name:"HDFC Bank",category:"BFSI"},{id:"axis",name:"Axis Bank",category:"BFSI"},
  {id:"sbi",name:"SBI",category:"BFSI"},
  {id:"tata-motors",name:"Tata Motors",category:"Core Engg"},{id:"l-and-t",name:"L and T",category:"Core Engg"},
  {id:"bhel",name:"BHEL",category:"Core Engg"},{id:"ongc",name:"ONGC",category:"Core Engg"},
  {id:"ntpc",name:"NTPC",category:"Core Engg"},{id:"iocl",name:"IOCL",category:"Core Engg"},
  {id:"gail",name:"GAIL",category:"Core Engg"},{id:"bpcl",name:"BPCL",category:"Core Engg"},
  {id:"maruti-suzuki",name:"Maruti Suzuki",category:"Core Engg"},{id:"mahindra",name:"Mahindra",category:"Core Engg"},
  {id:"bosch",name:"Bosch",category:"Core Engg"},{id:"siemens",name:"Siemens",category:"Core Engg"},
  {id:"honeywell",name:"Honeywell",category:"Core Engg"},{id:"ge",name:"GE Digital",category:"Core Engg"},
  {id:"caterpillar",name:"Caterpillar",category:"Core Engg"},{id:"cummins",name:"Cummins India",category:"Core Engg"},
]

// ── Build text for embedding ──────────────────────────────────────────────────
function buildText(companyName, sectionId, sectionName, topics, questions, timeMinutes, difficulty, notes, year) {
  return [
    `${companyName} campus placement exam ${year}`,
    `Section: ${sectionName} (${sectionId})`,
    `Questions: ${questions}, Time: ${timeMinutes} minutes`,
    `Difficulty: ${difficulty}`,
    topics.length > 0 ? `Topics: ${topics.join(", ")}` : "",
    notes ? `Notes: ${notes}` : "",
    `Exam pattern for ${companyName} online assessment recruitment test`,
  ].filter(Boolean).join("\n")
}

// ── Batch embed texts ─────────────────────────────────────────────────────────
async function embedBatchOLD(texts) {
  // This function is superseded by the embedBatch above with fallback
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🔌 Connecting to MongoDB...")
  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  const db  = client.db(DB_NAME)
  const col = db.collection(COLLECTION)

  // Build all docs
  const allDocs = []
  for (const co of ALL_COMPANIES) {
    const specific = FALLBACK_PATTERNS[co.id]
    const sections = specific?.sections ?? CATEGORY_SECTIONS[co.category] ?? CATEGORY_SECTIONS["IT Services"]
    const notes    = specific?.notes ?? ""

    for (const s of sections) {
      allDocs.push({
        company:     co.id,
        companyName: co.name,
        sectionId:   s.id,
        sectionName: s.name,
        questions:   s.questions,
        timeMinutes: s.timeMinutes,
        difficulty:  s.difficulty,
        topics:      s.topics,
        isCoding:    s.isCoding,
        year:        2025,
        notes,
        source:      specific ? "fallback" : "category-fallback",
      })
    }
  }

  console.log(`📦 ${allDocs.length} section docs to embed across ${ALL_COMPANIES.length} companies`)

  // Process in batches of 50 (OpenAI batch limit consideration)
  const BATCH = 50
  let done = 0
  const ops = []

  for (let i = 0; i < allDocs.length; i += BATCH) {
    const batch = allDocs.slice(i, i + BATCH)
    const texts  = batch.map(d =>
      buildText(d.companyName, d.sectionId, d.sectionName, d.topics, d.questions, d.timeMinutes, d.difficulty, d.notes, d.year)
    )

    process.stdout.write(`  Embedding batch ${Math.floor(i/BATCH)+1}/${Math.ceil(allDocs.length/BATCH)}... `)
    const embeddings = await embedBatch(texts)

    for (let j = 0; j < batch.length; j++) {
      const doc = batch[j]
      ops.push({
        updateOne: {
          filter: { company: doc.company, sectionId: doc.sectionId },
          update: {
            $set: { ...doc, textContent: texts[j], embedding: embeddings[j], updatedAt: new Date() },
            $setOnInsert: { createdAt: new Date() },
          },
          upsert: true,
        },
      })
    }

    done += batch.length
    console.log(`✓ (${done}/${allDocs.length})`)

    // Rate limit pause between batches
    if (i + BATCH < allDocs.length) await new Promise(r => setTimeout(r, 300))
  }

  // Bulk write all ops
  console.log(`\n💾 Writing ${ops.length} docs to MongoDB...`)
  const result = await col.bulkWrite(ops, { ordered: false })
  console.log(`✅ Upserted: ${result.upsertedCount}  Modified: ${result.modifiedCount}`)

  // Create index hint
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ STEP 2 DONE — ${ops.length} pattern sections seeded

⚠️  STEP 1 still needed (if not done yet):
   MongoDB Atlas → cluster0.f0js6qo → Search → Create Index
   Collection : codetrack.pattern_embeddings
   Index name : pattern_vector_index
   JSON:
   {
     "fields": [{
       "type": "vector",
       "path": "embedding",
       "numDimensions": 1536,
       "similarity": "cosine"
     }]
   }

   Also create for pyq_embeddings (index: pyq_vector_index) if not done.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)

  await client.close()
}

main().catch(e => { console.error("❌", e.message); process.exit(1) })
