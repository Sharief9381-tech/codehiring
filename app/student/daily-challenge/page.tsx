"use client"

import { useState, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, RefreshCw, Play, ChevronDown, Trophy, RotateCcw, Sun, Maximize2 } from "lucide-react"

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

export default function DailyChallengeEditorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center gap-2" style={{ background:"#0d1117", color:"#8b949e" }}>
        <RefreshCw className="h-5 w-5 animate-spin" /> Loading...
      </div>
    }>
      <EditorContent />
    </Suspense>
  )
}

function EditorContent() {
  const params      = useSearchParams()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isProject   = params.get("type") === "project"
  const challengeId = params.get("challengeId") ?? ""

  const problem = {
    title:       params.get("title")       ?? "Today's Challenge",
    desc:        params.get("desc")        ?? "",
    inputFormat: params.get("inputFormat") || "",
    outputFormat:params.get("outputFormat")|| "",
    constraints: params.get("constraints") ? params.get("constraints")!.split("|||").filter(Boolean) : [],
    input:       params.get("input")       ?? "",
    output:      params.get("output")      ?? "",
    explain:     params.get("explain")     ?? "",
    badge:       params.get("badge")       ?? "Easy",
  }

  const inputFormat  = problem.inputFormat  || (problem.input  ? `A single line: ${problem.input}` : "")
  const outputFormat = problem.outputFormat || (problem.output ? `Print: ${problem.output}` : "")
  const constraints  = problem.constraints.length ? problem.constraints : ["Input is within reasonable bounds","Time limit: 2s","Memory: 256 MB"]

  const [lang, setLang]                 = useState("Python")
  const [code, setCode]                 = useState(STARTERS["Python"])
  const [running, setRunning]           = useState(false)
  const [submitting, setSubmitting]     = useState(false)
  const [runResults, setRunResults]     = useState<any[]|null>(null)
  const [publicPassed, setPublicPassed] = useState(false)
  const [allPassed, setAllPassed]       = useState(false)  // used to gate submit button colour
  const [runtimeMs, setRuntimeMs]       = useState<number|null>(null)
  const [timeLimit, setTimeLimit]       = useState<number>(5000)
  const [error, setError]               = useState("")
  const [completed, setCompleted]       = useState(false)
  const [leftTab, setLeftTab]           = useState<"desc"|"subs">("desc")
  const [bottomTab, setBottomTab]       = useState<"sample"|"custom"|"results">("sample")
  const [selectedCase, setSelectedCase] = useState(0)
  const [customInput, setCustomInput]   = useState("")

  // ── Smart editor keyboard handler ──────────────────────────────────────────
  // Python  : auto-indent after lines ending with ":"
  // Brace langs (Java/C++/C/C#/Go/Kotlin/Swift/JS/TS):
  //   • Enter inside { } → add indented line + closing brace on next line
  //   • Tab              → insert 4 spaces at cursor
  //   • Shift+Tab        → remove up to 4 leading spaces
  //   • { typed         → auto-close to {}  with cursor inside
  //   • ( typed         → auto-close to ()
  //   • [ typed         → auto-close to []
  //   • " or ' typed    → auto-close quotes
  //   • Backspace on empty bracket pair → delete both chars

  const BRACE_LANGS = new Set(["JavaScript","TypeScript","Java","C++","C","C#","Go","Kotlin","Swift"])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = textareaRef.current
    if (!ta) return

    const { selectionStart: ss, selectionEnd: se } = ta
    const before = code.slice(0, ss)
    const after  = code.slice(se)
    const currentLine = before.slice(before.lastIndexOf("\n") + 1)

    // ── ENTER ────────────────────────────────────────────────────────────────
    if (e.key === "Enter") {
      // Python: carry indentation + extra indent after ":"
      if (lang === "Python") {
        e.preventDefault()
        const indent = currentLine.match(/^(\s*)/)?.[1] ?? ""
        const extraIndent = currentLine.trimEnd().endsWith(":") ? "    " : ""
        const insertion = "\n" + indent + extraIndent
        const next = before + insertion + after
        setCode(next)
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = ss + insertion.length
        })
        return
      }

      // Brace languages: if cursor is between { and } → add indented line + closing brace
      if (BRACE_LANGS.has(lang)) {
        const charBefore = before.slice(-1)
        const charAfter  = after.slice(0, 1)
        if (charBefore === "{" && charAfter === "}") {
          e.preventDefault()
          const indent = currentLine.match(/^(\s*)/)?.[1] ?? ""
          const inner  = "\n" + indent + "    "
          const closing = "\n" + indent
          const next = before + inner + closing + "}" + after.slice(1)
          setCode(next)
          requestAnimationFrame(() => {
            ta.selectionStart = ta.selectionEnd = ss + inner.length
          })
          return
        }
        // Normal enter: carry current indentation
        e.preventDefault()
        const indent = currentLine.match(/^(\s*)/)?.[1] ?? ""
        const insertion = "\n" + indent
        const next = before + insertion + after
        setCode(next)
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = ss + insertion.length
        })
        return
      }
      return
    }

    // ── TAB / SHIFT+TAB ──────────────────────────────────────────────────────
    if (e.key === "Tab") {
      e.preventDefault()
      if (e.shiftKey) {
        // Remove up to 4 leading spaces from current line
        const lineStart = before.lastIndexOf("\n") + 1
        const lineContent = code.slice(lineStart)
        const spaces = lineContent.match(/^( {1,4})/)?.[1] ?? ""
        if (spaces) {
          const next = code.slice(0, lineStart) + code.slice(lineStart + spaces.length)
          setCode(next)
          requestAnimationFrame(() => {
            ta.selectionStart = ta.selectionEnd = Math.max(lineStart, ss - spaces.length)
          })
        }
      } else {
        const insertion = "    "
        const next = before + insertion + after
        setCode(next)
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = ss + 4
        })
      }
      return
    }

    // ── Auto-close pairs (brace languages only) ──────────────────────────────
    if (BRACE_LANGS.has(lang)) {
      const PAIRS: Record<string, string> = { "{": "}", "(": ")", "[": "]", '"': '"', "'": "'" }

      // Backspace: delete matching close char if next char matches
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

      // Skip over closing char if already typed
      if (["}", ")", "]", '"', "'"].includes(e.key) && after.slice(0, 1) === e.key) {
        e.preventDefault()
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = ss + 1 })
        return
      }

      // Insert open + close
      if (PAIRS[e.key]) {
        // Don't auto-close quotes if prev char is alphanumeric (likely a word)
        const isQuote = e.key === '"' || e.key === "'"
        if (isQuote && /\w/.test(before.slice(-1))) return

        e.preventDefault()
        const close  = PAIRS[e.key]
        const next   = before + e.key + close + after
        setCode(next)
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = ss + 1 })
        return
      }
    }

    // Python: auto-close () [] "" '' too
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

  const evalProblem = { title: problem.title, desc: problem.desc, input: problem.input, output: problem.output, explain: problem.explain }

  const runTests = async (mode: "run"|"submit") => {
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
        setAllPassed(data.allPassed ?? false)  // used to gate submit button colour
        if (data.runtimeMs) { setRuntimeMs(data.runtimeMs); setTimeLimit(data.timeLimit ?? 5000) }
        if (mode === "submit" && data.allPassed) {
          setCompleted(true)
          const action = isProject && challengeId ? { action:"complete-challenge", challengeId } : { action:"daily-challenge" }
          await fetch("/api/student/first-year-progress", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(action) })
        }
      } else {
        const msg = data.error ?? "Failed to run tests"
        const setup = data.setup ? `\n${data.setup}` : ""
        setError(msg + setup)
      }
    } catch { setError("Network error. Please try again.") }
    finally { setRunning(false); setSubmitting(false) }
  }

  const diffColor = problem.badge === "Beginner" || problem.badge?.toLowerCase() === "easy"   ? "#3fb950"
    : problem.badge === "Intermediate" || problem.badge?.toLowerCase() === "medium" ? "#d29922"
    : "#f85149"

  const sampleCases = [
    { label: "Case 1", input: problem.input, output: problem.output },
    { label: "Case 2", input: "", output: "" },
  ]

  const lines = code.split("\n")

  return (
    <div className="h-screen flex flex-col overflow-hidden select-none" style={{ background:"#0d1117", fontFamily:"'Segoe UI',Inter,sans-serif" }}>

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="flex items-center px-4 h-11 border-b shrink-0" style={{ background:"#161b22", borderColor:"#30363d" }}>
        <a href="/student/learn#challenges" className="flex items-center gap-1.5 text-sm mr-4 transition-colors" style={{ color:"#8b949e" }}
          onMouseEnter={e=>(e.currentTarget.style.color="#e6edf3")} onMouseLeave={e=>(e.currentTarget.style.color="#8b949e")}>
          <ArrowLeft className="h-4 w-4" />
        </a>
        <span className="font-bold text-sm mr-2" style={{ color:"#e6edf3" }}>{problem.title}</span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full border" style={{ color:diffColor, borderColor:diffColor+"44", background:diffColor+"15" }}>
          {problem.badge || "Easy"}
        </span>
        {!isProject && <span className="text-xs font-semibold px-2 py-0.5 rounded-full border ml-2" style={{ color:"#a371f7", borderColor:"#a371f744", background:"#a371f715" }}>Daily</span>}
        <div className="ml-auto flex items-center gap-3" style={{ color:"#8b949e" }}>
          <span className="text-sm cursor-pointer hover:text-white transition-colors">⚙</span>
          <span className="text-sm cursor-pointer hover:text-white transition-colors">🔖</span>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* LEFT — Problem description */}
        <div className="w-[380px] shrink-0 flex flex-col overflow-hidden border-r" style={{ background:"#0d1117", borderColor:"#30363d" }}>
          {/* Tabs */}
          <div className="flex items-center border-b px-3 shrink-0" style={{ background:"#161b22", borderColor:"#30363d" }}>
            {[{id:"desc",label:"Description",icon:"📄"},{id:"subs",label:"Submissions",icon:"🕒"}].map(t => (
              <button key={t.id} onClick={() => setLeftTab(t.id as any)}
                className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors"
                style={{ borderColor: leftTab===t.id ? "#58a6ff" : "transparent", color: leftTab===t.id ? "#58a6ff" : "#8b949e" }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {leftTab === "desc" ? (
            <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ color:"#c9d1d9" }}>
              <div>
                <h1 className="text-xl font-black mb-3" style={{ color:"#e6edf3" }}>{problem.title}</h1>
                <p className="text-sm leading-relaxed" style={{ color:"#8b949e" }}>{problem.desc}</p>
              </div>

              {inputFormat && (
                <div>
                  <p className="text-sm font-bold mb-1.5" style={{ color:"#e6edf3" }}>Input Format</p>
                  <div className="rounded-md px-4 py-3 text-sm border" style={{ background:"#161b22", borderColor:"#30363d", color:"#c9d1d9" }}>{inputFormat}</div>
                </div>
              )}

              {outputFormat && (
                <div>
                  <p className="text-sm font-bold mb-1.5" style={{ color:"#e6edf3" }}>Output Format</p>
                  <div className="rounded-md px-4 py-3 text-sm border" style={{ background:"#161b22", borderColor:"#30363d", color:"#c9d1d9" }}>{outputFormat}</div>
                </div>
              )}

              {problem.input && (
                <div>
                  <p className="text-sm font-bold mb-2" style={{ color:"#e6edf3" }}>Sample Case 1</p>
                  <div className="rounded-md border p-4" style={{ background:"#161b22", borderColor:"#30363d" }}>
                    <div className="flex gap-10 text-sm">
                      <div>
                        <p className="text-xs mb-1" style={{ color:"#8b949e" }}>Input:</p>
                        <p className="font-mono font-bold" style={{ color:"#79c0ff" }}>{problem.input}</p>
                      </div>
                      {problem.output && (
                        <div>
                          <p className="text-xs mb-1" style={{ color:"#8b949e" }}>Output:</p>
                          <p className="font-mono font-bold" style={{ color:"#3fb950" }}>{problem.output}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {constraints.length > 0 && (
                <div>
                  <p className="text-sm font-bold mb-2" style={{ color:"#e6edf3" }}>Constraints</p>
                  <ul className="space-y-1.5">
                    {constraints.map((c:string,i:number) => (
                      <li key={i} className="flex items-center gap-2 text-xs">
                        <span style={{ color:"#58a6ff" }}>·</span>
                        <code className="px-1.5 py-0.5 rounded text-xs" style={{ color:"#79c0ff", background:"#0c1929" }}>{c}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 p-5">
              <p className="text-sm" style={{ color:"#8b949e" }}>No submissions yet.</p>
            </div>
          )}
        </div>

        {/* RIGHT — Editor + Bottom */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Editor header */}
          <div className="flex items-center justify-between px-4 py-2 border-b shrink-0" style={{ background:"#161b22", borderColor:"#30363d" }}>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color:"#8b949e" }}>&lt;/&gt;</span>
              <span className="text-xs font-medium" style={{ color:"#c9d1d9" }}>Code</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Language selector */}
              <div className="relative flex items-center">
                <select value={lang} onChange={e => changeLang(e.target.value)}
                  className="appearance-none text-xs pl-3 pr-7 py-1.5 rounded-md border cursor-pointer focus:outline-none focus:ring-1"
                  style={{ background:"#21262d", borderColor:"#30363d", color:"#c9d1d9", outlineColor:"#58a6ff" }}>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <ChevronDown className="h-3 w-3 absolute right-2 pointer-events-none" style={{ color:"#8b949e" }} />
              </div>
              <Sun className="h-3.5 w-3.5 cursor-pointer transition-colors" style={{ color:"#8b949e" }} />
              <Maximize2 className="h-3.5 w-3.5 cursor-pointer transition-colors" style={{ color:"#8b949e" }} />
              <RotateCcw onClick={() => { setCode(STARTERS[lang] ?? ""); setRunResults(null) }}
                className="h-3.5 w-3.5 cursor-pointer transition-colors" style={{ color:"#8b949e" }} />
            </div>
          </div>

          {/* Code editor */}
          <div className="flex-1 min-h-0 overflow-hidden flex" style={{ background:"#0d1117" }}>
            {/* Line numbers */}
            <div className="w-10 shrink-0 pt-4 text-right pr-3 overflow-hidden" style={{ color:"#3b4048", fontSize:"12px", fontFamily:"'Fira Code','Consolas',monospace", lineHeight:"1.5rem" }}>
              {lines.map((_,i) => <div key={i}>{i+1}</div>)}
            </div>
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={e => { setCode(e.target.value); setRunResults(null) }}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              disabled={completed}
              className="flex-1 focus:outline-none resize-none pt-4 pr-4 pb-4 pl-2 disabled:opacity-60"
              style={{
                background:"#0d1117", color:"#e6edf3",
                fontFamily:"'Fira Code','Consolas',monospace", fontSize:"13px", lineHeight:"1.5rem",
                tabSize:4,
              }}
            />
          </div>

          {/* Bottom panel — Console */}
          <div className="h-52 border-t shrink-0 flex flex-col" style={{ background:"#0d1117", borderColor:"#30363d" }}>
            {/* Bottom tabs row + Run/Submit */}
            <div className="flex items-center justify-between px-3 border-b shrink-0" style={{ background:"#161b22", borderColor:"#30363d", height:"42px" }}>
              <div className="flex items-center gap-0.5">
                {[
                  { id:"sample",  icon:"✓", label:"Sample Cases",  col:"#3fb950" },
                  { id:"custom",  icon:"⊞", label:"Custom Cases",  col:"#8b949e" },
                  { id:"results", icon:"▶", label:"Test Results",   col:"#58a6ff" },
                ].map(t => (
                  <button key={t.id} onClick={() => setBottomTab(t.id as any)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all"
                    style={{ color: bottomTab===t.id ? "#e6edf3" : "#8b949e", background: bottomTab===t.id ? "#21262d" : "transparent" }}>
                    <span style={{ color: t.col }}>{t.icon}</span>{t.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => runTests("run")} disabled={running || submitting || !code.trim()}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-bold transition-all disabled:opacity-40"
                  style={{ background:"#238636", color:"#fff", border:"1px solid #2ea043" }}>
                  {running ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                  Run
                </button>
                <button onClick={() => runTests("submit")} disabled={submitting || running || !code.trim() || completed || !publicPassed}
                  title={!publicPassed ? "Run test first" : ""}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-bold transition-all disabled:opacity-40"
                  style={{ background: completed ? "#238636" : "#fd8c73", color: completed ? "#fff" : "#000", border:`1px solid ${completed ? "#2ea043" : "#e06c75"}` }}>
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
                    {sampleCases.map((c,i) => (
                      <button key={i} onClick={() => setSelectedCase(i)}
                        className="px-3 py-1 rounded-md text-xs font-semibold border transition-all"
                        style={{ background: selectedCase===i ? "#388bfd" : "#21262d", borderColor: selectedCase===i ? "#388bfd" : "#30363d", color: selectedCase===i ? "#fff" : "#8b949e" }}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                  <div className="grid gap-3">
                    <div>
                      <p className="text-xs mb-1.5 flex items-center gap-1.5" style={{ color:"#8b949e" }}>
                        <span className="inline-block w-0.5 h-3 rounded-full" style={{ background:"#388bfd" }} />
                        Input
                      </p>
                      <div className="rounded-md px-3 py-2 font-mono text-sm border" style={{ background:"#161b22", borderColor:"#30363d", color:"#79c0ff", minHeight:"32px" }}>
                        {sampleCases[selectedCase]?.input || <span style={{ color:"#3b4048" }}>—</span>}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs mb-1.5 flex items-center gap-1.5" style={{ color:"#8b949e" }}>
                        <span className="inline-block w-0.5 h-3 rounded-full" style={{ background:"#3fb950" }} />
                        Expected Output
                      </p>
                      <div className="rounded-md px-3 py-2 font-mono text-sm border" style={{ background:"#161b22", borderColor:"#30363d", color:"#3fb950", minHeight:"32px" }}>
                        {sampleCases[selectedCase]?.output || <span style={{ color:"#3b4048" }}>—</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Cases */}
              {bottomTab === "custom" && (
                <div>
                  <p className="text-xs mb-2" style={{ color:"#8b949e" }}>Enter custom input</p>
                  <textarea value={customInput} onChange={e => setCustomInput(e.target.value)}
                    placeholder="Your custom test input..."
                    className="w-full rounded-md border px-3 py-2 text-sm font-mono focus:outline-none resize-none h-24"
                    style={{ background:"#161b22", borderColor:"#30363d", color:"#c9d1d9", outlineColor:"#58a6ff" }} />
                </div>
              )}

              {/* Test Results */}
              {bottomTab === "results" && (
                <div className="space-y-2">
                  {(running||submitting) && (
                    <div className="flex items-center gap-2 text-sm" style={{ color:"#8b949e" }}>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      {running ? "Running public test..." : "Running all test cases..."}
                    </div>
                  )}
                  {error && <div className="rounded-md border px-3 py-2 text-sm" style={{ background:"#2d0b0b", borderColor:"#f8514933", color:"#f85149" }}>{error}</div>}
                  {runResults && runResults.map((r:any,i:number) => (
                    <div key={i} className="rounded-md border p-3 text-xs space-y-1"
                      style={{ background: r.passed?"#0d2818":"#2d0b0b", borderColor: r.passed?"#2ea04333":"#f8514933" }}>
                      <div className="flex items-center justify-between">
                        <span style={{ color:"#8b949e" }}>{r.isPublic ? "Testcase 1 (public)" : `Testcase ${i+1} (hidden)`}</span>
                        <span className="font-bold" style={{ color: r.passed?"#3fb950":"#f85149" }}>
                          {r.passed ? "✓ Correct" : "✗ Wrong Answer"}
                        </span>
                      </div>
                      {r.isPublic && (
                        <div className="font-mono space-y-0.5 mt-1">
                          <p><span style={{ color:"#8b949e" }}>Input: </span><span style={{ color:"#79c0ff" }}>{r.input}</span></p>
                          <p><span style={{ color:"#8b949e" }}>Expected: </span><span style={{ color:"#3fb950" }}>{r.expectedOutput}</span></p>
                          {!r.passed && <p><span style={{ color:"#8b949e" }}>Your Output: </span><span style={{ color:"#f85149" }}>{r.actualOutput}</span></p>}
                        </div>
                      )}
                      {!r.isPublic && !r.passed && <p style={{ color:"#8b949e" }}>Check edge cases (empty input, boundary values)</p>}
                    </div>
                  ))}
                  {completed && (
                    <div className="rounded-md border p-3 space-y-2" style={{ background:"#0d2818", borderColor:"#2ea04333" }}>
                      <div className="flex items-center gap-2 font-bold" style={{ color:"#3fb950" }}>
                        <Trophy className="h-4 w-4" /> All tests passed! XP awarded.
                      </div>
                      {runtimeMs !== null && (
                        <div className="flex items-center gap-4 text-xs" style={{ color:"#8b949e" }}>
                          <span>⏱ Runtime: <span style={{ color:"#58a6ff" }}>{runtimeMs}ms</span></span>
                          <span>⏰ Time limit: <span style={{ color:"#8b949e" }}>{timeLimit}ms ({lang})</span></span>
                        </div>
                      )}
                      <a href="/student/learn#challenges" className="text-xs transition-colors" style={{ color:"#58a6ff" }}>← Back to Challenges</a>
                    </div>
                  )}                  {!runResults && !running && !submitting && !error && (
                    <p className="text-xs" style={{ color:"#3b4048" }}>Click Run to test against the public example.</p>
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
