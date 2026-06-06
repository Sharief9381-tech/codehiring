"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Send, Sparkles, User, Loader2,
  CheckCircle2, AlertCircle, RefreshCw,
  Brain, TrendingUp, Lightbulb, Target,
  Zap, ChevronRight,
} from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

const SUGGESTED = [
  { text: "Improve placement chances", icon: TrendingUp },
  { text: "What skills to learn next?", icon: Zap },
  { text: "Review my coding profile", icon: Target },
  { text: "Crack DSA interviews", icon: Brain },
  { text: "Which companies match me?", icon: Sparkles },
  { text: "Improve my CodeHiring score", icon: ChevronRight },
]

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )
}

export default function AIInsightsPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm CodeHiring AI 👋\n\nI have full access to your verified coding stats from LeetCode, GitHub, Codeforces and more. Ask me anything about your placement prep, skill gaps, or career path — I'll give you personalized advice.",
    },
  ])
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
      .then((r) => r.json())
      .then(setInsights)
      .catch(() => setInsights({ available: false, message: "Could not load insights." }))
      .finally(() => setInsightsLoading(false))
  }

  useEffect(() => { fetchInsights() }, [])

  const sendMessage = async (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || loading) return

    setMessages((prev) => [...prev, { role: "user", content: msg }])
    setInput("")
    setLoading(true)

    try {
      const history = messages.slice(1).map((m) => ({ role: m.role, content: m.content }))
      const res = await fetch("/api/student/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history }),
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || data.error || "Sorry, something went wrong." },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please try again." },
      ])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const readiness = insights?.insights?.estimatedPlacementReadiness ?? 0
  const readinessColor =
    readiness >= 75 ? "from-emerald-500 to-teal-500" :
    readiness >= 50 ? "from-amber-500 to-orange-500" :
    "from-red-500 to-rose-500"

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background overflow-hidden">

      {/* ══════════════ LEFT: CHAT ══════════════ */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Header bar */}
        <div className="shrink-0 border-b border-border/60 px-6 py-3 flex items-center gap-3 bg-background/80 backdrop-blur">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 shadow-lg shadow-primary/30">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground leading-none">CodeHiring AI</h1>
            <p className="text-xs text-emerald-500 mt-0.5 font-medium">● Online · Powered by Groq</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 items-end ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              {/* Avatar */}
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                msg.role === "assistant"
                  ? "bg-gradient-to-br from-primary to-violet-600 shadow-md shadow-primary/30"
                  : "bg-secondary border border-border"
              }`}>
                {msg.role === "assistant"
                  ? <Sparkles className="h-3.5 w-3.5 text-white" />
                  : <User className="h-3.5 w-3.5 text-muted-foreground" />
                }
              </div>

              {/* Bubble */}
              <div className={`group max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                  msg.role === "assistant"
                    ? "bg-card border border-border/60 text-foreground rounded-bl-sm"
                    : "bg-gradient-to-br from-primary to-violet-600 text-white rounded-br-sm shadow-primary/20"
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3 items-end">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-600 shadow-md shadow-primary/30">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="bg-card border border-border/60 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested chips */}
        {messages.length <= 1 && (
          <div className="px-4 pb-3">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Suggested questions</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.map(({ text, icon: Icon }) => (
                <button
                  key={text}
                  onClick={() => sendMessage(text)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:bg-primary/5 hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all"
                >
                  <Icon className="h-3 w-3" />
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="shrink-0 border-t border-border/60 p-4 bg-background/80 backdrop-blur">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage() }} className="flex gap-2 items-center">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                placeholder="Ask anything about your career, skills, or placement..."
                className="flex-1 bg-card border-border/60 pr-4 rounded-xl focus-visible:ring-primary/30 h-11"
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-violet-600 hover:opacity-90 shadow-lg shadow-primary/30 shrink-0 p-0"
            >
              {loading
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Send className="h-4 w-4" />
              }
            </Button>
          </form>
        </div>
      </div>

      {/* ══════════════ RIGHT: INSIGHTS PANEL ══════════════ */}
      <div className="hidden lg:flex flex-col w-72 xl:w-80 border-l border-border/60 bg-secondary/10 shrink-0 overflow-y-auto">

        {/* Panel header */}
        <div className="sticky top-0 z-10 bg-background/90 backdrop-blur border-b border-border/60 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">Profile Insights</span>
          </div>
          <button
            onClick={fetchInsights}
            disabled={insightsLoading}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-secondary"
            title="Refresh"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${insightsLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="p-4 space-y-3 flex-1">
          {insightsLoading ? (
            <div className="flex flex-col items-center gap-3 py-10">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
              <p className="text-xs text-muted-foreground text-center">Analyzing your profile with AI...</p>
            </div>
          ) : !insights?.available ? (
            <div className="rounded-xl bg-card border border-border/60 p-4 text-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">
                {insights?.message ?? "Connect your coding platforms to unlock AI insights."}
              </p>
            </div>
          ) : (
            <>
              {/* Placement Readiness — hero card */}
              <div className="rounded-xl overflow-hidden border border-border/60 bg-card">
                <div className={`bg-gradient-to-r ${readinessColor} p-4`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white/90 uppercase tracking-wide">Placement Readiness</span>
                    <span className="text-2xl font-black text-white tabular-nums">{readiness}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/20">
                    <div className="h-1.5 rounded-full bg-white transition-all" style={{ width: `${readiness}%` }} />
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">{insights.insights.overallAssessment}</p>
                </div>
              </div>

              {/* Strengths */}
              {insights.insights.strengths?.length > 0 && (
                <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
                  <div className="px-3 py-2 border-b border-border/60 bg-emerald-500/5">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Strengths</span>
                    </div>
                  </div>
                  <div className="p-3 space-y-2">
                    {insights.insights.strengths.map((s: string) => (
                      <div key={s} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <p className="text-xs text-foreground">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvements */}
              {insights.insights.improvements?.length > 0 && (
                <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
                  <div className="px-3 py-2 border-b border-border/60 bg-amber-500/5">
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">To Improve</span>
                    </div>
                  </div>
                  <div className="p-3 space-y-2">
                    {insights.insights.improvements.map((s: string) => (
                      <div key={s} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <p className="text-xs text-foreground">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Placement tip */}
              {insights.insights.placementTip && (
                <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-violet-500/5 p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Lightbulb className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-semibold text-primary">Pro Tip</span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">{insights.insights.placementTip}</p>
                </div>
              )}

              {/* Skill gaps */}
              {insights.insights.skillGaps?.length > 0 && (
                <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
                  <div className="px-3 py-2 border-b border-border/60 bg-red-500/5">
                    <div className="flex items-center gap-1.5">
                      <Target className="h-3.5 w-3.5 text-red-500" />
                      <span className="text-xs font-semibold text-red-500 uppercase tracking-wide">Skill Gaps</span>
                    </div>
                  </div>
                  <div className="p-3 flex flex-wrap gap-1.5">
                    {insights.insights.skillGaps.map((s: string) => (
                      <Badge key={s} variant="outline" className="text-xs text-red-500 border-red-400/30 bg-red-500/5">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
