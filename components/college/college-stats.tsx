"use client"

import { useState, useEffect } from "react"
import { GraduationCap, Users, Trophy, Briefcase, RefreshCw, TrendingUp } from "lucide-react"
import type { CollegeProfile } from "@/lib/types"

interface CollegeStatsProps {
  college: CollegeProfile
}

interface DashboardData {
  college: { name: string; code: string; location?: string }
  overview: {
    totalStudents: number; activeStudents: number; registrationRate: number
    avgProblems: number; avgContributions: number; avgRating: number; placementRate: number
  }
}

const STAT_META = [
  { key: "totalStudents",   label: "Total Students",   sub: "Registered",        icon: GraduationCap, gradient: "from-violet-500 to-purple-600",  bg: "bg-violet-500/10",  text: "text-violet-500"  },
  { key: "activeStudents",  label: "Active Students",  sub: "With platforms",    icon: Users,         gradient: "from-blue-500 to-cyan-500",       bg: "bg-blue-500/10",    text: "text-blue-500"    },
  { key: "avgProblems",     label: "Avg. Problems",    sub: "Per student",       icon: Trophy,        gradient: "from-amber-500 to-orange-500",    bg: "bg-amber-500/10",   text: "text-amber-500"   },
  { key: "placementRate",   label: "Placement Rate",   sub: "This year",         icon: Briefcase,     gradient: "from-emerald-500 to-teal-500",    bg: "bg-emerald-500/10", text: "text-emerald-500" },
] as const

export function CollegeStats({ college }: CollegeStatsProps) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/college/dashboard")
      if (res.ok) setData(await res.json())
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  return (
    <div className="space-y-4">
      {/* College header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground tracking-tight">
            {data?.college.name ?? college.collegeName ?? college.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            {data?.college.code ?? college.collegeCode}
            {data?.college.location && ` · ${data.college.location}`}
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-secondary/80"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_META.map(({ key, label, sub, icon: Icon, gradient, bg, text }) => {
          const raw = data?.overview?.[key as keyof typeof data.overview] ?? 0
          const value = key === "placementRate" ? `${raw}%` : typeof raw === "number" ? raw.toLocaleString() : raw
          return (
            <div key={key} className="group relative rounded-2xl border border-border/60 bg-card p-5 overflow-hidden card-hover">
              <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${gradient}`} />
              <div className="flex items-start justify-between mb-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
                  <Icon className={`h-5 w-5 ${text}`} />
                </div>
                {!loading && (
                  <TrendingUp className="h-4 w-4 text-emerald-500 opacity-60" />
                )}
              </div>
              {loading ? (
                <div className="space-y-2">
                  <div className="skeleton h-8 w-20" />
                  <div className="skeleton h-4 w-28" />
                </div>
              ) : (
                <>
                  <p className="text-2xl font-bold text-foreground tabular-nums">{value}</p>
                  <p className="text-sm font-medium text-foreground/80 mt-0.5">{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
