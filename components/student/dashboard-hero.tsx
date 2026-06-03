"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  RefreshCw, TrendingUp, BarChart3, Briefcase,
  Globe, Building2, Zap, CheckCircle2, Circle,
  Code2, GitBranch, Trophy, Star, Award, Target,
  ArrowUp, Eye, Sparkles, ExternalLink, AlertCircle
} from "lucide-react"
import type { StudentProfile } from "@/lib/types"

interface DashboardHeroProps {
  student: StudentProfile
  onSync: () => void
  isSyncing: boolean
}

interface RankData {
  globalRank: number | null
  collegeRank: number | null
  totalGlobal: number
  totalCollege: number
  myProblems: number
}

interface JobMatch {
  _id: string
  title: string
  companyName: string
  matchScore: number
  type: string
}

// Compute CodeTrack Score (0–1000)
function computeScore(stats: {
  totalProblems: number
  highestRating: number
  contestsAttended: number
  githubContributions: number
  platformCount: number
  profileComplete: number
}): number {
  // Problems: 500 = full 400 pts
  const problemScore = Math.min((stats.totalProblems / 500) * 400, 400)
  // Rating: 1600 = full 200 pts
  const ratingScore = Math.min((stats.highestRating / 1600) * 200, 200)
  // GitHub: 365 contributions = full 150 pts
  const consistencyScore = Math.min((stats.githubContributions / 365) * 150, 150)
  // Contests: 20 = full 150 pts
  const contestScore = Math.min((stats.contestsAttended / 20) * 150, 150)
  // Profile: 0–100% → 0–100 pts
  const profileScore = stats.profileComplete
  return Math.round(problemScore + ratingScore + consistencyScore + contestScore + profileScore)
}

// Profile completeness checklist
function getChecklist(student: StudentProfile, platformCount: number) {
  return [
    { label: "Platforms Connected", done: platformCount > 0 },
    { label: "LinkedIn Added", done: !!student.linkedinUrl },
    { label: "Skills Listed", done: (student.skills?.length ?? 0) > 0 },
    { label: "Open to Work", done: student.isOpenToWork },
    { label: "GitHub Connected", done: !!student.linkedPlatforms?.github },
  ]
}

