/**
 * OpenAI text embeddings for RAG
 * Uses text-embedding-3-small (1536 dimensions, cheapest, fast)
 */

const OPENAI_EMBED_URL = "https://api.openai.com/v1/embeddings"
const EMBED_MODEL      = "text-embedding-3-small"

export async function getEmbedding(text: string): Promise<number[]> {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error("OPENAI_API_KEY not set")

  const res = await fetch(OPENAI_EMBED_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: EMBED_MODEL,
      input: text.slice(0, 8000), // max input length
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Embedding error ${res.status}: ${err.slice(0, 200)}`)
  }

  const data = await res.json()
  return data.data[0].embedding as number[]
}

export async function getEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error("OPENAI_API_KEY not set")

  const res = await fetch(OPENAI_EMBED_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: EMBED_MODEL,
      input: texts.map(t => t.slice(0, 8000)),
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Batch embedding error ${res.status}: ${err.slice(0, 200)}`)
  }

  const data = await res.json()
  return data.data
    .sort((a: any, b: any) => a.index - b.index)
    .map((d: any) => d.embedding as number[])
}
