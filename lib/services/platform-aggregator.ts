import {
  fetchLeetCodeStats,
  fetchGitHubStats,
  fetchCodeforcesStats,
  fetchCodeChefStats,
  fetchHackerRankStats,
  fetchHackerEarthStats,
  fetchGeeksforGeeksStats,
  fetchAtCoderStats,
  fetchSPOJStats,
  fetchKattisStats,
  fetchInterviewBitStats,
  fetchCSESStats,
  fetchCodeStudioStats,
  fetchExercismStats,
  fetchKaggleStats,
  fetchUVaStats,
} from '@/lib/platforms'

export interface AggregatedStats {
  totalProblems: number
  githubContributions: number
  contestsAttended: number
  currentRating: number
  platformBreakdown: {
    leetcode: { problems: number; easy: number; medium: number; hard: number; rating: number; contributionPoints: number; reputation: number }
    github: { contributions: number; repositories: number; followers: number; following: number; languages: Record<string, number> }
    codeforces: { problems: number; rating: number; contests: number; maxRating: number; rank: string; contribution: number }
    codechef: { problems: number; rating: number; stars: string; highestRating: number; globalRank: number }
    hackerrank: { badges: number; certifications: number; skills: number; level: number; totalScore: number; globalRank: number }
  }
  skillsAnalysis: {
    primaryLanguages: string[]
    difficultyDistribution: { easy: number; medium: number; hard: number }
    activityLevel: 'Low' | 'Medium' | 'High' | 'Very High'
    overallRank: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  }
  lastUpdated: Date
}

// Fetcher map for all supported platforms
const FETCHERS: Record<string, (username: string) => Promise<any>> = {
  leetcode: fetchLeetCodeStats,
  github: fetchGitHubStats,
  codeforces: fetchCodeforcesStats,
  codechef: fetchCodeChefStats,
  hackerrank: fetchHackerRankStats,
  hackerearth: fetchHackerEarthStats,
  geeksforgeeks: fetchGeeksforGeeksStats,
  atcoder: fetchAtCoderStats,
  spoj: fetchSPOJStats,
  kattis: fetchKattisStats,
  interviewbit: fetchInterviewBitStats,
  cses: fetchCSESStats,
  codestudio: fetchCodeStudioStats,
  exercism: fetchExercismStats,
  kaggle: fetchKaggleStats,
  uva: fetchUVaStats,
}

/**
 * Get stats for a platform — use cached stats from DB first, fetch live if missing.
 */
async function getStats(platformId: string, username: string, cachedStats: any): Promise<any> {
  if (cachedStats && Object.keys(cachedStats).length > 1) {
    console.log(`Using cached stats for ${platformId}`)
    return cachedStats
  }
  const fetcher = FETCHERS[platformId.toLowerCase()]
  if (!fetcher) return null
  try {
    console.log(`Fetching live stats for ${platformId}`)
    return await fetcher(username)
  } catch (e) {
    console.error(`Failed to fetch ${platformId}:`, e)
    return null
  }
}

export class PlatformAggregator {
  /**
   * Aggregate stats from all linked platforms.
   * linkedPlatforms values can be a string (username) or an object { username, stats, ... }
   */
  static async aggregateUserStats(
    linkedPlatforms: Record<string, any>
  ): Promise<AggregatedStats> {
    const platformBreakdown = {
      leetcode: { problems: 0, easy: 0, medium: 0, hard: 0, rating: 0, contributionPoints: 0, reputation: 0 },
      github: { contributions: 0, repositories: 0, followers: 0, following: 0, languages: {} as Record<string, number> },
      codeforces: { problems: 0, rating: 0, contests: 0, maxRating: 0, rank: 'unrated', contribution: 0 },
      codechef: { problems: 0, rating: 0, stars: '1*', highestRating: 0, globalRank: 0 },
      hackerrank: { badges: 0, certifications: 0, skills: 0, level: 0, totalScore: 0, globalRank: 0 },
    }

    let totalProblems = 0
    let githubContributions = 0
    let contestsAttended = 0
    let currentRating = 0
    const primaryLanguages: string[] = []

    for (const [platformId, platformData] of Object.entries(linkedPlatforms)) {
      if (!platformData) continue
      const username = typeof platformData === 'string' ? platformData : platformData.username
      const cached = typeof platformData === 'object' ? platformData.stats : null
      if (!username) continue

      const stats = await getStats(platformId, username, cached)
      if (!stats) continue

      const pid = platformId.toLowerCase()

      if (pid === 'leetcode') {
        platformBreakdown.leetcode = {
          problems: stats.totalSolved || 0,
          easy: stats.easySolved || 0,
          medium: stats.mediumSolved || 0,
          hard: stats.hardSolved || 0,
          rating: stats.ranking || 0,
          contributionPoints: stats.contributionPoints || 0,
          reputation: stats.reputation || 0,
        }
        totalProblems += stats.totalSolved || 0

      } else if (pid === 'github') {
        platformBreakdown.github = {
          contributions: stats.totalContributions || 0,
          repositories: stats.publicRepos || 0,
          followers: stats.followers || 0,
          following: stats.following || 0,
          languages: stats.languages || {},
        }
        githubContributions = stats.totalContributions || 0
        const langs = Object.entries(stats.languages || {})
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 3)
          .map(([lang]) => lang)
        primaryLanguages.push(...langs)

      } else if (pid === 'codeforces') {
        platformBreakdown.codeforces = {
          problems: stats.problemsSolved || 0,
          rating: stats.rating || 0,
          contests: stats.contests?.length || 0,
          maxRating: stats.maxRating || stats.rating || 0,
          rank: stats.rank || 'unrated',
          contribution: stats.contribution || 0,
        }
        totalProblems += stats.problemsSolved || 0
        contestsAttended += stats.contests?.length || 0
        currentRating = Math.max(currentRating, stats.maxRating || stats.rating || 0)

      } else if (pid === 'codechef') {
        platformBreakdown.codechef = {
          problems: stats.problemsSolved || 0,
          rating: stats.currentRating || 0,
          stars: stats.stars || '1*',
          highestRating: stats.highestRating || stats.currentRating || 0,
          globalRank: stats.globalRank || 0,
        }
        totalProblems += stats.problemsSolved || 0
        currentRating = Math.max(currentRating, stats.highestRating || stats.currentRating || 0)

      } else if (pid === 'hackerrank') {
        platformBreakdown.hackerrank = {
          badges: stats.badges?.length || 0,
          certifications: stats.certifications?.length || 0,
          skills: stats.skills?.length || 0,
          level: stats.level || 0,
          totalScore: stats.totalScore || 0,
          globalRank: stats.globalRank || 0,
        }

      } else if (pid === 'geeksforgeeks') {
        totalProblems += stats.problemsSolved || 0

      } else if (pid === 'atcoder') {
        totalProblems += stats.problemsSolved || 0
        contestsAttended += stats.contests?.length || 0
        currentRating = Math.max(currentRating, stats.rating || 0)

      } else if (pid === 'hackerearth') {
        totalProblems += stats.problemsSolved || 0
        currentRating = Math.max(currentRating, stats.rating || 0)
        // _apiLimited means profile is verified but full stats aren't scrapable

      } else if (pid === 'interviewbit') {
        totalProblems += stats.problemsSolved || 0
        // _apiLimited means profile verified but stats couldn't be fully scraped

      } else if (pid === 'codestudio') {
        totalProblems += stats.problemsSolved || 0

      } else if (pid === 'cses') {
        totalProblems += stats.problemsSolved || 0

      } else if (pid === 'spoj') {
        totalProblems += stats.problemsSolved || 0

      } else if (pid === 'kattis') {
        totalProblems += stats.problemsSolved || 0

      } else if (pid === 'exercism') {
        totalProblems += stats.completedExercises || 0

      } else {
        // Generic fallback
        totalProblems += stats.totalSolved || stats.problemsSolved || 0
        currentRating = Math.max(currentRating, stats.rating || stats.currentRating || 0)
      }
    }

