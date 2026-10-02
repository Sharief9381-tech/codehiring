/**
 * POST /api/student/generate-assessment
 * Unified question generation endpoint using the CodeHiring QGen pipeline.
 *
 * Body: {
 *   company:    string   — company id e.g. "tcs"
 *   section:    string   — section id e.g. "quantitative"
 *   count:      number   — number of questions
 *   topics?:    string[] — topic overrides from live pattern
 *   difficulty? string   — difficulty override
 * }
 */

import { NextResponse }       from "next/server"
import { generateQuestions }  from "@/lib/question-gen"
import { ALL_COMPANIES }      from "@/lib/companies-data"
import { getCompanyPatternSections } from "@/lib/rag/pattern-search"

// ── Section metadata ──────────────────────────────────────────────────────────
const SECTION_META: Record<string, { name: string; difficulty: string; topics: string[] }> = {
  "quantitative":     { name:"Quantitative Aptitude",             difficulty:"Medium",     topics:["Percentages","Profit & Loss","Time & Work","Speed & Distance","Number Series","Averages","Probability"] },
  "advanced-aptitude":{ name:"Advanced Aptitude",                 difficulty:"Medium",     topics:["Syllogisms","Blood Relations","Seating Arrangement","Coding-Decoding","Puzzles","Series","Directions"] },
  "verbal":           { name:"Verbal Ability",                    difficulty:"Easy-Medium",topics:["Reading Comprehension","Vocabulary","Grammar","Para Jumbles","Error Detection","Idioms & Phrases"] },
  "basic-coding":     { name:"Basic Coding",                      difficulty:"Easy",       topics:["Arrays","Strings","Basic Math","Pattern Printing","Loops","Conditional Logic"] },
  "advanced-coding":  { name:"Advanced Coding",                   difficulty:"Medium",     topics:["Binary Search","Hash Map","Sliding Window","Trees","Dynamic Programming","Graphs","Stack"] },
  "logical":          { name:"Logical Reasoning",                 difficulty:"Medium",     topics:["Syllogisms","Blood Relations","Directions","Series","Analogies"] },
  "coding":           { name:"Coding",                            difficulty:"Medium",     topics:["Arrays","Strings","Sorting","Recursion","Hash Map"] },
}

// ── Company-specific section quantity overrides ───────────────────────────────
const COMPANY_SECTION_QTY: Record<string, Record<string, number>> = {
  tcs:       { "advanced-coding": 3 },
  infosys:   { "advanced-coding": 2 },
  wipro:     { "advanced-coding": 2 },
  cognizant: { "advanced-coding": 2 },
  hcl:       { "basic-coding": 5, "advanced-coding": 1 },
  amazon:    { "basic-coding": 1, "advanced-coding": 1 },
  google:    { "advanced-coding": 2 },
  microsoft: { "advanced-coding": 2 },
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const company  = String(body.company  ?? "")
    const section  = String(body.section  ?? "")
    const liveTopics: string[] | undefined = body.topics?.length ? body.topics : undefined

    // Resolve count: body → company override → section default → 5
    const defaultCount =
      COMPANY_SECTION_QTY[company]?.[section] ??
      (section.includes("coding") ? 2 : 12)
    const count = Number(body.count ?? defaultCount)

    if (!company) return NextResponse.json({ error: "company required" }, { status: 400 })
    if (!section) return NextResponse.json({ error: "section required" }, { status: 400 })

    // Resolve company name
    const companyEntry = ALL_COMPANIES.find(c => c.id === company)
    const companyName  = companyEntry?.name ?? company

    // Resolve section metadata
    const meta       = SECTION_META[section] ?? { name: section, difficulty: "Medium", topics: [] }
    let   difficulty = String(body.difficulty ?? meta.difficulty)
    let   topics     = liveTopics ?? meta.topics

    // Try to enrich topics from pattern_embeddings vector store
    if (!liveTopics) {
      try {
        const patternDocs = await getCompanyPatternSections(company)
        const sectionDoc  = patternDocs.find(d => d.sectionId === section)
        if (sectionDoc?.topics?.length) {
          topics     = sectionDoc.topics
          difficulty = sectionDoc.difficulty ?? difficulty
        }
      } catch {}
    }

    // Generate via the QGen pipeline
    const result = await generateQuestions({
      company,
      companyName,
      section,
      sectionName: meta.name,
      count,
      difficulty,
      topics,
      liveTopics,
    })

    return NextResponse.json({
      questions: result.questions,
      company:   result.company,
      section:   result.section,
      source:    result.source,
      model:     result.model,
      count:     result.questions.length,
    })

  } catch (err: any) {
    console.error("generate-assessment error:", err)
    return NextResponse.json({ error: "Failed to generate questions", detail: err.message }, { status: 500 })
  }
}
