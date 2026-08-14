"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search, Code2, Filter, ChevronRight, CheckCircle2,
  Zap, BookOpen, SlidersHorizontal, X, Trophy,
} from "lucide-react"
import { TOPIC_QUESTIONS } from "@/lib/topic-questions"

// ── Helpers ───────────────────────────────────────────────────────────────────

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim()
}

const DIFF_COLOR: Record<string, string> = { Easy: "#10b981", Medium: "#f59e0b", Hard: "#ef4444" }
const DIFF_BG:    Record<string, string> = { Easy: "rgba(16,185,129,0.12)", Medium: "rgba(245,158,11,0.12)", Hard: "rgba(239,68,68,0.12)" }

// ── Flat problem list with topic info ────────────────────────────────────────

const ALL_PROBLEMS_RAW = TOPIC_QUESTIONS.flatMap(topic =>
  topic.questions.map(q => ({
    ...q,
    topic: topic.label,
    track: topic.track,
    color: topic.color,
    slug: toSlug(q.title),
  }))
)

// Deduplicate by title — same problem may appear in multiple topics, keep first occurrence
const seen = new Set<string>()
const ALL_PROBLEMS = ALL_PROBLEMS_RAW.filter(p => {
  const key = p.title.toLowerCase()
  if (seen.has(key)) return false
  seen.add(key)
  return true
})

