"use client"

import { useEffect, useState } from "react"
import { ProfileForm } from "@/components/student/profile-form"
import { Pencil, Save, X, Loader2, Sparkles, User, BookOpen, Code2, Github, Linkedin, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

// ── Read-only profile view ────────────────────────────────────────────────────

function ProfileView({ user }: { user: any }) {
  const initials = user?.name
    ? user.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?"

  const socials = [
    { icon: Github, label: "GitHub", url: user?.githubUrl },
    { icon: Linkedin, label: "LinkedIn", url: user?.linkedinUrl },
    { icon: Globe, label: "Portfolio", url: user?.portfolioUrl },
  ].filter(s => s.url)

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent" />
        <div className="px-6 pb-6 -mt-10">
          <div className="flex items-end justify-between gap-4 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-2xl font-bold text-primary-foreground ring-4 ring-background shadow-lg">
              {initials}
            </div>
            <div className="flex flex-wrap gap-2 pb-2">
              {user?.isOpenToWork && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-medium">
                  Open to Work
                </span>
              )}
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium capitalize">
                Student
              </span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-foreground">{user?.name || "—"}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{user?.email}</p>
          {user?.bio && <p className="text-sm text-foreground/80 mt-3 leading-relaxed">{user.bio}</p>}
          {socials.length > 0 && (
            <div className="flex gap-3 mt-4">
              {socials.map(({ icon: Icon, label, url }) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                  <Icon className="h-3.5 w-3.5" />{label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Personal */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Personal Info</h3>
          {[
            { label: "Full Name", value: user?.name },
            { label: "Email", value: user?.email },
            { label: "Phone", value: user?.phone },
            { label: "Location", value: user?.location },
          ].map(({ label, value }) => value ? (
            <div key={label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium text-foreground">{value}</span>
            </div>
          ) : null)}
        </div>

        {/* Education */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2"><BookOpen className="h-4 w-4 text-blue-500" /> Education</h3>
          {[
            { label: "College", value: user?.collegeName || user?.collegeCode },
            { label: "Degree", value: user?.degree },
            { label: "Branch", value: user?.branch },
            { label: "Graduation Year", value: user?.graduationYear },
            { label: "Roll Number", value: user?.rollNumber },
          ].map(({ label, value }) => value ? (
            <div key={label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium text-foreground">{value}</span>
            </div>
          ) : null)}
        </div>

        {/* Skills */}
        {user?.skills?.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3 md:col-span-2">
            <h3 className="text-sm font-semibold flex items-center gap-2"><Code2 className="h-4 w-4 text-pink-500" /> Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((s: string) => (
                <Badge key={s} variant="secondary" className="text-xs px-2.5 py-1">{s}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState<any>(null)
  const [savedData, setSavedData] = useState<any>(null)

  useEffect(() => {
    fetch("/api/student/profile")
      .then(r => r.json())
      .then(data => { if (data.user) { setFormData(data.user); setSavedData(data.user) } })
      .catch(() =>
        fetch("/api/auth/user").then(r => r.json()).then(data => {
          if (data.user) { setFormData(data.user); setSavedData(data.user) }
        })
      )
      .finally(() => setLoading(false))
  }, [])

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
      if (data.success) {
        setSavedData(formData)
        setEditing(false)
        toast.success("Profile saved!")
      } else {
        toast.error(data.error || "Save failed")
      }
    } catch {
      toast.error("Network error")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(savedData)
    setEditing(false)
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="relative z-10 p-6 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">Profile</h1>
              <p className="text-xs text-muted-foreground">Your public coding identity</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-foreground transition-all text-xs font-medium"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-all disabled:opacity-60"
                >
                  {saving
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</>
                    : <><Save className="w-3.5 h-3.5" /> Save Changes</>
                  }
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-all disabled:opacity-60"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : editing ? (
          <ProfileForm user={formData} onChange={setFormData} />
        ) : (
          <ProfileView user={savedData} />
        )}
      </div>
    </div>
  )
}
