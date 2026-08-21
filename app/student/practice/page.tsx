"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { BookOpen, Code2, MessageCircle, ChevronRight, Zap, Target, Brain } from "lucide-react"

const PRACTICE_MODES = [
  {
    id: "aptitude",
    label: "Aptitude",
    subtitle: "Quant · Logical · Data Interp.",
    desc: "Master quantitative aptitude, logical reasoning, and data interpretation for campus placements. Covers all major IT company patterns.",
    icon: "A",
    iconBg: "#f59e0b",
    color: "#f59e0b",
    href: "/student/practice/aptitude",
    topics: ["Percentages", "Profit & Loss", "Time & Work", "Speed & Distance", "Number Series", "Syllogisms", "Blood Relations", "Data Interpretation"],
    count: "200+ questions",
  },
  {
    id: "coding",
    label: "Coding / DSA",
    subtitle: "Arrays · Trees · DP · Graphs",
    desc: "Practice Data Structures & Algorithms with 750+ problems organized by topic and difficulty. From Easy arrays to Hard graph problems.",
    icon: "C",
    iconBg: "#6366f1",
    color: "#6366f1",
    href: "/student/problems",
    topics: ["Arrays", "Strings", "Trees", "Graphs", "Dynamic Programming", "Heaps", "Backtracking", "Sorting"],
    count: "750+ problems",
  },
  {
    id: "communication",
    label: "Communication",
    subtitle: "Written · Spoken · AI Voice Coach",
    desc: "Master written English and spoken communication — grammar, vocabulary, reading comprehension, sentence skills, and AI voice practice for HR & GD rounds.",
    icon: "🎤",
    iconBg: "#10b981",
    color: "#10b981",
    href: "/student/practice/communication",
    topics: ["Direct & Indirect Speech", "Active & Passive Voice", "Sentence Improvement", "Idioms & Phrases", "Cloze Test", "Para Jumbles", "Reading Comprehension", "Grammar", "Vocabulary", "🎤 AI Voice Coach"],
    count: "900 questions · Voice Coach",
  },
]

function PracticeContent() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">

        {/* Back button */}
        <div>
          <button onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-2
            bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 dark:text-indigo-300">
            <Target className="h-3.5 w-3.5" /> Practice Hub
          </div>
          <h1 className="text-3xl font-black text-foreground">What do you want to practice?</h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Choose a practice track. Each section is tailored to help you crack placement assessments at top companies.
          </p>
        </div>

        {/* 3 big cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {PRACTICE_MODES.map(mode => (
            <button key={mode.id}
              onClick={() => router.push(mode.href)}
              className="group relative text-left rounded-3xl p-6 transition-all hover:scale-[1.02] hover:shadow-xl
                bg-card border border-border hover:shadow-black/10 dark:hover:shadow-black/40"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${mode.color}50` }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "" }}>

              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl mb-4 text-2xl font-black text-white"
                style={{ background: mode.iconBg }}>
                {mode.icon}
              </div>

              {/* Title */}
              <h2 className="text-xl font-black text-foreground mb-1">{mode.label}</h2>
              <p className="text-sm font-medium mb-3" style={{ color: mode.color }}>{mode.subtitle}</p>

              {/* Desc */}
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{mode.desc}</p>

              {/* Topics */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {mode.topics.slice(0, 4).map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${mode.color}18`, color: mode.color }}>
                    {t}
                  </span>
                ))}
                {mode.topics.length > 4 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full text-muted-foreground bg-muted">
                    +{mode.topics.length - 4} more
                  </span>
                )}
              </div>

              {/* CTA */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Zap className="h-3 w-3 text-yellow-500" /> {mode.count}
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold transition-all group-hover:gap-2"
                  style={{ color: mode.color }}>
                  Start <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          {[
            { icon: <Brain className="h-4 w-4 text-yellow-500" />, label: "Aptitude", value: "200+", sub: "questions" },
            { icon: <Code2 className="h-4 w-4 text-indigo-400" />, label: "Coding", value: "750+", sub: "problems" },
            { icon: <MessageCircle className="h-4 w-4 text-emerald-500" />, label: "Communication", value: "900", sub: "questions + voice" },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-4 text-center bg-card border border-border">
              <div className="flex justify-center mb-2">{s.icon}</div>
              <p className="text-xl font-black text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-muted-foreground">Loading...</div>}>
      <PracticeContent />
    </Suspense>
  )
}
