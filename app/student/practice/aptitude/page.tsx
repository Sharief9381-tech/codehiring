"use client"
// This page re-exports the main prep page with aptitude track pre-selected.
// It injects ?track=aptitude into the URL state so prep/page.tsx reads it correctly,
// but the browser URL stays at /student/practice/aptitude.
import { useEffect } from "react"
import PrepPage from "@/app/student/prep/page"

export default function AptitudePracticePage() {
  useEffect(() => {
    // Inject track=aptitude into the URL search params without navigating away
    const url = new URL(window.location.href)
    if (!url.searchParams.get("track")) {
      url.searchParams.set("track", "aptitude")
      window.history.replaceState(null, "", url.toString())
    }
  }, [])

  return <PrepPage />
}
