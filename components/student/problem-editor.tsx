"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { ArrowLeft, RefreshCw, Play, ChevronDown, Trophy, RotateCcw, Sun, Maximize2 } from "lucide-react"
import { TOPIC_QUESTIONS } from "@/lib/topic-questions"

// Build a flat problemId → {title, difficulty} map at module level
const PROBLEM_LOOKUP: Record<string, { title: string; difficulty: string }> = {}
for (const topic of TOPIC_QUESTIONS) {
  for (const q of topic.questions) {
    PROBLEM_LOOKUP[q.id] = { title: q.title, difficulty: q.difficulty }
  }
}

const LANGUAGES = ["Python", "JavaScript", "TypeScript", "Java", "C++", "C", "C#", "Go", "Kotlin", "Swift"]

const STARTERS: Record<string, string> = {
  Python:     "n = int(input())\n# Write your solution here\n",
  JavaScript: "const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');\n// Write your solution here\n",
  TypeScript: "const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');\n// Write your solution here\n",
  Java:       "import java.util.Scanner;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n    }\n}\n",
  "C++":      "#include <iostream>\nusing namespace std;\nint main() {\n    // Write your solution here\n    return 0;\n}\n",
  C:          "#include <stdio.h>\nint main() {\n    // Write your solution here\n    return 0;\n}\n",
  "C#":       "using System;\nclass Solution {\n    static void Main() {\n        // Write your solution here\n    }\n}\n",
  Go:         'package main\nimport "fmt"\nfunc main() {\n    // Write your solution here\n    fmt.Println()\n}\n',
  Kotlin:     "fun main() {\n    // Write your solution here\n}\n",
  Swift:      "// Write your solution here\n",
}

interface Props { problemId: string }

