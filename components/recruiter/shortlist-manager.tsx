"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus, Users, Calendar, Mail, Trash2, ArrowRight, Loader2, MoreHorizontal,
} from "lucide-react"
import { toast } from "sonner"

interface ShortlistCandidate {
  studentId: string
  name: string
  college: string
  branch?: string
  year?: number
  matchScore?: number
  stage: string
  scheduledDate?: string
  addedAt: string
}

interface Shortlist {
  _id: string
  name: string
  description?: string
  status: string
  candidates: ShortlistCandidate[]
  updatedAt: string
}

const STAGES = ["Screening", "Technical Interview", "HR Interview", "Offer Sent", "Accepted", "Rejected"]

function StageColor(stage: string) {
  const map: Record<string, string> = {
    Screening: "bg-blue-500/10 text-blue-500",
    "Technical Interview": "bg-purple-500/10 text-purple-500",
    "HR Interview": "bg-yellow-500/10 text-yellow-500",
    "Offer Sent": "bg-green-500/10 text-green-500",
    Accepted: "bg-primary/10 text-primary",
    Rejected: "bg-red-500/10 text-red-500",
  }
  return map[stage] ?? "bg-secondary text-muted-foreground"
}

function StatusBadge({ status }: { status: string }) {
  if (status === "active") return <Badge className="bg-green-500/10 text-green-500">Active</Badge>
  if (status === "reviewing") return <Badge className="bg-yellow-500/10 text-yellow-500">Reviewing</Badge>
  return <Badge variant="secondary">Closed</Badge>
}

export function ShortlistManager() {
  const [shortlists, setShortlists] = useState<Shortlist[]>([])
  const [selected, setSelected] = useState<Shortlist | null>(null)
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState("")
  const [newDesc, setNewDesc] = useState("")

  const fetchShortlists = async () => {
    try {
      const res = await fetch("/api/recruiter/shortlists")
      const data = await res.json()
      const lists: Shortlist[] = data.shortlists ?? []
      setShortlists(lists)
      if (lists.length > 0 && !selected) {
        setSelected(lists[0])
      } else if (selected) {
        // Refresh selected
        const updated = lists.find((l) => l._id === selected._id)
        if (updated) setSelected(updated)
      }
    } catch {
      toast.error("Failed to load shortlists")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShortlists()
  }, [])

  const handleCreate = async () => {
    if (!newName.trim()) {
      toast.error("Name is required")
      return
    }
    setCreating(true)
    try {
      const res = await fetch("/api/recruiter/shortlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), description: newDesc.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success("Shortlist created")
      setCreateOpen(false)
      setNewName("")
      setNewDesc("")
      await fetchShortlists()
      setSelected(data.shortlist)
    } catch (e: any) {
      toast.error(e.message ?? "Failed to create shortlist")
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteShortlist = async (id: string) => {
    if (!confirm("Delete this shortlist?")) return
    try {
      const res = await fetch(`/api/recruiter/shortlists/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? "Failed to delete shortlist")
        return
      }
      toast.success("Shortlist deleted")
      const updated = shortlists.filter((s) => s._id !== id)
      setShortlists(updated)
      setSelected(updated[0] ?? null)
    } catch {
      toast.error("Failed to delete shortlist")
    }
  }

  const handleStageChange = async (shortlistId: string, studentId: string, stage: string) => {
    try {
      await fetch(`/api/recruiter/shortlists/${shortlistId}/candidates`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, stage }),
      })
      await fetchShortlists()
    } catch {
      toast.error("Failed to update stage")
    }
  }

  const handleRemoveCandidate = async (shortlistId: string, studentId: string) => {
    if (!confirm("Remove this candidate from the shortlist?")) return
    try {
      await fetch(`/api/recruiter/shortlists/${shortlistId}/candidates`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      })
      toast.success("Candidate removed")
      await fetchShortlists()
    } catch {
      toast.error("Failed to remove candidate")
    }
  }

  const handleStatusChange = async (shortlistId: string, status: string) => {
    try {
      await fetch(`/api/recruiter/shortlists/${shortlistId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      await fetchShortlists()
    } catch {
      toast.error("Failed to update status")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Shortlist list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Your Shortlists</h2>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Shortlist</DialogTitle>
                <DialogDescription>Organize candidates into a named shortlist</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Shortlist Name *</Label>
                  <Input
                    placeholder="e.g., SDE Intern 2025"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe this shortlist..."
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={handleCreate} disabled={creating}>
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Shortlist"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {shortlists.length === 0 ? (
          <Card className="bg-card">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Users className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                No shortlists yet. Create one and add candidates from the Search page.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {shortlists.map((list) => (
              <Card
                key={list._id}
                className={`cursor-pointer bg-card transition-colors hover:bg-secondary/50 ${
                  selected?._id === list._id ? "border-primary" : ""
                }`}
                onClick={() => setSelected(list)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{list.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {list.candidates.length} candidate{list.candidates.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <StatusBadge status={list.status} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Shortlist detail */}
      <div className="lg:col-span-2 space-y-4">
        {!selected ? (
          <Card className="bg-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Users className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-lg font-medium">Select a shortlist</p>
              <p className="text-sm text-muted-foreground mt-1">
                Choose a shortlist from the left or create a new one
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{selected.name}</CardTitle>
                {selected.description && (
                  <p className="text-sm text-muted-foreground">{selected.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Select value={selected.status} onValueChange={(v) => handleStatusChange(selected._id, v)}>
                  <SelectTrigger className="w-32 h-8 text-xs bg-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="reviewing">Reviewing</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeleteShortlist(selected._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Pipeline summary */}
              <div className="mb-6 flex items-center gap-4 rounded-lg bg-secondary/50 p-4 overflow-x-auto">
                {["Screening", "Technical Interview", "HR Interview", "Offer Sent"].map((stage, index, arr) => {
                  const count = selected.candidates.filter((c) => c.stage === stage).length
                  return (
                    <div key={stage} className="flex items-center gap-2 shrink-0">
                      <div className="text-center">
                        <p className="text-lg font-semibold text-foreground">{count}</p>
                        <p className="text-xs text-muted-foreground">{stage}</p>
                      </div>
                      {index < arr.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  )
                })}
              </div>

              {selected.candidates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Users className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No candidates yet. Add them from the Search page.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selected.candidates.map((candidate) => (
                    <div
                      key={candidate.studentId}
                      className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {candidate.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{candidate.name}</p>
                          <p className="text-sm text-muted-foreground">{candidate.college}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap justify-end">
                        {candidate.matchScore ? (
                          <Badge className="bg-primary/10 text-primary">
                            {candidate.matchScore}% match
                          </Badge>
                        ) : null}
                        <Badge className={StageColor(candidate.stage)}>{candidate.stage}</Badge>
                        {candidate.scheduledDate && (
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {candidate.scheduledDate}
                          </span>
                        )}
                        <Select
                          value={candidate.stage}
                          onValueChange={(v) => handleStageChange(selected._id, candidate.studentId, v)}
                        >
                          <SelectTrigger className="h-8 w-36 bg-transparent text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STAGES.map((stage) => (
                              <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleRemoveCandidate(selected._id, candidate.studentId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
