"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AptitudePracticePage() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/student/prep?track=aptitude")
  }, [router])
  return null
}
