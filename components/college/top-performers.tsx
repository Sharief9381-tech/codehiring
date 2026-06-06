"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, RefreshCw, Users } from "lucide-react"

interface TopPerformer {
  id: string; name: string; email: string; rollNumber: string
  branch: string; totalProblems: number; currentRating: number
  overallRank: string; placementStatus: string
}

const rankStyle = (i: number) =>
  i === 0 ? "bg-amber-400/20 text-amber-500 border-amber-400/30" :
  i === 1 ? "bg-slate-400/20 text-slate-400 border-slate-400/30" :
  i === 2 ? "bg-orange-400/20 text-orange-500 border-orange-400/30" :
             "bg-secondary text-muted-foreground border-border"

const statusBadge = (s: string) =>
  s === "placed"      ? <Badge className="text-[10px] px-1.5 py-0 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Placed</Badge> :
  s === "interviewing" ? <Badge className="text-[10px] px-1.5 py-0 bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20">Interviewing</Badge> :
                         <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Searching</Badge>

export function TopPerformers() {
  const [performers, setPerformers] = useState<TopPerformer[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/college/dashboard")
      if (res.ok) { const d = await res.json(); setPerformers(d.topPerformers ?? []) }
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10">
            <Trophy className="h-4 w-4 text-amber-500" />
          </div>
          <CardTitle className="text-base">Top Performers</CardTitle>
        </div>
        <button onClick={fetchData} disabled={loading} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-secondary/80">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-14 rounded-xl" />
            ))}
          </div>
        ) : performers.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No student data yet</p>
            <p className="text-xs text-muted-foreground text-center max-w-xs">Students need to link coding platforms to appear here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {performers.slice(0, 10).map((p, i) => (
              <Link key={p.id} href="/college/students">
                <div className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer">
                  {/* Rank */}
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${rankStyle(i)}`}>
                    {i + 1}
                  </div>
                  {/* Avatar */}
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                      {statusBadge(p.placementStatus)}
                    </div>
                    <p className="text-xs text-muted-foreground">{p.rollNumber} · {p.branch}</p>
                  </div>
                  {/* Stats */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-foreground tabular-nums">{p.totalProblems}</p>
                    <p className="text-[10px] text-muted-foreground">problems</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
