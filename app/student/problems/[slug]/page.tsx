"use client"

import { Suspense } from "react"
import { useParams } from "next/navigation"
import { RefreshCw } from "lucide-react"
import { TOPIC_QUESTIONS } from "@/lib/topic-questions"
import dynamic from "next/dynamic"

// Build slug -> problemId lookup
const SLUG_TO_ID: Record<string, string> = {}
for (const topic of TOPIC_QUESTIONS) {
  for (const q of topic.questions) {
    const slug = q.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
    SLUG_TO_ID[slug] = q.id
  }
}

// Dynamically import the editor (avoids SSR issues)
const EditorWrapper = dynamic(
  () => import("@/components/student/problem-editor"),
  { ssr: false, loading: () => (
    <div className="h-screen flex items-center justify-center gap-2" style={{ background:"#0d1117", color:"#8b949e" }}>
      <RefreshCw className="h-5 w-5 animate-spin" /> Loading...
    </div>
  )}
)

export default function ProblemSlugPage() {
  const params    = useParams()
  const slug      = params.slug as string
  const problemId = SLUG_TO_ID[slug] ?? ""

  return <EditorWrapper problemId={problemId} />
}
