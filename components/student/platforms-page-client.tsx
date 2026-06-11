"use client"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AddPlatformDialog } from "@/components/student/add-platform-dialog"
import { Code, GitBranch, Trophy, Globe, ExternalLink, Trash2, Check, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface PlatformsPageClientProps {
  student: any
}

// Dynamic color palette (same as dashboard)
const availableColors = [
  '#f97316', '#f59e0b', '#10b981', '#64748b', '#3b82f6',
  '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16', '#f472b6',
  '#a855f7', '#22c55e',
]

function getUniquePlatformColor(platformId: string, allPlatforms: string[]) {
  const idx = allPlatforms.indexOf(platformId)
  return availableColors[idx % availableColors.length]
}

export function PlatformsPageClient({ student: initialStudent }: PlatformsPageClientProps) {
  const [student, setStudent] = useState(initialStudent)
  const [syncing, setSyncing] = useState(false)
  const router = useRouter()

  const linkedPlatforms: Record<string, any> = student?.linkedPlatforms || {}
  const connectedIds = Object.keys(linkedPlatforms).filter(k => linkedPlatforms[k])

  const refreshStudent = useCallback(async () => {
    const res = await fetch("/api/auth/user", { cache: "no-store" })
    if (res.ok) {
      const data = await res.json()
      if (data.user) setStudent(data.user)
    }
    // Invalidate the server component cache so dashboard reflects changes
    router.refresh()
  }, [router])

  const handleUnlink = async (platformId: string, platformName: string) => {
    try {
      const res = await fetch("/api/platforms/link", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: platformId }),
      })
      if (res.ok) {
        toast.success(`Unlinked ${platformName}`)
        await refreshStudent()
      } else {
        toast.error("Failed to unlink platform")
      }
    } catch {
      toast.error("Failed to unlink platform")
    }
  }

  const handleSyncAll = async () => {
    setSyncing(true)
    try {
      const res = await fetch("/api/platforms/sync", { method: "POST" })
      if (res.ok) {
        const data = await res.json()
        if (data.linkedPlatforms) {
          setStudent((prev: any) => ({ ...prev, linkedPlatforms: data.linkedPlatforms }))
        } else {
          await refreshStudent()
        }
        const failed = data.summary?.failed ?? 0
        toast[failed > 0 ? "warning" : "success"](
          failed > 0 ? `Synced — ${failed} platform(s) unavailable` : `All ${data.summary?.successful ?? 0} platforms synced`
        )
        // Invalidate server cache so dashboard picks up fresh stats
        router.refresh()
      } else {
        toast.error("Sync failed")
      }
    } catch {
      toast.error("Sync failed")
    } finally {
      setSyncing(false)
    }
  }

  const handlePlatformAdded = useCallback(async () => {
    await new Promise(r => setTimeout(r, 800))
    await refreshStudent()
    toast.success("Platform connected!")
  }, [refreshStudent])

  const renderCard = (platformId: string, platformData: any) => {
    if (!platformData) return null

    const platformColor = getUniquePlatformColor(platformId, connectedIds)

    const platformConfigs: Record<string, any> = {
      leetcode:     { name: "LeetCode",         icon: Code,      getSummary: (s: any) => `${s?.totalSolved || 0} solved`,          getProfileUrl: (u: string) => `https://leetcode.com/u/${u}/` },
      codechef:     { name: "CodeChef",          icon: Code,      getSummary: (s: any) => s?.stars || '1*',                         getProfileUrl: (u: string) => `https://www.codechef.com/users/${u}` },
      hackerrank:   { name: "HackerRank",        icon: Trophy,    getSummary: (s: any) => `${s?.badges?.length || 0} badges`,       getProfileUrl: (u: string) => `https://www.hackerrank.com/profile/${u}` },
      github:       { name: "GitHub",            icon: GitBranch, getSummary: (s: any) => `${s?.publicRepos || 0} repos`,           getProfileUrl: (u: string) => `https://github.com/${u}` },
      codeforces:   { name: "Codeforces",        icon: Trophy,    getSummary: (s: any) => `${s?.rating || 0} rating`,               getProfileUrl: (u: string) => `https://codeforces.com/profile/${u}` },
      hackerearth:  { name: "HackerEarth",       icon: Code,      getSummary: (s: any) => `${s?.problemsSolved || 0} solved`,       getProfileUrl: (u: string) => `https://www.hackerearth.com/@${u}` },
      geeksforgeeks:{ name: "GeeksforGeeks",     icon: Globe,     getSummary: (s: any) => `${s?.codingScore || s?.score || 0} score`, getProfileUrl: (u: string) => `https://auth.geeksforgeeks.org/user/${u}/profile` },
      atcoder:      { name: "AtCoder",           icon: Trophy,    getSummary: (s: any) => `${s?.rating || 0} rating`,               getProfileUrl: (u: string) => `https://atcoder.jp/users/${u}` },
      spoj:         { name: "SPOJ",              icon: Code,      getSummary: (s: any) => `${s?.problemsSolved || 0} solved`,       getProfileUrl: (u: string) => `https://www.spoj.com/users/${u}/` },
      kattis:       { name: "Kattis",            icon: Trophy,    getSummary: (s: any) => `${s?.problemsSolved || 0} solved`,       getProfileUrl: (u: string) => `https://open.kattis.com/users/${u}` },
      topcoder:     { name: "TopCoder",          icon: Trophy,    getSummary: (s: any) => `${s?.rating || 0} rating`,               getProfileUrl: (u: string) => `https://www.topcoder.com/members/${u}` },
      interviewbit: { name: "InterviewBit",      icon: Code,      getSummary: (s: any) => `${s?.problemsSolved || 0} solved`,       getProfileUrl: (u: string) => `https://www.interviewbit.com/profile/${u}` },
      cses:         { name: "CSES Problem Set",  icon: Trophy,    getSummary: (s: any) => `${s?.problemsSolved || 0} solved`,       getProfileUrl: (u: string) => `https://cses.fi/user/${u}` },
      codestudio:   { name: "CodeStudio",        icon: Code,      getSummary: (s: any) => `${s?.problemsSolved || 0} solved`,       getProfileUrl: (u: string) => `https://www.codingninjas.com/studio/profile/${u}` },
      exercism:     { name: "Exercism",          icon: Globe,     getSummary: (s: any) => `${s?.completedExercises || 0} exercises`, getProfileUrl: (u: string) => `https://exercism.org/profiles/${u}` },
      kaggle:       { name: "Kaggle",            icon: Trophy,    getSummary: (s: any) => `${s?.tier || 'Novice'} tier`,            getProfileUrl: (u: string) => `https://www.kaggle.com/${u}` },
      uva:          { name: "UVa Online Judge",  icon: Code,      getSummary: (s: any) => `${s?.problemsSolved || 0} solved`,       getProfileUrl: (u: string) => `https://uhunt.onlinejudge.org/id/${u}` },
    }

    const config = platformConfigs[platformId] || {
      name: platformId.charAt(0).toUpperCase() + platformId.slice(1),
      icon: Globe,
      getSummary: (s: any) => s?.totalSolved ? `${s.totalSolved} solved` : s?.rating ? `${s.rating} rating` : 'Connected',
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

    const safeNum = (n: any, fallback = 'N/A') => (n == null || n === 0) ? (n === 0 ? '0' : fallback) : n.toLocaleString('en-US')

    return (
      <Card
        key={platformId}
        className="bg-card border-l-4 text-foreground relative h-80 w-full hover:shadow-md transition-shadow"
        style={{ borderLeftColor: platformColor }}
      >
        <CardContent className="p-6 pb-14 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: platformColor }}>
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

          {/* Stats body */}
          <div className="flex-1 space-y-1 overflow-hidden">
            {!stats || Object.keys(stats).length === 0 ? (
              <div className="text-center py-8">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded mb-2" />
                  <div className="h-4 bg-gray-700 rounded mb-2" />
                  <div className="h-4 bg-gray-700 rounded" />
                </div>
                <div className="mt-4 inline-flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  Fetching latest stats...
                </div>
              </div>
            ) : (
              <div className="space-y-4">

                {platformId === 'leetcode' && (
                  <>
                    <div>
                      <p className="text-xs text-gray-400">Problems Solved</p>
                      <div className="flex justify-between items-end">
                        <div className="text-center"><div className="text-lg font-bold text-green-400">{stats.easySolved || 0}</div><div className="text-xs text-gray-400">Easy</div></div>
                        <div className="text-center"><div className="text-lg font-bold text-yellow-400">{stats.mediumSolved || 0}</div><div className="text-xs text-gray-400">Medium</div></div>
                        <div className="text-center"><div className="text-lg font-bold text-red-400">{stats.hardSolved || 0}</div><div className="text-xs text-gray-400">Hard</div></div>
                      </div>
                    </div>
                    <div className="flex justify-center"><div className="flex w-full">
                      <div className="w-1/12" />
                      <div className="w-1/3 flex justify-center"><div className="text-center"><div className="text-sm font-bold text-blue-400">{safeNum(stats.ranking)}</div><div className="text-xs text-gray-400">Global Ranking</div></div></div>
                      <div className="w-1/6" />
                      <div className="w-1/3 flex justify-center"><div className="text-center"><div className="text-sm font-bold text-purple-400">{stats.contributionPoints || 0}</div><div className="text-xs text-gray-400">Contribution Points</div></div></div>
                      <div className="w-1/12" />
                    </div></div>
                  </>
                )}

                {platformId === 'codechef' && (
                  <>
                    <div>
                      <p className="text-xs text-gray-400">Coding Performance</p>
                      <div className="flex justify-between items-end">
                        <div className="text-center"><div className="text-lg font-bold text-orange-400">{stats.problemsSolved || 0}</div><div className="text-xs text-gray-400">Problems</div></div>
                        <div className="text-center"><div className="text-lg font-bold text-blue-400">{stats.currentRating || 0}</div><div className="text-xs text-gray-400">Current Rating</div></div>
                        <div className="text-center"><div className="text-lg font-bold text-yellow-400">{stats.stars || '1*'}</div><div className="text-xs text-gray-400">Stars</div></div>
                      </div>
                    </div>
                    <div className="flex justify-center"><div className="flex w-full">
                      <div className="w-1/12" />
                      <div className="w-1/3 flex justify-center"><div className="text-center"><div className="text-sm font-bold text-red-400">{stats.highestRating || 0}</div><div className="text-xs text-gray-400">Highest Rating</div></div></div>
                      <div className="w-1/6" />
                      <div className="w-1/3 flex justify-center"><div className="text-center"><div className="text-sm font-bold text-purple-400">{safeNum(stats.globalRank)}</div><div className="text-xs text-gray-400">Global Rank</div></div></div>
                      <div className="w-1/12" />
                    </div></div>
                  </>
                )}

                {platformId === 'geeksforgeeks' && (
                  <>
                    <div>
                      <p className="text-xs text-gray-400">GeeksforGeeks Performance</p>
                      <div className="flex justify-between items-end">
                        <div className="text-center"><div className="text-lg font-bold text-orange-400">{stats.codingScore || stats.score || 0}</div><div className="text-xs text-gray-400">Coding Score</div></div>
                        <div className="text-center"><div className="text-lg font-bold text-blue-400">{stats.problemsSolved || 0}</div><div className="text-xs text-gray-400">Problems</div></div>
                        <div className="text-center"><div className="text-lg font-bold text-purple-400">{stats.instituteRank || 0}</div><div className="text-xs text-gray-400">Institute Rank</div></div>
                      </div>
                    </div>
                    <div className="flex justify-center"><div className="flex w-full">
                      <div className="w-1/6" />
                      <div className="w-1/3 flex justify-center"><div className="text-center"><div className="text-sm font-bold text-green-400">{stats.currentStreak || 0}</div><div className="text-xs text-gray-400">Current Streak</div></div></div>
                      <div className="w-1/3 flex justify-center"><div className="text-center"><div className="text-sm font-bold text-cyan-400">{stats.potdsSolved || 0}</div><div className="text-xs text-gray-400">POTDs Solved</div></div></div>
                      <div className="w-1/6" />
                    </div></div>
                  </>
                )}

                {platformId === 'hackerrank' && (
                  <>
                    <div>
                      <p className="text-xs text-gray-400">Achievements Overview</p>
                      <div className="flex justify-between items-end">
                        <div className="text-center"><div className="text-lg font-bold text-yellow-400">{stats.badges?.length || 0}</div><div className="text-xs text-gray-400">Badges</div></div>
                        <div className="text-center"><div className="text-lg font-bold text-blue-400">{stats.certifications?.length || 0}</div><div className="text-xs text-gray-400">Certifications</div></div>
                        <div className="text-center"><div className="text-lg font-bold text-purple-400">{stats.skills?.length || 0}</div><div className="text-xs text-gray-400">Skills</div></div>
                      </div>
                    </div>
                    <div className="flex justify-center"><div className="flex w-full">
                      <div className="w-1/12" />
                      <div className="w-1/3 flex justify-center"><div className="text-center"><div className="text-sm font-bold text-green-400">{stats.totalScore || 0}</div><div className="text-xs text-gray-400">Total Score</div></div></div>
                      <div className="w-1/6" />
                      <div className="w-1/3 flex justify-center"><div className="text-center"><div className="text-sm font-bold text-orange-400">{safeNum(stats.globalRank)}</div><div className="text-xs text-gray-400">Global Rank</div></div></div>
                      <div className="w-1/12" />
                    </div></div>
                  </>
                )}

                {platformId === 'github' && (
                  <>
                    <div>
                      <p className="text-xs text-gray-400">Development Activity</p>
                      <div className="flex justify-between items-end">
                        <div className="text-center"><div className="text-lg font-bold text-green-400">{stats.totalContributions || 0}</div><div className="text-xs text-gray-400">Contributions</div></div>
                        <div className="text-center"><div className="text-lg font-bold text-blue-400">{stats.publicRepos || 0}</div><div className="text-xs text-gray-400">Repositories</div></div>
                        <div className="text-center"><div className="text-lg font-bold text-purple-400">{safeNum(stats.followers, '0')}</div><div className="text-xs text-gray-400">Followers</div></div>
                      </div>
                    </div>
                    <div className="flex justify-center"><div className="flex w-full">
                      <div className="w-1/12" />
                      <div className="w-1/3 flex justify-center"><div className="text-center"><div className="text-sm font-bold text-yellow-400">{Object.keys(stats.languages || {}).length}</div><div className="text-xs text-gray-400">Languages</div></div></div>
                      <div className="w-1/6" />
                      <div className="w-1/3 flex justify-center"><div className="text-center"><div className="text-sm font-bold text-orange-400">{safeNum(stats.following, '0')}</div><div className="text-xs text-gray-400">Following</div></div></div>
                      <div className="w-1/12" />
                    </div></div>
                  </>
                )}

                {platformId === 'codeforces' && (
                  <>
                    <div>
                      <p className="text-xs text-gray-400">Competitive Programming</p>
                      <div className="flex justify-between items-end">
                        <div className="text-center"><div className="text-lg font-bold text-orange-400">{stats.problemsSolved || 0}</div><div className="text-xs text-gray-400">Problems</div></div>
                        <div className="text-center"><div className="text-lg font-bold text-blue-400">{stats.rating || 0}</div><div className="text-xs text-gray-400">Rating</div></div>
                        <div className="text-center"><div className="text-lg font-bold text-purple-400">{stats.contests?.length || 0}</div><div className="text-xs text-gray-400">Contests</div></div>
                      </div>
                    </div>
                    <div className="flex justify-center"><div className="flex w-full">
                      <div className="w-1/12" />
                      <div className="w-1/3 flex justify-center"><div className="text-center"><div className="text-sm font-bold text-red-400">{stats.maxRating || 0}</div><div className="text-xs text-gray-400">Max Rating</div></div></div>
                      <div className="w-1/6" />
                      <div className="w-1/3 flex justify-center"><div className="text-center"><div className="text-sm font-bold text-green-400">{stats.rank || 'Unrated'}</div><div className="text-xs text-gray-400">Rank</div></div></div>
                      <div className="w-1/12" />
                    </div></div>
                  </>
                )}

                {platformId === 'hackerearth' && (
                  <>
                    <div>
                      <p className="text-xs text-gray-400">Coding Performance</p>
                      <div className="flex justify-between items-end">
                        <div className="text-center"><div className="text-lg font-bold text-purple-400">{stats.problemsSolved || 0}</div><div className="text-xs text-gray-400">Problems</div></div>
                        <div className="text-center"><div className="text-lg font-bold text-blue-400">{stats.rating || 0}</div><div className="text-xs text-gray-400">Rating</div></div>
                        <div className="text-center"><div className="text-lg font-bold text-green-400">{stats.contests?.length || 0}</div><div className="text-xs text-gray-400">Contests</div></div>
                      </div>
                    </div>
                    <div className="flex justify-center"><div className="flex w-full">
                      <div className="w-1/12" />
                      <div className="w-1/3 flex justify-center"><div className="text-center"><div className="text-sm font-bold text-red-400">{stats.maxRating || 0}</div><div className="text-xs text-gray-400">Max Rating</div></div></div>
                      <div className="w-1/6" />
                      <div className="w-1/3 flex justify-center"><div className="text-center"><div className="text-sm font-bold text-yellow-400">{safeNum(stats.globalRank)}</div><div className="text-xs text-gray-400">Global Rank</div></div></div>
                      <div className="w-1/12" />
                    </div></div>
                  </>
                )}

                {platformId === 'atcoder' && (
                  <>
                    <div>
                      <p className="text-xs text-gray-400">Competitive Programming</p>
                      <div className="flex justify-between items-end">
                        <div className="text-center"><div className="text-lg font-bold text-blue-400">{stats.rating || 0}</div><div className="text-xs text-gray-400">Rating</div></div>
                        <div className="text-center"><div className="text-lg font-bold text-green-400">{stats.problemsSolved || 0}</div><div className="text-xs text-gray-400">Problems</div></div>
                        <div className="text-center"><div className="text-lg font-bold text-purple-400">{stats.contests?.length || 0}</div><div className="text-xs text-gray-400">Contests</div></div>
                      </div>
                    </div>
                    <div className="flex justify-center"><div className="flex w-full">
                      <div className="w-1/6" />
                      <div className="w-1/3 flex justify-center"><div className="text-center"><div className="text-sm font-bold text-orange-400">{stats.highestRating || 0}</div><div className="text-xs text-gray-400">Highest Rating</div></div></div>
                      <div className="w-1/3 flex justify-center"><div className="text-center"><div className="text-sm font-bold text-cyan-400">{stats.rank || 'Unrated'}</div><div className="text-xs text-gray-400">Rank</div></div></div>
                      <div className="w-1/6" />
                    </div></div>
                  </>
                )}

                {platformId === 'spoj' && (
                  <>
                    <div>
                      <p className="text-xs text-gray-400">Judge Performance</p>
                      <div className="flex justify-between items-end">
                        <div className="text-center"><div className="text-lg font-bold text-green-400">{stats.problemsSolved || 0}</div><div className="text-xs text-gray-400">Problems</div></div>
                        <div className="text-center"><div className="text-lg font-bold text-blue-400">{stats.score || 0}</div><div className="text-xs text-gray-400">Score</div></div>
                        <div className="text-center"><div className="text-lg font-bold text-purple-400">{stats.rank || stats.worldRank || 0}</div><div className="text-xs text-gray-400">World Rank</div></div>
                      </div>
                    </div>
                  </>
                )}

                {platformId === 'kattis' && (
                  <>
                    <div>
                      <p className="text-xs text-gray-400">Contest Performance</p>
                      <div className="flex justify-between items-end">
                        <div className="text-center"><div className="text-lg font-bold text-green-400">{stats.problemsSolved || 0}</div><div className="text-xs text-gray-400">Problems</div></div>
                        <div className="text-center"><div className="text-lg font-bold text-blue-400">{stats.score || 0}</div><div className="text-xs text-gray-400">Score</div></div>
                        <div className="text-center"><div className="text-lg font-bold text-purple-400">{stats.rank || 0}</div><div className="text-xs text-gray-400">Rank</div></div>
                      </div>
                    </div>
                  </>
                )}

                {!['leetcode','codechef','hackerrank','github','codeforces','hackerearth','geeksforgeeks','atcoder','spoj','kattis','topcoder','interviewbit','cses','codestudio','exercism','kaggle','uva'].includes(platformId) && (
                  <div>
                    <p className="text-xs text-gray-400">Platform Performance</p>
                    <div className="flex justify-between items-end">
                      <div className="text-center"><div className="text-lg font-bold text-blue-400">{stats.problemsSolved || stats.totalSolved || 0}</div><div className="text-xs text-gray-400">Problems</div></div>
                      <div className="text-center"><div className="text-lg font-bold text-green-400">{stats.rating || stats.score || 0}</div><div className="text-xs text-gray-400">Rating</div></div>
                      <div className="text-center"><div className="text-lg font-bold text-purple-400">{stats.rank || stats.globalRank || 0}</div><div className="text-xs text-gray-400">Rank</div></div>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </CardContent>

        {/* Footer bar — View Details | Verified | Delete */}
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-gray-700 bg-gray-800/50">
          <div className="flex items-center justify-between">
            <a
              href={config.getProfileUrl(username)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
            >
              View Details <ExternalLink className="h-4 w-4" />
            </a>
            <div className="flex-1 flex justify-center">
              <Badge className="text-xs gap-1 bg-green-600 hover:bg-green-700 text-white border-green-500 shadow-lg">
                <Check className="h-3 w-3" /> Verified
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUnlink(platformId, config.name)}
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
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {connectedIds.length} platform{connectedIds.length !== 1 ? "s" : ""} connected
        </p>
        <div className="flex gap-2">
          {connectedIds.length > 0 && (
            <Button variant="outline" size="sm" className="gap-2" onClick={handleSyncAll} disabled={syncing}>
              <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Sync All"}
            </Button>
          )}
          <AddPlatformDialog onPlatformAdded={handlePlatformAdded} connectedPlatforms={connectedIds} />
        </div>
      </div>

      {/* Empty state */}
      {connectedIds.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Platforms Connected</h3>
            <p className="text-muted-foreground mb-6">Connect your coding platforms to track your progress</p>
            <AddPlatformDialog onPlatformAdded={handlePlatformAdded} connectedPlatforms={[]} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {connectedIds.map(platformId => renderCard(platformId, linkedPlatforms[platformId]))}
        </div>
      )}
    </div>
  )
}
