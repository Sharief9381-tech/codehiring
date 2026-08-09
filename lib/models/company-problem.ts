/**
 * CompanyProblem model
 * Stores 18,900 coding problems (189 companies × 100 problems each)
 * in MongoDB collection "company_problems"
 */
import { getDatabase } from "@/lib/database"

export interface CompanyProblem {
  _id?: string
  company: string          // company id, e.g. "amazon"
  companyName: string      // display name, e.g. "Amazon"
  category: string         // "Product" | "IT Services" | "Startups" | "BFSI" | etc.
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  pattern: string          // "Sliding Window" | "DP" | "Graphs" etc.
  topic: string            // specific topic
  statement: string        // full problem description
  constraints: string      // constraints string
  examples: Array<{
    input: string
    output: string
    explanation?: string
  }>
  hints: string[]
  tags: string[]           // ["arrays", "hashing", "medium"]
  functionSignature?: string
  starters?: {
    Python?: string
    JavaScript?: string
    TypeScript?: string
    Java?: string
    "C++"?: string
  }
  testCases?: Array<{
    input: string
    expectedOutput: string
    isPublic: boolean
  }>
  createdAt: Date
  generatedBy: "groq" | "openai" | "static"
  batchId?: string         // tracks which generation run created this
}

export async function getCompanyProblemsCollection() {
  const db = await getDatabase()
  const col = db.collection<CompanyProblem>("company_problems")
  // Ensure indexes
  await col.createIndex({ company: 1 })
  await col.createIndex({ company: 1, difficulty: 1 })
  await col.createIndex({ company: 1, pattern: 1 })
  await col.createIndex({ category: 1 })
  await col.createIndex({ tags: 1 })
  return col
}

/** Fetch problems for a company with optional filters */
export async function getProblemsForCompany(
  companyId: string,
  opts: {
    difficulty?: string
    pattern?: string
    count?: number
    shuffle?: boolean
  } = {}
): Promise<CompanyProblem[]> {
  const col = await getCompanyProblemsCollection()
  const filter: Record<string, any> = { company: companyId }
  if (opts.difficulty) filter.difficulty = opts.difficulty
  if (opts.pattern) filter.pattern = opts.pattern

  const count = opts.count ?? 3
  let cursor = col.find(filter)

  if (opts.shuffle) {
    // Random sample using aggregation
    const pipeline: any[] = [
      { $match: filter },
      { $sample: { size: count } },
    ]
    return col.aggregate<CompanyProblem>(pipeline).toArray()
  }

  return cursor.limit(count).toArray()
}

/** Count how many problems exist for a company */
export async function countProblemsForCompany(companyId: string): Promise<number> {
  const col = await getCompanyProblemsCollection()
  return col.countDocuments({ company: companyId })
}

/** Get generation progress across all companies */
export async function getGenerationProgress(): Promise<Record<string, number>> {
  const col = await getCompanyProblemsCollection()
  const pipeline = [
    { $group: { _id: "$company", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]
  const results = await col.aggregate<{ _id: string; count: number }>(pipeline).toArray()
  return Object.fromEntries(results.map(r => [r._id, r.count]))
}
