"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus, Briefcase, MapPin, IndianRupee, Calendar, Users,
  Eye, Edit, Trash2, Clock, CheckCircle, XCircle, Loader2,
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
  companyName: "", status: "active" as "active" | "draft",
  applyUrl: "",
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
      companyName: job.companyName,
      status: job.status === "closed" ? "active" : job.status,
      applyUrl: (job as any).applyUrl ?? "",
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
                <div className="space-y-2 md:col-span-2">
                  <Label>Apply Link <span className="text-xs text-muted-foreground">(URL where students apply)</span></Label>
                  <Input placeholder="https://yourcompany.com/careers/apply or mailto:hr@company.com" value={form.applyUrl} onChange={(e) => setForm({ ...form, applyUrl: e.target.value })} />
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
    </div>
  )
}
