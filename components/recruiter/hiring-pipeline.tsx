"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, GitBranch } from "lucide-react"

interface PipelineStage { stage: string; count: number }

const STAGE_META: Record<string, { color: string; bg: string; bar: string }> = {
  "Screening":           { color: "text-violet-500", bg: "bg-violet-500/10", bar: "bg-violet-500" },
  "Technical Interview": { color: "text-blue-500",   bg: "bg-blue-500/10",   bar: "bg-blue-500"   },
  "HR Interview":        { color: "text-cyan-500",   bg: "bg-cyan-500/10",   bar: "bg-cyan-500"   },
  "Offer Sent":          { color: "text-amber-500",  bg: "bg-amber-500/10",  bar: "bg-amber-500"  },
  "Accepted":            { color: "text-emerald-500",bg: "bg-emerald-500/10",bar: "bg-emerald-500"},
  "Rejected":            { color: "text-red-500",    bg: "bg-red-500/10",    bar: "bg-red-500"    },
}

export function HiringPipeline() {
  const [pipeline, setPipeline] = useState<PipelineStage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/recruiter/dashboard")
      .then((r) => r.json())
      .then((d) => setPipeline(d.pipeline ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const maxCount = Math.max(...pipeline.map((s) => s.count), 1)
  const total = pipeline.reduce((s, p) => s + p.count, 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
            <GitBranch className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Hiring Pipeline</CardTitle>
            {!loading && total > 0 && (
              <p className="text-xs text-muted-foreground">{total} total candidates</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="skeleton h-4 w-32" />
                <div className="skeleton h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        ) : pipeline.every((s) => s.count === 0) ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
              <GitBranch className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No candidates in pipeline yet</p>
            <p className="text-xs text-muted-foreground">Add candidates to your shortlists to track progress</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pipeline.map((stage) => {
              const meta = STAGE_META[stage.stage] ?? { color: "text-primary", bg: "bg-primary/10", bar: "bg-primary" }
              const pct = Math.round((stage.count / maxCount) * 100)
              return (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${meta.bar}`} />
                      <span className="text-sm font-medium text-foreground">{stage.stage}</span>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                      {stage.count} <span className="font-normal">candidate{stage.count !== 1 ? "s" : ""}</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${meta.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
