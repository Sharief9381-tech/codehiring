"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Mic, MicOff, Square, Play, RotateCcw, ChevronRight,
  CheckCircle2, AlertCircle, Sparkles, Volume2, Brain,
  MessageCircle, Target, Zap, Star, ArrowRight, Loader2,
} from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────

interface Feedback {
  overallScore: number
  grammar:    { score: number; issues: string[]; tip: string }
  fluency:    { score: number; fillerWords: string[]; tip: string }
  content:    { score: number; relevance: string; tip: string }
  confidence: { score: number; observation: string; tip: string }
  improvedVersion: string
  encouragement: string
}

interface ConvMessage { role: "user" | "assistant"; content: string }

type Scenario = "hr" | "technical" | "gd" | "english"
type Mode = "practice" | "interview"
type Stage = "select" | "ready" | "recording" | "processing" | "feedback" | "interview"

// ── Scenario metadata ─────────────────────────────────────────────────────────

const SCENARIOS: { id: Scenario; label: string; icon: string; color: string; desc: string }[] = [
  { id: "hr",        label: "HR Interview",        icon: "🤝", color: "#7c3aed", desc: "Tell me about yourself, strengths, goals" },
  { id: "technical", label: "Technical Interview", icon: "💻", color: "#3b82f6", desc: "CS concepts, projects, problem-solving" },
  { id: "gd",        label: "Group Discussion",    icon: "👥", color: "#f59e0b", desc: "Express opinions, counter-arguments" },
  { id: "english",   label: "English Speaking",    icon: "🗣️", color: "#10b981", desc: "Fluency, pronunciation, vocabulary" },
]

// ── Score ring ────────────────────────────────────────────────────────────────

function ScoreRing({ score, color, size = 56 }: { score: number; color: string; size?: number }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={4} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        className="rotate-90" fill={color}
        style={{ fontSize: size * 0.22, fontWeight: 700, transform: `rotate(90deg)`, transformOrigin: "50% 50%", transition: "none" }}>
        {score}
      </text>
    </svg>
  )
}

// ── Waveform animation ────────────────────────────────────────────────────────

