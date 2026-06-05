"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Briefcase, Building2, Globe, ArrowLeft, Loader2, ExternalLink } from "lucide-react"

interface Recruiter {
  _id: string
  name: string
  companyName: string
  companyWebsite: string | null
  companySize: string | null
  industry: string | null
  designation: string
  hiringFor: string[]
  preferredSkills: string[]
}

export default function ExploreRecruitersPage() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([])
  const [filtered, setFiltered] = useState<Recruiter[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Recruiter | null>(null)

  useEffect(() => {
    fetch("/api/public/recruiters")
      .then((r) => r.json())
      .then((d) => { setRecruiters(d.recruiters ?? []); setFiltered(d.recruiters ?? []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const q = query.toLowerCase()
    setFiltered(
      q
        ? recruiters.filter(
            (r) =>
              r.companyName.toLowerCase().includes(q) ||
              r.name.toLowerCase().includes(q) ||
              (r.industry ?? "").toLowerCase().includes(q) ||
              r.hiringFor.some((h) => h.toLowerCase().includes(q))
          )
        : recruiters
    )
  }, [query, recruiters])

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center gap-4">
          <Link href="/#stats">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Recruiters</h1>
            <p className="text-xs text-muted-foreground">{filtered.length} hiring actively</p>
          </div>
          <div className="relative ml-auto w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search company, role, industry..."
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
          <p className="text-center text-muted-foreground py-24">No recruiters found</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((r) => (
              <button
                key={r._id}
                onClick={() => setSelected(r)}
                className="text-left rounded-xl border border-border bg-card p-5 hover:border-amber-500/50 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                    <Building2 className="h-5 w-5 text-amber-600" />
                  </div>
                  <p className="font-semibold text-foreground truncate">{r.companyName}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500/10">
                    <Building2 className="h-7 w-7 text-amber-600" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selected.companyName}</DialogTitle>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-3 mt-2">
                <div className="grid grid-cols-2 gap-3">
                  {selected.industry && (
                    <div className="rounded-lg bg-secondary p-3">
                      <p className="text-xs text-muted-foreground">Industry</p>
                      <p className="text-sm font-medium text-foreground">{selected.industry}</p>
                    </div>
                  )}
                  {selected.companySize && (
                    <div className="rounded-lg bg-secondary p-3">
                      <p className="text-xs text-muted-foreground">Company Size</p>
                      <p className="text-sm font-medium text-foreground">{selected.companySize}</p>
                    </div>
                  )}
                </div>

                {selected.hiringFor.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Hiring For</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.hiringFor.map((h) => (
                        <Badge key={h} className="bg-amber-500/10 text-amber-700">{h}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selected.preferredSkills.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Preferred Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.preferredSkills.map((sk) => (
                        <Badge key={sk} variant="secondary">{sk}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selected.companyWebsite && (
                  <a
                    href={selected.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Globe className="h-4 w-4" />
                    {selected.companyWebsite}
                  </a>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
