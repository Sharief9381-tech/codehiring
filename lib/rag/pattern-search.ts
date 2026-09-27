/**
 * Semantic Search for Company Assessment Patterns
 *
 * Collection: pattern_embeddings
 * Each doc = one section of one company's exam pattern, embedded as a vector.
 *
 * Supports two embedding modes:
 * - OpenAI text-embedding-3-small (1536 dims) — when OPENAI_API_KEY is set with credits
 * - Local hash embedding (256 dims) — free fallback, no API needed
 *
 * Atlas Vector Search Index:
 * - Name: pattern_vector_index
 * - numDimensions: 256 (local) or 1536 (OpenAI)
 * - Set EMBED_DIMS env var to override, default is auto-detected
 */

import { getDatabase } from "@/lib/database"
import { getEmbedding, getEmbeddingsBatch } from "./embed"

export interface PatternDoc {
  _id?: any
  company:     string   // "tcs"
  companyName: string   // "TCS"
  sectionId:   string   // "quantitative"
  sectionName: string   // "Numerical Ability"
  questions:   number   // 20
  timeMinutes: number   // 40
  difficulty:  string   // "Medium"
  topics:      string[] // ["Percentages", "Time & Work"]
  isCoding:    boolean
  year:        number   // 2025
  notes:       string   // extra context
  source:      string   // "web+ai" | "fallback"
  textContent: string   // full text used for embedding
  embedding:   number[]
  createdAt:   Date
  updatedAt:   Date
}

const COLLECTION = "pattern_embeddings"

// ── Build the text content to embed for a pattern section ─────────────────────
export function buildPatternText(
  companyName: string,
  sectionId: string,
  sectionName: string,
  topics: string[],
  questions: number,
  timeMinutes: number,
  difficulty: string,
  notes: string,
  year: number
): string {
  return [
    `${companyName} campus placement exam 2025`,
    `Section: ${sectionName} (${sectionId})`,
    `Questions: ${questions}, Time: ${timeMinutes} minutes`,
    `Difficulty: ${difficulty}`,
    topics.length > 0 ? `Topics: ${topics.join(", ")}` : "",
    notes ? `Notes: ${notes}` : "",
    `Year: ${year}`,
    `Exam pattern for ${companyName} online assessment recruitment test`,
  ].filter(Boolean).join("\n")
}

// ── Upsert a single pattern section doc with its embedding ───────────────────
export async function upsertPatternDoc(
  doc: Omit<PatternDoc, "embedding" | "createdAt" | "updatedAt" | "textContent">
) {
  const db  = await getDatabase()
  const col = db.collection(COLLECTION)

  const textContent = buildPatternText(
    doc.companyName, doc.sectionId, doc.sectionName,
    doc.topics, doc.questions, doc.timeMinutes,
    doc.difficulty, doc.notes, doc.year
  )

  const embedding = await getEmbedding(textContent)

  await col.updateOne(
    { company: doc.company, sectionId: doc.sectionId },
    {
      $set: { ...doc, textContent, embedding, updatedAt: new Date() },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  )
}

// ── Bulk upsert (used by seed endpoint) ───────────────────────────────────────
export async function upsertPatternDocsBulk(
  docs: Omit<PatternDoc, "embedding" | "createdAt" | "updatedAt" | "textContent">[]
) {
  if (docs.length === 0) return 0
  const db  = await getDatabase()
  const col = db.collection(COLLECTION)

  const texts = docs.map(d =>
    buildPatternText(
      d.companyName, d.sectionId, d.sectionName,
      d.topics, d.questions, d.timeMinutes,
      d.difficulty, d.notes, d.year
    )
  )

  const embeddings = await getEmbeddingsBatch(texts)

  const ops = docs.map((doc, i) => ({
    updateOne: {
      filter: { company: doc.company, sectionId: doc.sectionId },
      update: {
        $set: {
          ...doc,
          textContent: texts[i],
          embedding:   embeddings[i],
          updatedAt:   new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      upsert: true,
    },
  }))

  await col.bulkWrite(ops, { ordered: false })
  return docs.length
}

// ── Semantic search: find similar pattern sections ───────────────────────────
export async function semanticPatternSearch(
  queryText: string,
  company?: string,   // optional: restrict to one company
  topK = 10
): Promise<PatternDoc[]> {
  const db  = await getDatabase()
  const col = db.collection(COLLECTION)

  const queryEmbedding = await getEmbedding(queryText)

  // Build Atlas $vectorSearch stage
  const vectorStage: any = {
    $vectorSearch: {
      index:         "pattern_vector_index",
      path:          "embedding",
      queryVector:   queryEmbedding,
      numCandidates: topK * 10,
      limit:         topK,
    },
  }

  // Add company filter if specified
  if (company) {
    vectorStage.$vectorSearch.filter = { company }
  }

  try {
    const results = await col.aggregate([
      vectorStage,
      {
        $project: {
          embedding: 0,
          score: { $meta: "vectorSearchScore" },
          company: 1, companyName: 1, sectionId: 1, sectionName: 1,
          questions: 1, timeMinutes: 1, difficulty: 1, topics: 1,
          isCoding: 1, year: 1, notes: 1, source: 1, textContent: 1,
        },
      },
    ]).toArray()

    if (results.length > 0) return results as unknown as PatternDoc[]
  } catch (e) {
    console.warn("Atlas vector search failed (index may not exist), falling back to text search:", e)
  }

  // ── Fallback: simple MongoDB text match if vector index not set up ─────────
  const filter: any = {}
  if (company) filter.company = company
  const fallback = await col
    .find(filter, { projection: { embedding: 0 } })
    .limit(topK)
    .toArray()
  return fallback as unknown as PatternDoc[]
}

// ── Retrieve ALL sections for a specific company ──────────────────────────────
export async function getCompanyPatternSections(company: string): Promise<PatternDoc[]> {
  const db  = await getDatabase()
  const col = db.collection(COLLECTION)
  return col
    .find({ company }, { projection: { embedding: 0 } })
    .sort({ sectionId: 1 })
    .toArray() as unknown as Promise<PatternDoc[]>
}

// ── Full semantic query: company + section context ────────────────────────────
// Used by generate-assessment to get semantically relevant patterns
export async function queryPatternForSection(
  company: string,
  companyName: string,
  sectionId: string,
  sectionName: string
): Promise<PatternDoc | null> {
  const queryText = `${companyName} ${sectionName} exam section 2025 questions topics difficulty`

  // First try: exact company + sectionId lookup (fastest, freshest)
  const db  = await getDatabase()
  const col = db.collection(COLLECTION)
  const exact = await col.findOne(
    { company, sectionId },
    { projection: { embedding: 0 } }
  )
  if (exact) return exact as unknown as PatternDoc

  // Second try: semantic search restricted to this company
  const results = await semanticPatternSearch(queryText, company, 3)
  const match = results.find(r => r.sectionId === sectionId)
  if (match) return match

  // Third try: semantic search across all companies for this section type
  const crossResults = await semanticPatternSearch(
    `${sectionName} ${sectionId} placement exam pattern questions topics`,
    undefined,
    5
  )
  return crossResults.find(r => r.sectionId === sectionId) ?? crossResults[0] ?? null
}

// ── Count docs in the collection ──────────────────────────────────────────────
export async function countPatternDocs(company?: string): Promise<number> {
  const db  = await getDatabase()
  const col = db.collection(COLLECTION)
  return col.countDocuments(company ? { company } : {})
}
