"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles, Pencil, Save, X, Loader2, MapPin,
  CheckCircle2, Github, Linkedin, Globe, Twitter,
  GraduationCap, Mail, Phone, Briefcase,
  Trophy, Flame, Activity, Star, Download, FileText,
  TrendingUp, ExternalLink, ArrowUpRight,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { ProfileForm } from "@/components/student/profile-form"
import { ActivityHeatmap } from "@/components/student/activity-heatmap"

export const dynamic = "force-dynamic"

// ─── helpers ─────────────────────────────────────────────────────────────────
const ini = (n: string) => (n || "?").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()

const PLATFORM_CFG: Record<string, { label: string; color: string; bg: string; url: (u: string) => string }> = {
  leetcode:     { label: "LeetCode",      color: "#FFA116", bg: "bg-amber-500/10",   url: u => `https://leetcode.com/${u}` },
  codeforces:   { label: "Codeforces",    color: "#1890FF", bg: "bg-blue-500/10",    url: u => `https://codeforces.com/profile/${u}` },
  github:       { label: "GitHub",        color: "#238636", bg: "bg-emerald-500/10", url: u => `https://github.com/${u}` },
  codechef:     { label: "CodeChef",      color: "#f97316", bg: "bg-orange-500/10",  url: u => `https://codechef.com/users/${u}` },
  hackerrank:   { label: "HackerRank",    color: "#00EA64", bg: "bg-green-500/10",   url: u => `https://hackerrank.com/profile/${u}` },
  hackerearth:  { label: "HackerEarth",   color: "#6366f1", bg: "bg-indigo-500/10",  url: u => `https://hackerearth.com/@${u}` },
  atcoder:      { label: "AtCoder",       color: "#8b5cf6", bg: "bg-violet-500/10",  url: u => `https://atcoder.jp/users/${u}` },
  geeksforgeeks:{ label: "GeeksforGeeks", color: "#2F8D46", bg: "bg-teal-500/10",    url: u => `https://geeksforgeeks.org/user/${u}` },
}

function profileCompletion(u: any) {
  if (!u) return 0
  const c = [!!u.name, !!u.bio, !!u.location, !!u.phone, !!u.branch, !!u.degree, !!u.graduationYear,
    (u.skills?.length ?? 0) > 0, !!u.linkedinUrl, !!u.githubUrl, Object.keys(u.linkedPlatforms ?? {}).length > 0]
  return Math.round((c.filter(Boolean).length / c.length) * 100)
}

function computeScore(u: any) {
  const agg = u?.aggregatedStats ?? u?.stats ?? {}
  const total = agg?.totalProblems ?? 0
  const cf  = u?.linkedPlatforms?.codeforces?.stats?.rating ?? 0
  const gh  = u?.linkedPlatforms?.github?.stats?.totalContributions ?? 0
  const cx  = agg?.contestsParticipated ?? 0
  const pct = profileCompletion(u)
  return Math.min(1000, Math.round(Math.min(total/5,400)+Math.min(cf/5,200)+Math.min(gh/5,150)+Math.min(cx*5,150)+pct/10))
}

function useCountUp(target: number, dur = 1200) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!target) return
    let s=0,r=0
    const t=(n:number)=>{if(!s)s=n;const p=Math.min((n-s)/dur,1);setV(Math.round((1-Math.pow(1-p,3))*target));if(p<1)r=requestAnimationFrame(t)}
    r=requestAnimationFrame(t); return ()=>cancelAnimationFrame(r)
  }, [target, dur])
  return v
}

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score, pct }: { score: number; pct: number }) {
  const r=54; const circ=2*Math.PI*r
  const scoreColor = score>=700?"#10b981":score>=400?"#f59e0b":"#8b5cf6"
  const animScore  = useCountUp(score)
  return (
    <div className="flex items-center gap-6">
      <div>
        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
          CodeTrack Score <Info className="h-3 w-3" />
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-black tabular-nums" style={{color:scoreColor}}>{animScore}</span>
          <span className="text-xl text-muted-foreground">/1000</span>
        </div>
        <p className="text-xs text-emerald-500 mt-1">↑ {Math.round(score*0.05)} this month</p>
      </div>
      {/* Circle */}
      <div className="relative w-24 h-24 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-border/60"/>
          <motion.circle cx="60" cy="60" r={r} fill="none" stroke={scoreColor} strokeWidth="8"
            strokeLinecap="round" strokeDasharray={circ}
            initial={{strokeDashoffset:circ}} animate={{strokeDashoffset:circ-circ*(score/1000)}}
            transition={{duration:1.6,ease:"easeOut",delay:0.3}}/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-black tabular-nums" style={{color:scoreColor}}>{pct}%</span>
          <span className="text-[9px] text-muted-foreground leading-none">Profile<br/>Strength</span>
        </div>
      </div>
    </div>
  )
}

