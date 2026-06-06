"use client"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import type { StudentProfile } from "@/lib/types"
import { AddPlatformDialog } from "@/components/student/add-platform-dialog"
import { DashboardHero } from "@/components/student/dashboard-hero"

import { 
  Code, 
  GitBranch, 
  Trophy, 
  Star,
  ExternalLink,
  TrendingUp,
  Activity,
  Check,
  Trash2,
  Globe
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface DashboardClientProps {
  student: StudentProfile
}

export function DashboardClient({ student: initialStudent }: DashboardClientProps) {
  const [student, setStudent] = useState(initialStudent)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isAutoSyncing, setIsAutoSyncing] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const router = useRouter()

  // Ensure hydration is complete before rendering dynamic content
  useEffect(() => {
    setIsHydrated(true)
    // Fetch recent activity from API
    fetch('/api/student/activity').then(r => r.ok ? r.json() : { activity: [] }).then(d => setRecentActivity(d.activity || []))
  }, [])

  // Auto-sync on component mount (page load/refresh)
  useEffect(() => {
    const autoSyncStats = async () => {
      const linkedPlatforms = initialStudent.linkedPlatforms || {}
      const hasLinkedPlatforms = Object.keys(linkedPlatforms).length > 0
      
      if (!hasLinkedPlatforms) {
        return // No platforms to sync
      }

      // Check if stats are stale (older than 5 minutes)
      const shouldSync = Object.entries(linkedPlatforms).some(([platform, data]) => {
        if (!data || typeof data !== 'object' || !('lastSync' in data)) {
          return true // No lastSync data, should sync
        }
        
        const lastSync = data.lastSync ? new Date(data.lastSync) : null
        if (!lastSync) {
          return true // No lastSync, should sync
        }
        
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
        return lastSync < fiveMinutesAgo // Sync if older than 5 minutes
      })

      if (!shouldSync) {
        console.log('Stats are fresh, skipping auto-sync')
        return
      }

      setIsAutoSyncing(true)
      
      try {
        console.log('Auto-syncing platform stats on page load...')
        
        const syncResponse = await fetch('/api/platforms/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
        
        if (syncResponse.ok) {
          const syncData = await syncResponse.json()
          console.log('Auto-sync completed successfully:', syncData)
          
          // Fetch fresh user data after auto-sync
          const userResponse = await fetch('/api/auth/user', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            cache: 'no-store'
          })
          
          if (userResponse.ok) {
            const userData = await userResponse.json()
            if (userData.user) {
              const freshPlatforms = userData.user.linkedPlatforms || {}
              // Only update if the fresh data has platforms (don't wipe existing state)
              if (Object.keys(freshPlatforms).length > 0) {
                console.log('Updated user data after auto-sync:', userData.user)
                setStudent(userData.user)
                // Refresh activity feed
                fetch('/api/student/activity').then(r => r.ok ? r.json() : { activity: [] }).then(d => setRecentActivity(d.activity || []))
              }
            }
          }
        } else {
          console.log('Auto-sync failed, using cached data')
        }
      } catch (error) {
        console.error('Error during auto-sync:', error)
        // Continue with cached data if auto-sync fails
      } finally {
        setIsAutoSyncing(false)
      }
    }

    // Run auto-sync after a short delay to allow page to load
    const timeoutId = setTimeout(autoSyncStats, 1000)
    
    return () => clearTimeout(timeoutId)
  }, [initialStudent]) // Only run on initial mount

  const handlePlatformAdded = useCallback(async () => {
    setIsUpdating(true)
    
    try {
      // Small delay to ensure database is updated
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // First, trigger platform sync to fetch stats for newly added platforms
      console.log('Triggering platform sync after platform addition...')
      const syncResponse = await fetch('/api/platforms/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
      
      if (syncResponse.ok) {
        const syncData = await syncResponse.json()
        console.log('Platform sync completed successfully:', syncData)
        toast.success('Platform connected successfully!')
      } else {
        toast.success('Platform connected! Stats will be available shortly.')
      }
      
      // Then fetch fresh user data
      console.log('Fetching fresh user data...')
      const response = await fetch('/api/auth/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-store' // Ensure fresh data
      })
      
      if (response.ok) {
        const userData = await response.json()
        if (userData.user) {
          console.log('Updated user data after platform addition:', userData.user)
          setStudent(userData.user)
        }
      } else {
        console.error('Failed to fetch updated user data')
        // Fallback to page refresh if API fails
        router.refresh()
      }
    } catch (error) {
      console.error('Error in handlePlatformAdded:', error)
      toast.error('Platform connected but failed to update dashboard. Please refresh the page.')
      // Fallback to page refresh if everything fails
      router.refresh()
    } finally {
      setIsUpdating(false)
    }
  }, [router])

  const handleUnlinkPlatform = useCallback(async (platformId: string, platformName: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch("/api/platforms/link", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform: platformId,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success(`Successfully unlinked ${platformName}!`)
        
        // Small delay to ensure database is updated
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Fetch fresh user data after unlinking
        try {
          const userResponse = await fetch('/api/auth/user', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            cache: 'no-store' // Ensure fresh data
          })
          
          if (userResponse.ok) {
            const userData = await userResponse.json()
            if (userData.user) {
              console.log('Updated user data after unlink:', userData.user)
              setStudent(userData.user)
            }
          }
        } catch (error) {
          console.error('Error fetching updated user data:', error)
          // Fallback to page refresh if API fails
          router.refresh()
        }
      } else {
        toast.error(data.error || "Failed to unlink platform")
      }
    } catch (error) {
      console.error("Unlink error:", error)
      toast.error("Failed to unlink platform. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }, [router])

  const linkedPlatforms = student.linkedPlatforms || {}
  const hasLinkedPlatforms = Object.keys(linkedPlatforms).length > 0

  // Debug: Log the linkedPlatforms structure
  console.log("LinkedPlatforms structure:", linkedPlatforms)

  // Calculate aggregated stats from linked platforms
  const calculateStats = () => {
    let totalProblems = 0
    let githubRepositories = 0
    let highestRating = 0
    let contestsFromHighestRatedPlatform = 0
    let highestRatedPlatform: string | null = null

    console.log('=== DEBUGGING RATING CALCULATION ===')
    console.log('linkedPlatforms:', linkedPlatforms)

    // First pass: Find the platform with highest rating
    Object.entries(linkedPlatforms).forEach(([platform, data]) => {
      console.log(`\n--- Platform: ${platform} ---`)
      console.log('Raw data:', data)
      
      // Skip null or undefined data
      if (!data) {
        console.log('Skipping - no data')
        return
      }
      
      // Handle both object and string data structures
      const stats = (typeof data === 'object' && 'stats' in data) ? data.stats : null
      console.log('Extracted stats:', stats)
      
      if (stats) {
        // Find highest rating - check ALL possible rating/score fields
        console.log('Checking ratings/scores:')
        console.log('  stats.rating:', stats.rating, typeof stats.rating)
        console.log('  stats.currentRating:', stats.currentRating, typeof stats.currentRating)
        console.log('  stats.highestRating:', stats.highestRating, typeof stats.highestRating)
        console.log('  stats.maxRating:', stats.maxRating, typeof stats.maxRating)
        console.log('  stats.totalScore:', stats.totalScore, typeof stats.totalScore)
        console.log('  stats.contestRating:', stats.contestRating, typeof stats.contestRating)

        const ratingsAndScores = [
          stats.rating,           // Codeforces, HackerEarth
          stats.currentRating,    // CodeChef
          stats.highestRating,    // CodeChef, any platform with highest rating
          stats.maxRating,        // Any platform with max rating
          stats.totalScore,       // HackerRank uses totalScore instead of rating
          stats.contestRating,    // LeetCode contest rating
          stats.codingScore,      // GeeksforGeeks coding score
        ]

        console.log('All ratings/scores array:', ratingsAndScores)

        // Find the highest rating from this platform
        const validRatings = ratingsAndScores.filter(rating => {
          const numRating = Number(rating)
          return !isNaN(numRating) && numRating > 0
        }).map(rating => Number(rating))

        if (validRatings.length > 0) {
          const maxRatingFromThisPlatform = Math.max(...validRatings)
          console.log(`Platform ${platform} max rating: ${maxRatingFromThisPlatform}, current highest: ${highestRating}`)
          
          if (maxRatingFromThisPlatform > highestRating) {
            highestRating = maxRatingFromThisPlatform
            highestRatedPlatform = platform
            console.log(`NEW HIGHEST: ${highestRating} from platform: ${platform}`)
          }
        }
      }
    })

    console.log(`Final highest rating: ${highestRating} from platform: ${highestRatedPlatform}`)

    // Second pass: Calculate other stats and get contests from highest rated platform
    Object.entries(linkedPlatforms).forEach(([platform, data]) => {
      // Skip null or undefined data
      if (!data) return
      
      // Handle both object and string data structures
      const stats = (typeof data === 'object' && 'stats' in data) ? data.stats : null
      
      if (stats) {
        // Count total problems solved across all platforms
        if (stats.totalSolved) totalProblems += stats.totalSolved
        if (stats.problemsSolved) totalProblems += stats.problemsSolved

        // Count GitHub repositories
        if (platform === 'github' && stats.publicRepos) {
          githubRepositories += stats.publicRepos
        }

        // Get contests ONLY from the platform with highest rating
        if (platform === highestRatedPlatform) {
          console.log(`Getting contests from highest rated platform: ${platform}`)
          
          // Check different contest field names for different platforms
          if (stats.contests?.length) {
            contestsFromHighestRatedPlatform = stats.contests.length
            console.log(`Found ${contestsFromHighestRatedPlatform} contests in stats.contests`)
          } else if (stats.contestsParticipated) {
            contestsFromHighestRatedPlatform = stats.contestsParticipated
            console.log(`Found ${contestsFromHighestRatedPlatform} contests in stats.contestsParticipated`)
          } else if (stats.attendedContestsCount) {
            // LeetCode uses attendedContestsCount
            contestsFromHighestRatedPlatform = stats.attendedContestsCount
            console.log(`Found ${contestsFromHighestRatedPlatform} contests in stats.attendedContestsCount`)
          } else {
            console.log('No contest data found for highest rated platform')
          }
        }
      }
    })

    const result = { 
      totalProblems, 
      githubRepositories, 
      totalContests: contestsFromHighestRatedPlatform, 
      highestRating 
    }
    
    console.log('\n=== FINAL RESULT ===')
    console.log(result)
    console.log('========================\n')
    
    return result
  }

  const stats = calculateStats()

  // Dynamic color assignment system
  const availableColors = [
    '#f97316', // orange-500
    '#f59e0b', // amber-500  
    '#10b981', // green-500
    '#64748b', // slate-500
    '#3b82f6', // blue-500
    '#8b5cf6', // purple-500
    '#ef4444', // red-500
    '#06b6d4', // cyan-500
    '#84cc16', // lime-500
    '#f472b6', // pink-500
    '#a855f7', // violet-500
    '#22c55e', // green-400
  ]

  const getUniquePlatformColor = (platformId: string, allPlatforms: string[]) => {
    // Create a consistent color assignment based on platform order
    const platformIndex = allPlatforms.indexOf(platformId)
    return availableColors[platformIndex % availableColors.length]
  }

  // Get all connected platform IDs for consistent color assignment
  const connectedPlatformIds = Object.keys(linkedPlatforms).filter(id => linkedPlatforms[id] != null)

  // Utility function to format dates consistently (prevents hydration mismatch)
  const formatSyncTime = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    } catch {
      return 'Unknown'
    }
  }

  // Utility function to format numbers with commas (prevents hydration mismatch)
  const formatNumber = (num: number | undefined | null): string => {
    if (!num || num === 0) return '0'
    // Add commas for thousands separators
    return num.toLocaleString('en-US')
  }

  // Safe number display that prevents hydration mismatch
  const safeNumberDisplay = (num: number | undefined | null, fallback: string = 'N/A'): string => {
    if (!isHydrated) return fallback // Show fallback during SSR
    if (!num || num === 0) return '0'
    // Use consistent comma formatting for all numbers
    return num.toLocaleString('en-US')
  }

  const renderPlatformCard = (platformId: string, platformData: any) => {
    // Handle null or undefined platformData
    if (!platformData) {
      return null
    }

    // Get dynamic color for this platform
    const platformColor = getUniquePlatformColor(platformId, connectedPlatformIds)

    const platformConfigs = {
      leetcode: { 
        name: "LeetCode", 
        icon: Code,
        getSummary: (stats: any) => `${stats?.totalSolved || 0} solved`,
        getProfileUrl: (username: string) => `https://leetcode.com/u/${username}/`
      },
      codechef: { 
        name: "CodeChef", 
        icon: Code,
        getSummary: (stats: any) => stats?.stars || '1*',
        getProfileUrl: (username: string) => `https://www.codechef.com/users/${username}`
      },
      hackerrank: { 
        name: "HackerRank", 
        icon: Trophy,
        getSummary: (stats: any) => `${stats?.badges?.length || 0} badges`,
        getProfileUrl: (username: string) => `https://www.hackerrank.com/profile/${username}`
      },
      github: { 
        name: "GitHub", 
        icon: GitBranch,
        getSummary: (stats: any) => `${stats?.publicRepos || 0} repos`,
        getProfileUrl: (username: string) => `https://github.com/${username}`
      },
      codeforces: { 
        name: "Codeforces", 
        icon: Trophy,
        getSummary: (stats: any) => `${stats?.rating || 0} rating`,
        getProfileUrl: (username: string) => `https://codeforces.com/profile/${username}`
      },
      hackerearth: { 
        name: "HackerEarth", 
        icon: Code,
        getSummary: (stats: any) => `${stats?.problemsSolved || 0} solved`,
        getProfileUrl: (username: string) => `https://www.hackerearth.com/@${username}`
      },
      geeksforgeeks: { 
        name: "GeeksforGeeks", 
        icon: Globe,
        getSummary: (stats: any) => {
          const score = stats?.codingScore || stats?.stats?.score || stats?.score || 0
          return `${score} score`
        },
        getProfileUrl: (username: string) => `https://auth.geeksforgeeks.org/user/${username}/profile`
      },
      atcoder: { 
        name: "AtCoder", 
        icon: Trophy,
        getSummary: (stats: any) => `${stats?.rating || 0} rating`,
        getProfileUrl: (username: string) => `https://atcoder.jp/users/${username}`
      },
      spoj: { 
        name: "SPOJ", 
        icon: Code,
        getSummary: (stats: any) => `${stats?.problemsSolved || 0} solved`,
        getProfileUrl: (username: string) => `https://www.spoj.com/users/${username}/`
      },
      kattis: { 
        name: "Kattis", 
        icon: Trophy,
        getSummary: (stats: any) => `${stats?.problemsSolved || 0} solved`,
        getProfileUrl: (username: string) => `https://open.kattis.com/users/${username}`
      },
      topcoder: { 
        name: "TopCoder", 
        icon: Trophy,
        getSummary: (stats: any) => `${stats?.rating || 0} rating`,
        getProfileUrl: (username: string) => `https://www.topcoder.com/members/${username}`
      },
      interviewbit: { 
        name: "InterviewBit", 
        icon: Code,
        getSummary: (stats: any) => `${stats?.problemsSolved || 0} solved`,
        getProfileUrl: (username: string) => `https://www.interviewbit.com/profile/${username}`
      },
      cses: { 
        name: "CSES Problem Set", 
        icon: Trophy,
        getSummary: (stats: any) => `${stats?.problemsSolved || 0} solved`,
        getProfileUrl: (username: string) => `https://cses.fi/user/${username}`
      },
      codestudio: { 
        name: "CodeStudio", 
        icon: Code,
        getSummary: (stats: any) => `${stats?.problemsSolved || 0} solved`,
        getProfileUrl: (username: string) => `https://www.codingninjas.com/studio/profile/${username}`
      },
      exercism: { 
        name: "Exercism", 
        icon: Globe,
        getSummary: (stats: any) => `${stats?.completedExercises || 0} exercises`,
        getProfileUrl: (username: string) => `https://exercism.org/profiles/${username}`
      },
      kaggle: { 
        name: "Kaggle", 
        icon: Trophy,
        getSummary: (stats: any) => `${stats?.tier || 'Novice'} tier`,
        getProfileUrl: (username: string) => `https://www.kaggle.com/${username}`
      },
      uva: { 
        name: "UVa Online Judge", 
        icon: Code,
        getSummary: (stats: any) => `${stats?.problemsSolved || 0} solved`,
        getProfileUrl: (username: string) => `https://uhunt.onlinejudge.org/id/${username}`
      }
    }

    // Get config or create default for non-predefined platforms
    const config = platformConfigs[platformId as keyof typeof platformConfigs] || {
      name: platformId.charAt(0).toUpperCase() + platformId.slice(1),
      icon: Globe,
      getSummary: (stats: any) => {
        // Handle both direct stats and nested stats structure
        const actualStats = stats?.stats || stats
        
        // Platform-specific summaries
        if (platformId.toLowerCase().includes('geek')) {
          const score = actualStats?.codingScore || actualStats?.score || 0
          return `${score} score`
        }
        if (platformId.toLowerCase().includes('atcoder')) {
          const rating = actualStats?.rating || actualStats?.highestRating || 0
          return `${rating} rating`
        }
        if (platformId.toLowerCase().includes('usaco')) {
          const division = actualStats?.division || 'Bronze'
          return `${division} div`
        }
        if (platformId.toLowerCase().includes('spoj') || platformId.toLowerCase().includes('kattis')) {
          const solved = actualStats?.problemsSolved || actualStats?.totalSolved || 0
          return `${solved} solved`
        }
        
        // Generic fallback
        if (actualStats?.totalSolved) return `${actualStats.totalSolved} solved`
        if (actualStats?.problemsSolved) return `${actualStats.problemsSolved} solved`
        if (actualStats?.rating) return `${actualStats.rating} rating`
        if (actualStats?.score) return `${actualStats.score} score`
        return 'Connected'
      },
      getProfileUrl: (username: string) => {
        // Platform-specific profile URLs
        if (platformId.toLowerCase().includes('atcoder')) {
          return `https://atcoder.jp/users/${username}`
        }
        if (platformId.toLowerCase().includes('topcoder')) {
          return `https://www.topcoder.com/members/${username}`
        }
        if (platformId.toLowerCase().includes('spoj')) {
          return `https://www.spoj.com/users/${username}`
        }
        if (platformId.toLowerCase().includes('kattis')) {
          return `https://open.kattis.com/users/${username}`
        }
        if (platformId.toLowerCase().includes('usaco')) {
          return `http://www.usaco.org/index.php?page=viewuser&uid=${username}`
        }
        
        // Try to construct a reasonable profile URL from platformData
        const customUrl = (typeof platformData === 'object' && platformData && 'platformUrl' in platformData) ? platformData.platformUrl : null
        if (customUrl) {
          return `${customUrl}/profile/${username}`
        }
        return `https://${platformId}.com/profile/${username}`
      }
    }

    const IconComponent = config.icon
    
    // Safely handle different platformData structures
    const stats = (platformData && typeof platformData === 'object' && 'stats' in platformData) ? platformData.stats : {}
    let username = 'username'
    
    // Extract username from the platform data structure
    if (platformData && typeof platformData === 'object' && 'username' in platformData && platformData.username) {
      // Standard structure: { username: "user", linkedAt: Date, isActive: true, stats: {...} }
      username = platformData.username
    } else if (typeof platformData === 'string') {
      // Fallback: direct string username
      username = platformData
    }
    
    // Clean username (remove any URL parts if user entered full URL or if it contains path segments)
    username = username.replace(/^https?:\/\/[^\/]+\//, '') // Remove full URL prefix
                      .replace(/^u\//, '')                    // Remove LeetCode /u/ prefix
                      .replace(/^profile\//, '')              // Remove HackerRank /profile/ prefix
                      .replace(/^users\//, '')                // Remove CodeChef /users/ prefix
                      .replace(/^@/, '')                      // Remove @ prefix if present
                      .replace(/\/$/, '')                     // Remove trailing slash
    
    console.log(`Platform ${platformId} - Cleaned Username: ${username}, Stats:`, stats, 'Original Data:', platformData)

    // Debug GeeksforGeeks data structure
    if (platformId === 'geeksforgeeks') {
      console.log('=== GEEKSFORGEEKS DEBUG ===')
      console.log('stats.codingScore:', stats?.codingScore)
      console.log('stats.stats?.score:', stats?.stats?.score)
      console.log('stats.score:', stats?.score)
      console.log('stats.problemsSolved:', stats?.problemsSolved)
      console.log('stats.stats?.problemsSolved:', stats?.stats?.problemsSolved)
      console.log('stats.instituteRank:', stats?.instituteRank)
      console.log('stats.stats?.rank:', stats?.stats?.rank)
      console.log('stats.currentStreak:', stats?.currentStreak)
      console.log('stats.stats?.streak:', stats?.stats?.streak)
      console.log('stats.potdsSolved:', stats?.potdsSolved)
      console.log('stats.stats?.articles:', stats?.stats?.articles)
      console.log('========================')
    }

    return (
      <Card key={platformId} className="bg-card border-l-4 text-foreground relative h-80 w-full cursor-pointer hover:shadow-md transition-shadow" 
        style={{ borderLeftColor: platformColor }}
        onClick={() => router.push('/student/platforms')}
      >
        <CardContent className="p-6 pb-14 h-full flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div 
                className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: platformColor }}
              >
                <IconComponent className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-white truncate">{config.name}</h4>
                <p className="text-xs text-gray-400 truncate">@{username}</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-medium text-white">{config.getSummary(stats)}</p>
            </div>
          </div>
          
          <div className="flex-1 space-y-1 overflow-hidden">

            {!stats || Object.keys(stats).length === 0 ? (
              <div className="text-center py-8">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded"></div>
                </div>
                <div className="mt-4">
                  <div className="inline-flex items-center gap-2 text-xs text-gray-400">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    Fetching latest stats...
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">

            {platformId === 'geeksforgeeks' && (
              <>
                <div>
                  <p className="text-xs text-gray-400">GeeksforGeeks Performance</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-400">
                        {stats.codingScore || stats.stats?.score || stats.score || 0}
                      </div>
                      <div className="text-xs text-gray-400">Coding Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">
                        {stats.problemsSolved || stats.stats?.problemsSolved || stats.stats?.totalSolved || 0}
                      </div>
                      <div className="text-xs text-gray-400">Problems</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">
                        {stats.instituteRank || stats.stats?.rank || stats.stats?.institutionRank || 0}
                      </div>
                      <div className="text-xs text-gray-400">Institute Rank</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="flex w-full relative">
                    <div className="w-1/6"></div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-green-400">
                          {stats.currentStreak || stats.stats?.streak || 0}
                        </div>
                        <div className="text-xs text-gray-400">Current Streak</div>
                      </div>
                    </div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-cyan-400">
                          {stats.potdsSolved || stats.stats?.articles || 0}
                        </div>
                        <div className="text-xs text-gray-400">POTDs Solved</div>
                      </div>
                    </div>
                    <div className="w-1/6"></div>
                  </div>
                </div>
              </>
            )}

            {/* New Platform Sections */}
            {platformId === 'topcoder' && (
              <>
                <div>
                  <p className="text-xs text-gray-400">Competitive Programming</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{stats.rating || 0}</div>
                      <div className="text-xs text-gray-400">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{stats.competitions || 0}</div>
                      <div className="text-xs text-gray-400">Competitions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{stats.wins || 0}</div>
                      <div className="text-xs text-gray-400">Wins</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="flex w-full relative">
                    <div className="w-1/6"></div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-orange-400">{stats.maxRating || 0}</div>
                        <div className="text-xs text-gray-400">Max Rating</div>
                      </div>
                    </div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-cyan-400">{stats.rank || 'Unrated'}</div>
                        <div className="text-xs text-gray-400">Rank</div>
                      </div>
                    </div>
                    <div className="w-1/6"></div>
                  </div>
                </div>
              </>
            )}

            {platformId === 'interviewbit' && (
              <>
                <div>
                  <p className="text-xs text-gray-400">Interview Preparation</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{stats.problemsSolved || 0}</div>
                      <div className="text-xs text-gray-400">Problems</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{stats.score || 0}</div>
                      <div className="text-xs text-gray-400">Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{stats.rank || 0}</div>
                      <div className="text-xs text-gray-400">Rank</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="flex w-full relative">
                    <div className="w-1/6"></div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-orange-400">{stats.streakDays || 0}</div>
                        <div className="text-xs text-gray-400">Streak Days</div>
                      </div>
                    </div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-cyan-400">Active</div>
                        <div className="text-xs text-gray-400">Status</div>
                      </div>
                    </div>
                    <div className="w-1/6"></div>
                  </div>
                </div>
              </>
            )}

            {platformId === 'cses' && (
              <>
                <div>
                  <p className="text-xs text-gray-400">Problem Set Progress</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{stats.problemsSolved || 0}</div>
                      <div className="text-xs text-gray-400">Solved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{stats.totalProblems || 300}</div>
                      <div className="text-xs text-gray-400">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{Math.round(stats.completionRate || 0)}%</div>
                      <div className="text-xs text-gray-400">Complete</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {platformId === 'codestudio' && (
              <>
                <div>
                  <p className="text-xs text-gray-400">Coding Ninjas Studio</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{stats.problemsSolved || 0}</div>
                      <div className="text-xs text-gray-400">Problems</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{stats.score || 0}</div>
                      <div className="text-xs text-gray-400">Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{stats.rank || 0}</div>
                      <div className="text-xs text-gray-400">Rank</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="flex w-full relative">
                    <div className="w-1/6"></div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-orange-400">{stats.streakDays || 0}</div>
                        <div className="text-xs text-gray-400">Streak Days</div>
                      </div>
                    </div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-cyan-400">Active</div>
                        <div className="text-xs text-gray-400">Status</div>
                      </div>
                    </div>
                    <div className="w-1/6"></div>
                  </div>
                </div>
              </>
            )}

            {platformId === 'exercism' && (
              <>
                <div>
                  <p className="text-xs text-gray-400">Code Practice & Mentorship</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{stats.completedExercises || 0}</div>
                      <div className="text-xs text-gray-400">Exercises</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{stats.languages?.length || 0}</div>
                      <div className="text-xs text-gray-400">Languages</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{stats.badges || 0}</div>
                      <div className="text-xs text-gray-400">Badges</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="flex w-full relative">
                    <div className="w-1/6"></div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-orange-400">{stats.reputation || 0}</div>
                        <div className="text-xs text-gray-400">Reputation</div>
                      </div>
                    </div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-cyan-400">Active</div>
                        <div className="text-xs text-gray-400">Status</div>
                      </div>
                    </div>
                    <div className="w-1/6"></div>
                  </div>
                </div>
              </>
            )}

            {platformId === 'kaggle' && (
              <>
                <div>
                  <p className="text-xs text-gray-400">Data Science Platform</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{stats.competitions || 0}</div>
                      <div className="text-xs text-gray-400">Competitions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{stats.datasets || 0}</div>
                      <div className="text-xs text-gray-400">Datasets</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{stats.notebooks || 0}</div>
                      <div className="text-xs text-gray-400">Notebooks</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="flex w-full relative">
                    <div className="w-1/6"></div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-orange-400">{stats.tier || 'Novice'}</div>
                        <div className="text-xs text-gray-400">Tier</div>
                      </div>
                    </div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-cyan-400">{stats.discussions || 0}</div>
                        <div className="text-xs text-gray-400">Discussions</div>
                      </div>
                    </div>
                    <div className="w-1/6"></div>
                  </div>
                </div>
              </>
            )}

            {platformId === 'uva' && (
              <>
                <div>
                  <p className="text-xs text-gray-400">Online Judge</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{stats.problemsSolved || 0}</div>
                      <div className="text-xs text-gray-400">Problems</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{stats.submissions || 0}</div>
                      <div className="text-xs text-gray-400">Submissions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{stats.rank || 0}</div>
                      <div className="text-xs text-gray-400">Rank</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="flex w-full relative">
                    <div className="w-1/6"></div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-orange-400">{stats.country || 'Unknown'}</div>
                        <div className="text-xs text-gray-400">Country</div>
                      </div>
                    </div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-cyan-400">Active</div>
                        <div className="text-xs text-gray-400">Status</div>
                      </div>
                    </div>
                    <div className="w-1/6"></div>
                  </div>
                </div>
              </>
            )}

            {!['leetcode', 'codechef', 'hackerrank', 'github', 'codeforces', 'hackerearth', 'geeksforgeeks', 'atcoder', 'spoj', 'kattis', 'topcoder', 'interviewbit', 'cses', 'codestudio', 'exercism', 'kaggle', 'uva'].includes(platformId) ? (
              <>
                <div>
                  <p className="text-xs text-gray-400">Platform Performance</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">
                        {stats.problemsSolved || stats.totalSolved || stats.stats?.problemsSolved || stats.stats?.totalSolved || 0}
                      </div>
                      <div className="text-xs text-gray-400">Problems</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">
                        {stats.rating || stats.score || stats.stats?.rating || stats.stats?.score || 0}
                      </div>
                      <div className="text-xs text-gray-400">
                        {platformId.toLowerCase().includes('geek') ? 'Score' : 'Rating'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">
                        {stats.rank || stats.globalRank || stats.stats?.rank || stats.stats?.globalRank || 0}
                      </div>
                      <div className="text-xs text-gray-400">Rank</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="flex w-full relative">
                    <div className="w-1/6"></div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-orange-400">
                          {stats.contests?.length || stats.stats?.contests?.length || 
                           stats.articlesPublished || stats.stats?.articles || 
                           stats.division || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {platformId.toLowerCase().includes('geek') ? 'Articles' : 
                           platformId.toLowerCase().includes('usaco') ? 'Division' : 'Contests'}
                        </div>
                      </div>
                    </div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-cyan-400">
                          {stats.badges?.length || stats.stats?.badges?.length || 
                           stats.currentStreak || stats.streak || stats.stats?.streak || 0}
                        </div>
                        <div className="text-xs text-gray-400">
                          {platformId.toLowerCase().includes('geek') ? 'Streak' : 'Badges'}
                        </div>
                      </div>
                    </div>
                    <div className="w-1/6"></div>
                  </div>
                </div>
              </>
            ) : null}

            {platformId === 'leetcode' && (
              <>
                <div>
                  <p className="text-xs text-gray-400">Problems Solved</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{stats.easySolved || 0}</div>
                      <div className="text-xs text-gray-400">Easy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-400">{stats.mediumSolved || 0}</div>
                      <div className="text-xs text-gray-400">Medium</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-400">{stats.hardSolved || 0}</div>
                      <div className="text-xs text-gray-400">Hard</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="flex w-full relative">
                    <div className="w-1/12"></div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-blue-400">{safeNumberDisplay(stats.ranking, 'N/A')}</div>
                        <div className="text-xs text-gray-400">Global Ranking</div>
                      </div>
                    </div>
                    <div className="w-1/6"></div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-purple-400">{stats.contributionPoints || 0}</div>
                        <div className="text-xs text-gray-400">Contribution Points</div>
                      </div>
                    </div>
                    <div className="w-1/12"></div>
                  </div>
                </div>
              </>
            )}

            {platformId === 'codechef' && (
              <>
                <div>
                  <p className="text-xs text-gray-400">Coding Performance</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-400">{stats.problemsSolved || 0}</div>
                      <div className="text-xs text-gray-400">Problems</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{stats.currentRating || 0}</div>
                      <div className="text-xs text-gray-400">Current Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-400">{stats.stars || '1*'}</div>
                      <div className="text-xs text-gray-400">Stars</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="flex w-full relative">
                    <div className="w-1/12"></div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-red-400">{stats.highestRating || 0}</div>
                        <div className="text-xs text-gray-400">Highest Rating</div>
                      </div>
                    </div>
                    <div className="w-1/6"></div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-purple-400">{safeNumberDisplay(stats.globalRank, 'N/A')}</div>
                        <div className="text-xs text-gray-400">Global Rank</div>
                      </div>
                    </div>
                    <div className="w-1/12"></div>
                  </div>
                </div>
              </>
            )}

            {platformId === 'hackerrank' && (
              <>
                <div>
                  <p className="text-xs text-gray-400">Achievements Overview</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-400">{stats.badges?.length || 0}</div>
                      <div className="text-xs text-gray-400">Badges</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{stats.certifications?.length || 0}</div>
                      <div className="text-xs text-gray-400">Certifications</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{stats.skills?.length || 0}</div>
                      <div className="text-xs text-gray-400">Skills</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="flex w-full relative">
                    <div className="w-1/12"></div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-green-400">{stats.totalScore || 0}</div>
                        <div className="text-xs text-gray-400">Total Score</div>
                      </div>
                    </div>
                    <div className="w-1/6"></div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-orange-400">{safeNumberDisplay(stats.globalRank, 'N/A')}</div>
                        <div className="text-xs text-gray-400">Global Rank</div>
                      </div>
                    </div>
                    <div className="w-1/12"></div>
                  </div>
                </div>
              </>
            )}

            {platformId === 'github' && (
              <>
                <div>
                  <p className="text-xs text-gray-400">Development Activity</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{stats.totalContributions || 0}</div>
                      <div className="text-xs text-gray-400">Contributions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{stats.publicRepos || 0}</div>
                      <div className="text-xs text-gray-400">Repositories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{safeNumberDisplay(stats.followers, '0')}</div>
                      <div className="text-xs text-gray-400">Followers</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="flex w-full relative">
                    <div className="w-1/12"></div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-yellow-400">{Object.keys(stats.languages || {}).length}</div>
                        <div className="text-xs text-gray-400">Languages</div>
                      </div>
                    </div>
                    <div className="w-1/6"></div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-orange-400">{safeNumberDisplay(stats.following, '0')}</div>
                        <div className="text-xs text-gray-400">Following</div>
                      </div>
                    </div>
                    <div className="w-1/12"></div>
                  </div>
                </div>
              </>
            )}

            {platformId === 'codeforces' && (
              <>
                <div>
                  <p className="text-xs text-gray-400">Competitive Programming</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-400">{stats.problemsSolved || 0}</div>
                      <div className="text-xs text-gray-400">Problems</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{stats.rating || 0}</div>
                      <div className="text-xs text-gray-400">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{stats.contests?.length || 0}</div>
                      <div className="text-xs text-gray-400">Contests</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="flex w-full relative">
                    <div className="w-1/12"></div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-red-400">{stats.maxRating || 0}</div>
                        <div className="text-xs text-gray-400">Max Rating</div>
                      </div>
                    </div>
                    <div className="w-1/6"></div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-green-400">{stats.rank || 'Unrated'}</div>
                        <div className="text-xs text-gray-400">Rank</div>
                      </div>
                    </div>
                    <div className="w-1/12"></div>
                  </div>
                </div>
              </>
            )}

            {platformId === 'hackerearth' && (
              <>
                <div>
                  <p className="text-xs text-gray-400">Coding Performance</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{stats.problemsSolved || 0}</div>
                      <div className="text-xs text-gray-400">Problems</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{stats.rating || 0}</div>
                      <div className="text-xs text-gray-400">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{stats.contests?.length || 0}</div>
                      <div className="text-xs text-gray-400">Contests</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="flex w-full relative">
                    <div className="w-1/12"></div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-red-400">{stats.maxRating || 0}</div>
                        <div className="text-xs text-gray-400">Max Rating</div>
                      </div>
                    </div>
                    <div className="w-1/6"></div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-yellow-400">{safeNumberDisplay(stats.globalRank, 'N/A')}</div>
                        <div className="text-xs text-gray-400">Global Rank</div>
                      </div>
                    </div>
                    <div className="w-1/12"></div>
                  </div>
                </div>
              </>
            )}

            {platformId === 'atcoder' && (
              <>
                <div>
                  <p className="text-xs text-gray-400">Competitive Programming</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{stats.rating || 0}</div>
                      <div className="text-xs text-gray-400">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{stats.problemsSolved || 0}</div>
                      <div className="text-xs text-gray-400">Problems</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{stats.contests?.length || 0}</div>
                      <div className="text-xs text-gray-400">Contests</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="flex w-full relative">
                    <div className="w-1/6"></div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-orange-400">{stats.highestRating || 0}</div>
                        <div className="text-xs text-gray-400">Highest Rating</div>
                      </div>
                    </div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-cyan-400">{stats.rank || 'Unrated'}</div>
                        <div className="text-xs text-gray-400">Rank</div>
                      </div>
                    </div>
                    <div className="w-1/6"></div>
                  </div>
                </div>
              </>
            )}

            {platformId === 'spoj' && (
              <>
                <div>
                  <p className="text-xs text-gray-400">Judge Performance</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{stats.problemsSolved || 0}</div>
                      <div className="text-xs text-gray-400">Problems</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{stats.score || 0}</div>
                      <div className="text-xs text-gray-400">Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{stats.rank || stats.worldRank || 0}</div>
                      <div className="text-xs text-gray-400">World Rank</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="flex w-full relative">
                    <div className="w-1/6"></div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-orange-400">{safeNumberDisplay(stats.countryRank, '0')}</div>
                        <div className="text-xs text-gray-400">Country Rank</div>
                      </div>
                    </div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-cyan-400">{stats.institutionRank || 0}</div>
                        <div className="text-xs text-gray-400">Institution Rank</div>
                      </div>
                    </div>
                    <div className="w-1/6"></div>
                  </div>
                </div>
              </>
            )}

            {platformId === 'kattis' && (
              <>
                <div>
                  <p className="text-xs text-gray-400">Contest Performance</p>
                  <div className="flex justify-between items-end">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{stats.problemsSolved || 0}</div>
                      <div className="text-xs text-gray-400">Problems</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{stats.score || 0}</div>
                      <div className="text-xs text-gray-400">Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">{stats.rank || 0}</div>
                      <div className="text-xs text-gray-400">Rank</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="flex w-full relative">
                    <div className="w-1/6"></div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-orange-400">{stats.country || 'Unknown'}</div>
                        <div className="text-xs text-gray-400">Country</div>
                      </div>
                    </div>
                    <div className="w-1/3 flex justify-center">
                      <div className="text-center">
                        <div className="text-sm font-bold text-cyan-400">{stats.university || 'Unknown'}</div>
                        <div className="text-xs text-gray-400">University</div>
                      </div>
                    </div>
                    <div className="w-1/6"></div>
                  </div>
                </div>
              </>
            )}
              </div>
            )}
          </div>
        </CardContent>
        
        {/* Bottom section with View Details link, Verified badge, and Unlink button */}
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-gray-700 bg-gray-800/50">
          <div className="flex items-center justify-between">
            <a
              href={config.getProfileUrl(username)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-200"
            >
              View Details
              <ExternalLink className="h-4 w-4" />
            </a>
            <div className="flex-1 flex justify-center">
              <Badge className="text-xs gap-1 bg-green-600 hover:bg-green-700 text-white border-green-500 shadow-lg">
                <Check className="h-3 w-3" />
                Verified
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUnlinkPlatform(platformId, config.name)}
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2"
              title={`Unlink ${config.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {(isUpdating || isAutoSyncing) && (
        <div className="fixed top-20 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          {isAutoSyncing ? 'Auto-syncing latest stats...' : 'Updating dashboard...'}
        </div>
      )}

      {/* ── New Hero Section ─────────────────────────────────── */}
      <DashboardHero
        student={student}
        onSync={async () => {
          setIsUpdating(true)
          try {
            const res = await fetch('/api/platforms/sync', { method: 'POST', credentials: 'include' })
            if (res.ok) {
              toast.success('Stats synced!')
              const ur = await fetch('/api/auth/user', { credentials: 'include', cache: 'no-store' })
              if (ur.ok) { const ud = await ur.json(); if (ud.user) setStudent(ud.user) }
            }
          } catch { toast.error('Sync failed') }
          finally { setIsUpdating(false) }
        }}
        isSyncing={isUpdating || isAutoSyncing}
      />

      {/* Connected Platforms */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Connected Platforms</CardTitle>
            <div className="flex gap-2">
              <a href="/student/platforms">
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground text-xs">
                  Manage All
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  setIsUpdating(true)
                  try {
                    const response = await fetch('/api/platforms/sync', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      credentials: 'include',
                    })
                    
                    if (response.ok) {
                      const syncData = await response.json()
                      console.log('Manual sync response:', syncData)
                      
                      if (syncData.summary) {
                        toast.success(`Stats synced! ${syncData.summary.successful}/${syncData.summary.total} platforms updated`)
                      } else {
                        toast.success('Stats synced successfully!')
                      }
                      
                      // Fetch fresh user data
                      const userResponse = await fetch('/api/auth/user', {
                        method: 'GET',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        cache: 'no-store'
                      })
                      
                      if (userResponse.ok) {
                        const userData = await userResponse.json()
                        if (userData.user) {
                          setStudent(userData.user)
                        }
                      }
                    } else {
                      const errorData = await response.json()
                      toast.error(errorData.error || 'Failed to sync stats')
                    }
                  } catch (error) {
                    console.error('Manual sync error:', error)
                    toast.error('Failed to sync stats')
                  } finally {
                    setIsUpdating(false)
                  }
                }}
                disabled={isUpdating || isAutoSyncing || !hasLinkedPlatforms}
                className="gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                {isAutoSyncing ? 'Auto-syncing...' : 'Sync Stats'}
              </Button>
              <AddPlatformDialog 
                onPlatformAdded={handlePlatformAdded} 
                connectedPlatforms={Object.keys(linkedPlatforms).filter(id => linkedPlatforms[id] != null)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Link your coding platforms to track your progress
            </p>
            {hasLinkedPlatforms && (
              <div className="text-xs text-muted-foreground">
                {isAutoSyncing ? (
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    Syncing...
                  </span>
                ) : (
                  `Auto-syncs every 5 minutes`
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {hasLinkedPlatforms ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(linkedPlatforms)
                .filter(([, platformData]) => platformData != null)
                .sort(([, a], [, b]) => {
                  const getProblems = (data: any): number => {
                    const s = data && typeof data === 'object' && 'stats' in data ? data.stats : null
                    if (!s) return 0
                    return (
                      s.totalSolved ||
                      s.problemsSolved ||
                      s.completedExercises ||
                      0
                    )
                  }
                  return getProblems(b) - getProblems(a)
                })
                .map(([platformId, platformData]) =>
                  renderPlatformCard(platformId, platformData)
                )
                .filter(Boolean)}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Code className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Platforms Connected</h3>
              <p className="text-muted-foreground mb-4">
                Connect your coding platforms to see your progress and statistics
              </p>
              <AddPlatformDialog 
                onPlatformAdded={handlePlatformAdded} 
                connectedPlatforms={Object.keys(linkedPlatforms).filter(id => linkedPlatforms[id] != null)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Row: Skills Distribution and Recent Activity */}
      {(() => {
        // Derive real LeetCode difficulty counts from live platform data
        const lcData = linkedPlatforms['leetcode']
        const lcStats = lcData && typeof lcData === 'object' && 'stats' in lcData ? lcData.stats : null
        const easy = lcStats?.easySolved || 0
        const medium = lcStats?.mediumSolved || 0
        const hard = lcStats?.hardSolved || 0
        const totalLC = easy + medium + hard

        // Build real recent activity from synced platform data
        const recentItems: { color: string; text: string; sub: string }[] = []
        const PLATFORM_COLORS_MAP: Record<string, string> = {
          leetcode: 'bg-yellow-500', github: 'bg-green-500', codeforces: 'bg-blue-500',
          codechef: 'bg-orange-500', hackerrank: 'bg-emerald-500', geeksforgeeks: 'bg-green-600',
          atcoder: 'bg-gray-400', hackerearth: 'bg-blue-400', spoj: 'bg-orange-400',
        }
        Object.entries(linkedPlatforms).forEach(([pid, pdata]) => {
          if (!pdata || typeof pdata !== 'object') return
          const s = 'stats' in pdata ? (pdata as any).stats : null
          const uname = (pdata as any).username || ''
          const color = PLATFORM_COLORS_MAP[pid] || 'bg-purple-500'
          const lastSync = (pdata as any).lastSync
          const syncLabel = lastSync ? new Date(lastSync).toLocaleDateString() : 'recently'
          if (s) {
            const solved = s.totalSolved || s.problemsSolved || 0
            const name = pid.charAt(0).toUpperCase() + pid.slice(1)
            if (solved > 0) recentItems.push({ color, text: `${solved} problems solved on ${name}`, sub: `@${uname} • synced ${syncLabel}` })
            if (pid === 'github' && s.publicRepos) recentItems.push({ color, text: `${s.publicRepos} repositories on GitHub`, sub: `@${uname} • ${s.totalContributions || 0} contributions` })
            if (s.rating || s.currentRating) recentItems.push({ color, text: `Rating ${s.rating || s.currentRating} on ${name}`, sub: `@${uname}` })
          } else {
            const name = pid.charAt(0).toUpperCase() + pid.slice(1)
            recentItems.push({ color: 'bg-gray-500', text: `${name} connected`, sub: `@${uname} • sync to load stats` })
          }
        })

        return (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Skills Distribution — real LeetCode data */}
            <Card>
              <CardHeader>
                <CardTitle>Skills Distribution</CardTitle>
                <p className="text-xs text-muted-foreground">LeetCode difficulty breakdown</p>
              </CardHeader>
              <CardContent>
                {!lcStats ? (
                  <div className="text-center py-8">
                    <Code className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {hasLinkedPlatforms ? 'Sync LeetCode to see difficulty stats' : 'Connect LeetCode to see difficulty stats'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-400">Easy</span>
                        <span className="text-sm text-muted-foreground">{easy}</span>
                      </div>
                      <Progress value={totalLC > 0 ? (easy / totalLC) * 100 : 0} className="h-2 [&>div]:bg-green-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-yellow-400">Medium</span>
                        <span className="text-sm text-muted-foreground">{medium}</span>
                      </div>
                      <Progress value={totalLC > 0 ? (medium / totalLC) * 100 : 0} className="h-2 [&>div]:bg-yellow-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-red-400">Hard</span>
                        <span className="text-sm text-muted-foreground">{hard}</span>
                      </div>
                      <Progress value={totalLC > 0 ? (hard / totalLC) * 100 : 0} className="h-2 [&>div]:bg-red-500" />
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">Total: {totalLC} problems solved</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity — from MongoDB recentActivity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.slice(0, 5).map((item: any, i: number) => {
                      const COLORS: Record<string, string> = {
                        leetcode: 'bg-yellow-500', github: 'bg-green-500', codeforces: 'bg-blue-500',
                        codechef: 'bg-orange-500', hackerrank: 'bg-emerald-500', geeksforgeeks: 'bg-green-600',
                        atcoder: 'bg-gray-400', hackerearth: 'bg-blue-400',
                      }
                      const dot = COLORS[item.platform] || 'bg-purple-500'
                      return (
                        <div key={i} className="flex items-start gap-3">
                          <div className={`h-2 w-2 rounded-full flex-shrink-0 mt-1.5 ${dot}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white">{item.title}</p>
                            {item.detail && <p className="text-xs text-muted-foreground truncate">{item.detail}</p>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : recentItems.length > 0 ? (
                  <div className="space-y-4">
                    {recentItems.slice(0, 5).map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full flex-shrink-0 ${item.color}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{item.text}</p>
                          <p className="text-xs text-muted-foreground truncate">{item.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Connect platforms to see your activity
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )
      })()}

      {/* Per-platform quick comparison + Analytics CTA */}
      {connectedPlatformIds.length > 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-base">Platform Ratings</CardTitle>
              <a href="/student/analytics">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                  <TrendingUp className="h-3 w-3" />
                  Full Analytics
                </Button>
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {connectedPlatformIds.map(pid => {
                const pdata = linkedPlatforms[pid]
                if (!pdata || typeof pdata !== 'object') return null
                const s = 'stats' in pdata ? (pdata as any).stats : null
                const uname = (pdata as any).username || ''
                const color = getUniquePlatformColor(pid, connectedPlatformIds)
                const name = pid.charAt(0).toUpperCase() + pid.slice(1)

                // Pick the most meaningful metric per platform
                let metricLabel = ''
                let metricValue = 0
                if (s) {
                  if (pid === 'github') { metricLabel = 'contributions'; metricValue = s.totalContributions || 0 }
                  else if (pid === 'leetcode') { metricLabel = 'solved'; metricValue = s.totalSolved || 0 }
                  else if (pid === 'hackerrank') { metricLabel = 'badges'; metricValue = s.badges?.length || 0 }
                  else if (pid === 'geeksforgeeks') { metricLabel = 'score'; metricValue = s.codingScore || s.score || 0 }
                  else if (s.rating || s.currentRating || s.highestRating) {
                    metricLabel = 'rating'
                    metricValue = s.rating || s.currentRating || s.highestRating || 0
                  } else if (s.totalSolved || s.problemsSolved) {
                    metricLabel = 'solved'
                    metricValue = s.totalSolved || s.problemsSolved || 0
                  }
                }

                return (
                  <div key={pid} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-sm text-gray-300 w-28 truncate">{name}</span>
                    <span className="text-xs text-gray-500 truncate flex-1">@{uname}</span>
                    {metricValue > 0 ? (
                      <span className="text-sm font-semibold text-white">
                        {metricValue.toLocaleString()} <span className="text-xs text-gray-400 font-normal">{metricLabel}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">not synced</span>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}