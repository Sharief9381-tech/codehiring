import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
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

function buildEntry(student: any, rank: number, myId: string) {
  const problems = calcProblems(student)
  const rating = calcRating(student)
  const contests = calcContests(student)
  const platforms = Object.keys(student.linkedPlatforms || {}).filter((k: string) => student.linkedPlatforms[k])
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
    isMe: student._id?.toString() === myId,
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const myId = user._id as string
    const myCollege = (user as any).collegeCode || null

    const allStudents = await UserModel.findAll({ role: "student" })

    const sorted = [...allStudents].sort((a: any, b: any) => {
      const pd = calcProblems(b) - calcProblems(a)
      if (pd !== 0) return pd
      return calcRating(b) - calcRating(a)
    })

    const global = sorted.map((s, i) => buildEntry(s, i + 1, myId))

    let college: any[] = []
    if (myCollege) {
      const collegeSorted = sorted.filter((s: any) => s.collegeCode === myCollege)
      college = collegeSorted.map((s, i) => buildEntry(s, i + 1, myId))
    }

    return NextResponse.json({ global, college, myCollege })
  } catch (error) {
    console.error("Leaderboard error:", error)
    return NextResponse.json({ global: [], college: [], myCollege: null })
  }
}
