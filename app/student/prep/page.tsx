"use client"

import { useState, useEffect, useRef } from "react"
import {
  Brain, Code2, BookOpen, Building2, ChevronRight, ArrowLeft,
  Play, Trophy, Target, CheckCircle2, XCircle, Timer, Loader2,
  BarChart3, Zap, AlertCircle, RotateCcw, Star, TrendingUp,
  FileText, Cpu, Users, Award, ChevronDown, ChevronUp, Flag,
  ExternalLink, Sparkles, MessageCircle,
} from "lucide-react"
import { HiringReport } from "@/components/student/hiring-report"
import { ProctoredShell, type ViolationLog } from "@/components/student/proctor"
import { AssessmentLeaderboard, AssessmentHistoryPage } from "@/components/student/assessment-history"
import { ALL_COMPANIES } from "@/lib/companies-data"
import { SmartResume } from "@/components/student/smart-resume"

// ─── Types ────────────────────────────────────────────────────────────────────
type Path = "aptitude" | "coding" | "cs" | "company" | "communication"

interface MCQ { id: number; question: string; options: string[]; correct: number; explanation: string; topic: string }
interface CodingQ { id: number; title: string; difficulty: string; statement: string; constraints: string; example: { input: string; output: string; explanation: string }; hints: string[]; topic: string }

// ─── Company data ─────────────────────────────────────────────────────────────
const COMPANIES = [
  { id:"tcs",       name:"TCS",          abbr:"TC", color:"#7c3aed", logo:"🔷", duration:75,  questions:60, difficulty:"Medium",    sections:["quantitative","logical","verbal","coding"], desc:"TCS NQT — National Qualifier Test",      category:"Service",    roles:["Systems Engineer","Developer","Analyst"] },
  { id:"infosys",   name:"Infosys",       abbr:"IN", color:"#059669", logo:"🟢", duration:95,  questions:65, difficulty:"Medium",    sections:["quantitative","logical","verbal","coding"], desc:"InfyTQ Certification Test",              category:"Service",    roles:["Systems Engineer","Technology Analyst"] },
  { id:"wipro",     name:"Wipro",         abbr:"WI", color:"#0284c7", logo:"🔵", duration:60,  questions:55, difficulty:"Easy",      sections:["quantitative","logical","verbal","coding"], desc:"Wipro NLTH Online Test",                 category:"Service",    roles:["Project Engineer","Software Developer"] },
  { id:"cognizant", name:"Cognizant",     abbr:"CG", color:"#0891b2", logo:"🔹", duration:70,  questions:55, difficulty:"Easy",      sections:["quantitative","logical","verbal","coding"], desc:"Cognizant GenC Elevate",                 category:"Service",    roles:["Programmer Analyst","GenC Developer"] },
  { id:"capgemini", name:"Capgemini",     abbr:"CA", color:"#0369a1", logo:"🔷", duration:75,  questions:60, difficulty:"Medium",    sections:["quantitative","logical","verbal","coding"], desc:"Capgemini Technical Assessment",         category:"Service",    roles:["Software Engineer","Associate Consultant"] },
  { id:"accenture", name:"Accenture",     abbr:"AC", color:"#a21caf", logo:"🟣", duration:90,  questions:90, difficulty:"Medium",    sections:["quantitative","logical","verbal","coding"], desc:"Accenture Cognitive & Technical",        category:"Service",    roles:["Associate Software Engineer","Analyst"] },
  { id:"hcl",       name:"HCL",           abbr:"HC", color:"#16a34a", logo:"🟩", duration:60,  questions:50, difficulty:"Easy",      sections:["quantitative","logical","verbal","coding"], desc:"HCL Graduate Engineer Trainee",          category:"Service",    roles:["Graduate Engineer Trainee","Developer"] },
  { id:"tech-mahindra", name:"Tech Mahindra", abbr:"TM", color:"#dc2626", logo:"🔴", duration:60, questions:50, difficulty:"Easy", sections:["quantitative","logical","verbal","coding"], desc:"Tech Mahindra SmartHire",               category:"Service",    roles:["Software Engineer","Associate Engineer"] },
  { id:"deloitte",  name:"Deloitte",      abbr:"DE", color:"#15803d", logo:"🟢", duration:80,  questions:50, difficulty:"Medium",    sections:["quantitative","logical","verbal"],          desc:"Deloitte Campus Hiring Test",            category:"Consulting", roles:["Analyst","Consultant","Technology Analyst"] },
  { id:"pwc",       name:"PwC",           abbr:"PW", color:"#d97706", logo:"🟠", duration:70,  questions:45, difficulty:"Medium",    sections:["quantitative","logical","verbal"],          desc:"PwC Campus Assessment",                  category:"Consulting", roles:["Associate","Technology Analyst"] },
  { id:"kpmg",      name:"KPMG",          abbr:"KP", color:"#1d4ed8", logo:"🔵", duration:75,  questions:50, difficulty:"Medium",    sections:["quantitative","logical","verbal"],          desc:"KPMG Graduate Hiring",                   category:"Consulting", roles:["Associate","Analyst"] },
  { id:"ey",        name:"EY",            abbr:"EY", color:"#f59e0b", logo:"🟡", duration:70,  questions:45, difficulty:"Medium",    sections:["quantitative","logical","verbal"],          desc:"EY Campus Assessment",                   category:"Consulting", roles:["Associate","Consultant"] },
  { id:"amazon",    name:"Amazon",        abbr:"AZ", color:"#f59e0b", logo:"📦", duration:90,  questions:2,  difficulty:"Hard",      sections:["coding","logical"],                        desc:"Amazon Online Assessment (OA)",          category:"Product",    roles:["SDE-1","Software Engineer","SDE Intern"] },
  { id:"microsoft", name:"Microsoft",     abbr:"MS", color:"#3b82f6", logo:"🪟", duration:90,  questions:3,  difficulty:"Hard",      sections:["coding","logical"],                        desc:"Microsoft OA + Coding Rounds",           category:"Product",    roles:["SDE","Software Engineer","PM"] },
  { id:"google",    name:"Google",        abbr:"GO", color:"#ef4444", logo:"🔍", duration:60,  questions:2,  difficulty:"Very Hard", sections:["coding"],                                  desc:"Google Coding Screen",                   category:"Product",    roles:["SWE","L3 Engineer"] },
  { id:"adobe",     name:"Adobe",         abbr:"AD", color:"#ef4444", logo:"📐", duration:75,  questions:3,  difficulty:"Hard",      sections:["coding","logical"],                        desc:"Adobe Online Assessment",                category:"Product",    roles:["MTS","Software Engineer"] },
  { id:"oracle",    name:"Oracle",        abbr:"OR", color:"#dc2626", logo:"🔴", duration:90,  questions:3,  difficulty:"Hard",      sections:["coding","quantitative"],                   desc:"Oracle OA — DSA + Aptitude",             category:"Product",    roles:["Applications Engineer","Software Engineer"] },
  { id:"atlassian", name:"Atlassian",     abbr:"AT", color:"#0052cc", logo:"⚡", duration:75,  questions:3,  difficulty:"Hard",      sections:["coding","logical"],                        desc:"Atlassian Coding Assessment",            category:"Product",    roles:["Software Engineer","Developer"] },
  { id:"salesforce",name:"Salesforce",    abbr:"SF", color:"#00a1e0", logo:"☁️", duration:70,  questions:3,  difficulty:"Hard",      sections:["coding","logical"],                        desc:"Salesforce OA",                          category:"Product",    roles:["Associate MTS","Software Engineer"] },
  { id:"qualcomm",  name:"Qualcomm",      abbr:"QC", color:"#3253dc", logo:"📡", duration:90,  questions:3,  difficulty:"Hard",      sections:["coding","quantitative"],                   desc:"Qualcomm Coding + Technical",            category:"Product",    roles:["Engineer","Software Engineer"] },
]

const SECTION_LABELS: Record<string, string> = {
  quantitative: "Quantitative", logical: "Logical Reasoning",
  verbal: "Verbal Ability", coding: "Coding",
}

const SECTION_QTY: Record<string, number> = {
  quantitative: 15, logical: 12, verbal: 10, coding: 3,
}

// ─── Aptitude topics ──────────────────────────────────────────────────────────
const APT_TOPICS = [
  { id: "percentages",    name: "Percentages",       icon: "%" },
  { id: "profit-loss",    name: "Profit & Loss",     icon: "₹" },
  { id: "time-work",      name: "Time & Work",       icon: "⚙" },
  { id: "speed-distance", name: "Speed & Distance",  icon: "🚆" },
  { id: "probability",    name: "Probability",       icon: "🎲" },
  { id: "data-interp",    name: "Data Interpretation", icon: "📊" },
  { id: "series",         name: "Number Series",     icon: "🔢" },
  { id: "permcomb",       name: "Permutation & Combination", icon: "∑" },
]