const TOPICS = TOPIC_QUESTIONS.map(t => ({ track: t.track, label: t.label, color: t.color, count: t.questions.length }))
const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProblemsPage() {
  const router = useRouter()

  const [search, setSearch]     = useState("")
  const [topic, setTopic]       = useState<string | null>(null)
  const [diff, setDiff]         = useState<string | null>(null)
  const [solved, setSolved]     = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)

  // Load solved from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("completedChallenges")
      if (stored) setSolved(new Set(JSON.parse(stored)))
    } catch {}
    // Re-check whenever we come back to this page (e.g. after solving a problem)
    const onFocus = () => {
      try {
        const stored = localStorage.getItem("completedChallenges")
        if (stored) setSolved(new Set(JSON.parse(stored)))
      } catch {}
    }
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, [])

  const filtered = useMemo(() => {
    return ALL_PROBLEMS.filter(p => {
      if (topic && p.track !== topic) return false
      if (diff && p.difficulty !== diff) return false
      if (search) {
        const q = search.toLowerCase()
        if (!p.title.toLowerCase().includes(q) && !p.topic.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [search, topic, diff])

  const stats = useMemo(() => ({
    total: ALL_PROBLEMS.length,
    easy:   ALL_PROBLEMS.filter(p => p.difficulty === "Easy").length,
    medium: ALL_PROBLEMS.filter(p => p.difficulty === "Medium").length,
    hard:   ALL_PROBLEMS.filter(p => p.difficulty === "Hard").length,
    solvedCount: ALL_PROBLEMS.filter(p => solved.has(p.id)).length,
  }), [solved])

  const handleProblem = (slug: string) => router.push(`/student/problems/${slug}`)

  const clearFilters = () => { setTopic(null); setDiff(null); setSearch("") }
  const hasFilters = topic || diff || search

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#0d1117 0%,#161b22 100%)" }}>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-xl" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}>
                <Code2 className="h-5 w-5 text-indigo-400" />
              </div>
              <h1 className="text-2xl font-black text-white">Coding Practice</h1>
            </div>
            <p className="text-sm text-gray-400 ml-14">
              {stats.total} problems across {TOPICS.length} topics · {stats.solvedCount} solved
            </p>
          </div>

          {/* Progress ring */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Trophy className="h-4 w-4 text-yellow-400" />
            <div>
              <p className="text-xs text-gray-400">Progress</p>
              <p className="text-sm font-bold text-white">{stats.solvedCount} / {stats.total}</p>
            </div>
            <div className="w-1 h-8 rounded-full bg-gray-700">
              <div className="w-full rounded-full" style={{ height: `${(stats.solvedCount / stats.total) * 100}%`, background: "linear-gradient(180deg,#10b981,#6366f1)", transition: "height 0.5s" }} />
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total", value: stats.total, color: "#6366f1" },
            { label: "Easy",   value: stats.easy,   color: "#10b981" },
            { label: "Medium", value: stats.medium,  color: "#f59e0b" },
            { label: "Hard",   value: stats.hard,    color: "#ef4444" },
          ].map(s => (
            <button key={s.label}
              onClick={() => setDiff(diff === s.label ? null : (s.label === "Total" ? null : s.label))}
              className="rounded-2xl p-4 text-center transition-all hover:scale-[1.02]"
              style={{
                background: (diff === s.label || (s.label === "Total" && !diff)) ? `${s.color}15` : "rgba(255,255,255,0.03)",
                border: `1px solid ${(diff === s.label || (s.label === "Total" && !diff)) ? s.color + "40" : "rgba(255,255,255,0.08)"}`,
              }}>
              <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Search + filter bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search problems..."
              className="w-full rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50 transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(v => !v)}
            className="flex items-center gap-2 px-4 rounded-xl text-sm font-medium transition-all"
            style={{
              background: showFilters ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${showFilters ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.1)"}`,
              color: showFilters ? "#a5b4fc" : "#9ca3af",
            }}>
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasFilters && <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />}
          </button>
          {hasFilters && (
            <button onClick={clearFilters}
              className="flex items-center gap-1.5 px-4 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <X className="h-3 w-3" /> Clear
            </button>
          )}
        </div>

        {/* Topic filter chips */}
        {showFilters && (
          <div className="space-y-3 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Difficulty</p>
              <div className="flex gap-2 flex-wrap">
                {DIFFICULTIES.map(d => (
                  <button key={d} onClick={() => setDiff(diff === d ? null : d)}
                    className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                    style={{
                      background: diff === d ? DIFF_BG[d] : "rgba(255,255,255,0.05)",
                      border: `1px solid ${diff === d ? DIFF_COLOR[d] + "60" : "rgba(255,255,255,0.1)"}`,
                      color: diff === d ? DIFF_COLOR[d] : "#9ca3af",
                    }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Topic</p>
              <div className="flex gap-2 flex-wrap">
                {TOPICS.map(t => (
                  <button key={t.track} onClick={() => setTopic(topic === t.track ? null : t.track)}
                    className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                    style={{
                      background: topic === t.track ? `${t.color}15` : "rgba(255,255,255,0.05)",
                      border: `1px solid ${topic === t.track ? t.color + "50" : "rgba(255,255,255,0.1)"}`,
                      color: topic === t.track ? t.color : "#9ca3af",
                    }}>
                    {t.label} ({t.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Topic sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-3">Topics</p>
            <button
              onClick={() => setTopic(null)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all"
              style={{
                background: !topic ? "rgba(99,102,241,0.15)" : "transparent",
                border: `1px solid ${!topic ? "rgba(99,102,241,0.3)" : "transparent"}`,
                color: !topic ? "#a5b4fc" : "#6b7280",
              }}>
              <span className="flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5" /> All Topics
              </span>
              <span className="text-xs">{stats.total}</span>
            </button>
            {TOPICS.map(t => {
              const topicSolved = ALL_PROBLEMS.filter(p => p.track === t.track && solved.has(p.id)).length
              const isActive = topic === t.track
              return (
                <button key={t.track} onClick={() => setTopic(isActive ? null : t.track)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all hover:opacity-100"
                  style={{
                    background: isActive ? `${t.color}12` : "transparent",
                    border: `1px solid ${isActive ? t.color + "30" : "transparent"}`,
                    color: isActive ? t.color : "#6b7280",
                    opacity: isActive ? 1 : 0.8,
                  }}>
                  <span className="font-medium truncate">{t.label}</span>
                  <span className="text-xs shrink-0 ml-1">
                    {topicSolved > 0 ? `${topicSolved}/` : ""}{t.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Problem list */}
          <div className="lg:col-span-3 space-y-2">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-400">
                {filtered.length} problem{filtered.length !== 1 ? "s" : ""}
                {hasFilters ? " matching filters" : ""}
              </p>
              {filtered.length > 0 && diff && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: DIFF_BG[diff], color: DIFF_COLOR[diff] }}>
                  {diff}
                </span>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Code2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No problems match your filters</p>
                <button onClick={clearFilters} className="mt-2 text-xs text-indigo-400 hover:text-indigo-300">Clear filters</button>
              </div>
            ) : (
              <div className="space-y-1.5">
                {filtered.map((problem, idx) => {
                  const isSolved = solved.has(problem.id)
                  return (
                    <button key={problem.id}
                      onClick={() => handleProblem(problem.slug)}
                      className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all group hover:scale-[1.005]"
                      style={{
                        background: isSolved ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${isSolved ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.07)"}`,
                      }}>
                      {/* Number */}
                      <span className="text-xs text-gray-600 w-6 text-right shrink-0 font-mono">
                        {idx + 1}
                      </span>

                      {/* Status circle */}
                      <div className="shrink-0">
                        {isSolved ? (
                          <div className="h-5 w-5 rounded-full flex items-center justify-center"
                            style={{ background: "#10b981", border: "2px solid #10b981" }}>
                            <svg viewBox="0 0 10 10" className="h-3 w-3" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="1.5,5 4,7.5 8.5,2.5" />
                            </svg>
                          </div>
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-600" />
                        )}
                      </div>

                      {/* Title */}
                      <span className="flex-1 text-sm font-medium text-gray-200 group-hover:text-white transition-colors truncate">
                        {problem.title}
                      </span>

                      {/* Topic badge */}
                      <span className="hidden sm:flex shrink-0 text-[11px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: `${problem.color}12`, color: problem.color }}>
                        {problem.topic}
                      </span>

                      {/* Difficulty */}
                      <span className="shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: DIFF_BG[problem.difficulty], color: DIFF_COLOR[problem.difficulty] }}>
                        {problem.difficulty}
                      </span>

                      <ChevronRight className="shrink-0 h-3.5 w-3.5 text-gray-600 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
