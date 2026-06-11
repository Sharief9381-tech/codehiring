import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"

// Same alias map as leaderboard — keep in sync
const COLLEGE_CODE_ALIASES: Record<string, string> = {
  "ADTPPU": "ADITYA", "ADITYA UNIVERSITY": "ADITYA", "ADITYAUNIVERSITY": "ADITYA",
  "ADITYA-UNIVERSITY": "ADITYA", "ADITYA ENGINEERING COLLEGE": "ADITYA", "ADITYAEC": "ADITYA",
  "IIT-H": "IITH", "IIT HYDERABAD": "IITH", "IIT-B": "IITB", "IIT BOMBAY": "IITB",
  "IIT-D": "IITD", "IIT DELHI": "IITD", "BITS-HYD": "BITSHYD", "BITS PILANI HYDERABAD": "BITSHYD",
  "KL UNIVERSITY": "KLEF", "KLU": "KLEF", "VIT AP": "VITAP", "VIT-AP": "VITAP",
  "SRM AP": "SRMAP", "SRM-AP": "SRMAP",
}

function normalizeCollegeCode(raw: string | undefined): string {
  if (!raw) return ""
  const upper = raw.trim().toUpperCase()
  return COLLEGE_CODE_ALIASES[upper] ?? COLLEGE_CODE_ALIASES[raw.trim()] ?? upper
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
      myProblems,
      myCollege,
    })
  } catch (error) {
    console.error("Ranking error:", error)
    return NextResponse.json({ globalRank: null, collegeRank: null, totalGlobal: 0, totalCollege: 0 })
  }
}
