/**
 * CodeHiring Question Generation Pipeline — Main Entry Point
 *
 * Pipeline:
 * 1. Check cache (MongoDB, 24h TTL)
 * 2. Retrieve RAG context (vector search on pyq_embeddings + pattern_embeddings)
 * 3. Build structured prompt (type-specific: aptitude / coding / communication)
 * 4. Call LLM (OpenAI → Groq fallback)
 * 5. Validate & normalize output
 * 6. Cache result
 * 7. Return questions
 */

import { retrieveContext }    from "./retriever"
import { buildPrompts }       from "./prompt-builder"
import { callLLM }            from "./llm"
import { validateOutput }     from "./validator"
import { getCached, setCached } from "./cache"
import { getFallbackQuestions } from "./fallback"
import type { QuestionRequest, GenerationResult, SectionId, QuestionType } from "./types"

// ── Determine question type from section ──────────────────────────────────────
function getQuestionType(section: SectionId): QuestionType {
  if (section === "basic-coding" || section === "advanced-coding" || section === "coding") {
    return "coding"
  }
  if (section === "verbal") {
    return "communication"
  }
  return "aptitude"
}

// ── Section display names ─────────────────────────────────────────────────────
const SECTION_NAMES: Record<string, string> = {
  "quantitative":     "Quantitative Aptitude",
  "advanced-aptitude":"Advanced Aptitude / Logical Reasoning",
  "verbal":           "Verbal Ability",
  "basic-coding":     "Basic Coding",
  "advanced-coding":  "Advanced Coding",
  "logical":          "Logical Reasoning",
  "coding":           "Coding",
}

// ── Default topics per section ────────────────────────────────────────────────
const DEFAULT_TOPICS: Record<string, string[]> = {
  "quantitative":     ["Percentages","Time & Work","Speed & Distance","Averages","Number Series","Profit & Loss","Probability"],
  "advanced-aptitude":["Syllogisms","Blood Relations","Seating Arrangement","Coding-Decoding","Puzzles","Directions","Series"],
  "verbal":           ["Reading Comprehension","Vocabulary","Grammar","Para Jumbles","Error Detection","Idioms & Phrases"],
  "basic-coding":     ["Arrays","Strings","Basic Math","Pattern Printing","Simple Loops","Conditional Logic"],
  "advanced-coding":  ["Binary Search","Hash Map","Sliding Window","Trees","Dynamic Programming","Graph BFS/DFS","Stack"],
  "logical":          ["Syllogisms","Blood Relations","Directions","Series","Analogies","Coding-Decoding"],
  "coding":           ["Arrays","Strings","Sorting","Recursion","Hash Map","Two Pointers"],
}

// ── Main generate function ────────────────────────────────────────────────────
export async function generateQuestions(params: {
  company:     string
  companyName: string
  section:     string
  sectionName?: string
  count:        number
  difficulty?:  string
  topics?:      string[]
  liveTopics?:  string[]
  skipCache?:   boolean
}): Promise<GenerationResult> {
  const section     = params.section as SectionId
  const type        = getQuestionType(section)
  const difficulty  = params.difficulty ?? "Medium"
  const sectionName = params.sectionName ?? SECTION_NAMES[section] ?? section
  const topics      = params.liveTopics ?? params.topics ?? DEFAULT_TOPICS[section] ?? ["General"]

  const req: QuestionRequest = {
    company:     params.company,
    companyName: params.companyName,
    section,
    sectionName,
    type,
    topics,
    difficulty,
    count:      params.count,
    liveTopics: params.liveTopics,
  }

  // ── Step 1: Cache check ────────────────────────────────────────────────────
  if (!params.skipCache) {
    const cached = await getCached(req)
    if (cached && cached.length >= req.count) {
      return {
        questions: cached,
        company:   params.companyName,
        section:   sectionName,
        source:    "cache",
      }
    }
  }

  // ── Step 2: RAG retrieval ──────────────────────────────────────────────────
  let ctx
  try {
    ctx = await retrieveContext(req)
  } catch {
    ctx = { pyqs: [], patterns: [], staticSamples: [], queryText: "" }
  }

  // ── Step 3: Build prompt ───────────────────────────────────────────────────
  const { system, user } = buildPrompts(req, ctx)

  // ── Step 4: Call LLM ───────────────────────────────────────────────────────
  let raw  = ""
  let model = "unknown"
  try {
    const result = await callLLM(system, user, 4000)
    raw   = result.content
    model = result.model
  } catch (e: any) {
    console.error("QGen LLM error:", e.message)
    return {
      questions: getFallbackQuestions(req),
      company:   params.companyName,
      section:   sectionName,
      source:    "fallback",
    }
  }

  // ── Step 5: Validate ───────────────────────────────────────────────────────
  const questions = validateOutput(raw, req)

  if (questions.length === 0) {
    console.warn("QGen: LLM returned no valid questions, using fallback")
    return {
      questions: getFallbackQuestions(req),
      company:   params.companyName,
      section:   sectionName,
      source:    "fallback",
      model,
    }
  }

  // ── Step 6: Cache ──────────────────────────────────────────────────────────
  setCached(req, questions).catch(() => {}) // non-blocking

  return {
    questions,
    company: params.companyName,
    section: sectionName,
    source:  "ai+rag",
    model,
  }
}
