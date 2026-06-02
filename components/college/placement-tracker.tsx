"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Building2, Users, CheckCircle,
  Search, RefreshCw, Loader2, TrendingUp,
  GraduationCap, BarChart3, ChevronRight, X
} from "lucide-react"

interface Student {
  id: string
  name: string
  email: string
  rollNumber: string
  branch: string
  year: number
  totalProblems: number
  githubContributions: number
  contestsAttended: number
  currentRating: number
  overallRank: string
  activityLevel: string
  placementStatus: string
}

interface PlacementData {
  college: { name: string; code: string }
  placement: { total: number; placed: number; interviewing: number; searching: number; placementRate: number }
  departments: Array<{ name: string; students: number; placed: number; interviewing: number; searching: number; placementRate: number; avgProblems: number; avgRating: number }>
  topPerformers: Student[]
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  placed:       { label: "Placed",       color: "bg-emerald-500/10 text-emerald-600" },
  interviewing: { label: "Interviewing", color: "bg-amber-500/10 text-amber-600" },
  searching:    { label: "Searching",    color: "bg-blue-500/10 text-blue-600" },
}

const ACTIVITY_COLOR: Record<string, string> = {
  "Very High": "bg-emerald-500/10 text-emerald-600",
  "High":      "bg-blue-500/10 text-blue-600",
  "Medium":    "bg-amber-500/10 text-amber-600",
  "Low":       "bg-secondary text-muted-foreground",
}

