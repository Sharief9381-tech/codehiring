"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  Users, FileText, Calendar, CheckCircle2, Clock, Loader2,
  ChevronDown, ChevronUp, ExternalLink, Mail, Trophy,
  Target, ArrowRight, Briefcase, Building2, MapPin,
  Star, XCircle, BarChart3, Sparkles, Phone,
} from "lucide-react"

const STEP_LABELS = [
  "Hiring Request","Verification","Drive Active","Candidates Notified",
  "Applications","Assessment","AI Evaluation","Shortlist",
  "Screening","Interviews","Final Selection"
]
const STATUS_NEXT: Record<string, { label: string; next: string; color: string }> = {
  pending_review: { label: "Waiting for CodeHiring review", next: "", color: "text-amber-500" },
  verified:       { label: "Activate Drive",   next: "active",      color: "text-blue-500" },
  active:         { label: "Start Assessment", next: "assessment",   color: "text-violet-500" },
  assessment:     { label: "Mark Evaluating",  next: "evaluating",  color: "text-cyan-500" },
  evaluating:     { label: "Generate Shortlist",next: "shortlisted", color: "text-indigo-500" },
  shortlisted:    { label: "Begin Screening",  next: "screening",   color: "text-pink-500" },
  screening:      { label: "Start Interviews", next: "interviews",  color: "text-purple-500" },
  interviews:     { label: "Complete Drive",   next: "completed",   color: "text-green-500" },
  completed:      { label: "Drive Completed",  next: "", color: "text-green-500" },
}

interface Tab { id: string; label: string; icon: any }
const TABS: Tab[] = [
  { id: "overview",    label: "Overview",    icon: BarChart3 },
  { id: "applicants",  label: "Applicants",  icon: Users },
  { id: "assessment",  label: "Assessment",  icon: FileText },
  { id: "shortlist",   label: "Shortlist",   icon: CheckCircle2 },
  { id: "interviews",  label: "Interviews",  icon: Calendar },
]

