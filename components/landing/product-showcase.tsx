"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion"
import {
  Code2, CheckCircle2, TrendingUp, Users, Calendar,
  Sparkles, Zap, ArrowRight, Trophy, Star, Github, GraduationCap,
} from "lucide-react"

// ─── Step definitions ─────────────────────────────────────────────────────────
const STEPS = [
  {
    id: "solve",
    tag: "01 / Student",
    headline: "Student solves a problem",
    sub: "Every submission is tracked in real-time across LeetCode, Codeforces, GitHub and 8+ platforms simultaneously.",
    accent: "violet",
    icon: Code2,
    visual: <SolveVisual />,
  },
  {
    id: "score",
    tag: "02 / Platform",
    headline: "Skill score updates instantly",
    sub: "CodeHiring Score recalculates across difficulty, rating, streak and GitHub activity — a single verified number.",
    accent: "blue",
    icon: TrendingUp,
    visual: <ScoreVisual />,
  },
  {
    id: "college",
    tag: "03 / College",
    headline: "College tracks every placement",
    sub: "TPOs see real-time analytics — who's placed, who's interviewing, which branch is leading. No spreadsheets.",
    accent: "teal",
    icon: GraduationCap,
    visual: <CollegeVisual />,
  },
  {
    id: "discover",
    tag: "04 / Recruiter",
    headline: "Recruiter discovers the candidate",
    sub: "AI surfaces the candidate in ranked results. No keywords. No guessing. Pure verified performance data.",
    accent: "emerald",
    icon: Users,
    visual: <DiscoverVisual />,
  },
  {
    id: "hired",
    tag: "05 / Outcome",
    headline: "Interview scheduled",
    sub: "The loop closes in hours, not weeks. Skills-first hiring works because the data is already verified.",
    accent: "amber",
    icon: Calendar,
    visual: <HiredVisual />,
  },
]

const ACCENT: Record<string, { text: string; border: string; bg: string; glow: string; dot: string }> = {
  violet:  { text: "text-violet-400",  border: "border-violet-500/30",  bg: "bg-violet-500/8",   glow: "shadow-violet-500/20",  dot: "bg-violet-400" },
  blue:    { text: "text-blue-400",    border: "border-blue-500/30",    bg: "bg-blue-500/8",     glow: "shadow-blue-500/20",    dot: "bg-blue-400" },
  emerald: { text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/8",  glow: "shadow-emerald-500/20", dot: "bg-emerald-400" },
  teal:    { text: "text-teal-400",    border: "border-teal-500/30",    bg: "bg-teal-500/8",     glow: "shadow-teal-500/20",    dot: "bg-teal-400" },
  amber:   { text: "text-amber-400",   border: "border-amber-500/30",   bg: "bg-amber-500/8",    glow: "shadow-amber-500/20",   dot: "bg-amber-400" },
}

// ─── Visual components ────────────────────────────────────────────────────────
function SolveVisual() {
  const [solved, setSolved] = useState(441)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setActive(true), 600)
    const t2 = setTimeout(() => setSolved(442), 1200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className="w-full max-w-sm mx-auto space-y-3">
      {/* Terminal window */}
      <div className="rounded-2xl border border-white/8 bg-zinc-950 overflow-hidden shadow-2xl shadow-black/40">
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-black/30">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          <span className="ml-2 text-[10px] text-zinc-600 font-mono">two-sum.py</span>
        </div>
        <div className="p-4 font-mono text-[11px] leading-relaxed">
          <p className="text-zinc-600"># Two Sum — Medium</p>
          <p className="text-violet-300">def <span className="text-blue-300">twoSum</span><span className="text-zinc-400">(nums, target):</span></p>
          <p className="text-zinc-400 pl-4">seen = {"{}"}</p>
          <p className="text-zinc-400 pl-4"><span className="text-violet-300">for</span> i, n <span className="text-violet-300">in</span> <span className="text-blue-300">enumerate</span>(nums):</p>
          <p className="text-zinc-400 pl-8">diff = target - n</p>
          <p className="text-zinc-400 pl-8"><span className="text-violet-300">if</span> diff <span className="text-violet-300">in</span> seen:</p>
          <p className="text-emerald-400 pl-12"><span className="text-violet-300">return</span> [seen[diff], i]</p>
          <p className="text-zinc-400 pl-8">seen[n] = i</p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0 }} transition={{ duration: 0.3 }}
            className="mt-3 pt-3 border-t border-white/6 flex items-center gap-2">
            <span className="text-emerald-400">✓</span>
            <span className="text-emerald-400 font-semibold">Accepted</span>
            <span className="text-zinc-600 ml-auto">Runtime: 48ms</span>
          </motion.div>
        </div>
      </div>

      {/* Platform stat update */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: active ? 1 : 0, y: active ? 0 : 8 }} transition={{ duration: 0.4 }}
        className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/6 px-4 py-3">
        <span className="text-xl">⚡</span>
        <div>
          <p className="text-xs font-bold text-white">LeetCode synced</p>
          <p className="text-[10px] text-zinc-500">
            Problems: <span className="text-amber-400 font-bold">{solved}</span>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: solved > 441 ? 1 : 0 }} className="text-emerald-400 ml-1">+1</motion.span>
          </p>
        </div>
        <motion.div animate={{ scale: solved > 441 ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.4 }}>
          <CheckCircle2 className="h-4 w-4 text-emerald-400 ml-auto" />
        </motion.div>
      </motion.div>
    </div>
  )
}

