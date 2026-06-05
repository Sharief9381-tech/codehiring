import Link from "next/link"
import Image from "next/image"
import { Mail, Twitter, Github, Linkedin } from "lucide-react"

const links = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Platforms", href: "#platforms" },
    { label: "Live Stats", href: "#stats" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Feedback", href: "/feedback" },
    { label: "Contact", href: "/contact" },
  ],
  For: [
    { label: "Students", href: "/signup?role=student" },
    { label: "Graduates", href: "/signup?role=graduate" },
    { label: "Colleges", href: "/signup?role=college" },
    { label: "Recruiters", href: "/signup?role=recruiter" },
    { label: "Sign In", href: "/login" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Security", href: "/security" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-6">

          {/* Brand — spans 2 columns */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <Image src="/codehiring-logo.svg" alt="CodeHiring" width={150} height={38} className="h-8 w-auto block dark:hidden" />
              <Image src="/codehiring-logo-dark.svg" alt="CodeHiring" width={150} height={38} className="h-8 w-auto hidden dark:block" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              Unifying coding performance tracking, placement analytics, and AI-powered recruitment — all in one platform.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="mailto:support@codehiring.io"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Link columns — 1 column each */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-foreground mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CodeHiring. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built for students, colleges & companies who believe in{" "}
            <span className="text-foreground font-medium">merit over keywords</span>.
          </p>
        </div>
      </div>
    </footer>
  )
}
