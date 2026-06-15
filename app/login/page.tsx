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
  platforms: number
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
      <p style={{ fontSize: 20, fontWeight: 900, color: "#ffffff", fontVariantNumeric: "tabular-nums", margin: 0 }}>
        {display}{suffix}
      </p>
      <p style={{ fontSize: 11, color: "rgba(167,139,250,0.6)", margin: 0 }}>{label}</p>
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
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
      <div style={{ position: "relative", width: 8, height: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399" }} />
        {pulse && (
          <div style={{
            position: "absolute", inset: 0, width: 8, height: 8,
            borderRadius: "50%", background: "#34d399",
            animation: "livePing 0.9s ease-out forwards", opacity: 0.75,
          }} />
        )}
      </div>
      <span style={{ fontSize: 11, color: "rgba(52,211,153,0.85)", fontWeight: 700, letterSpacing: "0.06em" }}>LIVE DATA</span>
      <style>{`@keyframes livePing { 0%{transform:scale(1);opacity:.75} 100%{transform:scale(2.5);opacity:0} }`}</style>
    </div>
  )
}

export default function LoginPage() {
  const [stats, setStats]   = useState<LiveStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/public/stats")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setStats(d) })
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    { value: stats?.students  ?? 0, label: "Students",   suffix: "+" },
    { value: stats?.companies ?? 0, label: "Recruiters", suffix: "+" },
    { value: stats?.platforms ?? 8, label: "Platforms",  suffix: ""  },
  ]

  return (
    /* force dark background — immune to light/dark mode */
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden", background: "#050508" }}>
      <SignupBackground />

      <div style={{
        position: "relative", zIndex: 10,
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px 16px",
      }}>
        <div style={{
          width: "100%", maxWidth: 896,
          display: "flex", flexDirection: "row", gap: 40, alignItems: "center",
        }} className="flex-col-mobile">

          {/* ── LEFT: Brand panel ────────────────────────────────── */}
          <div style={{ flex: 1 }} className="hide-mobile">
            <Link href="/" style={{ display: "inline-flex", marginBottom: 40 }}>
              <Image src="/codehiring-logo-dark.svg" alt="CodeHiring" width={160} height={40} style={{ height: 36, width: "auto" }} />
            </Link>

            <h2 style={{
              fontSize: 38, fontWeight: 900, color: "#ffffff",
              lineHeight: 1.2, marginBottom: 16,
              textShadow: "0 0 40px rgba(139,92,246,0.4)",
            }}>
              Where Coding Skills<br />
              <span style={{
                background: "linear-gradient(135deg,#a78bfa,#818cf8,#60a5fa)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Meet Opportunities
              </span>
            </h2>

            <p style={{ fontSize: 14, color: "rgba(167,139,250,0.65)", marginBottom: 24, lineHeight: 1.6 }}>
              Join thousands of students, colleges, and recruiters using verified coding data to make smarter hiring decisions.
            </p>

            <LiveIndicator />

            {/* Stats row — fixed height prevents layout shift */}
            <div style={{ display: "flex", gap: 16, marginBottom: 32, minHeight: 62 }}>
              {loading
                ? [0,1,2].map(i => (
                  <div key={i} style={{
                    background: "rgba(124,58,237,0.08)", border: "1px solid rgba(139,92,246,0.12)",
                    borderRadius: 12, padding: "10px 18px", minWidth: 72,
                  }}>
                    <div style={{ height: 24, background: "rgba(139,92,246,0.15)", borderRadius: 4, marginBottom: 4 }} />
                    <div style={{ height: 11, background: "rgba(139,92,246,0.10)", borderRadius: 4, width: "70%" }} />
                  </div>
                ))
                : statCards.map(s => <StatCard key={s.label} {...s} />)
              }
            </div>

            {/* Features */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {features.map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    background: "rgba(124,58,237,0.18)", border: "1px solid rgba(139,92,246,0.25)",
                    borderRadius: 8, width: 32, height: 32,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <Icon style={{ width: 16, height: 16, color: "#a78bfa" }} />
                  </div>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Login card ─────────────────────────────────── */}
          <div style={{ width: "100%", maxWidth: 400, flexShrink: 0 }}>
            {/* Mobile logo */}
            <div className="show-mobile" style={{ display: "none", justifyContent: "center", marginBottom: 28 }}>
              <Link href="/">
                <Image src="/codehiring-logo-dark.svg" alt="CodeHiring" width={150} height={38} style={{ height: 36, width: "auto" }} />
              </Link>
            </div>

            {/* Mobile stats */}
            <div className="show-mobile" style={{ display: "none", justifyContent: "center", gap: 12, marginBottom: 20 }}>
              {!loading && statCards.map(s => <StatCard key={s.label} {...s} />)}
            </div>

            {/* Glass card */}
            <div style={{
              background: "rgba(12,8,28,0.85)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: "1px solid rgba(139,92,246,0.28)",
              borderRadius: 24,
              boxShadow: "0 0 0 1px rgba(139,92,246,0.06), 0 32px 80px rgba(0,0,0,0.7), 0 0 80px rgba(124,58,237,0.10)",
              padding: "36px 32px 28px",
            }}>
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "#ffffff", margin: 0, letterSpacing: "-0.02em" }}>
                  Welcome back
                </h1>
                <p style={{ fontSize: 14, color: "rgba(167,139,250,0.6)", marginTop: 6, marginBottom: 0 }}>
                  Sign in to your CodeHiring account
                </p>
              </div>

              <ClientOnly fallback={
                <div style={{ height: 192, borderRadius: 12, background: "rgba(255,255,255,0.05)", animation: "pulse 1.5s ease-in-out infinite" }} />
              }>
                <LoginForm />
              </ClientOnly>

              <p style={{ marginTop: 24, textAlign: "center", fontSize: 14, color: "rgba(167,139,250,0.5)" }}>
                Don&apos;t have an account?{" "}
                <Link href="/signup" style={{ color: "#a78bfa", fontWeight: 600, textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#c4b5fd")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#a78bfa")}>
                  Create one
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          .flex-col-mobile { flex-direction: column !important; }
        }
      `}</style>
    </div>
  )
}
