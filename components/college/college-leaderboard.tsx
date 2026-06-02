"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Trophy, Medal, Award, Search, Loader2,
  Code2, GitBranch, Star, Users, TrendingUp
} from "lucide-react"

interface Student {
  id: string
  name: string
  email: string
  rollNumber: string
  department: string
  year: number
  totalProblems: number
  githubContributions: number
  contestsAttended: number
  currentRating: number
  activityLevel: string
  overallRank: string
  linkedPlatforms: string[]
  isOpenToWork: boolean
}

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
  if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />
  if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />
  return <span className="text-sm font-bold text-muted-foreground w-5 text-center">#{rank}</span>
}

const ACTIVITY_COLOR: Record<string, string> = {
  "Very High": "bg-emerald-500/10 text-emerald-600",
  "High":      "bg-blue-500/10 text-blue-600",
  "Medium":    "bg-amber-500/10 text-amber-600",
  "Low":       "bg-secondary text-muted-foreground",
}

export function CollegeLeaderboard() {
  const [students, setStudents] = useState<Student[]>([])
  const [filtered, setFiltered] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [college, setCollege] = useState<{ name: string; code: string } | null>(null)

  useEffect(() => {
    fetch("/api/college/students")
      .then(r => r.json())
      .then(d => {
        setStudents(d.students ?? [])
        setFiltered(d.students ?? [])
        setCollege(d.college ?? null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const q = query.toLowerCase()
    setFiltered(
      q
        ? students.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.rollNumber?.toLowerCase().includes(q) ||
            s.department?.toLowerCase().includes(q)
          )
        : students
    )
  }, [query, students])

  // Summary stats
  const totalStudents = students.length
  const activeStudents = students.filter(s => s.linkedPlatforms.length > 0).length
  const topSolver = students[0]
  const avgProblems = totalStudents > 0
    ? Math.round(students.reduce((s, st) => s + st.totalProblems, 0) / totalStudents)
    : 0

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalStudents}</p>
              <p className="text-xs text-muted-foreground">Total Students</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <Code2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeStudents}</p>
              <p className="text-xs text-muted-foreground">Active on Platforms</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{avgProblems}</p>
              <p className="text-xs text-muted-foreground">Avg. Problems Solved</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
              <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground truncate max-w-[120px]">
                {topSolver?.name ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                Top Solver · {topSolver?.totalProblems ?? 0} problems
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search + table */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            {college ? `${college.name} Rankings` : "Student Rankings"}
          </CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, roll, dept..."
              className="pl-9 bg-secondary"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No students found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Students need to register with your college code to appear here
              </p>
            </div>
          ) : (
            <>
              {/* Header row */}
              <div className="hidden sm:grid grid-cols-12 gap-2 px-6 py-3 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <div className="col-span-1">Rank</div>
                <div className="col-span-4">Student</div>
                <div className="col-span-2 text-center">Problems</div>
                <div className="col-span-2 text-center">Rating</div>
                <div className="col-span-2 text-center">GitHub</div>
                <div className="col-span-1 text-center">Status</div>
              </div>

              <div className="divide-y divide-border">
                {filtered.map((student, index) => {
                  const rank = students.indexOf(student) + 1
                  return (
                    <div
                      key={student.id}
                      className={`grid grid-cols-12 gap-2 items-center px-6 py-4 hover:bg-secondary/30 transition-colors ${
                        rank <= 3 ? "bg-secondary/10" : ""
                      }`}
                    >
                      {/* Rank */}
                      <div className="col-span-1 flex items-center justify-center">
                        <RankIcon rank={rank} />
                      </div>

                      {/* Student info */}
                      <div className="col-span-4 flex items-center gap-3 min-w-0">
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarFallback className={`text-xs font-bold ${
                            rank === 1 ? "bg-yellow-500/20 text-yellow-600" :
                            rank === 2 ? "bg-slate-400/20 text-slate-500" :
                            rank === 3 ? "bg-amber-600/20 text-amber-700" :
                            "bg-primary/10 text-primary"
                          }`}>
                            {student.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{student.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {student.rollNumber} · {student.department}
                          </p>
                        </div>
                      </div>

                      {/* Problems */}
                      <div className="col-span-2 text-center">
                        <p className="font-bold text-foreground">{student.totalProblems}</p>
                        <p className="text-xs text-muted-foreground">solved</p>
                      </div>

                      {/* Rating */}
                      <div className="col-span-2 text-center">
                        <p className="font-bold text-amber-500">{student.currentRating || "—"}</p>
                        <p className="text-xs text-muted-foreground">rating</p>
                      </div>

                      {/* GitHub */}
                      <div className="col-span-2 text-center">
                        <p className="font-bold text-emerald-500">{student.githubContributions}</p>
                        <p className="text-xs text-muted-foreground">contrib</p>
                      </div>

                      {/* Activity */}
                      <div className="col-span-1 flex justify-center">
                        <Badge className={`text-xs ${ACTIVITY_COLOR[student.activityLevel] ?? ACTIVITY_COLOR["Low"]}`}>
                          {student.activityLevel}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