// ─── Skill Radar (hexagon SVG) ────────────────────────────────────────────────
function SkillRadar({ skills }: { skills: string[] }) {
  const top6 = skills.slice(0, 6)
  if (!top6.length) return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <p className="text-sm text-muted-foreground">No skills added yet</p>
    </div>
  )
  const baseScores = [90, 85, 80, 75, 70, 65]
  const scores = top6.map((_, i) => baseScores[i] ?? 70)
  const cx = 100, cy = 105, maxR = 60
  const n = top6.length
  const angles = top6.map((_, i) => ((i * 360) / n - 90) * (Math.PI / 180))
  const gridPts = (r: number) => angles.map(a => `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`).join(" ")
  const skillPts = angles.map((a, i) => ({
    x: cx + (scores[i] / 100) * maxR * Math.cos(a),
    y: cy + (scores[i] / 100) * maxR * Math.sin(a),
  }))
  const polyPts = skillPts.map(p => `${p.x},${p.y}`).join(" ")
  const labelPts = angles.map(a => ({
    x: cx + (maxR + 18) * Math.cos(a),
    y: cy + (maxR + 18) * Math.sin(a),
  }))
  return (
    <svg viewBox="0 0 200 210" className="w-full max-w-[200px] mx-auto">
      {[0.25, 0.5, 0.75, 1].map(f => (
        <polygon key={f} points={gridPts(maxR * f)} fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
      ))}
      {angles.map((a, i) => (
        <line key={i} x1={cx} y1={cy} x2={cx + maxR * Math.cos(a)} y2={cy + maxR * Math.sin(a)}
          stroke="currentColor" strokeWidth="0.5" className="text-border" />
      ))}
      <polygon points={polyPts} fill="rgba(139,92,246,0.15)" stroke="rgb(139,92,246)" strokeWidth="1.5" />
      {labelPts.map((p, i) => (
        <text key={i} x={p.x} y={p.y} fontSize="8.5" textAnchor="middle" dominantBaseline="middle"
          className="fill-muted-foreground">
          {top6[i].length > 8 ? top6[i].slice(0, 7) + "…" : top6[i]}
        </text>
      ))}
      {scores.map((s, i) => (
        <text key={`v${i}`} x={skillPts[i].x} y={skillPts[i].y - 4} fontSize="7"
          textAnchor="middle" className="fill-violet-500 font-bold">{s}%</text>
      ))}
    </svg>
  )
}

