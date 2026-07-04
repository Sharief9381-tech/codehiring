"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Pencil, Save, X, Loader2, MapPin, Github, Linkedin, Globe, Twitter,
  GraduationCap, Mail, Trophy, Activity, Star, TrendingUp, ExternalLink,
  Plus, Sparkles, FileText, Zap, Award, Code2, Building2, ChevronRight,
  Download, BookOpen, Briefcase, Languages, Target, ShieldCheck, Layers,
  Database, Cloud, Wrench, Brain, Monitor, GitBranch, AlignLeft, Calendar,
  Hash, Clock, Info, ArrowLeft, Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { computeCodeHiringScore } from "@/lib/score"
import Link from "next/link"

// ── Types ──────────────────────────────────────────────────────────────────────

interface Project { id:string;title:string;description:string;techStack:string[];githubUrl?:string;liveUrl?:string;imageUrl?:string;status:"completed"|"in-progress"|"planned" }
interface Certification { id:string;name:string;organization:string;issueDate:string;credentialUrl?:string }
interface Internship { id:string;company:string;role:string;duration:string;description:string;skills:string[] }
interface Achievement { id:string;title:string;description:string;date?:string;category:string }
interface SkillCategories { languages:string[];frameworks:string[];databases:string[];cloud:string[];devops:string[];aiml:string[];tools:string[];os:string[];core:string[] }

// ── Helpers ────────────────────────────────────────────────────────────────────

const ini = (n:string) => (n||"?").split(" ").map((w:string)=>w[0]).join("").slice(0,2).toUpperCase()

const PCFG: Record<string,{label:string;color:string;bg:string;icon:string;url:(u:string)=>string}> = {
  leetcode:      {label:"LeetCode",      color:"#FFA116",bg:"bg-amber-500/10",  icon:"⚡",url:u=>`https://leetcode.com/${u}`},
  codeforces:    {label:"Codeforces",    color:"#1890FF",bg:"bg-blue-500/10",   icon:"🔵",url:u=>`https://codeforces.com/profile/${u}`},
  github:        {label:"GitHub",        color:"#58a6ff",bg:"bg-sky-500/10",    icon:"🐙",url:u=>`https://github.com/${u}`},
  codechef:      {label:"CodeChef",      color:"#f97316",bg:"bg-orange-500/10", icon:"👨‍🍳",url:u=>`https://codechef.com/users/${u}`},
  hackerrank:    {label:"HackerRank",    color:"#00EA64",bg:"bg-green-500/10",  icon:"🟩",url:u=>`https://hackerrank.com/profile/${u}`},
  hackerearth:   {label:"HackerEarth",   color:"#6366f1",bg:"bg-indigo-500/10", icon:"🌍",url:u=>`https://hackerearth.com/@${u}`},
  atcoder:       {label:"AtCoder",       color:"#8b5cf6",bg:"bg-violet-500/10", icon:"🔮",url:u=>`https://atcoder.jp/users/${u}`},
  geeksforgeeks: {label:"GeeksforGeeks", color:"#2F8D46",bg:"bg-teal-500/10",   icon:"🌿",url:u=>`https://geeksforgeeks.org/user/${u}`},
}

function useCountUp(target:number,dur=1200){
  const [v,setV]=useState(0)
  useEffect(()=>{if(!target)return;let s=0;const r=(n:number)=>{if(!s)s=n;const p=Math.min((n-s)/dur,1);setV(Math.round((1-Math.pow(1-p,3))*target));if(p<1)requestAnimationFrame(r)};requestAnimationFrame(r)},[target])
  return v
}

function getYearLabel(u:any){
  const gy=u?.graduationYear;if(!gy)return""
  const now=new Date().getFullYear()
  if(gy<=now)return`Graduate ${gy}`
  const yr=4-(gy-now)+1
  return`${yr<=1?"1st":yr===2?"2nd":yr===3?"3rd":"4th"} Year`
}

const ipt = "w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
const lbl = "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block"
const fade={hidden:{opacity:0,y:10},show:{opacity:1,y:0,transition:{duration:0.25}}}
const stagger={show:{transition:{staggerChildren:0.04}}}

// ── Score Ring ─────────────────────────────────────────────────────────────────

function ScoreRing({score}:{score:number}){
  const r=40,circ=2*Math.PI*r
  const col=score>=700?"#10b981":score>=400?"#f59e0b":"#8b5cf6"
  const lbl=score>=700?"Excellent":score>=400?"Good":"Building"
  const anim=useCountUp(score)
  return(
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="6" className="text-border"/>
          <motion.circle cx="50" cy="50" r={r} fill="none" stroke={col} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circ} initial={{strokeDashoffset:circ}}
            animate={{strokeDashoffset:circ-circ*(score/1000)}}
            transition={{duration:1.5,ease:"easeOut",delay:0.2}}/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black tabular-nums" style={{color:col}}>{anim}</span>
          <span className="text-xs text-muted-foreground">/1000</span>
        </div>
      </div>
      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:col+"20",color:col}}>{lbl}</span>
    </div>
  )
}

