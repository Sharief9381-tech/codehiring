"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sparkles, Star, ExternalLink, Loader2, ArrowRight, Code2, Trophy } from "lucide-react"
import Link from "next/link"

interface Candidate {
  _id: string; name: string; college: string; branch: string
  year: number | null; matchScore: number; problems: number
  rating: number; skills: string[]; platforms: string[]; isOpenToWork: boolean
}

export function RecommendedCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/recruiter/search?sort=match&openToWork=true")
      .then((r) => r.json())
      .then((d) => setCandidates((d.candidates ?? []).slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-base">Top Candidates</CardTitle>
        </div>
        <Link href="/recruiter/search">
          <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground hover:text-foreground">
            View all <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-16 rounded-xl" />
            ))}
          </div>
        ) : candidates.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
              <Sparkles className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No candidates yet</p>
            <p className="text-xs text-muted-foreground">Students need to register and connect platforms</p>
          </div>
        ) : (
          candidates.map((c) => (
            <div key={c._id} className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3 hover:border-primary/30 hover:bg-primary/5 transition-all">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                  {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                  <Badge className="shrink-0 gap-0.5 text-[10px] px-1.5 py-0 bg-primary/15 text-primary border-primary/20">
                    <Star className="h-2.5 w-2.5" />{c.matchScore}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {c.college}{c.branch ? ` · ${c.branch}` : ""}{c.year ? ` · ${c.year}` : ""}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="flex items-center gap-1 justify-end">
                    <Code2 className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs font-semibold text-foreground">{c.problems}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">solved</p>
                </div>
                <Link href={`/recruiter/search`}>
                  <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
