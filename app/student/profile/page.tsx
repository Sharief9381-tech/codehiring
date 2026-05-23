"use client"

import { useEffect, useState } from "react"
import { ProfileForm } from "@/components/student/profile-form"
import { Eye, Save, Loader2, Sparkles } from "lucide-react"

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<any>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  useEffect(() => {
    fetch("/api/student/profile")
      .then(r => r.json())
      .then(data => { if (data.user) setFormData(data.user) })
      .catch(() =>
        fetch("/api/auth/user").then(r => r.json()).then(data => { if (data.user) setFormData(data.user) })
      )
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t) }
  }, [toast])

  const handleSave = async () => {
    if (!formData) return
    setSaving(true)
    try {
      const res = await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      setToast({ msg: data.success ? "Profile saved!" : (data.error || "Save failed"), ok: !!data.success })
    } catch {
      setToast({ msg: "Network error", ok: false })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="relative z-10 p-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">Edit Profile</h1>
            </div>
            <p className="text-xs text-muted-foreground ml-10">Update your information and showcase your journey</p>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all text-xs font-medium">
              <Eye className="w-3.5 h-3.5" />
              Preview Profile
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-all duration-200 disabled:opacity-60"
            >
              {saving
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving...</>
                : <><Save className="w-3.5 h-3.5" />Save Changes</>
              }
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <ProfileForm user={formData} onChange={setFormData} />
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium shadow-2xl transition-all ${
          toast.ok
            ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400"
            : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
        }`}>
          {toast.ok ? "✓" : "✕"} {toast.msg}
        </div>
      )}
    </div>
  )
}
