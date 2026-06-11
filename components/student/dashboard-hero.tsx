"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  RefreshCw, BarChart3, Briefcase, Globe, Building2, Zap,
  CheckCircle2, Circle, Code2, Trophy, Star, Award, Target,
  Eye, Sparkles, ExternalLink, AlertCircle, TrendingUp,
  ArrowRight, Activity,
} from "lucide-react"
import type { StudentProfile } from "@/lib/types"
import { computeCodeHiringScore } from "@/lib/score"

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
}

interface JobMatch {
  _id: string
  title: string
  companyName: string
  matchScore: number
  type: string
}

function useCountUp(target: number, duration = 1200) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!target) return
    let s = 0, r = 0
    const tick = (n: number) => {
      if (!s) s = n
      const p = Math.min((n - s) / duration, 1)
      setV(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) r = requestAnimationFrame(tick)
    }
    r = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(r)
  }, [target, duration])
  return v
}

function ScoreRing({ score }: { score: number }) {
  const pct    = score / 1000
  const r      = 52
  const circ   = 2 * Math.PI * r
  const dash   = circ * pct
  const color  = score >= 700 ? "#10b981" : score >= 400 ? "#f59e0b" : "#ef4444"
  const label  = score >= 700 ? "Excellent" : score >= 400 ? "Good" : "Needs Work"
  const animScore = useCountUp(score)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-border" />
          <motion.circle
            cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - dash }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black tabular-nums" style={{ color }}>{animScore}</span>
          <span className="text-[10px] text-muted-foreground font-medium">/ 1000</span>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-center text-muted-foreground">CodeHiring Score</p>
        <div className="flex justify-center mt-1">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: color + "20", color }}>{label}</span>
        </div>
      </div>
    </div>
  )
}

