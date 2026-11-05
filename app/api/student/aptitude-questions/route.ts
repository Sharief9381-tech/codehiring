/**
 * GET /api/student/aptitude-questions?count=10&offset=0&topic=&random=1
 *
 * Priority order:
 * 1. MongoDB `aptitude_questions` collection (after seed script runs, 117K rows)
 * 2. HuggingFace API fallback (real-time, no local DB needed)
 *
 * Query params:
 *   count   — number of questions (default 10, max 50)
 *   offset  — pagination offset (used when random=0)
 *   random  — 1 = random sample (default), 0 = sequential by offset
 *   topic   — filter by topic (optional, only relevant after tagging)
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"

const HF_DATASET = "suchandra17/preprocessed_aptitude"
const HF_API     = "https://datasets-server.huggingface.co/rows"
const TOTAL_HF   = 117262

// ── Serve from MongoDB ────────────────────────────────────────────────────────
async function fromMongo(count: number, offset: number, random: boolean): Promise<{ questions: any[]; total: number } | null> {
  try {
    const db   = await getDatabase()
    const col  = db.collection("aptitude_questions")
    const total = await col.estimatedDocumentCount()
    if (total === 0) return null   // not seeded yet — fall through to HF

    let docs: any[]
    if (random) {
      // $sample is efficient up to ~5% of collection
      docs = await col.aggregate([{ $sample: { size: count } }]).toArray()
    } else {
      docs = await col.find({}).skip(offset).limit(count).toArray()
    }

    const questions = docs.map(d => ({
      id:       `db-apt-${d.seq ?? d._id}`,
      question: d.question,
      answer:   d.answer,
      topic:    d.topic ?? "general",
    })).filter(q => q.question?.length > 10)

    return { questions, total }
  } catch {
    return null
  }
}

// ── Serve from HuggingFace ────────────────────────────────────────────────────
async function fromHuggingFace(count: number, offset: number): Promise<{ questions: any[]; total: number }> {
  const url = `${HF_API}?dataset=${encodeURIComponent(HF_DATASET)}&config=default&split=train&offset=${offset}&length=${count}`
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next:    { revalidate: 3600 },
    signal:  AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`HuggingFace ${res.status}`)

  const data  = await res.json()
  const rows  = data.rows ?? []
  const questions = rows.map((row: any, i: number) => ({
    id:       `hf-apt-${offset + i}`,
    question: row.row?.question ?? "",
    answer:   row.row?.answer   ?? "",
    topic:    "general",
  })).filter((q: any) => q.question.length > 10)

  return { questions, total: data.num_rows_total ?? TOTAL_HF }
}

// ── GET handler ───────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const count  = Math.min(Number(searchParams.get("count")  ?? "10"), 50)
    const offset = Number(searchParams.get("offset") ?? "0")
    const random = (searchParams.get("random") ?? "1") !== "0"

    // 1. Try MongoDB
    if (isDatabaseAvailable()) {
      const result = await fromMongo(count, offset, random)
      if (result && result.questions.length > 0) {
        return NextResponse.json({
          questions: result.questions,
          total:     result.total,
          offset,
          count:     result.questions.length,
          source:    "mongodb",
        })
      }
    }

    // 2. Fallback — HuggingFace API
    // Use random offset so each request gives different questions
    const hfOffset = random ? Math.floor(Math.random() * (TOTAL_HF - count)) : offset
    const hfResult = await fromHuggingFace(count, hfOffset)
    return NextResponse.json({
      questions: hfResult.questions,
      total:     hfResult.total,
      offset:    hfOffset,
      count:     hfResult.questions.length,
      source:    "huggingface",
    })

  } catch (err) {
    console.error("aptitude-questions error:", err)
    return NextResponse.json({ error: "Failed to fetch questions", detail: String(err) }, { status: 500 })
  }
}
