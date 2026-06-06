"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Building2, Globe, ArrowLeft, Loader2 } from "lucide-react"

interface Recruiter {
  _id: string; name: string; companyName: string; companyWebsite: string | null
  companySize: string | null; industry: string | null; designation: string
  hiringFor: string[]; preferredSkills: string[]
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
    setFiltered(q ? recruiters.filter((r) =>
      r.companyName.toLowerCase().includes(q) ||
      (r.industry ?? "").toLowerCase().includes(q) ||
      r.hiringFor.some((h) => h.toLowerCase().includes(q))
    ) : recruiters)
  }, [query, recruiters])

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <div className="border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center gap-3">
          <Link href="/#stats">
            <Button variant="ghost" size="icon-sm"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Companies Hiring</h1>
            <p className="text-xs text-muted-foreground">{filtered.length} hiring actively</p>
          </div>
          <div className="relative ml-auto w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search company, industry..." className="pl-9 h-9 text-sm" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground/40" />
            <p className="text-muted-foreground">No companies found</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((r) => (
              <button
                key={r._id}
                onClick={() => setSelected(r)}
                className="group text-left rounded-2xl border border-border/60 bg-card p-4 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all card-hover"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                    <Building2 className="h-5 w-5 text-amber-500" />
                  </div>
                  <p className="font-semibold text-foreground truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{r.companyName}</p>
                </div>
                {r.industry && (
                  <p className="text-xs text-muted-foreground mt-2 ml-13 pl-[52px]">{r.industry}</p>
                )}
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
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
                    <Building2 className="h-7 w-7 text-amber-500" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selected.companyName}</DialogTitle>
                    {selected.industry && <p className="text-sm text-muted-foreground mt-0.5">{selected.industry}</p>}
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4 mt-1">
                {selected.companySize && (
                  <div className="rounded-xl bg-secondary/60 p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">Company Size</p>
                    <p className="text-sm font-medium text-foreground">{selected.companySize}</p>
                  </div>
                )}
                {selected.hiringFor.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Hiring For</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.hiringFor.map((h) => (
                        <Badge key={h} className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">{h}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selected.preferredSkills.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Preferred Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.preferredSkills.map((sk) => (
                        <Badge key={sk} variant="secondary">{sk}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selected.companyWebsite && (
                  <a href={selected.companyWebsite} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4">
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
