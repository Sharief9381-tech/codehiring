"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Zap, Target, Brain, Trophy, ChevronRight, Play,
  CheckCircle2, XCircle, TrendingUp, Star, Flag, Timer, Cpu,
  BarChart3, Award, Activity, Radio, RefreshCw,
} from "lucide-react"

const COMPANIES = [
  { id:"amazon",  name:"Amazon",  logo:"AZ", role:"Software Engineer", package:"20 LPA", difficulty:"Advanced", daysLeft:20, status:"open",
    skills:["DSA","Java","Problem Solving","System Design"],
    rounds:["Online Assessment","Technical Round 1","Technical Round 2","HR Round"],
    requirements:[{label:"Coding",value:85},{label:"Problem Solving",value:90},{label:"Technical",value:80}],
    gradient:"from-amber-500/20 to-orange-500/5", accent:"border-amber-500/30" },
  { id:"google",  name:"Google",  logo:"GO", role:"SWE", package:"45 LPA", difficulty:"Elite", daysLeft:35, status:"upcoming",
    skills:["Algorithms","System Design","Optimization","Data Structures"],
    rounds:["Coding Screen","Technical 1","Technical 2","Technical 3","Googliness"],
    requirements:[{label:"Algorithms",value:95},{label:"System Design",value:90},{label:"Optimization",value:92}],
    gradient:"from-blue-500/20 to-cyan-500/5", accent:"border-blue-500/30" },
  { id:"tcs",     name:"TCS",     logo:"TC", role:"Systems Engineer", package:"3.6 LPA", difficulty:"Rookie", daysLeft:10, status:"open",
    skills:["Aptitude","Verbal","Logical Reasoning","Basic Coding"],
    rounds:["NQT Aptitude","Technical Interview","HR Interview"],
    requirements:[{label:"Aptitude",value:70},{label:"Verbal",value:65},{label:"Technical",value:60}],
    gradient:"from-violet-500/20 to-purple-500/5", accent:"border-violet-500/30" },
  { id:"infosys", name:"Infosys", logo:"IN", role:"Systems Engineer", package:"3.6 LPA", difficulty:"Rookie", daysLeft:45, status:"upcoming",
    skills:["Aptitude","Reasoning","Java Basics","SQL"],
    rounds:["InfyTQ Test","Technical","HR"],
    requirements:[{label:"Aptitude",value:65},{label:"Technical",value:60},{label:"Reasoning",value:70}],
    gradient:"from-emerald-500/20 to-teal-500/5", accent:"border-emerald-500/30" },
] as const

type Company = typeof COMPANIES[number]
type Difficulty = "Rookie" | "Advanced" | "Elite"

const DIFF: Record<string,{color:string;bg:string;label:string}> = {
  Rookie:  {color:"text-emerald-400",bg:"bg-emerald-400/10",label:"ROOKIE DRIVER"},
  Advanced:{color:"text-amber-400",  bg:"bg-amber-400/10",  label:"RACE DRIVER"  },
  Elite:   {color:"text-red-400",    bg:"bg-red-400/10",    label:"ELITE RACER"  },
}
const LEVELS = ["Rookie Driver","Rising Racer","Advanced Driver","Race Ready"]

