"use client"

import { useState, useEffect } from "react"
import {
  BookOpen, Code2, Trophy, Star, Zap, CheckCircle2,
  Circle, Flame, Target, TrendingUp, ChevronRight,
  Award, Users, ArrowRight, Sparkles, RefreshCw,
} from "lucide-react"

interface Milestone {
  id: string; title: string; desc: string; xp: number
}

interface Progress {
  completed: string[]
  streak: number
  totalXP: number
  onboardingDone: boolean
  onboardingSkillLevel: string | null
  monthlyChallengesSolved: number
}

const SKILL_LEVELS = [
  { id: "beginner",    label: "Complete Beginner",  desc: "I've never written code before",      icon: "🌱" },
  { id: "some-coding", label: "Tried Some Coding",  desc: "I've done a tutorial or two",         icon: "📖" },
  { id: "knows-basics",label: "Know the Basics",    desc: "I can write simple programs",         icon: "💻" },
]

const ROADMAP_STEPS = [
  { id: "py-basics",    title: "Learn Programming Basics",  icon: "🐍", color: "#3b82f6", milestone: "py-basics" },
  { id: "git-basics",   title: "Master Git & GitHub",       icon: "🔧", color: "#10b981", milestone: "git-basics" },
  { id: "web-basics",   title: "Web Dev Intro",             icon: "🌐", color: "#f59e0b", milestone: "web-basics" },
  { id: "arrays",       title: "DSA: Arrays & Strings",     icon: "📊", color: "#8b5cf6", milestone: "arrays" },
  { id: "lc-10",        title: "Solve 10 Easy Problems",    icon: "🧩", color: "#ef4444", milestone: "lc-10" },
  { id: "dsa-track",    title: "Start a DSA Course",        icon: "📚", color: "#6366f1", milestone: "dsa-track" },
  { id: "lc-25",        title: "Reach 25 Problems",         icon: "🏆", color: "#f59e0b", milestone: "lc-25" },
  { id: "project-1",    title: "Build Your First Project",  icon: "🚀", color: "#10b981", milestone: "project-1" },
]

