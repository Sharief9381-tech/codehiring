"use client"

import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, RefreshCw, Play, ChevronDown, Trophy, RotateCcw, Sun, Moon, Maximize2, Minimize2, BookOpen, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { TOPIC_QUESTIONS } from "@/lib/topic-questions"

// -- Problem lookup from topic questions --------------------------------------
const PROBLEM_LOOKUP: Record<string, { title: string; difficulty: string }> = {}
for (const topic of TOPIC_QUESTIONS) {
  for (const q of topic.questions) {
    PROBLEM_LOOKUP[q.id] = { title: q.title, difficulty: q.difficulty }
  }
}

// -- Languages ----------------------------------------------------------------
const LANGUAGES = ["Python", "JavaScript", "TypeScript", "Java", "C++", "C", "C#", "Go", "Kotlin", "Swift"]

const DEFAULT_STARTERS: Record<string, string> = {
  Python:     "from typing import List, Optional\n\nclass Solution:\n    def solve(self, nums: List[int]) &rarr; int:\n        # Write your solution here\n        pass\n",
  JavaScript: "/**\n * @param {number[]} nums\n * @return {number}\n */\nvar solve = function(nums) {\n    \n};\n",
  TypeScript: "function solve(nums: number[]): number {\n    \n};\n",
  Java:       "class Solution {\n    public int solve(int[] nums) {\n        \n    }\n}\n",
  "C++":      "class Solution {\npublic:\n    int solve(vector<int>& nums) {\n        \n    }\n};\n",
  C:          "#include <stdio.h>\nint solve(int* nums, int n) {\n    return 0;\n}\n",
  "C#":       "public class Solution {\n    public int Solve(int[] nums) {\n        \n    }\n}\n",
  Go:         "func solve(nums []int) int {\n    return 0\n}\n",
  Kotlin:     "class Solution {\n    fun solve(nums: IntArray): Int {\n        return 0\n    }\n}\n",
  Swift:      "class Solution {\n    func solve(_ nums: [Int]) &rarr; Int {\n        return 0\n    }\n}\n",
}

// -- Syntax Highlighting ------------------------------------------------------

// Keyword sets per language
const KEYWORDS: Record<string, string[]> = {
  Python:     ["def","class","return","if","elif","else","for","while","in","not","and","or","import","from","as","pass","break","continue","lambda","try","except","finally","with","yield","True","False","None","self","print","len","range","int","str","list","dict","set","tuple","bool","float","type","isinstance","super","raise","global","nonlocal","del","assert"],
  JavaScript: ["var","let","const","function","return","if","else","for","while","do","switch","case","break","continue","class","new","this","typeof","instanceof","import","export","default","null","undefined","true","false","async","await","try","catch","finally","of","in","from","throw","delete","void"],
  TypeScript: ["var","let","const","function","return","if","else","for","while","do","switch","case","break","continue","class","new","this","typeof","instanceof","import","export","default","null","undefined","true","false","async","await","try","catch","finally","of","in","from","throw","interface","type","enum","implements","extends","public","private","protected","readonly","abstract","declare","keyof","as","satisfies"],
  Java:       ["public","private","protected","static","final","void","class","interface","enum","extends","implements","return","if","else","for","while","do","new","this","super","import","package","null","true","false","int","long","double","float","boolean","char","byte","short","String","throws","throw","try","catch","finally","instanceof","abstract","synchronized","volatile","transient","native","strictfp","switch","case","break","continue","default"],
  "C++":      ["int","long","double","float","bool","char","void","class","struct","union","enum","public","private","protected","return","if","else","for","while","do","new","delete","nullptr","true","false","const","constexpr","auto","vector","string","map","set","pair","include","using","namespace","std","template","typename","virtual","override","explicit","inline","static","extern","register","mutable","volatile","typedef","sizeof","this","throw","try","catch"],
  C:          ["int","long","double","float","char","void","struct","union","enum","return","if","else","for","while","do","switch","case","break","continue","default","const","static","extern","register","typedef","sizeof","include","define","NULL","true","false","unsigned","signed","short","auto","volatile","goto"],
  "C#":       ["public","private","protected","internal","static","void","class","interface","enum","struct","abstract","override","virtual","return","if","else","for","foreach","while","do","switch","case","break","continue","new","this","base","null","true","false","int","long","double","float","bool","char","string","decimal","byte","short","var","using","namespace","throw","try","catch","finally","async","await","lock","readonly","const","event","delegate","get","set","value","out","ref","in","params"],
  Go:         ["func","var","const","type","struct","interface","map","chan","return","if","else","for","range","switch","case","break","continue","default","go","defer","select","import","package","nil","true","false","int","int8","int16","int32","int64","uint","float32","float64","bool","string","byte","rune","error","make","new","append","len","cap","close","delete","copy","panic","recover","print","println"],
  Kotlin:     ["fun","val","var","class","object","interface","enum","data","sealed","abstract","override","open","final","return","if","else","for","while","do","when","break","continue","import","package","null","true","false","is","as","in","!in","this","super","constructor","init","companion","by","lazy","it","let","run","also","apply","with","to","until","step","downTo","throw","try","catch","finally"],
  Swift:      ["func","var","let","class","struct","enum","protocol","extension","return","if","else","for","while","repeat","switch","case","break","continue","import","nil","true","false","self","super","init","deinit","override","final","static","lazy","weak","unowned","guard","defer","throw","try","catch","throws","rethrows","in","where","as","is","Any","AnyObject","Type","get","set","willSet","didSet","mutating","nonmutating","dynamic","required","convenience","fileprivate","internal","open","public","private"],
}

type ThemeKey = "dark" | "light" | "monokai" | "solarized"

interface SyntaxTheme {
  bg: string; panel: string; border: string; text: string; muted: string
  lineNum: string; keyword: string; string: string; number: string
  comment: string; function: string; type: string; operator: string
  selBg: string; activeLine: string; scrollbar: string
}