export function DashboardHero({ student, onSync, isSyncing }: DashboardHeroProps) {
  const [ranking, setRanking]     = useState<RankData | null>(null)
  const [jobs, setJobs]           = useState<JobMatch[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [aiInsights, setAiInsights] = useState<any>(null)
  const [aiLoading, setAiLoading] = useState(false)

  const linkedPlatforms = student.linkedPlatforms || {}
  const platformCount   = Object.keys(linkedPlatforms).filter(k => linkedPlatforms[k]).length
  const isGraduate      = !!(student as any).isGraduate || (student.graduationYear && student.graduationYear <= new Date().getFullYear())

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

  const checklistItems = [
    { label: "Platform Connected",  done: platformCount > 0 },
    { label: "LinkedIn Added",      done: !!student.linkedinUrl },
    { label: "Skills Listed",       done: (student.skills?.length ?? 0) > 0 },
    { label: "Open to Work",        done: student.isOpenToWork },
    { label: "GitHub Connected",    done: !!student.linkedPlatforms?.github },
  ]
  const profileComplete = Math.round((checklistItems.filter(c => c.done).length / checklistItems.length) * 100)
  const codehiringScore = computeCodeHiringScore(student)

  const placementItems = [
    { label: "Resume / Profile",    done: profileComplete >= 60 },
    { label: "GitHub Connected",    done: !!student.linkedPlatforms?.github },
    { label: "LinkedIn Added",      done: !!student.linkedinUrl },
    { label: "100+ Problems Solved",done: totalProblems >= 100 },
    { label: "Open to Work",        done: student.isOpenToWork },
  ]
  const placementScore = Math.round((placementItems.filter(p => p.done).length / placementItems.length) * 100)

  useEffect(() => {
    fetch("/api/student/ranking").then(r => r.json()).then(setRanking).catch(() => {})
    const skills = (student.skills ?? []).join(",")
    fetch(`/api/student/jobs?skills=${skills}&problems=${totalProblems}&rating=${highestRating}&platforms=${platformCount}&openToWork=${student.isOpenToWork}`)
      .then(r => r.json()).then(d => setJobs((d.jobs ?? []).slice(0, 3))).catch(() => {})
    fetch("/api/student/analytics").then(r => r.json()).then(setAnalytics).catch(() => {})
    setAiLoading(true)
    fetch("/api/student/ai-insights").then(r => r.json()).then(setAiInsights).catch(() => {}).finally(() => setAiLoading(false))
  }, [])

  const initials = student.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()

  return (
    <div className="space-y-5">

      {/* ── HERO BANNER ──────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative rounded-2xl border border-border bg-card overflow-hidden">
        {/* gradient banner */}
        <div className="h-28 bg-gradient-to-r from-violet-600/20 via-primary/10 to-blue-600/10 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(139,92,246,0.15),transparent)]" />
        </div>

        <div className="px-6 pb-6 -mt-14">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-2xl font-black text-white shadow-lg ring-4 ring-card">
                {initials}
              </div>
              {student.isOpenToWork && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-card flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
              )}
            </div>

            {/* Name + meta */}
            <div className="flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-foreground">{student.name}</h2>
                {student.isOpenToWork && (
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                    Open to Work
                  </Badge>
                )}
                {analytics?.skillsAnalysis?.activityLevel && (
                  <Badge variant="secondary" className="text-xs">{analytics.skillsAnalysis.activityLevel} Activity</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {student.branch}
                {isGraduate ? ` · Graduate ${student.graduationYear}` : ` · ${student.collegeCode} · Class of ${student.graduationYear}`}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pb-1 shrink-0">
              <Button size="sm" onClick={onSync} disabled={isSyncing} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                {isSyncing ? "Syncing…" : "Sync Stats"}
              </Button>
              <Button size="sm" variant="outline" className="gap-2" asChild>
                <Link href="/student/analytics"><BarChart3 className="h-3.5 w-3.5" />Analytics</Link>
              </Button>
              <Button size="sm" variant="outline" className="gap-2" asChild>
                <Link href={`/u/${student.name.toLowerCase().replace(/\s+/g, "-")}`} target="_blank">
                  <ExternalLink className="h-3.5 w-3.5" />Profile
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Problems Solved", val: totalProblems,   color: "text-violet-500", bg: "bg-violet-500/8",  icon: Code2    },
              { label: "Highest Rating",  val: highestRating,   color: "text-amber-500",  bg: "bg-amber-500/8",   icon: Star     },
              { label: "Contests",        val: contestsAttended,color: "text-blue-500",   bg: "bg-blue-500/8",    icon: Trophy   },
              { label: "Contributions",   val: githubContributions, color: "text-emerald-500", bg: "bg-emerald-500/8", icon: Activity },
              { label: "Platforms",       val: platformCount,   color: "text-pink-500",   bg: "bg-pink-500/8",    icon: Globe    },
            ].map(({ label, val, color, bg, icon: Icon }) => (
              <div key={label} className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl ${bg} border border-white/5`}>
                <Icon className={`h-4 w-4 ${color} shrink-0`} />
                <span className={`text-lg font-black tabular-nums ${color}`}>{val || "—"}</span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── SCORE + RANKS + PLACEMENT ────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* Score ring */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="flex-1 rounded-2xl border border-border bg-card p-6 flex flex-col items-center justify-center gap-4">
          <ScoreRing score={codehiringScore} />
          {/* Score breakdown mini bars */}
          <div className="w-full space-y-2 pt-2 border-t border-border">
            {[
              { label: "Problems",    pct: Math.min((totalProblems / 500) * 100, 100),           color: "bg-violet-500" },
              { label: "Rating",      pct: Math.min((highestRating / 1600) * 100, 100),          color: "bg-amber-500" },
              { label: "GitHub",      pct: Math.min((githubContributions / 365) * 100, 100),     color: "bg-emerald-500" },
              { label: "Contests",    pct: Math.min((contestsAttended / 20) * 100, 100),         color: "bg-blue-500" },
              { label: "Profile",     pct: profileComplete,                                       color: "bg-pink-500" },
            ].map(({ label, pct, color }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-16 shrink-0">{label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                    className={`h-full rounded-full ${color}`} />
                </div>
                <span className="text-[10px] tabular-nums text-muted-foreground w-8 text-right">{Math.round(pct)}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Ranks */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="flex flex-col gap-3 min-w-[200px]">
          <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4 flex-1">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <Globe className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Global Rank</p>
              <p className="text-2xl font-black tabular-nums text-foreground">
                {ranking?.globalRank != null ? `#${ranking.globalRank.toLocaleString()}` : "—"}
              </p>
              {ranking?.totalGlobal ? <p className="text-[10px] text-muted-foreground">of {ranking.totalGlobal.toLocaleString()}</p> : null}
            </div>
          </div>
          {!isGraduate && student.collegeCode && (
            <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4 flex-1">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Building2 className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">College Rank</p>
                <p className="text-2xl font-black tabular-nums text-foreground">
                  {ranking?.collegeRank != null ? `#${ranking.collegeRank.toLocaleString()}` : "—"}
                </p>
                {ranking?.totalCollege ? <p className="text-[10px] text-muted-foreground">of {ranking.totalCollege.toLocaleString()}</p> : null}
              </div>
            </div>
          )}
          {/* Profile completion */}
          <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4 flex-1">
            <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
              <Eye className="h-5 w-5 text-violet-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">Recruiter Visibility</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${profileComplete}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full rounded-full bg-violet-500" />
                </div>
                <span className="text-sm font-bold tabular-nums text-violet-500">{profileComplete}%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Placement readiness */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex-1 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">Placement Readiness</h3>
            </div>
            <span className={`text-lg font-black tabular-nums ${
              placementScore >= 80 ? "text-emerald-500" : placementScore >= 60 ? "text-amber-500" : "text-red-500"
            }`}>{placementScore}%</span>
          </div>

          <div className="h-2 rounded-full bg-muted overflow-hidden mb-4">
            <motion.div initial={{ width: 0 }} animate={{ width: `${placementScore}%` }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className={`h-full rounded-full ${placementScore >= 80 ? "bg-emerald-500" : placementScore >= 60 ? "bg-amber-500" : "bg-red-500"}`} />
          </div>

          <div className="space-y-2.5">
            {placementItems.map((item, i) => (
              <motion.div key={item.label}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
                className="flex items-center gap-2.5 text-sm">
                {item.done
                  ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  : <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />}
                <span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── JOB MATCHES + ACHIEVEMENTS ───────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* Job matches */}
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex-1 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <h3 className="font-semibold text-sm text-foreground">Top Job Matches</h3>
            </div>
            <Link href="/student/jobs" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Briefcase className="h-8 w-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">Connect platforms to see job matches</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {jobs.map((job, i) => (
                <motion.div key={job._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.07 }}>
                  <Link href="/student/jobs">
                    <div className="flex items-center gap-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/3 transition-all p-3 cursor-pointer group">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm truncate group-hover:text-primary transition-colors">{job.title}</p>
                        <p className="text-xs text-muted-foreground">{job.companyName} · {job.type}</p>
                      </div>
                      <div className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold ${
                        job.matchScore >= 80 ? "bg-emerald-500/10 text-emerald-600" :
                        job.matchScore >= 60 ? "bg-amber-500/10 text-amber-600" :
                        "bg-blue-500/10 text-blue-600"
                      }`}>{job.matchScore}%</div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Achievements */}
        {analytics?.achievements?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex-1 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-4 w-4 text-amber-500" />
              <h3 className="font-semibold text-sm text-foreground">Achievements</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {analytics.achievements.map((a: string, i: number) => (
                <motion.div key={a} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.06, type: "spring", stiffness: 200 }}>
                  <Badge className="gap-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 px-3 py-1">
                    <Trophy className="h-3 w-3" />{a}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* ── AI INSIGHTS ──────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-blue-500/5 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">AI Career Insights</h3>
              <p className="text-[10px] text-muted-foreground">Powered by Groq</p>
            </div>
          </div>
          <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
            <Link href="/student/ai"><Sparkles className="h-3.5 w-3.5" />AI Advisor</Link>
          </Button>
        </div>

        {aiLoading ? (
          <div className="flex items-center gap-3 py-3">
            <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Analyzing your profile…</p>
          </div>
        ) : !aiInsights?.available ? (
          <div className="flex items-start gap-3 rounded-xl bg-muted/50 p-4">
            <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">
              {aiInsights?.message || "Add GROQ_API_KEY to enable AI insights (free at console.groq.com)"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-foreground leading-relaxed">{aiInsights.insights.overallAssessment}</p>
            <div className="flex flex-wrap gap-1.5">
              {aiInsights.insights.strengths?.slice(0, 2).map((s: string) => (
                <Badge key={s} className="gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                  <CheckCircle2 className="h-3 w-3" />{s}
                </Badge>
              ))}
              {aiInsights.insights.skillGaps?.slice(0, 2).map((s: string) => (
                <Badge key={s} variant="outline" className="text-xs text-destructive border-destructive/30">{s}</Badge>
              ))}
            </div>
            {aiInsights.insights.placementTip && (
              <p className="text-xs text-muted-foreground border-l-2 border-primary/40 pl-3">
                💡 {aiInsights.insights.placementTip}
              </p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}
