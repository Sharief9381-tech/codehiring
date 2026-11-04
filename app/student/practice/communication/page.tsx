"use client"

/**
 * AI Voice Communication Coach
 * Tabs: Voice Chat | Practice & Feedback | Mock Interview
 * Each tab delegates to the dedicated component — no duplicate logic here.
 */

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { VoiceConversation }      from "@/components/student/voice-conversation"
import { VoiceCoach }             from "@/components/student/voice-coach"

export default function CommunicationCoachPage() {
  const router = useRouter()
  const [tab, setTab] = useState<"chat" | "practice" | "interview">("chat")

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        </div>

        {/* Tab bar */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl mb-5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {[
            { id: "chat"      as const, icon: "🗣️", label: "Voice Chat",    desc: "Free conversation" },
            { id: "practice"  as const, icon: "🎯", label: "Practice",      desc: "Question + feedback" },
            { id: "interview" as const, icon: "🤝", label: "Mock Interview", desc: "Live session" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="py-2 px-1 rounded-lg text-[11px] font-semibold transition-all text-center"
              style={tab === t.id
                ? { background: "rgba(99,102,241,0.18)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.35)" }
                : { color: "var(--muted-foreground)" }}>
              <p>{t.icon} {t.label}</p>
              <p className="text-[9px] opacity-50 font-normal mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>

        {/* Voice Chat — ChatGPT-style orb */}
        {tab === "chat" && <VoiceConversation />}

        {/* Practice — uses VoiceCoach in practice mode */}
        {tab === "practice" && <VoiceCoach defaultMode="practice" />}

        {/* Mock Interview — uses VoiceCoach in interview mode */}
        {tab === "interview" && <VoiceCoach defaultMode="interview" />}

      </div>
    </div>
  )
}
