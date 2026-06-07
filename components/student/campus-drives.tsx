"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Building2, Calendar, IndianRupee, Users, ExternalLink,
  RefreshCw, CheckCircle2, AlertCircle, Bell, Briefcase,
} from "lucide-react"

interface Drive {
  _id: string
  title: string
  companyName: string
  location: string
  salary: string
  type: string
  description: string
  skills: string[]
  deadline?: string
  applyUrl?: string
  collegeCode: string
  postedByRole: string
  createdAt: string
}

interface Announcement {
  id: string
  title: string
  message: string
  type: string
  createdAt: string
}

export function CampusDrives() {
  const [drives, setDrives] = useState<Drive[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [applied, setApplied] = useState<Set<string>>(new Set())

  useEffect(() => {
    setLoading(true)
    fetch("/api/student/campus-jobs")
      .then(r => r.ok ? r.json() : { onCampus: [], offCampus: [] })
      .then(d => {
        setDrives(d.onCampus ?? [])
        setAnnouncements(d.announcements ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleApply = async (driveId: string, applyUrl?: string) => {
    setApplied(prev => new Set([...prev, driveId]))
    if (applyUrl) window.open(applyUrl, "_blank")
    else {
      await fetch("/api/student/jobs/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: driveId }),
      }).catch(() => {})
    }
  }

  if (loading) return (
    <div className="flex justify-center py-12">
      <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Announcements from college */}
      {announcements.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-500" /> College Announcements
          </h3>
          {announcements.map(ann => (
            <div key={ann.id} className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
              <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{ann.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{ann.message}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">{new Date(ann.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Campus drives */}
      {drives.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="font-medium text-muted-foreground">No campus drives yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Your TPO will post campus placement drives here. Make sure your college code is set in your profile.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" /> Campus Placement Drives ({drives.length})
          </h3>
          {drives.map(drive => {
            const isApplied = applied.has(drive._id)
            const isExpired = drive.deadline ? new Date(drive.deadline) < new Date() : false
            return (
              <Card key={drive._id} className={`hover:border-primary/30 transition-colors ${isExpired ? "opacity-60" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 shrink-0 text-primary font-bold text-sm">
                      {drive.companyName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm text-foreground">{drive.title}</h4>
                        <Badge variant="secondary" className="text-xs">{drive.type}</Badge>
                        {isExpired && <Badge className="text-xs bg-red-500/10 text-red-500">Closed</Badge>}
                        {!isExpired && !isApplied && <Badge className="text-xs bg-emerald-500/10 text-emerald-600">Open</Badge>}
                        {isApplied && <Badge className="text-xs bg-blue-500/10 text-blue-600"><CheckCircle2 className="h-3 w-3 mr-1" />Applied</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{drive.companyName} · {drive.location}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{drive.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-2">
                        {drive.salary && (
                          <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" />{drive.salary}</span>
                        )}
                        {drive.deadline && (
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Deadline: {new Date(drive.deadline).toLocaleDateString()}</span>
                        )}
                      </div>
                      {drive.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {drive.skills.slice(0, 4).map(s => (
                            <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="shrink-0"
                      disabled={isApplied || isExpired}
                      onClick={() => handleApply(drive._id, drive.applyUrl)}
                    >
                      {isApplied ? "Applied" : isExpired ? "Closed" : "Apply Now"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
