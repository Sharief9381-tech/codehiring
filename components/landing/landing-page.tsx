"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { ProductShowcase } from "@/components/landing/product-showcase"
import {
  ArrowRight, Sparkles, ChevronDown,
  GraduationCap, Building2, Briefcase, Award,
  BarChart3, Users, Brain, Trophy, FileText, Target, GitBranch, ShieldCheck, Zap,
  Code2, Github, Terminal, Braces, Hash, FileCode, BookOpen, Cpu,
  Star, TrendingUp, CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { blogPosts } from "@/lib/blog-posts"

const RECENT_POSTS = blogPosts.slice(0, 3).map(({ slug, title, tag, tagColor, date, readTime, excerpt }) => ({
  slug, title, tag, tagColor, date, readTime, excerpt,
}))

// ─── animation ───────────────────────────────────────────────────
const fadeUp  = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }
const stagger = { visible: { transition: { staggerChildren: 0.08 } } }

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref   = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"}
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: "easeOut" } } }}
      className={className}>
      {children}
    </motion.div>
  )
}

function useCountUp(target: number, duration = 1400) {
  const [v, setV] = useState(0)
  const r = useRef<number | null>(null)
  useEffect(() => {
    if (!target) { setV(0); return }
    const s = performance.now()
    const tick = (n: number) => {
      const p = Math.min((n - s) / duration, 1)
      setV(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) r.current = requestAnimationFrame(tick)
    }
    r.current = requestAnimationFrame(tick)
    return () => { if (r.current) cancelAnimationFrame(r.current) }
  }, [target, duration])
  return v
}

