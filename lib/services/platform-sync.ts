import { UserModel } from '@/lib/models/user'
import { aggregateStudentStats } from '@/lib/services/stats-aggregator'
import { fetchLeetCodeStats } from '@/lib/platforms/leetcode'
import { fetchGitHubStats } from '@/lib/platforms/github'
import { fetchCodeChefStats } from '@/lib/platforms/codechef'
import { fetchCodeforcesStats } from '@/lib/platforms/codeforces'
import { fetchHackerRankStats } from '@/lib/platforms/hackerrank'
import { fetchHackerEarthStats } from '@/lib/platforms/hackerearth'
import { fetchGeeksforGeeksStats } from '@/lib/platforms/geeksforgeeks'
import { fetchAtCoderStats } from '@/lib/platforms/atcoder'
import { fetchSPOJStats } from '@/lib/platforms/spoj'
import { fetchKattisStats } from '@/lib/platforms/kattis'
import { fetchTopCoderStats } from '@/lib/platforms/topcoder'
import { fetchInterviewBitStats } from '@/lib/platforms/interviewbit'
import { fetchCSESStats } from '@/lib/platforms/cses'
import { fetchCodeStudioStats } from '@/lib/platforms/codestudio'
import { fetchExercismStats } from '@/lib/platforms/exercism'
import { fetchKaggleStats } from '@/lib/platforms/kaggle'
import { fetchUVaStats } from '@/lib/platforms/uva'
import { fetchGenericPlatformStats } from '@/lib/platforms/generic'
import type { StudentProfile } from '@/lib/types'

export interface PlatformSyncResult {
  platform: string
  success: boolean
  data?: any
  error?: string
}

export interface ActivityEvent {
  platform: string
  username: string
  type: 'problem_solved' | 'contest' | 'contribution' | 'rating_change' | 'platform_connected'
  title: string
  detail: string
  timestamp: Date
}

function generateActivityEvents(platformId: string, username: string, stats: any): ActivityEvent[] {
  const now = new Date()
  const events: ActivityEvent[] = []
  const name = platformId.charAt(0).toUpperCase() + platformId.slice(1)

  if (platformId === 'leetcode') {
    const total = stats.totalSolved || 0
    if (total > 0) events.push({ platform: platformId, username, type: 'problem_solved', title: `${total} problems solved on LeetCode`, detail: `Easy: ${stats.easySolved || 0} · Medium: ${stats.mediumSolved || 0} · Hard: ${stats.hardSolved || 0}`, timestamp: now })
  } else if (platformId === 'codeforces') {
    // Use real recent submissions
    const subs: any[] = stats.submissions || []
    const accepted = subs.filter((s: any) => s.verdict === 'OK').slice(0, 3)
    accepted.forEach((s: any) => {
      events.push({ platform: platformId, username, type: 'problem_solved', title: `Solved "${s.problem?.name || 'a problem'}" on Codeforces`, detail: `Rating: ${s.problem?.rating || 'unrated'} · ${s.language || ''}`, timestamp: new Date((s.creationTimeSeconds || Date.now() / 1000) * 1000) })
    })
    // Most recent contest
    const contests: any[] = stats.contests || []
    if (contests.length > 0) {
      const c = contests[0]
      events.push({ platform: platformId, username, type: 'contest', title: `Participated in "${c.contestName}"`, detail: `Rank: ${c.rank} · Rating: ${c.oldRating} → ${c.newRating} (${c.ratingChange >= 0 ? '+' : ''}${c.ratingChange})`, timestamp: now })
    }
    if (stats.rating) events.push({ platform: platformId, username, type: 'rating_change', title: `Codeforces rating: ${stats.rating}`, detail: `Max rating: ${stats.maxRating || stats.rating} · Rank: ${stats.rank || 'unrated'}`, timestamp: now })
  } else if (platformId === 'github') {
    if (stats.totalContributions > 0) events.push({ platform: platformId, username, type: 'contribution', title: `${stats.totalContributions} contributions on GitHub`, detail: `${stats.publicRepos || 0} public repos · ${stats.followers || 0} followers`, timestamp: now })
    else if (stats.publicRepos > 0) events.push({ platform: platformId, username, type: 'contribution', title: `${stats.publicRepos} repositories on GitHub`, detail: `${stats.followers || 0} followers`, timestamp: now })
  } else if (platformId === 'codechef') {
    if (stats.currentRating) events.push({ platform: platformId, username, type: 'rating_change', title: `CodeChef rating: ${stats.currentRating} ${stats.stars || ''}`, detail: `Highest: ${stats.highestRating || stats.currentRating} · ${stats.problemsSolved || 0} problems solved`, timestamp: now })
  } else if (platformId === 'hackerrank') {
    const badges = stats.badges?.length || 0
    if (badges > 0) events.push({ platform: platformId, username, type: 'problem_solved', title: `${badges} badges earned on HackerRank`, detail: `${stats.certifications?.length || 0} certifications`, timestamp: now })
  } else if (platformId === 'geeksforgeeks') {
    const solved = stats.problemsSolved || stats.stats?.problemsSolved || 0
    const score = stats.codingScore || stats.score || 0
    if (solved > 0 || score > 0) events.push({ platform: platformId, username, type: 'problem_solved', title: `${solved} problems solved on GeeksforGeeks`, detail: `Coding score: ${score}`, timestamp: now })
  } else {
    const solved = stats.totalSolved || stats.problemsSolved || 0
    const rating = stats.rating || stats.currentRating || 0
    if (solved > 0) events.push({ platform: platformId, username, type: 'problem_solved', title: `${solved} problems solved on ${name}`, detail: rating > 0 ? `Rating: ${rating}` : '', timestamp: now })
    else if (rating > 0) events.push({ platform: platformId, username, type: 'rating_change', title: `${name} rating: ${rating}`, detail: '', timestamp: now })
  }

  return events
}

