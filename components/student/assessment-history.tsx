"use client"

import { useEffect, useState } from "react"
import {
  Trophy, TrendingUp, Clock, Target, BarChart3,
  ChevronRight, Medal, Users, Star, Zap, RefreshCw,
  CheckCircle2, XCircle, ArrowUp, ArrowDown, Minus,
} from "lucide-react"

interface AttemptRecord {
  _id: string
  company: string
  companyName: string
  overallScore: number
  sectionScores: Record<string, number>
  timeTaken: number
  readinessScore: number
  selectionProbability: number
  verdict: string
  rank: number
  percentile: number
  totalParticipants: number
  completedAt: string
}

interface LeaderboardEntry {
  rank: number
  userId: string
  userName: string
  collegeCode: string
  bestScore: number
  attempts: number
  isCurrentUser: boolean
  readinessScore: number
}

const COMPANY_COLORS: Record<string, string> = {
  tcs: "#7c3aed", infosys: "#059669", wipro: "#0284c7",
  accenture: "#a21caf", cognizant: "#0891b2", capgemini: "#0369a1",
  deloitte: "#15803d", amazon: "#f59e0b", microsoft: "#3b82f6", google: "#ef4444",
}

const VERDICT_STYLE: Record<string, { bg: string; text: string }> = {
  "Strongly Recommended": { bg: "#10b98115", text: "#10b981" },
  "Recommended":          { bg: "#6366f115", text: "#6366f1" },
  "Borderline":           { bg: "#f59e0b15", text: "#f59e0b" },
  "Needs Improvement":    { bg: "#ef444415", text: "#ef4444" },
  "Not Recommended":      { bg: "#dc262615", text: "#dc2626" },
}

function ScoreBar({ value, color = "#7c3aed" }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
    </div>
  )
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-amber-400 text-lg">🥇</span>
  if (rank === 2) return <span className="text-slate-300 text-lg">🥈</span>
  if (rank === 3) return <span className="text-amber-600 text-lg">🥉</span>
  return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
}

