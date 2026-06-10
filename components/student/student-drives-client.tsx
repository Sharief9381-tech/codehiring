"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Link from "next/link"
import {
  Briefcase, MapPin, Calendar, Users, ChevronRight,
  CheckCircle2, Clock, Loader2, Building2, Star, Globe,
  FileText, Target, ArrowRight, Trophy, XCircle, Sparkles,
} from "lucide-react"

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active:      { label: "Applications Open",  color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  assessment:  { label: "Assessment Phase",   color: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  shortlisted: { label: "Shortlisting Done",  color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  screening:   { label: "Screening",          color: "bg-pink-500/10 text-pink-600 dark:text-pink-400" },
  interviews:  { label: "Interviews",         color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  completed:   { label: "Completed",          color: "bg-muted text-muted-foreground" },
}

const MY_STATUS: Record<string, { label: string; color: string; icon: any }> = {
  applied:      { label: "Applied",      color: "text-blue-500",    icon: Clock },
  shortlisted:  { label: "Shortlisted",  color: "text-emerald-500", icon: CheckCircle2 },
  rejected:     { label: "Not Selected", color: "text-red-500",     icon: XCircle },
  hired:        { label: "Selected",     color: "text-violet-500",  icon: Trophy },
  offer_sent:   { label: "Offer Sent",   color: "text-amber-500",   icon: Sparkles },
}

// A drive is "On-Campus" if it was posted by the student's college
function isOnCampus(drive: any, student: any): boolean {
  if (!student?.collegeCode) return false
  return (
    drive.postedByRole === "college" ||
    drive.collegeCode === student.collegeCode ||
    drive.eligibility?.collegeCodes?.includes(student.collegeCode)
  )
}

export function StudentDrivesClient({ student }: { student: any }) {
  const [drives, setDrives]       = useState<any[]>([])
  const [myDrives, setMyDrives]   = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [applying, setApplying]   = useState<string | null>(null)
  const [applied, setApplied]     = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<"available" | "campus" | "offcampus" | "mine">("available")

  useEffect(() => {
    Promise.all([
      fetch("/api/drives").then(r => r.ok ? r.json() : { drives: [] }),
      fetch("/api/student/my-drives").then(r => r.ok ? r.json() : { drives: [] }),
    ]).then(([avail, mine]) => {
      setDrives(avail.drives || [])
      const myList = mine.drives || []
      setMyDrives(myList)
      setApplied(new Set(myList.map((d: any) => d._id)))
    }).finally(() => setLoading(false))
  }, [])

  async function applyToDrive(driveId: string) {
    setApplying(driveId)
    try {
      const res = await fetch(`/api/drives/${driveId}/apply`, { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        toast.success("Application submitted successfully!")
        setApplied(prev => new Set([...prev, driveId]))
      } else if (data.alreadyApplied) {
        toast.info("You've already applied to this drive")
        setApplied(prev => new Set([...prev, driveId]))
      } else {
        toast.error(data.error || "Failed to apply")
      }
    } catch { toast.error("Network error") }
    setApplying(null)
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-1 border-b border-border pb-px">
        {[
          { id: "available", label: `Available Drives (${drives.length})` },
          { id: "campus",    label: `On-Campus (${drives.filter((d: any) => isOnCampus(d, student)).length})` },
          { id: "offcampus", label: `Off-Campus (${drives.filter((d: any) => !isOnCampus(d, student)).length})` },
          { id: "mine",      label: `My Applications (${myDrives.length})` },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-all
              ${activeTab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* MY APPLICATIONS */}
      {activeTab === "mine" && (
        myDrives.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-border bg-card">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm font-semibold text-foreground">No applications yet</p>
            <p className="text-xs text-muted-foreground mt-1">Apply to a drive to track your status here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myDrives.map((d: any, i: number) => {
              const st = MY_STATUS[d.myStatus] ?? MY_STATUS.applied
              const StIcon = st.icon
              return (
                <motion.div key={d._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="rounded-2xl border border-border bg-card p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-black text-primary shrink-0">
                    {d.companyName?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground">{d.title}</p>
                    <p className="text-sm text-primary">{d.companyName}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{d.type}</span>
                      {d.appliedAt && <span>Applied {new Date(d.appliedAt).toLocaleDateString()}</span>}
                    </div>
                    {d.assessmentScore != null && (
                      <p className="text-xs mt-1">
                        <span className="text-violet-500 font-bold">Assessment: {d.assessmentScore}%</span>
                        {d.assessmentRank && <span className="text-amber-500 font-bold ml-2">Rank #{d.assessmentRank}</span>}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`flex items-center gap-1 text-xs font-bold ${st.color}`}>
                      <StIcon className="h-3.5 w-3.5" />{st.label}
                    </span>
                    {d.status === "assessment" && d.assessmentId && d.myStatus === "applied" && (
                      <Link href={`/student/assessment/${d._id}`}>
                        <Button size="sm" variant="outline" className="gap-1 text-xs h-7 border-violet-500/30 text-violet-500">
                          <FileText className="h-3 w-3" />Take Test
                        </Button>
                      </Link>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )
      )}

      {/* AVAILABLE / ON-CAMPUS / OFF-CAMPUS DRIVES */}
      {(activeTab === "available" || activeTab === "campus" || activeTab === "offcampus") && (() => {
        const filtered = activeTab === "campus"
          ? drives.filter(d => isOnCampus(d, student))
          : activeTab === "offcampus"
          ? drives.filter(d => !isOnCampus(d, student))
          : drives

        if (filtered.length === 0) return (
          <div className="text-center py-20 rounded-2xl border border-dashed border-border bg-card">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm font-semibold text-foreground">
              {activeTab === "campus" ? "No on-campus drives from your college yet" :
               activeTab === "offcampus" ? "No off-campus drives available right now" :
               "No active drives right now"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {activeTab === "campus"
                ? "Your college will post campus drives here"
                : "New hiring drives will appear here when they go live"}
            </p>
          </div>
        )

        return (
          <div className="space-y-4">
            {activeTab === "campus" && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/8 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400">
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                <span className="font-semibold">On-Campus Drives</span>
                <span className="text-muted-foreground font-normal">— posted by your college for your batch</span>
              </div>
            )}
            {activeTab === "offcampus" && (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/8 border border-blue-500/20 text-xs text-blue-600 dark:text-blue-400">
                <Globe className="h-3.5 w-3.5 shrink-0" />
                <span className="font-semibold">Off-Campus Drives</span>
                <span className="text-muted-foreground font-normal">— open to all eligible candidates</span>
              </div>
            )}
            {filtered.map((drive, i) => {
              const cfg = STATUS_LABELS[drive.status] ?? STATUS_LABELS.active
              const isApplied = applied.has(drive._id)
              const campus = isOnCampus(drive, student)
              const hasAssessment = drive.status === "assessment" && drive.assessmentId
              const deadline = drive.applicationDeadline ? new Date(drive.applicationDeadline) : null
              const deadlinePassed = deadline && deadline < new Date()
              return (
                <motion.div key={drive._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`rounded-2xl border bg-card p-5 hover:border-primary/20 transition-all ${
                    campus ? "border-emerald-500/20" : "border-border"}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-lg font-black text-primary">
                      {drive.companyName?.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-foreground">{drive.title}</h3>
                            {campus ? (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                <Building2 className="h-2.5 w-2.5" />ON-CAMPUS
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1">
                                <Globe className="h-2.5 w-2.5" />OFF-CAMPUS
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-primary font-medium">{drive.companyName}</p>
                        </div>
                        <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
                        <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{drive.type}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{drive.location}</span>
                        {drive.salary && <span className="flex items-center gap-1"><Star className="h-3 w-3" />{drive.salary}</span>}
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{drive.openPositions} position{drive.openPositions > 1 ? "s" : ""}</span>
                        {deadline && (
                          <span className={`flex items-center gap-1 ${deadlinePassed ? "text-red-500" : ""}`}>
                            <Calendar className="h-3 w-3" />
                            {deadlinePassed ? "Deadline passed" : `Deadline: ${deadline.toLocaleDateString()}`}
                          </span>
                        )}
                      </div>
                      {drive.selectionProcess?.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                          {drive.selectionProcess.map((step: string, si: number) => (
                            <span key={si} className="flex items-center gap-1">
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{step}</span>
                              {si < drive.selectionProcess.length - 1 && <ArrowRight className="h-2.5 w-2.5 text-muted-foreground/40" />}
                            </span>
                          ))}
                        </div>
                      )}
                      {(drive.eligibility?.branches?.length > 0 || drive.eligibility?.graduationYears?.length > 0) && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {drive.eligibility.graduationYears?.map((y: number) => (
                            <span key={y} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">Class of {y}</span>
                          ))}
                          {drive.eligibility.branches?.slice(0, 3).map((b: string) => (
                            <span key={b} className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-500">{b}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
                        {isApplied ? (
                          <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" /> Applied
                          </span>
                        ) : drive.status === "active" && !deadlinePassed ? (
                          <Button size="sm" onClick={() => applyToDrive(drive._id)} disabled={applying === drive._id}
                            className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground">
                            {applying === drive._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowRight className="h-3.5 w-3.5" />}
                            Apply Now
                          </Button>
                        ) : null}
                        {hasAssessment && isApplied && (
                          <Link href={`/student/assessment/${drive._id}`}>
                            <Button size="sm" variant="outline" className="gap-1.5 border-violet-500/30 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10">
                              <FileText className="h-3.5 w-3.5" /> Take Assessment
                            </Button>
                          </Link>
                        )}
                        <span className="text-xs text-muted-foreground ml-auto">{drive.applicationCount || 0} applied</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )
      })()}
    </div>
  )
}
