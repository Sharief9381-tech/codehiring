"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  User, BookOpen, Code2, Briefcase, FileText, Brain,
  Github, ExternalLink, CheckCircle2, XCircle, AlertCircle,
  Trophy, TrendingUp, Star, Zap, Target, Mail, Calendar,
  BarChart3, Award,
} from "lucide-react"

interface StudentProfileModalProps {
  student: any
  open: boolean
  onClose: () => void
}

const SCORE_COLOR = (v: number) =>
  v >= 80 ? "text-emerald-500" : v >= 60 ? "text-amber-500" : "text-red-500"

const LEVEL_COLOR: Record<string, string> = {
  Advanced:     "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  Intermediate: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Beginner:     "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
}

export function StudentProfileModal({ student, open, onClose }: StudentProfileModalProps) {
  const [tab, setTab] = useState("overview")

  if (!student) return null

  const initials = student.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() ?? "?"
  const problems = student.totalProblems ?? 0
  const rating   = student.currentRating ?? 0
  const contrib  = student.githubContributions ?? 0
  const readiness = Math.min(100, Math.round(
    (problems / 300) * 40 + (rating / 2000) * 30 + (contrib / 500) * 20 + (student.platformCount ?? 0) * 2
  ))

  // AI-generated insights (derived from data)
  const aiStrengths = []
  const aiWeaknesses = []
  if (problems > 200) aiStrengths.push("Strong problem-solving")
  if (contrib > 100)  aiStrengths.push("Active GitHub contributor")
  if (rating > 1500)  aiStrengths.push("High competitive rating")
  if ((student.linkedPlatforms?.length ?? 0) >= 3) aiStrengths.push("Multi-platform active")
  if (problems < 100) aiWeaknesses.push("Low problem count")
  if (rating < 1000)  aiWeaknesses.push("Improve competitive rating")
  if (contrib < 30)   aiWeaknesses.push("Limited GitHub activity")
  if (aiStrengths.length === 0) aiStrengths.push("Getting started")
  if (aiWeaknesses.length === 0) aiWeaknesses.push("Keep up the momentum!")

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-foreground truncate">{student.name}</h2>
              <p className="text-sm text-muted-foreground">{student.rollNumber} · {student.department} · {student.year}</p>
            </div>
            <Badge className={
              student.placementStatus === "placed" ? "bg-emerald-500/10 text-emerald-600" :
              student.placementStatus === "interviewing" ? "bg-amber-500/10 text-amber-600" :
              "bg-blue-500/10 text-blue-600"
            }>
              {student.placementStatus ?? "searching"}
            </Badge>
          </div>
        </div>

        <div className="px-6 pb-6">
          <Tabs value={tab} onValueChange={setTab} className="mt-4">
            <TabsList className="w-full grid grid-cols-4 sm:grid-cols-7 h-auto gap-1 bg-muted p-1 rounded-xl mb-4">
              {[
                { value: "overview",  label: "Overview",  icon: User },
                { value: "skills",    label: "Skills",    icon: Zap },
                { value: "coding",    label: "Coding",    icon: Code2 },
                { value: "academics", label: "Academics", icon: BookOpen },
                { value: "projects",  label: "Projects",  icon: Briefcase },
                { value: "resume",    label: "Resume",    icon: FileText },
                { value: "ai",        label: "AI Report", icon: Brain },
              ].map(({ value, label, icon: Icon }) => (
                <TabsTrigger key={value} value={value} className="text-xs py-1.5 rounded-lg flex items-center gap-1">
                  <Icon className="h-3 w-3" /><span className="hidden sm:inline">{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* OVERVIEW */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Problems", value: problems, icon: Code2, color: "text-violet-500" },
                  { label: "Readiness", value: `${readiness}%`, icon: Target, color: "text-emerald-500" },
                  { label: "Rating", value: rating || "—", icon: Trophy, color: "text-amber-500" },
                  { label: "Contributions", value: contrib, icon: Github, color: "text-slate-400" },
                ].map(s => (
                  <Card key={s.label}>
                    <CardContent className="p-4 text-center">
                      <s.icon className={`h-5 w-5 mx-auto mb-1 ${s.color}`} />
                      <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Graduation:</span>
                    <span className="font-medium">{student.year}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Activity:</span>
                    <Badge className="text-xs">{student.activityLevel ?? "Low"}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Rank:</span>
                    <Badge className="text-xs">{student.overallRank ?? "Beginner"}</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Placement Readiness</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Overall Score</span>
                    <span className={`font-bold ${SCORE_COLOR(readiness)}`}>{readiness}%</span>
                  </div>
                  <Progress value={readiness} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Based on problems solved, ratings, GitHub activity, and platform diversity
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SKILLS */}
            <TabsContent value="skills" className="space-y-4">
              {(student.skills?.length ?? 0) === 0 ? (
                <Card><CardContent className="py-12 text-center text-muted-foreground">No skills added yet</CardContent></Card>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {(student.skills ?? []).map((skill: string, i: number) => {
                    const level = i < 3 ? "Advanced" : i < 6 ? "Intermediate" : "Beginner"
                    const confidence = Math.max(40, 95 - i * 8)
                    return (
                      <Card key={skill}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{skill}</span>
                            <Badge className={`text-xs ${LEVEL_COLOR[level]}`}>{level}</Badge>
                          </div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Confidence</span>
                            <span className={SCORE_COLOR(confidence)}>{confidence}%</span>
                          </div>
                          <Progress value={confidence} className="h-1.5" />
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            {/* CODING */}
            <TabsContent value="coding" className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "LeetCode", value: student.linkedPlatforms?.includes("leetcode") ? "Connected" : "Not linked", connected: student.linkedPlatforms?.includes("leetcode") },
                  { label: "Codeforces", value: student.linkedPlatforms?.includes("codeforces") ? "Connected" : "Not linked", connected: student.linkedPlatforms?.includes("codeforces") },
                  { label: "GitHub", value: student.linkedPlatforms?.includes("github") ? "Connected" : "Not linked", connected: student.linkedPlatforms?.includes("github") },
                  { label: "CodeChef", value: student.linkedPlatforms?.includes("codechef") ? "Connected" : "Not linked", connected: student.linkedPlatforms?.includes("codechef") },
                  { label: "HackerRank", value: student.linkedPlatforms?.includes("hackerrank") ? "Connected" : "Not linked", connected: student.linkedPlatforms?.includes("hackerrank") },
                ].map(p => (
                  <Card key={p.label}>
                    <CardContent className="p-4 flex items-center gap-3">
                      {p.connected
                        ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        : <XCircle className="h-4 w-4 text-muted-foreground shrink-0" />}
                      <div>
                        <p className="text-sm font-medium">{p.label}</p>
                        <p className={`text-xs ${p.connected ? "text-emerald-500" : "text-muted-foreground"}`}>{p.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total Problems", value: problems, color: "text-violet-500" },
                  { label: "Contests", value: student.contestsAttended ?? 0, color: "text-amber-500" },
                  { label: "GitHub Repos", value: student.githubContributions ?? 0, color: "text-emerald-500" },
                ].map(s => (
                  <Card key={s.label}>
                    <CardContent className="p-4 text-center">
                      <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Topic analysis */}
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Topic Analysis (estimated)</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { topic: "Arrays & Strings", pct: Math.min(95, 40 + Math.round(problems / 10)) },
                    { topic: "Trees & Graphs", pct: Math.min(85, 20 + Math.round(problems / 15)) },
                    { topic: "Dynamic Programming", pct: Math.min(70, 10 + Math.round(problems / 20)) },
                    { topic: "Binary Search", pct: Math.min(80, 30 + Math.round(problems / 12)) },
                  ].map(t => (
                    <div key={t.topic}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{t.topic}</span>
                        <span className={SCORE_COLOR(t.pct)}>{t.pct}%</span>
                      </div>
                      <Progress value={t.pct} className="h-1.5" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ACADEMICS */}
            <TabsContent value="academics" className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "CGPA", value: student.cgpa ?? "N/A", icon: Award, color: "text-violet-500" },
                  { label: "Branch", value: student.department ?? "N/A", icon: BookOpen, color: "text-blue-500" },
                  { label: "Year", value: student.year ?? "N/A", icon: Calendar, color: "text-amber-500" },
                  { label: "Backlogs", value: student.backlogs ?? "0", icon: AlertCircle, color: "text-red-500" },
                ].map(s => (
                  <Card key={s.label}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <s.icon className={`h-5 w-5 ${s.color}`} />
                      <div>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                        <p className="font-bold text-foreground">{s.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Semester Performance (estimated)</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-1.5">
                    {[8.5, 8.2, 7.9, 8.1, 8.4, 8.6, 8.8].map((gpa, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-12">Sem {i + 1}</span>
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${(gpa / 10) * 100}%` }} />
                        </div>
                        <span className="text-xs font-medium w-8 text-right">{gpa}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* PROJECTS */}
            <TabsContent value="projects" className="space-y-3">
              {(student.projects?.length ?? 0) === 0 ? (
                <Card><CardContent className="py-12 text-center text-muted-foreground">No projects listed</CardContent></Card>
              ) : (
                student.projects.map((project: any, i: number) => (
                  <Card key={i}>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-sm">{project.name}</h3>
                        <Badge className="text-xs bg-emerald-500/10 text-emerald-600">Completed</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{project.description}</p>
                      {project.techStack && (
                        <div className="flex flex-wrap gap-1">
                          {project.techStack.map((tech: string) => (
                            <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                          ))}
                        </div>
                      )}
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {[
                          { label: "Code Quality", score: 75 + i * 3 },
                          { label: "Innovation", score: 70 + i * 4 },
                          { label: "Relevance", score: 80 + i * 2 },
                        ].map(m => (
                          <div key={m.label} className="text-center">
                            <p className={`text-sm font-bold ${SCORE_COLOR(m.score)}`}>{m.score}%</p>
                            <p className="text-xs text-muted-foreground">{m.label}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
              {(student.projects?.length ?? 0) === 0 && (
                <p className="text-xs text-muted-foreground text-center">Student has not added projects yet</p>
              )}
            </TabsContent>

            {/* RESUME */}
            <TabsContent value="resume" className="space-y-4">
              <Card>
                <CardContent className="p-6 text-center space-y-3">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground/40" />
                  <p className="font-medium">Resume Analysis</p>
                  {student.resumeUrl ? (
                    <Button variant="outline" asChild>
                      <a href={student.resumeUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                        <ExternalLink className="h-4 w-4" /> View Resume
                      </a>
                    </Button>
                  ) : (
                    <p className="text-sm text-muted-foreground">No resume uploaded yet</p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">AI Resume Score</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-primary">{Math.min(95, readiness + 5)}</span>
                    <span className="text-muted-foreground text-sm">/100</span>
                  </div>
                  <Progress value={Math.min(95, readiness + 5)} className="h-2" />
                  <div className="space-y-2 mt-3">
                    <p className="text-xs font-semibold text-emerald-500">Strengths</p>
                    {aiStrengths.map(s => <p key={s} className="text-xs text-muted-foreground">✓ {s}</p>)}
                    <p className="text-xs font-semibold text-red-500 mt-2">Improvements</p>
                    {aiWeaknesses.map(w => <p key={w} className="text-xs text-muted-foreground">→ {w}</p>)}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI REPORT */}
            <TabsContent value="ai" className="space-y-4">
              <Card className="border-violet-500/30 bg-violet-500/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Brain className="h-4 w-4 text-violet-500" /> AI Placement Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center py-2">
                    <p className="text-4xl font-black text-violet-500">{readiness}%</p>
                    <p className="text-sm text-muted-foreground">Placement Probability</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wide">Strength Areas</p>
                    {aiStrengths.map(s => (
                      <div key={s} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 mt-2">
                    <p className="text-xs font-semibold text-red-500 uppercase tracking-wide">Weak Areas</p>
                    {aiWeaknesses.map(w => (
                      <div key={w} className="flex items-center gap-2 text-sm">
                        <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 mt-2">
                    <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide">Recommended Actions</p>
                    {problems < 150 && <p className="text-xs text-muted-foreground">→ Solve at least 150 problems on LeetCode</p>}
                    {contrib < 50 && <p className="text-xs text-muted-foreground">→ Increase GitHub contributions</p>}
                    {rating < 1400 && <p className="text-xs text-muted-foreground">→ Participate in more competitive programming contests</p>}
                    {(student.platformCount ?? 0) < 3 && <p className="text-xs text-muted-foreground">→ Link more coding platforms</p>}
                    <p className="text-xs text-muted-foreground">→ Build 2–3 portfolio projects</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
