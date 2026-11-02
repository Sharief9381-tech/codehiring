"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Mic, MicOff, Square, RotateCcw, Loader2, Volume2,
  ChevronRight, AlertCircle, CheckCircle2, ArrowRight,
  BookOpen, MessageSquare, Users, Star, Zap, TrendingUp,
} from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────
interface CommFeedback {
  overallScore: number
  grammar:       { score: number; issues: string[]; tip: string }
  vocabulary:    { score: number; richWords: string[]; tip: string }
  sentence:      { score: number; observation: string; tip: string }
  fluency:       { score: number; fillerWords: string[]; tip: string }
  pronunciation: { tip: string; wordsToImprove: string[] }
  improvedVersion: string
  encouragement: string
  nextLevelTip: string
}

type CScenario = "sentence-formation" | "vocabulary" | "gd-speaking" | "hr-softskills" | "pronunciation"
type CStage = "select" | "ready" | "recording" | "processing" | "feedback"
type Level = "Beginner" | "Intermediate" | "Advanced"

// ── Scenario metadata ─────────────────────────────────────────────────────────
const COMM_SCENARIOS: {
  id: CScenario; label: string; icon: string; color: string
  desc: string; levels: string[]
}[] = [
  {
    id: "sentence-formation",
    label: "Sentence Formation",
    icon: "✏️",
    color: "#6366f1",
    desc: "Speak grammatically correct sentences on given topics",
    levels: ["Simple sentences", "Compound sentences", "Complex structures"],
  },
  {
    id: "vocabulary",
    label: "Vocabulary in Speech",
    icon: "📚",
    color: "#8b5cf6",
    desc: "Use rich vocabulary — synonyms, antonyms, one-word substitutions",
    levels: ["Common words", "Placement vocabulary", "Advanced words"],
  },
  {
    id: "gd-speaking",
    label: "Group Discussion",
    icon: "👥",
    color: "#f59e0b",
    desc: "Express opinions clearly, give examples, counter-argue",
    levels: ["State opinions", "Give examples", "Counter-arguments"],
  },
  {
    id: "hr-softskills",
    label: "HR & Soft Skills",
    icon: "🤝",
    color: "#10b981",
    desc: "Introduce yourself, talk about strengths, handle HR questions",
    levels: ["Self introduction", "Strengths & weaknesses", "Career goals"],
  },
  {
    id: "pronunciation",
    label: "Pronunciation & Clarity",
    icon: "🔊",
    color: "#ef4444",
    desc: "Speak clearly, reduce filler words, improve clarity",
    levels: ["Clear speech", "Reduce fillers", "Natural flow"],
  },
]

