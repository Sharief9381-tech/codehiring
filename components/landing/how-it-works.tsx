import { GraduationCap, Building2, Briefcase } from "lucide-react"
import { SpotlightCard } from "@/components/landing/spotlight-card"

const flows = [
  {
    role: "Student",
    icon: GraduationCap,
    color: "text-primary",
    bgColor: "bg-primary/10",
    lineColor: "bg-primary/30",
    numColor: "text-primary",
    steps: [
      { step: "01", title: "Connect Profiles", desc: "Link LeetCode, GitHub, CodeChef, Codeforces, and HackerRank accounts in minutes." },
      { step: "02", title: "Auto-Sync Stats", desc: "Your performance data syncs automatically — no manual entry needed." },
      { step: "03", title: "Get Scored", desc: "Receive a normalized CodeScore visible to colleges and recruiters." },
      { step: "04", title: "Get Hired", desc: "Apply to matched jobs or get discovered by companies hiring your skill set." },
    ],
  },
  {
    role: "College",
    icon: Building2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    lineColor: "bg-emerald-500/30",
    numColor: "text-emerald-500",
    steps: [
      { step: "01", title: "Register College", desc: "Create your college account and generate a unique college code." },
      { step: "02", title: "Onboard Students", desc: "Students join using the college code — bulk CSV upload also supported." },
      { step: "03", title: "Monitor Progress", desc: "Watch real-time coding activity, rankings, and batch-wise analytics." },
      { step: "04", title: "Drive Placements", desc: "Invite recruiters, create drives, and track outcomes end-to-end." },
    ],
  },
  {
    role: "Recruiter",
    icon: Briefcase,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    lineColor: "bg-amber-500/30",
    numColor: "text-amber-500",
    steps: [
      { step: "01", title: "Post Requirements", desc: "Define the role, required skills, minimum ratings, and preferred platforms." },
      { step: "02", title: "AI Matches Talent", desc: "Our AI ranks candidates from verified coding data across all platforms." },
      { step: "03", title: "Review & Shortlist", desc: "Browse ranked candidates with full skill breakdowns and platform stats." },
      { step: "04", title: "Schedule & Hire", desc: "Reach out, run assessments, and manage your pipeline to close hires." },
    ],
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-secondary/20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Process</p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
            How It Works
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Four simple steps for each role — get up and running in under five minutes.
          </p>
        </div>

        <div className="space-y-20">
          {flows.map((flow) => (
            <div key={flow.role}>
              {/* Role label */}
              <div className="flex items-center gap-3 mb-10">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${flow.bgColor}`}>
                  <flow.icon className={`h-5 w-5 ${flow.color}`} />
                </div>
                <h3 className={`text-lg font-semibold ${flow.color}`}>{flow.role} Journey</h3>
              </div>

              {/* Steps */}
              <div className="grid gap-4 sm:grid-cols-4">
                {flow.steps.map((item, index) => (
                  <SpotlightCard
                    key={index}
                    spotlightColor={
                      flow.role === "Student"   ? "rgba(139,92,246,0.15)" :
                      flow.role === "College"   ? "rgba(34,197,94,0.15)"  :
                                                  "rgba(234,179,8,0.15)"
                    }
                    className="relative p-6 cursor-pointer hover:border-primary/30 transition-all"
                  >
                    {/* Connector line */}
                    {index < flow.steps.length - 1 && (
                      <div className={`hidden sm:block absolute top-[2.5rem] left-[calc(50%+20px)] right-0 h-px ${flow.lineColor} z-20`} />
                    )}
                    <div className="flex flex-col items-center text-center">
                      <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background mb-4 group-hover:border-primary/50 transition-colors`}>
                        <span className={`text-xs font-bold ${flow.numColor}`}>{item.step}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-foreground mb-1.5">{item.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
