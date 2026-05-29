"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { SpotlightCard } from "@/components/landing/spotlight-card"
import { GraduationCap, Building2, Briefcase, Code2, Trophy, Users } from "lucide-react"

interface PlatformStats {
  students: number
  colleges: number
  recruiters: number
  drives: number
  problemsSolved: number
  applications: number
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
  href,
}: {
  icon: React.ElementType
  label: string
  sublabel: string
  value: number
  spotlight: string
  iconClass: string
  href: string
}) {
  const count = useCountUp(value)

  return (
    <Link href={href} className="h-full">
      <SpotlightCard
        spotlightColor={spotlight}
        className="h-full min-h-[120px] p-5 hover:border-primary/40 cursor-pointer hover:scale-[1.02] transition-transform"
      >
        <div className="flex items-center justify-between gap-4 h-full">
          {/* Left: icon + labels */}
          <div className="flex flex-col gap-1.5">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
              <Icon className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-foreground/80 mt-1">{label}</p>
            <p className="text-xs text-muted-foreground">{sublabel}</p>
          </div>
          {/* Right: count */}
          <p className="text-3xl font-bold text-foreground tabular-nums leading-none shrink-0">
            {formatNumber(count)}
          </p>
        </div>
      </SpotlightCard>
    </Link>
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

  // Row 1: Students · Colleges · Problems Solved
  const row1 = [
    {
      icon: GraduationCap,
      label: "Students Registered",
      sublabel: "Across all colleges",
      value: data?.students ?? 0,
      spotlight: "rgba(139,92,246,0.14)",
      iconClass: "bg-primary/10 text-primary",
      href: "/explore/students",
    },
    {
      icon: Building2,
      label: "Colleges Onboarded",
      sublabel: "Tracking placements",
      value: data?.colleges ?? 0,
      spotlight: "rgba(99,102,241,0.14)",
      iconClass: "bg-chart-1/10 text-chart-1",
      href: "/explore/colleges",
    },
    {
      icon: Code2,
      label: "Problems Solved",
      sublabel: "Across all platforms",
      value: data?.problemsSolved ?? 0,
      spotlight: "rgba(34,197,94,0.12)",
      iconClass: "bg-chart-2/10 text-chart-2",
      href: "/explore/students",
    },
  ]

  // Row 2: Recruiters · Hiring Drives · Applications
  const row2 = [
    {
      icon: Briefcase,
      label: "Recruiters",
      sublabel: "Hiring actively",
      value: data?.recruiters ?? 0,
      spotlight: "rgba(234,179,8,0.10)",
      iconClass: "bg-chart-3/10 text-chart-3",
      href: "/explore/recruiters",
    },
    {
      icon: Users,
      label: "Hiring Drives",
      sublabel: "Created on platform",
      value: data?.drives ?? 0,
      spotlight: "rgba(34,211,238,0.13)",
      iconClass: "bg-chart-4/10 text-chart-4",
      href: "/explore/drives",
    },
    {
      icon: Trophy,
      label: "Applications",
      sublabel: "Submitted to drives",
      value: data?.applications ?? 0,
      spotlight: "rgba(239,68,68,0.11)",
      iconClass: "bg-destructive/10 text-destructive",
      href: "/explore/drives",
    },
  ]

  return (
    <section id="stats" className="py-16 border-y border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Live platform stats
          </span>
        </div>

        <div className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
            {row1.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>
          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
            {row2.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
