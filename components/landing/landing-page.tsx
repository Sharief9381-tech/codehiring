"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { SpotlightCard } from "@/components/landing/spotlight-card"
import {
  ArrowRight, Sparkles, ChevronDown,
  GraduationCap, Building2, Briefcase, Award,
  BarChart3, Users, Brain, Trophy, FileText, Target, GitBranch, ShieldCheck, Zap,
  Code2, Github, Terminal, Braces, Hash, FileCode, BookOpen, Cpu,
  Star, Quote,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { blogPosts } from "@/lib/blog-posts"

// Always show the 3 most recent posts — never depends on API
const RECENT_POSTS = blogPosts.slice(0, 3).map(
  ({ slug, title, tag, tagColor, date, readTime, excerpt }) => ({
    slug, title, tag, tagColor, date, readTime, excerpt,
  })
)

// ─── Types ───────────────────────────────────────────────────────────────────

interface LandingData {
  siteConfig: {
    hero: {
      badge: string
      headline: string
      headlineHighlight: string
      subtext: string
      ctaPrimary: string
      ctaSecondary: string
    }
    testimonials: { name: string; role: string; avatar: string; text: string }[]
    featuredCompanies: { name: string }[]
    announcementBar: string
  }
  stats: {
    students: number; colleges: number; recruiters: number
    drives: number; problemsSolved: number; applications: number
  }
  openCareers: number
  recentPosts: { slug: string; title: string; tag: string; tagColor: string; date: string; readTime: string; excerpt: string }[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K+`
  return n > 0 ? `${n}+` : "0"
}

function useCountUp(target: number, duration = 1400) {
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

// ─── Static config for icons (not editable via DB — purely presentational) ──

const PLATFORM_ICONS: Record<string, { icon: React.ElementType; color: string; bg: string; desc: string; spotlight: string }> = {
  LeetCode:      { icon: Code2,     color: "text-amber-500",   bg: "bg-amber-500/10",   desc: "Problems & contests",     spotlight: "rgba(234,179,8,0.18)"   },
  GitHub:        { icon: Github,    color: "text-foreground",  bg: "bg-secondary",      desc: "Contributions & repos",   spotlight: "rgba(120,120,120,0.15)" },
  Codeforces:    { icon: Hash,      color: "text-cyan-500",    bg: "bg-cyan-500/10",    desc: "Ratings & contests",      spotlight: "rgba(34,211,238,0.18)"  },
  CodeChef:      { icon: Braces,    color: "text-rose-500",    bg: "bg-rose-500/10",    desc: "Ratings & problems",      spotlight: "rgba(239,68,68,0.15)"   },
  HackerRank:    { icon: Terminal,  color: "text-primary",     bg: "bg-primary/10",     desc: "Badges & certifications", spotlight: "rgba(139,92,246,0.18)"  },
  GeeksforGeeks: { icon: FileCode,  color: "text-emerald-500", bg: "bg-emerald-500/10", desc: "Problems & courses",      spotlight: "rgba(34,197,94,0.18)"   },
  HackerEarth:   { icon: Cpu,       color: "text-indigo-500",  bg: "bg-indigo-500/10",  desc: "Challenges & hackathons", spotlight: "rgba(99,102,241,0.18)"  },
  AtCoder:       { icon: BookOpen,  color: "text-violet-500",  bg: "bg-violet-500/10",  desc: "Competitive programming", spotlight: "rgba(167,139,250,0.18)" },
}

const FEATURE_TABS = [
  {
    role: "Students", icon: GraduationCap, accent: "text-primary", bgAccent: "bg-primary/10",
    spotlight: "rgba(139,92,246,0.13)", border: "hover:border-primary/50", iconColor: "text-primary",
    description: "Track every platform. Build a verified profile. Land your dream job.",
    features: [
      { icon: BarChart3, title: "Unified Dashboard", desc: "All your LeetCode, CodeChef, Codeforces, HackerRank & GitHub stats in one place." },
      { icon: Trophy,    title: "Score Analytics",   desc: "Normalized scores that make your skills comparable across colleges and platforms." },
      { icon: FileText,  title: "Smart Resume",      desc: "Auto-generate a verified resume powered by real performance data." },
      { icon: Target,    title: "AI Job Match",      desc: "Personalized job recommendations based on your actual coding profile." },
      { icon: GitBranch, title: "GitHub Insights",   desc: "Contribution streaks, repositories, and open-source activity tracked automatically." },
      { icon: Zap,       title: "Skill Gaps",        desc: "AI-identified gaps in your skill set with curated resources to close them fast." },
    ],
  },
  {
    role: "Colleges", icon: Building2, accent: "text-emerald-500", bgAccent: "bg-emerald-500/10",
    spotlight: "rgba(34,197,94,0.12)", border: "hover:border-emerald-500/50", iconColor: "text-emerald-500",
    description: "Monitor batches. Drive placements. Prove your college's value.",
    features: [
      { icon: Users,      title: "Batch Tracking",      desc: "Monitor entire batches with branch-wise stats and real-time performance data." },
      { icon: BarChart3,  title: "Placement Analytics", desc: "Data-driven insights to improve placement rates and identify skill gaps." },
      { icon: Trophy,     title: "Leaderboards",        desc: "Motivate students with competitive leaderboards and achievement badges." },
      { icon: ShieldCheck,title: "Access Control",      desc: "Decide exactly which recruiters can see your students' data." },
      { icon: FileText,   title: "Report Generation",   desc: "One-click placement reports for management, NAAC, and rankings." },
      { icon: Briefcase,  title: "Drive Management",    desc: "Create and manage on-campus drives with applications tracked end-to-end." },
    ],
  },
  {
    role: "Recruiters", icon: Briefcase, accent: "text-amber-500", bgAccent: "bg-amber-500/10",
    spotlight: "rgba(234,179,8,0.12)", border: "hover:border-amber-500/50", iconColor: "text-amber-500",
    description: "Skip keyword matching. Hire on verified coding performance.",
    features: [
      { icon: Brain,      title: "AI Talent Matching", desc: "Find candidates whose skills are verified across platforms, not self-reported." },
      { icon: Target,     title: "Advanced Filters",   desc: "Filter by stack, ratings, contest ranks, GitHub activity, CGPA, and more." },
      { icon: Users,      title: "Bulk Outreach",      desc: "Shortlist and contact multiple candidates efficiently with smart automation." },
      { icon: ShieldCheck,title: "Verified Profiles",  desc: "Every stat is pulled directly from the platform — no resume fraud." },
      { icon: BarChart3,  title: "Hiring Pipeline",    desc: "Track every candidate from screening to offer in a visual pipeline." },
      { icon: FileText,   title: "Assessment Builder", desc: "Create AI-powered coding assessments tailored to your job requirements." },
    ],
  },
]

const HOW_IT_WORKS = [
  {
    role: "Student", icon: GraduationCap, color: "text-primary", bgColor: "bg-primary/10",
    lineColor: "bg-primary/30", numColor: "text-primary", spotlight: "rgba(139,92,246,0.15)",
    steps: [
      { step: "01", title: "Connect Profiles",  desc: "Link LeetCode, GitHub, CodeChef, Codeforces, and HackerRank accounts in minutes." },
      { step: "02", title: "Auto-Sync Stats",   desc: "Your performance data syncs automatically — no manual entry needed." },
      { step: "03", title: "Get Scored",        desc: "Receive a normalized CodeScore visible to colleges and recruiters." },
      { step: "04", title: "Get Hired",         desc: "Apply to matched jobs or get discovered by companies hiring your skill set." },
    ],
  },
  {
    role: "College", icon: Building2, color: "text-emerald-500", bgColor: "bg-emerald-500/10",
    lineColor: "bg-emerald-500/30", numColor: "text-emerald-500", spotlight: "rgba(34,197,94,0.15)",
    steps: [
      { step: "01", title: "Register College",   desc: "Create your college account and generate a unique college code." },
      { step: "02", title: "Onboard Students",   desc: "Students join using the college code — bulk CSV upload also supported." },
      { step: "03", title: "Monitor Progress",   desc: "Watch real-time coding activity, rankings, and batch-wise analytics." },
      { step: "04", title: "Drive Placements",   desc: "Invite recruiters, create drives, and track outcomes end-to-end." },
    ],
  },
  {
    role: "Recruiter", icon: Briefcase, color: "text-amber-500", bgColor: "bg-amber-500/10",
    lineColor: "bg-amber-500/30", numColor: "text-amber-500", spotlight: "rgba(234,179,8,0.15)",
    steps: [
      { step: "01", title: "Post Requirements",   desc: "Define the role, required skills, minimum ratings, and preferred platforms." },
      { step: "02", title: "AI Matches Talent",   desc: "Our AI ranks candidates from verified coding data across all platforms." },
      { step: "03", title: "Review & Shortlist",  desc: "Browse ranked candidates with full skill breakdowns and platform stats." },
      { step: "04", title: "Schedule & Hire",     desc: "Reach out, run assessments, and manage your pipeline to close hires." },
    ],
  },
]

const STAT_META = [
  { key: "students",      label: "Students Registered", sublabel: "Across all colleges",  iconClass: "bg-primary/10 text-primary",       icon: GraduationCap },
  { key: "colleges",      label: "Colleges Onboarded",  sublabel: "Tracking placements",  iconClass: "bg-indigo-500/10 text-indigo-500", icon: Building2 },
  { key: "problemsSolved",label: "Problems Solved",     sublabel: "Across all platforms", iconClass: "bg-emerald-500/10 text-emerald-500",icon: Code2 },
  { key: "recruiters",    label: "Companies Hiring",    sublabel: "Actively recruiting",  iconClass: "bg-amber-500/10 text-amber-500",   icon: Briefcase },
  { key: "drives",        label: "Hiring Drives",       sublabel: "Posted on platform",   iconClass: "bg-cyan-500/10 text-cyan-500",     icon: Users },
  { key: "applications",  label: "Applications",        sublabel: "Submitted to drives",  iconClass: "bg-rose-500/10 text-rose-500",     icon: Trophy },
] as const

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatItem({ icon: Icon, label, sublabel, value, iconClass, loaded }: {
  icon: React.ElementType; label: string; sublabel: string
  value: number; iconClass: string; loaded: boolean
}) {
  const count = useCountUp(loaded ? value : 0)
  return (
    <div className="flex flex-col items-center text-center gap-3 py-8 px-4 cursor-pointer group relative overflow-hidden rounded-xl hover:bg-primary/5 transition-colors">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass} group-hover:scale-110 transition-transform`}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-4xl font-bold text-foreground tabular-nums group-hover:text-primary transition-colors">
        {loaded ? formatNum(count) : "—"}
      </p>
      <div>
        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function LandingPage() {
  const [data, setData] = useState<LandingData | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch("/api/landing")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoaded(true) })
      .catch(() => setLoaded(true))
  }, [])

  const hero = data?.siteConfig?.hero
  const stats = data?.stats
  const testimonials = data?.siteConfig?.testimonials ?? []
  const announcement = data?.siteConfig?.announcementBar
  const openCareers = data?.openCareers ?? 0

  const PLATFORMS = Object.entries(PLATFORM_ICONS).map(([name, meta]) => ({ name, ...meta }))

  return (
    <>
      {/* ── Announcement bar ── */}
      {announcement && (
        <div className="bg-primary text-primary-foreground text-center text-xs py-2 px-4 font-medium">
          {announcement}
        </div>
      )}

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(139,92,246,0.18),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_60%,rgba(99,102,241,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_20%_80%,rgba(34,197,94,0.06),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative mx-auto max-w-5xl text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-8 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="font-medium">{hero?.badge ?? "AI-Powered Campus Recruitment"}</span>
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance leading-[1.1]">
            {hero?.headline ?? "Where Coding Skills"}{" "}
            <span className="bg-gradient-to-r from-primary via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              {hero?.headlineHighlight ?? "Meet Opportunities"}
            </span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {hero?.subtext ?? "CodeHiring unifies student coding performance across all platforms, gives colleges placement analytics, and helps recruiters find verified talent — all in one place."}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" className="gap-2 px-8 text-base">
                {hero?.ctaPrimary ?? "Get Started Free"} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8 text-base bg-transparent">
                {hero?.ctaSecondary ?? "Sign In"}
              </Button>
            </Link>
          </div>

        </div>

        <a href="#stats" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors animate-bounce">
          <ChevronDown className="h-6 w-6" />
        </a>
      </section>

      {/* ── Live Stats ── */}
      <section id="stats" className="py-8 border-y border-border bg-secondary/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Live platform stats
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-border">
            {STAT_META.map((s) => (
              <StatItem
                key={s.key}
                icon={s.icon}
                label={s.label}
                sublabel={s.sublabel}
                value={(stats as any)?.[s.key] ?? 0}
                iconClass={s.iconClass}
                loaded={loaded}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Features</p>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">Built for Every Role in the Ecosystem</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Whether you are a student building your career, a college driving placements, or a company finding talent — CodeHiring has you covered.
            </p>
          </div>
          <div className="space-y-20">
            {FEATURE_TABS.map((tab) => (
              <div key={tab.role}>
                <div className="flex items-center gap-4 mb-8">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tab.bgAccent}`}>
                    <tab.icon className={`h-5 w-5 ${tab.accent}`} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${tab.accent}`}>For {tab.role}</h3>
                    <p className="text-sm text-muted-foreground">{tab.description}</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {tab.features.map((f, i) => (
                    <SpotlightCard key={i} spotlightColor={tab.spotlight} className={`p-6 ${tab.border} transition-all cursor-pointer`}>
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${tab.bgAccent} mb-4`}>
                        <f.icon className={`h-4 w-4 ${tab.iconColor}`} />
                      </div>
                      <h4 className="text-sm font-semibold text-foreground mb-1.5">{f.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    </SpotlightCard>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 px-6 bg-secondary/20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Process</p>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">How It Works</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Four simple steps for each role — get up and running in under five minutes.</p>
          </div>
          <div className="space-y-20">
            {HOW_IT_WORKS.map((flow) => (
              <div key={flow.role}>
                <div className="flex items-center gap-3 mb-10">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${flow.bgColor}`}>
                    <flow.icon className={`h-5 w-5 ${flow.color}`} />
                  </div>
                  <h3 className={`text-lg font-semibold ${flow.color}`}>{flow.role} Journey</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-4">
                  {flow.steps.map((item, index) => (
                    <SpotlightCard key={index} spotlightColor={flow.spotlight} className="relative p-6 cursor-pointer hover:border-primary/30 transition-all">
                      {index < flow.steps.length - 1 && (
                        <div className={`hidden sm:block absolute top-[2.5rem] left-[calc(50%+20px)] right-0 h-px ${flow.lineColor} z-20`} />
                      )}
                      <div className="flex flex-col items-center text-center">
                        <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background mb-4">
                          <span className={`text-xs font-bold ${flow.numColor}`}>{item.step}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-foreground mb-1.5">{item.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </SpotlightCard>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platforms ── */}
      <section id="platforms" className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Integrations</p>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">All Major Platforms, One Profile</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              We pull live data directly from every platform so your profile is always accurate and up to date.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {PLATFORMS.map((p) => (
              <SpotlightCard key={p.name} spotlightColor={p.spotlight} className="flex flex-col items-center gap-3 p-5 text-center cursor-pointer group">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${p.bg}`}>
                  <p.icon className={`h-5 w-5 ${p.color}`} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{p.desc}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-8">
            More platforms being added.{" "}
            <a href="mailto:support@CodeHiring.io" className="text-primary hover:underline">Request an integration →</a>
          </p>
        </div>
      </section>

      {/* ── Testimonials (dynamic) ── */}
      {testimonials.length > 0 && (
        <section className="py-24 px-6 bg-secondary/20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Testimonials</p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">What People Are Saying</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <SpotlightCard key={i} spotlightColor="rgba(139,92,246,0.13)" className="p-6 cursor-default">
                  <Quote className="h-5 w-5 text-primary/40 mb-4" />
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {[...Array(5)].map((_, j) => <Star key={j} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Recent Blog Posts ── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Blog</p>
              <h2 className="text-2xl font-bold text-foreground">Latest Insights</h2>
            </div>
            <Link href="/blog" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {RECENT_POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <SpotlightCard spotlightColor="rgba(139,92,246,0.13)" className="h-full cursor-pointer hover:border-primary/40">
                  <div className="group p-6 flex flex-col h-full">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium mb-3 w-fit ${post.tagColor}`}>{post.tag}</span>
                    <h3 className="font-semibold text-foreground mb-2 leading-snug text-balance group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-xs text-muted-foreground">{post.date} · {post.readTime}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </SpotlightCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-secondary/20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Get Started</p>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">Ready to Transform Your Hiring?</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Join students, colleges, and companies already using CodeHiring to make smarter, data-driven decisions.
            </p>
            {openCareers > 0 && (
              <Link href="/careers" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mt-3">
                We're hiring — {openCareers} open role{openCareers > 1 ? "s" : ""} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: GraduationCap, title: "I'm a Student",       desc: "Build a verified coding profile and get matched to jobs.",              spotlight: "rgba(139,92,246,0.18)", accent: "border-primary/30 bg-primary/5 hover:bg-primary/10",             iconBg: "bg-primary/10",      iconColor: "text-primary",     href: "/signup?role=student"   },
              { icon: Award,        title: "I'm a Graduate",       desc: "Showcase your skills and get hired — no college code needed.",         spotlight: "rgba(99,102,241,0.18)", accent: "border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10",   iconBg: "bg-indigo-500/10",   iconColor: "text-indigo-500",  href: "/signup?role=graduate"  },
              { icon: Building2,    title: "I'm from a College",   desc: "Track placements and manage student performance at scale.",             spotlight: "rgba(34,197,94,0.18)",  accent: "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10", iconBg: "bg-emerald-500/10",  iconColor: "text-emerald-500", href: "/signup?role=college"   },
              { icon: Briefcase,    title: "I'm a Recruiter",      desc: "Find verified developer talent faster with AI-powered matching.",       spotlight: "rgba(234,179,8,0.18)",  accent: "border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10",      iconBg: "bg-amber-500/10",    iconColor: "text-amber-500",   href: "/signup?role=recruiter" },
            ].map((r) => (
              <Link key={r.title} href={r.href}>
                <SpotlightCard spotlightColor={r.spotlight} className={`cursor-pointer transition-all ${r.accent} h-full`}>
                  <div className="group p-6 flex flex-col gap-4 h-full">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${r.iconBg}`}>
                      <r.icon className={`h-5 w-5 ${r.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{r.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-foreground/70 group-hover:text-primary transition-colors">
                      Get started <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </SpotlightCard>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
