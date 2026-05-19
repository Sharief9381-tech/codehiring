"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from "recharts"
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
  leetcode: "#FFA116",
  github: "#238636",
  codeforces: "#1890FF",
  codechef: "#5B4638",
  hackerrank: "#00EA64",
  hackerearth: "#2C3E50",
  geeksforgeeks: "#2F8D46",
  atcoder: "#888888",
  spoj: "#f97316",
  kattis: "#8b5cf6",
  topcoder: "#ef4444",
  interviewbit: "#06b6d4",
  cses: "#84cc16",
  codestudio: "#f472b6",
  exercism: "#a855f7",
  kaggle: "#22c55e",
  uva: "#64748b",
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
      } else {
        toast.error("Sync failed")
      }
    } catch {
      toast.error("Sync failed")
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-700 rounded w-1/4" />
                <div className="h-8 bg-gray-700 rounded w-1/2" />
                <div className="h-32 bg-gray-700 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!analytics || !analytics.hasStats) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5" />
              Analytics Dashboard
            </CardTitle>
            <Button
              onClick={handleSync}
              disabled={syncing}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Sync & Load"}
            </Button>
          </div>
          <CardDescription className="text-gray-400">
            {analytics?.message || "Connect platforms and sync to see analytics"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Target className="h-14 w-14 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-300 font-medium mb-1">No analytics data yet</p>
            <p className="text-sm text-gray-500">
              Connect a platform from the Dashboard, then click "Sync & Load" above.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { aggregatedStats, skillsAnalysis, progressData, platformStats, achievements } = analytics

  const difficultyData = [
    { name: "Easy", value: skillsAnalysis.difficultyDistribution.easy, color: "#10B981" },
    { name: "Medium", value: skillsAnalysis.difficultyDistribution.medium, color: "#F59E0B" },
    { name: "Hard", value: skillsAnalysis.difficultyDistribution.hard, color: "#EF4444" },
  ].filter(d => d.value > 0)

  const platformBarData = platformStats
    .filter((p: any) => p.problems > 0 || p.contributions > 0)
    .map((p: any) => ({
      name: p.platform.length > 10 ? p.platform.slice(0, 10) + "…" : p.platform,
      fullName: p.platform,
      problems: p.problems || 0,
      contributions: p.contributions || 0,
      rating: p.rating || 0,
      color: PLATFORM_COLORS[p.platformId] || "#64748b",
    }))

  const radarData = [
    { subject: "Problems", value: Math.min(100, (aggregatedStats.totalProblems / 5)) },
    { subject: "Contests", value: Math.min(100, aggregatedStats.contestsAttended * 5) },
    { subject: "Rating", value: Math.min(100, aggregatedStats.currentRating / 30) },
    { subject: "GitHub", value: Math.min(100, aggregatedStats.githubContributions / 10) },
    { subject: "Platforms", value: Math.min(100, (analytics.linkedPlatforms?.length || 0) * 15) },
  ]

  return (
    <div className="space-y-6">
      {/* Header with sync */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Your Analytics</h2>
          <p className="text-sm text-gray-400">
            Based on {analytics.linkedPlatforms?.length || 0} connected platform{analytics.linkedPlatforms?.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={handleSync}
          disabled={syncing}
          size="sm"
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : "Refresh Stats"}
        </Button>
      </div>

      {/* Overview stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-200">Total Problems</CardTitle>
            <Code className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{aggregatedStats.totalProblems}</div>
            <p className="text-xs text-blue-300 mt-1">Across all platforms</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-900 to-emerald-800 border-emerald-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-200">GitHub Contributions</CardTitle>
            <GitBranch className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{aggregatedStats.githubContributions}</div>
            <p className="text-xs text-emerald-300 mt-1">Total contributions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-200">Contests</CardTitle>
            <Trophy className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{aggregatedStats.contestsAttended}</div>
            <p className="text-xs text-purple-300 mt-1">Contests participated</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-900 to-amber-800 border-amber-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-200">Activity Level</CardTitle>
            <Activity className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{skillsAnalysis.activityLevel}</div>
            <p className="text-xs text-amber-300 mt-1">
              Rank: <span className="font-semibold">{skillsAnalysis.overallRank}</span>
            </p>
          </CardContent>
        </Card>

        {/* Global Rank */}
        <Card className="bg-gradient-to-br from-rose-900 to-rose-800 border-rose-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-rose-200">Global Rank</CardTitle>
            <Trophy className="h-4 w-4 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {ranking?.globalRank != null ? `#${ranking.globalRank}` : "—"}
            </div>
            <p className="text-xs text-rose-300 mt-1">
              {ranking?.totalGlobal ? `out of ${ranking.totalGlobal} students` : "by total problems solved"}
            </p>
          </CardContent>
        </Card>

        {/* College Rank */}
        <Card className="bg-gradient-to-br from-cyan-900 to-cyan-800 border-cyan-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-cyan-200">College Rank</CardTitle>
            <Star className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {ranking?.collegeRank != null ? `#${ranking.collegeRank}` : "—"}
            </div>
            <p className="text-xs text-cyan-300 mt-1">
              {ranking?.totalCollege ? `out of ${ranking.totalCollege} in ${ranking.myCollege}` : "no college data yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress + Radar row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="h-5 w-5" />
              Progress Over Time
            </CardTitle>
            <CardDescription className="text-gray-400">Cumulative problems solved</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#f9fafb" }} />
                <Line type="monotone" dataKey="problems" stroke="#60a5fa" strokeWidth={3} dot={{ fill: "#60a5fa", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="h-5 w-5" />
              Skill Radar
            </CardTitle>
            <CardDescription className="text-gray-400">Overall coding profile</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#6b7280", fontSize: 10 }} />
                <Radar name="You" dataKey="value" stroke="#818cf8" fill="#818cf8" fillOpacity={0.3} />
                <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#f9fafb" }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Platform comparison + Difficulty row */}
      <div className="grid gap-6 md:grid-cols-2">
        {platformBarData.length > 0 && (
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Problems by Platform</CardTitle>
              <CardDescription className="text-gray-400">Problems solved per platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={platformBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#f9fafb" }}
                    formatter={(value: any, name: any, props: any) => [value, props.payload.fullName]}
                  />
                  <Bar dataKey="problems" radius={[4, 4, 0, 0]}>
                    {platformBarData.map((entry: any, index: number) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {difficultyData.length > 0 ? (
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Difficulty Distribution</CardTitle>
              <CardDescription className="text-gray-400">LeetCode problems by difficulty</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {difficultyData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#f9fafb" }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ) : platformBarData.length === 0 ? (
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="flex items-center justify-center h-48">
              <p className="text-gray-500 text-sm">Sync platforms to see charts</p>
            </CardContent>
          </Card>
        ) : null}
      </div>

      {/* Per-platform stats table */}
      {platformStats.length > 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Platform Breakdown</CardTitle>
            <CardDescription className="text-gray-400">Stats from each connected platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {platformStats.map((p: any) => (
                <div
                  key={p.platformId}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-800 border border-gray-700"
                  style={{ borderLeftColor: PLATFORM_COLORS[p.platformId] || "#64748b", borderLeftWidth: 3 }}
                >
                  <div>
                    <p className="font-medium text-white text-sm">{p.platform}</p>
                    <p className="text-xs text-gray-400">@{p.username}</p>
                  </div>
                  <div className="flex gap-6 text-right">
                    {p.problems > 0 && (
                      <div>
                        <p className="text-sm font-bold text-white">{p.problems}</p>
                        <p className="text-xs text-gray-400">solved</p>
                      </div>
                    )}
                    {p.rating > 0 && (
                      <div>
                        <p className="text-sm font-bold text-yellow-400">{p.rating}</p>
                        <p className="text-xs text-gray-400">rating</p>
                      </div>
                    )}
                    {p.contests > 0 && (
                      <div>
                        <p className="text-sm font-bold text-purple-400">{p.contests}</p>
                        <p className="text-xs text-gray-400">contests</p>
                      </div>
                    )}
                    {p.contributions > 0 && (
                      <div>
                        <p className="text-sm font-bold text-green-400">{p.contributions}</p>
                        <p className="text-xs text-gray-400">contributions</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Award className="h-5 w-5" />
            Achievements
          </CardTitle>
          <CardDescription className="text-gray-400">Milestones unlocked from your activity</CardDescription>
        </CardHeader>
        <CardContent>
          {achievements.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {achievements.map((a: string) => (
                <Badge key={a} className="gap-1 bg-orange-600/80 text-white border-orange-500">
                  <Award className="h-3 w-3" />
                  {a}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Keep coding to unlock achievements!</p>
          )}
        </CardContent>
      </Card>

      {/* Skills summary */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Skills Summary</CardTitle>
          <CardDescription className="text-gray-400">Your expertise level and languages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Overall Rank:</span>
            <Badge className="bg-violet-600 text-white border-violet-500">{skillsAnalysis.overallRank}</Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Activity:</span>
            <Badge className="bg-amber-600 text-white border-amber-500">{skillsAnalysis.activityLevel}</Badge>
          </div>
          {skillsAnalysis.primaryLanguages?.length > 0 && (
            <div>
              <span className="text-sm text-gray-400 block mb-2">Primary Languages:</span>
              <div className="flex flex-wrap gap-2">
                {skillsAnalysis.primaryLanguages.map((lang: string) => (
                  <Badge key={lang} className="bg-fuchsia-600/80 text-white border-fuchsia-500">{lang}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