// ─── Leaderboard Panel ────────────────────────────────────────────────────────
export function AssessmentLeaderboard({ company, companyName, onClose }: {
  company: string; companyName: string; onClose: () => void
}) {
  const [data, setData] = useState<{ leaderboard: LeaderboardEntry[]; userRank: number | null; totalParticipants: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/student/assessment-leaderboard?company=${company}`)
      .then(r => r.json())
      .then(d => setData(d))
      .finally(() => setLoading(false))
  }, [company])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between"
          style={{ background: `${COMPANY_COLORS[company] ?? "#7c3aed"}12` }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black text-white"
              style={{ background: COMPANY_COLORS[company] ?? "#7c3aed" }}>
              {companyName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-foreground">{companyName} Leaderboard</p>
              <p className="text-xs text-muted-foreground">{data?.totalParticipants ?? "—"} students attempted</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors text-lg">✕</button>
        </div>

        {/* User rank highlight */}
        {data?.userRank && (
          <div className="px-5 py-3 border-b border-border flex items-center justify-between"
            style={{ background: "rgba(124,58,237,0.08)" }}>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-violet-400" />
              <span className="text-sm font-semibold text-foreground">Your Rank</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-violet-400">#{data.userRank}</span>
              <span className="text-xs text-muted-foreground">
                Top {Math.round(((data.totalParticipants - data.userRank + 1) / data.totalParticipants) * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* List */}
        <div className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground gap-2 text-sm">
              <RefreshCw className="h-4 w-4 animate-spin" />Loading leaderboard…
            </div>
          ) : (data?.leaderboard ?? []).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <Trophy className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p>No attempts yet. Be the first!</p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {(data?.leaderboard ?? []).map(e => (
                <div key={e.userId}
                  className={`flex items-center gap-4 px-5 py-3 transition-colors ${e.isCurrentUser ? "bg-violet-500/8 border-l-2 border-violet-500" : "hover:bg-white/3"}`}>
                  <div className="w-8 text-center shrink-0"><RankBadge rank={e.rank} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {e.isCurrentUser ? "You" : e.userName}
                      </p>
                      {e.isCurrentUser && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-400 font-bold">YOU</span>}
                    </div>
                    {e.collegeCode && <p className="text-xs text-muted-foreground">{e.collegeCode} · {e.attempts} attempt{e.attempts > 1 ? "s" : ""}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-black tabular-nums"
                      style={{ color: e.bestScore >= 80 ? "#10b981" : e.bestScore >= 60 ? "#f59e0b" : "#ef4444" }}>
                      {e.bestScore}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-border">
          <button onClick={onClose}
            className="w-full h-10 rounded-xl font-semibold text-white text-sm"
            style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── History Page ─────────────────────────────────────────────────────────────
export function AssessmentHistoryPage() {
  const [history, setHistory] = useState<AttemptRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [showLeaderboard, setShowLeaderboard] = useState<{ company: string; name: string } | null>(null)

  useEffect(() => {
    fetch("/api/student/assessment-history")
      .then(r => r.json())
      .then(d => setHistory(d.history ?? []))
      .finally(() => setLoading(false))
  }, [])

  const companies = [...new Set(history.map(h => h.company))]
  const filtered = selectedCompany ? history.filter(h => h.company === selectedCompany) : history

  // Stats
  const totalAttempts = history.length
  const avgScore = totalAttempts > 0 ? Math.round(history.reduce((a, b) => a + b.overallScore, 0) / totalAttempts) : 0
  const bestScore = totalAttempts > 0 ? Math.max(...history.map(h => h.overallScore)) : 0
  const companiesAttempted = companies.length

  // Improvement trend
  const getTrend = (company: string) => {
    const attempts = history.filter(h => h.company === company).sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())
    if (attempts.length < 2) return null
    return attempts[attempts.length - 1].overallScore - attempts[0].overallScore
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground text-sm">
      <RefreshCw className="h-4 w-4 animate-spin" />Loading history…
    </div>
  )

  return (
    <div className="space-y-5">
      {showLeaderboard && (
        <AssessmentLeaderboard
          company={showLeaderboard.company}
          companyName={showLeaderboard.name}
          onClose={() => setShowLeaderboard(null)}
        />
      )}

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Attempts", value: totalAttempts, icon: <Target className="h-4 w-4" />, color: "#7c3aed" },
          { label: "Average Score",  value: `${avgScore}%`,  icon: <BarChart3 className="h-4 w-4" />, color: "#6366f1" },
          { label: "Best Score",     value: `${bestScore}%`, icon: <Trophy className="h-4 w-4" />,   color: "#f59e0b" },
          { label: "Companies",      value: companiesAttempted, icon: <Users className="h-4 w-4" />, color: "#10b981" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card/40 p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: `${s.color}15`, color: s.color }}>{s.icon}</div>
            <div>
              <p className="text-xl font-black text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Company filter */}
      {companies.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setSelectedCompany(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!selectedCompany ? "bg-primary/20 text-primary border border-primary/30" : "border border-border text-muted-foreground hover:text-foreground"}`}>
            All Companies
          </button>
          {companies.map(c => {
            const name = history.find(h => h.company === c)?.companyName ?? c
            return (
              <button key={c} onClick={() => setSelectedCompany(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCompany === c ? "text-white" : "border border-border text-muted-foreground hover:text-foreground"}`}
                style={selectedCompany === c ? { background: COMPANY_COLORS[c] ?? "#7c3aed" } : {}}>
                {name}
              </button>
            )
          })}
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card/30 flex flex-col items-center justify-center py-16 text-center">
          <Trophy className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="font-semibold text-foreground mb-1">No assessment history yet</p>
          <p className="text-sm text-muted-foreground">Complete a company assessment to see your history here</p>
        </div>
      )}

      {/* Attempt list */}
      <div className="space-y-3">
        {filtered.map((attempt, i) => {
          const color = COMPANY_COLORS[attempt.company] ?? "#7c3aed"
          const scoreColor = attempt.overallScore >= 80 ? "#10b981" : attempt.overallScore >= 60 ? "#f59e0b" : "#ef4444"
          const vStyle = VERDICT_STYLE[attempt.verdict] ?? VERDICT_STYLE["Borderline"]
          const trend = getTrend(attempt.company)

          return (
            <div key={attempt._id} className="rounded-2xl border border-border bg-card overflow-hidden">
              {/* Card header */}
              <div className="flex items-center gap-4 px-5 py-4" style={{ borderLeft: `4px solid ${color}` }}>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white"
                  style={{ background: color }}>
                  {attempt.companyName.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-foreground">{attempt.companyName}</p>
                    {attempt.verdict && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: vStyle.bg, color: vStyle.text }}>
                        {attempt.verdict}
                      </span>
                    )}
                    {i === 0 && filtered.filter(h => h.company === attempt.company).indexOf(attempt) === 0 && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold border border-primary/20">LATEST</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(attempt.completedAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                    {attempt.timeTaken > 0 && ` · ${Math.round(attempt.timeTaken / 60)} min`}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-3xl font-black tabular-nums" style={{ color: scoreColor }}>{attempt.overallScore}</p>
                  <p className="text-[10px] text-muted-foreground">/ 100</p>
                </div>
              </div>

              {/* Score bar */}
              <div className="px-5 pb-1">
                <ScoreBar value={attempt.overallScore} color={scoreColor} />
              </div>

              {/* Details */}
              <div className="px-5 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-border/50">
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">{attempt.readinessScore ?? "—"}%</p>
                  <p className="text-[10px] text-muted-foreground">Readiness</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">
                    {attempt.rank ? `#${attempt.rank}` : "—"}
                    {attempt.totalParticipants ? ` / ${attempt.totalParticipants}` : ""}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Rank</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">{attempt.percentile ?? "—"}%</p>
                  <p className="text-[10px] text-muted-foreground">Percentile</p>
                </div>
                <div className="text-center">
                  {trend !== null ? (
                    <p className="text-sm font-bold flex items-center justify-center gap-1"
                      style={{ color: trend > 0 ? "#10b981" : trend < 0 ? "#ef4444" : "#6366f1" }}>
                      {trend > 0 ? <ArrowUp className="h-3.5 w-3.5" /> : trend < 0 ? <ArrowDown className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                      {Math.abs(trend)}%
                    </p>
                  ) : <p className="text-sm font-bold text-muted-foreground">—</p>}
                  <p className="text-[10px] text-muted-foreground">Trend</p>
                </div>
              </div>

              {/* Section scores */}
              {Object.keys(attempt.sectionScores ?? {}).length > 0 && (
                <div className="px-5 pb-4 border-t border-border/50">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-3 mb-2">Section Scores</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(attempt.sectionScores).map(([sec, score]) => {
                      const sc = score as number
                      const c = sc >= 75 ? "#10b981" : sc >= 55 ? "#f59e0b" : "#ef4444"
                      return (
                        <div key={sec} className="rounded-lg border border-border bg-card/30 px-3 py-2 text-center">
                          <p className="text-sm font-bold tabular-nums" style={{ color: c }}>{sc}%</p>
                          <p className="text-[10px] text-muted-foreground capitalize">{sec}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="px-5 py-3 border-t border-border/50 flex items-center gap-2">
                <button
                  onClick={() => setShowLeaderboard({ company: attempt.company, name: attempt.companyName })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
                  <Trophy className="h-3.5 w-3.5" /> View Leaderboard
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
