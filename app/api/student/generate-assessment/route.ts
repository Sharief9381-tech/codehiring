/**
 * POST /api/student/generate-assessment
 * Generates company-specific assessment questions.
 *
 * Uses real PYQ bank + company patterns directly (no vector index needed).
 * Each company's sections use ACTUAL topic distributions, question counts,
 * and difficulty levels from real hiring data.
 *
 * Body: {
 *   company:    string   — company id e.g. "tcs"
 *   section:    string   — section id e.g. "quantitative"
 *   count:      number   — number of questions
 *   topics?:    string[] — topic overrides (from live pattern API)
 *   difficulty? string   — difficulty override
 * }
 */

import { NextResponse } from "next/server"
import { generateQuestions } from "@/lib/question-gen"
import { ALL_COMPANIES } from "@/lib/companies-data"
import { QUESTION_BANK, type PYQ } from "@/lib/question-bank"
import { COMPANY_ASSESSMENT_PATTERNS, getCompanySectionConfigForAny } from "@/lib/company-assessment-patterns"

// Use the shared COMPANY_PATTERNS — single source of truth
const COMPANY_PATTERNS = COMPANY_ASSESSMENT_PATTERNS

// ── Get company-specific PYQ examples as prompt context ──────────────────────
function getPYQContext(company: string, section: string): string {
  // Direct match
  let pyqs: PYQ[] = QUESTION_BANK[company]?.[section] ?? []

  // Section aliases — TCS logical = advanced-aptitude
  if (pyqs.length === 0 && section === "advanced-aptitude") {
    pyqs = QUESTION_BANK[company]?.["logical"] ?? QUESTION_BANK["tcs"]?.["logical"] ?? []
  }
  if (pyqs.length === 0 && section === "verbal") {
    pyqs = QUESTION_BANK[company]?.["verbal"] ?? QUESTION_BANK["tcs"]?.["verbal"] ?? []
  }
  if (pyqs.length === 0) {
    // Cross-company fallback for same section
    pyqs = QUESTION_BANK["tcs"]?.[section] ?? []
  }

  if (pyqs.length === 0) return ""

  const samples = [...pyqs].sort(() => Math.random() - 0.5).slice(0, 4)
  return `\nREAL PREVIOUS YEAR QUESTIONS FROM ${company.toUpperCase()} (style reference — do NOT copy verbatim):\n` +
    samples.map((q, i) =>
      `Q${i+1} [${q.year}, ${q.difficulty}, ${q.topic}]:\n${q.question}\n` +
      `Options: ${q.options.map((o,j)=>`${["A","B","C","D"][j]}) ${o}`).join(" | ")}\n` +
      `Correct: ${["A","B","C","D"][q.correct]} | Explanation: ${q.explanation}`
    ).join("\n\n") +
    `\n\nGenerate NEW questions of the SAME style, difficulty, and topic distribution. Fresh questions only - no repetition.`
}

