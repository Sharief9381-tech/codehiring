"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Bell, Plus, Megaphone, GraduationCap, Building2, Clock, Pin, Trash2 } from "lucide-react"

interface Announcement {
  id: string; title: string; message: string; audience: string
  branch: string | null; year: string | null; type: string
  createdAt: string; pinned: boolean
}

const MOCK: Announcement[] = [
  { id: "1", title: "Google Campus Drive – Register Now", message: "Google visits Feb 20. Eligible: CSE/IT 2026, 7+ CGPA. Register by Feb 15.", audience: "all", branch: null, year: null, type: "drive", createdAt: "2026-01-18", pinned: true },
  { id: "2", title: "Infosys Resume Deadline Extended", message: "Resume submission for Infosys drive extended to Feb 22.", audience: "branch", branch: "CSE", year: null, type: "alert", createdAt: "2026-01-17", pinned: false },
  { id: "3", title: "Mock Interview Session – Jan 25", message: "Mock interviews for 4th year. Seminar Hall, 10 AM – 4 PM.", audience: "year", branch: null, year: "4th Year", type: "training", createdAt: "2026-01-16", pinned: false },
  { id: "4", title: "DSA Workshop – Microsoft", message: "Microsoft is conducting a 2-day DSA workshop for all branches. Seats limited.", audience: "all", branch: null, year: null, type: "training", createdAt: "2026-01-15", pinned: false },
  { id: "5", title: "Placement Brochure Submission", message: "Final placement brochure to be submitted by Jan 30. Contact TPO for format.", audience: "all", branch: null, year: null, type: "general", createdAt: "2026-01-14", pinned: false },
]

const TYPE_CONFIG: Record<string, { gradient: string; badge: string; icon: any }> = {
  drive:    { gradient: "from-violet-500/15 to-purple-500/5 border-violet-500/20",  badge: "bg-violet-500/15 text-violet-600",  icon: Building2   },
  alert:    { gradient: "from-amber-500/15 to-orange-500/5 border-amber-500/20",    badge: "bg-amber-500/15 text-amber-600",    icon: Bell        },
  training: { gradient: "from-blue-500/15 to-cyan-500/5 border-blue-500/20",        badge: "bg-blue-500/15 text-blue-600",      icon: GraduationCap },
  general:  { gradient: "from-emerald-500/15 to-teal-500/5 border-emerald-500/20",  badge: "bg-emerald-500/15 text-emerald-600", icon: Megaphone   },
}

export function Announcements() {
  const [list, setList] = useState<Announcement[]>(MOCK)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: "", message: "", audience: "all", branch: "", year: "", type: "general" })

  const handleCreate = () => {
    if (!form.title || !form.message) return
    fetch("/api/college/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).catch(() => {})
    setList(prev => [{
      id: Date.now().toString(),
      title: form.title, message: form.message,
      audience: form.audience, branch: form.branch || null, year: form.year || null,
      type: form.type, createdAt: new Date().toISOString().split("T")[0], pinned: false,
    }, ...prev])
    setForm({ title: "", message: "", audience: "all", branch: "", year: "", type: "general" })
    setShowForm(false)
  }

  const togglePin = (id: string) => setList(prev => prev.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a))
  const del = (id: string) => setList(prev => prev.filter(a => a.id !== id))

  const sorted = [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned))

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Announcements</h2>
          <p className="text-sm text-muted-foreground">Send updates and alerts to students</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" /> New
        </Button>
      </div>

      {/* Inline stat pills */}
      <div className="flex items-center gap-1 flex-wrap">
        {[
          { label: "Total",    value: list.length,                                   color: "bg-primary/10 text-primary" },
          { label: "Pinned",   value: list.filter(a => a.pinned).length,             color: "bg-amber-500/10 text-amber-600" },
          { label: "Drives",   value: list.filter(a => a.type === "drive").length,   color: "bg-violet-500/10 text-violet-600" },
          { label: "Training", value: list.filter(a => a.type === "training").length, color: "bg-blue-500/10 text-blue-600" },
          { label: "Alerts",   value: list.filter(a => a.type === "alert").length,   color: "bg-amber-500/10 text-amber-600" },
        ].map(s => (
          <span key={s.label} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.color}`}>
            <span className="text-sm font-black">{s.value}</span> {s.label}
          </span>
        ))}
      </div>

      {/* 3-column grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map(ann => {
          const cfg = TYPE_CONFIG[ann.type] ?? TYPE_CONFIG.general
          const Icon = cfg.icon
          return (
            <Card
              key={ann.id}
              className={`bg-gradient-to-br ${cfg.gradient} border overflow-hidden group hover:shadow-md transition-all ${ann.pinned ? "ring-1 ring-primary/30" : ""}`}
            >
              <CardContent className="p-4 flex flex-col gap-3 h-full">
                {/* Icon + type + pin */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/60 backdrop-blur shrink-0">
                      <Icon className={`h-4 w-4 ${cfg.badge.replace("bg-", "text-").replace("/15", "/90")}`} />
                    </div>
                    <Badge className={`text-[10px] px-2 py-0.5 ${cfg.badge}`}>{ann.type}</Badge>
                    {ann.pinned && <Pin className="h-3 w-3 text-primary" />}
                  </div>
                  <Badge variant="secondary" className="text-[10px] px-2 py-0.5 shrink-0">
                    {ann.audience === "all" ? "All" : ann.audience === "branch" ? ann.branch : ann.year}
                  </Badge>
                </div>

                {/* Title + message */}
                <div className="flex-1">
                  <p className="font-semibold text-sm text-foreground leading-snug line-clamp-2">{ann.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{ann.message}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-border/40 mt-auto">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />{ann.createdAt}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost" size="sm"
                      className={`h-6 w-6 p-0 ${ann.pinned ? "text-primary" : "text-muted-foreground"}`}
                      onClick={() => togglePin(ann.id)}
                    >
                      <Pin className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive hover:text-destructive" onClick={() => del(ann.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {/* "+" add card */}
        <button
          onClick={() => setShowForm(true)}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all min-h-[180px] text-muted-foreground hover:text-primary"
        >
          <Plus className="h-8 w-8 opacity-40" />
          <span className="text-sm font-medium">New Announcement</span>
        </button>
      </div>

      {/* Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New Announcement</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Title *</Label>
              <Input placeholder="Announcement title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Message *</Label>
              <Textarea placeholder="Write your announcement..." rows={3} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Type</Label>
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="drive">Drive</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Audience</Label>
                <Select value={form.audience} onValueChange={v => setForm(p => ({ ...p, audience: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="branch">By Branch</SelectItem>
                    <SelectItem value="year">By Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.audience === "branch" && (
                <div className="space-y-1.5 col-span-2">
                  <Label className="text-xs">Branch</Label>
                  <Input placeholder="e.g. CSE" value={form.branch} onChange={e => setForm(p => ({ ...p, branch: e.target.value }))} />
                </div>
              )}
              {form.audience === "year" && (
                <div className="space-y-1.5 col-span-2">
                  <Label className="text-xs">Year</Label>
                  <Select value={form.year} onValueChange={v => setForm(p => ({ ...p, year: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                    <SelectContent>
                      {["1st Year","2nd Year","3rd Year","4th Year"].map(y => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleCreate} className="flex-1">Send Announcement</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
