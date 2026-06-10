"use client"

import { useState, useEffect } from "react"
import {
  X, Plus, User, Mail, Phone, MapPin, BookOpen,
  GraduationCap, Code2, Linkedin, Github, Globe, Twitter,
  Trophy, Star, Zap, Target, CheckCircle, Award
} from "lucide-react"

// Theme-aware classes
const formInput = "bg-background border border-border text-foreground placeholder:text-muted-foreground rounded-xl px-4 py-2.5 w-full focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-all duration-200 text-sm"
const formLabel = "text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5 block"
const formCard = "rounded-2xl border border-border bg-card p-5 shadow-sm"

const skillColors = [
  "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-600 dark:text-purple-300",
  "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-600 dark:text-blue-300",
  "from-teal-500/20 to-teal-600/10 border-teal-500/30 text-teal-600 dark:text-teal-300",
  "from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-600 dark:text-pink-300",
  "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-600 dark:text-amber-300",
]

const achievements = [
  { icon: Star,   label: "HackerRank", value: "5★",    color: "from-yellow-500/20 to-orange-500/10 border-yellow-500/30", text: "text-yellow-600 dark:text-yellow-300" },
  { icon: Zap,    label: "LeetCode",   value: "Knight", color: "from-purple-500/20 to-violet-500/10 border-purple-500/30", text: "text-purple-600 dark:text-purple-300" },
  { icon: Trophy, label: "Codeforces", value: "Pupil",  color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30",      text: "text-blue-600 dark:text-blue-300"   },
  { icon: Target, label: "Global Rank",value: "Top 5%", color: "from-teal-500/20 to-emerald-500/10 border-teal-500/30",   text: "text-teal-600 dark:text-teal-300"   },
]

interface Props {
  user: any
  onChange: (data: any) => void
}

export function ProfileForm({ user, onChange }: Props) {
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")

  useEffect(() => {
    if (user?.skills) setSkills(user.skills)
  }, [user?.skills])

  const update = (key: string, value: any) => onChange({ ...user, [key]: value })

  const addSkill = () => {
    const s = newSkill.trim()
    if (s && !skills.includes(s)) {
      const next = [...skills, s]
      setSkills(next)
      update("skills", next)
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    const next = skills.filter(s => s !== skill)
    setSkills(next)
    update("skills", next)
  }

  const initials = user?.name
    ? user.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?"

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

      {/* ── LEFT COLUMN ── */}
      <div className="xl:col-span-2 space-y-5">

        {/* Personal Info */}
        <div className={formCard}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Personal Information</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Full Name", key: "name", icon: User, placeholder: "Full Name", readOnly: false },
              { label: "Email", key: "email", icon: Mail, placeholder: "Email", readOnly: true },
              { label: "Phone", key: "phone", icon: Phone, placeholder: "+91 9876543210", readOnly: false },
              { label: "Location", key: "location", icon: MapPin, placeholder: "Mumbai, India", readOnly: false },
            ].map(({ label, key, icon: Icon, placeholder, readOnly }) => (
              <div key={key}>
                <label className={formLabel}>{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    className={formInput + " pl-9" + (readOnly ? " opacity-60 cursor-not-allowed" : "")}
                    placeholder={placeholder}
                    value={user?.[key] || ""}
                    readOnly={readOnly}
                    onChange={e => !readOnly && update(key, e.target.value)}
                  />
                </div>
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className={formLabel}>Bio</label>
              <textarea
                rows={3}
                placeholder="Tell us about yourself..."
                className={formInput + " resize-none"}
                value={user?.bio || ""}
                onChange={e => update("bio", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Education */}
        <div className={formCard}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Education</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={formLabel}>College / University</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input className={formInput + " pl-9"} placeholder="IIT Delhi"
                  value={user?.collegeName || user?.collegeCode || ""}
                  onChange={e => update("collegeName", e.target.value)} />
              </div>
            </div>
            <div>
              <label className={formLabel}>Degree</label>
              <select className={formInput + " appearance-none cursor-pointer"}
                value={user?.degree || "B.Tech"}
                onChange={e => update("degree", e.target.value)}>
                {["B.Tech","B.E.","B.Sc","M.Tech","MCA","MBA"].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={formLabel}>Branch / Major</label>
              <input className={formInput} placeholder="Computer Science"
                value={user?.branch || ""} onChange={e => update("branch", e.target.value)} />
            </div>
            <div>
              <label className={formLabel}>Graduation Year</label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                {user?.graduationYear ? (
                  <>
                    <input
                      className={formInput + " pl-9 opacity-60 cursor-not-allowed"}
                      value={user.graduationYear}
                      readOnly
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">Set at signup — cannot be changed</p>
                  </>
                ) : (
                  <>
                    <select
                      className={formInput + " pl-9 appearance-none cursor-pointer"}
                      value={user?.graduationYear || ""}
                      onChange={e => update("graduationYear", Number(e.target.value))}
                    >
                      <option value="">Select graduation year</option>
                      {[2025,2026,2027,2028,2029,2030,2031].map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-amber-500 mt-1">Not set — select your graduation year to unlock Career Hub</p>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className={formLabel}>Roll Number</label>
              <input className={formInput} placeholder="21CS001"
                value={user?.rollNumber || ""} onChange={e => update("rollNumber", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className={formCard}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <Globe className="w-3.5 h-3.5 text-teal-500" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Social Links</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Linkedin, label: "LinkedIn",    key: "linkedinUrl",  placeholder: "linkedin.com/in/username" },
              { icon: Github,   label: "GitHub",      key: "githubUrl",    placeholder: "github.com/username"      },
              { icon: Globe,    label: "Portfolio",   key: "portfolioUrl", placeholder: "yourportfolio.com"        },
              { icon: Twitter,  label: "Twitter / X", key: "twitterUrl",   placeholder: "twitter.com/username"     },
            ].map(({ icon: Icon, label, key, placeholder }) => (
              <div key={key}>
                <label className={formLabel}>{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input className={formInput + " pl-9"} placeholder={placeholder}
                    value={user?.[key] || ""} onChange={e => update(key, e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open to Work — shown for 3rd/4th year students and graduates */}
        {(() => {
          const gradYear = user?.graduationYear
          const currentYear = new Date().getFullYear()
          const isGraduate = !!(user as any)?.isGraduate || (gradYear && gradYear <= currentYear)
          const yearsLeft = gradYear ? gradYear - currentYear : null
          const show = isGraduate || (yearsLeft !== null && yearsLeft <= 2)
          if (!show) return null
          return (
            <div className={formCard}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Job Availability</h3>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Open to Work</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isGraduate
                      ? "Let recruiters know you're actively looking"
                      : `Visible to recruiters — Class of ${gradYear}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => update("isOpenToWork", !user?.isOpenToWork)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    user?.isOpenToWork ? "bg-emerald-500" : "bg-muted"
                  }`}
                  role="switch"
                  aria-checked={!!user?.isOpenToWork}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    user?.isOpenToWork ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>
              {user?.isOpenToWork && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Your profile is visible to recruiters as available
                </p>
              )}
            </div>
          )
        })()}
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div className="space-y-5">

        {/* Profile Preview Card */}
        <div className="rounded-2xl border border-border overflow-hidden shadow-sm bg-card">
          <div className="h-20 bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-teal-500/30" />
          <div className="px-5 pb-5">
            <div className="flex items-end gap-3 -mt-8 mb-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-xl font-bold text-white shadow-lg ring-2 ring-background">
                  {initials}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-foreground">{user?.name || "—"}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">Verified</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Student</span>
                  {user?.location && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5" />{user.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {user?.bio && <p className="text-[11px] text-muted-foreground mb-4 leading-relaxed line-clamp-2">{user.bio}</p>}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { label: "Contest Rating",  value: user?.stats?.rating        || "—", color: "text-purple-500" },
                { label: "Problems Solved", value: user?.stats?.totalProblems || "—", color: "text-blue-500"   },
                { label: "Day Streak",      value: user?.stats?.streak        || "—", color: "text-teal-500"   },
                { label: "Global Rank",     value: user?.stats?.globalRank    || "—", color: "text-pink-500"   },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-xl bg-secondary border border-border p-2.5 text-center">
                  <div className={`text-base font-bold ${color}`}>{value}</div>
                  <div className="text-[9px] text-muted-foreground mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex items-center justify-center gap-3">
              {[
                { icon: Linkedin, href: user?.linkedinUrl  },
                { icon: Github,   href: user?.githubUrl    },
                { icon: Globe,    href: user?.portfolioUrl },
                { icon: Twitter,  href: user?.twitterUrl   },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href || "#"} target="_blank" rel="noopener noreferrer"
                  className={`w-7 h-7 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors ${!href ? "opacity-30 pointer-events-none" : ""}`}>
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className={formCard}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-pink-500/10 flex items-center justify-center">
              <Code2 className="w-3.5 h-3.5 text-pink-500" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Skills</h3>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3 min-h-[2rem]">
            {skills.length === 0 && <span className="text-xs text-muted-foreground">No skills added yet</span>}
            {skills.map((skill, i) => (
              <span key={skill} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-gradient-to-r border ${skillColors[i % skillColors.length]}`}>
                {skill}
                <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors ml-0.5">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input className={formInput} placeholder="Add skill..."
              value={newSkill} onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addSkill()} />
            <button onClick={addSkill}
              className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors flex-shrink-0">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Achievements */}
        <div className={formCard}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Award className="w-3.5 h-3.5 text-yellow-500" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Achievements</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {achievements.map(({ icon: Icon, label, value, color, text }) => (
              <div key={label} className={`rounded-xl bg-gradient-to-br ${color} border p-3 text-center`}>
                <Icon className={`w-5 h-5 ${text} mx-auto mb-1.5`} />
                <div className={`text-xs font-bold ${text}`}>{value}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
