"use client"

import { useState } from "react"
import {
  Trophy, Target, TrendingUp, AlertCircle, CheckCircle2, XCircle,
  Brain, Code2, Users, Star, Zap, BookOpen, Calendar, Shield,
  ChevronDown, ChevronUp, BarChart3, Flag, Cpu, ArrowRight,
} from "lucide-react"

interface Report {
  companyName: string
  targetRole: string
  overallScore: number
  companyBenchmark: number
  readinessScore: number
  readinessLabel: string
  benchmarkStatus: string
  selectionProbability: { round1: number; round2?: number; technicalRound: number; hrRound: number; overall: number }
  roundPredictions: { round1: string; technicalRound: string; hrRound: string }
  sectionAnalysis: Array<{ section: string; score: number; benchmark: number; status: string; feedback: string }>
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

const VERDICT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Strongly Recommended": { bg: "#10b98115", text: "#10b981", border: "#10b98130" },
  "Recommended":          { bg: "#6366f115", text: "#6366f1", border: "#6366f130" },
  "Borderline":           { bg: "#f59e0b15", text: "#f59e0b", border: "#f59e0b30" },
  "Needs Improvement":    { bg: "#ef444415", text: "#ef4444", border: "#ef444430" },
  "Not Recommended":      { bg: "#dc262615", text: "#dc2626", border: "#dc262630" },
}

const READINESS_COLOR = (score: number) =>
  score >= 76 ? "#10b981" : score >= 61 ? "#f59e0b" : "#ef4444"

function Section({ title, icon, children, defaultOpen = true }: {
  title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-2xl border border-border bg-card/40 overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-3">
          <span className="text-primary">{icon}</span>
          <span className="font-bold text-foreground">{title}</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-border/50">{children}</div>}
    </div>
  )
}

function ScoreBar({ value, benchmark, color }: { value: number; benchmark?: number; color: string }) {
  return (
    <div className="relative h-3 rounded-full bg-white/10 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
      {benchmark && (
        <div className="absolute top-0 bottom-0 w-0.5 bg-white/60" style={{ left: `${benchmark}%` }} />
      )}
    </div>
  )
}

function ProbabilityRing({ value, label, size = 80 }: { value: number; label: string; size?: number }) {
  const color = value >= 75 ? "#10b981" : value >= 55 ? "#f59e0b" : "#ef4444"
  const r = size * 0.38
  const circ = 2 * Math.PI * r
  const dash = circ * (value / 100)
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={size * 0.07} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={size * 0.07}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - dash}
          style={{ transition: "stroke-dashoffset 1s ease-out" }} />
      </svg>
      <div className="text-center -mt-1" style={{ marginTop: `-${size * 0.6}px`, position: "relative", zIndex: 1, height: `${size * 0.6}px`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span className="font-black tabular-nums text-foreground" style={{ fontSize: size * 0.18 }}>{value}%</span>
      </div>
      <p className="text-xs text-muted-foreground text-center leading-tight">{label}</p>
    </div>
  )
}

