"use client"

/**
 * SessionWatcher — mounts inside every authenticated layout.
 * Polls /api/auth/user every 30 seconds.
 * If the server returns reason: "logged_out_elsewhere", it clears local state
 * and redirects to /login with a query param so the login page can show a banner.
 */

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

const POLL_INTERVAL_MS = 30_000  // 30 seconds

export function SessionWatcher() {
  const router = useRouter()
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>

    const check = async () => {
      try {
        abortRef.current?.abort()
        abortRef.current = new AbortController()

        const res = await fetch("/api/auth/user", {
          signal: abortRef.current.signal,
          cache:  "no-store",
        })

        if (res.status === 401) {
          const data = await res.json().catch(() => ({}))
          if (data.reason === "logged_out_elsewhere") {
            clearInterval(timer)
            // Redirect to login with a reason message
            router.replace("/login?reason=logged_out_elsewhere")
          }
          // Other 401s (expired, not authenticated) — let the layout handle redirect
        }
      } catch (e: any) {
        if (e?.name === "AbortError") return  // unmounted — ignore
      }
    }

    // Start polling
    timer = setInterval(check, POLL_INTERVAL_MS)

    // Also check once immediately after a short delay
    const initial = setTimeout(check, 5_000)

    return () => {
      clearInterval(timer)
      clearTimeout(initial)
      abortRef.current?.abort()
    }
  }, [router])

  return null   // renders nothing
}
