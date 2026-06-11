import { NextResponse } from "next/server"
import { UserModel } from "@/lib/models/user"
import { isDatabaseAvailable } from "@/lib/database"

/**
 * Normalize college codes so variants of the same institution are grouped together.
 * Key = raw code stored in DB → Value = canonical code to display
 */
const COLLEGE_CODE_ALIASES: Record<string, string> = {
  // Aditya University / ADTPPU variants
  "ADTPPU": "ADITYA",
  "ADITYA UNIVERSITY": "ADITYA",
  "ADITYAUNIVERSITY": "ADITYA",
  "ADITYA-UNIVERSITY": "ADITYA",
  "ADITYA ENGINEERING COLLEGE": "ADITYA",
  "ADITYAEC": "ADITYA",

  // IIT variants
  "IIT-H": "IITH",
  "IIT HYDERABAD": "IITH",
  "IIT-B": "IITB",
  "IIT BOMBAY": "IITB",
  "IIT-D": "IITD",
  "IIT DELHI": "IITD",
  "IIT-M": "IITM",
  "IIT MADRAS": "IITM",
  "IIT-KGP": "IITKGP",
  "IIT KHARAGPUR": "IITKGP",

  // BITS variants
  "BITS-HYD": "BITSHYD",
  "BITS PILANI HYDERABAD": "BITSHYD",
  "BITS HYDERABAD": "BITSHYD",
  "BITS-PIL": "BITSPILANI",
  "BITS PILANI": "BITSPILANI",

  // JNTU variants
  "JNTU": "JNTUH",
  "JNTU-H": "JNTUH",
  "JNTUH-CEH": "JNTUHJCEH",

  // KL variants
  "KL UNIVERSITY": "KLEF",
  "KLU": "KLEF",

  // VIT variants
  "VIT AP": "VITAP",
  "VIT-AP": "VITAP",

  // SRM variants
  "SRM AP": "SRMAP",
  "SRM-AP": "SRMAP",

  // Generic case-insensitive handled below
}

function normalizeCollegeCode(raw: string | undefined): string {
  if (!raw) return ""
  const trimmed = raw.trim()
  const upper = trimmed.toUpperCase()
  // Check direct alias map (case-insensitive)
  const alias = COLLEGE_CODE_ALIASES[upper] ?? COLLEGE_CODE_ALIASES[trimmed]
  if (alias) return alias
  // Return uppercased trimmed original
  return upper
}

function calcProblems(student: any): number {
  const platforms = student.linkedPlatforms || {}
  let total = 0
  for (const data of Object.values(platforms) as any[]) {
    if (!data || typeof data !== "object") continue
    const s = data.stats ?? data
    total += Number(s.totalSolved || s.problemsSolved || 0)
  }
  return total
}

function calcRating(student: any): number {
  const platforms = student.linkedPlatforms || {}
  let best = 0
  for (const data of Object.values(platforms) as any[]) {
    if (!data || typeof data !== "object") continue
    const s = data.stats ?? data
    const r = Number(s.rating || s.currentRating || s.highestRating || s.contestRating || 0)
    if (r > best) best = r
  }
  return best
}

function calcContests(student: any): number {
  const platforms = student.linkedPlatforms || {}
  let total = 0
  for (const data of Object.values(platforms) as any[]) {
    if (!data || typeof data !== "object") continue
    const s = data.stats ?? data
    total += Number(s.contests?.length || s.contestsParticipated || s.attendedContestsCount || 0)
  }
  return total
}

function buildEntry(student: any, rank: number) {
  return {
    rank,
    name: student.name || "Student",
    email: student.email || "",
    collegeCode: normalizeCollegeCode(student.collegeCode),
    branch: student.branch || "",
    graduationYear: student.graduationYear || null,
    problems: calcProblems(student),
    rating: calcRating(student),
    contests: calcContests(student),
    platforms: Object.keys(student.linkedPlatforms || {}).filter(
      (k) => student.linkedPlatforms[k]
    ),
  }
}

// ── Route ─────────────────────────────────────────────────────────────────────

export async function GET() {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({ global: [], college: [], totalStudents: 0 })
    }

    const allStudents = await UserModel.findAll({ role: "student" })

    // Sort by problems solved desc, then rating desc as tiebreaker
    const sorted = [...allStudents].sort((a: any, b: any) => {
      const pd = calcProblems(b) - calcProblems(a)
      if (pd !== 0) return pd
      return calcRating(b) - calcRating(a)
    })

    const global = sorted.map((s, i) => buildEntry(s, i + 1))

    // Group by college for college leaderboards
    const byCollege: Record<string, typeof global> = {}
    for (const entry of global) {
      if (!entry.collegeCode) continue
      if (!byCollege[entry.collegeCode]) byCollege[entry.collegeCode] = []
      byCollege[entry.collegeCode].push(entry)
    }

    // Re-rank within each college
    const college: Record<string, typeof global> = {}
    for (const [code, entries] of Object.entries(byCollege)) {
      college[code] = entries.map((e, i) => ({ ...e, rank: i + 1 }))
    }

    return NextResponse.json({
      global,
      college,
      totalStudents: global.length,
    })
  } catch (error) {
    console.error("Leaderboard error:", error)
    return NextResponse.json({ global: [], college: {}, totalStudents: 0 })
  }
}