export function HiringReport({ report, companyColor = "#7c3aed", onRetry, onBack }: {
  report: Report; companyColor?: string; onRetry: () => void; onBack: () => void
}) {
  const [planPeriod, setPlanPeriod] = useState<"oneDay" | "threeDays" | "sevenDays" | "fourteenDays" | "thirtyDays">("sevenDays")
  const readinessColor = READINESS_COLOR(report.readinessScore)
  const verdictStyle = VERDICT_COLORS[report.hrReport?.verdict] ?? VERDICT_COLORS["Borderline"]
  const aboveBenchmark = report.overallScore >= report.companyBenchmark

  const planItems: Record<typeof planPeriod, string[]> = {
    oneDay: report.preparationPlan?.oneDay ?? [],
    threeDays: report.preparationPlan?.threeDays ?? [],
    sevenDays: report.preparationPlan?.sevenDays ?? [],
    fourteenDays: report.preparationPlan?.fourteenDays ?? [],
    thirtyDays: report.preparationPlan?.thirtyDays ?? [],
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">

      {/* ── HERO BANNER ── */}
      <div className="rounded-2xl border p-6 space-y-4" style={{ borderColor: `${companyColor}30`, background: `${companyColor}08` }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Company Assessment Report</p>
            <h2 className="text-2xl font-black text-foreground">{report.companyName}</h2>
            <p className="text-sm text-muted-foreground">{report.targetRole}</p>
          </div>
          <div className="text-right">
            <p className="text-5xl font-black tabular-nums" style={{ color: readinessColor }}>{report.overallScore}</p>
            <p className="text-xs text-muted-foreground">/ 100</p>
          </div>
        </div>

        {/* Key metrics strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Readiness", value: `${report.readinessScore}%`, sub: report.readinessLabel, color: readinessColor },
            { label: "Benchmark", value: `${report.companyBenchmark}%`, sub: report.benchmarkStatus, color: aboveBenchmark ? "#10b981" : "#ef4444" },
            { label: "Selection Chance", value: `${report.selectionProbability?.overall ?? 0}%`, sub: "Overall probability", color: companyColor },
            { label: "AI Verdict", value: report.hrReport?.verdict ?? "—", sub: "HR Assessment", color: verdictStyle.text },
          ].map(m => (
            <div key={m.label} className="rounded-xl border border-border bg-card/50 p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
              <p className="font-black text-sm leading-tight" style={{ color: m.color }}>{m.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{m.sub}</p>
            </div>
          ))}
        </div>

        {/* Readiness bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Company Readiness Score</span>
            <span className="font-bold" style={{ color: readinessColor }}>{report.readinessScore}% — {report.readinessLabel}</span>
          </div>
          <ScoreBar value={report.readinessScore} benchmark={report.companyBenchmark} color={readinessColor} />
          <p className="text-[10px] text-muted-foreground mt-1">White line = {report.companyName} benchmark ({report.companyBenchmark}%)</p>
        </div>
      </div>

      {/* ── SELECTION PROBABILITY ── */}
      <Section title="Selection Probability by Round" icon={<BarChart3 className="h-5 w-5" />}>
        <div className="pt-4">
          <div className="flex gap-6 justify-around flex-wrap">
            <ProbabilityRing value={report.selectionProbability?.round1 ?? 0} label="Round 1" size={90} />
            {report.selectionProbability?.round2 && (
              <ProbabilityRing value={report.selectionProbability.round2} label="Round 2" size={90} />
            )}
            <ProbabilityRing value={report.selectionProbability?.technicalRound ?? 0} label="Technical" size={90} />
            <ProbabilityRing value={report.selectionProbability?.hrRound ?? 0} label="HR Round" size={90} />
            <ProbabilityRing value={report.selectionProbability?.overall ?? 0} label="Overall" size={110} />
          </div>

          {/* Round predictions */}
          <div className="flex gap-3 flex-wrap mt-5">
            {Object.entries(report.roundPredictions ?? {}).map(([round, pred]) => (
              <div key={round} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${
                pred === "Pass" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-red-500/30 bg-red-500/10 text-red-400"
              }`}>
                {pred === "Pass" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                {round.replace(/([A-Z])/g, " $1").trim()}: {pred}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── SECTION ANALYSIS ── */}
      {report.sectionAnalysis?.length > 0 && (
        <Section title="Section-wise Performance" icon={<Target className="h-5 w-5" />}>
          <div className="space-y-4 pt-4">
            {report.sectionAnalysis.map((s, i) => {
              const c = s.status === "Strong" ? "#10b981" : s.status === "Average" ? "#f59e0b" : "#ef4444"
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-foreground">{s.section}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${c}15`, color: c }}>{s.status}</span>
                      <span className="text-sm font-bold tabular-nums" style={{ color: c }}>{s.score}%</span>
                    </div>
                  </div>
                  <ScoreBar value={s.score} benchmark={s.benchmark} color={c} />
                  <p className="text-xs text-muted-foreground mt-1">{s.feedback}</p>
                </div>
              )
            })}
          </div>
        </Section>
      )}

      {/* ── CRACK THE COMPANY ── */}
      <Section title={`Crack ${report.companyName} — AI Strategy`} icon={<Zap className="h-5 w-5" />}>
        <div className="space-y-5 pt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <p className="text-xs font-bold text-red-400 mb-3 flex items-center gap-2"><XCircle className="h-4 w-4" />Why You May Fail</p>
              <ul className="space-y-1.5">
                {(report.crackTheCompany?.whyMayFail ?? []).map((r, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-red-400 mt-0.5 shrink-0">✗</span> {r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-xs font-bold text-emerald-400 mb-3 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />Why You Will Succeed</p>
              <ul className="space-y-1.5">
                {(report.crackTheCompany?.whyMaySucceed ?? []).map((r, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Top 5 improvements */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Top 5 Improvement Areas</p>
            <div className="space-y-3">
              {(report.crackTheCompany?.top5Improvements ?? []).map((imp, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card/40 p-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{imp.area}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{imp.action}</p>
                    <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">{imp.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Topics to revise */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Critical Topics to Revise</p>
            <div className="flex flex-wrap gap-2">
              {(report.crackTheCompany?.topicsToRevise ?? []).map(t => (
                <span key={t} className="text-xs px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary font-medium">📚 {t}</span>
              ))}
            </div>
          </div>

          {/* Expected improvement */}
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
            <p className="text-xs font-bold text-violet-400 mb-1">Expected Improvement</p>
            <p className="text-sm font-semibold text-foreground">{report.crackTheCompany?.expectedImprovement}</p>
          </div>
        </div>
      </Section>

      {/* ── AI HR REPORT ── */}
      <Section title="AI HR Evaluation Report" icon={<Users className="h-5 w-5" />}>
        <div className="space-y-4 pt-4">
          {/* Verdict banner */}
          <div className="rounded-xl border p-4 flex items-start gap-4"
            style={{ borderColor: verdictStyle.border, background: verdictStyle.bg }}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ background: `${verdictStyle.text}20` }}>
              <Star className="h-5 w-5" style={{ color: verdictStyle.text }} />
            </div>
            <div>
              <p className="font-black text-lg" style={{ color: verdictStyle.text }}>{report.hrReport?.verdict}</p>
              <p className="text-sm text-muted-foreground">{report.hrReport?.verdictReason}</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{report.hrReport?.candidateSummary}</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-emerald-400 mb-2">Professional Strengths</p>
              <ul className="space-y-1">
                {(report.hrReport?.strengths ?? []).map((s, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" /> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-red-400 mb-2">Professional Weaknesses</p>
              <ul className="space-y-1">
                {(report.hrReport?.weaknesses ?? []).map((w, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" /> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Assessment grid */}
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: "Learning Ability", value: report.hrReport?.learningAbility },
              { label: "Problem Solving", value: report.hrReport?.problemSolvingAbility },
              { label: "Communication", value: report.hrReport?.communicationAssessment },
              { label: "Technical Skills", value: report.hrReport?.technicalAssessment },
            ].map(a => (
              <div key={a.label} className="rounded-xl border border-border bg-card/30 p-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{a.label}</p>
                <p className="text-xs text-foreground">{a.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-card/30 p-4">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Overall Hiring Impression</p>
            <p className="text-sm text-foreground">{report.hrReport?.overallImpression}</p>
          </div>
        </div>
      </Section>

      {/* ── PREPARATION PLAN ── */}
      <Section title="Personalized Preparation Plan" icon={<Calendar className="h-5 w-5" />}>
        <div className="space-y-4 pt-4">
          <div className="flex gap-2 flex-wrap">
            {([
              { key: "oneDay", label: "1 Day" },
              { key: "threeDays", label: "3 Days" },
              { key: "sevenDays", label: "7 Days" },
              { key: "fourteenDays", label: "14 Days" },
              { key: "thirtyDays", label: "30 Days" },
            ] as const).map(p => (
              <button key={p.key} onClick={() => setPlanPeriod(p.key)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={planPeriod === p.key
                  ? { background: "#7c3aed20", color: "#a78bfa", border: "1px solid #7c3aed30" }
                  : { background: "transparent", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}>
                {p.label}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {(planItems[planPeriod] ?? []).map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card/30 p-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold">{i + 1}</span>
                <p className="text-sm text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── COMPANY INSIGHTS ── */}
      <Section title={`${report.companyName} Insider Insights`} icon={<Brain className="h-5 w-5" />} defaultOpen={false}>
        <div className="space-y-4 pt-4">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Hiring Process</p>
            <p className="text-sm text-muted-foreground">{report.companyInsights?.hiringProcess}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">What They Look For</p>
            <p className="text-sm text-muted-foreground">{report.companyInsights?.whatTheyLookFor}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-red-400 mb-2">Common Mistakes</p>
              <ul className="space-y-1">{(report.companyInsights?.commonMistakes ?? []).map((m, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2"><XCircle className="h-3 w-3 text-red-400 shrink-0 mt-0.5" />{m}</li>
              ))}</ul>
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-400 mb-2">Insider Tips</p>
              <ul className="space-y-1">{(report.companyInsights?.insiderTips ?? []).map((t, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2"><CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />{t}</li>
              ))}</ul>
            </div>
          </div>
        </div>
      </Section>

      {/* ── INTEGRITY ── */}
      <Section title="Integrity & Proctoring Analysis" icon={<Shield className="h-5 w-5" />} defaultOpen={false}>
        <div className="pt-4 space-y-3">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-3xl font-black" style={{ color: report.integrityAnalysis?.integrityScore >= 80 ? "#10b981" : "#f59e0b" }}>
                {report.integrityAnalysis?.integrityScore ?? 100}
              </p>
              <p className="text-xs text-muted-foreground">Integrity Score</p>
            </div>
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                report.integrityAnalysis?.riskLevel === "Low Risk" ? "bg-emerald-500/10 text-emerald-400" :
                report.integrityAnalysis?.riskLevel === "Medium Risk" ? "bg-amber-500/10 text-amber-400" :
                "bg-red-500/10 text-red-400"}`}>
                {report.integrityAnalysis?.riskLevel ?? "Low Risk"}
              </span>
              <p className="text-xs text-muted-foreground mt-2">{report.integrityAnalysis?.reasoning}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── ACTIONS ── */}
      <div className="flex gap-3">
        <button onClick={onRetry}
          className="flex-1 h-12 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
          Retake Assessment
        </button>
        <button onClick={onBack}
          className="flex-1 h-12 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
          Back to Companies <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
