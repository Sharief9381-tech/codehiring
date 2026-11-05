/**
 * scripts/seed-aptitude-questions.ts
 *
 * Seeds the `aptitude_questions` MongoDB collection from the HuggingFace dataset:
 * suchandra17/preprocessed_aptitude  (117,262 rows)
 *
 * Run once:
 *   npx tsx scripts/seed-aptitude-questions.ts
 *
 * Options:
 *   --batch 500       rows per HF API call (default 500, max 500)
 *   --start 0         starting offset (use to resume)
 *   --limit 117262    total rows to fetch (default all)
 *
 * Requires MONGODB_URI in environment.
 */

import "dotenv/config"
import { MongoClient } from "mongodb"

const URI = process.env.MONGODB_URI
if (!URI) { console.error("MONGODB_URI not set"); process.exit(1) }

const HF_API    = "https://datasets-server.huggingface.co/rows"
const HF_DS     = "suchandra17/preprocessed_aptitude"
const COLL      = "aptitude_questions"
const HF_TOKEN  = process.env.HF_TOKEN  // Add HF_TOKEN to .env — get free token at huggingface.co/settings/tokens

// Parse CLI args
const args      = process.argv.slice(2)
const getArg    = (flag: string, def: number) => { const i = args.indexOf(flag); return i >= 0 ? Number(args[i+1]) : def }
const BATCH     = Math.min(getArg("--batch", 100), 100)  // HF free tier max: 100 rows per request
const START     = getArg("--start", 0)
const LIMIT     = getArg("--limit", 117262)
const DELAY_MS  = HF_TOKEN ? 200 : 1000  // authenticated = faster, unauthenticated = slower

async function fetchBatch(offset: number, length: number): Promise<any[]> {
  const url = `${HF_API}?dataset=${encodeURIComponent(HF_DS)}&config=default&split=train&offset=${offset}&length=${length}`
  const headers: Record<string, string> = { Accept: "application/json" }
  if (HF_TOKEN) headers["Authorization"] = `Bearer ${HF_TOKEN}`
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(30000) })
  if (!res.ok) throw new Error(`HF ${res.status}: ${await res.text()}`)
  const data = await res.json()
  return data.rows ?? []
}

async function main() {
  const client = new MongoClient(URI!)
  await client.connect()
  const db  = client.db()
  const col = db.collection(COLL)

  // Create index for fast random offset queries
  await col.createIndex({ seq: 1 })
  await col.createIndex({ topic: 1 })

  // Check existing count so we can skip already-seeded rows
  const existing = await col.countDocuments()
  console.log(`\nExisting: ${existing} rows in ${COLL}`)
  const startAt = Math.max(START, existing)  // resume from where we left off
  if (startAt >= LIMIT) { console.log("Already complete."); await client.close(); return }

  console.log(`Fetching rows ${startAt}–${LIMIT} in batches of ${BATCH}…\n`)

  let inserted = 0
  let offset   = startAt

  while (offset < LIMIT) {
    const batchSize = Math.min(BATCH, LIMIT - offset)
    let rows: any[] = []

    try {
      rows = await fetchBatch(offset, batchSize)
    } catch (e: any) {
      console.error(`  ✗ batch ${offset}: ${e.message} — retrying in 5s…`)
      await new Promise(r => setTimeout(r, 5000))
      try { rows = await fetchBatch(offset, batchSize) }
      catch { console.error(`  ✗ batch ${offset}: retry also failed, skipping`); offset += batchSize; continue }
    }

    if (rows.length === 0) break

    const docs = rows
      .map((r: any, i: number) => ({
        seq:      offset + i,
        question: (r.row?.question ?? "").trim(),
        answer:   (r.row?.answer   ?? "").trim(),
        topic:    "general",
      }))
      .filter(d => d.question.length > 10)

    if (docs.length > 0) {
      // Use ordered:false to skip duplicates without aborting
      await col.insertMany(docs, { ordered: false }).catch(() => {})
      inserted += docs.length
    }

    offset += batchSize
    const pct = ((offset / LIMIT) * 100).toFixed(1)
    process.stdout.write(`\r  ${offset}/${LIMIT} (${pct}%) — inserted ${inserted} total`)

    // Respect rate limits: 200ms with token, 1000ms without
    await new Promise(r => setTimeout(r, DELAY_MS))
  }

  const final = await col.countDocuments()
  console.log(`\n\nDone. Total in collection: ${final}`)
  await client.close()
}

main().catch(e => { console.error(e); process.exit(1) })
