"use client"

/**
 * AI Voice Communication Coach
 * Helps students improve spoken English, HR interview skills,
 * technical communication and group discussion abilities.
 */

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, Mic, MicOff, Volume2, VolumeX, RotateCcw,
  CheckCircle2, AlertCircle, Trophy, ChevronRight, Play,
  MessageSquare, BookOpen, Users, Zap,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────
interface Feedback {
  overallScore: number
  grammar: { score: number; issues: string[]; tip: string }
  fluency: { score: number; fillerWords: string[]; tip: string }
  content: { score: number; relevance: string; tip: string }
  confidence: { score: number; observation: string; tip: string }
  improvedVersion: string
  encouragement: string
}

interface Message { role: "user" | "assistant"; content: string }

// ─── Scenario config ──────────────────────────────────────────────────────────
const SCENARIOS = [
  {
    id: "hr",
    name: "HR Interview",
    icon: "👔",
    color: "#7c3aed",
    desc: "Practice common HR questions: Tell me about yourself, strengths & weaknesses, career goals",
    topics: ["Self introduction", "Strengths & weaknesses", "Why this company?", "Career goals", "Team experience"],
  },
  {
    id: "technical",
    name: "Technical Discussion",
    icon: "💻",
    color: "#2563eb",
    desc: "Explain technical concepts clearly — projects, technologies, problem-solving approach",
    topics: ["Explain your project", "Technology choices", "Problem-solving approach", "Technical challenges", "System design basics"],
  },
  {
    id: "gd",
    name: "Group Discussion",
    icon: "🗣️",
    color: "#059669",
    desc: "Express opinions on trending topics — technology, society, education, environment",
    topics: ["AI in education", "Work from home culture", "Social media impact", "Climate change", "Digital India"],
  },
  {
    id: "english",
    name: "Spoken English",
    icon: "🌐",
    color: "#d97706",
    desc: "Improve day-to-day spoken English — fluency, pronunciation, vocabulary usage",
    topics: ["Describe your day", "Talk about a hobby", "News discussion", "Story narration", "Opinion sharing"],
  },
]

