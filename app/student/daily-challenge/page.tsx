"use client"

import { useState, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import {
  ArrowLeft, Zap, CheckCircle2, RefreshCw, Play,
  Code2, ChevronRight, Lightbulb, AlertCircle, Trophy, Eye, EyeOff,
} from "lucide-react"

const LANGUAGES = ["Python", "JavaScript", "TypeScript", "Java", "C++", "C", "C#", "Go", "Kotlin", "Swift"]

const STARTERS: Record<string, string> = {
  Python:     "# Write your solution here\n\n\n",
  JavaScript: "// Write your solution here\n\n\n",
  TypeScript: "// Write your solution here\n\n\n",
  Java:       "public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n",
  "C++":      "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n",
  C:          "#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n",
  "C#":       "using System;\n\nclass Solution {\n    static void Main() {\n        // Write your solution here\n    }\n}\n",
  Go:         'package main\n\nimport "fmt"\n\nfunc main() {\n    // Write your solution here\n    fmt.Println()\n}\n',
  Kotlin:     "fun main() {\n    // Write your solution here\n}\n",
  Swift:      "// Write your solution here\nfunc solution() {\n    \n}\nsolution()\n",
}

interface EvalResult {
  correct: boolean
  score: number
  verdict: string
  feedback: string
  hint: string
  timeComplexity: string
  improvements: string[]
}

// ── Main export — wraps content in Suspense for useSearchParams ──────────────
export default function DailyChallengeEditorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center gap-2 text-muted-foreground">
        <RefreshCw className="h-5 w-5 animate-spin" /> Loading...
      </div>
    }>
      <EditorContent />
    </Suspense>
  )
}

