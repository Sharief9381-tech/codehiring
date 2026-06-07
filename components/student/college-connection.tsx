"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Building2, Users, Trophy, TrendingUp, ExternalLink, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CollegeInfo {
  name: string
  code: string
  location?: string
  totalStudents?: number
  placementRate?: number
  avgProblems?: number
  yourRank?: number
}

export function CollegeConnection({ collegeCode }: { collegeCode?: string }) {
  const [info, setInfo] = useState<CollegeInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!collegeCode) { setLoading(false); return }
    fetch("/api/student/ranking")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) {
          setInfo({
            name: d.collegeName ?? collegeCode,
            code: collegeCode,
            location: d.collegeLocation,
            totalStudents: d.totalCollege,
            placementRate: d.placementRate,
            avgProblems: d.avgProblems,
            yourRank: d.collegeRank,
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [collegeCode])

  if (!collegeCode) return null

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-emerald-500" />
          <span className="text-sm font-semibold text-foreground">Your College</span>
        </div>
        {loading && <RefreshCw className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
      </div>

      {!loading && (
        <div className="space-y-2">
          <div>
            <p className="font-medium text-foreground">{info?.name ?? collegeCode}</p>
            <p className="text-xs text-muted-foreground">Code: {collegeCode}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {info?.yourRank != null && (
              <div className="rounded-lg bg-emerald-500/10 p-2 text-center">
                <p className="font-bold text-emerald-600 text-sm">#{info.yourRank}</p>
                <p className="text-xs text-muted-foreground">College Rank</p>
              </div>
            )}
            {info?.totalStudents != null && (
              <div className="rounded-lg bg-blue-500/10 p-2 text-center">
                <p className="font-bold text-blue-600 text-sm">{info.totalStudents}</p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
            )}
          </div>
          <Link href="/student/jobs" className="flex items-center gap-1.5 text-xs text-primary hover:underline">
            <ExternalLink className="h-3 w-3" /> View campus drives
          </Link>
        </div>
      )}
    </div>
  )
}
