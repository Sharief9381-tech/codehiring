import { NextResponse } from "next/server"
import { getDemoStudent, DEMO_STUDENT_ID } from "@/lib/demo-db"
import { UserModel } from "@/lib/models/user"

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
    const me = await getDemoStudent()
    if (!me) return NextResponse.json({ globalRank: null, collegeRank: null, totalGlobal: 0, totalCollege: 0 })

    const myProblems = getTotalProblems(me)
    const myCollege = (me as any).collegeCode || null

    // Get all students
    const allStudents = await UserModel.findAll({ role: "student" })

    // Global rank — count how many students have MORE problems than me
    const globalScores = allStudents.map((s: any) => getTotalProblems(s)).sort((a, b) => b - a)
    const globalRank = globalScores.filter(p => p > myProblems).length + 1

    // College rank — same but filtered by same college
    let collegeRank: number | null = null
    let totalCollege = 0
    if (myCollege) {
      const collegeStudents = allStudents.filter((s: any) => s.collegeCode === myCollege)
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
