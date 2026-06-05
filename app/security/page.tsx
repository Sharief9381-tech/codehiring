import Link from "next/link"
import { ArrowLeft, Code2, ShieldCheck, Lock, KeyRound, Server, Eye, AlertTriangle } from "lucide-react"
import { SpotlightCard } from "@/components/landing/spotlight-card"

export const metadata = {
  title: "Security — CodeHire",
  description: "How CodeHire keeps your data and accounts secure.",
}

const practices = [
  {
    icon: Lock,
    title: "Password Hashing",
    desc: "Passwords are hashed using SHA-256 with a server-side salt. Plain-text passwords are never stored or logged anywhere in the system.",
  },
  {
    icon: KeyRound,
    title: "Session Tokens",
    desc: "Authentication is handled via cryptographically random 64-character session tokens stored in secure HTTP-only cookies.",
  },
  {
    icon: Server,
    title: "Encrypted Transport",
    desc: "All data between your browser and our servers is transmitted over HTTPS/TLS. Unencrypted HTTP connections are rejected.",
  },
  {
    icon: Eye,
    title: "Minimal Data Exposure",
    desc: "Password fields are never returned in API responses. Public APIs only expose the fields strictly necessary for the UI.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access Control",
    desc: "Every API route verifies the authenticated user's role before processing. Student data is only visible to authorized colleges and recruiters.",
  },
  {
    icon: AlertTriangle,
    title: "Input Validation",
    desc: "All user input is validated server-side. Database queries use parameterized operations to prevent injection attacks.",
  },
]

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <div className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Code2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">CodeHire</span>
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">Security</span>
          <Link href="/" className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12">
          <p className="text-sm text-primary font-semibold uppercase tracking-widest mb-3">Trust & Safety</p>
          <h1 className="text-4xl font-bold text-foreground mb-4">Security</h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            We take the security of your data seriously. Here's an overview of the technical and operational measures we have in place to keep your account and data safe.
          </p>
        </div>

        {/* Security practices grid */}
        <div className="grid gap-4 sm:grid-cols-2 mb-14">
          {practices.map((p) => (
            <SpotlightCard key={p.title} spotlightColor="rgba(139,92,246,0.15)" className="p-6 cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <p.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </SpotlightCard>
          ))}
        </div>

        {/* Vulnerability reporting */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Found a Vulnerability?</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            We welcome responsible disclosure. If you discover a security issue, please report it privately to us before making it public. We commit to acknowledging reports within 48 hours and resolving valid issues within 14 days.
          </p>
          <a
            href="mailto:security@codehire.io"
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-500 transition-colors"
          >
            Report a vulnerability → security@codehire.io
          </a>
        </div>
      </div>
    </div>
  )
}
