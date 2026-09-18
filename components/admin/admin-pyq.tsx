"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Plus, CheckCircle2, XCircle, Trash2, RefreshCw,
  ChevronLeft, ChevronRight, Search, Filter, Download,
  Loader2, AlertCircle, BookOpen, Sparkles,
} from "lucide-react"

const COMPANIES = [
  "tcs","infosys","wipro","cognizant","capgemini","accenture","hcl","tech-mahindra",
  "amazon","microsoft","google","meta","deloitte","pwc","kpmg","flipkart","swiggy",
]
const SECTIONS = ["quantitative","advanced-aptitude","verbal","basic-coding","advanced-coding"]
const DIFFICULTIES = ["Easy","Medium","Hard"]

interface PYQ {
  _id: string
  company: string
  companyName: string
  section: string
  topic: string
  difficulty: string
  year: number
  question: string
  options: string[]
  correct: number
  explanation: string
  status: "pending" | "approved" | "rejected"
  source: "admin" | "student" | "scraper"
  submittedAt: string
  ragSeeded: boolean
  upvotes: number
}

// ── Add PYQ form ──────────────────────────────────────────────────────────────
function AddPYQForm({ onAdded }: { onAdded: () => void }) {
  const [form, setForm] = useState({
    company: "tcs", section: "quantitative", topic: "", difficulty: "Medium",
    year: new Date().getFullYear(), question: "", options: ["","","",""], correct: 0, explanation: "",
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  const submit = async () => {
    if (!form.question.trim() || form.options.some(o => !o.trim())) {
      setMsg("Fill all fields including 4 options."); return
    }
    setSaving(true); setMsg("")
    const res = await fetch("/api/admin/pyq", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setSaving(false)
    if (data.success) {
      setMsg("✅ Question added and auto-approved!")
      setForm({ company: "tcs", section: "quantitative", topic: "", difficulty: "Medium", year: new Date().getFullYear(), question: "", options: ["","","",""], correct: 0, explanation: "" })
      onAdded()
    } else {
      setMsg("❌ " + (data.error ?? "Failed"))
    }
  }

  return (
    <div className="space-y-4 p-5 rounded-2xl border border-border bg-card">
      <p className="font-bold text-foreground">Add New PYQ</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Company</label>
          <select value={form.company} onChange={e => setForm(f => ({...f, company: e.target.value}))}
            className="w-full text-xs px-2 py-1.5 rounded-lg border border-border bg-background text-foreground">
            {COMPANIES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Section</label>
          <select value={form.section} onChange={e => setForm(f => ({...f, section: e.target.value}))}
            className="w-full text-xs px-2 py-1.5 rounded-lg border border-border bg-background text-foreground">
            {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Topic</label>
          <input value={form.topic} onChange={e => setForm(f => ({...f, topic: e.target.value}))}
            placeholder="e.g. Time & Work"
            className="w-full text-xs px-2 py-1.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Difficulty</label>
          <select value={form.difficulty} onChange={e => setForm(f => ({...f, difficulty: e.target.value}))}
            className="w-full text-xs px-2 py-1.5 rounded-lg border border-border bg-background text-foreground">
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Year</label>
          <input type="number" value={form.year} onChange={e => setForm(f => ({...f, year: Number(e.target.value)}))}
            className="w-full text-xs px-2 py-1.5 rounded-lg border border-border bg-background text-foreground" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Correct Answer (0-3)</label>
          <select value={form.correct} onChange={e => setForm(f => ({...f, correct: Number(e.target.value)}))}
            className="w-full text-xs px-2 py-1.5 rounded-lg border border-border bg-background text-foreground">
            {["A (0)","B (1)","C (2)","D (3)"].map((l, i) => <option key={i} value={i}>{l}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Question</label>
        <textarea value={form.question} onChange={e => setForm(f => ({...f, question: e.target.value}))}
          rows={3} placeholder="Enter the question text..."
          className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {form.options.map((opt, i) => (
          <div key={i}>
            <label className="text-xs text-muted-foreground mb-1 block">Option {["A","B","C","D"][i]}{i === form.correct ? " ✓" : ""}</label>
            <input value={opt} onChange={e => { const o = [...form.options]; o[i] = e.target.value; setForm(f => ({...f, options: o})) }}
              placeholder={`Option ${["A","B","C","D"][i]}`}
              className="w-full text-xs px-2 py-1.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground" />
          </div>
        ))}
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Explanation</label>
        <textarea value={form.explanation} onChange={e => setForm(f => ({...f, explanation: e.target.value}))}
          rows={2} placeholder="Step-by-step solution..."
          className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground resize-none" />
      </div>

      {msg && <p className="text-xs">{msg}</p>}

      <button onClick={submit} disabled={saving}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:opacity-90 disabled:opacity-50 transition-all">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        Add Question
      </button>
    </div>
  )
}

// ── Scraper panel ─────────────────────────────────────────────────────────────
function ScraperPanel({ onScraped }: { onScraped: () => void }) {
  const [company, setCompany] = useState("tcs")
  const [section, setSection] = useState("quantitative")
  const [count, setCount] = useState(10)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const runScrape = async () => {
    setLoading(true); setResult(null)
    const res = await fetch("/api/admin/scrape-pyq", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, section, count }),
    })
    const data = await res.json()
    setLoading(false); setResult(data)
    if (data.success) onScraped()
  }

  return (
    <div className="space-y-4 p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5">
      <div className="flex items-center gap-2">
        <Download className="h-4 w-4 text-amber-500" />
        <p className="font-bold text-foreground">Scrape from IndiaBix / PrepInsta</p>
      </div>
      <p className="text-xs text-muted-foreground">Automatically fetch real PYQs from placement paper websites. Questions go into pending queue for review.</p>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Company</label>
          <select value={company} onChange={e => setCompany(e.target.value)}
            className="w-full text-xs px-2 py-1.5 rounded-lg border border-border bg-background text-foreground">
            {COMPANIES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Section</label>
          <select value={section} onChange={e => setSection(e.target.value)}
            className="w-full text-xs px-2 py-1.5 rounded-lg border border-border bg-background text-foreground">
            {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Count</label>
          <input type="number" value={count} min={5} max={30} onChange={e => setCount(Number(e.target.value))}
            className="w-full text-xs px-2 py-1.5 rounded-lg border border-border bg-background text-foreground" />
        </div>
      </div>

      {result && (
        <div className={`rounded-xl px-4 py-3 text-sm ${result.success ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-500"}`}>
          {result.success ? `✅ Scraped ${result.scraped} questions, saved ${result.saved} for review` : `❌ ${result.error}`}
        </div>
      )}

      <button onClick={runScrape} disabled={loading}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-amber-500 hover:opacity-90 disabled:opacity-50 transition-all">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        {loading ? "Scraping..." : "Run Scraper"}
      </button>
    </div>
  )
}

// ── PYQ Card ──────────────────────────────────────────────────────────────────
function PYQCard({ pyq, onAction }: { pyq: PYQ; onAction: () => void }) {
  const [loading, setLoading] = useState<"approve"|"reject"|"delete"|null>(null)

  const act = async (action: "approve"|"reject"|"delete") => {
    setLoading(action)
    if (action === "delete") {
      await fetch(`/api/admin/pyq?id=${pyq._id}`, { method: "DELETE" })
    } else {
      await fetch("/api/admin/pyq", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: pyq._id, action }),
      })
    }
    setLoading(null); onAction()
  }

  const sourceColor = pyq.source === "student" ? "text-blue-500 bg-blue-500/10" : pyq.source === "scraper" ? "text-amber-500 bg-amber-500/10" : "text-violet-500 bg-violet-500/10"
  const diffColor = pyq.difficulty === "Easy" ? "text-emerald-500" : pyq.difficulty === "Hard" ? "text-red-500" : "text-amber-500"

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{pyq.company.toUpperCase()}</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{pyq.section}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diffColor} bg-current/10`}>{pyq.difficulty}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sourceColor}`}>{pyq.source}</span>
          {pyq.ragSeeded && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">RAG ✓</span>}
        </div>
        <span className="text-[10px] text-muted-foreground shrink-0">{pyq.year} · {pyq.topic}</span>
      </div>

      <p className="text-sm text-foreground font-medium leading-relaxed">{pyq.question}</p>

      <div className="grid grid-cols-2 gap-1.5">
        {pyq.options.map((opt, i) => (
          <div key={i} className={`text-xs px-2.5 py-1.5 rounded-lg ${i === pyq.correct ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold" : "bg-muted text-muted-foreground"}`}>
            {["A","B","C","D"][i]}. {opt}
          </div>
        ))}
      </div>

      {pyq.explanation && (
        <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
          <span className="font-semibold text-foreground">Explanation: </span>{pyq.explanation}
        </p>
      )}

      <div className="flex items-center gap-2 pt-1">
        {pyq.status === "pending" && (
          <>
            <button onClick={() => act("approve")} disabled={!!loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-all disabled:opacity-50">
              {loading === "approve" ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />} Approve
            </button>
            <button onClick={() => act("reject")} disabled={!!loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all disabled:opacity-50">
              {loading === "reject" ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />} Reject
            </button>
          </>
        )}
        {pyq.status === "rejected" && (
          <button onClick={() => act("approve")} disabled={!!loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-all disabled:opacity-50">
            <CheckCircle2 className="h-3 w-3" /> Re-approve
          </button>
        )}
        <button onClick={() => act("delete")} disabled={!!loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all disabled:opacity-50 ml-auto">
          {loading === "delete" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />} Delete
        </button>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export function AdminPYQ() {
  const [tab, setTab] = useState<"list"|"add"|"scrape">("list")
  const [status, setStatus] = useState("pending")
  const [company, setCompany] = useState("")
  const [section, setSection] = useState("")
  const [page, setPage] = useState(1)
  const [data, setData] = useState<{ docs: PYQ[]; total: number; pages: number; counts: Record<string, number> } | null>(null)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ status, page: String(page) })
    if (company) params.set("company", company)
    if (section) params.set("section", section)
    const res = await fetch(`/api/admin/pyq?${params}`)
    const json = await res.json()
    setData(json)
    setLoading(false)
  }, [status, page, company, section])

  useEffect(() => { load() }, [load])

  const counts = data?.counts ?? { pending: 0, approved: 0, rejected: 0 }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">PYQ Management</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Manage previous year questions for RAG-powered assessments</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab("add")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${tab === "add" ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            <Plus className="h-3.5 w-3.5" /> Add PYQ
          </button>
          <button onClick={() => setTab("scrape")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${tab === "scrape" ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            <Download className="h-3.5 w-3.5" /> Scraper
          </button>
          <button onClick={() => { setTab("list"); load() }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-muted text-muted-foreground hover:text-foreground transition-all">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pending", count: counts.pending, color: "text-amber-500", bg: "bg-amber-500/10", key: "pending" },
          { label: "Approved", count: counts.approved, color: "text-emerald-500", bg: "bg-emerald-500/10", key: "approved" },
          { label: "Rejected", count: counts.rejected, color: "text-red-500", bg: "bg-red-500/10", key: "rejected" },
        ].map(s => (
          <button key={s.key} onClick={() => { setStatus(s.key); setPage(1); setTab("list") }}
            className={`rounded-xl p-4 text-center transition-all hover:scale-[1.02] ${status === s.key ? s.bg : "bg-card border border-border"}`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.count}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Forms */}
      {tab === "add" && <AddPYQForm onAdded={() => { setTab("list"); load() }} />}
      {tab === "scrape" && <ScraperPanel onScraped={() => { setStatus("pending"); setPage(1); load() }} />}

      {/* List */}
      {tab === "list" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {["all","pending","approved","rejected"].map(s => (
              <button key={s} onClick={() => { setStatus(s); setPage(1) }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${status === s ? "bg-primary/15 text-primary border border-primary/30" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
                {s !== "all" && counts[s] > 0 && ` (${counts[s]})`}
              </button>
            ))}
            <select value={company} onChange={e => { setCompany(e.target.value); setPage(1) }}
              className="text-xs px-2 py-1.5 rounded-lg border border-border bg-background text-foreground">
              <option value="">All Companies</option>
              {COMPANIES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
            </select>
            <select value={section} onChange={e => { setSection(e.target.value); setPage(1) }}
              className="text-xs px-2 py-1.5 rounded-lg border border-border bg-background text-foreground">
              <option value="">All Sections</option>
              {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Questions */}
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : !data?.docs?.length ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No questions found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.docs.map(pyq => (
                <PYQCard key={pyq._id} pyq={pyq} onAction={load} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {data && data.pages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{data.total} total questions</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                  className="p-2 rounded-lg border border-border disabled:opacity-40 hover:bg-muted transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="flex items-center px-3 text-sm text-muted-foreground">
                  {page} / {data.pages}
                </span>
                <button onClick={() => setPage(p => Math.min(data.pages, p+1))} disabled={page === data.pages}
                  className="p-2 rounded-lg border border-border disabled:opacity-40 hover:bg-muted transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
