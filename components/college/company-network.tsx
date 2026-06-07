"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Building2, Users, Handshake, TrendingUp, Star, Mail,
  Calendar, FileText, CheckCircle2, Clock, XCircle, Plus,
  Search, BarChart3, MessageSquare, IndianRupee,
  Sparkles, Eye, RefreshCw, Award,
} from "lucide-react"

const PARTNERS = [
  { id: "1", name: "Google",    logo: "GO", industry: "Software/AI",    size: "MNC",     status: "active",  score: 94, totalHired: 45,  avgPackage: "28 LPA", lastVisit: "Mar 2026", mou: true,  mouExpiry: "2028", hiringTypes: ["Full-time","Internship"], notes: "Premium partner. Strong interest in ML and SWE." },
  { id: "2", name: "Microsoft", logo: "MS", industry: "Software/Cloud", size: "MNC",     status: "active",  score: 91, totalHired: 62,  avgPackage: "22 LPA", lastVisit: "Feb 2026", mou: true,  mouExpiry: "2027", hiringTypes: ["Full-time","Internship"], notes: "Visits annually. Prefers AI/ML and Cloud students." },
  { id: "3", name: "Infosys",   logo: "IN", industry: "IT Services",    size: "MNC",     status: "active",  score: 78, totalHired: 180, avgPackage: "3.6 LPA", lastVisit: "Jan 2026", mou: true, mouExpiry: "2029", hiringTypes: ["Full-time","Training"],   notes: "Mass recruiter. Runs InfyTQ training program." },
  { id: "4", name: "Razorpay",  logo: "RP", industry: "Fintech",        size: "Unicorn", status: "active",  score: 82, totalHired: 12,  avgPackage: "18 LPA", lastVisit: "Dec 2025", mou: false, mouExpiry: null,   hiringTypes: ["Internship","Full-time"],  notes: "New partnership. Great packages for web dev." },
  { id: "5", name: "Wipro",     logo: "WI", industry: "IT Services",    size: "MNC",     status: "expired", score: 55, totalHired: 90,  avgPackage: "3.5 LPA", lastVisit: "Jun 2022", mou: false, mouExpiry: null,  hiringTypes: ["Full-time"],              notes: "Partnership lapsed. Renewal pending." },
  { id: "6", name: "Swiggy",    logo: "SW", industry: "Logistics/AI",   size: "Unicorn", status: "pending", score: 0,  totalHired: 0,   avgPackage: "—",      lastVisit: "—",        mou: false, mouExpiry: null,   hiringTypes: ["Internship","Full-time"],  notes: "Request sent. Awaiting response." },
]

const DISCOVER = [
  { id: "d1", name: "NVIDIA",   logo: "NV", industry: "AI/ML",           size: "MNC",     match: 95, reason: "Hiring AI Engineers — matches your 300+ AI students",    hiringTypes: ["Full-time","Research"]   },
  { id: "d2", name: "Amazon",   logo: "AZ", industry: "E-Commerce/Cloud", size: "MNC",     match: 91, reason: "SDE-1 and cloud roles — strong DSA demand",              hiringTypes: ["Full-time","Internship"] },
  { id: "d3", name: "Meesho",   logo: "ME", industry: "E-Commerce",       size: "Unicorn", match: 87, reason: "ML + Full Stack — matches your top skill profile",        hiringTypes: ["Internship","Full-time"] },
  { id: "d4", name: "PhonePe",  logo: "PP", industry: "Fintech",          size: "Unicorn", match: 84, reason: "Fintech backend roles — Java, Spring Boot demand",        hiringTypes: ["Full-time"]              },
  { id: "d5", name: "Adobe",    logo: "AD", industry: "Software/Design",  size: "MNC",     match: 80, reason: "SDE roles with strong product focus",                     hiringTypes: ["Full-time","Internship"] },
  { id: "d6", name: "Zomato",   logo: "ZO", industry: "Food Tech",        size: "Unicorn", match: 76, reason: "Android + Data roles — active campus recruiter",          hiringTypes: ["Internship"]             },
]

const VISITS = [
  { id: "v1", company: "Google",    type: "Placement Drive",   date: "2026-02-20", participants: 320, status: "upcoming",   contact: "Sarah Johnson"  },
  { id: "v2", company: "Microsoft", type: "Internship Drive",  date: "2026-03-05", participants: 250, status: "upcoming",   contact: "Michael Chen"   },
  { id: "v3", company: "Infosys",   type: "Workshop",          date: "2026-01-28", participants: 500, status: "completed",  contact: "Rahul Sharma"   },
  { id: "v4", company: "Razorpay",  type: "Hackathon",         date: "2026-02-10", participants: 150, status: "upcoming",   contact: "Priya Patel"    },
]

