"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookmarkCheck, ArrowRight, Users } from "lucide-react"
import Link from "next/link"

interface ShortlistSummary {
  _id: string; name: string; candidates: number; status: string; updatedAt: string
}

function timeAgo(d: string) {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
  if (m < 60) return `${m}m ago`
  if (m < 1440) return `${Math.floor(m / 60)}h ago`
  if (m < 10080) return `${Math.floor(m / 1440)}d ago`
  return `${Math.floor(m / 10080)}w ago`
}

const STATUS: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  reviewing: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
}

export function RecentShortlists() {
  const [lists, setLists] = useState<ShortlistSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/recruiter/dashboard")
      .then((r) => r.json())
      .then((d) => setLists(d.shortlists ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10">
            <BookmarkCheck className="h-4 w-4 text-blue-500" />
          </div>
          <CardTitle className="text-base">Shortlists</CardTitle>
        </div>
        <Link href="/recruiter/shortlists">
          <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground hover:text-foreground">
            Manage <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}
          </div>
        ) : lists.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No shortlists yet</p>
          </div>
        ) : (
          lists.map((list) => (
            <Link key={list._id} href="/recruiter/shortlists">
              <div className="group flex items-center justify-between rounded-xl border border-border/60 bg-card p-3 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{list.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{list.candidates} candidates · {timeAgo(list.updatedAt)}</p>
                </div>
                <Badge className={`text-[10px] px-2 py-0.5 ${STATUS[list.status] ?? "bg-secondary text-muted-foreground"}`}>
                  {list.status.charAt(0).toUpperCase() + list.status.slice(1)}
                </Badge>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  )
}
