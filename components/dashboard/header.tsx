import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface DashboardHeaderProps {
  title: string
  description?: string
  backLink?: { href: string; label: string }
  action?: React.ReactNode
}

export function DashboardHeader({ title, description, backLink, action }: DashboardHeaderProps) {
  return (
    <header className="sticky top-14 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          {backLink && (
            <Link
              href={backLink.href}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1.5 transition-colors group"
            >
              <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
              {backLink.label}
            </Link>
          )}
          <h1 className="text-xl font-bold text-foreground tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  )
}
