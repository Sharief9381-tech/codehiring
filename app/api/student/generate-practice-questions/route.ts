/**
 * POST /api/student/generate-practice-questions
 *
 * Serves practice questions DIRECTLY from the static question banks.
 * NO AI generation — all questions come from:
 *   - QUANTITATIVE_BANK  (aptitude + logical)
 *   - COMMUNICATION_BANK (verbal)
 *   - aptitude_questions collection (MongoDB / HuggingFace 78K bank)
 *
 * Default difficulty filter: Medium + Hard only (placement-ready).
 * Pass difficulty:"Easy" to include easy questions too.
 *
 * Body: {
 *   topic:       string   — topic name e.g. "Percentages", "Grammar"
 *   section:     string   — "aptitude" | "verbal" | "logical"
 *   count?:      number   — total questions to return (default 15)
 *   difficulty?: string   — "Easy" | "Medium" | "Hard" | "Medium+Hard" (default "Medium+Hard")
 * }
 */

import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"

// ── Sort Easy → Medium → Hard ─────────────────────────────────────────────────
function sortByDifficulty(questions: any[]): any[] {
  const order: Record<string, number> = { Easy: 0, Medium: 1, Hard: 2 }
  return [...questions].sort((a, b) => (order[a.difficulty] ?? 1) - (order[b.difficulty] ?? 1))
}

// ── Shuffle array (Fisher-Yates) ──────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── Filter by difficulty string ───────────────────────────────────────────────
function matchesDifficulty(qDiff: string, filter: string): boolean {
  const d = (qDiff ?? "Medium").toLowerCase()
  switch (filter.toLowerCase()) {
    case "easy":        return d === "easy"
    case "medium":      return d === "medium"
    case "hard":        return d === "hard"
    case "medium+hard":
    default:            return d === "medium" || d === "hard"
  }
}

// ── Serve from static QUANTITATIVE_BANK / LOGICAL_REASONING_BANK ─────────────
async function fromStaticBank(
  topic: string,
  section: string,
  diffFilter: string,
  count: number
): Promise<any[]> {
  try {
    let bank: any[] = []

    if (section === "verbal") {
      const { COMMUNICATION_BANK } = await import("@/lib/communication-bank")
      bank = COMMUNICATION_BANK
    } else {
      // aptitude + logical both use QUANTITATIVE_BANK + LOGICAL_REASONING_BANK
      const { QUANTITATIVE_BANK, LOGICAL_REASONING_BANK } = await import("@/lib/quantitative-reasoning")
      bank = [...QUANTITATIVE_BANK, ...LOGICAL_REASONING_BANK]
    }

    // Match topic (case-insensitive, partial)
    const topicLower = topic.toLowerCase()
    let matched = bank.filter((q: any) =>
      (q.topic ?? "").toLowerCase().includes(topicLower) ||
      topicLower.includes((q.topic ?? "").toLowerCase())
    )

    // If no exact match, relax to all questions from the bank (fallback)
    if (matched.length < 3) {
      matched = bank
    }

    // Apply difficulty filter
    const filtered = matched.filter((q: any) => matchesDifficulty(q.difficulty ?? "Medium", diffFilter))

    // Shuffle and take requested count
    const selected = shuffle(filtered).slice(0, count)

    return selected.map((q: any, i: number) => ({
      id:          q.id ?? `static-${i}`,
      question:    q.question ?? "",
      options:     Array.isArray(q.options) ? q.options : [],
      correct:     typeof q.correct === "number" ? q.correct : 0,
      explanation: q.explanation ?? "",
      topic:       q.topic ?? topic,
      difficulty:  q.difficulty ?? "Medium",
      passage:     q.passage ?? undefined,
      section,
    }))
  } catch {
    return []
  }
}

// ── Serve from MongoDB aptitude_questions (HuggingFace bank) ─────────────────
async function fromMongoBank(
  topic: string,
  diffFilter: string,
  count: number
): Promise<any[]> {
  if (!isDatabaseAvailable()) return []
  try {
    const db  = await getDatabase()
    const col = db.collection("aptitude_questions")
    const total = await col.estimatedDocumentCount()
    if (total === 0) return []

    // Random sample from the collection
    const docs = await col.aggregate([{ $sample: { size: Math.min(count * 3, 300) } }]).toArray()

    // HuggingFace questions don't have difficulty tags, treat them all as Medium
    // Filter: Medium+Hard → use all; Easy → return none from this bank
    if (diffFilter.toLowerCase() === "easy") return []

    const questions = docs.map((d: any, i: number) => ({
      id:          `db-apt-${d.seq ?? i}`,
      question:    d.question ?? "",
      options:     [],      // HF dataset has no options — handled as open-answer
      correct:     -1,      // no options available
      explanation: d.answer ?? "",
      topic,
      difficulty:  "Medium",
      section:     "aptitude",
      isOpenAnswer: true,   // flag for UI to render differently
    })).filter((q: any) => q.question.length > 15)

    return questions.slice(0, count)
  } catch {
    return []
  }
}

// ── POST handler ──────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const body       = await req.json()
    const topic      = String(body.topic   ?? "").trim()
    const section    = String(body.section ?? "aptitude").trim()
    const count      = Math.min(Number(body.count ?? 20), 50)  // default 20, max 50
    const difficulty = String(body.difficulty ?? "Medium+Hard").trim()

    if (!topic) return NextResponse.json({ error: "topic required" }, { status: 400 })

    // 1. Try static local banks (instant, no DB needed)
    const staticQs = await fromStaticBank(topic, section, difficulty, count)

    // 2. If we need more and it's aptitude, supplement from MongoDB HF bank
    let questions = staticQs
    if (questions.length < count && (section === "aptitude" || section === "logical")) {
      const needed  = count - questions.length
      const mongoQs = await fromMongoBank(topic, difficulty, needed)
      questions = [...questions, ...mongoQs]
    }

    // 3. If still not enough, relax topic filter (use any question from the bank)
    if (questions.length < 5) {
      const relaxed = await fromStaticBank("", section, difficulty, count)
      questions = [...questions, ...relaxed].slice(0, count)
    }

    if (questions.length === 0) {
      return NextResponse.json({ error: "No questions found for this topic" }, { status: 404 })
    }

    const sorted = sortByDifficulty(questions)
    return NextResponse.json({
      questions: sorted,
      source:    "bank",
      topic,
      section,
      difficulty,
      total:     sorted.length,
    })

  } catch (err: any) {
    console.error("[generate-practice-questions]", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
