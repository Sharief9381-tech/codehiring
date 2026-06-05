import { SpotlightCard } from "@/components/landing/spotlight-card"
import {
  GraduationCap,
  Building2,
  Briefcase,
  BarChart3,
  Users,
  Brain,
  Trophy,
  FileText,
  Target,
  GitBranch,
  ShieldCheck,
  Zap,
} from "lucide-react"

const tabs = [
  {
    role: "Students",
    icon: GraduationCap,
    accent: "text-primary",
    bgAccent: "bg-primary/10",
    spotlight: "rgba(139,92,246,0.13)",
    border: "hover:border-primary/50",
    iconColor: "text-primary",
    description: "Track every platform. Build a verified profile. Land your dream job.",
    features: [
      { icon: BarChart3, title: "Unified Dashboard", desc: "All your LeetCode, CodeChef, Codeforces, HackerRank & GitHub stats in one place." },
      { icon: Trophy, title: "Score Analytics", desc: "Normalized scores that make your skills comparable across colleges and platforms." },
      { icon: FileText, title: "Smart Resume", desc: "Auto-generate a verified resume powered by real performance data." },
      { icon: Target, title: "AI Job Match", desc: "Personalized job recommendations based on your actual coding profile." },
      { icon: GitBranch, title: "GitHub Insights", desc: "Contribution streaks, repositories, and open-source activity tracked automatically." },
      { icon: Zap, title: "Skill Gaps", desc: "AI-identified gaps in your skill set with curated resources to close them fast." },
    ],
  },
  {
    role: "Colleges",
    icon: Building2,
    accent: "text-emerald-500",
    bgAccent: "bg-emerald-500/10",
    spotlight: "rgba(34,197,94,0.12)",
    border: "hover:border-emerald-500/50",
    iconColor: "text-emerald-500",
    description: "Monitor batches. Drive placements. Prove your college's value.",
    features: [
      { icon: Users, title: "Batch Tracking", desc: "Monitor entire batches with branch-wise stats and real-time performance data." },
      { icon: BarChart3, title: "Placement Analytics", desc: "Data-driven insights to improve placement rates and identify skill gaps." },
      { icon: Trophy, title: "Leaderboards", desc: "Motivate students with competitive leaderboards and achievement badges." },
      { icon: ShieldCheck, title: "Access Control", desc: "Decide exactly which recruiters can see your students' data." },
      { icon: FileText, title: "Report Generation", desc: "One-click placement reports for management, NAAC, and rankings." },
      { icon: Briefcase, title: "Drive Management", desc: "Create and manage on-campus drives with applications tracked end-to-end." },
    ],
  },
  {
    role: "Recruiters",
    icon: Briefcase,
    accent: "text-amber-500",
    bgAccent: "bg-amber-500/10",
    spotlight: "rgba(234,179,8,0.12)",
    border: "hover:border-amber-500/50",
    iconColor: "text-amber-500",
    description: "Skip keyword matching. Hire on verified coding performance.",
    features: [
      { icon: Brain, title: "AI Talent Matching", desc: "Find candidates whose skills are verified across platforms, not self-reported." },
      { icon: Target, title: "Advanced Filters", desc: "Filter by stack, ratings, contest ranks, GitHub activity, CGPA, and more." },
      { icon: Users, title: "Bulk Outreach", desc: "Shortlist and contact multiple candidates efficiently with smart automation." },
      { icon: ShieldCheck, title: "Verified Profiles", desc: "Every stat is pulled directly from the platform — no resume fraud." },
      { icon: BarChart3, title: "Hiring Pipeline", desc: "Track every candidate from screening to offer in a visual pipeline." },
      { icon: FileText, title: "Assessment Builder", desc: "Create AI-powered coding assessments tailored to your job requirements." },
    ],
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Features</p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
            Built for Every Role in the Ecosystem
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Whether you are a student building your career, a college driving placements, or a company finding talent — CodeHiring has you covered.
          </p>
        </div>

        <div className="space-y-20">
          {tabs.map((tab) => (
            <div key={tab.role}>
              {/* Role header */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tab.bgAccent}`}>
                  <tab.icon className={`h-5 w-5 ${tab.accent}`} />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${tab.accent}`}>For {tab.role}</h3>
                  <p className="text-sm text-muted-foreground">{tab.description}</p>
                </div>
              </div>

              {/* Feature grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tab.features.map((f, i) => (
                  <SpotlightCard
                    key={i}
                    spotlightColor={tab.spotlight}
                    className={`p-6 ${tab.border} transition-all cursor-pointer`}
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${tab.bgAccent} mb-4`}>
                      <f.icon className={`h-4 w-4 ${tab.iconColor}`} />
                    </div>
                    <h4 className="text-sm font-semibold text-foreground mb-1.5">{f.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
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