// ─── CS topics ────────────────────────────────────────────────────────────────
const CS_TOPICS = [
  { id: "dbms", name: "DBMS",                icon: "🗄", color: "#3b82f6" },
  { id: "os",   name: "Operating Systems",   icon: "💻", color: "#8b5cf6" },
  { id: "cn",   name: "Computer Networks",   icon: "🌐", color: "#06b6d4" },
  { id: "oops", name: "OOP Concepts",        icon: "🧩", color: "#f59e0b" },
  { id: "java", name: "Java",                icon: "☕", color: "#ef4444" },
  { id: "sql",  name: "SQL",                 icon: "🔍", color: "#10b981" },
]

// ─── Communication topics ─────────────────────────────────────────────────────
const COMM_TOPICS = [
  { id: "grammar",       name: "Grammar & Sentence Correction", icon: "G",  color: "#10b981" },
  { id: "vocabulary",    name: "Vocabulary & Word Meaning",     icon: "V",  color: "#06b6d4" },
  { id: "reading",       name: "Reading Comprehension",         icon: "RC", color: "#8b5cf6" },
  { id: "para-jumbles",  name: "Para Jumbles",                  icon: "PJ", color: "#f59e0b" },
  { id: "email-writing", name: "Email & Tech Communication",    icon: "E",  color: "#ec4899" },
  { id: "verbal-logic",  name: "Verbal Reasoning",              icon: "VR", color: "#ef4444" },
]

// ─── DSA topics ───────────────────────────────────────────────────────────────
const DSA_TOPICS = [
  { id: "arrays",       name: "Arrays",        color: "#6366f1" },
  { id: "strings",      name: "Strings",       color: "#8b5cf6" },
  { id: "linked-lists", name: "Linked Lists",  color: "#ec4899" },
  { id: "trees",        name: "Trees",         color: "#10b981" },
  { id: "graphs",       name: "Graphs",        color: "#f59e0b" },
  { id: "dp",           name: "Dynamic Programming", color: "#ef4444" },
  { id: "sorting",      name: "Sorting",       color: "#06b6d4" },
  { id: "recursion",    name: "Recursion",     color: "#84cc16" },
]

// ─── Shared components ────────────────────────────────────────────────────────
function PathCard({ icon, label, desc, color, onClick, badge }: {
  icon: React.ReactNode; label: string; desc: string; color: string; onClick: () => void; badge?: string
}) {
  return (
    <button onClick={onClick}
      className="group relative w-full rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 p-6 text-left transition-all hover:scale-[1.02] hover:shadow-xl"
      style={{ borderColor: `${color}30` }}>
      {badge && (
        <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: `${color}20`, color }}>
          {badge}
        </span>
      )}
      <div className="flex h-12 w-12 items-center justify-center rounded-xl mb-4"
        style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <p className="font-bold text-lg text-foreground mb-1">{label}</p>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      <div className="flex items-center gap-1 mt-4 text-sm font-semibold" style={{ color }}>
        Start <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  )
}

