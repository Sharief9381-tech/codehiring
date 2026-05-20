"use client"

import { useEffect, useState } from "react"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Loader2, ExternalLink, Bookmark, BookmarkCheck,
  Code, Trophy, GitBranch, Star, GraduationCap,
  Briefcase, Calendar, Globe,
} from "lucide-react"
import { toast } from "sonner"

interface CandidateOverviewSheetProps {
  candidateId: string | null
  onClose: () => void
  shortlists: { _id: string; name: string }[]
}

interface PlatformEntry {
  id: string
  username: string
  isActive: boolean
  lastSync?: string
  stats?: Record<string, any>
}

interface StudentDetail {
  _id: string
  name: string
  email: string
  branch: string
  graduationYear: number
  collegeCode: string
  rollNumber: string
  skills: string[]
  isOpenToWork: boolean
  linkedinUrl?: string
  stats?: {
    totalProblems: number
    easyProblems: number
    mediumProblems: number
    hardProblems: number
    githubContributions: number
    contestsParticipated: number
    rating: number
  }
  linkedPlatforms?: Record<string, PlatformEntry>
  createdAt: string
}

const PLATFORM_LABELS: Record<string, string> = {
  leetcode: "LeetCode",
  codeforces: "Codeforces",
  codechef: "CodeChef",
  github: "GitHub",
  hackerrank: "HackerRank",
  hackerearth: "HackerEarth",
  geeksforgeeks: "GeeksforGeeks",
  atcoder: "AtCoder",
  spoj: "SPOJ",
  kattis: "Kattis",
  topcoder: "TopCoder",
  interviewbit: "InterviewBit",
  cses: "CSES",
  codestudio: "CodeStudio",
  exercism: "Exercism",
  kaggle: "Kaggle",
  uva: "UVa",
}

function getPlatformStats(id: string, stats: Record<string, any>) {
  const rows: { label: string; value: string | number }[] = []

  switch (id) {
    case "leetcode":
      if (stats.totalSolved != null) rows.push({ label: "Problems Solved", value: stats.totalSolved })
      if (stats.easySolved != null) rows.push({ label: "Easy", value: stats.easySolved })
      if (stats.mediumSolved != null) rows.push({ label: "Medium", value: stats.mediumSolved })
      if (stats.hardSolved != null) rows.push({ label: "Hard", value: stats.hardSolved })
      if (stats.ranking) rows.push({ label: "Global Rank", value: `#${stats.ranking}` })
      break
    case "codeforces":
      if (stats.rating) rows.push({ label: "Rating", value: stats.rating })
      if (stats.maxRating) rows.push({ label: "Max Rating", value: stats.maxRating })
      if (stats.rank) rows.push({ label: "Rank", value: stats.rank })
      if (stats.problemsSolved) rows.push({ label: "Problems Solved", value: stats.problemsSolved })
      if (stats.contests?.length) rows.push({ label: "Contests", value: stats.contests.length })
      break
    case "codechef":
      if (stats.currentRating) rows.push({ label: "Rating", value: stats.currentRating })
      if (stats.highestRating) rows.push({ label: "Highest Rating", value: stats.highestRating })
      if (stats.stars) rows.push({ label: "Stars", value: stats.stars })
      if (stats.problemsSolved) rows.push({ label: "Problems Solved", value: stats.problemsSolved })
      if (stats.globalRank) rows.push({ label: "Global Rank", value: `#${stats.globalRank}` })
      break
    case "github":
      if (stats.totalContributions ?? stats.contributions)
        rows.push({ label: "Contributions", value: stats.totalContributions ?? stats.contributions })
      if (stats.publicRepos) rows.push({ label: "Repositories", value: stats.publicRepos })
      if (stats.followers) rows.push({ label: "Followers", value: stats.followers })
      break
    case "hackerrank":
      if (stats.badges?.length) rows.push({ label: "Badges", value: stats.badges.length })
      if (stats.certifications?.length) rows.push({ label: "Certifications", value: stats.certifications.length })
      if (stats.totalScore) rows.push({ label: "Total Score", value: stats.totalScore })
      break
    case "hackerearth":
      if (stats.rating) rows.push({ label: "Rating", value: stats.rating })
      if (stats.problemsSolved) rows.push({ label: "Problems Solved", value: stats.problemsSolved })
      break
    case "geeksforgeeks":
      if (stats.problemsSolved ?? stats.stats?.problemsSolved)
        rows.push({ label: "Problems Solved", value: stats.problemsSolved ?? stats.stats?.problemsSolved })
      if (stats.codingScore ?? stats.score)
        rows.push({ label: "Coding Score", value: stats.codingScore ?? stats.score })
      if (stats.instituteRank) rows.push({ label: "Institute Rank", value: `#${stats.instituteRank}` })
      break
    case "atcoder":
      if (stats.rating) rows.push({ label: "Rating", value: stats.rating })
      if (stats.highestRating) rows.push({ label: "Highest Rating", value: stats.highestRating })
      if (stats.problemsSolved) rows.push({ label: "Problems Solved", value: stats.problemsSolved })
      break
    default:
      if (stats.totalSolved ?? stats.problemsSolved ?? stats.solved)
        rows.push({ label: "Problems Solved", value: stats.totalSolved ?? stats.problemsSolved ?? stats.solved })
      if (stats.rating ?? stats.currentRating)
        rows.push({ label: "Rating", value: stats.rating ?? stats.currentRating })
      break
  }

  return rows
}

