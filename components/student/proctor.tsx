"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { AlertCircle, Camera, Maximize2, Shield, X, UserX } from "lucide-react"

export interface ViolationLog {
  tabSwitches:      number
  fullscreenExits:  number
  copyAttempts:     number
  pasteAttempts:    number
  cameraViolations: number
}

type TerminationReason =
  | "tab_switch"
  | "fullscreen_exit"
  | "copy"
  | "paste"
  | "devtools"
  | "rightclick"
  | "shortcut"
  | "no_face"

const TERMINATION_MESSAGES: Record<TerminationReason, string> = {
  tab_switch:      "You switched tabs or left the window. Assessment terminated.",
  fullscreen_exit: "You exited fullscreen mode. Assessment terminated.",
  copy:            "Copy attempt detected. Assessment terminated.",
  paste:           "Paste attempt detected. Assessment terminated.",
  devtools:        "Developer Tools detected. Assessment terminated.",
  rightclick:      "Right-click is not allowed. Assessment terminated.",
  shortcut:        "Restricted keyboard shortcut detected. Assessment terminated.",
  no_face:         "Face not detected for too long. Assessment terminated.",
}

interface ProctoredShellProps {
  children:    React.ReactNode
  onViolation: (log: ViolationLog) => void
  companyName: string
  onAbort:     () => void
}