function RaceBar({value,color="bg-primary"}:{value:number;color?:string}) {
  return <div className="h-1.5 rounded-full bg-white/5 overflow-hidden"><div className={`h-full rounded-full ${color}`} style={{width:`${value}%`}}/></div>
}
function DiffBadge({d}:{d:string}) {
  const c=DIFF[d]??DIFF.Rookie
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold tracking-widest uppercase ${c.bg} ${c.color}`}><Radio className="h-2.5 w-2.5"/>{c.label}</span>
}

function Quiz({company,type,onDone}:{company:Company;type:string;onDone:(s:number)=>void}) {
  const elite=company.difficulty==="Elite", adv=company.difficulty==="Advanced"
  const qs = type==="aptitude" ? [
    {id:1,q:"Train travels 360 km in 4 hours. Speed in m/s?",opts:["25 m/s","20 m/s","30 m/s","15 m/s"],ans:0},
    {id:2,q:"20% of a number is 80. What is 35%?",opts:["120","140","160","180"],ans:1},
    {id:3,q:"Next: 2, 6, 12, 20, 30, ?",opts:["40","42","44","46"],ans:1},
    {id:4,q:"P finishes in 12 days, Q in 18. Together?",opts:["6.5","7.2","8","9"],ans:1},
    {id:5,q:"Two pipes fill in 20 & 30 min, drain empties in 15 min. Fill time?",opts:["60","90","120","Cannot fill"],ans:2},
  ] : type==="coding" ? [
    {id:1,q:elite?"Shortest path with negative weights (Bellman-Ford).":adv?"Root-to-leaf paths summing to target.":"Reverse a linked list.",opts:[],ans:0},
    {id:2,q:adv||elite?"Design LRU Cache O(1) get/put.":"Maximum subarray sum (Kadane).",opts:[],ans:0},
    {id:3,q:"All unique permutations of string with duplicates.",opts:[],ans:0},
  ] : [
    {id:1,q:"HashMap vs ConcurrentHashMap?",opts:["HashMap is thread-safe","ConcurrentHashMap is thread-safe","They are identical","ConcurrentHashMap is slower"],ans:1},
    {id:2,q:elite?"Design a distributed rate limiter.":"SQL JOIN types?",opts:elite?["Token bucket","Sliding window+Redis","Counter","IP block"]:["INNER,LEFT,RIGHT,FULL","Only INNER,OUTER","LEFT,RIGHT only","Just INNER"],ans:1},
    {id:3,q:"Quicksort average and worst case?",opts:["O(n log n) avg, O(n²) worst","O(n²) both","O(n log n) both","O(n) avg"],ans:0},
  ]

  const [cur,setCur]=useState(0)
  const [sel,setSel]=useState<number|null>(null)
  const [hist,setHist]=useState<(number|null)[]>([])
  const [done,setDone]=useState(false)
  const [started,setStarted]=useState(false)
  const q=qs[cur], coding=type==="coding"

  const next=()=>{
    const h=[...hist,sel]
    if(cur+1<qs.length){setHist(h);setSel(null);setCur(c=>c+1)}
    else{const s=Math.round((h.filter((x,i)=>x===qs[i].ans).length/qs.length)*100);setDone(true);onDone(s)}
  }
  const reset=()=>{setCur(0);setSel(null);setHist([]);setDone(false);setStarted(false)}

  if(!started) return (
    <div className="text-center py-10 space-y-5">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mx-auto"><Play className="h-7 w-7 text-primary"/></div>
      <div><p className="text-lg font-black tracking-wide">{company.name} — {type==="aptitude"?"Aptitude":type==="coding"?"Coding Arena":"Technical"}</p><p className="text-sm text-muted-foreground">{qs.length} questions · {company.difficulty}</p></div>
      <Button className="gap-2 px-8 font-bold uppercase tracking-widest" onClick={()=>setStarted(true)}><Flag className="h-4 w-4"/>START PRACTICE LAP</Button>
    </div>
  )
  if(done){
    const score=Math.round((hist.filter((x,i)=>x===qs[i].ans).length/qs.length)*100)
    return (
      <div className="text-center py-8 space-y-4">
        <p className={`text-5xl font-black ${score>=85?"text-emerald-400":score>=70?"text-amber-400":"text-red-400"}`}>{score}%</p>
        <p className="text-sm text-muted-foreground">{hist.filter((x,i)=>x===qs[i].ans).length}/{qs.length} correct</p>
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 max-w-md mx-auto text-left">
          <p className="font-bold text-primary text-xs mb-1 flex items-center gap-1"><Cpu className="h-3 w-3"/>Race Engineer AI</p>
          <p className="text-xs text-muted-foreground">{score>=85?"Peak performance. Maintain race pace.":score>=70?"Solid lap. Focus on weak areas.":"Study weak sectors and attempt again."}</p>
        </div>
        <Button onClick={reset} className="gap-2 font-bold uppercase tracking-widest"><RefreshCw className="h-4 w-4"/>ANOTHER LAP</Button>
      </div>
    )
  }
  if(coding) return (
    <div className="space-y-4">
      <div className="flex justify-between"><Badge variant="outline" className="text-xs">Hard</Badge><span className="text-xs text-muted-foreground">Problem {cur+1}/{qs.length}</span></div>
      <div className="p-4 rounded-xl bg-muted/30 border"><p className="text-sm font-medium">{q.q}</p></div>
      <div className="rounded-xl bg-black/40 border p-4 font-mono text-sm text-emerald-400 min-h-[80px]"><p className="text-muted-foreground text-xs mb-2">// Write your solution</p><p>{"public int solve(int[] nums) { return 0; }"}</p></div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm"><Play className="h-3 w-3 mr-1"/>Run</Button>
        <Button size="sm" className="ml-auto font-bold" onClick={()=>{const h=[...hist,0];if(cur+1<qs.length){setHist(h);setCur(c=>c+1)}else{setDone(true);onDone(72)}}}>Submit<ChevronRight className="h-3 w-3 ml-1"/></Button>
      </div>
    </div>
  )
  return (
    <div className="space-y-4">
      <div className="flex justify-between"><Badge variant="outline" className="text-xs">Q{cur+1}/{qs.length}</Badge></div>
      <p className="text-sm font-medium">{q.q}</p>
      <div className="space-y-2">
        {q.opts.map((opt,i)=>(
          <button key={i} onClick={()=>setSel(i)} className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${sel===i?"border-primary bg-primary/10 text-primary":"border-border bg-muted/20 hover:border-primary/40"}`}>
            <span className="font-semibold text-muted-foreground mr-2">{["A","B","C","D"][i]}.</span>{opt}
          </button>
        ))}
      </div>
      <Button className="w-full gap-2 font-bold uppercase tracking-widest" disabled={sel===null} onClick={next}>{cur+1===qs.length?"FINISH LAP":"NEXT"}<ChevronRight className="h-4 w-4"/></Button>
    </div>
  )
}

