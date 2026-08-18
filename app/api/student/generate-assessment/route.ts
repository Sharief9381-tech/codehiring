/**
 * POST /api/student/generate-assessment
 * Body: { company: string, section: string, count: number }
 * Handles all section types: quantitative, advanced-aptitude, verbal, basic-coding, advanced-coding
 */
import { NextResponse } from "next/server"
import { getPYQContext } from "@/lib/question-bank"
import { ALL_COMPANIES } from "@/lib/companies-data"

const GROQ_API   = "https://api.groq.com/openai/v1/chat/completions"
const OPENAI_API = "https://api.openai.com/v1/chat/completions"

async function callAI(prompt: string, maxTokens = 6000): Promise<string> {
  if (process.env.OPENAI_API_KEY) {
    try {
      const res = await fetch(OPENAI_API, {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], temperature: 0.7, max_tokens: maxTokens }),
      })
      if (res.ok) { const d = await res.json(); const c = d.choices?.[0]?.message?.content?.trim(); if (c) return c }
    } catch {}
  }
  if (process.env.GROQ_API_KEY) {
    const res = await fetch(GROQ_API, {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }], temperature: 0.7, max_tokens: maxTokens }),
    })
    if (res.ok) { const d = await res.json(); return d.choices?.[0]?.message?.content?.trim() ?? "" }
  }
  throw new Error("No AI provider available")
}

// ── Section definitions ──────────────────────────────────────────────────────

const SECTION_CONFIG: Record<string, { name: string; isCoding: boolean; difficulty: string; topics: string[]; lang?: string }> = {
  "quantitative":       { name: "Quantitative Aptitude",  isCoding: false, difficulty: "Medium",      topics: ["Percentages","Profit & Loss","Time & Work","Speed & Distance","Number Series","Averages","Probability","Permutation & Combination"] },
  "advanced-aptitude":  { name: "Advanced Aptitude",      isCoding: false, difficulty: "Medium-Hard",  topics: ["Syllogisms","Blood Relations","Seating Arrangement","Coding-Decoding","Data Interpretation","Critical Reasoning","Puzzles","Series Completion","Statement & Conclusion"] },
  "verbal":             { name: "Verbal Ability",          isCoding: false, difficulty: "Easy-Medium",  topics: ["Reading Comprehension","Sentence Correction","Fill in the Blanks","Para Jumbles","Vocabulary","Error Detection","Idioms","Grammar"] },
  "basic-coding":       { name: "Basic Coding",            isCoding: true,  difficulty: "Easy",         topics: ["Array Traversal","String Manipulation","Basic Math","Counting/Frequency","Simple Loops","Pattern Printing","Number Properties","Basic Recursion"], lang: "Any" },
  "advanced-coding":    { name: "Advanced Coding",         isCoding: true,  difficulty: "Medium",       topics: ["Binary Search","Sliding Window","Hash Map","Stack","Queue","Linked List","Tree DFS","Tree BFS","Dynamic Programming","Greedy","Sorting Algorithms"], lang: "Any" },
  // legacy
  "logical":            { name: "Logical Reasoning",       isCoding: false, difficulty: "Medium",       topics: ["Syllogisms","Blood Relations","Seating Arrangement","Coding-Decoding","Series Completion","Directions"] },
  "coding":             { name: "Coding",                  isCoding: true,  difficulty: "Medium",       topics: ["Arrays","Strings","Sorting","Recursion","Basic DP","Math Problems"], lang: "Any" },
}

// ── Company-specific section overrides ───────────────────────────────────────