// ── Inline Edit Wrapper ────────────────────────────────────────────────────────
// Each section manages its own edit state. onSave receives the partial update.

function InlineSec({title,icon:Icon,color,bg,children,editContent,onSave,saving,action}:{
  title:string;icon:any;color:string;bg:string;children:React.ReactNode
  editContent?:React.ReactNode;onSave?:()=>Promise<void>;saving?:boolean;action?:React.ReactNode
}){
  const [editing,setEditing]=useState(false)
  return(
    <motion.div variants={fade} className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
            <Icon className={`h-3.5 w-3.5 ${color}`}/>
          </div>
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
        </div>
        <div className="flex items-center gap-1.5">
          {action}
          {editContent&&(editing
            ? <>
                <button onClick={()=>setEditing(false)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg hover:bg-muted transition-colors">
                  <X className="h-3.5 w-3.5"/>Cancel
                </button>
                <button onClick={async()=>{if(onSave){await onSave()};setEditing(false)}}
                  disabled={saving} className="flex items-center gap-1 text-xs text-white bg-primary hover:bg-primary/90 px-3 py-1 rounded-lg font-semibold transition-colors disabled:opacity-60">
                  {saving?<Loader2 className="h-3.5 w-3.5 animate-spin"/>:<Check className="h-3.5 w-3.5"/>}Save
                </button>
              </>
            : <button onClick={()=>setEditing(true)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary px-2 py-1 rounded-lg hover:bg-muted transition-colors font-medium">
                <Pencil className="h-3.5 w-3.5"/>Edit
              </button>
          )}
        </div>
      </div>
      <div className="p-4">
        <AnimatePresence mode="wait">
          {editing&&editContent
            ? <motion.div key="edit" initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}} transition={{duration:0.15}}>
                {editContent}
              </motion.div>
            : <motion.div key="view" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.15}}>
                {children}
              </motion.div>
          }
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ── Empty State ────────────────────────────────────────────────────────────────

