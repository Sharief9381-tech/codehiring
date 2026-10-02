/**
 * Question Cache
 * Stores generated questions in MongoDB with 24h TTL.
 * Key: company + section + difficulty + count (rounded to nearest 5)
 */

import { getDatabase } from "@/lib/database"
import type { GeneratedQuestion, QuestionRequest } from "./types"

const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours
const COLLECTION   = "questions_cache"

function cacheKey(req: QuestionRequest): string {
  const roundedCount = Math.ceil(req.count / 5) * 5
  return `${req.company}:${req.section}:${req.difficulty}:${roundedCount}`
}

export async function getCached(req: QuestionRequest): Promise<GeneratedQuestion[] | null> {
  try {
    const db  = await getDatabase()
    const col = db.collection(COLLECTION)
    const doc = await col.findOne({ key: cacheKey(req) })
    if (!doc) return null
    const age = Date.now() - new Date(doc.createdAt).getTime()
    if (age > CACHE_TTL_MS) return null
    // Return a random subset of the cached pool
    const pool = doc.questions as GeneratedQuestion[]
    if (!pool?.length) return null
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, req.count)
  } catch {
    return null
  }
}

export async function setCached(req: QuestionRequest, questions: GeneratedQuestion[]): Promise<void> {
  try {
    const db  = await getDatabase()
    const col = db.collection(COLLECTION)
    const key = cacheKey(req)
    // Merge with existing cache pool (up to 50 questions stored per key)
    const existing = await col.findOne({ key })
    const existingPool: GeneratedQuestion[] = existing?.questions ?? []
    const merged = [...existingPool, ...questions]
      .filter((q, i, arr) => {
        const qText = ("question" in q ? q.question : q.title).toLowerCase().slice(0, 50)
        return arr.findIndex(x => ("question" in x ? x.question : x.title).toLowerCase().slice(0, 50) === qText) === i
      })
      .slice(0, 50) // keep max 50 in pool
    await col.updateOne(
      { key },
      { $set: { key, questions: merged, createdAt: new Date(), company: req.company, section: req.section } },
      { upsert: true }
    )
  } catch {}
}
