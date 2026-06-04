import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface DashboardHeaderProps {
  title: string
  description?: string
  backLink?: { href: string; label: string }
}

export function DashboardHeader({ title, description, backLink }: DashboardHeaderProps) {
  return (
    <header className="sticky top-16 z-40 flex items-center justify-between border-b border-border bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div>
        {backLink && (
          <Link href={backLink.href} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-1 transition-colors">
            <ArrowLeft className="h-3 w-3" />
            {backLink.label}
          </Link>
        )}
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </header>
  )
}
