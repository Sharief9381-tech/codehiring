"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus, Briefcase, MapPin, IndianRupee, Calendar, Users,
  Eye, Edit, Trash2, Clock, CheckCircle, XCircle, Loader2,
  Code2, Star, GitBranch, ExternalLink,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Job {
  _id: string
  title: string
  type: string
  location: string
  salary: string
  description: string
  skills: string[]
  deadline?: string
  minProblems?: number
  minRating?: number
  minCGPA?: number
  allowedBranches?: string[]     // e.g. ["CSE", "IT", "ECE"]
  allowedGradYears?: number[]    // e.g. [2025, 2026]
  allowedDegrees?: string[]      // e.g. ["B.Tech", "B.E.", "MCA"]
  status: "active" | "draft" | "closed"
  applications: number
  views: number
  companyName: string
  createdAt: string
}

const EMPTY_FORM = {
  title: "", type: "Internship", location: "", salary: "",
  description: "", skills: "", deadline: "",
  minProblems: "", minRating: "", minCGPA: "",
  allowedBranches: "",
  allowedGradYears: "",
  allowedDegrees: "",
  companyName: "", status: "active" as "active" | "draft",
}

function StatusBadge({ status }: { status: string }) {
  if (status === "active")
    return <Badge className="gap-1 bg-green-500/10 text-green-500"><CheckCircle className="h-3 w-3" />Active</Badge>
  if (status === "draft")
    return <Badge className="gap-1 bg-yellow-500/10 text-yellow-500"><Clock className="h-3 w-3" />Draft</Badge>
  return <Badge className="gap-1 bg-red-500/10 text-red-500"><XCircle className="h-3 w-3" />Closed</Badge>
}

