"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Briefcase, BookmarkCheck, UserCheck, Loader2 } from "lucide-react"

interface DashboardStats {
  activeJobs: number
  totalApplications: number
  totalShortlisted: number
  totalInterviewed: number
}

export function RecruiterStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/recruiter/dashboard")
      .then((r) => r.json())
      .then((data) => {
        setStats({
          activeJobs: data.activeJobs ?? 0,
          totalApplications: data.totalApplications ?? 0,
          totalShortlisted: data.totalShortlisted ?? 0,
          totalInterviewed: data.totalInterviewed ?? 0,
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const items = [
    {
      label: "Active Job Postings",
      value: stats?.activeJobs ?? 0,
      icon: Briefcase,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      label: "Total Applications",
      value: stats?.totalApplications ?? 0,
      icon: Users,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      label: "Shortlisted",
      value: stats?.totalShortlisted ?? 0,
      icon: BookmarkCheck,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      label: "Interviewed",
      value: stats?.totalInterviewed ?? 0,
      icon: UserCheck,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Card key={item.label} className="bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`rounded-lg p-2 ${item.bgColor}`}>
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
                {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-foreground">
                  {loading ? "—" : item.value.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
