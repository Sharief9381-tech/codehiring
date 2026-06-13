import { NextResponse } from "next/server"
import { UserModel } from "@/lib/models/user"
import { isDatabaseAvailable } from "@/lib/database"

/**
 * Normalize college codes so variants of the same institution are grouped together.
 * Key = raw code stored in DB → Value = canonical code to display
 */
const COLLEGE_CODE_ALIASES: Record<string, string> = {
  // Aditya
  "ADTPPU": "ADITYA", "ADITYA UNIVERSITY": "ADITYA", "ADITYAUNIVERSITY": "ADITYA",
  "ADITYA-UNIVERSITY": "ADITYA", "ADITYA ENGINEERING COLLEGE": "ADITYA", "ADITYAEC": "ADITYA",
  // IIT
  "IIT-H": "IITH", "IIT HYDERABAD": "IITH", "IIT-B": "IITB", "IIT BOMBAY": "IITB",
  "IIT-D": "IITD", "IIT DELHI": "IITD", "IIT-M": "IITM", "IIT MADRAS": "IITM",
  "IIT-KGP": "IITKGP", "IIT KHARAGPUR": "IITKGP", "IIT-R": "IITR", "IIT ROORKEE": "IITR",
  "IIT-G": "IITG", "IIT GUWAHATI": "IITG", "IIT-BHU": "IITBHU", "IIT BHU": "IITBHU",
  // BITS
  "BITS-HYD": "BITSHYD", "BITS PILANI HYDERABAD": "BITSHYD", "BITS HYDERABAD": "BITSHYD",
  "BITS-PIL": "BITSPILANI", "BITS PILANI": "BITSPILANI",
  // JNTU
  "JNTU": "JNTUH", "JNTU-H": "JNTUH", "JNTUH-CEH": "JNTUHJCEH",
  // KL
  "KL UNIVERSITY": "KLEF", "KLU": "KLEF",
  // VIT
  "VIT AP": "VITAP", "VIT-AP": "VITAP",
  // SRM
  "SRM AP": "SRMAP", "SRM-AP": "SRMAP",
  // KITS
  "KITSW": "KITS", "KAKATIYA INSTITUTE OF TECHNOLOGY": "KITS",
  "KAKATIYA INSTITUTE OF TECHNOLOGY AND SCIENCE": "KITS",
  // NIT
  "NIT WARANGAL": "NITW", "NIT-W": "NITW", "NIT AP": "NITAP", "NIT ANDHRA PRADESH": "NITAP",
}

function normalizeCollegeCode(raw: string | undefined): string {
  if (!raw) return ""
  const upper = raw.trim().toUpperCase()
  if (COLLEGE_CODE_ALIASES[upper]) return COLLEGE_CODE_ALIASES[upper]
  // Strip spaces/dashes/dots for a canonical form
  const stripped = upper.replace(/[\s\-\.]+/g, "")
  if (COLLEGE_CODE_ALIASES[stripped]) return COLLEGE_CODE_ALIASES[stripped]
  return stripped || upper
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