// ── POST handler ──────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const company  = String(body.company  ?? "")
    const section  = String(body.section  ?? "")
    const liveTopics: string[] | undefined = body.topics?.length ? body.topics : undefined

    if (!company) return NextResponse.json({ error: "company required" }, { status: 400 })
    if (!section) return NextResponse.json({ error: "section required" }, { status: 400 })

    // Resolve company name
    const companyEntry = ALL_COMPANIES.find(c => c.id === company)
    const companyName  = companyEntry?.name ?? company.toUpperCase()

    // Get company-specific section pattern — works for ALL 190 companies
    const companyPattern = COMPANY_PATTERNS[company]
    // Use specific pattern section if available, else derive from category
    const sectionPattern = companyPattern?.sections[section]
      ?? getCompanySectionConfigForAny(company, section, companyEntry?.category, companyEntry?.difficulty)

    // Resolve count, difficulty, topics — company-specific first
    const defaultCount = sectionPattern?.count
      ?? (section.includes("coding") ? 2 : 12)
    const count = Math.min(Number(body.count ?? defaultCount), 50)

    const difficulty = String(body.difficulty ?? sectionPattern?.difficulty ?? companyPattern?.difficulty ?? "Medium")
    const topics     = liveTopics ?? sectionPattern?.topics ?? getDefaultTopics(section)
    const sectionName = sectionPattern?.name ?? getSectionName(section)

    // Build PYQ context for the AI prompt
    const pyqContext = getPYQContext(company, section)

    // Determine question type — coding sections don't need batching
    const isCodingSection = section.includes("coding") || section === "coding"

    // For large question counts, generate in batches of 8 to avoid token limits
    const BATCH_SIZE = 8
    if (count > BATCH_SIZE && !isCodingSection) {
      const allQuestions: any[] = []
      let remaining = count

      // Generate batches until we have enough or exhaust retries
      let attempts = 0
      const maxAttempts = Math.ceil(count / BATCH_SIZE) + 1

      while (remaining > 0 && attempts < maxAttempts) {
        const batchCount = Math.min(BATCH_SIZE, remaining)
        attempts++

        try {
          const result = await generateQuestions({
            company, companyName, section,
            sectionName, count: batchCount,
            difficulty, topics, liveTopics, pyqContext,
            skipCache: true,
          })
          if (result.questions.length > 0) {
            allQuestions.push(...result.questions)
            remaining -= result.questions.length
          } else {
            break // AI returned nothing, stop batching
          }
        } catch {
          break
        }
      }

      if (allQuestions.length > 0) {
        // Deduplicate by question text
        const seen = new Set<string>()
        const deduped = allQuestions.filter(q => {
          const key = q.question?.toLowerCase().slice(0, 40) ?? q.title?.toLowerCase().slice(0, 40) ?? ""
          if (seen.has(key)) return false
          seen.add(key)
          return true
        })

        // If we still don't have enough, pad with fallback questions
        const finalQuestions = deduped.slice(0, count)
        if (finalQuestions.length < count) {
          const { getFallbackQuestions } = await import("@/lib/question-gen/fallback")
          const fallback = getFallbackQuestions({ company, companyName, section, sectionName, type: "aptitude", topics, difficulty, count: count - finalQuestions.length })
          finalQuestions.push(...fallback.slice(0, count - finalQuestions.length))
        }

        return NextResponse.json({
          questions: finalQuestions,
          company:   companyName,
          section:   sectionName,
          source:    deduped.length >= count ? "ai+rag" : "ai+fallback",
          count:     finalQuestions.length,
          pattern:   sectionPattern ? { topics, difficulty, count } : undefined,
        })
      }
    }

    // Generate via pipeline (single batch for small counts or coding)
    const result = await generateQuestions({
      company,
      companyName,
      section,
      sectionName,
      count,
      difficulty,
      topics,
      liveTopics,
      pyqContext, // injected directly into prompt
    })

    return NextResponse.json({
      questions: result.questions,
      company:   result.company,
      section:   result.section,
      source:    result.source,
      model:     result.model,
      count:     result.questions.length,
      pattern:   sectionPattern ? { topics, difficulty, count } : undefined,
    })

  } catch (err: any) {
    console.error("generate-assessment error:", err)
    return NextResponse.json({ error: "Failed to generate questions", detail: err.message }, { status: 500 })
  }
}

function getSectionName(section: string): string {
  const map: Record<string, string> = {
    "quantitative":      "Quantitative Aptitude",
    "advanced-aptitude": "Logical Reasoning",
    "verbal":            "Verbal Ability",
    "basic-coding":      "Basic Coding",
    "advanced-coding":   "Advanced Coding",
    "logical":           "Logical Reasoning",
    "coding":            "Coding",
  }
  return map[section] ?? section
}

function getDefaultTopics(section: string): string[] {
  const map: Record<string, string[]> = {
    "quantitative":      ["Percentages","Time & Work","Speed & Distance","Averages","Number Series","Profit & Loss","Probability"],
    "advanced-aptitude": ["Syllogisms","Blood Relations","Seating Arrangement","Coding-Decoding","Puzzles","Directions","Series"],
    "verbal":            ["Reading Comprehension","Vocabulary","Grammar","Para Jumbles","Error Detection","Idioms & Phrases"],
    "basic-coding":      ["Arrays","Strings","Basic Math","Pattern Printing","Loops","Conditional Logic"],
    "advanced-coding":   ["Binary Search","Hash Map","Sliding Window","Trees","Dynamic Programming","Graphs","Stack"],
    "logical":           ["Syllogisms","Blood Relations","Directions","Series","Analogies","Coding-Decoding"],
    "coding":            ["Arrays","Strings","Sorting","Recursion","Hash Map","Two Pointers"],
  }
  return map[section] ?? ["General"]
}