function ScoreVisual() {
  const [score, setScore] = useState(738)
  const [rank, setRank] = useState("Top 12%")
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const t = setTimeout(() => { setScore(742); setRank("Top 11%") }, 800)
    return () => clearTimeout(t)
  }, [inView])

  return (
    <div ref={ref} className="w-full max-w-sm mx-auto space-y-3">
      {/* Score card */}
      <div className="rounded-2xl border border-violet-500/20 bg-card shadow-2xl shadow-violet-500/10 overflow-hidden">
        <div className="bg-gradient-to-r from-violet-500/15 to-blue-500/8 px-5 pt-5 pb-4">
          <p className="text-[10px] text-zinc-500 mb-1 uppercase tracking-widest">CodeHiring Score</p>
          <div className="flex items-end gap-3">
            <motion.span key={score} initial={{ scale: 1.2, color: "#a78bfa" }} animate={{ scale: 1, color: "#fff" }}
              transition={{ duration: 0.5 }}
              className="text-5xl font-black text-white tabular-nums">
              {score}
            </motion.span>
            <span className="text-xl text-zinc-600 mb-1">/1000</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <motion.span key={rank} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              className="text-xs font-bold text-violet-400 bg-violet-500/15 border border-violet-500/25 rounded-full px-2.5 py-0.5">
              {rank}
            </motion.span>
            <span className="text-[10px] text-zinc-600">globally</span>
          </div>
        </div>
        <div className="px-5 py-4 space-y-2.5">
          {[
            { label: "LeetCode",    val: 442, max: 600, color: "bg-amber-500" },
            { label: "Codeforces",  val: 1654, max: 3000, color: "bg-blue-500" },
            { label: "GitHub",      val: 89, max: 200, color: "bg-emerald-500" },
          ].map(({ label, val, max, color }) => (
            <div key={label}>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-zinc-500">{label}</span>
                <span className="text-zinc-400 font-semibold">{val.toLocaleString()}</span>
              </div>
              <div className="h-1 rounded-full bg-white/5">
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${(val / max) * 100}%` }}
                  viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }}
                  className={`h-full rounded-full ${color}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score badge */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-3 rounded-xl border border-blue-500/20 bg-blue-500/6 px-4 py-3">
        <Sparkles className="h-5 w-5 text-blue-400 shrink-0" />
        <div>
          <p className="text-xs font-bold text-white">Score recalculated</p>
          <p className="text-[10px] text-zinc-500">738 → <span className="text-blue-400 font-bold">742</span> · +4 points</p>
        </div>
        <TrendingUp className="h-4 w-4 text-emerald-400 ml-auto" />
      </motion.div>
    </div>
  )
}

function DiscoverVisual() {
  const candidates = [
    { name: "Arjun Sharma", score: 742, solved: 442, match: 97, college: "IIT Delhi", highlight: true },
    { name: "Priya Reddy",  score: 718, solved: 380, match: 91, college: "NIT Trichy", highlight: false },
    { name: "Rahul Kumar",  score: 695, solved: 320, match: 86, college: "BITS Pilani", highlight: false },
  ]

  return (
    <div className="w-full max-w-sm mx-auto space-y-2">
      <div className="rounded-2xl border border-amber-500/20 bg-card overflow-hidden shadow-2xl shadow-amber-500/10">
        <div className="bg-gradient-to-r from-amber-500/12 to-orange-500/5 px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-amber-400">🤖 AI Talent Match</p>
            <span className="text-[10px] text-zinc-600">SDE Intern · Backend</span>
          </div>
        </div>
        <div className="p-3 space-y-2">
          {candidates.map((c, i) => (
            <motion.div key={c.name}
              initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className={`rounded-xl px-3 py-2.5 border transition-all ${c.highlight
                ? "bg-violet-500/10 border-violet-500/30 shadow-sm shadow-violet-500/20"
                : "bg-white/3 border-white/6"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black
                    ${c.highlight ? "bg-violet-500/25 text-violet-300" : "bg-white/6 text-zinc-400"}`}>
                    {c.name[0]}
                  </div>
                  <div>
                    <p className={`text-[11px] font-bold ${c.highlight ? "text-white" : "text-zinc-300"}`}>{c.name}</p>
                    <p className="text-[9px] text-zinc-600">{c.college} · {c.solved} solved</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-black ${c.highlight ? "text-emerald-400" : "text-zinc-400"}`}>{c.match}%</p>
                  <p className="text-[9px] text-zinc-600">match</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/6 px-4 py-3">
        <Users className="h-4 w-4 text-emerald-400 shrink-0" />
        <div>
          <p className="text-xs font-bold text-white">Arjun Sharma shortlisted</p>
          <p className="text-[10px] text-zinc-500">97% match · Verified skills · No resume needed</p>
        </div>
      </motion.div>
    </div>
  )
}

function HiredVisual() {
  return (
    <div className="w-full max-w-sm mx-auto space-y-3">
      {/* Calendar invite */}
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="rounded-2xl border border-emerald-500/20 bg-card overflow-hidden shadow-2xl shadow-emerald-500/10">
        <div className="bg-gradient-to-r from-emerald-500/12 to-teal-500/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-400" />
            <p className="text-xs font-bold text-emerald-400">Interview Scheduled</p>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Trophy className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Technical Round — Arjun Sharma</p>
              <p className="text-xs text-zinc-500 mt-0.5">Tomorrow · 10:00 AM · Google Meet</p>
            </div>
          </div>
          <div className="space-y-1.5 text-[11px]">
            {[
              { label: "Role",       val: "SDE Intern — Backend" },
              { label: "Company",    val: "TechCorp India" },
              { label: "Verified by",val: "CodeHiring Score: 742" },
            ].map(({ label, val }) => (
              <div key={label} className="flex items-center justify-between py-1 border-b border-white/4 last:border-0">
                <span className="text-zinc-600">{label}</span>
                <span className="text-zinc-300 font-semibold">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Time stat */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/6 px-4 py-3">
        <Zap className="h-5 w-5 text-amber-400 shrink-0" />
        <div>
          <p className="text-xs font-bold text-white">Hired in 4 hours</p>
          <p className="text-[10px] text-zinc-500">From problem solved → interview booked</p>
        </div>
        <Star className="h-4 w-4 text-amber-400 ml-auto fill-amber-400" />
      </motion.div>
    </div>
  )
}

function CollegeVisual() {
  return (
    <div className="w-full max-w-sm mx-auto space-y-3">
      <div className="rounded-2xl border border-teal-500/20 bg-card overflow-hidden shadow-2xl shadow-teal-500/10">
        <div className="bg-gradient-to-r from-teal-500/12 to-emerald-500/5 px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-teal-400">🏫 College Analytics</p>
            <span className="text-[10px] text-zinc-600">RVR & JC College</span>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {/* Placement rate */}
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-xs text-zinc-500">Placement Rate</span>
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-lg font-black text-emerald-400">78%</motion.span>
          </div>
          {/* Student breakdown */}
          <div className="space-y-2">
            {[
              { label: "Placed",       val: 234, color: "bg-emerald-500", text: "text-emerald-400" },
              { label: "Interviewing", val: 45,  color: "bg-amber-500",   text: "text-amber-400" },
              { label: "Searching",    val: 67,  color: "bg-blue-500",    text: "text-blue-400" },
            ].map(({ label, val, color, text }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-[10px] text-zinc-600 w-20 shrink-0">{label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-white/5">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${(val / 346) * 100}%` }}
                    viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }}
                    className={`h-full rounded-full ${color}`} />
                </div>
                <span className={`text-[10px] font-bold ${text} w-8 text-right tabular-nums`}>{val}</span>
              </div>
            ))}
          </div>
          {/* Branch performance */}
          <div className="pt-2 space-y-1.5">
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Branch Performance</p>
            {[["CSE","92%"],["IT","85%"],["ECE","71%"]].map(([branch, rate]) => (
              <div key={branch} className="flex items-center gap-2 text-[10px]">
                <span className="text-zinc-500 w-8">{branch}</span>
                <div className="flex-1 h-1 rounded-full bg-white/5">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: rate }} viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full bg-teal-500" />
                </div>
                <span className="text-zinc-400 w-8 text-right">{rate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-3 rounded-xl border border-teal-500/20 bg-teal-500/6 px-4 py-3">
        <span className="text-xl shrink-0">🏆</span>
        <div>
          <p className="text-xs font-bold text-white">Drive completed</p>
          <p className="text-[10px] text-zinc-500">12 students placed · Data auto-updated</p>
        </div>
      </motion.div>
    </div>
  )
}


