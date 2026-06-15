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
  { id: "student"   as Role, label: "Student",   description: "Currently enrolled — track coding progress and get matched with jobs", icon: GraduationCap },
  { id: "graduate"  as Role, label: "Graduate",  description: "Already passed out — showcase your profile and get hired",             icon: Award         },
  { id: "college"   as Role, label: "College",   description: "Monitor student performance and manage placements",                    icon: Building2     },
  { id: "recruiter" as Role, label: "Recruiter", description: "Find and hire top coding talent with AI matching",                     icon: Briefcase     },
]

/* ── shared inline style constants ── */
const inputS: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.10)",
  color: "#ffffff",
  borderRadius: 12, padding: "10px 16px",
  fontSize: 14, outline: "none", width: "100%",
  transition: "border-color 0.2s, box-shadow 0.2s",
}
const inputFocus: React.CSSProperties = {
  ...inputS,
  borderColor: "rgba(139,92,246,0.6)",
  boxShadow: "0 0 0 1px rgba(139,92,246,0.4)",
}
const labelS: React.CSSProperties = {
  fontSize: 11, fontWeight: 600,
  color: "rgba(167,139,250,0.8)",
  textTransform: "uppercase", letterSpacing: "0.08em",
  display: "block", marginBottom: 6,
}
const cardS: React.CSSProperties = {
  background: "rgba(12,8,28,0.85)",
  backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
  border: "1px solid rgba(139,92,246,0.28)", borderRadius: 24,
  boxShadow: "0 0 0 1px rgba(139,92,246,0.06), 0 32px 80px rgba(0,0,0,0.7), 0 0 80px rgba(124,58,237,0.10)",
  padding: "28px",
}

