"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Trophy } from "lucide-react"
import { AssessmentHistoryPage } from "@/components/student/assessment-history"

export default function PrepHistoryPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-border py-3 px-4"
        style={{ background: "var(--background)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Prep
          </button>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-400" />
            <h2 className="text-lg font-bold text-foreground">Assessment History</h2>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AssessmentHistoryPage />
      </div>
    </div>
  )
}