export class PlatformSyncService {
  static async syncUserPlatforms(userId: string): Promise<PlatformSyncResult[]> {
    const user = await UserModel.findById(userId)
    if (!user || user.role !== 'student') {
      throw new Error('User not found or not a student')
    }

    const student = user as any // Use any to avoid type issues
    const results: PlatformSyncResult[] = []

    // Initialize linkedPlatforms if it doesn't exist
    if (!student.linkedPlatforms) {
      await UserModel.update(userId, { linkedPlatforms: {} })
      student.linkedPlatforms = {}
    }

    // Initialize stats if it doesn't exist
    if (!student.stats) {
      await UserModel.update(userId, { 
        stats: {
          totalProblems: 0,
          easyProblems: 0,
          mediumProblems: 0,
          hardProblems: 0,
          githubContributions: 0,
          contestsParticipated: 0,
          rating: 0
        }
      })
    }

    // Define predefined platforms with their fetch functions
    const predefinedPlatforms = {
      leetcode: fetchLeetCodeStats,
      codeforces: fetchCodeforcesStats,
      github: fetchGitHubStats,
      codechef: fetchCodeChefStats,
      hackerrank: fetchHackerRankStats,
      hackerearth: fetchHackerEarthStats,
      geeksforgeeks: fetchGeeksforGeeksStats,
      atcoder: fetchAtCoderStats,
      spoj: fetchSPOJStats,
      kattis: fetchKattisStats,
      topcoder: fetchTopCoderStats,
      interviewbit: fetchInterviewBitStats,
      cses: fetchCSESStats,
      codestudio: fetchCodeStudioStats,
      exercism: fetchExercismStats,
      kaggle: fetchKaggleStats,
      uva: fetchUVaStats
    }

    // Sync all linked platforms (both predefined and custom)
    for (const [platformId, platformData] of Object.entries(student.linkedPlatforms || {})) {
      const pd = platformData as any
      if (!pd?.username) continue

      try {
        let stats = null
        
        console.log(`\n=== SYNCING PLATFORM: ${platformId} ===`)
        console.log('Platform data:', pd)
        console.log('Username:', pd.username)
        
        // Check if it's a predefined platform (including GeeksforGeeks)
        const platformKey = platformId.toLowerCase()
        const isGeeksforGeeks = platformKey === 'geeksforgeeks' || platformKey.includes('geek')
        
        if (predefinedPlatforms[platformKey as keyof typeof predefinedPlatforms] || isGeeksforGeeks) {
          console.log(`Using predefined fetcher for: ${platformId}`)
          let fetchFunction
          
          if (isGeeksforGeeks) {
            fetchFunction = predefinedPlatforms['geeksforgeeks']
            console.log('Forcing GeeksforGeeks to use specific fetcher')
          } else {
            fetchFunction = predefinedPlatforms[platformKey as keyof typeof predefinedPlatforms]
          }
          
          stats = await fetchFunction(pd.username)
          console.log(`Predefined platform ${platformId} stats:`, stats)
        } else {
          console.log(`Syncing custom platform: ${platformId}`)
          stats = await fetchGenericPlatformStats(platformId, pd.username, pd.platformUrl)
          console.log(`Custom platform ${platformId} stats:`, stats)
        }

        if (stats) {
          const newEvents = generateActivityEvents(platformId, pd.username, stats)

          // Successfully fetched real stats - update in database
          await UserModel.update(userId, {
            [`linkedPlatforms.${platformId}.lastSync`]: new Date(),
            [`linkedPlatforms.${platformId}.stats`]: stats
          })

          // Prepend new events to recentActivity array (keep last 20)
          if (newEvents.length > 0) {
            const existing = (student.recentActivity || []) as any[]
            const merged = [...newEvents, ...existing.filter((e: any) => e.platform !== platformId)]
            await UserModel.update(userId, { recentActivity: merged.slice(0, 20) })
          }

          results.push({ platform: platformId, success: true, data: stats })
          console.log(`✅ Successfully synced ${platformId} with real stats`)
        } else {
          // Platform fetcher returned null (profile not found or error)
          // Clear any cached fake data and mark as failed
          console.log(`❌ Failed to fetch real stats for ${platformId} - clearing cached data`)
          
          await UserModel.update(userId, {
            [`linkedPlatforms.${platformId}.lastSync`]: new Date(),
            [`linkedPlatforms.${platformId}.stats`]: null // Clear cached fake data
          })
          
          results.push({ 
            platform: platformId, 
            success: false, 
            error: 'Profile not found or unable to fetch real stats' 
          })
        }
      } catch (error: any) {
        console.error(`Error syncing ${platformId}:`, error)
        results.push({ platform: platformId, success: false, error: error.message })
      }
    }

    // ── Aggregate all platform stats into user.stats ──────────────────────
    try {
      await aggregateStudentStats(userId)
      console.log(`✅ Aggregated stats for user ${userId}`)
    } catch (aggError) {
      console.error('Failed to aggregate stats:', aggError)
    }

    return results
  }

  static async linkPlatform(userId: string, platform: string, username: string, platformUrl?: string): Promise<boolean> {
    try {
      const updateData: Record<string, any> = {}
      updateData[`linkedPlatforms.${platform}`] = {
        username,
        linkedAt: new Date(),
        isActive: true,
        platformUrl: platformUrl // Store platform URL for custom platforms
      }

      await UserModel.update(userId, updateData)
      
      // Immediately sync the new platform
      await this.syncUserPlatforms(userId)
      
      return true
    } catch (error) {
      console.error('Error linking platform:', error)
      return false
    }
  }

  static async unlinkPlatform(userId: string, platform: string): Promise<boolean> {
    try {
      const updateData: Record<string, any> = {}
      updateData[`linkedPlatforms.${platform}`] = null

      await UserModel.update(userId, updateData)
      return true
    } catch (error) {
      console.error('Error unlinking platform:', error)
      return false
    }
  }

  static async scheduleSync(userId: string): Promise<void> {
    // This would integrate with a job queue system like Bull or Agenda
    // For now, we'll just sync immediately
    await this.syncUserPlatforms(userId)
  }
}