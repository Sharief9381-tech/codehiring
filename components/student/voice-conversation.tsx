"use client"

/**
 * Voice Conversation — ChatGPT/Claude Voice style
 * Pure back-and-forth spoken conversation with an AI tutor.
 * No structured prompts. Just natural English conversation.
 * AI gently corrects grammar woven into its replies.
 */

import { useState, useEffect, useRef, useCallback } from "react"
import { Mic, MicOff, Square, Loader2, X, RotateCcw, Volume2, VolumeX } from "lucide-react"

interface Message { role: "user" | "assistant"; text: string; timestamp: number }

type VoiceState = "idle" | "listening" | "thinking" | "speaking"

// ── Orb colours per state ─────────────────────────────────────────────────────
const ORB: Record<VoiceState, { primary: string; glow: string; ring: string }> = {
  idle:      { primary: "#1e1e2e", glow: "rgba(99,102,241,0.15)",  ring: "rgba(99,102,241,0.35)"  },
  listening: { primary: "#0f1a12", glow: "rgba(16,185,129,0.35)",  ring: "rgba(16,185,129,0.6)"   },
  thinking:  { primary: "#1a120f", glow: "rgba(245,158,11,0.3)",   ring: "rgba(245,158,11,0.5)"   },
  speaking:  { primary: "#0f0f1a", glow: "rgba(139,92,246,0.35)",  ring: "rgba(139,92,246,0.6)"   },
}

const STATE_LABEL: Record<VoiceState, string> = {
  idle:      "Tap the orb to start speaking",
  listening: "Listening…",
  thinking:  "Thinking…",
  speaking:  "Speaking…",
}

// ── Pulse ring animation ──────────────────────────────────────────────────────
function PulseOrb({ state, onTap }: { state: VoiceState; onTap: () => void }) {
  const o = ORB[state]
  const active = state === "listening" || state === "speaking"

  return (
    <button
      onClick={onTap}
      className="relative flex items-center justify-center rounded-full transition-all duration-500 select-none focus:outline-none"
      style={{
        width: 160, height: 160,
        background: `radial-gradient(circle at 40% 35%, ${o.primary}ee, #080810)`,
        boxShadow: `0 0 60px 20px ${o.glow}, 0 0 0 2px ${o.ring}`,
      }}>

      {/* Outer pulse rings */}
      {active && (
        <>
          <span className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ background: o.ring, animationDuration: "1.4s" }} />
          <span className="absolute inset-0 rounded-full animate-ping opacity-10"
            style={{ background: o.ring, animationDuration: "2.1s", animationDelay: "0.4s" }} />
        </>
      )}

      {/* Inner waveform / icon */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        {state === "listening" && <WaveRings />}
        {state === "thinking"  && <Loader2 className="h-10 w-10 animate-spin" style={{ color: "#f59e0b" }} />}
        {state === "speaking"  && <SpeakerWave />}
        {state === "idle"      && <Mic className="h-10 w-10" style={{ color: "#a5b4fc" }} />}
      </div>
    </button>
  )
}

function WaveRings() {
  return (
    <div className="flex items-center gap-[4px]">
      {[...Array(7)].map((_, i) => (
        <div key={i}
          className="w-1 rounded-full"
          style={{
            background: "#10b981",
            height: `${12 + Math.sin(i * 0.9) * 10}px`,
            animation: `waveBar ${0.4 + i * 0.08}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.07}s`,
          }} />
      ))}
      <style>{`@keyframes waveBar { from{height:4px;opacity:0.5} to{height:28px;opacity:1} }`}</style>
    </div>
  )
}

