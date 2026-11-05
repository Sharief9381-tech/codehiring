/**
 * scripts/migrate-student-colleges.ts
 * Migrates existing students' college field to a canonical collegeCode.
 *
 * Dry-run by default (prints table, writes nothing).
 * Pass --apply to write changes to MongoDB.
 *
 *   npx tsx scripts/migrate-student-colleges.ts
 *   npx tsx scripts/migrate-student-colleges.ts --apply
 *
 * Requires MONGODB_URI in environment.
 */

import "dotenv/config"
import { MongoClient } from "mongodb"
import { normalizeCode, resolveCollegeCode } from "../lib/colleges"

const URI = process.env.MONGODB_URI
if (!URI) { console.error("MONGODB_URI not set"); process.exit(1) }

const APPLY = process.argv.includes("--apply")

async function main() {
  const client = new MongoClient(URI!)
  await client.connect()
  const db = client.db()

  const students = await db.collection("users")
    .find({ role: "student" }, { projection: { _id: 1, collegeCode: 1, name: 1 } })
    .toArray()

  console.log(`\nFound ${students.length} students.\n`)

  const resolved: { raw: string; canonical: string; count: number }[] = []
  const unresolved: { raw: string; count: number }[] = []
  const rawMap: Record<string, string | null> = {}  // raw → canonical or null

  // Group students by their raw collegeCode
  const groups: Record<string, string[]> = {}
  for (const s of students) {
    const raw = s.collegeCode ?? ""
    if (!groups[raw]) groups[raw] = []
    groups[raw].push(s._id.toString())
  }

  // Resolve each unique raw value once
  for (const raw of Object.keys(groups)) {
    const canonical = raw ? (await resolveCollegeCode(raw))?.code ?? null : null
    rawMap[raw] = canonical
    if (canonical) {
      resolved.push({ raw, canonical, count: groups[raw].length })
    } else {
      unresolved.push({ raw, count: groups[raw].length })
    }
  }

  // Print resolved table
  console.log("── RESOLVED ─────────────────────────────────────────────────")
  console.log(["raw value".padEnd(24), "→ canonical".padEnd(20), "students"].join(" "))
  for (const r of resolved.sort((a, b) => b.count - a.count)) {
    console.log([r.raw.padEnd(24), ("→ " + r.canonical).padEnd(20), r.count].join(" "))
  }

  // Print unresolved table
  console.log("\n── UNRESOLVED (need aliases or new college docs) ────────────")
  console.log(["raw value".padEnd(24), "students"].join(" "))
  for (const u of unresolved.sort((a, b) => b.count - a.count)) {
    if (!u.raw) console.log(["(empty)".padEnd(24), u.count].join(" "))
    else        console.log([u.raw.padEnd(24), u.count].join(" "))
  }

  if (!APPLY) {
    console.log("\n[DRY RUN] No changes written. Pass --apply to apply.")
    await client.close()
    return
  }

  // Apply migrations
  let written = 0
  for (const s of students) {
    const raw       = s.collegeCode ?? ""
    const canonical = rawMap[raw]
    if (!canonical || canonical === raw) continue  // skip if already canonical or unresolved
    await db.collection("users").updateOne(
      { _id: s._id },
      { $set: { collegeCode: canonical, updatedAt: new Date() } }
    )
    written++
  }

  console.log(`\n[APPLIED] Updated ${written} student records.`)
  await client.close()
}

main().catch(e => { console.error(e); process.exit(1) })
