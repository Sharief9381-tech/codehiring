"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, TrendingUp, Users, CheckCircle2, Clock, Search } from "lucide-react"
import Link from "next/link"

interface PlacementData {
  total: number; placed: number; interviewing: number; searching: number; placementRate: number
}

const METRICS = [
  { key: "placed",       label: "Placed",       icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", href: "/college/placements" },
  { key: "interviewing", label: "Interviewing",  icon: Clock,        color: "text-amber-500",   bg: "bg-amber-500/10",   href: "/college/placements" },
  { key: "searching",    label: "Searching",     icon: Search,       color: "text-blue-500",    bg: "bg-blue-500/10",    href: "/college/students"   },
  { key: "total",        label: "Total",         icon: Users,        color: "text-primary",     bg: "bg-primary/10",     href: "/college/students"   },
] as const

export function PlacementOverview() {
  const [data, setData] = useState<PlacementData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/college/dashboard")
      if (res.ok) { const d = await res.json(); setData(d.placement) }
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-base">Placement Overview</CardTitle>
        </div>
        <button onClick={fetchData} disabled={loading} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-secondary/80">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rate hero */}
        {!loading && data && (
          <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 p-4 text-center">
            <p className="text-3xl font-black text-emerald-500 tabular-nums">{data.placementRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">Overall Placement Rate</p>
          </div>
        )}
        {loading && <div className="skeleton h-20 rounded-xl" />}

        {/* Metric cards */}
        <div className="grid grid-cols-2 gap-3">
          {METRICS.map(({ key, label, icon: Icon, color, bg, href }) => (
            <Link key={key} href={href}>
              <div className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <div className="min-w-0">
                  {loading ? (
                    <div className="skeleton h-5 w-10 mb-1" />
                  ) : (
                    <p className="text-lg font-bold text-foreground tabular-nums">
                      {data?.[key as keyof PlacementData] ?? 0}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground truncate">{label}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
