"use client"

/**
 * Communication Practice Page
 * Fully standalone — no dependency on prep/page.tsx
 * Serves questions directly from COMMUNICATION_BANK
 */

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight, BookOpen, RotateCcw, Trophy } from "lucide-react"
import { COMMUNICATION_BANK } from "@/lib/communication-bank"
import type { CommQ } from "@/lib/communication-bank"

// ─── Types ────────────────────────────────────────────────────────────────────
interface MCQ {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
  topic: string
  passage?: string
}

// ─── Topic config ─────────────────────────────────────────────────────────────
const COMM_TOPICS = [
  { id: "reading-comprehension", name: "Reading Comprehension",    icon: "📰", color: "#f97316", bankTopic: "Reading Comprehension" },
  { id: "vocabulary",            name: "Vocabulary",               icon: "🔤", color: "#14b8a6", bankTopic: "Vocabulary" },
  { id: "grammar",               name: "Grammar",                  icon: "📖", color: "#3b82f6", bankTopic: "Grammar" },
  { id: "para-jumbles",          name: "Para Jumbles",             icon: "🔀", color: "#a855f7", bankTopic: "Para Jumbles" },
  { id: "cloze-test",            name: "Cloze Test",               icon: "📝", color: "#ef4444", bankTopic: "Cloze Test" },
  { id: "idioms-phrases",        name: "Idioms & Phrases",         icon: "💬", color: "#f59e0b", bankTopic: "Idioms & Phrases" },
  { id: "sentence-improvement",  name: "Sentence Improvement",     icon: "✏️", color: "#8b5cf6", bankTopic: "Sentence Improvement" },
  { id: "active-passive",        name: "Active & Passive Voice",   icon: "🔄", color: "#06b6d4", bankTopic: "Active & Passive Voice" },
  { id: "direct-indirect",       name: "Direct & Indirect Speech", icon: "📢", color: "#10b981", bankTopic: "Direct & Indirect Speech" },
]

const COMM_GUIDE: Record<string, string[]> = {
  "reading-comprehension": ["Read the questions before the passage","Identify the main idea in the first and last paragraphs","Inference questions — stay close to the text","Vocabulary-in-context: use surrounding words as clues","Eliminate options that are too extreme or off-topic"],
  "vocabulary":            ["Synonyms: choose the word closest in meaning","Antonyms: choose the word opposite in meaning","One-word substitution: match the definition exactly","Use prefix/suffix clues (mis-, un-, -tion, -ous)","Eliminate clearly wrong options first"],
  "grammar":               ["Articles: 'a' before consonant sounds, 'an' before vowel sounds","Prepositions follow fixed collocations","Avoid double negatives","Adjective vs adverb: adjectives modify nouns, adverbs modify verbs","Pronoun-antecedent agreement is essential"],
  "para-jumbles":          ["Find the opening sentence (general/introductory)","Link sentences using pronouns and connectors","Look for cause-effect and chronological clues","The last sentence often concludes or summarises","Practice with 4-sentence sets first"],
  "cloze-test":            ["Read the full passage before filling blanks","Look for contextual clues in surrounding sentences","Match part of speech (noun/verb/adjective)","Check for collocations and idioms","Eliminate options that break sentence flow"],
  "idioms-phrases":        ["Learn meaning in context, not literally","Common groups: body parts, colours, animals","Practice identifying tone (positive/negative)","Link phrases to real-life situations","Elimination strategy: rule out clearly wrong options"],
  "sentence-improvement":  ["Check subject-verb agreement carefully","Identify correct tense consistency","Spot redundant or misplaced words","Use articles (a/an/the) correctly","Watch for parallelism in lists"],
  "active-passive":        ["Present Simple: is/am/are + V3","Past Simple: was/were + V3","Present Continuous: is/am/are + being + V3","Modal verbs: modal + be + V3","Imperative: Let + object + be + V3"],
  "direct-indirect":       ["Tense shifts back one step in reported speech","'will' → 'would', 'can' → 'could', 'may' → 'might'","Time expressions: 'today' → 'that day', 'tomorrow' → 'the next day'","Questions use statement word order (no inversion)","Imperatives → 'asked/told + to-infinitive'"],
}

