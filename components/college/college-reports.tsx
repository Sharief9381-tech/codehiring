"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  FileText, Download, BarChart3, Users, Briefcase, Zap,
  GraduationCap, TrendingUp, CheckCircle2, RefreshCw,
} from "lucide-react"

const REPORTS = [
  { id: "placement", title: "Placement Report", desc: "Overall placement stats, company-wise, package ranges", icon: Briefcase, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: "student", title: "Student Performance", desc: "Individual student scores, rankings, and coding stats", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "skill", title: "Skill Analysis Report", desc: "Skill distribution, gaps, and top technologies", icon: Zap, color: "text-violet-500", bg: "bg-violet-500/10" },
  { id: "department", title: "Department Report", desc: "Branch-wise placement rate, averages, comparison", icon: BarChart3, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: "drive", title: "Drive Summary", desc: "All placement drives, participation, selection ratios", icon: TrendingUp, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { id: "academic", title: "Academic Progress", desc: "CGPA trends, backlog status, semester performance", icon: GraduationCap, color: "text-rose-500", bg: "bg-rose-500/10" },
]

export function CollegeReports() {
  const [generating, setGenerating] = useState<string | null>(null)
  const [year, setYear] = useState("2026")
  const [format, setFormat] = useState("pdf")

  const handleGenerate = (id: string) => {
    setGenerating(id)
    setTimeout(() => setGenerating(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Reports</h2>
          <p className="text-sm text-muted-foreground">Generate and export placement and performance reports</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-4 items-end">
          <div className="space-y-1.5">
            <Label className="text-xs">Batch Year</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="gap-2">
            <BarChart3 className="h-4 w-4" /> Preview All
          </Button>
        </CardContent>
      </Card>

      {/* Report cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REPORTS.map(report => (
          <Card key={report.id} className="hover:border-primary/30 transition-colors">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${report.bg}`}>
                  <report.icon className={`h-5 w-5 ${report.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{report.title}</h3>
                  <p className="text-xs text-muted-foreground">{year} Batch</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{report.desc}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 gap-1.5 text-xs"
                  onClick={() => handleGenerate(report.id)}
                  disabled={generating === report.id}
                >
                  {generating === report.id ? (
                    <><RefreshCw className="h-3 w-3 animate-spin" /> Generating…</>
                  ) : (
                    <><Download className="h-3 w-3" /> {format.toUpperCase()}</>
                  )}
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                  <FileText className="h-3 w-3" /> Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent exports */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Recent Exports
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { name: "Placement Report 2025 — PDF", date: "Jan 15, 2026", size: "2.4 MB" },
            { name: "Department Report 2025 — Excel", date: "Jan 10, 2026", size: "1.1 MB" },
            { name: "Skill Analysis 2025 — CSV", date: "Jan 5, 2026", size: "0.8 MB" },
          ].map(file => (
            <div key={file.name} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{file.date} · {file.size}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
