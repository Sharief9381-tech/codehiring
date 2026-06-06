"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Clock, Loader2, MapPin } from "lucide-react"
import { SpotlightCard } from "@/components/landing/spotlight-card"

interface CareerPosting {
  _id: string
  title: string
  team: string
  location: string
  type: string
  desc: string
  active: boolean
  createdAt: string
}

const perks = [
  "Fully remote-first culture",
  "Competitive salary & equity",
  "Learning & development budget",
  "Flexible working hours",
  "Direct impact on thousands of students",
  "Work with a small, high-ownership team",
]

const TEAM_COLORS: Record<string, string> = {
  Engineering:  "bg-primary/10 text-primary",
  AI:           "bg-violet-500/10 text-violet-500",
  Design:       "bg-pink-500/10 text-pink-500",
  Growth:       "bg-emerald-500/10 text-emerald-500",
  Marketing:    "bg-amber-500/10 text-amber-500",
  Operations:   "bg-cyan-500/10 text-cyan-500",
}

function teamColor(team: string) {
  return TEAM_COLORS[team] ?? "bg-secondary text-foreground"
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<CareerPosting[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("All")

  useEffect(() => {
    fetch("/api/public/careers")
      .then((r) => r.json())
      .then((d) => setJobs(d.careers ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const teams = ["All", ...Array.from(new Set(jobs.map((j) => j.team)))]
  const filtered = filter === "All" ? jobs : jobs.filter((j) => j.team === filter)

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <div className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/codehiring-logo.svg" alt="CodeHiring" width={120} height={30} className="h-7 w-auto" />
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">Careers</span>
          <Link href="/" className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="mb-14">
          <p className="text-sm text-primary font-semibold uppercase tracking-widest mb-3">We're Hiring</p>
          <h1 className="text-4xl font-bold text-foreground mb-5 text-balance">
            Help us build the future of tech hiring.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            We're a small team with a big mission — making hiring fair, transparent, and based on what developers can actually do. If that excites you, we'd love to hear from you.
          </p>
        </div>

        {/* Perks */}
        <div className="rounded-xl border border-border bg-card p-7 mb-14">
          <h2 className="text-lg font-semibold text-foreground mb-5">Why CodeHiring</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                {perk}
              </div>
            ))}
          </div>
        </div>

        {/* Open roles */}
        <div className="mb-14">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-7">
            <h2 className="text-2xl font-bold text-foreground">
              Open Roles
              {!loading && (
                <span className="ml-3 text-base font-normal text-muted-foreground">
                  ({filtered.length} {filtered.length === 1 ? "role" : "roles"})
                </span>
              )}
            </h2>

            {/* Team filter tabs */}
            {!loading && teams.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {teams.map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      filter === t
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-border bg-secondary/20 p-12 text-center">
              <p className="text-muted-foreground font-medium mb-1">No open roles right now</p>
              <p className="text-sm text-muted-foreground">
                We add new positions regularly — check back soon or send a general application below.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((job) => (
                <SpotlightCard
                  key={job._id}
                  spotlightColor="rgba(139,92,246,0.13)"
                  className="cursor-pointer hover:border-primary/40"
                >
                  <div className="p-6 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{job.title}</h3>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${teamColor(job.team)}`}>
                          {job.team}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mb-3">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" /> {job.type}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{job.desc}</p>
                    </div>
                    <a
                      href={`mailto:careers@CodeHiring.io?subject=Application: ${encodeURIComponent(job.title)}`}
                      className="shrink-0 flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mt-1"
                    >
                      Apply <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          )}
        </div>

        {/* General application */}
        <div className="rounded-xl border border-border bg-secondary/30 p-8 text-center">
          <h2 className="text-lg font-bold text-foreground mb-2">Don't see the right role?</h2>
          <p className="text-sm text-muted-foreground mb-5">
            We're always open to meeting exceptional people. Send us your profile and tell us how you'd contribute.
          </p>
          <a
            href="mailto:careers@CodeHiring.io?subject=General Application"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Send a general application <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
