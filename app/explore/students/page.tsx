"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Code2, Trophy, GitBranch, Star, ArrowLeft, Loader2, ExternalLink } from "lucide-react"

interface Student {
  _id: string
  name: string
  collegeCode: string
  branch: string
  graduationYear: number | null
  skills: string[]
  isOpenToWork: boolean
  linkedinUrl: string | null
  stats: {
    totalProblems: number
    rating: number
    githubContributions: number
    contestsParticipated: number
    easyProblems: number
    mediumProblems: number
    hardProblems: number
  }
}

export default function ExploreStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [filtered, setFiltered] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Student | null>(null)

  useEffect(() => {
    fetch("/api/public/students")
      .then((r) => r.json())
      .then((d) => { setStudents(d.students ?? []); setFiltered(d.students ?? []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const q = query.toLowerCase()
    setFiltered(
      q
        ? students.filter(
            (s) =>
              s.name.toLowerCase().includes(q) ||
              s.collegeCode.toLowerCase().includes(q) ||
              s.branch.toLowerCase().includes(q) ||
              s.skills.some((sk) => sk.toLowerCase().includes(q))
          )
        : students
    )
  }, [query, students])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center gap-4">
          <Link href="/#stats">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Students</h1>
            <p className="text-xs text-muted-foreground">{filtered.length} registered</p>
          </div>
          <div className="relative ml-auto w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, college, skill..."
              className="pl-9 bg-secondary"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-24">No students found</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((s) => (
              <button
                key={s._id}
                onClick={() => setSelected(s)}
                className="text-left rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {s.collegeCode}{s.branch ? ` · ${s.branch}` : ""}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Code2 className="h-3 w-3" />{s.stats.totalProblems} solved
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Star className="h-3 w-3" />{s.stats.rating} rating
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <GitBranch className="h-3 w-3" />{s.stats.githubContributions} contrib
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Trophy className="h-3 w-3" />{s.stats.contestsParticipated} contests
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {s.skills.slice(0, 3).map((sk) => (
                    <Badge key={sk} variant="secondary" className="text-xs">{sk}</Badge>
                  ))}
                  {s.skills.length > 3 && (
                    <Badge variant="secondary" className="text-xs">+{s.skills.length - 3}</Badge>
                  )}
                </div>
                {s.isOpenToWork && (
                  <Badge className="mt-2 bg-green-500/10 text-green-600 text-xs">Open to work</Badge>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Profile Modal */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {selected.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-xl">{selected.name}</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                      {selected.collegeCode}{selected.branch ? ` · ${selected.branch}` : ""}
                      {selected.graduationYear ? ` · ${selected.graduationYear}` : ""}
                    </p>
                    {selected.isOpenToWork && (
                      <Badge className="mt-1 bg-green-500/10 text-green-600 text-xs">Open to work</Badge>
                    )}
                  </div>
                </div>
              </DialogHeader>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                {[
                  { label: "Total Problems", value: selected.stats.totalProblems, icon: Code2, color: "text-blue-500" },
                  { label: "Rating", value: selected.stats.rating, icon: Star, color: "text-amber-500" },
                  { label: "GitHub Contributions", value: selected.stats.githubContributions, icon: GitBranch, color: "text-green-500" },
                  { label: "Contests", value: selected.stats.contestsParticipated, icon: Trophy, color: "text-purple-500" },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-secondary p-3 flex items-center gap-3">
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                    <div>
                      <p className="text-lg font-bold text-foreground">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Difficulty */}
              {selected.stats.totalProblems > 0 && (
                <div className="rounded-lg bg-secondary p-3 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Difficulty Breakdown</p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-500 font-semibold">{selected.stats.easyProblems} Easy</span>
                    <span className="text-yellow-500 font-semibold">{selected.stats.mediumProblems} Medium</span>
                    <span className="text-red-500 font-semibold">{selected.stats.hardProblems} Hard</span>
                  </div>
                </div>
              )}

              {/* Skills */}
              {selected.skills.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.skills.map((sk) => (
                      <Badge key={sk} variant="secondary">{sk}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* LinkedIn */}
              {selected.linkedinUrl && (
                <a
                  href={selected.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  View LinkedIn Profile
                </a>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
