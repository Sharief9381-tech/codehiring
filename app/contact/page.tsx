import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Mail, Twitter, Linkedin, Github, MessageSquare, Building2, GraduationCap, Briefcase } from "lucide-react"
import { SpotlightCard } from "@/components/landing/spotlight-card"

export const metadata = {
  title: "Contact — CodeHiring",
  description: "Get in touch with the CodeHiring team.",
}

const contacts = [
  {
    icon: MessageSquare,
    title: "General Support",
    desc: "Questions about the platform, your account, or anything else.",
    href: "mailto:support@CodeHiring.io",
    label: "support@CodeHiring.io",
  },
  {
    icon: GraduationCap,
    title: "Student Help",
    desc: "Platform connections, profile issues, or job matching queries.",
    href: "mailto:students@CodeHiring.io",
    label: "students@CodeHiring.io",
  },
  {
    icon: Building2,
    title: "College Partnerships",
    desc: "Onboarding your institution, pricing, and integration questions.",
    href: "mailto:colleges@CodeHiring.io",
    label: "colleges@CodeHiring.io",
  },
  {
    icon: Briefcase,
    title: "Recruiter Enquiries",
    desc: "Access to candidate pool, enterprise plans, and hiring drives.",
    href: "mailto:recruiters@CodeHiring.io",
    label: "recruiters@CodeHiring.io",
  },
]

const socials = [
  { icon: Twitter, label: "Twitter / X", href: "https://twitter.com/CodeHiring", handle: "@CodeHiring" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/CodeHiring", handle: "CodeHiring" },
  { icon: Github, label: "GitHub", href: "https://github.com/CodeHiring", handle: "CodeHiring" },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <div className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/codehiring-logo.svg" alt="CodeHiring" width={120} height={30} className="h-7 w-auto" />
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">Contact</span>
          <Link href="/" className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="mb-14">
          <p className="text-sm text-primary font-semibold uppercase tracking-widest mb-3">Contact</p>
          <h1 className="text-4xl font-bold text-foreground mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
            We're a small team and we read every message. Reach out to the right inbox and we'll get back to you within 24–48 hours.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid gap-4 sm:grid-cols-2 mb-14">
          {contacts.map((c) => (
            <SpotlightCard key={c.title} spotlightColor="rgba(139,92,246,0.15)" className="cursor-pointer hover:border-primary/40">
              <a href={c.href} className="group block p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <c.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{c.desc}</p>
                <span className="text-sm font-medium text-primary group-hover:underline">{c.label}</span>
              </a>
            </SpotlightCard>
          ))}
        </div>

        {/* Socials */}
        <div className="rounded-xl border border-border bg-card p-7 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-5">Find Us Online</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            {socials.map((s) => (
              <SpotlightCard key={s.label} spotlightColor="rgba(139,92,246,0.13)" className="flex-1 cursor-pointer">
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <s.icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-sm font-medium text-foreground">{s.handle}</p>
                  </div>
                </a>
              </SpotlightCard>
            ))}
          </div>
        </div>

        {/* Response time note */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/20 px-5 py-4">
          <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground">
            We typically respond within <span className="text-foreground font-medium">24–48 hours</span> on business days.
            For urgent issues, include "URGENT" in your subject line.
          </p>
        </div>
      </div>
    </div>
  )
}
