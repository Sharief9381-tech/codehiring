"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  Plus, Building2, Calendar, Users, IndianRupee,
  CheckCircle2, Edit2, Trash2, Bell, Briefcase, Clock, XCircle,
} from "lucide-react"

const MOCK_DRIVES = [
  { id: "1", company: "Google", logo: "GO", role: "SDE Intern", package: "₹80,000/mo", deadline: "2026-02-15", status: "active", branches: ["CSE", "IT"], skills: ["DSA", "System Design"], applied: 45, total: 200, selected: 0, color: "from-blue-500/20 to-indigo-500/10 border-blue-500/20" },
  { id: "2", company: "Infosys", logo: "IN", role: "Systems Engineer", package: "₹3.6 LPA", deadline: "2026-02-20", status: "active", branches: ["CSE", "IT", "ECE"], skills: ["Java", "SQL"], applied: 120, total: 500, selected: 0, color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/20" },
  { id: "3", company: "TCS", logo: "TC", role: "Associate", package: "₹3.36 LPA", deadline: "2026-01-10", status: "closed", branches: ["All"], skills: ["Any"], applied: 200, total: 200, selected: 42, color: "from-muted/40 to-muted/10 border-border" },
  { id: "4", company: "Razorpay", logo: "RP", role: "SWE Intern", package: "₹60K/mo", deadline: "2026-03-01", status: "upcoming", branches: ["CSE"], skills: ["React", "Node.js"], applied: 0, total: 100, selected: 0, color: "from-violet-500/20 to-purple-500/10 border-violet-500/20" },
]

const STATUS: Record<string, { label: string; color: string; icon: any }> = {
  active:   { label: "Active",    color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400", icon: CheckCircle2 },
  upcoming: { label: "Upcoming",  color: "bg-blue-500/15 text-blue-600 dark:text-blue-400",         icon: Clock },
  closed:   { label: "Closed",    color: "bg-muted text-muted-foreground",                          icon: XCircle },
}

export function PlacementDrives() {
  const [rawDrives, setDrives] = useState(MOCK_DRIVES)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ company: "", role: "", package: "", deadline: "", branches: "", skills: "", description: "", minCGPA: "" })

  const handleCreate = () => {
    if (!form.company || !form.role) return
    setDrives(prev => [{
      id: Date.now().toString(),
      company: form.company,
      logo: form.company.slice(0, 2).toUpperCase(),
      role: form.role,
      package: form.package,
      deadline: form.deadline,
      status: "upcoming",
      branches: form.branches ? form.branches.split(",").map(s => s.trim()) : ["All"],
      skills: form.skills ? form.skills.split(",").map(s => s.trim()) : [],
      applied: 0, total: 100, selected: 0,
      color: "from-violet-500/20 to-purple-500/10 border-violet-500/20",
    }, ...prev])
    setForm({ company: "", role: "", package: "", deadline: "", branches: "", skills: "", description: "", minCGPA: "" })
    setShowForm(false)
  }

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

  return (
    <div className="space-y-6">

      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Placement Drives</h2>
          <p className="text-sm text-muted-foreground">Manage and track campus recruitment drives</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" /> New Drive
        </Button>
      </div>

      {/* Inline stat strip */}
      <div className="flex items-center gap-1 flex-wrap">
        {[
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
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Skills Required</Label>
              <Input placeholder="Java, DSA, React" value={form.skills} onChange={e => setForm(p => ({ ...p, skills: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Job Description</Label>
              <Textarea placeholder="Describe the role..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} className="flex-1">Create Drive</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
