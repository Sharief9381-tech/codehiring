import Link from "next/link"
import { ArrowRight, GraduationCap, Building2, Briefcase } from "lucide-react"
import { SpotlightCard } from "@/components/landing/spotlight-card"

const roles = [
  {
    icon: GraduationCap,
    title: "I'm a Student",
    desc: "Build a verified coding profile and get matched to jobs.",
    href: "/signup",
    spotlight: "rgba(139,92,246,0.18)",
    accent: "border-primary/30 bg-primary/5 hover:bg-primary/10",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: Building2,
    title: "I'm from a College",
    desc: "Track placements and manage student performance at scale.",
    href: "/signup",
    spotlight: "rgba(34,197,94,0.18)",
    accent: "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  {
    icon: Briefcase,
    title: "I'm a Recruiter",
    desc: "Find verified developer talent faster with AI-powered matching.",
    href: "/signup",
    spotlight: "rgba(234,179,8,0.18)",
    accent: "border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
  },
]

export function CTA() {
  return (
    <section className="py-24 px-6 bg-secondary/20">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Get Started</p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
            Ready to Transform Your Hiring?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Join students, colleges, and companies already using CodeHire to make smarter, data-driven decisions.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {roles.map((r) => (
            <Link key={r.title} href={r.href}>
              <SpotlightCard
                spotlightColor={r.spotlight}
                className={`cursor-pointer transition-all ${r.accent} h-full`}
              >
                <div className="group p-6 flex flex-col gap-4 h-full">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${r.iconBg}`}>
                    <r.icon className={`h-5 w-5 ${r.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{r.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-foreground/70 group-hover:text-primary transition-colors">
                    Get started <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </SpotlightCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
