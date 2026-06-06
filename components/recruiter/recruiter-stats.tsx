"use client"

import { useEffect, useState } from "react"
import { Users, Briefcase, BookmarkCheck, UserCheck, Loader2, TrendingUp } from "lucide-react"

interface DashboardStats {
  activeJobs: number
  totalApplications: number
  totalShortlisted: number
  totalInterviewed: number
}

const ITEMS = [
  {
    key: "activeJobs" as const,
    label: "Active Jobs",
    sub: "Currently open",
    icon: Briefcase,
    gradient: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/20",
    bg: "bg-violet-500/10",
    text: "text-violet-500",
  },
  {
    key: "totalApplications" as const,
    label: "Applications",
    sub: "Total received",
    icon: Users,
    gradient: "from-blue-500 to-cyan-600",
    glow: "shadow-blue-500/20",
    bg: "bg-blue-500/10",
    text: "text-blue-500",
  },
  {
    key: "totalShortlisted" as const,
    label: "Shortlisted",
    sub: "Candidates reviewed",
    icon: BookmarkCheck,
    gradient: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/20",
    bg: "bg-amber-500/10",
    text: "text-amber-500",
  },
  {
    key: "totalInterviewed" as const,
    label: "Interviewed",
    sub: "In pipeline",
    icon: UserCheck,
    gradient: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/20",
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
  },
]

export function RecruiterStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/recruiter/dashboard")
      .then((r) => r.json())
      .then((data) => setStats({
        activeJobs: data.activeJobs ?? 0,
        totalApplications: data.totalApplications ?? 0,
        totalShortlisted: data.totalShortlisted ?? 0,
        totalInterviewed: data.totalInterviewed ?? 0,
      }))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ITEMS.map((item) => {
        const Icon = item.icon
        const value = stats?.[item.key] ?? 0
        return (
          <div key={item.key} className="group relative rounded-2xl border border-border/60 bg-card p-5 overflow-hidden card-hover">
            {/* Subtle gradient top edge */}
            <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${item.gradient}`} />

            <div className="flex items-start justify-between mb-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg}`}>
                <Icon className={`h-5 w-5 ${item.text}`} />
              </div>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mt-1" />
              ) : (
                <div className="flex items-center gap-1 text-xs text-emerald-500">
                  <TrendingUp className="h-3 w-3" />
                </div>
              )}
            </div>

            <p className="text-2xl font-bold text-foreground tabular-nums">
              {loading ? "—" : value.toLocaleString()}
            </p>
            <p className="text-sm font-medium text-foreground/80 mt-0.5">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.sub}</p>
          </div>
        )
      })}
    </div>
  )
}
