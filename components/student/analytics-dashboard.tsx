"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts"
import Link from "next/link"
import { MonthlyProblemsChart } from "@/components/student/monthly-problems-chart"
import {
  TrendingUp, Award, Target, Calendar, Trophy, Star,
  RefreshCw, Code, GitBranch, Zap, Activity
} from "lucide-react"
import type { StudentProfile } from "@/lib/types"
import { toast } from "sonner"

interface AnalyticsDashboardProps {
  student: StudentProfile
}

const PLATFORM_COLORS: Record<string, string> = {
  leetcode: "#FFA116", github: "#238636", codeforces: "#1890FF",
  codechef: "#5B4638", hackerrank: "#00EA64", hackerearth: "#2C3E50",
  geeksforgeeks: "#2F8D46", atcoder: "#888888", spoj: "#f97316",
  kattis: "#8b5cf6", topcoder: "#ef4444", interviewbit: "#06b6d4",
  cses: "#84cc16", codestudio: "#f472b6", exercism: "#a855f7",
  kaggle: "#22c55e", uva: "#64748b",
}

export function AnalyticsDashboard({ student }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [ranking, setRanking] = useState<any>(null)

  const fetchAnalytics = useCallback(async () => {
    try {
      const [analyticsRes, rankingRes] = await Promise.all([
        fetch("/api/student/analytics", { cache: "no-store" }),
        fetch("/api/student/ranking", { cache: "no-store" }),
      ])
      if (analyticsRes.ok) setAnalytics(await analyticsRes.json())
      if (rankingRes.ok) setRanking(await rankingRes.json())
    } catch (e) {
      console.error("Analytics fetch error:", e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAnalytics() }, [fetchAnalytics])

  const handleSync = async () => {
    setSyncing(true)
    try {
      const res = await fetch("/api/platforms/sync", { method: "POST" })
      if (res.ok) {
        toast.success("Stats synced! Refreshing analytics...")
        setLoading(true)
        await fetchAnalytics()
      } else { toast.error("Sync failed") }
    } catch { toast.error("Sync failed") }
    finally { setSyncing(false) }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-8 bg-muted rounded w-1/2" />
                <div className="h-32 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!analytics || !analytics.hasStats) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Analytics</CardTitle>
            <Button onClick={handleSync} disabled={syncing} size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Sync & Load"}
            </Button>
          </div>
          <CardDescription>{analytics?.message || "Connect platforms and sync to see analytics"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Target className="h-14 w-14 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium mb-1">No analytics data yet</p>
            <p className="text-sm text-muted-foreground">Connect a platform, then click "Sync & Load".</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { aggregatedStats, skillsAnalysis, progressData, platformStats, achievements } = analytics

  // ── Combined stacked chart ────────────────────────────────────────────────
  // For each platform build a stacked bar: Easy (green), Medium (amber), Hard (red), Other (slate)
  const combinedData = platformStats
    .filter((p: any) => (p.problems || 0) > 0)
    .map((p: any) => {
      // Try to get difficulty from the raw linked platform data
      const lp: any = student.linkedPlatforms
      const raw = lp?.[p.platformId]
      const s = raw && typeof raw === 'object' && 'stats' in raw ? (raw as any).stats : null

      const easy   = s?.easySolved   || s?.easyCount   || 0
      const medium = s?.mediumSolved || s?.mediumCount || 0
      const hard   = s?.hardSolved   || s?.hardCount   || 0
      const total  = p.problems || 0
      const other  = Math.max(0, total - easy - medium - hard)

      return {
        name: p.platform.length > 10 ? p.platform.slice(0, 9) + "…" : p.platform,
        fullName: p.platform,
        easy,
        medium,
        hard,
        other,
        total,
        color: PLATFORM_COLORS[p.platformId] || "#64748b",
      }
    })
    .sort((a: any, b: any) => b.total - a.total)

  const radarData = [
    { subject: "Problems", value: Math.min(100, (aggregatedStats.totalProblems / 5)) },
    { subject: "Contests", value: Math.min(100, aggregatedStats.contestsAttended * 5) },
    { subject: "Rating",   value: Math.min(100, aggregatedStats.currentRating / 30) },
    { subject: "GitHub",   value: Math.min(100, aggregatedStats.githubContributions / 10) },
    { subject: "Platforms",value: Math.min(100, (analytics.linkedPlatforms?.length || 0) * 15) },
  ]

  const tooltipStyle = {
    contentStyle: { backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Analytics</h2>
          <p className="text-sm text-muted-foreground">
            {analytics.linkedPlatforms?.length || 0} platform{analytics.linkedPlatforms?.length !== 1 ? "s" : ""} connected
          </p>
        </div>
        <Button onClick={handleSync} disabled={syncing} size="sm" variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : "Refresh"}
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Total Problems", val: aggregatedStats.totalProblems, sub: "Across all platforms", icon: Code, gradient: "from-blue-900 to-blue-800", border: "border-blue-700", text: "text-blue-200", sub2: "text-blue-300", iconC: "text-blue-400", href: "/student/platforms" },
          { label: "GitHub Contributions", val: aggregatedStats.githubContributions, sub: "Total contributions", icon: GitBranch, gradient: "from-emerald-900 to-emerald-800", border: "border-emerald-700", text: "text-emerald-200", sub2: "text-emerald-300", iconC: "text-emerald-400", href: "/student/platforms" },
          { label: "Contests", val: aggregatedStats.contestsAttended, sub: "Participated", icon: Trophy, gradient: "from-purple-900 to-purple-800", border: "border-purple-700", text: "text-purple-200", sub2: "text-purple-300", iconC: "text-purple-400", href: "/student/analytics" },
          { label: "Activity Level", val: skillsAnalysis.activityLevel, sub: `Rank: ${skillsAnalysis.overallRank}`, icon: Activity, gradient: "from-amber-900 to-amber-800", border: "border-amber-700", text: "text-amber-200", sub2: "text-amber-300", iconC: "text-amber-400", href: "/student/analytics" },
          { label: "Global Rank", val: ranking?.globalRank != null ? `#${ranking.globalRank}` : "—", sub: ranking?.totalGlobal ? `of ${ranking.totalGlobal} students` : "by problems", icon: Trophy, gradient: "from-rose-900 to-rose-800", border: "border-rose-700", text: "text-rose-200", sub2: "text-rose-300", iconC: "text-rose-400", href: "/student/leaderboard" },
          { label: "College Rank", val: ranking?.collegeRank != null ? `#${ranking.collegeRank}` : "—", sub: ranking?.totalCollege ? `of ${ranking.totalCollege}` : "no data yet", icon: Star, gradient: "from-cyan-900 to-cyan-800", border: "border-cyan-700", text: "text-cyan-200", sub2: "text-cyan-300", iconC: "text-cyan-400", href: "/student/leaderboard" },
        ].map(c => (
          <Link key={c.label} href={c.href}>
            <Card className={`bg-gradient-to-br ${c.gradient} ${c.border} cursor-pointer hover:scale-[1.02] transition-transform`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className={`text-sm font-medium ${c.text}`}>{c.label}</CardTitle>
                <c.icon className={`h-4 w-4 ${c.iconC}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{c.val}</div>
                <p className={`text-xs ${c.sub2} mt-1`}>{c.sub}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Monthly Problems Chart + Skill Radar */}
      <div className="grid gap-6 md:grid-cols-2">
        <MonthlyProblemsChart />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Zap className="h-4 w-4 text-violet-500" />Skill Radar</CardTitle>
            <CardDescription>Overall coding profile strength</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <defs>
                  <linearGradient id="radarGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                <Radar name="You" dataKey="value" stroke="#818cf8" fill="#818cf8" fillOpacity={0.25} strokeWidth={2} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "10px", color: "hsl(var(--foreground))" }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Distribution by Platform — half grid */}
      {combinedData.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Difficulty by Platform</CardTitle>
              <CardDescription>
                <span className="text-emerald-500 font-medium">■ Easy</span>
                {' · '}
                <span className="text-amber-500 font-medium">■ Medium</span>
                {' · '}
                <span className="text-red-500 font-medium">■ Hard</span>
                {' · '}
                <span className="text-slate-400 font-medium">■ Unrated</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={combinedData} margin={{ top: 8, right: 8, left: -20, bottom: 8 }} barCategoryGap="30%">
                  <defs>
                    <linearGradient id="easyGrad"  x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#10b981" /></linearGradient>
                    <linearGradient id="medGrad"   x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fcd34d" /><stop offset="100%" stopColor="#f59e0b" /></linearGradient>
                    <linearGradient id="hardGrad"  x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f87171" /><stop offset="100%" stopColor="#ef4444" /></linearGradient>
                    <linearGradient id="otherGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#cbd5e1" /><stop offset="100%" stopColor="#94a3b8" /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={false}
                    contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "10px", color: "hsl(var(--foreground))" }}
                    formatter={(value: any, name: string, props: any) => {
                      const labels: Record<string, string> = { easy: "Easy", medium: "Medium", hard: "Hard", other: "Unrated" }
                      return [value, labels[name] || name]
                    }}
                    labelFormatter={(_: any, payload: any[]) => payload?.[0]?.payload?.fullName || _}
                  />
                  <Bar dataKey="easy"   stackId="s" fill="url(#easyGrad)"  name="easy"   radius={[0,0,0,0]} />
                  <Bar dataKey="medium" stackId="s" fill="url(#medGrad)"   name="medium" radius={[0,0,0,0]} />
                  <Bar dataKey="hard"   stackId="s" fill="url(#hardGrad)"  name="hard"   radius={[0,0,0,0]} />
                  <Bar dataKey="other"  stackId="s" fill="url(#otherGrad)" name="other"  radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Achievements — beside the bar chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Award className="h-4 w-4 text-amber-500" />Achievements</CardTitle>
              <CardDescription>Milestones unlocked from your activity</CardDescription>
            </CardHeader>
            <CardContent>
              {achievements.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {achievements.map((a: string) => (
                    <Badge key={a} className="gap-1 bg-orange-600/80 text-foreground border-orange-500">
                      <Award className="h-3 w-3" />{a}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Keep coding to unlock achievements!</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  )
}
