"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
} from "recharts"
import { TrendingUp, Clock, Award, Briefcase, Loader2 } from "lucide-react"

interface AnalyticsData {
  summary: {
    conversionRate: string
    offerAcceptance: number
    totalHired: number
    totalOffered: number
    activeJobs: number
    totalApplications: number
    totalShortlisted: number
  }
  hiringFunnel: { name: string; value: number }[]
  weeklyTrend: { week: string; applications: number; shortlisted: number }[]
  stageBreakdown: { stage: string; count: number }[]
}

export function RecruiterAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [empty, setEmpty] = useState(false)

  useEffect(() => {
    fetch("/api/recruiter/analytics")
      .then((r) => r.json())
      .then((d) => {
        if (d.empty) {
          setEmpty(true)
        } else {
          setData(d)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (empty || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <TrendingUp className="h-12 w-12 text-muted-foreground mb-3" />
        <p className="text-lg font-medium">No analytics data yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Post jobs and shortlist candidates to see your hiring analytics here.
        </p>
      </div>
    )
  }

  const { summary, hiringFunnel, weeklyTrend, stageBreakdown } = data
  const funnelMax = hiringFunnel[0]?.value || 1

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-primary/10 p-2">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">{summary.conversionRate}%</p>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-chart-2/10 p-2">
                <Award className="h-5 w-5 text-chart-2" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">
                {summary.totalHired}/{summary.totalOffered}
              </p>
              <p className="text-sm text-muted-foreground">Offer Acceptance ({summary.offerAcceptance}%)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-chart-3/10 p-2">
                <Briefcase className="h-5 w-5 text-chart-3" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">{summary.activeJobs}</p>
              <p className="text-sm text-muted-foreground">Active Job Postings</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-chart-4/10 p-2">
                <Clock className="h-5 w-5 text-chart-4" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">{summary.totalApplications}</p>
              <p className="text-sm text-muted-foreground">Total Applications</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly trend */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Application Trend (Last 6 Weeks)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="applications" name="Applications" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="shortlisted" name="Shortlisted" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Hiring funnel */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Hiring Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hiringFunnel.map((stage) => {
                const percentage = Math.round((stage.value / funnelMax) * 100)
                return (
                  <div key={stage.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{stage.name}</span>
                      <span className="text-muted-foreground">
                        {stage.value} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stage breakdown bar chart */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Candidates by Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="stage" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" name="Candidates" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
