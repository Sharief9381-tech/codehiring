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
  Loader2, Briefcase,
} from "lucide-react"

interface MatchedJob {
  _id: string
  title: string
  companyName: string
  location: string
  salary: string
  type: string
  description: string
  skills: string[]
  matchedSkills: string[]
  missingSkills: string[]
  matchScore: number
  deadline?: string
  applications: number
  createdAt: string
  applyUrl?: string
}

interface StudentProfile {
  skills: string[]
  totalProblems: number
  rating: number
  platformCount: number
  isOpenToWork: boolean
}

function getApplyHref(job: MatchedJob): string | null {
  const raw = job.applyUrl || (job as any).companyWebsite || ""
  if (!raw || !raw.trim()) return null
  if (raw.startsWith("http") || raw.startsWith("mailto:")) return raw
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
    return `mailto:${raw}?subject=Application for ${encodeURIComponent(job.title)} at ${encodeURIComponent(job.companyName)}`
  }
  return `https://${raw}`
}

function getMatchColor(score: number) {
  if (score >= 80) return "text-green-500 bg-green-500/10"
  if (score >= 60) return "text-yellow-500 bg-yellow-500/10"
  return "text-orange-500 bg-orange-500/10"
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Today"
  if (days === 1) return "1 day ago"
  if (days < 7) return `${days} days ago`
  return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`
}

// ── Fetch student profile from auth user ─────────────────────────────────────
async function fetchStudentProfile(): Promise<StudentProfile> {
  try {
    const res = await fetch("/api/auth/user", { credentials: "include", cache: "no-store" })
    if (res.ok) {
      const data = await res.json()
      const student = data.user
      if (student) {
        const platforms = student.linkedPlatforms ?? {}
        const platformCount = Object.keys(platforms).filter(k => platforms[k]).length
        let totalProblems = 0, rating = 0

        Object.entries(platforms).forEach(([pid, info]: [string, any]) => {
          if (!info || typeof info !== "object") return
          const s = info.stats ?? {}
          totalProblems += Number(s.totalSolved || s.problemsSolved || 0)
          const r = Math.max(s.rating || 0, s.currentRating || 0, s.highestRating || 0, s.contestRating || 0)
          if (r > rating) rating = r
        })

        return {
          skills: student.skills ?? [],
          totalProblems,
          rating,
          platformCount,
          isOpenToWork: student.isOpenToWork ?? true,
        }
      }
    }
  } catch { /* fall through */ }
  return { skills: [], totalProblems: 0, rating: 0, platformCount: 0, isOpenToWork: true }
}

export function JobMatches() {  return { skills: [], totalProblems: 0, rating: 0, platformCount: 0, isOpenToWork: true }
}

export function JobMatches() {
  const [jobs, setJobs] = useState<MatchedJob[]>([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [savedJobs, setSavedJobs] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [jobsMeta, setJobsMeta] = useState<{ totalJobs: number; eligibleJobs: number } | null>(null)

  useEffect(() => {
    const load = async () => {
      const studentProfile = await fetchStudentProfile()
      setProfile(studentProfile)

      const params = new URLSearchParams({
        skills: studentProfile.skills.join(","),
        problems: String(studentProfile.totalProblems),
        rating: String(studentProfile.rating),
        platforms: String(studentProfile.platformCount),
        openToWork: String(studentProfile.isOpenToWork),
      })

      try {
        const res = await fetch(`/api/student/jobs?${params}`)
        const data = await res.json()
        setJobs(data.jobs ?? [])
        setJobsMeta({ totalJobs: data.totalJobs ?? 0, eligibleJobs: data.eligibleJobs ?? 0 })
      } catch {
        setJobs([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const toggleSave = (id: string) => {
    setSavedJobs((prev) => prev.includes(id) ? prev.filter((j) => j !== id) : [...prev, id])
  }

  const filtered = jobs.filter((job) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch = !q || job.title.toLowerCase().includes(q) || job.companyName.toLowerCase().includes(q)
    const matchesLocation = locationFilter === "all" || job.location.toLowerCase().includes(locationFilter.toLowerCase())
    const matchesType = typeFilter === "all" || job.type.toLowerCase() === typeFilter.toLowerCase()
    return matchesSearch && matchesLocation && matchesType
  })

  const savedList = jobs.filter((j) => savedJobs.includes(j._id))

  // Unique locations for filter
  const locations = [...new Set(jobs.map((j) => j.location.split(",")[0].trim()))].slice(0, 6)

  const avgMatch = jobs.length > 0
    ? Math.round(jobs.slice(0, 5).reduce((s, j) => s + j.matchScore, 0) / Math.min(jobs.length, 5))
    : 0

  return (
    <Tabs defaultValue="matches" className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="matches" className="gap-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white">
            <Sparkles className="h-4 w-4" />
            Matched Jobs {jobs.length > 0 && <span className="ml-1 text-xs opacity-70">({jobs.length})</span>}
          </TabsTrigger>
          <TabsTrigger value="saved" className="gap-2 data-[state=active]:bg-gray-700 data-[state=active]:text-white">
            <Bookmark className="h-4 w-4" />
            Saved {savedList.length > 0 && <span className="ml-1 text-xs opacity-70">({savedList.length})</span>}
          </TabsTrigger>
        </TabsList>

        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search jobs..."
              className="bg-gray-800 border-gray-700 text-white pl-9 placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Matches tab ── */}
      <TabsContent value="matches" className="space-y-4">
        {/* Profile strength card */}
        {profile && (
          <Card className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 border-blue-700">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 border-2 border-blue-500">
                <Target className="h-6 w-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">Your Job Match Profile</p>
                <p className="text-sm text-blue-200">
                  {profile.platformCount} platform{profile.platformCount !== 1 ? "s" : ""} connected ·{" "}
                  {profile.totalProblems} problems solved ·{" "}
                  {profile.rating > 0 ? `Rating ${profile.rating}` : "No rating yet"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-400">{avgMatch}%</p>
                <p className="text-xs text-blue-300">Avg Match Score</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Eligibility info */}
        {!loading && jobsMeta && jobsMeta.totalJobs > 0 && (
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm border ${
            jobsMeta.eligibleJobs === jobsMeta.totalJobs
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
              : "bg-amber-500/10 border-amber-500/20 text-amber-600"
          }`}>
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>
              You are eligible for <strong>{jobsMeta.eligibleJobs}</strong> of <strong>{jobsMeta.totalJobs}</strong> active job{jobsMeta.totalJobs !== 1 ? "s" : ""}.
              {jobsMeta.eligibleJobs < jobsMeta.totalJobs && (
                <> Improve your problems solved and rating to unlock more.</>
              )}
            </span>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Briefcase className="h-12 w-12 text-gray-500 mb-3" />
              <p className="text-lg font-medium text-white">
                {jobs.length === 0 ? "No job postings yet" : "No jobs match your search"}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {jobs.length === 0
                  ? "Recruiters haven't posted any jobs yet. Check back soon."
                  : "Try adjusting your search or filters"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filtered.map((job) => (
              <Card key={job._id} className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                            <span className="flex items-center gap-1"><Building2 className="h-4 w-4" />{job.companyName}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>
                            {job.salary && <span className="flex items-center gap-1"><IndianRupee className="h-4 w-4" />{job.salary}</span>}
                          </div>
                        </div>
                        <Badge className={`gap-1 border-0 shadow-lg shrink-0 ml-2 ${getMatchColor(job.matchScore)}`}>
                          <Sparkles className="h-3 w-3" />
                          {job.matchScore}% Match
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-300 line-clamp-2">{job.description}</p>

                      {job.skills.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-400">Required Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill) => (
                              <Badge
                                key={skill}
                                className={
                                  job.matchedSkills.includes(skill)
                                    ? "bg-green-600 text-white border-green-500"
                                    : "bg-gray-700 text-gray-300 border-gray-600"
                                }
                              >
                                {job.matchedSkills.includes(skill) && <CheckCircle className="mr-1 h-3 w-3" />}
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{timeAgo(job.createdAt)}</span>
                        <span>{job.applications} applicants</span>
                        {job.deadline && <span>Deadline: {job.deadline}</span>}
                        <Badge variant="secondary" className="text-xs">{job.type}</Badge>
                      </div>
                    </div>

                    <div className="flex gap-2 lg:flex-col">
                      {(() => {
                        const href = getApplyHref(job)
                        if (!href) return (
                          <div className="flex flex-1 items-center justify-center gap-2 lg:w-32 rounded-md px-4 py-2 text-sm font-medium text-muted-foreground bg-secondary border border-border cursor-default">
                            Contact Recruiter
                          </div>
                        )
                        return (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                              // Record application in background
                              fetch("/api/student/jobs/apply", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ jobId: job._id }),
                              }).catch(() => {})
                            }}
                            className="flex flex-1 items-center justify-center gap-2 lg:w-32 rounded-md px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
                          >
                            Apply Now
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )
                      })()}
                      <Button
                        variant="outline"
                        className={`flex-1 gap-2 lg:w-32 border-gray-600 ${
                          savedJobs.includes(job._id)
                            ? "bg-blue-600/20 text-blue-400 border-blue-500"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                        onClick={() => toggleSave(job._id)}
                      >
                        <Bookmark className={`h-4 w-4 ${savedJobs.includes(job._id) ? "fill-current" : ""}`} />
                        {savedJobs.includes(job._id) ? "Saved" : "Save"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      {/* ── Saved tab ── */}
      <TabsContent value="saved" className="space-y-4">
        {savedList.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bookmark className="h-12 w-12 text-gray-400" />
              <p className="mt-4 text-lg font-medium text-white">No saved jobs yet</p>
              <p className="text-sm text-gray-400">Save jobs from the Matched Jobs tab</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {savedList.map((job) => (
              <Card key={job._id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{job.title}</h3>
                      <p className="text-sm text-gray-400">{job.companyName} · {job.location}</p>
                      <Badge className={`mt-2 gap-1 border-0 text-xs ${getMatchColor(job.matchScore)}`}>
                        <Sparkles className="h-3 w-3" />{job.matchScore}% Match
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {(() => {
                        const href = getApplyHref(job)
                        return href ? (
                          <a href={href} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all">
                            Apply
                          </a>
                        ) : (
                          <span className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground bg-secondary border border-border">
                            Contact Recruiter
                          </span>
                        )
                      })()}
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" onClick={() => toggleSave(job._id)}>
                        <Bookmark className="h-4 w-4 fill-current" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
