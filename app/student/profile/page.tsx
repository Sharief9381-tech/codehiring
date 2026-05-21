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
    // Use the dedicated profile endpoint for richer student data
    fetch("/api/student/profile")
      .then(r => r.json())
      .then(data => {
        if (data.user) { setFormData(data.user) }
      })
      .catch(() => {
        // Fallback to auth/user
        fetch("/api/auth/user")
          .then(r => r.json())
          .then(data => { if (data.user) { setFormData(data.user) } })
      })
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
      setToast({ msg: data.success ? "Profile saved successfully!" : (data.error || "Save failed"), ok: !!data.success })
    } catch {
      setToast({ msg: "Network error, please try again", ok: false })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "linear-gradient(135deg, #050816 0%, #0f172a 50%, #050816 100%)" }}
    >
      {/* Ambient glow blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-teal-600/6 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-purple-500/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">Edit Profile</h1>
            </div>
            <p className="text-xs text-white/40 ml-10">Update your information and showcase your journey</p>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/8 transition-all text-xs font-medium">
              <Eye className="w-3.5 h-3.5" />
              Preview Profile
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all duration-200 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #9333ea, #3b82f6)", boxShadow: "0 0 20px rgba(147,51,234,0.3)" }}
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
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        ) : (
          <ProfileForm user={formData} onChange={setFormData} />
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium shadow-2xl transition-all ${
          toast.ok
            ? "bg-teal-500/20 border-teal-500/40 text-teal-300"
            : "bg-red-500/20 border-red-500/40 text-red-300"
        }`}>
          {toast.ok ? "✓" : "✕"} {toast.msg}
        </div>
      )}
    </div>
  )
}