const COMPANY_SECTION_OVERRIDES: Record<string, Record<string, Partial<typeof SECTION_CONFIG[string]>>> = {
  tcs: {
    "quantitative":      { topics: ["Percentages","Profit & Loss","Time & Work","Speed & Distance","Probability","Number Series","Averages"] },
    "advanced-aptitude": { topics: ["Syllogisms","Blood Relations","Seating Arrangement","Coding-Decoding","Data Sufficiency","Puzzles","Input-Output"] },
    "basic-coding":      { topics: ["Simple loops","Arrays","String manipulation","Basic math","Pattern printing"], difficulty: "Easy" },
    "advanced-coding":   { topics: ["Binary Search","Sliding Window","Hash Map","Stack","Tree DFS","Dynamic Programming (1D)","Greedy"], difficulty: "Medium" },
  },
  infosys: {
    "quantitative":      { topics: ["Ratios","Averages","Mixtures","Algebra","Geometry","Probability"] },
    "advanced-aptitude": { topics: ["Puzzles","Series Completion","Directions","Analogy","Data Interpretation"] },
    "basic-coding":      { topics: ["Array operations","String handling","Basic sorting","Math programs","Loops"], lang: "Java/Python" },
    "advanced-coding":   { topics: ["Sorting","String ops","Basic DP","Recursion","Trees","Hash Map"], lang: "Java/Python" },
  },
  wipro: {
    "quantitative":      { topics: ["Simple Interest","Permutation & Combination","Mensuration","Time & Distance"], difficulty: "Easy-Medium" },
    "advanced-aptitude": { topics: ["Visual Reasoning","Statement & Assumption","Course of Action","Analogy","Series"], difficulty: "Easy-Medium" },
    "verbal":            { topics: ["Synonyms/Antonyms","Sentence Rearrangement","Cloze Test","Grammar"], difficulty: "Easy" },
    "basic-coding":      { topics: ["Array reversal","String operations","Pattern printing","Math calculations","Simple loops"], difficulty: "Easy" },
    "advanced-coding":   { topics: ["Sorting","Arrays","Strings","Basic recursion","Hash Map"], difficulty: "Easy-Medium" },
  },
  cognizant: {
    "quantitative":      { topics: ["Arithmetic","Algebra","Data Interpretation"], difficulty: "Easy-Medium" },
    "advanced-aptitude": { topics: ["Puzzles","Sequences","Directions","Statement-Conclusion"], difficulty: "Easy" },
    "verbal":            { topics: ["Grammar","Comprehension","Vocabulary","Error Detection"], difficulty: "Easy" },
    "basic-coding":      { topics: ["Basic programs","String operations","Array manipulation","Loops"], difficulty: "Easy" },
    "advanced-coding":   { topics: ["Arrays","Sorting","Hash Map","Recursion","Basic DP"], difficulty: "Easy-Medium" },
  },
  capgemini: {
    "quantitative":      { topics: ["Number System","Averages","Time-Work","Mensuration"] },
    "advanced-aptitude": { topics: ["Series","Analogy","Odd One Out","Matrix","Puzzle"] },
    "verbal":            { topics: ["Fill Blanks","Error Correction","Reading Comprehension"], difficulty: "Easy" },
    "basic-coding":      { topics: ["Algorithm tracing","Code completion","Array operations","Basic logic"] },
    "advanced-coding":   { topics: ["Binary Search","Sorting","Hash Map","Stack","Two Pointers","Recursion"] },
  },
  accenture: {
    "quantitative":      { topics: ["Data Interpretation","Number Systems","Profit/Loss","Ages","Percentages"] },
    "advanced-aptitude": { topics: ["Critical Reasoning","Logical Deduction","Input-Output","Puzzles"] },
    "basic-coding":      { topics: ["Arrays","Strings","Basic loops","Simple patterns"], difficulty: "Easy-Medium", lang: "C++/Java/Python" },
    "advanced-coding":   { topics: ["Linked Lists","Stacks","Sorting","Hash Map","Basic DP","Recursion"], lang: "C++/Java/Python" },
  },
  amazon: {
    "basic-coding":      { topics: ["Sliding Window","Two Pointers","Hash Map","Arrays","Priority Queue"], difficulty: "Medium" },
    "advanced-coding":   { topics: ["Dynamic Programming","Graphs BFS/DFS","Binary Search on Answer","Interval Merging","Monotonic Stack"], difficulty: "Hard" },
  },
  google: {
    "basic-coding":      { topics: ["Arrays","Hash Map","Two Pointers","Binary Search","String Algorithms"], difficulty: "Medium" },
    "advanced-coding":   { topics: ["Dynamic Programming","Graph Algorithms","Tree DP","Bitmask DP","Topological Sort"], difficulty: "Hard" },
  },
  microsoft: {
    "basic-coding":      { topics: ["Arrays","Hash Map","String Manipulation","Binary Search","Stack"], difficulty: "Easy-Medium" },
    "advanced-coding":   { topics: ["Tree DFS/BFS","Dynamic Programming","Recursion","Linked List","Graphs"], difficulty: "Medium-Hard" },
  },
  deloitte: {
    "quantitative":      { topics: ["Data Tables","Charts","Business Math","Percentages","Ratios"], difficulty: "Medium" },
    "advanced-aptitude": { topics: ["Deductive Reasoning","Inductive Reasoning","Abstract Patterns","Syllogisms"], difficulty: "Medium" },
    "verbal":            { topics: ["Comprehension","Critical Reasoning","Sentence Completion"], difficulty: "Medium" },
  },
  pwc: {
    "quantitative":      { topics: ["Data Interpretation","Business Math","Percentages","Ratios","Profit & Loss"], difficulty: "Medium" },
    "advanced-aptitude": { topics: ["Diagrammatic reasoning","Abstract patterns","Sequences","Inductive reasoning"], difficulty: "Medium" },
    "verbal":            { topics: ["Reading Comprehension","True/False/Cannot Say","Grammar","Vocabulary"], difficulty: "Medium" },
  },
  kpmg: {
    "quantitative":      { topics: ["Number Systems","Averages","Percentages","Data Interpretation","Algebra"], difficulty: "Medium" },
    "advanced-aptitude": { topics: ["Seating Arrangement","Blood Relations","Coding-Decoding","Syllogisms","Puzzles"], difficulty: "Medium" },
    "verbal":            { topics: ["Synonyms/Antonyms","Reading Comprehension","Fill in the Blanks","Error Detection"], difficulty: "Medium" },
  },
  ey: {
    "quantitative":      { topics: ["Time & Work","Speed & Distance","Permutations","Probability","Data Interpretation"], difficulty: "Medium" },
    "advanced-aptitude": { topics: ["Visual reasoning","Pattern recognition","Logical deduction","Critical reasoning"], difficulty: "Medium" },
    "verbal":            { topics: ["Para Jumbles","Reading Comprehension","Sentence Correction","Vocabulary"], difficulty: "Medium" },
  },
}

