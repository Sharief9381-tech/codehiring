"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sparkles, MapPin, Building2, IndianRupee, Clock,
  Bookmark, ExternalLink, CheckCircle, Target, Search,
  Loader2, Briefcase, ArrowRight, Star,
} from "lucide-react"
import { toast } from "sonner"

interface MatchedJob {
  _id: string; title: string; companyName: string; location: string
  salary: string; type: string; description: string; skills: string[]
  matchedSkills: string[]; missingSkills: string[]; matchScore: number
  deadline?: string; applications: number; createdAt: string; applyUrl?: string
}

interface StudentProfile {
  skills: string[]; totalProblems: number; rating: number
  platformCount: number; isOpenToWork: boolean
}

function getApplyHref(job: MatchedJob): string | null {
  const raw = job.applyUrl || ""
  if (!raw.trim()) return null
  if (raw.startsWith("http") || raw.startsWith("mailto:")) return raw
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) return `mailto:${raw}?subject=Application for ${encodeURIComponent(job.title)} at ${encodeURIComponent(job.companyName)}`
  return `https://${raw}`
}

function matchColor(score: number) {
  if (score >= 80) return { badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20", bar: "bg-emerald-500" }
  if (score >= 60) return { badge: "bg-amber-500/15 text-amber-400 border-amber-500/20", bar: "bg-amber-500" }
  return { badge: "bg-orange-500/15 text-orange-400 border-orange-500/20", bar: "bg-orange-500" }
}

function timeAgo(d: string) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}

async function fetchStudentProfile(): Promise<StudentProfile> {
  try {
    const res = await fetch("/api/auth/user", { credentials: "include", cache: "no-store" })
    if (res.ok) {
      const { user } = await res.json()
      if (user) {
        const platforms = user.linkedPlatforms ?? {}
        const platformCount = Object.keys(platforms).filter(k => platforms[k]).length
        let totalProblems = 0, rating = 0
        Object.entries(platforms).forEach(([, info]: [string, any]) => {
          if (!info?.stats) return
          const s = info.stats
          totalProblems += s.totalSolved || s.problemsSolved || 0
          const r = Math.max(s.rating || 0, s.currentRating || 0, s.highestRating || 0, s.contestRating || 0)
          if (r > rating) rating = r
        })
        return { skills: user.skills ?? [], totalProblems, rating, platformCount, isOpenToWork: user.isOpenToWork ?? true }
      }
    }
  } catch {}
  return { skills: [], totalProblems: 0, rating: 0, platformCount: 0, isOpenToWork: true }
}

