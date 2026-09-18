/**
 * MongoDB Atlas Vector Search for RAG
 * Collection: pyq_embeddings
 * Index: pyq_vector_index (must be created in Atlas UI)
 *
 * Atlas Vector Search Index definition (create in Atlas UI → Search → Create Index):
 * {
 *   "fields": [{
 *     "type": "vector",
 *     "path": "embedding",
 *     "numDimensions": 1536,
 *     "similarity": "cosine"
 *   }]
 * }
 */

import { getDatabase } from "@/lib/database"
import { getEmbedding } from "./embed"

export interface PYQDocument {
  _id?: any
  company:     string
  section:     string
  topic:       string
  difficulty:  string
  year:        number
  question:    string
  options:     string[]
  correct:     number
  explanation: string
  embedding:   number[]
  createdAt:   Date
}

const COLLECTION = "pyq_embeddings"

// ── Upsert a single PYQ with its embedding ────────────────────────────────────
export async function upsertPYQ(doc: Omit<PYQDocument, "embedding" | "createdAt">) {
  const db = await getDatabase()
  const col = db.collection(COLLECTION)

  const embedding = await getEmbedding(
    `${doc.company} ${doc.section} ${doc.topic} ${doc.question} ${doc.options.join(" ")}`
  )

  await col.updateOne(
    { company: doc.company, section: doc.section, question: doc.question },
    {
      $set: {
        ...doc,
        embedding,
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  )
}

// ── Bulk upsert (used by seed script) ─────────────────────────────────────────
export async function upsertPYQsBulk(docs: Omit<PYQDocument, "embedding" | "createdAt">[]) {
  const db = await getDatabase()
  const col = db.collection(COLLECTION)

  const { getEmbeddingsBatch } = await import("./embed")
  const texts = docs.map(d =>
    `${d.company} ${d.section} ${d.topic} ${d.question} ${d.options.join(" ")}`
  )

  const embeddings = await getEmbeddingsBatch(texts)

  const ops = docs.map((doc, i) => ({
    updateOne: {
      filter: { company: doc.company, section: doc.section, question: doc.question },
      update: {
        $set: { ...doc, embedding: embeddings[i], updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() },
      },
      upsert: true,
    },
  }))

  await col.bulkWrite(ops, { ordered: false })
  return docs.length
}

// ── Retrieve top-k similar PYQs using vector search ───────────────────────────
export async function retrieveSimilarPYQs(
  company: string,
  section: string,
  queryText: string,
  topK = 8
): Promise<PYQDocument[]> {
  const db = await getDatabase()
  const col = db.collection(COLLECTION)

  const queryEmbedding = await getEmbedding(
    `${company} ${section} ${queryText}`
  )

  // Atlas Vector Search aggregation pipeline
  const results = await col.aggregate([
    {
      $vectorSearch: {
        index:        "pyq_vector_index",
        path:         "embedding",
        queryVector:  queryEmbedding,
        numCandidates: topK * 10,
        limit:        topK,
        filter: {
          company: company,
          section: section,
        },
      },
    },
    {
      $project: {
        embedding: 0, // exclude embedding from result
        score: { $meta: "vectorSearchScore" },
        company: 1, section: 1, topic: 1, difficulty: 1,
        year: 1, question: 1, options: 1, correct: 1, explanation: 1,
      },
    },
  ]).toArray()

  // Fallback: if vector search returns nothing (index not set up yet),
  // fall back to basic company+section filter
  if (results.length === 0) {
    const fallback = await col
      .find({ company, section }, { projection: { embedding: 0 } })
      .limit(topK)
      .toArray()
    return fallback as unknown as PYQDocument[]
  }

  return results as unknown as PYQDocument[]
}

// ── Count PYQs in the store ────────────────────────────────────────────────────
export async function countPYQs(company?: string): Promise<number> {
  const db = await getDatabase()
  const col = db.collection(COLLECTION)
  return col.countDocuments(company ? { company } : {})
}

// ── Format retrieved PYQs as RAG context string ───────────────────────────────
export function formatPYQsAsContext(
  pyqs: PYQDocument[],
  company: string,
  section: string
): string {
  if (pyqs.length === 0) return ""

  return `RETRIEVED PREVIOUS YEAR QUESTIONS — ${company.toUpperCase()} ${section.toUpperCase()} (via semantic search):

${pyqs.map((q, i) => `Q${i + 1} [${q.year ?? "PYQ"}, ${q.difficulty}, ${q.topic}]:
${q.question}
Options: ${q.options.map((o, j) => `${["A","B","C","D"][j]}) ${o}`).join(" | ")}
Correct: ${["A","B","C","D"][q.correct]}
Explanation: ${q.explanation}`).join("\n\n")}

INSTRUCTION: Generate NEW questions inspired by the above style, difficulty, and topic distribution.
Do NOT copy these questions verbatim — create original variations that test the same concepts.`
}
