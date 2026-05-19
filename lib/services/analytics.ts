import { UserModel } from '@/lib/models/user'
import { getDatabase } from '@/lib/database'
import { PlatformAggregator, type AggregatedStats } from '@/lib/services/platform-aggregator'
import type { StudentProfile, CollegeProfile } from '@/lib/types'

export interface EnhancedStudentAnalytics {
  totalStudents: number
  activeStudents: number
  aggregatedStats: {
    totalProblems: number
    totalContributions: number
    totalContests: number
    averageRating: number
  }
  topPerformers: Array<{
    name: string
    email: string
    totalProblems: number
    githubContributions: number
    contestsAttended: number
    currentRating: number
    overallRank: string
  }>
  platformDistribution: Record<string, number>
  skillsDistribution: Record<string, number>
  departmentStats: Record<string, {
    students: number
    averageProblems: number
    averageContributions: number
    averageRating: number
    topLanguages: string[]
  }>
  activityLevels: Record<string, number>
  difficultyDistribution: {
    easy: number
    medium: number
    hard: number
  }
}

export interface RecruiterAnalytics {
  totalCandidates: number
  matchedCandidates: number
  averageSkillMatch: number
  topSkills: Array<{
    skill: string
    count: number
  }>
  collegeDistribution: Record<string, number>
  experienceDistribution: Record<string, number>
}

export class AnalyticsService {
  static async getEnhancedStudentAnalytics(collegeId?: string): Promise<EnhancedStudentAnalytics> {
    const db = await getDatabase()
    
    // Build filter for college-specific analytics
    const filter: any = { role: 'student' }
    if (collegeId) {
      const college = await UserModel.findById(collegeId)
      if (college && college.role === 'college') {
        filter.collegeCode = (college as any).collegeCode
      }
    }

    const students = await UserModel.findAll(filter)
    
    const totalStudents = students.length
    const activeStudents = students.filter((s: any) => 
      s.linkedPlatforms && Object.keys(s.linkedPlatforms).length > 0
    ).length

    // Calculate aggregated stats
    let totalProblems = 0
    let totalContributions = 0
    let totalContests = 0
    let totalRating = 0
    let studentsWithStats = 0

    const activityLevels: Record<string, number> = {
      'Low': 0,
      'Medium': 0,
      'High': 0,
      'Very High': 0
    }

    const difficultyDistribution = {
      easy: 0,
      medium: 0,
      hard: 0
    }

    // Top performers with enhanced metrics
    const topPerformers = students
      .filter((s: any) => s.aggregatedStats)
      .sort((a: any, b: any) => {
        const scoreA = (a.aggregatedStats?.totalProblems || 0) * 2 + 
                      Math.floor((a.aggregatedStats?.githubContributions || 0) / 10) + 
                      (a.aggregatedStats?.contestsAttended || 0) * 5
        const scoreB = (b.aggregatedStats?.totalProblems || 0) * 2 + 
                      Math.floor((b.aggregatedStats?.githubContributions || 0) / 10) + 
                      (b.aggregatedStats?.contestsAttended || 0) * 5
        return scoreB - scoreA
      })
      .slice(0, 10)
      .map((s: any) => ({
        name: s.name,
        email: s.email,
        totalProblems: s.aggregatedStats?.totalProblems || 0,
        githubContributions: s.aggregatedStats?.githubContributions || 0,
        contestsAttended: s.aggregatedStats?.contestsAttended || 0,
        currentRating: s.aggregatedStats?.currentRating || 0,
        overallRank: s.aggregatedStats?.skillsAnalysis?.overallRank || 'Beginner'
      }))

    // Aggregate all student stats
    students.forEach((s: any) => {
      if (s.aggregatedStats) {
        totalProblems += s.aggregatedStats.totalProblems || 0
        totalContributions += s.aggregatedStats.githubContributions || 0
        totalContests += s.aggregatedStats.contestsAttended || 0
        totalRating += s.aggregatedStats.currentRating || 0
        studentsWithStats++

        // Activity levels
        const activityLevel = s.aggregatedStats.skillsAnalysis?.activityLevel || 'Low'
        activityLevels[activityLevel]++

        // Difficulty distribution
        if (s.aggregatedStats.skillsAnalysis?.difficultyDistribution) {
          const diff = s.aggregatedStats.skillsAnalysis.difficultyDistribution
          difficultyDistribution.easy += diff.easy || 0
          difficultyDistribution.medium += diff.medium || 0
          difficultyDistribution.hard += diff.hard || 0
        }
      }
    })

    // Platform distribution
    const platformDistribution: Record<string, number> = {}
    students.forEach((s: any) => {
      if (s.linkedPlatforms) {
        Object.keys(s.linkedPlatforms).forEach(platform => {
          platformDistribution[platform] = (platformDistribution[platform] || 0) + 1
        })
      }
    })

    // Skills distribution (enhanced with languages from GitHub)
    const skillsDistribution: Record<string, number> = {}
    students.forEach((s: any) => {
      // Traditional skills
      if (s.skills) {
        s.skills.forEach((skill: string) => {
          skillsDistribution[skill] = (skillsDistribution[skill] || 0) + 1
        })
      }
      
      // Programming languages from aggregated stats
      if (s.aggregatedStats?.skillsAnalysis?.primaryLanguages) {
        s.aggregatedStats.skillsAnalysis.primaryLanguages.forEach((lang: string) => {
          skillsDistribution[lang] = (skillsDistribution[lang] || 0) + 1
        })
      }
    })

    // Enhanced department stats
    const departmentStats: Record<string, any> = {}
    students.forEach((s: any) => {
      const dept = s.branch || 'Unknown'
      if (!departmentStats[dept]) {
        departmentStats[dept] = {
          students: 0,
          totalProblems: 0,
          totalContributions: 0,
          totalRating: 0,
          languages: {} as Record<string, number>
        }
      }
      
      departmentStats[dept].students++
      
      if (s.aggregatedStats) {
        departmentStats[dept].totalProblems += s.aggregatedStats.totalProblems || 0
        departmentStats[dept].totalContributions += s.aggregatedStats.githubContributions || 0
        departmentStats[dept].totalRating += s.aggregatedStats.currentRating || 0
        
        // Track languages per department
        if (s.aggregatedStats.skillsAnalysis?.primaryLanguages) {
          s.aggregatedStats.skillsAnalysis.primaryLanguages.forEach((lang: string) => {
            departmentStats[dept].languages[lang] = (departmentStats[dept].languages[lang] || 0) + 1
          })
        }
      }
    })

    // Calculate averages and top languages per department
    Object.keys(departmentStats).forEach(dept => {
      const stats = departmentStats[dept]
      stats.averageProblems = Math.round(stats.totalProblems / stats.students)
      stats.averageContributions = Math.round(stats.totalContributions / stats.students)
      stats.averageRating = Math.round(stats.totalRating / stats.students)
      
      // Top 3 languages for this department
      stats.topLanguages = Object.entries(stats.languages)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 3)
        .map(([lang]) => lang)
      
      delete stats.totalProblems
      delete stats.totalContributions
      delete stats.totalRating
      delete stats.languages
    })

