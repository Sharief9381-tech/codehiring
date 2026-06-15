"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-400 bg-red-500/10 rounded-xl border border-red-500/20">{error}</div>
      )}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-xs font-medium text-violet-300/80 uppercase tracking-widest block">Email</label>
        <input id="email" type="email" placeholder="you@example.com"
          value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
          required autoComplete="email"
          className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/25 rounded-xl px-4 py-2.5 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40 transition-all text-sm"
        />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-xs font-medium text-violet-300/80 uppercase tracking-widest">Password</label>
          <a href="/forgot-password" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Forgot password?</a>
        </div>
        <div className="relative">
          <input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password"
            value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
            required autoComplete="current-password"
            className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/25 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40 transition-all text-sm"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <button type="submit" disabled={isLoading}
        className="w-full h-11 rounded-xl font-semibold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
        style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
        {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Signing in…</> : "Sign In"}
      </button>
    </form>
  )
}

