"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bookmark, Loader2 } from "lucide-react"
import Link from "next/link"

interface ShortlistSummary {
  _id: string
  name: string
  candidates: number
  status: string
  updatedAt: string
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}

function StatusBadge({ status }: { status: string }) {
  if (status === "active") return <Badge className="bg-green-500/20 text-green-500">Active</Badge>
  if (status === "reviewing") return <Badge className="bg-yellow-500/20 text-yellow-500">Reviewing</Badge>
  return <Badge variant="secondary">Closed</Badge>
}

export function RecentShortlists() {
  const [shortlists, setShortlists] = useState<ShortlistSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/recruiter/dashboard")
      .then((r) => r.json())
      .then((data) => setShortlists(data.shortlists ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-chart-2" />
          <CardTitle>Shortlists</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : shortlists.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-4">No shortlists yet</p>
        ) : (
          shortlists.map((list) => (
            <div
              key={list._id}
              className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
            >
              <div className="space-y-1">
                <p className="font-medium text-foreground">{list.name}</p>
                <p className="text-xs text-muted-foreground">
                  {list.candidates} candidates • {timeAgo(list.updatedAt)}
                </p>
              </div>
              <StatusBadge status={list.status} />
            </div>
          ))
        )}
        <Button variant="outline" className="w-full bg-transparent" asChild>
          <Link href="/recruiter/shortlists">Manage Shortlists</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
