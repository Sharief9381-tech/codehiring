"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, TrendingUp, Code, GitBranch, Trophy, Star, ExternalLink, Check, Plus } from "lucide-react"
import type { StudentProfile } from "@/lib/types"

interface StatsOverviewProps {
  student: StudentProfile
}

interface AggregatedStats {
  totalProblems: number
  githubContributions: number
  contestsAttended: number
  currentRating: number
  platformBreakdown: {
    leetcode: {
      problems: number
      easy: number
      medium: number
      hard: number
      rating: number
      contributionPoints: number
      reputation: number
    }
    github: {
      contributions: number
      repositories: number
      followers: number
      following: number
      languages: Record<string, number>
    }
    codeforces: {
      problems: number
      rating: number
      contests: number
      maxRating: number
      rank: string
      contribution: number
    }
    codechef: {
      problems: number
      rating: number
      stars: string
      highestRating: number
      globalRank: number
    }
    hackerrank: {
      badges: number
      certifications: number
      skills: number
      level: number
      totalScore: number
      globalRank: number
    }
  }
  skillsAnalysis: {
    primaryLanguages: string[]
    activityLevel: string
    overallRank: string
    difficultyDistribution: {
      easy: number
      medium: number
      hard: number
    }
  }
  lastUpdated: string
}

const platforms = [
  { id: "leetcode",      name: "LeetCode",      color: "#FFA116", url: "https://leetcode.com",                    icon: Code      },
  { id: "github",        name: "GitHub",         color: "#238636", url: "https://github.com",                     icon: GitBranch },
  { id: "codeforces",    name: "Codeforces",     color: "#1890FF", url: "https://codeforces.com/profile",         icon: Trophy    },
  { id: "codechef",      name: "CodeChef",       color: "#5B4638", url: "https://codechef.com/users",             icon: Code      },
  { id: "hackerrank",    name: "HackerRank",     color: "#00EA64", url: "https://hackerrank.com/profile",         icon: Trophy    },
  { id: "geeksforgeeks", name: "GeeksforGeeks",  color: "#2F8D46", url: "https://geeksforgeeks.org/user",         icon: Code      },
  { id: "hackerearth",   name: "HackerEarth",    color: "#2C3E50", url: "https://hackerearth.com/@",              icon: Code      },
  { id: "atcoder",       name: "AtCoder",        color: "#222222", url: "https://atcoder.jp/users",               icon: Trophy    },
  { id: "codestudio",    name: "CodeStudio",     color: "#f472b6", url: "https://codingninjas.com/studio/profile",icon: Code      },
  { id: "interviewbit",  name: "InterviewBit",   color: "#06b6d4", url: "https://interviewbit.com/profile",       icon: Code      },
  { id: "spoj",          name: "SPOJ",           color: "#f97316", url: "https://spoj.com/users",                 icon: Code      },
  { id: "kattis",        name: "Kattis",         color: "#8b5cf6", url: "https://open.kattis.com/users",          icon: Trophy    },
]

