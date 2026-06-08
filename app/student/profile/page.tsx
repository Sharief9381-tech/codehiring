"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import {
  Sparkles, Pencil, Save, X, Loader2, MapPin, Calendar, CheckCircle2,
  Code2, Github, Linkedin, Globe, Twitter, ArrowUpRight,
  GraduationCap, Mail, Phone, Shield, Zap, Trophy, Flame, Activity,
  Briefcase,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ProfileForm } from "@/components/student/profile-form"

export const dynamic = "force-dynamic"

// ─── helpers ─────────────────────────────────────────────────────────────────
const ini = (n: string) =>
  (n || "?").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()

const PLATFORM_META: Record<string, { emoji: string; label: string; url: (u: string) => string; accent: string }> = {
  leetcode:     { emoji: "⚡", label: "LeetCode",      accent: "text-amber-400",   url: u => `https://leetcode.com/${u}` },
  codeforces:   { emoji: "🔵", label: "Codeforces",    accent: "text-blue-400",    url: u => `https://codeforces.com/profile/${u}` },
  github:       { emoji: "🐙", label: "GitHub",        accent: "text-zinc-300",    url: u => `https://github.com/${u}` },
  codechef:     { emoji: "👨‍🍳", label: "CodeChef",      accent: "text-rose-400",    url: u => `https://www.codechef.com/users/${u}` },
  hackerrank:   { emoji: "💚", label: "HackerRank",    accent: "text-emerald-400", url: u => `https://www.hackerrank.com/${u}` },
  hackerearth:  { emoji: "🌍", label: "HackerEarth",   accent: "text-indigo-400",  url: u => `https://www.hackerearth.com/@${u}` },
  atcoder:      { emoji: "🎯", label: "AtCoder",       accent: "text-purple-400",  url: u => `https://atcoder.jp/users/${u}` },
  geeksforgeeks:{ emoji: "🌿", label: "GeeksForGeeks", accent: "text-green-400",   url: u => `https://auth.geeksforgeeks.org/user/${u}` },
}

const SKILL_PALETTE = [
  "bg-violet-500/10 text-violet-300 border-violet-500/20",
  "bg-blue-500/10 text-blue-300 border-blue-500/20",
  "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  "bg-amber-500/10 text-amber-300 border-amber-500/20",
  "bg-pink-500/10 text-pink-300 border-pink-500/20",
  "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  "bg-orange-500/10 text-orange-300 border-orange-500/20",
  "bg-teal-500/10 text-teal-300 border-teal-500/20",
]

