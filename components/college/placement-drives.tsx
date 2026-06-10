"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Plus, Building2, Calendar, Users, CheckCircle2,
  Clock, XCircle, Loader2, ChevronRight, Mail,
  ArrowLeft, FileText, Download, Trophy,
} from "lucide-react"

const STATUS: Record<string, { label: string; color: string; icon: any }> = {
  pending_review: { label: "Pending Review",  color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",   icon: Clock },
  active:         { label: "Applications Open",color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", icon: CheckCircle2 },
  assessment:     { label: "Assessment",       color: "bg-violet-500/10 text-violet-600 dark:text-violet-400", icon: FileText },
  shortlisted:    { label: "Shortlisted",      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",      icon: Users },
  completed:      { label: "Completed",        color: "bg-muted text-muted-foreground",                       icon: CheckCircle2 },
  cancelled:      { label: "Cancelled",        color: "bg-muted text-muted-foreground",                       icon: XCircle },
}

export function PlacementDrives() {
<<<<<<< HEAD
  const [drives, setDrives]         = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [creating, setCreating]     = useState(false)
  const [showForm, setShowForm]     = useState(false)
  const [selectedDrive, setSelected]= useState<any>(null)
  const [applicants, setApplicants] = useState<any[]>([])
  const [loadingApps, setLoadingApps] = useState(false)
  const [form, setForm] = useState({
    title: "", type: "Full-time", description: "", location: "", salary: "",
    openPositions: "1", applicationDeadline: "",
    selectionProcess: "Applications Review, Interview",
    branches: "", graduationYears: "", minCGPA: "",
  })
=======
  const [rawDrives, setDrives] = useState(MOCK_DRIVES)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ company: "", role: "", package: "", deadline: "", branches: "", skills: "", description: "", minCGPA: "" })
>>>>>>> fa191379276f47ebf9aec1dc7ac9ea965a345f20

  useEffect(() => { fetchDrives() }, [])

  async function fetchDrives() {
    setLoading(true)
    try {
      const res = await fetch("/api/drives")
      if (res.ok) { const d = await res.json(); setDrives(d.drives || []) }
    } catch {}
    setLoading(false)
  }

<<<<<<< HEAD
  async function viewApplicants(drive: any) {
    setSelected(drive)
    setLoadingApps(true)
    try {
      const res = await fetch(`/api/drives/${drive._id}/applicants`)
      if (res.ok) { const d = await res.json(); setApplicants(d.applicants || []) }
    } catch {}
    setLoadingApps(false)
  }

  async function handleCreate() {
    if (!form.title || !form.description) { toast.error("Title and description are required"); return }
    setCreating(true)
    try {
      const res = await fetch("/api/drives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          openPositions: parseInt(form.openPositions) || 1,
          selectionProcess: form.selectionProcess.split(",").map(s => s.trim()),
          postedByRole: "college",
          eligibility: {
            branches: form.branches ? form.branches.split(",").map(s => s.trim()) : [],
            graduationYears: form.graduationYears ? form.graduationYears.split(",").map(y => parseInt(y)) : [],
            minCGPA: form.minCGPA ? parseFloat(form.minCGPA) : undefined,
          },
        }),
      })
      if (res.ok) {
        toast.success("Drive created! Pending CodeHiring verification.")
        setShowForm(false)
        setForm({ title:"",type:"Full-time",description:"",location:"",salary:"",openPositions:"1",applicationDeadline:"",selectionProcess:"Applications Review, Interview",branches:"",graduationYears:"",minCGPA:"" })
        fetchDrives()
      } else { const d = await res.json(); toast.error(d.error || "Failed") }
    } catch { toast.error("Network error") }
    setCreating(false)
  }

  const inp = "bg-background border border-border rounded-xl px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/30"
  const lbl = "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block"

  // ── Applicant list view ─────────────────────────────────────────
  if (selectedDrive) return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => setSelected(null)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />Back
        </button>
        <div>
          <h2 className="text-lg font-bold text-foreground">{selectedDrive.title}</h2>
          <p className="text-xs text-muted-foreground">{selectedDrive.companyName} · {applicants.length} applicants</p>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20 text-sm text-emerald-600 dark:text-emerald-400">
        <Users className="h-4 w-4 shrink-0" />
        <span>All candidates who applied to your campus drive are shown below. Share this list with the company.</span>
      </div>

      {loadingApps ? (
        <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : applicants.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-card">
          <Users className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">No applications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {applicants.map((a: any, i: number) => (
            <motion.div key={a.studentId} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-black text-primary shrink-0">
                {a.name?.split(" ").map((w: string) => w[0]).join("").slice(0,2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{a.name}</p>
                <p className="text-xs text-muted-foreground">{a.college} · {a.branch} · {a.graduationYear}</p>
                {a.totalProblems > 0 && <p className="text-[10px] text-muted-foreground mt-0.5">{a.totalProblems} problems · Rating {a.highestRating || "—"}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">Applied</span>
                {a.email && (
                  <a href={`mailto:${a.email}`} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )

  // ── Drive list ──────────────────────────────────────────────────
  const totalApplied  = drives.reduce((s, d) => s + (d.applicationCount || 0), 0)
  const activeDrives  = drives.filter(d => d.status === "active").length
=======
  const today = new Date()

  // Auto-expire drives past deadline
  const drives = rawDrives.map(d => {
    if (d.deadline && new Date(d.deadline) < today && d.status !== "closed") {
      return { ...d, status: "closed" }
    }
    return d
  })

  // Only show non-closed drives (live + upcoming)
  const liveDrives = drives.filter(d => d.status !== "closed")
  const totalApplied = liveDrives.reduce((s, d) => s + d.applied, 0)
  const totalSelected = liveDrives.reduce((s, d) => s + d.selected, 0)
  const active = liveDrives.filter(d => d.status === "active").length
>>>>>>> fa191379276f47ebf9aec1dc7ac9ea965a345f20

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Campus Drives</h2>
          <p className="text-sm text-muted-foreground">Manage placement drives for your students</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />Create Drive
        </Button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
<<<<<<< HEAD
          { label: "Total Drives", value: drives.length,  color: "bg-primary/10 text-primary" },
          { label: "Active",       value: activeDrives,   color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
          { label: "Applications", value: totalApplied,   color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${color}`}>
            {value} {label}
          </div>
        ))}
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground">New Campus Drive</h3>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">✕</button>
=======
          { label: "Drives",    value: liveDrives.length,  color: "bg-primary/10 text-primary" },
          { label: "Active",    value: active,          color: "bg-emerald-500/10 text-emerald-600" },
          { label: "Applied",   value: totalApplied,    color: "bg-blue-500/10 text-blue-600" },
          { label: "Selected",  value: totalSelected,   color: "bg-violet-500/10 text-violet-600" },
        ].map(s => (
          <span key={s.label} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.color}`}>
            <span className="text-sm font-black">{s.value}</span> {s.label}
          </span>
        ))}
      </div>

      {/* 3-column grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {liveDrives.map(drive => {
          const st = STATUS[drive.status] ?? STATUS.closed
          const Icon = st.icon
          const pct = drive.total > 0 ? Math.round((drive.applied / drive.total) * 100) : 0
          return (
            <Card key={drive.id} className={`bg-gradient-to-br ${drive.color} border overflow-hidden group hover:shadow-md transition-all`}>
              <CardContent className="p-4 flex flex-col gap-3 h-full">
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/70 backdrop-blur font-bold text-xs text-foreground shrink-0">
                      {drive.logo}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">{drive.company}</p>
                      <p className="text-xs text-muted-foreground">{drive.role}</p>
                    </div>
                  </div>
                  <Badge className={`text-[10px] px-2 py-0.5 gap-1 ${st.color}`}>
                    <Icon className="h-2.5 w-2.5" />{st.label}
                  </Badge>
                </div>

                {/* Package & deadline */}
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" />{drive.package}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{drive.deadline}</span>
                </div>

                {/* Application progress */}
                <div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                    <span>{drive.applied} applied</span>
                    <span>{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {drive.branches.map(b => <Badge key={b} variant="secondary" className="text-[10px] px-1.5 py-0">{b}</Badge>)}
                  {drive.skills.slice(0, 2).map(s => <Badge key={s} variant="outline" className="text-[10px] px-1.5 py-0">{s}</Badge>)}
                </div>

                {/* Action row */}
                <div className="flex gap-1.5 pt-1 border-t border-border/40 mt-auto">
                  <Button variant="outline" size="sm" className="flex-1 h-7 text-[11px] gap-1 bg-background/60">
                    <Bell className="h-3 w-3" /> Notify
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Edit2 className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {/* "+" add card */}
        <button
          onClick={() => setShowForm(true)}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all min-h-[200px] text-muted-foreground hover:text-primary"
        >
          <Plus className="h-8 w-8 opacity-40" />
          <span className="text-sm font-medium">New Drive</span>
        </button>
      </div>

      {/* Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Create Placement Drive</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Company *", key: "company", placeholder: "Google" },
                { label: "Role *",    key: "role",    placeholder: "SDE Intern" },
                { label: "Package",   key: "package", placeholder: "₹6 LPA" },
                { label: "Min CGPA",  key: "minCGPA", placeholder: "7.0" },
              ].map(f => (
                <div key={f.key} className="space-y-1.5">
                  <Label className="text-xs">{f.label}</Label>
                  <Input placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                </div>
              ))}
              <div className="space-y-1.5">
                <Label className="text-xs">Deadline</Label>
                <Input type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Branches (comma separated)</Label>
                <Input placeholder="CSE, IT, ECE" value={form.branches} onChange={e => setForm(p => ({ ...p, branches: e.target.value }))} />
              </div>
>>>>>>> fa191379276f47ebf9aec1dc7ac9ea965a345f20
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label className={lbl}>Job Title *</label><Input className={inp} placeholder="e.g. Software Engineer" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} /></div>
              <div><label className={lbl}>Type</label><select className={inp} value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))}>{["Full-time","Internship","Contract"].map(t=><option key={t}>{t}</option>)}</select></div>
              <div><label className={lbl}>Company Name</label><Input className={inp} placeholder="Google, TCS..." value={(form as any).companyName || ""} onChange={e => setForm(f => ({...f, companyName: e.target.value} as any))} /></div>
              <div><label className={lbl}>Location</label><Input className={inp} placeholder="Bangalore / Remote" value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} /></div>
              <div><label className={lbl}>Package</label><Input className={inp} placeholder="₹8 LPA" value={form.salary} onChange={e => setForm(f => ({...f, salary: e.target.value}))} /></div>
              <div><label className={lbl}>Open Positions</label><Input type="number" className={inp} value={form.openPositions} onChange={e => setForm(f => ({...f, openPositions: e.target.value}))} /></div>
              <div><label className={lbl}>Application Deadline</label><Input type="date" className={inp} value={form.applicationDeadline} onChange={e => setForm(f => ({...f, applicationDeadline: e.target.value}))} /></div>
              <div><label className={lbl}>Eligible Branches</label><Input className={inp} placeholder="CSE, IT, ECE" value={form.branches} onChange={e => setForm(f => ({...f, branches: e.target.value}))} /></div>
              <div><label className={lbl}>Graduation Years</label><Input className={inp} placeholder="2025, 2026" value={form.graduationYears} onChange={e => setForm(f => ({...f, graduationYears: e.target.value}))} /></div>
              <div><label className={lbl}>Min CGPA</label><Input type="number" step="0.1" className={inp} placeholder="6.0" value={form.minCGPA} onChange={e => setForm(f => ({...f, minCGPA: e.target.value}))} /></div>
              <div className="sm:col-span-2"><label className={lbl}>Description *</label><textarea rows={3} className={inp + " resize-none"} placeholder="Job description..." value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} /></div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button onClick={handleCreate} disabled={creating} className="gap-1.5">
                {creating ? <><Loader2 className="h-4 w-4 animate-spin" />Creating…</> : "Create Drive"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drive list */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : drives.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-card">
          <Building2 className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm font-semibold text-foreground">No drives yet</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">Create a campus drive to invite companies</p>
          <Button size="sm" onClick={() => setShowForm(true)} className="gap-1.5"><Plus className="h-4 w-4" />Create Drive</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {drives.map((drive, i) => {
            const cfg = STATUS[drive.status] ?? STATUS.active
            const Icon = cfg.icon
            return (
              <motion.div key={drive._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card p-4 hover:border-primary/20 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-black text-primary shrink-0">
                    {drive.companyName?.slice(0,2).toUpperCase() || drive.title?.slice(0,2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-foreground text-sm">{drive.title}</p>
                        <p className="text-xs text-muted-foreground">{drive.companyName} · {drive.type} · {drive.location}</p>
                      </div>
                      <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${cfg.color}`}>
                        <Icon className="h-3 w-3" />{cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{drive.applicationCount || 0} applied</span>
                      {drive.applicationDeadline && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(drive.applicationDeadline).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => viewApplicants(drive)}
                    className="shrink-0 gap-1 text-xs">
                    View Applicants <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
