/**
 * POST /api/debug/fix-college-codes
 * One-time migration: normalizes all student collegeCode values in the DB.
 * Trims, uppercases, removes spaces/dashes/dots so all students
 * from the same college share the same canonical code.
 * Also applies known alias mappings (ADTPPU → ADITYA, KITSW → KITS, etc.)
 */
import { NextResponse } from "next/server"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"

const ALIASES: Record<string, string> = {
  "ADTPPU": "ADITYA", "ADITYAUNIVERSITY": "ADITYA", "ADITYAENGINEERING": "ADITYA",
  "IITH": "IITH", "IITHYD": "IITH", "IITHYDERABAD": "IITH",
  "KITSW": "KITS", "KAKATIYAINSTITUTEOFTECHNOLOGY": "KITS",
  "KAKATIYAINSTITUTEOFTECHNOLOGYANDSCIENCE": "KITS",
  "BITSHYD": "BITSHYD", "BITSPILANIHYDERABAD": "BITSHYD",
  "KLU": "KLEF", "KLUNIVERSITY": "KLEF",
  "JNTUH": "JNTUH", "JNTUH-CEH": "JNTUHJCEH",
  "NITW": "NITW", "NITWARANGAL": "NITW",
  "VITAP": "VITAP", "VITAP": "VITAP",
  "SRMAP": "SRMAP", "SRMAP": "SRMAP",
}

function normalize(raw: string): string {
  if (!raw) return ""
  const stripped = raw.trim().toUpperCase().replace(/[\s\-\.]+/g, "")
  return ALIASES[stripped] ?? stripped
}

export async function POST(req: Request) {
  if (!isDatabaseAvailable()) {
    return NextResponse.json({ error: "DB unavailable" }, { status: 503 })
  }

  try {
    const db = await getDatabase()
    const students = await db.collection("users").find({ role: "student" }).toArray()

    let fixed = 0
    const changes: { name: string; old: string; new: string }[] = []

    for (const s of students) {
      const original = s.collegeCode || ""
      const normalized = normalize(original)
      if (normalized !== original) {
        await db.collection("users").updateOne(
          { _id: s._id },
          { $set: { collegeCode: normalized, updatedAt: new Date() } }
        )
        changes.push({ name: s.name, old: original, new: normalized })
        fixed++
      }
    }

    return NextResponse.json({
      success: true,
      total: students.length,
      fixed,
      changes,
    })
  } catch (err) {
    console.error("fix-college-codes error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
