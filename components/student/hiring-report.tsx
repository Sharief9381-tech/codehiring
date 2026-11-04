"use client"

import { useState } from "react"
import {
  Trophy, Target, TrendingUp, AlertCircle, CheckCircle2, XCircle,
  Brain, Code2, Users, Star, Zap, BookOpen, Calendar, Shield,
  ChevronDown, ChevronUp, BarChart3, ArrowRight, Lightbulb,
  Award, Crosshair, Clock, ArrowUpRight,
} from "lucide-react"

interface Report {
  companyName: string
  targetRole: string
  overallScore: number
  companyBenchmark: number
  readinessScore: number
  readinessLabel: string
  benchmarkStatus: string
  selectionProbability: { overall: number; [key: string]: number }
  roundPredictions?: Record<string, string>
  sectionAnalysis: Array<{ section: string; score: number; correct?: number; total?: number; benchmark: number; status: string; feedback: string }>
  hrReport: {
    candidateSummary: string; strengths: string[]; weaknesses: string[];
    riskAreas: string[]; behaviorIndicators: string; learningAbility: string;
    problemSolvingAbility: string; communicationAssessment: string;
    technicalAssessment: string; overallImpression: string;
    verdict: string; verdictReason: string
  }
  crackTheCompany: {
    whyMayFail: string[]; whyMaySucceed: string[];
    top5Improvements: Array<{ area: string; action: string; impact: string }>
    topicsToRevise: string[]; expectedImprovement: string
  }
  preparationPlan: { oneDay: string[]; threeDays: string[]; sevenDays: string[]; fourteenDays: string[]; thirtyDays: string[] }
  integrityAnalysis: { integrityScore: number; riskLevel: string; violations: any[]; reasoning: string }
  companyInsights: { hiringProcess: string; whatTheyLookFor: string; commonMistakes: string[]; insiderTips: string[] }
}

const VERDICT_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
  "Strongly Recommended": { color: "#10b981", bg: "rgba(16,185,129,0.12)", icon: "🌟" },
  "Recommended":          { color: "#6366f1", bg: "rgba(99,102,241,0.12)", icon: "✅" },
  "Borderline":           { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", icon: "⚠️" },
  "Needs Improvement":    { color: "#ef4444", bg: "rgba(239,68,68,0.12)", icon: "📈" },
  "Not Recommended":      { color: "#dc2626", bg: "rgba(220,38,38,0.12)", icon: "❌" },
}

const scoreColor = (s: number) => s >= 75 ? "#10b981" : s >= 55 ? "#f59e0b" : "#ef4444"
const scoreLabel = (s: number) => s >= 75 ? "Strong" : s >= 55 ? "Average" : "Weak"

// ── Radial progress ring ──────────────────────────────────────────────────────
function Ring({ value, size = 80, color, children }: { value: number; size: number; color: string; children?: React.ReactNode }) {
  const r = size * 0.4
  const circ = 2 * Math.PI * r
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 absolute inset-0">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={size * 0.07} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size * 0.07}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - value/100)}
          style={{ transition: "stroke-dashoffset 1s ease-out" }} />
      </svg>
      <div className="relative z-10 flex flex-col items-center justify-center">
        {children ?? <span className="font-black text-white tabular-nums" style={{ fontSize: size * 0.2 }}>{value}%</span>}
      </div>
    </div>
  )
}

// ── Horizontal score bar with benchmark marker ────────────────────────────────
function Bar({ value, benchmark, color }: { value: number; benchmark?: number; color: string }) {
  return (
    <div className="relative h-2 rounded-full bg-white/8 overflow-visible">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
      {benchmark && (
        <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-white/50" style={{ left: `${benchmark}%` }} title="Benchmark" />
      )}
    </div>
  )
}