// ── Level prompts for each scenario ──────────────────────────────────────────
const LEVEL_PROMPTS: Record<CScenario, Record<Level, string[]>> = {
  "sentence-formation": {
    Beginner: [
      "Describe what you did this morning in 3 sentences.",
      "Tell me about your hometown in simple sentences.",
      "Describe your college in 2-3 sentences.",
    ],
    Intermediate: [
      "Explain why teamwork is important using compound sentences.",
      "Describe a challenge you faced and how you overcame it.",
      "Talk about your favourite subject and why you chose it.",
    ],
    Advanced: [
      "Discuss the impact of technology on education using complex sentences.",
      "Explain the pros and cons of remote work in 5 sentences.",
      "Describe a situation where you showed leadership using varied sentence structures.",
    ],
  },
  "vocabulary": {
    Beginner: [
      "Use 3 synonyms for the word 'happy' in a sentence each.",
      "Describe your best friend using 5 different adjectives.",
      "Talk about your college using words like 'vibrant', 'dynamic', 'conducive'.",
    ],
    Intermediate: [
      "Use 'perseverance', 'resilience', and 'diligence' in sentences about your studies.",
      "Describe your career ambition using formal vocabulary.",
      "Use antonyms to compare two things — city life vs village life.",
    ],
    Advanced: [
      "Use 'proliferate', 'culminate', 'paradigm shift' in a discussion about AI.",
      "Describe a complex problem using precise technical vocabulary.",
      "Use one-word substitutions in a speech about environmental issues.",
    ],
  },
  "gd-speaking": {
    Beginner: [
      "Share your opinion on: 'Technology has made life easier.'",
      "Do you think online education is better than classroom education? Say why.",
      "Should students be given more freedom in choosing their subjects?",
    ],
    Intermediate: [
      "Discuss: 'Social media is doing more harm than good to today's youth.'",
      "Present both sides of: 'Work from home vs work from office.'",
      "Give 3 points supporting: 'Engineering students should learn soft skills.'",
    ],
    Advanced: [
      "Argue for or against: 'AI will replace most jobs in the next decade.'",
      "Discuss: 'Economic growth should take priority over environmental protection.'",
      "Counter this argument: 'Marks are the only measure of a student's ability.'",
    ],
  },
  "hr-softskills": {
    Beginner: [
      "Introduce yourself in 1 minute as if in an interview.",
      "Describe yourself using 3 key strengths.",
      "Tell me about your family and background.",
    ],
    Intermediate: [
      "What are your strengths and weaknesses? Give examples.",
      "Where do you see yourself in 5 years?",
      "Why should we hire you over other candidates?",
    ],
    Advanced: [
      "Describe a conflict situation and how you resolved it.",
      "How do you handle pressure and tight deadlines? Give a real example.",
      "Tell me about a time you showed leadership and what you learned from it.",
    ],
  },
  "pronunciation": {
    Beginner: [
      "Read and speak: 'The weather is pleasant today. I enjoy the cool breeze.'",
      "Say this clearly 3 times: 'She sells seashells by the seashore.'",
      "Introduce yourself without using 'um', 'uh', or 'like'.",
    ],
    Intermediate: [
      "Describe your daily routine without any filler words or pauses.",
      "Explain recursion in programming as clearly as possible.",
      "Speak for 30 seconds about any topic — focus on clear pronunciation.",
    ],
    Advanced: [
      "Deliver a 1-minute speech on climate change with natural pacing.",
      "Explain a technical project you worked on — focus on clarity and flow.",
      "Speak for 45 seconds on 'The role of AI in healthcare' without hesitation.",
    ],
  },
}

// ── Score ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score, color, size = 60 }: { score: number; color: string; size?: number }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={4} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={4}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease", transform: "rotate(-90deg)", transformOrigin: "50% 50%" }} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        fill={color} style={{ fontSize: size * 0.22, fontWeight: 700 }}>
        {score}
      </text>
    </svg>
  )
}