/* controlled input with focus glow */
function GlassInput({ id, type = "text", placeholder, value, onChange, required, autoComplete, iconLeft, iconRight, onFocus: onFocusProp, style }: {
  id?: string; type?: string; placeholder?: string; value: string;
  onChange: (v: string) => void; required?: boolean; autoComplete?: string;
  iconLeft?: React.ReactNode; iconRight?: React.ReactNode;
  onFocus?: () => void;
  style?: React.CSSProperties
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position: "relative" }}>
      {iconLeft && (
        <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(167,139,250,0.6)", display: "flex", pointerEvents: "none" }}>
          {iconLeft}
        </div>
      )}
      <input id={id} type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => { setFocused(true); onFocusProp?.() }} onBlur={() => setFocused(false)}
        required={required} autoComplete={autoComplete}
        style={{ ...(focused ? inputFocus : inputS), ...(iconLeft ? { paddingLeft: 40 } : {}), ...(iconRight ? { paddingRight: 42 } : {}), ...style, WebkitTextFillColor: "#ffffff" }}
      />
      {iconRight && (
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", display: "flex" }}>
          {iconRight}
        </div>
      )}
    </div>
  )
}

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState("")
  const [step, setStep]           = useState<"role" | "details">("role")
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [collegeSuggestions, setCollegeSuggestions] = useState<CollegeEntry[]>([])
  const [showSuggestions, setShowSuggestions]       = useState(false)
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    collegeCode: "", rollNumber: "", branch: "", graduationYear: "",
    collegeName: "", location: "", companyName: "", designation: "",
  })

  useEffect(() => {
    const rp = searchParams.get("role") as Role | null
    if (rp && roles.some(r => r.id === rp)) { setSelectedRole(rp); setStep("details") }
  }, [searchParams])

  const set = (k: keyof typeof formData) => (v: string) => setFormData(p => ({ ...p, [k]: v }))

  const handleCollegeName = (v: string) => {
    set("collegeName")(v)
    const res = searchColleges(v)
    setCollegeSuggestions(res); setShowSuggestions(res.length > 0)
  }
  const selectCollege = (c: CollegeEntry) => {
    setFormData(p => ({ ...p, collegeName: c.name, collegeCode: c.code, email: p.email || c.email, location: c.location }))
    setCollegeSuggestions([]); setShowSuggestions(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("")
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match"); return }
    if (formData.password.length < 8)                  { setError("Password must be at least 8 characters"); return }
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: selectedRole === "graduate" ? "student" : selectedRole,
          isGraduate: selectedRole === "graduate",
          isOpenToWork: selectedRole === "graduate" ? true : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Signup failed")
      router.push(data.redirectTo || `/${selectedRole === "graduate" ? "student" : selectedRole}/dashboard`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally { setIsLoading(false) }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 16px", position: "relative", overflow: "hidden", background: "#050508" }}>
      <SignupBackground />
      <div style={{ width: "100%", maxWidth: 460, position: "relative", zIndex: 10 }}>

        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <Link href="/">
            <Image src="/codehiring-logo-dark.svg" alt="CodeHiring" width={160} height={40} style={{ height: 36, width: "auto" }} />
          </Link>
        </div>

        <div style={cardS}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#ffffff", margin: 0, letterSpacing: "-0.02em" }}>
              {step === "role" ? "Join CodeHiring" : "Create your account"}
            </h1>
            <p style={{ fontSize: 13, marginTop: 6, marginBottom: 0, color: "rgba(167,139,250,0.65)" }}>
              {step === "role" ? "Select your role to get started"
                : selectedRole === "graduate" ? "Create your graduate profile"
                : `Sign up as a ${selectedRole}`}
            </p>
          </div>

          {/* ── ROLE STEP ── */}
          {step === "role" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {roles.map(role => (
                <button key={role.id} type="button"
                  onClick={() => { setSelectedRole(role.id); setStep("details") }}
                  style={{
                    display: "flex", alignItems: "center", gap: 16,
                    padding: "14px 16px", borderRadius: 16,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    cursor: "pointer", textAlign: "left", width: "100%",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.4)"; e.currentTarget.style.background = "rgba(124,58,237,0.08)" }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)" }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(124,58,237,0.20)", border: "1px solid rgba(139,92,246,0.3)" }}>
                    <role.icon style={{ width: 20, height: 20, color: "#a78bfa" }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: "#ffffff", margin: 0, fontSize: 14 }}>{role.label}</p>
                    <p style={{ fontSize: 12, color: "rgba(167,139,250,0.6)", margin: "2px 0 0" }}>{role.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ── DETAILS STEP ── */}
          {step === "details" && (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {error && (
                <div style={{ padding: "10px 14px", fontSize: 13, color: "#f87171", background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)", borderRadius: 12 }}>
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label style={labelS}>{selectedRole === "college" ? "TPO / Contact Name" : "Full Name"}</label>
                <GlassInput placeholder={selectedRole === "college" ? "Dr. Ramesh Kumar" : "Your full name"} value={formData.name} onChange={set("name")} required />
              </div>

              {/* Email */}
              <div>
                <label style={labelS}>Email</label>
                <GlassInput type="email" placeholder="you@example.com" value={formData.email} onChange={set("email")} required autoComplete="email"
                  iconLeft={<Mail style={{ width: 16, height: 16 }} />} />
              </div>

              {/* Student */}
              {selectedRole === "student" && <>
                <div>
                  <label style={labelS}>College Code</label>
                  <GlassInput placeholder="e.g. IITD, NITK, BITS" value={formData.collegeCode} onChange={v => set("collegeCode")(v.toUpperCase())} required />
                </div>
                <div>
                  <label style={labelS}>Roll Number</label>
                  <GlassInput placeholder="21CS001" value={formData.rollNumber} onChange={v => set("rollNumber")(v.toUpperCase())} required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div><label style={labelS}>Branch</label><GlassInput placeholder="CSE" value={formData.branch} onChange={set("branch")} required /></div>
                  <div><label style={labelS}>Grad Year</label><GlassInput placeholder="2026" value={formData.graduationYear} onChange={set("graduationYear")} required /></div>
                </div>
              </>}

              {/* Graduate */}
              {selectedRole === "graduate" && <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div><label style={labelS}>Branch</label><GlassInput placeholder="CSE" value={formData.branch} onChange={set("branch")} required /></div>
                  <div><label style={labelS}>Grad Year</label><GlassInput placeholder="2024" value={formData.graduationYear} onChange={set("graduationYear")} required /></div>
                </div>
                <div>
                  <label style={labelS}>College Code <span style={{ textTransform: "none", color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>(optional)</span></label>
                  <GlassInput placeholder="IITD, VIT, BITS…" value={formData.collegeCode} onChange={v => set("collegeCode")(v.toUpperCase())} />
                </div>
              </>}

              {/* College */}
              {selectedRole === "college" && <>
                <div style={{ position: "relative" }}>
                  <label style={labelS}>College Name</label>
                  <GlassInput placeholder="Search college…" value={formData.collegeName} onChange={handleCollegeName}
                    onFocus={() => formData.collegeName.length >= 2 && setShowSuggestions(collegeSuggestions.length > 0)}
                    iconLeft={<Search style={{ width: 16, height: 16 }} />} required autoComplete="off" />
                  {showSuggestions && (
                    <div style={{ position: "absolute", zIndex: 50, width: "100%", marginTop: 4, borderRadius: 12, border: "1px solid rgba(139,92,246,0.2)", overflow: "hidden", background: "rgba(12,8,28,0.97)", backdropFilter: "blur(20px)" }}>
                      {collegeSuggestions.map(c => (
                        <button key={c.code} type="button" onMouseDown={() => selectCollege(c)}
                          style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 16px", width: "100%", background: "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer", textAlign: "left" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(124,58,237,0.10)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "none")}
                        >
                          <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(124,58,237,0.2)", color: "#a78bfa", fontSize: 11, fontWeight: 700, marginTop: 2 }}>
                            {c.code.slice(0, 2)}
                          </div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 500, color: "#ffffff", margin: 0 }}>{c.name}</p>
                            <p style={{ fontSize: 11, color: "rgba(167,139,250,0.6)", margin: "2px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                              <MapPin style={{ width: 11, height: 11 }} />{c.location} · {c.code}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label style={labelS}>College Code</label>
                  <GlassInput placeholder="Auto-filled" value={formData.collegeCode} onChange={v => set("collegeCode")(v.toUpperCase())} required />
                </div>
                <div>
                  <label style={labelS}>Location</label>
                  <GlassInput placeholder="Auto-filled" value={formData.location} onChange={set("location")} required iconLeft={<MapPin style={{ width: 16, height: 16 }} />} />
                </div>
              </>}

              {/* Recruiter */}
              {selectedRole === "recruiter" && <>
                <div>
                  <label style={labelS}>Company Name</label>
                  <GlassInput placeholder="Tech Corp" value={formData.companyName} onChange={set("companyName")} required />
                </div>
                <div>
                  <label style={labelS}>Designation</label>
                  <GlassInput placeholder="HR Manager" value={formData.designation} onChange={set("designation")} required />
                </div>
              </>}

              {/* Password */}
              <div>
                <label style={labelS}>Password</label>
                <GlassInput type={showPassword ? "text" : "password"} placeholder="At least 8 characters"
                  value={formData.password} onChange={set("password")} required
                  iconRight={
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", display: "flex", padding: 0 }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
                      {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                    </button>
                  }
                />
              </div>
              <div>
                <label style={labelS}>Confirm Password</label>
                <GlassInput type={showConfirm ? "text" : "password"} placeholder="Confirm password"
                  value={formData.confirmPassword} onChange={set("confirmPassword")} required
                  iconRight={
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", display: "flex", padding: 0 }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
                      {showConfirm ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                    </button>
                  }
                />
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                <button type="button"
                  onClick={() => { setStep("role"); setSelectedRole(null); setError("") }}
                  style={{ flex: 1, height: 44, borderRadius: 12, border: "1px solid rgba(255,255,255,0.10)", background: "none", color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "border-color 0.2s, color 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#ffffff" }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)" }}>
                  Back
                </button>
                <button type="submit" disabled={isLoading}
                  style={{ flex: 1, height: 44, borderRadius: 12, fontWeight: 600, fontSize: 14, color: "#ffffff", background: "linear-gradient(135deg,#7c3aed,#6366f1)", border: "none", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "opacity 0.2s" }}>
                  {isLoading ? <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />Creating…</> : "Create Account"}
                </button>
              </div>
            </form>
          )}

          <p style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: "rgba(167,139,250,0.5)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#a78bfa", fontWeight: 600, textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#c4b5fd")}
              onMouseLeave={e => (e.currentTarget.style.color = "#a78bfa")}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        input::placeholder { color: rgba(255,255,255,0.25) !important; }
        input { caret-color: #a78bfa; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#050508", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid #7c3aed", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
      </div>
    }>
      <SignupForm />
    </Suspense>
  )
}
