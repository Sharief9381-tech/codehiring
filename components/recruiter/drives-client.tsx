"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import Link from "next/link"
import {
  Plus, Briefcase, Users, Calendar, ChevronRight,
  CheckCircle2, Clock, XCircle, Loader2, Building2,
  Target, FileText, AlertCircle, MapPin, IndianRupee,
} from "lucide-react"

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any; step: number }> = {
  pending_review: { label: "Pending Review",  color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",   icon: Clock,         step: 1 },
  verified:       { label: "Verified",        color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",      icon: CheckCircle2,  step: 2 },
  active:         { label: "Active",          color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", icon: CheckCircle2, step: 3 },
  assessment:     { label: "Assessment Live", color: "bg-violet-500/10 text-violet-600 dark:text-violet-400", icon: FileText,      step: 6 },
  evaluating:     { label: "Evaluating",      color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",       icon: Loader2,       step: 7 },
  shortlisted:    { label: "Shortlisted",     color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400", icon: Users,         step: 8 },
  screening:      { label: "Screening",       color: "bg-pink-500/10 text-pink-600 dark:text-pink-400",       icon: Target,        step: 9 },
  interviews:     { label: "Interviews",      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400", icon: Calendar,      step: 10 },
  completed:      { label: "Completed",       color: "bg-green-500/10 text-green-600 dark:text-green-400",    icon: CheckCircle2,  step: 11 },
  cancelled:      { label: "Cancelled",       color: "bg-muted text-muted-foreground",                        icon: XCircle,       step: 0 },
}

const STEPS = [
  "Hiring Request", "Verification", "Drive Created", "Candidates Notified",
  "Applications", "Assessment", "AI Evaluation", "Shortlist",
  "Screening", "Interviews", "Final Selection"
]

export function RecruiterDrivesClient() {
  const [drives, setDrives]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: "", type: "Full-time", description: "", location: "", salary: "",
    openPositions: "1", hiringTimeline: "", applicationDeadline: "",
    selectionProcess: "Online Assessment, Technical Interview, HR Interview",
    graduationYears: "", branches: "", minCGPA: "", requiredSkills: "", minProblems: "",
  })

  useEffect(() => { fetchDrives() }, [])

  async function fetchDrives() {
    setLoading(true)
    try {
      const res = await fetch("/api/drives")
      if (res.ok) { const d = await res.json(); setDrives(d.drives || []) }
    } catch {}
    setLoading(false)
  }

  async function handleCreate() {
    if (!form.title || !form.description || !form.location) {
      toast.error("Title, description and location are required"); return
    }
    setCreating(true)
    try {
      const res = await fetch("/api/drives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          openPositions: parseInt(form.openPositions) || 1,
          selectionProcess: form.selectionProcess.split(",").map(s => s.trim()),
          eligibility: {
            graduationYears: form.graduationYears ? form.graduationYears.split(",").map(y => parseInt(y.trim())).filter(Boolean) : [],
            branches: form.branches ? form.branches.split(",").map(s => s.trim()).filter(Boolean) : [],
            minCGPA: form.minCGPA ? parseFloat(form.minCGPA) : undefined,
            requiredSkills: form.requiredSkills ? form.requiredSkills.split(",").map(s => s.trim().toLowerCase()) : [],
            minProblems: form.minProblems ? parseInt(form.minProblems) : undefined,
          },
        }),
      })
      if (res.ok) {
        toast.success("Hiring request submitted! Pending CodeHiring review.")
        setShowForm(false)
        setForm({ title:"",type:"Full-time",description:"",location:"",salary:"",openPositions:"1",hiringTimeline:"",applicationDeadline:"",selectionProcess:"Online Assessment, Technical Interview, HR Interview",graduationYears:"",branches:"",minCGPA:"",requiredSkills:"",minProblems:"" })
        fetchDrives()
      } else {
        const d = await res.json(); toast.error(d.error || "Failed")
      }
    } catch { toast.error("Network error") }
    setCreating(false)
  }

  const inputCls = "bg-background border border-border rounded-xl px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/30"
  const labelCls = "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block"

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{drives.length} drive{drives.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="h-4 w-4" /> New Hiring Drive
        </Button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-border bg-card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" /> New Hiring Request
              </h3>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>

            {/* Workflow notice */}
            <div className="flex items-start gap-3 rounded-xl bg-blue-500/8 border border-blue-500/20 p-3">
              <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                After submission, CodeHiring will review your request and activate the drive within 24 hours.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Job Title *</label>
                <Input className={inputCls} placeholder="e.g. Software Engineer Intern"
                  value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Type</label>
                <select className={inputCls} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  {["Full-time","Internship","Contract"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Job Description *</label>
                <textarea className={inputCls + " resize-none"} rows={3} placeholder="Describe the role, responsibilities, and requirements..."
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Location *</label>
                <Input className={inputCls} placeholder="e.g. Bangalore, India / Remote"
                  value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Salary / Package</label>
                <Input className={inputCls} placeholder="e.g. ₹8 LPA or ₹40K/mo"
                  value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Open Positions</label>
                <Input className={inputCls} type="number" min="1" placeholder="1"
                  value={form.openPositions} onChange={e => setForm(f => ({ ...f, openPositions: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Application Deadline</label>
                <Input className={inputCls} type="date"
                  value={form.applicationDeadline} onChange={e => setForm(f => ({ ...f, applicationDeadline: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Hiring Timeline</label>
                <Input className={inputCls} placeholder="e.g. March 2026"
                  value={form.hiringTimeline} onChange={e => setForm(f => ({ ...f, hiringTimeline: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Selection Process (comma separated)</label>
                <Input className={inputCls} placeholder="Online Assessment, Technical Interview, HR"
                  value={form.selectionProcess} onChange={e => setForm(f => ({ ...f, selectionProcess: e.target.value }))} />
              </div>
            </div>

            {/* Eligibility */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Eligibility Criteria</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className={labelCls}>Graduation Years</label>
                  <Input className={inputCls} placeholder="2025, 2026"
                    value={form.graduationYears} onChange={e => setForm(f => ({ ...f, graduationYears: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Branches</label>
                  <Input className={inputCls} placeholder="CSE, IT, ECE"
                    value={form.branches} onChange={e => setForm(f => ({ ...f, branches: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Min CGPA</label>
                  <Input className={inputCls} type="number" step="0.1" placeholder="7.0"
                    value={form.minCGPA} onChange={e => setForm(f => ({ ...f, minCGPA: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Required Skills</label>
                  <Input className={inputCls} placeholder="python, java, dsa"
                    value={form.requiredSkills} onChange={e => setForm(f => ({ ...f, requiredSkills: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Min Problems Solved</label>
                  <Input className={inputCls} type="number" placeholder="100"
                    value={form.minProblems} onChange={e => setForm(f => ({ ...f, minProblems: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button onClick={handleCreate} disabled={creating}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                {creating ? <><Loader2 className="h-4 w-4 animate-spin" />Submitting…</> : "Submit Hiring Request"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drive list */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : drives.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-border bg-card">
          <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm font-semibold text-foreground">No hiring drives yet</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">Create your first drive to start recruiting</p>
          <Button onClick={() => setShowForm(true)} size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> New Drive
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {drives.map(drive => {
            const cfg = STATUS_CONFIG[drive.status] ?? STATUS_CONFIG.pending_review
            const Icon = cfg.icon
            const step = cfg.step
            return (
              <motion.div key={drive._id} whileHover={{ y: -2 }}
                className="rounded-2xl border border-border bg-card p-5 hover:border-primary/20 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div>
                        <h4 className="font-bold text-foreground">{drive.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {drive.type} · {drive.location}
                          {drive.salary && ` · ${drive.salary}`}
                          {drive.openPositions > 1 && ` · ${drive.openPositions} positions`}
                        </p>
                      </div>
                      <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${cfg.color}`}>
                        <Icon className="h-3 w-3" />{cfg.label}
                      </span>
                    </div>

                    {/* Workflow progress */}
                    <div className="flex items-center gap-1 mt-3 mb-3">
                      {STEPS.map((s, i) => (
                        <div key={i} className="flex items-center gap-0.5 flex-1">
                          <div className={`h-1.5 rounded-full flex-1 transition-colors ${i < step ? "bg-primary" : i === step ? "bg-primary/50" : "bg-muted"}`} />
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground">Step {step + 1} of 11 · {STEPS[step] || "Completed"}</p>

                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{drive.applicationCount || 0} applied</span>
                      {drive.shortlistedCount > 0 && <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" />{drive.shortlistedCount} shortlisted</span>}
                      {drive.applicationDeadline && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(drive.applicationDeadline).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <Link href={`/recruiter/drives/${drive._id}`}>
                    <Button variant="ghost" size="sm" className="shrink-0 gap-1 text-xs">
                      Manage <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