function profileCompletion(u: any) {
  if (!u) return 0
  const checks = [
    !!u.name, !!u.bio, !!u.location, !!u.phone,
    !!u.branch, !!u.degree, !!u.graduationYear,
    (u.skills?.length ?? 0) > 0, !!u.linkedinUrl, !!u.githubUrl,
    Object.keys(u.linkedPlatforms ?? {}).length > 0,
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

function buildTimeline(u: any) {
  const agg  = u?.aggregatedStats ?? u?.stats ?? {}
  const total = agg?.totalProblems ?? 0
  const cf   = u?.linkedPlatforms?.codeforces?.stats?.rating ?? 0
  const lc   = u?.linkedPlatforms?.leetcode?.stats?.totalSolved ?? 0
  const gh   = u?.linkedPlatforms?.github?.stats?.totalContributions ?? 0
  const ps   = Object.keys(u?.linkedPlatforms ?? {}).length
  const cx   = agg?.contestsParticipated ?? 0
  const now  = new Date().getFullYear().toString()
  const join = u?.createdAt ? new Date(u.createdAt).getFullYear().toString() : now

  const rows: { icon: string; text: string; year: string; hot: boolean }[] = []
  if (total >= 500)     rows.push({ icon: "⚡", text: `Crossed ${total}+ problems solved`,        year: now,  hot: true })
  else if (total > 0)   rows.push({ icon: "⚡", text: `${total} coding problems solved`,          year: now,  hot: false })
  if (lc >= 200)        rows.push({ icon: "🏆", text: "Achieved LeetCode Knight",                 year: now,  hot: true })
  if (cf >= 1600)       rows.push({ icon: "👑", text: `Codeforces Master — rating ${cf}`,         year: now,  hot: true })
  else if (cf >= 1400)  rows.push({ icon: "⭐", text: `Codeforces Expert — rating ${cf}`,         year: now,  hot: true })
  else if (cf > 0)      rows.push({ icon: "🔵", text: `Codeforces rated — ${cf}`,                 year: now,  hot: false })
  if (gh >= 100)        rows.push({ icon: "🌟", text: `${gh} GitHub contributions`,               year: now,  hot: false })
  if (cx >= 5)          rows.push({ icon: "🎪", text: `Competed in ${cx} coding contests`,        year: now,  hot: false })
  if (ps >= 3)          rows.push({ icon: "🔗", text: `Active on ${ps} coding platforms`,         year: now,  hot: false })
  if ((u?.skills?.length ?? 0) >= 3)
    rows.push({ icon: "🚀", text: `Mastered ${(u.skills as string[]).slice(0, 3).join(", ")}…`, year: now,  hot: false })
  rows.push({ icon: "✨", text: "Joined CodeHiring",                                             year: join, hot: false })
  return rows.slice(0, 7)
}

function buildBadges(u: any) {
  const agg  = u?.aggregatedStats ?? u?.stats ?? {}
  const total = agg?.totalProblems ?? 0
  const cf   = u?.linkedPlatforms?.codeforces?.stats?.rating ?? 0
  const lc   = u?.linkedPlatforms?.leetcode?.stats?.totalSolved ?? 0
  const gh   = u?.linkedPlatforms?.github?.stats?.totalContributions ?? 0
  const cx   = agg?.contestsParticipated ?? 0
  const pct  = profileCompletion(u)
  return [
    lc >= 200  && { e: "🏆", n: "Knight",      s: `${lc} solved`,      c: "border-amber-500/30 bg-amber-500/8" },
    cf >= 1600 && { e: "👑", n: "Master",       s: `CF ${cf}`,          c: "border-purple-500/30 bg-purple-500/8" },
    cf >= 1400 && cf < 1600 && { e: "⭐", n: "Expert", s: `CF ${cf}`,   c: "border-blue-500/30 bg-blue-500/8" },
    cf > 0 && cf < 1400 && { e: "🔵", n: "Rated",     s: `CF ${cf}`,    c: "border-sky-500/30 bg-sky-500/8" },
    gh >= 200  && { e: "🌟", n: "Contributor",  s: `${gh} contribs`,    c: "border-emerald-500/30 bg-emerald-500/8" },
    cx >= 10   && { e: "🎯", n: "Veteran",      s: `${cx} contests`,    c: "border-violet-500/30 bg-violet-500/8" },
    cx >= 1 && cx < 10 && { e: "🎪", n: "Contestant", s: `${cx} contests`, c: "border-indigo-500/30 bg-indigo-500/8" },
    total >= 200 && { e: "🔥", n: "Solver",     s: `${total}+ probs`,   c: "border-rose-500/30 bg-rose-500/8" },
    pct >= 80  && { e: "✅", n: "Complete",     s: `${pct}% profile`,   c: "border-teal-500/30 bg-teal-500/8" },
    u?.isOpenToWork && { e: "💼", n: "Available", s: "Open to work",    c: "border-green-500/30 bg-green-500/8" },
  ].filter(Boolean).slice(0, 6) as any[]
}

// ─── animated counter ─────────────────────────────────────────────────────────
function Num({ to }: { to: number }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!to) return
    let s = 0, r = 0
    const t = (n: number) => {
      if (!s) s = n
      const p = Math.min((n - s) / 1400, 1)
      setV(Math.round((1 - Math.pow(1 - p, 4)) * to))
      if (p < 1) r = requestAnimationFrame(t)
    }
    r = requestAnimationFrame(t)
    return () => cancelAnimationFrame(r)
  }, [to])
  return <>{v.toLocaleString()}</>
}