// ── Waveform ──────────────────────────────────────────────────────────────────
function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-[3px] h-8">
      {[...Array(14)].map((_, i) => (
        <div key={i} className="w-[3px] rounded-full"
          style={{
            background: active ? "#6366f1" : "rgba(255,255,255,0.12)",
            height: active ? `${14 + Math.sin(i * 0.9) * 10}px` : "5px",
            animation: active ? `wave ${0.5 + i * 0.06}s ease-in-out infinite alternate` : "none",
          }} />
      ))}
      <style>{`@keyframes wave { from{height:4px} to{height:28px} }`}</style>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export function CommunicationVoiceModel() {
  const [scenario, setScenario] = useState<CScenario | null>(null)
  const [level, setLevel]       = useState<Level>("Beginner")
  const [stage, setStage]       = useState<CStage>("select")
  const [prompt, setPrompt]     = useState("")
  const [transcript, setTranscript] = useState("")
  const [interim, setInterim]   = useState("")
  const [feedback, setFeedback] = useState<CommFeedback | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [error, setError]       = useState("")
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [supported, setSupported] = useState(true)
  const [sessionScores, setSessionScores] = useState<number[]>([])
  const [promptIdx, setPromptIdx] = useState(0)

  const recRef  = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!("SpeechRecognition" in window) && !("webkitSpeechRecognition" in window)) {
      setSupported(false)
    }
    synthRef.current = window.speechSynthesis
  }, [])

  // ── TTS ───────────────────────────────────────────────────────────────────
  const speak = useCallback((text: string) => {
    if (!synthRef.current) return
    synthRef.current.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.rate = 0.9; utt.pitch = 1.05; utt.volume = 1
    const voices = synthRef.current.getVoices()
    const v = voices.find(v => v.name.includes("Google") || v.name.includes("Natural") || v.lang === "en-GB") || voices[0]
    if (v) utt.voice = v
    utt.onstart = () => setIsSpeaking(true)
    utt.onend   = () => setIsSpeaking(false)
    synthRef.current.speak(utt)
  }, [])

  // ── Start recording ───────────────────────────────────────────────────────
  const startRecording = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    const rec = new SR()
    recRef.current = rec
    rec.continuous = true; rec.interimResults = true; rec.lang = "en-IN"
    rec.onresult = (e: any) => {
      let final = "", interim_ = ""
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + " "
        else interim_ += e.results[i][0].transcript
      }
      if (final) setTranscript(p => p + final)
      setInterim(interim_)
    }
    rec.onerror = (e: any) => { if (e.error !== "aborted") setError("Mic error: " + e.error); setStage("ready") }
    rec.onend = () => setInterim("")
    rec.start()
    setStage("recording")
    setTranscript(""); setInterim(""); setError("")
  }, [])

  // ── Stop recording ────────────────────────────────────────────────────────
  const stopRecording = useCallback(() => {
    recRef.current?.stop()
    setStage("processing")
  }, [])

  // ── Analyse speech ────────────────────────────────────────────────────────
  useEffect(() => {
    if (stage !== "processing") return
    const text = transcript.trim()
    if (!text) { setError("No speech detected. Tap the mic and speak."); setStage("ready"); return }

    ;(async () => {
      setLoading(true); setError("")
      try {
        const res = await fetch("/api/student/communication-voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scenario, level, prompt, userSpeech: text }),
        })
        const fb: CommFeedback = await res.json()
        setFeedback(fb)
        setSessionScores(p => [...p, fb.overallScore])
        setStage("feedback")
        setTimeout(() => speak(fb.encouragement), 300)
      } catch {
        setError("Analysis failed. Check your connection and try again.")
        setStage("ready")
      } finally { setLoading(false) }
    })()
  }, [stage])

  // ── Select scenario ───────────────────────────────────────────────────────
  const selectScenario = (sc: CScenario, lv: Level) => {
    const prompts = LEVEL_PROMPTS[sc][lv]
    const idx = Math.floor(Math.random() * prompts.length)
    setScenario(sc); setLevel(lv); setPromptIdx(idx)
    setPrompt(prompts[idx])
    setFeedback(null); setTranscript(""); setError("")
    setStage("ready")
    setTimeout(() => speak(prompts[idx]), 500)
  }

  // ── Next prompt ───────────────────────────────────────────────────────────
  const nextPrompt = () => {
    if (!scenario) return
    const prompts = LEVEL_PROMPTS[scenario][level]
    const next = (promptIdx + 1) % prompts.length
    setPromptIdx(next); setPrompt(prompts[next])
    setFeedback(null); setTranscript(""); setError(""); setStage("ready")
    setTimeout(() => speak(prompts[next]), 300)
  }

  // ── Level up ──────────────────────────────────────────────────────────────
  const levelUp = () => {
    if (!scenario) return
    const levels: Level[] = ["Beginner", "Intermediate", "Advanced"]
    const cur = levels.indexOf(level)
    const next = levels[Math.min(cur + 1, levels.length - 1)]
    selectScenario(scenario, next)
  }

  // ── Reset ─────────────────────────────────────────────────────────────────
  const reset = () => {
    synthRef.current?.cancel(); recRef.current?.stop()
    setScenario(null); setStage("select"); setFeedback(null)
    setTranscript(""); setInterim(""); setError(""); setSessionScores([])
  }

  const scenarioMeta = scenario ? COMM_SCENARIOS.find(s => s.id === scenario)! : null
  const avgScore = sessionScores.length
    ? Math.round(sessionScores.reduce((a, b) => a + b, 0) / sessionScores.length)
    : null
  const LEVEL_COLOR: Record<Level, string> = { Beginner: "#10b981", Intermediate: "#f59e0b", Advanced: "#ef4444" }

  // ── Not supported ─────────────────────────────────────────────────────────
  if (!supported) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <MicOff className="h-10 w-10 text-red-400" />
        <p className="font-bold text-foreground">Speech Recognition Not Supported</p>
        <p className="text-sm text-muted-foreground max-w-sm">
          Please use Chrome or Edge for voice features.
        </p>
      </div>
    )
  }

  // ── SELECT STAGE ──────────────────────────────────────────────────────────
  if (stage === "select") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-2xl p-5 flex items-start gap-4"
          style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)" }}>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
            style={{ background: "rgba(99,102,241,0.12)" }}>🎙️</div>
          <div>
            <p className="font-bold text-foreground">Communication Voice Model</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Speak — AI evaluates your grammar, vocabulary, sentence structure, fluency, and gives you an improved version.
            </p>
          </div>
        </div>

        {/* Scenario cards */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">Choose a scenario</p>
          <div className="space-y-3">
            {COMM_SCENARIOS.map(sc => (
              <div key={sc.id} className="rounded-2xl border overflow-hidden"
                style={{ borderColor: `${sc.color}25`, background: `${sc.color}05` }}>
                <div className="p-4 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{sc.icon}</span>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-foreground">{sc.label}</p>
                      <p className="text-xs text-muted-foreground">{sc.desc}</p>
                    </div>
                  </div>
                </div>
                {/* Level buttons */}
                <div className="flex gap-2 px-4 pb-4">
                  {(["Beginner", "Intermediate", "Advanced"] as Level[]).map(lv => (
                    <button key={lv} onClick={() => selectScenario(sc.id, lv)}
                      className="flex-1 py-2 rounded-xl text-[11px] font-bold transition-all hover:opacity-90 active:scale-95"
                      style={{ background: `${LEVEL_COLOR[lv]}15`, color: LEVEL_COLOR[lv], border: `1px solid ${LEVEL_COLOR[lv]}35` }}>
                      {lv}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="rounded-xl p-4 space-y-2"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">For best results</p>
          {[
            "Use Chrome or Edge — they have the best mic support",
            "Speak in a quiet place, clearly and at natural pace",
            "Start with Beginner, level up once you score above 75",
            "Focus on one skill at a time — don't rush",
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500/60 shrink-0 mt-1.5" />
              <p className="text-xs text-muted-foreground">{t}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── READY / RECORDING / PROCESSING ───────────────────────────────────────
  if (stage === "ready" || stage === "recording" || stage === "processing") {
    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{scenarioMeta!.icon}</span>
            <div>
              <p className="text-sm font-bold text-foreground">{scenarioMeta!.label}</p>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: `${LEVEL_COLOR[level]}15`, color: LEVEL_COLOR[level] }}>
                {level}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {avgScore !== null && (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc" }}>
                Avg: {avgScore}
              </span>
            )}
            <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <RotateCcw className="h-3 w-3" /> Change
            </button>
          </div>
        </div>

        {/* Prompt card */}
        <div className="rounded-2xl p-5"
          style={{ background: "rgba(15,15,20,0.8)", border: `1px solid ${scenarioMeta!.color}30` }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: scenarioMeta!.color }}>
              Your prompt
            </span>
            <button onClick={() => speak(prompt)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Volume2 className="h-3.5 w-3.5" />
              {isSpeaking ? "Speaking…" : "Read aloud"}
            </button>
          </div>
          <p className="text-base font-medium text-foreground leading-relaxed">{prompt}</p>
        </div>

        {/* Live transcript */}
        {(transcript || interim) && (
          <div className="rounded-xl p-4 min-h-[60px]"
            style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.2)" }}>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "#a5b4fc" }}>
              Live transcript
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {transcript}
              {interim && <span className="text-muted-foreground italic">{interim}</span>}
            </p>
          </div>
        )}

        {/* Mic */}
        <div className="flex flex-col items-center gap-4 py-3">
          <Waveform active={stage === "recording"} />
          {stage === "recording" ? (
            <button onClick={stopRecording}
              className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-red-500 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all active:scale-95 shadow-lg shadow-red-500/20">
              <Square className="h-8 w-8 fill-current" />
            </button>
          ) : stage === "processing" ? (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-indigo-500/40 bg-indigo-500/5">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
            </div>
          ) : (
            <button onClick={startRecording} disabled={isLoading}
              className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-indigo-500 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all active:scale-95 shadow-lg shadow-indigo-500/20 disabled:opacity-50">
              <Mic className="h-8 w-8" />
            </button>
          )}
          <p className="text-sm text-muted-foreground text-center">
            {stage === "recording" ? "Tap ■ to stop when done" :
             stage === "processing" ? "Analysing your speech…" :
             "Tap the mic and speak your answer"}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl p-3 text-sm"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        <button onClick={nextPrompt}
          disabled={stage === "recording" || stage === "processing"}
          className="w-full py-2 rounded-xl text-xs font-medium border border-white/8 text-muted-foreground hover:text-foreground transition-all disabled:opacity-40">
          Try a different prompt →
        </button>
      </div>
    )
  }

  // ── FEEDBACK ──────────────────────────────────────────────────────────────
  if (stage === "feedback" && feedback) {
    const sc = feedback.overallScore
    const scoreColor = sc >= 80 ? "#10b981" : sc >= 60 ? "#f59e0b" : "#ef4444"
    const canLevelUp = sc >= 75 && level !== "Advanced"

    const metrics = [
      { label: "Grammar",    score: feedback.grammar.score,    color: "#3b82f6", extra: feedback.grammar.issues.slice(0,2).join(", ") || null,                  tip: feedback.grammar.tip },
      { label: "Vocabulary", score: feedback.vocabulary.score, color: "#8b5cf6", extra: feedback.vocabulary.richWords.length ? `Rich words: ${feedback.vocabulary.richWords.join(", ")}` : null, tip: feedback.vocabulary.tip },
      { label: "Sentence",   score: feedback.sentence.score,   color: "#f59e0b", extra: feedback.sentence.observation,                                           tip: feedback.sentence.tip },
      { label: "Fluency",    score: feedback.fluency.score,    color: "#10b981", extra: feedback.fluency.fillerWords.length ? `Fillers: ${feedback.fluency.fillerWords.join(", ")}` : null, tip: feedback.fluency.tip },
    ]

    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground">AI Feedback</span>
          <div className="flex items-center gap-2">
            {sessionScores.length > 1 && (
              <span className="text-xs text-muted-foreground">{sessionScores.length} attempts · avg {avgScore}</span>
            )}
            <button onClick={reset} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>
        </div>

        {/* Overall score */}
        <div className="rounded-2xl p-5 flex items-center gap-5"
          style={{ background: `${scoreColor}08`, border: `1px solid ${scoreColor}25` }}>
          <ScoreRing score={sc} color={scoreColor} size={72} />
          <div className="flex-1">
            <p className="text-lg font-black text-foreground">
              {sc >= 80 ? "Excellent!" : sc >= 60 ? "Good effort!" : "Keep practising!"}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{feedback.encouragement}</p>
            {canLevelUp && (
              <button onClick={levelUp}
                className="mt-2 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all"
                style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }}>
                <TrendingUp className="h-3 w-3" /> Level Up to {level === "Beginner" ? "Intermediate" : "Advanced"} →
              </button>
            )}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map(m => (
            <div key={m.label} className="rounded-xl p-4 space-y-2"
              style={{ background: "rgba(15,15,20,0.6)", border: `1px solid ${m.color}20` }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">{m.label}</span>
                <span className="text-lg font-black" style={{ color: m.color }}>{m.score}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${m.score}%`, background: m.color }} />
              </div>
              {m.extra && <p className="text-[10px] text-muted-foreground truncate">{m.extra}</p>}
              <p className="text-[10px] leading-relaxed" style={{ color: m.color }}>💡 {m.tip}</p>
            </div>
          ))}
        </div>

        {/* Pronunciation tips */}
        {(feedback.pronunciation.tip || feedback.pronunciation.wordsToImprove.length > 0) && (
          <div className="rounded-xl p-4 space-y-1.5"
            style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <p className="text-xs font-bold" style={{ color: "#f87171" }}>🔊 Pronunciation</p>
            {feedback.pronunciation.wordsToImprove.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Words to practice: <span className="text-foreground font-medium">{feedback.pronunciation.wordsToImprove.join(", ")}</span>
              </p>
            )}
            <p className="text-xs text-muted-foreground">{feedback.pronunciation.tip}</p>
          </div>
        )}

        {/* Improved version */}
        <div className="rounded-xl p-4 space-y-2"
          style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.2)" }}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold" style={{ color: "#a5b4fc" }}>✨ Improved version</p>
            <button onClick={() => speak(feedback.improvedVersion)}
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              <Volume2 className="h-3 w-3" /> Listen
            </button>
          </div>
          <p className="text-sm text-foreground leading-relaxed italic">{feedback.improvedVersion}</p>
        </div>

        {/* Next level tip */}
        {feedback.nextLevelTip && (
          <div className="rounded-xl p-3 flex items-start gap-2"
            style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}>
            <Zap className="h-3.5 w-3.5 shrink-0 mt-0.5 text-yellow-400" />
            <p className="text-xs text-muted-foreground">{feedback.nextLevelTip}</p>
          </div>
        )}

        {/* Your answer */}
        <div className="rounded-xl p-4"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-[10px] font-semibold text-muted-foreground mb-1">Your answer</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{transcript}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={nextPrompt}
            className="flex-1 h-11 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
            Next Prompt <ArrowRight className="h-4 w-4" />
          </button>
          <button onClick={reset}
            className="h-11 px-4 rounded-xl border border-white/10 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  return null
}
