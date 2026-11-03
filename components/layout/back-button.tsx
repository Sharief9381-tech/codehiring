"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface BackButtonProps {
  fallback?: string
  label?: string
  className?: string
}

/**
 * BackButton — goes to previous browser history entry.
 * Falls back to `fallback` URL if no history (direct navigation / fresh tab).
 */
export function BackButton({
  fallback = "/",
  label = "Back",
  className = "flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors",
}: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(fallback)
    }
  }

  return (
    <button onClick={handleBack} className={className}>
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  )
}
