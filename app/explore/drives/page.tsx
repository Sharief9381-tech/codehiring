"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search, Briefcase, MapPin, Users, Calendar, ArrowLeft,
  Loader2, ArrowRight, IndianRupee, Code2, Star
} from "lucide-react"

interface Drive {
  _id: string
  source: "drive" | "job"
  title: string
  companyName: string
  role: string
  type: string
  location: string
  salary: string | null
  skills: string[]
  deadline: string | null
  status: string
  minProblems: number
  minRating: number
  applicantCount: number
  description: string
}

const TYPE_COLOR: Record<string, string> = {
  "Internship":  "bg-blue-500/10 text-blue-600",
  "Full-time":   "bg-green-500/10 text-green-600",
  "Contract":    "bg-purple-500/10 text-purple-600",
  "Part-time":   "bg-amber-500/10 text-amber-600",
}

export default function ExploreDrivesPage() {
  const [drives, setDrives] = useState<Drive[]>([])
  const [filtered, setFiltered] = useState<Drive[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Drive | null>(null)

  useEffect(() => {
    fetch("/api/public/drives")
      .then((r) => r.json())
      .then((d) => { setDrives(d.drives ?? []); setFiltered(d.drives ?? []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const q = query.toLowerCase()
    setFiltered(
      q
        ? drives.filter(
            (d) =>
              d.title.toLowerCase().includes(q) ||
              d.companyName.toLowerCase().includes(q) ||
              d.location.toLowerCase().includes(q) ||
              d.skills.some((s) => s.toLowerCase().includes(q))
          )
        : drives
    )
  }, [query, drives])

  const formatDeadline = (d: string | null) => {
    if (!d) return null
    try { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) }
    catch { return d }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center gap-4">
          <Link href="/#stats">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Hiring Drives</h1>
            <p className="text-xs text-muted-foreground">{filtered.length} open positions</p>
          </div>
          <div className="relative ml-auto w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search company, role, skill..."
              className="pl-9 bg-secondary"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 space-y-3">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">No open drives right now</p>
            <Link href="/signup?role=student">
              <Button variant="outline" className="gap-2 bg-transparent">
                Sign up to get notified <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d) => (
              <button
                key={d._id}
                onClick={() => setSelected(d)}
                className="text-left rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{d.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{d.companyName}</p>
                    </div>
                  </div>
                  <Badge className={`shrink-0 text-xs ${TYPE_COLOR[d.type] ?? "bg-secondary text-muted-foreground"}`}>
                    {d.type}
                  </Badge>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground mb-3">
                  {d.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />{d.location}
                    </div>
                  )}
                  {d.salary && (
                    <div className="flex items-center gap-1">
                      <IndianRupee className="h-3 w-3" />{d.salary}
                    </div>
                  )}
                  {d.deadline && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />Deadline: {formatDeadline(d.deadline)}
                    </div>
                  )}
                </div>

                {d.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {d.skills.slice(0, 3).map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                    {d.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">+{d.skills.length - 3}</Badge>
                    )}
                  </div>
                )}

                {d.applicantCount > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                    <Users className="h-3 w-3" />{d.applicantCount} applied
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Briefcase className="h-7 w-7 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <DialogTitle className="text-xl leading-tight">{selected.title}</DialogTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">{selected.companyName}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge className={TYPE_COLOR[selected.type] ?? "bg-secondary text-muted-foreground"}>
                        {selected.type}
                      </Badge>
                      <Badge className="bg-green-500/10 text-green-600">Open</Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-3 mt-2">
                {/* Details */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {selected.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0" />{selected.location}
                    </div>
                  )}
                  {selected.salary && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <IndianRupee className="h-4 w-4 shrink-0" />{selected.salary}
                    </div>
                  )}
                  {selected.deadline && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4 shrink-0" />{formatDeadline(selected.deadline)}
                    </div>
                  )}
                  {selected.applicantCount > 0 && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4 shrink-0" />{selected.applicantCount} applied
                    </div>
                  )}
                </div>

                {/* Description */}
                {selected.description && (
                  <div className="rounded-lg bg-secondary p-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">About the role</p>
                    <p className="text-sm text-foreground line-clamp-4">{selected.description}</p>
                  </div>
                )}

                {/* Min requirements */}
                {(selected.minProblems > 0 || selected.minRating > 0) && (
                  <div className="rounded-lg bg-secondary p-3 space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Minimum Requirements</p>
                    {selected.minProblems > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Code2 className="h-4 w-4 text-primary" />
                        <span>{selected.minProblems}+ problems solved</span>
                      </div>
                    )}
                    {selected.minRating > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 text-amber-500" />
                        <span>{selected.minRating}+ rating</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Skills */}
                {selected.skills.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.skills.map((s) => (
                        <Badge key={s} variant="secondary">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Apply CTA */}
                <Link href="/signup?role=student" onClick={() => setSelected(null)}>
                  <Button className="w-full gap-2 mt-1">
                    Sign up to Apply
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