export function CandidateOverviewSheet({
  candidateId,
  onClose,
  shortlists,
}: CandidateOverviewSheetProps) {
  const [student, setStudent] = useState<StudentDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [addingTo, setAddingTo] = useState<string | null>(null)

  useEffect(() => {
    if (!candidateId) {
      setStudent(null)
      return
    }
    setLoading(true)
    fetch(`/api/recruiter/students/${candidateId}`)
      .then((r) => r.json())
      .then((d) => setStudent(d.student ?? null))
      .catch(() => toast.error("Failed to load candidate profile"))
      .finally(() => setLoading(false))
  }, [candidateId])

  const addToShortlist = async (shortlistId: string) => {
    if (!student) return
    setAddingTo(shortlistId)
    try {
      const res = await fetch(`/api/recruiter/shortlists/${shortlistId}/candidates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student._id,
          name: student.name,
          college: student.collegeCode,
          branch: student.branch,
          year: student.graduationYear,
          matchScore: 0,
        }),
      })
      const data = await res.json()
      if (!res.ok) toast.error(data.error ?? "Failed to add")
      else toast.success(`${student.name} added to shortlist`)
    } catch {
      toast.error("Failed to add to shortlist")
    } finally {
      setAddingTo(null)
    }
  }

  const activePlatforms = student
    ? Object.entries(student.linkedPlatforms ?? {}).filter(
        ([, p]) => p?.isActive && p?.stats
      )
    : []

  return (
    <Sheet open={!!candidateId} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !student ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Failed to load profile</p>
          </div>
        ) : (
          <div className="space-y-6 pb-8">
            <SheetHeader>
              {/* Header */}
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-xl text-primary">
                    {student.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <SheetTitle className="text-xl">{student.name}</SheetTitle>
                  <p className="text-sm text-muted-foreground">{student.email}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {student.isOpenToWork && (
                      <Badge variant="secondary">Open to Work</Badge>
                    )}
                    {student.branch && (
                      <Badge variant="outline">{student.branch}</Badge>
                    )}
                    {student.graduationYear && (
                      <Badge variant="outline">Class of {student.graduationYear}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </SheetHeader>

            {/* Education */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {student.collegeCode && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  {student.collegeCode}
                </span>
              )}
              {student.rollNumber && (
                <span className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {student.rollNumber}
                </span>
              )}
              {student.linkedinUrl && (
                <a
                  href={student.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  LinkedIn
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            {/* Skills */}
            {student.skills?.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {student.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Aggregated Stats */}
            {student.stats && (
              <div className="space-y-3">
                <p className="text-sm font-medium">Overall Stats</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Card className="bg-secondary/50">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold">{student.stats.totalProblems}</p>
                      <p className="text-xs text-muted-foreground mt-1">Problems Solved</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-secondary/50">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold">{student.stats.rating}</p>
                      <p className="text-xs text-muted-foreground mt-1">Best Rating</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-secondary/50">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold">{student.stats.contestsParticipated}</p>
                      <p className="text-xs text-muted-foreground mt-1">Contests</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-secondary/50">
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold">{student.stats.githubContributions}</p>
                      <p className="text-xs text-muted-foreground mt-1">Contributions</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Difficulty breakdown */}
                {(student.stats.easyProblems > 0 || student.stats.mediumProblems > 0 || student.stats.hardProblems > 0) && (
                  <div className="flex gap-3 text-sm">
                    <span className="text-muted-foreground">
                      Easy: <strong className="text-foreground">{student.stats.easyProblems}</strong>
                    </span>
                    <span className="text-muted-foreground">
                      Medium: <strong className="text-foreground">{student.stats.mediumProblems}</strong>
                    </span>
                    <span className="text-muted-foreground">
                      Hard: <strong className="text-foreground">{student.stats.hardProblems}</strong>
                    </span>
                  </div>
                )}
              </div>
            )}

            <Separator />

            {/* Per-platform breakdown */}
            {activePlatforms.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium">Platform Breakdown</p>
                <div className="space-y-3">
                  {activePlatforms.map(([platformId, p]) => {
                    const rows = getPlatformStats(platformId, p.stats ?? {})
                    if (rows.length === 0) return null
                    return (
                      <Card key={platformId} className="bg-secondary/30">
                        <CardHeader className="pb-2 pt-4 px-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">
                              {PLATFORM_LABELS[platformId] ?? platformId}
                            </CardTitle>
                            <span className="text-xs text-muted-foreground">@{p.username}</span>
                          </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                          <div className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
                            {rows.map((row) => (
                              <div key={row.label} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{row.label}</span>
                                <span className="font-medium text-foreground">{row.value}</span>
                              </div>
                            ))}
                          </div>
                          {p.lastSync && (
                            <p className="mt-2 text-xs text-muted-foreground">
                              Last synced: {new Date(p.lastSync).toLocaleDateString()}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Add to shortlist */}
            {shortlists.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Add to Shortlist</p>
                  <div className="flex flex-wrap gap-2">
                    {shortlists.map((list) => (
                      <Button
                        key={list._id}
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-transparent"
                        disabled={addingTo === list._id}
                        onClick={() => addToShortlist(list._id)}
                      >
                        {addingTo === list._id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <BookmarkCheck className="h-3 w-3" />
                        )}
                        {list.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