// ── Editor content — uses useSearchParams so must be inside Suspense ─────────
function EditorContent() {
  const params      = useSearchParams()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isProject   = params.get("type") === "project"
  const challengeId = params.get("challengeId") ?? ""

  const problem = {
    title:            params.get("title")            ?? (isProject ? "Project Challenge" : "Today's Challenge"),
    desc:             params.get("desc")             ?? "",
    input:            params.get("input")            ?? "",
    output:           params.get("output")           ?? "",
    explain:          params.get("explain")          ?? "",
    problemStatement: params.get("problemStatement") ?? "",
    explanation:      params.get("explanation")      ?? "",
    badge:            params.get("badge")            ?? "",
  }

  const features = isProject && problem.explain
    ? problem.explain.split(",").map((f: string) => f.trim()).filter(Boolean)
    : []

  const [lang, setLang]               = useState("Python")
  const [code, setCode]               = useState(STARTERS["Python"])
  const [evaluating, setEvaluating]   = useState(false)
  const [running, setRunning]         = useState(false)
  const [result, setResult]           = useState<EvalResult | null>(null)
  const [runResults, setRunResults]   = useState<any[] | null>(null)
  const [runSummary, setRunSummary]   = useState("")
  const [allPassed, setAllPassed]     = useState(false)
  const [publicPassed, setPublicPassed] = useState(false)
  const [runMode, setRunMode]         = useState<"run"|"submit"|null>(null)
  const [error, setError]             = useState("")
  const [completed, setCompleted]     = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Tab") return
    e.preventDefault()
    const ta = textareaRef.current
    if (!ta) return
    const s = ta.selectionStart
    const newCode = code.substring(0, s) + "    " + code.substring(ta.selectionEnd)
    setCode(newCode)
    requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + 4 })
  }

  const changeLang = (l: string) => {
    setLang(l)
    setCode(STARTERS[l] ?? "// Write your solution here\n")
    setResult(null)
    setRunResults(null)
    setError("")
  }

  const runTests = async (mode: "run" | "submit") => {
    if (!code.trim()) return
    setRunning(true)
    setRunResults(null)
    setResult(null)
    setError("")
    try {
      const evalProblem = isProject
        ? { title: problem.title, desc: `Build: ${problem.desc}. Features: ${features.join(", ")}.`, input: "N/A", output: "Working project", explain: "" }
        : { title: problem.title, desc: problem.desc, input: problem.input, output: problem.output, explain: problem.explain }

      const res = await fetch("/api/student/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: lang, problem: evalProblem, mode }),
      })
      const data = await res.json()
      if (data.results) {
        setRunResults(data.results)
        setRunSummary(data.summary)
        setAllPassed(data.allPassed)
        setPublicPassed(data.publicPassed)
        setRunMode(mode)
        // If submit mode and all passed → award XP
        if (mode === "submit" && data.allPassed) {
          setCompleted(true)
          const action = isProject && challengeId
            ? { action: "complete-challenge", challengeId }
            : { action: "daily-challenge" }
          await fetch("/api/student/first-year-progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(action),
          })
        }
      } else {
        setError(data.error ?? "Failed to run tests")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setRunning(false)
    }
  }

  const evaluate = async () => {
    if (!code.trim()) return
    setEvaluating(true)
    setError("")
    setResult(null)
    try {
      const evalProblem = isProject
        ? {
            title:   problem.title,
            desc:    `Build: ${problem.desc}. Features: ${features.join(", ")}.`,
            input:   "Project implementation",
            output:  "Working project with all required features",
            explain: `Check if code implements: ${features.join(", ")}`,
          }
        : { title: problem.title, desc: problem.desc, input: problem.input, output: problem.output, explain: problem.explain }

      const res  = await fetch("/api/student/evaluate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: lang, problem: evalProblem }),
      })
      const data = await res.json()
      if (data.result) {
        setResult(data.result)
        if (data.result.correct || data.result.score >= 70) {
          setCompleted(true)
          const action = isProject && challengeId
            ? { action: "complete-challenge", challengeId }
            : { action: "daily-challenge" }
          await fetch("/api/student/first-year-progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(action),
          })
        }
      } else {
        setError(data.error ?? "Evaluation failed. Please try again.")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setEvaluating(false)
    }
  }

  const vs = (verdict: string) => {
    if (verdict === "Accepted") return { bg:"bg-emerald-500/10", border:"border-emerald-500/20", text:"text-emerald-400" }
    if (verdict === "Partial")  return { bg:"bg-amber-500/10",   border:"border-amber-500/20",   text:"text-amber-400"   }
    return                             { bg:"bg-red-500/10",      border:"border-red-500/20",      text:"text-red-400"     }
  }

  const bColor = problem.badge === "Beginner" ? "#10b981"
    : problem.badge === "Intermediate" ? "#f59e0b"
    : problem.badge === "Advanced"     ? "#ef4444"
    : "#7c3aed"

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/80 backdrop-blur sticky top-0 z-40">
        <a href="/student/learn#challenges"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </a>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isProject
            ? <Code2 className="h-4 w-4 text-primary shrink-0" />
            : <Zap   className="h-4 w-4 text-primary shrink-0" />}
          <p className="font-bold text-sm text-foreground truncate">{problem.title}</p>
          {problem.badge && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold border shrink-0"
              style={{ background:`${bColor}20`, color:bColor, borderColor:`${bColor}40` }}>
              {problem.badge}
            </span>
          )}
          {!isProject && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/20 font-bold shrink-0">Daily</span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <select value={lang} onChange={e => changeLang(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:border-primary/50">
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <button onClick={() => runTests("run")} disabled={running || evaluating || !code.trim()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border border-border text-foreground hover:border-primary/40 disabled:opacity-40 transition-all">
            {running && runMode === "run" ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {running && runMode === "run" ? "Running..." : "Run"}
          </button>
          <button onClick={() => runTests("submit")} disabled={running || evaluating || !code.trim() || completed || !publicPassed}
            title={!publicPassed ? "Run public test first" : "Run all hidden tests"}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-40 transition-all"
            style={{ background: completed ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
            {running && runMode === "submit"
              ? <><RefreshCw className="h-4 w-4 animate-spin" /> Testing...</>
              : completed
                ? <><CheckCircle2 className="h-4 w-4" /> Completed</>
                : <><Zap className="h-4 w-4" /> Submit</>}
          </button>
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-40 transition-all"
            style={{ background: completed
              ? "linear-gradient(135deg,#10b981,#059669)"
              : "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
            {completed    ? <><CheckCircle2 className="h-4 w-4" /> Completed</>
            : evaluating  ? <><RefreshCw className="h-4 w-4 animate-spin" /> Evaluating...</>
            :               <><Play className="h-4 w-4" /> Submit</>}
          </button>
        </div>
      </div>

      {/* Split */}
      <div className="flex flex-1 min-h-0 overflow-hidden flex-col lg:flex-row">
        {/* LEFT — problem */}
        <div className="w-full lg:w-[380px] lg:max-w-[380px] shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-card/30 overflow-y-auto p-5 space-y-4">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              {isProject ? "Project Brief" : "Problem"}
            </p>
            <h2 className="text-lg font-black text-foreground">{problem.title}</h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{problem.desc}</p>
          </div>

          {isProject ? (
            <div className="space-y-3">
              {problem.problemStatement && (
                <div className="rounded-xl border border-border bg-black/10 p-4 space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">What to Build</p>
                  <p className="text-xs text-foreground/90 leading-relaxed">{problem.problemStatement}</p>
                </div>
              )}
              {problem.explanation && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Key Concepts</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{problem.explanation}</p>
                </div>
              )}
              {features.length > 0 && (
                <div className="rounded-xl border border-border bg-black/10 p-4 space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Required Features</p>
                  {features.map((f: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-foreground">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-[9px] mt-0.5">{i+1}</span>
                      {f}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (problem.input || problem.output) ? (
            <div className="rounded-xl border border-border bg-black/20 p-4 space-y-2 font-mono text-xs">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Example</p>
              {problem.input  && <div><span className="text-blue-400 font-semibold">Input: </span><span className="text-foreground">{problem.input}</span></div>}
              {problem.output && <div><span className="text-emerald-400 font-semibold">Output: </span><span className="text-foreground">{problem.output}</span></div>}
              {problem.explain && <p className="text-muted-foreground text-[10px] pt-1 border-t border-border/50">{problem.explain}</p>}
            </div>
          ) : null}

          {/* Test Results from Run */}
          {runResults && (
            <div className="rounded-xl border border-border bg-black/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-foreground">Test Cases</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${allPassed ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                  {runSummary}
                </span>
              </div>
              <div className="space-y-2">
                {runResults.map((r: any, i: number) => (
                  <div key={i} className={`rounded-lg p-2.5 border text-xs space-y-1 ${r.passed ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-muted-foreground">
                        {r.isPublic ? "Test 1 (Public)" : `Test ${i + 1} (Hidden)`}
                      </span>
                      <span className={`font-bold ${r.passed ? "text-emerald-400" : "text-red-400"}`}>
                        {r.passed ? "✓ Passed" : "✗ Failed"}
                      </span>
                    </div>
                    {r.isPublic && (
                      <>
                        <p className="text-muted-foreground"><span className="text-blue-400">Input:</span> {r.input}</p>
                        <p className="text-muted-foreground"><span className="text-emerald-400">Expected:</span> {r.expectedOutput}</p>
                        {!r.passed && <p className="text-muted-foreground"><span className="text-red-400">Got:</span> {r.actualOutput}</p>}
                      </>
                    )}
                    {!r.isPublic && !r.passed && (
                      <p className="text-muted-foreground text-[10px]">Hidden test failed — check edge cases</p>
                    )}
                  </div>
                ))}
              </div>
              {allPassed && (
                <p className="text-[11px] text-emerald-400 font-semibold">All test cases passed! Click Submit to earn XP.</p>
              )}
            </div>
          )}

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
            <p className="text-[10px] font-bold text-amber-400 flex items-center gap-1.5"><Lightbulb className="h-3.5 w-3.5" /> Tips</p>
            {(isProject
              ? ["Start with the core feature first", "Test each feature as you build it", "Keep your code clean and readable"]
              : ["Read the example carefully before coding", "Handle edge cases (empty input, 0, negatives)", "Test with the example before submitting"]
            ).map((tip, i) => (
              <p key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                <ChevronRight className="h-3 w-3 shrink-0 mt-0.5 text-amber-400/60" />{tip}
              </p>
            ))}
          </div>

          {result && (() => {
            const s = vs(result.verdict)
            const pass = result.correct || result.score >= 70
            return (
              <div className={`rounded-xl border p-4 space-y-3 ${s.bg} ${s.border}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {pass
                      ? <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      : <AlertCircle  className="h-5 w-5 text-red-400" />}
                    <p className={`font-black text-base ${s.text}`}>{result.verdict}</p>
                  </div>
                  <span className={`text-xs font-bold ${s.text}`}>{result.score}/100</span>
                </div>
                {result.timeComplexity && <p className="text-[10px] text-muted-foreground">Complexity: {result.timeComplexity}</p>}
                <p className="text-xs text-foreground/90 leading-relaxed">{result.feedback}</p>

                {!pass && (
                  <>
                    {result.hint && (
                      <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2.5">
                        <p className="text-[10px] font-bold text-amber-400 mb-1">💡 Hint</p>
                        <p className="text-xs text-muted-foreground">{result.hint}</p>
                      </div>
                    )}
                    {result.improvements.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground mb-1">What to fix</p>
                        {result.improvements.map((imp, i) => (
                          <p key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                            <ChevronRight className="h-3 w-3 shrink-0 mt-0.5 opacity-60" />{imp}
                          </p>
                        ))}
                      </div>
                    )}
                    <button onClick={() => { setResult(null); setError("") }}
                      className="w-full py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground transition-all">
                      Fix and resubmit
                    </button>
                  </>
                )}

                {pass && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Trophy className="h-4 w-4" />
                      <p className="text-xs font-bold">
                        {isProject ? "Challenge complete — a new one is ready!" : "Streak updated! +10 XP"}
                      </p>
                    </div>
                    <a href="/student/learn#challenges"
                      className="w-full block text-center py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-semibold transition-all">
                      ← Back to Challenges
                    </a>
                  </div>
                )}
              </div>
            )
          })()}

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* RIGHT — code editor */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card/20">
            <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground font-medium">solution.{
              lang === "Python"     ? "py"    : lang === "JavaScript" ? "js"
              : lang === "TypeScript" ? "ts"  : lang === "Java"       ? "java"
              : lang === "C++"      ? "cpp"   : lang === "C"          ? "c"
              : lang === "C#"       ? "cs"    : lang === "Go"         ? "go"
              : lang === "Kotlin"   ? "kt"    : "swift"
            }</p>
            <span className="ml-auto text-[10px] text-muted-foreground">Tab = 4 spaces</span>
            <button onClick={() => { setCode(STARTERS[lang] ?? ""); setResult(null) }}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors ml-2">
              Reset
            </button>
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={e => { setCode(e.target.value); if (result && !completed) setResult(null) }}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            disabled={completed}
            className="flex-1 w-full resize-none bg-[#0d1117] text-[#e6edf3] font-mono text-sm p-5 focus:outline-none leading-relaxed disabled:opacity-60"
            style={{ minHeight: "400px", tabSize: 4 }}
            placeholder={`Write your ${lang} ${isProject ? "project" : "solution"} here...`}
          />
        </div>
      </div>
    </div>
  )
}
