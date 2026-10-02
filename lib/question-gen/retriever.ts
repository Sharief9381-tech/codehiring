/**
 * RAG Retriever for Question Generation
 * Retrieves semantically similar questions from all available sources:
 * 1. pyq_embeddings  — real Previous Year Questions (256-dim hash vectors)
 * 2. pattern_embeddings — company exam section patterns
 * 3. Static question banks — quantitative, logical, communication, coding
 */

import { getDatabase } from "@/lib/database"
import { hashEmbed } from "@/lib/rag/embed"
import type { QuestionRequest, RetrievedContext } from "./types"

const GROQ_KEY   = () => process.env.GROQ_API_KEY  ?? ""
const OPENAI_KEY = () => process.env.OPENAI_API_KEY ?? ""

// ── Embed query text (uses OpenAI if available, else local hash) ──────────────
async function embedQuery(text: string): Promise<number[]> {
  if (OPENAI_KEY()) {
    try {
      const res = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${OPENAI_KEY()}` },
        body: JSON.stringify({ model: "text-embedding-3-small", input: text.slice(0, 8000) }),
        signal: AbortSignal.timeout(5000),
      })
      if (res.ok) {
        const d = await res.json()
        return d.data[0].embedding
      }
    } catch {}
  }
  // Fallback: local 256-dim hash embedding
  return hashEmbed(text)
}

// ── Vector search in a MongoDB collection ────────────────────────────────────
async function vectorSearch(
  collectionName: string,
  indexName: string,
  queryVector: number[],
  topK: number,
  filter?: Record<string, any>
): Promise<any[]> {
  try {
    const db  = await getDatabase()
    const col = db.collection(collectionName)

    const vectorStage: any = {
      $vectorSearch: {
        index:         indexName,
        path:          "embedding",
        queryVector,
        numCandidates: topK * 8,
        limit:         topK,
      },
    }
    if (filter) vectorStage.$vectorSearch.filter = filter

    const results = await col.aggregate([
      vectorStage,
      { $project: { embedding: 0, score: { $meta: "vectorSearchScore" } } },
    ]).toArray()

    return results
  } catch {
    return []
  }
}

// ── Static bank sampling ──────────────────────────────────────────────────────
function sampleStaticBank(
  req: QuestionRequest,
  sampleSize: number
): Array<{ question: string; options?: string[]; correct?: number; explanation?: string; topic: string; difficulty: string }> {
  try {
    const { QUESTION_BANK } = require("@/lib/question-bank")
    const section = req.section

    // Try exact company match first, then any matching section
    let pool: any[] = QUESTION_BANK[req.company]?.[section] ?? []
    if (pool.length < 3) {
      // Aggregate from all companies for this section
      for (const co of Object.values(QUESTION_BANK)) {
        const coSections = co as any
        if (coSections[section]?.length) pool = [...pool, ...coSections[section]]
      }
    }

    if (pool.length === 0) return []
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, sampleSize)
  } catch {
    return []
  }
}

// ── Main retriever ────────────────────────────────────────────────────────────
export async function retrieveContext(req: QuestionRequest): Promise<RetrievedContext> {
  const queryText = [
    req.companyName,
    req.section,
    ...(req.topics ?? []),
    req.difficulty,
    req.type === "coding" ? "coding problem algorithm" : "mcq question",
  ].join(" ")

  const queryVector = await embedQuery(queryText)

  // Run vector searches in parallel
  const [pyqResults, patternResults] = await Promise.allSettled([
    vectorSearch("pyq_embeddings", "pyq_vector_index", queryVector, 6, {
      company: { $eq: req.company },
    }),
    vectorSearch("pattern_embeddings", "pattern_vector_index", queryVector, 3, {
      company: { $eq: req.company },
    }),
  ])

  const pyqs  = pyqResults.status  === "fulfilled" ? pyqResults.value  : []
  const patterns = patternResults.status === "fulfilled" ? patternResults.value : []

  // If pyq vector search returns nothing, fall back to simple text query
  let fallbackPYQs: any[] = []
  if (pyqs.length === 0) {
    try {
      const db  = await getDatabase()
      const col = db.collection("pyq_embeddings")
      fallbackPYQs = await col
        .find({ company: req.company, section: req.section }, { projection: { embedding: 0 } })
        .limit(5)
        .toArray()
    } catch {}
  }

  const staticSamples = sampleStaticBank(req, 4)

  return {
    pyqs:         [...pyqs, ...fallbackPYQs].slice(0, 6),
    patterns,
    staticSamples,
    queryText,
  }
}