// ── Collapsible card ──────────────────────────────────────────────────────────
function Card({ title, emoji, children, open: defaultOpen = true }: {
  title: string; emoji: string; children: React.ReactNode; open?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <button className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen(o => !o)}>
        <span className="flex items-center gap-2.5 font-bold text-white text-sm">
          <span className="text-base">{emoji}</span>{title}
        </span>
        {open ? <ChevronUp className="h-4 w-4 text-white/40" /> : <ChevronDown className="h-4 w-4 text-white/40" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-white/[0.06]">{children}</div>}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function HiringReport({ report, companyColor = "#7c3aed", onRetry, onBack }: {
  report: Report; companyColor?: string; onRetry: () => void; onBack: () => void
}) {
  const [planTab, setPlanTab] = useState<"oneDay"|"threeDays"|"sevenDays"|"fourteenDays"|"thirtyDays">("sevenDays")
  const verdict = VERDICT_CONFIG[report.hrReport?.verdict] ?? VERDICT_CONFIG["Borderline"]
  const mainColor = scoreColor(report.overallScore)
  const aboveBench = report.overallScore >= report.companyBenchmark

  const planItems: Record<typeof planTab, string[]> = {
    oneDay: report.preparationPlan?.oneDay ?? [],
    threeDays: report.preparationPlan?.threeDays ?? [],
    sevenDays: report.preparationPlan?.sevenDays ?? [],
    fourteenDays: report.preparationPlan?.fourteenDays ?? [],
    thirtyDays: report.preparationPlan?.thirtyDays ?? [],
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto" style={{ color: "var(--foreground)" }}>

      {/* ── HERO ── */}
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${companyColor}18, ${companyColor}06)`, border: `1px solid ${companyColor}30` }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2" style={{ background: companyColor }} />
        <div className="relative z-10">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-1">Assessment Report</p>
          <h2 className="text-2xl font-black text-white mb-0.5">{report.companyName}</h2>
          <p className="text-sm text-white/60 mb-5">{report.targetRole}</p>

          <div className="flex items-center gap-6">
            <Ring value={report.overallScore} size={96} color={mainColor}>
              <span className="font-black text-white text-xl tabular-nums">{report.overallScore}</span>
              <span className="text-white/40 text-[9px] -mt-0.5">/ 100</span>
            </Ring>

            <div className="flex-1 space-y-3">
              {/* Readiness */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-white/60">Readiness</span>
                  <span className="font-bold" style={{ color: mainColor }}>{report.readinessScore}% — {report.readinessLabel}</span>
                </div>
                <Bar value={report.readinessScore} benchmark={report.companyBenchmark} color={mainColor} />
                <p className="text-[9px] text-white/30 mt-0.5">Benchmark: {report.companyBenchmark}%</p>
              </div>

              {/* Verdict pill */}
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: verdict.bg, color: verdict.color }}>
                  {verdict.icon} {report.hrReport?.verdict ?? "—"}
                </span>
                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${aboveBench ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                  {aboveBench ? "↑ Above Benchmark" : "↓ Below Benchmark"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SELECTION PROBABILITY ── */}
      <Card title="Selection Probability" emoji="🎯">
        <div className="mt-3 rounded-xl p-4 flex items-center gap-4" style={{ background: `${companyColor}12`, border: `1px solid ${companyColor}25` }}>
          <Ring value={report.selectionProbability?.overall ?? 0} size={72} color={companyColor} />
          <div>
            <p className="font-black text-white text-2xl">{report.selectionProbability?.overall ?? 0}%</p>
            <p className="text-sm font-semibold text-white/70">Overall selection probability</p>
            <p className="text-xs text-white/40 mt-0.5">Based on your assessment performance</p>
          </div>
        </div>
      </Card>

      {/* ── SECTION SCORES ── */}
      {report.sectionAnalysis?.length > 0 && (
        <Card title="Section Scores" emoji="📊">
          <div className="space-y-4 pt-4">
            {report.sectionAnalysis.map((s, i) => {
              const c = scoreColor(s.score)
              const sectionLabel = s.section
                .replace(/-/g, " ")
                .replace(/\b\w/g, ch => ch.toUpperCase())
              const hasRaw = s.correct !== undefined && s.correct !== null && s.total
              return (
                <div key={i} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white">{sectionLabel}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: `${c}15`, color: c }}>
                        {scoreLabel(s.score)}
                      </span>
                      {hasRaw ? (
                        <span className="text-sm font-black tabular-nums" style={{ color: c }}>
                          {s.correct}/{s.total}
                          <span className="text-xs text-white/40 font-medium ml-1">({s.score}%)</span>
                        </span>
                      ) : (
                        <span className="text-lg font-black tabular-nums" style={{ color: c }}>{s.score}%</span>
                      )}
                    </div>
                  </div>
                  <Bar value={s.score} benchmark={s.benchmark} color={c} />
                  <p className="text-xs text-white/40 mt-2 leading-relaxed">{s.feedback}</p>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* ── CRACK THE COMPANY ── */}
      <Card title={`How to Crack ${report.companyName}`} emoji="⚡">
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-4" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <p className="text-xs font-bold text-red-400 mb-3">⚠ Risk Factors</p>
              <ul className="space-y-2">
                {(report.crackTheCompany?.whyMayFail ?? []).map((r, i) => (
                  <li key={i} className="text-xs text-white/60 flex items-start gap-1.5">
                    <span className="text-red-400 shrink-0 mt-0.5">✗</span>{r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <p className="text-xs font-bold text-emerald-400 mb-3">✓ Strengths</p>
              <ul className="space-y-2">
                {(report.crackTheCompany?.whyMaySucceed ?? []).map((r, i) => (
                  <li key={i} className="text-xs text-white/60 flex items-start gap-1.5">
                    <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Top improvements */}
          <div>
            <p className="text-sm font-bold text-white mb-3">Top Improvements</p>
            <div className="space-y-2">
              {(report.crackTheCompany?.top5Improvements ?? []).map((imp, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl p-3.5"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-black text-xs text-white"
                    style={{ background: companyColor }}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">{imp.area}</p>
                    <p className="text-xs text-white/50 mt-0.5">{imp.action}</p>
                    <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/12 text-emerald-400">
                      {imp.impact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div>
            <p className="text-sm font-bold text-white mb-2">Topics to Revise</p>
            <div className="flex flex-wrap gap-2">
              {(report.crackTheCompany?.topicsToRevise ?? []).map(t => (
                <span key={t} className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{ background: `${companyColor}15`, color: companyColor, border: `1px solid ${companyColor}30` }}>
                  📚 {t}
                </span>
              ))}
            </div>
          </div>

          {/* Expected improvement */}
          <div className="rounded-xl p-4 flex items-center gap-3"
            style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
            <ArrowUpRight className="h-5 w-5 text-indigo-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-indigo-400">Expected Improvement</p>
              <p className="text-sm text-white font-semibold mt-0.5">{report.crackTheCompany?.expectedImprovement}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* ── AI VERDICT ── */}
      <Card title="AI HR Assessment" emoji="🤖">
        <div className="space-y-4 pt-4">
          <div className="rounded-xl p-5 flex items-start gap-4"
            style={{ background: verdict.bg, border: `1px solid ${verdict.color}30` }}>
            <span className="text-3xl">{verdict.icon}</span>
            <div>
              <p className="font-black text-xl" style={{ color: verdict.color }}>{report.hrReport?.verdict}</p>
              <p className="text-sm text-white/60 mt-1">{report.hrReport?.verdictReason}</p>
            </div>
          </div>

          <p className="text-sm text-white/60 leading-relaxed">{report.hrReport?.candidateSummary}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-4" style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <p className="text-xs font-bold text-emerald-400 mb-2.5">Strengths</p>
              {(report.hrReport?.strengths ?? []).map((s, i) => (
                <div key={i} className="flex items-start gap-1.5 mb-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-white/60">{s}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <p className="text-xs font-bold text-red-400 mb-2.5">Weaknesses</p>
              {(report.hrReport?.weaknesses ?? []).map((w, i) => (
                <div key={i} className="flex items-start gap-1.5 mb-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-white/60">{w}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Learning",     value: report.hrReport?.learningAbility },
              { label: "Problem Solving", value: report.hrReport?.problemSolvingAbility },
              { label: "Communication",value: report.hrReport?.communicationAssessment },
              { label: "Technical",    value: report.hrReport?.technicalAssessment },
            ].map(a => (
              <div key={a.label} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">{a.label}</p>
                <p className="text-xs text-white/70">{a.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5">Overall Impression</p>
            <p className="text-sm text-white/70 leading-relaxed">{report.hrReport?.overallImpression}</p>
          </div>
        </div>
      </Card>

      {/* ── PREP PLAN ── */}
      <Card title="Your Study Plan" emoji="📅">
        <div className="space-y-4 pt-4">
          <div className="flex gap-1.5 flex-wrap">
            {([
              { k: "oneDay" as const, l: "1 Day" },
              { k: "threeDays" as const, l: "3 Days" },
              { k: "sevenDays" as const, l: "1 Week" },
              { k: "fourteenDays" as const, l: "2 Weeks" },
              { k: "thirtyDays" as const, l: "1 Month" },
            ]).map(p => (
              <button key={p.k} onClick={() => setPlanTab(p.k)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={planTab === p.k
                  ? { background: companyColor, color: "#fff" }
                  : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                {p.l}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {(planItems[planTab] ?? []).map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl p-3.5"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                  style={{ background: `${companyColor}40` }}>{i + 1}</span>
                <p className="text-sm text-white/70">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ── COMPANY INSIGHTS ── */}
      <Card title="Insider Insights" emoji="🔍" open={false}>
        <div className="space-y-4 pt-4">
          <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Hiring Process</p>
            <p className="text-sm text-white/70">{report.companyInsights?.hiringProcess}</p>
          </div>
          <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">What They Look For</p>
            <p className="text-sm text-white/70">{report.companyInsights?.whatTheyLookFor}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-4" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <p className="text-xs font-bold text-red-400 mb-2.5">Common Mistakes</p>
              {(report.companyInsights?.commonMistakes ?? []).map((m, i) => (
                <div key={i} className="flex items-start gap-1.5 mb-1.5">
                  <XCircle className="h-3 w-3 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-white/60">{m}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <p className="text-xs font-bold text-emerald-400 mb-2.5">Insider Tips</p>
              {(report.companyInsights?.insiderTips ?? []).map((t, i) => (
                <div key={i} className="flex items-start gap-1.5 mb-1.5">
                  <Lightbulb className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-white/60">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* ── INTEGRITY ── */}
      <Card title="Proctoring" emoji="🛡️" open={false}>
        <div className="pt-4 flex items-center gap-5">
          <Ring value={report.integrityAnalysis?.integrityScore ?? 100} size={72}
            color={report.integrityAnalysis?.integrityScore >= 80 ? "#10b981" : "#f59e0b"} />
          <div>
            <p className="text-xl font-black text-white">{report.integrityAnalysis?.integrityScore ?? 100} / 100</p>
            <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold ${
              report.integrityAnalysis?.riskLevel === "Low Risk" ? "bg-emerald-500/12 text-emerald-400" : "bg-amber-500/12 text-amber-400"
            }`}>{report.integrityAnalysis?.riskLevel ?? "Low Risk"}</span>
            <p className="text-xs text-white/40 mt-2 leading-relaxed max-w-xs">{report.integrityAnalysis?.reasoning}</p>
          </div>
        </div>
      </Card>

      {/* ── ACTIONS ── */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button onClick={onRetry}
          className="h-12 rounded-xl text-sm font-bold text-white/70 hover:text-white transition-all"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
          🔄 Retake
        </button>
        <button onClick={onBack}
          className="h-12 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${companyColor}, ${companyColor}cc)` }}>
          Companies <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
