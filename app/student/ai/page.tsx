"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Send, Sparkles, User, Loader2,
  CheckCircle2, AlertCircle, RefreshCw,
  Brain, TrendingUp, Lightbulb, Target,
  Zap, ChevronRight, Flame, Code2, Trophy,
} from "lucide-react"

export const dynamic = "force-dynamic"

interface Message {
  role: "user" | "assistant"
  content: string
}

const SUGGESTED = [
  { text: "Improve placement chances", icon: TrendingUp, color: "text-emerald-500" },
  { text: "What skills to learn next?", icon: Zap, color: "text-amber-500" },
  { text: "Review my coding profile", icon: Code2, color: "text-blue-500" },
  { text: "Crack DSA interviews", icon: Brain, color: "text-violet-500" },
  { text: "Which companies match me?", icon: Sparkles, color: "text-pink-500" },
  { text: "Improve my CodeHiring score", icon: Trophy, color: "text-orange-500" },
]

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-2 w-2 rounded-full bg-primary/70 animate-bounce"
          style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
    </div>
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  const isAI = msg.role === "assistant"
  return (
    <div className={`flex gap-3 items-end ${isAI ? "" : "flex-row-reverse"}`}>
      {/* Avatar */}
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl shadow-lg ${
        isAI
          ? "bg-gradient-to-br from-violet-600 to-primary shadow-primary/20"
          : "bg-gradient-to-br from-slate-700 to-slate-600 border border-border"
      }`}>
        {isAI
          ? <Sparkles className="h-4 w-4 text-white" />
          : <User className="h-4 w-4 text-slate-300" />
        }
      </div>
      {/* Bubble */}
      <div className={`max-w-[76%] flex flex-col gap-0.5 ${isAI ? "items-start" : "items-end"}`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isAI
            ? "bg-card border border-border/50 text-foreground rounded-tl-sm shadow-sm"
            : "bg-gradient-to-br from-violet-600 to-primary text-white rounded-tr-sm shadow-md shadow-primary/20"
        }`}>
          {msg.content}
        </div>
      </div>
    </div>
  )
}

