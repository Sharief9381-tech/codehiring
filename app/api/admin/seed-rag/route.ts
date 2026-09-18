/**
 * POST /api/admin/seed-rag
 * Seeds all PYQs from question-bank.ts into MongoDB with OpenAI embeddings.
 * Run once after setting up the Atlas Vector Search index.
 *
 * Protected by SEED_SECRET or NEXTAUTH_SECRET.
 *
 * Atlas Vector Search Index (create in Atlas UI → Search → Create Search Index → JSON):
 * Collection: pyq_embeddings
 * Index name: pyq_vector_index
 * {
 *   "fields": [{
 *     "type": "vector",
 *     "path": "embedding",
 *     "numDimensions": 1536,
 *     "similarity": "cosine"
 *   }]
 * }
 */

import { NextResponse } from "next/server"
import {
  TCS_QUANT, TCS_LOGICAL, TCS_VERBAL,
  INFOSYS_QUANT, INFOSYS_PSEUDO,
  WIPRO_QUANT, COGNIZANT_QUANT,
  AMAZON_CODING, GOOGLE_CODING,
  type PYQ,
} from "@/lib/question-bank"
import { upsertPYQsBulk, countPYQs } from "@/lib/rag/vector-store"

// All PYQs across all companies
const ALL_PYQS: PYQ[] = [
  ...TCS_QUANT,
  ...TCS_LOGICAL,
  ...TCS_VERBAL,
  ...INFOSYS_QUANT,
  ...INFOSYS_PSEUDO,
  ...WIPRO_QUANT,
  ...COGNIZANT_QUANT,
  ...AMAZON_CODING,
  ...GOOGLE_CODING,
]

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const secret = body.secret ?? ""

    if (
      secret !== process.env.SEED_SECRET &&
      secret !== process.env.NEXTAUTH_SECRET
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY required for embeddings" },
        { status: 503 }
      )
    }

    const before = await countPYQs()

    // Process in batches of 20 (OpenAI batch embedding limit)
    const BATCH_SIZE = 20
    let seeded = 0

    for (let i = 0; i < ALL_PYQS.length; i += BATCH_SIZE) {
      const batch = ALL_PYQS.slice(i, i + BATCH_SIZE)
      await upsertPYQsBulk(batch)
      seeded += batch.length
    }

    const after = await countPYQs()

    return NextResponse.json({
      success: true,
      seeded,
      totalInDB: after,
      newInserted: after - before,
      message: `Seeded ${seeded} PYQs. Total in DB: ${after}`,
    })
  } catch (err: any) {
    console.error("RAG seed error:", err)
    return NextResponse.json(
      { error: err.message ?? "Seed failed" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const secret = url.searchParams.get("secret") ?? ""

  if (
    secret !== process.env.SEED_SECRET &&
    secret !== process.env.NEXTAUTH_SECRET
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const total = await countPYQs()
  return NextResponse.json({ total, message: `${total} PYQs in vector store` })
}
