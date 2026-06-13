"use client"

import { useState, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
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
    if (!platformData) return null

    const platformColor = getUniquePlatformColor(platformId, connectedPlatformIds)

    const platformConfigs: Record<string, { name: string; icon: any; getStatLines: (s: any) => { label: string; value: any }[]; getProfileUrl: (u: string) => string }> = {
      leetcode: {
        name: "LeetCode", icon: Code,
        getStatLines: (s) => [
          { label: "Solved",     value: s?.totalSolved ?? 0 },
          { label: "Easy",       value: s?.easySolved ?? 0 },
          { label: "Medium",     value: s?.mediumSolved ?? 0 },
          { label: "Hard",       value: s?.hardSolved ?? 0 },
        ],
        getProfileUrl: (u) => `https://leetcode.com/u/${u}/`,
      },
      codechef: {
        name: "CodeChef", icon: Code,
        getStatLines: (s) => [
          { label: "Rating",     value: s?.currentRating ?? 0 },
          { label: "Stars",      value: s?.stars ?? "—" },
          { label: "Solved",     value: s?.problemsSolved ?? 0 },
          { label: "Max Rating", value: s?.highestRating ?? 0 },
        ],
        getProfileUrl: (u) => `https://www.codechef.com/users/${u}`,
      },
      hackerrank: {
        name: "HackerRank", icon: Trophy,
        getStatLines: (s) => [
          { label: "Badges",        value: s?.badges?.length ?? 0 },
          { label: "Certifications",value: s?.certifications?.length ?? 0 },
          { label: "Score",         value: s?.totalScore ?? 0 },
          { label: "Rank",          value: s?.globalRank ? `#${s.globalRank}` : "—" },
        ],
        getProfileUrl: (u) => `https://www.hackerrank.com/profile/${u}`,
      },
      github: {
        name: "GitHub", icon: GitBranch,
        getStatLines: (s) => [
          { label: "Repos",          value: s?.publicRepos ?? 0 },
          { label: "Contributions",  value: s?.totalContributions ?? 0 },
          { label: "Stars",          value: s?.totalStars ?? 0 },
          { label: "Followers",      value: s?.followers ?? 0 },
        ],
        getProfileUrl: (u) => `https://github.com/${u}`,
      },
      codeforces: {
        name: "Codeforces", icon: Trophy,
        getStatLines: (s) => [
          { label: "Rating",     value: s?.rating ?? 0 },
          { label: "Rank",       value: s?.rank ?? "Unrated" },
          { label: "Max Rating", value: s?.maxRating ?? 0 },
          { label: "Contests",   value: s?.contestsParticipated ?? 0 },
        ],
        getProfileUrl: (u) => `https://codeforces.com/profile/${u}`,
      },
      hackerearth: {
        name: "HackerEarth", icon: Code,
        getStatLines: (s) => [
          { label: "Solved",     value: s?.problemsSolved ?? 0 },
          { label: "Rating",     value: s?.rating ?? 0 },
          { label: "Accuracy",   value: s?.accuracy ? `${s.accuracy}%` : "—" },
          { label: "Challenges", value: s?.challengesSolved ?? 0 },
        ],
        getProfileUrl: (u) => `https://www.hackerearth.com/@${u}`,
      },
      geeksforgeeks: {
        name: "GeeksforGeeks", icon: Globe,
        getStatLines: (s) => [
          { label: "Score",         value: s?.codingScore ?? s?.score ?? 0 },
          { label: "Problems",      value: s?.problemsSolved ?? 0 },
          { label: "Institute Rank",value: (s?.instituteRank && s.instituteRank !== "" && s.instituteRank !== "0") ? s.instituteRank : 0 },
          { label: "Streak",        value: s?.currentStreak ?? s?.streak ?? 0 },
        ],
        getProfileUrl: (u) => `https://auth.geeksforgeeks.org/user/${u}/profile`,
      },
      atcoder: {
        name: "AtCoder", icon: Trophy,
        getStatLines: (s) => [
          { label: "Rating",     value: s?.rating ?? 0 },
          { label: "Max Rating", value: s?.highestRating ?? 0 },
          { label: "Rank",       value: s?.rank ?? "Unrated" },
          { label: "Contests",   value: s?.contestsParticipated ?? 0 },
        ],
        getProfileUrl: (u) => `https://atcoder.jp/users/${u}`,
      },
      spoj: {
        name: "SPOJ", icon: Code,
        getStatLines: (s) => [
          { label: "Solved",     value: s?.problemsSolved ?? 0 },
          { label: "Score",      value: s?.score ?? 0 },
          { label: "World Rank", value: s?.rank ?? s?.worldRank ?? "—" },
          { label: "Accepted",   value: s?.acceptedSubmissions ?? 0 },
        ],
        getProfileUrl: (u) => `https://www.spoj.com/users/${u}/`,
      },
      kattis: {
        name: "Kattis", icon: Trophy,
        getStatLines: (s) => [
          { label: "Solved",    value: s?.problemsSolved ?? 0 },
          { label: "Score",     value: s?.score ?? 0 },
          { label: "Rank",      value: s?.rank ?? "—" },
          { label: "Countries", value: s?.countriesRank ?? "—" },
        ],
        getProfileUrl: (u) => `https://open.kattis.com/users/${u}`,
      },
      topcoder: {
        name: "TopCoder", icon: Trophy,
        getStatLines: (s) => [
          { label: "Algorithm",    value: s?.rating ?? 0 },
          { label: "Rank",         value: s?.rank ?? "Unrated" },
          { label: "Max Rating",   value: s?.maxRating ?? 0 },
          { label: "Competitions", value: s?.competitions ?? 0 },
        ],
        getProfileUrl: (u) => `https://www.topcoder.com/members/${u}`,
      },
      interviewbit: {
        name: "InterviewBit", icon: Code,
        getStatLines: (s) => [
          { label: "Solved",   value: s?.problemsSolved ?? 0 },
          { label: "Score",    value: s?.score ?? 0 },
          { label: "Rank",     value: s?.rank ?? "—" },
          { label: "Streaks",  value: s?.streak ?? 0 },
        ],
        getProfileUrl: (u) => `https://www.interviewbit.com/profile/${u}`,
      },
      cses: {
        name: "CSES Problem Set", icon: Trophy,
        getStatLines: (s) => [
          { label: "Solved",   value: s?.problemsSolved ?? 0 },
          { label: "Total",    value: s?.totalProblems ?? 300 },
          { label: "Progress", value: s?.totalProblems ? `${Math.round(((s?.problemsSolved ?? 0) / s.totalProblems) * 100)}%` : "—" },
          { label: "Accepted", value: s?.acceptedSubmissions ?? 0 },
        ],
        getProfileUrl: (u) => `https://cses.fi/user/${u}`,
      },
      codestudio: {
        name: "CodeStudio", icon: Code,
        getStatLines: (s) => [
          { label: "Solved",  value: s?.problemsSolved ?? 0 },
          { label: "Score",   value: s?.score ?? 0 },
          { label: "Rank",    value: s?.rank ?? "—" },
          { label: "Streaks", value: s?.streak ?? 0 },
        ],
        getProfileUrl: (u) => `https://www.codingninjas.com/studio/profile/${u}`,
      },
      exercism: {
        name: "Exercism", icon: Globe,
        getStatLines: (s) => [
          { label: "Exercises",  value: s?.completedExercises ?? 0 },
          { label: "Languages",  value: s?.languages?.length ?? 0 },
          { label: "Reputation", value: s?.reputation ?? 0 },
          { label: "Mentoring",  value: s?.mentoringSolutions ?? 0 },
        ],
        getProfileUrl: (u) => `https://exercism.org/profiles/${u}`,
      },
      kaggle: {
        name: "Kaggle", icon: Trophy,
        getStatLines: (s) => [
          { label: "Tier",         value: s?.tier ?? "Novice" },
          { label: "Competitions", value: s?.competitions ?? 0 },
          { label: "Notebooks",    value: s?.notebooks ?? 0 },
          { label: "Datasets",     value: s?.datasets ?? 0 },
        ],
        getProfileUrl: (u) => `https://www.kaggle.com/${u}`,
      },
      uva: {
        name: "UVa Online Judge", icon: Code,
        getStatLines: (s) => [
          { label: "Solved",    value: s?.problemsSolved ?? 0 },
          { label: "Rank",      value: s?.rank ?? "—" },
          { label: "Accepted",  value: s?.acceptedSubmissions ?? 0 },
          { label: "Attempted", value: s?.attempted ?? 0 },
        ],
        getProfileUrl: (u) => `https://uhunt.onlinejudge.org/id/${u}`,
      },
    }

    const config = platformConfigs[platformId] || {
      name: platformId.charAt(0).toUpperCase() + platformId.slice(1),
      icon: Globe,
      getStatLines: (s: any) => {
        const lines = []
        if (s?.totalSolved)      lines.push({ label: "Solved", value: s.totalSolved })
        if (s?.problemsSolved)   lines.push({ label: "Solved", value: s.problemsSolved })
        if (s?.rating)           lines.push({ label: "Rating", value: s.rating })
        if (s?.score)            lines.push({ label: "Score",  value: s.score })
        return lines
      },
      getProfileUrl: (u: string) => `https://${platformId}.com/profile/${u}`,
    }

    const IconComponent = config.icon
    const stats = (platformData && typeof platformData === 'object' && 'stats' in platformData) ? platformData.stats : {}
    let username = typeof platformData === 'object' && platformData?.username ? platformData.username : (typeof platformData === 'string' ? platformData : 'username')
    username = username
      .replace(/^https?:\/\/[^\/]+\//, '')
      .replace(/^u\//, '')
      .replace(/^profile\//, '')
      .replace(/^users\//, '')
      .replace(/^@/, '')
      .replace(/\/$/, '')

    const linkedAt  = typeof platformData === 'object' && platformData?.linkedAt  ? new Date(platformData.linkedAt).toLocaleDateString()  : null
    const lastSync  = typeof platformData === 'object' && platformData?.lastSync   ? new Date(platformData.lastSync).toLocaleString()       : null
    const statLines = config.getStatLines(stats || {})

    return (
      <Card
        key={platformId}
        className="border-l-4 bg-card relative hover:shadow-md transition-shadow"
        style={{ borderLeftColor: platformColor }}
      >
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4 gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: platformColor + "20", border: `1px solid ${platformColor}` }}
              >
                <IconComponent className="h-5 w-5" style={{ color: platformColor }} />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-foreground truncate">{config.name}</h4>
                <p className="text-xs text-muted-foreground truncate">@{username}</p>
              </div>
            </div>
            <Badge className="shrink-0 text-xs bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30">
              <Check className="h-3 w-3 mr-1" /> Connected
            </Badge>
          </div>

          {/* Stats — always 2x2 grid */}
          {statLines.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {statLines.slice(0, 4).map(({ label, value }) => (
                <div key={label} className="rounded-lg bg-muted/40 px-3 py-2">
                  <p className="text-[10px] text-muted-foreground leading-none mb-0.5">{label}</p>
                  <p className="text-sm font-bold text-foreground">{value ?? "—"}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mb-4">Sync to load stats</p>
          )}

          {/* Meta */}
          <div className="text-xs text-muted-foreground mb-3 space-y-0.5">
            {linkedAt && <p>Linked: {linkedAt}</p>}
            {lastSync  && <p>Last sync: {lastSync}</p>}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <a
              href={config.getProfileUrl(username)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline transition-colors"
            >
              View Profile <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); handleUnlinkPlatform(platformId, config.name) }}
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2"
              title={`Unlink ${config.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {(isUpdating || isAutoSyncing) && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary w-fit">
          <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          {isAutoSyncing ? 'Auto-syncing…' : 'Updating…'}
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
            <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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

    </div>
  )
}