const THEMES: Record<ThemeKey, SyntaxTheme> = {
  dark: {
    bg: "#0d1117", panel: "#161b22", border: "#30363d",
    text: "#e6edf3", muted: "#8b949e", lineNum: "#3b4048",
    keyword: "#ff7b72", string: "#a5d6ff", number: "#79c0ff",
    comment: "#8b949e", function: "#d2a8ff", type: "#ffa657",
    operator: "#ff7b72", selBg: "#264f78", activeLine: "#1c2128",
    scrollbar: "#30363d",
  },
  light: {
    bg: "#ffffff", panel: "#f6f8fa", border: "#d0d7de",
    text: "#24292f", muted: "#656d76", lineNum: "#9da5ae",
    keyword: "#cf222e", string: "#0a3069", number: "#0550ae",
    comment: "#6e7781", function: "#8250df", type: "#953800",
    operator: "#cf222e", selBg: "#b4d5fe", activeLine: "#f6f8fa",
    scrollbar: "#d0d7de",
  },
  monokai: {
    bg: "#272822", panel: "#1e1f1c", border: "#3e3d32",
    text: "#f8f8f2", muted: "#75715e", lineNum: "#4a4a40",
    keyword: "#f92672", string: "#e6db74", number: "#ae81ff",
    comment: "#75715e", function: "#a6e22e", type: "#66d9e8",
    operator: "#f92672", selBg: "#49483e", activeLine: "#3e3d32",
    scrollbar: "#3e3d32",
  },
  solarized: {
    bg: "#002b36", panel: "#073642", border: "#586e75",
    text: "#839496", muted: "#657b83", lineNum: "#586e75",
    keyword: "#859900", string: "#2aa198", number: "#d33682",
    comment: "#657b83", function: "#268bd2", type: "#b58900",
    operator: "#cb4b16", selBg: "#073642", activeLine: "#073642",
    scrollbar: "#586e75",
  },
}

function highlight(code: string, lang: string, theme: SyntaxTheme): string {
  const keywords = new Set(KEYWORDS[lang] ?? [])

  const kw  = (s: string) => `<span style="color:${theme.keyword};font-weight:600">${s}</span>`
  const str = (s: string) => `<span style="color:${theme.string}">${s}</span>`
  const num = (s: string) => `<span style="color:${theme.number}">${s}</span>`
  const cmt = (s: string) => `<span style="color:${theme.comment};font-style:italic">${s}</span>`
  const fn_ = (s: string) => `<span style="color:${theme.function}">${s}</span>`
  const tp  = (s: string) => `<span style="color:${theme.type}">${s}</span>`
  const esc = (s: string) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")

  // Comment prefix per language
  const lineComment = (lang === "Python") ? "#"
    : (lang === "Go" || lang === "Swift" || lang === "Kotlin" || lang === "C++" || lang === "C" || lang === "Java" || lang === "JavaScript" || lang === "TypeScript" || lang === "C#") ? "//"
    : null

  // Process line by line
  return code.split("\n").map(line => {
    let out = ""
    let i = 0
    const n = line.length

    while (i < n) {
      // -- Line comment ------------------------------------------------------
      if (lineComment && line.startsWith(lineComment, i)) {
        out += cmt(esc(line.slice(i)))
        i = n
        continue
      }

      // -- Block comment start /* --------------------------------------------
      if ((lang === "Java" || lang === "C++" || lang === "C" || lang === "JavaScript" || lang === "TypeScript" || lang === "C#" || lang === "Go" || lang === "Kotlin" || lang === "Swift") && line[i] === "/" && line[i+1] === "*") {
        const end = line.indexOf("*/", i + 2)
        if (end !== -1) {
          out += cmt(esc(line.slice(i, end + 2))); i = end + 2
        } else {
          out += cmt(esc(line.slice(i))); i = n
        }
        continue
      }

      // -- Preprocessor (#include, #define) for C/C++ ------------------------
      if ((lang === "C" || lang === "C++") && line[i] === "#" && i === 0) {
        // highlight whole line as keyword-ish
        const spaceIdx = line.indexOf(" ", i)
        const directive = spaceIdx === -1 ? line.slice(i) : line.slice(i, spaceIdx)
        out += kw(esc(directive))
        i += directive.length
        continue
      }

      // -- String literals ---------------------------------------------------
      const ch = line[i]
      if (ch === '"' || ch === "'" || (ch === "`" && (lang === "JavaScript" || lang === "TypeScript"))) {
        // Python triple quotes
        if (lang === "Python" && (line.slice(i, i+3) === '"""' || line.slice(i, i+3) === "'''")) {
          const q = line.slice(i, i+3)
          const end = line.indexOf(q, i + 3)
          if (end !== -1) {
            out += str(esc(line.slice(i, end + 3))); i = end + 3
          } else {
            out += str(esc(line.slice(i))); i = n
          }
          continue
        }
        // Regular string
        let j = i + 1
        while (j < n) {
          if (line[j] === ch && line[j-1] !== "\\") break
          j++
        }
        out += str(esc(line.slice(i, j + 1)))
        i = j + 1
        continue
      }

      // -- Numbers -----------------------------------------------------------
      if (/\d/.test(ch) && (i === 0 || !/\w/.test(line[i-1]))) {
        let j = i
        while (j < n && /[\d.xXbBoOeE_a-fA-F]/.test(line[j])) j++
        out += num(esc(line.slice(i, j))); i = j
        continue
      }

      // -- Identifiers and keywords ------------------------------------------
      if (/[a-zA-Z_$]/.test(ch)) {
        let j = i
        while (j < n && /[\w$]/.test(line[j])) j++
        const word = line.slice(i, j)
        const next = line[j]

        if (keywords.has(word)) {
          // def/function -> next word is function name
          if ((lang === "Python" && word === "def") || (lang === "Python" && word === "class")) {
            out += kw(esc(word))
            i = j
            // skip whitespace
            while (i < n && line[i] === " ") { out += " "; i++ }
            // function/class name
            let k = i
            while (k < n && /\w/.test(line[k])) k++
            if (k > i) {
              out += (word === "class" ? tp : fn_)(esc(line.slice(i, k)))
              i = k
            }
          } else if ((lang === "JavaScript" || lang === "TypeScript") && word === "function") {
            out += kw(esc(word))
            i = j
            while (i < n && line[i] === " ") { out += " "; i++ }
            let k = i
            while (k < n && /\w/.test(line[k])) k++
            if (k > i) { out += fn_(esc(line.slice(i, k))); i = k }
          } else {
            out += kw(esc(word)); i = j
          }
        } else if (next === "(") {
          // Function call
          out += fn_(esc(word)); i = j
        } else {
          out += esc(word); i = j
        }
        continue
      }

      // -- Operators ---------------------------------------------------------
      if (/[+\-*/%=<>!&|^~?:]/.test(ch)) {
        out += `<span style="color:${theme.operator}">${esc(ch)}</span>`
        i++
        continue
      }

      // -- Default -----------------------------------------------------------
      out += esc(ch)
      i++
    }

    return out
  }).join("\n")
}

// -- Flat ordered problem list for Prev/Next navigation ----------------------
const ALL_PROBLEMS_ORDERED = TOPIC_QUESTIONS.flatMap(t => t.questions.map(q => ({
  id: q.id,
  slug: q.title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim(),
})))

interface Props { problemId: string }

