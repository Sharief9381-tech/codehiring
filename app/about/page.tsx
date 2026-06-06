import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Target, Heart, Zap, Users } from "lucide-react"
import { SpotlightCard } from "@/components/landing/spotlight-card"

export const metadata = {
  title: "About — CodeHiring",
  description: "The story behind CodeHiring and why we built it.",
}

const values = [
  {
    icon: Target,
    title: "Merit Over Keywords",
    desc: "We believe hiring should be based on what you can actually do — not how well your resume is formatted.",
  },
  {
    icon: Zap,
    title: "Verified, Not Self-Reported",
    desc: "Every stat on CodeHiring is pulled directly from the source. No inflated numbers, no guesswork.",
  },
  {
    icon: Users,
    title: "Built for All Three Sides",
    desc: "Students, colleges, and recruiters all have different needs. We built tools that respect each one.",
  },
  {
    icon: Heart,
    title: "Students First",
    desc: "When students win — getting better jobs — everyone wins. That's the north star we build toward.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <div className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/codehiring-logo.svg" alt="CodeHiring" width={120} height={30} className="h-7 w-auto" />
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">About</span>
          <Link href="/" className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="mb-16">
          <p className="text-sm text-primary font-semibold uppercase tracking-widest mb-3">Company</p>
          <h1 className="text-4xl font-bold text-foreground mb-6 text-balance">
            We're fixing how developers get hired.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            CodeHiring was built because the hiring process for developers was broken. Recruiters sifted through
            self-reported resumes. Students had no way to prove their skills beyond a PDF. Colleges had no visibility
            into what was actually happening with their students' coding activity. We set out to change all three.
          </p>
        </div>

        {/* Story */}
        <div className="rounded-xl border border-border bg-card p-8 mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-5">The Problem We Saw</h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Students spend hundreds of hours solving problems on LeetCode, building projects on GitHub, competing
              on Codeforces. But when they apply for a job, all of that work gets compressed into a bullet point on
              a resume that might not even be read.
            </p>
            <p>
              Recruiters waste weeks screening candidates based on keywords, only to discover in technical interviews
              that the skill claims were exaggerated. Colleges have no systematic way to track their students'
              progress or demonstrate placement outcomes to accreditation bodies.
            </p>
            <p>
              CodeHiring connects all three sides of this problem. Students get a verified profile that speaks for itself.
              Colleges get real-time analytics. Recruiters get candidates ranked by actual verified performance — not
              self-reported numbers.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">What We Believe</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((v) => (
              <SpotlightCard key={v.title} spotlightColor="rgba(139,92,246,0.15)" className="p-6 cursor-pointer">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <v.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
          <h2 className="text-xl font-bold text-foreground mb-3">Want to be part of this?</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Whether you're a student, a college, or a company — there's a place for you on CodeHiring.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              Get Started
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
