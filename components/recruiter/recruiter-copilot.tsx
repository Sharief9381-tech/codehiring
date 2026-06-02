"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sparkles, Loader2, CheckCircle2, XCircle, User,
  Code2, Star, Trophy, ExternalLink, ChevronDown, ChevronUp
} from "lucide-react"
import Link from "next/link"

interface Candidate {
  _id: string
  name: string
  college: string
  branch: string
  matchScore: number
  matchedSkills: string[]
  missingSkills: string[]
  stats: { totalProblems: number; highestRating: number; githubContributions: number; contests: number }
  skills: string[]
  recommendation: string
  profileSlug: string
  aiReport: {
    recommendation: string
    problemSolving: number
    consistency: number
    technicalDepth: number
    summary: string
    risks: string[]
  } | null
}

const REC_COLOR: Record<string, string> = {
  "Strong Candidate": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "Good Candidate": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "Potential Candidate": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "Not Recommended": "bg-red-500/10 text-red-600 border-red-500/20",
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{value}/10</span>
      </div>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${value * 10}%` }} />
      </div>
    </div>
  )
}

export function RecruiterCopilot() {
  const [jd, setJd] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!jd.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/recruiter/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jd, topN: 5 }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ error: "Failed to analyze. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>Recruiter Copilot</CardTitle>
          <Badge className="text-xs bg-primary/10 text-primary">AI-Powered</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Paste a job description → AI finds your best matching candidates instantly
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste your job description here...&#10;&#10;Example: We are looking for a Java Backend Developer with Spring Boot experience, strong DSA skills, and familiarity with AWS and Docker..."
          className="min-h-[120px] bg-secondary resize-none"
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />
        <Button onClick={handleAnalyze} disabled={loading || !jd.trim()} className="gap-2 w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Analyzing candidates..." : "Find Best Candidates"}
        </Button>

        {result?.error && (
          <p className="text-sm text-destructive">{result.error}</p>
        )}

        {result && !result.error && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="rounded-lg bg-secondary/50 p-3 flex flex-wrap gap-3 text-sm">
              <span className="font-medium text-foreground">Role: {result.roleTitle}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{result.totalMatched} candidates matched</span>
              {result.requiredSkills?.length > 0 && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">Skills: {result.requiredSkills.join(", ")}</span>
                </>
              )}
            </div>

            {/* Candidates */}
            <div className="space-y-3">
              {result.candidates?.map((c: Candidate, i: number) => (
                <div key={c._id} className="rounded-xl border border-border bg-card overflow-hidden">
                  {/* Header row */}
                  <div className="flex items-center gap-3 p-4">
                    <span className="text-sm font-bold text-muted-foreground w-5">#{i + 1}</span>
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.college}{c.branch ? ` · ${c.branch}` : ""}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={`text-xs ${REC_COLOR[c.recommendation] || REC_COLOR["Good Candidate"]}`}>
                        {c.recommendation}
                      </Badge>
                      <Badge className="bg-primary/10 text-primary text-xs font-bold">{c.matchScore}%</Badge>
                      <button
                        onClick={() => setExpanded(expanded === c._id ? null : c._id)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {expanded === c._id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-3 gap-2 px-4 pb-3 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Code2 className="h-3 w-3" />{c.stats.totalProblems} solved
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Star className="h-3 w-3" />{c.stats.highestRating || "—"} rating
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Trophy className="h-3 w-3" />{c.stats.contests} contests
                    </div>
                  </div>

                  {/* Skills match */}
                  <div className="flex flex-wrap gap-1.5 px-4 pb-3">
                    {c.matchedSkills.map(s => (
                      <Badge key={s} className="text-xs gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                        <CheckCircle2 className="h-2.5 w-2.5" />{s}
                      </Badge>
                    ))}
                    {c.missingSkills.map(s => (
                      <Badge key={s} variant="outline" className="text-xs gap-1 text-red-500 border-red-500/30">
                        <XCircle className="h-2.5 w-2.5" />{s}
                      </Badge>
                    ))}
                  </div>

                  {/* Expanded AI report */}
                  {expanded === c._id && c.aiReport && (
                    <div className="border-t border-border p-4 space-y-3 bg-secondary/20">
                      <p className="text-sm text-foreground">{c.aiReport.summary}</p>
                      <div className="grid gap-2 sm:grid-cols-3">
                        <ScoreBar label="Problem Solving" value={c.aiReport.problemSolving} />
                        <ScoreBar label="Consistency" value={c.aiReport.consistency} />
                        <ScoreBar label="Technical Depth" value={c.aiReport.technicalDepth} />
                      </div>
                      {c.aiReport.risks?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {c.aiReport.risks.map((r: string) => (
                            <Badge key={r} variant="outline" className="text-xs text-amber-600 border-amber-500/30">
                              ⚠ {r}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <Link href={`/u/${c.profileSlug}`} target="_blank">
                        <Button size="sm" variant="outline" className="gap-2 bg-transparent mt-1">
                          <ExternalLink className="h-3.5 w-3.5" />View Public Profile
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
