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
    subtitle: "Grammar · Vocab · Reading",
    desc: "Improve verbal ability, grammar, reading comprehension, and technical communication skills required in placement drives.",
    icon: "C",
    iconBg: "#10b981",
    color: "#10b981",
    href: "/student/practice/communication",
    topics: ["Grammar & Sentence Correction", "Vocabulary & Word Meaning", "Reading Comprehension", "Para Jumbles", "Email Writing", "Verbal Reasoning"],
    count: "150+ exercises",
  },
]

function PracticeContent() {
  const router = useRouter()

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#0d1117 0%,#161b22 100%)" }}>
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-2"
            style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", color: "#a5b4fc" }}>
            <Target className="h-3.5 w-3.5" /> Practice Hub
          </div>
          <h1 className="text-3xl font-black text-white">What do you want to practice?</h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Choose a practice track. Each section is tailored to help you crack placement assessments at top companies.
          </p>
        </div>

        {/* 3 big cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {PRACTICE_MODES.map(mode => (
            <button key={mode.id}
              onClick={() => router.push(mode.href)}
              className="group relative text-left rounded-3xl p-6 transition-all hover:scale-[1.02] hover:shadow-2xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid rgba(255,255,255,0.08)`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${mode.color}40` }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.08)" }}>

              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl mb-4 text-2xl font-black text-white"
                style={{ background: mode.iconBg }}>
                {mode.icon}
              </div>

              {/* Title */}
              <h2 className="text-xl font-black text-white mb-1">{mode.label}</h2>
              <p className="text-sm font-medium mb-3" style={{ color: mode.color }}>{mode.subtitle}</p>

              {/* Desc */}
              <p className="text-xs text-gray-400 leading-relaxed mb-4">{mode.desc}</p>

              {/* Topics */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {mode.topics.slice(0, 4).map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${mode.color}12`, color: mode.color }}>
                    {t}
                  </span>
                ))}
                {mode.topics.length > 4 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full text-gray-500"
                    style={{ background: "rgba(255,255,255,0.05)" }}>
                    +{mode.topics.length - 4} more
                  </span>
                )}
              </div>

              {/* CTA */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 flex items-center gap-1">
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
            { icon: <Brain className="h-4 w-4 text-yellow-400" />, label: "Aptitude", value: "200+", sub: "questions" },
            { icon: <Code2 className="h-4 w-4 text-indigo-400" />, label: "Coding", value: "750+", sub: "problems" },
            { icon: <MessageCircle className="h-4 w-4 text-emerald-400" />, label: "Communication", value: "150+", sub: "exercises" },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-4 text-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex justify-center mb-2">{s.icon}</div>
              <p className="text-xl font-black text-white">{s.value}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>}>
      <PracticeContent />
    </Suspense>
  )
}
