/**
 * PYQ (Previous Year Question) MongoDB model
 * Collection: pyq_bank
 * Stores verified previous year questions with admin approval workflow
 */
import { getDatabase } from "@/lib/database"

export type PYQStatus = "pending" | "approved" | "rejected"
export type PYQSource = "admin" | "student" | "scraper"

export interface PYQDoc {
  _id?: any
  company:      string       // e.g. "tcs"
  companyName?: string       // e.g. "TCS"
  section:      string       // "quantitative" | "advanced-aptitude" | "verbal" | "basic-coding" | "advanced-coding"
  topic:        string       // e.g. "Time & Work"
  difficulty:   "Easy" | "Medium" | "Hard"
  year:         number       // e.g. 2024
  question:     string
  options:      string[]     // 4 options
  correct:      number       // 0-3 index
  explanation:  string
  status:       PYQStatus    // admin approval status
  source:       PYQSource    // who submitted it
  submittedBy?: string       // student userId if source=student
  submittedAt:  Date
  approvedAt?:  Date
  approvedBy?:  string       // admin userId
  ragSeeded:    boolean      // whether this has been embedded into vector store
  upvotes:      number       // community validation
  reportCount:  number       // number of reports for inaccuracy
  tags?:        string[]
}

export async function getPYQCollection() {
  const db = await getDatabase()
  const col = db.collection<PYQDoc>("pyq_bank")
  await col.createIndex({ company: 1, section: 1, status: 1 })
  await col.createIndex({ status: 1 })
  await col.createIndex({ submittedBy: 1 })
  await col.createIndex({ ragSeeded: 1, status: 1 })
  return col
}

export async function countPYQsByStatus() {
  const col = await getPYQCollection()
  const pipeline = [
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]
  const result = await col.aggregate<{ _id: string; count: number }>(pipeline).toArray()
  const counts: Record<string, number> = { pending: 0, approved: 0, rejected: 0 }
  result.forEach(r => { counts[r._id] = r.count })
  return counts
}

export async function getApprovedPYQs(company: string, section: string, limit = 20) {
  const col = await getPYQCollection()
  return col
    .find({ company, section, status: "approved" }, { projection: { _id: 1, company: 1, section: 1, topic: 1, difficulty: 1, year: 1, question: 1, options: 1, correct: 1, explanation: 1 } })
    .limit(limit)
    .toArray()
}
