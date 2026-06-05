import { Code2, Github, Terminal, Braces, Hash, FileCode, BookOpen, Cpu } from "lucide-react"
import { SpotlightCard } from "@/components/landing/spotlight-card"

const platforms = [
  { name: "LeetCode",      icon: Code2,     color: "text-amber-500",   bg: "bg-amber-500/10",   desc: "Problems & contests",       spotlight: "rgba(234,179,8,0.18)"    },
  { name: "GitHub",        icon: Github,    color: "text-foreground",  bg: "bg-secondary",      desc: "Contributions & repos",     spotlight: "rgba(120,120,120,0.15)"  },
  { name: "Codeforces",    icon: Hash,      color: "text-cyan-500",    bg: "bg-cyan-500/10",    desc: "Ratings & contests",        spotlight: "rgba(34,211,238,0.18)"   },
  { name: "CodeChef",      icon: Braces,    color: "text-rose-500",    bg: "bg-rose-500/10",    desc: "Ratings & problems",        spotlight: "rgba(239,68,68,0.15)"    },
  { name: "HackerRank",    icon: Terminal,  color: "text-primary",     bg: "bg-primary/10",     desc: "Badges & certifications",   spotlight: "rgba(139,92,246,0.18)"   },
  { name: "GeeksforGeeks", icon: FileCode,  color: "text-emerald-500", bg: "bg-emerald-500/10", desc: "Problems & courses",        spotlight: "rgba(34,197,94,0.18)"    },
  { name: "HackerEarth",   icon: Cpu,       color: "text-indigo-500",  bg: "bg-indigo-500/10",  desc: "Challenges & hackathons",   spotlight: "rgba(99,102,241,0.18)"   },
  { name: "AtCoder",       icon: BookOpen,  color: "text-violet-500",  bg: "bg-violet-500/10",  desc: "Competitive programming",   spotlight: "rgba(167,139,250,0.18)"  },
]

export function Platforms() {
  return (
    <section id="platforms" className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Integrations</p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
            All Major Platforms, One Profile
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            We pull live data directly from every platform so your profile is always accurate and up to date.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {platforms.map((p) => (
            <SpotlightCard
              key={p.name}
              spotlightColor={p.spotlight}
              className="flex flex-col items-center gap-3 p-5 text-center cursor-pointer group"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${p.bg}`}>
                <p.icon className={`h-5 w-5 ${p.color}`} />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{p.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{p.desc}</p>
              </div>
            </SpotlightCard>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          More platforms being added.{" "}
          <a href="mailto:support@codehire.io" className="text-primary hover:underline">
            Request an integration →
          </a>
        </p>
      </div>
    </section>
  )
}