function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-[3px] h-8">
      {[...Array(12)].map((_, i) => (
        <div key={i}
          className="w-[3px] rounded-full transition-all"
          style={{
            background: active ? "#10b981" : "rgba(255,255,255,0.15)",
            height: active ? `${20 + Math.sin(i * 1.2) * 12}px` : "6px",
            animationName: active ? "wave" : "none",
            animationDuration: `${0.6 + i * 0.07}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDirection: "alternate",
            animationDelay: `${i * 0.05}s`,
          }} />
      ))}
      <style>{`
        @keyframes wave {
          from { height: 4px; }
          to   { height: 28px; }
        }
      `}</style>
    </div>
  )
}

// ── Main VoiceCoach component ─────────────────────────────────────────────────

export function VoiceCoach() {
  const [mode, setMode]             = useState<Mode>("practice")
  const [scenario, setScenario]     = useState<Scenario | null>(null)
  const [stage, setStage]           = useState<Stage>("select")
  const [question, setQuestion]     = useState("")
  const [transcript, setTranscript] = useState("")
  const [interim, setInterim]       = useState("")
  const [feedback, setFeedback]     = useState<Feedback | null>(null)
  const [isLoading, setIsLoading]   = useState(false)
  const [error, setError]           = useState("")
  const [conversation, setConversation] = useState<ConvMessage[]>([])
  const [interviewReply, setInterviewReply] = useState("")
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [supported, setSupported]   = useState(true)
  const [sessionScore, setSessionScore] = useState<number[]>([])

  const recognitionRef = useRef<any>(null)
  const synthRef       = useRef<SpeechSynthesis | null>(null)
  const chatEndRef     = useRef<HTMLDivElement>(null)

  // ── Speech synthesis setup ────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!("SpeechRecognition" in window) && !("webkitSpeechRecognition" in window)) {
      setSupported(false)
    }
    synthRef.current = window.speechSynthesis
  }, [])

  // Auto-scroll interview chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation, interviewReply])

  // ── Text-to-speech ────────────────────────────────────────────────────────
  const speak = useCallback((text: string) => {
    if (!synthRef.current) return
    synthRef.current.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.rate  = 0.92
    utt.pitch = 1.05
    utt.volume = 1
    // Prefer a natural voice
    const voices = synthRef.current.getVoices()
    const preferred = voices.find(v =>
      v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha")
    ) || voices[0]
    if (preferred) utt.voice = preferred
    utt.onstart = () => setIsSpeaking(true)
    utt.onend   = () => setIsSpeaking(false)
    synthRef.current.speak(utt)
  }, [])

  // ── Start recognition ─────────────────────────────────────────────────────
  const startRecording = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return

    const rec = new SR()
    recognitionRef.current = rec
    rec.continuous       = true
    rec.interimResults   = true
    rec.lang             = "en-IN"
    rec.maxAlternatives  = 1

    rec.onresult = (e: any) => {
      let final = ""
      let int   = ""
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + " "
        else int += e.results[i][0].transcript
      }
      if (final) setTranscript(prev => prev + final)
      setInterim(int)
    }

    rec.onerror = (e: any) => {
      if (e.error !== "aborted") setError("Mic error: " + e.error)
      setStage("ready")
    }

    rec.onend = () => setInterim("")
    rec.start()
    setStage("recording")
    setTranscript("")
    setInterim("")
    setError("")
  }, [])

  // ── Stop recording ────────────────────────────────────────────────────────
  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop()
    setStage("processing")
  }, [])

  // ── Fetch a question ──────────────────────────────────────────────────────
  const fetchQuestion = useCallback(async (sc: Scenario) => {
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch("/api/student/voice-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "get-question", scenario: sc }),
      })
      const data = await res.json()
      const q = data.question || "Tell me about yourself."
      setQuestion(q)
      setStage("ready")
      // Read question aloud
      setTimeout(() => speak(q), 400)
    } catch {
      setError("Could not load question. Check your connection.")
      setStage("ready")
    } finally {
      setIsLoading(false)
    }
  }, [speak])

  // ── Analyse practice answer ───────────────────────────────────────────────
  useEffect(() => {
    if (stage !== "processing" || mode !== "practice") return
    const text = transcript.trim()
    if (!text) { setError("No speech detected. Try again."); setStage("ready"); return }

    ;(async () => {
      setIsLoading(true)
      setError("")
      try {
        const res = await fetch("/api/student/voice-coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: "practice", scenario, question, userSpeech: text }),
        })
        const fb: Feedback = await res.json()
        setFeedback(fb)
        setSessionScore(prev => [...prev, fb.overallScore])
        setStage("feedback")
        speak(fb.encouragement)
      } catch {
        setError("Analysis failed. Please try again.")
        setStage("ready")
      } finally {
        setIsLoading(false)
      }
    })()
  }, [stage])

  // ── Send interview reply ──────────────────────────────────────────────────
  useEffect(() => {
    if (stage !== "processing" || mode !== "interview") return
    const text = transcript.trim()
    if (!text) { setError("No speech detected. Try again."); setStage("interview"); return }

    const newConv: ConvMessage[] = [...conversation, { role: "user", content: text }]
    setConversation(newConv)

    ;(async () => {
      setIsLoading(true)
      try {
        const res = await fetch("/api/student/voice-coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "interview",
            scenario,
            userSpeech: text,
            conversationHistory: newConv.map(m => ({ role: m.role, content: m.content })),
          }),
        })
        const data = await res.json()
        const reply = data.reply || "Interesting. Tell me more."
        setConversation(prev => [...prev, { role: "assistant", content: reply }])
        setInterviewReply(reply)
        setStage("interview")
        speak(reply)
      } catch {
        setError("Network error. Try again.")
        setStage("interview")
      } finally {
        setIsLoading(false)
      }
    })()
  }, [stage, mode])

  // ── Scenario select ───────────────────────────────────────────────────────
  const selectScenario = (sc: Scenario) => {
    setScenario(sc)
    setStage("ready")
    setFeedback(null)
    setTranscript("")
    setConversation([])
    setSessionScore([])
    setError("")
    if (mode === "practice") fetchQuestion(sc)
    else {
      setQuestion("Let's start your mock interview. Say 'Hello, I'm ready.' to begin.")
      speak("Let's start your mock interview. Introduce yourself to get started.")
      setStage("interview")
    }
  }

  // ── Reset ─────────────────────────────────────────────────────────────────
  const reset = () => {
    synthRef.current?.cancel()
    recognitionRef.current?.stop()
    setStage("select")
    setScenario(null)
    setFeedback(null)
    setTranscript("")
    setInterim("")
    setConversation([])
    setQuestion("")
    setError("")
    setSessionScore([])
  }

  // ── Next question (practice mode) ─────────────────────────────────────────
  const nextQuestion = () => {
    setFeedback(null)
    setTranscript("")
    setStage("ready")
    if (scenario) fetchQuestion(scenario)
  }

  // ── avg session score ─────────────────────────────────────────────────────
  const avgScore = sessionScore.length
    ? Math.round(sessionScore.reduce((a, b) => a + b, 0) / sessionScore.length)
    : null

  const scenarioMeta = scenario ? SCENARIOS.find(s => s.id === scenario)! : null

  // ── Not supported ─────────────────────────────────────────────────────────
  if (!supported) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
          <MicOff className="h-8 w-8 text-red-400" />
        </div>
        <p className="font-bold text-lg text-foreground">Speech Recognition Not Supported</p>
        <p className="text-sm text-muted-foreground max-w-sm">
          Your browser doesn't support the Web Speech API. Please use Chrome or Edge for the voice coach.
        </p>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STAGE: select scenario
  // ─────────────────────────────────────────────────────────────────────────
  if (stage === "select") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-2xl p-5 flex items-center gap-4"
          style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)" }}>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15">
            <Mic className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <p className="font-bold text-foreground">AI Voice Coach</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Speak naturally — the AI listens, scores, and coaches you on grammar, fluency, content & confidence.
            </p>
          </div>
        </div>

        {/* Mode toggle */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">Choose mode</p>
          <div className="flex gap-3">
            {(["practice", "interview"] as Mode[]).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold border transition-all"
                style={mode === m
                  ? { background: "rgba(16,185,129,0.12)", borderColor: "rgba(16,185,129,0.4)", color: "#10b981" }
                  : { background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "var(--muted-foreground)" }}>
                {m === "practice" ? "🎯 Practice & Feedback" : "🎤 Mock Interview"}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {mode === "practice"
              ? "Answer a question, get instant AI feedback on grammar, fluency, content and confidence."
              : "Have a real back-and-forth mock interview. The AI plays the interviewer."}
          </p>
        </div>

        {/* Scenario cards */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">Choose a scenario</p>
          <div className="grid grid-cols-2 gap-3">
            {SCENARIOS.map(sc => (
              <button key={sc.id} onClick={() => selectScenario(sc.id)}
                className="group rounded-2xl border p-4 text-left transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20 active:scale-[0.99]"
                style={{ borderColor: `${sc.color}25`, background: `${sc.color}06` }}>
                <span className="text-2xl">{sc.icon}</span>
                <p className="font-bold text-sm text-foreground mt-2">{sc.label}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{sc.desc}</p>
                <div className="flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color: sc.color }}>
                  Start <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="rounded-xl p-4 space-y-2"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tips for best results</p>
          {["Speak clearly in a quiet environment","Use complete sentences, not single words","Allow 1–2 seconds before starting to speak","Chrome or Edge works best for microphone access"].map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/60 shrink-0" />
              <p className="text-xs text-muted-foreground">{t}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STAGE: ready / recording / processing (Practice mode)
  // ─────────────────────────────────────────────────────────────────────────
  if ((stage === "ready" || stage === "recording" || stage === "processing") && mode === "practice") {
    return (
      <div className="space-y-5">
        {/* Header bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg text-sm"
              style={{ background: `${scenarioMeta!.color}20` }}>
              {scenarioMeta!.icon}
            </div>
            <span className="text-sm font-semibold text-foreground">{scenarioMeta!.label}</span>
          </div>
          <div className="flex items-center gap-2">
            {avgScore !== null && (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>
                Avg: {avgScore}
              </span>
            )}
            <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
              <RotateCcw className="h-3.5 w-3.5" /> Change
            </button>
          </div>
        </div>

        {/* Question card */}
        <div className="rounded-2xl p-5 space-y-3"
          style={{ background: "rgba(15,15,20,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Question</span>
            <button onClick={() => speak(question)} title="Read aloud"
              className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Volume2 className="h-3.5 w-3.5" />
              {isSpeaking ? "Speaking…" : "Read aloud"}
            </button>
          </div>
          {isLoading && !question
            ? <div className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin text-emerald-400" /><span className="text-sm text-muted-foreground">Getting question…</span></div>
            : <p className="text-base font-medium text-foreground leading-relaxed">{question}</p>
          }
        </div>

        {/* Transcript preview */}
        {(transcript || interim) && (
          <div className="rounded-xl p-4 min-h-[72px]"
            style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)" }}>
            <p className="text-xs font-semibold text-emerald-400 mb-1.5">Your answer (live transcript)</p>
            <p className="text-sm text-foreground leading-relaxed">
              {transcript}
              {interim && <span className="text-muted-foreground italic">{interim}</span>}
            </p>
          </div>
        )}

        {/* Mic button */}
        <div className="flex flex-col items-center gap-4 py-4">
          <Waveform active={stage === "recording"} />

          {stage === "recording" ? (
            <button onClick={stopRecording}
              className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-red-500 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all active:scale-95 shadow-lg shadow-red-500/20">
              <Square className="h-8 w-8 fill-current" />
            </button>
          ) : stage === "processing" ? (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-emerald-500/40 bg-emerald-500/5">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
            </div>
          ) : (
            <button onClick={startRecording} disabled={isLoading}
              className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-emerald-500 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
              <Mic className="h-8 w-8" />
            </button>
          )}

          <p className="text-sm text-muted-foreground text-center">
            {stage === "recording" ? "Tap to stop when done speaking" :
             stage === "processing" ? "Analysing your answer…" :
             "Tap the mic and start speaking"}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl p-3 text-sm"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Next question shortcut */}
        <button onClick={nextQuestion} disabled={stage === "recording" || stage === "processing" || isLoading}
          className="w-full py-2.5 rounded-xl text-xs font-semibold border border-white/8 text-muted-foreground hover:text-foreground hover:border-white/15 transition-all disabled:opacity-40">
          Skip — get a different question →
        </button>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STAGE: feedback (Practice mode)
  // ─────────────────────────────────────────────────────────────────────────
  if (stage === "feedback" && feedback) {
    const scoreColor = feedback.overallScore >= 80 ? "#10b981" : feedback.overallScore >= 60 ? "#f59e0b" : "#ef4444"
    const metrics = [
      { label: "Grammar",    score: feedback.grammar.score,    tip: feedback.grammar.tip,    color: "#3b82f6",  extra: feedback.grammar.issues.length > 0 ? `Issues: ${feedback.grammar.issues.slice(0,2).join(", ")}` : null },
      { label: "Fluency",    score: feedback.fluency.score,    tip: feedback.fluency.tip,    color: "#a855f7",  extra: feedback.fluency.fillerWords.length > 0 ? `Filler words: ${feedback.fluency.fillerWords.join(", ")}` : null },
      { label: "Content",    score: feedback.content.score,    tip: feedback.content.tip,    color: "#f59e0b",  extra: feedback.content.relevance },
      { label: "Confidence", score: feedback.confidence.score, tip: feedback.confidence.tip, color: "#10b981",  extra: feedback.confidence.observation },
    ]

    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-semibold text-foreground">AI Feedback</span>
          </div>
          <div className="flex items-center gap-2">
            {sessionScore.length > 1 && (
              <span className="text-xs text-muted-foreground">
                {sessionScore.length} answers · avg {avgScore}
              </span>
            )}
            <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Overall score */}
        <div className="rounded-2xl p-5 flex items-center gap-5"
          style={{ background: `${scoreColor}08`, border: `1px solid ${scoreColor}25` }}>
          <ScoreRing score={feedback.overallScore} color={scoreColor} size={72} />
          <div>
            <p className="text-lg font-black text-foreground">
              {feedback.overallScore >= 80 ? "Excellent!" : feedback.overallScore >= 60 ? "Good effort!" : "Keep practising!"}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed max-w-xs">{feedback.encouragement}</p>
          </div>
        </div>

        {/* 4 metric cards */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map(m => (
            <div key={m.label} className="rounded-xl p-4 space-y-2"
              style={{ background: "rgba(15,15,20,0.6)", border: `1px solid ${m.color}20` }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">{m.label}</span>
                <span className="text-lg font-black tabular-nums" style={{ color: m.color }}>{m.score}</span>
              </div>
              {/* Bar */}
              <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${m.score}%`, background: m.color }} />
              </div>
              {m.extra && <p className="text-[11px] text-muted-foreground leading-relaxed">{m.extra}</p>}
              <p className="text-[11px] leading-relaxed" style={{ color: m.color }}>💡 {m.tip}</p>
            </div>
          ))}
        </div>

        {/* Improved version */}
        <div className="rounded-xl p-4 space-y-2"
          style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.2)" }}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-blue-400">✨ Improved version</p>
            <button onClick={() => speak(feedback.improvedVersion)}
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
              <Volume2 className="h-3 w-3" /> Listen
            </button>
          </div>
          <p className="text-sm text-foreground leading-relaxed italic">{feedback.improvedVersion}</p>
        </div>

        {/* Your answer */}
        <div className="rounded-xl p-4 space-y-1"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs font-semibold text-muted-foreground">Your answer</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{transcript}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={nextQuestion}
            className="flex-1 h-11 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>
            Next Question <ArrowRight className="h-4 w-4" />
          </button>
          <button onClick={reset}
            className="h-11 px-4 rounded-xl border border-white/10 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STAGE: interview (Mock Interview mode)
  // ─────────────────────────────────────────────────────────────────────────
  if (stage === "interview" || (mode === "interview" && stage === "processing")) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg text-sm"
              style={{ background: `${scenarioMeta!.color}20` }}>
              {scenarioMeta!.icon}
            </div>
            <span className="text-sm font-semibold text-foreground">{scenarioMeta!.label} — Live Interview</span>
          </div>
          <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            <RotateCcw className="h-3.5 w-3.5" /> End
          </button>
        </div>

        {/* Chat window */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(10,10,15,0.8)", border: "1px solid rgba(255,255,255,0.07)", height: 320, overflowY: "auto" }}>
          <div className="p-4 space-y-3">
            {conversation.length === 0 && (
              <div className="flex items-center gap-2 py-4 justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                <span className="text-sm text-muted-foreground">Interviewer is ready…</span>
              </div>
            )}
            {conversation.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold
                  ${msg.role === "assistant" ? "bg-emerald-500/15 text-emerald-400" : "bg-white/10 text-foreground"}`}>
                  {msg.role === "assistant" ? "AI" : "You"}
                </div>
                <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed
                  ${msg.role === "assistant"
                    ? "bg-emerald-500/8 text-foreground border border-emerald-500/15"
                    : "bg-white/8 text-foreground border border-white/10"}`}>
                  {msg.content}
                  {msg.role === "assistant" && (
                    <button onClick={() => speak(msg.content)}
                      className="ml-2 inline-flex items-center gap-0.5 text-[10px] text-emerald-400/70 hover:text-emerald-400 transition-colors">
                      <Volume2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold">AI</div>
                <div className="rounded-xl px-3 py-2 bg-emerald-500/8 border border-emerald-500/15">
                  <div className="flex gap-1 items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Transcript preview */}
        {(transcript || interim) && stage === "recording" && (
          <div className="rounded-xl p-3"
            style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)" }}>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {transcript}
              <span className="text-muted-foreground/60 italic">{interim}</span>
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-xl p-3 text-sm"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Mic control */}
        <div className="flex flex-col items-center gap-3">
          <Waveform active={stage === "recording"} />

          {stage === "recording" ? (
            <button onClick={stopRecording}
              className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-red-500 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all active:scale-95">
              <Square className="h-6 w-6 fill-current" />
            </button>
          ) : stage === "processing" ? (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-emerald-500/40 bg-emerald-500/5">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
            </div>
          ) : (
            <button onClick={() => { setTranscript(""); startRecording() }} disabled={isLoading}
              className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-emerald-500 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all active:scale-95 disabled:opacity-50">
              <Mic className="h-6 w-6" />
            </button>
          )}

          <p className="text-xs text-muted-foreground">
            {stage === "recording" ? "Tap to send your answer" :
             stage === "processing" ? "Sending…" :
             isSpeaking ? "Interviewer is speaking…" : "Tap the mic to respond"}
          </p>
        </div>
      </div>
    )
  }

  return null
}
