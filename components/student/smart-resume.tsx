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
  TrendingUp, Star, Lightbulb, Target, Shield,
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

function ATSGauge({ score }: { score: number }) {
  const color =
    score >= 80 ? "text-emerald-500" :
    score >= 60 ? "text-amber-500" :
    "text-red-500"
  const bg =
    score >= 80 ? "bg-emerald-500" :
    score >= 60 ? "bg-amber-500" :
    "bg-red-500"

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
          <circle
            cx="40" cy="40" r="32" fill="none" strokeWidth="8"
            strokeDasharray={`${(score / 100) * 201} 201`}
            strokeLinecap="round"
            className={bg.replace("bg-", "stroke-")}
          />
        </svg>
        <span className={`absolute text-2xl font-bold ${color}`}>{score}</span>
      </div>
      <span className="text-xs text-muted-foreground">ATS Score</span>
    </div>
  )
}

export function SmartResume() {
  const [data, setData] = useState<SmartResumeData | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [sharingLoading, setSharingLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // load existing analysis on mount
  useEffect(() => {
    fetch("/api/student/smart-resume", { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (d.smartResume) setData(d.smartResume) })
      .catch(() => {})
      .finally(() => setFetching(false))
  }, [])

  async function analyse(file: File) {
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
    if (f) analyse(f)
    e.target.value = ""
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f) analyse(f)
  }

  if (fetching) return (
    <div className="flex items-center justify-center py-20 text-muted-foreground text-sm gap-2">
      <Loader2 className="h-4 w-4 animate-spin" /> Loading...
    </div>
  )

  const a = data?.analysis

  return (
    <div className="space-y-6">
      {/* Header card */}
      <Card className="bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 border-violet-700/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 border border-violet-500/30">
              <Sparkles className="h-5 w-5 text-violet-300" />
            </div>
            <div>
              <CardTitle className="text-white">Smart Resume</CardTitle>
              <CardDescription className="text-violet-200/70">
                Upload your resume — AI analyses it and creates an enhanced version visible to colleges and recruiters
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => !loading && fileRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all
              ${dragOver ? "border-violet-400 bg-violet-500/10" : "border-violet-700/50 hover:border-violet-500/70 hover:bg-violet-500/5"}
              ${loading ? "pointer-events-none opacity-70" : ""}`}
          >
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={onFileInput} />
            {loading ? (
              <>
                <Loader2 className="h-10 w-10 text-violet-400 animate-spin" />
                <p className="text-sm text-violet-200 font-medium">Analysing with AI...</p>
                <p className="text-xs text-violet-300/60">This takes 5–10 seconds</p>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 text-violet-400" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">
                    {data ? "Re-upload to refresh analysis" : "Upload your resume"}
                  </p>
                  <p className="text-xs text-violet-300/70 mt-1">PDF, DOC, DOCX or TXT · max 5 MB</p>
                </div>
                {data && (
                  <div className="flex items-center gap-1.5 text-xs text-violet-300/60">
                    <FileText className="h-3.5 w-3.5" />
                    Last: {data.originalFileName} ·{" "}
                    {new Date(data.analyzedAt).toLocaleDateString()}
                  </div>
                )}
              </>
            )}
          </div>
          {error && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis results */}
      {a && data && (
        <div className="space-y-4">
          {/* Score + sharing row */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* ATS Score */}
            <Card className="bg-card border-border">
              <CardContent className="flex items-center gap-6 pt-6">
                <ATSGauge score={a.atsScore} />
                <div className="space-y-2 flex-1">
                  <p className="font-semibold text-sm">ATS Compatibility</p>
                  <p className="text-xs text-muted-foreground">
                    {a.atsScore >= 80
                      ? "Great! Your resume passes most ATS filters."
                      : a.atsScore >= 60
                      ? "Decent score. A few improvements can push this above 80."
                      : "Needs work. Many ATS systems may filter this out."}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {a.atsKeywords.slice(0, 5).map(k => (
                      <Badge key={k} variant="secondary" className="text-[10px] px-2 py-0">{k}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sharing controls */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Visibility Settings
                </CardTitle>
                <CardDescription className="text-xs">
                  Control who can see your AI-enhanced resume
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="share-college" className="flex items-center gap-2 cursor-pointer">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Share with College</p>
                      <p className="text-xs text-muted-foreground">Placement officers can view</p>
                    </div>
                  </Label>
                  <Switch
                    id="share-college"
                    checked={data.sharedWithCollege}
                    disabled={sharingLoading}
                    onCheckedChange={v => updateSharing("sharedWithCollege", v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="share-recruiters" className="flex items-center gap-2 cursor-pointer">
                    <Users className="h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="text-sm font-medium">Share with Recruiters</p>
                      <p className="text-xs text-muted-foreground">Recruiters on platform can view</p>
                    </div>
                  </Label>
                  <Switch
                    id="share-recruiters"
                    checked={data.sharedWithRecruiters}
                    disabled={sharingLoading}
                    onCheckedChange={v => updateSharing("sharedWithRecruiters", v)}
                  />
                </div>
                {(data.sharedWithCollege || data.sharedWithRecruiters) && (
                  <p className="text-xs text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Your enhanced resume is live and visible
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

          {/* 3-col grid: strengths, improvements, roles */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" /> Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {a.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{s}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-orange-500" /> Improvements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {a.improvements.map((imp, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{imp}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4 text-violet-500" /> Recommended Roles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {a.recommendedRoles.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{r}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Skills + sections detected */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Skills Detected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {a.skillsFound.map(s => (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Resume Sections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(a.sections).map(([key, present]) => (
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

          {/* Re-analyse button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => fileRef.current?.click()}
              disabled={loading}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Re-analyse with new file
            </Button>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={onFileInput} />
          </div>
        </div>
      )}
    </div>
  )
}
