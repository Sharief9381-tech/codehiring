"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AddPlatformDialog } from "@/components/student/add-platform-dialog"
import { Code, GitBranch, Trophy, Globe, ExternalLink, Trash2, Check, RefreshCw, LayoutDashboard } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

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
  geeksforgeeks:{ name: "GeeksforGeeks", color: "#2F8D46", icon: Globe,     profileUrl: u => `https://www.geeksforgeeks.org/user/${u}` },
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

function getStatLines(platformId: string, stats: any): { label: string; value: string | number }[] {
  if (!stats) return []
  switch (platformId) {
    case "leetcode":    return [
      { label: "Solved",  value: stats.totalSolved ?? 0 },
      { label: "Easy",    value: stats.easySolved ?? 0 },
      { label: "Medium",  value: stats.mediumSolved ?? 0 },
      { label: "Hard",    value: stats.hardSolved ?? 0 },
      { label: "Ranking", value: stats.ranking ? `#${stats.ranking.toLocaleString()}` : "—" },
    ]
    case "github":      return [
      { label: "Repos",         value: stats.publicRepos ?? 0 },
      { label: "Contributions", value: stats.totalContributions ?? 0 },
      { label: "Followers",     value: stats.followers ?? 0 },
    ]
    case "codeforces":  return [
      { label: "Rating",   value: stats.rating ?? 0 },
      { label: "Rank",     value: stats.rank ?? "unrated" },
      { label: "Max Rating", value: stats.maxRating ?? stats.rating ?? 0 },
    ]
    case "codechef":    return [
      { label: "Rating",   value: stats.currentRating ?? 0 },
      { label: "Stars",    value: stats.stars ?? "—" },
      { label: "Solved",   value: stats.problemsSolved ?? 0 },
    ]
    case "hackerrank":  return [
      { label: "Badges",   value: stats.badges?.length ?? 0 },
      { label: "Score",    value: stats.totalScore ?? 0 },
      { label: "Rank",     value: stats.globalRank ?? "—" },
    ]
    case "geeksforgeeks": return [
      { label: "Solved",        value: stats.problemsSolved ?? 0 },
      { label: "Coding Score",  value: stats.codingScore ?? 0 },
      { label: "Streak",        value: stats.currentStreak ? `${stats.currentStreak}d` : "—" },
      { label: "Institute Rank",value: stats.instituteRank || "—" },
    ]
    default: {
      const lines = []
      const solved = stats.totalSolved ?? stats.problemsSolved ?? 0
      const rating = stats.rating ?? stats.currentRating ?? 0
      if (solved > 0) lines.push({ label: "Solved", value: solved })
      if (rating > 0) lines.push({ label: "Rating", value: rating })
      return lines
    }
  }
}

export function PlatformsPageClient({ student: initialStudent }: PlatformsPageClientProps) {
  const [student, setStudent] = useState(initialStudent)
  const [syncing, setSyncing] = useState(false)

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

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {connectedIds.length} platform{connectedIds.length !== 1 ? "s" : ""} connected
          </p>
          <Link href="/student/dashboard">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
              <LayoutDashboard className="h-3.5 w-3.5" />
              View Dashboard
            </Button>
          </Link>
        </div>
        <div className="flex gap-2">
          {connectedIds.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleSyncAll}
              disabled={syncing}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Sync All"}
            </Button>
          )}
          <AddPlatformDialog
            onPlatformAdded={handlePlatformAdded}
            connectedPlatforms={connectedIds}
          />
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
            const lastSync = typeof data === "object" && data.lastSync
              ? new Date(data.lastSync).toLocaleString()
              : null
            const statLines = getStatLines(platformId, stats)

            return (
              <Card
                key={platformId}
                className="border-l-4 bg-card relative"
                style={{ borderLeftColor: config.color }}
              >
                <CardContent className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4 gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: config.color + "20", border: `1px solid ${config.color}` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: config.color }} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-foreground truncate">{config.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">@{username}</p>
                      </div>
                    </div>
                    <Badge className="shrink-0 text-xs bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30">
                      <Check className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  </div>

                  {/* Stats */}
                  {statLines.length > 0 ? (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                      {statLines.map(({ label, value }) => (
                        <div key={label} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-semibold text-foreground capitalize">
                            {value === null || value === undefined || (typeof value === 'number' && isNaN(value as number)) ? "—" : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mb-4">
                      {stats === null ? "Sync to load stats" : "No stats available"}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="text-xs text-muted-foreground mb-3 space-y-0.5">
                    {linkedAt && <p>Linked: {linkedAt}</p>}
                    {lastSync && <p>Last sync: {lastSync}</p>}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <a
                      href={config.profileUrl(username)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      View Profile <ExternalLink className="h-3 w-3" />
                    </a>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleUnlink(platformId)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
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
