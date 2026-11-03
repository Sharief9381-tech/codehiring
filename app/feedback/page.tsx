"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { FeedbackForm } from "@/components/feedback/feedback-form"
import { BackButton } from "@/components/layout/back-button"

export default function FeedbackPage() {
  const [done, setDone] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <div className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-xl px-6 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center">
            <Image src="/codehiring-logo.svg" alt="CodeHiring" width={140} height={32} className="h-8 w-auto block dark:hidden" />
            <Image src="/codehiring-logo-dark.svg" alt="CodeHiring" width={140} height={32} className="h-8 w-auto hidden dark:block" />
          </Link>
          <BackButton fallback="/" />
        </div>
      </div>

      <div className="mx-auto max-w-xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="text-sm text-primary font-semibold uppercase tracking-widest mb-3">Feedback</p>
          <h1 className="text-3xl font-bold text-foreground mb-3">How are we doing?</h1>
          <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
            Your feedback helps us improve CodeHiring for students, colleges, and recruiters. 
            Takes less than 2 minutes.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <FeedbackForm onSuccess={() => setDone(true)} />
        </div>
      </div>
    </div>
  )
}