export default function PrepPage() {
  const [selected,setSelected]=useState<Company|null>(null)
  const [tab,setTab]=useState("overview")
  const [laps,setLaps]=useState([{company:"amazon",lap:1,score:40,date:"Jan 5"},{company:"amazon",lap:2,score:55,date:"Jan 10"},{company:"amazon",lap:3,score:72,date:"Jan 16"}])
  const addLap=(s:number)=>{if(!selected)return;const n=laps.filter(l=>l.company===selected.id).length+1;setLaps(p=>[...p,{company:selected.id,lap:n,score:s,date:"Today"}])}
  const cLaps=selected?laps.filter(l=>l.company===selected.id):[]
  const latest=cLaps.length>0?cLaps[cLaps.length-1].score:0
  const imp=cLaps.length>=2?cLaps[cLaps.length-1].score-cLaps[0].score:0
  const lvl=latest>=85?3:latest>=70?2:latest>=50?1:0

  if(!selected) return (
    <div className="flex-1 p-4 md:p-6 max-w-screen-2xl mx-auto w-full space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-background border border-primary/20 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20"><Flag className="h-5 w-5 text-primary"/></div>
          <div><h2 className="text-xl font-black tracking-widest uppercase">Training Paddock</h2><p className="text-xs text-muted-foreground">Select a company track and begin your preparation</p></div>
        </div>
      </div>
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Upcoming Career Races</p>
      <div className="space-y-3">
        {COMPANIES.map(c=>{
          const myLaps=laps.filter(l=>l.company===c.id)
          const best=myLaps.length>0?Math.max(...myLaps.map(l=>l.score)):null
          return (
            <div key={c.id} className={`rounded-2xl bg-gradient-to-br ${c.gradient} border ${c.accent} p-5 hover:shadow-lg transition-all cursor-pointer`} onClick={()=>{setSelected(c);setTab("overview")}}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background/60 backdrop-blur font-black text-sm shrink-0">{c.logo}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-black text-lg tracking-wide">{c.name} Grand Prix</p>
                      <Badge className={`text-[10px] px-2 ${c.status==="open"?"bg-emerald-500/15 text-emerald-400":"bg-blue-500/15 text-blue-400"}`}>{c.status==="open"?"TRAINING OPEN":"UPCOMING"}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{c.role} · {c.package}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <DiffBadge d={c.difficulty}/>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Timer className="h-3 w-3"/>{c.daysLeft} days left</span>
                      {best!==null&&<span className="text-xs text-emerald-400 font-bold">Best: {best}%</span>}
                    </div>
                  </div>
                </div>
                <Button size="sm" className="gap-2 shrink-0 font-bold uppercase tracking-widest"><Zap className="h-3 w-3"/>ENTER</Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">{c.skills.map(s=><Badge key={s} variant="outline" className="text-[10px] px-1.5 py-0">{s}</Badge>)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="flex-1 p-4 md:p-6 max-w-screen-2xl mx-auto w-full space-y-5">
      <div className={`rounded-2xl bg-gradient-to-br ${selected.gradient} border ${selected.accent} p-5`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background/60 backdrop-blur font-black text-sm shrink-0">{selected.logo}</div>
            <div>
              <p className="font-black text-xl tracking-wide">{selected.name} Grand Prix Training</p>
              <p className="text-xs text-muted-foreground">{selected.role} · {selected.package} · {selected.daysLeft} days</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <DiffBadge d={selected.difficulty}/>
                {cLaps.length>0&&<span className="text-xs font-bold text-emerald-400">{cLaps.length} laps</span>}
                <span className={`text-xs font-bold ${latest>=85?"text-emerald-400":latest>=70?"text-amber-400":"text-red-400"}`}>{LEVELS[lvl]}</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={()=>setSelected(null)} className="shrink-0 bg-background/60">← Paddock</Button>
        </div>
        {cLaps.length>0&&(
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[{label:"PRACTICE LAPS",value:cLaps.length,icon:Activity},{label:"CAREER SPEED",value:`${latest}%`,icon:Zap},{label:"IMPROVEMENT",value:`+${imp}%`,icon:TrendingUp}].map(s=>(
              <div key={s.label} className="rounded-xl bg-background/40 backdrop-blur p-3 text-center">
                <s.icon className="h-4 w-4 mx-auto mb-1 text-primary"/><p className="text-lg font-black">{s.value}</p><p className="text-[9px] text-muted-foreground tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full grid grid-cols-4 sm:grid-cols-7 h-auto gap-1 bg-muted p-1 rounded-xl">
          {[{v:"overview",l:"Overview",i:Flag},{v:"aptitude",l:"Aptitude",i:Brain},{v:"coding",l:"Coding",i:Radio},{v:"technical",l:"Technical",i:Cpu},{v:"interview",l:"Interview",i:Activity},{v:"history",l:"Laps",i:Trophy},{v:"report",l:"Telemetry",i:BarChart3}].map(({v,l,i:Icon})=>(
            <TabsTrigger key={v} value={v} className="text-xs py-1.5 rounded-lg flex items-center gap-1"><Icon className="h-3 w-3"/><span className="hidden sm:inline">{l}</span></TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card><CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Flag className="h-4 w-4 text-primary"/>Race Format</CardTitle></CardHeader>
              <CardContent className="space-y-2">{selected.rounds.map((r,i)=>(
                <div key={r} className="flex items-center gap-2 text-sm"><div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0">{i+1}</div><span>{r}</span></div>
              ))}</CardContent></Card>
            <Card><CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Target className="h-4 w-4 text-amber-400"/>Requirements</CardTitle></CardHeader>
              <CardContent className="space-y-3">{selected.requirements.map(r=>(
                <div key={r.label}><div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{r.label}</span><span className="font-bold">{r.value}%</span></div><RaceBar value={r.value} color={r.value>=85?"bg-emerald-500":r.value>=70?"bg-amber-500":"bg-primary"}/></div>
              ))}</CardContent></Card>
          </div>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Cpu className="h-4 w-4 text-primary"/>AI Prep Plan — {selected.daysLeft} Days</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[{days:`Day 1–${Math.round(selected.daysLeft*0.33)}`,task:`${selected.skills[0]} + ${selected.skills[1]}`,c:"bg-blue-500/10 text-blue-400 border-blue-500/20"},{days:`Day ${Math.round(selected.daysLeft*0.33)}–${Math.round(selected.daysLeft*0.66)}`,task:`${selected.skills[2]} + Mock Tests`,c:"bg-amber-500/10 text-amber-400 border-amber-500/20"},{days:`Day ${Math.round(selected.daysLeft*0.66)}–${selected.daysLeft}`,task:"Full Mock Interviews",c:"bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}].map(p=>(
                <div key={p.days} className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs ${p.c}`}><span className="font-bold">{p.days}</span><span>{p.task}</span><ChevronRight className="h-3 w-3"/></div>
              ))}
            </CardContent>
          </Card>
          <Button className="w-full gap-2 h-11 font-bold uppercase tracking-widest" onClick={()=>setTab("aptitude")}><Zap className="h-4 w-4"/>START FIRST LAP</Button>
        </TabsContent>

        <TabsContent value="aptitude"  className="mt-4"><Card><CardContent className="p-5"><Quiz company={selected} type="aptitude"  onDone={addLap}/></CardContent></Card></TabsContent>
        <TabsContent value="coding"    className="mt-4"><Card><CardContent className="p-5"><Quiz company={selected} type="coding"    onDone={addLap}/></CardContent></Card></TabsContent>
        <TabsContent value="technical" className="mt-4"><Card><CardContent className="p-5"><Quiz company={selected} type="technical" onDone={addLap}/></CardContent></Card></TabsContent>

        <TabsContent value="interview" className="mt-4">
          <Card className="border-violet-500/20 bg-violet-500/5"><CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15"><Activity className="h-5 w-5 text-violet-400 animate-pulse"/></div><div><p className="font-bold text-sm">AI Mock Interview — {selected.name}</p><p className="text-xs text-muted-foreground">Race Engineer AI simulates a real interview</p></div></div>
            {[{q:"Tell me about a time you solved a complex DSA problem.",t:"Technical"},{q:`Design a ${selected.id==="amazon"?"recommendation system":selected.id==="google"?"search engine":"data system"}.`,t:"System Design"},{q:`Why do you want to join ${selected.name}?`,t:"HR"}].map((item,i)=>(
              <div key={i} className="p-3 rounded-xl border border-border bg-muted/20 space-y-2">
                <div className="flex items-center justify-between"><Badge variant="outline" className="text-xs">{item.t}</Badge><span className="text-xs text-muted-foreground">Q{i+1}</span></div>
                <p className="text-sm">{item.q}</p>
                <textarea className="w-full text-xs rounded-lg border border-border bg-background/60 p-2 resize-none" rows={3} placeholder="Type your answer..."/>
              </div>
            ))}
            <Button className="w-full gap-2 font-bold uppercase tracking-widest" onClick={()=>addLap(78)}><Cpu className="h-4 w-4"/>SUBMIT FOR AI EVALUATION</Button>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-4">
          {cLaps.length===0?<Card><CardContent className="py-12 text-center"><Activity className="h-8 w-8 mx-auto mb-3 text-muted-foreground/30"/><p className="text-muted-foreground text-sm">No laps yet. Start your first practice lap.</p></CardContent></Card>:(
            <>
              <Card><CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4 text-emerald-400"/>Lap Chart</CardTitle></CardHeader>
                <CardContent><div className="flex items-end gap-2 h-24">{cLaps.map((lap,i)=>(
                  <div key={i} className="flex-1 flex flex-col items-center gap-1"><span className="text-[9px] text-muted-foreground">{lap.score}%</span><div className="w-full rounded-t bg-primary/70" style={{height:`${(lap.score/100)*80}px`}}/><span className="text-[9px] text-muted-foreground">L{lap.lap}</span></div>
                ))}</div></CardContent>
              </Card>
              <div className="space-y-2">{[...cLaps].reverse().map(lap=>(
                <Card key={lap.lap}><CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-black text-primary">L{lap.lap}</div><div><p className="text-sm font-bold">Practice Lap #{lap.lap}</p><p className="text-xs text-muted-foreground">{lap.date}</p></div></div>
                  <p className={`text-xl font-black ${lap.score>=85?"text-emerald-400":lap.score>=70?"text-amber-400":"text-red-400"}`}>{lap.score}%</p>
                </CardContent></Card>
              ))}</div>
            </>
          )}
        </TabsContent>

        <TabsContent value="report" className="mt-4">
          <Card className="border-primary/20"><CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary"/>Race Telemetry — {selected.name}</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="text-center py-2"><p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Race Readiness</p><p className={`text-5xl font-black ${latest>=85?"text-emerald-400":latest>=70?"text-amber-400":"text-red-400"}`}>{latest>0?latest:"—"}</p><p className="text-xs text-muted-foreground mt-1">{LEVELS[lvl]}</p></div>
              <RaceBar value={latest} color={latest>=85?"bg-emerald-500":latest>=70?"bg-amber-500":"bg-red-500"}/>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"><p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/>Strong</p>{cLaps.length>0?selected.skills.slice(0,2).map(s=><p key={s} className="text-xs text-muted-foreground">✓ {s}</p>):<p className="text-xs text-muted-foreground">Complete a lap first</p>}</div>
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20"><p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-1"><XCircle className="h-3 w-3"/>Upgrade</p>{cLaps.length>0?selected.skills.slice(2).map(s=><p key={s} className="text-xs text-muted-foreground">✗ {s}</p>):<p className="text-xs text-muted-foreground">Complete a lap first</p>}</div>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20"><p className="text-xs font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-1"><Cpu className="h-3 w-3"/>Race Engineer AI</p><p className="text-xs text-muted-foreground leading-relaxed">{cLaps.length===0?`Start your first lap for ${selected.name} insights.`:latest>=85?"Peak performance. Race day ready.":latest>=70?"Good pace. Focus on weak sectors.":"Consistent laps build speed."}</p></div>
              <div><p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Badges</p>
                <div className="flex flex-wrap gap-2">
                  {cLaps.length>=1&&<Badge className="bg-amber-500/10 text-amber-400 gap-1"><Award className="h-3 w-3"/>First Lap</Badge>}
                  {cLaps.length>=5&&<Badge className="bg-violet-500/10 text-violet-400 gap-1"><Star className="h-3 w-3"/>Consistency Racer</Badge>}
                  {latest>=70&&<Badge className="bg-blue-500/10 text-blue-400 gap-1"><Trophy className="h-3 w-3"/>Problem Solver</Badge>}
                  {latest>=85&&<Badge className="bg-emerald-500/10 text-emerald-400 gap-1"><Flag className="h-3 w-3"/>Race Ready</Badge>}
                  {cLaps.length===0&&<p className="text-xs text-muted-foreground">Complete laps to unlock badges</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
