"use client"

import { useEffect, useRef, useState } from "react"
import { GraduationCap, Building2, Briefcase, Code2, Trophy, Users } from "lucide-react"

interface PlatformStats {
  students: number
  colleges: number
  recruiters: number
  drives: number
  problemsSolved: number
  applications: number
}

function useCountUp(target: number, duration = 1400) {
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
  return n > 0 ? `${n}+` : "0"
}

function StatItem({
  icon: Icon,
  label,
  sublabel,
  value,
  iconClass,
  loaded,
}: {
  icon: React.ElementType
  label: string
  sublabel: string
  value: number
  iconClass: string
  loaded: boolean
}) {
  const count = useCountUp(loaded ? value : 0)

  return (
    <div className="flex flex-col items-center text-center gap-3 py-8 px-4 cursor-pointer group relative overflow-hidden rounded-xl hover:bg-primary/5 transition-colors">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass} group-hover:scale-110 transition-transform`}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-4xl font-bold text-foreground tabular-nums group-hover:text-primary transition-colors">
        {loaded ? formatNumber(count) : "—"}
      </p>
      <div>
        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
      </div>
    </div>
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

  const items = [
    {
      icon: GraduationCap,
      label: "Students Registered",
      sublabel: "Across all colleges",
      value: data?.students ?? 0,
      iconClass: "bg-primary/10 text-primary",
    },
    {
      icon: Building2,
      label: "Colleges Onboarded",
      sublabel: "Tracking placements",
      value: data?.colleges ?? 0,
      iconClass: "bg-indigo-500/10 text-indigo-500",
    },
    {
      icon: Code2,
      label: "Problems Solved",
      sublabel: "Across all platforms",
      value: data?.problemsSolved ?? 0,
      iconClass: "bg-emerald-500/10 text-emerald-500",
    },
    {
      icon: Briefcase,
      label: "Companies Hiring",
      sublabel: "Actively recruiting",
      value: data?.recruiters ?? 0,
      iconClass: "bg-amber-500/10 text-amber-500",
    },
    {
      icon: Users,
      label: "Hiring Drives",
      sublabel: "Posted on platform",
      value: data?.drives ?? 0,
      iconClass: "bg-cyan-500/10 text-cyan-500",
    },
    {
      icon: Trophy,
      label: "Applications",
      sublabel: "Submitted to drives",
      value: data?.applications ?? 0,
      iconClass: "bg-rose-500/10 text-rose-500",
    },
  ]

  return (
    <section id="stats" className="py-8 border-y border-border bg-secondary/20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Live platform stats
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-border">
          {items.map((item, i) => (
            <StatItem key={i} {...item} loaded={data !== null} />
          ))}
        </div>
      </div>
    </section>
  )
}