    return {
      totalStudents,
      activeStudents,
      aggregatedStats: {
        totalProblems,
        totalContributions,
        totalContests,
        averageRating: studentsWithStats > 0 ? Math.round(totalRating / studentsWithStats) : 0
      },
      topPerformers,
      platformDistribution,
      skillsDistribution,
      departmentStats,
      activityLevels,
      difficultyDistribution
    }
  }

  static async getRecruiterAnalytics(): Promise<RecruiterAnalytics> {
    const students = await UserModel.findByRole('student')
    
    const totalCandidates = students.length
    const matchedCandidates = students.filter((s: any) => s.isOpenToWork).length

    // Top skills
    const skillCounts: Record<string, number> = {}
    students.forEach((s: any) => {
      if (s.skills) {
        s.skills.forEach((skill: string) => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1
        })
      }
    })

    const topSkills = Object.entries(skillCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([skill, count]) => ({ skill, count }))

    // College distribution
    const collegeDistribution: Record<string, number> = {}
    students.forEach((s: any) => {
      const college = s.collegeName || 'Unknown'
      collegeDistribution[college] = (collegeDistribution[college] || 0) + 1
    })

    // Experience distribution (based on graduation year)
    const currentYear = new Date().getFullYear()
    const experienceDistribution: Record<string, number> = {}
    students.forEach((s: any) => {
      const gradYear = s.graduationYear || currentYear
      let experience: string
      
      if (gradYear > currentYear) {
        experience = 'Student'
      } else if (gradYear === currentYear) {
        experience = 'Fresh Graduate'
      } else if (currentYear - gradYear <= 2) {
        experience = '0-2 years'
      } else if (currentYear - gradYear <= 5) {
        experience = '2-5 years'
      } else {
        experience = '5+ years'
      }
      
      experienceDistribution[experience] = (experienceDistribution[experience] || 0) + 1
    })

    return {
      totalCandidates,
      matchedCandidates,
      averageSkillMatch: 0, // Would need job matching algorithm
      topSkills,
      collegeDistribution,
      experienceDistribution
    }
  }

  static async getPersonalAnalytics(userId: string): Promise<any> {
    // Load demo student from MongoDB
    let student: any = null
    try {
      const { getDemoStudent, DEMO_STUDENT_ID } = await import('@/lib/demo-db')
      if (userId === DEMO_STUDENT_ID) {
        student = await getDemoStudent()
      }
    } catch {}

    if (!student) {
      const user = await UserModel.findById(userId)
      if (!user || user.role !== 'student') {
        throw new Error('User not found or not a student')
      }
      student = user
    }

    const linkedPlatforms: Record<string, any> = student.linkedPlatforms || {}
    const connectedIds = Object.keys(linkedPlatforms).filter(k => linkedPlatforms[k])

    if (connectedIds.length === 0) {
      return {
        hasStats: false,
        message: 'Connect platforms and sync stats to see detailed analytics',
        linkedPlatforms: [],
        totalPlatforms: 0,
      }
    }

    // Derive aggregated stats from raw linkedPlatforms data
    let totalProblems = 0
    let githubContributions = 0
    let contestsAttended = 0
    let currentRating = 0
    let easyProblems = 0
    let mediumProblems = 0
    let hardProblems = 0

    const platformStats: any[] = []
    let hasAnySyncedStats = false

    for (const platformId of connectedIds) {
      const data = linkedPlatforms[platformId]
      if (!data) continue
      const stats = (typeof data === 'object' && 'stats' in data) ? data.stats : null
      const username = typeof data === 'object' ? data.username : data

      if (stats) {
        hasAnySyncedStats = true

        const solved = stats.totalSolved || stats.problemsSolved || 0
        totalProblems += solved

        if (platformId === 'github') {
          githubContributions = stats.totalContributions || 0
        }

        if (platformId === 'leetcode') {
          easyProblems += stats.easySolved || 0
          mediumProblems += stats.mediumSolved || 0
          hardProblems += stats.hardSolved || 0
        }

        const rating = stats.rating || stats.currentRating || stats.contestRating || stats.codingScore || 0
        if (rating > currentRating) currentRating = rating

        const contests = stats.contests?.length || stats.contestsParticipated || stats.attendedContestsCount || 0
        contestsAttended += contests

        platformStats.push({
          platform: platformId.charAt(0).toUpperCase() + platformId.slice(1),
          platformId,
          username,
          problems: solved,
          contributions: platformId === 'github' ? (stats.totalContributions || 0) : 0,
          rating,
          contests,
          connected: true,
        })
      } else {
        // Platform connected but not yet synced — include with zeros
        platformStats.push({
          platform: platformId.charAt(0).toUpperCase() + platformId.slice(1),
          platformId,
          username,
          problems: 0,
          contributions: 0,
          rating: 0,
          contests: 0,
          connected: true,
          notSynced: true,
        })
      }
    }

    if (!hasAnySyncedStats) {
      return {
        hasStats: false,
        message: 'Platforms connected but not yet synced. Click "Sync & Load" to fetch your stats.',
        linkedPlatforms: connectedIds,
        totalPlatforms: connectedIds.length,
      }
    }

    // Simulated progress curve based on total problems
    const progressData = [
      { month: 'Jan', problems: Math.floor(totalProblems * 0.1) },
      { month: 'Feb', problems: Math.floor(totalProblems * 0.2) },
      { month: 'Mar', problems: Math.floor(totalProblems * 0.4) },
      { month: 'Apr', problems: Math.floor(totalProblems * 0.6) },
      { month: 'May', problems: Math.floor(totalProblems * 0.8) },
      { month: 'Jun', problems: totalProblems },
    ]

    // Activity level
    const totalActivity = totalProblems + Math.floor(githubContributions / 10) + contestsAttended * 5
    const activityLevel =
      totalActivity < 50 ? 'Low' :
      totalActivity < 200 ? 'Medium' :
      totalActivity < 500 ? 'High' : 'Very High'

    // Overall rank
    const overallRank =
      totalProblems < 50 && currentRating < 1200 ? 'Beginner' :
      totalProblems < 200 && currentRating < 1600 ? 'Intermediate' :
      totalProblems < 500 && currentRating < 2000 ? 'Advanced' : 'Expert'

    const skillsAnalysis = {
      primaryLanguages: [] as string[],
      difficultyDistribution: { easy: easyProblems, medium: mediumProblems, hard: hardProblems },
      activityLevel,
      overallRank,
    }

    // Achievements
    const achievements: string[] = []
    if (totalProblems >= 100) achievements.push('Century Solver')
    if (totalProblems >= 500) achievements.push('Problem Master')
    if (githubContributions >= 365) achievements.push('Daily Contributor')
    if (contestsAttended >= 10) achievements.push('Contest Warrior')
    if (currentRating >= 1500) achievements.push('Rated Coder')
    if (overallRank === 'Expert') achievements.push('Expert Level')

    return {
      hasStats: true,
      aggregatedStats: {
        totalProblems,
        githubContributions,
        contestsAttended,
        currentRating,
        lastUpdated: student.updatedAt || new Date(),
      },
      skillsAnalysis,
      progressData,
      platformStats,
      achievements,
      ranking: { overallRank: 1, problemsRank: 1, contributionsRank: 1, contestsRank: 1, ratingRank: 1 },
      linkedPlatforms: connectedIds,
      isOpenToWork: student.isOpenToWork,
    }
  }
}