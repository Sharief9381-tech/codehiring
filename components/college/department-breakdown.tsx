"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, Building2 } from "lucide-react"

interface Department {
  name: string; students: number; avgProblems: number
  placementRate: number; placed: number; interviewing: number; searching: number
}

const BAR_COLORS = ["bg-violet-500", "bg-blue-500", "bg-cyan-500", "bg-amber-500", "bg-emerald-500"]

export function DepartmentBreakdown() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/college/dashboard")
      if (res.ok) { const d = await res.json(); setDepartments(d.departments ?? []) }
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/10">
            <Building2 className="h-4 w-4 text-violet-500" />
          </div>
          <CardTitle className="text-base">Department Performance</CardTitle>
        </div>
        <button onClick={fetchData} disabled={loading} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-secondary/80">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="skeleton h-4 w-28" />
                <div className="skeleton h-2 w-full rounded-full" />
                <div className="skeleton h-3 w-48" />
              </div>
            ))}
          </div>
        ) : departments.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No department data yet</p>
            <p className="text-xs text-muted-foreground">Students need to register to see department breakdown</p>
          </div>
        ) : (
          <div className="space-y-5">
            {departments.map((dept, i) => (
              <div key={dept.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`} />
                    <span className="text-sm font-semibold text-foreground">{dept.name}</span>
                    <span className="text-xs text-muted-foreground">({dept.students} students)</span>
                  </div>
                  <span className="text-sm font-bold text-foreground tabular-nums">{dept.placementRate}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${BAR_COLORS[i % BAR_COLORS.length]}`}
                    style={{ width: `${dept.placementRate}%` }}
                  />
                </div>
                <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                  <span className="text-emerald-500">✓ {dept.placed} placed</span>
                  <span className="text-amber-500">⏳ {dept.interviewing} interviewing</span>
                  <span>🔍 {dept.searching} searching</span>
                  <span className="ml-auto">avg {dept.avgProblems} problems</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