export function DriveDetailClient({ driveId }: { driveId: string }) {
  const [drive, setDrive]           = useState<any>(null)
  const [loading, setLoading]       = useState(true)
  const [activeTab, setActiveTab]   = useState("overview")
  const [advancing, setAdvancing]   = useState(false)
  const [shortlisting, setShortlist]= useState(false)

  useEffect(() => { fetchDrive() }, [driveId])

  async function fetchDrive() {
    setLoading(true)
    try {
      const res = await fetch(`/api/drives/${driveId}`)
      if (res.ok) { const d = await res.json(); setDrive(d.drive) }
    } catch {}
    setLoading(false)
  }

  async function advanceStatus() {
    const next = STATUS_NEXT[drive?.status]?.next
    if (!next) return
    setAdvancing(true)
    try {
      const res = await fetch(`/api/drives/${driveId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      })
      if (res.ok) { toast.success("Status updated"); fetchDrive() }
      else toast.error("Failed to update")
    } catch { toast.error("Error") }
    setAdvancing(false)
  }

  async function generateShortlist() {
    setShortlist(true)
    try {
      const positions = drive?.openPositions || 1
      const res = await fetch(`/api/drives/${driveId}/shortlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topN: positions * 3, minScore: 40 }),
      })
      if (res.ok) {
        const d = await res.json()
        toast.success(d.message)
        fetchDrive()
      } else toast.error("Failed")
    } catch { toast.error("Error") }
    setShortlist(false)
  }

  async function updateApplicantStatus(studentId: string, status: string) {
    try {
      await fetch(`/api/drives/${driveId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [`applicant:${studentId}`]: status }),
      })
      fetchDrive()
    } catch {}
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  )
  if (!drive) return <div className="text-center py-20 text-muted-foreground">Drive not found</div>

  const stepNum = STEP_LABELS.indexOf(
    drive.status === "active" ? "Drive Active" :
    drive.status === "pending_review" ? "Hiring Request" :
    drive.status === "assessment" ? "Assessment" :
    drive.status === "evaluating" ? "AI Evaluation" :
    drive.status === "shortlisted" ? "Shortlist" :
    drive.status === "screening" ? "Screening" :
    drive.status === "interviews" ? "Interviews" :
    drive.status === "completed" ? "Final Selection" : "Hiring Request"
  )

  const applicants = drive.applicants || []
  const shortlisted = applicants.filter((a: any) => a.status === "shortlisted")
    .sort((a: any, b: any) => (b.assessmentScore ?? 0) - (a.assessmentScore ?? 0))

  return (
    <div className="space-y-5">
      {/* Header card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between mb-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl font-bold text-foreground">{drive.title}</h1>
                {drive.postedByRole === "college" ? (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">ON-CAMPUS</span>
                ) : (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">OFF-CAMPUS</span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{drive.type}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{drive.location}</span>
                {drive.salary && <span className="flex items-center gap-1"><Star className="h-3 w-3" />{drive.salary}</span>}
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{drive.openPositions} position{drive.openPositions > 1 ? "s" : ""}</span>
              </div>
              {/* Flow description */}
              <div className={`mt-2 text-[10px] font-medium flex items-center gap-1.5 ${drive.postedByRole === "college" ? "text-emerald-500" : "text-blue-500"}`}>
                {drive.postedByRole === "college"
                  ? "📋 College Drive — applicant list sent to college after applications close"
                  : "🤖 CodeHiring Drive — AI-proctored assessment → auto-shortlist → company review"}
              </div>
            </div>
          </div>
          {/* Advance button */}
          {STATUS_NEXT[drive.status]?.next && (
            <Button onClick={advanceStatus} disabled={advancing}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shrink-0">
              {advancing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              {STATUS_NEXT[drive.status]?.label}
            </Button>
          )}
          {drive.status === "active" && (
            <Button variant="outline" onClick={async () => {
              try {
                const res = await fetch(`/api/drives/${driveId}/notify`, { method: "POST" })
                const d = await res.json()
                if (res.ok) toast.success(d.message)
                else toast.error(d.error || "Failed")
              } catch { toast.error("Error") }
            }} className="gap-2 shrink-0">
              <Users className="h-4 w-4" />Notify Candidates
            </Button>
          )}
          {drive.status === "evaluating" && (
            <Button onClick={generateShortlist} disabled={shortlisting}
              className="gap-2 bg-violet-600 hover:bg-violet-500 text-white shrink-0">
              {shortlisting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Generate Shortlist
            </Button>
          )}
        </div>

        {/* Workflow progress */}
        <div className="space-y-2">
          <div className="flex gap-0.5">
            {STEP_LABELS.map((s, i) => (
              <div key={i} title={s} className={`flex-1 h-2 rounded-full transition-all ${
                i <= stepNum ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Step {stepNum + 1} of {STEP_LABELS.length}</span>
            <span className="font-semibold text-foreground">{STEP_LABELS[stepNum]}</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
          {[
            { label: "Applied",    val: drive.applicationCount || 0, color: "text-blue-500" },
            { label: "Shortlisted",val: drive.shortlistedCount || 0,  color: "text-violet-500" },
            { label: "Hired",      val: drive.hiredCount || 0,         color: "text-emerald-500" },
            { label: "Deadline",   val: drive.applicationDeadline ? new Date(drive.applicationDeadline).toLocaleDateString() : "—", color: "text-amber-500" },
          ].map(({ label, val, color }) => (
            <div key={label} className="text-center">
              <p className={`text-lg font-black tabular-nums ${color}`}>{val}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border pb-px">
        {TABS.map(tab => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all border-b-2 -mb-px
                ${active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <Icon className="h-4 w-4" />{tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-3">Job Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{drive.description}</p>
              </div>
              {drive.selectionProcess?.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="font-semibold text-foreground mb-3">Selection Process</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {drive.selectionProcess.map((step: string, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">{step}</span>
                        {i < drive.selectionProcess.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {drive.eligibility && (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="font-semibold text-foreground mb-3">Eligibility Criteria</h3>
                  <div className="space-y-2 text-sm">
                    {drive.eligibility.graduationYears?.length > 0 && <div className="flex gap-2"><span className="text-muted-foreground w-36">Graduation Years:</span><span>{drive.eligibility.graduationYears.join(", ")}</span></div>}
                    {drive.eligibility.branches?.length > 0 && <div className="flex gap-2"><span className="text-muted-foreground w-36">Branches:</span><span>{drive.eligibility.branches.join(", ")}</span></div>}
                    {drive.eligibility.minCGPA && <div className="flex gap-2"><span className="text-muted-foreground w-36">Min CGPA:</span><span>{drive.eligibility.minCGPA}</span></div>}
                    {drive.eligibility.minProblems && <div className="flex gap-2"><span className="text-muted-foreground w-36">Min Problems:</span><span>{drive.eligibility.minProblems}</span></div>}
                    {drive.eligibility.requiredSkills?.length > 0 && <div className="flex gap-2"><span className="text-muted-foreground w-36">Required Skills:</span><div className="flex flex-wrap gap-1">{drive.eligibility.requiredSkills.map((s: string) => <span key={s} className="px-2 py-0.5 bg-muted rounded-full text-xs">{s}</span>)}</div></div>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* APPLICANTS */}
          {activeTab === "applicants" && (
            <div className="space-y-3">
              {applicants.length === 0 ? (
                <div className="text-center py-20 rounded-2xl border border-dashed border-border bg-card">
                  <Users className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">No applications yet</p>
                </div>
              ) : applicants.map((a: any, i: number) => (
                <motion.div key={a.studentId} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="rounded-2xl border border-border bg-card p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary text-sm shrink-0">
                    {a.name?.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-foreground text-sm">{a.name}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        a.status === "shortlisted" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                        a.status === "rejected" ? "bg-red-500/10 text-red-500" :
                        a.status === "hired" ? "bg-violet-500/10 text-violet-500" :
                        "bg-blue-500/10 text-blue-500"}`}>{a.status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{a.college} · {a.branch} · {a.graduationYear}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-[10px] text-muted-foreground">
                      {a.totalProblems > 0 && <span>{a.totalProblems} problems</span>}
                      {a.highestRating > 0 && <span>Rating: {a.highestRating}</span>}
                      {a.assessmentScore != null && <span className="text-violet-500 font-bold">Score: {a.assessmentScore}%</span>}
                      {a.assessmentRank && <span className="text-amber-500 font-bold">Rank #{a.assessmentRank}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {a.status === "applied" && (
                      <>
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                          onClick={() => updateApplicantStatus(a.studentId, "shortlisted")}>
                          <CheckCircle2 className="h-3 w-3" />Shortlist
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-red-500 border-red-500/30 hover:bg-red-500/10"
                          onClick={() => updateApplicantStatus(a.studentId, "rejected")}>
                          <XCircle className="h-3 w-3" />Reject
                        </Button>
                      </>
                    )}
                    {a.email && (
                      <a href={`mailto:${a.email}`} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <Mail className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* ASSESSMENT */}
          {activeTab === "assessment" && (
            <AssessmentTab driveId={driveId} drive={drive} onRefresh={fetchDrive} />
          )}

          {/* SHORTLIST */}
          {activeTab === "shortlist" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{shortlisted.length} candidate{shortlisted.length !== 1 ? "s" : ""} shortlisted</p>
                <Button size="sm" onClick={generateShortlist} disabled={shortlisting} className="gap-1.5">
                  {shortlisting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                  Re-generate
                </Button>
              </div>
              {shortlisted.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-card">
                  <CheckCircle2 className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">No shortlisted candidates yet</p>
                  <Button size="sm" onClick={generateShortlist} disabled={shortlisting} className="mt-3 gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />Generate Shortlist
                  </Button>
                </div>
              ) : shortlisted.map((a: any, i: number) => (
                <motion.div key={a.studentId} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-emerald-500/20 bg-emerald-500/3 p-4 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm font-black shrink-0">
                    #{i + 1}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary text-sm shrink-0">
                    {a.name?.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground text-sm">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.college} · {a.branch}</p>
                    <div className="flex gap-3 mt-1 text-xs">
                      {a.assessmentScore != null && <span className="text-violet-500 font-bold">Score: {a.assessmentScore}%</span>}
                      {a.totalProblems > 0 && <span className="text-muted-foreground">{a.totalProblems} problems</span>}
                    </div>
                  </div>
                  {a.email && (
                    <a href={`mailto:${a.email}`} className="text-xs text-primary hover:underline flex items-center gap-1 shrink-0">
                      <Mail className="h-3.5 w-3.5" />Contact
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* INTERVIEWS */}
          {activeTab === "interviews" && (
            <InterviewTab driveId={driveId} shortlisted={shortlisted} onRefresh={fetchDrive} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ── Assessment Tab ────────────────────────────────────────────────────────────
function AssessmentTab({ driveId, drive, onRefresh }: { driveId: string; drive: any; onRefresh: () => void }) {
  const [assessment, setAssessment] = useState<any>(null)
  const [loading, setLoading]       = useState(true)
  const [creating, setCreating]     = useState(false)
  const [form, setForm] = useState({
    title: "", totalTime: "90", passingScore: "60",
    instructions: "", shuffleQuestions: true,
  })

  useEffect(() => {
    fetch(`/api/drives/${driveId}/assessment`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.assessment) setAssessment(d.assessment) })
      .finally(() => setLoading(false))
  }, [driveId])

  async function createAssessment() {
    setCreating(true)
    try {
      const res = await fetch(`/api/drives/${driveId}/assessment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title || `${drive.title} Assessment`,
          totalTime: parseInt(form.totalTime),
          passingScore: parseInt(form.passingScore),
          instructions: form.instructions,
          shuffleQuestions: form.shuffleQuestions,
          sections: [
            {
              name: "Aptitude",
              type: "aptitude",
              timeLimit: 20,
              questions: [],
            },
            {
              name: "Technical MCQ",
              type: "mcq",
              timeLimit: 25,
              questions: [],
            },
            {
              name: "Coding",
              type: "coding",
              timeLimit: 45,
              questions: [],
            },
          ],
        }),
      })
      if (res.ok) {
        const d = await res.json()
        setAssessment(d.assessment)
        toast.success("Assessment created")
        onRefresh()
      } else toast.error("Failed")
    } catch { toast.error("Error") }
    setCreating(false)
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>

  if (!assessment) return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-8 space-y-5">
      <div className="text-center">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
        <p className="font-semibold text-foreground mb-1">No assessment configured</p>
        <p className="text-sm text-muted-foreground">Create an assessment for this drive to start evaluating candidates</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 max-w-lg mx-auto">
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Assessment Title</label>
          <Input placeholder={`${drive.title} Assessment`} value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="bg-background border border-border rounded-xl px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Total Time (mins)</label>
          <Input type="number" value={form.totalTime}
            onChange={e => setForm(f => ({ ...f, totalTime: e.target.value }))}
            className="bg-background border border-border rounded-xl px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Passing Score (%)</label>
          <Input type="number" value={form.passingScore}
            onChange={e => setForm(f => ({ ...f, passingScore: e.target.value }))}
            className="bg-background border border-border rounded-xl px-3 py-2 text-sm" />
        </div>
      </div>
      <div className="flex justify-center">
        <Button onClick={createAssessment} disabled={creating} className="gap-2">
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
          Create Assessment
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-foreground">{assessment.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{assessment.totalTime} min · {assessment.passingScore}% passing · {assessment.totalPoints} pts</p>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
            assessment.status === "active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
            assessment.status === "closed" ? "bg-muted text-muted-foreground" :
            "bg-amber-500/10 text-amber-600 dark:text-amber-400"}`}>
            {assessment.status}
          </span>
        </div>
        <div className="space-y-3">
          {assessment.sections?.map((s: any, i: number) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.type} · {s.timeLimit} min · {s.questions?.length || 0} questions</p>
              </div>
            </div>
          ))}
        </div>
        {assessment.status === "draft" && (
          <div className="mt-4 flex gap-2">
            <Button size="sm" className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={async () => {
                await fetch(`/api/drives/${driveId}/assessment`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "active" }) })
                toast.success("Assessment activated"); onRefresh()
              }}>
              Activate Assessment
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Interview Tab ─────────────────────────────────────────────────────────────
function InterviewTab({ driveId, shortlisted, onRefresh }: { driveId: string; shortlisted: any[]; onRefresh: () => void }) {
  const [interviews, setInterviews] = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [scheduling, setScheduling] = useState(false)
  const [form, setForm] = useState({ studentId: "", scheduledAt: "", type: "Technical", durationMinutes: "45", meetLink: "", interviewerName: "" })

  useEffect(() => {
    fetch(`/api/drives/${driveId}/interview`)
      .then(r => r.ok ? r.json() : { interviews: [] })
      .then(d => setInterviews(d.interviews || []))
      .finally(() => setLoading(false))
  }, [driveId])

  async function scheduleInterview() {
    if (!form.studentId || !form.scheduledAt) { toast.error("Select candidate and time"); return }
    setScheduling(true)
    try {
      const candidate = shortlisted.find(s => s.studentId === form.studentId)
      const res = await fetch(`/api/drives/${driveId}/interview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: form.studentId,
          studentName: candidate?.name,
          studentEmail: candidate?.email,
          scheduledAt: form.scheduledAt,
          durationMinutes: parseInt(form.durationMinutes),
          type: form.type,
          meetLink: form.meetLink,
          interviewerName: form.interviewerName,
        }),
      })
      if (res.ok) {
        toast.success("Interview scheduled")
        setForm({ studentId:"",scheduledAt:"",type:"Technical",durationMinutes:"45",meetLink:"",interviewerName:"" })
        const d = await fetch(`/api/drives/${driveId}/interview`).then(r => r.json())
        setInterviews(d.interviews || [])
      } else toast.error("Failed")
    } catch { toast.error("Error") }
    setScheduling(false)
  }

  const inputCls = "bg-background border border-border rounded-xl px-3 py-2 text-sm w-full"

  return (
    <div className="space-y-4">
      {/* Schedule form */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="font-semibold text-foreground mb-4">Schedule Interview</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Candidate</label>
            <select className={inputCls} value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))}>
              <option value="">Select candidate</option>
              {shortlisted.map(s => <option key={s.studentId} value={s.studentId}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Date & Time</label>
            <Input type="datetime-local" className={inputCls} value={form.scheduledAt}
              onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Type</label>
            <select className={inputCls} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              {["Technical","HR","Panel","Managerial"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Duration (mins)</label>
            <Input type="number" className={inputCls} value={form.durationMinutes}
              onChange={e => setForm(f => ({ ...f, durationMinutes: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Meet Link</label>
            <Input className={inputCls} placeholder="https://meet.google.com/..." value={form.meetLink}
              onChange={e => setForm(f => ({ ...f, meetLink: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Interviewer Name</label>
            <Input className={inputCls} placeholder="John Doe" value={form.interviewerName}
              onChange={e => setForm(f => ({ ...f, interviewerName: e.target.value }))} />
          </div>
        </div>
        <Button onClick={scheduleInterview} disabled={scheduling} size="sm" className="mt-3 gap-1.5">
          {scheduling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Calendar className="h-3.5 w-3.5" />}
          Schedule Interview
        </Button>
      </div>

      {/* Interview list */}
      {loading ? <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      : interviews.length === 0 ? (
        <div className="text-center py-12 text-sm text-muted-foreground">No interviews scheduled yet</div>
      ) : (
        <div className="space-y-3">
          {interviews.map((iv: any, i: number) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                iv.status === "completed" ? "bg-emerald-500/10" : iv.status === "cancelled" ? "bg-red-500/10" : "bg-blue-500/10"}`}>
                <Calendar className={`h-5 w-5 ${iv.status === "completed" ? "text-emerald-500" : iv.status === "cancelled" ? "text-red-500" : "text-blue-500"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{iv.studentName}</p>
                <p className="text-xs text-muted-foreground">{iv.type} Interview · {new Date(iv.scheduledAt).toLocaleString()}</p>
                {iv.meetLink && <a href={iv.meetLink} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-1 mt-0.5"><ExternalLink className="h-3 w-3" />{iv.meetLink}</a>}
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                iv.status === "completed" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                iv.status === "cancelled" ? "bg-red-500/10 text-red-500" :
                "bg-blue-500/10 text-blue-500"}`}>{iv.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
