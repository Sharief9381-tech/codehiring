"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  Clock, ChevronRight, ChevronLeft, CheckCircle2,
  Loader2, AlertTriangle, Trophy, Code2, FileText, Target,
} from "lucide-react"

interface Answer { questionId: string; type: string; selectedOptionId?: string; code?: string; text?: string; timeTaken?: number }

const TYPE_ICONS: Record<string, any> = {
  mcq: Target, aptitude: Target, coding: Code2, sql: Code2,
  debugging: Code2, case_study: FileText,
}

function Timer({ totalSeconds, onExpire }: { totalSeconds: number; onExpire: () => void }) {
  const [remaining, setRemaining] = useState(totalSeconds)
  useEffect(() => {
    if (remaining <= 0) { onExpire(); return }
    const t = setInterval(() => setRemaining(r => { if (r <= 1) { clearInterval(t); onExpire(); return 0 } return r - 1 }), 1000)
    return () => clearInterval(t)
  }, [])
  const m = Math.floor(remaining / 60), s = remaining % 60
  const urgent = remaining < 300 // 5 min warning
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-bold tabular-nums ${
      urgent ? "border-red-500/30 bg-red-500/10 text-red-500" : "border-border bg-card text-foreground"}`}>
      <Clock className="h-3.5 w-3.5" />
      {String(m).padStart(2,"0")}:{String(s).padStart(2,"0")}
    </div>
  )
}

export function StudentAssessmentClient({ driveId }: { driveId: string }) {
  const router   = useRouter()
  const [step, setStep] = useState<"loading" | "intro" | "taking" | "submitted" | "error">("loading")
  const [assessment, setAssessment]   = useState<any>(null)
  const [drive, setDrive]             = useState<any>(null)
  const [answers, setAnswers]         = useState<Answer[]>([])
  const [currentSection, setCurrentSection] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [submitting, setSubmitting]   = useState(false)
  const [result, setResult]           = useState<any>(null)
  const startTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    Promise.all([
      fetch(`/api/drives/${driveId}`).then(r => r.ok ? r.json() : null),
      fetch(`/api/drives/${driveId}/assessment`).then(r => r.ok ? r.json() : null),
    ]).then(([driveData, asmtData]) => {
      if (!driveData?.drive || !asmtData?.assessment) { setStep("error"); return }
      setDrive(driveData.drive)
      setAssessment(asmtData.assessment)
      setStep("intro")
    }).catch(() => setStep("error"))
  }, [driveId])

  const allQuestions = assessment?.sections?.flatMap((s: any) =>
    s.questions.map((q: any) => ({ ...q, sectionName: s.name, sectionType: s.type }))
  ) ?? []

  const currentQ = allQuestions[currentSection * (assessment?.sections?.[currentSection]?.questions?.length ?? 0) + currentQuestion]
  // Better: flat index
  const flatIndex = assessment?.sections?.slice(0, currentSection).reduce((sum: number, s: any) => sum + s.questions.length, 0) + currentQuestion
  const totalQ = allQuestions.length

  function getAnswer(qId: string) { return answers.find(a => a.questionId === qId) }
  function setAnswer(qId: string, type: string, val: Partial<Answer>) {
    setAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === qId)
      const updated = { questionId: qId, type, ...val }
      if (existing >= 0) { const n = [...prev]; n[existing] = { ...n[existing], ...updated }; return n }
      return [...prev, updated]
    })
  }

  const handleSubmit = useCallback(async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/drives/${driveId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      })
      const data = await res.json()
      if (res.ok) { setResult(data); setStep("submitted") }
      else toast.error(data.error || "Submission failed")
    } catch { toast.error("Network error") }
    setSubmitting(false)
  }, [answers, driveId, submitting])

  const navigateQ = (dir: 1 | -1) => {
    const sections = assessment?.sections || []
    const currentSec = sections[currentSection]
    if (!currentSec) return
    const qCount = currentSec.questions.length
    if (dir === 1) {
      if (currentQuestion < qCount - 1) setCurrentQuestion(q => q + 1)
      else if (currentSection < sections.length - 1) { setCurrentSection(s => s + 1); setCurrentQuestion(0) }
    } else {
      if (currentQuestion > 0) setCurrentQuestion(q => q - 1)
      else if (currentSection > 0) {
        const prevSec = sections[currentSection - 1]
        setCurrentSection(s => s - 1)
        setCurrentQuestion(prevSec.questions.length - 1)
      }
    }
  }

  if (step === "loading") return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )

  if (step === "error") return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
        <p className="font-semibold text-foreground mb-2">Assessment not available</p>
        <p className="text-sm text-muted-foreground mb-4">This drive may not have an active assessment yet.</p>
        <Button onClick={() => router.push("/student/jobs")}>Back to Jobs</Button>
      </div>
    </div>
  )

  if (step === "submitted") return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full mx-4 rounded-2xl border border-border bg-card p-8 text-center">
        <Trophy className="h-16 w-16 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-foreground mb-2">Assessment Submitted!</h2>
        {result && (
          <>
            <div className="text-5xl font-black text-primary tabular-nums my-4">{result.score}%</div>
            <p className={`text-sm font-semibold mb-2 ${result.passed ? "text-emerald-500" : "text-red-500"}`}>
              {result.passed ? "✓ Passed" : "✗ Did not meet passing threshold"}
            </p>
          </>
        )}
        <p className="text-sm text-muted-foreground mb-6">{result?.message || "Your answers have been submitted. Results will be available shortly."}</p>
        <Button onClick={() => router.push("/student/jobs")} className="w-full">
          Back to Career Hub
        </Button>
      </motion.div>
    </div>
  )

  if (step === "intro") return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="max-w-lg w-full rounded-2xl border border-border bg-card p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-black text-foreground">{assessment.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{drive?.companyName} · {drive?.title}</p>
        </div>
        <div className="space-y-2 mb-6">
          {[
            { label: "Total Time",     val: `${assessment.totalTime} minutes` },
            { label: "Total Questions",val: `${totalQ} questions` },
            { label: "Passing Score",  val: `${assessment.passingScore}%` },
            { label: "Sections",       val: assessment.sections?.map((s: any) => s.name).join(", ") },
          ].map(({ label, val }) => (
            <div key={label} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-semibold text-foreground">{val}</span>
            </div>
          ))}
        </div>
        {assessment.instructions && (
          <div className="rounded-xl bg-muted/40 p-4 mb-6 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">Instructions</p>
            <p className="leading-relaxed">{assessment.instructions}</p>
          </div>
        )}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20 mb-6">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          <p className="text-xs text-muted-foreground">Once started, the timer cannot be paused. Ensure a stable internet connection.</p>
        </div>
        <Button onClick={() => { startTimeRef.current = Date.now(); setStep("taking") }} className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
          Start Assessment <ChevronRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  )

  // Assessment taking UI
  const sections = assessment.sections || []
  const sec = sections[currentSection]
  if (!sec) return null
  const q = sec.questions[currentQuestion]
  if (!q) return null
  const QIcon = TYPE_ICONS[q.type] || FileText
  const ans = getAnswer(q._id || q.title)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="sticky top-14 z-20 flex items-center justify-between px-4 py-3 bg-card/90 backdrop-blur-xl border-b border-border">
        <div className="flex items-center gap-3">
          <p className="text-sm font-bold text-foreground">{assessment.title}</p>
          <span className="text-xs text-muted-foreground">{sec.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{flatIndex + 1} / {totalQ}</span>
          <Timer totalSeconds={assessment.totalTime * 60} onExpire={handleSubmit} />
          <Button size="sm" onClick={handleSubmit} disabled={submitting}
            className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground">
            {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
            Submit
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Section navigator */}
        <div className="hidden md:flex flex-col gap-1 w-48 shrink-0 p-3 border-r border-border overflow-y-auto">
          {sections.map((s: any, si: number) => (
            <div key={si}>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1">{s.name}</p>
              {s.questions.map((_: any, qi: number) => {
                const qIdFlat = sections.slice(0, si).reduce((sum: number, sec2: any) => sum + sec2.questions.length, 0) + qi
                const answered = !!getAnswer(s.questions[qi]._id || s.questions[qi].title)
                const isCurrent = si === currentSection && qi === currentQuestion
                return (
                  <button key={qi} onClick={() => { setCurrentSection(si); setCurrentQuestion(qi) }}
                    className={`w-full text-left text-xs px-2 py-1.5 rounded-lg transition-all ${
                      isCurrent ? "bg-primary/15 text-primary font-bold" :
                      answered ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                      "text-muted-foreground hover:bg-muted"}`}>
                    Q{qIdFlat + 1} {answered ? "✓" : ""}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Question area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={`${currentSection}-${currentQuestion}`}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl mx-auto space-y-5">

              {/* Question header */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <QIcon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{q.type}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      q.difficulty === "hard" ? "bg-red-500/10 text-red-500" :
                      q.difficulty === "medium" ? "bg-amber-500/10 text-amber-500" :
                      "bg-emerald-500/10 text-emerald-500"}`}>{q.difficulty}</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">{q.points} pts</span>
                  </div>
                  <h3 className="text-base font-bold text-foreground">{q.title}</h3>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap mb-5">{q.description}</p>
                {q.context && <div className="rounded-xl bg-muted/40 p-4 mb-4 text-sm text-muted-foreground"><p className="font-semibold text-foreground mb-1">Context</p><p>{q.context}</p></div>}

                {/* MCQ / Aptitude */}
                {["mcq","aptitude"].includes(q.type) && q.options && (
                  <div className="space-y-2">
                    {q.options.map((opt: any) => (
                      <button key={opt.id} onClick={() => setAnswer(q._id || q.title, q.type, { selectedOptionId: opt.id })}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                          ans?.selectedOptionId === opt.id
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border hover:border-primary/40 hover:bg-muted/40 text-foreground"}`}>
                        <span className="font-bold mr-2 text-muted-foreground">{opt.id}.</span>{opt.text}
                      </button>
                    ))}
                  </div>
                )}

                {/* Coding / SQL / Debugging */}
                {["coding","sql","debugging"].includes(q.type) && (
                  <div>
                    {q.starterCode && (
                      <div className="rounded-xl bg-zinc-950 border border-white/8 p-4 mb-3 font-mono text-xs text-zinc-300 overflow-x-auto">
                        <p className="text-zinc-600 text-[10px] mb-2">// Starter code</p>
                        <pre>{q.starterCode}</pre>
                      </div>
                    )}
                    <textarea
                      className="w-full rounded-xl border border-border bg-zinc-950 text-zinc-100 font-mono text-sm p-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[200px]"
                      placeholder={q.type === "sql" ? "-- Write your SQL query here..." : "// Write your solution here..."}
                      value={ans?.code || ""}
                      onChange={e => setAnswer(q._id || q.title, q.type, { code: e.target.value })}
                    />
                    {q.testCases?.filter((tc: any) => !tc.isHidden).length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground">Sample Test Cases</p>
                        {q.testCases.filter((tc: any) => !tc.isHidden).map((tc: any, i: number) => (
                          <div key={i} className="rounded-xl bg-muted/30 border border-border p-3 font-mono text-xs">
                            <p className="text-muted-foreground">Input: <span className="text-foreground">{tc.input}</span></p>
                            <p className="text-muted-foreground">Expected: <span className="text-emerald-500">{tc.expectedOutput}</span></p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Case Study */}
                {q.type === "case_study" && (
                  <textarea
                    className="w-full rounded-xl border border-border bg-background text-foreground text-sm p-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[200px]"
                    placeholder="Write your analysis and solution here..."
                    value={ans?.text || ""}
                    onChange={e => setAnswer(q._id || q.title, q.type, { text: e.target.value })}
                  />
                )}
              </div>

              {/* Nav */}
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => navigateQ(-1)} disabled={flatIndex === 0} className="gap-1.5">
                  <ChevronLeft className="h-4 w-4" />Previous
                </Button>
                {flatIndex < totalQ - 1 ? (
                  <Button onClick={() => navigateQ(1)} className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground">
                    Next<ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={submitting}
                    className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    Submit Assessment
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
