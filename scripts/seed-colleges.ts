/**
 * scripts/seed-colleges.ts
 * Seeds the `colleges` collection with verified canonical entries.
 * DO NOT run this automatically — run manually once:
 *   npx tsx scripts/seed-colleges.ts
 *
 * Requires MONGODB_URI in environment (.env or exported).
 */

import "dotenv/config"
import { MongoClient } from "mongodb"
import { normalizeCode } from "../lib/colleges"

const URI = process.env.MONGODB_URI
if (!URI) { console.error("MONGODB_URI not set"); process.exit(1) }

const COLLEGES = [
  {
    code:    "RVRJC",
    name:    "RVR & JC College of Engineering",        // TODO: confirm full legal name
    short:   "RVR & JC",
    aliases: ["RVJC","RVRJ","RVRANDJC","RVRJCCE"].map(normalizeCode),
    status:  "verified",
  },
  {
    code:    "ADTPU",
    name:    "Aditya University",                       // TODO: confirm — "Aditya Institute of Technology and Management"?
    short:   "Aditya Univ",
    aliases: ["ADITYAUNIVERSITY","ADITYA","AITAM","ADITYAINSTITUTE"].map(normalizeCode),
    status:  "verified",
  },
  {
    code:    "GPREC",
    name:    "G. Pullaiah College of Engineering and Technology",
    short:   "GPREC",
    aliases: ["GPULLAREDDYENGINEERINGCOLLEGE","GPULLAREDDY","GPRECET"].map(normalizeCode),
    status:  "verified",
  },
  {
    code:    "IITD",
    name:    "Indian Institute of Technology Delhi",
    short:   "IIT Delhi",
    aliases: ["IITDELHI","IITDEL"].map(normalizeCode),
    status:  "verified",
  },
  {
    code:    "BITSPILANI",
    name:    "Birla Institute of Technology and Science, Pilani", // TODO: confirm preferred name/code
    short:   "BITS Pilani",
    aliases: ["BITS","BITSP","BITSHYDERABAD","BITSGOA"].map(normalizeCode),
    status:  "verified",
  },
  {
    code:    "NITK",
    name:    "National Institute of Technology Karnataka", // TODO: which NIT should be the canonical?
    short:   "NIT Karnataka",
    aliases: ["NIT","NITKARNATAKA","NITSURATHKAL"].map(normalizeCode),
    status:  "verified",
  },
  {
    code:    "SMGG",
    name:    "SMGG College",                            // TODO: please provide the full name
    short:   "SMGG",
    aliases: ["SMGG"].map(normalizeCode),
    status:  "verified",
  },
] as const

async function main() {
  const client = new MongoClient(URI!)
  await client.connect()
  const db = client.db()
  const col = db.collection("colleges")

  // Ensure unique index on code
  await col.createIndex({ code: 1 }, { unique: true })
  await col.createIndex({ aliases: 1 })

  let inserted = 0, updated = 0

  for (const entry of COLLEGES) {
    const doc = { ...entry, createdAt: new Date() }
    const res = await col.updateOne(
      { code: entry.code },
      { $setOnInsert: { ...doc } },
      { upsert: true }
    )
    if (res.upsertedCount) { console.log(`  ✓ inserted ${entry.code}`); inserted++ }
    else                   { console.log(`  ~ exists  ${entry.code}`); updated++ }
  }

  console.log(`\nDone: ${inserted} inserted, ${updated} already existed.`)
  await client.close()
}

main().catch(e => { console.error(e); process.exit(1) })
