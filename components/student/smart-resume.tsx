"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Upload, FileText, Sparkles, Loader2, CheckCircle2,
  XCircle, Building2, Users, AlertCircle, RefreshCw,
  TrendingUp, Star, Lightbulb, Target, Shield, Zap,
} from "lucide-react"

interface ResumeAnalysis {
  summary: string
  strengths: string[]
  improvements: string[]
  atsScore: number
  atsKeywords: string[]
  enhancedSummary: string
  skillsFound: string[]
  recommendedRoles: string[]
  sections: {
    contact: boolean
    education: boolean
    experience: boolean
    projects: boolean
    skills: boolean
    certifications: boolean
  }
}

interface SmartResumeData {
  analysis: ResumeAnalysis
  originalFileName: string
  analyzedAt: string
  sharedWithCollege: boolean
  sharedWithRecruiters: boolean
}

interface StoredFileMeta {
  fileName: string
  sizeBytes: number
  uploadedAt: string
  mimeType: string
}

function ATSGauge({ score }: { score: number }) {
  const color = score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-red-500"
  const strokeColor = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444"
  const circ = 2 * Math.PI * 32
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
          <circle cx="40" cy="40" r="32" fill="none" strokeWidth="8"
            strokeDasharray={`${(score / 100) * circ} ${circ}`}
            strokeLinecap="round" stroke={strokeColor} />
        </svg>
        <span className={`absolute text-2xl font-bold ${color}`}>{score}</span>
      </div>
      <span className="text-xs text-muted-foreground">ATS Score</span>
    </div>
  )
}