// ── Pattern lookup ────────────────────────────────────────────────────────────

function getSectionData(companyId: string, sectionId: string) {
  const base = SECTION_CONFIG[sectionId]
  if (!base) return null
  const override = COMPANY_SECTION_OVERRIDES[companyId]?.[sectionId] ?? {}
  return { ...base, ...override }
}

function getCompanyName(companyId: string): string {
  return ALL_COMPANIES.find(c => c.id === companyId)?.name ?? companyId
}

// ── POST handler ──────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  let company = "", section = "", count = 5
  try {
    const body = await req.json()
    company = body.company ?? ""
    section = body.section ?? ""
    count   = body.count ?? 5

    const sectionData = getSectionData(company, section)
    if (!sectionData) return NextResponse.json({ error: "Unknown section" }, { status: 400 })

    const companyName = getCompanyName(company)

    if (!process.env.GROQ_API_KEY && !process.env.OPENAI_API_KEY) {
      return NextResponse.json({ questions: getFallbackQuestions(company, section, count) })
    }

    // ── For coding sections: use company-coding-ai model first ────────────────
    if (sectionData.isCoding) {
      try {
        const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
        const codingRes = await fetch(`${baseUrl}/api/student/company-coding-ai`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company, section, count, difficulty: sectionData.difficulty }),
          signal: AbortSignal.timeout(20000),
        })
        if (codingRes.ok) {
          const codingData = await codingRes.json()
          if (codingData.questions?.length > 0) {
            return NextResponse.json({
              questions: codingData.questions,
              company: companyName,
              section: sectionData.name,
              source: codingData.source,
            })
          }
        }
      } catch (codingErr) {
        console.error("company-coding-ai error:", codingErr)
      }
    }

    // ── Try web scraping for aptitude ─────────────────────────────────────────
    if (!sectionData.isCoding) {
      try {
        const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
        const scrapeRes = await fetch(`${baseUrl}/api/student/scrape-questions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company, section, count }),
          signal: AbortSignal.timeout(15000),
        })
        if (scrapeRes.ok) {
          const scrapeData = await scrapeRes.json()
          if (scrapeData.questions?.length >= count) {
            return NextResponse.json({ questions: scrapeData.questions, company: companyName, section: sectionData.name, source: "scraped" })
          }
        }
      } catch {}
    }

    // ── AI generation ─────────────────────────────────────────────────────────
    const topicsList = sectionData.topics.join(", ")
    const pyqContext = getPYQContext(company, section, 5)

    const prompt = sectionData.isCoding
      ? `You are creating a ${companyName} coding assessment.
${pyqContext ? pyqContext + "\n\n" : ""}Section: ${sectionData.name}
Topics: ${topicsList}
Difficulty: ${sectionData.difficulty}
Count: ${count}

Generate ${count} ORIGINAL coding problems that feel like real ${companyName} OA questions.
Return ONLY valid JSON array:
[{"id":1,"title":"...","difficulty":"${sectionData.difficulty}","statement":"...","constraints":"...","example":{"input":"...","output":"...","explanation":"..."},"hints":["..."],"topic":"..."}]`
      : `You are creating a ${companyName} ${sectionData.name} test.
${pyqContext ? pyqContext + "\n\n" : ""}Section: ${sectionData.name}
Topics: ${topicsList}
Difficulty: ${sectionData.difficulty}
Count needed: ${count}

Generate ${count} MCQ questions matching real ${companyName} exam style.
Return ONLY valid JSON array:
[{"id":1,"question":"...","options":["A","B","C","D"],"correct":0,"explanation":"...","topic":"...","difficulty":"${sectionData.difficulty}"}]`

    try {
      const raw = await callAI(prompt, 6000)
      const json = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
      const parsed = JSON.parse(json)
      const questions = Array.isArray(parsed) ? parsed : parsed.questions ?? parsed
      if (!Array.isArray(questions) || questions.length === 0) throw new Error("No questions")
      return NextResponse.json({ questions, company: companyName, section: sectionData.name })
    } catch (aiErr) {
      console.error("AI generation error:", aiErr)
      return NextResponse.json({ questions: getFallbackQuestions(company, section, count) })
    }
  } catch (err) {
    console.error("generate-assessment error:", err)
    return NextResponse.json({ questions: getFallbackQuestions(company, section, count) })
  }
}

// ── Fallback questions ────────────────────────────────────────────────────────

function getFallbackQuestions(company: string, section: string, count: number) {
  const isCoding = section === "coding" || section === "basic-coding" || section === "advanced-coding"

  // For coding sections — NEVER fall back to aptitude questions
  if (isCoding) {
    return [
      { id:1, title:"Two Sum", difficulty:"Easy", statement:"Given an array of integers nums and an integer target, return indices of the two numbers that add up to target. You may assume each input has exactly one solution.", constraints:"2<=nums.length<=10^4, -10^9<=nums[i]<=10^9", example:{input:"nums=[2,7,11,15], target=9",output:"[0,1]",explanation:"nums[0]+nums[1]=9"}, hints:["Use a hash map to store complement","Single pass O(n) solution possible"], topic:"Arrays & Hashing" },
      { id:2, title:"Reverse String", difficulty:"Easy", statement:"Write a function that reverses a string. The input string is given as an array of characters s. Modify the array in-place.", constraints:"1<=s.length<=10^5, s[i] is a printable ASCII character", example:{input:'s=["h","e","l","l","o"]',output:'["o","l","l","e","h"]',explanation:"Reversed in place"}, hints:["Use two pointers from both ends","Swap characters until pointers meet"], topic:"Two Pointers" },
    ].slice(0, count)
  }

  // For aptitude sections — use PYQ bank
  const { QUESTION_BANK } = require("@/lib/question-bank")
  const bank = QUESTION_BANK[company]?.[section]
    ?? QUESTION_BANK["tcs"]?.[section]
    ?? QUESTION_BANK["tcs"]?.["quantitative"]
    ?? []

  if (bank.length > 0) {
    const shuffled = [...bank].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(count, shuffled.length)).map((q: any, i: number) => ({ ...q, id: i + 1 }))
  }

  return [
    { id:1, question:"A train 240m long passes a pole in 24 seconds. How long to pass a 650m platform?", options:["89 sec","85 sec","90 sec","80 sec"], correct:0, explanation:"Speed=240/24=10m/s. Time=(240+650)/10=89sec", topic:"Speed & Distance", difficulty:"Medium" },
    { id:2, question:"If 20% of a number is 120, what is 35% of that number?", options:["200","210","205","195"], correct:1, explanation:"Number=120/0.20=600. 35% of 600=210", topic:"Percentages", difficulty:"Medium" },
    { id:3, question:"Find the missing: 3, 7, 15, 31, 63, ?", options:["127","125","128","124"], correct:0, explanation:"Each term = previous×2+1. 63×2+1=127", topic:"Number Series", difficulty:"Medium" },
  ].slice(0, count)
}
