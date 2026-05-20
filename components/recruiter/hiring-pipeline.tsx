"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"

interface PipelineStage {
  stage: string
  count: number
}

const STAGE_COLORS: Record<string, string> = {
  Screening: "bg-chart-1",
  "Technical Interview": "bg-chart-2",
  "HR Interview": "bg-chart-3",
  "Offer Sent": "bg-chart-4",
  Accepted: "bg-green-500",
  Rejected: "bg-red-500",
}

export function HiringPipeline() {
  const [pipeline, setPipeline] = useState<PipelineStage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/recruiter/dashboard")
      .then((r) => r.json())
      .then((data) => setPipeline(data.pipeline ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const maxCount = Math.max(...pipeline.map((s) => s.count), 1)

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Hiring Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : pipeline.every((s) => s.count === 0) ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            No candidates in pipeline yet. Add candidates to your shortlists to track progress.
          </p>
        ) : (
          <div className="space-y-6">
            {pipeline.map((stage, index) => {
              const percentage = Math.round((stage.count / maxCount) * 100)
              const color = STAGE_COLORS[stage.stage] ?? "bg-primary"
              return (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${color}`} />
                      <span className="font-medium text-foreground">{stage.stage}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {stage.count} candidate{stage.count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