function Empty({icon:Icon,label,action,onAction}:{icon:any;label:string;action?:string;onAction?:()=>void}){
  return(
    <div className="flex flex-col items-center justify-center py-6 gap-2 text-center">
      <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
        <Icon className="h-4 w-4 text-muted-foreground/30"/>
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      {action&&onAction&&<button onClick={onAction} className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline"><Plus className="h-3.5 w-3.5"/>{action}</button>}
    </div>
  )
}

// ── Skills section ─────────────────────────────────────────────────────────────

const CAT_CFG=[
  {key:"languages", label:"Languages",   icon:Code2,    color:"text-violet-500", bg:"bg-violet-500/10"},
  {key:"frameworks",label:"Frameworks",  icon:Layers,   color:"text-blue-500",   bg:"bg-blue-500/10"},
  {key:"databases", label:"Databases",   icon:Database, color:"text-emerald-500",bg:"bg-emerald-500/10"},
  {key:"cloud",     label:"Cloud",       icon:Cloud,    color:"text-sky-500",    bg:"bg-sky-500/10"},
  {key:"devops",    label:"DevOps",      icon:GitBranch,color:"text-orange-500", bg:"bg-orange-500/10"},
  {key:"aiml",      label:"AI/ML",       icon:Brain,    color:"text-pink-500",   bg:"bg-pink-500/10"},
  {key:"tools",     label:"Tools",       icon:Wrench,   color:"text-amber-500",  bg:"bg-amber-500/10"},
  {key:"os",        label:"OS",          icon:Monitor,  color:"text-teal-500",   bg:"bg-teal-500/10"},
  {key:"core",      label:"Core Subjects",icon:BookOpen,color:"text-indigo-500", bg:"bg-indigo-500/10"},
]

function SkillChips({skills}:{skills:string[]}){
  const COLS=["bg-violet-500/10 text-violet-500 border-violet-500/20","bg-blue-500/10 text-blue-500 border-blue-500/20","bg-emerald-500/10 text-emerald-500 border-emerald-500/20","bg-amber-500/10 text-amber-500 border-amber-500/20","bg-pink-500/10 text-pink-500 border-pink-500/20"]
  return(
    <div className="flex flex-wrap gap-1.5">
      {skills.map((s,i)=><span key={s} className={`text-xs font-semibold px-3 py-1 rounded-lg border ${COLS[i%5]}`}>{s}</span>)}
    </div>
  )
}

// ── Platform Row ───────────────────────────────────────────────────────────────

function PlatformRow({pid,pd}:{pid:string;pd:any}){
  const cfg=PCFG[pid]??{label:pid,color:"#64748b",bg:"bg-slate-500/10",icon:"🔗",url:()=>"#"}
  const s=pd?.stats??{}
  const solved=s.totalSolved??s.problemsSolved??0
  const rating=s.rating??s.currentRating??0
  const stat=rating>0?`${solved>0?solved+" · ":""}Rating ${rating}`:solved>0?`${solved} Solved`:"-"
  return(
    <div className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border hover:border-primary/20 hover:bg-muted/20 transition-all group"
      style={{borderLeftColor:cfg.color+"55",borderLeftWidth:"3px"}}>
      <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center text-sm shrink-0`}>{cfg.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-base font-bold text-foreground">{cfg.label}</p>
        <p className="text-sm text-muted-foreground">@{pd.username} · {stat}</p>
      </div>
      <a href={cfg.url(pd.username)} target="_blank" rel="noopener noreferrer"
        className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-all shrink-0">
        <ExternalLink className="h-3.5 w-3.5"/>
      </a>
    </div>
  )
}

// ── Project Card ───────────────────────────────────────────────────────────────

function ProjectCard({p}:{p:Project}){
  const sc={completed:"bg-emerald-500/10 text-emerald-500","in-progress":"bg-amber-500/10 text-amber-500",planned:"bg-blue-500/10 text-blue-500"}
  return(
    <div className="rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all overflow-hidden group">
      <div className="h-20 bg-gradient-to-br from-primary/10 to-violet-500/10 flex items-center justify-center overflow-hidden">
        {p.imageUrl?<img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>:<Code2 className="h-7 w-7 text-primary/20"/>}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-1">
          <p className="text-sm font-bold text-foreground">{p.title}</p>
          <Badge className={`text-xs shrink-0 ${sc[p.status]}`}>{p.status.replace("-"," ")}</Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {p.techStack.slice(0,3).map(t=><span key={t} className="text-xs px-2 py-0.5 rounded bg-muted/60 text-muted-foreground">{t}</span>)}
          {p.techStack.length>3&&<span className="text-xs px-2 py-0.5 rounded bg-muted/60 text-muted-foreground">+{p.techStack.length-3}</span>}
        </div>
        <div className="flex gap-3">
          {p.githubUrl&&<a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><Github className="h-3 w-3"/>Code</a>}
          {p.liveUrl&&<a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline"><Globe className="h-3 w-3"/>Live</a>}
        </div>
      </div>
    </div>
  )
}

// ── Placement Readiness ────────────────────────────────────────────────────────

function PlacementReadiness({user,score}:{user:any;score:number}){
  const lp=user?.linkedPlatforms??{}
  const total=Object.values(lp).reduce((s:number,pd:any)=>{const st=pd?.stats??{};return s+(st.totalSolved||st.problemsSolved||0)},0)
  const hasResume=!!(user?.resumeFile||user?.resumeUrl)
  const skillCount=user?.skills?.length??0
  const pct=Math.round([!!(user?.name&&user?.bio),hasResume,!!(user?.projects?.length),!!(user?.certifications?.length),!!(Object.keys(lp).length),skillCount>0,!!(user?.cgpa||user?.branch),!!user?.linkedinUrl].filter(Boolean).length/8*100)
  const meters=[
    {label:"Resume",        value:hasResume?Math.min(100,pct+10):20,           color:"bg-blue-500"},
    {label:"Skills",        value:Math.min(100,skillCount*10),                  color:"bg-violet-500"},
    {label:"Coding",        value:Math.min(100,Math.round(score/10)),           color:"bg-amber-500"},
    {label:"Aptitude",      value:Math.min(100,total>0?Math.min(100,Math.round(total/5)):30),color:"bg-emerald-500"},
    {label:"Profile",       value:pct,                                           color:"bg-pink-500"},
  ]
  const overall=Math.round(meters.reduce((s,m)=>s+m.value,0)/meters.length)
  const oCol=overall>=75?"text-emerald-500":overall>=50?"text-amber-500":"text-blue-500"
  return(
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-primary/5 to-violet-500/5 border border-primary/15">
        <div>
          <p className="text-xs text-muted-foreground">Overall Readiness</p>
          <p className={`text-3xl font-black ${oCol}`}>{overall}%</p>
          <p className="text-xs text-muted-foreground">{overall>=75?"Placement ready 🎉":overall>=50?"Getting there 💪":"Keep building 🚀"}</p>
        </div>
        <ScoreRing score={score}/>
      </div>
      <div className="space-y-2">
        {meters.map(m=>(
          <div key={m.label}>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-foreground">{m.label}</span>
              <span className="text-sm font-bold text-muted-foreground">{m.value}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div className={`h-full rounded-full ${m.color}`}
                initial={{width:0}} whileInView={{width:`${m.value}%`}} viewport={{once:true}}
                transition={{duration:1,ease:"easeOut"}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── AI Suggestions ─────────────────────────────────────────────────────────────

function AISuggestions({user}:{user:any}){
  const lp=user?.linkedPlatforms??{}
  const s:any[]=[]
  if(!user?.resumeFile&&!user?.resumeUrl) s.push({icon:"📄",text:"Upload your resume",p:"high"})
  if(!Object.keys(lp).length)            s.push({icon:"💻",text:"Connect coding profiles",p:"high"})
  if(!user?.skills?.length)              s.push({icon:"🛠️",text:"Add technical skills",p:"high"})
  if(!user?.bio)                         s.push({icon:"✍️",text:"Write a professional summary",p:"medium"})
  if(!user?.projects?.length)            s.push({icon:"🚀",text:"Showcase 3+ projects",p:"medium"})
  if(!user?.certifications?.length)      s.push({icon:"🏅",text:"Add certifications",p:"medium"})
  if(!user?.cgpa)                        s.push({icon:"🎓",text:"Add academic details",p:"low"})
  if(!user?.linkedinUrl)                 s.push({icon:"💼",text:"Connect LinkedIn",p:"low"})
  if(!s.length)return<div className="text-center py-4"><p className="text-sm font-semibold text-emerald-500">🎉 Profile looks great!</p></div>
  const col:Record<string,string>={high:"bg-red-500/10 text-red-500 border-red-500/20",medium:"bg-amber-500/10 text-amber-500 border-amber-500/20",low:"bg-blue-500/10 text-blue-500 border-blue-500/20"}
  return(
    <div className="space-y-1.5">
      {s.slice(0,5).map((item,i)=>(
        <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-muted/30 border border-border/40">
          <span className="text-sm shrink-0">{item.icon}</span>
          <p className="text-sm text-foreground flex-1">{item.text}</p>
          <Badge className={`text-xs shrink-0 ${col[item.p]}`}>{item.p}</Badge>
        </div>
      ))}
    </div>
  )
}

// ── Main ProfileClient ─────────────────────────────────────────────────────────

export function ProfileClient({initialUser}:{initialUser:any}){
  const router=useRouter()
  const [user,setUser]=useState<any>(initialUser)
  const [saving,setSaving]=useState(false)

  // Generic save — merges partial updates into user state then PATCHes
  const save=async(updates:Record<string,any>)=>{
    setSaving(true)
    try{
      const res=await fetch("/api/student/profile",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(updates)})
      const data=await res.json()
      if(data.success){
        setUser((u:any)=>({...u,...updates}))
        toast.success("Saved!")
        router.refresh()
      }else toast.error(data.error||"Save failed")
    }catch{toast.error("Network error")}
    finally{setSaving(false)}
  }

  const lp=user?.linkedPlatforms??{}
  const platforms=Object.entries(lp).filter(([,v]:any)=>v?.username) as [string,any][]
  const score=computeCodeHiringScore(user)
  const yearLabel=getYearLabel(user)
  const projects:Project[]=user?.projects??[]
  const certs:any[]=user?.certifications??[]
  const internships:any[]=user?.internships??[]
  const achievements:any[]=user?.extraAchievements??[]
  const langs:string[]=user?.languages?.length?user.languages:["English"]
  const [ranking,setRanking]=useState<any>(null)
  useEffect(()=>{fetch("/api/student/ranking").then(r=>r.json()).then(setRanking).catch(()=>{})},[])

  // Per-section local form states
  const [bioForm,setBioForm]=useState(user?.bio||"")
  const [headlineForm,setHeadlineForm]=useState(user?.headline||"")
  const [infoForm,setInfoForm]=useState({name:user?.name||"",phone:user?.phone||"",location:user?.location||"",linkedinUrl:user?.linkedinUrl||"",githubUrl:user?.githubUrl||"",portfolioUrl:user?.portfolioUrl||"",twitterUrl:user?.twitterUrl||""})
  const [acadForm,setAcadForm]=useState({collegeName:user?.collegeName||"",university:user?.university||"",branch:user?.branch||"",degree:user?.degree||"",cgpa:user?.cgpa||"",interPercentage:user?.interPercentage||"",sscPercentage:user?.sscPercentage||""})
  const [skillForm,setSkillForm]=useState((user?.skills||[]).join(", "))
  const [langForm,setLangForm]=useState(langs.join(", "))

  const total=platforms.reduce((s,[,pd])=>{const st=pd?.stats??{};return s+(st.totalSolved||st.problemsSolved||0)},0)
  const ghC=lp.github?.stats?.totalContributions??0
  const cf=lp.codeforces?.stats?.rating??0

  return(
    <div className="flex flex-col bg-background" style={{height:"calc(100vh - 56px)"}}>

      {/* ── TOP BAR ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-card/80 backdrop-blur shrink-0 z-10">
        <button onClick={()=>router.back()}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-medium transition-colors px-2.5 py-1.5 rounded-xl hover:bg-muted">
          <ArrowLeft className="h-4 w-4"/>Back
        </button>
        <div className="h-4 w-px bg-border"/>
        <p className="text-base font-bold text-foreground">My Profile</p>
        <div className="ml-auto flex items-center gap-2">
          {(user?.resumeFile||user?.resumeUrl)&&(
            <a href={user.resumeUrl||"/student/resume"} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-xl font-semibold transition-colors">
              <Download className="h-4 w-4"/>Resume
            </a>
          )}
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ───────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full px-3 sm:px-4 py-4 space-y-3">

          {/* HERO CARD */}
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
            className="rounded-2xl border border-border bg-card overflow-hidden shadow-md">
            <div className="h-24 sm:h-32 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/25 via-blue-600/15 to-emerald-500/15"/>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_100%_at_20%_0%,rgba(139,92,246,0.2),transparent)]"/>
            </div>
            <div className="px-4 sm:px-6 pb-4">
              <div className="flex flex-col sm:flex-row gap-3 -mt-10 sm:-mt-12 items-start">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-18 h-18 sm:w-22 sm:h-22 w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-blue-600 flex items-center justify-center text-xl font-black text-white shadow-xl ring-4 ring-card">
                    {ini(user?.name||"")}
                  </div>
                  {user?.isOpenToWork&&<div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-white animate-pulse"/>Hiring</div>}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                    <h1 className="text-3xl sm:text-4xl font-black text-foreground">{user?.name||"Student Name"}</h1>
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1 text-xs"><ShieldCheck className="h-3 w-3"/>Verified</Badge>
                    {user?.isOpenToWork&&<Badge className="bg-violet-500/10 text-violet-500 border-violet-500/20 gap-1 text-xs"><Zap className="h-3 w-3"/>Open to Work</Badge>}
                  </div>
                  {user?.headline&&<p className="text-base text-muted-foreground mb-0.5">{user.headline}</p>}
                  <p className="text-base text-muted-foreground">{[user?.degree,user?.branch,yearLabel].filter(Boolean).join(" · ")}</p>
                  {(user?.collegeName||user?.collegeCode)&&<p className="text-sm font-bold text-primary flex items-center gap-1 mt-0.5"><Building2 className="h-3.5 w-3.5"/>{user.collegeName||user.collegeCode}</p>}
                  {user?.location&&<p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3"/>{user.location}</p>}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {[{Icon:Github,url:user?.githubUrl},{Icon:Linkedin,url:user?.linkedinUrl},{Icon:Globe,url:user?.portfolioUrl},{Icon:Twitter,url:user?.twitterUrl},{Icon:Mail,url:user?.email?`mailto:${user.email}`:null}]
                      .filter(s=>s.url).map(({Icon,url},i)=>(
                        <a key={i} href={url!} target="_blank" rel="noopener noreferrer"
                          className="w-6 h-6 rounded-lg border border-border bg-muted/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all">
                          <Icon className="h-3 w-3"/>
                        </a>
                      ))}
                  </div>
                </div>
                {/* Score ring */}
                <div className="hidden sm:flex flex-col items-center pt-1 shrink-0">
                  <p className="text-xs text-muted-foreground mb-1">CodeHiring Score</p>
                  <ScoreRing score={score}/>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-6 gap-1.5 mt-3 pt-3 border-t border-border/50">
                {[
                  {label:"Problems",  val:total,           color:"text-violet-500", bg:"bg-violet-500/10", icon:Code2},
                  {label:"GitHub",    val:ghC,             color:"text-emerald-500",bg:"bg-emerald-500/10",icon:GitBranch},
                  {label:"Rating",    val:cf||"—",         color:"text-amber-500",  bg:"bg-amber-500/10",  icon:Star},
                  {label:"Platforms", val:platforms.length,color:"text-pink-500",   bg:"bg-pink-500/10",   icon:Activity},
                  {label:"Projects",  val:projects.length, color:"text-blue-500",   bg:"bg-blue-500/10",   icon:Layers},
                  {label:"Certs",     val:certs.length,    color:"text-orange-500", bg:"bg-orange-500/10", icon:Award},
                ].map(s=>(
                  <div key={s.label} className={`flex flex-col items-center gap-1 py-2 rounded-xl ${s.bg}`}>
                    <s.icon className={`h-3.5 w-3.5 ${s.color}`}/>
                    <p className={`text-sm font-black tabular-nums ${s.color}`}>{s.val||"—"}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RANK CARDS */}
          {ranking&&(
            <div className="grid grid-cols-2 gap-3">
              {[
                {icon:Globe,    label:"Global Rank", val:ranking.globalRank?`#${ranking.globalRank}`:"—", sub:ranking.totalGlobal?`of ${ranking.totalGlobal}`:"",color:"text-blue-500",  bg:"bg-blue-500/10"},
                {icon:Building2,label:"College Rank",val:ranking.collegeRank?`#${ranking.collegeRank}`:"—",sub:ranking.totalCollege?`of ${ranking.totalCollege}`:"",color:"text-violet-500",bg:"bg-violet-500/10"},
              ].map(r=>(
                <div key={r.label} className="flex items-center gap-3 p-3.5 rounded-2xl border border-border bg-card">
                  <div className={`w-10 h-10 rounded-xl ${r.bg} flex items-center justify-center shrink-0`}><r.icon className={`h-5 w-5 ${r.color}`}/></div>
                  <div>
                    <p className={`text-xl font-black ${r.color}`}>{r.val}</p>
                    <p className="text-xs font-semibold text-foreground">{r.label}</p>
                    <p className="text-xs text-muted-foreground">{r.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MAIN 3-COL GRID */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">

            {/* ABOUT */}
            <InlineSec title="About" icon={AlignLeft} color="text-violet-500" bg="bg-violet-500/10" onSave={()=>save({bio:bioForm,headline:headlineForm})} saving={saving}
              editContent={
                <div className="space-y-3">
                  <div><label className={lbl}>Headline</label><input className={ipt} value={headlineForm} onChange={e=>setHeadlineForm(e.target.value)} placeholder="e.g. Full Stack Developer · IIT Delhi"/></div>
                  <div><label className={lbl}>Summary</label><textarea className={ipt+" resize-none"} rows={4} value={bioForm} onChange={e=>setBioForm(e.target.value)} placeholder="Write a brief professional summary..."/></div>
                </div>}>
              {user?.bio||user?.headline
                ? <div className="space-y-2">
                    {user?.headline&&<p className="text-sm font-semibold text-primary">{user.headline}</p>}
                    {user?.bio&&<p className="text-sm text-muted-foreground leading-relaxed">{user.bio}</p>}
                  </div>
                : <Empty icon={AlignLeft} label="No summary yet."/>}
            </InlineSec>

            {/* CONTACT & LINKS */}
            <InlineSec title="Contact & Links" icon={Mail} color="text-blue-500" bg="bg-blue-500/10" onSave={()=>save(infoForm)} saving={saving}
              editContent={
                <div className="space-y-2">
                  {([["name","Full Name",user?.name],["phone","Phone",""],["location","Location",""],["linkedinUrl","LinkedIn URL",""],["githubUrl","GitHub URL",""],["portfolioUrl","Portfolio URL",""],["twitterUrl","Twitter URL",""]]) .map(([k,label])=>(
                    <div key={k}><label className={lbl}>{label as string}</label>
                      <input className={ipt} value={(infoForm as any)[k]} onChange={e=>setInfoForm(f=>({...f,[k]:e.target.value}))} placeholder={label as string}/>
                    </div>
                  ))}
                </div>}>
              <div className="space-y-1.5">
                {[
                  {icon:Mail,  label:"Email",     val:user?.email},
                  {icon:Globe, label:"Phone",      val:user?.phone},
                  {icon:MapPin,label:"Location",   val:user?.location},
                  {icon:Linkedin,label:"LinkedIn", val:user?.linkedinUrl,link:true},
                  {icon:Github, label:"GitHub",    val:user?.githubUrl,link:true},
                  {icon:Globe,  label:"Portfolio", val:user?.portfolioUrl,link:true},
                ].filter(r=>r.val).map(({icon:Icon,label,val,link})=>(
                  <div key={label} className="flex items-center gap-2 text-base">
                    <Icon className="h-3 w-3 text-muted-foreground shrink-0"/>
                    <span className="text-muted-foreground w-16 shrink-0">{label}</span>
                    {link?<a href={String(val)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">{String(val).replace(/^https?:\/\//,"")}</a>
                         :<span className="text-foreground font-medium">{String(val)}</span>}
                  </div>
                ))}
              </div>
            </InlineSec>

            {/* ACADEMIC */}
            <InlineSec title="Academic Details" icon={GraduationCap} color="text-blue-500" bg="bg-blue-500/10" onSave={()=>save(acadForm)} saving={saving}
              editContent={
                <div className="grid grid-cols-2 gap-2">
                  {([["collegeName","College"],["university","University"],["branch","Branch"],["degree","Degree"],["cgpa","CGPA"],["interPercentage","Inter %"],["sscPercentage","SSC %"]]).map(([k,label])=>(
                    <div key={k}><label className={lbl}>{label}</label>
                      <input className={ipt} value={(acadForm as any)[k]} onChange={e=>setAcadForm(f=>({...f,[k]:e.target.value}))} placeholder={label}/>
                    </div>
                  ))}
                </div>}>
              {!user?.branch&&!user?.cgpa
                ? <Empty icon={GraduationCap} label="No academic details added."/>
                : <div className="grid grid-cols-2 gap-1.5">
                    {[
                      {icon:Building2,    label:"College",   val:user?.collegeName||user?.collegeCode},
                      {icon:BookOpen,     label:"University",val:user?.university},
                      {icon:Hash,         label:"Branch",    val:user?.branch},
                      {icon:GraduationCap,label:"Degree",    val:user?.degree},
                      {icon:Star,         label:"CGPA",      val:user?.cgpa},
                      {icon:TrendingUp,   label:"Inter %",   val:user?.interPercentage?`${user.interPercentage}%`:undefined},
                      {icon:TrendingUp,   label:"SSC %",     val:user?.sscPercentage?`${user.sscPercentage}%`:undefined},
                      {icon:Calendar,     label:"Graduation",val:user?.graduationYear},
                    ].filter(r=>r.val).map(({icon:Icon,label,val})=>(
                      <div key={label} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                        <Icon className="h-3 w-3 text-muted-foreground shrink-0"/>
                        <div className="min-w-0"><p className="text-xs text-muted-foreground font-medium">{label}</p><p className="text-sm font-semibold text-foreground truncate">{String(val)}</p></div>
                      </div>
                    ))}
                  </div>
              }
            </InlineSec>

            {/* SKILLS */}
            <InlineSec title="Technical Skills" icon={Code2} color="text-pink-500" bg="bg-pink-500/10" onSave={()=>save({skills:skillForm.split(",").map((s:string)=>s.trim()).filter(Boolean)})} saving={saving}
              editContent={<div><label className={lbl}>Skills (comma separated)</label><textarea className={ipt+" resize-none"} rows={3} value={skillForm} onChange={e=>setSkillForm(e.target.value)} placeholder="React, Node.js, Python, AWS..."/></div>}>
              {!(user?.skills?.length)
                ? <Empty icon={Code2} label="No skills added."/>
                : <SkillChips skills={user.skills}/>}
            </InlineSec>

            {/* PROJECTS — full width */}
            <div className="xl:col-span-3">
              <InlineSec title="Projects" icon={Layers} color="text-blue-500" bg="bg-blue-500/10">
                {projects.length===0
                  ? <Empty icon={Layers} label="No projects added yet." action="Add via Edit Profile" onAction={()=>router.push("/student/profile?edit=projects")}/>
                  : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{projects.map(p=><ProjectCard key={p.id} p={p}/>)}</div>}
              </InlineSec>
            </div>

            {/* CERTIFICATIONS */}
            <InlineSec title="Certifications" icon={Award} color="text-amber-500" bg="bg-amber-500/10">
              {certs.length===0
                ? <Empty icon={Award} label="No certifications added."/>
                : <div className="space-y-2">
                    {certs.map((c:any)=>(
                      <div key={c.id} className="flex items-start gap-2.5 p-2.5 rounded-xl border border-border hover:border-primary/20 transition-all">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-sm">🏅</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.organization}</p>
                          {c.issueDate&&<p className="text-xs text-muted-foreground/60 flex items-center gap-1 mt-0.5"><Calendar className="h-3 w-3"/>{c.issueDate}</p>}
                        </div>
                        {c.credentialUrl&&<a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary shrink-0"><ExternalLink className="h-3 w-3"/></a>}
                      </div>
                    ))}
                  </div>}
            </InlineSec>

            {/* CODING PROFILES */}
            <InlineSec title="Coding Profiles" icon={Activity} color="text-emerald-500" bg="bg-emerald-500/10"
              editContent={<p className="text-xs text-muted-foreground">Manage your coding platform connections from the <Link href="/student/platforms" className="text-primary hover:underline font-semibold">Platforms page</Link>.</p>}
              onSave={async()=>{}}>
              {platforms.length===0
                ? <Empty icon={Activity} label="No coding profiles linked." action="Connect Platforms" onAction={()=>router.push("/student/platforms")}/>
                : <div className="space-y-1.5">{platforms.map(([pid,pd])=><PlatformRow key={pid} pid={pid} pd={pd}/>)}</div>}
            </InlineSec>

            {/* INTERNSHIPS */}
            <InlineSec title="Internships" icon={Briefcase} color="text-teal-500" bg="bg-teal-500/10">
              {internships.length===0
                ? <Empty icon={Briefcase} label="No internships added."/>
                : <div className="space-y-2">
                    {internships.map((i:any)=>(
                      <div key={i.id} className="p-3 rounded-xl border border-border hover:border-primary/20 transition-all">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div><p className="text-xs font-bold text-foreground">{i.role}</p><p className="text-sm font-semibold text-primary">{i.company}</p></div>
                          <Badge className="text-xs bg-muted border-border gap-1 shrink-0"><Clock className="h-3 w-3"/>{i.duration}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1.5">{i.description}</p>
                        <div className="flex flex-wrap gap-1">{i.skills?.map((s:string)=><span key={s} className="text-xs px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 font-medium">{s}</span>)}</div>
                      </div>
                    ))}
                  </div>}
            </InlineSec>

            {/* ACHIEVEMENTS */}
            <InlineSec title="Achievements" icon={Trophy} color="text-orange-500" bg="bg-orange-500/10">
              {achievements.length===0
                ? <Empty icon={Trophy} label="No achievements added."/>
                : <div className="space-y-2">
                    {achievements.map((a:any)=>(
                      <div key={a.id} className="flex items-start gap-2.5 p-2.5 rounded-xl border border-border hover:border-primary/20 transition-all">
                        <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-sm shrink-0">🏆</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground">{a.title}</p>
                          <p className="text-xs text-muted-foreground">{a.category}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{a.description}</p>
                        </div>
                        {a.date&&<span className="text-xs text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded shrink-0">{a.date}</span>}
                      </div>
                    ))}
                  </div>}
            </InlineSec>

            {/* LANGUAGES */}
            <InlineSec title="Languages" icon={Languages} color="text-indigo-500" bg="bg-indigo-500/10" onSave={()=>save({languages:langForm.split(",").map(s=>s.trim()).filter(Boolean)})} saving={saving}
              editContent={<div><label className={lbl}>Languages (comma separated)</label><input className={ipt} value={langForm} onChange={e=>setLangForm(e.target.value)} placeholder="English, Hindi, Telugu"/></div>}>
              <div className="flex flex-wrap gap-2">
                {langs.map((l,i)=>{
                  const lvl=["Native","Professional","Conversational"]
                  const c=["bg-indigo-500/10 text-indigo-500","bg-blue-500/10 text-blue-500","bg-teal-500/10 text-teal-500"]
                  return<div key={l} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-current/20 ${c[i%3]}`}><span className="text-xs font-bold">{l}</span><span className="text-xs opacity-60">{lvl[i%3]}</span></div>
                })}
              </div>
            </InlineSec>

            {/* RESUME — full width */}
            <div className="xl:col-span-3">
              <InlineSec title="Resume" icon={FileText} color="text-teal-500" bg="bg-teal-500/10">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className={`flex items-center gap-3 p-3 rounded-xl border ${user?.resumeFile||user?.resumeUrl?"bg-emerald-500/5 border-emerald-500/20":"bg-blue-500/5 border-blue-500/20 border-dashed"}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${user?.resumeFile||user?.resumeUrl?"bg-emerald-500/15":"bg-blue-500/15"}`}><FileText className={`h-4 w-4 ${user?.resumeFile||user?.resumeUrl?"text-emerald-500":"text-blue-500"}`}/></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground">{user?.resumeFile?user.resumeFile.fileName:user?.resumeUrl?"Resume Linked":"No Resume"}</p>
                      <p className="text-xs text-muted-foreground">{user?.resumeFile?`${(user.resumeFile.sizeBytes/1024).toFixed(0)} KB`:user?.resumeUrl?"Linked":"Upload to boost visibility"}</p>
                    </div>
                    <a href="/student/resume" className={`text-xs font-bold border rounded-lg px-2 py-1 flex items-center gap-1 transition-all ${user?.resumeFile||user?.resumeUrl?"text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10":"text-blue-600 border-blue-500/30 hover:bg-blue-500/10"}`}>
                      {user?.resumeFile||user?.resumeUrl?<><Pencil className="h-3 w-3"/>Edit</>:<><Plus className="h-3 w-3"/>Add</>}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-primary/20 bg-primary/5">
                    <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0"><Sparkles className="h-4 w-4 text-primary"/></div>
                    <div className="flex-1"><p className="text-xs font-bold text-foreground">Smart Resume AI</p><p className="text-xs text-muted-foreground">AI-powered analysis</p></div>
                    <a href="/student/jobs#smart-resume" className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors"><Sparkles className="h-3 w-3"/>Go</a>
                  </div>
                </div>
              </InlineSec>
            </div>

            {/* PLACEMENT READINESS */}
            <InlineSec title="Placement Readiness" icon={Target} color="text-emerald-500" bg="bg-emerald-500/10">
              <PlacementReadiness user={user} score={score}/>
            </InlineSec>

            {/* AI SUGGESTIONS */}
            <InlineSec title="AI Suggestions" icon={Sparkles} color="text-violet-500" bg="bg-violet-500/10"
              action={<Badge className="text-xs bg-primary/10 text-primary border-primary/20">AI</Badge>}>
              <AISuggestions user={user}/>
            </InlineSec>

          </motion.div>
        </div>
      </div>
    </div>
  )
}