export function ProctoredShell({ children, onViolation, companyName, onAbort }: ProctoredShellProps) {
  const [started, setStarted]             = useState(false)
  const [cameraOk, setCameraOk]           = useState<boolean | null>(null)
  const [isFullscreen, setIsFullscreen]   = useState(false)
  const [terminated, setTerminated]       = useState<TerminationReason | null>(null)
  const [countdown, setCountdown]         = useState(5)   // seconds before auto-abort after termination

  const violations   = useRef<ViolationLog>({ tabSwitches: 0, fullscreenExits: 0, copyAttempts: 0, pasteAttempts: 0, cameraViolations: 0 })
  const videoRef     = useRef<HTMLVideoElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const streamRef    = useRef<MediaStream | null>(null)
  const fsTransition = useRef(false)
  const terminatedRef = useRef(false)

  // ── Terminate the exam ────────────────────────────────────────────────────
  const terminate = useCallback((reason: TerminationReason) => {
    if (terminatedRef.current) return
    terminatedRef.current = true

    // Record the violation
    if (reason === "tab_switch")      violations.current.tabSwitches++
    if (reason === "fullscreen_exit") violations.current.fullscreenExits++
    if (reason === "copy")            violations.current.copyAttempts++
    if (reason === "paste")           violations.current.pasteAttempts++
    if (reason === "no_face")         violations.current.cameraViolations++

    onViolation({ ...violations.current })
    setTerminated(reason)

    // Exit fullscreen if still in it
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    // Stop camera
    streamRef.current?.getTracks().forEach(t => t.stop())
  }, [onViolation])

  // ── Countdown after termination → auto-abort ─────────────────────────────
  useEffect(() => {
    if (!terminated) return
    if (countdown <= 0) { onAbort(); return }
    const id = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(id)
  }, [terminated, countdown, onAbort])

  // ── Fullscreen ────────────────────────────────────────────────────────────
  const enterFullscreen = useCallback(async () => {
    try {
      fsTransition.current = true
      await document.documentElement.requestFullscreen()
      setTimeout(() => { fsTransition.current = false }, 1200)
      setIsFullscreen(true)
    } catch {
      fsTransition.current = false
    }
  }, [])

  useEffect(() => {
    if (!started) return
    const onFsChange = () => {
      const inFs = !!document.fullscreenElement
      setIsFullscreen(inFs)
      if (!inFs && !fsTransition.current) terminate("fullscreen_exit")
    }
    document.addEventListener("fullscreenchange", onFsChange)
    return () => document.removeEventListener("fullscreenchange", onFsChange)
  }, [started, terminate])

  // ── Tab / window blur ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!started) return
    const onBlur = () => {
      if (fsTransition.current) return
      terminate("tab_switch")
    }
    window.addEventListener("blur", onBlur)
    return () => window.removeEventListener("blur", onBlur)
  }, [started, terminate])

  // ── Copy / Paste / Right-click / DevTools / Shortcuts ─────────────────────
  useEffect(() => {
    if (!started) return

    const onCopy  = (e: ClipboardEvent)  => { e.preventDefault(); terminate("copy") }
    const onPaste = (e: ClipboardEvent)  => { e.preventDefault(); terminate("paste") }
    const onCtx   = (e: MouseEvent)      => { e.preventDefault(); terminate("rightclick") }

    const onKey = (e: KeyboardEvent) => {
      // DevTools
      if (e.key === "F12" || (e.ctrlKey && e.shiftKey && ["i","j","c"].includes(e.key.toLowerCase()))) {
        e.preventDefault(); terminate("devtools"); return
      }
      // Ctrl/Cmd + C → copy
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
        e.preventDefault(); terminate("copy"); return
      }
      // Ctrl/Cmd + V → paste
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
        e.preventDefault(); terminate("paste"); return
      }
      // Ctrl/Cmd + A / U / S
      if ((e.ctrlKey || e.metaKey) && ["a","u","s"].includes(e.key.toLowerCase())) {
        e.preventDefault(); terminate("shortcut"); return
      }
    }

    document.addEventListener("copy",        onCopy)
    document.addEventListener("paste",       onPaste)
    document.addEventListener("contextmenu", onCtx)
    document.addEventListener("keydown",     onKey)
    return () => {
      document.removeEventListener("copy",        onCopy)
      document.removeEventListener("paste",       onPaste)
      document.removeEventListener("contextmenu", onCtx)
      document.removeEventListener("keydown",     onKey)
    }
  }, [started, terminate])

  // ── Camera + basic face detection ─────────────────────────────────────────
  const noFaceFrames = useRef(0)
  const faceCheckRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 160, height: 120 }, audio: false })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play() }
      setCameraOk(true)

      // Basic face detection: measure average brightness in center region
      // If center is very dark (no face) for 10+ consecutive checks → terminate
      faceCheckRef.current = setInterval(() => {
        const video  = videoRef.current
        const canvas = canvasRef.current
        if (!video || !canvas || video.readyState < 2) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return
        canvas.width  = 40
        canvas.height = 30
        ctx.drawImage(video, 0, 0, 40, 30)

        // Sample center 20×15 pixels for average brightness
        const imageData = ctx.getImageData(10, 7, 20, 15)
        const data = imageData.data
        let brightness = 0
        for (let i = 0; i < data.length; i += 4) {
          brightness += (data[i] * 0.299 + data[i+1] * 0.587 + data[i+2] * 0.114)
        }
        brightness /= (data.length / 4)

        // If brightness < 15 (nearly black = no face / covered camera)
        if (brightness < 15) {
          noFaceFrames.current++
          if (noFaceFrames.current >= 10) terminate("no_face")  // ~10s at 1s interval
        } else {
          noFaceFrames.current = 0
        }
      }, 1000)
    } catch {
      setCameraOk(false)
      // Camera denied — not a termination, just noted
    }
  }, [terminate])

  useEffect(() => {
    if (started) startCamera()
    return () => {
      if (faceCheckRef.current) clearInterval(faceCheckRef.current)
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [started, startCamera])

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (faceCheckRef.current) clearInterval(faceCheckRef.current)
      streamRef.current?.getTracks().forEach(t => t.stop())
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    }
  }, [])

  // ── PRE-START SCREEN ──────────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-lg rounded-2xl border border-primary/30 bg-card p-8 space-y-6 shadow-2xl">
          <div className="text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 mx-auto mb-4">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-2xl font-black text-foreground mb-2">Proctored Assessment</h2>
            <p className="text-sm text-muted-foreground">{companyName} — AI Hiring Simulation</p>
          </div>

          {/* Rules — each violation terminates the exam */}
          <div className="space-y-2.5 rounded-xl border border-border bg-muted/30 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              ⚠ Any violation immediately terminates your assessment
            </p>
            {[
              { icon: "🖥️", text: "Fullscreen is mandatory — exiting terminates the exam" },
              { icon: "🪟", text: "Tab switching or leaving the window terminates the exam" },
              { icon: "📋", text: "Copy & paste are fully disabled — violations terminate the exam" },
              { icon: "🖱️", text: "Right-click is disabled — using it terminates the exam" },
              { icon: "🔧", text: "DevTools (F12) is blocked — opening it terminates the exam" },
              { icon: "📷", text: "Camera is monitored — face must remain visible at all times" },
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="text-lg shrink-0 leading-none mt-0.5">{r.icon}</span>
                <span className="text-muted-foreground">{r.text}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-300 text-center font-semibold">
            There are no warnings. Any violation = immediate termination.
          </div>

          <div className="flex gap-3">
            <button onClick={onAbort}
              className="flex-1 h-11 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
              Cancel
            </button>
            <button
              onClick={async () => {
                setStarted(true)
                setTimeout(() => enterFullscreen(), 100)
              }}
              className="flex-1 h-11 rounded-xl font-bold text-white flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
              <Maximize2 className="h-4 w-4" /> I Understand, Start
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── TERMINATION SCREEN ────────────────────────────────────────────────────
  if (terminated) {
    return (
      <div className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center gap-6 px-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/15 border-2 border-red-500/40">
          <AlertCircle className="h-10 w-10 text-red-400" />
        </div>
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-black text-white mb-3">Assessment Terminated</h2>
          <p className="text-red-300 text-base font-semibold mb-2">{TERMINATION_MESSAGES[terminated]}</p>
          <p className="text-white/40 text-sm">Your integrity report has been recorded.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-center">
          <p className="text-white/60 text-sm">Returning to assessments in</p>
          <p className="text-5xl font-black text-white tabular-nums mt-1">{countdown}</p>
        </div>
        <button onClick={onAbort}
          className="text-sm text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5 mt-2">
          <X className="h-4 w-4" /> Go back now
        </button>
      </div>
    )
  }

  // ── ACTIVE PROCTORED SHELL ────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{ zIndex: 9999, userSelect: "none", backgroundColor: "#09090B", color: "#FAFAFA" }}
    >
      {/* Camera feed — bottom-right */}
      <div className="fixed bottom-4 right-4 z-[10001] rounded-xl overflow-hidden shadow-xl"
        style={{ width: 120, height: 90, border: "2px solid rgba(124,58,237,0.5)" }}>
        <video ref={videoRef} muted autoPlay playsInline
          className="w-full h-full object-cover" style={{ transform: "scaleX(-1)" }} />
        {/* Hidden canvas for face detection */}
        <canvas ref={canvasRef} className="hidden" />
        <div className="absolute bottom-1 left-1 flex items-center gap-1">
          <div className={`h-1.5 w-1.5 rounded-full ${cameraOk ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
          <span className="text-[8px] text-white/70 font-medium">{cameraOk === false ? "No cam" : "REC"}</span>
        </div>
        <Camera className="absolute top-1 right-1 h-3 w-3 text-white/50" />
      </div>

      {/* Proctor status bar — bottom-left */}
      <div className="fixed bottom-4 left-4 z-[10001] flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-background/90 backdrop-blur text-xs text-muted-foreground">
        <Shield className="h-3 w-3 text-primary" />
        <span>Proctored</span>
      </div>

      {/* Actual assessment content */}
      <div className="min-h-screen pb-24">
        {children}
      </div>
    </div>
  )
}
