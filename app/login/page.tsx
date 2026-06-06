import Image from "next/image"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { ClientOnly } from "@/components/client-only"
import { Code2, GitBranch, Trophy, Zap } from "lucide-react"

const features = [
  { icon: Code2, text: "Verified coding stats from 8+ platforms" },
  { icon: Trophy, text: "AI-powered job matching" },
  { icon: GitBranch, text: "Real GitHub & contest data" },
  { icon: Zap, text: "Instant placement insights" },
]

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/90 via-violet-600 to-indigo-700 flex-col items-center justify-center p-12 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-white/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-white/3 blur-3xl" />

        <div className="relative z-10 max-w-sm">
          <Link href="/" className="flex items-center mb-12">
            <Image src="/codehiring-logo-dark.svg" alt="CodeHiring" width={160} height={40} className="h-9 w-auto" />
          </Link>

          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            Where Coding Skills<br />Meet Opportunities
          </h2>
          <p className="text-white/70 text-sm mb-10 leading-relaxed">
            Join thousands of students, colleges, and recruiters using verified coding data to make smarter hiring decisions.
          </p>

          <div className="space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm text-white/85">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-background">
        {/* Mobile logo */}
        <Link href="/" className="flex items-center mb-10 lg:hidden">
          <Image src="/codehiring-logo.svg" alt="CodeHiring" width={150} height={38} className="h-9 w-auto block dark:hidden" />
          <Image src="/codehiring-logo-dark.svg" alt="CodeHiring" width={150} height={38} className="h-9 w-auto hidden dark:block" />
        </Link>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground text-sm mt-1.5">Sign in to your CodeHiring account</p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <ClientOnly fallback={<div className="h-40 animate-pulse bg-muted rounded-xl" />}>
              <LoginForm />
            </ClientOnly>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline underline-offset-4">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
