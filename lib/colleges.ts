/**
 * lib/colleges.ts
 * Canonical college code resolution with in-process 10-minute cache.
 */

import { getDatabase, isDatabaseAvailable } from "@/lib/database"

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CollegeDoc {
  code:      string          // canonical uppercase, A-Z 0-9 only
  name:      string          // full official name
  short:     string          // short display name (fits in a pill)
  aliases:   string[]        // uppercase, stripped — alternative codes
  status:    "verified" | "pending"
  createdAt: Date
}

// ── Normalization ─────────────────────────────────────────────────────────────

/**
 * normalizeCode — uppercase, strip everything except A-Z and 0-9.
 * "RVR & JC" → "RVRJC"   "iit-delhi" → "IITDELHI"
 */
export function normalizeCode(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, "")
}

// ── In-process cache ──────────────────────────────────────────────────────────

let _cache: CollegeDoc[] | null = null
let _cacheAt = 0
const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes

async function getAllColleges(): Promise<CollegeDoc[]> {
  const now = Date.now()
  if (_cache && now - _cacheAt < CACHE_TTL_MS) return _cache
  if (!isDatabaseAvailable()) return []

  try {
    const db = await getDatabase()
    const docs = await db.collection("colleges").find({}).toArray()
    _cache = docs as unknown as CollegeDoc[]
    _cacheAt = now
    return _cache
  } catch {
    return _cache ?? []
  }
}

/** Call this after a write to `colleges` to force a fresh fetch on next read. */
export function invalidateCollegeCache() {
  _cache  = null
  _cacheAt = 0
}

// ── Resolution ────────────────────────────────────────────────────────────────

/**
 * resolveCollegeCode — normalize the input, then search `colleges` collection.
 * Matches if  code === normalized  OR  aliases includes normalized.
 * Returns the CollegeDoc or null.
 */
export async function resolveCollegeCode(raw: string): Promise<CollegeDoc | null> {
  if (!raw?.trim()) return null
  const normalized = normalizeCode(raw)
  if (!normalized) return null

  const all = await getAllColleges()
  return (
    all.find(c => c.code === normalized || c.aliases.includes(normalized)) ?? null
  )
}

// ── Ensure index (call once at startup or from seed script) ───────────────────

export async function ensureCollegesIndex() {
  if (!isDatabaseAvailable()) return
  try {
    const db = await getDatabase()
    await db.collection("colleges").createIndex({ code: 1 }, { unique: true })
    await db.collection("colleges").createIndex({ aliases: 1 })
    await db.collection("colleges").createIndex({ status: 1 })
    await db.collection("colleges").createIndex(
      { name: "text", short: "text" },
      { name: "colleges_text_search" }
    )
  } catch {
    // Index may already exist — safe to ignore
  }
}