// ─── Quiz Component ───────────────────────────────────────────────────────────
function CommQuiz({ questions, topicName, onComplete, onBack }: {
  questions: MCQ[]
  topicName: string
  onComplete: (score: number, answers: number[], qs: MCQ[]) => void
  onBack: () => void
}) {
  const [cur, setCur] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState<number[]>([])

  const q = questions[cur]

  const choose = (i: number) => { if (!submitted) setSelected(i) }

  const submit = () => { if (selected !== null) setSubmitted(true) }

  const next = () => {
    const newAnswers = [...answers, selected ?? -1]
    if (cur + 1 < questions.length) {
      setAnswers(newAnswers)
      setCur(c => c + 1)
      setSelected(null)
      setSubmitted(false)
    } else {
      const correct = newAnswers.filter((a, i) => a === questions[i].correct).length
      onComplete(Math.round((correct / questions.length) * 100), newAnswers, questions)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "#09090b" }}>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <span className="text-muted-foreground">·</span>
          <span className="text-sm font-semibold text-foreground">{topicName} Practice</span>
        </div>

        <div className="space-y-5">
          {/* Progress */}
          <div className="flex items-center justify-between text-sm" style={{ color: "#A1A1AA" }}>
            <span>Question {cur + 1} of {questions.length}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
              style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa" }}>{q.topic}</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${((cur + 1) / questions.length) * 100}%`, background: "linear-gradient(90deg,#7c3aed,#6366f1)" }} />
          </div>

          {/* Passage */}
          {q.passage && (
            <div className="rounded-xl p-4" style={{ border: "1px solid rgba(249,115,22,0.25)", background: "rgba(249,115,22,0.05)" }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "#f97316" }}>📄 Read the Passage</p>
              <div className="max-h-48 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
                <p className="text-sm leading-relaxed" style={{ color: "#d4d4d8" }}>{q.passage}</p>
              </div>
            </div>
          )}

          {/* Question */}
          <div className="rounded-xl p-5" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(24,24,27,0.8)" }}>
            <p className="text-base font-medium leading-relaxed" style={{ color: "#FAFAFA" }}>{q.question}</p>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {q.options.map((opt, i) => {
              let style: React.CSSProperties = { border: "1px solid rgba(255,255,255,0.08)", background: "rgba(24,24,27,0.5)", cursor: "pointer" }
              if (submitted) {
                if (i === q.correct) style = { border: "1px solid #10b981", background: "rgba(16,185,129,0.10)", cursor: "default" }
                else if (i === selected && i !== q.correct) style = { border: "1px solid #ef4444", background: "rgba(239,68,68,0.10)", cursor: "default", opacity: 0.8 }
                else style = { border: "1px solid rgba(255,255,255,0.05)", background: "rgba(24,24,27,0.3)", cursor: "default", opacity: 0.45 }
              } else if (selected === i) {
                style = { border: "1px solid #7c3aed", background: "rgba(124,58,237,0.12)", cursor: "pointer" }
              }
              return (
                <button key={i} onClick={() => choose(i)}
                  className="w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left"
                  style={style}
                  onMouseEnter={e => { if (!submitted && selected !== i) e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)" }}
                  onMouseLeave={e => { if (!submitted && selected !== i) e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)" }}>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                    style={{ background: "rgba(255,255,255,0.06)", color: "#A1A1AA" }}>
                    {["A","B","C","D"][i]}
                  </span>
                  <span className="text-sm" style={{ color: "#FAFAFA" }}>{opt}</span>
                  {submitted && i === q.correct && <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto shrink-0" />}
                  {submitted && i === selected && i !== q.correct && <XCircle className="h-4 w-4 text-red-500 ml-auto shrink-0" />}
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {submitted && (
            <div className="rounded-xl p-4" style={{ border: "1px solid rgba(59,130,246,0.25)", background: "rgba(59,130,246,0.07)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#60a5fa" }}>Explanation</p>
              <p className="text-sm" style={{ color: "#A1A1AA" }}>{q.explanation}</p>
            </div>
          )}

          {/* Action button */}
          {!submitted ? (
            <button onClick={submit} disabled={selected === null}
              className="w-full h-11 rounded-xl font-semibold text-white disabled:opacity-40 transition-all"
              style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
              Submit Answer
            </button>
          ) : (
            <button onClick={next}
              className="w-full h-11 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
              {cur + 1 === questions.length ? "Finish & See Results" : "Next Question"}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Results Component ────────────────────────────────────────────────────────
function CommResults({ score, answers, questions, topicName, onRetry, onBack }: {
  score: number; answers: number[]; questions: MCQ[]
  topicName: string; onRetry: () => void; onBack: () => void
}) {
  const correct = answers.filter((a, i) => a === questions[i].correct).length
  const color = score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444"
  const label = score >= 80 ? "Excellent!" : score >= 50 ? "Good effort!" : "Keep practising!"

  return (
    <div className="min-h-screen" style={{ background: "#09090b" }}>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Topics
        </button>

        {/* Score card */}
        <div className="rounded-2xl p-8 text-center" style={{ border: `1px solid ${color}30`, background: `${color}08` }}>
          <Trophy className="h-10 w-10 mx-auto mb-3" style={{ color }} />
          <p className="text-4xl font-bold mb-1" style={{ color }}>{score}%</p>
          <p className="text-lg font-semibold text-foreground">{label}</p>
          <p className="text-sm text-muted-foreground mt-1">{correct} / {questions.length} correct · {topicName}</p>
        </div>

        {/* Question review */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">Review</p>
          {questions.map((q, i) => {
            const userAns = answers[i]
            const isCorrect = userAns === q.correct
            return (
              <div key={q.id} className="rounded-xl p-4 space-y-2"
                style={{ border: `1px solid ${isCorrect ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`, background: isCorrect ? "rgba(16,185,129,0.04)" : "rgba(239,68,68,0.04)" }}>
                <div className="flex items-start gap-2">
                  {isCorrect ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" /> : <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />}
                  <p className="text-sm text-foreground leading-relaxed">{q.question}</p>
                </div>
                {!isCorrect && (
                  <div className="pl-6 space-y-1">
                    <p className="text-xs text-red-400">Your answer: {q.options[userAns] ?? "Not answered"}</p>
                    <p className="text-xs text-emerald-400">Correct: {q.options[q.correct]}</p>
                    <p className="text-xs text-muted-foreground">{q.explanation}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <button onClick={onRetry}
          className="w-full h-11 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
          <RotateCcw className="h-4 w-4" /> Practice Again
        </button>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CommunicationPracticePage() {
  const router = useRouter()
  const [activeTopic, setActiveTopic] = useState<{ id: string; name: string; color: string } | null>(null)
  const [stage, setStage] = useState<"topics" | "quiz" | "results">("topics")
  const [questions, setQuestions] = useState<MCQ[]>([])
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [doneQs, setDoneQs] = useState<MCQ[]>([])

  const loadQuestions = (topicId: string, bankTopic: string) => {
    const seenKey = `comm_seen_${topicId}`
    const versionKey = `comm_seen_v_${topicId}`
    // bust old cache
    if (localStorage.getItem(versionKey) !== "2") {
      localStorage.removeItem(seenKey)
      localStorage.setItem(versionKey, "2")
    }
    let seenIds: string[] = []
    try { seenIds = JSON.parse(localStorage.getItem(seenKey) || "[]") } catch {}

    const all = COMMUNICATION_BANK.filter(q => q.topic === bankTopic)
    let pool = all.filter(q => !seenIds.includes(q.id))
    if (pool.length < 20) {
      seenIds = []
      localStorage.removeItem(seenKey)
      pool = all
    }

    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, 20)
    try { localStorage.setItem(seenKey, JSON.stringify([...seenIds, ...shuffled.map(q => q.id)])) } catch {}

    return shuffled.map((q, i) => ({
      id: i + 1,
      question: q.question,
      options: q.options,
      correct: q.correct,
      explanation: q.explanation,
      topic: q.topic,
      passage: (q as any).passage,
    }))
  }

  const startPractice = (topic: typeof COMM_TOPICS[0]) => {
    const qs = loadQuestions(topic.id, topic.bankTopic)
    setQuestions(qs)
    setActiveTopic({ id: topic.id, name: topic.name, color: topic.color })
    setStage("quiz")
  }

  const handleComplete = (s: number, ans: number[], qs: MCQ[]) => {
    setScore(s)
    setAnswers(ans)
    setDoneQs(qs)
    setStage("results")
  }

  const handleRetry = () => {
    if (!activeTopic) return
    const t = COMM_TOPICS.find(t => t.id === activeTopic.id)!
    const qs = loadQuestions(t.id, t.bankTopic)
    setQuestions(qs)
    setStage("quiz")
  }

  const handleBack = () => {
    setStage("topics")
    setActiveTopic(null)
  }

  // ── Quiz stage ──
  if (stage === "quiz" && activeTopic) {
    return <CommQuiz questions={questions} topicName={activeTopic.name} onComplete={handleComplete} onBack={handleBack} />
  }

  // ── Results stage ──
  if (stage === "results" && activeTopic) {
    return <CommResults score={score} answers={answers} questions={doneQs} topicName={activeTopic.name} onRetry={handleRetry} onBack={handleBack} />
  }

  // ── Topic selection ──
  return (
    <div className="min-h-screen" style={{ background: "#09090b" }}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Communication Practice</h1>
          <p className="text-sm text-muted-foreground mt-1">Select a topic to start practising · 20 questions per session</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {COMM_TOPICS.map(t => {
            const guide = COMM_GUIDE[t.id] || []
            return (
              <div key={t.id} className="group rounded-2xl border overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-black/20"
                style={{ borderColor: `${t.color}25`, background: "rgba(15,15,20,0.6)" }}>
                {/* Card header */}
                <div className="p-4 pb-3" style={{ background: `${t.color}08` }}>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl text-lg"
                      style={{ background: `${t.color}20`, color: t.color }}>
                      {t.icon}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground">{guide.length} key rules · 100 questions</p>
                    </div>
                  </div>
                </div>

                {/* Rules */}
                <div className="px-4 py-3 space-y-1.5">
                  {guide.map((point, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[10px] rounded px-1 py-0.5 font-bold shrink-0 mt-0.5"
                        style={{ background: `${t.color}20`, color: t.color }}>{i + 1}</span>
                      <p className="text-xs text-muted-foreground leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>

                {/* Practice button */}
                <div className="px-4 pb-4 pt-1">
                  <button onClick={() => startPractice(t)}
                    className="w-full h-9 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-1.5"
                    style={{ background: `linear-gradient(135deg,${t.color},${t.color}bb)` }}>
                    <BookOpen className="h-3.5 w-3.5" /> Practice {t.name} →
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