export function PlacementTracker() {
  const [data, setData] = useState<PlacementData | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("students")

  const fetchData = async () => {
    setLoading(true)
    try {
      const [studentsRes, dashRes] = await Promise.all([
        fetch("/api/college/students"),
        fetch("/api/college/dashboard"),
      ])
      const studentsData = studentsRes.ok ? await studentsRes.json() : {}
      const dash = dashRes.ok ? await dashRes.json() : {}
      setData({
        college: studentsData.college ?? dash.college ?? { name: "", code: "" },
        placement: dash.placement ?? { total: 0, placed: 0, interviewing: 0, searching: 0, placementRate: 0 },
        departments: dash.departments ?? [],
        topPerformers: studentsData.students ?? [],
      })
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const allStudents: Student[] = data?.topPerformers ?? []

  const branches = useMemo(() =>
    [...new Set(allStudents.map(s => s.branch).filter(Boolean))].sort()
  , [allStudents])

  const years = useMemo(() => {
    const pool = selectedBranch ? allStudents.filter(s => s.branch === selectedBranch) : allStudents
    return [...new Set(pool.map(s => s.year).filter(Boolean))].sort()
  }, [allStudents, selectedBranch])

  const filteredStudents = useMemo(() => {
    return allStudents.filter(s => {
      if (selectedBranch && s.branch !== selectedBranch) return false
      if (selectedYear && s.year !== selectedYear) return false
      if (search) {
        const q = search.toLowerCase()
        return s.name.toLowerCase().includes(q) ||
               s.rollNumber?.toLowerCase().includes(q) ||
               s.email?.toLowerCase().includes(q)
      }
      return true
    })
  }, [allStudents, selectedBranch, selectedYear, search])

  const clearFilters = () => { setSelectedBranch(null); setSelectedYear(null); setSearch("") }

  if (loading) return (
    <div className="flex justify-center py-24">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )

  if (!data) return (
    <div className="text-center py-24">
      <p className="text-muted-foreground">Failed to load data</p>
      <Button onClick={fetchData} variant="outline" className="mt-4 gap-2 bg-transparent">
        <RefreshCw className="h-4 w-4" />Retry
      </Button>
    </div>
  )

  const { placement, departments } = data

  return (
    <div className="space-y-6">

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Students",  value: placement.total,        icon: Building2,  color: "text-primary",     bg: "bg-primary/10",     badge: `${placement.placementRate}% rate`, bc: "bg-emerald-500/10 text-emerald-600" },
          { label: "Placed",          value: placement.placed,       icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-500/10", badge: `${placement.total > 0 ? Math.round((placement.placed/placement.total)*100) : 0}%`, bc: "bg-emerald-500/10 text-emerald-600" },
          { label: "Interviewing",    value: placement.interviewing, icon: TrendingUp,  color: "text-amber-600",   bg: "bg-amber-500/10",   badge: "Active", bc: "bg-amber-500/10 text-amber-600" },
          { label: "Searching",       value: placement.searching,    icon: Users,       color: "text-blue-600",    bg: "bg-blue-500/10",    badge: "Open",   bc: "bg-blue-500/10 text-blue-600" },
        ].map(item => (
          <Card key={item.label} className="bg-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`rounded-lg p-2 ${item.bg}`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <Badge className={`text-xs ${item.bc}`}>{item.badge}</Badge>
              </div>
              <p className="text-2xl font-bold text-foreground">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placement rate bar */}
      <Card className="bg-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Overall Placement Rate</span>
            <span className="text-lg font-bold text-primary">{placement.placementRate}%</span>
          </div>
          <Progress value={placement.placementRate} className="h-2.5" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{placement.placed} placed</span>
            <span>{placement.interviewing} interviewing</span>
            <span>{placement.searching} searching</span>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-secondary">
          <TabsTrigger value="students" className="gap-2">
            <GraduationCap className="h-4 w-4" />Students
          </TabsTrigger>
          <TabsTrigger value="departments" className="gap-2">
            <BarChart3 className="h-4 w-4" />Departments
          </TabsTrigger>
        </TabsList>

        {/* Students tab */}
        <TabsContent value="students" className="space-y-4">

          {/* Branch filter */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Branch:</span>
              <button
                onClick={() => { setSelectedBranch(null); setSelectedYear(null) }}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  !selectedBranch ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                All ({allStudents.length})
              </button>
              {branches.map(branch => (
                <button
                  key={branch}
                  onClick={() => { setSelectedBranch(branch); setSelectedYear(null) }}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    selectedBranch === branch ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {branch} ({allStudents.filter(s => s.branch === branch).length})
                </button>
              ))}
            </div>

            {/* Year filter */}
            {selectedBranch && years.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Year:</span>
                <button
                  onClick={() => setSelectedYear(null)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    !selectedYear ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                  }`}
                >All Years</button>
                {years.map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      selectedYear === year ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {year} ({allStudents.filter(s => s.branch === selectedBranch && s.year === year).length})
                  </button>
                ))}
              </div>
            )}

            {/* Search + breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {(selectedBranch || selectedYear) && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <span>Showing</span>
                  {selectedBranch && <Badge variant="secondary">{selectedBranch}</Badge>}
                  {selectedBranch && selectedYear && <ChevronRight className="h-3 w-3" />}
                  {selectedYear && <Badge variant="secondary">{selectedYear}</Badge>}
                  <span>— {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""}</span>
                  <button onClick={clearFilters} className="ml-1 text-muted-foreground hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              <div className="flex gap-2 sm:ml-auto">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search name, roll..." className="bg-secondary pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <Button variant="outline" size="sm" onClick={fetchData} className="gap-2 bg-transparent shrink-0">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <Card className="bg-card">
            <CardContent className="p-0">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-16">
                  <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No students found</p>
                  {(selectedBranch || selectedYear || search) && (
                    <button onClick={clearFilters} className="text-sm text-primary hover:underline mt-2">Clear filters</button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase">#</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Student</th>
                        {!selectedBranch && <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Branch</th>}
                        <th className="px-5 py-3 text-center text-xs font-medium text-muted-foreground uppercase">Year</th>
                        <th className="px-5 py-3 text-center text-xs font-medium text-muted-foreground uppercase">Problems</th>
                        <th className="px-5 py-3 text-center text-xs font-medium text-muted-foreground uppercase">Rating</th>
                        <th className="px-5 py-3 text-center text-xs font-medium text-muted-foreground uppercase">Activity</th>
                        <th className="px-5 py-3 text-center text-xs font-medium text-muted-foreground uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student, i) => {
                        const status = STATUS_CONFIG[student.placementStatus] ?? STATUS_CONFIG.searching
                        const activity = ACTIVITY_COLOR[student.activityLevel] ?? ACTIVITY_COLOR.Low
                        return (
                          <tr key={student.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                            <td className="px-5 py-4 text-sm text-muted-foreground">{i + 1}</td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 shrink-0">
                                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                    {student.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-foreground text-sm">{student.name}</p>
                                  <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
                                </div>
                              </div>
                            </td>
                            {!selectedBranch && <td className="px-5 py-4 text-sm text-muted-foreground">{student.branch}</td>}
                            <td className="px-5 py-4 text-center text-sm text-muted-foreground">{student.year}</td>
                            <td className="px-5 py-4 text-center font-semibold text-foreground">{student.totalProblems}</td>
                            <td className="px-5 py-4 text-center font-semibold text-amber-500">{student.currentRating || "—"}</td>
                            <td className="px-5 py-4 text-center">
                              <Badge className={`text-xs ${activity}`}>{student.activityLevel}</Badge>
                            </td>
                            <td className="px-5 py-4 text-center">
                              <Badge className={`text-xs ${status.color}`}>{status.label}</Badge>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Departments tab */}
        <TabsContent value="departments">
          {departments.length === 0 ? (
            <Card className="bg-card">
              <CardContent className="text-center py-16">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No department data yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {departments.map(dept => (
                <Card
                  key={dept.name}
                  className="bg-card cursor-pointer hover:border-primary/40 hover:shadow-md transition-all"
                  onClick={() => { setSelectedBranch(dept.name); setSelectedYear(null); setActiveTab("students") }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{dept.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">{dept.students} students</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Placement Rate</span>
                        <span className="font-semibold text-foreground">{dept.placementRate}%</span>
                      </div>
                      <Progress value={dept.placementRate} className="h-1.5" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="rounded-lg bg-emerald-500/10 p-2">
                        <p className="font-bold text-emerald-600">{dept.placed}</p>
                        <p className="text-muted-foreground">Placed</p>
                      </div>
                      <div className="rounded-lg bg-amber-500/10 p-2">
                        <p className="font-bold text-amber-600">{dept.interviewing}</p>
                        <p className="text-muted-foreground">Interview</p>
                      </div>
                      <div className="rounded-lg bg-blue-500/10 p-2">
                        <p className="font-bold text-blue-600">{dept.searching}</p>
                        <p className="text-muted-foreground">Searching</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground border-t border-border pt-2">
                      <span>Avg Problems: <strong className="text-foreground">{dept.avgProblems}</strong></span>
                      <span>Avg Rating: <strong className="text-foreground">{dept.avgRating || "—"}</strong></span>
                    </div>
                    <p className="text-xs text-primary font-medium text-right">View students →</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
