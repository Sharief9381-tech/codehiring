"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { AlertCircle, Camera, Maximize2, Shield, X } from "lucide-react"

export interface ViolationLog {
  tabSwitches: number
  fullscreenExits: number
  copyAttempts: number
  pasteAttempts: number
  cameraViolations: number
}

interface ProctoredShellProps {
  children: React.ReactNode
  onViolation: (log: ViolationLog) => void
  companyName: string
  onAbort: () => void
}

export function ProctoredShell({ children, onViolation, companyName, onAbort }: ProctoredShellProps) {
  const [started, setStarted]       = useState(false)
  const [cameraOk, setCameraOk]     = useState<boolean | null>(null)
  const [warning, setWarning]       = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const violations  = useRef<ViolationLog>({ tabSwitches: 0, fullscreenExits: 0, copyAttempts: 0, pasteAttempts: 0, cameraViolations: 0 })
  const videoRef    = useRef<HTMLVideoElement>(null)
  const streamRef   = useRef<MediaStream | null>(null)
  const warnTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Suppress blur fires that happen during fullscreen transition
  const fsTransition = useRef(false)

  const showWarning = useCallback((msg: string) => {
    setWarning(msg)
    if (warnTimer.current) clearTimeout(warnTimer.current)
    warnTimer.current = setTimeout(() => setWarning(null), 3500)
  }, [])

  const reportViolation = useCallback(() => onViolation({ ...violations.current }), [onViolation])

  // ── Fullscreen ──
  const enterFullscreen = useCallback(async () => {
    try {
      fsTransition.current = true
      await document.documentElement.requestFullscreen()
      // Give browser time to complete FS transition before re-enabling blur detection
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
      if (!inFs && !fsTransition.current) {
        violations.current.fullscreenExits++
        showWarning("⚠️ You exited fullscreen! Return to fullscreen to continue.")
        reportViolation()
      }
    }
    document.addEventListener("fullscreenchange", onFsChange)
    return () => document.removeEventListener("fullscreenchange", onFsChange)
  }, [started, showWarning, reportViolation])

  // ── Tab / window blur — suppress during FS transition ──
  useEffect(() => {
    if (!started) return
    const onBlur = () => {
      if (fsTransition.current) return   // ← ignore blur during fullscreen entry
      violations.current.tabSwitches++
      showWarning("⚠️ Tab switch detected! This is recorded.")
      reportViolation()
    }
    window.addEventListener("blur", onBlur)
    return () => window.removeEventListener("blur", onBlur)
  }, [started, showWarning, reportViolation])

  // ── Copy / Paste / Right-click / DevTools ──
  useEffect(() => {
    if (!started) return
    const onCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      violations.current.copyAttempts++
      showWarning("⚠️ Copying is not allowed!")
      reportViolation()
    }
    const onPaste = (e: ClipboardEvent) => {
      e.preventDefault()
      violations.current.pasteAttempts++
      showWarning("⚠️ Pasting is not allowed!")
      reportViolation()
    }
    const onCtx = (e: MouseEvent) => {
      e.preventDefault()
      showWarning("⚠️ Right-click is disabled during the exam.")
    }
    const onKey = (e: KeyboardEvent) => {
      // Ctrl/Cmd + C/V/A/U/S
      if ((e.ctrlKey || e.metaKey) && ["c","v","a","u","s"].includes(e.key.toLowerCase())) {
        e.preventDefault()
        if (e.key.toLowerCase() === "c") { violations.current.copyAttempts++; showWarning("⚠️ Copying is not allowed!"); reportViolation() }
        if (e.key.toLowerCase() === "v") { violations.current.pasteAttempts++; showWarning("⚠️ Pasting is not allowed!"); reportViolation() }
      }
      // DevTools
      if (e.key === "F12" || (e.ctrlKey && e.shiftKey && ["i","j","c"].includes(e.key.toLowerCase()))) {
        e.preventDefault()
        showWarning("⚠️ DevTools is disabled during the exam.")
      }
    }
    document.addEventListener("copy", onCopy)
    document.addEventListener("paste", onPaste)
    document.addEventListener("contextmenu", onCtx)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("copy", onCopy)
      document.removeEventListener("paste", onPaste)
      document.removeEventListener("contextmenu", onCtx)
      document.removeEventListener("keydown", onKey)
    }
  }, [started, showWarning, reportViolation])

  // ── Camera ──
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 160, height: 120 }, audio: false })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play() }
      setCameraOk(true)
    } catch {
      setCameraOk(false)
    }
  }, [])

  useEffect(() => {
    if (started) startCamera()
    return () => { streamRef.current?.getTracks().forEach(t => t.stop()) }
  }, [started, startCamera])

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    }
  }, [])

  // ── PRE-START screen — shown BEFORE fullscreen, normal layout ──
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

          <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-5">
            {[
              { icon: "🖥️", text: "Full-screen mode will be enforced throughout the exam" },
              { icon: "📷", text: "Camera access required — your session is monitored" },
              { icon: "📋", text: "Copy and paste are disabled during the assessment" },
              { icon: "🔒", text: "Tab switching is detected and recorded" },
              { icon: "🖱️", text: "Right-click and DevTools are disabled" },
              { icon: "📊", text: "All violations are included in your AI report" },
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="text-lg shrink-0 leading-none mt-0.5">{r.icon}</span>
                <span className="text-muted-foreground">{r.text}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={onAbort}
              className="flex-1 h-11 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
              Cancel
            </button>
            <button
              onClick={async () => {
                setStarted(true)
                // Small delay so React renders the fullscreen shell before requesting FS
                setTimeout(() => enterFullscreen(), 100)
              }}
              className="flex-1 h-11 rounded-xl font-bold text-white flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
              <Maximize2 className="h-4 w-4" /> Accept & Start
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── ACTIVE PROCTORED SHELL ──
  // Uses fixed inset-0 with very high z-index to sit ABOVE the sidebar/navbar
  // Hardcoded dark colors — immune to light/dark theme switching
  return (
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{
        zIndex: 9999,
        userSelect: "none",
        backgroundColor: "#09090B",
        color: "#FAFAFA",
      }}
    >
      {/* Warning toast */}
      {warning && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[10001] flex items-center gap-3 px-5 py-3 rounded-xl border border-red-500/40 bg-red-500/90 backdrop-blur-xl text-sm font-semibold text-white shadow-2xl">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {warning}
        </div>
      )}

      {/* Fullscreen-required overlay — blocks content until back in FS */}
      {!isFullscreen && (
        <div className="fixed inset-0 z-[10000] bg-black/98 flex flex-col items-center justify-center gap-5">
          <AlertCircle className="h-16 w-16 text-red-400" />
          <h3 className="text-2xl font-black text-white">Fullscreen Required</h3>
          <p className="text-sm text-white/60 max-w-sm text-center">
            You exited fullscreen. The assessment is paused. Return to fullscreen to continue.
          </p>
          <button onClick={enterFullscreen}
            className="h-12 px-8 rounded-xl font-bold text-white flex items-center gap-2"
            style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
            <Maximize2 className="h-4 w-4" /> Return to Fullscreen
          </button>
          <button onClick={onAbort}
            className="text-sm text-white/30 hover:text-white/60 transition-colors flex items-center gap-1 mt-2">
            <X className="h-4 w-4" /> Exit Exam
          </button>
        </div>
      )}

      {/* Camera feed — bottom-right corner */}
      <div className="fixed bottom-4 right-4 z-[10001] rounded-xl overflow-hidden shadow-xl"
        style={{ width: 120, height: 90, border: "2px solid rgba(124,58,237,0.5)" }}>
        <video ref={videoRef} muted autoPlay playsInline
          className="w-full h-full object-cover" style={{ transform: "scaleX(-1)" }} />
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
        {violations.current.tabSwitches > 0 && (
          <span className="text-amber-400 font-semibold">· {violations.current.tabSwitches} switch{violations.current.tabSwitches > 1 ? "es" : ""}</span>
        )}
        {violations.current.copyAttempts > 0 && (
          <span className="text-red-400 font-semibold">· {violations.current.copyAttempts} copy</span>
        )}
      </div>

      {/* Actual assessment content */}
      <div className="min-h-screen pb-24">
        {children}
      </div>
    </div>
  )
}
