"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react"

function formatStat(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K+`
  return n > 0 ? `${n}+` : "—"
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

function HeroStat({ label, value, loaded }: { label: string; value: number; loaded: boolean }) {
  const count = useCountUp(loaded ? value : 0)
  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-foreground tabular-nums">
        {loaded ? formatStat(count) : "—"}
      </p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  )
}

export function Hero() {
  const [stats, setStats] = useState<{ students: number; colleges: number; recruiters: number } | null>(null)

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setStats({ students: d.students ?? 0, colleges: d.colleges ?? 0, recruiters: d.recruiters ?? 0 }))
      .catch(() => setStats({ students: 0, colleges: 0, recruiters: 0 }))
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-6 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(139,92,246,0.18),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_60%,rgba(99,102,241,0.08),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_20%_80%,rgba(34,197,94,0.06),transparent)]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative mx-auto max-w-5xl text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-8 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="font-medium">AI-Powered Campus Recruitment</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance leading-[1.1]">
          Where Coding Skills{" "}
          <span className="bg-gradient-to-r from-primary via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Meet Opportunities
          </span>
        </h1>

        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          CodeHiring unifies student coding performance across all platforms, gives colleges placement
          analytics, and helps recruiters find verified talent — all in one place.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/signup">
            <Button size="lg" className="gap-2 px-8 text-base">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="px-8 text-base bg-transparent">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Divider */}
        <div className="mt-16 w-px h-12 bg-gradient-to-b from-border to-transparent mx-auto" />

        {/* Live stats */}
        <div className="mt-8 grid grid-cols-3 gap-12 max-w-md mx-auto">
          <HeroStat label="Students" value={stats?.students ?? 0} loaded={stats !== null} />
          <HeroStat label="Colleges" value={stats?.colleges ?? 0} loaded={stats !== null} />
          <HeroStat label="Companies" value={stats?.recruiters ?? 0} loaded={stats !== null} />
        </div>
      </div>

      {/* Scroll indicator */}
      <a href="#stats" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors animate-bounce">
        <ChevronDown className="h-6 w-6" />
      </a>
    </section>
  )
}
