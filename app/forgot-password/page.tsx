"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, CheckCircle2, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to send reset email")
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.52_0.24_285/0.07),transparent)] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image src="/codehiring-logo.svg" alt="CodeHiring" width={150} height={38} className="h-9 w-auto block dark:hidden" />
            <Image src="/codehiring-logo-dark.svg" alt="CodeHiring" width={150} height={38} className="h-9 w-auto hidden dark:block" />
          </Link>
        </div>

        {sent ? (
          <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 mx-auto mb-4">
              <CheckCircle2 className="h-7 w-7 text-emerald-500" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Check your inbox</h2>
            <p className="text-sm text-muted-foreground mb-6">
              If an account exists for <span className="text-foreground font-medium">{email}</span>, a reset link has been sent.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full">Back to Sign In</Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mb-6">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground tracking-tight mb-1">Forgot your password?</h1>
            <p className="text-sm text-muted-foreground mb-6">Enter your email and we'll send you a reset link.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-3 py-2.5 text-sm text-destructive">{error}</div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Sending...</> : "Send Reset Link"}
              </Button>
            </form>

            <Link href="/login" className="mt-5 flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group">
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