function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K+`
  return n > 0 ? `${n}+` : "0"
}

// ─── static data ─────────────────────────────────────────────────
const PLATFORMS = [
  { name: "LeetCode",      icon: Code2,    color: "text-amber-400",   bg: "bg-amber-400/10",   desc: "Problems & contests" },
  { name: "GitHub",        icon: Github,   color: "text-slate-300",   bg: "bg-slate-300/10",   desc: "Contributions & repos" },
  { name: "Codeforces",    icon: Hash,     color: "text-cyan-400",    bg: "bg-cyan-400/10",    desc: "Ratings & contests" },
  { name: "CodeChef",      icon: Braces,   color: "text-rose-400",    bg: "bg-rose-400/10",    desc: "Ratings & problems" },
  { name: "HackerRank",    icon: Terminal, color: "text-violet-400",  bg: "bg-violet-400/10",  desc: "Badges & certs" },
  { name: "GeeksforGeeks", icon: FileCode, color: "text-emerald-400", bg: "bg-emerald-400/10", desc: "Problems & courses" },
  { name: "HackerEarth",   icon: Cpu,      color: "text-indigo-400",  bg: "bg-indigo-400/10",  desc: "Challenges" },
  { name: "AtCoder",       icon: BookOpen, color: "text-purple-400",  bg: "bg-purple-400/10",  desc: "Competitive" },
]

const STAT_META = [
  { key: "students",       label: "Students",        icon: GraduationCap, color: "text-violet-400"  },
  { key: "colleges",       label: "Colleges",        icon: Building2,     color: "text-emerald-400" },
  { key: "recruiters",     label: "Companies",       icon: Briefcase,     color: "text-amber-400"   },
  { key: "drives",         label: "Hiring Drives",   icon: Users,         color: "text-cyan-400"    },
  { key: "problemsSolved", label: "Problems Solved", icon: Code2,         color: "text-rose-400"    },
  { key: "applications",   label: "Applications",    icon: Trophy,        color: "text-purple-400"  },
]

const FEATURES = [
  {
    role: "Students", icon: GraduationCap, accent: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-500/30",
    desc: "Track every platform. Build a verified profile. Land your dream job.",
    items: [
      { icon: BarChart3, title: "Unified Dashboard",  sub: "All platform stats in one verified profile." },
      { icon: Trophy,    title: "CodeHiring Score",   sub: "Normalized 0–1000 score across platforms." },
      { icon: FileText,  title: "AI Resume",          sub: "Auto-generate verified resume with real data." },
      { icon: Target,    title: "AI Job Match",       sub: "Personalized jobs based on your actual profile." },
      { icon: GitBranch, title: "GitHub Insights",    sub: "Contributions and repos tracked automatically." },
      { icon: Zap,       title: "Skill Gaps",         sub: "AI-identified gaps with curated resources." },
    ],
  },
  {
    role: "Colleges", icon: Building2, accent: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-500/30",
    desc: "Monitor batches. Drive placements. Prove your college's value.",
    items: [
      { icon: Users,      title: "Batch Tracking",      sub: "Real-time activity across all batches." },
      { icon: BarChart3,  title: "Placement Analytics", sub: "Data-driven insights to improve rates." },
      { icon: Trophy,     title: "Leaderboards",        sub: "Competitive leaderboards with badges." },
      { icon: ShieldCheck,title: "Access Control",      sub: "Control which recruiters see your data." },
      { icon: FileText,   title: "Reports",             sub: "One-click reports for NAAC and management." },
      { icon: Briefcase,  title: "Drive Management",    sub: "End-to-end campus drive management." },
    ],
  },
  {
    role: "Recruiters", icon: Briefcase, accent: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-500/30",
    desc: "Skip keyword matching. Hire on verified coding performance.",
    items: [
      { icon: Brain,      title: "AI Talent Matching", sub: "Verified skills, not self-reported claims." },
      { icon: Target,     title: "Advanced Filters",   sub: "Filter by ratings, ranks, GitHub activity." },
      { icon: Users,      title: "Bulk Outreach",      sub: "Smart automation for shortlisting." },
      { icon: ShieldCheck,title: "Verified Profiles",  sub: "Every stat pulled from the platform." },
      { icon: BarChart3,  title: "Hiring Pipeline",    sub: "Visual pipeline from screen to offer." },
      { icon: FileText,   title: "AI Assessments",     sub: "AI-powered coding assessments." },
    ],
  },
]

// ─── per-stat component (hook at top level) ───────────────────────
function StatItem({ s, loaded, stats }: { s: typeof STAT_META[number]; loaded: boolean; stats: Record<string, number> }) {
  const val   = stats[s.key] ?? 0
  const count = useCountUp(loaded ? val : 0)
  const Icon  = s.icon
  return (
    <motion.div variants={fadeUp}
      whileHover={{ y: -6, scale: 1.05, transition: { type: "spring", stiffness: 400 } }}
      whileTap={{ scale: 0.97 }}
      className="flex-1 flex flex-col items-center justify-center gap-2 py-6 px-3 rounded-none border-r border-border/40 last:border-r-0 bg-transparent hover:bg-[rgb(var(--sci))]/3 transition-colors cursor-default group">
      <div className="w-9 h-9 rounded-lg bg-[rgb(var(--sci))]/5 border border-[rgb(var(--sci))]/10 flex items-center justify-center group-hover:border-[rgb(var(--sci))]/30 transition-colors">
        <Icon className={`h-4 w-4 ${s.color}`} style={{ width: 16, height: 16 }} />
      </div>
      <span className={`text-2xl font-black tabular-nums leading-none ${s.color}`}>
        {loaded ? (val > 0 ? formatNum(count) : "—") : "—"}
      </span>
      <span className="text-[10px] text-[var(--sci-fg)]/30 font-semibold text-[10px]">{s.label}</span>
    </motion.div>
  )
}

// ─── terminal typewriter ──────────────────────────────────────────
function Typewriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("")
  const [started, setStarted]     = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => { if (inView) setTimeout(() => setStarted(true), delay * 1000) }, [inView, delay])
  useEffect(() => {
    if (!started) return
    let i = 0
    const id = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++
      if (i >= text.length) clearInterval(id)
    }, 40)
    return () => clearInterval(id)
  }, [started, text])
  return <span ref={ref}>{displayed}<span className="animate-pulse text-[var(--sci-fg)]">_</span></span>
}

// ─── sci-fi grid bg ───────────────────────────────────────────────
function GridBg() {
  return (
    <>
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(var(--sci-grid) 1px, transparent 1px), linear-gradient(90deg, var(--sci-grid) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      <div className="absolute top-0 left-0 w-32 h-px pointer-events-none" style={{ background: "linear-gradient(to right, var(--sci-border), transparent)" }} />
      <div className="absolute top-0 left-0 h-32 w-px pointer-events-none" style={{ background: "linear-gradient(to bottom, var(--sci-border), transparent)" }} />
      <div className="absolute top-0 right-0 w-32 h-px pointer-events-none" style={{ background: "linear-gradient(to left, var(--sci-border), transparent)" }} />
      <div className="absolute top-0 right-0 h-32 w-px pointer-events-none" style={{ background: "linear-gradient(to bottom, var(--sci-border), transparent)" }} />
    </>
  )
}

// ─── section wrapper ──────────────────────────────────────────────
function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative py-16 bg-background overflow-hidden ${className}`}>
      <GridBg />
      <div className="relative z-10">{children}</div>
    </section>
  )
}

