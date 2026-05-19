import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { isDatabaseAvailable } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "college") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const college = user as any
    const collegeName = college.collegeName
    const collegeCode = college.collegeCode

    const { searchParams } = new URL(request.url)
    const department = searchParams.get("department")
    const year = searchParams.get("year")
    const search = searchParams.get("search")

    const filter: any = { role: 'student', collegeCode }
    if (department && department !== 'all') filter.branch = department
    if (year && year !== 'all') filter.graduationYear = parseInt(year)

    let students: any[] = []

    if (isDatabaseAvailable()) {
      students = await UserModel.findAll(filter)
    }

    if (search?.trim()) {
      const term = search.toLowerCase()
      students = students.filter((s: any) =>
        s.name?.toLowerCase().includes(term) ||
        s.email?.toLowerCase().includes(term) ||
        s.rollNumber?.toLowerCase().includes(term)
      )
    }

    const transformedStudents = students.map((student: any) => ({
      id: student._id,
      name: student.name,
      email: student.email,
      rollNumber: student.rollNumber,
      department: student.branch || 'Unknown',
      year: student.graduationYear || new Date().getFullYear(),
      collegeCode: student.collegeCode,
      totalProblems: student.aggregatedStats?.totalProblems || 0,
      githubContributions: student.aggregatedStats?.githubContributions || 0,
      contestsAttended: student.aggregatedStats?.contestsAttended || 0,
      currentRating: student.aggregatedStats?.currentRating || 0,
      activityLevel: student.aggregatedStats?.skillsAnalysis?.activityLevel || 'Low',
      overallRank: student.aggregatedStats?.skillsAnalysis?.overallRank || 'Beginner',
      primaryLanguages: student.aggregatedStats?.skillsAnalysis?.primaryLanguages || [],
      linkedPlatforms: Object.keys(student.linkedPlatforms || {}),
      platformCount: Object.keys(student.linkedPlatforms || {}).length,
      isOpenToWork: student.isOpenToWork || false,
      placementStatus: student.placementStatus || 'searching',
      lastStatsUpdate: student.lastStatsUpdate,
      createdAt: student.createdAt
    }))

    transformedStudents.sort((a: any, b: any) => {
      if (b.totalProblems !== a.totalProblems) return b.totalProblems - a.totalProblems
      return a.name.localeCompare(b.name)
    })

    return NextResponse.json({
      students: transformedStudents,
      total: transformedStudents.length,
      college: { name: collegeName, code: collegeCode }
    })
  } catch (error) {
    console.error("Get college students error:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}
