"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

function VerifyContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token) { setStatus("error"); setMessage("No token provided."); return }
    fetch(`/api/auth/verify-email?token=${token}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) { setStatus("success"); setMessage(`${d.email} has been verified.`) }
        else { setStatus("error"); setMessage(d.error ?? "Verification failed.") }
      })
      .catch(() => { setStatus("error"); setMessage("Something went wrong.") })
  }, [token])

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm">
      {status === "loading" && (
        <><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-4"><Loader2 className="h-7 w-7 text-primary animate-spin" /></div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Verifying your email...</h2></>
      )}
      {status === "success" && (
        <><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 mx-auto mb-4"><CheckCircle2 className="h-7 w-7 text-emerald-500" /></div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Email Verified!</h2>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>
        <Link href="/login"><Button className="w-full">Continue to Sign In</Button></Link></>
      )}
      {status === "error" && (
        <><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 mx-auto mb-4"><XCircle className="h-7 w-7 text-destructive" /></div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Verification Failed</h2>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>
        <Link href="/login"><Button variant="outline" className="w-full">Back to Sign In</Button></Link></>
      )}
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.65_0.22_285/0.08),transparent)] pointer-events-none" />
      <div className="w-full max-w-sm relative z-10">
        <div className="flex justify-center mb-8">
          <Link href="/"><Image src="/codehiring-logo.svg" alt="CodeHiring" width={150} height={38} className="h-9 w-auto block dark:hidden" /><Image src="/codehiring-logo-dark.svg" alt="CodeHiring" width={150} height={38} className="h-9 w-auto hidden dark:block" /></Link>
        </div>
        <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-card" />}>
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  )
}
