"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Eye, EyeOff } from "lucide-react"

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.10)",
  color: "#ffffff",
  borderRadius: 12,
  padding: "10px 16px",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.2s",
}

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: "rgba(167,139,250,0.8)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  display: "block",
  marginBottom: 6,
}

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused]     = useState<string | null>(null)
  const [formData, setFormData]   = useState({ email: "", password: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const ct = response.headers.get("content-type") ?? ""
      if (!ct.includes("application/json")) throw new Error("Server error. Please try again.")
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Login failed")
      router.push(data.redirectTo ?? `/${data.user.role}/dashboard`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const focusStyle = (field: string): React.CSSProperties => focused === field
    ? { ...inputStyle, borderColor: "rgba(139,92,246,0.6)", boxShadow: "0 0 0 1px rgba(139,92,246,0.4)" }
    : inputStyle

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {error && (
        <div style={{
          padding: "10px 14px", fontSize: 13,
          color: "#f87171",
          background: "rgba(239,68,68,0.10)",
          borderRadius: 12,
          border: "1px solid rgba(239,68,68,0.20)",
        }}>{error}</div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" style={labelStyle}>Email</label>
        <input
          id="email" type="email" placeholder="you@example.com"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          onFocus={() => setFocused("email")}
          onBlur={() => setFocused(null)}
          required autoComplete="email"
          style={{
            ...focusStyle("email"),
            // placeholder via ::placeholder in global css — force color inline for webkit
            WebkitTextFillColor: "#ffffff",
          }}
        />
      </div>

      {/* Password */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <label htmlFor="password" style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
          <a href="/forgot-password" style={{ fontSize: 12, color: "#a78bfa", textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#c4b5fd")}
            onMouseLeave={e => (e.currentTarget.style.color = "#a78bfa")}>
            Forgot password?
          </a>
        </div>
        <div style={{ position: "relative" }}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            onFocus={() => setFocused("password")}
            onBlur={() => setFocused(null)}
            required autoComplete="current-password"
            style={{
              ...focusStyle("password"),
              paddingRight: 42,
              WebkitTextFillColor: "#ffffff",
            }}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.35)", padding: 0, display: "flex",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
            {showPassword
              ? <EyeOff style={{ width: 16, height: 16 }} />
              : <Eye style={{ width: 16, height: 16 }} />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button type="submit" disabled={isLoading}
        style={{
          width: "100%", height: 44, borderRadius: 12,
          fontWeight: 600, fontSize: 15, color: "#ffffff",
          background: "linear-gradient(135deg,#7c3aed,#6366f1)",
          border: "none", cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.6 : 1,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          transition: "opacity 0.2s",
          marginTop: 4,
        }}>
        {isLoading
          ? <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />Signing in…</>
          : "Sign In"}
      </button>

      <style>{`
        #email::placeholder, #password::placeholder { color: rgba(255,255,255,0.25) !important; }
        #email, #password { caret-color: #a78bfa; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </form>
  )
}
