"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users, Activity, Globe, TrendingUp, Shield,
  RefreshCw, AlertTriangle, CheckCircle, XCircle, BarChart3,
  Crown, Briefcase, GraduationCap, Building2, Search,
  UserCheck, UserX, Trash2, MessageSquare, PieChart, FileText,
  Star, ChevronDown, ChevronUp, PenLine, Eye, EyeOff, Plus, CalendarDays,
} from "lucide-react"

interface AdminData {
  summary: {
    totalUsers: number; activeUsers: number; totalStudents: number
    totalColleges: number; totalRecruiters: number; platformConnections: number
    totalProblems: number; jobApplications: number
  }
  recentActivity: Array<{ type: string; user: string; action: string; timestamp: string }>
  platformHealth: Array<{ platform: string; status: "healthy" | "degraded" | "down"; connections: number; lastSync: string; responseTime: number }>
  userGrowth: { daily: number; weekly: number; monthly: number }
  systemMetrics: { cpuUsage: number; memoryUsage: number; diskUsage: number; apiCalls: number; errorRate: number }
  topPerformers: Array<{ name: string; email: string; role: string; totalProblems: number; rating: number }>
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    verified: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    healthy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    degraded: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    down: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    student: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400",
    college: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    recruiter: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${map[status] ?? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}>
      {status}
    </span>
  )
}

function StatCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string | number; sub?: string; color: string }) {
  const colorMap: Record<string, { border: string; bg: string; iconCls: string; val: string }> = {
    blue:    { border: "border-blue-200 dark:border-blue-800",    bg: "bg-blue-50 dark:bg-blue-900/20",    iconCls: "text-blue-600 dark:text-blue-400",    val: "text-blue-700 dark:text-blue-400" },
    green:   { border: "border-green-200 dark:border-green-800",  bg: "bg-green-50 dark:bg-green-900/20",  iconCls: "text-green-600 dark:text-green-400",  val: "text-green-700 dark:text-green-400" },
    violet:  { border: "border-violet-200 dark:border-violet-800",bg: "bg-violet-50 dark:bg-violet-900/20",iconCls: "text-violet-600 dark:text-violet-400",val: "text-violet-700 dark:text-violet-400" },
    amber:   { border: "border-amber-200 dark:border-amber-800",  bg: "bg-amber-50 dark:bg-amber-900/20",  iconCls: "text-amber-600 dark:text-amber-400",  val: "text-amber-700 dark:text-amber-400" },
    emerald: { border: "border-emerald-200 dark:border-emerald-800",bg:"bg-emerald-50 dark:bg-emerald-900/20",iconCls:"text-emerald-600 dark:text-emerald-400",val:"text-emerald-700 dark:text-emerald-400" },
  }
  const c = colorMap[color] ?? colorMap.blue
  return (
    <Card className={c.border}>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-1.5 rounded-lg ${c.bg}`}><Icon className={`h-4 w-4 ${c.iconCls}`} /></div>
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
        </div>
        <p className={`text-3xl font-bold ${c.val}`}>{typeof value === "number" ? value.toLocaleString() : value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  )
}

export function AdminDashboard() {
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [users, setUsers] = useState<any[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [userSearch, setUserSearch] = useState("")
  const [userRoleFilter, setUserRoleFilter] = useState("all")
  const [feedbackList, setFeedbackList] = useState<any[]>([])
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [feedbackFilter, setFeedbackFilter] = useState("all")
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null)

  useEffect(() => {
    fetchAdminData()
    const interval = setInterval(fetchAdminData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchAdminData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/dashboard")
      if (res.ok) { const r = await res.json(); setData(r.data) } else setData(getMockData())
    } catch { setData(getMockData()) }
    finally { setLoading(false) }
  }

  const fetchUsers = async () => {
    setUsersLoading(true)
    try {
      const res = await fetch("/api/debug/users")
      if (res.ok) { const r = await res.json(); setUsers(r.users ?? []) }
    } catch { /* ignore */ }
    finally { setUsersLoading(false) }
  }

  const fetchFeedback = async () => {
    setFeedbackLoading(true)
    try {
      const res = await fetch("/api/admin/feedback")
      if (res.ok) { const r = await res.json(); setFeedbackList(r.feedback ?? []) }
    } catch { /* ignore */ }
    finally { setFeedbackLoading(false) }
  }

  const updateFeedbackStatus = async (id: string, status: "approved" | "rejected") => {
    await fetch(`/api/admin/feedback?id=${id}&status=${status}`, { method: "PATCH" })
    setFeedbackList(prev => prev.map(f => f._id?.toString() === id ? { ...f, status } : f))
  }

  const handleTabChange = (v: string) => {
    setActiveTab(v)
    if (v === "users" && users.length === 0) fetchUsers()
    if (v === "feedback") fetchFeedback()
  }

  const filteredUsers = users.filter(u => {
    const ms = !userSearch || u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase())
    const mr = userRoleFilter === "all" || u.role === userRoleFilter
    return ms && mr
  })

  const filteredFeedback = feedbackList.filter(f => {
    if (feedbackFilter === "all") return true
    if (["pending","approved","rejected"].includes(feedbackFilter)) return f.status === feedbackFilter
    if (feedbackFilter === "student") return f.role?.toLowerCase().startsWith("student")
    if (feedbackFilter === "college") return f.role?.toLowerCase().includes("tpo") || f.role?.toLowerCase().includes("college")
    if (feedbackFilter === "recruiter") return f.role?.toLowerCase().includes("recruiter")
    return true
  })

  if (loading && !data) return (
    <div className="pt-14 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
        <p className="text-muted-foreground text-sm">Loading admin data...</p>
      </div>
    </div>
  )

  if (!data) return null

  return (
    <div className="pt-14 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30">
              <Crown className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Full system oversight and management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Admin Access</span>
            <Button onClick={fetchAdminData} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="w-full grid grid-cols-3 sm:grid-cols-6 h-auto gap-1 bg-muted p-1 rounded-xl">
            <TabsTrigger value="overview"     className="text-xs py-2 rounded-lg">Overview</TabsTrigger>
            <TabsTrigger value="users"        className="text-xs py-2 rounded-lg">Users</TabsTrigger>
            <TabsTrigger value="verification" className="text-xs py-2 rounded-lg">Verification</TabsTrigger>
            <TabsTrigger value="jobs"         className="text-xs py-2 rounded-lg">Jobs</TabsTrigger>
            <TabsTrigger value="feedback"     className="text-xs py-2 rounded-lg">Feedback</TabsTrigger>
            <TabsTrigger value="analytics"    className="text-xs py-2 rounded-lg">Analytics</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              <StatCard icon={Users}     label="Total Users"      value={data.summary.totalUsers}         sub={`+${data.userGrowth.daily} today`} color="blue" />
              <StatCard icon={Activity}  label="Active Today"     value={data.summary.activeUsers}        color="green" />
              <StatCard icon={Globe}     label="Platform Links"   value={data.summary.platformConnections} color="violet" />
              <StatCard icon={Briefcase} label="Job Applications" value={data.summary.jobApplications}    color="amber" />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Students",   icon: GraduationCap, color: "text-violet-500",  items: [["Total", data.summary.totalStudents], ["Problems solved", data.summary.totalProblems.toLocaleString()], ["Platform links", data.summary.platformConnections], ["Job apps", data.summary.jobApplications]] },
                { label: "Colleges",   icon: Building2,     color: "text-emerald-500", items: [["Registered", data.summary.totalColleges], ["Students managed", data.summary.totalStudents], ["Active today", Math.floor(data.summary.activeUsers * 0.1)]] },
                { label: "Recruiters", icon: Briefcase,     color: "text-amber-500",   items: [["Registered", data.summary.totalRecruiters], ["Job postings", Math.floor(data.summary.jobApplications / 3)], ["Active today", Math.floor(data.summary.activeUsers * 0.1)]] },
              ].map(({ label, icon: Icon, color, items }) => (
                <Card key={label}>
                  <CardHeader className="pb-3 pt-4 px-4">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${color}`} /> {label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 space-y-2">
                    {items.map(([k, v]) => (
                      <div key={String(k)} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-semibold">{v}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3 pt-4 px-4">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-blue-500" /> User Growth</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="grid grid-cols-3 divide-x divide-border text-center">
                    {[["Today", data.userGrowth.daily], ["This week", data.userGrowth.weekly], ["This month", data.userGrowth.monthly]].map(([l, v]) => (
                      <div key={String(l)} className="px-3 py-2">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">+{v}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{l}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3 pt-4 px-4">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2"><Activity className="h-4 w-4 text-purple-500" /> Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-1.5">
                  {data.recentActivity.slice(0, 5).map((a, i) => (
                    <div key={i} className="flex items-center justify-between text-sm py-1 border-b border-border/40 last:border-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                        <span className="text-muted-foreground truncate text-xs">{a.user}</span>
                        <span className="truncate text-xs">{a.action}</span>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">{a.timestamp}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader className="pb-3 pt-4 px-4">
                <CardTitle className="text-sm font-semibold flex items-center gap-2"><Globe className="h-4 w-4 text-green-500" /> Platform Health</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-1">
                {data.platformHealth.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                    <div className="flex items-center gap-2">
                      {p.status === "healthy" ? <CheckCircle className="h-4 w-4 text-green-500" /> : p.status === "degraded" ? <AlertTriangle className="h-4 w-4 text-yellow-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                      <span className="text-sm font-medium">{p.platform}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="hidden sm:inline">{p.connections} conns</span>
                      <span className="hidden sm:inline">{p.responseTime}ms</span>
                      <span>synced {p.lastSync}</span>
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* USERS */}
          <TabsContent value="users" className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name or email..." className="pl-9" value={userSearch} onChange={e => setUserSearch(e.target.value)} />
              </div>
              <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                <SelectTrigger className="w-40"><SelectValue placeholder="All roles" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="college">Colleges</SelectItem>
                  <SelectItem value="recruiter">Recruiters</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchUsers} variant="outline" size="sm" disabled={usersLoading}>
                <RefreshCw className={`h-4 w-4 mr-1.5 ${usersLoading ? "animate-spin" : ""}`} /> Reload
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "All Users",  value: data.summary.totalUsers,      icon: Users,        color: "text-blue-500" },
                { label: "Students",   value: data.summary.totalStudents,   icon: GraduationCap, color: "text-violet-500" },
                { label: "Colleges",   value: data.summary.totalColleges,   icon: Building2,    color: "text-emerald-500" },
                { label: "Recruiters", value: data.summary.totalRecruiters, icon: Briefcase,    color: "text-amber-500" },
              ].map(s => (
                <Card key={s.label} className="p-4">
                  <div className="flex items-center gap-2 mb-1"><s.icon className={`h-4 w-4 ${s.color}`} /><span className="text-xs text-muted-foreground">{s.label}</span></div>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </Card>
              ))}
            </div>
            {usersLoading ? (
              <div className="flex justify-center py-12"><RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : filteredUsers.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground text-sm">
                {users.length === 0 ? "Click Reload to fetch users." : "No users match your search."}
              </CardContent></Card>
            ) : (
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        {["Name","Email","Role","Joined","Status"].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u, i) => (
                        <tr key={u._id ?? i} className="border-b border-border/40 last:border-0 hover:bg-muted/20">
                          <td className="px-4 py-3 font-medium">{u.name ?? "—"}</td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{u.email}</td>
                          <td className="px-4 py-3"><StatusBadge status={u.role ?? "student"} /></td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</td>
                          <td className="px-4 py-3"><StatusBadge status="active" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* VERIFICATION */}
          <TabsContent value="verification" className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3 pt-4 px-4">
                  <CardTitle className="text-base font-semibold flex items-center gap-2"><Building2 className="h-5 w-5 text-emerald-500" /> Approve Colleges</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  <p className="text-sm text-muted-foreground">Review and approve newly registered colleges.</p>
                  <div className="space-y-2">
                    {["Sample College A","Sample College B"].map((name, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
                        <div>
                          <p className="text-sm font-medium">{name}</p>
                          <p className="text-xs text-muted-foreground">tpo{i+1}@college.edu - Pending</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs px-3"><UserCheck className="h-3 w-3 mr-1" />Approve</Button>
                          <Button size="sm" variant="destructive" className="h-7 text-xs px-3"><UserX className="h-3 w-3 mr-1" />Reject</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3 pt-4 px-4">
                  <CardTitle className="text-base font-semibold flex items-center gap-2"><Trash2 className="h-5 w-5 text-red-500" /> Remove Fake Colleges</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  <p className="text-sm text-muted-foreground">Remove colleges that appear to be fake or spam.</p>
                  <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search college name..." className="pl-9" /></div>
                  <div className="p-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
                    <p className="text-xs text-red-700 dark:text-red-400">Warning: Removing a college also removes all associated student data.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader className="pb-3 pt-4 px-4">
                <CardTitle className="text-sm font-semibold flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Verified Colleges ({data.summary.totalColleges})</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {data.summary.totalColleges === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No colleges registered yet.</p>
                ) : (
                  Array.from({ length: Math.min(8, data.summary.totalColleges) }, (_, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
                      <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-emerald-500" /><span className="text-sm">College #{i+1}</span></div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status="verified" />
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 px-2"><Trash2 className="h-3 w-3 mr-1" />Remove</Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* JOBS */}
          <TabsContent value="jobs" className="space-y-5">
            <div className="grid gap-4 grid-cols-3">
              <StatCard icon={Briefcase}     label="Total Jobs"         value={Math.floor(data.summary.jobApplications / 3)} color="amber" />
              <StatCard icon={Users}         label="Applications"       value={data.summary.jobApplications}                 color="blue" />
              <StatCard icon={CheckCircle}   label="Verified Recruiters" value={data.summary.totalRecruiters}               color="emerald" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3 pt-4 px-4">
                  <CardTitle className="text-base font-semibold flex items-center gap-2"><Shield className="h-5 w-5 text-blue-500" /> Verify Companies</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  <p className="text-sm text-muted-foreground">Verify companies before they can post jobs.</p>
                  <div className="space-y-2">
                    {["TechCorp India Pvt Ltd","StartupXYZ Solutions"].map((company, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
                        <div>
                          <p className="text-sm font-medium">{company}</p>
                          <p className="text-xs text-muted-foreground">Pending verification</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs px-3">Verify</Button>
                          <Button size="sm" variant="destructive" className="h-7 text-xs px-3">Reject</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3 pt-4 px-4">
                  <CardTitle className="text-base font-semibold flex items-center gap-2"><FileText className="h-5 w-5 text-amber-500" /> Approve Job Posts</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  <p className="text-sm text-muted-foreground">Review and approve job postings before they go live.</p>
                  <div className="space-y-2">
                    {["Software Engineer - Google","Data Analyst - Infosys","SDE Intern - Razorpay"].map((job, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
                        <div>
                          <p className="text-sm font-medium">{job}</p>
                          <p className="text-xs text-muted-foreground">Posted {(i+1)*2}h ago - Pending</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs px-2"><CheckCircle className="h-3 w-3 mr-1" />Approve</Button>
                          <Button size="sm" variant="destructive" className="h-7 text-xs px-2"><Trash2 className="h-3 w-3 mr-1" />Remove</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* FEEDBACK */}
          <TabsContent value="feedback" className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <Select value={feedbackFilter} onValueChange={setFeedbackFilter}>
                <SelectTrigger className="w-48"><SelectValue placeholder="Filter feedback" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All feedback</SelectItem>
                  <SelectItem value="pending">Pending review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="student">Student issues</SelectItem>
                  <SelectItem value="college">College issues</SelectItem>
                  <SelectItem value="recruiter">Recruiter issues</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchFeedback} variant="outline" size="sm" disabled={feedbackLoading}>
                <RefreshCw className={`h-4 w-4 mr-1.5 ${feedbackLoading ? "animate-spin" : ""}`} /> Refresh
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Pending",  count: feedbackList.filter(f => f.status === "pending").length,  color: "text-yellow-600 dark:text-yellow-400" },
                { label: "Approved", count: feedbackList.filter(f => f.status === "approved").length, color: "text-green-600 dark:text-green-400" },
                { label: "Rejected", count: feedbackList.filter(f => f.status === "rejected").length, color: "text-red-600 dark:text-red-400" },
              ].map(s => (
                <Card key={s.label} className="p-4 text-center">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </Card>
              ))}
            </div>
            {feedbackLoading ? (
              <div className="flex justify-center py-12"><RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : filteredFeedback.length === 0 ? (
              <Card><CardContent className="py-12 text-center">
                <MessageSquare className="h-8 w-8 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-muted-foreground text-sm">{feedbackList.length === 0 ? "No feedback yet." : "No feedback matches this filter."}</p>
              </CardContent></Card>
            ) : (
              <div className="space-y-2">
                {filteredFeedback.map((fb: any) => {
                  const id = fb._id?.toString()
                  const isExpanded = expandedFeedback === id
                  return (
                    <Card key={id} className="overflow-hidden">
                      <div className="flex items-start gap-3 p-4 cursor-pointer hover:bg-muted/20" onClick={() => setExpandedFeedback(isExpanded ? null : id)}>
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                          {fb.avatar ?? (fb.name?.[0] ?? "?")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm">{fb.name}</span>
                            <span className="text-xs text-muted-foreground">{fb.role}</span>
                            <StatusBadge status={fb.status ?? "pending"} />
                            {fb.type === "general" && fb.rating && <span className="text-xs text-amber-500">{"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}</span>}
                          </div>
                          {fb.type === "general" && fb.text && <p className="text-sm text-muted-foreground mt-0.5 truncate">"{fb.text}"</p>}
                          {fb.type === "specific" && <p className="text-xs text-muted-foreground mt-0.5">Survey - {fb.answers?.length ?? 0} answers</p>}
                          <p className="text-xs text-muted-foreground/50 mt-0.5">{fb.createdAt ? new Date(fb.createdAt).toLocaleString() : ""}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs px-3" disabled={fb.status === "approved"} onClick={() => updateFeedbackStatus(id, "approved")}>Approve</Button>
                          <Button size="sm" variant="destructive" className="h-7 text-xs px-3" disabled={fb.status === "rejected"} onClick={() => updateFeedbackStatus(id, "rejected")}>Reject</Button>
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="border-t border-border/50 bg-muted/10 px-4 py-3">
                          {fb.type === "general" && <p className="text-sm">"{fb.text}"</p>}
                          {fb.type === "specific" && fb.answers?.map((a: any, i: number) => (
                            <div key={i} className="mb-2">
                              <p className="text-xs font-medium text-muted-foreground">Q: {a.question}</p>
                              <p className="text-sm">A: {a.answer}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* ANALYTICS */}
          <TabsContent value="analytics" className="space-y-5">
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
              <StatCard icon={Briefcase}  label="Job Applications" value={data.summary.jobApplications}   color="blue" />
              <StatCard icon={TrendingUp} label="Monthly Growth"   value={`+${data.userGrowth.monthly}`}  color="green" />
              <StatCard icon={Globe}      label="Platform Links"   value={data.summary.platformConnections} color="violet" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3 pt-4 px-4">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2"><PieChart className="h-4 w-4 text-blue-500" /> User Distribution</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  {[
                    { label: "Students",   value: data.summary.totalStudents,   color: "bg-violet-500" },
                    { label: "Colleges",   value: data.summary.totalColleges,   color: "bg-emerald-500" },
                    { label: "Recruiters", value: data.summary.totalRecruiters, color: "bg-amber-500" },
                  ].map(item => {
                    const pct = data.summary.totalUsers > 0 ? Math.round((item.value / data.summary.totalUsers) * 100) : 0
                    return (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{item.label}</span>
                          <span className="font-medium">{item.value} <span className="text-muted-foreground">({pct}%)</span></span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3 pt-4 px-4">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2"><BarChart3 className="h-4 w-4 text-green-500" /> Placement Rate</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-4">
                  {[
                    { label: "Applications per student", pct: Math.min(100, Math.round((data.summary.totalStudents > 0 ? data.summary.jobApplications / data.summary.totalStudents : 0) * 100)), color: "bg-green-500" },
                    { label: "Daily engagement",         pct: data.summary.totalUsers > 0 ? Math.round((data.summary.activeUsers / data.summary.totalUsers) * 100) : 0, color: "bg-blue-500" },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1"><span>{item.label}</span><span className="font-medium">{item.pct}%</span></div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden"><div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} /></div>
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                    <div><p className="text-xs text-muted-foreground">Total problems</p><p className="font-bold text-lg">{data.summary.totalProblems.toLocaleString()}</p></div>
                    <div><p className="text-xs text-muted-foreground">Avg per student</p><p className="font-bold text-lg">{data.summary.totalStudents > 0 ? Math.floor(data.summary.totalProblems / data.summary.totalStudents) : 0}</p></div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader className="pb-3 pt-4 px-4">
                <CardTitle className="text-sm font-semibold flex items-center gap-2"><Star className="h-4 w-4 text-amber-500" /> Top Performers</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {["#","Name","Email","Problems","Rating"].map(h => <th key={h} className={`py-2 px-3 text-xs font-semibold text-muted-foreground ${h==="Problems"||h==="Rating"?"text-right":"text-left"}`}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {data.topPerformers.length === 0 ? (
                        <tr><td colSpan={5} className="text-center py-6 text-muted-foreground text-sm">No data available.</td></tr>
                      ) : data.topPerformers.map((p, i) => (
                        <tr key={i} className="border-b border-border/40 last:border-0 hover:bg-muted/20">
                          <td className="py-2.5 px-3 text-muted-foreground">{i+1}</td>
                          <td className="py-2.5 px-3 font-medium">{p.name}</td>
                          <td className="py-2.5 px-3 text-muted-foreground text-xs">{p.email}</td>
                          <td className="py-2.5 px-3 text-right font-semibold">{p.totalProblems}</td>
                          <td className="py-2.5 px-3 text-right text-amber-500 font-medium">{p.rating}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function getMockData(): AdminData {
  return {
    summary: { totalUsers: 1247, activeUsers: 89, totalStudents: 1050, totalColleges: 45, totalRecruiters: 152, platformConnections: 3421, totalProblems: 45678, jobApplications: 234 },
    recentActivity: [
      { type: "signup", user: "alex.chen@demo.com",     action: "signed up as student",        timestamp: "2 min ago" },
      { type: "link",   user: "priya.sharma@demo.com",  action: "connected LeetCode",          timestamp: "5 min ago" },
      { type: "login",  user: "placement@mit.edu",      action: "logged in",                   timestamp: "8 min ago" },
      { type: "apply",  user: "john.doe@student.com",   action: "applied to Software Engineer", timestamp: "12 min ago" },
      { type: "view",   user: "recruiter@google.com",   action: "viewed candidate search",     timestamp: "15 min ago" },
    ],
    platformHealth: [
      { platform: "LeetCode",   status: "healthy",  connections: 856,  lastSync: "2 min ago",  responseTime: 245 },
      { platform: "GitHub",     status: "healthy",  connections: 1203, lastSync: "1 min ago",  responseTime: 180 },
      { platform: "Codeforces", status: "degraded", connections: 634,  lastSync: "10 min ago", responseTime: 890 },
      { platform: "CodeChef",   status: "healthy",  connections: 428,  lastSync: "3 min ago",  responseTime: 320 },
    ],
    userGrowth: { daily: 12, weekly: 87, monthly: 342 },
    systemMetrics: { cpuUsage: 34, memoryUsage: 52, diskUsage: 28, apiCalls: 4521, errorRate: 0.2 },
    topPerformers: [
      { name: "Alex Chen",    email: "alex@demo.com",   role: "student", totalProblems: 847, rating: 2100 },
      { name: "Priya Sharma", email: "priya@demo.com",  role: "student", totalProblems: 723, rating: 1950 },
      { name: "Rahul Kumar",  email: "rahul@demo.com",  role: "student", totalProblems: 681, rating: 1875 },
    ],
  }
}
