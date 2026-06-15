"use client"

import { useEffect, useState } from "react"
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff, ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Post {
  _id?: string
  slug: string
  title: string
  excerpt: string
  content: string
  tag: string
  tagColor: string
  date: string
  readTime: string
  published: boolean
}

const TAG_OPTIONS = [
  { label: "Insights",    value: "Insights",    color: "bg-primary/10 text-primary" },
  { label: "For Colleges",value: "For Colleges", color: "bg-emerald-500/10 text-emerald-600" },
  { label: "Recruiting",  value: "Recruiting",  color: "bg-amber-500/10 text-amber-600" },
  { label: "Product",     value: "Product",     color: "bg-violet-500/10 text-violet-600" },
  { label: "Guide",       value: "Guide",       color: "bg-cyan-500/10 text-cyan-600" },
  { label: "Trends",      value: "Trends",      color: "bg-rose-500/10 text-rose-600" },
  { label: "News",        value: "News",        color: "bg-sky-500/10 text-sky-600" },
]

const EMPTY: Post = {
  slug: "", title: "", excerpt: "", content: "",
  tag: "Insights", tagColor: "bg-primary/10 text-primary",
  date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  readTime: "5 min read", published: false,
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

export function AdminBlog() {
  const [posts, setPosts]     = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView]       = useState<"list" | "edit">("list")
  const [editing, setEditing] = useState<Post | null>(null)
  const [saving, setSaving]   = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError]     = useState("")

  const load = () => {
    setLoading(true)
    fetch("/api/admin/blog")
      .then(r => r.json())
      .then(d => setPosts(d.posts ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openNew  = () => { setEditing({ ...EMPTY }); setError(""); setView("edit") }
  const openEdit = (p: Post) => { setEditing({ ...p }); setError(""); setView("edit") }
  const cancel   = () => { setView("list"); setEditing(null); setError("") }

  const handleSave = async () => {
    if (!editing) return
    if (!editing.title || !editing.slug || !editing.content) {
      setError("Title, slug, and content are required."); return
    }
    setSaving(true); setError("")
    try {
      const isNew = !editing._id
      const url   = isNew ? "/api/admin/blog" : `/api/admin/blog?id=${editing._id}`
      const method = isNew ? "POST" : "PATCH"
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Save failed")
      load(); cancel()
    } catch (e: any) {
      setError(e.message ?? "Error saving post")
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" })
      load()
    } catch {}
    finally { setDeleting(null) }
  }

  const togglePublish = async (p: Post) => {
    if (!p._id) return
    await fetch(`/api/admin/blog?id=${p._id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !p.published }),
    })
    load()
  }

  /* ── EDIT FORM ── */
  if (view === "edit" && editing) {
    return (
      <main className="pt-14 min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <button onClick={cancel} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to posts
          </button>
          <h1 className="text-2xl font-bold text-foreground mb-8">{editing._id ? "Edit Post" : "New Post"}</h1>

          {error && <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-200 dark:border-red-500/20">{error}</div>}

          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Title *</label>
              <input className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={editing.title}
                onChange={e => setEditing(p => ({ ...p!, title: e.target.value, slug: p!._id ? p!.slug : slugify(e.target.value) }))}
                placeholder="Why Your LeetCode Score Matters…"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Slug * <span className="text-muted-foreground font-normal">(URL path)</span></label>
              <input className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={editing.slug}
                onChange={e => setEditing(p => ({ ...p!, slug: slugify(e.target.value) }))}
                placeholder="why-leetcode-score-matters"
              />
            </div>

            {/* Tag + Date + Read time */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Tag</label>
                <select className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={editing.tag}
                  onChange={e => {
                    const opt = TAG_OPTIONS.find(t => t.value === e.target.value)
                    setEditing(p => ({ ...p!, tag: e.target.value, tagColor: opt?.color ?? p!.tagColor }))
                  }}>
                  {TAG_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Date</label>
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={editing.date}
                  onChange={e => setEditing(p => ({ ...p!, date: e.target.value }))}
                  placeholder="June 15, 2026"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Read time</label>
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={editing.readTime}
                  onChange={e => setEditing(p => ({ ...p!, readTime: e.target.value }))}
                  placeholder="5 min read"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Excerpt</label>
              <textarea className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
                rows={3}
                value={editing.excerpt}
                onChange={e => setEditing(p => ({ ...p!, excerpt: e.target.value }))}
                placeholder="Short summary shown on the blog list page…"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Content * <span className="text-muted-foreground font-normal">(Markdown: ## Heading, ### Sub, **bold**, - bullet, 1. numbered)</span>
              </label>
              <textarea className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground font-mono resize-y focus:outline-none focus:ring-2 focus:ring-primary/40"
                rows={20}
                value={editing.content}
                onChange={e => setEditing(p => ({ ...p!, content: e.target.value }))}
                placeholder="## Introduction&#10;&#10;Write your article here…"
              />
            </div>

            {/* Published toggle */}
            <div className="flex items-center gap-3">
              <button type="button"
                onClick={() => setEditing(p => ({ ...p!, published: !p!.published }))}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${editing.published ? "bg-primary" : "bg-border"}`}>
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${editing.published ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
              <span className="text-sm text-foreground">
                {editing.published ? "Published — visible on site" : "Draft — hidden from public"}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button onClick={cancel} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                {saving ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : editing._id ? "Save Changes" : "Publish Post"}
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  /* ── POST LIST ── */
  return (
    <main className="pt-14 min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create and manage articles — new posts appear on the homepage and blog immediately.
            </p>
          </div>
          <button onClick={openNew}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all">
            <Plus className="h-4 w-4" /> New Post
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">No posts yet.</p>
            <button onClick={openNew} className="text-sm text-primary hover:underline">Create your first post →</button>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map(post => (
              <div key={post._id ?? post.slug}
                className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${post.tagColor}`}>{post.tag}</span>
                    {!post.published && (
                      <span className="text-[10px] font-semibold rounded-full px-2 py-0.5 bg-amber-500/10 text-amber-600">Draft</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-foreground truncate">{post.title}</p>
                  <p className="text-xs text-muted-foreground">{post.date} · {post.readTime}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {/* Toggle publish */}
                  <button onClick={() => togglePublish(post)} title={post.published ? "Unpublish" : "Publish"}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                    {post.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  {/* Preview */}
                  <Link href={`/blog/${post.slug}`} target="_blank"
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  {/* Edit */}
                  <button onClick={() => openEdit(post)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                    <Pencil className="h-4 w-4" />
                  </button>
                  {/* Delete */}
                  {post._id && (
                    <button onClick={() => handleDelete(post._id!)} disabled={deleting === post._id}
                      className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all disabled:opacity-40">
                      {deleting === post._id
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Trash2 className="h-4 w-4" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
