"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Building2, MapPin, Users, Globe, ArrowLeft, Loader2, ArrowRight } from "lucide-react"

interface College {
  _id: string
  name: string
  collegeName: string
  collegeCode: string
  location: string
  website: string | null
  departments: string[]
  totalStudents: number
  placementOfficerName: string | null
  isAutoCreated: boolean
}

export default function ExploreCollegesPage() {
  const [colleges, setColleges] = useState<College[]>([])
  const [filtered, setFiltered] = useState<College[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<College | null>(null)

  useEffect(() => {
    fetch("/api/public/colleges")
      .then((r) => r.json())
      .then((d) => { setColleges(d.colleges ?? []); setFiltered(d.colleges ?? []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const q = query.toLowerCase()
    setFiltered(
      q
        ? colleges.filter(
            (c) =>
              c.collegeName.toLowerCase().includes(q) ||
              c.collegeCode.toLowerCase().includes(q) ||
              c.location.toLowerCase().includes(q)
          )
        : colleges
    )
  }, [query, colleges])

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center gap-4">
          <Link href="/#stats">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Colleges</h1>
            <p className="text-xs text-muted-foreground">{filtered.length} onboarded</p>
          </div>
          <div className="relative ml-auto w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, code, location..."
              className="pl-9 bg-secondary"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-24">No colleges found</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c) => (
              <button
                key={c._id}
                onClick={() => setSelected(c)}
                className="text-left rounded-xl border border-border bg-card p-5 hover:border-emerald-500/50 hover:shadow-md transition-all relative"
              >
                {/* Unclaimed badge */}
                {c.isAutoCreated && (
                  <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                    Unclaimed
                  </span>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <Building2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="min-w-0 pr-14">
                    <p className="font-semibold text-foreground truncate">{c.collegeName || c.name}</p>
                    {c.location && (
                      <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                        <MapPin className="h-3 w-3 shrink-0" />{c.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <Users className="h-3 w-3" />
                  {c.totalStudents > 0 ? `${c.totalStudents} students` : "Tracking students"}
                </div>

                {c.departments.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {c.departments.slice(0, 2).map((d) => (
                      <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
                    ))}
                    {c.departments.length > 2 && (
                      <Badge variant="secondary" className="text-xs">+{c.departments.length - 2}</Badge>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Profile / Claim Modal */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10">
                    <Building2 className="h-7 w-7 text-emerald-600" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selected.collegeName || selected.name}</DialogTitle>
                    <p className="text-sm text-muted-foreground">{selected.location || "Location not set"}</p>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-3 mt-2">
                {selected.totalStudents > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />{selected.totalStudents} students registered
                  </div>
                )}

                {selected.placementOfficerName && (
                  <div className="rounded-lg bg-secondary p-3">
                    <p className="text-xs text-muted-foreground">Placement Officer</p>
                    <p className="text-sm font-medium text-foreground">{selected.placementOfficerName}</p>
                  </div>
                )}

                {selected.departments.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Departments</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.departments.map((d) => (
                        <Badge key={d} variant="secondary">{d}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selected.website && (
                  <a
                    href={selected.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Globe className="h-4 w-4" />
                    {selected.website}
                  </a>
                )}

                {/* Claim CTA for auto-created colleges */}
                {selected.isAutoCreated && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
                    <p className="text-sm font-semibold text-amber-700">
                      Is this your college?
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selected.totalStudents} student{selected.totalStudents !== 1 ? "s" : ""} from <strong>{selected.collegeCode}</strong> have already registered. Claim this profile to manage placements and track your students.
                    </p>
                    <Link
                      href={`/signup?role=college&collegeCode=${selected.collegeCode}`}
                      onClick={() => setSelected(null)}
                    >
                      <Button className="w-full gap-2 mt-1">
                        Sign up as {selected.collegeName || selected.collegeCode}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
