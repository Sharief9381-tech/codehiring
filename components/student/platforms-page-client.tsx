"use client"

import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AddPlatformDialog } from "@/components/student/add-platform-dialog"
import { Code, GitBranch, Trophy, Globe, ExternalLink, Trash2, Check, RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface PlatformsPageClientProps {
  student: any
}

const PLATFORM_CONFIG: Record<string, { name: string; color: string; icon: any; profileUrl: (u: string) => string }> = {
  leetcode:     { name: "LeetCode",      color: "#FFA116", icon: Code,      profileUrl: u => `https://leetcode.com/u/${u}` },
  github:       { name: "GitHub",        color: "#238636", icon: GitBranch, profileUrl: u => `https://github.com/${u}` },
  codeforces:   { name: "Codeforces",    color: "#1890FF", icon: Trophy,    profileUrl: u => `https://codeforces.com/profile/${u}` },
  codechef:     { name: "CodeChef",      color: "#5B4638", icon: Code,      profileUrl: u => `https://codechef.com/users/${u}` },
  hackerrank:   { name: "HackerRank",    color: "#00EA64", icon: Trophy,    profileUrl: u => `https://hackerrank.com/profile/${u}` },
  hackerearth:  { name: "HackerEarth",   color: "#2C3E50", icon: Code,      profileUrl: u => `https://hackerearth.com/@${u}` },
  geeksforgeeks:{ name: "GeeksforGeeks", color: "#2F8D46", icon: Globe,     profileUrl: u => `https://auth.geeksforgeeks.org/user/${u}` },
  atcoder:      { name: "AtCoder",       color: "#222222", icon: Trophy,    profileUrl: u => `https://atcoder.jp/users/${u}` },
  spoj:         { name: "SPOJ",          color: "#f97316", icon: Code,      profileUrl: u => `https://spoj.com/users/${u}` },
  kattis:       { name: "Kattis",        color: "#8b5cf6", icon: Trophy,    profileUrl: u => `https://open.kattis.com/users/${u}` },
  topcoder:     { name: "TopCoder",      color: "#ef4444", icon: Trophy,    profileUrl: u => `https://topcoder.com/members/${u}` },
  interviewbit: { name: "InterviewBit",  color: "#06b6d4", icon: Code,      profileUrl: u => `https://interviewbit.com/profile/${u}` },
  cses:         { name: "CSES",          color: "#84cc16", icon: Trophy,    profileUrl: u => `https://cses.fi/user/${u}` },
  codestudio:   { name: "CodeStudio",    color: "#f472b6", icon: Code,      profileUrl: u => `https://codingninjas.com/studio/profile/${u}` },
  exercism:     { name: "Exercism",      color: "#a855f7", icon: Globe,     profileUrl: u => `https://exercism.org/profiles/${u}` },
  kaggle:       { name: "Kaggle",        color: "#22c55e", icon: Trophy,    profileUrl: u => `https://kaggle.com/${u}` },
  uva:          { name: "UVa OJ",        color: "#64748b", icon: Code,      profileUrl: u => `https://uhunt.onlinejudge.org/id/${u}` },
}

function getStatsSummary(platformId: string, stats: any): string {
  if (!stats) return "No stats yet"
  if (platformId === "github") return `${stats.publicRepos || 0} repos · ${stats.totalContributions || 0} contributions`
  if (platformId === "leetcode") return `${stats.totalSolved || 0} solved · ${stats.contestRating || 0} rating`
  if (platformId === "codeforces") return `${stats.rating || 0} rating · ${stats.rank || "unrated"}`
  if (platformId === "codechef") return `${stats.currentRating || 0} rating · Global #${stats.globalRank || "—"}`
  if (platformId === "hackerrank") return `${stats.badges?.length || 0} badges · score ${stats.totalScore || 0}`
  if (platformId === "geeksforgeeks") return `${stats.codingScore || 0} score · ${stats.problemsSolved || 0} solved`
  const solved = stats.totalSolved || stats.problemsSolved || 0
  const rating = stats.rating || stats.currentRating || 0
  if (solved > 0) return `${solved} solved`
  if (rating > 0) return `${rating} rating`
  return "Connected"
}

export function PlatformsPageClient({ student: initialStudent }: PlatformsPageClientProps) {
  const [student, setStudent] = useState(initialStudent)
  const [syncing, setSyncing] = useState<string | null>(null)

  const linkedPlatforms: Record<string, any> = student?.linkedPlatforms || {}
  const connectedIds = Object.keys(linkedPlatforms).filter(k => linkedPlatforms[k])

  const refreshStudent = useCallback(async () => {
    const res = await fetch("/api/auth/user", { cache: "no-store" })
    if (res.ok) {
      const data = await res.json()
      if (data.user) setStudent(data.user)
    }
  }, [])

  const handleUnlink = async (platformId: string) => {
    try {
      const res = await fetch("/api/platforms/link", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: platformId }),
      })
      if (res.ok) {
        toast.success(`Unlinked ${PLATFORM_CONFIG[platformId]?.name || platformId}`)
        await refreshStudent()
      } else {
        toast.error("Failed to unlink platform")
      }
    } catch {
      toast.error("Failed to unlink platform")
    }
  }

  const handleSync = async (platformId: string) => {
    setSyncing(platformId)
    try {
      const res = await fetch("/api/platforms/sync", { method: "POST" })
      if (res.ok) {
        const data = await res.json()
        // Update student state with fresh linkedPlatforms from sync response
        if (data.linkedPlatforms) {
          setStudent((prev: any) => ({ ...prev, linkedPlatforms: data.linkedPlatforms }))
        } else {
          await refreshStudent()
        }
        const failed = data.summary?.failed ?? 0
        if (failed > 0) {
          toast.warning(`Synced with ${failed} platform(s) unable to fetch data`)
        } else {
          toast.success("Stats synced successfully")
        }
      } else {
        toast.error("Sync failed")
      }
    } catch {
      toast.error("Sync failed")
    } finally {
      setSyncing(null)
    }
  }

  const handlePlatformAdded = useCallback(async () => {
    await new Promise(r => setTimeout(r, 800))
    await refreshStudent()
    toast.success("Platform connected!")
  }, [refreshStudent])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {connectedIds.length} platform{connectedIds.length !== 1 ? "s" : ""} connected
          </p>
        </div>
        <AddPlatformDialog
          onPlatformAdded={handlePlatformAdded}
          connectedPlatforms={connectedIds}
        />
      </div>

      {connectedIds.length === 0 ? (
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="text-center py-16">
            <Code className="h-12 w-12 mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Platforms Connected</h3>
            <p className="text-gray-400 mb-6">Connect your coding platforms to track your progress</p>
            <AddPlatformDialog onPlatformAdded={handlePlatformAdded} connectedPlatforms={[]} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {connectedIds.map(platformId => {
            const data = linkedPlatforms[platformId]
            const config = PLATFORM_CONFIG[platformId] || {
              name: platformId.charAt(0).toUpperCase() + platformId.slice(1),
              color: "#64748b",
              icon: Globe,
              profileUrl: (u: string) => `https://${platformId}.com/${u}`,
            }
            const Icon = config.icon
            const username = typeof data === "object" ? data.username : data
            const stats = typeof data === "object" ? data.stats : null
            const linkedAt = typeof data === "object" && data.linkedAt
              ? new Date(data.linkedAt).toLocaleDateString()
              : null

            return (
              <Card
                key={platformId}
                className="bg-gray-900 border-l-4 border-gray-700 text-white relative"
                style={{ borderLeftColor: config.color }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: config.color + "20", border: `1px solid ${config.color}` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: config.color }} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{config.name}</h4>
                        <p className="text-xs text-gray-400">@{username}</p>
                      </div>
                    </div>
                    <Badge className="text-xs bg-green-700 text-white border-green-600">
                      <Check className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  </div>

                  <div className="text-sm text-gray-300 mb-3">
                    {getStatsSummary(platformId, stats)}
                  </div>

                  {linkedAt && (
                    <p className="text-xs text-gray-500 mb-3">Linked on {linkedAt}</p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <a
                      href={config.profileUrl(username)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                    >
                      View Profile <ExternalLink className="h-3 w-3" />
                    </a>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-gray-400 hover:text-white"
                        onClick={() => handleSync(platformId)}
                        disabled={syncing === platformId}
                      >
                        <RefreshCw className={`h-3 w-3 ${syncing === platformId ? "animate-spin" : ""}`} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => handleUnlink(platformId)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
