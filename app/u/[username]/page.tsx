import { notFound } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Code2, GitBranch, Trophy, Star, Globe, Briefcase,
  MapPin, Calendar, ExternalLink, ArrowLeft, CheckCircle2
} from "lucide-react"

interface Props { params: { username: string } }

async function getProfile(username: string) {
  try {
    const base = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const res = await fetch(`${base}/api/public/profile/${username}`, { cache: "no-store" })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

const PLATFORM_COLORS: Record<string, string> = {
  leetcode: "#FFA116", github: "#238636", codeforces: "#1890FF",
  codechef: "#5B4638", hackerrank: "#00EA64", geeksforgeeks: "#2F8D46",
  atcoder: "#888888", hackerearth: "#2C3E50",
}

export default async function PublicProfilePage({ params }: Props) {
  const data = await getProfile(params.username)
  if (!data) notFound()

  const { profile, stats, platforms, codetrackScore } = data

  const scoreColor = codetrackScore >= 700 ? "text-emerald-500" : codetrackScore >= 400 ? "text-amber-500" : "text-red-500"
  const platformEntries = Object.entries(platforms || {})

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
              <Briefcase className="h-3.5 w-3.5" />
              Join CodeTrack
            </Button>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">

        {/* Hero */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-background p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            {/* Avatar */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-3xl font-black text-primary">
              {profile.name.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
                {profile.isOpenToWork && (
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20 gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                    Open to Work
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                {profile.branch && (
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{profile.branch}</span>
                )}
                {profile.collegeCode && (
                  <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" />{profile.collegeCode}</span>
                )}
                {profile.graduationYear && (
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Class of {profile.graduationYear}</span>
                )}
              </div>
              {profile.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((s: string) => (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                </div>
              )}
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mt-3">
                  <ExternalLink className="h-3.5 w-3.5" />LinkedIn Profile
                </a>
              )}
            </div>

            {/* CodeTrack Score */}
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
            { label: "Problems Solved", value: stats.totalProblems, icon: Code2, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Highest Rating", value: stats.highestRating || "—", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
            { label: "GitHub Contributions", value: stats.githubContributions, icon: GitBranch, color: "text-green-500", bg: "bg-green-500/10" },
            { label: "Contests", value: stats.contests, icon: Trophy, color: "text-purple-500", bg: "bg-purple-500/10" },
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
              {platformEntries.map(([pid, pdata]: [string, any]) => {
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
              <Code2 className="h-4 w-4" />
              Create Free Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
