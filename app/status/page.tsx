import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, AlertCircle, XCircle, RefreshCw, BarChart3, Activity } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getSystemStatus() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/debug/test-system`, { cache: 'no-store' })
    if (res.ok) return await res.json()
  } catch {}
  return null
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'PASS') return <CheckCircle className="h-4 w-4 text-emerald-500" />
  if (status === 'WARN') return <AlertCircle className="h-4 w-4 text-amber-500" />
  return <XCircle className="h-4 w-4 text-red-500" />
}

function statusBadgeClass(s: string) {
  if (s === 'PASS') return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
  if (s === 'WARN') return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20'
  return 'bg-red-500/15 text-red-500 border-red-500/20'
}

function overallClass(s: string) {
  if (s === 'ALL_SYSTEMS_GO') return 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
  if (s === 'MINOR_ISSUES') return 'from-amber-500/10 to-orange-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400'
  return 'from-red-500/10 to-rose-500/5 border-red-500/20 text-red-500'
}

export default async function StatusPage() {
  const data = await getSystemStatus()

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 mx-auto mb-4">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">Status Unavailable</h1>
          <p className="text-muted-foreground text-sm">Unable to fetch system status</p>
        </div>
      </div>
    )
  }

  const SUMMARY = [
    { label: "Passed", value: data.summary.passed, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Warnings", value: data.summary.warnings, icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Failed", value: data.summary.failed, icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "Total", value: data.summary.total, icon: BarChart3, color: "text-primary", bg: "bg-primary/10" },
  ]

  const overallLabel =
    data.overallStatus === 'ALL_SYSTEMS_GO' ? '✅ All Systems Operational' :
    data.overallStatus === 'MINOR_ISSUES'   ? '⚠️ Minor Issues Detected' :
                                              '🔴 Critical Issues Found'

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">CodeHiring System Status</h1>
          </div>
          <p className="text-sm text-muted-foreground">Real-time monitoring of all system components</p>
        </div>

        {/* Overall banner */}
        <div className={`rounded-2xl border bg-gradient-to-r p-5 mb-6 ${overallClass(data.overallStatus)}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">{overallLabel}</h2>
              <p className="text-xs opacity-70 mt-1">Last checked: {new Date(data.timestamp).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black tabular-nums">{data.summary.passed}/{data.summary.total}</p>
              <p className="text-xs opacity-70">Tests Passing</p>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 mb-6">
          {SUMMARY.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="rounded-2xl border border-border/60 bg-card p-4">
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${bg} mb-3`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground tabular-nums">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Test results */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">System Components</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.tests.map((test: any, i: number) => (
              <div key={i} className="flex items-start justify-between rounded-xl border border-border/60 bg-secondary/20 p-3">
                <div className="flex items-start gap-3">
                  <StatusIcon status={test.status} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{test.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{test.message}</p>
                  </div>
                </div>
                <Badge className={`shrink-0 text-[10px] ${statusBadgeClass(test.status)}`}>{test.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommendations */}
        {data.recommendations?.length > 0 && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.recommendations.map((rec: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5 shrink-0">•</span>{rec}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button asChild><a href="/admin">Admin Dashboard</a></Button>
          <Button variant="outline" asChild><a href="/api/debug/test-system" target="_blank">Raw Status</a></Button>
        </div>
      </div>
    </div>
  )
}