export function ProductShowcase() {
  const [activeStep, setActiveStep] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  // Observe which step is in view
  useEffect(() => {
    const observers = sectionRefs.current.map((el, i) => {
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveStep(i) },
        { threshold: 0.5 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [])

  const a = ACCENT[STEPS[activeStep].accent]

  return (
    <section className="relative py-6 overflow-hidden">
      {/* Ambient glow that follows active step */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
        <div className={`absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,var(--glow-color),transparent)]`}
          style={{ "--glow-color": `rgba(139,92,246,0.08)` } as any} />
      </motion.div>

      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <div className="text-center mb-8">
          <motion.p
            animate={{ color: ["#8b5cf6","#3b82f6","#10b981","#f59e0b","#8b5cf6"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="text-xs font-bold uppercase tracking-widest mb-4">
            Product
          </motion.p>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight mb-4">
            See CodeHiring in Action
          </h2>
          <p className="text-zinc-500 max-w-md mx-auto text-sm leading-relaxed">
            From first keystroke to hired — the entire hiring loop runs on verified skill data.
          </p>
        </div>

        {/* Scroll-driven layout */}
        <div ref={containerRef} className="relative">

          {/* Sticky progress indicator — left rail */}
          <div className="hidden lg:flex flex-col gap-0 absolute -left-12 top-0 bottom-0 justify-center">
            <div className="relative flex flex-col gap-6 items-center">
              {/* Spine */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/8" />
              {STEPS.map((step, i) => {
                const acc = ACCENT[step.accent]
                return (
                  <motion.button key={step.id} onClick={() => {
                    sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" })
                  }}
                    className={`relative z-10 w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center text-[9px] font-black
                      ${activeStep === i ? `${acc.dot.replace("bg-","border-")} bg-background shadow-lg` : "border-white/15 bg-background"}`}>
                    <span className={activeStep >= i ? acc.text : "text-zinc-700"}>{i + 1}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-16 lg:space-y-24">
            {STEPS.map((step, i) => {
              const acc = ACCENT[step.accent]
              const Icon = step.icon
              const isEven = i % 2 === 0

              return (
                <div
                  key={step.id}
                  ref={el => { sectionRefs.current[i] = el }}
                  className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12 lg:gap-20`}>

                  {/* Text side */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex-1 min-w-0">

                    {/* Step tag */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest mb-5 ${acc.border} ${acc.bg} ${acc.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${acc.dot}`} />
                      {step.tag}
                    </div>

                    {/* Headline */}
                    <h3 className="text-3xl sm:text-4xl font-black text-foreground leading-tight tracking-tight mb-4">
                      {step.headline}
                    </h3>

                    {/* Sub */}
                    <p className="text-base text-zinc-400 leading-relaxed max-w-md mb-8">
                      {step.sub}
                    </p>

                    {/* Connector arrow to next */}
                    {i < STEPS.length - 1 && (
                      <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="flex items-center gap-2 text-xs text-zinc-700">
                        <div className="flex flex-col gap-0.5">
                          <div className="w-px h-4 bg-white/10 mx-auto" />
                          <ArrowRight className={`h-4 w-4 ${ACCENT[STEPS[i + 1].accent].text} rotate-90`} />
                        </div>
                        <span className="text-zinc-600">then</span>
                      </motion.div>
                    )}

                    {/* Final CTA */}
                    {i === STEPS.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center gap-3">
                        <div className="h-px flex-1 max-w-[48px] bg-white/10" />
                        <span className={`text-sm font-bold ${acc.text}`}>The loop closes in hours, not weeks.</span>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Visual side */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                    className="flex-1 w-full max-w-sm lg:max-w-none">
                    {/* Glow ring behind visual */}
                    <div className="relative">
                      <div className={`absolute inset-0 rounded-3xl blur-3xl opacity-20 ${acc.bg}`} />
                      <div className="relative">
                        {step.visual}
                      </div>
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </div>

          {/* Final outcome banner */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 rounded-3xl border border-white/8 bg-gradient-to-r from-violet-500/8 via-blue-500/5 to-emerald-500/8 p-8 text-center overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(139,92,246,0.08),transparent)]" />
            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-5xl mb-4 inline-block">
                🚀
              </motion.div>
              <h3 className="text-2xl font-black text-white mb-2">The entire loop. Automated.</h3>
              <p className="text-zinc-500 text-sm max-w-sm mx-auto mb-6">
                Student solves a problem → Score updates → Recruiter finds them → Interview booked.
                No resume. No guessing. Just proof.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/12 border border-violet-500/25 text-violet-400 text-xs font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
                  Verified skills
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/12 border border-blue-500/25 text-blue-400 text-xs font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                  AI matching
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/12 border border-emerald-500/25 text-emerald-400 text-xs font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Zero fake data
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


