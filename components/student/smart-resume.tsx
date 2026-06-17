"use client"

import { useState, useRef, useEffect } from "react"
import {
  Upload, FileText, Sparkles, Loader2, CheckCircle2, XCircle,
  AlertCircle, RefreshCw, TrendingUp, Star, Lightbulb, Target,
  Shield, Zap, ChevronDown, ChevronUp, ArrowRight, Award,
  BarChart3, Brain, Building2, Users,
} from "lucide-react"

interface Analysis {
  overallScore: number
  scoreBreakdown: Record<string, { score: number; max: number; label: string }>
  atsScore: number
  atsKeywords: { found: string[]; missing: string[]; density: number }
  sectionScores: Array<{ name: string; score: number; grade: string; feedback: string; issues: string[] }>
  bulletAnalysis: Array<{ original: string; score: number; issues: string[]; improved: string; explanation: string }>
  hardSkills: { present: string[]; suggested: string[] }
  softSkills: { present: string[]; suggested: string[] }
  jobMatches: Array<{ role: string; company: string; match: number; missingSkills: string[]; reason: string }>
  wordCount: { current: number; ideal: string; status: string }
  formattingIssues: string[]
  strengthPoints: string[]
  criticalIssues: string[]
  quickWins: Array<{ action: string; impact: string; effort: string }>
  improvedSummary: string
  templateRecommendation: { name: string; reason: string }
  linkedinTips: string[]
  interviewReadiness: number
}

const GRADE_COLOR: Record<string, string> = {
  A: "#10b981", B: "#6366f1", C: "#f59e0b", D: "#ef4444", F: "#dc2626"
}
const IMPACT_COLOR: Record<string, string> = {
  high: "#ef4444", medium: "#f59e0b", low: "#6366f1"
}

function ScoreRing({ score, size = 100, label }: { score: number; size?: number; label?: string }) {
  const r = size * 0.38
  const circ = 2 * Math.PI * r
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444"
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={size*0.08} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size*0.08}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - circ*(score/100)}
          style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div className="text-center" style={{ marginTop: -(size*0.65), height: size*0.65, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <span className="font-black tabular-nums" style={{ fontSize: size*0.2, color }}>{score}</span>
      </div>
      {label && <p className="text-xs text-muted-foreground text-center">{label}</p>}
    </div>
  )
}

function BarScore({ value, max, color = "#7c3aed" }: { value: number; max: number; color?: string }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-bold tabular-nums w-10 text-right" style={{ color }}>{value}/{max}</span>
    </div>
  )
}

function Collapsible({ title, icon, children, defaultOpen = false }: {
  title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors">
        <div className="flex items-center gap-3 text-foreground font-semibold text-sm">
          {icon}{title}
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-border/50">{children}</div>}
    </div>
  )
}