    const skillsAnalysis = this.calculateSkillsAnalysis(
      totalProblems, githubContributions, contestsAttended, currentRating,
      platformBreakdown, primaryLanguages
    )

    return {
      totalProblems,
      githubContributions,
      contestsAttended,
      currentRating,
      platformBreakdown,
      skillsAnalysis,
      lastUpdated: new Date(),
    }
  }

  private static calculateSkillsAnalysis(
    totalProblems: number,
    githubContributions: number,
    contestsAttended: number,
    currentRating: number,
    platformBreakdown: any,
    primaryLanguages: string[]
  ) {
    const difficultyDistribution = {
      easy: platformBreakdown.leetcode.easy,
      medium: platformBreakdown.leetcode.medium,
      hard: platformBreakdown.leetcode.hard,
    }

    const totalActivity = totalProblems + Math.floor(githubContributions / 10) + contestsAttended * 5
    let activityLevel: 'Low' | 'Medium' | 'High' | 'Very High'
    if (totalActivity < 50) activityLevel = 'Low'
    else if (totalActivity < 200) activityLevel = 'Medium'
    else if (totalActivity < 500) activityLevel = 'High'
    else activityLevel = 'Very High'

    let overallRank: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
    if (totalProblems < 50 && currentRating < 1200) overallRank = 'Beginner'
    else if (totalProblems < 200 && currentRating < 1600) overallRank = 'Intermediate'
    else if (totalProblems < 500 && currentRating < 2000) overallRank = 'Advanced'
    else overallRank = 'Expert'

    return {
      primaryLanguages: [...new Set(primaryLanguages)].slice(0, 5),
      difficultyDistribution,
      activityLevel,
      overallRank,
    }
  }

  static async updateUserAggregatedStats(userId: string, linkedPlatforms: Record<string, any>) {
    try {
      const aggregatedStats = await this.aggregateUserStats(linkedPlatforms)
      const { updateUser } = await import('@/lib/auth')
      await updateUser(userId, { aggregatedStats, lastStatsUpdate: new Date() })
      return aggregatedStats
    } catch (error) {
      console.error('Error updating aggregated stats:', error)
      throw error
    }
  }

  static calculateGlobalRanking(userStats: AggregatedStats, allUsersStats: AggregatedStats[]) {
    const score = (s: AggregatedStats) =>
      s.totalProblems * 2 + Math.floor(s.githubContributions / 10) + s.contestsAttended * 5 + Math.floor(s.currentRating / 100)

    const sorted = [...allUsersStats].sort((a, b) => score(b) - score(a))
    return {
      problemsRank: [...allUsersStats].sort((a, b) => b.totalProblems - a.totalProblems).findIndex(s => s === userStats) + 1,
      contributionsRank: [...allUsersStats].sort((a, b) => b.githubContributions - a.githubContributions).findIndex(s => s === userStats) + 1,
      contestsRank: [...allUsersStats].sort((a, b) => b.contestsAttended - a.contestsAttended).findIndex(s => s === userStats) + 1,
      ratingRank: [...allUsersStats].sort((a, b) => b.currentRating - a.currentRating).findIndex(s => s === userStats) + 1,
      overallRank: sorted.findIndex(s => s === userStats) + 1,
    }
  }
}
