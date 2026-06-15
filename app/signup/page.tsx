"use client"

import React, { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, GraduationCap, Building2, Briefcase, Award, Eye, EyeOff, Search, MapPin, Mail } from "lucide-react"
import { searchColleges, type CollegeEntry } from "@/lib/colleges-data"
import { SignupBackground } from "@/components/signup-background"

type Role = "student" | "college" | "recruiter" | "graduate"

const roles = [
  {
    id: "student" as Role,
    label: "Student",
    description: "Currently enrolled — track coding progress and get matched with jobs",
    icon: GraduationCap,
  },
  {
    id: "graduate" as Role,
    label: "Graduate",
    description: "Already passed out — showcase your profile and get hired",
    icon: Award,
  },
  {
    id: "college" as Role,
    label: "College",
    description: "Monitor student performance and manage placements",
    icon: Building2,
  },
  {
    id: "recruiter" as Role,
    label: "Recruiter",
    description: "Find and hire top coding talent with AI matching",
    icon: Briefcase,
  },
]

const glassInput = "bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-xl px-4 py-2.5 w-full focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40 transition-all text-sm"
const glassLabel = "text-xs font-medium text-violet-300/80 uppercase tracking-widest mb-1.5 block"

const glass: React.CSSProperties = {
  background: "rgba(12,8,28,0.80)",
  backdropFilter: "blur(28px)",
  WebkitBackdropFilter: "blur(28px)",
  border: "1px solid rgba(139,92,246,0.28)",
  borderRadius: 24,
  boxShadow: "0 0 0 1px rgba(139,92,246,0.06), 0 32px 80px rgba(0,0,0,0.7), 0 0 80px rgba(124,58,237,0.10)",
}

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<"role" | "details">("role")
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [collegeSuggestions, setCollegeSuggestions] = useState<CollegeEntry[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    collegeCode: "", rollNumber: "", branch: "", graduationYear: "",
    collegeName: "", location: "",
    companyName: "", designation: "",
  })

  useEffect(() => {
    const roleParam = searchParams.get("role") as Role | null
    if (roleParam && roles.some(r => r.id === roleParam)) {
      setSelectedRole(roleParam)
      setStep("details")
    }
  }, [searchParams])

  const handleCollegeNameChange = (value: string) => {
    setFormData(prev => ({ ...prev, collegeName: value }))
    const results = searchColleges(value)
    setCollegeSuggestions(results)
    setShowSuggestions(results.length > 0)
  }

  const selectCollege = (college: CollegeEntry) => {
    setFormData(prev => ({
      ...prev,
      collegeName: college.name,
      collegeCode: college.code,
      email: prev.email || college.email,
      location: college.location,
    }))
    setCollegeSuggestions([])
    setShowSuggestions(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match"); return }
    if (formData.password.length < 8) { setError("Password must be at least 8 characters"); return }

    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: selectedRole === "graduate" ? "student" : selectedRole,
          isGraduate: selectedRole === "graduate",
          isOpenToWork: selectedRole === "graduate" ? true : undefined,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Signup failed")
      router.push(data.redirectTo || `/${selectedRole === "graduate" ? "student" : selectedRole}/dashboard`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[#050508]">
      <SignupBackground />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-7">
          <Link href="/">
            <Image src="/codehiring-logo-dark.svg" alt="CodeHiring" width={160} height={40} className="h-9 w-auto" />
          </Link>
        </div>

        <div style={glass} className="p-7">

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {step === "role" ? "Join CodeHiring" : "Create your account"}
            </h1>
            <p className="text-sm mt-1.5" style={{ color: "rgba(167,139,250,0.65)" }}>
              {step === "role"
                ? "Select your role to get started"
                : selectedRole === "graduate"
                  ? "Create your graduate profile"
                  : `Sign up as a ${selectedRole}`}
            </p>
          </div>

          {/* ── ROLE STEP ── */}
          {step === "role" && (
            <div className="space-y-3">
              {roles.map(role => (
                <button key={role.id} type="button"
                  onClick={() => { setSelectedRole(role.id); setStep("details") }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(255,255,255,0.08)",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.4)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "rgba(124,58,237,0.20)", border: "1px solid rgba(139,92,246,0.3)" }}>
                    <role.icon className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{role.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(167,139,250,0.6)" }}>{role.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ── DETAILS STEP ── */}
          {step === "details" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-400 bg-red-500/10 rounded-xl border border-red-500/20">{error}</div>
              )}

              {/* Name */}
              <div>
                <label className={glassLabel}>{selectedRole === "college" ? "TPO / Contact Name" : "Full Name"}</label>
                <input className={glassInput}
                  placeholder={selectedRole === "college" ? "Dr. Ramesh Kumar" : "Your full name"}
                  value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>

              {/* Email */}
              <div>
                <label className={glassLabel}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-400/60" />
                  <input type="email" className={glassInput + " pl-9"} placeholder="you@example.com"
                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                </div>
              </div>

              {/* Student fields */}
              {selectedRole === "student" && <>
                <div>
                  <label className={glassLabel}>College Code</label>
                  <input className={glassInput} placeholder="e.g. IITD, NITK, BITS"
                    value={formData.collegeCode}
                    onChange={e => setFormData({ ...formData, collegeCode: e.target.value.toUpperCase() })} required />
                </div>
                <div>
                  <label className={glassLabel}>Roll Number</label>
                  <input className={glassInput} placeholder="21CS001"
                    value={formData.rollNumber}
                    onChange={e => setFormData({ ...formData, rollNumber: e.target.value.toUpperCase() })} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={glassLabel}>Branch</label>
                    <input className={glassInput} placeholder="CSE"
                      value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })} required />
                  </div>
                  <div>
                    <label className={glassLabel}>Grad Year</label>
                    <input className={glassInput} placeholder="2026"
                      value={formData.graduationYear}
                      onChange={e => setFormData({ ...formData, graduationYear: e.target.value })} required />
                  </div>
                </div>
              </>}

              {/* Graduate fields */}
              {selectedRole === "graduate" && <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={glassLabel}>Branch</label>
                    <input className={glassInput} placeholder="CSE"
                      value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })} required />
                  </div>
                  <div>
                    <label className={glassLabel}>Grad Year</label>
                    <input className={glassInput} placeholder="2024"
                      value={formData.graduationYear}
                      onChange={e => setFormData({ ...formData, graduationYear: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label className={glassLabel}>College Code <span className="normal-case text-white/30">(optional)</span></label>
                  <input className={glassInput} placeholder="IITD, VIT, BITS…"
                    value={formData.collegeCode}
                    onChange={e => setFormData({ ...formData, collegeCode: e.target.value.toUpperCase() })} />
                </div>
              </>}

              {/* College fields */}
              {selectedRole === "college" && <>
                <div className="relative">
                  <label className={glassLabel}>College Name</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-400/60" />
                    <input className={glassInput + " pl-9"} placeholder="Search college…"
                      value={formData.collegeName}
                      onChange={e => handleCollegeNameChange(e.target.value)}
                      onFocus={() => formData.collegeName.length >= 2 && setShowSuggestions(collegeSuggestions.length > 0)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      autoComplete="off" required />
                  </div>
                  {showSuggestions && (
                    <div className="absolute z-50 w-full mt-1 rounded-xl border border-violet-500/20 overflow-hidden shadow-2xl"
                      style={{ background: "rgba(12,8,28,0.95)", backdropFilter: "blur(20px)" }}>
                      {collegeSuggestions.map(c => (
                        <button key={c.code} type="button" onMouseDown={() => selectCollege(c)}
                          className="w-full flex items-start gap-3 px-4 py-3 hover:bg-violet-500/10 transition-colors text-left border-b border-white/5 last:border-0">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-violet-400 text-xs font-bold mt-0.5"
                            style={{ background: "rgba(124,58,237,0.2)" }}>
                            {c.code.slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{c.name}</p>
                            <p className="text-xs text-violet-400/60 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />{c.location} · {c.code}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className={glassLabel}>College Code</label>
                  <input className={glassInput} placeholder="Auto-filled"
                    value={formData.collegeCode}
                    onChange={e => setFormData(p => ({ ...p, collegeCode: e.target.value.toUpperCase() }))} required />
                </div>
                <div>
                  <label className={glassLabel}>Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-400/60" />
                    <input className={glassInput + " pl-9"} placeholder="Auto-filled"
                      value={formData.location}
                      onChange={e => setFormData(p => ({ ...p, location: e.target.value }))} required />
                  </div>
                </div>
              </>}

              {/* Recruiter fields */}
              {selectedRole === "recruiter" && <>
                <div>
                  <label className={glassLabel}>Company Name</label>
                  <input className={glassInput} placeholder="Tech Corp"
                    value={formData.companyName}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })} required />
                </div>
                <div>
                  <label className={glassLabel}>Designation</label>
                  <input className={glassInput} placeholder="HR Manager"
                    value={formData.designation}
                    onChange={e => setFormData({ ...formData, designation: e.target.value })} required />
                </div>
              </>}

              {/* Password */}
              <div>
                <label className={glassLabel}>Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} className={glassInput + " pr-10"}
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className={glassLabel}>Confirm Password</label>
                <div className="relative">
                  <input type={showConfirmPassword ? "text" : "password"} className={glassInput + " pr-10"}
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} required />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { setStep("role"); setSelectedRole(null); setError("") }}
                  className="flex-1 h-11 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all text-sm font-medium">
                  Back
                </button>
                <button type="submit" disabled={isLoading}
                  className="flex-1 h-11 rounded-xl font-semibold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
                  {isLoading
                    ? <><Loader2 className="h-4 w-4 animate-spin" />Creating…</>
                    : "Create Account"}
                </button>
              </div>
            </form>
          )}

          <p className="mt-5 text-center text-sm" style={{ color: "rgba(167,139,250,0.5)" }}>
            Already have an account?{" "}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  )
}