export function SmartResume() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [storedFile, setStoredFile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    Promise.all([
      fetch("/api/student/smart-resume", { credentials: "include" }).then(r => r.json()).catch(() => ({})),
      fetch("/api/student/profile", { credentials: "include" }).then(r => r.json()).catch(() => ({})),
    ]).then(([smartData, profileData]) => {
      if (smartData.smartResume?.analysis) setAnalysis(smartData.smartResume.analysis)
      if (profileData.user?.resumeFile?.fileName) setStoredFile(profileData.user.resumeFile)
    }).finally(() => setFetching(false))
  }, [])

  async function runAnalysis(payload: FormData | { useStored: boolean }) {
    setLoading(true); setError(null)
    try {
      const isForm = payload instanceof FormData
      // Try Enhancv-powered route first, fall back to basic AI
      const res = await fetch("/api/student/enhancv", {
        method: "POST",
        credentials: "include",
        ...(isForm ? { body: payload } : { headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }),
      })
      const json = await res.json()
      if (!res.ok || !json.analysis) {
        // Fallback to resume-ai
        const res2 = await fetch("/api/student/resume-ai", {
          method: "POST",
          credentials: "include",
          ...(isForm ? { body: payload } : { headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }),
        })
        const json2 = await res2.json()
        if (!res2.ok) { setError(json2.error ?? "Analysis failed"); return }
        setAnalysis(json2.analysis)
      } else {
        setAnalysis(json.analysis)
      }
      setActiveTab("overview")
    } catch { setError("Network error. Please try again.") }
    finally { setLoading(false) }
  }

  function onFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) { const form = new FormData(); form.append("file", f); runAnalysis(form) }
    e.target.value = ""
  }

  if (fetching) return (
    <div className="flex items-center justify-center py-20 text-muted-foreground text-sm gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />Loading...
    </div>
  )

  const a = analysis

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "sections", label: "Sections" },
    { id: "bullets", label: "Bullet Analysis" },
    { id: "skills", label: "Skills" },
    { id: "jobs", label: "Job Match" },
    { id: "wins", label: "Quick Wins" },
  ]

  return (
    <div className="space-y-5">
      {/* Upload card */}
      <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/60 via-purple-900/40 to-indigo-950/40 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 border border-violet-500/30">
            <Sparkles className="h-5 w-5 text-violet-300" />
          </div>
          <div>
            <p className="font-bold text-foreground">Smart Resume Analyser</p>
            <p className="text-xs text-muted-foreground">ResumeWorded-style deep analysis — ATS score, bullet grading, skill gaps, job match</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {storedFile && (
            <button onClick={() => runAnalysis({ useStored: true })} disabled={loading}
              className="flex-1 flex items-center gap-3 p-3 rounded-xl border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/15 transition-colors text-left">
              <FileText className="h-5 w-5 text-violet-300 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{storedFile.fileName}</p>
                <p className="text-[10px] text-violet-300/60">Click to analyse stored resume</p>
              </div>
              {loading ? <Loader2 className="h-4 w-4 animate-spin text-violet-300 shrink-0" /> : <Zap className="h-4 w-4 text-violet-300 shrink-0" />}
            </button>
          )}
          <div onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) { const form = new FormData(); form.append("file", f); runAnalysis(form) } }}
            onClick={() => !loading && fileRef.current?.click()}
            className={`flex-1 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-5 cursor-pointer transition-all ${dragOver ? "border-violet-400 bg-violet-500/10" : "border-violet-700/50 hover:border-violet-500/60"} ${loading ? "pointer-events-none opacity-50" : ""}`}>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={onFileInput} />
            <Upload className="h-6 w-6 text-violet-400" />
            <p className="text-xs text-violet-200 text-center">{loading ? "Analysing…" : "Upload resume (PDF/DOC/TXT)"}</p>
          </div>
        </div>

        {error && <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="rounded-2xl border border-border bg-card p-10 flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <Brain className="absolute inset-0 m-auto h-7 w-7 text-primary" />
          </div>
          <div className="text-center">
            <p className="font-bold text-foreground">Analysing your resume…</p>
            <p className="text-sm text-muted-foreground mt-1">Running ATS check · Grading bullets · Matching job roles · Finding gaps</p>
          </div>
        </div>
      )}

      {/* Results */}
      {a && !loading && (
        <div className="space-y-5">
          {/* Hero scores */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="flex items-center gap-8">
                <ScoreRing score={a.overallScore} size={110} label="Overall Score" />
                <ScoreRing score={a.atsScore} size={90} label="ATS Score" />
                <ScoreRing score={a.interviewReadiness ?? 0} size={90} label="Interview Ready" />
              </div>
              <div className="flex-1 space-y-3 w-full">
                <p className="text-sm font-semibold text-foreground mb-1">Score Breakdown</p>
                {(a as any).overallReason && (
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed italic">{(a as any).overallReason}</p>
                )}
                {Object.values(a.scoreBreakdown ?? {}).map((s: any) => {
                  const pct = Math.round((s.score / s.max) * 100)
                  const c = pct >= 75 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444"
                  return (
                    <div key={s.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{s.label}</span>
                        <span className="font-bold tabular-nums" style={{ color: c }}>{s.score}/{s.max}</span>
                      </div>
                      <BarScore value={s.score} max={s.max} color={c} />
                      {s.why && <p className="text-[10px] text-muted-foreground italic pl-1">{s.why}</p>}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1.5 flex-wrap">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={activeTab === t.id
                  ? { background: "rgba(124,58,237,0.20)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.35)" }
                  : { background: "transparent", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Overview tab */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* Critical issues */}
              {(a.criticalIssues ?? []).length > 0 && (
                <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-4">
                  <p className="text-sm font-bold text-red-400 mb-2 flex items-center gap-2"><AlertCircle className="h-4 w-4" />Critical Issues</p>
                  <ul className="space-y-1">{a.criticalIssues.map((c, i) => <li key={i} className="text-sm text-muted-foreground flex items-start gap-2"><XCircle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />{c}</li>)}</ul>
                </div>
              )}
              {/* Strengths */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-2"><Star className="h-4 w-4" />Strengths</p>
                <ul className="space-y-1">{(a.strengthPoints ?? []).map((s, i) => <li key={i} className="text-sm text-muted-foreground flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />{s}</li>)}</ul>
              </div>
              {/* AI Summary */}
              {a.improvedSummary && (
                <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                  <p className="text-sm font-bold text-violet-400 mb-2 flex items-center gap-2"><Sparkles className="h-4 w-4" />AI-Enhanced Professional Summary</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{a.improvedSummary}</p>
                  {(a as any).summaryExplanation && (
                    <div className="mt-3 rounded-lg bg-violet-500/10 p-3">
                      <p className="text-[10px] font-bold text-violet-400 mb-1">WHY THIS WORKS</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{(a as any).summaryExplanation}</p>
                    </div>
                  )}
                </div>
              )}
              {/* ATS with reason */}
              <div className="rounded-xl border border-border bg-card/50 p-4">
                <p className="text-sm font-bold text-foreground mb-1">ATS Keywords</p>
                {(a as any).atsReason && <p className="text-xs text-muted-foreground mb-3 italic">{(a as any).atsReason}</p>}
                <div className="space-y-2">
                  <div><p className="text-xs text-emerald-400 font-semibold mb-1.5">✓ Found in resume</p><div className="flex flex-wrap gap-1.5">{(a.atsKeywords?.found ?? []).map(k => <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{k}</span>)}</div></div>
                  <div><p className="text-xs text-red-400 font-semibold mb-1.5">✗ Missing — add these to your resume</p><div className="flex flex-wrap gap-1.5">{(a.atsKeywords?.missing ?? []).map(k => <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">{k}</span>)}</div></div>
                  {(a as any).atsKeywords?.suggestedReason && <p className="text-[10px] text-muted-foreground italic">{(a as any).atsKeywords.suggestedReason}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Sections tab */}
          {activeTab === "sections" && (
            <div className="space-y-3">
              {(a.sectionScores ?? []).map(s => (
                <div key={s.name} className="rounded-xl border border-border bg-card/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black" style={{ background: `${GRADE_COLOR[s.grade] ?? "#6366f1"}20`, color: GRADE_COLOR[s.grade] ?? "#6366f1" }}>{s.grade}</span>
                      <span className="font-semibold text-sm text-foreground">{s.name}</span>
                    </div>
                    <span className="text-sm font-bold tabular-nums" style={{ color: s.score >= 75 ? "#10b981" : s.score >= 50 ? "#f59e0b" : "#ef4444" }}>{s.score}/100</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 mb-2">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.score}%`, background: GRADE_COLOR[s.grade] ?? "#6366f1" }} />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.feedback}</p>
                  {s.issues?.length > 0 && <ul className="mt-2 space-y-1">{s.issues.map((iss, i) => <li key={i} className="text-xs text-amber-400 flex items-start gap-1.5"><AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />{iss}</li>)}</ul>}
                  {(s as any).howToFix && (
                    <div className="mt-2 px-3 py-2 rounded-lg bg-blue-500/5 border border-blue-500/15">
                      <p className="text-[10px] font-bold text-blue-400 mb-0.5">HOW TO FIX</p>
                      <p className="text-xs text-muted-foreground">{(s as any).howToFix}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Bullet Analysis tab */}
          {activeTab === "bullets" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Line-by-line analysis of your resume bullets with AI-rewritten improvements.</p>
              {(a.bulletAnalysis ?? []).map((b, i) => (
                <div key={i} className="rounded-xl border border-border bg-card/50 p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-foreground font-medium flex-1">"{b.original}"</p>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black" style={{ background: b.score >= 7 ? "#10b98120" : b.score >= 5 ? "#f59e0b20" : "#ef444420", color: b.score >= 7 ? "#10b981" : b.score >= 5 ? "#f59e0b" : "#ef4444" }}>{b.score}/10</span>
                  </div>
                  {b.issues?.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-amber-400">ISSUES FOUND</p>
                      {b.issues.map((iss, j) => <p key={j} className="text-xs text-muted-foreground flex items-start gap-1.5"><AlertCircle className="h-3 w-3 text-amber-400 shrink-0 mt-0.5" />{iss}</p>)}
                    </div>
                  )}
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                    <p className="text-[10px] font-bold text-emerald-400 mb-1">✦ AI REWRITTEN BULLET</p>
                    <p className="text-sm text-emerald-100 font-medium">{b.improved}</p>
                  </div>
                  {b.explanation && (
                    <div className="rounded-lg border border-blue-500/15 bg-blue-500/5 p-3">
                      <p className="text-[10px] font-bold text-blue-400 mb-1">WHY THIS IS BETTER</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{b.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Skills tab */}
          {activeTab === "skills" && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-card/50 p-4">
                  <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Hard Skills Present</p>
                  <div className="flex flex-wrap gap-1.5">{(a.hardSkills?.present ?? []).map(s => <span key={s} className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{s}</span>)}</div>
                </div>
                <div className="rounded-xl border border-border bg-card/50 p-4">
                  <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><ArrowRight className="h-4 w-4 text-amber-400" />Suggested to Add</p>
                  <div className="flex flex-wrap gap-1.5">{(a.hardSkills?.suggested ?? []).map(s => <span key={s} className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">{s}</span>)}</div>
                </div>
              </div>
              {a.formattingIssues?.length > 0 && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                  <p className="text-sm font-semibold text-foreground mb-2">Formatting Issues</p>
                  <ul className="space-y-1">{a.formattingIssues.map((f, i) => <li key={i} className="text-xs text-muted-foreground flex items-start gap-2"><AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />{f}</li>)}</ul>
                </div>
              )}
              <div className="rounded-xl border border-border bg-card/50 p-4">
                <p className="text-sm font-semibold text-foreground mb-1">Word Count</p>
                <p className="text-sm text-muted-foreground">Current: <strong className="text-foreground">{a.wordCount?.current ?? "N/A"}</strong> · Ideal: {a.wordCount?.ideal} · <span style={{ color: a.wordCount?.status === "Good" ? "#10b981" : "#f59e0b" }}>{a.wordCount?.status}</span></p>
              </div>
            </div>
          )}

          {/* Job Match tab */}
          {activeTab === "jobs" && (
            <div className="space-y-3">
              {(a.jobMatches ?? []).map((j, i) => (
                <div key={i} className="rounded-xl border border-border bg-card/50 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-foreground">{j.role}</p>
                      <p className="text-xs text-muted-foreground">{j.company}</p>
                    </div>
                    <span className="text-2xl font-black tabular-nums" style={{ color: j.match >= 80 ? "#10b981" : j.match >= 60 ? "#f59e0b" : "#ef4444" }}>{j.match}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 mb-3">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${j.match}%`, background: j.match >= 80 ? "#10b981" : j.match >= 60 ? "#f59e0b" : "#ef4444" }} />
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{j.reason}</p>
                  {j.missingSkills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {j.missingSkills.map(s => <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Missing: {s}</span>)}
                    </div>
                  )}
                  {(j as any).howToClose && (
                    <div className="mt-2 px-3 py-2 rounded-lg bg-violet-500/5 border border-violet-500/15">
                      <p className="text-[10px] font-bold text-violet-400 mb-0.5">HOW TO CLOSE THE GAP</p>
                      <p className="text-xs text-muted-foreground">{(j as any).howToClose}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Quick Wins tab */}
          {activeTab === "wins" && (
            <div className="space-y-3">
              {(a.quickWins ?? []).map((w, i) => (
                <div key={i} className="flex items-start gap-4 rounded-xl border border-border bg-card/50 p-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold">{i+1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{w.action}</p>
                    {(w as any).whyItMatters && (
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{(w as any).whyItMatters}</p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: `${IMPACT_COLOR[w.impact] ?? "#6366f1"}20`, color: IMPACT_COLOR[w.impact] ?? "#6366f1", border: `1px solid ${IMPACT_COLOR[w.impact] ?? "#6366f1"}30` }}>{w.impact} impact</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground border border-border">{w.effort} effort</span>
                    </div>
                  </div>
                </div>
              ))}
              {a.linkedinTips?.length > 0 && (
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                  <p className="text-sm font-bold text-blue-400 mb-2">LinkedIn Optimisation Tips</p>
                  <ul className="space-y-1">{a.linkedinTips.map((t, i) => <li key={i} className="text-xs text-muted-foreground flex items-start gap-2"><ArrowRight className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />{t}</li>)}</ul>
                </div>
              )}
              {/* Interview readiness with reason */}
              <div className="rounded-xl border border-border bg-card/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-foreground">Interview Readiness</p>
                  <span className="text-2xl font-black tabular-nums" style={{ color: (a.interviewReadiness ?? 0) >= 70 ? "#10b981" : (a.interviewReadiness ?? 0) >= 50 ? "#f59e0b" : "#ef4444" }}>{a.interviewReadiness ?? 0}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 mb-2">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${a.interviewReadiness ?? 0}%`, background: (a.interviewReadiness ?? 0) >= 70 ? "#10b981" : "#f59e0b" }} />
                </div>
                {(a as any).interviewReadinessReason && (
                  <p className="text-xs text-muted-foreground leading-relaxed">{(a as any).interviewReadinessReason}</p>
                )}
              </div>
              {/* AI Summary with explanation */}
              {a.improvedSummary && (
                <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                  <p className="text-sm font-bold text-violet-400 mb-2 flex items-center gap-2"><Sparkles className="h-4 w-4" />AI-Rewritten Professional Summary</p>
                  <p className="text-sm text-foreground leading-relaxed font-medium mb-3">{a.improvedSummary}</p>
                  {(a as any).summaryExplanation && (
                    <div className="rounded-lg bg-violet-500/10 p-3">
                      <p className="text-[10px] font-bold text-violet-400 mb-1">WHY THIS WORKS</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{(a as any).summaryExplanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
