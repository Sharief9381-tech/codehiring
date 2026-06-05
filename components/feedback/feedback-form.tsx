"use client"

import { useState } from "react"
import { Star, MessageSquare, ClipboardList, CheckCircle2, Loader2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ─── Specific questions definition ───────────────────────────────────────────

const SPECIFIC_QUESTIONS = [
  {
    id: "helped_job",
    question: "Did CodeHiring help you get a job or find a candidate?",
    options: ["Yes, directly", "Still in process", "Not yet", "Not applicable"],
  },
  {
    id: "platform_ease",
    question: "How easy was it to use the platform?",
    options: ["Very easy", "Easy", "Neutral", "Difficult"],
  },
  {
    id: "matching_quality",
    question: "How would you rate the job/candidate matching quality?",
    options: ["Excellent", "Good", "Average", "Poor"],
  },
  {
    id: "recommend",
    question: "Would you recommend CodeHiring to others?",
    options: ["Definitely yes", "Probably yes", "Probably not", "No"],
  },
]

// ─── Star Rating ─────────────────────────────────────────────────────────────

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
          aria-label={`${star} star`}
        >
          <Star
            className={cn(
              "h-7 w-7 transition-colors",
              (hovered || value) >= star
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/30"
            )}
          />
        </button>
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface FeedbackFormProps {
  onSuccess?: () => void
}

export function FeedbackForm({ onSuccess }: FeedbackFormProps) {
  const [activeType, setActiveType] = useState<"general" | "specific" | null>(null)

  // Type 1 state
  const [rating, setRating] = useState(0)
  const [text, setText] = useState("")

  // Type 2 state
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQ, setCurrentQ] = useState(0)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmitGeneral = async () => {
    setError("")
    if (rating === 0) { setError("Please select a star rating"); return }
    if (text.trim().length < 10) { setError("Please write at least 10 characters"); return }
    setLoading(true)
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "general", rating, text }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Failed to submit"); return }
      setSubmitted(true)
      onSuccess?.()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitSpecific = async () => {
    setError("")
    const answersArray = SPECIFIC_QUESTIONS.map((q) => ({
      question: q.question,
      answer: answers[q.id] ?? "",
    }))
    const unanswered = answersArray.filter((a) => !a.answer)
    if (unanswered.length > 0) { setError("Please answer all questions"); return }
    setLoading(true)
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "specific", answers: answersArray }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Failed to submit"); return }
      setSubmitted(true)
      onSuccess?.()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // ── Success ──
  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Thank you for your feedback!</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Your response has been submitted and is pending review. It may appear on our landing page once approved.
        </p>
      </div>
    )
  }

  // ── Type selection ──
  if (!activeType) {
    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-1">Share Your Feedback</h3>
          <p className="text-sm text-muted-foreground">Choose how you'd like to give feedback</p>
        </div>

        <button
          onClick={() => setActiveType("general")}
          className="w-full flex items-start gap-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all p-5 text-left group"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
            <MessageSquare className="h-5 w-5 text-amber-500" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
              Type 1 — General Experience
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Give an overall star rating and share your experience in your own words.
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground mt-1 shrink-0 group-hover:text-primary transition-colors" />
        </button>

        <button
          onClick={() => setActiveType("specific")}
          className="w-full flex items-start gap-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all p-5 text-left group"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
              Type 2 — Specific Questions
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Answer {SPECIFIC_QUESTIONS.length} targeted questions about your experience with CodeHiring.
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground mt-1 shrink-0 group-hover:text-primary transition-colors" />
        </button>
      </div>
    )
  }

  // ── Type 1: General ──
  if (activeType === "general") {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setActiveType(null)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">← Back</button>
          <h3 className="text-base font-semibold text-foreground">General Experience</h3>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground mb-3">Overall rating</p>
          <StarRating value={rating} onChange={setRating} />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Share your experience
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tell us how CodeHiring helped you — finding a job, hiring talent, or managing placements..."
            rows={4}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <p className="text-xs text-muted-foreground mt-1">{text.length} characters (minimum 10)</p>
        </div>

        {error && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}

        <Button onClick={handleSubmitGeneral} disabled={loading} className="w-full">
          {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</> : "Submit Feedback"}
        </Button>
      </div>
    )
  }

  // ── Type 2: Specific questions (one at a time) ──
  const q = SPECIFIC_QUESTIONS[currentQ]
  const isLast = currentQ === SPECIFIC_QUESTIONS.length - 1
  const allAnswered = SPECIFIC_QUESTIONS.every((q) => answers[q.id])

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => setActiveType(null)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">← Back</button>
        <h3 className="text-base font-semibold text-foreground">Specific Questions</h3>
        <span className="ml-auto text-xs text-muted-foreground">{currentQ + 1} / {SPECIFIC_QUESTIONS.length}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-secondary">
        <div
          className="h-1.5 rounded-full bg-primary transition-all duration-300"
          style={{ width: `${((currentQ + 1) / SPECIFIC_QUESTIONS.length) * 100}%` }}
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-foreground mb-4">{q.question}</p>
        <div className="grid grid-cols-2 gap-2">
          {q.options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                setAnswers((prev) => ({ ...prev, [q.id]: opt }))
                if (!isLast) setTimeout(() => setCurrentQ((c) => c + 1), 200)
              }}
              className={cn(
                "rounded-lg border px-3 py-2.5 text-sm font-medium transition-all text-left",
                answers[q.id] === opt
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        {currentQ > 0 && (
          <Button variant="outline" onClick={() => setCurrentQ((c) => c - 1)} className="flex-1">
            Previous
          </Button>
        )}
        {!isLast ? (
          <Button
            onClick={() => setCurrentQ((c) => c + 1)}
            disabled={!answers[q.id]}
            className="flex-1"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmitSpecific}
            disabled={loading || !allAnswered}
            className="flex-1"
          >
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</> : "Submit Answers"}
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}
    </div>
  )
}