const PROGRAMS = [
  { id: "p1", company: "Google",    title: "Google Cloud Workshop",       type: "Workshop",      seats: 300, enrolled: 250, status: "active",   endDate: "2026-03-30" },
  { id: "p2", company: "Microsoft", title: "Azure Certification Bootcamp", type: "Certification", seats: 200, enrolled: 180, status: "active",   endDate: "2026-04-15" },
  { id: "p3", company: "Infosys",   title: "InfyTQ Training Program",     type: "Course",        seats: 500, enrolled: 420, status: "active",   endDate: "2026-05-01" },
  { id: "p4", company: "Razorpay",  title: "Fintech Dev Bootcamp",        type: "Bootcamp",      seats: 100, enrolled: 60,  status: "upcoming", endDate: "2026-06-01" },
]

const FEEDBACK = [
  { company: "Google",    year: 2025, technical: 8.5, communication: 7,   problemSolving: 9,   suggestion: "Improve system design and low-level design skills."   },
  { company: "Microsoft", year: 2025, technical: 7.5, communication: 8,   problemSolving: 8,   suggestion: "Students need stronger cloud fundamentals."           },
  { company: "Infosys",   year: 2025, technical: 7,   communication: 8.5, problemSolving: 7,   suggestion: "Good communication. Improve coding speed."            },
]

const STATUS_CFG: Record<string, { label: string; color: string; gradient: string; icon: any }> = {
  active:   { label: "Active",   color: "bg-emerald-500/10 text-emerald-600", gradient: "from-emerald-500/10 to-teal-500/5 border-emerald-500/20",  icon: CheckCircle2 },
  pending:  { label: "Pending",  color: "bg-amber-500/10 text-amber-600",     gradient: "from-amber-500/10 to-orange-500/5 border-amber-500/20",    icon: Clock        },
  expired:  { label: "Expired",  color: "bg-muted text-muted-foreground",     gradient: "from-muted/30 to-muted/10 border-border",                  icon: XCircle      },
  rejected: { label: "Rejected", color: "bg-red-500/10 text-red-600",         gradient: "from-red-500/10 to-red-500/5 border-red-500/20",           icon: XCircle      },
}