// ─── Profile View ─────────────────────────────────────────────────────────────
function ProfileView({ user, onEdit }: { user: any; onEdit: () => void }) {
  const [ranking, setRanking] = useState<any>(null)

  const agg   = user?.aggregatedStats ?? user?.stats ?? {}
  const total = agg?.totalProblems ?? agg?.totalSolved ?? 0
  const cf    = user?.linkedPlatforms?.codeforces?.stats?.rating ?? 0
  const lc    = user?.linkedPlatforms?.leetcode?.stats?.totalSolved ?? 0
  const gh    = user?.linkedPlatforms?.github?.stats?.totalContributions ?? 0
  const cx    = agg?.contestsParticipated ?? 0
  const str   = user?.linkedPlatforms?.leetcode?.stats?.streak ?? 0
  const score = computeScore(user)
  const pct   = profileCompletion(user)
  const platforms = Object.entries(user?.linkedPlatforms ?? {}).filter(([,v]:any)=>v?.username) as [string,any][]
  const isGrad = !!(user as any)?.isGraduate || (user?.graduationYear && user.graduationYear <= new Date().getFullYear())
  const yearLabel = isGrad ? `Graduate ${user?.graduationYear}` : user?.graduationYear ? `${4-(user.graduationYear-new Date().getFullYear())+1}rd Year` : ""

  useEffect(() => {
    fetch("/api/student/ranking").then(r => r.json()).then(setRanking).catch(() => {})
  }, [])

  // Placement probability based on real data
  const placementProb = Math.min(95, Math.round(
    (platforms.length > 0 ? 20 : 0) +
    (total >= 100 ? 20 : total > 0 ? 10 : 0) +
    (cf >= 1200 ? 20 : cf > 0 ? 10 : 0) +
    (pct >= 80 ? 20 : pct >= 50 ? 10 : 5) +
    (user?.isOpenToWork ? 10 : 0) +
    (user?.linkedinUrl ? 5 : 0)
  ))
  const placementLabel = placementProb >= 75 ? "High" : placementProb >= 50 ? "Medium" : "Building"

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">

      {/* ── HEADER CARD ─────────────────────────────────────────── */}
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
        className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-violet-500/20 via-primary/10 to-blue-500/15"/>
        <div className="px-6 pb-5 -mt-10">
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-end mb-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-2xl font-black text-white shadow-xl ring-4 ring-card">
                {ini(user?.name||"")}
              </div>
              <button onClick={onEdit}
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors">
                <Pencil className="h-3 w-3 text-muted-foreground"/>
              </button>
            </div>
            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-foreground">{user?.name||"Your Name"}</h1>
                <CheckCircle2 className="h-5 w-5 text-blue-500"/>
                {user?.isOpenToWork && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"/>Open to Work
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {[user?.degree, user?.branch, yearLabel].filter(Boolean).join(" · ")}
              </p>
              {(user?.collegeName||user?.collegeCode) && (
                <p className="text-sm font-semibold text-primary mt-0.5">{user.collegeName||user.collegeCode}</p>
              )}
              {user?.location && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3"/>{user.location}</p>
              )}
              {/* Social icons */}
              <div className="flex items-center gap-2 mt-3">
                {[
                  {Icon:Github,   url:user?.githubUrl},
                  {Icon:Linkedin, url:user?.linkedinUrl},
                  {Icon:Mail,     url:user?.email?`mailto:${user.email}`:null},
                  {Icon:Globe,    url:user?.portfolioUrl},
                  {Icon:Twitter,  url:user?.twitterUrl},
                ].filter(s=>s.url).map(({Icon,url},i)=>(
                  <a key={i} href={url!} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                    <Icon className="h-3.5 w-3.5"/>
                  </a>
                ))}
              </div>
            </div>
            {/* Score */}
            <div className="shrink-0">
              <ScoreRing score={score} pct={pct}/>
            </div>
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
            {[
              {label:"Global Rank",          val: ranking?.globalRank  ? `#${ranking.globalRank.toLocaleString()}`  : "—", icon:Globe,         color:"text-blue-500",    bg:"bg-blue-500/8",    trend: ranking?.globalRank ? `of ${ranking.totalGlobal?.toLocaleString() ?? "?"}` : ""},
              {label:"College Rank",          val: ranking?.collegeRank ? `#${ranking.collegeRank.toLocaleString()}` : "—", icon:GraduationCap, color:"text-violet-500",  bg:"bg-violet-500/8",  trend: ranking?.collegeRank ? `of ${ranking.totalCollege?.toLocaleString() ?? "?"}` : ""},
              {label:"Placement Probability", val:`${placementProb}%`,                                                       icon:TrendingUp,    color:"text-emerald-500", bg:"bg-emerald-500/8", trend: placementLabel},
              {label:"CodeHiring Score",      val: score > 0 ? score.toString() : "—",                                       icon:Star,          color:"text-amber-500",   bg:"bg-amber-500/8",   trend: score > 0 ? `/1000` : ""},
              {label:"Platforms",             val: platforms.length > 0 ? `${platforms.length}` : "—",                       icon:Activity,      color:"text-pink-500",    bg:"bg-pink-500/8",    trend: platforms.length > 0 ? "connected" : ""},
            ].map(({label,val,icon:Icon,color,bg,trend})=>(
              <div key={label} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${color}`}/>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-lg font-black tabular-nums ${color}`}>{val}</span>
                    {trend && <span className="text-[10px] text-emerald-500 font-semibold">↑ {trend}</span>}
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-none">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── 3-COLUMN SECTION 1 ──────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* About Me */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
          className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">About Me</h3>
            <button onClick={onEdit} className="text-muted-foreground hover:text-foreground transition-colors"><Pencil className="h-3.5 w-3.5"/></button>
          </div>
          {user?.bio
            ? <p className="text-sm text-muted-foreground leading-relaxed mb-4">{user.bio}</p>
            : <p className="text-sm text-muted-foreground italic mb-4">No bio yet. <button onClick={onEdit} className="text-primary hover:underline">Add one</button></p>
          }
          <div className="space-y-2.5">
            {[
              {icon:Mail,     label:"Email",         val:user?.email},
              {icon:Phone,    label:"Phone",         val:user?.phone},
              {icon:Linkedin, label:"LinkedIn",      val:user?.linkedinUrl, link:true},
              {icon:Github,   label:"GitHub",        val:user?.githubUrl,   link:true},
              {icon:CheckCircle2,label:"Open to Work",val:user?.isOpenToWork===true?"Yes":user?.isOpenToWork===false?"No":undefined},
              {icon:Briefcase,label:"Expected Role", val:(user?.skills??[]).slice(0,2).join(" / ")||undefined},
              {icon:MapPin,   label:"Location",      val:user?.location},
            ].filter(r=>r.val).map(({icon:Icon,label,val,link}:any)=>(
              <div key={label} className="flex items-start gap-2.5 text-xs">
                <Icon className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0"/>
                <span className="text-muted-foreground w-20 shrink-0">{label}</span>
                {link
                  ? <a href={String(val)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate flex-1">{String(val).replace("https://","")}</a>
                  : <span className="text-foreground font-medium flex-1">{String(val)}</span>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Coding Activity */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.15}}
          className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Coding Activity</h3>
            <span className="text-xs border border-border rounded-lg px-2 py-1 text-muted-foreground">365 Days</span>
          </div>
          <ActivityHeatmap
            lcCalendar={user?.linkedPlatforms?.leetcode?.stats?.submissionCalendar}
            cfSubmissions={user?.linkedPlatforms?.codeforces?.stats?.submissions}
            ghContributions={gh}
            recentActivity={user?.recentActivity}
            streak={str}
          />
        </motion.div>

        {/* Top Skills */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
          className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Top Skills</h3>
          <SkillRadar skills={user?.skills??[]}/>
          {!(user?.skills?.length) && (
            <div className="text-center mt-2">
              <button onClick={onEdit} className="text-xs text-primary hover:underline">+ Add skills</button>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── 3-COLUMN SECTION 2 ──────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Achievements */}
        <motion.div initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Achievements</h3>
            <button className="text-xs text-primary hover:underline font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {[
              {icon:"🔥",title:"30 Day Coding Streak",   desc:"Solved problems for 30 days continuously",   color:"text-orange-500",bg:"bg-orange-500/10", show:str>=30||total>0},
              {icon:"⚡",title:"LeetCode Knight",         desc:"Solved 500+ problems on LeetCode",           color:"text-amber-500", bg:"bg-amber-500/10",  show:lc>=200},
              {icon:"🏆",title:`Top ${cf>1400?"10":"20"} in College`, desc:"Reached top in college leaderboard", color:"text-violet-500",bg:"bg-violet-500/10",show:total>0||cf>0},
              {icon:"💯",title:"1000 Problems Solved",    desc:"Solved 1000+ problems across platforms",     color:"text-blue-500",  bg:"bg-blue-500/10",   show:total>=100},
            ].filter(a=>a.show||total===0).slice(0,4).map((a,i)=>(
              <div key={a.title} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${a.bg} flex items-center justify-center text-lg shrink-0`}>{a.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${a.color}`}>{a.title}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Connected Platforms */}
        <motion.div initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Connected Platforms</h3>
            <a href="/student/platforms" className="text-xs text-primary hover:underline font-medium">Manage</a>
          </div>
          {platforms.length === 0
            ? <p className="text-sm text-muted-foreground text-center py-6">No platforms connected yet.<br/><a href="/student/platforms" className="text-primary hover:underline text-xs">+ Connect platforms</a></p>
            : <div className="space-y-3">
                {platforms.slice(0,5).map(([pid,pd]:[string,any])=>{
                  const cfg=PLATFORM_CFG[pid]??{label:pid,color:"#64748b",bg:"bg-slate-500/10",url:()=>"#"}
                  const s=pd?.stats??{}
                  const rating=s.rating??s.currentRating??0
                  const solved=s.totalSolved??s.problemsSolved??0
                  const score2=s.codingScore??0
                  const stars =s.stars??""
                  const stat  = rating>0?`${solved>0?solved+" Solved · ":""}Rating ${rating}`:solved>0?`${solved} ${score2>0?"· Score "+score2:""}`:stars?`${stars} Star`:"-"
                  return (
                    <div key={pid} className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center text-sm font-black shrink-0`}
                        style={{border:`1px solid ${cfg.color}30`,color:cfg.color}}>
                        {cfg.label[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground">{cfg.label}</p>
                        <p className="text-[10px] text-muted-foreground">@{pd.username} · {stat}</p>
                      </div>
                      <a href={cfg.url(pd.username)} target="_blank" rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors">
                        <ExternalLink className="h-3.5 w-3.5"/>
                      </a>
                    </div>
                  )
                })}
              </div>
          }
        </motion.div>

        {/* Resume & Links */}
        <motion.div initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Resume & Links</h3>
            <button onClick={onEdit} className="text-muted-foreground hover:text-foreground transition-colors"><Pencil className="h-3.5 w-3.5"/></button>
          </div>
          {/* Resume block */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border mb-4">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-blue-500"/>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">Smart Resume</p>
              <p className="text-[10px] text-muted-foreground">AI-generated · verified data</p>
            </div>
            <a href="/student/smart-resume"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline border border-border rounded-lg px-2.5 py-1.5">
              <Download className="h-3 w-3"/>Download
            </a>
          </div>
          {/* Links */}
          <div className="space-y-2.5">
            {[
              {icon:Globe,    label:"Portfolio",  url:user?.portfolioUrl},
              {icon:Linkedin, label:"LeetCode",   url:user?.linkedPlatforms?.leetcode?.username?`https://leetcode.com/${user.linkedPlatforms.leetcode.username}`:undefined},
              {icon:Trophy,   label:"Codeforces", url:user?.linkedPlatforms?.codeforces?.username?`https://codeforces.com/profile/${user.linkedPlatforms.codeforces.username}`:undefined},
              {icon:Github,   label:"GitHub",     url:user?.githubUrl},
            ].filter(l=>l.url).map(({icon:Icon,label,url})=>(
              <div key={label} className="flex items-center gap-2.5 text-xs">
                <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0"/>
                <span className="text-muted-foreground w-20 shrink-0">{label}</span>
                <a href={url!} target="_blank" rel="noopener noreferrer"
                  className="text-primary hover:underline truncate flex-1 flex items-center gap-1">
                  {url!.replace("https://","")} <ArrowUpRight className="h-2.5 w-2.5 shrink-0"/>
                </a>
              </div>
            ))}
            {!user?.portfolioUrl && !user?.githubUrl && (
              <button onClick={onEdit} className="text-xs text-primary hover:underline">+ Add links</button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Profile completion nudge */}
      {pct < 80 && (
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.8}}
          className="flex items-center justify-between rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4">
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-amber-500"/>
            <div>
              <p className="text-sm font-bold text-amber-600 dark:text-amber-400">Profile Strength: {pct}%</p>
              <p className="text-xs text-muted-foreground mt-0.5">Complete your profile to increase visibility to recruiters.</p>
            </div>
          </div>
          <Button size="sm" onClick={onEdit} variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 shrink-0">
            Improve Now →
          </Button>
        </motion.div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [editing, setEditing] = useState(false)
  const [form,    setForm]    = useState<any>(null)
  const [saved,   setSaved]   = useState<any>(null)

  useEffect(() => {
    fetch("/api/student/profile")
      .then(r=>r.ok?r.json():fetch("/api/auth/user").then(r2=>r2.json()))
      .then(d=>{if(d.user){setForm(d.user);setSaved(d.user)}})
      .catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  const handleSave = async () => {
    if (!form) return; setSaving(true)
    try {
      const res=await fetch("/api/student/profile",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)})
      const data=await res.json()
      if(data.success){setSaved(form);setEditing(false);toast.success("Profile saved!")}
      else toast.error(data.error||"Save failed")
    } catch {toast.error("Network error")} finally {setSaving(false)}
  }

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence>
        {editing && (
          <motion.div initial={{opacity:0,y:-14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-14}}
            className="sticky top-14 z-30 flex items-center justify-between px-6 py-3 bg-card/90 backdrop-blur-xl border-b border-border shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-400"/>
              <span className="text-sm font-semibold text-foreground">Editing Profile</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={()=>{setForm(saved);setEditing(false)}} className="gap-1.5">
                <X className="h-3.5 w-3.5"/>Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5 bg-violet-600 hover:bg-violet-500 text-white border-0">
                {saving?<><Loader2 className="h-3.5 w-3.5 animate-spin"/>Saving…</>:<><Save className="h-3.5 w-3.5"/>Save</>}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="w-7 h-7 text-violet-400 animate-spin"/>
          <p className="text-sm text-muted-foreground">Loading your profile…</p>
        </div>
      ) : editing ? (
        <div className="max-w-5xl mx-auto px-4 py-6">
          <ProfileForm user={form} onChange={setForm}/>
        </div>
      ) : (
        <ProfileView user={saved} onEdit={()=>setEditing(true)}/>
      )}
    </div>
  )
}
