import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

interface PublicNavProps {
  crumb?: string
  backHref?: string
  backLabel?: string
  maxWidth?: string
}

export function PublicNav({ crumb, backHref = "/", backLabel = "Back", maxWidth = "max-w-4xl" }: PublicNavProps) {
  return (
    <div className="border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-10">
      <div className={`mx-auto ${maxWidth} px-6 py-4 flex items-center gap-3`}>
        <Link href="/" className="flex items-center shrink-0">
          <Image src="/codehiring-logo.svg" alt="CodeHiring" width={120} height={30} className="h-7 w-auto block dark:hidden" />
          <Image src="/codehiring-logo-dark.svg" alt="CodeHiring" width={120} height={30} className="h-7 w-auto hidden dark:block" />
        </Link>
        {crumb && (
          <>
            <span className="text-border/80">/</span>
            <span className="text-sm text-muted-foreground">{crumb}</span>
          </>
        )}
        <Link href={backHref} className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group">
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          {backLabel}
        </Link>
      </div>
    </div>
  )
}