// ─── terminal label ───────────────────────────────────────────────
function TermLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
      style={{ border: "1px solid var(--sci-border)", backgroundColor: "rgba(var(--sci),0.08)" }}>
      <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--sci-fg)" }} />
      <span className="text-[11px] font-semibold tracking-wider" style={{ color: "var(--sci-text)", fontFamily: "var(--font-brand)" }}>
        {children}
      </span>
    </div>
  )
}

// ─── tech card ────────────────────────────────────────────────────
function TechCard({ children, className = "", glow = "cyan" }: { children: React.ReactNode; className?: string; glow?: string }) {
  const glowMap: Record<string, string> = {
    cyan:    "hover:border-[rgb(var(--sci))]/40 hover:shadow-[0_0_30px_rgba(var(--sci),0.1)]",
    violet:  "hover:border-violet-500/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]",
    emerald: "hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
    amber:   "hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
  }
  return (
    <div className={`border border-border bg-white/2 backdrop-blur-sm transition-all duration-300 ${glowMap[glow] ?? glowMap.cyan} ${className}`}>
      {children}
    </div>
  )
}

// ─── main ─────────────────────────────────────────────────────────
export function LandingPage() {
  const [data, setData]           = useState<any>(null)
  const [loaded, setLoaded]       = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    fetch("/api/landing").then(r => r.json()).then(d => { setData(d); setLoaded(true) }).catch(() => setLoaded(true))
  }, [])

  const stats        = data?.stats ?? {}
  const testimonials = data?.siteConfig?.testimonials ?? []
  const openCareers  = data?.openCareers ?? 0
  const topColleges: string[] = data?.topColleges ?? []

  return (
    <div className="bg-background">

      {/* ══ HERO ════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-12 overflow-hidden bg-background">
        <GridBg />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(var(--sci),0.06), transparent)" }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_60%,rgba(139,92,246,0.08),transparent)] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-6xl w-full">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* LEFT */}
            <div className="flex-1">
              {/* badge */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="inline-flex items-center gap-2 border border-[rgb(var(--sci))]/25 bg-[rgb(var(--sci))]/5 rounded-sm px-4 py-1.5 mb-6">
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                    className="h-1.5 w-1.5 rounded-full bg-[var(--sci-fg)]" />
                  <span className="text-[var(--sci-fg)] text-[11px] font-semibold tracking-wide" style={{ fontFamily: "var(--font-brand)" }}>AI-Powered Skills-First Recruitment</span>
                </div>
              </motion.div>

              {/* headline */}
              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-5">
                Find Talent.<br />
                <span className="gradient-text">Based on Skills,</span><br />
                Not Resumes.
              </motion.h1>

              {/* typewriter sub */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="font-mono text-[var(--sci-fg)]/50 text-sm mb-6 flex items-center gap-2">
                <span className="text-[var(--sci-fg)]/30">[</span>
                <Typewriter text="DEPLOYING COGNITIVE SEARCH ALGORITHMS..." delay={0.8} />
                <span className="text-[var(--sci-fg)]/30">]</span>
              </motion.div>

              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                className="text-zinc-400 max-w-xl leading-relaxed mb-8 text-base">
                Track coding performance across platforms, discover top talent, and hire with confidence — all backed by verified real-time data.
              </motion.p>

              {/* CTAs */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-3">
                <Link href="/signup?role=student">
                  <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
                    <Button size="lg" className="gap-2 bg-[rgb(var(--sci))]/10 hover:bg-[rgb(var(--sci))]/20 text-[var(--sci-fg)] border border-[rgb(var(--sci))]/40 hover:border-[rgb(var(--sci))]/70 shadow-[0_0_20px_rgba(var(--sci),0.15)] hover:shadow-[0_0_30px_rgba(var(--sci),0.3)] font-semibold tracking-wide rounded-full text-sm transition-all">
                      <Sparkles className="h-4 w-4" /> Initialize Profile
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/login">
                  <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
                    <Button size="lg" variant="outline" className="border-white/15 text-zinc-400 hover:text-white hover:bg-white/5 font-semibold tracking-wide rounded-full text-sm">
                      Access System
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              {/* mini status bar */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                className="flex items-center gap-6 mt-10 pt-6 border-t border-[rgb(var(--sci))]/8">
                {[
                  { label: "STATUS", val: "OPTIMAL", color: "text-emerald-400" },
                  { label: "NODE", val: "US-EAST-1", color: "text-[var(--sci-fg)]" },
                  { label: "LATENCY", val: "12.3MS", color: "text-amber-400" },
                  { label: "UPTIME", val: "99.97%", color: "text-violet-400" },
                ].map(({ label, val, color }) => (
                  <div key={label} className="text-center">
                    <p className="text-[10px] font-medium text-muted-foreground/60">{label}</p>
                    <p className={`text-[11px] font-bold ${color}`}>{val}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT — terminal mockup */}
            <motion.div
              initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 300 } }}
              className="hidden lg:block flex-1 w-full max-w-md">
              <div className="relative">
                <div className="absolute inset-0 bg-[rgb(var(--sci))]/8 blur-3xl rounded-3xl" />
                <div className="relative border border-[rgb(var(--sci))]/20 bg-[--sci-bg-page]/90 backdrop-blur-sm rounded-sm overflow-hidden shadow-[0_0_60px_rgba(var(--sci),0.08)]">
                  {/* titlebar */}
                  <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[rgb(var(--sci))]/10 bg-[rgb(var(--sci))]/3">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
                    <span className="ml-3 text-[10px] font-medium text-muted-foreground/50">codehiring.io — student@dashboard</span>
                  </div>
                  <div className="p-5 space-y-4 text-xs">
                    {/* score */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[var(--sci-fg)]/40 text-[9px] uppercase tracking-widest mb-0.5">// CODEHIRING SCORE</p>
                        <p className="text-3xl font-black text-white tabular-nums">742
                          <span className="text-sm text-muted-foreground/70">/1000</span>
                        </p>
                      </div>
                      <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}
                        className="w-12 h-12 border border-[rgb(var(--sci))]/20 bg-[rgb(var(--sci))]/5 rounded-sm flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-[var(--sci-fg)]" />
                      </motion.div>
                    </div>
                    {/* platforms */}
                    <div className="flex gap-2">
                      {[["⚡","442","solved","text-amber-400"],["🔵","1654","CF rating","text-cyan-400"],["🐙","89","repos","text-slate-300"]].map(([e,v,s,c]) => (
                        <div key={String(s)} className="flex-1 border border-[rgb(var(--sci))]/8 bg-[rgb(var(--sci))]/3 p-2 text-center">
                          <p className="text-base">{e}</p>
                          <p className={`text-sm font-black ${c} tabular-nums`}>{v}</p>
                          <p className="text-[9px] text-muted-foreground/70">{s}</p>
                        </div>
                      ))}
                    </div>
                    {/* bars */}
                    {[["PLACEMENT READY", 78, "bg-[var(--sci-fg)]"], ["PROFILE COMPLETE", 92, "bg-violet-500"]].map(([l, v, c]) => (
                      <div key={String(l)}>
                        <div className="flex justify-between text-[9px] mb-1 text-muted-foreground/70">
                          <span>{l}</span><span className="text-muted-foreground">{v}%</span>
                        </div>
                        <div className="h-1 bg-muted/30">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${v}%` }}
                            transition={{ duration: 1.2, delay: 0.8 }}
                            className={`h-full ${c}`} />
                        </div>
                      </div>
                    ))}
                    {/* match */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                      className="border border-[rgb(var(--sci))]/15 bg-[rgb(var(--sci))]/5 p-3">
                      <p className="text-[var(--sci-fg)] text-[10px] font-bold">▶ 3 NEW JOB MATCHES DETECTED</p>
                      <p className="text-zinc-600 text-[9px] mt-0.5">BASED ON VERIFIED CODING PROFILE</p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.a href="#stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[var(--sci-fg)]/30 hover:text-[var(--sci-fg)]/60 transition-colors animate-bounce">
          <ChevronDown className="h-6 w-6" />
        </motion.a>
      </section>

      {/* ══ TRUSTED BY ══════════════════════════════════════════════ */}
      {topColleges.length > 0 && (
        <Section>
          <div className="mx-auto max-w-5xl px-6">
            <FadeUp>
              <p className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-5">
                Trusted by Students from
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {topColleges.map((c, i) => (
                  <motion.div key={c}
                    initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ scale: 1.08, y: -2, transition: { type: "spring", stiffness: 400 } }}
                    className="relative group cursor-default">
                    <div className="absolute inset-0 rounded-full bg-violet-500/15 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 group-hover:border-violet-500/40 group-hover:bg-violet-500/8 transition-all duration-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-400 group-hover:bg-violet-300 transition-colors" />
                      <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">{c}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeUp>
          </div>
        </Section>
      )}

      {/* ══ PRODUCT SHOWCASE ════════════════════════════════════════ */}
      <ProductShowcase />

      {/* ══ LIVE STATS ══════════════════════════════════════════════ */}
      <Section id="stats">
        <div className="mx-auto max-w-5xl px-6">
          <FadeUp>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-[rgb(var(--sci))]/10" />
              <span className="text-[9px] font-semibold tracking-wide text-[var(--sci-fg)]/60">Live Platform Stats</span>
              <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                className="h-1.5 w-1.5 bg-[var(--sci-fg)]" />
              <div className="h-px flex-1 bg-[rgb(var(--sci))]/10" />
            </div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className="flex border border-[rgb(var(--sci))]/10 bg-[rgb(var(--sci))]/2">
              {STAT_META.map(s => <StatItem key={s.key} s={s} loaded={loaded} stats={stats} />)}
            </motion.div>
          </FadeUp>
        </div>
      </Section>

      {/* ══ AI FEATURES ═════════════════════════════════════════════ */}
      <Section>
        <div className="mx-auto max-w-5xl px-6">
          <FadeUp>
            <TermLabel>Powered by AI</TermLabel>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-3">
              Make It Feel Like<br />an AI Product
            </h2>
            <p className="text-muted-foreground text-sm mb-10">Every feature runs on verified data — not guesswork, not keywords.</p>
          </FadeUp>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="flex gap-4">
            {[
              { icon: Brain,      label: "AI Candidate\nMatching",   color: "text-violet-400",  border: "border-violet-500/20",  glow: "hover:border-violet-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]", tag: "Matching",       desc: "Neural networks scanning 50M+ data points to find your exact technical match." },
              { icon: FileText,   label: "AI Resume\nVerification",  color: "text-blue-400",    border: "border-blue-500/20",    glow: "hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",    tag: "Authenticating", desc: "Zero trust verification against real-world commits and problem solving logs." },
              { icon: Target,     label: "AI Skill Gap\nAnalysis",   color: "text-cyan-400",    border: "border-cyan-500/20",    glow: "hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(var(--sci),0.15)]",      tag: "Mapping Gaps",   desc: "Identifying missing competencies using vector-space proficiency mapping." },
              { icon: TrendingUp, label: "AI Placement\nInsights",   color: "text-emerald-400", border: "border-emerald-500/20", glow: "hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",  tag: "Predicting",     desc: "Predicting hiring velocity and offer probability with 95% accuracy." },
            ].map(({ icon: Icon, label, color, border, glow, tag, desc }, i) => (
              <motion.div key={label} variants={fadeUp}
                whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
                className={`flex-1 border ${border} bg-white/2 backdrop-blur-sm p-5 transition-all duration-300 cursor-default ${glow} group`}>
                {/* icon */}
                <div className={`w-10 h-10 border ${border} bg-white/3 flex items-center justify-center mb-5`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                {/* title */}
                <h3 className={`text-sm font-bold text-foreground leading-tight mb-3 whitespace-pre-line`}>{label}</h3>
                {/* desc */}
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-5">{desc}</p>
                {/* tag */}
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-1.5 text-xs font-semibold ${color}`}>
                    <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                      className="h-1.5 w-1.5 rounded-full bg-current" />
                    {tag}
                  </div>
                  <ArrowRight className={`h-3.5 w-3.5 ${color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ══ FEATURES ════════════════════════════════════════════════ */}
      <Section id="features">
        <div className="mx-auto max-w-5xl px-6">
          <FadeUp>
            <TermLabel>Features</TermLabel>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-8">
              Built for{" "}
              <AnimatePresence mode="wait">
                <motion.span key={activeTab}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`inline-block ${FEATURES[activeTab].accent}`}>
                  {FEATURES[activeTab].role}
                </motion.span>
              </AnimatePresence>
            </h2>
          </FadeUp>

          {/* tab switcher */}
          <FadeUp delay={0.05}>
            <div className="flex gap-0 mb-8 border border-[rgb(var(--sci))]/10">
              {FEATURES.map((tab, i) => {
                const Icon = tab.icon
                const active = activeTab === i
                return (
                  <motion.button key={tab.role} onClick={() => setActiveTab(i)}
                    whileHover={{ backgroundColor: "rgba(var(--sci),0.05)" }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold tracking-wide transition-all border-r border-[rgb(var(--sci))]/10 last:border-r-0
                      ${active ? `bg-[rgb(var(--sci))]/8 ${tab.accent} border-b-2 border-b-current` : "text-zinc-600 hover:text-foreground/80"}`}>
                    <Icon className="h-4 w-4" />{tab.role}
                  </motion.button>
                )
              })}
            </div>
          </FadeUp>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}>
              {/* intro */}
              <div className={`flex items-center gap-4 border ${FEATURES[activeTab].border} ${FEATURES[activeTab].bg} px-5 py-3 mb-4 rounded-xl`}>
                {(() => { const Icon = FEATURES[activeTab].icon; return <Icon className={`h-4 w-4 ${FEATURES[activeTab].accent} shrink-0`} /> })()}
                <span className={`text-sm font-medium ${FEATURES[activeTab].accent}`}>{FEATURES[activeTab].desc}</span>
              </div>
              {/* items */}
              <div className="space-y-2">
                {FEATURES[activeTab].items.map((f, i) => {
                  const FIcon = f.icon
                  const tab   = FEATURES[activeTab]
                  return (
                    <motion.div key={f.title}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ x: 6, backgroundColor: "rgba(var(--sci),0.02)" }}
                      className={`flex items-center gap-4 border border-border/60 px-5 py-3.5 cursor-default transition-all hover:border-[rgb(var(--sci))]/20 group`}>
                      <div className={`w-8 h-8 ${tab.bg} flex items-center justify-center border ${tab.border} shrink-0`}>
                        <FIcon className={`h-3.5 w-3.5 ${tab.accent}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-foreground">{f.title}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{f.sub}</p>
                      </div>
                      <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        className={`h-1.5 w-1.5 shrink-0 ${tab.accent.replace("text-","bg-")}`} />
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Section>

      {/* ══ PLATFORMS ═══════════════════════════════════════════════ */}
      <Section id="platforms">
        <div className="mx-auto max-w-5xl px-6">
          <FadeUp>
            <div className="text-center mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-2">Integrations</p>
              <h2 className="text-3xl font-black text-foreground tracking-tight">8 Platforms. One Profile.</h2>
              <p className="mt-2 text-muted-foreground text-sm">Live data pulled directly — always accurate, never self-reported.</p>
            </div>
          </FadeUp>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="flex gap-3">
            {PLATFORMS.map((p) => (
              <motion.div key={p.name} variants={fadeUp}
                whileHover={{ scale: 1.06, y: -6, transition: { type: "spring", stiffness: 400, damping: 15 } }}
                whileTap={{ scale: 0.96 }}
                className={`flex-1 flex flex-col items-center justify-center gap-2.5 py-5 px-2 rounded-2xl border border-border bg-card hover:bg-muted/20 hover:border-white/15 cursor-pointer group transition-colors`}>
                <div className={`w-10 h-10 rounded-xl ${p.bg} flex items-center justify-center mx-auto`}>
                  <p.icon className={`h-5 w-5 ${p.color}`} />
                </div>
                <p className={`text-[11px] font-bold ${p.color} leading-tight text-center`}>{p.name}</p>
                <p className="text-[9px] text-muted-foreground/60 leading-tight text-center">{p.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ══ TESTIMONIALS ════════════════════════════════════════════ */}
      {testimonials.length > 0 && (
        <Section>
          <div className="mx-auto max-w-5xl px-6">
            <FadeUp>
              <TermLabel>Testimonials</TermLabel>
              <h2 className="text-3xl font-black text-white tracking-tight mb-8">Signal from the Network</h2>
            </FadeUp>
            <div className="space-y-3">
              {testimonials.map((t: any, i: number) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ x: 4, borderColor: "rgba(var(--sci),0.2)" }}
                  className="border border-border bg-white/2 px-6 py-5 flex items-start gap-4 transition-all">
                  <div className="w-10 h-10 border border-[rgb(var(--sci))]/20 bg-[rgb(var(--sci))]/5 flex items-center justify-center text-[var(--sci-fg)] text-sm font-bold shrink-0">
                    {t.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground/80 leading-relaxed mb-2">"{t.text}"</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-foreground">{t.name}</span>
                      <span className="text-[10px] text-muted-foreground/70">// {t.role}</span>
                      <div className="flex gap-0.5 ml-auto">
                        {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ══ BLOG ════════════════════════════════════════════════════ */}
      <Section>
        <div className="mx-auto max-w-5xl px-6">
          <FadeUp>
            <div className="flex items-end justify-between mb-8">
              <div>
                <TermLabel>Blog</TermLabel>
                <h2 className="text-3xl font-black text-foreground tracking-tight">Latest Insights</h2>
              </div>
              <motion.div whileHover={{ x: 4 }}>
                <Link href="/blog" className="text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1 text-sm font-semibold">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            </div>
          </FadeUp>
          <div className="space-y-3">
            {RECENT_POSTS.map((post, i) => (
              <motion.div key={post.slug}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ x: 6 }}>
                <Link href={`/blog/${post.slug}`}>
                  <div className="flex items-center gap-4 border border-border bg-card hover:bg-violet-500/5 hover:border-violet-500/30 transition-all px-5 py-4 cursor-pointer group rounded-xl">
                    <span className={`text-[10px] font-semibold border rounded-full px-2.5 py-0.5 shrink-0 ${post.tagColor} border-current/30`}>{post.tag}</span>
                    <p className="flex-1 text-sm font-bold text-foreground/80 group-hover:text-foreground transition-colors truncate">{post.title}</p>
                    <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">{post.date}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-violet-400 transition-colors shrink-0" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ══ CTA ═════════════════════════════════════════════════════ */}
      <Section>
        <div className="mx-auto max-w-5xl px-6">
          <FadeUp>
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3">Get Started</p>
              <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight mb-3">
                Skills First.<br />
                <span className="gradient-text">Hire Better.</span>
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto text-sm">
                Join students, colleges, and companies already using CodeHiring.
              </p>
              {openCareers > 0 && (
                <motion.div whileHover={{ x: 3 }} className="inline-block mt-4">
                  <Link href="/careers" className="text-violet-400 hover:text-violet-300 transition-colors text-sm flex items-center gap-1.5">
                    We're hiring — {openCareers} open role{openCareers > 1 ? "s" : ""} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </motion.div>
              )}
            </div>
          </FadeUp>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="flex gap-4">
            {[
              { icon: GraduationCap, title: "I'm a Student",   href: "/signup?role=student",   spotlight: "rgba(167,139,250,0.15)", accent: "border-violet-500/30 hover:bg-violet-500/8",   iconBg: "bg-violet-500/15",  iconColor: "text-violet-400",  desc: "Build verified profile, get matched to jobs." },
              { icon: Award,         title: "I'm a Graduate",  href: "/signup?role=graduate",  spotlight: "rgba(99,102,241,0.15)",  accent: "border-indigo-500/30 hover:bg-indigo-500/8",   iconBg: "bg-indigo-500/15",  iconColor: "text-indigo-400",  desc: "Showcase skills, get hired without college code." },
              { icon: Building2,     title: "I'm from College",href: "/signup?role=college",   spotlight: "rgba(52,211,153,0.15)",  accent: "border-emerald-500/30 hover:bg-emerald-500/8", iconBg: "bg-emerald-500/15", iconColor: "text-emerald-400", desc: "Track placements, manage student performance." },
              { icon: Briefcase,     title: "I'm a Recruiter", href: "/signup?role=recruiter", spotlight: "rgba(251,191,36,0.15)",  accent: "border-amber-500/30 hover:bg-amber-500/8",    iconBg: "bg-amber-500/15",   iconColor: "text-amber-400",   desc: "Find verified talent with AI-powered matching." },
            ].map((r) => (
              <motion.div key={r.title} variants={fadeUp}
                whileHover={{ y: -6, scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
                whileTap={{ scale: 0.97 }}
                className="flex-1">
                <Link href={r.href}>
                  <div className={`rounded-2xl border bg-card cursor-pointer transition-all h-full p-5 flex flex-col gap-4 group ${r.accent}`}>
                    <motion.div whileHover={{ rotate: 8, scale: 1.1 }}
                      className={`w-10 h-10 rounded-xl ${r.iconBg} flex items-center justify-center`}>
                      <r.icon className={`h-5 w-5 ${r.iconColor}`} />
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground group-hover:text-violet-300 transition-colors mb-1">{r.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground group-hover:text-violet-400 transition-colors">
                      Get started <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>
    </div>
  )
}