function ProgressBar({ value, color = "#7c3aed" }: { value: number; color?: string }) {
  return (
    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
    </div>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444"
  const label = score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Work"
  return (
    <div className="text-center">
      <p className="text-6xl font-black tabular-nums" style={{ color }}>{score}%</p>
      <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold"
        style={{ background: `${color}20`, color }}>{label}</span>
    </div>
  )
}

// ─── MCQ Quiz component ───────────────────────────────────────────────────────
function MCQQuiz({ questions, onComplete }: { questions: MCQ[]; onComplete: (score: number, answers: number[], qs: MCQ[]) => void }) {
  const [cur, setCur] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [answers, setAnswers] = useState<number[]>([])

  const q = questions[cur]

  const choose = (i: number) => {
    if (answered) return
    setSelected(i)
    setAnswered(true)
  }

  const next = () => {
    const newAnswers = [...answers, selected ?? -1]
    if (cur + 1 < questions.length) {
      setAnswers(newAnswers)
      setCur(c => c + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      const correct = newAnswers.filter((a, i) => a === questions[i].correct).length
      const score = Math.round((correct / questions.length) * 100)
      onComplete(score, newAnswers, questions)
    }
  }

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm" style={{ color: "#A1A1AA" }}>
        <span>Question {cur + 1} of {questions.length}</span>
        <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
          style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa" }}>{q.topic}</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${((cur + 1) / questions.length) * 100}%`, background: "linear-gradient(90deg,#7c3aed,#6366f1)" }} />
      </div>

      {/* Question */}
      <div className="rounded-xl p-5"
        style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(24,24,27,0.8)" }}>
        <p className="text-base font-medium leading-relaxed" style={{ color: "#FAFAFA" }}>{q.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {q.options.map((opt, i) => {
          let style: React.CSSProperties = { border: "1px solid rgba(255,255,255,0.08)", background: "rgba(24,24,27,0.5)", cursor: "pointer" }
          if (answered) {
            if (i === q.correct) style = { border: "1px solid #10b981", background: "rgba(16,185,129,0.10)", cursor: "default" }
            else if (i === selected && i !== q.correct) style = { border: "1px solid #ef4444", background: "rgba(239,68,68,0.10)", cursor: "default", opacity: 0.8 }
            else style = { border: "1px solid rgba(255,255,255,0.05)", background: "rgba(24,24,27,0.3)", cursor: "default", opacity: 0.45 }
          } else if (selected === i) {
            style = { border: "1px solid #7c3aed", background: "rgba(124,58,237,0.12)", cursor: "pointer" }
          }
          return (
            <button key={i} onClick={() => choose(i)}
              className="w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left"
              style={style}
              onMouseEnter={e => { if (!answered && selected !== i) e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)" }}
              onMouseLeave={e => { if (!answered && selected !== i) e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)" }}>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                style={{ background: "rgba(255,255,255,0.06)", color: "#A1A1AA" }}>
                {["A", "B", "C", "D"][i]}
              </span>
              <span className="text-sm" style={{ color: "#FAFAFA" }}>{opt}</span>
              {answered && i === q.correct && <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto shrink-0" />}
              {answered && i === selected && i !== q.correct && <XCircle className="h-4 w-4 text-red-500 ml-auto shrink-0" />}
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {answered && (
        <div className="rounded-xl p-4" style={{ border: "1px solid rgba(59,130,246,0.25)", background: "rgba(59,130,246,0.07)" }}>
          <p className="text-xs font-semibold mb-1" style={{ color: "#60a5fa" }}>Explanation</p>
          <p className="text-sm" style={{ color: "#A1A1AA" }}>{q.explanation}</p>
        </div>
      )}

      <button onClick={next} disabled={!answered}
        className="w-full h-11 rounded-xl font-semibold text-white disabled:opacity-40 transition-all flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
        {cur + 1 === questions.length ? "Finish & See Results" : "Next Question"}
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

// ─── Coding Question component ────────────────────────────────────────────────
function CodingQuestion({ q, index, total, onNext }: { q: CodingQ; index: number; total: number; onNext: () => void }) {
  const [code, setCode] = useState(`// ${q.title}\n// Write your solution here\n\nfunction solution() {\n  \n}`)
  const [showHint, setShowHint] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const diffColor = q.difficulty === "Easy" ? "#10b981" : q.difficulty === "Medium" ? "#f59e0b" : "#ef4444"

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Problem {index + 1} of {total}</span>
        <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${diffColor}20`, color: diffColor }}>
          {q.difficulty}
        </span>
      </div>

      <div className="rounded-xl border border-border bg-card/50 p-5 space-y-3">
        <h3 className="font-bold text-foreground">{q.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{q.statement}</p>
        {q.constraints && (
          <p className="text-xs text-muted-foreground font-mono bg-muted/30 rounded px-3 py-1.5">Constraints: {q.constraints}</p>
        )}
        {q.example && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Input</p>
              <p className="text-xs font-mono text-foreground">{q.example.input ?? "—"}</p>
            </div>
            <div className="rounded-lg bg-muted/30 p-3">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Output</p>
              <p className="text-xs font-mono text-foreground">{q.example.output ?? "—"}</p>
            </div>
          </div>
        )}
        {q.example?.explanation && (
          <p className="text-xs text-muted-foreground">Explanation: {q.example.explanation}</p>
        )}
      </div>

      {/* Code editor */}
      <div className="rounded-xl overflow-hidden border border-border">
        <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-border">
          <span className="text-xs text-emerald-400 font-mono">solution.js</span>
          <span className="text-xs text-muted-foreground">{q.topic}</span>
        </div>
        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          className="w-full bg-black/60 text-emerald-300 font-mono text-sm p-4 resize-none focus:outline-none"
          rows={10}
          spellCheck={false}
        />
      </div>

      {/* Hints */}
      {q.hints?.length > 0 && (
        <button onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors">
          {showHint ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {showHint ? "Hide hints" : "Show hints"}
        </button>
      )}
      {showHint && q.hints && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-1">
          {q.hints.map((h, i) => <p key={i} className="text-sm text-amber-300">💡 {h}</p>)}
        </div>
      )}

      {submitted ? (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
          <p className="font-semibold text-emerald-400">Submitted!</p>
          <button onClick={onNext}
            className="mt-3 px-6 py-2 rounded-xl font-semibold text-white text-sm"
            style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
            {index + 1 === total ? "See Results" : "Next Problem"}
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <button className="flex-1 h-11 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all flex items-center justify-center gap-2">
            <Play className="h-4 w-4" /> Run Code
          </button>
          <button onClick={() => { setSubmitted(true) }}
            className="flex-1 h-11 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
            Submit <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Results screen ───────────────────────────────────────────────────────────
function Results({ score, answers, questions, company, section, onRetry, onBack }: {
  score: number; answers: number[]; questions: MCQ[]; company: any; section: string;
  onRetry: () => void; onBack: () => void
}) {
  const correct = answers.filter((a, i) => a === questions[i]?.correct).length
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444"
  const topicMap: Record<string, { correct: number; total: number }> = {}
  questions.forEach((q, i) => {
    if (!topicMap[q.topic]) topicMap[q.topic] = { correct: 0, total: 0 }
    topicMap[q.topic].total++
    if (answers[i] === q.correct) topicMap[q.topic].correct++
  })
  const weak = Object.entries(topicMap).filter(([, v]) => v.correct / v.total < 0.6).map(([k]) => k)

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <ScoreBadge score={score} />

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Correct", value: correct, color: "#10b981" },
          { label: "Wrong", value: questions.length - correct, color: "#ef4444" },
          { label: "Total", value: questions.length, color: "#6366f1" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card/40 p-4 text-center">
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Topic-wise breakdown */}
      <div className="rounded-xl border border-border bg-card/40 p-5">
        <p className="text-sm font-semibold text-foreground mb-4">Topic Breakdown</p>
        <div className="space-y-3">
          {Object.entries(topicMap).map(([topic, v]) => {
            const pct = Math.round((v.correct / v.total) * 100)
            const c = pct >= 80 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444"
            return (
              <div key={topic}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{topic}</span>
                  <span className="font-semibold" style={{ color: c }}>{pct}%</span>
                </div>
                <ProgressBar value={pct} color={c} />
              </div>
            )
          })}
        </div>
      </div>

      {/* AI recommendations */}
      {weak.length > 0 && (
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="h-4 w-4 text-violet-400" />
            <p className="text-sm font-semibold text-foreground">AI Recommended Topics</p>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Focus on these to improve your {company.name} score:</p>
          <div className="flex flex-wrap gap-2">
            {weak.map(t => (
              <span key={t} className="text-xs px-3 py-1 rounded-full border border-violet-500/30 text-violet-300 bg-violet-500/10">
                📚 {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Review answers */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground">Review Answers</p>
        {questions.map((q, i) => {
          const ok = answers[i] === q.correct
          return (
            <div key={q.id} className={`rounded-xl border p-4 ${ok ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"}`}>
              <div className="flex items-start gap-3">
                {ok ? <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" /> : <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium">{q.question}</p>
                  {!ok && <p className="text-xs text-emerald-400 mt-1">Correct: {q.options[q.correct]}</p>}
                  <p className="text-xs text-muted-foreground mt-1">{q.explanation}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex gap-3">
        <button onClick={onRetry}
          className="flex-1 h-11 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all flex items-center justify-center gap-2">
          <RotateCcw className="h-4 w-4" /> Retry
        </button>
        <button onClick={onBack}
          className="flex-1 h-11 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
          Back to Assessments
        </button>
      </div>
    </div>
  )
}

// ─── Company Assessment flow ──────────────────────────────────────────────────
type AssessStage = "info" | "roadmap" | "instructions" | "section" | "results" | "coding" | "report"

function CompanyAssessment({ company, onBack }: { company: typeof ALL_COMPANIES[0]; onBack: () => void }) {
  const [stage, setStage] = useState<AssessStage>("info")
  const [curSection, setCurSection] = useState(0)
  const [sectionScores, setSectionScores] = useState<Record<string, number>>({})
  const [questions, setQuestions] = useState<MCQ[]>([])
  const [codingQs, setCodingQs] = useState<CodingQ[]>([])
  const [codingIdx, setCodingIdx] = useState(0)
  const [loading, setLoading] = useState(false)
  const [answers, setAnswers] = useState<number[]>([])
  const [allQuestions, setAllQuestions] = useState<MCQ[]>([])
  const [allAnswers, setAllAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(company.duration * 60)
  const [timeTaken, setTimeTaken] = useState(0)
  const [hiringReport, setHiringReport] = useState<any>(null)
  const [reportLoading, setReportLoading] = useState(false)
  const [violationLog, setViolationLog] = useState<ViolationLog>({ tabSwitches: 0, fullscreenExits: 0, copyAttempts: 0, pasteAttempts: 0, cameraViolations: 0 })
  const [proctorActive, setProctorActive] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const section = company.sections[curSection]
  const isCoding = section === "coding"
  const totalScore = Object.values(sectionScores).length > 0
    ? Math.round(Object.values(sectionScores).reduce((a, b) => a + b, 0) / Object.values(sectionScores).length)
    : 0

  // Timer
  useEffect(() => {
    if (stage === "section" || stage === "coding") {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => Math.max(0, t - 1))
        setTimeTaken(t => t + 1)
      }, 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [stage])

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`

  const loadSection = async (sectionKey: string) => {
    setLoading(true)
    try {
      const res = await fetch("/api/student/generate-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: company.id, section: sectionKey, count: SECTION_QTY[sectionKey] ?? 5 }),
      })
      const data = await res.json()
      if (sectionKey === "coding") {
        setCodingQs(data.questions ?? [])
        setCodingIdx(0)
        setStage("coding")
      } else {
        setQuestions(data.questions ?? [])
        setStage("section")
      }
    } catch {
      setStage("section")
    } finally { setLoading(false) }
  }

  const startAssessment = () => {
    setCurSection(0)
    setSectionScores({})
    setAllQuestions([])
    setAllAnswers([])
    setTimeLeft(company.duration * 60)
    setTimeTaken(0)
    setProctorActive(true)
    loadSection(company.sections[0])
  }

  const generateReport = async (finalScore: number, finalScores: Record<string, number>, qs: MCQ[], ans: number[]) => {
    setProctorActive(false)
    setReportLoading(true)
    try {
      const nonCodingQs = qs.filter(q => q.options?.length > 0)
      const topicScores: Record<string, any> = {}
      nonCodingQs.forEach((q, i) => {
        if (!topicScores[q.topic]) topicScores[q.topic] = { correct: 0, total: 0 }
        topicScores[q.topic].total++
        if (ans[i] === q.correct) topicScores[q.topic].correct++
      })
      const topicPct: Record<string, number> = {}
      Object.entries(topicScores).forEach(([k, v]: any) => { topicPct[k] = Math.round((v.correct / v.total) * 100) })

      const res = await fetch("/api/student/hiring-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: company.id,
          companyName: company.name,
          targetRole: company.sections.includes("coding") && !company.sections.includes("quantitative") ? "Software Developer" : "Systems Engineer",
          scores: { overall: finalScore, sections: finalScores },
          candidateRatings: { aptitude: finalScores.quantitative ?? 50, coding: finalScores.coding ?? 50, dsa: finalScores.coding ?? 50, csFoundations: finalScores.technical ?? 50, communication: 65 },
          violations: violationLog,
          timeStats: { totalTime: Math.round(timeTaken / 60), avgTimePerQ: qs.length > 0 ? Math.round(timeTaken / qs.length) : 60 },
          topicScores: topicPct,
          testHistory: [],
        }),
      })
      const data = await res.json()
      setHiringReport(data.report)

      // Save to assessment history
      try {
        await fetch("/api/student/assessment-history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company: company.id,
            companyName: company.name,
            sections: company.sections,
            overallScore: finalScore,
            sectionScores: finalScores,
            timeTaken,
            violations: violationLog,
            readinessScore: data.report?.readinessScore ?? 0,
            selectionProbability: data.report?.selectionProbability?.overall ?? 0,
            verdict: data.report?.hrReport?.verdict ?? "",
          }),
        })
      } catch {}

      setStage("report")
    } catch {
      setStage("results")
    } finally { setReportLoading(false) }
  }

  const sectionDone = (score: number, ans: number[], qs: MCQ[]) => {
    const newScores = { ...sectionScores, [section]: score }
    const newQs = [...allQuestions, ...qs]
    const newAnswers = [...allAnswers, ...ans]
    setSectionScores(newScores)
    setAllQuestions(newQs)
    setAllAnswers(newAnswers)

    const next = curSection + 1
    if (next < company.sections.length) {
      setCurSection(next)
      loadSection(company.sections[next])
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      const nonCoding = newQs.filter(q => q.options?.length > 0)
      const nonAns = newAnswers.slice(0, nonCoding.length)
      const finalScore = nonCoding.length > 0
        ? Math.round(nonAns.filter((a, i) => a === nonCoding[i]?.correct).length / nonCoding.length * 100)
        : Math.round(Object.values(newScores).reduce((a, b) => a + b, 0) / Object.values(newScores).length)
      setAnswers(newAnswers)
      setQuestions(newQs)
      generateReport(finalScore, newScores, newQs, newAnswers)
    }
  }

  const codingDone = () => {
    const next = curSection + 1
    const newScores = { ...sectionScores, coding: 75 }
    setSectionScores(newScores)
    if (next < company.sections.length) {
      setCurSection(next)
      loadSection(company.sections[next])
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      const finalScore = Math.round(Object.values(newScores).reduce((a, b) => a + b, 0) / Object.values(newScores).length)
      generateReport(finalScore, newScores, allQuestions, allAnswers)
    }
  }

  const roadmapReqs = [
    { label: "Quantitative", pct: company.sections.includes("quantitative") ? 65 : 0, topic: "Probability, Time & Work" },
    { label: "Logical Reasoning", pct: company.sections.includes("logical") ? 78 : 0, topic: "Syllogisms, Seating Arrangement" },
    { label: "Verbal Ability", pct: company.sections.includes("verbal") ? 72 : 0, topic: "Reading Comprehension" },
    { label: "Coding", pct: company.sections.includes("coding") ? 55 : 0, topic: "Arrays, Strings, Basic DP" },
  ].filter(r => r.pct > 0)

  // ── INFO ──
  if (stage === "info") return (
    <div className="max-w-xl mx-auto space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="rounded-2xl border p-6 space-y-4" style={{ borderColor: `${company.color}30`, background: `${company.color}08` }}>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl text-lg font-black text-white"
            style={{ background: company.color }}>
            {company.abbr}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{company.name}</h2>
            <p className="text-sm text-muted-foreground">{company.desc}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Duration", value: `${company.duration} min`, icon: <Timer className="h-4 w-4" /> },
            { label: "Questions", value: company.questions, icon: <FileText className="h-4 w-4" /> },
            { label: "Difficulty", value: company.difficulty, icon: <Target className="h-4 w-4" /> },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-border bg-card/50 p-4 text-center">
              <div className="flex justify-center mb-1 text-muted-foreground">{s.icon}</div>
              <p className="font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground mb-2">Sections</p>
          <div className="flex flex-wrap gap-2">
            {company.sections.map(s => (
              <span key={s} className="text-xs px-3 py-1 rounded-full border border-border bg-card/40 text-foreground font-medium">
                {SECTION_LABELS[s]}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => setStage("roadmap")}
          className="h-12 rounded-xl border border-border bg-card/40 font-semibold text-sm text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" /> Prepare First
        </button>
        <button onClick={() => setStage("instructions")}
          className="h-12 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2"
          style={{ background: `linear-gradient(135deg,${company.color},${company.color}cc)` }}>
          <Play className="h-4 w-4" /> Start Assessment
        </button>
      </div>
    </div>
  )

  // ── ROADMAP ──
  if (stage === "roadmap") return (
    <div className="max-w-xl mx-auto space-y-5">
      <button onClick={() => setStage("info")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
        <div className="flex items-center gap-3 mb-5">
          <Cpu className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-foreground">AI Preparation Roadmap</h3>
          <span className="ml-auto text-xs text-muted-foreground">{company.name}</span>
        </div>
        <div className="space-y-4">
          {roadmapReqs.map(r => {
            const c = r.pct >= 75 ? "#10b981" : r.pct >= 60 ? "#f59e0b" : "#ef4444"
            return (
              <div key={r.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-foreground">{r.label}</span>
                  <span className="text-sm font-bold tabular-nums" style={{ color: c }}>{r.pct}%</span>
                </div>
                <ProgressBar value={r.pct} color={c} />
                <p className="text-xs text-muted-foreground mt-1">Recommended: {r.topic}</p>
              </div>
            )
          })}
        </div>
      </div>
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
        <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-400" /> Recommended Study Plan
        </p>
        <div className="space-y-2">
          {["Week 1: Master Quantitative — focus on speed and accuracy", "Week 2: Logical Reasoning patterns — practice daily sets", "Week 3: Verbal & Coding — mock tests every alternate day", "Week 4: Full-length mocks — time yourself strictly"].map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-amber-400 font-bold shrink-0">{i + 1}.</span> {s}
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => setStage("instructions")}
        className="w-full h-12 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
        style={{ background: `linear-gradient(135deg,${company.color},${company.color}cc)` }}>
        <Play className="h-4 w-4" /> I'm Ready — Start Assessment
      </button>
    </div>
  )

  // ── INSTRUCTIONS ──
  if (stage === "instructions") return (
    <div className="max-w-xl mx-auto space-y-5">
      <h3 className="text-xl font-bold text-foreground">Assessment Instructions</h3>
      <div className="rounded-xl border border-border bg-card/40 p-5 space-y-3">
        {[
          `Total duration: ${company.duration} minutes`,
          `${company.sections.length} sections — complete all in sequence`,
          "Each section has its own set of questions generated for you",
          "For MCQs: select your answer and click Next",
          "For Coding: write your solution and click Submit",
          "No going back to previous questions",
          "Timer runs continuously — manage your time",
        ].map((t, i) => (
          <div key={i} className="flex items-start gap-3 text-sm">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold mt-0.5">{i + 1}</span>
            <span className="text-muted-foreground">{t}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3">
        <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-300">Questions are AI-generated specifically for {company.name} pattern. They simulate the real exam experience.</p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center gap-3 py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Generating your {company.name} assessment…</p>
        </div>
      ) : (
        <button onClick={startAssessment}
          className="w-full h-12 rounded-xl font-bold text-white flex items-center justify-center gap-2 text-base"
          style={{ background: `linear-gradient(135deg,${company.color},${company.color}cc)` }}>
          <Zap className="h-5 w-5" /> Start {company.name} Assessment
        </button>
      )}
    </div>
  )

  // ── LOADING SECTION ──
  if (loading) {
    const content = (
      <div className="flex flex-col items-center justify-center min-h-screen gap-5">
        <div className="relative">
          <div className="h-14 w-14 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <Cpu className="absolute inset-0 m-auto h-6 w-6 text-primary" />
        </div>
        <div className="text-center">
          <p className="font-bold text-lg text-foreground">Generating {SECTION_LABELS[section]} Questions</p>
          <p className="text-sm text-muted-foreground mt-1">AI is creating {company.name}-pattern questions for you…</p>
        </div>
      </div>
    )
    return proctorActive ? (
      <ProctoredShell companyName={company.name} onViolation={setViolationLog} onAbort={() => { setProctorActive(false); setStage("info") }}>
        {content}
      </ProctoredShell>
    ) : content
  }

  // ── Exam top bar (shared between section & coding) ──
  const ExamTopBar = () => (
    <div className="sticky top-0 z-10"
      style={{ background: "rgba(9,9,11,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-black text-white shrink-0"
            style={{ background: company.color }}>
            {company.abbr}
          </div>
          <div>
            <p className="text-xs" style={{ color: "#71717A" }}>{company.name} · Section {curSection + 1}/{company.sections.length}</p>
            <p className="font-semibold text-sm" style={{ color: "#FAFAFA" }}>{SECTION_LABELS[section]}</p>
          </div>
        </div>
        {/* Section progress dots */}
        <div className="hidden sm:flex items-center gap-1.5">
          {company.sections.map((s, i) => (
            <div key={s} className="h-2 rounded-full transition-all"
              style={{
                width: i === curSection ? 24 : 8,
                background: i <= curSection ? company.color : "rgba(255,255,255,0.12)",
              }} />
          ))}
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(24,24,27,0.6)" }}>
          <Timer className="h-4 w-4" style={{ color: "#a78bfa" }} />
          <span className="text-sm font-mono font-bold"
            style={{ color: timeLeft < 300 ? "#f87171" : "#FAFAFA" }}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
    </div>
  )

  // ── MCQ SECTION ──
  if (stage === "section") {
    const content = (
      <div className="min-h-screen">
        <ExamTopBar />
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-6">
          <MCQQuiz questions={questions} onComplete={sectionDone} />
        </div>
      </div>
    )
    return (
      <ProctoredShell companyName={company.name} onViolation={setViolationLog} onAbort={() => { setProctorActive(false); setStage("info") }}>
        {content}
      </ProctoredShell>
    )
  }

  // ── CODING SECTION ──
  if (stage === "coding") {
    const content = (
      <div className="min-h-screen">
        <ExamTopBar />
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-6">
          {codingQs.length > 0 ? (
            <CodingQuestion
              q={codingQs[codingIdx]}
              index={codingIdx}
              total={codingQs.length}
              onNext={() => {
                if (codingIdx + 1 < codingQs.length) {
                  setCodingIdx(i => i + 1)
                } else {
                  codingDone()
                }
              }}
            />
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No coding questions available</p>
              <button onClick={codingDone} className="mt-4 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">Continue</button>
            </div>
          )}
        </div>
      </div>
    )
    return (
      <ProctoredShell companyName={company.name} onViolation={setViolationLog} onAbort={() => { setProctorActive(false); setStage("info") }}>
        {content}
      </ProctoredShell>
    )
  }

  // ── GENERATING REPORT ──
  if (reportLoading) return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-5" style={{ background: "var(--background)" }}>
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <Cpu className="absolute inset-0 m-auto h-7 w-7 text-primary" />
      </div>
      <div className="text-center">
        <p className="font-bold text-xl text-foreground">Generating AI Recruitment Report</p>
        <p className="text-sm text-muted-foreground mt-1">Analysing performance · Benchmarking · Creating personalised roadmap…</p>
      </div>
    </div>
  )

  // ── AI HIRING REPORT ──
  if (stage === "report" && hiringReport) return (
    <div className="flex-1 p-4 md:p-8 max-w-screen-xl mx-auto w-full">
      {showLeaderboard && (
        <AssessmentLeaderboard
          company={company.id}
          companyName={company.name}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
      <div className="max-w-3xl mx-auto space-y-4">
        <button onClick={() => setShowLeaderboard(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-semibold hover:bg-amber-500/20 transition-all">
          <Trophy className="h-4 w-4" /> View Leaderboard — See how you rank vs others
        </button>
        <HiringReport
          report={hiringReport}
          companyColor={company.color}
          onRetry={() => { setStage("instructions"); setSectionScores({}); setAllQuestions([]); setAllAnswers([]); setHiringReport(null) }}
          onBack={onBack}
        />
      </div>
    </div>
  )

  // ── RESULTS (fallback if report failed) ──
  if (stage === "results") {
    const nonCodingQs = allQuestions.filter(q => q.options?.length > 0)
    const nonCodingAnswers = allAnswers.slice(0, nonCodingQs.length)
    const finalScore = nonCodingQs.length > 0
      ? Math.round(nonCodingAnswers.filter((a, i) => a === nonCodingQs[i]?.correct).length / nonCodingQs.length * 100)
      : totalScore || 70

    return (
      <div className="max-w-xl mx-auto space-y-5">
        <h3 className="text-xl font-bold text-foreground text-center">{company.name} — Assessment Complete</h3>
        {nonCodingQs.length > 0 ? (
          <Results
            score={finalScore}
            answers={nonCodingAnswers}
            questions={nonCodingQs}
            company={company}
            section="full"
            onRetry={() => { setStage("instructions"); setSectionScores({}); setAllQuestions([]); setAllAnswers([]) }}
            onBack={onBack}
          />
        ) : (
          <div className="space-y-5">
            <ScoreBadge score={75} />
            <p className="text-center text-sm text-muted-foreground">Coding assessment submitted. Great work!</p>
            <button onClick={onBack}
              className="w-full h-12 rounded-xl font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
              Back to Assessments
            </button>
          </div>
        )}
      </div>
    )
  }

  return null
}

// ─── Topic Practice (Aptitude / CS / Coding) ─────────────────────────────────
function TopicPractice({ pathId, topic, onBack }: { pathId: Path; topic: { id: string; name: string }; onBack: () => void }) {
  const [stage, setStage] = useState<"loading" | "quiz" | "results">("loading")
  const [questions, setQuestions] = useState<MCQ[]>([])
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  const sectionMap: Record<Path, string> = {
    aptitude: "quantitative",
    cs: "logical",
    coding: "coding",
    company: "quantitative",
    communication: "verbal",
  }

  const companyMap: Record<Path, string> = {
    aptitude: "tcs",
    cs: "infosys",
    coding: "amazon",
    company: "tcs",
    communication: "infosys",
  }

  useEffect(() => {
    fetch("/api/student/generate-assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company: companyMap[pathId],
        section: sectionMap[pathId],
        count: 5,
        topic: topic.name,
      }),
    })
      .then(r => r.json())
      .then(d => { setQuestions(d.questions ?? []); setStage("quiz") })
      .catch(() => setStage("quiz"))
  }, [])

  if (stage === "loading") return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Generating {topic.name} questions…</p>
    </div>
  )

  if (stage === "results") return (
    <div className="max-w-xl mx-auto space-y-5">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <Results
        score={score} answers={answers} questions={questions}
        company={{ name: topic.name, color: "#7c3aed" }} section={topic.id}
        onRetry={() => { setStage("loading"); setScore(0); setAnswers([]) }}
        onBack={onBack}
      />
    </div>
  )

  if (questions.length === 0) return (
    <div className="text-center py-24">
      <p className="text-muted-foreground">Could not load questions. Please try again.</p>
      <button onClick={onBack} className="mt-4 text-sm text-primary hover:underline">Go back</button>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h3 className="font-bold text-xl text-foreground">{topic.name} Practice</h3>
      <MCQQuiz questions={questions} onComplete={(s, ans) => { setScore(s); setAnswers(ans); setStage("results") }} />
    </div>
  )
}

// ─── Company Assessment Grid (Unstop-style) ───────────────────────────────────
function CompanyAssessmentGrid({ onSelect, onBack }: { onSelect: (c: any) => void; onBack: () => void }) {
  const [categoryFilter, setCategoryFilter] = useState<string>("All")
  const [companyFilter, setCompanyFilter]   = useState<string>("All")
  const [roleFilter, setRoleFilter]         = useState<string>("All")
  const [search, setSearch]                 = useState("")

  const categories = ["All", "IT Services", "Product", "Consulting", "BFSI", "Core Engg", "Telecom", "Analytics", "Pharma", "FMCG", "EV/Auto", "Defence"]
  const allRoles = ["All", ...Array.from(new Set(ALL_COMPANIES.flatMap(c => (c as any).roles ?? [])))]

  const filtered = ALL_COMPANIES.filter(c => {
    const cat = categoryFilter === "All" || (c as any).category === categoryFilter
    const comp = companyFilter === "All" || c.name.toLowerCase().includes(companyFilter.toLowerCase())
    const role = roleFilter === "All" || ((c as any).roles ?? []).includes(roleFilter)
    const srch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase()) || (c as any).category?.toLowerCase().includes(search.toLowerCase())
    return cat && comp && role && srch
  })

  const clearAll = () => { setCategoryFilter("All"); setCompanyFilter("All"); setRoleFilter("All"); setSearch("") }

  return (
    <div className="flex-1 p-4 md:p-6 max-w-screen-2xl mx-auto w-full space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div>
          <h2 className="text-xl font-bold text-foreground">Choose From The Top Roles</h2>
          <p className="text-sm text-muted-foreground">AI generates real previous-year pattern questions for each company</p>
        </div>
      </div>

      {/* Filters — Unstop style */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Category */}
        <div className="relative">
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="appearance-none pl-4 pr-8 py-2 rounded-full border border-border bg-card text-sm font-medium text-foreground cursor-pointer focus:outline-none focus:border-primary/50 transition-all">
            {categories.map(c => <option key={c} value={c}>{c === "All" ? "Category: All" : c}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        </div>

        {/* Company — search input */}
        <div className="relative">
          <input
            value={companyFilter === "All" ? "" : companyFilter}
            onChange={e => setCompanyFilter(e.target.value || "All")}
            placeholder="Search company..."
            className="pl-9 pr-8 py-2 rounded-full border border-border bg-card text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all w-48"
          />
          <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          {companyFilter !== "All" && (
            <button onClick={() => setCompanyFilter("All")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs">✕</button>
          )}
        </div>

        {/* Role */}
        <div className="relative">
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            className="appearance-none pl-4 pr-8 py-2 rounded-full border border-border bg-card text-sm font-medium text-foreground cursor-pointer focus:outline-none focus:border-primary/50 transition-all">
            <option value="All">Select Role</option>
            {allRoles.slice(1).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        </div>

        {/* Search */}
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search company…"
          className="pl-4 pr-4 py-2 rounded-full border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all w-40"
        />

        {/* Clear */}
        {(categoryFilter !== "All" || companyFilter !== "All" || roleFilter !== "All" || search) && (
          <button onClick={clearAll} className="text-sm font-semibold text-red-500 hover:text-red-400 transition-colors">
            Clear All
          </button>
        )}

        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} companies</span>
      </div>

      {/* Category quick pills */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${categoryFilter === cat ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid — Unstop card style */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No companies match your filters</p>
          <button onClick={clearAll} className="mt-2 text-sm text-primary hover:underline">Clear filters</button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(c => {
            const diffColor = (c as any).difficulty === "Easy" ? "#10b981"
              : (c as any).difficulty === "Hard" || (c as any).difficulty === "Very Hard" ? "#ef4444"
              : "#f59e0b"
            return (
              <div key={c.id}
                className="group rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-xl transition-all overflow-hidden flex flex-col cursor-pointer"
                onClick={() => onSelect(c)}>
                {/* Logo area */}
                <div className="flex items-center justify-center h-32 border-b border-border/60"
                  style={{ background: `${c.color}10` }}>
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-black text-white shadow-lg"
                    style={{ background: `linear-gradient(135deg,${c.color},${c.color}cc)` }}>
                    {(c as any).logo ?? c.abbr}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col">
                  {/* Role — first role in list */}
                  <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-0.5">
                    {((c as any).roles ?? ["Software Engineer"])[0]}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">{c.name}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold border"
                      style={{ background: `${diffColor}15`, color: diffColor, borderColor: `${diffColor}30` }}>
                      {(c as any).difficulty}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-white/5 text-muted-foreground border border-border">
                      {c.duration} min
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-white/5 text-muted-foreground border border-border">
                      {c.questions} Qs
                    </span>
                  </div>

                  {/* Start Test button */}
                  <button
                    className="mt-auto w-full h-9 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all"
                    onClick={(e) => { e.stopPropagation(); onSelect(c) }}>
                    Start Test
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Learning Paths placeholder (full paths are in /student/learn) ─────────────
function LearningPathsPlaceholder() {
  return (
    <div className="text-center py-16 space-y-4">
      <p className="text-lg font-bold text-foreground">Learning Paths</p>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Your full learning roadmap is available on the <strong>Learn</strong> page.
        It includes step-by-step paths for Python, DSA, Web Dev, Git, and CS fundamentals.
      </p>
      <a href="/student/learn#learning"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
        style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
        Go to Learning Paths →
      </a>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function PrepHubPage() {
  const [activePath, setActivePath] = useState<Path | null>(null)
  const [activeCompany, setActiveCompany] = useState<typeof ALL_COMPANIES[0] | null>(null)
  const [activeTopic, setActiveTopic] = useState<{ id: string; name: string } | null>(null)
  const [subView, setSubView] = useState<"home" | "topics" | "learn" | "mock">("home")
  const [showHistory, setShowHistory] = useState(false)
  const [showLearningPaths, setShowLearningPaths] = useState(false)
  const [showSmartResume, setShowSmartResume] = useState(false)
  const [showPracticeMenu, setShowPracticeMenu] = useState(false)
  const [studentYear, setStudentYear] = useState<number | null>(null)
  // Role filter states for company grid
  const [roleSearch, setRoleSearch]       = useState("")
  const [roleCategory, setRoleCategory]   = useState("All")
  const [roleCompany, setRoleCompany]     = useState("")
  const [roleName, setRoleName]           = useState("")

  // Detect student year
  useEffect(() => {
    fetch("/api/auth/user", { credentials: "include", cache: "no-store" })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        const gy = d?.user?.graduationYear
        if (!gy) return
        const now = new Date()
        const cur = now.getFullYear()
        const academicYear = now.getMonth() >= 6 ? cur : cur - 1
        const yr = Math.min(Math.max(5 - (Number(gy) - academicYear), 1), 4)
        setStudentYear(yr)
      })
      .catch(() => {})
  }, [])

  // Open Smart Resume overlay if navigated here with #smart-resume hash
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#smart-resume") {
      setShowSmartResume(true)
      window.history.replaceState(null, "", window.location.pathname)
    }
    // Auto-open track if ?track= param is present
    const urlParams = new URLSearchParams(window.location.search)
    const track = urlParams.get("track")
    if (track === "aptitude" || track === "coding" || track === "communication") {
      setActivePath(track as Path)
      setSubView("home")
      window.history.replaceState(null, "", window.location.pathname)
    }
  }, [])

  // Lock body scroll when any overlay is open
  useEffect(() => {
    const anyOpen = showHistory || showLearningPaths || showSmartResume
    if (anyOpen) {
      // Compensate for scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = "hidden"
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = ""
      document.body.style.paddingRight = ""
    }
    return () => {
      document.body.style.overflow = ""
      document.body.style.paddingRight = ""
    }
  }, [showHistory, showLearningPaths, showSmartResume])

  // null = loading, 1 = first year (no company grids), 2-4 = show company grids
  const isFirstYear = studentYear === 1
  const yearLoaded  = studentYear !== null

  // ── COMPANY ASSESSMENT ──
  if (activePath === "company" && activeCompany) {
    return (
      <div className="flex-1 p-4 md:p-8 max-w-screen-xl mx-auto w-full">
        <CompanyAssessment company={activeCompany} onBack={() => { setActiveCompany(null); setActivePath(null) }} />
      </div>
    )
  }

  // ── TOPIC PRACTICE ──
  if (activeTopic) {
    return (
      <div className="flex-1 p-4 md:p-8 max-w-screen-xl mx-auto w-full">
        <TopicPractice pathId={activePath!} topic={activeTopic} onBack={() => setActiveTopic(null)} />
      </div>
    )
  }

  // ── PATH DETAIL ──
  if (activePath) {
    const pathMeta = {
      aptitude:      { label: "Aptitude",           color: "#f59e0b", topics: APT_TOPICS },
      coding:        { label: "Coding / DSA",        color: "#6366f1", topics: DSA_TOPICS.map(t => ({ ...t, icon: "💻" })) },
      cs:            { label: "CS Fundamentals",     color: "#10b981", topics: CS_TOPICS },
      company:       { label: "Company Assessments", color: "#7c3aed", topics: [] },
      communication: { label: "Communication",       color: "#10b981", topics: COMM_TOPICS },
    }[activePath] ?? { label: "Practice", color: "#7c3aed", topics: [] }

    if (activePath === "company") {
      return <CompanyAssessmentGrid onSelect={(c) => setActiveCompany(c as any)} onBack={() => setActivePath(null)} />
    }

    return (
      <div className="flex-1 p-4 md:p-8 max-w-screen-xl mx-auto w-full space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => { setActivePath(null); setSubView("home") }}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h2 className="text-xl font-bold text-foreground">{pathMeta.label}</h2>
        </div>

        {/* Sub-nav */}
        <div className="flex gap-2 flex-wrap">
          {[
            { v: "home", l: "Overview" },
            { v: "learn", l: "Learn" },
            { v: "topics", l: activePath === "coding" ? "Topic Practice" : "Topic Tests" },
            { v: "mock", l: "Full Mock" },
          ].map(({ v, l }) => (
            <button key={v} onClick={() => setSubView(v as any)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={subView === v
                ? { background: `${pathMeta.color}20`, color: pathMeta.color, border: `1px solid ${pathMeta.color}30` }
                : { background: "transparent", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}>
              {l}
            </button>
          ))}
        </div>

        {/* Learn */}
        {subView === "learn" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Tap a topic to study key concepts, formulas, and examples.</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pathMeta.topics.map((t: any) => {
                const notes: Record<string, { formula?: string; points: string[]; example?: string }> = {
                  "percentages": { formula: "Percentage = (Part / Whole) × 100", points: ["Percentage increase = (New − Old)/Old × 100","Successive discounts: a% + b% = (a+b − ab/100)%","Profit% = (Profit/CP) × 100"], example: "If CP=200 and SP=250, Profit% = 50/200×100 = 25%" },
                  "profit-loss": { formula: "Profit = SP − CP;  Loss = CP − SP", points: ["SP = CP × (1 + Profit%/100)","Discount = MP − SP","True discount: TD = PW × r × t / 100"], example: "MP=500, 20% discount → SP=400" },
                  "time-work": { formula: "Work = Rate × Time  →  1/A + 1/B = 1/T", points: ["A+B together: T = AB/(A+B)","Pipes: filling rate − draining rate = net rate","If A is twice as fast as B, ratio of time = 1:2"], example: "A=12 days, B=18 → together = 12×18/30 = 7.2 days" },
                  "speed-distance": { formula: "Speed = Distance / Time", points: ["Relative speed (same dir): |S1−S2|","Relative speed (opp dir): S1+S2","Average speed = 2S1×S2/(S1+S2) for equal distances"], example: "Train 300m at 60km/h passes pole in 300/60×3.6 = 18s" },
                  "probability": { formula: "P(E) = Favourable / Total outcomes", points: ["P(A∪B) = P(A)+P(B)−P(A∩B)","P(A') = 1 − P(A)","Independent events: P(A∩B)=P(A)×P(B)"], example: "2 dice: P(sum=7) = 6/36 = 1/6" },
                  "arrays": { points: ["Access O(1), Insert/Delete O(n)","Two-pointer for sorted arrays","Kadane's algorithm for max subarray","Prefix sums for range queries"], formula: "prefix[i] = prefix[i-1] + arr[i]", example: "Max subarray [−2,1,−3,4,−1,2] → 6 (Kadane)" },
                  "strings": { points: ["Sliding window for substring problems","KMP for pattern matching O(n+m)","Palindrome check: two pointers from ends","Anagram: sort or frequency map"], formula: "Window expand/shrink for substring problems", example: "Longest substring without repeat: sliding window" },
                  "linked-lists": { points: ["Fast/slow pointer for cycle detection","Reverse: prev→cur→next iteration","Merge sorted lists: dummy head pattern","Find middle: slow+fast pointers"], example: "Floyd's cycle: slow moves 1, fast moves 2" },
                  "trees": { points: ["DFS: preorder, inorder, postorder","BFS: level-order with queue","BST: left < root < right","Height = 1 + max(left, right)"], formula: "nodes in complete tree = 2^h − 1", example: "Inorder of BST gives sorted array" },
                  "graphs": { points: ["BFS: shortest path (unweighted)","DFS: cycle detection, topological sort","Dijkstra: shortest path (weighted)","Union-Find: connected components"], formula: "Dijkstra: O((V+E) log V)", example: "BFS from source, dist[] updated per level" },
                  "dbms": { points: ["ACID: Atomicity, Consistency, Isolation, Durability","Normalization: 1NF→2NF→3NF→BCNF","Indexing: B-tree, Hash","JOIN types: INNER, LEFT, RIGHT, FULL OUTER"], formula: "SELECT col FROM table WHERE condition GROUP BY col HAVING agg", example: "1NF: no repeating groups; 2NF: no partial dependency" },
                  "os": { points: ["Scheduling: FCFS, SJF, Round Robin, Priority","Deadlock: Mutual exclusion, Hold & Wait, No preemption, Circular wait","Paging: page table maps virtual→physical","Semaphore: binary (mutex) and counting"], formula: "Turnaround = Completion − Arrival; Waiting = Turnaround − Burst", example: "Round Robin Q=3: P1(10),P2(5),P3(8) → context switch every 3ms" },
                  "cn": { points: ["OSI 7 layers: Physical→Data Link→Network→Transport→Session→Presentation→Application","TCP: reliable, connection-oriented; UDP: fast, connectionless","IP classes: A(0−127) B(128−191) C(192−223)","Subnetting: borrow bits from host portion"], formula: "Subnet mask /24 = 255.255.255.0 → 254 hosts", example: "HTTP=80, HTTPS=443, FTP=21, SSH=22, DNS=53" },
                  "oops": { points: ["4 pillars: Encapsulation, Abstraction, Inheritance, Polymorphism","Overloading: same name, different params (compile-time)","Overriding: same signature, different class (runtime)","Interface vs Abstract: interface = pure contract"], example: "Animal→speak() overridden by Dog→speak() 'Woof'" },
                  "java": { points: ["JVM: bytecode → machine code (platform independent)","Collections: List, Set, Map, Queue","Exception hierarchy: Throwable→Error/Exception","String is immutable; StringBuilder is mutable"], formula: "HashMap get/put: O(1) average", example: "ArrayList vs LinkedList: AL faster random access, LL faster insert/delete" },
                  "sql": { points: ["DDL: CREATE, ALTER, DROP; DML: INSERT, UPDATE, DELETE, SELECT","GROUP BY + HAVING for aggregates","Subquery vs JOIN: JOIN faster on indexed columns","RANK(), ROW_NUMBER(), DENSE_RANK() for window functions"], formula: "SELECT dept, COUNT(*) FROM emp GROUP BY dept HAVING COUNT(*)>5", example: "INNER JOIN: only matching rows; LEFT JOIN: all left rows + matched right" },
                }
                const note = notes[t.id] || { points: ["Study this topic systematically", "Practice with timed questions", "Review formulas and examples"] }
                return (
                  <div key={t.id} className="rounded-xl border border-border bg-card/40 p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg text-base"
                        style={{ background: `${t.color || pathMeta.color}15` }}>
                        {t.icon}
                      </div>
                      <p className="font-semibold text-foreground">{t.name}</p>
                    </div>
                    {note.formula && (
                      <div className="rounded-lg bg-primary/5 border border-primary/20 px-3 py-2">
                        <p className="text-xs font-mono text-primary">{note.formula}</p>
                      </div>
                    )}
                    <ul className="space-y-1">
                      {note.points.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="text-primary mt-0.5 shrink-0">•</span>{p}
                        </li>
                      ))}
                    </ul>
                    {note.example && (
                      <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 px-3 py-2">
                        <p className="text-[10px] font-semibold text-amber-400 mb-0.5">Example</p>
                        <p className="text-xs text-muted-foreground">{note.example}</p>
                      </div>
                    )}
                    <button onClick={() => setActiveTopic({ id: t.id, name: t.name })}
                      className="w-full h-8 rounded-lg text-xs font-semibold text-white mt-1"
                      style={{ background: `linear-gradient(135deg,${t.color || pathMeta.color},${t.color || pathMeta.color}cc)` }}>
                      Practice {t.name} →
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Overview */}
        {subView === "home" && (
          <div className="space-y-5">
            <div className="rounded-2xl border p-6" style={{ borderColor: `${pathMeta.color}30`, background: `${pathMeta.color}08` }}>
              <h3 className="font-bold text-foreground mb-2">Learning Path</h3>
              <div className="flex items-center gap-3 flex-wrap">
                {["Learn", "Practice Topics", "Topic Test", "Full Mock"].map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{s}</span>
                    {i < 3 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button onClick={() => setSubView("learn")}
                className="rounded-xl border border-border bg-card/40 hover:border-primary/30 p-5 text-left transition-all group">
                <BookOpen className="h-5 w-5 mb-3" style={{ color: pathMeta.color }} />
                <p className="font-semibold text-foreground">Learn — Notes & Concepts</p>
                <p className="text-xs text-muted-foreground mt-1">Key formulas, rules and examples for every topic</p>
              </button>
              <button onClick={() => setSubView("mock")}
                className="rounded-xl border border-border bg-card/40 hover:border-primary/30 p-5 text-left transition-all group">
                <Trophy className="h-5 w-5 mb-3" style={{ color: pathMeta.color }} />
                <p className="font-semibold text-foreground">Full Mock Test</p>
                <p className="text-xs text-muted-foreground mt-1">Timed full-length mock covering all topics</p>
              </button>
            </div>
          </div>
        )}

        {/* Topics */}
        {subView === "topics" && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pathMeta.topics.map((t: any) => (
              <button key={t.id} onClick={() => setActiveTopic({ id: t.id, name: t.name })}
                className="group rounded-xl border border-border bg-card/40 hover:border-primary/30 hover:bg-card p-5 text-left transition-all hover:scale-[1.02]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl mb-3 text-lg"
                  style={{ background: `${t.color || pathMeta.color}15`, border: `1px solid ${t.color || pathMeta.color}30` }}>
                  {t.icon}
                </div>
                <p className="font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground mt-1 group-hover:text-primary transition-colors flex items-center gap-1">
                  Practice <ChevronRight className="h-3 w-3" />
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Full mock */}
        {subView === "mock" && (
          <div className="max-w-md mx-auto text-center space-y-5 py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl mx-auto"
              style={{ background: `${pathMeta.color}15` }}>
              <Trophy className="h-8 w-8" style={{ color: pathMeta.color }} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Full {pathMeta.label} Mock</h3>
              <p className="text-sm text-muted-foreground mt-2">30 questions across all topics · 30 minutes · AI-generated</p>
            </div>
            <button onClick={() => {
              const firstTopic = pathMeta.topics[0]
              if (firstTopic) setActiveTopic({ id: "mock-" + activePath, name: `${pathMeta.label} Full Mock` })
            }}
              className="w-full h-12 rounded-xl font-bold text-white flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg,${pathMeta.color},${pathMeta.color}cc)` }}>
              <Play className="h-5 w-5" /> Start Mock Test
            </button>
          </div>
        )}
      </div>
    )
  }

  // ── HOME ──
  return (
    <div className="flex-1 p-4 md:p-6 max-w-screen-2xl mx-auto w-full space-y-6">

      {/* History overlay */}
      {showHistory && (
        <div className="fixed inset-0 z-[60] overflow-y-auto" style={{ background: "var(--background)" }}>
          <div className="pt-14 max-w-4xl mx-auto px-4 py-6 space-y-5">
            <div className="flex items-center gap-3 sticky top-14 z-10 py-3 border-b border-border" style={{ background: "var(--background)" }}>
              <button onClick={() => setShowHistory(false)} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Back to Prep
              </button>
              <div className="w-px h-4 bg-border" />
              <h2 className="text-lg font-bold text-foreground">Assessment History</h2>
            </div>
            <AssessmentHistoryPage />
          </div>
        </div>
      )}

      {/* Learning Paths overlay */}
      {showLearningPaths && (
        <div className="fixed inset-0 z-[60] overflow-y-auto" style={{ background: "var(--background)" }}>
          <div className="pt-14 max-w-5xl mx-auto px-4 py-6 space-y-5">
            <div className="flex items-center gap-3 sticky top-14 z-10 py-3 border-b border-border" style={{ background: "var(--background)" }}>
              <button onClick={() => setShowLearningPaths(false)} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Back to Prep
              </button>
              <div className="w-px h-4 bg-border" />
              <h2 className="text-lg font-bold text-foreground">Learning Paths</h2>
            </div>
            <LearningPathsPlaceholder />
          </div>
        </div>
      )}

      {/* Smart Resume overlay */}
      {showSmartResume && (
        <div className="fixed inset-0 z-[60] overflow-y-auto" style={{ background: "var(--background)" }}>
          <div className="pt-14 max-w-4xl mx-auto px-4 py-6 space-y-5">
            <div className="flex items-center gap-3 sticky top-14 z-10 py-3 border-b border-border" style={{ background: "var(--background)" }}>
              <button onClick={() => setShowSmartResume(false)} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Back to Prep
              </button>
              <div className="w-px h-4 bg-border" />
              <h2 className="text-lg font-bold text-foreground">Smart Resume</h2>
            </div>
            <SmartResume />
          </div>
        </div>
      )}

      {/* 3D Hero Header */}
      <div className="relative overflow-hidden rounded-3xl p-8"
        style={{
          background: "linear-gradient(135deg,rgba(124,58,237,0.85) 0%,rgba(99,102,241,0.85) 50%,rgba(79,70,229,0.85) 100%)",
          boxShadow: "0 20px 40px rgba(124,58,237,0.25),inset 0 1px 0 rgba(255,255,255,0.15)",
        }}>
        <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background:"radial-gradient(#7c3aed,transparent)" }} />
        <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background:"radial-gradient(#6366f1,transparent)" }} />
        <div className="relative z-10 flex items-center gap-4 flex-wrap">
          <div className="relative shrink-0">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background:"linear-gradient(135deg,#7c3aed,#6366f1)", boxShadow:"0 8px 24px rgba(124,58,237,0.4),inset 0 1px 0 rgba(255,255,255,0.2)" }}>
              <Flag className="h-7 w-7 text-white" />
            </div>
            <div className="absolute top-1.5 left-1.5 h-2 w-2 rounded-full bg-white/30 blur-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-black text-white tracking-tight">Prep Track</h2>
            <p className="text-sm mt-1" style={{ color:"rgba(255,255,255,0.75)" }}>AI-powered assessments · company patterns · real results</p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap shrink-0 ml-auto">
            {/* Practice dropdown — click to open, fixed position to avoid clipping */}
            <div className="relative">
              <button
                onClick={e => {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                  setShowPracticeMenu(v => !v)
                  ;(window as any).__practiceMenuY = rect.bottom + 8
                  ;(window as any).__practiceMenuR = window.innerWidth - rect.right
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
                style={{ background:"rgba(129,140,248,0.22)", color:"#a5b4fc", border:"1.5px solid rgba(129,140,248,0.55)" }}>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
                Practice
                <svg viewBox="0 0 24 24" className={`h-3 w-3 transition-transform ${showPracticeMenu ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              {showPracticeMenu && (
                <>
                  <div className="fixed inset-0 z-[60]" onClick={() => setShowPracticeMenu(false)} />
                  <div className="fixed z-[61] w-60 rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
                    style={{
                      top: (window as any).__practiceMenuY ?? 80,
                      right: (window as any).__practiceMenuR ?? 20,
                    }}>
                    {[
                      { label:"Aptitude",      sub:"Quant · Logical · Data Interp.", color:"#f59e0b", href:"/student/prep?track=aptitude" },
                      { label:"Coding / DSA",  sub:"Arrays · Trees · DP · Graphs",   color:"#6366f1", href:"/student/prep?track=coding" },
                      { label:"Communication", sub:"Grammar · Vocab · Reading",       color:"#10b981", href:"/student/prep?track=communication" },
                    ].map(opt => (
                      <a key={opt.label} href={opt.href}
                        onClick={() => setShowPracticeMenu(false)}
                        className="flex items-center gap-3 px-4 py-3.5 hover:bg-primary/5 transition-colors border-b border-border/50 last:border-0 cursor-pointer">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-black"
                          style={{ background:`${opt.color}20`, color:opt.color }}>
                          {opt.label[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{opt.label}</p>
                          <p className="text-[10px] text-muted-foreground">{opt.sub}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button onClick={() => setShowLearningPaths(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
              style={{ background:"rgba(96,165,250,0.22)", color:"#93c5fd", border:"1.5px solid rgba(96,165,250,0.55)" }}>
              <BookOpen className="h-5 w-5" /> Learning Paths
            </button>
            <button onClick={() => setShowSmartResume(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
              style={{ background:"rgba(236,72,153,0.22)", color:"#f9a8d4", border:"1.5px solid rgba(236,72,153,0.55)" }}>
              <Sparkles className="h-5 w-5" /> Smart Resume
            </button>
            <button onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
              style={{ background:"rgba(245,158,11,0.22)", color:"#fcd34d", border:"1.5px solid rgba(245,158,11,0.55)" }}>
              <Trophy className="h-5 w-5" /> History
            </button>
          </div>
        </div>
        <div className="relative z-10 mt-6 pt-5 border-t border-white/20 grid grid-cols-3 gap-4">
          {[
            { label:"Companies",   value:"189+",            icon:<Building2 className="h-4 w-4" />, color:"#c4b5fd" },
            { label:"AI Questions",value:"Real Patterns",    icon:<Cpu className="h-4 w-4" />,       color:"#6ee7b7" },
            { label:"Topics",      value:"Apt · DSA · Comm", icon:<Target className="h-4 w-4" />,   color:"#fcd34d" },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)", color:s.color }}>{s.icon}</div>
              <div>
                <p className="text-sm font-black text-white">{s.value}</p>
                <p className="text-[11px] font-medium" style={{ color:"rgba(255,255,255,0.75)" }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Company Prep Tracks — Choose From The Top Roles */}
      {yearLoaded && !isFirstYear && (
        <div className="space-y-4">
          {/* constants computed inline from component-level state */}
          {(() => {
            const CATEGORIES = ["All", "IT Services", "Product", "Consulting", "BFSI", "Core Engg", "Telecom", "Analytics", "Pharma", "FMCG", "EV/Auto", "Defence"]
            const CATEGORY_MAP: Record<string, string[]> = {
              "IT Services":  ["tcs","infosys","wipro","cognizant","capgemini","hcl","tech-mahindra","accenture","ibm","ltimindtree"],
              "Product":      ["google","microsoft","amazon","meta","apple","adobe","oracle","sap","salesforce"],
              "Consulting":   ["deloitte","pwc","ey","kpmg","mckinsey","bcg","bain"],
              "BFSI":         ["jpmorgan","goldman","morgan-stanley","barclays","hsbc","citi","axis","hdfc","icici"],
              "Core Engg":    ["l&t","siemens","bosch","honeywell","ge","tata-motors","mahindra"],
              "Telecom":      ["airtel","jio","nokia","ericsson","qualcomm"],
              "Analytics":    ["mu-sigma","fractal","tiger-analytics","latentview"],
              "Pharma":       ["dr-reddys","cipla","sun-pharma","astrazeneca"],
              "FMCG":         ["hul","pepsico","nestle","itc"],
              "EV/Auto":      ["tesla","ola-electric","ather","tvs"],
              "Defence":      ["drdo","isro","hal","bhel"],
            }
            const allCompanies = ALL_COMPANIES
            const visibleIds = roleCategory === "All" ? allCompanies.map(c => c.id) : (CATEGORY_MAP[roleCategory] ?? [])
            const filtered = allCompanies.filter(c => {
              if (!visibleIds.includes(c.id)) return false
              if (roleCompany && c.id !== roleCompany) return false
              if (roleSearch && !c.name.toLowerCase().includes(roleSearch.toLowerCase())) return false
              return true
            })
            return (
              <>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-bold text-foreground">Choose From The Top Roles</p>
                    <p className="text-xs text-muted-foreground">AI generates real previous-year pattern questions for each company</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20 shrink-0">{allCompanies.length} companies</span>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <select value={roleCategory} onChange={e => setRoleCategory(e.target.value)}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-primary/50">
                    <option value="All">Category: All</option>
                    {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="relative">
                    <input
                      value={roleSearch}
                      onChange={e => { setRoleSearch(e.target.value); setRoleCompany("") }}
                      placeholder="Search company..."
                      className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 w-44 transition-all"
                    />
                    <svg viewBox="0 0 24 24" className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    {roleSearch && (
                      <button onClick={() => setRoleSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs">✕</button>
                    )}
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setRoleCategory(cat)}
                      className={`text-[11px] px-3 py-1 rounded-full font-semibold border transition-all ${
                        roleCategory === cat ? "bg-primary/20 text-primary border-primary/40" : "bg-transparent text-muted-foreground border-border hover:border-primary/30"
                      }`}>
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {filtered.map(c => (
                    <div key={c.id}
                      className="rounded-2xl border border-border bg-card/40 flex flex-col items-center gap-3 p-5 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => { setActivePath("company"); setActiveCompany(c) }}>
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl font-black text-xl text-white" style={{ background: c.color }}>
                        {c.abbr}
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-sm text-foreground">{c.desc || c.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{c.name}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap justify-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${c.difficulty === "Easy" ? "bg-emerald-500/15 text-emerald-400" : c.difficulty === "Hard" || c.difficulty === "Very Hard" ? "bg-red-500/15 text-red-400" : "bg-blue-500/15 text-blue-400"}`}>{c.difficulty}</span>
                        <span className="text-[10px] text-muted-foreground">{c.duration} min</span>
                        <span className="text-[10px] text-muted-foreground">{c.questions} Qs</span>
                      </div>
                      <button className="w-full mt-auto py-2 rounded-xl text-xs font-bold border border-border text-foreground hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all">
                        Start Test
                      </button>
                    </div>
                  ))}
                  {filtered.length === 0 && <div className="col-span-4 text-center py-12 text-muted-foreground text-sm">No companies found.</div>}
                </div>
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
}

