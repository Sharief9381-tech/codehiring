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
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <Card
                key={candidate._id}
                className="bg-card cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setOverviewCandidateId(candidate._id)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-primary/10 text-lg text-primary">
                        {candidate.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground">{candidate.name}</h3>
                        {/* Show live match score if available, else generic score */}
                        {liveMatches[candidate._id] ? (
                          <Badge className="gap-1 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                            <Zap className="h-3 w-3" />
                            {liveMatches[candidate._id].matchScore}% live match
                          </Badge>
                        ) : (
                          <Badge className="gap-1 bg-primary/20 text-primary">
                            <Star className="h-3 w-3" />
                            {candidate.matchScore}% match
                          </Badge>
                        )}
                        {candidate.isOpenToWork && (
                          <Badge className="bg-green-500/20 text-green-500">Open to Work</Badge>
                        )}
                        {candidate.lastSync && (
                          <span className="text-xs text-muted-foreground">
                            synced {new Date(candidate.lastSync).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {candidate.college}
                        {candidate.branch ? ` • ${candidate.branch}` : ""}
                        {candidate.year ? ` • ${candidate.year}` : ""}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map((skill) => {
                          const live = liveMatches[candidate._id]
                          const isMatched = live?.matchedSkills.includes(skill)
                          const isMissing = live?.missingSkills.includes(skill)
                          return (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className={`text-xs ${isMatched ? "bg-green-500/20 text-green-600 dark:text-green-400" : isMissing ? "bg-red-500/10 text-red-500" : ""}`}
                            >
                              {skill}
                            </Badge>
                          )
                        })}
                      </div>

                        <div className="flex flex-wrap items-center gap-6 text-sm">
                        <div>
                          <span className="font-medium text-foreground">{candidate.problems}</span>{" "}
                          <span className="text-muted-foreground">problems</span>
                        </div>
                        {candidate.stats.githubContributions > 0 && (
                          <div>
                            <span className="font-medium text-foreground">{candidate.stats.githubContributions}</span>{" "}
                            <span className="text-muted-foreground">contributions</span>
                          </div>
                        )}
                        </div>

                      {/* Live match breakdown */}
                      {liveMatches[candidate._id] && (
                        <div className="flex flex-wrap gap-3 rounded-md bg-secondary/50 px-3 py-2 text-xs">
                          <span>Skills: <strong>{liveMatches[candidate._id].breakdown.skills}/50</strong></span>
                          <span>Problems: <strong>{liveMatches[candidate._id].breakdown.problems}/20</strong></span>
                          <span>Rating: <strong>{liveMatches[candidate._id].breakdown.rating}/20</strong></span>
                          <span>Profile: <strong>{liveMatches[candidate._id].breakdown.profile}/10</strong></span>
                          {liveMatches[candidate._id].synced && (
                            <span className="text-green-500 flex items-center gap-1">
                              <RefreshCw className="h-3 w-3" /> synced live
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {selectedJobId && (
                        <Button
                          variant="outline"
                          size="icon"
                          title="Compute live match score"
                          disabled={loadingMatch === candidate._id}
                          onClick={(e) => { e.stopPropagation(); fetchLiveMatch(candidate._id, selectedJobId) }}
                          className="bg-transparent border-yellow-500/30 text-yellow-600 hover:bg-yellow-500/10"
                        >
                          {loadingMatch === candidate._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Zap className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        title="Add to shortlist"
                        onClick={(e) => { e.stopPropagation(); openShortlistDialog(candidate) }}
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
