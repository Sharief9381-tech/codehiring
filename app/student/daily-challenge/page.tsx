"use client"

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"
import { TOPIC_QUESTIONS } from "@/lib/topic-questions"
import dynamic from "next/dynamic"

// Build slug → problemId lookup
const SLUG_TO_ID: Record<string, string> = {}
const TITLE_TO_ID: Record<string, string> = {}
for (const topic of TOPIC_QUESTIONS) {
  for (const q of topic.questions) {
    const slug = q.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
    SLUG_TO_ID[slug] = q.id
    TITLE_TO_ID[q.title.toLowerCase()] = q.id
  }
}

const ProblemEditor = dynamic(
  () => import("@/components/student/problem-editor"),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen flex items-center justify-center gap-2"
        style={{ background: "#0d1117", color: "#8b949e" }}>
        <RefreshCw className="h-5 w-5 animate-spin" /> Loading...
      </div>
    ),
  }
)

export default function DailyChallengePage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center gap-2"
        style={{ background: "#0d1117", color: "#8b949e" }}>
        <RefreshCw className="h-5 w-5 animate-spin" /> Loading...
      </div>
    }>
      <DailyChallengeContent />
    </Suspense>
  )
}

function DailyChallengeContent() {
  const params = useSearchParams()
  const router = useRouter()

  // Support multiple param formats:
  // 1. ?problemId=arrays-m1-q1  (clean, from topic hub)
  // 2. ?title=Two+Sum            (title lookup)
  // 3. ?slug=two-sum             (slug lookup)
  // 4. Old URL params (title, desc, input, etc.) → redirect to problem editor

  const problemId = params.get("problemId")
  const titleParam = params.get("title")
  const slugParam  = params.get("slug")

  // Resolve problemId from various sources
  let resolvedId = problemId ?? ""

  if (!resolvedId && slugParam) {
    resolvedId = SLUG_TO_ID[slugParam] ?? ""
  }

  if (!resolvedId && titleParam) {
    resolvedId = TITLE_TO_ID[titleParam.toLowerCase()] ?? ""
    // If found, redirect to clean URL
    if (resolvedId) {
      const slug = titleParam
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
      // Redirect to the clean problem URL
      if (typeof window !== "undefined") {
        router.replace(`/student/problems/${slug}`)
        return (
          <div className="h-screen flex items-center justify-center gap-2"
            style={{ background: "#0d1117", color: "#8b949e" }}>
            <RefreshCw className="h-5 w-5 animate-spin" /> Redirecting...
          </div>
        )
      }
    }
  }

  // If we have a problemId, render the full editor
  if (resolvedId) {
    return <ProblemEditor problemId={resolvedId} />
  }

  // Old URL format with desc/input params — extract and show with problemId from title
  if (titleParam && params.get("desc")) {
    // Try to find in bank by title
    const foundId = TITLE_TO_ID[titleParam.toLowerCase()] ?? ""
    if (foundId) {
      return <ProblemEditor problemId={foundId} />
    }

    // Not in topic-questions — create a synthetic problemId from title
    // and redirect to problem editor with a generated ID
    const syntheticId = `daily-${titleParam
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 30)}`

    // Store the old URL params in sessionStorage so the editor can pick them up
    if (typeof window !== "undefined") {
      try {
        const syntheticProblem = {
          title:        titleParam,
          desc:         params.get("desc") ?? "",
          inputFormat:  params.get("inputFormat") ?? "",
          outputFormat: params.get("outputFormat") ?? "",
          constraints:  params.get("constraints")?.split("|||").filter(Boolean) ?? [],
          input:        params.get("input") ?? "",
          output:       params.get("output") ?? "",
          explain:      params.get("explain") ?? "",
          badge:        params.get("badge") ?? params.get("difficulty") ?? "Easy",
          examples: [{ input: params.get("input") ?? "", output: params.get("output") ?? "", explanation: params.get("explain") ?? "" }],
          starters: {},
          pythonTest1: "", expectedTest1: "",
          pythonTest2: "", expectedTest2: "",
          pythonTest3: "", expectedTest3: "",
          pythonTest4: "", expectedTest4: "",
          static: true,
        }
        sessionStorage.setItem(`problem_v2_${syntheticId}`, JSON.stringify(syntheticProblem))
      } catch {}
    }

    return <ProblemEditor problemId={syntheticId} />
  }

  // No valid params — show an error
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: "#0d1117", color: "#8b949e" }}>
      <p className="text-lg font-semibold" style={{ color: "#e6edf3" }}>Problem not found</p>
      <p className="text-sm">No problem ID or title provided.</p>
      <button
        onClick={() => router.back()}
        className="px-4 py-2 rounded text-sm font-medium"
        style={{ background: "#238636", color: "#fff" }}>
        Go Back
      </button>
    </div>
  )
}