export default function ProblemEditor({ problemId }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load problem from sessionStorage, or fetch from API if not cached
  const [storedProblem, setStoredProblem] = useState<any>(null)
  useEffect(() => {
    if (!problemId) return
    try {
      const stored = sessionStorage.getItem(`problem_${problemId}`)
      if (stored) {
        const parsed = JSON.parse(stored)
        // If stored data has input2 field, use it; otherwise re-fetch
        if (parsed.input2 !== undefined) { setStoredProblem(parsed); return }
      }
    } catch {}
    // Not in sessionStorage or outdated — fetch from API
    fetch("/api/student/problem-detail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId }),
    }).then(r => r.json()).then(data => {
      if (data.problem) {
        setStoredProblem(data.problem)
        // Update sessionStorage with new data including input2
        try { sessionStorage.setItem(`problem_${problemId}`, JSON.stringify(data.problem)) } catch {}
      }
    }).catch(() => {})
  }, [problemId])

  const problem = {
    title:       storedProblem?.title        ?? PROBLEM_LOOKUP[problemId]?.title  ?? "Problem",
    desc:        storedProblem?.desc         ?? "",
    inputFormat: storedProblem?.inputFormat  ?? "",
    outputFormat:storedProblem?.outputFormat ?? "",
    constraints: storedProblem?.constraints  ?? [],
    input:       storedProblem?.input        ?? "",
    output:      storedProblem?.output       ?? "",
    explain:     storedProblem?.explain      ?? "",
    badge:       storedProblem?.badge        ?? PROBLEM_LOOKUP[problemId]?.difficulty ?? "Easy",
  }

  const inputFormat  = problem.inputFormat  || (problem.input  ? `A single line: ${problem.input}` : "")
  const outputFormat = problem.outputFormat || (problem.output ? `Print: ${problem.output}` : "")
  const constraints  = problem.constraints.length
    ? problem.constraints
    : ["Input is within reasonable bounds", "Time limit: 2s", "Memory: 256 MB"]

  const [lang, setLang]                 = useState("Python")
  const [code, setCode]                 = useState(STARTERS["Python"])
  const [running, setRunning]           = useState(false)
  const [submitting, setSubmitting]     = useState(false)
  const [runResults, setRunResults]     = useState<any[] | null>(null)
  const [publicPassed, setPublicPassed] = useState(false)
  const [allPassed, setAllPassed]       = useState(false)
  const [runtimeMs, setRuntimeMs]       = useState<number | null>(null)
  const [timeLimit, setTimeLimit]       = useState<number>(5000)
  const [error, setError]               = useState("")
  const [completed, setCompleted]       = useState(false)
  const [leftTab, setLeftTab]           = useState<"desc" | "subs">("desc")
  const [bottomTab, setBottomTab]       = useState<"sample" | "custom" | "results">("sample")
  const [selectedCase, setSelectedCase] = useState(0)
  const [customInput, setCustomInput]   = useState("")
  const [leftWidth, setLeftWidth]       = useState(380)
  const [bottomHeight, setBottomHeight] = useState(208)  // default ~h-52
  const dragging = useRef(false)
  const bottomDragging = useRef(false)

  const onDividerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    dragging.current = true
    const startX = e.clientX
    const startW = leftWidth
    const onMove = (ev: MouseEvent) => {
      if (!dragging.current) return
      const newW = Math.max(240, Math.min(600, startW + ev.clientX - startX))
      setLeftWidth(newW)
    }
    const onUp = () => {
      dragging.current = false
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }, [leftWidth])

  const onBottomDividerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    bottomDragging.current = true
    const startY = e.clientY
    const startH = bottomHeight
    const onMove = (ev: MouseEvent) => {
      if (!bottomDragging.current) return
      const delta = startY - ev.clientY  // drag up = bigger panel
      const newH  = Math.max(80, Math.min(500, startH + delta))
      setBottomHeight(newH)
    }
    const onUp = () => {
      bottomDragging.current = false
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }, [bottomHeight])

  // ── Smart editor keyboard handler ──────────────────────────────────────────
  const BRACE_LANGS = new Set(["JavaScript","TypeScript","Java","C++","C","C#","Go","Kotlin","Swift"])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = textareaRef.current
    if (!ta) return
    const { selectionStart: ss, selectionEnd: se } = ta
    const before = code.slice(0, ss)
    const after  = code.slice(se)
    const currentLine = before.slice(before.lastIndexOf("\n") + 1)

    if (e.key === "Enter") {
      if (lang === "Python") {
        e.preventDefault()
        const indent = currentLine.match(/^(\s*)/)?.[1] ?? ""
        const extraIndent = currentLine.trimEnd().endsWith(":") ? "    " : ""
        const insertion = "\n" + indent + extraIndent
        const next = before + insertion + after
        setCode(next)
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = ss + insertion.length })
        return
      }
      if (BRACE_LANGS.has(lang)) {
        const charBefore = before.slice(-1)
        const charAfter  = after.slice(0, 1)
        if (charBefore === "{" && charAfter === "}") {
          e.preventDefault()
          const indent  = currentLine.match(/^(\s*)/)?.[1] ?? ""
          const inner   = "\n" + indent + "    "
          const closing = "\n" + indent
          const next = before + inner + closing + "}" + after.slice(1)
          setCode(next)
          requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = ss + inner.length })
          return
        }
        e.preventDefault()
        const indent    = currentLine.match(/^(\s*)/)?.[1] ?? ""
        const insertion = "\n" + indent
        const next = before + insertion + after
        setCode(next)
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = ss + insertion.length })
        return
      }
      return
    }

    if (e.key === "Tab") {
      e.preventDefault()
      if (e.shiftKey) {
        const lineStart   = before.lastIndexOf("\n") + 1
        const lineContent = code.slice(lineStart)
        const spaces      = lineContent.match(/^( {1,4})/)?.[1] ?? ""
        if (spaces) {
          const next = code.slice(0, lineStart) + code.slice(lineStart + spaces.length)
          setCode(next)
          requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = Math.max(lineStart, ss - spaces.length) })
        }
      } else {
        const next = before + "    " + after
        setCode(next)
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = ss + 4 })
      }
      return
    }

    // Auto-close pairs (brace languages)
    if (BRACE_LANGS.has(lang)) {
      const PAIRS: Record<string, string> = { "{": "}", "(": ")", "[": "]", '"': '"', "'": "'" }
      if (e.key === "Backspace" && ss === se) {
        const prev = before.slice(-1)
        const next = after.slice(0, 1)
        if (prev && PAIRS[prev] === next) {
          e.preventDefault()
          setCode(before.slice(0, -1) + after.slice(1))
          requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = ss - 1 })
          return
        }
      }
      if (["}", ")", "]", '"', "'"].includes(e.key) && after.slice(0, 1) === e.key) {
        e.preventDefault()
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = ss + 1 })
        return
      }
      if (PAIRS[e.key]) {
        const isQuote = e.key === '"' || e.key === "'"
        if (isQuote && /\w/.test(before.slice(-1))) return
        e.preventDefault()
        const close = PAIRS[e.key]
        const next  = before + e.key + close + after
        setCode(next)
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = ss + 1 })
        return
      }
    }

    // Python auto-close pairs
    if (lang === "Python") {
      const PY_PAIRS: Record<string, string> = { "(": ")", "[": "]", '"': '"', "'": "'" }
      if (e.key === "Backspace" && ss === se) {
        const prev = before.slice(-1)
        const next = after.slice(0, 1)
        if (prev && PY_PAIRS[prev] === next) {
          e.preventDefault()
          setCode(before.slice(0, -1) + after.slice(1))
          requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = ss - 1 })
          return
        }
      }
      if ([")", "]", '"', "'"].includes(e.key) && after.slice(0, 1) === e.key) {
        e.preventDefault()
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = ss + 1 })
        return
      }
      if (PY_PAIRS[e.key]) {
        const isQuote = e.key === '"' || e.key === "'"
        if (isQuote && /\w/.test(before.slice(-1))) return
        e.preventDefault()
        const close = PY_PAIRS[e.key]
        const next  = before + e.key + close + after
        setCode(next)
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = ss + 1 })
        return
      }
    }
  }

  const changeLang = (l: string) => { setLang(l); setCode(STARTERS[l] ?? ""); setRunResults(null); setError("") }
  const evalProblem = { title: problem.title, desc: problem.desc, input: problem.input, output: problem.output, explain: problem.explain, input2: storedProblem?.input2, output2: storedProblem?.output2, input3: storedProblem?.input3, output3: storedProblem?.output3, input4: storedProblem?.input4, output4: storedProblem?.output4 }

  const runTests = async (mode: "run" | "submit") => {
    if (!code.trim()) return
    mode === "run" ? setRunning(true) : setSubmitting(true)
    setRunResults(null); setError(""); setBottomTab("results")
    try {
      const res  = await fetch("/api/student/run-code", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: lang, problem: evalProblem, mode }),
      })
      const data = await res.json()
      if (data.results) {
        setRunResults(data.results)
        setPublicPassed(data.publicPassed ?? false)
        setAllPassed(data.allPassed ?? false)
        if (data.runtimeMs) { setRuntimeMs(data.runtimeMs); setTimeLimit(data.timeLimit ?? 5000) }
        if (mode === "run") { setBottomTab("sample"); setSelectedCase(0) }
        if (mode === "submit" && data.allPassed) {
          setCompleted(true)
          await fetch("/api/student/first-year-progress", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "daily-challenge" }),
          })
        }
      } else {
        const msg   = data.error ?? "Failed to run tests"
        const setup = data.setup ? `\n${data.setup}` : ""
        setError(msg + setup)
      }
    } catch { setError("Network error. Please try again.") }
    finally { setRunning(false); setSubmitting(false) }
  }

  // Show loading while sessionStorage hydrates
  if (problemId && !storedProblem) {
    return (
      <div className="h-screen flex items-center justify-center gap-2" style={{ background: "#0d1117", color: "#8b949e" }}>
        <RefreshCw className="h-5 w-5 animate-spin" /> Loading problem...
      </div>
    )
  }

  const diffColor = problem.badge?.toLowerCase() === "easy"   || problem.badge === "Beginner"    ? "#3fb950"
    : problem.badge?.toLowerCase() === "medium" || problem.badge === "Intermediate" ? "#d29922"
    : "#f85149"

  const sampleCases = [
    { label: "Case 1", input: problem.input,  output: problem.output },
    { label: "Case 2", input: (storedProblem?.input2 ?? runResults?.[1]?.input ?? ""), output: (storedProblem?.output2 ?? runResults?.[1]?.expectedOutput ?? "") },
  ]

  const lines = code.split("\n")

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "#0d1117", fontFamily: "'Segoe UI',Inter,sans-serif" }}>

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="flex items-center px-4 h-11 border-b shrink-0" style={{ background: "#161b22", borderColor: "#30363d" }}>
        <a href="#" onClick={e => { e.preventDefault(); window.history.back() }}
          className="flex items-center gap-1.5 text-sm mr-4 transition-colors" style={{ color: "#8b949e" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#e6edf3")}
          onMouseLeave={e => (e.currentTarget.style.color = "#8b949e")}>
          <ArrowLeft className="h-4 w-4" />
        </a>
        <span className="font-bold text-sm mr-2" style={{ color: "#e6edf3" }}>
          {problem.title}
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full border"
          style={{ color: diffColor, borderColor: diffColor + "44", background: diffColor + "15" }}>
          {problem.badge}
        </span>
        <div className="ml-auto flex items-center gap-3" style={{ color: "#8b949e" }}>
          <span className="text-sm cursor-pointer hover:text-white transition-colors">⚙</span>
          <span className="text-sm cursor-pointer hover:text-white transition-colors">🔖</span>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">

        {/* LEFT — Problem description */}
        <div className="shrink-0 flex flex-col overflow-hidden border-r"
          style={{ width: `${leftWidth}px`, background: "#0d1117", borderColor: "#30363d" }}>
          {/* Tabs */}
          <div className="flex items-center border-b px-3 shrink-0"
            style={{ background: "#161b22", borderColor: "#30363d" }}>
            {[{ id: "desc", label: "Description", icon: "📄" }, { id: "subs", label: "Submissions", icon: "🕒" }].map(t => (
              <button key={t.id} onClick={() => setLeftTab(t.id as any)}
                className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors"
                style={{ borderColor: leftTab === t.id ? "#58a6ff" : "transparent", color: leftTab === t.id ? "#58a6ff" : "#8b949e" }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {leftTab === "desc" ? (
            <div className="flex-1 overflow-y-auto p-5 space-y-5" style={{ color: "#c9d1d9" }}>
              <div>
                <h1 className="text-xl font-black mb-2" style={{ color: "#e6edf3" }}>{problem.title}</h1>
                <p className="text-sm leading-relaxed" style={{ color: "#c9d1d9", lineHeight: "1.7" }}>{problem.desc}</p>
              </div>

              {inputFormat && (
                <div>
                  <p className="text-sm font-bold mb-1.5" style={{ color: "#e6edf3" }}>Input Format</p>
                  <div className="rounded-lg px-4 py-3 text-sm border"
                    style={{ background: "#161b22", borderColor: "#30363d", color: "#c9d1d9", lineHeight: "1.6" }}>
                    {inputFormat}
                  </div>
                </div>
              )}
              {outputFormat && (
                <div>
                  <p className="text-sm font-bold mb-1.5" style={{ color: "#e6edf3" }}>Output Format</p>
                  <div className="rounded-lg px-4 py-3 text-sm border"
                    style={{ background: "#161b22", borderColor: "#30363d", color: "#c9d1d9", lineHeight: "1.6" }}>
                    {outputFormat}
                  </div>
                </div>
              )}

              {problem.input && (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-bold mb-2" style={{ color: "#e6edf3" }}>Example 1:</p>
                    <div className="rounded-lg border p-4 space-y-2 text-sm"
                      style={{ background: "#161b22", borderColor: "#30363d" }}>
                      <div>
                        <span className="font-bold" style={{ color: "#e6edf3" }}>Input: </span>
                        <code className="font-mono" style={{ color: "#79c0ff" }}>{problem.input}</code>
                      </div>
                      {problem.output && (
                        <div>
                          <span className="font-bold" style={{ color: "#e6edf3" }}>Output: </span>
                          <code className="font-mono" style={{ color: "#3fb950" }}>{problem.output}</code>
                        </div>
                      )}
                      {problem.explain && (
                        <div>
                          <span className="font-bold" style={{ color: "#e6edf3" }}>Explanation: </span>
                          <span style={{ color: "#8b949e" }}>{problem.explain}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {constraints.length > 0 && (
                <div>
                  <p className="text-sm font-bold mb-2" style={{ color: "#e6edf3" }}>Constraints:</p>
                  <ul className="space-y-1">
                    {constraints.map((c: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <span style={{ color: "#58a6ff" }}>·</span>
                        <code className="font-mono text-sm" style={{ color: "#c9d1d9" }}>{c}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 p-5">
              <p className="text-sm" style={{ color: "#8b949e" }}>No submissions yet.</p>
            </div>
          )}
        </div>

        {/* RIGHT — Editor + Bottom */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Drag handle */}
          <div
            onMouseDown={onDividerMouseDown}
            className="absolute z-10 cursor-col-resize"
            style={{ left: `${leftWidth - 3}px`, top: "44px", bottom: 0, width: "6px", background: "transparent" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#388bfd44")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          />

          {/* Editor header */}
          <div className="flex items-center justify-between px-4 py-2 border-b shrink-0"
            style={{ background: "#161b22", borderColor: "#30363d" }}>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "#8b949e" }}>&lt;/&gt;</span>
              <span className="text-xs font-medium" style={{ color: "#c9d1d9" }}>Code</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex items-center">
                <select value={lang} onChange={e => changeLang(e.target.value)}
                  className="appearance-none text-xs pl-3 pr-7 py-1.5 rounded-md border cursor-pointer focus:outline-none focus:ring-1"
                  style={{ background: "#21262d", borderColor: "#30363d", color: "#c9d1d9", outlineColor: "#58a6ff" }}>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <ChevronDown className="h-3 w-3 absolute right-2 pointer-events-none" style={{ color: "#8b949e" }} />
              </div>
              <Sun className="h-3.5 w-3.5 cursor-pointer transition-colors" style={{ color: "#8b949e" }} />
              <Maximize2 className="h-3.5 w-3.5 cursor-pointer transition-colors" style={{ color: "#8b949e" }} />
              <RotateCcw onClick={() => { setCode(STARTERS[lang] ?? ""); setRunResults(null) }}
                className="h-3.5 w-3.5 cursor-pointer transition-colors" style={{ color: "#8b949e" }} />
            </div>
          </div>

          {/* Code editor */}
          <div className="flex-1 min-h-0 overflow-auto flex" style={{ background: "#0d1117" }}>
            {/* Line numbers */}
            <div className="w-10 shrink-0 pt-4 text-right pr-3 sticky left-0"
              style={{ color: "#3b4048", fontSize: "12px", fontFamily: "'Fira Code','Consolas',monospace", lineHeight: "1.5rem", background: "#0d1117" }}>
              {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={e => { setCode(e.target.value); setRunResults(null) }}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              disabled={completed}
              className="flex-1 focus:outline-none resize-none pt-4 pr-4 pb-4 pl-2 disabled:opacity-60 min-w-0"
              style={{
                background: "#0d1117", color: "#e6edf3",
                fontFamily: "'Fira Code','Consolas',monospace", fontSize: "13px", lineHeight: "1.5rem",
                tabSize: 4, minHeight: "100%",
              }}
            />
          </div>

          {/* Bottom panel — Console */}
          <div className="border-t shrink-0 flex flex-col" style={{ background: "#0d1117", borderColor: "#30363d", height: `${bottomHeight}px` }}>
            {/* Vertical drag handle */}
            <div
              onMouseDown={onBottomDividerMouseDown}
              className="w-full cursor-row-resize shrink-0 flex items-center justify-center group"
              style={{ height: "8px", background: "rgba(255,255,255,0.03)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#388bfd22")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
            >
              <div className="w-12 h-1 rounded-full transition-colors" style={{ background: "rgba(255,255,255,0.2)" }} />
            </div>
            {/* Bottom tabs row + Run/Submit */}
            <div className="flex items-center justify-between px-3 border-b shrink-0"
              style={{ background: "#161b22", borderColor: "#30363d", height: "42px" }}>
              <div className="flex items-center gap-0.5">
                {[
                  { id: "sample",  icon: "✓", label: "Sample Cases", col: "#3fb950" },
                  { id: "custom",  icon: "⊞", label: "Custom Cases", col: "#8b949e" },
                  { id: "results", icon: "▶", label: "Test Results",  col: "#58a6ff" },
                ].map(t => (
                  <button key={t.id} onClick={() => setBottomTab(t.id as any)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all"
                    style={{ color: bottomTab === t.id ? "#e6edf3" : "#8b949e", background: bottomTab === t.id ? "#21262d" : "transparent" }}>
                    <span style={{ color: t.col }}>{t.icon}</span>{t.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => runTests("run")} disabled={running || submitting || !code.trim()}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-bold transition-all disabled:opacity-40"
                  style={{ background: "#238636", color: "#fff", border: "1px solid #2ea043" }}>
                  {running ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                  Run
                </button>
                <button onClick={() => runTests("submit")} disabled={submitting || running || !code.trim() || completed || !publicPassed}
                  title={!publicPassed ? "Run test first" : ""}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-bold transition-all disabled:opacity-40"
                  style={{
                    background: completed ? "#238636" : "#fd8c73",
                    color: completed ? "#fff" : "#000",
                    border: `1px solid ${completed ? "#2ea043" : "#e06c75"}`,
                  }}>
                  {submitting ? <><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Testing...</> : completed ? "Accepted ✓" : "Submit"}
                </button>
              </div>
            </div>

            {/* Bottom content */}
            <div className="flex-1 overflow-y-auto p-3">

              {/* Sample Cases */}
              {bottomTab === "sample" && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    {sampleCases.map((c, i) => {
                      const res    = runResults?.[i]
                      const passed = res?.passed === true
                      const failed = res && !res.passed
                      return (
                        <button key={i} onClick={() => setSelectedCase(i)}
                          className="px-3 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1"
                          style={{
                            background: selectedCase === i ? (passed ? "#10b98120" : failed ? "#f8514920" : "#388bfd20") : "transparent",
                            color:      selectedCase === i ? (passed ? "#3fb950"   : failed ? "#f85149"   : "#388bfd")   : (passed ? "#3fb950" : failed ? "#f85149" : "#8b949e"),
                            border: `1px solid ${selectedCase === i ? (passed ? "#3fb95044" : failed ? "#f8514944" : "#388bfd44") : "transparent"}`,
                          }}>
                          {passed && <span>✓</span>}
                          {failed && <span>✗</span>}
                          Case {i + 1}
                        </button>
                      )
                    })}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold mb-1.5" style={{ color: "#8b949e" }}>Input</p>
                      <div className="rounded-lg px-3 py-2.5 font-mono text-sm"
                        style={{ background: "#161b22", color: "#c9d1d9", minHeight: "36px", border: "1px solid #30363d" }}>
                        {sampleCases[selectedCase]?.input || <span style={{ color: "#3b4048" }}>—</span>}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1.5" style={{ color: "#8b949e" }}>Expected Output</p>
                      <div className="rounded-lg px-3 py-2.5 font-mono text-sm"
                        style={{ background: "#161b22", color: "#c9d1d9", minHeight: "36px", border: "1px solid #30363d" }}>
                        {sampleCases[selectedCase]?.output || <span style={{ color: "#3b4048" }}>—</span>}
                      </div>
                    </div>
                    {runResults && runResults[selectedCase] && (
                      <div>
                        <p className="text-xs font-semibold mb-1.5" style={{ color: "#8b949e" }}>Output</p>
                        <div className="rounded-lg px-3 py-2.5 font-mono text-sm"
                          style={{
                            background: "#161b22",
                            color: runResults[selectedCase].passed ? "#3fb950" : "#f85149",
                            minHeight: "36px",
                            border: `1px solid ${runResults[selectedCase].passed ? "#2ea04333" : "#f8514933"}`,
                          }}>
                          {runResults[selectedCase].actualOutput || <span style={{ color: "#3b4048" }}>—</span>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Custom Cases */}
              {bottomTab === "custom" && (
                <div>
                  <p className="text-xs mb-2" style={{ color: "#8b949e" }}>Enter custom input</p>
                  <textarea value={customInput} onChange={e => setCustomInput(e.target.value)}
                    placeholder="Your custom test input..."
                    className="w-full rounded-md border px-3 py-2 text-sm font-mono focus:outline-none resize-none h-24"
                    style={{ background: "#161b22", borderColor: "#30363d", color: "#c9d1d9", outlineColor: "#58a6ff" }} />
                </div>
              )}

              {/* Test Results */}
              {bottomTab === "results" && (
                <div className="space-y-2">
                  {(running || submitting) && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: "#8b949e" }}>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      {running ? "Running public test..." : "Running all test cases..."}
                    </div>
                  )}
                  {error && (
                    <div className="rounded-md border px-3 py-2 text-sm"
                      style={{ background: "#2d0b0b", borderColor: "#f8514933", color: "#f85149" }}>
                      {error}
                    </div>
                  )}
                  {runResults && runResults.map((r: any, i: number) => (
                    <div key={i} className="rounded-md border p-3 text-xs space-y-1"
                      style={{ background: r.passed ? "#0d2818" : "#2d0b0b", borderColor: r.passed ? "#2ea04333" : "#f8514933" }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span style={{ color: "#8b949e" }}>{r.isPublic ? "Testcase 1 (public)" : `Testcase ${i + 1} (hidden)`}</span>
                          {r.runtimeMs > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded"
                              style={{ background: "#0c1929", color: "#58a6ff" }}>
                              {r.runtimeMs}ms
                            </span>
                          )}
                        </div>
                        <span className="font-bold" style={{ color: r.tle ? "#d29922" : r.passed ? "#3fb950" : "#f85149" }}>
                          {r.tle ? "⏱ TLE" : r.passed ? "✓ Accepted" : "✗ Wrong Answer"}
                        </span>
                      </div>
                      {r.isPublic && (
                        <div className="font-mono space-y-0.5 mt-1">
                          <p><span style={{ color: "#8b949e" }}>Input: </span><span style={{ color: "#79c0ff" }}>{r.input}</span></p>
                          <p><span style={{ color: "#8b949e" }}>Expected: </span><span style={{ color: "#3fb950" }}>{r.expectedOutput}</span></p>
                          <p><span style={{ color: "#8b949e" }}>Output: </span><span style={{ color: r.passed ? "#3fb950" : "#f85149" }}>{r.actualOutput}</span></p>
                        </div>
                      )}
                      {!r.isPublic && !r.passed && !r.tle && (
                        <p className="text-[10px]" style={{ color: "#8b949e" }}>
                          Hidden test failed — check edge cases (empty input, large values, boundaries)
                        </p>
                      )}
                      {r.error && !r.tle && (
                        <p className="font-mono text-[10px] mt-1" style={{ color: "#f85149" }}>{r.error.slice(0, 150)}</p>
                      )}
                    </div>
                  ))}
                  {completed && (
                    <div className="rounded-md border p-3 space-y-2"
                      style={{ background: "#0d2818", borderColor: "#2ea04333" }}>
                      <div className="flex items-center gap-2 font-bold" style={{ color: "#3fb950" }}>
                        <Trophy className="h-4 w-4" /> All tests passed! XP awarded.
                      </div>
                      {runtimeMs !== null && (
                        <div className="flex items-center gap-4 text-xs" style={{ color: "#8b949e" }}>
                          <span>⏱ Runtime: <span style={{ color: "#58a6ff" }}>{runtimeMs}ms</span></span>
                          <span>⏰ Time limit: <span style={{ color: "#8b949e" }}>{timeLimit}ms ({lang})</span></span>
                        </div>
                      )}
                      <a href="#" onClick={e => { e.preventDefault(); window.history.back() }}
                        className="text-xs transition-colors" style={{ color: "#58a6ff" }}>← Back</a>
                    </div>
                  )}
                  {!runResults && !running && !submitting && !error && (
                    <p className="text-xs" style={{ color: "#3b4048" }}>Click Run to test against the public example.</p>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