function getPlatformStatLines(platformId: string, platformData: any): { label: string; value: string | number }[] {
  const stats = typeof platformData === "object" ? (platformData.stats ?? platformData) : null
  if (!stats) return []

  switch (platformId) {
    case "leetcode":
      return [
        { label: "Problems Solved", value: stats.totalSolved ?? 0 },
        { label: "Easy / Med / Hard", value: `${stats.easySolved ?? 0} / ${stats.mediumSolved ?? 0} / ${stats.hardSolved ?? 0}` },
        { label: "Ranking", value: stats.ranking ? `#${stats.ranking.toLocaleString()}` : "—" },
      ]
    case "github":
      return [
        { label: "Contributions", value: stats.totalContributions ?? 0 },
        { label: "Repositories", value: stats.publicRepos ?? 0 },
        { label: "Followers", value: stats.followers ?? 0 },
      ]
    case "codeforces":
      return [
        { label: "Rating", value: stats.rating ?? 0 },
        { label: "Rank", value: stats.rank ?? "unrated" },
        { label: "Max Rating", value: stats.maxRating ?? stats.rating ?? 0 },
      ]
    case "codechef":
      return [
        { label: "Rating", value: stats.currentRating ?? 0 },
        { label: "Stars", value: stats.stars ?? "—" },
        { label: "Problems Solved", value: stats.problemsSolved ?? 0 },
      ]
    case "hackerrank":
      return [
        { label: "Badges", value: stats.badges?.length ?? 0 },
        { label: "Top Badge", value: stats.badges?.[0]?.name ? `${stats.badges[0].name} (${stats.badges[0].stars}★)` : "—" },
        { label: "Total Score", value: stats.totalScore ?? 0 },
      ]
    case "geeksforgeeks":
      return [
        { label: "Problems Solved", value: stats.problemsSolved ?? 0 },
        { label: "Coding Score", value: stats.codingScore ?? 0 },
        { label: "Current Streak", value: stats.currentStreak ? `${stats.currentStreak} days` : "—" },
      ]
    case "hackerearth":
      return [
        { label: "Problems Solved", value: stats.problemsSolved ?? 0 },
        { label: "Rating", value: stats.rating ?? 0 },
      ]
    case "atcoder":
      return [
        { label: "Rating", value: stats.rating ?? 0 },
        { label: "Rank", value: stats.rank ?? "—" },
        { label: "Problems Solved", value: stats.problemsSolved ?? 0 },
      ]
    default: {
      const solved = stats.totalSolved ?? stats.problemsSolved ?? 0
      const rating = stats.rating ?? stats.currentRating ?? 0
      const lines = []
      if (solved > 0) lines.push({ label: "Problems Solved", value: solved })
      if (rating > 0) lines.push({ label: "Rating", value: rating })
      return lines
    }
  }
}