export function JobPostings() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editJob, setEditJob] = useState<Job | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [statusFilter, setStatusFilter] = useState("all")

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/recruiter/jobs")
      const data = await res.json()
      setJobs(data.jobs ?? [])
    } catch {
      toast.error("Failed to load job postings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchJobs() }, [])

  const openCreate = () => {
    setEditJob(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  const openEdit = (job: Job) => {
    setEditJob(job)
    setForm({
      title: job.title,
      type: job.type,
      location: job.location,
      salary: job.salary,
      description: job.description,
      skills: job.skills.join(", "),
      deadline: job.deadline ?? "",
      minProblems: String(job.minProblems ?? ""),
      minRating: String(job.minRating ?? ""),
      minCGPA: String(job.minCGPA ?? ""),
      allowedBranches: (job.allowedBranches ?? []).join(", "),
      allowedGradYears: (job.allowedGradYears ?? []).join(", "),
      allowedDegrees: (job.allowedDegrees ?? []).join(", "),
      companyName: job.companyName,
      status: job.status === "closed" ? "active" : job.status,
    })
    setDialogOpen(true)
  }

  const handleSubmit = async (publishStatus: "active" | "draft") => {
    if (!form.title || !form.type || !form.location || !form.description) {
      toast.error("Title, type, location, and description are required")
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        status: publishStatus,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        minProblems: form.minProblems ? Number(form.minProblems) : 0,
        minRating: form.minRating ? Number(form.minRating) : 0,
        minCGPA: form.minCGPA ? Number(form.minCGPA) : 0,
        allowedBranches: form.allowedBranches
          ? form.allowedBranches.split(",").map(s => s.trim().toUpperCase()).filter(Boolean)
          : [],
        allowedGradYears: form.allowedGradYears
          ? form.allowedGradYears.split(",").map(s => Number(s.trim())).filter(Boolean)
          : [],
        allowedDegrees: form.allowedDegrees
          ? form.allowedDegrees.split(",").map(s => s.trim()).filter(Boolean)
          : [],
      }

      if (editJob) {
        await fetch(`/api/recruiter/jobs/${editJob._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        toast.success("Job updated successfully")
      } else {
        const res = await fetch("/api/recruiter/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Failed to create")
        toast.success(publishStatus === "active" ? "Job published!" : "Saved as draft")
      }

      setDialogOpen(false)
      fetchJobs()
    } catch {
      toast.error("Failed to save job posting")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job posting?")) return
    try {
      await fetch(`/api/recruiter/jobs/${id}`, { method: "DELETE" })
      toast.success("Job deleted")
      setJobs((prev) => prev.filter((j) => j._id !== id))
    } catch {
      toast.error("Failed to delete job")
    }
  }

  const handleStatusChange = async (id: string, status: "active" | "closed") => {
    try {
      await fetch(`/api/recruiter/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      setJobs((prev) => prev.map((j) => j._id === id ? { ...j, status } : j))
      toast.success(`Job ${status === "active" ? "reopened" : "closed"}`)
    } catch {
      toast.error("Failed to update status")
    }
  }

  const filtered = jobs.filter((j) => statusFilter === "all" || j.status === statusFilter)
  const activeCount = jobs.filter((j) => j.status === "active").length
  const totalApps = jobs.reduce((s, j) => s + j.applications, 0)
  const totalViews = jobs.reduce((s, j) => s + j.views, 0)

  // ── Applicants dialog state ──────────────────────────────────────────────
  const [applicantsJobId, setApplicantsJobId] = useState<string | null>(null)
  const [applicantsJobTitle, setApplicantsJobTitle] = useState("")
  const [applicants, setApplicants] = useState<any[]>([])
  const [applicantsLoading, setApplicantsLoading] = useState(false)

  const openApplicants = async (job: Job) => {
    setApplicantsJobId(job._id)
    setApplicantsJobTitle(job.title)
    setApplicants([])
    setApplicantsLoading(true)
    try {
      const res = await fetch(`/api/recruiter/jobs/${job._id}/applicants`)
      const data = await res.json()
      setApplicants(data.applicants ?? [])
    } catch { toast.error("Failed to load applicants") }
    finally { setApplicantsLoading(false) }
  }

  const updateApplicantStatus = async (studentId: string, status: string) => {
    if (!applicantsJobId) return
    try {
      await fetch(`/api/recruiter/jobs/${applicantsJobId}/applicants`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, status }),
      })
      setApplicants(prev => prev.map(a => a.studentId === studentId ? { ...a, status } : a))
      toast.success(`Applicant ${status}`)
    } catch { toast.error("Failed to update status") }
  }

  const STATUS_COLORS: Record<string, string> = {
    applied:     "bg-blue-500/10 text-blue-600",
    shortlisted: "bg-emerald-500/10 text-emerald-600",
    rejected:    "bg-red-500/10 text-red-600",
    hired:       "bg-purple-500/10 text-purple-600",
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/recruiter/jobs">
          <Card className="bg-card cursor-pointer hover:bg-secondary/50 hover:border-primary/40 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-2"><Briefcase className="h-5 w-5 text-primary" /></div>
              <div><p className="text-2xl font-bold">{activeCount}</p><p className="text-sm text-muted-foreground">Active Postings</p></div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/recruiter/pipeline">
          <Card className="bg-card cursor-pointer hover:bg-secondary/50 hover:border-primary/40 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-lg bg-blue-500/10 p-2"><Users className="h-5 w-5 text-blue-500" /></div>
              <div><p className="text-2xl font-bold">{totalApps}</p><p className="text-sm text-muted-foreground">Total Applications</p></div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/recruiter/jobs">
          <Card className="bg-card cursor-pointer hover:bg-secondary/50 hover:border-primary/40 transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="rounded-lg bg-green-500/10 p-2"><Eye className="h-5 w-5 text-green-500" /></div>
              <div><p className="text-2xl font-bold">{totalViews}</p><p className="text-sm text-muted-foreground">Total Views</p></div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-secondary">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Create Job Posting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editJob ? "Edit Job Posting" : "Create Job Posting"}</DialogTitle>
              <DialogDescription>Fill in the details to {editJob ? "update" : "create"} a job posting</DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] space-y-4 overflow-y-auto py-4 pr-1">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Job Title *</Label>
                  <Input placeholder="e.g., Software Engineer Intern" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Job Type *</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input placeholder="Your company name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Location *</Label>
                  <Input placeholder="e.g., Bangalore, India / Remote" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Salary Range</Label>
                  <Input placeholder="e.g., 80,000 - 1,20,000/month" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Application Deadline</Label>
                  <Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Required Skills (comma separated)</Label>
                <Input placeholder="Python, Java, Data Structures, React" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label>Job Description *</Label>
                <Textarea placeholder="Describe the role, responsibilities, and requirements..." rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label>Minimum Requirements <span className="text-xs text-muted-foreground">(used for student matching)</span></Label>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Min. Problems Solved</Label>
                    <Input type="number" placeholder="e.g. 100" value={form.minProblems} onChange={(e) => setForm({ ...form, minProblems: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Min. Rating</Label>
                    <Input type="number" placeholder="e.g. 1400" value={form.minRating} onChange={(e) => setForm({ ...form, minRating: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Min. CGPA</Label>
                    <Input type="number" step="0.1" placeholder="e.g. 7.0" value={form.minCGPA} onChange={(e) => setForm({ ...form, minCGPA: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Eligible Candidates <span className="text-xs text-muted-foreground">(leave blank = all)</span></Label>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Graduation Year(s)</Label>
                    <Input placeholder="e.g. 2025, 2026" value={form.allowedGradYears} onChange={(e) => setForm({ ...form, allowedGradYears: e.target.value })} />
                    <p className="text-xs text-muted-foreground">Comma-separated years</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Branch(es)</Label>
                    <Input placeholder="e.g. CSE, IT, ECE" value={form.allowedBranches} onChange={(e) => setForm({ ...form, allowedBranches: e.target.value })} />
                    <p className="text-xs text-muted-foreground">Comma-separated branches</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Degree(s)</Label>
                    <Input placeholder="e.g. B.Tech, B.E., MCA" value={form.allowedDegrees} onChange={(e) => setForm({ ...form, allowedDegrees: e.target.value })} />
                    <p className="text-xs text-muted-foreground">Comma-separated degrees</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => handleSubmit("draft")} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save as Draft"}
                </Button>
                <Button className="flex-1" onClick={() => handleSubmit("active")} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editJob ? "Update Posting" : "Publish Posting"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Job list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="bg-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-lg font-medium">No job postings yet</p>
            <p className="text-sm text-muted-foreground mt-1">Create your first job posting to start attracting candidates</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((job) => (
            <Card key={job._id} className="bg-card">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <StatusBadge status={job.status} />
                        <Badge variant="secondary">{job.type}</Badge>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        {job.companyName && <span className="font-medium text-foreground">{job.companyName}</span>}
                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>
                        {job.salary && <span className="flex items-center gap-1"><IndianRupee className="h-4 w-4" />{job.salary}</span>}
                        {job.deadline && <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Deadline: {job.deadline}</span>}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                    {job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((s) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                      </div>
                    )}
                    {(job.minProblems || job.minRating) ? (
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        {job.minProblems ? <span>Min problems: <strong>{job.minProblems}</strong></span> : null}
                        {job.minRating ? <span>Min rating: <strong>{job.minRating}</strong></span> : null}
                        {job.minCGPA ? <span>Min CGPA: <strong>{job.minCGPA}</strong></span> : null}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    <div className="flex items-center gap-6 text-center">
                      <div><p className="text-lg font-semibold">{job.views}</p><p className="text-xs text-muted-foreground">Views</p></div>
                      <div><p className="text-lg font-semibold">{job.applications}</p><p className="text-xs text-muted-foreground">Applications</p></div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1 bg-transparent" onClick={() => openApplicants(job)}>
                        <Users className="h-4 w-4" />
                        Applicants {job.applications > 0 && <Badge className="ml-1 text-xs bg-primary/10 text-primary">{job.applications}</Badge>}
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1 bg-transparent" onClick={() => openEdit(job)}>
                        <Edit className="h-4 w-4" />Edit
                      </Button>
                      {job.status === "active" ? (
                        <Button variant="outline" size="sm" className="gap-1 bg-transparent text-orange-500 border-orange-500/30" onClick={() => handleStatusChange(job._id, "closed")}>
                          <XCircle className="h-4 w-4" />Close
                        </Button>
                      ) : job.status === "closed" ? (
                        <Button variant="outline" size="sm" className="gap-1 bg-transparent text-green-500 border-green-500/30" onClick={() => handleStatusChange(job._id, "active")}>
                          <CheckCircle className="h-4 w-4" />Reopen
                        </Button>
                      ) : null}
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(job._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Applicants Dialog ─────────────────────────────────────────────── */}
      <Dialog open={!!applicantsJobId} onOpenChange={open => !open && setApplicantsJobId(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Applicants — {applicantsJobTitle}
            </DialogTitle>
            <DialogDescription>
              {applicants.length} candidate{applicants.length !== 1 ? "s" : ""} applied
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 mt-2">
            {applicantsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : applicants.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No applicants yet</p>
              </div>
            ) : (
              <div className="space-y-3 pr-2">
                {applicants.map((a: any) => (
                  <div key={a.studentId} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                          {a.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-foreground">{a.name}</p>
                          {a.isGraduate && <Badge className="text-xs bg-blue-500/10 text-blue-600">Graduate</Badge>}
                          <Badge className={`text-xs ${STATUS_COLORS[a.status] ?? STATUS_COLORS.applied}`}>
                            {a.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{a.email}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {a.college}{a.branch ? ` · ${a.branch}` : ""}{a.graduationYear ? ` · ${a.graduationYear}` : ""}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Code2 className="h-3 w-3" />{a.totalProblems} problems</span>
                          {a.highestRating > 0 && <span className="flex items-center gap-1"><Star className="h-3 w-3" />{a.highestRating} rating</span>}
                          {a.githubContributions > 0 && <span className="flex items-center gap-1"><GitBranch className="h-3 w-3" />{a.githubContributions} contrib</span>}
                          <span>{a.platforms?.join(", ")}</span>
                        </div>
                        {a.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {a.skills.slice(0, 5).map((s: string) => (
                              <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5 shrink-0">
                        {a.linkedinUrl && (
                          <a href={a.linkedinUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="gap-1.5 bg-transparent text-xs h-7">
                              <ExternalLink className="h-3 w-3" />LinkedIn
                            </Button>
                          </a>
                        )}
                        <Link href={`/u/${a.name?.toLowerCase().replace(/\s+/g, "-")}`} target="_blank">
                          <Button variant="outline" size="sm" className="gap-1.5 bg-transparent text-xs h-7 w-full">
                            <Eye className="h-3 w-3" />Profile
                          </Button>
                        </Link>
                        {a.status === "applied" && (
                          <Button size="sm" className="gap-1.5 text-xs h-7 bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => updateApplicantStatus(a.studentId, "shortlisted")}>
                            <CheckCircle className="h-3 w-3" />Shortlist
                          </Button>
                        )}
                        {(a.status === "applied" || a.status === "shortlisted") && (
                          <Button size="sm" variant="outline" className="gap-1.5 text-xs h-7 text-red-500 border-red-500/30 bg-transparent"
                            onClick={() => updateApplicantStatus(a.studentId, "rejected")}>
                            <XCircle className="h-3 w-3" />Reject
                          </Button>
                        )}
                        {a.status === "shortlisted" && (
                          <Button size="sm" className="gap-1.5 text-xs h-7 bg-purple-600 hover:bg-purple-700"
                            onClick={() => updateApplicantStatus(a.studentId, "hired")}>
                            ✓ Hire
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Applied {new Date(a.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