function SpeakerWave() {
  return (
    <div className="flex items-center gap-[4px]">
      {[...Array(7)].map((_, i) => (
        <div key={i}
          className="w-1 rounded-full"
          style={{
            background: "#8b5cf6",
            height: `${8 + Math.sin((i + Date.now() / 200) * 1.2) * 10}px`,
            animation: `speakBar ${0.35 + i * 0.06}s ease-in-out infinite alternate`,
          }} />
      ))}
      <style>{`@keyframes speakBar { from{height:4px} to{height:24px} }`}</style>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function VoiceConversation({ onClose }: { onClose?: () => void }) {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle")
  const [messages, setMessages]     = useState<Message[]>([])
  const [transcript, setTranscript] = useState("")
  const [interim, setInterim]       = useState("")
  const [error, setError]           = useState("")
  const [supported, setSupported]   = useState(true)
  const [muted, setMuted]           = useState(false)
  const [sessionTime, setSessionTime] = useState(0)

  const recRef      = useRef<any>(null)
  const synthRef    = useRef<SpeechSynthesis | null>(null)
  const timerRef    = useRef<any>(null)
  const chatRef     = useRef<HTMLDivElement>(null)
  const isListening = useRef(false)

  // ── Setup ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!("SpeechRecognition" in window) && !("webkitSpeechRecognition" in window)) {
      setSupported(false); return
    }
    synthRef.current = window.speechSynthesis

    // Start session timer
    timerRef.current = setInterval(() => setSessionTime(t => t + 1), 1000)

    // Greet the user
    setTimeout(() => {
      const greeting = "Hi! I'm your English conversation partner. Just talk to me naturally — about anything you like. I'll chat with you and gently help with your English. Go ahead, say something!"
      addMessage("assistant", greeting)
      if (!muted) speakText(greeting)
    }, 800)

    return () => {
      clearInterval(timerRef.current)
      synthRef.current?.cancel()
      recRef.current?.stop()
    }
  }, [])

  // Auto-scroll chat
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  // ── TTS ───────────────────────────────────────────────────────────────────
  const speakText = useCallback((text: string) => {
    if (!synthRef.current || muted) return
    synthRef.current.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.rate = 0.93; utt.pitch = 1.05; utt.volume = 1; utt.lang = "en-GB"
    const voices = synthRef.current.getVoices()
    // Prefer a natural female/British voice
    const preferred = voices.find(v =>
      v.name.includes("Google UK") ||
      v.name.includes("Samantha") ||
      v.name.includes("Karen") ||
      v.name.includes("Moira") ||
      (v.lang === "en-GB" && !v.name.includes("("))
    ) || voices.find(v => v.lang.startsWith("en")) || voices[0]
    if (preferred) utt.voice = preferred
    utt.onstart = () => setVoiceState("speaking")
    utt.onend   = () => {
      setVoiceState("idle")
      // Auto-listen after speaking if not muted
      if (!muted) setTimeout(startListening, 600)
    }
    synthRef.current.speak(utt)
  }, [muted])

  const addMessage = (role: "user" | "assistant", text: string) => {
    setMessages(prev => [...prev, { role, text, timestamp: Date.now() }])
  }

  // ── Start listening ───────────────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (isListening.current) return
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return

    const rec = new SR()
    recRef.current = rec
    rec.continuous = true; rec.interimResults = true; rec.lang = "en-IN"
    rec.maxAlternatives = 1

    rec.onresult = (e: any) => {
      let final = "", int = ""
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript + " "
        else int += e.results[i][0].transcript
      }
      if (final) setTranscript(p => p + final)
      setInterim(int)
    }

    rec.onerror = (e: any) => {
      if (e.error !== "aborted" && e.error !== "no-speech") setError("Mic: " + e.error)
      isListening.current = false
      setVoiceState("idle")
    }

    rec.onend = () => { isListening.current = false }

    rec.start()
    isListening.current = true
    setVoiceState("listening")
    setTranscript(""); setInterim(""); setError("")
  }, [])

  // ── Stop & send ───────────────────────────────────────────────────────────
  const stopAndSend = useCallback(() => {
    recRef.current?.stop()
    isListening.current = false
  }, [])

  // Watch transcript — auto-send when user stops (500ms silence after final result)
  const sendTimer = useRef<any>(null)
  useEffect(() => {
    if (!transcript.trim()) return
    clearTimeout(sendTimer.current)
    sendTimer.current = setTimeout(() => {
      if (voiceState === "listening" && transcript.trim()) {
        stopAndSend()
        sendMessage(transcript.trim())
      }
    }, 1500) // 1.5s silence = done speaking
  }, [transcript])

  // ── Send to AI ────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return
    setTranscript(""); setInterim("")
    addMessage("user", text)
    setVoiceState("thinking")

    try {
      // Build conversation history (last 10 messages for context)
      const history = messages.slice(-10).map(m => ({ role: m.role, content: m.text }))

      const res = await fetch("/api/student/voice-conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userText: text, history }),
      })
      const data = await res.json()
      const reply = data.reply || "That's interesting! Tell me more."

      addMessage("assistant", reply)
      setVoiceState("idle")
      if (!muted) speakText(reply)
    } catch {
      const fallback = "Sorry, I didn't catch that. Could you try again?"
      addMessage("assistant", fallback)
      setVoiceState("idle")
      if (!muted) speakText(fallback)
    }
  }, [messages, muted, speakText])

  // ── Orb tap ───────────────────────────────────────────────────────────────
  const handleOrbTap = () => {
    if (voiceState === "speaking") {
      synthRef.current?.cancel()
      setVoiceState("idle")
      return
    }
    if (voiceState === "listening") {
      stopAndSend()
      if (transcript.trim()) sendMessage(transcript.trim())
      else setVoiceState("idle")
      return
    }
    if (voiceState === "idle") {
      startListening()
    }
  }

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`

  // ── Not supported ─────────────────────────────────────────────────────────
  if (!supported) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <MicOff className="h-12 w-12 text-red-400" />
        <p className="font-bold text-foreground">Speech not supported</p>
        <p className="text-sm text-muted-foreground">Use Chrome or Edge for voice conversations.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full" style={{ minHeight: "70vh" }}>

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-2 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-muted-foreground">Voice Conversation</span>
          <span className="text-xs text-muted-foreground">{formatTime(sessionTime)}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => {
            const newMuted = !muted
            setMuted(newMuted)
            if (newMuted) synthRef.current?.cancel()
          }} title={muted ? "Unmute" : "Mute AI voice"}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            style={{ background: "rgba(255,255,255,0.05)" }}>
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button onClick={() => {
            setMessages([])
            synthRef.current?.cancel()
            recRef.current?.stop()
            setVoiceState("idle")
            setTranscript("")
            setSessionTime(0)
          }} title="Clear conversation"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            style={{ background: "rgba(255,255,255,0.05)" }}>
            <RotateCcw className="h-4 w-4" />
          </button>
          {onClose && (
            <button onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              style={{ background: "rgba(255,255,255,0.05)" }}>
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Chat transcript ──────────────────────────────────────────────── */}
      <div ref={chatRef}
        className="flex-1 overflow-y-auto px-2 py-2 space-y-3 min-h-0"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            {/* Avatar */}
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold`}
              style={{
                background: msg.role === "assistant" ? "rgba(139,92,246,0.2)" : "rgba(99,102,241,0.2)",
                color: msg.role === "assistant" ? "#c4b5fd" : "#a5b4fc",
              }}>
              {msg.role === "assistant" ? "AI" : "You"}
            </div>
            {/* Bubble */}
            <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed`}
              style={{
                background: msg.role === "assistant"
                  ? "rgba(139,92,246,0.08)"
                  : "rgba(99,102,241,0.12)",
                border: `1px solid ${msg.role === "assistant" ? "rgba(139,92,246,0.2)" : "rgba(99,102,241,0.25)"}`,
                color: "var(--foreground)",
              }}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* Live transcript */}
        {(transcript || interim) && voiceState === "listening" && (
          <div className="flex gap-2 flex-row-reverse">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc" }}>You</div>
            <div className="max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
              style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", color: "var(--foreground)" }}>
              {transcript}
              {interim && <span className="text-muted-foreground italic"> {interim}</span>}
            </div>
          </div>
        )}

        {voiceState === "thinking" && (
          <div className="flex gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              style={{ background: "rgba(139,92,246,0.2)", color: "#c4b5fd" }}>AI</div>
            <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl"
              style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.15)" }}>
              {[0, 0.2, 0.4].map((d, i) => (
                <div key={i} className="h-2 w-2 rounded-full bg-purple-400 animate-bounce"
                  style={{ animationDelay: `${d}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Orb + status ────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-5 py-8 shrink-0">
        <PulseOrb state={voiceState} onTap={handleOrbTap} />

        <p className="text-sm font-medium text-muted-foreground text-center">
          {STATE_LABEL[voiceState]}
        </p>

        {voiceState === "idle" && messages.length > 1 && (
          <p className="text-[11px] text-muted-foreground">
            Tap orb to respond · AI will auto-listen after speaking
          </p>
        )}

        {error && (
          <p className="text-xs text-red-400 text-center max-w-xs">{error}</p>
        )}
      </div>

      {/* ── Hint chips ──────────────────────────────────────────────────── */}
      {voiceState === "idle" && messages.length <= 1 && (
        <div className="px-2 pb-4 flex flex-wrap gap-2 justify-center">
          {[
            "Tell me about your day",
            "What's your favourite movie?",
            "Describe your dream job",
            "What do you do on weekends?",
          ].map(chip => (
            <button key={chip}
              onClick={() => sendMessage(chip)}
              className="text-xs px-3 py-1.5 rounded-full transition-all hover:opacity-80"
              style={{ background: "rgba(99,102,241,0.1)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}>
              {chip}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
