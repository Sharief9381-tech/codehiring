"use client"

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, GraduationCap, Building2, Briefcase, Award, Eye, EyeOff, Search, MapPin, Mail, CheckCircle2, ShieldCheck, ChevronDown } from "lucide-react"
import { searchColleges, type CollegeEntry } from "@/lib/colleges-data"
import { SignupBackground } from "@/components/signup-background"

type Role = "student" | "college" | "recruiter" | "graduate"

const roles = [
  { id: "student"   as Role, label: "Student",   description: "Currently enrolled - track coding progress and get matched with jobs", icon: GraduationCap },
  { id: "graduate"  as Role, label: "Graduate",  description: "Already passed out - showcase your profile and get hired",             icon: Award         },
  { id: "college"   as Role, label: "College",   description: "Monitor student performance and manage placements",                    icon: Building2     },
  { id: "recruiter" as Role, label: "Recruiter", description: "Find and hire top coding talent with AI matching",                     icon: Briefcase     },
]

/* -- shared inline style constants -- */
const inputS: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "rgba(255,255,255,0.10)",
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

// ── College autocomplete ───────────────────────────────────────────────────────

interface ApiCollege { code: string; name: string; short: string }

function CollegeAutocomplete({
  value, onSelect,
}: {
  value: { code: string; name: string } | null
  onSelect: (code: string, name: string) => void
}) {
  const [q, setQ]               = useState(value?.name ?? "")
  const [results, setResults]   = useState<ApiCollege[]>([])
  const [open, setOpen]         = useState(false)
  const [loading, setLoading]   = useState(false)
  const [notListed, setNotListed] = useState(false)
  const [manualCode, setManualCode] = useState("")
  const [manualName, setManualName] = useState("")
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wrapRef  = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const search = useCallback(async (raw: string) => {
    if (raw.length < 2) { setResults([]); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/public/colleges/search?q=${encodeURIComponent(raw)}`)
      const data = await res.json()
      setResults(data.colleges ?? [])
    } catch { setResults([]) }
    finally { setLoading(false) }
  }, [])

  const handleChange = (v: string) => {
    setQ(v)
    setOpen(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => search(v), 250)
  }

  const pick = (c: ApiCollege) => {
    setQ(c.name)
    setOpen(false)
    setNotListed(false)
    onSelect(c.code, c.name)
  }

  const confirmManual = () => {
    if (!manualCode.trim()) return
    onSelect(manualCode.trim().toUpperCase(), manualName.trim() || manualCode.trim().toUpperCase())
    setNotListed(false)
    setQ(manualName.trim() || manualCode.trim().toUpperCase())
  }

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <label style={labelS}>College</label>
      {!notListed ? (
        <>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(167,139,250,0.6)", pointerEvents: "none" }}>
              <Search style={{ width: 16, height: 16 }} />
            </span>
            <input
              type="text" placeholder="Type college name or code…"
              value={q} onChange={e => handleChange(e.target.value)}
              onFocus={() => { if (q.length >= 2) setOpen(true) }}
              autoComplete="off"
              style={{ ...inputS, paddingLeft: 40, WebkitTextFillColor: "#ffffff" }}
            />
            {loading && (
              <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
                <Loader2 style={{ width: 14, height: 14, color: "#a78bfa", animation: "spin 1s linear infinite" }} />
              </span>
            )}
          </div>

          {/* Dropdown */}
          {open && (results.length > 0 || q.length >= 2) && (
            <div style={{ position: "absolute", zIndex: 60, width: "100%", marginTop: 4, borderRadius: 12, border: "1px solid rgba(139,92,246,0.2)", overflow: "hidden", background: "rgba(12,8,28,0.97)", backdropFilter: "blur(20px)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
              {results.map(c => (
                <button key={c.code} type="button" onMouseDown={() => pick(c)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", width: "100%", background: "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer", textAlign: "left" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(124,58,237,0.10)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(124,58,237,0.2)", color: "#a78bfa", fontSize: 11, fontWeight: 700 }}>
                    {c.short?.slice(0, 2) ?? c.code.slice(0, 2)}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "#ffffff", margin: 0 }}>{c.name}</p>
                    <p style={{ fontSize: 11, color: "rgba(167,139,250,0.6)", margin: "2px 0 0" }}>{c.code} · {c.short}</p>
                  </div>
                </button>
              ))}
              {results.length === 0 && (
                <p style={{ padding: "10px 16px", fontSize: 13, color: "rgba(255,255,255,0.3)", margin: 0 }}>No colleges found for "{q}"</p>
              )}
              {/* "Not listed" always shown at bottom */}
              <button type="button" onMouseDown={() => { setOpen(false); setNotListed(true); setManualCode(""); setManualName("") }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", width: "100%", background: "none", border: "none", borderTop: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", color: "#a78bfa", fontSize: 12, fontWeight: 600 }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(124,58,237,0.08)")}
                onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                + My college isn&apos;t listed
              </button>
            </div>
          )}

          {/* Selected display */}
          {value?.code && !open && (
            <p style={{ marginTop: 4, fontSize: 11, color: "#a78bfa" }}>✓ {value.code}</p>
          )}

          <button type="button" onClick={() => { setNotListed(true); setOpen(false); setManualCode(""); setManualName("") }}
            style={{ marginTop: 6, fontSize: 12, color: "rgba(167,139,250,0.6)", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>
            My college isn&apos;t listed
          </button>
        </>
      ) : (
        /* Manual entry */
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ padding: "10px 14px", fontSize: 12, color: "#fbbf24", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 10 }}>
            Your college will be added as "pending" and verified by our team.
          </div>
          <div>
            <label style={{ ...labelS, marginBottom: 4 }}>College Code (e.g. RVRJC, IITD)</label>
            <input type="text" placeholder="MYCOLLEGECODE" value={manualCode}
              onChange={e => setManualCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
              style={{ ...inputS, WebkitTextFillColor: "#ffffff" }} />
          </div>
          <div>
            <label style={{ ...labelS, marginBottom: 4 }}>College Full Name</label>
            <input type="text" placeholder="My College of Engineering" value={manualName}
              onChange={e => setManualName(e.target.value)}
              style={{ ...inputS, WebkitTextFillColor: "#ffffff" }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={() => setNotListed(false)}
              style={{ flex: 1, height: 38, borderRadius: 10, border: "1px solid rgba(255,255,255,0.10)", background: "none", color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer" }}>
              Back to search
            </button>
            <button type="button" onClick={confirmManual} disabled={!manualCode.trim()}
              style={{ flex: 1, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#6366f1)", border: "none", color: "#ffffff", fontSize: 13, fontWeight: 600, cursor: manualCode.trim() ? "pointer" : "not-allowed", opacity: manualCode.trim() ? 1 : 0.5 }}>
              Use this college
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Password validation ───────────────────────────────────────────────────────

interface PasswordRule { label: string; pass: (pw: string) => boolean }

const PW_RULES: PasswordRule[] = [
  { label: "At least 8 characters",          pass: pw => pw.length >= 8 },
  { label: "One uppercase letter (A-Z)",     pass: pw => /[A-Z]/.test(pw) },
  { label: "One lowercase letter (a-z)",     pass: pw => /[a-z]/.test(pw) },
  { label: "One number (0-9)",               pass: pw => /[0-9]/.test(pw) },
  { label: "One special character (!@#$…)",  pass: pw => /[^A-Za-z0-9]/.test(pw) },
]

/** Returns an error message if invalid, null if valid */
export function validatePassword(pw: string): string | null {
  for (const r of PW_RULES) {
    if (!r.pass(pw)) return `Password must contain: ${r.label.toLowerCase()}`
  }
  return null
}

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null
  const passed = PW_RULES.filter(r => r.pass(password)).length
  const strength = passed <= 2 ? "Weak" : passed <= 3 ? "Fair" : passed <= 4 ? "Good" : "Strong"
  const colors = ["", "#ef4444", "#ef4444", "#f59e0b", "#22c55e", "#22c55e"]
  const color = colors[passed] ?? "#ef4444"

  return (
    <div style={{ marginTop: 8 }}>
      {/* Strength bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 99,
            background: passed >= i ? color : "rgba(255,255,255,0.1)",
            transition: "background 0.2s",
          }} />
        ))}
      </div>
      {/* Label */}
      <p style={{ fontSize: 11, color, fontWeight: 600, marginBottom: 6 }}>{strength}</p>
      {/* Individual rules */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {PW_RULES.map(r => {
          const ok = r.pass(password)
          return (
            <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, color: ok ? "#22c55e" : "rgba(255,255,255,0.3)", lineHeight: 1 }}>
                {ok ? "✓" : "○"}
              </span>
              <span style={{ fontSize: 11, color: ok ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)" }}>
                {r.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState("")
  // Email verification step: "email" | "otp" | "verified" | "role" | "details"
  const [step, setStep]           = useState<"email" | "otp" | "verified" | "role" | "details">("email")
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [collegeSuggestions, setCollegeSuggestions] = useState<CollegeEntry[]>([])
  const [showSuggestions, setShowSuggestions]       = useState(false)

  // Email verification state
  const [verifyEmail, setVerifyEmail] = useState("")
  const [otp, setOtp]                 = useState(["", "", "", ""])
  const [otpSending, setOtpSending]   = useState(false)
  const [otpVerifying, setOtpVerifying] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [devOtp, setDevOtp]           = useState<string | null>(null)
  const otpRefs                       = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    collegeCode: "", collegeName: "", rollNumber: "", branch: "", graduationYear: "",
    location: "", companyName: "", designation: "",
  })
  // Selected college from autocomplete — { code, name } or null
  const [selectedCollege, setSelectedCollege] = useState<{ code: string; name: string } | null>(null)

  useEffect(() => {
    const rp = searchParams.get("role") as Role | null
    if (rp && roles.some(r => r.id === rp)) { setSelectedRole(rp); setStep("details") }
  }, [searchParams])

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setInterval(() => setResendCooldown(c => Math.max(0, c - 1)), 1000)
    return () => clearInterval(t)
  }, [resendCooldown])

  const set = (k: keyof typeof formData) => (v: string) => setFormData(p => ({ ...p, [k]: v }))

  // -- OTP handlers ------------------------------------------
  const sendOtp = async () => {
    if (!verifyEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(verifyEmail)) {
      setError("Please enter a valid email address"); return
    }
    setError(""); setOtpSending(true)
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verifyEmail, purpose: "signup" }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Failed to send code"); return }
      if (data.dev && data.otp) {
        // Dev OTP received but never show on screen in any env
      }
      setFormData(p => ({ ...p, email: verifyEmail }))
      setStep("otp")
      setResendCooldown(30)
      setTimeout(() => otpRefs[0].current?.focus(), 100)
    } catch { setError("Network error. Please try again.") }
    finally { setOtpSending(false) }
  }

  const handleOtpChange = (idx: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1)
    const next = [...otp]; next[idx] = digit; setOtp(next)
    if (digit && idx < 3) otpRefs[idx + 1].current?.focus()
    if (!digit && idx > 0) otpRefs[idx - 1].current?.focus()
  }

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      const next = [...otp]; next[idx - 1] = ""; setOtp(next)
      otpRefs[idx - 1].current?.focus()
    }
    if (e.key === "ArrowLeft" && idx > 0) otpRefs[idx - 1].current?.focus()
    if (e.key === "ArrowRight" && idx < 3) otpRefs[idx + 1].current?.focus()
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4)
    if (pasted.length === 4) {
      setOtp(pasted.split(""))
      otpRefs[3].current?.focus()
    }
  }

  const verifyOtp = async () => {
    const code = otp.join("")
    if (code.length < 4) { setError("Please enter all 4 digits"); return }
    setError(""); setOtpVerifying(true)
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verifyEmail, otp: code }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Invalid code"); return }
      setDevOtp(null)
      setStep("verified")
      setTimeout(() => setStep("role"), 1800)
    } catch { setError("Network error. Please try again.") }
    finally { setOtpVerifying(false) }
  }

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
    // Full password rules
    const pwErr = validatePassword(formData.password)
    if (pwErr) { setError(pwErr); return }
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
              {step === "email" ? "Verify Your Email" : step === "otp" ? "Enter Verification Code" : step === "verified" ? "Email Verified!" : step === "role" ? "Join CodeHiring" : "Create your account"}
            </h1>
            <p style={{ fontSize: 13, marginTop: 6, marginBottom: 0, color: "rgba(167,139,250,0.65)" }}>
              {step === "email" ? "Enter your email to get a 4-digit verification code"
                : step === "otp" ? `Code sent to ${verifyEmail}`
                : step === "verified" ? "Your email has been verified"
                : step === "role" ? "Select your role to get started"
                : selectedRole === "graduate" ? "Create your graduate profile"
                : `Sign up as a ${selectedRole}`}
            </p>
          </div>

          {/* -- EMAIL STEP -- */}
          {step === "email" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {error && (
                <div style={{ padding: "10px 14px", fontSize: 13, color: "#f87171", background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)", borderRadius: 12 }}>{error}</div>
              )}
              <div>
                <label style={labelS}>Email Address</label>
                <GlassInput type="email" placeholder="you@example.com" value={verifyEmail}
                  onChange={v => { setVerifyEmail(v); setError("") }} required
                  iconLeft={<Mail style={{ width: 16, height: 16 }} />} />
              </div>
              <button type="button" onClick={sendOtp} disabled={otpSending || !verifyEmail}
                style={{ height: 46, borderRadius: 12, fontWeight: 600, fontSize: 14, color: "#ffffff", background: "linear-gradient(135deg,#7c3aed,#6366f1)", border: "none", cursor: (otpSending || !verifyEmail) ? "not-allowed" : "pointer", opacity: (otpSending || !verifyEmail) ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {otpSending ? <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />Sending code…</> : "Send Verification Code"}
              </button>
              <p style={{ textAlign: "center", fontSize: 13, color: "rgba(167,139,250,0.5)", margin: 0 }}>
                Already have an account?{" "}
                <Link href="/login" style={{ color: "#a78bfa", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
              </p>
            </div>
          )}

          {/* -- OTP STEP -- */}
          {step === "otp" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {error && (
                <div style={{ padding: "10px 14px", fontSize: 13, color: "#f87171", background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)", borderRadius: 12 }}>{error}</div>
              )}
              {devOtp && (
                <div style={{ padding: "10px 14px", fontSize: 13, color: "#34d399", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.20)", borderRadius: 12, textAlign: "center" }}>
                  Dev mode - OTP: <strong style={{ letterSpacing: 6 }}>{devOtp}</strong>
                </div>
              )}
              {/* 4-digit OTP boxes */}
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }} onPaste={handleOtpPaste}>
                {otp.map((digit, idx) => (
                  <input key={idx} ref={otpRefs[idx]} type="text" inputMode="numeric" maxLength={1} value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(idx, e)}
                    style={{
                      width: 64, height: 68, textAlign: "center", fontSize: 28, fontWeight: 800,
                      background: digit ? "rgba(124,58,237,0.20)" : "rgba(255,255,255,0.08)",
                      border: `2px solid ${digit ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.25)"}`,
                      borderRadius: 16, color: "#ffffff", outline: "none", cursor: "text",
                      transition: "border-color 0.2s, background 0.2s",
                      caretColor: "#a78bfa",
                    }}
                    onFocus={e => (e.target.style.border = `2px solid rgba(139,92,246,0.8)`)}
                    onBlur={e => (e.target.style.border = `2px solid ${digit ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.10)"}`)}
                  />
                ))}
              </div>
              <p style={{ textAlign: "center", fontSize: 12, color: "rgba(167,139,250,0.5)", margin: 0 }}>Code expires in 5 minutes . Max 5 attempts</p>
              <button type="button" onClick={verifyOtp} disabled={otpVerifying || otp.join("").length < 4}
                style={{ height: 46, borderRadius: 12, fontWeight: 600, fontSize: 14, color: "#ffffff", background: "linear-gradient(135deg,#7c3aed,#6366f1)", border: "none", cursor: (otpVerifying || otp.join("").length < 4) ? "not-allowed" : "pointer", opacity: (otpVerifying || otp.join("").length < 4) ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {otpVerifying ? <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />Verifying…</> : <><ShieldCheck style={{ width: 16, height: 16 }} />Verify Code</>}
              </button>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <button type="button" onClick={() => { setStep("email"); setOtp(["","","",""]); setError("") }}
                  style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  &larr; Change email
                </button>
                <button type="button" onClick={sendOtp} disabled={resendCooldown > 0 || otpSending}
                  style={{ fontSize: 13, color: resendCooldown > 0 ? "rgba(167,139,250,0.35)" : "#a78bfa", background: "none", border: "none", cursor: resendCooldown > 0 ? "not-allowed" : "pointer", padding: 0, fontWeight: 600 }}>
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : otpSending ? "Sending…" : "Resend Code"}
                </button>
              </div>
            </div>
          )}

          {/* -- VERIFIED SUCCESS -- */}
          {step === "verified" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "16px 0" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(52,211,153,0.15)", border: "2px solid rgba(52,211,153,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle2 style={{ width: 32, height: 32, color: "#34d399" }} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#34d399", margin: 0 }}>Email Verified!</p>
              <p style={{ fontSize: 13, color: "rgba(167,139,250,0.6)", margin: 0, textAlign: "center" }}>{verifyEmail}</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>Redirecting to sign up…</p>
            </div>
          )}

          {/* -- ROLE STEP -- */}
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

          {/* -- DETAILS STEP -- */}
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
                <CollegeAutocomplete
                  value={selectedCollege}
                  onSelect={(code, name) => {
                    setSelectedCollege({ code, name })
                    setFormData(p => ({ ...p, collegeCode: code, collegeName: name }))
                  }}
                />
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
                <CollegeAutocomplete
                  value={selectedCollege}
                  onSelect={(code, name) => {
                    setSelectedCollege({ code, name })
                    setFormData(p => ({ ...p, collegeCode: code, collegeName: name }))
                  }}
                />
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
                              <MapPin style={{ width: 11, height: 11 }} />{c.location} . {c.code}
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
                <GlassInput type={showPassword ? "text" : "password"} placeholder="Min 8 chars, uppercase, number, symbol"
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
                <PasswordStrength password={formData.password} />
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

          {(step === "role" || step === "details") && (
          <p style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: "rgba(167,139,250,0.5)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#a78bfa", fontWeight: 600, textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#c4b5fd")}
              onMouseLeave={e => (e.currentTarget.style.color = "#a78bfa")}>
              Sign in
            </Link>
          </p>
          )}
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