export function DashboardHero({ student, onSync, isSyncing }: DashboardHeroProps) {
  const [ranking, setRanking] = useState<RankData | null>(null)
  const [jobs, setJobs] = useState<JobMatch[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [aiInsights, setAiInsights] = useState<any>(null)
  const [aiLoading, setAiLoading] = useState(false)

  const linkedPlatforms = student.linkedPlatforms || {}
  const platformCount = Object.keys(linkedPlatforms).filter(k => linkedPlatforms[k]).length
  const isGraduate = !!(student as any).isGraduate || (student.graduationYear && student.graduationYear <= new Date().getFullYear())

  // Compute stats from linked platforms
  let totalProblems = 0, highestRating = 0, contestsAttended = 0, githubContributions = 0
  Object.entries(linkedPlatforms).forEach(([pid, data]) => {
    if (!data || typeof data !== "object") return
    const s = (data as any).stats
    if (!s) return
    totalProblems += s.totalSolved || s.problemsSolved || 0
    if (pid === "github") githubContributions = s.totalContributions || 0
    const r = Math.max(s.rating || 0, s.currentRating || 0, s.highestRating || 0, s.contestRating || 0, s.codingScore || 0)
    if (r > highestRating) highestRating = r
    contestsAttended += s.contests?.length || s.contestsParticipated || s.attendedContestsCount || 0
  })

  const checklist = getChecklist(student, platformCount)
  const profileComplete = Math.round((checklist.filter(c => c.done).length / checklist.length) * 100)
  const codetrackScore = computeScore({ totalProblems, highestRating, contestsAttended, githubContributions, platformCount, profileComplete })

  // Placement readiness
  const placementItems = [
    { label: "Resume / Profile", done: profileComplete >= 60 },
    { label: "GitHub Connected", done: !!student.linkedPlatforms?.github },
    { label: "LinkedIn Added", done: !!student.linkedinUrl },
    { label: "100+ Problems Solved", done: totalProblems >= 100 },
    { label: "Open to Work", done: student.isOpenToWork },
  ]
  const placementScore = Math.round((placementItems.filter(p => p.done).length / placementItems.length) * 100)

  useEffect(() => {
    fetch("/api/student/ranking")
      .then(r => r.json()).then(setRanking).catch(() => {})

    const skills = (student.skills ?? []).join(",")
    fetch(`/api/student/jobs?skills=${skills}&problems=${totalProblems}&rating=${highestRating}&platforms=${platformCount}&openToWork=${student.isOpenToWork}`)
      .then(r => r.json())
      .then(d => setJobs((d.jobs ?? []).slice(0, 3)))
      .catch(() => {})

    fetch("/api/student/analytics")
      .then(r => r.json()).then(setAnalytics).catch(() => {})

    // Load AI insights
    setAiLoading(true)
    fetch("/api/student/ai-insights")
      .then(r => r.json()).then(setAiInsights).catch(() => {})
      .finally(() => setAiLoading(false))
  }, [])

  const scoreColor = codetrackScore >= 700 ? "text-emerald-500" : codetrackScore >= 400 ? "text-amber-500" : "text-red-500"
  const scoreLabel = codetrackScore >= 700 ? "Excellent" : codetrackScore >= 400 ? "Good" : "Needs Work"

  return (
    <div className="space-y-6">

      {/* ── Hero Card ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-background p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">

          {/* Left: Welcome + Score */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl font-bold text-primary">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Welcome back, {student.name.split(" ")[0]} 👋
                </h2>
                <p className="text-sm text-muted-foreground">
                  {student.branch}
                  {isGraduate ? ` · Graduate ${student.graduationYear}` : ` · ${student.collegeCode} · ${student.graduationYear}`}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              {student.isOpenToWork && (
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse inline-block" />
                  Open to Work
                </Badge>
              )}
              {analytics?.skillsAnalysis?.overallRank && (
                <Badge variant="secondary">{analytics.skillsAnalysis.overallRank}</Badge>
              )}
              {analytics?.skillsAnalysis?.activityLevel && (
                <Badge variant="secondary">{analytics.skillsAnalysis.activityLevel} Activity</Badge>
              )}
            </div>

            <div className="flex gap-3 mt-4">
              <Button size="sm" onClick={onSync} disabled={isSyncing} className="gap-2">
                <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                {isSyncing ? "Syncing..." : "Sync Stats"}
              </Button>
              <Button size="sm" variant="outline" className="gap-2 bg-transparent" asChild>
                <Link href="/student/analytics"><BarChart3 className="h-4 w-4" />Analytics</Link>
              </Button>
              <Button size="sm" variant="outline" className="gap-2 bg-transparent" asChild>
                <Link href={`/u/${student.name.toLowerCase().replace(/\s+/g, "-")}`} target="_blank">
                  <ExternalLink className="h-4 w-4" />Public Profile
                </Link>
              </Button>
            </div>
          </div>

          {/* Center: CodeTrack Score */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card px-8 py-5 min-w-[160px]">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">CodeTrack Score</p>
            <p className={`text-5xl font-black tabular-nums ${scoreColor}`}>{codetrackScore}</p>
            <p className="text-xs text-muted-foreground mt-0.5">/ 1000</p>
            <Badge className={`mt-2 text-xs ${
              codetrackScore >= 700 ? "bg-emerald-500/10 text-emerald-600" :
              codetrackScore >= 400 ? "bg-amber-500/10 text-amber-600" :
              "bg-red-500/10 text-red-600"
            }`}>{scoreLabel}</Badge>
          </div>

          {/* Right: Rankings */}
          <div className="flex flex-col gap-3 min-w-[160px]">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-muted-foreground">Global Rank</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {ranking?.globalRank != null ? `#${ranking.globalRank}` : "—"}
              </p>
              {ranking?.totalGlobal ? (
                <p className="text-xs text-muted-foreground">of {ranking.totalGlobal}</p>
              ) : null}
            </div>
            {!isGraduate && student.collegeCode && (
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs text-muted-foreground">College Rank</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {ranking?.collegeRank != null ? `#${ranking.collegeRank}` : "—"}
                </p>
                {ranking?.totalCollege ? (
                  <p className="text-xs text-muted-foreground">of {ranking.totalCollege}</p>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Quick Stats ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Problems Solved", value: totalProblems, icon: Code2, color: "text-blue-500", bg: "bg-blue-500/10", href: "/student/platforms" },
          { label: "Highest Rating", value: highestRating || "—", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10", href: "/student/analytics" },
          { label: "Job Matches", value: jobs.length > 0 ? `${jobs.length}+` : "—", icon: Briefcase, color: "text-purple-500", bg: "bg-purple-500/10", href: "/student/jobs" },
          { label: "Recruiter Visibility", value: `${profileComplete}%`, icon: Eye, color: "text-emerald-500", bg: "bg-emerald-500/10", href: "/student/profile" },
        ].map((item) => (
          <Link key={item.label} href={item.href}>
            <div className="rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:bg-secondary/30 transition-colors cursor-pointer">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.bg} mb-3`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{item.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Middle Row: Placement Readiness + Job Matches ─────── */}
      <div className="grid gap-4 lg:grid-cols-2">

        {/* Placement Readiness */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Placement Readiness</h3>
            </div>
            <span className={`text-lg font-bold ${
              placementScore >= 80 ? "text-emerald-500" :
              placementScore >= 60 ? "text-amber-500" : "text-red-500"
            }`}>{placementScore}%</span>
          </div>
          <Progress value={placementScore} className="h-2 mb-4" />
          <div className="space-y-2">
            {placementItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                {item.done
                  ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  : <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                }
                <span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Job Matches */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <h3 className="font-semibold text-foreground">Top Job Matches</h3>
            </div>
            <Link href="/student/jobs" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Briefcase className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Connect platforms to see job matches</p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <Link key={job._id} href="/student/jobs">
                  <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3 hover:bg-secondary/60 transition-colors cursor-pointer">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{job.title}</p>
                      <p className="text-xs text-muted-foreground">{job.companyName} · {job.type}</p>
                    </div>
                    <Badge className="bg-primary/10 text-primary shrink-0 ml-2">{job.matchScore}%</Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Achievements ──────────────────────────────────────── */}
      {analytics?.achievements?.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-amber-500" />
            <h3 className="font-semibold text-foreground">Achievements</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {analytics.achievements.map((a: string) => (
              <Badge key={a} className="gap-1.5 bg-amber-500/10 text-amber-700 border-amber-500/20 px-3 py-1">
                <Trophy className="h-3 w-3" />{a}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* ── AI Career Insights ────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">AI Career Insights</h3>
            <Badge className="text-xs bg-primary/10 text-primary">Powered by Groq</Badge>
          </div>
          <Link href="/student/ai">
            <Button size="sm" className="gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              Open AI Advisor
            </Button>
          </Link>
        </div>

        {aiLoading ? (
          <div className="flex items-center gap-3 py-4">
            <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Analyzing your profile...</p>
          </div>
        ) : !aiInsights?.available ? (
          <div className="flex items-start gap-3 rounded-lg bg-secondary/50 p-4">
            <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">
                {aiInsights?.message || "Add GROQ_API_KEY to enable AI insights (free at console.groq.com)"}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-foreground leading-relaxed">
              {aiInsights.insights.overallAssessment}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {aiInsights.insights.strengths?.slice(0, 2).map((s: string) => (
                <Badge key={s} className="gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                  <CheckCircle2 className="h-3 w-3" />{s}
                </Badge>
              ))}
              {aiInsights.insights.skillGaps?.slice(0, 2).map((s: string) => (
                <Badge key={s} variant="outline" className="text-xs text-red-500 border-red-500/30">{s}</Badge>
              ))}
            </div>
            {aiInsights.insights.placementTip && (
              <p className="text-xs text-muted-foreground border-l-2 border-primary/40 pl-3">
                💡 {aiInsights.insights.placementTip}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