export function StatsOverview({ student }: StatsOverviewProps) {
  const [stats, setStats] = useState<AggregatedStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/student/sync-stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const syncStats = async () => {
    setSyncing(true)
    try {
      const response = await fetch('/api/student/sync-stats', { method: 'POST' })
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error syncing stats:', error)
    } finally {
      setSyncing(false)
    }
  }

  const linkedPlatforms = student.linkedPlatforms || {}
  const hasLinkedPlatforms = Object.keys(linkedPlatforms).length > 0
  // Show all connected platforms, not just the 4 hardcoded ones
  const linkedPlatformsList = platforms.filter(p => linkedPlatforms[p.id])

  if (!hasLinkedPlatforms) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
              <Code className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No Platforms Connected</h3>
              <p className="text-muted-foreground">
                Connect your coding platforms to see your aggregated statistics
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
              <RefreshCw className="h-6 w-6 text-muted-foreground animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Loading Statistics</h3>
              <p className="text-muted-foreground">
                Fetching your latest coding statistics...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No Statistics Available</h3>
              <p className="text-muted-foreground mb-4">
                Sync your platforms to generate statistics
              </p>
            </div>
            <Button onClick={syncStats} disabled={syncing} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Stats'}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Primary Overview Stats - Top Priority */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 border-blue-700 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-200">Total Problems</p>
                <p className="text-3xl font-bold text-white">{stats.totalProblems}</p>
                <p className="text-xs text-blue-300">
                  Across all platforms
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
                <Code className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 border-emerald-700 shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-200">GitHub Contributions</p>
                <p className="text-3xl font-bold text-white">{stats.githubContributions}</p>
                <p className="text-xs text-emerald-300">
                  This year
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg">
                <GitBranch className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 border-purple-700 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-200">Contests</p>
                <p className="text-3xl font-bold text-white">{stats.contestsAttended}</p>
                <p className="text-xs text-purple-300">
                  Participated
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-500 flex items-center justify-center shadow-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 border-amber-700 shadow-2xl hover:shadow-amber-500/25 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-200">Current Rating</p>
                <p className="text-3xl font-bold text-white">{stats.currentRating.toLocaleString()}</p>
                <p className="text-xs text-amber-300">
                  Highest across platforms
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connected Platforms Section */}
      <Card className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 border-gray-700 shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-xl font-bold">Connected Platforms</CardTitle>
              <CardDescription className="text-gray-300">
                Your linked coding platforms and their detailed statistics
              </CardDescription>
            </div>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="h-4 w-4" />
              Add Platform
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {linkedPlatformsList.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {linkedPlatformsList.map((platform) => {
                const linkedUsername = linkedPlatforms[platform.id]
                const username = typeof linkedUsername === 'string' ? linkedUsername : linkedUsername?.username || ''
                const platformData = linkedPlatforms[platform.id]
                const statLines = getPlatformStatLines(platform.id, platformData)

                return (
                  <Card key={platform.id} className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105" style={{ borderLeftColor: platform.color, borderLeftWidth: '4px' }}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-12 w-12 rounded-xl flex items-center justify-center shadow-lg"
                            style={{ backgroundColor: platform.color + '20', border: `2px solid ${platform.color}` }}
                          >
                            <platform.icon className="h-6 w-6" style={{ color: platform.color }} />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-white">{platform.name}</h4>
                            <p className="text-sm text-gray-400">@{username}</p>
                          </div>
                        </div>
                        <Badge className="text-xs bg-green-600 text-white border-green-500 shadow-lg">
                          <Check className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      </div>

                      {/* Real stats */}
                      {statLines.length > 0 ? (
                        <div className="space-y-2 mb-4">
                          {statLines.map(({ label, value }) => (
                            <div key={label} className="flex justify-between text-sm">
                              <span className="text-gray-400">{label}</span>
                              <span className="font-semibold text-white capitalize">{value}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 mb-4">Sync to load stats</p>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                        <a
                          href={`${platform.url}/${username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-200"
                        >
                          View Profile
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-6 border-2 border-gray-600">
                <Code className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">No Platforms Connected</h3>
              <p className="text-gray-400 mb-6">
                Connect your coding platforms to see detailed statistics
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills Analysis Section */}
      <Card className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 border-indigo-700 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white text-xl font-bold">Skills Analysis</CardTitle>
          <CardDescription className="text-indigo-200">
            Insights based on your coding activity and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h4 className="font-bold mb-3 text-indigo-200">Activity Level</h4>
                <Badge className="text-sm bg-blue-600 text-white border-blue-500 shadow-lg px-4 py-2">
                  {stats.skillsAnalysis.activityLevel}
                </Badge>
              </div>
              <div>
                <h4 className="font-bold mb-3 text-indigo-200">Overall Rank</h4>
                <Badge className="text-sm bg-purple-600 text-white border-purple-500 shadow-lg px-4 py-2">
                  {stats.skillsAnalysis.overallRank}
                </Badge>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold mb-3 text-indigo-200">Primary Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {stats.skillsAnalysis.primaryLanguages.map((lang) => (
                    <Badge key={lang} className="text-xs bg-emerald-600 text-white border-emerald-500 shadow-md">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-3 text-indigo-200">Difficulty Distribution</h4>
                <div className="space-y-4">
                  {/* Easy */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-emerald-500 shadow-sm"></div>
                        <span className="text-sm font-medium text-white">Easy</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-400">{stats.skillsAnalysis.difficultyDistribution.easy}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-lg h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-lg transition-all duration-500 ease-out shadow-lg" 
                        style={{ 
                          width: `${Math.max(8, (stats.skillsAnalysis.difficultyDistribution.easy / Math.max(stats.skillsAnalysis.difficultyDistribution.easy, stats.skillsAnalysis.difficultyDistribution.medium, stats.skillsAnalysis.difficultyDistribution.hard)) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Medium */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-yellow-500 shadow-sm"></div>
                        <span className="text-sm font-medium text-white">Medium</span>
                      </div>
                      <span className="text-sm font-bold text-yellow-400">{stats.skillsAnalysis.difficultyDistribution.medium}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-lg h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full rounded-lg transition-all duration-500 ease-out shadow-lg" 
                        style={{ 
                          width: `${Math.max(8, (stats.skillsAnalysis.difficultyDistribution.medium / Math.max(stats.skillsAnalysis.difficultyDistribution.easy, stats.skillsAnalysis.difficultyDistribution.medium, stats.skillsAnalysis.difficultyDistribution.hard)) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Hard */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-red-500 shadow-sm"></div>
                        <span className="text-sm font-medium text-white">Hard</span>
                      </div>
                      <span className="text-sm font-bold text-red-400">{stats.skillsAnalysis.difficultyDistribution.hard}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-lg h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-red-400 to-red-600 h-full rounded-lg transition-all duration-500 ease-out shadow-lg" 
                        style={{ 
                          width: `${Math.max(8, (stats.skillsAnalysis.difficultyDistribution.hard / Math.max(stats.skillsAnalysis.difficultyDistribution.easy, stats.skillsAnalysis.difficultyDistribution.medium, stats.skillsAnalysis.difficultyDistribution.hard)) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}