export default function ProblemEditor({ problemId }: Props) {
  const textareaRef  = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  const editorRef    = useRef<HTMLDivElement>(null)
  const router       = useRouter()

  // -- Prev / Next navigation --------------------------------------------------
  const currentIdx = ALL_PROBLEMS_ORDERED.findIndex(p => p.id === problemId)
  const prevProblem = currentIdx > 0 ? ALL_PROBLEMS_ORDERED[currentIdx - 1] : null
  const nextProblem = currentIdx < ALL_PROBLEMS_ORDERED.length - 1 ? ALL_PROBLEMS_ORDERED[currentIdx + 1] : null

  const goToProblem = (slug: string) => router.push(`/student/problems/${slug}`)

  // -- Problem data ------------------------------------------------------------
  const [problem, setProblemState] = useState<any>(null)
  const problemRef = useRef<any>(null)
  const setProblem = (p: any) => { problemRef.current = p; setProblemState(p) }

  useEffect(() => {
    if (!problemId) return
    const key = `problem_v4_${problemId}`

    // Check sessionStorage first - show immediately even if it's a stub (no testCases yet)
    let cachedStub: any = null
    try {
      const cached = sessionStorage.getItem(key)
      if (cached) {
        const p = JSON.parse(cached)
        if (p?.static || p?.pythonTest1) {
          // Fully cached - use it directly
          setProblem(p)
          const lang = langRef.current
          // Load accepted code if exists, else use starter
          const savedCode = localStorage.getItem(`accepted_code_${problemId}_${lang}`)
          if (savedCode) {
            setCode(savedCode)
            setDone(true)
          } else {
            const starter = p.starters?.[lang] ?? p.starters?.["Python"]
            if (starter) setCode(starter)
          }
          return
        }
        // Partial stub (daily challenge URL params) - show immediately but still fetch
        cachedStub = p
        setProblem(p)
      }
    } catch {}

    // Fetch from API (generates via AI for stubs, returns static for bank problems)
    fetch("/api/student/problem-detail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId }),
    }).then(r => r.json()).then(data => {
      if (data.problem) {
        setProblem(data.problem)
        try { sessionStorage.setItem(key, JSON.stringify(data.problem)) } catch {}
        // Set language-specific starter (only if no saved accepted code)
        const lang = langRef.current
        const savedCode = localStorage.getItem(`accepted_code_${problemId}_${lang}`)
        if (savedCode) {
          setCode(savedCode)
          setDone(true)  // mark as completed if we have saved accepted code
        } else {
          const starter = data.problem.starters?.[lang] ?? data.problem.starters?.["Python"]
          if (starter) setCode(starter)
        }
      }
    }).catch(() => {})
  }, [problemId])

  // -- Theme & layout ----------------------------------------------------------
  const [themeKey, setThemeKey]       = useState<ThemeKey>("dark")
  const [fullscreen, setFullscreen]   = useState(false)
  const theme = THEMES[themeKey]

  // -- Editor state ------------------------------------------------------------
  const [lang, setLang]         = useState("Python")
  const langRef = useRef("Python")
  const [code, setCode]         = useState(() => DEFAULT_STARTERS["Python"])
  const [running, setRunning]   = useState(false)
  const [submitting, setSub]    = useState(false)
  const [runResults, setRes]    = useState<any[] | null>(null)
  const [allPassed, setAllPassed] = useState(false)
  const [runtimeMs, setRuntime] = useState<number | null>(null)
  const [timeLimit, setTL]      = useState(5000)
  const [error, setError]       = useState("")
  const [completed, setDone]    = useState(false)
  const [leftTab, setLeftTab]   = useState<"desc"|"editorial">("desc")
  const [bottomTab, setBot]     = useState<"sample"|"custom"|"results">("sample")
  const [selCase, setSelCase]   = useState(0)
  const [customIn, setCustomIn] = useState("")
  const [customOut, setCustomOut] = useState<{ output: string; error: string; runtimeMs: number } | null>(null)
  const [customRunning, setCustomRunning] = useState(false)
  const [leftW, setLeftW]       = useState(420)
  const [bottomH, setBottomH]   = useState(240)
  const [activeLineY, setActiveLineY] = useState(0)
  const dragH = useRef(false); const dragV = useRef(false)

  // -- Tab size per language (spaces) ------------------------------------------
  const TAB_SIZE: Record<string, number> = {
    Python: 4, Java: 4, "C++": 4, C: 4, "C#": 4, Go: 4, Kotlin: 4, Swift: 4,
    JavaScript: 2, TypeScript: 2,
  }
  const tabSize = TAB_SIZE[lang] ?? 4
  const TAB_STR = " ".repeat(tabSize)

  // -- Derived -----------------------------------------------------------------
  const title      = problem?.title      ?? PROBLEM_LOOKUP[problemId]?.title    ?? "Loading…"
  const difficulty = problem?.difficulty ?? PROBLEM_LOOKUP[problemId]?.difficulty ?? "Easy"
  const desc       = problem?.desc       ?? ""
  const examples   = problem?.examples   ?? []
  const constraints = problem?.constraints ?? []
  const isLoading  = !problem

  const diffColor = difficulty === "Easy" ? "#3fb950" : difficulty === "Medium" ? "#d29922" : "#f85149"

  // -- Horizontal drag ---------------------------------------------------------
  const onHDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); dragH.current = true
    const startX = e.clientX; const startW = leftW
    const move = (ev: MouseEvent) => {
      if (!dragH.current) return
      setLeftW(Math.max(280, Math.min(700, startW + ev.clientX - startX)))
    }
    const up = () => { dragH.current = false; window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up) }
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up)
  }, [leftW])

  // -- Vertical drag -----------------------------------------------------------
  const onVDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); dragV.current = true
    const startY = e.clientY; const startH = bottomH
    const move = (ev: MouseEvent) => {
      if (!dragV.current) return
      setBottomH(Math.max(80, Math.min(600, startH + startY - ev.clientY)))
    }
    const up = () => { dragV.current = false; window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up) }
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up)
  }, [bottomH])

  // -- Change language ---------------------------------------------------------
  const changeLang = (l: string) => {
    setLang(l); langRef.current = l
    // Load saved accepted code for this language, else show starter
    const savedCode = localStorage.getItem(`accepted_code_${problemId}_${l}`)
    if (savedCode) {
      setCode(savedCode)
    } else {
      const starter = problem?.starters?.[l] ?? DEFAULT_STARTERS[l] ?? ""
      setCode(starter)
    }
    setRes(null); setError("")
  }

  // -- Sync highlight scroll with textarea ------------------------------------
  const syncScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop  = textareaRef.current.scrollTop
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }

  const highlighted = useMemo(() => highlight(code, lang, theme), [code, lang, theme])

  // -- Smart keyboard handler --------------------------------------------------
  const BRACE_LANGS = new Set(["JavaScript","TypeScript","Java","C++","C","C#","Go","Kotlin","Swift"])

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = textareaRef.current; if (!ta) return
    const { selectionStart: ss, selectionEnd: se } = ta
    const before = code.slice(0, ss); const after = code.slice(se)
    const curLine = before.slice(before.lastIndexOf("\n") + 1)

    // -- Ctrl / Meta shortcuts ------------------------------------------------
    if (e.ctrlKey || e.metaKey) {
      // Ctrl+A — select all text in textarea (not the page)
      if (e.key === "a" || e.key === "A") {
        e.preventDefault()
        requestAnimationFrame(() => {
          ta.selectionStart = 0
          ta.selectionEnd   = ta.value.length
        })
        return
      }
      // Ctrl+/ — toggle line comment
      if (e.key === "/") {
        e.preventDefault()
        const commentChar = lang === "Python" ? "#" : "//"
        const lineStart = before.lastIndexOf("\n") + 1
        const lineEnd   = code.indexOf("\n", ss) === -1 ? code.length : code.indexOf("\n", ss)
        const fullLine  = code.slice(lineStart, lineEnd)
        const trimmed   = fullLine.trimStart()
        const indent    = fullLine.slice(0, fullLine.length - trimmed.length)
        let newCode: string
        if (trimmed.startsWith(commentChar + " ")) {
          newCode = code.slice(0, lineStart) + indent + trimmed.slice(commentChar.length + 1) + code.slice(lineEnd)
        } else if (trimmed.startsWith(commentChar)) {
          newCode = code.slice(0, lineStart) + indent + trimmed.slice(commentChar.length) + code.slice(lineEnd)
        } else {
          newCode = code.slice(0, lineStart) + indent + commentChar + " " + trimmed + code.slice(lineEnd)
        }
        setCode(newCode)
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = ss })
        return
      }
      // Let browser handle Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z, Ctrl+Y etc.
      return
    }

    if (e.key === "Enter") {
      e.preventDefault()
      if (lang === "Python") {
        const ind   = curLine.match(/^(\s*)/)?.[1] ?? ""
        const extra = curLine.trimEnd().endsWith(":") ? TAB_STR : ""
        const ins   = "\n" + ind + extra
        const nxt   = before + ins + after; setCode(nxt)
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = ss + ins.length })
        return
      }
      if (BRACE_LANGS.has(lang)) {
        const cb = before.slice(-1); const ca = after.slice(0,1)
        if (cb === "{" && ca === "}") {
          const ind   = curLine.match(/^(\s*)/)?.[1] ?? ""
          const inner = "\n" + ind + TAB_STR
          const close = "\n" + ind
          const nxt   = before + inner + close + "}" + after.slice(1); setCode(nxt)
          requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = ss + inner.length })
          return
        }
        const ind = curLine.match(/^(\s*)/)?.[1] ?? ""
        const ins = "\n" + ind
        const nxt = before + ins + after; setCode(nxt)
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = ss + ins.length })
        return
      }
      return
    }

    if (e.key === "Tab") {
      e.preventDefault()
      if (e.shiftKey) {
        // Shift+Tab — remove one indent level
        const ls = before.lastIndexOf("\n") + 1
        const sp = code.slice(ls).match(new RegExp(`^( {1,${tabSize}})`))?.[1] ?? ""
        if (sp) {
          setCode(code.slice(0, ls) + code.slice(ls + sp.length))
          requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = Math.max(ls, ss - sp.length) })
        }
      } else {
        // Tab — insert language-specific spaces
        setCode(before + TAB_STR + after)
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = ss + tabSize })
      }
      return
    }

    // Auto-close pairs
    const PAIRS: Record<string,string> = lang === "Python"
      ? { "(":")", "[":"]", '"':'"', "'":"'" }
      : { "{":"}", "(":")", "[":"]", '"':'"', "'":"'" }
    if (e.key === "Backspace" && ss === se) {
      const prev = before.slice(-1); const nxt = after.slice(0,1)
      if (prev && PAIRS[prev] === nxt) {
        e.preventDefault()
        setCode(before.slice(0,-1) + after.slice(1))
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = ss - 1 })
        return
      }
    }
    if (Object.values(PAIRS).includes(e.key) && after.slice(0,1) === e.key && e.key !== "{") {
      e.preventDefault()
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = ss + 1 })
      return
    }
    if (PAIRS[e.key]) {
      const isQ = e.key === '"' || e.key === "'"
      if (isQ && /\w/.test(before.slice(-1))) return
      e.preventDefault()
      const nxt = before + e.key + PAIRS[e.key] + after; setCode(nxt)
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = ss + 1 })
    }
  }

  // -- Run custom input --------------------------------------------------------
  const runCustom = async () => {
    if (!code.trim() || !customIn.trim()) return
    setCustomRunning(true)
    setCustomOut(null)
    try {
      // Build a minimal problem payload that forces stdin mode (no pythonTest scripts)
      const stdinProblem = {
        title: problem?.title ?? title,
        desc: "", input: customIn, output: "",
        // No pythonTest* keys → run-code will use stdin mode
      }
      const res = await fetch("/api/student/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: lang, problem: stdinProblem, mode: "run" }),
      })
      const data = await res.json()
      if (data.results?.[0]) {
        const r = data.results[0]
        setCustomOut({ output: r.actualOutput ?? "", error: r.error ?? "", runtimeMs: r.runtimeMs ?? 0 })
      } else {
        setCustomOut({ output: "", error: data.error ?? "Execution failed", runtimeMs: 0 })
      }
    } catch (e: any) {
      setCustomOut({ output: "", error: e.message ?? "Network error", runtimeMs: 0 })
    } finally {
      setCustomRunning(false)
    }
  }

  // -- Run tests ---------------------------------------------------------------
  const runTests = async (mode: "run" | "submit") => {
    if (!code.trim()) return
    if (!problemRef.current) { setError("Problem still loading…"); setBot("results"); return }
    mode === "run" ? setRunning(true) : setSub(true)
    setRes(null); setError("")
    setBot(mode === "submit" ? "results" : "sample")
    try {
      const sp = problemRef.current
      const payload = {
        title: sp.title, desc: sp.desc,
        input: sp.input, output: sp.output,
        input2: sp.input2, output2: sp.output2,
        input3: sp.input3, output3: sp.output3,
        input4: sp.input4, output4: sp.output4,
        pythonTest1: sp.pythonTest1, expectedTest1: sp.expectedTest1,
        pythonTest2: sp.pythonTest2, expectedTest2: sp.expectedTest2,
        pythonTest3: sp.pythonTest3, expectedTest3: sp.expectedTest3,
        pythonTest4: sp.pythonTest4, expectedTest4: sp.expectedTest4,
      }
      const customRun = mode === "run" && bottomTab === "custom" && customIn.trim()
      const res = await fetch("/api/student/run-code", {
        method: "POST", headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ code, language: lang, problem: customRun ? { ...payload, input: customIn, output: "" } : payload, mode }),
      })
      const data = await res.json()
      if (data.results) {
        setRes(data.results); setAllPassed(data.allPassed ?? false)
        if (data.runtimeMs) { setRuntime(data.runtimeMs); setTL(data.timeLimit ?? 5000) }
        if (mode === "run") { setBot("sample"); setSelCase(0) }
        if (mode === "submit") { setBot("results"); setSelCase(0) }
        if (mode === "submit" && data.allPassed) {
          setDone(true)
          // Save accepted code to localStorage (persists across sessions)
          try {
            localStorage.setItem(`accepted_code_${problemId}_${lang}`, code)
          } catch {}
          // Save to completedChallenges for the green tick on problems list
          try {
            const stored = localStorage.getItem("completedChallenges")
            const arr: string[] = stored ? JSON.parse(stored) : []
            if (!arr.includes(problemId)) {
              arr.push(problemId)
              localStorage.setItem("completedChallenges", JSON.stringify(arr))
            }
          } catch {}
          fetch("/api/student/first-year-progress", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ action:"problem-solved", problemId }) }).catch(()=>{})
        }
      } else {
        setError(data.error ?? "Failed"); setBot("results")
      }
    } catch (e: any) { setError("Network error: " + (e?.message ?? "")); setBot("results") }
    finally { setRunning(false); setSub(false) }
  }

  const sampleCases = [
    { input: problem?.input ?? "", output: problem?.output ?? "" },
    { input: problem?.input2 ?? "", output: problem?.output2 ?? "" },
  ]

  const lines = code.split("\n")
  const T = theme


  return (
    <div className={`h-screen flex flex-col overflow-hidden select-none ${fullscreen ? "fixed inset-0 z-50" : ""}`}
      style={{ background: T.bg, fontFamily: "'Segoe UI',Inter,sans-serif", color: T.text }}>

      {/* -- Top bar ------------------------------------------------------- */}
      <div className="flex items-center px-3 h-11 border-b shrink-0 gap-2"
        style={{ background: T.panel, borderColor: T.border }}>

        {/* Back */}
        <button onClick={() => window.history.back()}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors hover:opacity-80"
          style={{ color: T.muted }}>
          <ArrowLeft className="h-3.5 w-3.5" />
        </button>
        <div className="w-px h-4" style={{ background: T.border }} />

        {/* Title + difficulty (no background color) */}
        <span className="font-bold text-sm truncate max-w-xs" style={{ color: T.text }}>{title}</span>
        <span className="text-xs font-semibold shrink-0" style={{ color: diffColor }}>
          {difficulty}
        </span>
        {/* Problem index counter */}
        {currentIdx >= 0 && (
          <span className="text-[11px] shrink-0" style={{ color: T.lineNum }}>
            {currentIdx + 1} / {ALL_PROBLEMS_ORDERED.length}
          </span>
        )}

        <div className="flex-1" />

        {/* Prev / Next — left of theme selector */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => prevProblem && goToProblem(prevProblem.slug)}
            disabled={!prevProblem}
            title="Previous problem"
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all disabled:opacity-30"
            style={{ color: T.muted }}
            onMouseEnter={e => { if (prevProblem) { e.currentTarget.style.color = T.text; e.currentTarget.style.background = T.bg + "88" } }}
            onMouseLeave={e => { e.currentTarget.style.color = T.muted; e.currentTarget.style.background = "transparent" }}>
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Prev</span>
          </button>
          <button
            onClick={() => nextProblem && goToProblem(nextProblem.slug)}
            disabled={!nextProblem}
            title="Next problem"
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all disabled:opacity-30"
            style={{ color: T.muted }}
            onMouseEnter={e => { if (nextProblem) { e.currentTarget.style.color = T.text; e.currentTarget.style.background = T.bg + "88" } }}
            onMouseLeave={e => { e.currentTarget.style.color = T.muted; e.currentTarget.style.background = "transparent" }}>
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="w-px h-4" style={{ background: T.border }} />
        {/* Theme selector — dark, light, monokai only */}
        <div className="flex items-center gap-1.5 rounded-md border px-2 py-1"
          style={{ borderColor: T.border, background: T.bg }}>
          {(["dark","light","monokai"] as ThemeKey[]).map(k => (
            <button key={k} onClick={() => setThemeKey(k)}
              title={k.charAt(0).toUpperCase() + k.slice(1)}
              className="w-3.5 h-3.5 rounded-full border-2 transition-transform hover:scale-110"
              style={{
                background: k === "dark" ? "#0d1117" : k === "light" ? "#ffffff" : "#272822",
                borderColor: themeKey === k ? T.text : "transparent",
              }} />
          ))}
        </div>
        {/* Fullscreen */}
        <button onClick={() => setFullscreen(f => !f)}
          className="p-1.5 rounded transition-colors" style={{ color: T.muted }}
          onMouseEnter={e => (e.currentTarget.style.color = T.text)}
          onMouseLeave={e => (e.currentTarget.style.color = T.muted)}>
          {fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* -- Body ---------------------------------------------------------- */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">

        {/* -- LEFT PANEL --------------------------------------------------- */}
        <div className="shrink-0 flex flex-col overflow-hidden border-r"
          style={{ width: `${leftW}px`, background: T.bg, borderColor: T.border }}>

          {/* Left tabs */}
          <div className="flex items-center border-b shrink-0 px-2" style={{ background: T.panel, borderColor: T.border }}>
            {([["desc","📄","Description"],["editorial","!","Editorial"]] as [string,string,string][]).map(([id,icon,label]) => (
              <button key={id} onClick={() => setLeftTab(id as any)}
                className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors"
                style={{ borderColor: leftTab === id ? diffColor : "transparent", color: leftTab === id ? diffColor : T.muted }}>
                {icon} {label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto" style={{ scrollbarColor: `${T.scrollbar} transparent` }}>
            {leftTab === "desc" ? (
              <div className="p-4 space-y-4 text-sm" style={{ color: T.text }}>
                {isLoading ? (
                  <div className="flex items-center gap-2 text-xs" style={{ color: T.muted }}>
                    <RefreshCw className="h-3 w-3 animate-spin" /> Loading problem...
                  </div>
                ) : (
                  <>
                    <div>
                      <h1 className="text-base font-black mb-2" style={{ color: T.text }}>{title}</h1>
                      <p className="text-sm leading-relaxed" style={{ color: T.text, lineHeight: "1.7" }}
                        dangerouslySetInnerHTML={{ __html: desc.replace(/`([^`]+)`/g, `<code style="background:${T.panel};color:${T.keyword};padding:1px 5px;border-radius:4px;font-family:monospace">$1</code>`) }} />
                    </div>

                    {/* Input Format — skip only raw function signatures */}
                    {problem?.inputFormat && !problem.inputFormat.trim().match(/^(def |function |class |public |private )\w/) && (
                      <div>
                        <p className="font-bold mb-1.5 text-sm" style={{ color: T.text }}>Input Format</p>
                        <div className="rounded-lg p-3 text-sm leading-relaxed"
                          style={{ background: T.panel, border: `1px solid ${T.border}`, color: T.text }}>
                          {problem.inputFormat.replace(/^Function signature:\s*/i, "")}
                        </div>
                      </div>
                    )}

                    {/* Output Format */}
                    {problem?.outputFormat && (
                      <div>
                        <p className="font-bold mb-1.5 text-sm" style={{ color: T.text }}>Output Format</p>
                        <div className="rounded-lg p-3 text-sm leading-relaxed"
                          style={{ background: T.panel, border: `1px solid ${T.border}`, color: T.text }}>
                          {problem.outputFormat}
                        </div>
                      </div>
                    )}

                    {/* Examples */}
                    {examples.map((ex: any, i: number) => (
                      <div key={i}>
                        <p className="font-bold mb-1.5 text-sm" style={{ color: T.text }}>Example {i + 1}:</p>
                        <div className="rounded-lg border overflow-hidden"
                          style={{ background: T.panel, borderColor: T.border }}>
                          <div className="grid grid-cols-2 divide-x" style={{ borderColor: T.border }}>
                            <div className="p-3">
                              <p className="text-[11px] font-semibold mb-1.5" style={{ color: T.muted }}>Input:</p>
                              <pre className="font-mono text-xs whitespace-pre-wrap leading-relaxed" style={{ color: T.string }}>
                                {ex.input || "—"}
                              </pre>
                            </div>
                            <div className="p-3">
                              <p className="text-[11px] font-semibold mb-1.5" style={{ color: T.muted }}>Output:</p>
                              <pre className="font-mono text-xs whitespace-pre-wrap leading-relaxed" style={{ color: T.function }}>
                                {ex.output || "—"}
                              </pre>
                            </div>
                          </div>
                          {ex.explanation && (
                            <div className="px-3 py-2.5 border-t text-xs" style={{ borderColor: T.border, color: T.muted }}>
                              <span className="font-semibold" style={{ color: T.text }}>Explanation: </span>
                              {ex.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Constraints */}
                    {constraints.length > 0 && (
                      <div>
                        <p className="font-bold mb-1.5 text-sm" style={{ color: T.text }}>Constraints:</p>
                        <ul className="space-y-1">
                          {constraints.map((c: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-xs">
                              <span className="mt-0.5 shrink-0" style={{ color: T.keyword }}>•</span>
                              <code style={{ color: T.text, fontFamily: "monospace" }}
                                dangerouslySetInnerHTML={{ __html: c.replace(/\^(\d+)/g, "<sup>$1</sup>") }} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="p-5 text-sm" style={{ color: T.muted }}>
                <p className="font-bold mb-3" style={{ color: T.text }}>Hints</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2"><span style={{ color: T.keyword }}>1.</span> Think about the time complexity you need.</li>
                  <li className="flex items-start gap-2"><span style={{ color: T.keyword }}>2.</span> Can you use a hash map to store seen values?</li>
                  <li className="flex items-start gap-2"><span style={{ color: T.keyword }}>3.</span> Consider edge cases: empty array, single element, duplicates.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* -- Horizontal drag handle --------------------------------------- */}
        <div onMouseDown={onHDrag} className="absolute z-20 cursor-col-resize"
          style={{ left: `${leftW - 2}px`, top: 0, bottom: 0, width: "5px", background: "transparent" }}
          onMouseEnter={e => (e.currentTarget.style.background = diffColor + "44")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")} />

        {/* -- RIGHT - Editor + Console ------------------------------------ */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Editor header */}
          <div className="flex items-center justify-between px-3 py-2 border-b shrink-0"
            style={{ background: T.panel, borderColor: T.border }}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono" style={{ color: T.muted }}>&lt;/&gt;</span>
              <span className="text-xs font-semibold" style={{ color: T.text }}>Solution</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Language selector */}
              <div className="relative">
                <select value={lang} onChange={e => changeLang(e.target.value)}
                  className="appearance-none text-xs pl-3 pr-6 py-1 rounded border cursor-pointer focus:outline-none"
                  style={{ background: T.bg, borderColor: T.border, color: T.text }}>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <ChevronDown className="h-3 w-3 absolute right-1.5 top-1 pointer-events-none" style={{ color: T.muted }} />
              </div>
              {/* Reset */}
              <button onClick={() => { setCode(problem?.starters?.[lang] ?? DEFAULT_STARTERS[lang] ?? ""); setRes(null) }}
                title="Reset code" className="p-1 rounded transition-colors" style={{ color: T.muted }}
                onMouseEnter={e => (e.currentTarget.style.color = T.text)}
                onMouseLeave={e => (e.currentTarget.style.color = T.muted)}>
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* -- Code editor (syntax highlighted textarea overlay) ----------- */}
          <div ref={editorRef} className="flex-1 min-h-0 overflow-hidden flex" style={{ background: T.bg }}>
            {/* Line numbers */}
            <div className="shrink-0 pt-4 pb-4 text-right pr-3 select-none overflow-hidden"
              style={{ width: "44px", color: T.lineNum, fontSize: "12px", fontFamily: "'Fira Code',monospace", lineHeight: "1.5rem", background: T.bg, borderRight: `1px solid ${T.border}22` }}>
              {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            {/* Editor area - highlighted layer + transparent textarea */}
            <div className="flex-1 relative overflow-auto"
              style={{ scrollbarColor: `${T.scrollbar} transparent` }}>
              {/* Syntax highlight layer */}
              <div ref={highlightRef}
                aria-hidden="true"
                className="absolute inset-0 pt-4 pr-4 pb-4 pl-3 overflow-hidden pointer-events-none"
                style={{
                  fontFamily: "'Fira Code','Consolas',monospace", fontSize: "13px", lineHeight: "1.5rem",
                  whiteSpace: "pre", color: T.text, tabSize: 4,
                }}
                dangerouslySetInnerHTML={{ __html: highlighted + "\n" }} />
              {/* Transparent textarea on top */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={e => { setCode(e.target.value); setRes(null); syncScroll() }}
                onScroll={syncScroll}
                onKeyDown={handleKey}
                onSelect={syncScroll}
                spellCheck={false}
                disabled={completed}
                tabIndex={0}
                className="absolute inset-0 resize-none focus:outline-none pt-4 pr-4 pb-4 pl-3 disabled:opacity-60"
                style={{
                  background: "transparent", color: "transparent", caretColor: T.text,
                  fontFamily: "'Fira Code','Consolas',monospace", fontSize: "13px", lineHeight: "1.5rem",
                  tabSize: 4, whiteSpace: "pre", overflowWrap: "normal",
                  width: "100%", height: "100%",
                }} />
            </div>
          </div>

          {/* -- Console panel ----------------------------------------------- */}
          <div className="border-t shrink-0 flex flex-col" style={{ background: T.bg, borderColor: T.border, height: `${bottomH}px` }}>
            {/* Vertical drag handle */}
            <div onMouseDown={onVDrag} className="w-full cursor-row-resize shrink-0 flex items-center justify-center"
              style={{ height: "6px" }}
              onMouseEnter={e => (e.currentTarget.style.background = diffColor + "33")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <div className="w-10 h-0.5 rounded-full" style={{ background: T.border }} />
            </div>

            {/* Console tab bar + Run/Submit */}
            <div className="flex items-center justify-between px-3 border-b shrink-0" style={{ background: T.panel, borderColor: T.border, height: "40px" }}>
              <div className="flex gap-0.5">
                {([["sample","v","Cases"],["custom","⊞","Custom"],["results","▶","Results"]] as [string,string,string][]).map(([id,icon,label]) => (
                  <button key={id} onClick={() => setBot(id as any)}
                    className="flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-all"
                    style={{ color: bottomTab === id ? T.text : T.muted, background: bottomTab === id ? T.bg : "transparent" }}>
                    <span style={{ color: id==="sample" ? "#3fb950" : id==="custom" ? T.muted : "#58a6ff" }}>{icon}</span>{label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => runTests("run")} disabled={running || submitting || !code.trim()}
                  className="flex items-center gap-1.5 px-4 py-1 rounded text-xs font-bold disabled:opacity-40 transition-all"
                  style={{ background: "#238636", color: "#fff", border: "1px solid #2ea043" }}>
                  {running ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />} Run
                </button>
                <button onClick={() => runTests("submit")} disabled={submitting || running || !code.trim() || completed}
                  className="flex items-center gap-1.5 px-4 py-1 rounded text-xs font-bold disabled:opacity-40 transition-all"
                  style={{ background: completed ? "#238636" : "#fd8c73", color: completed ? "#fff" : "#000", border: `1px solid ${completed ? "#2ea043" : "#e06c75"}` }}>
                  {submitting ? <><RefreshCw className="h-3 w-3 animate-spin" /> Testing…</> : completed ? "v Accepted" : "Submit"}
                </button>
              </div>
            </div>

            {/* Console content */}
            <div className="flex-1 overflow-y-auto p-3 text-xs" style={{ scrollbarColor: `${T.scrollbar} transparent` }}>

              {/* Sample Cases tab */}
              {bottomTab === "sample" && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    {sampleCases.map((c, i) => {
                      const r = runResults?.[i]
                      const pass = r?.passed === true; const fail = r && !r.passed
                      return (
                        <button key={i} onClick={() => setSelCase(i)}
                          className="px-3 py-1 rounded font-semibold flex items-center gap-1 transition-all"
                          style={{
                            background: selCase === i ? (pass?"#10b98120":fail?"#f8514920":"#388bfd20") : "transparent",
                            color: selCase === i ? (pass?"#3fb950":fail?"#f85149":"#58a6ff") : (pass?"#3fb950":fail?"#f85149":T.muted),
                            border: `1px solid ${selCase===i?(pass?"#3fb95044":fail?"#f8514944":"#388bfd44"):"transparent"}`,
                          }}>
                          {pass && "v"}{fail && "✗"} Case {i + 1}
                        </button>
                      )
                    })}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="font-semibold mb-1" style={{ color: T.muted }}>Input</p>
                      <div className="rounded px-3 py-2 font-mono" style={{ background: T.panel, border: `1px solid ${T.border}`, color: T.string }}>
                        {sampleCases[selCase]?.input || <span style={{ color: T.lineNum }}>-</span>}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold mb-1" style={{ color: T.muted }}>Expected Output</p>
                      <div className="rounded px-3 py-2 font-mono" style={{ background: T.panel, border: `1px solid ${T.border}`, color: T.function }}>
                        {sampleCases[selCase]?.output || <span style={{ color: T.lineNum }}>-</span>}
                      </div>
                    </div>
                    {runResults?.[selCase] && (
                      <div>
                        <p className="font-semibold mb-1" style={{ color: T.muted }}>Your Output</p>
                        <div className="rounded px-3 py-2 font-mono"
                          style={{ background: T.panel, border: `1px solid ${runResults[selCase].passed?"#2ea04344":"#f8514944"}`, color: runResults[selCase].passed?"#3fb950":"#f85149" }}>
                          {runResults[selCase].actualOutput || <span style={{ color: T.lineNum }}>-</span>}
                        </div>
                        {runResults[selCase].error && (
                          <div className="mt-1 rounded px-3 py-2 font-mono text-[11px]"
                            style={{ background: "#2d0b0b", border: "1px solid #f8514933", color: "#f85149" }}>
                            {runResults[selCase].error.slice(0, 300)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Custom tab */}
              {bottomTab === "custom" && (
                <div className="space-y-2">
                  <p className="text-[11px]" style={{ color: T.muted }}>
                    Paste your own input below and run — output appears immediately.
                  </p>
                  <textarea value={customIn} onChange={e => { setCustomIn(e.target.value); setCustomOut(null) }}
                    placeholder={"e.g.\n[2,7,11,15]\n9"}
                    className="w-full rounded border px-3 py-2 font-mono focus:outline-none resize-none h-24"
                    style={{ background: T.panel, borderColor: T.border, color: T.text, fontSize: "12px" }} />
                  <button onClick={runCustom} disabled={customRunning || !customIn.trim() || !code.trim()}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded font-bold text-xs disabled:opacity-40 transition-all"
                    style={{ background: "#238636", color: "#fff", border: "1px solid #2ea043" }}>
                    {customRunning
                      ? <><RefreshCw className="h-3 w-3 animate-spin" /> Running…</>
                      : <><Play className="h-3 w-3" /> Run Custom</>
                    }
                  </button>
                  {customOut && (
                    <div className="space-y-2 mt-1">
                      <div>
                        <p className="font-semibold mb-1 text-[11px]" style={{ color: T.muted }}>
                          Output {customOut.runtimeMs > 0 && <span style={{ color: "#58a6ff" }}>· {customOut.runtimeMs}ms</span>}
                        </p>
                        <div className="rounded px-3 py-2 font-mono text-xs whitespace-pre-wrap"
                          style={{ background: T.panel, border: `1px solid ${customOut.error ? "#f8514944" : "#2ea04344"}`, color: customOut.error ? "#f85149" : "#3fb950", minHeight: "36px" }}>
                          {customOut.error ? customOut.error : (customOut.output || <span style={{ color: T.lineNum }}>(no output)</span>)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Results tab */}
              {bottomTab === "results" && (
                <div className="space-y-3">
                  {/* Loading state */}
                  {(running || submitting) && (
                    <div className="flex items-center gap-2 py-2" style={{ color: T.muted }}>
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      {running ? "Running sample cases…" : "Running all test cases…"}
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <div className="rounded px-3 py-2 font-mono text-xs"
                      style={{ background: "#2d0b0b", border: "1px solid #f8514933", color: "#f85149" }}>
                      {error}
                    </div>
                  )}

                  {/* Test case results — tab-style like the screenshot */}
                  {runResults && runResults.length > 0 && (
                    <>
                      {/* Header: "Test Cases Results" + pass count */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold" style={{ color: T.text }}>Test Cases Results</span>
                        <span className="text-xs" style={{ color: T.muted }}>
                          <span style={{ color: runResults.every(r=>r.passed) ? "#3fb950" : "#f85149", fontWeight: 700 }}>
                            {runResults.filter(r=>r.passed).length} passed
                          </span>
                          {"  "}{runResults.length} total
                        </span>
                      </div>

                      {/* Test tabs */}
                      <div className="flex flex-wrap gap-2">
                        {runResults.map((r: any, i: number) => {
                          const isSelected = selCase === i
                          return (
                            <button key={i} onClick={() => setSelCase(i)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                              style={{
                                background: isSelected
                                  ? (r.passed ? "#238636" : "#da3633")
                                  : (r.passed ? "#0d2818" : "#2d0b0b"),
                                border: `1px solid ${isSelected
                                  ? (r.passed ? "#3fb950" : "#f85149")
                                  : (r.passed ? "#2ea04333" : "#f8514933")}`,
                                color: r.passed ? "#3fb950" : "#f85149",
                              }}>
                              <svg viewBox="0 0 10 10" width="10" height="10" fill="none"
                                stroke={r.passed ? "#3fb950" : "#f85149"}
                                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                {r.passed
                                  ? <polyline points="1.5,5 4,7.5 8.5,2.5" />
                                  : <><line x1="2" y1="2" x2="8" y2="8"/><line x1="8" y1="2" x2="2" y2="8"/></>
                                }
                              </svg>
                              Test {i + 1}
                            </button>
                          )
                        })}
                      </div>

                      {/* Selected test case detail */}
                      {runResults[selCase] && (() => {
                        const r = runResults[selCase]
                        return (
                          <div className="space-y-2">
                            {/* Input */}
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <div className="w-0.5 h-3.5 rounded-full" style={{ background: "#58a6ff" }} />
                                <p className="text-[11px] font-semibold" style={{ color: T.text }}>Input</p>
                              </div>
                              <div className="rounded-lg px-3 py-2.5 font-mono text-xs whitespace-pre-wrap"
                                style={{ background: T.panel, border: `1px solid ${T.border}`, color: T.string, minHeight: "32px" }}>
                                {r.isPublic
                                  ? (r.input?.replace(/^# -- test harness --\n[\s\S]*/,'').trim() || <span style={{color:T.lineNum}}>—</span>)
                                  : <span style={{ color: T.lineNum, fontStyle: "italic" }}>Hidden test case</span>
                                }
                              </div>
                            </div>

                            {/* Expected Output */}
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <div className="w-0.5 h-3.5 rounded-full" style={{ background: "#3fb950" }} />
                                <p className="text-[11px] font-semibold" style={{ color: T.text }}>Expected Output</p>
                              </div>
                              <div className="rounded-lg px-3 py-2.5 font-mono text-xs whitespace-pre-wrap"
                                style={{ background: T.panel, border: `1px solid ${T.border}`, color: "#3fb950", minHeight: "32px" }}>
                                {r.isPublic
                                  ? (r.expectedOutput && r.expectedOutput !== "(hidden)" ? r.expectedOutput : <span style={{color:T.lineNum}}>—</span>)
                                  : <span style={{ color: T.lineNum, fontStyle: "italic" }}>Hidden</span>
                                }
                              </div>
                            </div>

                            {/* Your Output */}
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <div className="w-0.5 h-3.5 rounded-full" style={{ background: r.passed ? "#3fb950" : "#f85149" }} />
                                <p className="text-[11px] font-semibold" style={{ color: T.text }}>Your Output</p>
                                {r.runtimeMs > 0 && (
                                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded"
                                    style={{ background: T.panel, color: "#58a6ff" }}>{r.runtimeMs}ms</span>
                                )}
                              </div>
                              <div className="rounded-lg px-3 py-2.5 font-mono text-xs whitespace-pre-wrap"
                                style={{
                                  background: r.passed ? "rgba(35,134,54,0.1)" : "rgba(218,54,51,0.1)",
                                  border: `1px solid ${r.passed ? "#2ea04344" : "#f8514944"}`,
                                  color: r.passed ? "#3fb950" : "#f85149",
                                  minHeight: "32px",
                                }}>
                                {r.tle ? "⏱ Time Limit Exceeded"
                                  : r.actualOutput || <span style={{ color: T.lineNum }}>(no output)</span>
                                }
                              </div>
                              {r.error && !r.tle && (
                                <div className="mt-1 rounded px-3 py-2 font-mono text-[11px] whitespace-pre-wrap"
                                  style={{ background: "#2d0b0b", border: "1px solid #f8514933", color: "#f85149" }}>
                                  {r.error.slice(0, 400)}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })()}

                      {/* All passed banner */}
                      {completed && (
                        <div className="rounded-lg border p-3 flex items-center gap-3 mt-2"
                          style={{ background: "rgba(35,134,54,0.12)", borderColor: "#2ea04344" }}>
                          <Trophy className="h-4 w-4 shrink-0" style={{ color: "#3fb950" }} />
                          <div>
                            <p className="font-bold text-xs" style={{ color: "#3fb950" }}>All test cases passed! 🎉</p>
                            {runtimeMs !== null && (
                              <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
                                Runtime: <span style={{ color: "#58a6ff" }}>{runtimeMs}ms</span> / Limit: {timeLimit}ms
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {!runResults && !running && !submitting && !error && (
                    <p className="text-xs py-2" style={{ color: T.lineNum }}>Click Submit to run all test cases.</p>
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
