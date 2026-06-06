"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LogOut, Loader2, CheckCircle2 } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setDone(true)
      setTimeout(() => { router.push("/"); router.refresh() }, 1200)
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.52_0.24_285/0.07),transparent)] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10 text-center">
        <Link href="/" className="inline-flex justify-center mb-8">
          <Image src="/codehiring-logo.svg" alt="CodeHiring" width={150} height={38} className="h-9 w-auto block dark:hidden" />
          <Image src="/codehiring-logo-dark.svg" alt="CodeHiring" width={150} height={38} className="h-9 w-auto hidden dark:block" />
        </Link>

        <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm">
          {done ? (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 mx-auto mb-4">
                <CheckCircle2 className="h-7 w-7 text-emerald-500" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Signed out</h2>
              <p className="text-sm text-muted-foreground">Redirecting to home...</p>
            </>
          ) : (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 mx-auto mb-4">
                <LogOut className="h-6 w-6 text-destructive" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Sign out</h2>
              <p className="text-sm text-muted-foreground mb-6">Are you sure you want to sign out of CodeHiring?</p>
              <div className="flex gap-3">
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full">Cancel</Button>
                </Link>
                <Button variant="destructive" className="flex-1" onClick={handleLogout} disabled={loading}>
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Signing out...</> : "Sign Out"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