export function JobMatches() {
  const [jobs, setJobs] = useState<MatchedJob[]>([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [savedJobs, setSavedJobs] = useState<string[]>([])
  const [applying, setApplying] = useState<string | null>(null)
  const [applied, setApplied] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [jobsMeta, setJobsMeta] = useState<{ totalJobs: number; eligibleJobs: number } | null>(null)

  useEffect(() => {
    const load = async () => {
      const p = await fetchStudentProfile()
      setProfile(p)
      try {
        const params = new URLSearchParams({
          skills: p.skills.join(","), problems: String(p.totalProblems),
          rating: String(p.rating), platforms: String(p.platformCount),
          openToWork: String(p.isOpenToWork),
        })
        const res = await fetch(`/api/student/jobs?${params}`)
        const data = await res.json()
        setJobs(data.jobs ?? [])
        setJobsMeta({ totalJobs: data.totalJobs ?? 0, eligibleJobs: data.eligibleJobs ?? 0 })
      } catch { setJobs([]) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const handleApply = async (job: MatchedJob) => {
    const href = getApplyHref(job)
    setApplying(job._id)
    // Record in DB
    fetch("/api/student/jobs/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: job._id }),
    }).catch(() => {})
    setApplied((prev) => [...prev, job._id])
    setApplying(null)
    if (href) { window.open(href, "_blank", "noopener,noreferrer") }
    else { toast.info("Contact the recruiter directly to apply.") }
  }

  const filtered = jobs.filter((job) => {
    const q = searchQuery.toLowerCase()
    const matchSearch = !q || job.title.toLowerCase().includes(q) || job.companyName.toLowerCase().includes(q)
    const matchType = typeFilter === "all" || job.type.toLowerCase() === typeFilter.toLowerCase()
    return matchSearch && matchType
  })

  const savedList = jobs.filter((j) => savedJobs.includes(j._id))
  const avgMatch = jobs.length > 0 ? Math.round(jobs.slice(0, 5).reduce((s, j) => s + j.matchScore, 0) / Math.min(jobs.length, 5)) : 0

  function JobCard({ job }: { job: MatchedJob }) {
    const mc = matchColor(job.matchScore)
    const isApplied = applied.includes(job._id)
    return (
      <div className="group rounded-2xl border border-border/60 bg-card hover:border-primary/30 transition-all p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-sm font-bold text-foreground">{job.title}</h3>
              <Badge className={`text-[10px] px-2 py-0 shrink-0 ${mc.badge}`}>
                <Star className="h-2.5 w-2.5 mr-0.5" />{job.matchScore}% match
              </Badge>
              {isApplied && <Badge className="text-[10px] px-2 py-0 bg-emerald-500/15 text-emerald-400 border-emerald-500/20">✓ Applied</Badge>}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{job.companyName}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
              {job.salary && <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" />{job.salary}</span>}
              <Badge variant="secondary" className="text-[10px]">{job.type}</Badge>
            </div>
          </div>
          <button onClick={() => setSavedJobs((p) => p.includes(job._id) ? p.filter(x => x !== job._id) : [...p, job._id])}
            className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
            <Bookmark className={`h-4 w-4 ${savedJobs.includes(job._id) ? "fill-current text-primary" : ""}`} />
          </button>
        </div>

        {/* Match score bar */}
        <div className="space-y-1">
          <div className="h-1 w-full rounded-full bg-secondary overflow-hidden">
            <div className={`h-full rounded-full ${mc.bar} transition-all`} style={{ width: `${job.matchScore}%` }} />
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2">{job.description}</p>

        {/* Skills */}
        {job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((skill) => (
              <Badge key={skill} variant={job.matchedSkills.includes(skill) ? "default" : "secondary"}
                className={`text-[10px] px-2 py-0 ${job.matchedSkills.includes(skill) ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" : ""}`}>
                {job.matchedSkills.includes(skill) && <CheckCircle className="h-2.5 w-2.5 mr-0.5" />}
                {skill}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{timeAgo(job.createdAt)}</span>
            <span>{job.applications} applicants</span>
            {job.deadline && <span>Due {job.deadline}</span>}
          </div>
          <Button size="sm" disabled={applying === job._id || isApplied}
            className={`h-7 gap-1.5 text-xs ${isApplied ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20" : "bg-primary text-primary-foreground"}`}
            onClick={() => handleApply(job)}>
            {applying === job._id ? <Loader2 className="h-3 w-3 animate-spin" /> :
              isApplied ? "✓ Applied" : <><ArrowRight className="h-3 w-3" />Apply Now</>}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Tabs defaultValue="matches" className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TabsList>
          <TabsTrigger value="matches" className="gap-1.5 text-xs">
            <Sparkles className="h-3.5 w-3.5" />
            Matched{jobs.length > 0 && <span className="opacity-60 ml-0.5">({jobs.length})</span>}
          </TabsTrigger>
          <TabsTrigger value="saved" className="gap-1.5 text-xs">
            <Bookmark className="h-3.5 w-3.5" />
            Saved{savedList.length > 0 && <span className="opacity-60 ml-0.5">({savedList.length})</span>}
          </TabsTrigger>
        </TabsList>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-52">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search jobs..." className="pl-9 h-9 text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32 h-9 text-sm">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Matches tab */}
      <TabsContent value="matches" className="space-y-4 mt-0">
        {/* Profile card */}
        {profile && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 shrink-0">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Your Match Profile</p>
              <p className="text-xs text-muted-foreground">
                {profile.platformCount} platform{profile.platformCount !== 1 ? "s" : ""} · {profile.totalProblems} problems{profile.rating > 0 ? ` · Rating ${profile.rating}` : ""}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-black text-primary tabular-nums">{avgMatch}%</p>
              <p className="text-[10px] text-muted-foreground">Avg Match</p>
            </div>
          </div>
        )}

        {/* Eligibility banner */}
        {!loading && jobsMeta && jobsMeta.totalJobs > 0 && (
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs border ${
            jobsMeta.eligibleJobs === jobsMeta.totalJobs
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
          }`}>
            <CheckCircle className="h-3.5 w-3.5 shrink-0" />
            You're eligible for <strong className="mx-1">{jobsMeta.eligibleJobs}</strong> of <strong className="mx-1">{jobsMeta.totalJobs}</strong> active jobs.
            {jobsMeta.eligibleJobs < jobsMeta.totalJobs && <> Solve more problems to unlock more.</>}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-muted-foreground" /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
              <Briefcase className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">{jobs.length === 0 ? "No job postings yet" : "No jobs match your search"}</p>
            <p className="text-sm text-muted-foreground">{jobs.length === 0 ? "Recruiters haven't posted jobs yet. Check back soon." : "Try adjusting your search"}</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((job) => <JobCard key={job._id} job={job} />)}
          </div>
        )}
      </TabsContent>

      {/* Saved tab */}
      <TabsContent value="saved" className="space-y-3 mt-0">
        {savedList.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
              <Bookmark className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">No saved jobs yet</p>
            <p className="text-sm text-muted-foreground">Bookmark jobs from the Matched Jobs tab</p>
          </div>
        ) : (
          savedList.map((job) => <JobCard key={job._id} job={job} />)
        )}
      </TabsContent>
    </Tabs>
  )
}
