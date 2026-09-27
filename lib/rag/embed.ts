/**
 * OpenAI text embeddings for RAG
 * Uses text-embedding-3-small (1536 dimensions, cheapest, fast)
 * Falls back to a 256-dim local hash embedding when OpenAI is unavailable.
 */

const OPENAI_EMBED_URL = "https://api.openai.com/v1/embeddings"
const EMBED_MODEL      = "text-embedding-3-small"

// ── Local fallback: 256-dim bag-of-words hash vector ─────────────────────────
// Used when OpenAI key is missing or has no credits.
// Good enough for MongoDB $vectorSearch cosine similarity on structured text.
const VOCAB_SIZE = 256

export function hashEmbed(text: string): number[] {
  const words = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2)

  const vec = new Array(VOCAB_SIZE).fill(0)
  for (const word of words) {
    let h = 5381
    for (let i = 0; i < word.length; i++) h = ((h << 5) + h) + word.charCodeAt(i)
    vec[Math.abs(h) % VOCAB_SIZE] += 1
  }

  // L2 normalize
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1
  return vec.map(v => v / norm)
}

export async function getEmbedding(text: string): Promise<number[]> {
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    console.warn("OPENAI_API_KEY not set — using local hash embedding (256-dim)")
    return hashEmbed(text)
  }

  try {
    const res = await fetch(OPENAI_EMBED_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
      body: JSON.stringify({ model: EMBED_MODEL, input: text.slice(0, 8000) }),
    })

    if (!res.ok) {
      const err = await res.text()
      // If no credits / quota exceeded, fall back gracefully
      if (res.status === 429 || res.status === 402) {
        console.warn(`OpenAI embed quota exceeded (${res.status}) — using local hash embedding`)
        return hashEmbed(text)
      }
      throw new Error(`Embedding error ${res.status}: ${err.slice(0, 200)}`)
    }

    const data = await res.json()
    return data.data[0].embedding as number[]
  } catch (e: any) {
    if (e.message?.includes("quota") || e.message?.includes("credits")) {
      return hashEmbed(text)
    }
    throw e
  }
}

export async function getEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    console.warn("OPENAI_API_KEY not set — using local hash embeddings (256-dim)")
    return texts.map(hashEmbed)
  }

  try {
    const res = await fetch(OPENAI_EMBED_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
      body: JSON.stringify({ model: EMBED_MODEL, input: texts.map(t => t.slice(0, 8000)) }),
    })

    if (!res.ok) {
      const err = await res.text()
      if (res.status === 429 || res.status === 402) {
        console.warn(`OpenAI batch embed quota exceeded (${res.status}) — using local hash embeddings`)
        return texts.map(hashEmbed)
      }
      throw new Error(`Batch embedding error ${res.status}: ${err.slice(0, 200)}`)
    }

    const data = await res.json()
    return data.data
      .sort((a: any, b: any) => a.index - b.index)
      .map((d: any) => d.embedding as number[])
  } catch (e: any) {
    if (e.message?.includes("quota") || e.message?.includes("credits")) {
      return texts.map(hashEmbed)
    }
    throw e
  }
}
