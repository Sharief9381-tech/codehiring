"use client"

import { useEffect, useState, useRef } from "react"
import { SpotlightCard } from "@/components/landing/spotlight-card"
import { GraduationCap, Building2, Briefcase, Code2, Trophy, Users } from "lucide-react"

interface PlatformStats {
  students: number
  colleges: number
  recruiters: number
  drives: number
  problemsSolved: number
  applications: number
  platformConnections: number
}

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (target === 0) { setValue(0); return }
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [target, duration])

  return value
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K+`
  return n > 0 ? `${n}+` : "—"
}

function StatCard({
  icon: Icon,
  label,
  sublabel,
  value,
  spotlight,
  iconClass,
}: {
  icon: React.ElementType
  label: string
  sublabel: string
  value: number
  spotlight: string
  iconClass: string
}) {
  const count = useCountUp(value)

  return (
    <SpotlightCard
      spotlightColor={spotlight}
      className="p-6 hover:border-primary/40"
    >
      <div className="flex items-start gap-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {formatNumber(count)}
          </p>
          <p className="text-sm font-medium text-foreground/80 mt-0.5">{label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
        </div>
      </div>
    </SpotlightCard>
  )
}

export function Stats() {
  const [data, setData] = useState<PlatformStats | null>(null)

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
  }, [])

  const stats = [
    {
      icon: GraduationCap,
      label: "Students Registered",
      sublabel: "Across all colleges",
      value: data?.students ?? 0,
      spotlight: "rgba(139,92,246,0.14)",
      iconClass: "bg-primary/10 text-primary",
    },
    {
      icon: Building2,
      label: "Colleges Onboarded",
      sublabel: "Tracking placements",
      value: data?.colleges ?? 0,
      spotlight: "rgba(99,102,241,0.14)",
      iconClass: "bg-chart-1/10 text-chart-1",
    },
    {
      icon: Briefcase,
      label: "Recruiters",
      sublabel: "Hiring actively",
      value: data?.recruiters ?? 0,
      spotlight: "rgba(234,179,8,0.13)",
      iconClass: "bg-chart-3/10 text-chart-3",
    },
    {
      icon: Users,
      label: "Hiring Drives",
      sublabel: "Created on platform",
      value: data?.drives ?? 0,
      spotlight: "rgba(34,211,238,0.13)",
      iconClass: "bg-chart-4/10 text-chart-4",
    },
    {
      icon: Code2,
      label: "Problems Solved",
      sublabel: "Across all platforms",
      value: data?.problemsSolved ?? 0,
      spotlight: "rgba(34,197,94,0.12)",
      iconClass: "bg-chart-2/10 text-chart-2",
    },
    {
      icon: Trophy,
      label: "Applications",
      sublabel: "Submitted to drives",
      value: data?.applications ?? 0,
      spotlight: "rgba(239,68,68,0.11)",
      iconClass: "bg-destructive/10 text-destructive",
    },
  ]

  return (
    <section className="py-16 border-y border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Live platform stats
          </p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">
            Real numbers, updated in real time
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>
      </div>
    </section>
  )
}