export function SmartResume() {
  const [data, setData]               = useState<SmartResumeData | null>(null)
  const [storedFile, setStoredFile]   = useState<StoredFileMeta | null>(null)
  const [loading, setLoading]         = useState(false)
  const [fetching, setFetching]       = useState(true)
  const [error, setError]             = useState<string | null>(null)
  const [dragOver, setDragOver]       = useState(false)
  const [sharingLoading, setSharingLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Load existing analysis + stored file metadata on mount
  useEffect(() => {
    Promise.all([
      fetch("/api/student/smart-resume", { credentials: "include" })
        .then(r => r.json())
        .catch(() => ({})),
      fetch("/api/student/profile", { credentials: "include" })
        .then(r => r.json())
        .catch(() => ({})),
    ]).then(([smartData, profileData]) => {
      if (smartData.smartResume) setData(smartData.smartResume)
      if (profileData.user?.resumeFile?.fileName) setStoredFile(profileData.user.resumeFile)
    }).finally(() => setFetching(false))
  }, [])

  // ── Analyse: upload a new file ──────────────────────────────────────────────
  async function analyseFile(file: File) {
    setLoading(true)
    setError(null)
    const form = new FormData()
    form.append("file", file)
    try {
      const res = await fetch("/api/student/smart-resume", {
        method: "POST",
        credentials: "include",
        body: form,
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? "Analysis failed"); return }
      setData(json.smartResume)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // ── Analyse: re-use the stored resumeFile from MongoDB ─────────────────────
  async function analyseStoredFile() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/student/smart-resume", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useStored: true }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? "Analysis failed"); return }
      setData(json.smartResume)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function updateSharing(field: "sharedWithCollege" | "sharedWithRecruiters", value: boolean) {
    if (!data) return
    setSharingLoading(true)
    try {
      const res = await fetch("/api/student/smart-resume", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      })
      const json = await res.json()
      if (res.ok) setData(json.smartResume)
    } catch { /* ignore */ }
    finally { setSharingLoading(false) }
  }

  function onFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) analyseFile(f)
    e.target.value = ""
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f) analyseFile(f)
  }

  if (fetching) return (
    <div className="flex items-center justify-center py-20 text-muted-foreground text-sm gap-2">
      <Loader2 className="h-4 w-4 animate-spin" /> Loading...
    </div>
  )

  const a = data?.analysis

  return (
    <div className="space-y-6">
      {/* ── Header upload card ───────────────────────────────────────────── */}
      <Card className="bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 border-violet-700/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 border border-violet-500/30">
              <Sparkles className="h-5 w-5 text-violet-300" />
            </div>
            <div>
              <CardTitle className="text-white">Smart Resume</CardTitle>
              <CardDescription className="text-violet-200/70">
                AI analyses your resume and gives an ATS score, skill gaps, and recruiter-ready improvements
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">

          {/* Stored file — quick analyse button */}
          {storedFile && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-500/10 border border-violet-500/30">
              <div className="w-9 h-9 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 text-violet-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{storedFile.fileName}</p>
                <p className="text-[10px] text-violet-300/70">
                  {(storedFile.sizeBytes / 1024).toFixed(0)} KB · uploaded {new Date(storedFile.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <Button
                size="sm"
                onClick={analyseStoredFile}
                disabled={loading}
                className="gap-1.5 bg-violet-500 hover:bg-violet-400 text-white border-0 shrink-0"
              >
                {loading
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Zap className="h-3.5 w-3.5" />
                }
                {loading ? "Analysing…" : "Analyse"}
              </Button>
            </div>
          )}

          {/* Drop zone — upload a different file */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => !loading && fileRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-7 cursor-pointer transition-all
              ${dragOver ? "border-violet-400 bg-violet-500/10" : "border-violet-700/50 hover:border-violet-500/70 hover:bg-violet-500/5"}
              ${loading ? "pointer-events-none opacity-60" : ""}`}
          >
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={onFileInput} />
            {loading ? (
              <>
                <Loader2 className="h-9 w-9 text-violet-400 animate-spin" />
                <p className="text-sm text-violet-200 font-medium">Analysing with AI…</p>
                <p className="text-xs text-violet-300/60">This takes 5–15 seconds</p>
              </>
            ) : (
              <>
                <Upload className="h-9 w-9 text-violet-400" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">
                    {storedFile ? "Upload a different file" : data ? "Re-upload to refresh analysis" : "Upload your resume"}
                  </p>
                  <p className="text-xs text-violet-300/70 mt-0.5">PDF, DOC, DOCX or TXT · max 5 MB</p>
                </div>
                {data && !storedFile && (
                  <div className="flex items-center gap-1.5 text-xs text-violet-300/60">
                    <FileText className="h-3.5 w-3.5" />
                    Last: {data.originalFileName} · {new Date(data.analyzedAt).toLocaleDateString()}
                  </div>
                )}
              </>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Analysis results ─────────────────────────────────────────────── */}
      {a && data && (
        <div className="space-y-4">

          {/* Score + sharing */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="bg-card border-border">
              <CardContent className="flex items-center gap-6 pt-6">
                <ATSGauge score={a.atsScore} />
                <div className="space-y-2 flex-1">
                  <p className="font-semibold text-sm">ATS Compatibility</p>
                  <p className="text-xs text-muted-foreground">
                    {a.atsScore >= 80
                      ? "Great — your resume passes most ATS filters."
                      : a.atsScore >= 60
                      ? "Decent score. A few tweaks can push this above 80."
                      : "Needs work — many ATS systems may filter this out."}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(a.atsKeywords ?? []).slice(0, 5).map(k => (
                      <Badge key={k} variant="secondary" className="text-[10px] px-2 py-0">{k}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" /> Visibility Settings
                </CardTitle>
                <CardDescription className="text-xs">Control who can see your AI-enhanced resume</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { id: "share-college",    field: "sharedWithCollege" as const,    icon: Building2, color: "text-blue-500",    label: "Share with College",    sub: "Placement officers can view" },
                  { id: "share-recruiters", field: "sharedWithRecruiters" as const, icon: Users,     color: "text-emerald-500", label: "Share with Recruiters", sub: "Recruiters on platform can view" },
                ].map(({ id, field, icon: Icon, color, label, sub }) => (
                  <div key={id} className="flex items-center justify-between">
                    <Label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
                      <Icon className={`h-4 w-4 ${color}`} />
                      <div>
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground">{sub}</p>
                      </div>
                    </Label>
                    <Switch id={id} checked={(data as any)[field]} disabled={sharingLoading}
                      onCheckedChange={v => updateSharing(field, v)} />
                  </div>
                ))}
                {(data.sharedWithCollege || data.sharedWithRecruiters) && (
                  <p className="text-xs text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Your enhanced resume is live and visible
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced summary */}
          <Card className="bg-gradient-to-br from-emerald-950 to-teal-950 border-emerald-700/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-emerald-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> AI-Enhanced Professional Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-emerald-100/90 leading-relaxed">{a.enhancedSummary}</p>
            </CardContent>
          </Card>

          {/* Strengths / Improvements / Roles */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Strengths", icon: <Star className="h-4 w-4 text-amber-500" />,
                items: a.strengths ?? [],
                renderIcon: () => <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />,
              },
              {
                title: "Improvements", icon: <Lightbulb className="h-4 w-4 text-orange-500" />,
                items: a.improvements ?? [],
                renderIcon: () => <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />,
              },
              {
                title: "Recommended Roles", icon: <Target className="h-4 w-4 text-violet-500" />,
                items: a.recommendedRoles ?? [],
                renderIcon: () => <TrendingUp className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />,
              },
            ].map(({ title, icon, items, renderIcon }) => (
              <Card key={title} className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">{icon}{title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {items.length === 0
                    ? <p className="text-xs text-muted-foreground">None detected</p>
                    : items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        {renderIcon()}
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))
                  }
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Skills + sections detected */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Skills Detected</CardTitle>
              </CardHeader>
              <CardContent>
                {(a.skillsFound ?? []).length === 0
                  ? <p className="text-xs text-muted-foreground">No skills detected</p>
                  : <div className="flex flex-wrap gap-1.5">
                      {(a.skillsFound ?? []).map(s => (
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                }
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Resume Sections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(a.sections ?? {}).map(([key, present]) => (
                    <div key={key} className="flex items-center gap-2 text-sm capitalize">
                      {present
                        ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        : <XCircle className="h-4 w-4 text-red-400" />}
                      <span className={present ? "text-foreground" : "text-muted-foreground"}>{key}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Re-analyse footer */}
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-muted-foreground">
              Analysed: <span className="font-medium">{data.originalFileName}</span> · {new Date(data.analyzedAt).toLocaleDateString()}
            </p>
            <div className="flex gap-2">
              {storedFile && (
                <Button variant="outline" size="sm" className="gap-2" onClick={analyseStoredFile} disabled={loading}>
                  <RefreshCw className="h-3.5 w-3.5" /> Re-analyse stored file
                </Button>
              )}
              <Button variant="outline" size="sm" className="gap-2" onClick={() => fileRef.current?.click()} disabled={loading}>
                <Upload className="h-3.5 w-3.5" /> Upload new file
              </Button>
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={onFileInput} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
