import { notFound } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Code2, GitBranch, Trophy, Star,
  Globe, Briefcase, MapPin, Calendar,
  ExternalLink, CheckCircle2
} from "lucide-react"
import { getDatabase, isDatabaseAvailable } from "@/lib/database"

interface Props { params: Promise<{ username: string }> }

const PLATFORM_COLORS: Record<string, string> = {
  leetcode: "#FFA116", github: "#238636", codeforces: "#1890FF",
  codechef: "#5B4638", hackerrank: "#00EA64", geeksforgeeks: "#2F8D46",
  atcoder: "#888888", hackerearth: "#2C3E50",
}

function computeScore(student: any): number {
  let totalProblems = 0, highestRating = 0, githubContributions = 0, contests = 0
  const platforms = Object.keys(student.linkedPlatforms || {})

  Object.entries(student.linkedPlatforms || {}).forEach(([pid, data]: [string, any]) => {
    if (!data?.stats) return
    const s = data.stats
    totalProblems += s.totalSolved || s.problemsSolved || 0
    if (pid === "github") githubContributions = s.totalContributions || 0
    const r = Math.max(s.rating || 0, s.currentRating || 0, s.highestRating || 0, s.contestRating || 0)
    if (r > highestRating) highestRating = r
    contests += s.contests?.length || s.contestsParticipated || s.attendedContestsCount || 0
  })

  const profilePts = [
    !!student.linkedinUrl,
    (student.skills?.length ?? 0) > 0,
    !!student.linkedPlatforms?.github,
    platforms.length > 0,
    student.isOpenToWork !== undefined,
  ].filter(Boolean).length * 20

  return Math.min(1000, Math.round(
    Math.min((totalProblems / 500) * 400, 400) +
    Math.min((highestRating / 1600) * 200, 200) +
    Math.min((githubContributions / 365) * 150, 150) +
    Math.min((contests / 20) * 150, 150) +
    profilePts / 10
  ))
}

async function getProfile(slug: string) {
  if (!isDatabaseAvailable()) return null
  try {
    const db = await getDatabase()
    const students = await db
      .collection("users")
      .find({ role: "student" }, { projection: { password: 0 } })
      .toArray()

    return students.find((s) => {
      const nameSlug = s.name?.toLowerCase().replace(/\s+/g, "-")
      const emailPrefix = s.email?.split("@")[0]?.toLowerCase()
      return nameSlug === slug || emailPrefix === slug
    }) ?? null
  } catch { return null }
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params
  const student = await getProfile(username.toLowerCase())
  if (!student) notFound()

  // Compute stats
  let totalProblems = 0, highestRating = 0, githubContributions = 0, contests = 0
  const platformEntries: [string, any][] = []

  Object.entries(student.linkedPlatforms || {}).forEach(([pid, data]: [string, any]) => {
    if (!data) return
    const s = data.stats
    const uname = data.username || ""
    const problems = s?.totalSolved || s?.problemsSolved || 0
    const rating = Math.max(s?.rating || 0, s?.currentRating || 0, s?.highestRating || 0, s?.contestRating || 0)
    const contribs = pid === "github" ? (s?.totalContributions || 0) : 0

    totalProblems += problems
    if (pid === "github") githubContributions = contribs
    if (rating > highestRating) highestRating = rating
    contests += s?.contests?.length || s?.contestsParticipated || s?.attendedContestsCount || 0

    platformEntries.push([pid, { username: uname, problems, rating, contributions: contribs }])
  })

  const codetrackScore = computeScore(student)
  const scoreColor = codetrackScore >= 700 ? "text-emerald-500" : codetrackScore >= 400 ? "text-amber-500" : "text-red-500"

  const currentYear = new Date().getFullYear()
  const isGraduate = student.graduationYear && student.graduationYear <= currentYear

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Code2 className="h-4 w-4" />
            </div>
            <span className="font-bold text-foreground text-sm">CodeTrack</span>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="gap-2">
              <Briefcase className="h-3.5 w-3.5" />Join CodeTrack
            </Button>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">

        {/* Hero */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-background p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-3xl font-black text-primary">
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-foreground">{student.name}</h1>
                {isGraduate ? (
                  <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 gap-1">
                    🎓 Graduate
                  </Badge>
                ) : student.isOpenToWork ? (
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20 gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                    Open to Work
                  </Badge>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                {student.branch && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{student.branch}</span>}
                {student.collegeCode && <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" />{student.collegeCode}</span>}
                {student.graduationYear && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {isGraduate ? `Graduated ${student.graduationYear}` : `Class of ${student.graduationYear}`}
                  </span>
                )}
              </div>
              {(student.skills || []).length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {student.skills.map((s: string) => (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                </div>
              )}
              {student.linkedinUrl && (
                <a href={student.linkedinUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mt-3">
                  <ExternalLink className="h-3.5 w-3.5" />LinkedIn Profile
                </a>
              )}
            </div>
            {/* Score */}
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-4 shrink-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">CTS</p>
              <p className={`text-4xl font-black tabular-nums ${scoreColor}`}>{codetrackScore}</p>
              <p className="text-xs text-muted-foreground">/1000</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Problems Solved", value: totalProblems, icon: Code2, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Highest Rating", value: highestRating || "—", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
            { label: "GitHub Contributions", value: githubContributions, icon: GitBranch, color: "text-green-500", bg: "bg-green-500/10" },
            { label: "Contests", value: contests, icon: Trophy, color: "text-purple-500", bg: "bg-purple-500/10" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-card p-4">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.bg} mb-3`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{item.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Platforms */}
        {platformEntries.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-semibold text-foreground mb-4">Connected Platforms</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {platformEntries.map(([pid, pdata]) => {
                const color = PLATFORM_COLORS[pid] || "#64748b"
                const name = pid.charAt(0).toUpperCase() + pid.slice(1)
                return (
                  <div key={pid} className="flex items-center gap-3 rounded-lg border border-border p-3"
                    style={{ borderLeftColor: color, borderLeftWidth: 3 }}>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">{name}</p>
                      <p className="text-xs text-muted-foreground">@{pdata.username}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {pdata.problems > 0 && <p className="text-sm font-bold text-foreground">{pdata.problems}</p>}
                      {pdata.rating > 0 && <p className="text-xs text-muted-foreground">{pdata.rating} rating</p>}
                      {pdata.contributions > 0 && <p className="text-xs text-muted-foreground">{pdata.contributions} contrib</p>}
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 text-center">
          <p className="font-semibold text-foreground mb-1">Want your own CodeTrack profile?</p>
          <p className="text-sm text-muted-foreground mb-4">
            Track your coding progress, get AI insights, and connect with recruiters.
          </p>
          <Link href="/signup?role=student">
            <Button className="gap-2">
              <Code2 className="h-4 w-4" />Create Free Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
