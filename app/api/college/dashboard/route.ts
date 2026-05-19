import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { UserModel } from "@/lib/models/user"
import { isDatabaseAvailable } from "@/lib/database"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "college") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const college = user as any
    const collegeName = college.collegeName
    const collegeCode = college.collegeCode

    let students: any[] = []

    if (isDatabaseAvailable()) {
      students = await UserModel.findAll({ role: 'student', collegeCode })
    }

    const totalStudents = students.length
    const activeStudents = students.filter((s: any) =>
      s.linkedPlatforms && Object.keys(s.linkedPlatforms).length > 0
    ).length

    let totalProblems = 0, totalContributions = 0, totalContests = 0, totalRating = 0, studentsWithStats = 0
    const departmentStats: Record<string, any> = {}
    const topPerformers: any[] = []
    const placedStudents = students.filter((s: any) => s.placementStatus === 'placed').length
    const interviewingStudents = students.filter((s: any) => s.placementStatus === 'interviewing').length
    const searchingStudents = students.filter((s: any) => s.placementStatus === 'searching').length

    students.forEach((student: any) => {
      const dept = student.branch || 'Unknown'
      if (!departmentStats[dept]) {
        departmentStats[dept] = { name: dept, students: 0, totalProblems: 0, totalContributions: 0, totalRating: 0, placed: 0, interviewing: 0, searching: 0 }
      }
      departmentStats[dept].students++
      if (student.placementStatus === 'placed') departmentStats[dept].placed++
      else if (student.placementStatus === 'interviewing') departmentStats[dept].interviewing++
      else departmentStats[dept].searching++

      if (student.aggregatedStats) {
        const stats = student.aggregatedStats
        totalProblems += stats.totalProblems || 0
        totalContributions += stats.githubContributions || 0
        totalContests += stats.contestsAttended || 0
        totalRating += stats.currentRating || 0
        studentsWithStats++
        departmentStats[dept].totalProblems += stats.totalProblems || 0
        departmentStats[dept].totalContributions += stats.githubContributions || 0
        departmentStats[dept].totalRating += stats.currentRating || 0
        topPerformers.push({
          id: student._id, name: student.name, email: student.email,
          rollNumber: student.rollNumber || 'N/A', branch: student.branch || 'Unknown',
          totalProblems: stats.totalProblems || 0, githubContributions: stats.githubContributions || 0,
          contestsAttended: stats.contestsAttended || 0, currentRating: stats.currentRating || 0,
          overallRank: stats.skillsAnalysis?.overallRank || 'Beginner',
          activityLevel: stats.skillsAnalysis?.activityLevel || 'Low',
          placementStatus: student.placementStatus || 'searching'
        })
      }
    })

    Object.keys(departmentStats).forEach(dept => {
      const s = departmentStats[dept]
      s.avgProblems = s.students > 0 ? Math.round(s.totalProblems / s.students) : 0
      s.avgContributions = s.students > 0 ? Math.round(s.totalContributions / s.students) : 0
      s.avgRating = s.students > 0 ? Math.round(s.totalRating / s.students) : 0
      s.placementRate = s.students > 0 ? Math.round((s.placed / s.students) * 100) : 0
    })

    topPerformers.sort((a, b) => {
      const scoreA = (a.totalProblems * 2) + Math.floor(a.githubContributions / 10) + (a.contestsAttended * 5)
      const scoreB = (b.totalProblems * 2) + Math.floor(b.githubContributions / 10) + (b.contestsAttended * 5)
      return scoreB - scoreA
    })

    return NextResponse.json({
      college: { name: collegeName, code: collegeCode, location: college.location },
      overview: {
        totalStudents, activeStudents,
        registrationRate: totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0,
        avgProblems: studentsWithStats > 0 ? Math.round(totalProblems / studentsWithStats) : 0,
        avgContributions: studentsWithStats > 0 ? Math.round(totalContributions / studentsWithStats) : 0,
        avgRating: studentsWithStats > 0 ? Math.round(totalRating / studentsWithStats) : 0,
        placementRate: totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0
      },
      placement: {
        total: totalStudents, placed: placedStudents, interviewing: interviewingStudents, searching: searchingStudents,
        placementRate: totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0
      },
      departments: Object.values(departmentStats),
      topPerformers: topPerformers.slice(0, 10),
      recentActivity: [],
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error("Get college dashboard error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
