"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { ClientOnly } from "@/components/client-only"
import { SignupBackground } from "@/components/signup-background"
import { Code2, GitBranch, Trophy, Zap, Shield, Users } from "lucide-react"

const features = [
  { icon: Code2,     text: "Verified coding stats from 8+ platforms" },
  { icon: Trophy,    text: "AI-powered job matching" },
  { icon: GitBranch, text: "Real GitHub & contest data" },
  { icon: Zap,       text: "Instant placement insights" },
  { icon: Shield,    text: "Secure & verified profiles" },
  { icon: Users,     text: "Active student community" },
]

interface LiveStats {
  students: number
  companies: number
  problems: number
  platforms: number
  colleges: number
  placements: number
}

function useCountUp(target: number, duration = 1400) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!target) return
    let start = 0, raf = 0
    const tick = (now: number) => {
      if (!start) start = now
      const p = Math.min((now - start) / duration, 1)
      setV(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return v
}

function StatCard({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  const animated = useCountUp(value)
  const display = value >= 1000
    ? (animated >= 1000 ? `${(animated / 1000).toFixed(1)}K` : animated.toString())
    : animated.toString()

  return (
    <div style={{
      background: "rgba(124,58,237,0.12)",
      border: "1px solid rgba(139,92,246,0.22)",
      borderRadius: 12,
      padding: "10px 18px",
      textAlign: "center",
      minWidth: 72,
    }}>
      <p className="text-xl font-black text-white tabular-nums">
        {display}{suffix}
      </p>
      <p style={{ fontSize: 11, color: "rgba(167,139,250,0.6)" }}>{label}</p>
    </div>
  )
}

function LiveIndicator() {
  const [pulse, setPulse] = useState(true)
  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 900)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="flex items-center gap-1.5 mb-3">
      <div className="relative">
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
        {pulse && <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />}
      </div>
      <span style={{ fontSize: 11, color: "rgba(52,211,153,0.8)", fontWeight: 600 }}>LIVE DATA</span>
    </div>
  )
}

export default function LoginPage() {
  const [stats, setStats] = useState<LiveStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/public/stats")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setStats(d) })
      .finally(() => setLoading(false))
  }, [])

  const statCards = stats
    ? [
        { value: stats.students,   label: "Students",  suffix: "+" },
        { value: stats.companies,  label: "Recruiters",suffix: "+" },
        { value: stats.platforms,  label: "Platforms",  suffix: "" },
      ]
    : [
        { value: 0, label: "Students",  suffix: "+" },
        { value: 0, label: "Recruiters",suffix: "+" },
        { value: 0, label: "Platforms", suffix: "" },
      ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050508]">
      <SignupBackground />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-10 items-center">

          {/* ── LEFT: Brand panel ──────────────────────────────────────── */}
          <div className="flex-1 hidden lg:flex flex-col justify-center">
            <Link href="/" className="mb-10 inline-flex">
              <Image src="/codehiring-logo-dark.svg" alt="CodeHiring" width={160} height={40} className="h-9 w-auto" />
            </Link>

            <h2 className="text-4xl font-black text-white leading-tight mb-4"
              style={{ textShadow: "0 0 40px rgba(139,92,246,0.4)" }}>
              Where Coding Skills<br />
              <span style={{ background: "linear-gradient(135deg,#a78bfa,#818cf8,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Meet Opportunities
              </span>
            </h2>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: "rgba(167,139,250,0.65)" }}>
              Join thousands of students, colleges, and recruiters using verified coding data to make smarter hiring decisions.
            </p>

            {/* Live indicator */}
            <LiveIndicator />

            {/* Real-time stats */}
            <div className="flex gap-4 mb-8">
              {loading ? (
                // Skeleton
                [0,1,2].map(i => (
                  <div key={i} style={{
                    background: "rgba(124,58,237,0.08)",
                    border: "1px solid rgba(139,92,246,0.12)",
                    borderRadius: 12, padding: "10px 18px", minWidth: 72,
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}>
                    <div style={{ height: 24, background: "rgba(139,92,246,0.15)", borderRadius: 4, marginBottom: 4 }} />
                    <div style={{ height: 11, background: "rgba(139,92,246,0.10)", borderRadius: 4, width: "70%" }} />
                  </div>
                ))
              ) : (
                statCards.map(s => (
                  <StatCard key={s.label} value={s.value} label={s.label} suffix={s.suffix} />
                ))
              )}
            </div>

            {/* Extra live stat — problems solved */}
            {stats && stats.problems > 0 && (
              <div className="mb-8 flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: "rgba(124,58,237,0.10)", border: "1px solid rgba(139,92,246,0.18)" }}>
                <Code2 className="h-5 w-5 text-violet-400 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-white">
                    {stats.problems.toLocaleString()} problems solved
                  </p>
                  <p style={{ fontSize: 11, color: "rgba(167,139,250,0.55)" }}>
                    across {stats.colleges} colleges · {stats.platformConnections?.toLocaleString?.() ?? "—"} platform connections
                  </p>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="space-y-3">
              {features.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div style={{ background: "rgba(124,58,237,0.18)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon className="h-4 w-4 text-violet-400" />
                  </div>
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Login card ──────────────────────────────────────── */}
          <div className="w-full lg:w-[400px] shrink-0">
            {/* Mobile logo */}
            <div className="flex justify-center mb-7 lg:hidden">
              <Link href="/">
                <Image src="/codehiring-logo-dark.svg" alt="CodeHiring" width={150} height={38} className="h-9 w-auto" />
              </Link>
            </div>

            {/* Mobile live stats strip */}
            <div className="flex lg:hidden justify-center gap-3 mb-5">
              {!loading && statCards.map(s => (
                <StatCard key={s.label} value={s.value} label={s.label} suffix={s.suffix} />
              ))}
            </div>

            {/* Glass card */}
            <div style={{
              background: "rgba(12,8,28,0.80)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: "1px solid rgba(139,92,246,0.28)",
              borderRadius: 24,
              boxShadow: "0 0 0 1px rgba(139,92,246,0.06), 0 32px 80px rgba(0,0,0,0.7), 0 0 80px rgba(124,58,237,0.10)",
              padding: "36px 32px 28px",
            }}>
              <div className="mb-7">
                <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
                <p className="text-sm mt-1.5" style={{ color: "rgba(167,139,250,0.6)" }}>
                  Sign in to your CodeHiring account
                </p>
              </div>

              <ClientOnly fallback={<div className="h-48 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />}>
                <LoginForm />
              </ClientOnly>

              <p className="mt-6 text-center text-sm" style={{ color: "rgba(167,139,250,0.5)" }}>
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
