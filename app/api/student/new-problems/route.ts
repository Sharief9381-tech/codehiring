/**
 * GET /api/student/new-problems
 * Returns all daily-added problems from the daily_new_problems collection.
 * These are unique problems generated one per day via cron.
 * Students see them in the problems list with a "New" badge.
 */

import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"

export async function GET() {
  try {
    const db  = await getDatabase()
    const col = db.collection("daily_new_problems")

    // Get all daily-added problems, newest first
    const docs = await col
      .find({}, { projection: { title: 1, difficulty: 1, topic: 1, problemId: 1, cacheKey: 1, dateKey: 1, addedAt: 1 } })
      .sort({ addedAt: -1 })
      .toArray()

    const problems = docs.map((d: any) => ({
      id:          d.problemId,
      title:       d.title,
      difficulty:  d.difficulty,
      topic:       d.topic,
      slug:        d.cacheKey,
      dateKey:     d.dateKey,
      addedAt:     d.addedAt,
      isNew:       true,
    }))

    return NextResponse.json({ problems, count: problems.length })
  } catch (err: any) {
    console.error("new-problems GET:", err)
    return NextResponse.json({ problems: [], count: 0 })
  }
}