export function FirstYearHub() {
  const [progress, setProgress] = useState<Progress | null>(null)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState<string | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [dailyDone, setDailyDone] = useState(false)
  const [xpPop, setXpPop] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/student/first-year-progress")
      .then(r => r.json())
      .then(d => {
        setProgress(d.progress)
        setMilestones(d.milestones ?? [])
        if (!d.progress?.onboardingDone) setShowOnboarding(true)
      })
      .finally(() => setLoading(false))
  }, [])

  const completeMilestone = async (id: string) => {
    if (!progress || progress.completed.includes(id)) return
    setCompleting(id)
    try {
      const res = await fetch("/api/student/first-year-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete-milestone", milestoneId: id }),
      })
      const data = await res.json()
      if (data.success) {
        setProgress(p => p ? { ...p, completed: [...p.completed, id], totalXP: data.newTotal, streak: data.newStreak } : p)
        setXpPop(`+${data.xpGained} XP`)
        setTimeout(() => setXpPop(null), 2500)
      }
    } finally { setCompleting(null) }
  }

  const selectSkillLevel = async (level: string) => {
    await fetch("/api/student/first-year-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "onboarding", skillLevel: level }),
    })
    setProgress(p => p ? { ...p, onboardingDone: true, onboardingSkillLevel: level } : p)
    setShowOnboarding(false)
  }

  const doDailyChallenge = async () => {
    const res = await fetch("/api/student/first-year-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "daily-challenge" }),
    })
    const data = await res.json()
    if (data.alreadyDone) { setDailyDone(true); return }
    if (data.success) {
      setProgress(p => p ? { ...p, streak: data.newStreak, totalXP: data.totalXP, monthlyChallengesSolved: (p.monthlyChallengesSolved ?? 0) + 1 } : p)
      setDailyDone(true)
      setXpPop("+10 XP")
      setTimeout(() => setXpPop(null), 2500)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground text-sm">
      <RefreshCw className="h-4 w-4 animate-spin" />Loading your progress...
    </div>
  )

  const completedCount = progress?.completed.length ?? 0
  const totalXP = progress?.totalXP ?? 0
  const streak = progress?.streak ?? 0
  const level = totalXP < 100 ? { name: "Seedling", icon: "🌱", next: 100 }
    : totalXP < 300 ? { name: "Explorer", icon: "🔍", next: 300 }
    : totalXP < 600 ? { name: "Builder", icon: "🔨", next: 600 }
    : totalXP < 1000 ? { name: "Coder", icon: "💻", next: 1000 }
    : { name: "Developer", icon: "🚀", next: 9999 }
  const levelPct = Math.min(Math.round((totalXP / level.next) * 100), 100)

  return (
    <div className="space-y-5">

      {/* Onboarding Quiz */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-primary/30 bg-card shadow-2xl p-7 space-y-5">
            <div className="text-center">
              <div className="text-4xl mb-3">👋</div>
              <h2 className="text-xl font-bold text-foreground">Welcome to your 1st Year Hub!</h2>
              <p className="text-sm text-muted-foreground mt-1.5">Quick question — what's your coding experience right now?</p>
            </div>
            <div className="space-y-2">
              {SKILL_LEVELS.map(s => (
                <button key={s.id} onClick={() => selectSkillLevel(s.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card/40 hover:border-primary/40 hover:bg-primary/5 transition-all text-left group">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* XP pop */}
      {xpPop && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-500/30 bg-amber-500/20 text-amber-400 font-bold text-sm shadow-xl animate-bounce">
          <Zap className="h-4 w-4" />{xpPop}
        </div>
      )}

      {/* Level + XP + Streak strip */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Level badge */}
          <div className="flex items-center gap-3">
            <div className="text-3xl">{level.icon}</div>
            <div>
              <p className="font-bold text-foreground">{level.name}</p>
              <p className="text-xs text-muted-foreground">{totalXP} / {level.next} XP</p>
            </div>
          </div>
          {/* XP bar */}
          <div className="flex-1 min-w-32">
            <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${levelPct}%`, background: "linear-gradient(90deg,#7c3aed,#f59e0b)" }} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">{levelPct}% to {level.next === 9999 ? "Max" : level.name === "Seedling" ? "Explorer" : level.name === "Explorer" ? "Builder" : level.name === "Builder" ? "Coder" : "Developer"}</p>
          </div>
          {/* Streak */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10">
            <Flame className="h-5 w-5 text-amber-400" />
            <div>
              <p className="text-xl font-black text-amber-400 leading-none">{streak}</p>
              <p className="text-[10px] text-muted-foreground">day streak</p>
            </div>
          </div>
          {/* Completed */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10">
            <Trophy className="h-5 w-5 text-emerald-400" />
            <div>
              <p className="text-xl font-black text-emerald-400 leading-none">{completedCount}</p>
              <p className="text-[10px] text-muted-foreground">milestones</p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Challenge */}
      <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">
              <Target className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <p className="font-bold text-foreground">Daily Challenge</p>
              <p className="text-xs text-muted-foreground">One easy problem · earn +10 XP · keep your streak alive</p>
            </div>
          </div>
          {dailyDone ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-semibold">
              <CheckCircle2 className="h-4 w-4" /> Done today!
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a href="https://leetcode.com/problemset/?difficulty=EASY" target="_blank" rel="noopener noreferrer"
                onClick={doDailyChallenge}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm text-white transition-all"
                style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
                <Zap className="h-4 w-4" /> Start Challenge
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Roadmap */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Your Learning Roadmap
          </p>
          <p className="text-xs text-muted-foreground">{completedCount} of {ROADMAP_STEPS.length} completed</p>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full bg-white/10 mb-5 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.round((completedCount / ROADMAP_STEPS.length) * 100)}%`, background: "linear-gradient(90deg,#7c3aed,#10b981)" }} />
        </div>

        <div className="space-y-2">
          {ROADMAP_STEPS.map((step, i) => {
            const done = progress?.completed.includes(step.milestone) ?? false
            const isNext = !done && (i === 0 || progress?.completed.includes(ROADMAP_STEPS[i-1]?.milestone))
            return (
              <div key={step.id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${done ? "border-emerald-500/20 bg-emerald-500/5" : isNext ? "border-primary/30 bg-primary/5" : "border-border bg-card/30 opacity-70"}`}>
                {/* Step icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
                  style={{ background: done ? "#10b98120" : `${step.color}15`, border: `1px solid ${done ? "#10b98130" : step.color + "30"}` }}>
                  {done ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : step.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${done ? "text-muted-foreground" : "text-foreground"}`}>{step.title}</p>
                  {isNext && !done && <p className="text-xs text-primary font-medium mt-0.5">← Your next step</p>}
                </div>
                {!done && (
                  <button onClick={() => completeMilestone(step.milestone)}
                    disabled={completing === step.milestone}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all shrink-0"
                    style={isNext
                      ? { background: `${step.color}20`, color: step.color, borderColor: `${step.color}30` }
                      : { background: "transparent", color: "var(--muted-foreground)", borderColor: "var(--border)" }}>
                    {completing === step.milestone ? <RefreshCw className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                    {completing === step.milestone ? "..." : "Mark Done"}
                  </button>
                )}
                {done && (
                  <div className="text-xs font-bold text-emerald-400 shrink-0 flex items-center gap-1">
                    <Star className="h-3 w-3" />+{milestones.find(m => m.id === step.milestone)?.xp ?? 0} XP
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Monthly summary */}
      {(progress?.monthlyChallengesSolved ?? 0) > 0 && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex items-center gap-4">
          <Sparkles className="h-8 w-8 text-blue-400 shrink-0" />
          <div>
            <p className="font-semibold text-foreground text-sm">This Month's Progress</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              You solved <strong className="text-blue-400">{progress?.monthlyChallengesSolved}</strong> daily challenges and earned <strong className="text-amber-400">{totalXP} XP</strong> total. Keep going!
            </p>
          </div>
        </div>
      )}

      {/* Unlock next year nudge */}
      <div className="rounded-xl border border-border bg-card/30 p-4 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm">🔓</div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Looking Ahead</p>
          <p className="text-xs text-muted-foreground mt-0.5">In 2nd year you'll unlock company assessments, internship tracking, hiring drives, and trending skill labs.</p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
    </div>
  )
}
