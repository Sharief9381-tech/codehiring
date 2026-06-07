"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { SpotlightCard } from "@/components/landing/spotlight-card"
import {
  ArrowRight, Sparkles, ChevronDown,
  GraduationCap, Building2, Briefcase, Award,
  BarChart3, Users, Brain, Trophy, FileText, Target, GitBranch, ShieldCheck, Zap,
  Code2, Github, Terminal, Braces, Hash, FileCode, BookOpen, Cpu,
  Star, Quote, CheckCircle2, TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { blogPosts } from "@/lib/blog-posts"

const RECENT_POSTS = blogPosts.slice(0, 3).map(({ slug, title, tag, tagColor, date, readTime, excerpt }) => ({
  slug, title, tag, tagColor, date, readTime, excerpt,
}))

// ─── Animation variants ──────────────────────────────────────────
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }
const stagger = { visible: { transition: { staggerChildren: 0.08 } } }

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"}
      variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: "easeOut" } } }}
      className={className}>
      {children}
    </motion.div>
  )
}

// ─── Counter animation ───────────────────────────────────────────
function useCountUp(target: number, duration = 1600) {
  const [value, setValue] = useState(0)
  const raf = useRef<number | null>(null)
  useEffect(() => {
    if (target === 0) { setValue(0); return }
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [target, duration])
  return value
}

function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K+`
  return n > 0 ? `${n}+` : "0"
}

// ─── Static config ───────────────────────────────────────────────
const PLATFORMS = [
  { name: "LeetCode", icon: Code2, color: "text-amber-400", bg: "bg-amber-400/10", desc: "Problems & contests", spotlight: "rgba(251,191,36,0.15)" },
  { name: "GitHub", icon: Github, color: "text-slate-300", bg: "bg-slate-300/10", desc: "Contributions & repos", spotlight: "rgba(148,163,184,0.12)" },
  { name: "Codeforces", icon: Hash, color: "text-cyan-400", bg: "bg-cyan-400/10", desc: "Ratings & contests", spotlight: "rgba(34,211,238,0.15)" },
  { name: "CodeChef", icon: Braces, color: "text-rose-400", bg: "bg-rose-400/10", desc: "Ratings & problems", spotlight: "rgba(251,113,133,0.15)" },
  { name: "HackerRank", icon: Terminal, color: "text-violet-400", bg: "bg-violet-400/10", desc: "Badges & certs", spotlight: "rgba(167,139,250,0.15)" },
  { name: "GeeksforGeeks", icon: FileCode, color: "text-emerald-400", bg: "bg-emerald-400/10", desc: "Problems & courses", spotlight: "rgba(52,211,153,0.15)" },
  { name: "HackerEarth", icon: Cpu, color: "text-indigo-400", bg: "bg-indigo-400/10", desc: "Challenges", spotlight: "rgba(129,140,248,0.15)" },
  { name: "AtCoder", icon: BookOpen, color: "text-purple-400", bg: "bg-purple-400/10", desc: "Competitive", spotlight: "rgba(192,132,252,0.15)" },
]

const AI_FEATURES = [
  { icon: Brain, label: "AI Candidate Matching", color: "text-violet-400", bg: "bg-violet-400/10" },
  { icon: FileText, label: "AI Resume Verification", color: "text-blue-400", bg: "bg-blue-400/10" },
  { icon: Target, label: "AI Skill Gap Analysis", color: "text-cyan-400", bg: "bg-cyan-400/10" },
  { icon: TrendingUp, label: "AI Placement Insights", color: "text-emerald-400", bg: "bg-emerald-400/10" },
]

const FEATURES = [
  {
    role: "Students", icon: GraduationCap, accent: "text-violet-400", bgAccent: "bg-violet-400/10",
    spotlight: "rgba(167,139,250,0.12)", border: "hover:border-violet-500/40",
    description: "Track every platform. Build a verified profile. Land your dream job.",
    features: [
      { icon: BarChart3, title: "Unified Dashboard", desc: "All platform stats in one verified profile." },
      { icon: Trophy, title: "CodeHiring Score", desc: "Normalized 0–1000 score across platforms." },
      { icon: FileText, title: "AI Resume", desc: "Auto-generate verified resume with real data." },
      { icon: Target, title: "AI Job Match", desc: "Personalized jobs based on your actual profile." },
      { icon: GitBranch, title: "GitHub Insights", desc: "Contributions and repos tracked automatically." },
      { icon: Zap, title: "Skill Gaps", desc: "AI-identified gaps with curated resources." },
    ],
  },
  {
    role: "Colleges", icon: Building2, accent: "text-emerald-400", bgAccent: "bg-emerald-400/10",
    spotlight: "rgba(52,211,153,0.12)", border: "hover:border-emerald-500/40",
    description: "Monitor batches. Drive placements. Prove your college's value.",
    features: [
      { icon: Users, title: "Batch Tracking", desc: "Real-time activity across all batches." },
      { icon: BarChart3, title: "Placement Analytics", desc: "Data-driven insights to improve rates." },
      { icon: Trophy, title: "Leaderboards", desc: "Competitive leaderboards with badges." },
      { icon: ShieldCheck, title: "Access Control", desc: "Control which recruiters see your data." },
      { icon: FileText, title: "Reports", desc: "One-click reports for NAAC and management." },
      { icon: Briefcase, title: "Drive Management", desc: "End-to-end campus drive management." },
    ],
  },
  {
    role: "Recruiters", icon: Briefcase, accent: "text-amber-400", bgAccent: "bg-amber-400/10",
    spotlight: "rgba(251,191,36,0.12)", border: "hover:border-amber-500/40",
    description: "Skip keyword matching. Hire on verified coding performance.",
    features: [
      { icon: Brain, title: "AI Talent Matching", desc: "Verified skills, not self-reported claims." },
      { icon: Target, title: "Advanced Filters", desc: "Filter by ratings, ranks, GitHub activity." },
      { icon: Users, title: "Bulk Outreach", desc: "Smart automation for shortlisting." },
      { icon: ShieldCheck, title: "Verified Profiles", desc: "Every stat pulled from the platform." },
      { icon: BarChart3, title: "Hiring Pipeline", desc: "Visual pipeline from screen to offer." },
      { icon: FileText, title: "AI Assessments", desc: "AI-powered coding assessments." },
    ],
  },
]

const STAT_META = [
  { key: "students", label: "Students", icon: GraduationCap, color: "text-violet-400" },
  { key: "colleges", label: "Colleges", icon: Building2, color: "text-emerald-400" },
  { key: "recruiters", label: "Companies", icon: Briefcase, color: "text-amber-400" },
  { key: "drives", label: "Hiring Drives", icon: Users, color: "text-cyan-400" },
  { key: "problemsSolved", label: "Problems Solved", icon: Code2, color: "text-rose-400" },
  { key: "applications", label: "Applications", icon: Trophy, color: "text-purple-400" },
]

const COLLEGES = ["IIT Bombay", "NIT Trichy", "VIT Vellore", "SRM Chennai", "RVR & JC", "BITS Pilani", "IIT Delhi", "IIIT Hyderabad"]

// ─── Dashboard mock preview ──────────────────────────────────────
function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, rotateY: -8 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      className="relative w-full max-w-lg mx-auto"
      style={{ perspective: "1000px" }}
    >
      {/* Glow behind */}
      <div className="absolute inset-0 bg-violet-500/20 blur-3xl rounded-3xl" />

      <div className="relative rounded-2xl border border-white/10 bg-[#18181B] shadow-2xl overflow-hidden">
        {/* Titlebar */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8 bg-[#09090B]/50">
          <div className="h-3 w-3 rounded-full bg-red-500/70" />
          <div className="h-3 w-3 rounded-full bg-amber-500/70" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
          <span className="ml-3 text-xs text-zinc-500">CodeHiring — Student Dashboard</span>
        </div>
        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Score row */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500">CodeHiring Score</p>
              <p className="text-3xl font-black text-white tabular-nums">742<span className="text-lg text-zinc-500">/1000</span></p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/20 border border-violet-500/30">
              <Sparkles className="h-6 w-6 text-violet-400" />
            </div>
          </div>
          {/* Platform cards */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { name: "LeetCode", val: "442", sub: "solved", color: "text-amber-400" },
              { name: "Codeforces", val: "1654", sub: "rating", color: "text-cyan-400" },
              { name: "GitHub", val: "89", sub: "repos", color: "text-slate-300" },
            ].map((p) => (
              <div key={p.name} className="rounded-xl bg-[#09090B]/60 border border-white/6 p-2.5 text-center">
                <p className={`text-sm font-bold ${p.color} tabular-nums`}>{p.val}</p>
                <p className="text-[10px] text-zinc-600 mt-0.5">{p.sub}</p>
                <p className="text-[9px] text-zinc-700">{p.name}</p>
              </div>
            ))}
          </div>
          {/* Progress bars */}
          <div className="space-y-2">
            {[
              { label: "Placement Ready", val: 78, color: "bg-violet-500" },
              { label: "Profile Complete", val: 92, color: "bg-emerald-500" },
            ].map((b) => (
              <div key={b.label}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-zinc-500">{b.label}</span>
                  <span className="text-zinc-400 font-semibold">{b.val}%</span>
                </div>
                <div className="h-1 rounded-full bg-white/8">
                  <div className={`h-full rounded-full ${b.color}`} style={{ width: `${b.val}%` }} />
                </div>
              </div>
            ))}
          </div>
          {/* Job matches */}
          <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 p-3">
            <p className="text-xs font-semibold text-violet-300 mb-1">🎯 3 new job matches</p>
            <p className="text-[10px] text-zinc-500">Based on your verified coding profile</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────
export function LandingPage() {
  const [data, setData] = useState<any>(null)
  const [loaded, setLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    fetch("/api/landing").then((r) => r.json()).then((d) => { setData(d); setLoaded(true) }).catch(() => setLoaded(true))
  }, [])

  const stats = data?.stats ?? {}
  const testimonials = data?.siteConfig?.testimonials ?? []
  const openCareers = data?.openCareers ?? 0

  return (
    <>
      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(139,92,246,0.25),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,rgba(59,130,246,0.1),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative mx-auto max-w-7xl w-full">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left */}
            <div>
              {/* AI badge */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="inline-flex items-center gap-2 ai-badge rounded-full px-4 py-1.5 text-xs font-semibold text-violet-300 mb-6">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI-Powered Skills-First Recruitment
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
                Find Talent.<br />
                <span className="gradient-text">Based on Skills,</span><br />
                Not Resumes.
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-zinc-400 max-w-xl leading-relaxed mb-8">
                Track coding performance across platforms, discover top talent, and hire with confidence — all backed by verified real-time data.
              </motion.p>

              {/* CTAs */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-3">
                <Link href="/signup?role=student">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button size="lg" className="gap-2 bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/30 border-0">
                      Get Started Free <ArrowRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/login">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button size="lg" variant="outline" className="border-white/15 text-zinc-300 hover:text-white hover:bg-white/8">
                      Sign In
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Mini stats */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="flex items-center gap-6 mt-10 pt-8 border-t border-white/8">
                {[
                  { label: "Students", val: stats.students },
                  { label: "Colleges", val: stats.colleges },
                  { label: "Companies", val: stats.recruiters },
                ].map(({ label, val }) => {
                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  const count = useCountUp(loaded ? (val ?? 0) : 0)
                  return (
                    <div key={label}>
                      <p className="text-2xl font-black text-white tabular-nums">
                        {loaded ? (val ? formatNum(count) : "—") : "—"}
                      </p>
                      <p className="text-xs text-zinc-500">{label}</p>
                    </div>
                  )
                })}
              </motion.div>
            </div>

            {/* Right — Dashboard preview */}
            <div className="hidden lg:block">
              <DashboardPreview />
            </div>
          </div>
        </div>

        <a href="#stats" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-zinc-700 hover:text-zinc-400 transition-colors animate-bounce">
          <ChevronDown className="h-6 w-6" />
        </a>
      </section>

      {/* ══ TRUSTED BY ════════════════════════════════════════════ */}
      <FadeUp>
        <section className="py-10 border-y border-white/6 bg-[#0D0D10]/50">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-6">
              Trusted by Students from
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {COLLEGES.map((c) => (
                <motion.span key={c} whileHover={{ color: "#fff" }}
                  className="text-sm font-semibold text-zinc-600 cursor-default transition-colors">
                  {c}
                </motion.span>
              ))}
            </div>
          </div>
        </section>
      </FadeUp>

      {/* ══ "SEE IT IN ACTION" SCREENSHOTS ═══════════════════════ */}
      <section className="py-20 border-b border-white/6 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <FadeUp>
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3">Product</p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{color:"#f4f4f5"}}>
                See CodeHiring in Action
              </h2>
              <p className="text-zinc-400">Real dashboards. Real data. Real results.</p>
            </div>
          </FadeUp>

          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Student Dashboard",
                desc: "Track all platforms in one place",
                color: "from-violet-500/20 to-purple-600/5",
                border: "border-violet-500/20",
                accent: "text-violet-400",
                delay: 0,
                preview: (
                  <div className="space-y-3 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-zinc-500">CodeHiring Score</p>
                        <p className="text-2xl font-black text-white">742<span className="text-sm text-zinc-600">/1000</span></p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 border border-violet-500/30">
                        <Sparkles className="h-5 w-5 text-violet-400" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[["LeetCode","442","solved","text-amber-400"],["Codeforces","1654","rating","text-cyan-400"],["GitHub","89","repos","text-slate-300"]].map(([n,v,s,c]) => (
                        <div key={n} className="rounded-lg bg-white/4 border border-white/6 p-2 text-center">
                          <p className={`text-xs font-bold tabular-nums ${c}`}>{v}</p>
                          <p className="text-[8px] text-zinc-600">{s}</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1.5">
                      {[["Placement Ready","78","bg-violet-500"],["Profile Complete","92","bg-emerald-500"]].map(([l,v,c]) => (
                        <div key={l}>
                          <div className="flex justify-between text-[9px] mb-1"><span className="text-zinc-500">{l}</span><span className="text-zinc-400">{v}%</span></div>
                          <div className="h-1 rounded-full bg-white/6"><div className={`h-full rounded-full ${c}`} style={{width:`${v}%`}} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              },
              {
                title: "Recruiter Dashboard",
                desc: "AI-matched candidates ranked by skill",
                color: "from-amber-500/15 to-orange-600/5",
                border: "border-amber-500/20",
                accent: "text-amber-400",
                delay: 0.1,
                preview: (
                  <div className="space-y-2 p-4">
                    <div className="grid grid-cols-2 gap-2">
                      {[["Active Jobs","4","text-violet-400"],["Applications","127","text-blue-400"],["Shortlisted","23","text-amber-400"],["Interviewed","8","text-emerald-400"]].map(([l,v,c]) => (
                        <div key={l} className="rounded-lg bg-white/4 border border-white/6 p-2">
                          <p className={`text-lg font-black tabular-nums ${c}`}>{v}</p>
                          <p className="text-[9px] text-zinc-600">{l}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-lg bg-amber-500/8 border border-amber-500/20 p-2.5">
                      <p className="text-[10px] font-semibold text-amber-400 mb-1.5">🤖 Top AI Matches</p>
                      {[["Arjun S.","95%","442 solved"],["Priya K.","91%","380 solved"],["Rahul M.","88%","320 solved"]].map(([n,s,p]) => (
                        <div key={n} className="flex items-center justify-between text-[9px] mb-1">
                          <span className="text-zinc-400">{n}</span>
                          <span className="text-emerald-400 font-bold">{s}</span>
                          <span className="text-zinc-600">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              },
              {
                title: "College Analytics",
                desc: "Real-time placement tracking",
                color: "from-emerald-500/15 to-teal-600/5",
                border: "border-emerald-500/20",
                accent: "text-emerald-400",
                delay: 0.2,
                preview: (
                  <div className="space-y-2.5 p-4">
                    <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-center">
                      <p className="text-2xl font-black text-emerald-400">78%</p>
                      <p className="text-[9px] text-zinc-500">Placement Rate</p>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[["Placed","234","text-emerald-400"],["Interviewing","45","text-amber-400"],["Searching","67","text-blue-400"],["Total","346","text-zinc-400"]].map(([l,v,c]) => (
                        <div key={l} className="rounded-lg bg-white/4 border border-white/6 p-2">
                          <p className={`text-sm font-bold tabular-nums ${c}`}>{v}</p>
                          <p className="text-[8px] text-zinc-600">{l}</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1">
                      {[["CSE","92%","bg-violet-500"],["IT","85%","bg-blue-500"],["ECE","71%","bg-amber-500"]].map(([d,r,c]) => (
                        <div key={d} className="flex items-center gap-2">
                          <span className="text-[9px] text-zinc-500 w-8">{d}</span>
                          <div className="flex-1 h-1 rounded-full bg-white/6">
                            <div className={`h-full rounded-full ${c}`} style={{width:r}} />
                          </div>
                          <span className="text-[9px] text-zinc-400 w-7 text-right">{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              },
            ].map((screen) => (
              <FadeUp key={screen.title} delay={screen.delay}>
                <motion.div whileHover={{ y: -4, scale: 1.01 }} className="rounded-2xl border bg-[#18181B] overflow-hidden cursor-pointer group" style={{ borderColor: screen.border.replace("border-","") }}>
                  {/* Header */}
                  <div className={`bg-gradient-to-r ${screen.color} border-b border-white/6 px-4 py-3`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="h-2 w-2 rounded-full bg-red-500/60" />
                      <div className="h-2 w-2 rounded-full bg-amber-500/60" />
                      <div className="h-2 w-2 rounded-full bg-emerald-500/60" />
                      <span className="ml-2 text-[10px] text-zinc-500">codehiring.io</span>
                    </div>
                    <p className={`text-sm font-bold ${screen.accent}`}>{screen.title}</p>
                    <p className="text-[10px] text-zinc-600">{screen.desc}</p>
                  </div>
                  {/* Preview */}
                  {screen.preview}
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
      <section id="stats" className="py-16 border-b border-white/6 bg-[#09090B]">
        <div className="mx-auto max-w-7xl px-6">
          <FadeUp>
            <div className="flex justify-center mb-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-400">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
                Live Platform Stats
              </span>
            </div>
          </FadeUp>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {STAT_META.map((s) => {
              const val = stats[s.key] ?? 0
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const count = useCountUp(loaded ? val : 0)
              const Icon = s.icon
              return (
                <motion.div key={s.key} variants={fadeUp}
                  whileHover={{ y: -3, scale: 1.03, boxShadow: "0 12px 40px rgba(139,92,246,0.2)" }}
                  className="group flex flex-col items-center text-center gap-2 rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm p-5 cursor-default transition-all">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors`}>
                    <Icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <p className={`text-2xl font-black tabular-nums ${s.color}`}>
                    {loaded ? formatNum(count) : "—"}
                  </p>
                  <p className="text-xs text-zinc-500">{s.label}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ══ AI FEATURES ═══════════════════════════════════════════ */}
      <FadeUp>
        <section className="py-16 border-b border-white/6 bg-[#09090B]">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 ai-badge rounded-full px-4 py-1.5 text-xs font-semibold text-violet-300 mb-4">
                <Brain className="h-3.5 w-3.5" /> Powered by AI
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">Make It Feel Like an AI Product</h2>            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {AI_FEATURES.map(({ icon: Icon, label, color, bg }) => (
                <motion.div key={label} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}
                  className="relative rounded-2xl border border-violet-500/20 bg-[#1a1a2e] p-5 overflow-hidden cursor-pointer group">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} mb-4`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <p className="text-sm font-bold leading-tight" style={{color:'#f4f4f5'}}>{label}</p>
                  <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-violet-300 border border-violet-500/40 bg-violet-500/15 rounded-full px-2 py-0.5">
                    <Sparkles className="h-2.5 w-2.5" /> AI
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </FadeUp>

      {/* ══ FEATURES (TABBED) ═════════════════════════════════════ */}
      <section id="features" className="py-20 border-b border-white/6 bg-[#09090B]">
        <div className="mx-auto max-w-7xl px-6">
          <FadeUp>
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3">Features</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Built for Every Role</h2>
              <p className="mt-3 text-zinc-400 max-w-xl mx-auto">Student, college, or recruiter — CodeHiring has the tools you need.</p>
            </div>
          </FadeUp>

          {/* Tab switcher */}
          <FadeUp delay={0.1}>
            <div className="flex items-center justify-center gap-2 mb-10">
              {FEATURES.map((tab, i) => {
                const Icon = tab.icon
                return (
                  <motion.button key={tab.role} onClick={() => setActiveTab(i)}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === i
                        ? `${tab.bgAccent} ${tab.accent} border border-current/30`
                        : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                    }`}>
                    <Icon className="h-4 w-4" />{tab.role}
                  </motion.button>
                )
              })}
            </div>
          </FadeUp>

          {/* Feature grid */}
          <motion.div key={activeTab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES[activeTab].features.map((f, i) => {
              const FIcon = f.icon
              const tab = FEATURES[activeTab]
              return (
                <motion.div key={i} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <SpotlightCard spotlightColor={tab.spotlight} className={`p-6 ${tab.border} transition-all cursor-pointer h-full`}>
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${tab.bgAccent} mb-4`}>
                      <FIcon className={`h-4 w-4 ${tab.accent}`} />
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1.5">{f.title}</h4>
                    <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
                  </SpotlightCard>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ══ PLATFORMS ═════════════════════════════════════════════ */}
      <section id="platforms" className="py-20 border-b border-white/6 bg-[#09090B]">
        <div className="mx-auto max-w-7xl px-6">
          <FadeUp>
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3">Integrations</p>
              <h2 className="text-3xl font-black text-white tracking-tight">All Major Platforms, One Profile</h2>
              <p className="mt-3 text-zinc-400">Live data pulled directly — always accurate, never self-reported.</p>
            </div>
          </FadeUp>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {PLATFORMS.map((p) => (
              <motion.div key={p.name} variants={fadeUp} whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.97 }}>
                <SpotlightCard spotlightColor={p.spotlight} className="flex flex-col items-center gap-3 p-4 text-center cursor-pointer group">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${p.bg}`}>
                    <p.icon className={`h-5 w-5 ${p.color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white group-hover:text-violet-300 transition-colors">{p.name}</p>
                    <p className="text-[9px] text-zinc-600 mt-0.5">{p.desc}</p>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══════════════════════════════════════════ */}
      {testimonials.length > 0 && (
        <section className="py-20 border-b border-white/6 bg-[#09090B]">
          <div className="mx-auto max-w-6xl px-6">
            <FadeUp className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3">Testimonials</p>
              <h2 className="text-3xl font-black text-white tracking-tight">What People Are Saying</h2>
            </FadeUp>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t: any, i: number) => (
                <motion.div key={i} variants={fadeUp} whileHover={{ y: -2 }}
                  className="rounded-2xl border border-white/8 bg-[#18181B] p-6">
                  <Quote className="h-5 w-5 text-violet-500/40 mb-4" />
                  <p className="text-sm text-zinc-400 leading-relaxed mb-5 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/6">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-zinc-500">{t.role}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ══ BLOG ══════════════════════════════════════════════════ */}
      <section className="py-20 border-b border-white/6 bg-[#09090B]">
        <div className="mx-auto max-w-6xl px-6">
          <FadeUp>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-2">Blog</p>
                <h2 className="text-2xl font-black text-white tracking-tight">Latest Insights</h2>
              </div>
              <Link href="/blog" className="text-sm text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </FadeUp>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid gap-4 sm:grid-cols-3">
            {RECENT_POSTS.map((post) => (
              <motion.div key={post.slug} variants={fadeUp} whileHover={{ y: -3, scale: 1.01 }}>
                <Link href={`/blog/${post.slug}`}>
                  <SpotlightCard spotlightColor="rgba(139,92,246,0.12)" className="h-full cursor-pointer hover:border-violet-500/30">
                    <div className="group p-6 flex flex-col h-full">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium mb-3 w-fit ${post.tagColor}`}>{post.tag}</span>
                      <h3 className="font-semibold text-white mb-2 leading-snug group-hover:text-violet-300 transition-colors">{post.title}</h3>
                      <p className="text-sm text-zinc-500 flex-1 mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-white/6">
                        <span className="text-xs text-zinc-600">{post.date} · {post.readTime}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-zinc-600 group-hover:text-violet-400 transition-colors" />
                      </div>
                    </div>
                  </SpotlightCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-[#09090B]">
        <div className="mx-auto max-w-5xl">
          <FadeUp>
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3">Get Started</p>
              <h2 className="text-4xl font-black text-white tracking-tight mb-4">
                Skills First.<br /><span className="gradient-text">Hire Better.</span>
              </h2>
              <p className="text-zinc-400 max-w-lg mx-auto">
                Join students, colleges, and companies already using CodeHiring to make smarter, data-driven decisions.
              </p>
              {openCareers > 0 && (
                <Link href="/careers" className="inline-flex items-center gap-1.5 text-sm text-violet-400 hover:underline mt-3">
                  We're hiring — {openCareers} open role{openCareers > 1 ? "s" : ""} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </FadeUp>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: GraduationCap, title: "I'm a Student", desc: "Build verified profile, get matched to jobs.", href: "/signup?role=student", spotlight: "rgba(167,139,250,0.15)", accent: "border-violet-500/30 hover:bg-violet-500/8", iconBg: "bg-violet-500/15", iconColor: "text-violet-400" },
              { icon: Award, title: "I'm a Graduate", desc: "Showcase skills, get hired without college code.", href: "/signup?role=graduate", spotlight: "rgba(99,102,241,0.15)", accent: "border-indigo-500/30 hover:bg-indigo-500/8", iconBg: "bg-indigo-500/15", iconColor: "text-indigo-400" },
              { icon: Building2, title: "I'm from College", desc: "Track placements, manage student performance.", href: "/signup?role=college", spotlight: "rgba(52,211,153,0.15)", accent: "border-emerald-500/30 hover:bg-emerald-500/8", iconBg: "bg-emerald-500/15", iconColor: "text-emerald-400" },
              { icon: Briefcase, title: "I'm a Recruiter", desc: "Find verified talent with AI-powered matching.", href: "/signup?role=recruiter", spotlight: "rgba(251,191,36,0.15)", accent: "border-amber-500/30 hover:bg-amber-500/8", iconBg: "bg-amber-500/15", iconColor: "text-amber-400" },
            ].map((r) => (
              <motion.div key={r.title} variants={fadeUp} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link href={r.href}>
                  <SpotlightCard spotlightColor={r.spotlight} className={`cursor-pointer transition-all ${r.accent} h-full`}>
                    <div className="group p-6 flex flex-col gap-4 h-full">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${r.iconBg}`}>
                        <r.icon className={`h-5 w-5 ${r.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1 group-hover:text-violet-300 transition-colors">{r.title}</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed">{r.desc}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-zinc-500 group-hover:text-violet-400 transition-colors">
                        Get started <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </SpotlightCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}
