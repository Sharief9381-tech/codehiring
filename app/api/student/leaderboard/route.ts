import { NextResponse } from "next/server"
import { getDemoStudent, DEMO_STUDENT_ID } from "@/lib/demo-db"
import { UserModel } from "@/lib/models/user"

function calcProblems(student: any): number {
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

function calcRating(student: any): number {
  const platforms = student.linkedPlatforms || {}
  let best = 0
  for (const data of Object.values(platforms) as any[]) {
    if (!data || typeof data !== "object") continue
    const s = data.stats
    if (!s) continue
    const r = s.rating || s.currentRating || s.highestRating || s.contestRating || 0
    if (r > best) best = r
  }
  return best
}

function calcContests(student: any): number {
  const platforms = student.linkedPlatforms || {}
  let total = 0
  for (const data of Object.values(platforms) as any[]) {
    if (!data || typeof data !== "object") continue
    const s = data.stats
    if (!s) continue
    total += s.contests?.length || s.contestsParticipated || s.attendedContestsCount || 0
  }
  return total
}

function buildEntry(student: any, rank: number) {
  const problems = calcProblems(student)
  const rating = calcRating(student)
  const contests = calcContests(student)
  const platforms = Object.keys(student.linkedPlatforms || {}).filter(k => student.linkedPlatforms[k])
  return {
    rank,
    name: student.name || "Student",
    email: student.email || "",
    collegeCode: student.collegeCode || "",
    branch: student.branch || "",
    graduationYear: student.graduationYear || null,
    problems,
    rating,
    contests,
    platforms,
    isMe: student._id?.toString() === DEMO_STUDENT_ID,
  }
}

export async function GET() {
  try {
    const me = await getDemoStudent()
    const myCollege = (me as any)?.collegeCode || null

    const allStudents = await UserModel.findAll({ role: "student" })

    // Sort by problems desc, then rating desc
    const sorted = [...allStudents].sort((a: any, b: any) => {
      const pd = calcProblems(b) - calcProblems(a)
      if (pd !== 0) return pd
      return calcRating(b) - calcRating(a)
    })

    const global = sorted.map((s, i) => buildEntry(s, i + 1))

    // College leaderboard
    let college: any[] = []
    if (myCollege) {
      const collegeSorted = sorted.filter((s: any) => s.collegeCode === myCollege)
      college = collegeSorted.map((s, i) => buildEntry(s, i + 1))
    }

    return NextResponse.json({ global, college, myCollege })
  } catch (error) {
    console.error("Leaderboard error:", error)
    return NextResponse.json({ global: [], college: [], myCollege: null })
  }
}