// ─── thin divider ─────────────────────────────────────────────────────────────
function Sep({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-10">
      <div className="flex-1 h-px bg-white/5" />
      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">{label}</span>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  )
}

// ─── stat row item ────────────────────────────────────────────────────────────
function StatRow({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2.5">
        <Icon className={`h-3.5 w-3.5 ${color} opacity-60`} />
        <span className="text-sm text-zinc-500">{label}</span>
      </div>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  )
}

// ─── profile view ─────────────────────────────────────────────────────────────
function ProfileView({ user, onEdit }: { user: any; onEdit: () => void }) {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const yShift  = useTransform(scrollYProgress, [0, 1], [0, 80])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const agg   = user?.aggregatedStats ?? user?.stats ?? {}
  const total = agg?.totalProblems ?? agg?.totalSolved ?? 0
  const easy  = agg?.easyProblems ?? 0
  const med   = agg?.mediumProblems ?? 0
  const hard  = agg?.hardProblems ?? 0
  const cf    = user?.linkedPlatforms?.codeforces?.stats?.rating ?? 0
  const cfMax = user?.linkedPlatforms?.codeforces?.stats?.maxRating ?? cf
  const lc    = user?.linkedPlatforms?.leetcode?.stats?.totalSolved ?? 0
  const gh    = user?.linkedPlatforms?.github?.stats?.totalContributions
              ?? user?.linkedPlatforms?.github?.stats?.contributions ?? 0
  const cx    = agg?.contestsParticipated ?? 0
  const str   = user?.linkedPlatforms?.leetcode?.stats?.streak ?? 0
  const score = user?.codeHiringScore ?? agg?.codeHiringScore ?? 0
  const skills   = (user?.skills ?? []) as string[]
  const platforms = Object.entries(user?.linkedPlatforms ?? {}).filter(([, v]: any) => v?.username) as [string, any][]
  const timeline  = buildTimeline(user)
  const badges    = buildBadges(user)
  const pct       = profileCompletion(user)

  const socials = [
    { Icon: Github,   label: "GitHub",    url: user?.githubUrl    },
    { Icon: Linkedin, label: "LinkedIn",  url: user?.linkedinUrl  },
    { Icon: Globe,    label: "Portfolio", url: user?.portfolioUrl },
    { Icon: Twitter,  label: "Twitter",   url: user?.twitterUrl   },
  ].filter(s => s.url)

  return (
    <div>

      {/* ══ §1 HERO ═══════════════════════════════════════════════════════════ */}
      <div ref={heroRef} className="relative overflow-hidden rounded-3xl" style={{ minHeight: "68vh" }}>
        {/* Background layers */}
        <motion.div style={{ y: yShift }} className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_65%_at_50%_-5%,rgba(139,92,246,0.45),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_90%_90%,rgba(59,130,246,0.25),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_35%_at_10%_70%,rgba(16,185,129,0.18),transparent)]" />
          <motion.div className="absolute inset-0 opacity-20"
            animate={{ opacity: [0.15, 0.28, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ background: "conic-gradient(from 180deg at 50% 50%, rgba(139,92,246,0.12), rgba(59,130,246,0.1), rgba(16,185,129,0.08), rgba(245,158,11,0.1), rgba(139,92,246,0.12))" }} />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.009)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.009)_1px,transparent_1px)] bg-[size:56px_56px]" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/15 to-transparent pointer-events-none" />

        {/* Edit button */}
        <div className="absolute top-5 right-5 z-20">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onEdit}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/35 border border-white/10 backdrop-blur-md text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors">
            <Pencil className="h-3 w-3" /> Edit Profile
          </motion.button>
        </div>

        {/* Hero text — positioned at bottom */}
        <motion.div style={{ opacity }}
          className="absolute inset-0 flex flex-col justify-end px-7 sm:px-10 pb-10 z-10">
          <div className="max-w-2xl">

            {/* Avatar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, type: "spring" }}
              className="mb-5">
              <div className="relative inline-block">
                <div className="w-[70px] h-[70px] rounded-[18px] bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 flex items-center justify-center text-2xl font-black text-white shadow-2xl shadow-violet-600/50">
                  {ini(user?.name || "")}
                </div>
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center shadow-md shadow-emerald-500/60">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* Name */}
            <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
              className="text-[clamp(2.2rem,7vw,3.8rem)] font-black text-white tracking-tight leading-none mb-3">
              {user?.name || "Your Name"}
            </motion.h1>

            {/* Tagline */}
            {(user?.degree || user?.branch || user?.collegeName) && (
              <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
                className="text-base sm:text-lg text-zinc-400 font-medium mb-3">
                {[user?.degree, user?.branch, user?.collegeName || user?.collegeCode].filter(Boolean).join(" · ")}
              </motion.p>
            )}

            {/* Meta chips */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-3 mb-4 text-xs text-zinc-500">
              {user?.location && (
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-zinc-600" />{user.location}</span>
              )}
              {user?.graduationYear && (
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-zinc-600" />Class of {user.graduationYear}</span>
              )}
              {user?.createdAt && (
                <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-zinc-600" />Since {new Date(user.createdAt).toLocaleDateString("en-US",{month:"short",year:"numeric"})}</span>
              )}
              {user?.isOpenToWork && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/12 border border-emerald-500/25 text-emerald-400 font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />Open to Work
                </span>
              )}
            </motion.div>

            {/* Stats line */}
            {(total > 0 || cf > 0 || gh > 0) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
                className="flex flex-wrap items-baseline gap-x-1 gap-y-1 text-sm mb-5">
                {[
                  total > 0    && { n: total, label: "problems",     color: "text-violet-300" },
                  cf > 0       && { n: cf,    label: "CF rating",    color: "text-blue-300" },
                  !cf && lc > 0 && { n: lc,  label: "LC solved",    color: "text-amber-300" },
                  gh > 0       && { n: gh,   label: "contributions", color: "text-emerald-300" },
                  cx > 0       && { n: cx,   label: "contests",     color: "text-pink-300" },
                ].filter(Boolean).map((s: any, i) => (
                  <span key={s.label} className="flex items-baseline gap-1">
                    {i > 0 && <span className="text-zinc-700 mx-2">·</span>}
                    <span className={`text-lg font-black ${s.color}`}><Num to={s.n} /></span>
                    <span className="text-zinc-500 text-xs font-normal">{s.label}</span>
                  </span>
                ))}
                {score > 0 && (
                  <span className="flex items-baseline gap-1 ml-2">
                    <span className="text-zinc-700 mx-2">·</span>
                    <Sparkles className="h-3 w-3 text-violet-400 self-center" />
                    <span className="text-lg font-black text-violet-300">{score}</span>
                    <span className="text-zinc-500 text-xs font-normal">score</span>
                  </span>
                )}
              </motion.div>
            )}

            {/* Socials */}
            {socials.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                className="flex items-center gap-5">
                {socials.map(({ Icon, label, url }) => (
                  <a key={label} href={url!} target="_blank" rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors">
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:block">{label}</span>
                  </a>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ══ §2 BIO ════════════════════════════════════════════════════════════ */}
      {user?.bio && (
        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-10 text-xl sm:text-2xl font-medium text-zinc-300 leading-relaxed max-w-2xl">
          {user.bio}
        </motion.p>
      )}

      {/* ══ §3 SKILLS ════════════════════════════════════════════════════════ */}
      {skills.length > 0 && (
        <>
          <Sep label="Technical Arsenal" />
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex flex-wrap gap-2.5">
            {skills.map((skill, i) => (
              <motion.span key={skill}
                initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.035, type: "spring", stiffness: 280, damping: 18 }}
                whileHover={{ scale: 1.1, y: -2 }}
                className={`px-3.5 py-1.5 rounded-full border text-[11px] font-bold cursor-default select-none ${SKILL_PALETTE[i % SKILL_PALETTE.length]}`}>
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </>
      )}

      {/* ══ §4 PERFORMANCE ═══════════════════════════════════════════════════ */}
      {total > 0 && (
        <>
          <Sep label="Performance" />

          {/* Four big numbers — horizontal strip, no grid */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex overflow-x-auto gap-0 rounded-2xl border border-white/6 divide-x divide-white/6 bg-card mb-5">
            {[
              { val: total,   label: "problems solved",  color: "text-violet-300",  Icon: Code2    },
              { val: cf || lc, label: cf ? "CF rating"  : "LC solved", color: "text-blue-300",  Icon: Trophy   },
              { val: gh,      label: "contributions",   color: "text-emerald-300", Icon: Activity },
              { val: cx,      label: "contests",        color: "text-amber-300",   Icon: Zap      },
            ].map(({ val, label, color, Icon }) => (
              <div key={label} className="flex-1 min-w-[90px] flex flex-col items-center justify-center py-7 px-3 text-center shrink-0">
                <Icon className={`h-3.5 w-3.5 mb-2 ${color} opacity-50`} />
                <span className={`text-2xl sm:text-3xl font-black tabular-nums ${color}`}>
                  {val > 0 ? <Num to={val} /> : "—"}
                </span>
                <span className="text-[9px] text-zinc-600 mt-1 uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </motion.div>

          {/* Difficulty bar — full width row */}
          {(easy + med + hard) > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="rounded-2xl border border-white/6 bg-card p-5 mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Difficulty Distribution</span>
                <div className="flex items-center gap-5 text-xs">
                  {[["Easy",easy,"text-emerald-400"],["Medium",med,"text-amber-400"],["Hard",hard,"text-red-400"]].map(([l,v,c])=>(
                    <span key={String(l)} className="flex items-center gap-1.5">
                      <span className={`font-black ${c}`}>{v}</span>
                      <span className="text-zinc-600">{l}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="h-2 rounded-full bg-white/4 overflow-hidden flex gap-0.5">
                {[{v:easy,c:"bg-emerald-500"},{v:med,c:"bg-amber-500"},{v:hard,c:"bg-red-500"}].map(({v,c})=>{
                  const w = total > 0 ? (v/total)*100 : 0
                  return w > 0 ? (
                    <motion.div key={c} initial={{width:0}} whileInView={{width:`${w}%`}} viewport={{once:true}}
                      transition={{duration:1.5,ease:"easeOut"}} className={`h-full rounded-sm ${c}`} />
                  ) : null
                })}
              </div>
              {str > 0 && (
                <p className="text-[10px] text-zinc-600 mt-2 flex items-center gap-1">
                  <Flame className="h-3 w-3 text-orange-400" />
                  <span className="text-orange-400 font-bold">{str}-day streak</span>
                  <span className="text-zinc-700 ml-1">on LeetCode</span>
                </p>
              )}
            </motion.div>
          )}

          {/* Codeforces detail */}
          {cf > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🔵</span>
                <span className="text-sm font-bold text-white">Codeforces</span>
              </div>
              <StatRow icon={Trophy} label="Current Rating" value={cf} color="text-blue-300" />
              {cfMax > cf && <StatRow icon={Trophy} label="Max Rating" value={cfMax} color="text-violet-300" />}
              <StatRow icon={Zap} label="Contests" value={cx} color="text-amber-300" />
            </motion.div>
          )}
        </>
      )}

      {/* ══ §5 CODING PROFILES ═══════════════════════════════════════════════ */}
      {platforms.length > 0 && (
        <>
          <Sep label="Coding Profiles" />
          <div className="space-y-3">
            {platforms.map(([pid, pd]: [string, any], i) => {
              const meta = PLATFORM_META[pid] ?? { emoji: "🔗", label: pid, accent: "text-zinc-400", url: () => "#" }
              const s = pd?.stats ?? {}
              const rating  = s.rating ?? s.currentRating ?? 0
              const solved  = s.totalSolved ?? s.problemsSolved ?? 0
              const contribs= s.totalContributions ?? s.contributions ?? 0
              const rank    = s.globalRank ?? s.ranking ?? 0
              const bgs     = Array.isArray(s.badges) ? s.badges.length : 0
              const stats   = [
                rating > 0   && `${rating.toLocaleString()} rating`,
                solved > 0   && `${solved.toLocaleString()} solved`,
                contribs > 0 && `${contribs.toLocaleString()} contributions`,
                rank > 0     && `rank #${rank.toLocaleString()}`,
                bgs > 0      && `${bgs} badges`,
              ].filter(Boolean)

              return (
                <motion.div key={pid}
                  initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="group flex items-center justify-between rounded-2xl border border-white/6 bg-card hover:border-white/12 hover:bg-card/80 transition-all px-5 py-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-2xl shrink-0">{meta.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white">{meta.label}</p>
                      <p className="text-xs text-zinc-600 mt-0.5">@{pd.username}</p>
                    </div>
                    {stats.length > 0 && (
                      <div className="hidden sm:flex items-center gap-2 flex-wrap">
                        {stats.map((stat: any, si) => (
                          <span key={si} className={`text-xs font-semibold ${meta.accent} opacity-80`}>
                            {si > 0 && <span className="text-zinc-700 mr-2">·</span>}{stat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <a href={meta.url(pd.username)} target="_blank" rel="noopener noreferrer"
                    className="shrink-0 p-2 rounded-xl text-zinc-600 hover:text-white hover:bg-white/8 transition-all opacity-0 group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </motion.div>
              )
            })}
          </div>
        </>
      )}

      {/* ══ §6 ACHIEVEMENTS ══════════════════════════════════════════════════ */}
      {badges.length > 0 && (
        <>
          <Sep label="Achievements" />
          <div className="space-y-3">
            {badges.map((b: any, i: number) => (
              <motion.div key={b.n}
                initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`flex items-center gap-4 rounded-2xl border ${b.c} px-5 py-4`}>
                <motion.span
                  animate={{ y: [0, -4, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.7, ease: "easeInOut" }}
                  className="text-2xl select-none shrink-0">
                  {b.e}
                </motion.span>
                <div className="flex-1">
                  <p className="text-sm font-black text-white">{b.n}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{b.s}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* ══ §7 JOURNEY TIMELINE ══════════════════════════════════════════════ */}
      {timeline.length > 0 && (
        <>
          <Sep label="Journey" />
          <div className="relative pl-8">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-violet-500/15 to-transparent" />
            <div className="space-y-3">
              {timeline.map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="group relative">
                  <div className={`absolute -left-8 top-4 w-3 h-3 rounded-full border-2 transition-all duration-200
                    ${item.hot ? "bg-violet-500 border-violet-300 shadow-lg shadow-violet-500/50" : "bg-zinc-900 border-zinc-700 group-hover:border-zinc-500"}`} />
                  <div className="rounded-xl border border-white/5 bg-card/60 hover:bg-card/90 hover:border-white/10 transition-all px-4 py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-base shrink-0">{item.icon}</span>
                      <span className={`text-sm font-semibold ${item.hot ? "text-white" : "text-zinc-400"}`}>{item.text}</span>
                    </div>
                    <span className="text-[10px] text-zinc-700 font-mono shrink-0">{item.year}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ══ §8 EDUCATION ═════════════════════════════════════════════════════ */}
      {(user?.branch || user?.collegeName || user?.collegeCode) && (
        <>
          <Sep label="Education" />
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-center gap-5 rounded-2xl border border-blue-500/15 bg-blue-500/5 px-6 py-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <GraduationCap className="h-7 w-7 text-blue-400" />
            </div>
            <div>
              <p className="text-base font-black text-white">{user?.collegeName || user?.collegeCode || "—"}</p>
              <p className="text-sm text-zinc-400 mt-0.5">{[user?.degree,user?.branch].filter(Boolean).join(" in ") || "—"}</p>
              <div className="flex items-center gap-5 mt-2 text-xs text-zinc-500">
                {user?.graduationYear && <span>Graduating <span className="text-zinc-300 font-semibold">{user.graduationYear}</span></span>}
                {user?.rollNumber && <span>Roll <span className="text-zinc-400">{user.rollNumber}</span></span>}
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* ══ §9 RECRUITER VIEW ════════════════════════════════════════════════ */}
      <>
        <Sep label="For Recruiters" />
        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-2xl border border-violet-500/15 bg-gradient-to-b from-violet-500/5 to-transparent p-6 space-y-1">

          {/* Availability */}
          <StatRow icon={Briefcase} label="Status" value={user?.isOpenToWork ? "🟢 Open to Work" : "⚫ Not looking"} color="text-zinc-300" />
          {user?.location && <StatRow icon={MapPin} label="Location" value={user.location} color="text-zinc-300" />}
          {user?.graduationYear && <StatRow icon={Calendar} label="Available from" value={String(user.graduationYear)} color="text-zinc-300" />}
          {score > 0 && <StatRow icon={Sparkles} label="CodeHiring Score" value={`${score} / 1000`} color="text-violet-300" />}
          {platforms.length > 0 && <StatRow icon={Code2} label="Platforms" value={`${platforms.length} connected`} color="text-zinc-300" />}

          {/* Contact */}
          <div className="pt-4">
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-700 mb-3">Contact</p>
            <div className="space-y-2">
              {[
                { Icon: Mail,     val: user?.email,       href: `mailto:${user?.email}` },
                { Icon: Phone,    val: user?.phone,       href: `tel:${user?.phone}` },
                { Icon: Linkedin, val: "LinkedIn",        href: user?.linkedinUrl },
                { Icon: Github,   val: "GitHub",          href: user?.githubUrl },
                { Icon: Globe,    val: "Portfolio",       href: user?.portfolioUrl },
              ].filter(r => r.val && r.href).map(({ Icon, val, href }) => (
                <a key={String(val)} href={href!} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-xs text-zinc-500 hover:text-violet-400 transition-colors group py-1">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-zinc-700 group-hover:text-violet-400 transition-colors" />
                  <span className="truncate">{String(val)}</span>
                  <ArrowUpRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </>

      {/* ══ §10 ACTIVITY ═════════════════════════════════════════════════════ */}
      {(user?.recentActivity?.length ?? 0) > 0 && (
        <>
          <Sep label="Recent Activity" />
          <div className="space-y-2">
            {(user.recentActivity as any[]).slice(0, 6).map((act, i) => {
              const icons: Record<string,string> = { problem_solved:"⚡", contest:"🏆", contribution:"🌟", rating_change:"📈" }
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-card/50 hover:border-white/10 transition-all px-4 py-3">
                  <span className="text-base shrink-0">{icons[act.type] ?? "📌"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-zinc-300 truncate">{act.title}</p>
                    {act.detail && <p className="text-[10px] text-zinc-600 mt-0.5 truncate">{act.detail}</p>}
                  </div>
                  {act.timestamp && (
                    <span className="text-[10px] text-zinc-700 font-mono shrink-0">
                      {new Date(act.timestamp).toLocaleDateString("en-US",{month:"short",day:"numeric"})}
                    </span>
                  )}
                </motion.div>
              )
            })}
          </div>
        </>
      )}

      {/* ══ COMPLETION NUDGE ═════════════════════════════════════════════════ */}
      {pct < 75 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
          className="mt-10 flex items-center gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4">
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-400">{pct}% complete — strengthen your profile</p>
            <p className="text-xs text-zinc-600 mt-0.5">Add bio, location, social links and connect coding platforms.</p>
          </div>
          <button onClick={onEdit}
            className="shrink-0 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-400 text-xs font-black hover:bg-amber-500/25 transition-colors">
            Complete →
          </button>
        </motion.div>
      )}

      <div className="h-16" />
    </div>
  )
}

// ─── page shell ───────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [editing, setEditing] = useState(false)
  const [form,    setForm]    = useState<any>(null)
  const [saved,   setSaved]   = useState<any>(null)

  useEffect(() => {
    fetch("/api/student/profile")
      .then(r => r.ok ? r.json() : fetch("/api/auth/user").then(r2 => r2.json()))
      .then(d => { if (d.user) { setForm(d.user); setSaved(d.user) } })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    if (!form) return
    setSaving(true)
    try {
      const res  = await fetch("/api/student/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      const data = await res.json()
      if (data.success) { setSaved(form); setEditing(false); toast.success("Saved!") }
      else toast.error(data.error || "Save failed")
    } catch { toast.error("Network error") }
    finally { setSaving(false) }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">

        {/* Edit bar */}
        <AnimatePresence>
          {editing && (
            <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
              className="sticky top-3 z-30 flex items-center justify-between mb-6 px-5 py-3 rounded-2xl border border-white/10 bg-card/90 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-semibold text-foreground">Editing Profile</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => { setForm(saved); setEditing(false) }}
                  className="gap-1.5 border-white/10 text-zinc-400 hover:text-white">
                  <X className="h-3.5 w-3.5" /> Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={saving}
                  className="gap-1.5 bg-violet-600 hover:bg-violet-500 text-white border-0 shadow-lg shadow-violet-500/30">
                  {saving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Saving…</> : <><Save className="h-3.5 w-3.5" />Save</>}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <Loader2 className="w-7 h-7 text-violet-400" />
            </motion.div>
            <p className="text-sm text-zinc-600">Loading your profile…</p>
          </div>
        ) : editing ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <ProfileForm user={form} onChange={setForm} />
          </motion.div>
        ) : (
          <ProfileView user={saved} onEdit={() => setEditing(true)} />
        )}
      </div>
    </div>
  )
}

