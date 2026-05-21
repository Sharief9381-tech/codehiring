"use client"

import { useState, useEffect } from "react"
import {
  X, Plus, User, Mail, Phone, MapPin, BookOpen,
  GraduationCap, Code2, Linkedin, Github, Globe, Twitter,
  Trophy, Star, Zap, Target, CheckCircle, Award
} from "lucide-react"

const neonInput = "bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-xl px-4 py-2.5 w-full focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 transition-all duration-200 text-sm backdrop-blur-sm"
const neonLabel = "text-xs font-medium text-white/50 uppercase tracking-widest mb-1.5 block"
const glassCard = "rounded-2xl border border-white/8 bg-white/4 backdrop-blur-xl p-5 shadow-xl"

const skillColors = [
  "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-300",
  "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-300",
  "from-teal-500/20 to-teal-600/10 border-teal-500/30 text-teal-300",
  "from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-300",
  "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-300",
]

const achievements = [
  { icon: Star,   label: "HackerRank", value: "5★",     color: "from-yellow-500/20 to-orange-500/10 border-yellow-500/30", text: "text-yellow-300" },
  { icon: Zap,    label: "LeetCode",   value: "Knight",  color: "from-purple-500/20 to-violet-500/10 border-purple-500/30", text: "text-purple-300" },
  { icon: Trophy, label: "Codeforces", value: "Pupil",   color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30",      text: "text-blue-300"   },
  { icon: Target, label: "Global Rank",value: "Top 5%",  color: "from-teal-500/20 to-emerald-500/10 border-teal-500/30",   text: "text-teal-300"   },
]

interface Props {
  user: any
  onChange: (data: any) => void
}

export function ProfileForm({ user, onChange }: Props) {
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")

  // Sync skills from user prop
  useEffect(() => {
    if (user?.skills) setSkills(user.skills)
  }, [user?.skills])

  const update = (key: string, value: any) => {
    onChange({ ...user, [key]: value })
  }

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
        <div className={glassCard}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Personal Information</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={neonLabel}>Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input
                  className={neonInput + " pl-9"}
                  placeholder="Full Name"
                  value={user?.name || ""}
                  onChange={e => update("name", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className={neonLabel}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input
                  className={neonInput + " pl-9 opacity-60 cursor-not-allowed"}
                  placeholder="Email"
                  value={user?.email || ""}
                  readOnly
                />
              </div>
            </div>
            <div>
              <label className={neonLabel}>Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input
                  className={neonInput + " pl-9"}
                  placeholder="+91 9876543210"
                  value={user?.phone || ""}
                  onChange={e => update("phone", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className={neonLabel}>Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input
                  className={neonInput + " pl-9"}
                  placeholder="Mumbai, India"
                  value={user?.location || ""}
                  onChange={e => update("location", e.target.value)}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className={neonLabel}>Bio</label>
              <textarea
                rows={3}
                placeholder="Tell us about yourself, your goals, and what you're building..."
                className={neonInput + " resize-none"}
                value={user?.bio || ""}
                onChange={e => update("bio", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Education */}
        <div className={glassCard}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Education</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={neonLabel}>College / University</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input
                  className={neonInput + " pl-9"}
                  placeholder="IIT Delhi"
                  value={user?.collegeName || user?.collegeCode || ""}
                  onChange={e => update("collegeName", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className={neonLabel}>Degree</label>
              <select
                className={neonInput + " appearance-none cursor-pointer"}
                value={user?.degree || "btech"}
                onChange={e => update("degree", e.target.value)}
              >
                {["B.Tech","B.E.","B.Sc","M.Tech","MCA","MBA"].map(d => (
                  <option key={d} value={d} className="bg-slate-900">{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={neonLabel}>Branch / Major</label>
              <input
                className={neonInput}
                placeholder="Computer Science"
                value={user?.branch || ""}
                onChange={e => update("branch", e.target.value)}
              />
            </div>
            <div>
              <label className={neonLabel}>Graduation Year</label>
              <select
                className={neonInput + " appearance-none cursor-pointer"}
                value={user?.graduationYear || "2026"}
                onChange={e => update("graduationYear", e.target.value)}
              >
                {["2024","2025","2026","2027","2028"].map(y => (
                  <option key={y} value={y} className="bg-slate-900">{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={neonLabel}>Roll Number</label>
              <input
                className={neonInput}
                placeholder="21CS001"
                value={user?.rollNumber || ""}
                onChange={e => update("rollNumber", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className={glassCard}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 flex items-center justify-center">
              <Globe className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Social Links</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Linkedin, label: "LinkedIn",    key: "linkedinUrl",  placeholder: "linkedin.com/in/username", color: "text-blue-400" },
              { icon: Github,   label: "GitHub",      key: "githubUrl",    placeholder: "github.com/username",      color: "text-white/60" },
              { icon: Globe,    label: "Portfolio",   key: "portfolioUrl", placeholder: "yourportfolio.com",        color: "text-teal-400" },
              { icon: Twitter,  label: "Twitter / X", key: "twitterUrl",   placeholder: "twitter.com/username",     color: "text-sky-400"  },
            ].map(({ icon: Icon, label, key, placeholder, color }) => (
              <div key={key}>
                <label className={neonLabel}>{label}</label>
                <div className="relative">
                  <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${color}`} />
                  <input
                    className={neonInput + " pl-9"}
                    placeholder={placeholder}
                    value={user?.[key] || ""}
                    onChange={e => update(key, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div className="space-y-5">

        {/* Profile Preview Card */}
        <div className="rounded-2xl border border-white/8 overflow-hidden shadow-2xl">
          <div className="h-20 bg-gradient-to-r from-purple-600/40 via-blue-600/40 to-teal-600/40 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />
          </div>
          <div className="bg-white/4 backdrop-blur-xl px-5 pb-5">
            <div className="flex items-end gap-3 -mt-8 mb-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-purple-500/30 ring-2 ring-purple-500/50 ring-offset-2 ring-offset-slate-900">
                  {initials}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/50">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white">{user?.name || "—"}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">Verified</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">Student</span>
                  {user?.location && (
                    <span className="text-[10px] text-white/40 flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5" />{user.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {user?.bio && (
              <p className="text-[11px] text-white/40 mb-4 leading-relaxed line-clamp-2">{user.bio}</p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { label: "Contest Rating",  value: user?.stats?.rating        || "—", color: "text-purple-400" },
                { label: "Problems Solved", value: user?.stats?.totalProblems || "—", color: "text-blue-400"   },
                { label: "Day Streak",      value: user?.stats?.streak        || "—", color: "text-teal-400"   },
                { label: "Global Rank",     value: user?.stats?.globalRank    || "—", color: "text-pink-400"   },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-xl bg-white/5 border border-white/8 p-2.5 text-center">
                  <div className={`text-base font-bold ${color}`}>{value}</div>
                  <div className="text-[9px] text-white/40 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex items-center justify-center gap-3">
              {[
                { icon: Linkedin, color: "text-blue-400 hover:text-blue-300",  href: user?.linkedinUrl  },
                { icon: Github,   color: "text-white/50 hover:text-white",     href: user?.githubUrl    },
                { icon: Globe,    color: "text-teal-400 hover:text-teal-300",  href: user?.portfolioUrl },
                { icon: Twitter,  color: "text-sky-400 hover:text-sky-300",    href: user?.twitterUrl   },
              ].map(({ icon: Icon, color, href }, i) => (
                <a
                  key={i}
                  href={href || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center ${color} transition-colors ${!href ? "opacity-30 pointer-events-none" : ""}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className={glassCard}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-pink-500/20 flex items-center justify-center">
              <Code2 className="w-3.5 h-3.5 text-pink-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Skills</h3>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3 min-h-[2rem]">
            {skills.length === 0 && (
              <span className="text-xs text-white/30">No skills added yet</span>
            )}
            {skills.map((skill, i) => (
              <span key={skill} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-gradient-to-r border ${skillColors[i % skillColors.length]}`}>
                {skill}
                <button onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors ml-0.5">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className={neonInput}
              placeholder="Add skill..."
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addSkill()}
            />
            <button
              onClick={addSkill}
              className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 hover:bg-purple-500/30 transition-colors flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Achievements */}
        <div className={glassCard}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Award className="w-3.5 h-3.5 text-yellow-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Achievements</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {achievements.map(({ icon: Icon, label, value, color, text }) => (
              <div key={label} className={`rounded-xl bg-gradient-to-br ${color} border p-3 text-center`}>
                <Icon className={`w-5 h-5 ${text} mx-auto mb-1.5`} />
                <div className={`text-xs font-bold ${text}`}>{value}</div>
                <div className="text-[10px] text-white/40 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