export function CompanyNetwork() {
  const [tab, setTab] = useState("network")
  const [search, setSearch] = useState("")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [requestDialog, setRequestDialog] = useState<any>(null)
  const [visitDialog, setVisitDialog] = useState(false)
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set())

  const filtered = PARTNERS.filter(p => {
    const ms = !search || p.name.toLowerCase().includes(search.toLowerCase())
    const mi = industryFilter === "all" || p.industry.toLowerCase().includes(industryFilter.toLowerCase())
    return ms && mi
  })

  const active = PARTNERS.filter(p => p.status === "active")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Handshake className="h-5 w-5 text-primary" /> Company Network
          </h2>
          <p className="text-sm text-muted-foreground">Manage partnerships, MoUs, and company relationships</p>
        </div>
        <Button onClick={() => setTab("discover")} className="gap-2">
          <Plus className="h-4 w-4" /> Add Company
        </Button>
      </div>

      {/* Stat pills */}
      <div className="flex items-center gap-1 flex-wrap">
        {[
          { label: "Partners",  value: PARTNERS.length,                       color: "bg-primary/10 text-primary"          },
          { label: "Active",    value: active.length,                          color: "bg-emerald-500/10 text-emerald-600"   },
          { label: "Pending",   value: PARTNERS.filter(p=>p.status==="pending").length, color: "bg-amber-500/10 text-amber-600" },
          { label: "MoUs",      value: PARTNERS.filter(p=>p.mou).length,      color: "bg-blue-500/10 text-blue-600"         },
          { label: "Hired",     value: PARTNERS.reduce((s,p)=>s+p.totalHired,0), color: "bg-violet-500/10 text-violet-600"  },
        ].map(s => (
          <span key={s.label} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.color}`}>
            <span className="text-sm font-black">{s.value}</span> {s.label}
          </span>
        ))}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full grid grid-cols-4 sm:grid-cols-7 h-auto gap-1 bg-muted p-1 rounded-xl">
          {[
            { value: "network",   label: "Network",   icon: Building2    },
            { value: "discover",  label: "Discover",  icon: Search       },
            { value: "mou",       label: "MoUs",      icon: FileText     },
            { value: "crm",       label: "CRM",       icon: MessageSquare},
            { value: "visits",    label: "Visits",    icon: Calendar     },
            { value: "programs",  label: "Training",  icon: Award        },
            { value: "analytics", label: "Analytics", icon: BarChart3    },
          ].map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="text-xs py-1.5 rounded-lg flex items-center gap-1">
              <Icon className="h-3 w-3" /><span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── NETWORK ─────────────────────────────────────────── */}
        <TabsContent value="network" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search companies..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Industry" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="ai">AI/ML</SelectItem>
                <SelectItem value="fintech">Fintech</SelectItem>
                <SelectItem value="it services">IT Services</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(p => {
              const st = STATUS_CFG[p.status] ?? STATUS_CFG.expired
              const Icon = st.icon
              return (
                <Card key={p.id} className={`bg-gradient-to-br ${st.gradient} border hover:shadow-md transition-all flex flex-col`}>
                  <CardContent className="p-4 flex flex-col gap-3 h-full">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/70 backdrop-blur font-bold text-xs text-foreground shrink-0">{p.logo}</div>
                        <div>
                          <p className="font-bold text-sm">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.industry} · {p.size}</p>
                        </div>
                      </div>
                      <Badge className={`text-[10px] px-2 py-0.5 gap-1 shrink-0 ${st.color}`}>
                        <Icon className="h-2.5 w-2.5" />{st.label}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {p.totalHired > 0 && <span className="flex items-center gap-1"><Users className="h-3 w-3" />{p.totalHired} hired</span>}
                      {p.avgPackage !== "—" && <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" />{p.avgPackage}</span>}
                      {p.score > 0 && <span className={`font-bold ${p.score>=85?"text-emerald-600":p.score>=70?"text-amber-600":"text-red-500"}`}>{p.score}/100</span>}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {p.mou && <Badge className="text-[10px] px-1.5 py-0 bg-blue-500/10 text-blue-600">MoU</Badge>}
                      {p.hiringTypes.map(t => <Badge key={t} variant="outline" className="text-[10px] px-1.5 py-0">{t}</Badge>)}
                    </div>
                    {p.notes && <p className="text-[10px] text-muted-foreground italic line-clamp-2">"{p.notes}"</p>}
                    <div className="flex gap-1.5 pt-2 border-t border-border/40 mt-auto">
                      <Button variant="outline" size="sm" className="flex-1 h-7 text-[11px] gap-1 bg-background/60"><Eye className="h-3 w-3" />View</Button>
                      <Button variant="outline" size="sm" className="flex-1 h-7 text-[11px] gap-1 bg-background/60"><Mail className="h-3 w-3" />Contact</Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            <button onClick={() => setTab("discover")} className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all min-h-[180px] text-muted-foreground hover:text-primary">
              <Plus className="h-8 w-8 opacity-40" />
              <span className="text-sm font-medium">Add Company</span>
            </button>
          </div>
        </TabsContent>

        {/* ── DISCOVER ────────────────────────────────────────── */}
        <TabsContent value="discover" className="space-y-4 mt-4">
          <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-4 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-violet-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">AI Company Recommendations</p>
              <p className="text-xs text-muted-foreground">Based on your students' skill profile and placement history</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DISCOVER.map(c => {
              const isReq = requestedIds.has(c.id)
              return (
                <Card key={c.id} className="bg-gradient-to-br from-violet-500/10 to-purple-500/5 border-violet-500/20 hover:shadow-md transition-all flex flex-col">
                  <CardContent className="p-4 flex flex-col gap-3 h-full">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/70 backdrop-blur font-bold text-xs text-foreground shrink-0">{c.logo}</div>
                        <div>
                          <p className="font-bold text-sm">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.industry} · {c.size}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-black text-emerald-500">{c.match}%</p>
                        <p className="text-[10px] text-muted-foreground">match</p>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${c.match}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground flex-1">{c.reason}</p>
                    <div className="flex flex-wrap gap-1">
                      {c.hiringTypes.map(t => <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0">{t}</Badge>)}
                    </div>
                    <Button size="sm" className="w-full h-7 text-xs gap-1.5 mt-auto" disabled={isReq} onClick={() => setRequestDialog(c)}>
                      {isReq ? <><CheckCircle2 className="h-3 w-3" />Requested</> : <><Handshake className="h-3 w-3" />Request Partnership</>}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* ── MoU ─────────────────────────────────────────────── */}
        <TabsContent value="mou" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Manage official agreements and MoU documents</p>
            <Button size="sm" className="gap-2"><Plus className="h-4 w-4" />New MoU</Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PARTNERS.filter(p => p.mou).map(p => (
              <Card key={p.id} className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-500/20 hover:shadow-md transition-all flex flex-col">
                <CardContent className="p-4 flex flex-col gap-3 h-full">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15 shrink-0">
                      <FileText className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground">Campus Hiring + Training</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />Valid till <span className="font-semibold text-foreground">{p.mouExpiry}</span>
                  </div>
                  <Badge className="self-start bg-emerald-500/10 text-emerald-600 text-xs">Active</Badge>
                  <div className="flex gap-1.5 pt-2 border-t border-border/40 mt-auto">
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-[11px] bg-background/60 gap-1"><Eye className="h-3 w-3" />View</Button>
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-[11px] bg-background/60 gap-1"><RefreshCw className="h-3 w-3" />Renew</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <button className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all min-h-[160px] text-muted-foreground hover:text-primary">
              <Plus className="h-8 w-8 opacity-40" />
              <span className="text-sm font-medium">Upload MoU</span>
              <span className="text-xs opacity-60">PDF, DOCX up to 10MB</span>
            </button>
          </div>
        </TabsContent>

        {/* ── CRM ─────────────────────────────────────────────── */}
        <TabsContent value="crm" className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PARTNERS.filter(p => p.status === "active").map(p => (
              <Card key={p.id} className="bg-gradient-to-br from-slate-500/10 to-gray-500/5 border-slate-500/20 hover:shadow-md transition-all flex flex-col">
                <CardContent className="p-4 flex flex-col gap-3 h-full">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/70 backdrop-blur font-bold text-xs text-foreground shrink-0">{p.logo}</div>
                    <div>
                      <p className="font-bold text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground">HR Manager</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {[
                      { done: true,  label: "Meeting completed" },
                      { done: true,  label: "Drive scheduled" },
                      { done: false, label: "Shortlisting pending" },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-2">
                        {item.done
                          ? <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                          : <Clock className="h-3 w-3 text-amber-500 shrink-0" />}
                        <span className={item.done ? "" : "text-muted-foreground"}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground">Last visit: <span className="font-medium text-foreground">{p.lastVisit}</span></p>
                  <p className="text-[10px] text-muted-foreground italic line-clamp-2">"{p.notes}"</p>
                  <div className="flex gap-1.5 pt-2 border-t border-border/40 mt-auto">
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-[11px] gap-1 bg-background/60"><Mail className="h-3 w-3" />Email</Button>
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-[11px] gap-1 bg-background/60"><MessageSquare className="h-3 w-3" />Note</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── VISITS ──────────────────────────────────────────── */}
        <TabsContent value="visits" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Schedule and track campus visits</p>
            <Button size="sm" className="gap-2" onClick={() => setVisitDialog(true)}><Plus className="h-4 w-4" />Schedule</Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VISITS.map(v => {
              const up = v.status === "upcoming"
              return (
                <Card key={v.id} className={`bg-gradient-to-br border hover:shadow-md transition-all flex flex-col ${up ? "from-violet-500/10 to-purple-500/5 border-violet-500/20" : "from-muted/30 to-muted/10 border-border"}`}>
                  <CardContent className="p-4 flex flex-col gap-3 h-full">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${up ? "bg-violet-500/15" : "bg-muted"}`}>
                          <Calendar className={`h-4 w-4 ${up ? "text-violet-500" : "text-muted-foreground"}`} />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{v.company}</p>
                          <p className="text-xs text-muted-foreground">{v.type}</p>
                        </div>
                      </div>
                      <Badge className={`text-[10px] px-2 shrink-0 ${up ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>{v.status}</Badge>
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" />{v.date}</span>
                      <span className="flex items-center gap-1.5"><Users className="h-3 w-3" />{v.participants} students</span>
                      <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" />HR: {v.contact}</span>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs mt-auto bg-background/60">Manage</Button>
                  </CardContent>
                </Card>
              )
            })}
            <button onClick={() => setVisitDialog(true)} className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all min-h-[160px] text-muted-foreground hover:text-primary">
              <Plus className="h-8 w-8 opacity-40" />
              <span className="text-sm font-medium">Schedule Visit</span>
            </button>
          </div>
        </TabsContent>

        {/* ── TRAINING ────────────────────────────────────────── */}
        <TabsContent value="programs" className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROGRAMS.map(prog => {
              const pct = Math.round((prog.enrolled / prog.seats) * 100)
              const isActive = prog.status === "active"
              return (
                <Card key={prog.id} className={`bg-gradient-to-br border hover:shadow-md transition-all flex flex-col ${isActive ? "from-emerald-500/10 to-teal-500/5 border-emerald-500/20" : "from-blue-500/10 to-cyan-500/5 border-blue-500/20"}`}>
                  <CardContent className="p-4 flex flex-col gap-3 h-full">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-sm leading-snug">{prog.title}</p>
                        <p className="text-xs text-muted-foreground">{prog.company} · {prog.type}</p>
                      </div>
                      <Badge className={`text-[10px] px-2 shrink-0 ml-2 ${isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"}`}>{prog.status}</Badge>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                        <span>{prog.enrolled}/{prog.seats} enrolled</span>
                        <span>{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />Ends: {prog.endDate}</p>
                    <Button variant="outline" size="sm" className="h-7 text-xs mt-auto bg-background/60">View Program</Button>
                  </CardContent>
                </Card>
              )
            })}
            <button className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all min-h-[160px] text-muted-foreground hover:text-primary">
              <Plus className="h-8 w-8 opacity-40" />
              <span className="text-sm font-medium">Add Program</span>
            </button>
          </div>
        </TabsContent>

        {/* ── ANALYTICS ───────────────────────────────────────── */}
        <TabsContent value="analytics" className="space-y-6 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4 text-blue-500" />Hiring History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {PARTNERS.filter(p => p.totalHired > 0).map(p => (
                <div key={p.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">{p.name}</span>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{p.totalHired} hired</span>
                      <span className="text-emerald-600 font-medium">{p.avgPackage}</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100,(p.totalHired/180)*100)}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><Star className="h-4 w-4 text-amber-500" />Partnership Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {PARTNERS.filter(p => p.score > 0).sort((a,b) => b.score - a.score).map(p => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 font-bold text-xs text-primary shrink-0">{p.logo}</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{p.name}</span>
                      <span className={`text-sm font-bold ${p.score>=85?"text-emerald-600":p.score>=70?"text-amber-600":"text-red-500"}`}>{p.score}/100</span>
                    </div>
                    <Progress value={p.score} className="h-1.5" />
                  </div>
                  <Badge className={`text-xs shrink-0 ${p.score>=85?"bg-violet-500/10 text-violet-600":"bg-muted text-muted-foreground"}`}>
                    {p.score>=85?"Premium":p.score>=70?"Standard":"Basic"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><MessageSquare className="h-4 w-4 text-emerald-500" />Company Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {FEEDBACK.map(fb => (
                  <div key={fb.company} className="p-4 rounded-xl border border-border bg-gradient-to-br from-muted/40 to-muted/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{fb.company}</span>
                      <Badge variant="secondary" className="text-xs">{fb.year}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {[
                        { label: "Technical", value: fb.technical },
                        { label: "Comm.",     value: fb.communication },
                        { label: "Problem",   value: fb.problemSolving },
                      ].map(m => (
                        <div key={m.label} className="rounded-lg bg-background/70 p-2">
                          <p className={`text-base font-bold ${m.value>=8?"text-emerald-500":m.value>=7?"text-amber-500":"text-red-500"}`}>{m.value}</p>
                          <p className="text-[9px] text-muted-foreground">{m.label}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground border-l-2 border-primary/40 pl-2 italic">"{fb.suggestion}"</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Partnership Request Dialog */}
      <Dialog open={!!requestDialog} onOpenChange={() => setRequestDialog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Request Partnership — {requestDialog?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-xl bg-muted/30 p-4 space-y-2 text-sm">
              <p className="font-medium">Request will include:</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                {["College profile & ranking","Department list & student strength","Placement history (3 years)","Top skill statistics","Placement brochure PDF"].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" /><span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Personal Message (optional)</Label>
              <Textarea placeholder="Introduce your college..." rows={3} />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 gap-2" onClick={() => {
                if (requestDialog) setRequestedIds(prev => new Set([...prev, requestDialog.id]))
                setRequestDialog(null)
              }}>
                <Handshake className="h-4 w-4" />Send Request
              </Button>
              <Button variant="outline" onClick={() => setRequestDialog(null)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Visit Dialog */}
      <Dialog open={visitDialog} onOpenChange={setVisitDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Schedule Campus Visit</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Company</Label><Input placeholder="Company name" /></div>
              <div className="space-y-1.5">
                <Label className="text-xs">Visit Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placement">Placement Drive</SelectItem>
                    <SelectItem value="internship">Internship Drive</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="hackathon">Hackathon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Date</Label><Input type="date" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Participants</Label><Input type="number" placeholder="300" /></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">HR Contact</Label><Input placeholder="HR name & email" /></div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => setVisitDialog(false)}>Schedule</Button>
              <Button variant="outline" onClick={() => setVisitDialog(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