export default function AIInsightsPage() {
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: "Hi! I'm CodeHiring AI 👋\n\nI have full access to your verified coding stats — LeetCode, GitHub, Codeforces and more. Ask me anything about placement prep, skill gaps, or career direction. I'll give you personalised, data-backed advice.",
  }])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [insights, setInsights] = useState<any>(null)
  const [insightsLoading, setInsightsLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const fetchInsights = () => {
    setInsightsLoading(true)
    fetch("/api/student/ai-insights")
      .then(r => r.json()).then(setInsights)
      .catch(() => setInsights({ available: false, message: "Could not load insights." }))
      .finally(() => setInsightsLoading(false))
  }

  useEffect(() => { fetchInsights() }, [])

  const sendMessage = async (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || loading) return
    setMessages(prev => [...prev, { role: "user", content: msg }])
    setInput("")
    setLoading(true)
    try {
      const history = messages.slice(1).map(m => ({ role: m.role, content: m.content }))
      const res = await fetch("/api/student/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: "assistant", content: data.reply || data.error || "Something went wrong." }])
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please try again." }])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const readiness = insights?.insights?.estimatedPlacementReadiness ?? 0

  return (
    <div className="flex h-[calc(100vh-56px)] bg-background overflow-hidden">

      {/* ══ LEFT: CHAT ══════════════════════════════════════════════════════ */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Header */}
        <div className="shrink-0 border-b border-border/60 px-5 py-3 flex items-center gap-3 bg-background/80 backdrop-blur-xl">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-primary shadow-lg shadow-primary/30">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
          </div>
          <div className="flex-1">
            <h1 className="text-sm font-bold text-foreground">CodeHiring AI</h1>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
          style={{ background: "radial-gradient(ellipse at top, hsl(var(--primary)/3%) 0%, transparent 60%)" }}>

          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}

          {loading && (
            <div className="flex gap-3 items-end">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-primary shadow-lg shadow-primary/20">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="bg-card border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested questions */}
        {messages.length <= 1 && (
          <div className="px-4 pb-3">
            <p className="text-xs text-muted-foreground mb-2.5 font-medium uppercase tracking-wide">Try asking…</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SUGGESTED.map(({ text, icon: Icon, color }) => (
                <button key={text} onClick={() => sendMessage(text)}
                  className="flex items-center gap-2 text-xs px-3 py-2.5 rounded-xl border border-border/60 bg-card/60 hover:bg-card hover:border-primary/30 text-muted-foreground hover:text-foreground transition-all text-left group">
                  <Icon className={`h-3.5 w-3.5 ${color} shrink-0`} />
                  <span className="truncate">{text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="shrink-0 border-t border-border/60 p-4 bg-background/80 backdrop-blur-xl">
          <form onSubmit={e => { e.preventDefault(); sendMessage() }}
            className="flex gap-2 items-center bg-card border border-border/60 rounded-2xl px-4 py-2 shadow-sm focus-within:border-primary/40 focus-within:shadow-primary/10 focus-within:shadow-md transition-all">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Ask about your career, skills, or placement…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none py-1"
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !input.trim()}
              className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-600 to-primary hover:opacity-90 shadow-md shadow-primary/20 shrink-0 p-0 transition-opacity">
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            </Button>
          </form>
          <p className="text-[10px] text-muted-foreground/50 text-center mt-2">AI responses are based on your real platform stats</p>
        </div>
      </div>

      {/* ══ RIGHT: INSIGHTS PANEL ═══════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col w-72 xl:w-80 border-l border-border/60 shrink-0 overflow-y-auto"
        style={{ background: "linear-gradient(180deg, hsl(var(--secondary)/30%) 0%, hsl(var(--background)) 100%)" }}>

        {/* Panel header */}
        <div className="sticky top-0 z-10 backdrop-blur-xl border-b border-border/60 px-4 py-3 flex items-center justify-between"
          style={{ background: "hsl(var(--background)/90%)" }}>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 border border-primary/20">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">AI Insights</span>
          </div>
          <button onClick={fetchInsights} disabled={insightsLoading}
            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-secondary/60">
            <RefreshCw className={`h-3.5 w-3.5 ${insightsLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="p-4 space-y-3 flex-1">
          {insightsLoading ? (
            <div className="flex flex-col items-center gap-3 py-12">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
                <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">Analysing your profile…</p>
            </div>

          ) : !insights?.available ? (
            <div className="rounded-2xl border border-dashed border-border/60 p-6 text-center space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto">
                <AlertCircle className="h-6 w-6 text-muted-foreground/40" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {insights?.message ?? "Connect your coding platforms to unlock AI insights."}
              </p>
            </div>

          ) : (
            <>
              {/* Placement Readiness */}
              <div className="rounded-2xl overflow-hidden border border-border/40 shadow-sm">
                <div className={`p-4 ${
                  readiness >= 75
                    ? "bg-gradient-to-br from-emerald-600/90 to-teal-600/90"
                    : readiness >= 50
                    ? "bg-gradient-to-br from-amber-600/90 to-orange-600/90"
                    : "bg-gradient-to-br from-red-600/90 to-rose-600/90"
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Placement Readiness</p>
                      <p className="text-4xl font-black text-white tabular-nums leading-none mt-1">{readiness}%</p>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Flame className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${readiness}%` }} />
                  </div>
                </div>
                {insights.insights.overallAssessment && (
                  <div className="px-4 py-3 bg-card/80">
                    <p className="text-xs text-muted-foreground leading-relaxed">{insights.insights.overallAssessment}</p>
                  </div>
                )}
              </div>

              {/* Strengths */}
              {insights.insights.strengths?.length > 0 && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 overflow-hidden">
                  <div className="px-3 py-2.5 flex items-center gap-2 border-b border-emerald-500/10">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Strengths</span>
                  </div>
                  <div className="p-3 space-y-2.5">
                    {insights.insights.strengths.map((s: string) => (
                      <div key={s} className="flex items-start gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <p className="text-xs text-foreground leading-relaxed">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvements */}
              {insights.insights.improvements?.length > 0 && (
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 overflow-hidden">
                  <div className="px-3 py-2.5 flex items-center gap-2 border-b border-amber-500/10">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">To Improve</span>
                  </div>
                  <div className="p-3 space-y-2.5">
                    {insights.insights.improvements.map((s: string) => (
                      <div key={s} className="flex items-start gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <p className="text-xs text-foreground leading-relaxed">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pro Tip */}
              {insights.insights.placementTip && (
                <div className="rounded-2xl border border-primary/20 p-3.5"
                  style={{ background: "linear-gradient(135deg, hsl(var(--primary)/8%) 0%, hsl(270 80% 60%/8%) 100%)" }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Lightbulb className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-bold text-primary">Pro Tip</span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">{insights.insights.placementTip}</p>
                </div>
              )}

              {/* Skill Gaps */}
              {insights.insights.skillGaps?.length > 0 && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 overflow-hidden">
                  <div className="px-3 py-2.5 flex items-center gap-2 border-b border-red-500/10">
                    <Target className="h-3.5 w-3.5 text-red-500" />
                    <span className="text-xs font-bold text-red-500 uppercase tracking-wide">Skill Gaps</span>
                  </div>
                  <div className="p-3 flex flex-wrap gap-1.5">
                    {insights.insights.skillGaps.map((s: string) => (
                      <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ask AI nudge */}
              <div className="rounded-2xl border border-dashed border-primary/20 p-3 text-center">
                <p className="text-xs text-muted-foreground mb-2">Want deeper analysis?</p>
                <button onClick={() => sendMessage("Give me a detailed analysis of my profile and what I should focus on for the next 30 days")}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 mx-auto">
                  Ask AI for 30-day plan <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
