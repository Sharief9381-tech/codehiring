import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"

// Explicit alias map for known variants
const COLLEGE_CODE_ALIASES: Record<string, string> = {
  // Aditya
  "ADTPPU": "ADITYA", "ADITYA UNIVERSITY": "ADITYA", "ADITYAUNIVERSITY": "ADITYA",
  "ADITYA-UNIVERSITY": "ADITYA", "ADITYA ENGINEERING COLLEGE": "ADITYA", "ADITYAEC": "ADITYA",
  // IIT
  "IIT-H": "IITH", "IIT HYDERABAD": "IITH", "IIT-B": "IITB", "IIT BOMBAY": "IITB",
  "IIT-D": "IITD", "IIT DELHI": "IITD", "IIT-M": "IITM", "IIT MADRAS": "IITM",
  "IIT-KGP": "IITKGP", "IIT KHARAGPUR": "IITKGP", "IIT-BHU": "IITBHU", "IIT BHU": "IITBHU",
  "IIT-R": "IITR", "IIT ROORKEE": "IITR", "IIT-G": "IITG", "IIT GUWAHATI": "IITG",
  // BITS
  "BITS-HYD": "BITSHYD", "BITS PILANI HYDERABAD": "BITSHYD", "BITS HYDERABAD": "BITSHYD",
  "BITS-PIL": "BITSPILANI", "BITS PILANI": "BITSPILANI",
  // KL
  "KL UNIVERSITY": "KLEF", "KLU": "KLEF",
  // VIT
  "VIT AP": "VITAP", "VIT-AP": "VITAP",
  // SRM
  "SRM AP": "SRMAP", "SRM-AP": "SRMAP",
  // KITS variants
  "KITSW": "KITS", "KAKATIYA INSTITUTE OF TECHNOLOGY": "KITS",
  "KAKATIYA INSTITUTE OF TECHNOLOGY AND SCIENCE": "KITS",
  // JNTU variants
  "JNTU": "JNTUH", "JNTU-H": "JNTUH", "JNTUHCEH": "JNTUHJCEH",
  // NIT variants
  "NIT WARANGAL": "NITW", "NITW": "NITW", "NIT-W": "NITW",
  "NIT AP": "NITAP", "NIT ANDHRA PRADESH": "NITAP",
}

function normalizeCollegeCode(raw: string | undefined): string {
  if (!raw) return ""
  // Trim and uppercase
  const upper = raw.trim().toUpperCase()
  // Check alias map
  if (COLLEGE_CODE_ALIASES[upper]) return COLLEGE_CODE_ALIASES[upper]
  // Strip common noise: spaces, dashes, dots → canonical form
  const stripped = upper.replace(/[\s\-\.]+/g, "")
  if (COLLEGE_CODE_ALIASES[stripped]) return COLLEGE_CODE_ALIASES[stripped]
  // Return stripped canonical (so "KITS" and "kits" both become "KITS")
  return stripped || upper
}

function getTotalProblems(student: any): number {
  const platforms = student.linkedPlatforms || {}
  let total = 0
  for (const data of Object.values(platforms) as any[]) {
    if (!data || typeof data !== "object") continue
    const s = data.stats
    if (!s) continue
    total += s.totalSolved || s.problemsSolved || 0
  }
  return total
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const student = await UserModel.findById(user._id as string)
    if (!student) return NextResponse.json({ globalRank: null, collegeRank: null, totalGlobal: 0, totalCollege: 0 })

    const myProblems = getTotalProblems(student)
    const myCollege = normalizeCollegeCode((student as any).collegeCode) || null

    const allStudents = await UserModel.findAll({ role: "student" })

    const globalScores = allStudents.map((s: any) => getTotalProblems(s)).sort((a, b) => b - a)
    const globalRank = globalScores.filter(p => p > myProblems).length + 1

    let collegeRank: number | null = null
    let totalCollege = 0
    if (myCollege) {
      const collegeStudents = allStudents.filter(
        (s: any) => normalizeCollegeCode(s.collegeCode) === myCollege
      )
      totalCollege = collegeStudents.length
      const collegeScores = collegeStudents.map((s: any) => getTotalProblems(s)).sort((a, b) => b - a)
      collegeRank = collegeScores.filter(p => p > myProblems).length + 1
    }

    return NextResponse.json({
      globalRank,
      collegeRank,
      totalGlobal: allStudents.length,
      totalCollege,
      totalColleges: new Set(
        allStudents.map((s: any) => normalizeCollegeCode(s.collegeCode)).filter(Boolean)
      ).size,
      myProblems,
      myCollege,
    })
  } catch (error) {
    console.error("Ranking error:", error)
    return NextResponse.json({ globalRank: null, collegeRank: null, totalGlobal: 0, totalCollege: 0 })
  }
}
