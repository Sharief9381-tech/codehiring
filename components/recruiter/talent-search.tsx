"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Search, Star, Bookmark, Filter, X, Loader2, BookmarkCheck, Zap, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { CandidateOverviewSheet } from "@/components/recruiter/candidate-overview-sheet"

interface Candidate {
  _id: string
  name: string
  college: string
  branch: string
  year: number | null
  matchScore: number
  problems: number
  rating: number
  skills: string[]
  platforms: string[]
  isOpenToWork: boolean
  lastSync: string | null
  stats: {
    totalProblems: number
    easyProblems: number
    mediumProblems: number
    hardProblems: number
    githubContributions: number
    contestsParticipated: number
    rating: number
  }
}

interface LiveMatch {
  matchScore: number
  matchedSkills: string[]
  missingSkills: string[]
  breakdown: { skills: number; problems: number; rating: number; profile: number }
  synced: boolean
  computedAt: string
}

interface Shortlist {
  _id: string
  name: string
}



const COMMON_SKILLS = [
  "JavaScript", "Python", "Java", "C++", "React", "Node.js",
  "TypeScript", "Go", "AWS", "Docker", "System Design", "Machine Learning",
]

export function TalentSearch() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [shortlists, setShortlists] = useState<Shortlist[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [minProblems, setMinProblems] = useState([0])
  const [minRating, setMinRating] = useState([0])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [openToWork, setOpenToWork] = useState(false)
  const [sort, setSort] = useState("match")
  const [showFilters, setShowFilters] = useState(true)
  const [total, setTotal] = useState(0)

  // Shortlist dialog
  const [shortlistDialogOpen, setShortlistDialogOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [addingTo, setAddingTo] = useState<string | null>(null)

  // Live match
  const [liveMatches, setLiveMatches] = useState<Record<string, LiveMatch>>({})
  const [loadingMatch, setLoadingMatch] = useState<string | null>(null)
  const [selectedJobId, setSelectedJobId] = useState<string>("")
  const [jobs, setJobs] = useState<{ _id: string; title: string }[]>([])

  // Candidate overview sheet
  const [overviewCandidateId, setOverviewCandidateId] = useState<string | null>(null)

  const fetchCandidates = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set("q", searchQuery)
      if (minProblems[0] > 0) params.set("minProblems", String(minProblems[0]))
      if (minRating[0] > 0) params.set("minRating", String(minRating[0]))
      if (selectedSkills.length > 0) params.set("skills", selectedSkills.join(","))
      if (openToWork) params.set("openToWork", "true")
      params.set("sort", sort)

      const res = await fetch(`/api/recruiter/search?${params}`)
      const data = await res.json()
      setCandidates(data.candidates ?? [])
      setTotal(data.total ?? 0)
    } catch {
      toast.error("Failed to search candidates")
    } finally {
      setLoading(false)
    }
  }, [searchQuery, minProblems, minRating, selectedSkills, openToWork, sort])

  const fetchShortlists = async () => {
    try {
      const res = await fetch("/api/recruiter/shortlists")
      const data = await res.json()
      setShortlists(data.shortlists ?? [])
    } catch {}
  }

  useEffect(() => {
    fetchCandidates()
  }, [fetchCandidates])

  useEffect(() => {
    fetchShortlists()
    // Fetch recruiter's jobs for live match scoring
    fetch("/api/recruiter/jobs")
      .then((r) => r.json())
      .then((d) => setJobs((d.jobs ?? []).filter((j: any) => j.status === "active")))
      .catch(() => {})
  }, [])

  const fetchLiveMatch = async (candidateId: string, jobId: string) => {
    if (!jobId) {
      toast.error("Select a job first to compute live match")
      return
    }
    setLoadingMatch(candidateId)
    try {
      const res = await fetch(`/api/recruiter/match?studentId=${candidateId}&jobId=${jobId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setLiveMatches((prev) => ({ ...prev, [candidateId]: data }))
      if (data.synced) toast.success("Stats synced from platforms in real-time")
    } catch (e: any) {
      toast.error(e.message ?? "Failed to compute live match")
    } finally {
      setLoadingMatch(null)
    }
  }

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const openShortlistDialog = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setShortlistDialogOpen(true)
  }

  const addToShortlist = async (shortlistId: string) => {
    if (!selectedCandidate) return
    setAddingTo(shortlistId)
    try {
      const res = await fetch(`/api/recruiter/shortlists/${shortlistId}/candidates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedCandidate._id,
          name: selectedCandidate.name,
          college: selectedCandidate.college,
          branch: selectedCandidate.branch,
          year: selectedCandidate.year,
          matchScore: selectedCandidate.matchScore,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? "Failed to add candidate")
      } else {
        toast.success(`${selectedCandidate.name} added to shortlist`)
        setShortlistDialogOpen(false)
      }
    } catch {
      toast.error("Failed to add candidate")
    } finally {
      setAddingTo(null)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {/* Filters Sidebar */}
      <div className={`lg:col-span-1 ${showFilters ? "" : "hidden lg:block"}`}>
        <Card className="sticky top-6 bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Filters</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedSkills([])
                setMinProblems([0])
                setMinRating([0])
                setOpenToWork(false)
              }}
            >
              Clear All
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Min Problems Solved: {minProblems[0]}</Label>
              <Slider value={minProblems} onValueChange={setMinProblems} max={500} min={0} step={10} />
            </div>

            <div className="space-y-3">
              <Label>Min Rating: {minRating[0]}</Label>
              <Slider value={minRating} onValueChange={setMinRating} max={2500} min={0} step={50} />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="openToWork"
                checked={openToWork}
                onCheckedChange={(v) => setOpenToWork(!!v)}
              />
              <label htmlFor="openToWork" className="text-sm cursor-pointer">Open to Work only</label>
            </div>

            <div className="space-y-3">
              <Label>Skills</Label>
              <div className="flex flex-wrap gap-2">
                {COMMON_SKILLS.map((skill) => (
                  <Badge
                    key={skill}
                    variant={selectedSkills.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                    {selectedSkills.includes(skill) && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <div className="lg:col-span-3 space-y-4">
        <Card className="bg-card">
          <CardContent className="p-4 space-y-3">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, skills, or college..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                className="lg:hidden bg-transparent"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            {/* Job selector for live match scoring */}
            {jobs.length > 0 && (
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-yellow-500 shrink-0" />
                <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                  <SelectTrigger className="flex-1 bg-secondary text-sm">
                    <SelectValue placeholder="Select a job to compute live match scores" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map((j) => (
                      <SelectItem key={j._id} value={j._id}>{j.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedJobId && (
                  <span className="text-xs text-muted-foreground shrink-0">
                    Click ⚡ on a candidate for live score
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading ? "Searching..." : `${total} candidate${total !== 1 ? "s" : ""} found`}
          </p>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">Best Match</SelectItem>
              <SelectItem value="problems">Most Problems</SelectItem>
              <SelectItem value="rating">Highest Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : candidates.length === 0 ? (
          <Card className="bg-card">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-lg font-medium">No candidates found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {candidates.map((candidate) => (
              <div
                key={candidate._id}
                className="group rounded-2xl border border-border/60 bg-card hover:border-primary/30 hover:bg-primary/5 transition-all p-5 cursor-pointer"
                onClick={() => setOverviewCandidateId(candidate._id)}
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-11 w-11 shrink-0">
                    <AvatarFallback className="bg-primary/15 text-primary font-bold text-sm">
                      {candidate.name.split(" ").map((n) => n[0]).join("").slice(0,2)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Name + badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-foreground">{candidate.name}</h3>
                      {liveMatches[candidate._id] ? (
                        <Badge className="gap-0.5 text-[10px] px-2 py-0 bg-amber-500/15 text-amber-400 border-amber-500/20">
                          <Zap className="h-2.5 w-2.5" />{liveMatches[candidate._id].matchScore}% live
                        </Badge>
                      ) : (
                        <Badge className="gap-0.5 text-[10px] px-2 py-0 bg-primary/15 text-primary border-primary/20">
                          <Star className="h-2.5 w-2.5" />{candidate.matchScore}%
                        </Badge>
                      )}
                      {candidate.isOpenToWork && (
                        <Badge className="text-[10px] px-2 py-0 bg-emerald-500/15 text-emerald-400 border-emerald-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1 inline-block animate-pulse" />Open
                        </Badge>
                      )}
                    </div>

                    {/* College */}
                    <p className="text-xs text-muted-foreground">
                      {candidate.college}{candidate.branch ? ` · ${candidate.branch}` : ""}{candidate.year ? ` · ${candidate.year}` : ""}
                    </p>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-foreground font-semibold tabular-nums">{candidate.problems} <span className="text-muted-foreground font-normal">solved</span></span>
                      {candidate.stats?.githubContributions > 0 && (
                        <span className="text-foreground font-semibold tabular-nums">{candidate.stats.githubContributions} <span className="text-muted-foreground font-normal">contrib</span></span>
                      )}
                      {candidate.rating > 0 && (
                        <span className="text-foreground font-semibold tabular-nums">{candidate.rating} <span className="text-muted-foreground font-normal">rating</span></span>
                      )}
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.skills.slice(0, 5).map((skill) => {
                        const live = liveMatches[candidate._id]
                        return (
                          <Badge key={skill} variant="secondary"
                            className={`text-[10px] px-2 py-0 ${
                              live?.matchedSkills.includes(skill) ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" :
                              live?.missingSkills.includes(skill) ? "bg-red-500/10 text-red-400 border-red-500/20" : ""
                            }`}>
                            {skill}
                          </Badge>
                        )
                      })}
                      {candidate.skills.length > 5 && <Badge variant="secondary" className="text-[10px] px-2 py-0">+{candidate.skills.length - 5}</Badge>}
                    </div>

                    {/* Live match breakdown */}
                    {liveMatches[candidate._id] && (
                      <div className="flex flex-wrap gap-3 rounded-xl bg-amber-500/8 border border-amber-500/15 px-3 py-2 text-[10px]">
                        <span className="text-muted-foreground">Skills <strong className="text-foreground">{liveMatches[candidate._id].breakdown.skills}/50</strong></span>
                        <span className="text-muted-foreground">Problems <strong className="text-foreground">{liveMatches[candidate._id].breakdown.problems}/20</strong></span>
                        <span className="text-muted-foreground">Rating <strong className="text-foreground">{liveMatches[candidate._id].breakdown.rating}/20</strong></span>
                        {liveMatches[candidate._id].synced && <span className="text-emerald-400 flex items-center gap-0.5"><RefreshCw className="h-2.5 w-2.5" />synced live</span>}
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-1.5 shrink-0">
                    {selectedJobId && (
                      <button
                        title="Compute live match"
                        disabled={loadingMatch === candidate._id}
                        onClick={(e) => { e.stopPropagation(); fetchLiveMatch(candidate._id, selectedJobId) }}
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all"
                      >
                        {loadingMatch === candidate._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
                      </button>
                    )}
                    <button
                      title="Add to shortlist"
                      onClick={(e) => { e.stopPropagation(); openShortlistDialog(candidate) }}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-border/60 hover:border-primary/40 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                    >
                      <Bookmark className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add to Shortlist Dialog */}
      <Dialog open={shortlistDialogOpen} onOpenChange={setShortlistDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Shortlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {shortlists.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No shortlists yet. Create one from the Shortlists page.
              </p>
            ) : (
              shortlists.map((list) => (
                <Button
                  key={list._id}
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  disabled={addingTo === list._id}
                  onClick={() => addToShortlist(list._id)}
                >
                  {addingTo === list._id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <BookmarkCheck className="mr-2 h-4 w-4" />
                  )}
                  {list.name}
                </Button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Candidate Overview Sheet */}
      <CandidateOverviewSheet
        candidateId={overviewCandidateId}
        onClose={() => setOverviewCandidateId(null)}
        shortlists={shortlists}
      />
    </div>
  )
}