// ─── Score ring component ─────────────────────────────────────────────────────
function ScoreRing({ score, size = 80, color }: { score: number; size?: number; color: string }) {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const fill = (score / 100) * circ
  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
          strokeWidth={8} strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round" style={{ transition: "stroke-dasharray 0.8s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size / 4, fontWeight: 700, color }}>{score}</span>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CommunicationCoachPage() {
  const router = useRouter()
  const [view, setView] = useState<"home" | "practice" | "interview">("home")
  const [scenario, setScenario] = useState<typeof SCENARIOS[0] | null>(null)
  const [mode, setMode] = useState<"practice" | "interview">("practice")

  // Speech
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechEnabled, setSpeechEnabled] = useState(true)
  const recognitionRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Practice mode
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [loadingQuestion, setLoadingQuestion] = useState(false)
  const [loadingFeedback, setLoadingFeedback] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [sessionCount, setSessionCount] = useState(0)

  // Interview mode
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingReply, setLoadingReply] = useState(false)
  const [interviewStarted, setInterviewStarted] = useState(false)

  // ── Speech recognition setup ──
  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) { alert("Speech recognition not supported. Please use Chrome."); return }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (e: any) => {
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join("")
      setTranscript(t)
    }
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
    setTranscript("")
  }, [])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  // ── Text to speech ──
  const speak = useCallback((text: string) => {
    if (!speechEnabled || typeof window === "undefined") return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = "en-US"
    utt.rate = 0.95
    utt.pitch = 1
    utt.onstart = () => setIsSpeaking(true)
    utt.onend = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utt)
  }, [speechEnabled])

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
  }, [])

  // ── Get new practice question ──
  const getQuestion = useCallback(async (sc: typeof SCENARIOS[0]) => {
    setLoadingQuestion(true)
    setFeedback(null)
    setTranscript("")
    try {
      const res = await fetch("/api/student/voice-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "get-question", scenario: sc.id }),
      })
      const data = await res.json()
      setCurrentQuestion(data.question || "Tell me about yourself.")
      if (speechEnabled) speak(data.question)
    } catch {
      setCurrentQuestion("Tell me about yourself and why you chose your field of study.")
    } finally {
      setLoadingQuestion(false)
    }
  }, [speak, speechEnabled])

  // ── Submit practice answer ──
  const submitAnswer = useCallback(async () => {
    if (!transcript.trim() || !currentQuestion) return
    setLoadingFeedback(true)
    try {
      const res = await fetch("/api/student/voice-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "practice", scenario: scenario?.id, question: currentQuestion, userSpeech: transcript }),
      })
      const data = await res.json()
      setFeedback(data)
      setSessionCount(c => c + 1)
      if (speechEnabled && data.encouragement) speak(data.encouragement)
    } catch {
      setFeedback(null)
    } finally {
      setLoadingFeedback(false)
    }
  }, [transcript, currentQuestion, scenario, speak, speechEnabled])

  // ── Send interview message ──
  const sendInterviewMessage = useCallback(async (text: string) => {
    if (!text.trim()) return
    const newMessages: Message[] = [...messages, { role: "user", content: text }]
    setMessages(newMessages)
    setTranscript("")
    setLoadingReply(true)
    try {
      const res = await fetch("/api/student/voice-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "interview",
          scenario: scenario?.id,
          userSpeech: text,
          conversationHistory: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      const reply = data.reply || "Could you elaborate on that?"
      setMessages([...newMessages, { role: "assistant", content: reply }])
      if (speechEnabled) speak(reply)
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "I see. Can you tell me more about that?" }])
    } finally {
      setLoadingReply(false)
    }
  }, [messages, scenario, speak, speechEnabled])

  // ── Start interview ──
  const startInterview = useCallback(async (sc: typeof SCENARIOS[0]) => {
    setMessages([])
    setInterviewStarted(true)
    setLoadingReply(true)
    const openings: Record<string, string> = {
      hr: "Hello! I'm your HR interviewer today. Let's start — please tell me about yourself.",
      technical: "Hi! I'll be conducting your technical discussion. Let's begin — could you briefly introduce yourself and your technical background?",
      gd: "Welcome to the group discussion. Today's topic is open — share your thoughts on how technology is changing education.",
      english: "Hi there! Let's have a friendly conversation to help you practice your spoken English. How has your day been?",
    }
    const opening = openings[sc.id] || openings.hr
    setMessages([{ role: "assistant", content: opening }])
    if (speechEnabled) speak(opening)
    setLoadingReply(false)
  }, [speak, speechEnabled])

  // ── Enter a scenario ──
  const enterScenario = (sc: typeof SCENARIOS[0], m: "practice" | "interview") => {
    setScenario(sc)
    setMode(m)
    setTranscript("")
    setFeedback(null)
    setMessages([])
    setInterviewStarted(false)
    setCurrentQuestion("")
    setView(m)
    if (m === "practice") getQuestion(sc)
    if (m === "interview") startInterview(sc)
  }

  // ── Cleanup ──
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
      window.speechSynthesis?.cancel()
    }
  }, [])

  // ─── HOME VIEW ──────────────────────────────────────────────────────────────
  if (view === "home") {
    return (
      <div className="min-h-screen" style={{ background: "#09090b" }}>
        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          </div>

          <div className="text-center mb-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl mx-auto mb-4 text-3xl"
              style={{ background: "linear-gradient(135deg,#7c3aed20,#6366f120)", border: "1px solid #7c3aed30" }}>
              🎙️
            </div>
            <h1 className="text-3xl font-bold text-foreground">AI Voice Communication Coach</h1>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Speak, get instant AI feedback and improve your communication for campus placements
            </p>
            <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Mic className="h-3.5 w-3.5" /> Voice powered</span>
              <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5 text-yellow-500" /> AI feedback</span>
              <span className="flex items-center gap-1"><Volume2 className="h-3.5 w-3.5 text-blue-400" /> Speaks to you</span>
            </div>
          </div>

          {/* Scenario cards */}
          <div className="grid gap-5 sm:grid-cols-2">
            {SCENARIOS.map(sc => (
              <div key={sc.id} className="rounded-2xl border overflow-hidden"
                style={{ borderColor: `${sc.color}25`, background: "rgba(15,15,20,0.7)" }}>
                {/* Card top */}
                <div className="p-5 pb-4" style={{ background: `${sc.color}08` }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl text-xl"
                      style={{ background: `${sc.color}20` }}>{sc.icon}</div>
                    <div>
                      <p className="font-bold text-foreground">{sc.name}</p>
                      <p className="text-xs text-muted-foreground">{sc.topics.length} topic areas</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{sc.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {sc.topics.map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: `${sc.color}15`, color: `${sc.color}cc` }}>{t}</span>
                    ))}
                  </div>
                </div>
                {/* Buttons */}
                <div className="p-4 grid grid-cols-2 gap-2.5">
                  <button onClick={() => enterScenario(sc, "practice")}
                    className="h-9 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all hover:opacity-90"
                    style={{ background: `linear-gradient(135deg,${sc.color},${sc.color}bb)` }}>
                    <BookOpen className="h-3.5 w-3.5" /> Practice
                  </button>
                  <button onClick={() => enterScenario(sc, "interview")}
                    className="h-9 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all hover:opacity-90"
                    style={{ border: `1px solid ${sc.color}40`, color: sc.color, background: `${sc.color}08` }}>
                    <MessageSquare className="h-3.5 w-3.5" /> Mock Interview
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="mt-8 rounded-2xl border border-border p-5"
            style={{ background: "rgba(15,15,20,0.5)" }}>
            <p className="text-sm font-semibold text-foreground mb-3">💡 How to use</p>
            <div className="grid sm:grid-cols-3 gap-4 text-xs text-muted-foreground">
              <div><span className="font-semibold text-foreground">1. Choose a scenario</span> — Pick what you want to practise: HR, Technical, GD or Spoken English.</div>
              <div><span className="font-semibold text-foreground">2. Speak your answer</span> — Press the mic button and answer the AI's question out loud.</div>
              <div><span className="font-semibold text-foreground">3. Get AI feedback</span> — Receive scores on grammar, fluency, content and confidence with tips to improve.</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── PRACTICE VIEW ──────────────────────────────────────────────────────────
  if (view === "practice" && scenario) {
    return (
      <div className="min-h-screen" style={{ background: "#09090b" }}>
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => { stopSpeaking(); stopListening(); setView("home") }}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full"
                style={{ background: `${scenario.color}15`, color: scenario.color }}>
                {scenario.icon} {scenario.name}
              </span>
              <button onClick={() => setSpeechEnabled(v => !v)}
                className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors">
                {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-5">
            {/* Question card */}
            <div className="rounded-2xl p-5" style={{ border: `1px solid ${scenario.color}25`, background: `${scenario.color}06` }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: scenario.color }}>
                  🎯 Question {sessionCount + 1}
                </p>
                <button onClick={() => getQuestion(scenario)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <RotateCcw className="h-3 w-3" /> New question
                </button>
              </div>
              {loadingQuestion ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-4 w-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${scenario.color}40`, borderTopColor: scenario.color }} />
                  Generating question...
                </div>
              ) : (
                <p className="text-base font-medium text-foreground leading-relaxed">{currentQuestion}</p>
              )}
              {isSpeaking && (
                <div className="flex items-center gap-2 mt-2">
                  <Volume2 className="h-3.5 w-3.5" style={{ color: scenario.color }} />
                  <span className="text-xs" style={{ color: scenario.color }}>Speaking...</span>
                  <button onClick={stopSpeaking} className="text-xs text-muted-foreground hover:text-foreground">Stop</button>
                </div>
              )}
            </div>

            {/* Mic area */}
            <div className="rounded-2xl p-6 text-center space-y-4" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(24,24,27,0.8)" }}>
              {/* Mic button */}
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={isListening ? stopListening : startListening}
                  className="relative flex h-20 w-20 items-center justify-center rounded-full transition-all active:scale-95"
                  style={{
                    background: isListening
                      ? `linear-gradient(135deg,#ef4444,#dc2626)`
                      : `linear-gradient(135deg,${scenario.color},${scenario.color}bb)`,
                    boxShadow: isListening ? "0 0 0 12px rgba(239,68,68,0.15)" : `0 0 0 0px ${scenario.color}00`,
                    transition: "all 0.3s ease",
                  }}>
                  {isListening ? <MicOff className="h-8 w-8 text-white" /> : <Mic className="h-8 w-8 text-white" />}
                  {isListening && (
                    <span className="absolute inset-0 rounded-full animate-ping"
                      style={{ background: "rgba(239,68,68,0.3)" }} />
                  )}
                </button>
                <p className="text-xs text-muted-foreground">
                  {isListening ? "🔴 Listening... click to stop" : "Click to speak your answer"}
                </p>
              </div>

              {/* Transcript */}
              {transcript && (
                <div className="rounded-xl p-3 text-left" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <p className="text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">Your answer</p>
                  <p className="text-sm text-foreground leading-relaxed">{transcript}</p>
                </div>
              )}

              {/* Submit */}
              {transcript && !isListening && !loadingFeedback && !feedback && (
                <button onClick={submitAnswer}
                  className="w-full h-11 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(135deg,${scenario.color},${scenario.color}bb)` }}>
                  <Zap className="h-4 w-4" /> Get AI Feedback
                </button>
              )}

              {loadingFeedback && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-2">
                  <div className="h-4 w-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${scenario.color}40`, borderTopColor: scenario.color }} />
                  Analysing your speech...
                </div>
              )}
            </div>

            {/* Feedback */}
            {feedback && (
              <div className="space-y-4">
                {/* Overall score */}
                <div className="rounded-2xl p-5 flex items-center gap-5" style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(24,24,27,0.9)" }}>
                  <ScoreRing score={feedback.overallScore}
                    color={feedback.overallScore >= 75 ? "#10b981" : feedback.overallScore >= 50 ? "#f59e0b" : "#ef4444"} />
                  <div>
                    <p className="font-bold text-foreground text-lg">
                      {feedback.overallScore >= 75 ? "Excellent!" : feedback.overallScore >= 50 ? "Good effort!" : "Keep practising!"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">{feedback.encouragement}</p>
                  </div>
                </div>

                {/* Score breakdown */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Grammar", data: feedback.grammar, icon: "📝" },
                    { label: "Fluency", data: feedback.fluency, icon: "🌊" },
                    { label: "Content", data: feedback.content, icon: "💡" },
                    { label: "Confidence", data: feedback.confidence, icon: "💪" },
                  ].map(({ label, data, icon }) => (
                    <div key={label} className="rounded-xl p-3.5" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(24,24,27,0.6)" }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-foreground">{icon} {label}</span>
                        <span className="text-sm font-bold" style={{ color: data.score >= 75 ? "#10b981" : data.score >= 50 ? "#f59e0b" : "#ef4444" }}>
                          {data.score}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${data.score}%`, background: data.score >= 75 ? "#10b981" : data.score >= 50 ? "#f59e0b" : "#ef4444" }} />
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">{data.tip}</p>
                    </div>
                  ))}
                </div>

                {/* Filler words */}
                {feedback.fluency.fillerWords?.length > 0 && (
                  <div className="rounded-xl p-3.5" style={{ border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)" }}>
                    <p className="text-xs font-semibold text-red-400 mb-1.5">⚠️ Filler words detected</p>
                    <div className="flex flex-wrap gap-1.5">
                      {feedback.fluency.fillerWords.map(w => (
                        <span key={w} className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">{w}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improved version */}
                {feedback.improvedVersion && (
                  <div className="rounded-xl p-4" style={{ border: "1px solid rgba(59,130,246,0.25)", background: "rgba(59,130,246,0.06)" }}>
                    <p className="text-xs font-semibold text-blue-400 mb-2">✨ Improved version</p>
                    <p className="text-sm text-foreground leading-relaxed italic">"{feedback.improvedVersion}"</p>
                    <button onClick={() => speak(feedback.improvedVersion)}
                      className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 mt-2 transition-colors">
                      <Volume2 className="h-3 w-3" /> Hear it
                    </button>
                  </div>
                )}

                {/* Next question */}
                <button onClick={() => { setFeedback(null); setTranscript(""); getQuestion(scenario) }}
                  className="w-full h-11 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(135deg,${scenario.color},${scenario.color}bb)` }}>
                  Next Question <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ─── INTERVIEW VIEW ─────────────────────────────────────────────────────────
  if (view === "interview" && scenario) {

    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#09090b" }}>
        {/* Header */}
        <div className="sticky top-0 z-10 px-4 py-3 border-b border-border flex items-center justify-between"
          style={{ background: "#09090b" }}>
          <button onClick={() => { stopSpeaking(); stopListening(); setView("home") }}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> End Session
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: `${scenario.color}15`, color: scenario.color }}>
              {scenario.icon} {scenario.name} — Mock Interview
            </span>
            <button onClick={() => setSpeechEnabled(v => !v)}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors">
              {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-2xl mx-auto w-full">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "text-white"
                  : "text-foreground"
              }`}
                style={msg.role === "user"
                  ? { background: `linear-gradient(135deg,${scenario.color},${scenario.color}bb)` }
                  : { background: "rgba(24,24,27,0.9)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[10px] font-bold" style={{ color: scenario.color }}>🤖 AI Interviewer</span>
                    {speechEnabled && (
                      <button onClick={() => speak(msg.content)}
                        className="opacity-60 hover:opacity-100 transition-opacity">
                        <Volume2 className="h-3 w-3" style={{ color: scenario.color }} />
                      </button>
                    )}
                  </div>
                )}
                {msg.content}
              </div>
            </div>
          ))}

          {loadingReply && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-3 flex items-center gap-2"
                style={{ background: "rgba(24,24,27,0.9)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="h-2 w-2 rounded-full animate-bounce"
                      style={{ background: scenario.color, animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">Interviewer is responding...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="sticky bottom-0 border-t border-border px-4 py-4"
          style={{ background: "#09090b" }}>
          <div className="max-w-2xl mx-auto space-y-3">
            {/* Transcript preview */}
            {transcript && (
              <div className="rounded-xl px-3 py-2 text-sm text-muted-foreground"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {transcript}
              </div>
            )}

            <div className="flex items-center gap-3">
              {/* Mic */}
              <button
                onClick={isListening ? stopListening : startListening}
                className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all active:scale-95"
                style={{
                  background: isListening ? "#ef4444" : `${scenario.color}20`,
                  border: `2px solid ${isListening ? "#ef4444" : scenario.color}`,
                }}>
                {isListening ? <MicOff className="h-5 w-5 text-white" /> : <Mic className="h-5 w-5" style={{ color: scenario.color }} />}
                {isListening && <span className="absolute inset-0 rounded-full animate-ping bg-red-500/30" />}
              </button>

              {/* Send */}
              <button
                onClick={() => sendInterviewMessage(transcript)}
                disabled={!transcript.trim() || loadingReply || isListening}
                className="flex-1 h-12 rounded-xl font-semibold text-white disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                style={{ background: `linear-gradient(135deg,${scenario.color},${scenario.color}bb)` }}>
                <Play className="h-4 w-4" />
                {isListening ? "Listening..." : "Send Response"}
              </button>
            </div>
            <p className="text-center text-[10px] text-muted-foreground">
              Press mic → speak → press mic again → send your response
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
