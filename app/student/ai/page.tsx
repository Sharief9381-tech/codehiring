"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Send, Sparkles, User, Loader2,
  CheckCircle2, Circle, RefreshCw,
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/header"

interface Message {
  role: "user" | "assistant"
  content: string
}

const SUGGESTED = [
  "How can I improve my placement chances?",
  "What skills should I learn next?",
  "Review my coding profile",
  "How to crack DSA interviews?",
  "Which companies match my profile?",
  "How to improve my CodeHiring score?",
]

export default function AIInsightsPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm CodeHiring AI 👋 I have access to your coding profile and can give you personalized career advice. What would you like to know?",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [insights, setInsights] = useState<any>(null)
  const [insightsLoading, setInsightsLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  useEffect(() => {
    fetch("/api/student/ai-insights")
      .then((r) => r.json())
      .then(setInsights)
      .catch(() => {})
      .finally(() => setInsightsLoading(false))
  }, [])

  const sendMessage = async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg || loading) return

    const userMsg: Message = { role: "user", content: msg }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    try {
      const history = newMessages
        .slice(1)
        .map((m) => ({ role: m.role, content: m.content }))
      const res = await fetch("/api/student/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history: history.slice(0, -1) }),
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || data.error || "Sorry, something went wrong.",
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please try again." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    /* Full viewport height, flex column, no overflow on outer */
    <div className="flex flex-col h-screen overflow-hidden">
      <DashboardHeader
        title="AI Insights"
        description="Your personal AI career advisor powered by Groq"
      />

      {/* Main content — fills remaining height */}
      <div className="flex flex-1 min-h-0">

        {/* ── Left 70%: Chatbot ─────────────────────────────── */}
        <div className="flex flex-col border-r border-border" style={{ width: "70%" }}>

          {/* Scrollable messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    msg.role === "assistant" ? "bg-primary/10" : "bg-secondary"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Sparkles className="h-4 w-4 text-primary" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "assistant"
                      ? "bg-card border border-border text-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested prompts — only on first load */}
          {messages.length <= 1 && (
            <div className="px-5 pb-3 flex flex-wrap gap-2">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input bar — always at bottom */}
          <div className="border-t border-border p-4 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage()
              }}
              className="flex gap-3"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about your career, skills, or placement..."
                className="flex-1 bg-secondary"
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                className="gap-2 shrink-0"
              >
                <Send className="h-4 w-4" />
                Send
              </Button>
            </form>
          </div>
        </div>

        {/* ── Right 30%: Insights Panel ─────────────────────── */}
        <div
          className="overflow-y-auto p-4 space-y-4 bg-secondary/20 shrink-0"
          style={{ width: "30%" }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">Profile Insights</h3>
          </div>

          {insightsLoading ? (
            <div className="flex items-center gap-2 py-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Analyzing your profile...</span>
            </div>
          ) : !insights?.available ? (
            <div className="rounded-lg bg-card border border-border p-3">
              <p className="text-xs text-muted-foreground">
                {insights?.message || "AI insights unavailable"}
              </p>
            </div>
          ) : (
            <>
              {/* Placement readiness */}
              <div className="rounded-lg bg-card border border-border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">Placement Readiness</span>
                  <span className="text-xs font-bold text-primary">
                    {insights.insights.estimatedPlacementReadiness}%
                  </span>
                </div>
                <Progress
                  value={insights.insights.estimatedPlacementReadiness}
                  className="h-1.5"
                />
              </div>

              {/* Assessment */}
              <div className="rounded-lg bg-card border border-border p-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {insights.insights.overallAssessment}
                </p>
              </div>

              {/* Strengths */}
              <div className="rounded-lg bg-card border border-border p-3 space-y-2">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                  Strengths
                </p>
                {insights.insights.strengths?.map((s: string) => (
                  <div key={s} className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-foreground">{s}</p>
                  </div>
                ))}
              </div>

              {/* Improvements */}
              <div className="rounded-lg bg-card border border-border p-3 space-y-2">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
                  Improve
                </p>
                {insights.insights.improvements?.map((s: string) => (
                  <div key={s} className="flex items-start gap-1.5">
                    <Circle className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-foreground">{s}</p>
                  </div>
                ))}
              </div>

              {/* Placement tip */}
              {insights.insights.placementTip && (
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                  <p className="text-xs font-semibold text-primary mb-1">💡 Tip</p>
                  <p className="text-xs text-foreground">{insights.insights.placementTip}</p>
                </div>
              )}

              {/* Skill gaps */}
              {insights.insights.skillGaps?.length > 0 && (
                <div className="rounded-lg bg-card border border-border p-3 space-y-2">
                  <p className="text-xs font-semibold text-red-500 uppercase tracking-wide">
                    Skill Gaps
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {insights.insights.skillGaps.map((s: string) => (
                      <Badge
                        key={s}
                        variant="outline"
                        className="text-xs text-red-500 border-red-500/30"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Refresh */}
              <button
                onClick={() => {
                  setInsightsLoading(true)
                  fetch("/api/student/ai-insights")
                    .then((r) => r.json())
                    .then(setInsights)
                    .catch(() => {})
                    .finally(() => setInsightsLoading(false))
                }}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Refresh insights
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
