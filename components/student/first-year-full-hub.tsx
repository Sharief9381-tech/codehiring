"use client"

import { useState, useEffect } from "react"
import {
  BookOpen, Code2, Trophy, Star, Zap, CheckCircle2,
  Flame, Target, TrendingUp, ArrowRight, Sparkles,
  RefreshCw, Users, MessageCircle, Award, Brain,
  ChevronRight, ExternalLink, Heart, BookMarked,
} from "lucide-react"
import { FirstYearHub } from "@/components/student/first-year-hub"

// ── DATA ──────────────────────────────────────────────────────────────────────

const SOFT_SKILLS = [
  {
    id: "comm-basics", title: "Technical Communication Basics",
    desc: "How to explain code, ask good questions, write clear emails to teammates.",
    duration: "10 min", badge: "Communicator",
    steps: ["What is technical communication?", "How to ask a good question", "Writing clear commit messages", "Explaining your code to others"],
    videoUrl: "https://www.youtube.com/watch?v=zJFNHH4XKCE",
  },
  {
    id: "teamwork", title: "Working in a Dev Team",
    desc: "Git collaboration, code reviews, pair programming — what it's really like.",
    duration: "8 min", badge: "Team Player",
    steps: ["Git for teams: branches and PRs", "How code reviews work", "Pair programming basics", "Slack/Discord etiquette for devs"],
    videoUrl: "https://www.youtube.com/watch?v=MnUd31TvBoU",
  },
  {
    id: "growth-mindset", title: "Growth Mindset for Developers",
    desc: "Why debugging is learning. How to stay motivated when things are hard.",
    duration: "7 min", badge: "Growth Mindset",
    steps: ["Fixed vs growth mindset", "How to deal with imposter syndrome", "Celebrating small wins", "Building consistency over perfection"],
    videoUrl: "https://www.youtube.com/watch?v=_X0mgOOSpLU",
  },
  {
    id: "resume-basics", title: "Start Your Achievement Journal",
    desc: "Document what you build — not for jobs yet, just for self-awareness and growth.",
    duration: "5 min", badge: "Self-Aware",
    steps: ["Why document your journey?", "What counts as an achievement?", "Simple template: What I built today", "GitHub as your portfolio"],
    videoUrl: "https://www.youtube.com/watch?v=s-TZCBdJv5A",
  },
]

interface SeniorStory {
  name: string
  year: string
  story: string
  tip: string
  avatar: string
}

// ── Tag config ────────────────────────────────────────────────────────────────
const TAG_COLORS: Record<string, string> = {
  Question:    "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Tip:         "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Resource:    "bg-amber-500/15 text-amber-500 border-amber-500/20",
  Achievement: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  Help:        "bg-rose-500/15 text-rose-400 border-rose-500/20",
  General:     "bg-secondary text-muted-foreground border-border",
}

const ALL_TAGS = ["All", "Question", "Tip", "Resource", "Achievement", "Help", "General"] as const

// ── Types ──────────────────────────────────────────────────────────────────────
interface DiscussionPost {
  _id: string
  authorId: string
  authorName: string
  authorAvatar: string
  title: string
  content: string
  tag: string
  upvoteCount: number
  upvoted: boolean
  views: number
  replyCount: number
  pinned: boolean
  createdAt: string
}

interface DiscussionReply {
  _id: string
  authorId: string
  authorName: string
  authorAvatar: string
  content: string
  upvoteCount: number
  upvoted: boolean
  createdAt: string
}

interface DiscussionDetail extends DiscussionPost {
  replies: DiscussionReply[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60000)
  if (mins < 1)  return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// ── Thread view ────────────────────────────────────────────────────────────────
function ThreadView({
  post,
  currentUserId,
  onBack,
  onPostUpdate,
}: {
  post: DiscussionDetail
  currentUserId: string
  onBack: () => void
  onPostUpdate: (updated: DiscussionDetail) => void
}) {
  const [replyText, setReplyText]   = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [localPost, setLocalPost]   = useState<DiscussionDetail>(post)

  const upvotePost = async () => {
    const res  = await fetch(`/api/student/discussions/${localPost._id}?action=upvote`, { method: "POST" })
    const data = await res.json()
    const updated = { ...localPost, upvoteCount: data.upvotes, upvoted: data.upvoted }
    setLocalPost(updated)
    onPostUpdate(updated)
  }

  const upvoteReply = async (replyId: string) => {
    const res  = await fetch(`/api/student/discussions/${localPost._id}?action=upvote-reply&replyId=${replyId}`, { method: "POST" })
    const data = await res.json()
    setLocalPost(p => ({
      ...p,
      replies: p.replies.map(r => r._id === replyId ? { ...r, upvoteCount: data.upvotes, upvoted: data.upvoted } : r),
    }))
  }

  const submitReply = async () => {
    if (!replyText.trim()) return
    setSubmitting(true)
    try {
      const res  = await fetch(`/api/student/discussions/${localPost._id}?action=reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyText.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        const updated = { ...localPost, replies: [...localPost.replies, data.reply], replyCount: localPost.replyCount + 1 }
        setLocalPost(updated)
        onPostUpdate(updated)
        setReplyText("")
      }
    } finally { setSubmitting(false) }
  }

  const deleteReply = async (replyId: string) => {
    await fetch(`/api/student/discussions/${localPost._id}?replyId=${replyId}`, { method: "DELETE" })
    const updated = {
      ...localPost,
      replies: localPost.replies.filter(r => r._id !== replyId),
      replyCount: localPost.replyCount - 1,
    }
    setLocalPost(updated)
    onPostUpdate(updated)
  }

  const deletePost = async () => {
    await fetch(`/api/student/discussions/${localPost._id}`, { method: "DELETE" })
    onBack()
  }

  return (
    <div className="space-y-4">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronRight className="h-4 w-4 rotate-180" /> Back to Discussions
      </button>

      {/* Post */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-black">
            {localPost.authorAvatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-foreground">{localPost.authorName}</p>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${TAG_COLORS[localPost.tag] ?? TAG_COLORS.General}`}>
                {localPost.tag}
              </span>
              {localPost.pinned && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-amber-500/15 text-amber-400 border-amber-500/20">📌 Pinned</span>}
              <span className="text-[10px] text-muted-foreground ml-auto">{timeAgo(localPost.createdAt)}</span>
            </div>
            <h2 className="text-base font-bold text-foreground mt-1">{localPost.title}</h2>
          </div>
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{localPost.content}</p>
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <button onClick={upvotePost}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
              localPost.upvoted
                ? "bg-primary/15 text-primary border-primary/30"
                : "bg-transparent text-muted-foreground border-border hover:border-primary/30 hover:text-primary"
            }`}>
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill={localPost.upvoted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
              <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
            </svg>
            {localPost.upvoteCount}
          </button>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MessageCircle className="h-3.5 w-3.5" />{localPost.replies.length} replies
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            {localPost.views}
          </span>
          {localPost.authorId === currentUserId && (
            <button onClick={deletePost}
              className="ml-auto flex items-center gap-1 text-[10px] text-red-500 hover:underline">
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Replies */}
      {localPost.replies.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">{localPost.replies.length} {localPost.replies.length === 1 ? "Reply" : "Replies"}</p>
          {localPost.replies.map(reply => (
            <div key={reply._id} className="rounded-xl border border-border bg-card/60 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground text-[10px] font-black">
                  {reply.authorAvatar}
                </div>
                <p className="text-xs font-semibold text-foreground">{reply.authorName}</p>
                <span className="text-[10px] text-muted-foreground ml-auto">{timeAgo(reply.createdAt)}</span>
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap pl-9">{reply.content}</p>
              <div className="flex items-center gap-2 pl-9">
                <button onClick={() => upvoteReply(reply._id)}
                  className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-lg border transition-all ${
                    reply.upvoted
                      ? "bg-primary/15 text-primary border-primary/30"
                      : "bg-transparent text-muted-foreground border-border hover:border-primary/30 hover:text-primary"
                  }`}>
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill={reply.upvoted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                  </svg>
                  {reply.upvoteCount}
                </button>
                {reply.authorId === currentUserId && (
                  <button onClick={() => deleteReply(reply._id)}
                    className="text-[10px] text-red-500 hover:underline ml-auto">
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply box */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <p className="text-xs font-semibold text-foreground">Add a Reply</p>
        <textarea
          value={replyText}
          onChange={e => setReplyText(e.target.value)}
          placeholder="Share your thoughts, tips, or resources..."
          rows={3}
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
        />
        <div className="flex justify-end">
          <button
            onClick={submitReply}
            disabled={submitting || !replyText.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-40 transition-all"
            style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
            {submitting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ArrowRight className="h-3.5 w-3.5" />}
            {submitting ? "Posting..." : "Post Reply"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Community Discussions ──────────────────────────────────────────────────────
function CommunityDiscussions({ student }: { student: any }) {
  const [posts, setPosts]           = useState<DiscussionPost[]>([])
  const [loading, setLoading]       = useState(true)
  const [activeTag, setActiveTag]   = useState<string>("All")
  const [sort, setSort]             = useState<"latest" | "top" | "unanswered">("latest")
  const [page, setPage]             = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal]           = useState(0)

  // new post form
  const [showForm, setShowForm]     = useState(false)
  const [newTitle, setNewTitle]     = useState("")
  const [newContent, setNewContent] = useState("")
  const [newTag, setNewTag]         = useState<string>("General")
  const [posting, setPosting]       = useState(false)

  // thread view
  const [openPost, setOpenPost]     = useState<DiscussionDetail | null>(null)
  const [threadLoading, setThreadLoading] = useState(false)

  const currentUserId = student?._id?.toString() ?? ""

  const fetchPosts = async (tag = activeTag, s = sort, p = page) => {
    setLoading(true)
    try {
      const res  = await fetch(`/api/student/discussions?tag=${tag}&sort=${s}&page=${p}`)
      const data = await res.json()
      setPosts(data.posts ?? [])
      setTotalPages(data.pages ?? 1)
      setTotal(data.total ?? 0)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchPosts() }, [activeTag, sort, page])

  const openThread = async (postId: string) => {
    setThreadLoading(true)
    try {
      const res  = await fetch(`/api/student/discussions/${postId}`)
      const data = await res.json()
      if (data.post) setOpenPost(data.post)
    } finally { setThreadLoading(false) }
  }

  const submitPost = async () => {
    if (!newTitle.trim() || !newContent.trim()) return
    setPosting(true)
    try {
      const res  = await fetch("/api/student/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim(), content: newContent.trim(), tag: newTag }),
      })
      const data = await res.json()
      if (data.success) {
        setShowForm(false)
        setNewTitle(""); setNewContent(""); setNewTag("General")
        setPage(1); setActiveTag("All"); setSort("latest")
        await fetchPosts("All", "latest", 1)
      }
    } finally { setPosting(false) }
  }

  // Thread view
  if (openPost) {
    return (
      <ThreadView
        post={openPost}
        currentUserId={currentUserId}
        onBack={() => { setOpenPost(null); fetchPosts() }}
        onPostUpdate={updated => setOpenPost(updated)}
      />
    )
  }

  if (threadLoading) {
    return (
      <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground text-sm">
        <RefreshCw className="h-4 w-4 animate-spin" /> Loading...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" /> Discussions
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Ask questions, share tips, celebrate wins — {total} posts</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
          {showForm ? "Cancel" : <><Users className="h-4 w-4" /> New Post</>}
        </button>
      </div>

      {/* New Post Form */}
      {showForm && (
        <div className="rounded-2xl border border-primary/30 bg-card p-5 space-y-4">
          <p className="text-sm font-bold text-foreground">Create a Post</p>
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Title — what's this about?"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
          />
          <textarea
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            placeholder="Write your post... be specific, share context, include links if helpful."
            rows={5}
            className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
          />
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-1.5 flex-wrap">
              {ALL_TAGS.slice(1).map(tag => (
                <button key={tag} onClick={() => setNewTag(tag)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                    newTag === tag ? TAG_COLORS[tag] : "bg-transparent text-muted-foreground border-border hover:border-primary/30"
                  }`}>
                  {tag}
                </button>
              ))}
            </div>
            <button
              onClick={submitPost}
              disabled={posting || !newTitle.trim() || !newContent.trim()}
              className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-40 transition-all"
              style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
              {posting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ArrowRight className="h-3.5 w-3.5" />}
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Tag filter */}
        <div className="flex gap-1 flex-wrap">
          {ALL_TAGS.map(tag => (
            <button key={tag} onClick={() => { setActiveTag(tag); setPage(1) }}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                activeTag === tag
                  ? tag === "All" ? "bg-primary/20 text-primary border-primary/30" : TAG_COLORS[tag]
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/30"
              }`}>
              {tag}
            </button>
          ))}
        </div>
        {/* Sort */}
        <div className="ml-auto flex gap-1">
          {(["latest", "top", "unanswered"] as const).map(s => (
            <button key={s} onClick={() => { setSort(s); setPage(1) }}
              className={`text-[11px] px-2.5 py-1 rounded-full border font-medium capitalize transition-all ${
                sort === s ? "bg-primary/15 text-primary border-primary/30" : "text-muted-foreground border-border hover:text-foreground"
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Post list */}
      {loading ? (
        <div className="flex justify-center py-12"><RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-border">
          <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm font-semibold text-muted-foreground">No posts yet</p>
          <p className="text-xs text-muted-foreground mt-1 opacity-70">Be the first to start a discussion!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map(post => (
            <button key={post._id} onClick={() => openThread(post._id)}
              className="w-full text-left rounded-xl border border-border bg-card/60 hover:border-primary/30 hover:bg-card transition-all p-4 group">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-[10px] font-black mt-0.5">
                  {post.authorAvatar}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {post.pinned && <span className="text-[10px] text-amber-400">📌</span>}
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${TAG_COLORS[post.tag] ?? TAG_COLORS.General}`}>
                      {post.tag}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{post.authorName}</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">{timeAgo(post.createdAt)}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">{post.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                      </svg>
                      {post.upvoteCount}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <MessageCircle className="h-3 w-3" />{post.replyCount}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      {post.views}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-40 transition-all">
            ← Prev
          </button>
          <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-40 transition-all">
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

const RECOMMENDED_BOOKS = [
  { title: "The Pragmatic Programmer", author: "Hunt & Thomas", why: "Timeless advice on becoming a better developer. Read chapter by chapter.", url: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/", tag: "Must Read" },
  { title: "Clean Code", author: "Robert C. Martin", why: "Learn to write code that other developers can read and understand.", url: "https://www.amazon.in/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882", tag: "Code Quality" },
  { title: "Grokking Algorithms", author: "Aditya Bhargava", why: "Best visual introduction to DSA. Perfect for 1st year. Fun to read.", url: "https://www.manning.com/books/grokking-algorithms", tag: "DSA Beginner" },
  { title: "You Don't Know JS", author: "Kyle Simpson", why: "Deep dive into JavaScript. Free on GitHub. Best JS book for beginners.", url: "https://github.com/getify/You-Dont-Know-JS", tag: "Free" },
  { title: "Automate the Boring Stuff", author: "Al Sweigart", why: "Python for real tasks. Free online. Great motivation because results are instant.", url: "https://automatetheboringstuff.com/", tag: "Free + Python" },
]

const RECOMMENDED_BLOGS = [
  { name: "GeeksforGeeks", desc: "Theory + code examples for every CS topic. Your go-to reference.", url: "https://www.geeksforgeeks.org/", tag: "Reference" },
  { name: "Dev.to", desc: "Developer community — read stories, tutorials, and career advice.", url: "https://dev.to/", tag: "Community" },
  { name: "FreeCodeCamp Blog", desc: "Long-form tutorials on web dev, Python, data science — all free.", url: "https://www.freecodecamp.org/news/", tag: "Tutorials" },
  { name: "Roadmap.sh", desc: "Visual learning roadmaps for every tech role. Know what to learn next.", url: "https://roadmap.sh/", tag: "Roadmaps" },
  { name: "CS50 Discourse", desc: "CS50's community forum — ask questions, get help from thousands of learners.", url: "https://cs50.stackexchange.com/", tag: "Community" },
  { name: "The Missing Semester (MIT)", desc: "Tools every developer needs — shell, git, editors. Free MIT course.", url: "https://missing.csail.mit.edu/", tag: "Free" },
]

const TOPIC_QUIZZES: Record<string, { q: string; opts: string[]; ans: number; explain: string }[]> = {
  python: [
    { q: "What is the output of: print(type(3.14))?", opts: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'double'>"], ans: 1, explain: "3.14 is a float literal in Python." },
    { q: "Which is used to define a function in Python?", opts: ["function", "def", "func", "define"], ans: 1, explain: "'def' keyword is used to define functions in Python." },
    { q: "What does len([1,2,3]) return?", opts: ["2", "3", "4", "Error"], ans: 1, explain: "len() returns the number of items — the list has 3 items." },
    { q: "Which loop runs a set number of times?", opts: ["while", "for", "do-while", "repeat"], ans: 1, explain: "'for' loop is typically used for a known number of iterations." },
  ],
  dsa: [
    { q: "What is the time complexity of binary search?", opts: ["O(n)", "O(log n)", "O(n²)", "O(1)"], ans: 1, explain: "Binary search halves the search space each step — O(log n)." },
    { q: "Which data structure uses LIFO?", opts: ["Queue", "Stack", "Array", "Linked List"], ans: 1, explain: "Stack follows Last In First Out (LIFO) principle." },
    { q: "Which is NOT a linear data structure?", opts: ["Array", "Tree", "Queue", "Linked List"], ans: 1, explain: "Trees are hierarchical (non-linear). Others are linear." },
    { q: "What does Big O notation measure?", opts: ["Memory only", "Time only", "Worst-case performance", "Best-case performance"], ans: 2, explain: "Big O describes the worst-case time/space complexity." },
  ],
  git: [
    { q: "Which command stages files for a commit?", opts: ["git commit", "git add", "git push", "git stage"], ans: 1, explain: "'git add' moves files to the staging area." },
    { q: "What does 'git push' do?", opts: ["Download code", "Upload local commits to remote", "Create a branch", "Merge branches"], ans: 1, explain: "git push uploads your local commits to the remote repository." },
    { q: "Which command creates a new branch?", opts: ["git branch new-branch", "git create branch", "git new branch", "git checkout new"], ans: 0, explain: "'git branch <name>' creates a new branch." },
    { q: "What is a 'merge conflict'?", opts: ["Git error", "Two branches changed the same lines", "Push failure", "Missing commit"], ans: 1, explain: "Merge conflicts occur when two branches modify the same lines differently." },
  ],
}

// ── Quiz Component ────────────────────────────────────────────────────────────
function TopicQuiz({ topic, onComplete }: { topic: string; onComplete: () => void }) {
  const qs = TOPIC_QUIZZES[topic] ?? []
  const [cur, setCur] = useState(0)
  const [sel, setSel] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const q = qs[cur]
  const choose = (i: number) => { if (answered) return; setSel(i); setAnswered(true); if (i === q.ans) setScore(s => s + 1) }
  const next = () => {
    if (cur + 1 < qs.length) { setCur(c => c+1); setSel(null); setAnswered(false) }
    else { setDone(true); onComplete() }
  }

  if (!qs.length) return null
  if (done) return (
    <div className="text-center py-6 space-y-3">
      <p className="text-3xl font-black" style={{ color: score >= 3 ? "#10b981" : "#f59e0b" }}>{score}/{qs.length}</p>
      <p className="text-sm font-semibold text-foreground">{score >= 3 ? "Great job! You know this topic well." : "Good attempt! Review the explanations and try again."}</p>
      <button onClick={() => { setCur(0); setSel(null); setAnswered(false); setScore(0); setDone(false) }}
        className="text-sm text-primary hover:underline flex items-center gap-1 mx-auto">
        <RefreshCw className="h-3.5 w-3.5" /> Retry quiz
      </button>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Question {cur+1}/{qs.length}</span>
        <span className="text-primary font-semibold">Score: {score}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((cur+1)/qs.length)*100}%` }} /></div>
      <div className="rounded-xl border border-border bg-card/50 p-4">
        <p className="text-sm font-medium text-foreground">{q.q}</p>
      </div>
      <div className="space-y-2">
        {q.opts.map((opt: string, i: number) => {
          let style: React.CSSProperties = { border: "1px solid var(--border)", background: "var(--card)", cursor: "pointer" }
          if (answered) {
            if (i === q.ans) style = { border: "1px solid #10b981", background: "rgba(16,185,129,0.10)" }
            else if (i === sel) style = { border: "1px solid #ef4444", background: "rgba(239,68,68,0.10)", opacity: 0.8 }
            else style = { border: "1px solid var(--border)", background: "transparent", opacity: 0.45 }
          } else if (sel === i) style = { border: "1px solid #7c3aed", background: "rgba(124,58,237,0.12)", cursor: "pointer" }
          return (
            <button key={i} onClick={() => choose(i)} className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all" style={style}>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold bg-white/5 text-muted-foreground">{["A","B","C","D"][i]}</span>
              <span className="text-sm text-foreground">{opt}</span>
              {answered && i === q.ans && <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto shrink-0" />}
            </button>
          )
        })}
      </div>
      {answered && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">
          <p className="text-xs text-blue-400 font-semibold mb-1">Explanation</p>
          <p className="text-xs text-muted-foreground">{q.explain}</p>
        </div>
      )}
      {answered && (
        <button onClick={next} className="w-full h-10 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
          {cur+1 === qs.length ? "See Results" : "Next Question"} <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

// ── Leaderboard ───────────────────────────────────────────────────────────────
function FirstYearLeaderboard() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch first-year students ranked by XP
    fetch("/api/student/first-year-leaderboard")
      .then(r => r.ok ? r.json() : { leaderboard: [] })
      .then(d => setData(d.leaderboard ?? []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground flex items-center gap-2">
        <Users className="h-4 w-4 text-primary" />
        Only 1st-year students — friendly competition, no pressure
      </p>
      {loading ? (
        <div className="flex justify-center py-8"><RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" /></div>
      ) : data.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-sm">
          <Trophy className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p>Be the first to earn XP and appear here!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.map((e: any, i: number) => (
            <div key={e.userId} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${e.isCurrentUser ? "border-violet-500/30 bg-violet-500/5" : "border-border bg-card/30"}`}>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black"
                style={{ background: i === 0 ? "#f59e0b20" : i === 1 ? "#94a3b820" : i === 2 ? "#b45309/20" : "rgba(255,255,255,0.05)", color: i === 0 ? "#f59e0b" : i === 1 ? "#94a3b8" : i === 2 ? "#b45309" : "var(--muted-foreground)" }}>
                {i === 0 ? "1" : i === 1 ? "2" : i === 2 ? "3" : `${i+1}`}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{e.isCurrentUser ? "You" : e.userName}</p>
                <p className="text-[10px] text-muted-foreground">{e.completed} milestones · {e.streak} day streak</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-black tabular-nums" style={{ color: "#f59e0b" }}>{e.totalXP} XP</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function FirstYearFullHub({ student }: { student: any }) {
  const [activeTab, setActiveTab] = useState("progress")
  const [standaloneMode, setStandaloneMode] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "")
      const validTabs = ["progress","learning","practice","challenges","resources","soft","quizzes","community","leaderboard","library","resume"]
      if (hash && validTabs.includes(hash)) {
        setActiveTab(hash)
        // Standalone mode: hide banner + tabs, show only content
        if (hash === "learning" || hash === "resume") setStandaloneMode(true)
      }
    }
  }, [])
  const [quizTopic, setQuizTopic] = useState<string | null>(null)
  const [completedSoftSkills, setCompletedSoftSkills] = useState<string[]>([])
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([])

  // Progress state
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [completedMilestones, setCompletedMilestones] = useState<string[]>([])
  const [completedBadges, setCompletedBadges] = useState<string[]>([])
  const [completing, setCompleting] = useState<string | null>(null)
  const [dailyDone, setDailyDone] = useState(false)
  const [xpPop, setXpPop] = useState<string | null>(null)
  const [monthlySolved, setMonthlySolved] = useState(0)

  // Daily problem — rotates by day of year
  const DAILY_PROBLEMS = [
    { title: "Sum of Two Numbers",          desc: "Write a program that takes two numbers as input and prints their sum.", input: "5, 3", output: "8", explain: "Simply add the two numbers.", url: "https://leetcode.com/problems/two-sum/" },
    { title: "Reverse a String",            desc: "Write a function to reverse a given string without using built-in reverse.", input: '"hello"', output: '"olleh"', explain: "Use a loop from end to start.", url: "https://leetcode.com/problems/reverse-string/" },
    { title: "Find Maximum in Array",       desc: "Given an array of integers, find and return the largest element.", input: "[3, 7, 1, 9, 4]", output: "9", explain: "Iterate and track the max.", url: "https://leetcode.com/problems/find-maximum-in-array/" },
    { title: "Count Vowels",                desc: "Count the number of vowels (a, e, i, o, u) in a given string.", input: '"education"', output: "5", explain: "Check each character against vowels.", url: "https://leetcode.com/problems/count-vowel-substrings-of-a-string/" },
    { title: "Check Palindrome",            desc: "Determine if a given string reads the same forwards and backwards.", input: '"racecar"', output: "true", explain: "Compare string with its reverse.", url: "https://leetcode.com/problems/valid-palindrome/" },
    { title: "FizzBuzz",                    desc: "Print numbers 1 to N. For multiples of 3 print Fizz, for 5 print Buzz, for both print FizzBuzz.", input: "15", output: "1 2 Fizz 4 Buzz ... FizzBuzz", explain: "Use modulo % operator.", url: "https://leetcode.com/problems/fizz-buzz/" },
    { title: "Sum of Digits",               desc: "Given a number, compute the sum of its digits.", input: "1234", output: "10", explain: "Extract each digit using % and / operators.", url: "https://leetcode.com/problems/add-digits/" },
    { title: "Check Even or Odd",           desc: "Write a function that returns 'Even' if a number is even, 'Odd' otherwise.", input: "7", output: '"Odd"', explain: "A number is even if n % 2 === 0.", url: "https://leetcode.com/problems/number-of-even-and-odd-bits/" },
    { title: "Find Second Largest",         desc: "Find the second largest number in an array of integers.", input: "[4, 1, 7, 3, 9]", output: "7", explain: "Sort or use two variables to track top two.", url: "https://leetcode.com/problems/second-largest-digit-in-a-string/" },
    { title: "Count Occurrences",           desc: "Count how many times a given character appears in a string.", input: '"banana", "a"', output: "3", explain: "Loop through string and count matches.", url: "https://leetcode.com/problems/count-occurrences-in-text/" },
    { title: "Factorial of a Number",       desc: "Calculate the factorial of a given non-negative integer N.", input: "5", output: "120", explain: "Multiply N * (N-1) * ... * 1. Base case: 0! = 1.", url: "https://leetcode.com/problems/n-th-tribonacci-number/" },
    { title: "Print Fibonacci Sequence",    desc: "Print the first N numbers of the Fibonacci sequence.", input: "7", output: "0 1 1 2 3 5 8", explain: "Each number = sum of previous two.", url: "https://leetcode.com/problems/fibonacci-number/" },
    { title: "Check Prime Number",          desc: "Write a program to check if a given number is prime.", input: "17", output: "true", explain: "Check divisibility from 2 to sqrt(n).", url: "https://leetcode.com/problems/count-primes/" },
    { title: "Remove Duplicates from Array",desc: "Given an array, return a new array with all duplicate values removed.", input: "[1,2,2,3,3,4]", output: "[1,2,3,4]", explain: "Use a Set or check if element already seen.", url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/" },
    { title: "Swap Two Variables",          desc: "Swap two variables without using a third temporary variable.", input: "a=5, b=10", output: "a=10, b=5", explain: "Use arithmetic: a=a+b; b=a-b; a=a-b.", url: "https://leetcode.com/problems/swap-nodes-in-pairs/" },
    { title: "Linear Search",              desc: "Implement linear search: find the index of a target in an array.", input: "[4,2,8,1], target=8", output: "2", explain: "Iterate and check each element.", url: "https://leetcode.com/problems/search-insert-position/" },
    { title: "Reverse an Array",           desc: "Reverse the elements of an array in place.", input: "[1,2,3,4,5]", output: "[5,4,3,2,1]", explain: "Use two pointers from both ends.", url: "https://leetcode.com/problems/reverse-string/" },
    { title: "Sum of Array Elements",      desc: "Calculate the sum of all elements in an integer array.", input: "[1,2,3,4,5]", output: "15", explain: "Iterate with a running total variable.", url: "https://leetcode.com/problems/running-sum-of-1d-array/" },
    { title: "Count Words in a String",    desc: "Count the number of words in a given sentence.", input: '"Hello World Today"', output: "3", explain: "Split the string by spaces.", url: "https://leetcode.com/problems/number-of-words-in-a-sentence/" },
    { title: "Find GCD of Two Numbers",    desc: "Find the Greatest Common Divisor (GCD) of two integers.", input: "12, 8", output: "4", explain: "Use Euclidean algorithm: gcd(a,b) = gcd(b, a%b).", url: "https://leetcode.com/problems/find-greatest-common-divisor-of-array/" },
    { title: "Matrix Diagonal Sum",        desc: "Find the sum of both diagonals of an N×N matrix.", input: "[[1,2,3],[4,5,6],[7,8,9]]", output: "25", explain: "Add matrix[i][i] and matrix[i][n-1-i].", url: "https://leetcode.com/problems/matrix-diagonal-sum/" },
    { title: "Check Armstrong Number",     desc: "Check if a number is an Armstrong number (sum of digits^n = number).", input: "153", output: "true", explain: "153 = 1³ + 5³ + 3³ = 153.", url: "https://leetcode.com/problems/sum-of-digits-in-base-k/" },
    { title: "Binary to Decimal",          desc: "Convert a binary number (string) to its decimal equivalent.", input: '"1010"', output: "10", explain: "Multiply each bit by 2^position from right.", url: "https://leetcode.com/problems/convert-binary-number-in-a-linked-list-to-integer/" },
    { title: "Find Missing Number",        desc: "Given array 0 to N with one missing, find the missing number.", input: "[0,1,3,4]", output: "2", explain: "Sum 0..N = N*(N+1)/2. Subtract array sum.", url: "https://leetcode.com/problems/missing-number/" },
    { title: "Bubble Sort",                desc: "Implement bubble sort to sort an array of integers in ascending order.", input: "[64,34,25,12,22]", output: "[12,22,25,34,64]", explain: "Repeatedly swap adjacent elements if in wrong order.", url: "https://leetcode.com/problems/sort-an-array/" },
    { title: "Count Negative Numbers",     desc: "Count all negative numbers in a 2D grid.", input: "[[4,3,2],[1,-1,-2],[-3,-4,-5]]", output: "5", explain: "Iterate all elements, count where val < 0.", url: "https://leetcode.com/problems/count-negative-numbers-in-a-sorted-matrix/" },
    { title: "Power of Two",               desc: "Determine if a given integer is a power of two.", input: "16", output: "true", explain: "A power of 2 has only one bit set: n & (n-1) === 0.", url: "https://leetcode.com/problems/power-of-two/" },
    { title: "Reverse Words in a String",  desc: "Reverse the order of words in a sentence.", input: '"the sky is blue"', output: '"blue is sky the"', explain: "Split by space, reverse array, join.", url: "https://leetcode.com/problems/reverse-words-in-a-string/" },
    { title: "Find Duplicate Number",      desc: "Find the one duplicate number in an array containing n+1 integers in range [1,n].", input: "[1,3,4,2,2]", output: "2", explain: "Use a Set: first number seen twice is the answer.", url: "https://leetcode.com/problems/find-the-duplicate-number/" },
    { title: "Celsius to Fahrenheit",      desc: "Convert a temperature from Celsius to Fahrenheit.", input: "100", output: "212", explain: "Formula: F = C × 9/5 + 32.", url: "https://leetcode.com/problems/convert-the-temperature/" },
  ]

  // Compute once on mount so the problem never changes mid-session / between tab switches
  const [todayProblem] = useState(() => {
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 0)
    const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000)
    return DAILY_PROBLEMS[dayOfYear % DAILY_PROBLEMS.length]
  })

  const ROADMAP_STEPS = [
    { id: "py-basics",    title: "Learn Programming Basics",  color: "#3b82f6", xp: 50  },
    { id: "git-basics",   title: "Master Git & GitHub",       color: "#10b981", xp: 30  },
    { id: "web-basics",   title: "Web Dev Intro",             color: "#f59e0b", xp: 50  },
    { id: "arrays",       title: "DSA: Arrays & Strings",     color: "#8b5cf6", xp: 60  },
    { id: "lc-10",        title: "Solve 10 Easy Problems",    color: "#ef4444", xp: 100 },
    { id: "dsa-track",    title: "Start a DSA Course",        color: "#6366f1", xp: 40  },
    { id: "lc-25",        title: "Reach 25 Problems",         color: "#f59e0b", xp: 150 },
    { id: "project-1",    title: "Build Your First Project",  color: "#10b981", xp: 120 },
  ]

  useEffect(() => {
    fetch("/api/student/first-year-progress")
      .then(r => r.ok ? r.json() : { progress: null })
      .then(d => {
        if (d.progress) {
          setXp(d.progress.totalXP ?? 0)
          setStreak(d.progress.streak ?? 0)
          setCompletedMilestones(d.progress.completed ?? [])
          setMonthlySolved(d.progress.monthlyChallengesSolved ?? 0)
        }
        if (d.completedBadges) setCompletedBadges(d.completedBadges)
        if (d.badgeProgress)   setBadgeProgress(d.badgeProgress)
        if (d.completedChallenges) setCompletedChallenges(d.completedChallenges)
        // Toast for any badges auto-awarded this session
        if (d.newlyAwarded?.length) {
          d.newlyAwarded.forEach((id: string, i: number) => {
            const titles: Record<string, string> = {
              "badge-array-1":"Array Starter","badge-array-2":"Array Pro","badge-array-3":"Array Master",
              "badge-algo-1":"Loop Learner","badge-algo-2":"Loop Master","badge-algo-3":"Algorithm Ace",
              "badge-str-1":"String Starter","badge-str-2":"String Wizard","badge-str-3":"String Legend",
              "badge-git-1":"Git Starter","badge-git-2":"Git Committer","badge-git-3":"Open Source Hero",
              "badge-tree-1":"Tree Sprout","badge-tree-2":"Tree Climber","badge-tree-3":"Tree Expert",
              "badge-dp-1":"DP Initiate","badge-dp-2":"DP Practitioner","badge-dp-3":"DP Master",
              "badge-graph-1":"Graph Walker","badge-graph-2":"Graph Traverser","badge-graph-3":"Graph Master",
              "badge-sql-1":"SQL Beginner","badge-sql-2":"SQL Writer","badge-sql-3":"SQL Expert",
              "badge-bin-1":"Binary Initiate","badge-bin-2":"Binary Searcher","badge-bin-3":"Binary Expert",
              "badge-sort-1":"Sort Learner","badge-sort-2":"Sort Pro","badge-sort-3":"Sort Master",
              "badge-rec-1":"Recursion Starter","badge-rec-2":"Recursion Pro","badge-rec-3":"Recursion Master",
              "badge-hash-1":"Hash Beginner","badge-hash-2":"Hash Builder","badge-hash-3":"Hash Master",
            }
            setTimeout(() => showXpPop(`🏆 ${titles[id] ?? id} badge earned!`), i * 2800)
          })
        }
      })
  }, [])

  const level = xp < 100 ? { name: "Seedling", icon: <Zap className="h-4 w-4 text-emerald-400" />, next: 100, color: "#10b981" }
    : xp < 300 ? { name: "Explorer", icon: <Target className="h-4 w-4 text-blue-400" />,   next: 300, color: "#3b82f6" }
    : xp < 600 ? { name: "Builder",  icon: <Code2 className="h-4 w-4 text-violet-400" />,  next: 600, color: "#8b5cf6" }
    : xp < 1000 ? { name: "Coder",   icon: <Star className="h-4 w-4 text-amber-400" />,    next: 1000, color: "#f59e0b" }
    : { name: "Developer", icon: <Trophy className="h-4 w-4 text-primary" />, next: 9999, color: "#7c3aed" }
  const levelPct = Math.min(Math.round((xp / level.next) * 100), 100)

  const showXpPop = (msg: string) => { setXpPop(msg); setTimeout(() => setXpPop(null), 2500) }

  const completeMilestone = async (id: string) => {
    if (completedMilestones.includes(id)) return
    setCompleting(id)
    try {
      const res = await fetch("/api/student/first-year-progress", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete-milestone", milestoneId: id }),
      })
      const data = await res.json()
      if (data.success) {
        setCompletedMilestones(p => [...p, id])
        setXp(data.newTotal)
        setStreak(data.newStreak)
        showXpPop(`+${data.xpGained} XP`)
      }
    } finally { setCompleting(null) }
  }

  const [badgeProgress, setBadgeProgress] = useState<Record<string, { current: number; required: number }>>({})
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([])
  const [completingChallenge, setCompletingChallenge] = useState<string | null>(null)
  const [newChallenge, setNewChallenge] = useState<string | null>(null)

  // Flat project pool (beginner → advanced, 16 total)
  const PROJECT_POOL = [
    { id:"p1-calc",      title:"Build a Calculator",       desc:"Handles +, -, ×, ÷ with keyboard input.",                    badge:"Beginner",     color:"#3b82f6", url:"https://leetcode.com/problems/basic-calculator/" },
    { id:"p1-attend",    title:"Attendance Tracker",       desc:"Flags students below 75% attendance.",                       badge:"Beginner",     color:"#10b981", url:"https://leetcode.com/problems/design-parking-system/" },
    { id:"p1-portfolio", title:"Personal Portfolio Page",  desc:"Your name, skills, and a project section.",                  badge:"Beginner",     color:"#ec4899", url:"https://www.frontendmentor.io/challenges/personal-portfolio-webpage-449TFEOrBO" },
    { id:"p1-todo",      title:"Basic To-Do App",          desc:"Add, complete, and delete tasks.",                           badge:"Beginner",     color:"#f97316", url:"https://leetcode.com/problems/design-hashmap/" },
    { id:"p1-weather",   title:"Weather Fetcher",          desc:"Use an API to display temperature for any city.",            badge:"Beginner",     color:"#f59e0b", url:"https://open-meteo.com/en/docs" },
    { id:"p1-chatbot",   title:"Simple Rule-based Chatbot",desc:"Replies to greetings, questions, and goodbyes.",             badge:"Beginner",     color:"#8b5cf6", url:"https://leetcode.com/problems/design-hashmap/" },
    { id:"p2-quiz",      title:"Quiz App",                 desc:"Multi-question quiz with score tracking and timer.",         badge:"Intermediate", color:"#3b82f6", url:"https://www.frontendmentor.io/challenges/quiz-app-suIoV2SOt" },
    { id:"p2-expense",   title:"Expense Tracker",          desc:"Track income/expenses with category breakdown charts.",      badge:"Intermediate", color:"#10b981", url:"https://www.frontendmentor.io/challenges/personal-finance-app-JfjtZgyMt1" },
    { id:"p2-markdown",  title:"Markdown Previewer",       desc:"Real-time markdown editor with live HTML preview.",          badge:"Intermediate", color:"#8b5cf6", url:"https://www.frontendmentor.io/challenges/markdown-previewer-QJD0MBNft" },
    { id:"p2-github",    title:"GitHub Profile Viewer",    desc:"Search any GitHub user and display their repos and stats.",  badge:"Intermediate", color:"#f59e0b", url:"https://www.frontendmentor.io/challenges/github-user-search-app-Q09YOgaH6" },
    { id:"p2-pomodoro",  title:"Pomodoro Timer",           desc:"25/5 work-break cycle with settings and sound.",             badge:"Intermediate", color:"#ef4444", url:"https://www.frontendmentor.io/challenges/pomodoro-app-KBFnycJ6G" },
    { id:"p2-blog",      title:"Blog with CMS",            desc:"Simple blog with CRUD posts stored in localStorage.",       badge:"Intermediate", color:"#f97316", url:"https://www.frontendmentor.io/challenges/blogr-landing-page-1HHp6YjAzq" },
    { id:"p3-chat",      title:"Real-time Chat App",       desc:"WebSocket-based chat with rooms and online presence.",       badge:"Advanced",     color:"#8b5cf6", url:"https://socket.io/get-started/chat" },
    { id:"p3-ecommerce", title:"E-Commerce Store",         desc:"Product listings, cart, checkout, and order history.",       badge:"Advanced",     color:"#3b82f6", url:"https://www.frontendmentor.io/challenges/ecommerce-product-page-UPsZ9MFp_" },
    { id:"p3-dashboard", title:"Analytics Dashboard",      desc:"Charts, KPI cards, and date-filtered data from an API.",     badge:"Advanced",     color:"#10b981", url:"https://www.frontendmentor.io/challenges/entertainment-web-app-J-UhgAW1X" },
    { id:"p3-auth",      title:"Auth System",              desc:"JWT login/signup with protected routes and refresh tokens.", badge:"Advanced",     color:"#f59e0b", url:"https://www.freecodecamp.org/news/how-to-implement-jwt-authentication/" },
  ]

  // Flat debug pool (easy → hard, 15 total for sustained replacement)
  const DEBUG_POOL = [
    { id:"d1-loop",    title:"Fix the Loop Bug",       desc:"Should print 1–10 but prints 0–9. Find the off-by-one error.",      badge:"Beginner",     color:"#ef4444", snippet:"for i in range(0,10):\n  print(i)",                          fix:"range(1,11)",                         url:"https://leetcode.com/problems/find-the-difference/" },
    { id:"d1-predict", title:"Output Prediction",      desc:"What does this print? Think before you run.",                        badge:"Beginner",     color:"#f59e0b", snippet:'if 0:\n  print("A")\nelse:\n  print("B")',                   fix:'"B" — 0 is falsy',                    url:"https://leetcode.com/problems/find-the-difference/" },
    { id:"d1-null",    title:"Null Pointer Trap",       desc:"This code crashes. Identify why and write the fix.",                badge:"Beginner",     color:"#8b5cf6", snippet:"arr = None\nprint(arr[0])",                                  fix:"Check arr is not None first",         url:"https://leetcode.com/problems/find-the-difference/" },
    { id:"d2-recur",   title:"Infinite Recursion",     desc:"This function never stops. Add the missing base case.",              badge:"Intermediate", color:"#ef4444", snippet:"def factorial(n):\n  return n * factorial(n-1)",              fix:"if n == 0: return 1",                 url:"https://leetcode.com/problems/climbing-stairs/" },
    { id:"d2-type",    title:"Type Error Crash",        desc:"Find why this code throws a TypeError at runtime.",                  badge:"Intermediate", color:"#f59e0b", snippet:'print("Age: " + 25)',                                       fix:"str(25) — can't concat str + int",    url:"https://leetcode.com/problems/find-the-difference/" },
    { id:"d2-scope",   title:"Variable Scope Bug",      desc:"The function always prints 0. Explain and fix it.",                 badge:"Intermediate", color:"#8b5cf6", snippet:"x = 10\ndef show():\n  x = 0\n  print(x)\nshow()",           fix:"Use global x or pass x as param",     url:"https://leetcode.com/problems/find-the-difference/" },
    { id:"d3-async",   title:"Race Condition",          desc:"Two async calls run in wrong order. Fix the sequencing.",           badge:"Advanced",     color:"#ef4444", snippet:"fetch(A).then(() => fetch(B))\nfetch(C)",                    fix:"Use Promise.all or await chain",      url:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all" },
    { id:"d3-mem",     title:"Memory Leak",             desc:"Event listeners are added but never removed. Fix it.",               badge:"Advanced",     color:"#f59e0b", snippet:"btn.addEventListener('click', handler)",                     fix:"removeEventListener on cleanup",      url:"https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener" },
    { id:"d3-sql",     title:"SQL Injection",           desc:"This query is vulnerable. Rewrite it safely.",                      badge:"Advanced",     color:"#8b5cf6", snippet:'f"SELECT * WHERE id={input}"',                              fix:"Use parameterized queries",           url:"https://owasp.org/www-community/attacks/SQL_Injection" },
    { id:"d4-index",   title:"Off-by-One Index",        desc:"This crashes on the last element. Why?",                            badge:"Beginner",     color:"#3b82f6", snippet:"arr = [1,2,3]\nfor i in range(len(arr)+1):\n  print(arr[i])", fix:"range(len(arr)) not len(arr)+1",     url:"https://leetcode.com/problems/maximum-subarray/" },
    { id:"d4-mutate",  title:"List Mutation Bug",       desc:"The original list is being modified. Prevent it.",                  badge:"Intermediate", color:"#10b981", snippet:"a = [1,2,3]\nb = a\nb.append(4)\nprint(a)",                 fix:"Use b = a.copy() or b = list(a)",    url:"https://leetcode.com/problems/copy-list-with-random-pointer/" },
    { id:"d4-float",   title:"Float Precision Error",   desc:"Why is 0.1 + 0.2 not equal to 0.3?",                               badge:"Intermediate", color:"#f97316", snippet:"print(0.1 + 0.2 == 0.3)",                                   fix:"Use round() or decimal module",      url:"https://docs.python.org/3/library/decimal.html" },
    { id:"d5-closure", title:"Closure in Loop Bug",     desc:"All buttons alert the same number. Why?",                          badge:"Advanced",     color:"#8b5cf6", snippet:"for i in range(3):\n  btn.onclick = lambda: print(i)",       fix:"Use default arg: lambda i=i: print(i)", url:"https://leetcode.com/problems/find-the-difference/" },
    { id:"d5-mutable", title:"Mutable Default Arg",     desc:"Each call adds to the same list. This is a Python footgun.",       badge:"Advanced",     color:"#ec4899", snippet:"def add(x, lst=[]):\n  lst.append(x)\n  return lst",        fix:"Use lst=None and set inside",        url:"https://docs.python.org/3/faq/programming.html" },
    { id:"d5-bigO",    title:"O(n²) Trap",              desc:"This nested loop is too slow for large inputs. Optimise it.",       badge:"Advanced",     color:"#f59e0b", snippet:"for i in arr:\n  for j in arr:\n    if i+j==target: ...",    fix:"Use a hash set for O(n) lookup",     url:"https://leetcode.com/problems/two-sum/" },
  ]

  const markChallengeDone = async (id: string) => {
    if (completedChallenges.includes(id) || completingChallenge) return
    setCompletingChallenge(id)
    try {
      const res  = await fetch("/api/student/first-year-progress", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete-challenge", challengeId: id }),
      })
      const data = await res.json()
      if (data.success) {
        const updatedDone = [...completedChallenges, id]
        setCompletedChallenges(updatedDone)
        setXp(data.newTotal)
        showXpPop("+20 XP")
        // Find the replacement that will slide in
        const isProject = PROJECT_POOL.some(c => c.id === id)
        const pool = isProject ? PROJECT_POOL : DEBUG_POOL
        const visibleBefore = pool.filter(c => !completedChallenges.includes(c.id)).slice(0, isProject ? 6 : 3)
        const replacement = pool.find(c => !updatedDone.includes(c.id) && !visibleBefore.some(v => v.id === c.id && v.id !== id))
        if (replacement) {
          setNewChallenge(replacement.id)
          setTimeout(() => setNewChallenge(null), 2000)
        }
      }
    } finally { setCompletingChallenge(null) }
  }

  const doDailyChallenge = async () => {
    const res = await fetch("/api/student/first-year-progress", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "daily-challenge" }),
    })
    const data = await res.json()
    if (data.alreadyDone) { setDailyDone(true); return }
    if (data.success) {
      setStreak(data.newStreak); setXp(data.totalXP)
      setMonthlySolved(m => m + 1); setDailyDone(true)
      showXpPop("+10 XP")
    }
  }

  const TABS = [
    { id: "progress",    label: "My Progress",  icon: <TrendingUp className="h-4 w-4" /> },
    { id: "practice",    label: "Practice",     icon: <Target className="h-4 w-4" /> },
    { id: "challenges",  label: "Challenges",   icon: <Code2 className="h-4 w-4" /> },
    { id: "soft",        label: "Soft Skills",  icon: <MessageCircle className="h-4 w-4" /> },
    { id: "community",   label: "Community",    icon: <Users className="h-4 w-4" /> },
  ]

  return (
    <div className="flex-1 p-4 md:p-6 max-w-screen-xl mx-auto w-full space-y-5">
      {/* Header — hidden in standalone mode */}
      {!standaloneMode && (
      <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-600/15 via-cyan-600/5 to-transparent p-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 shrink-0">
            <BookOpen className="h-5 w-5 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground">1st Year Learning Hub</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Build your foundation · No pressure · Just growth</p>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-xl border border-blue-500/20 bg-blue-500/10 shrink-0">
            <span className="text-xs text-blue-400 font-semibold">Year 1</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">Grad {student.graduationYear}</span>
          </div>
        </div>
      </div>
      )}

      {/* Tabs — hidden in standalone mode */}
      {!standaloneMode && (
      <div className="flex gap-2 flex-wrap">
        {TABS.map(t => (
          t.id === "practice" ? (
            <a key={t.id} href="/student/prep"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              style={{ background: "transparent", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}>
              {t.icon}{t.label}
            </a>
          ) : (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              style={activeTab === t.id
                ? { background: "rgba(124,58,237,0.20)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.35)" }
                : { background: "transparent", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}>
              {t.icon}{t.label}
            </button>
          )
        ))}
      </div>
      )}

      {/* XP pop toast */}
      {xpPop && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-500/30 bg-amber-500/20 text-amber-400 font-bold text-sm shadow-xl animate-bounce">
          <Zap className="h-4 w-4" />{xpPop}
        </div>
      )}

      {/* My Progress tab — dashboard layout */}
      {activeTab === "progress" && (
        <div className="space-y-5">
          {/* Welcome */}
          <div>
            <h2 className="text-2xl font-black text-foreground">Welcome back, {student.name?.split(" ")[0] ?? "Student"}!</h2>
            <p className="text-sm text-muted-foreground mt-0.5">You're on the right path. Keep going!</p>
          </div>

          {/* 4 stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Current Streak",   value: streak,                     sub: streak === 0 ? "Start today" : `${streak} days strong`,       color: "#10b981" },
              { label: "Problems Solved",  value: completedMilestones.filter(id => id.startsWith("lc")).length, sub: `+${monthlySolved} this month`, color: "#3b82f6" },
              { label: "Badges Earned",    value: Math.floor(xp / 100),       sub: `${Math.max(0, 6 - Math.floor(xp / 100))} to go`,             color: "#f59e0b" },
              { label: "Total Points",     value: xp,                         sub: "Points earned",                                               color: "#8b5cf6" },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-border bg-card/50 p-4 flex flex-col gap-1">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-3xl font-black tabular-nums" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Main 2-col layout */}
          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            {/* LEFT column */}
            <div className="space-y-4">
              {/* Today's Challenge */}
              <div className="rounded-xl border border-border bg-card/50 p-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <p className="font-bold text-foreground">Today's Challenge</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/20">Easy</span>
                    <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString("en-US", { weekday: "long" })}</span>
                  </div>
                </div>
                <div>
                  <p className="text-base font-black text-foreground">{todayProblem.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{todayProblem.desc}</p>
                </div>
                <div className="rounded-lg border border-border bg-black/20 p-3 text-xs font-mono space-y-1">
                  <p className="font-semibold text-muted-foreground text-[10px] mb-2">Example</p>
                  <p><span className="text-blue-400">Input:</span> <span className="text-foreground">{todayProblem.input}</span></p>
                  <p><span className="text-emerald-400">Output:</span> <span className="text-foreground">{todayProblem.output}</span></p>
                  <p className="text-muted-foreground pt-1 text-[10px]">{todayProblem.explain}</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">Earn <span className="text-primary font-bold">10 points</span> · self-report when solved</p>
                  {dailyDone ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-semibold">
                      <CheckCircle2 className="h-4 w-4" /> Done today! +10 XP
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-wrap">
                      <a href={todayProblem.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm border border-border text-foreground hover:border-primary/40 transition-all">
                        <ArrowRight className="h-4 w-4" /> Try Problem
                      </a>
                      <button onClick={doDailyChallenge}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm text-white transition-all"
                        style={{ background: "linear-gradient(135deg,#3b82f6,#2563eb)" }}>
                        <CheckCircle2 className="h-4 w-4" /> Mark as Solved
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Your Progress */}
              <div className="rounded-xl border border-border bg-card/50 p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-primary/40 border-2 border-primary" />
                  <div>
                    <p className="font-bold text-foreground text-sm">Your Progress</p>
                    <p className="text-[10px] text-muted-foreground">
                      {level.name} · Week {Math.ceil((completedMilestones.length + 1) / 2)} : Fundamentals
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Challenge Progress</span>
                    <span className="font-semibold text-foreground">{completedMilestones.length} / {ROADMAP_STEPS.length}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.round((completedMilestones.length / ROADMAP_STEPS.length) * 100)}%`, background: "linear-gradient(90deg,#7c3aed,#10b981)" }} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">This Week's Topics</p>
                  {ROADMAP_STEPS.filter(s => !completedMilestones.includes(s.id)).slice(0, 3).map(step => (
                    <div key={step.id} className="flex items-center justify-between gap-3 py-1.5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full shrink-0" style={{ background: step.color }} />
                        <p className="text-xs text-muted-foreground">{step.title}</p>
                      </div>
                      <button onClick={() => completeMilestone(step.id)} disabled={completing === step.id}
                        className="text-[10px] px-2 py-0.5 rounded-lg border border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-all">
                        {completing === step.id ? "..." : "Mark Done"}
                      </button>
                    </div>
                  ))}
                  {ROADMAP_STEPS.filter(s => !completedMilestones.includes(s.id)).length === 0 && (
                    <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> All milestones complete!
                    </p>
                  )}
                </div>
              </div>

              {/* Recommended Resources */}
              <div className="rounded-xl border border-border bg-card/50 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <BookMarked className="h-4 w-4 text-primary" />
                  <p className="font-bold text-foreground text-sm">Recommended Resources</p>
                </div>
                {[
                  { title: "CS50's Introduction to Computer Science", desc: "Harvard's legendary intro course — perfect for beginners", tag: "Video", duration: "Ongoing", url: "https://cs50.harvard.edu/x/" },
                  { title: "freeCodeCamp Python Tutorial", desc: "Comprehensive Python course — 4+ hours of content", tag: "Video", duration: "4 hours", url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/" },
                  { title: "Git & GitHub Basics", desc: "A beginner-friendly introduction to version control and GitHub", tag: "Guide", duration: "15 min read", url: "https://skills.github.com/" },
                ].map(r => (
                  <div key={r.title} className="flex items-start justify-between gap-3 p-3 rounded-lg border border-border/50 hover:border-border transition-all">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground">{r.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{r.desc}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 font-semibold">{r.tag}</span>
                        <span className="text-[10px] text-muted-foreground">{r.duration}</span>
                      </div>
                    </div>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ))}
                <button onClick={() => setActiveTab("resources")}
                  className="w-full py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
                  View All Resources
                </button>
              </div>
            </div>

            {/* RIGHT column */}
            <div className="space-y-4">
              {/* Streak card */}
              <div className="rounded-xl border border-border bg-card/50 p-5 text-center space-y-2">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Flame className="h-4 w-4 text-amber-400" />
                  <p className="font-bold text-foreground text-sm">Streak</p>
                </div>
                <p className="text-5xl font-black tabular-nums text-amber-400">{streak}</p>
                <p className="text-xs text-muted-foreground">days</p>
                <p className="text-xs font-semibold text-foreground">{streak === 0 ? "Solve today's problem to start!" : streak === 1 ? "Great start! Come back tomorrow." : `${streak} day streak — keep it up!`}</p>
                <div className="rounded-lg bg-amber-500/5 border border-amber-500/15 p-2 mt-2">
                  <p className="text-[10px] text-amber-400">
                    {dailyDone ? "Today's problem solved!" : "Solve today's problem to extend your streak"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{Math.max(0, 30 - streak)} days to 30-day badge</p>
                </div>
              </div>

              {/* Recent Badges */}
              <div className="rounded-xl border border-border bg-card/50 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  <p className="font-bold text-foreground text-sm">Recent Badges</p>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "First",     color: "#ef4444", earned: xp > 0,    icon: <Star className="h-5 w-5" /> },
                    { label: "Week",      color: "#f59e0b", earned: streak >= 7, icon: <Flame className="h-5 w-5" /> },
                    { label: "Fortnight", color: "#10b981", earned: streak >= 14, icon: <Trophy className="h-5 w-5" /> },
                    { label: "Legend",    color: "#8b5cf6", earned: xp >= 500,  icon: <Zap className="h-5 w-5" /> },
                  ].map(b => (
                    <div key={b.label} className="flex flex-col items-center gap-1">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${b.earned ? "" : "opacity-25 grayscale"}`}
                        style={{ background: `${b.color}20`, border: `1px solid ${b.color}40`, color: b.color }}>
                        {b.icon}
                      </div>
                      <p className="text-[9px] text-muted-foreground">{b.label}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveTab("leaderboard")}
                  className="w-full py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">
                  View All Badges
                </button>
              </div>

              {/* Quick Actions */}
              <div className="rounded-xl border border-border bg-card/50 p-5 space-y-2">
                <p className="font-bold text-foreground text-sm mb-3">Quick Actions</p>
                {[
                  { label: "View All Challenges", tab: "challenges", icon: <Code2 className="h-3.5 w-3.5" /> },
                  { label: "Learning Roadmap",    tab: "progress",   icon: <Target className="h-3.5 w-3.5" /> },
                  { label: "Community",           tab: "community",  icon: <Users className="h-3.5 w-3.5" /> },
                ].map(a => (
                  <button key={a.label} onClick={() => setActiveTab(a.tab)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all text-left">
                    {a.icon}{a.label}
                  </button>
                ))}
              </div>

              {/* Did you know */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <p className="text-xs font-bold text-foreground mb-1">Did you know?</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Students who maintain a 7-day streak are 3x more likely to build lasting coding habits!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Learning Paths */}
      {activeTab === "learning" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Step-by-step learning paths with YouTube videos, courses, and cheatsheets for each topic.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Programming Basics — C", desc: "Variables, loops, functions, pointers, memory management", tags: ["C", "Beginner"], links: [
                { text: "GFG C Course", url: "https://www.geeksforgeeks.org/c-programming-language/", type: "course" },
                { text: "CS50x Harvard", url: "https://cs50.harvard.edu/x/2024/", type: "course" },
                { text: "Jenny's C Lectures", url: "https://www.youtube.com/playlist?list=PLdo5W4Nhv31a8UcMN9-35ghv8qyFWD9_S", type: "youtube" },
                { text: "C Cheatsheet", url: "https://www.geeksforgeeks.org/c-cheatsheet/", type: "notes" },
              ]},
              { label: "Programming Basics — Python", desc: "Syntax, OOP, data types, file handling, libraries", tags: ["Python", "Beginner"], links: [
                { text: "Python.org Tutorial", url: "https://docs.python.org/3/tutorial/", type: "course" },
                { text: "freeCodeCamp Python", url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/", type: "course" },
                { text: "Python Full Course", url: "https://www.youtube.com/watch?v=t8pPdKYpowI", type: "youtube" },
                { text: "Python Cheatsheet", url: "https://www.pythoncheatsheet.org/", type: "notes" },
              ]},
              { label: "DSA Beginner Track", desc: "Arrays, Strings, Linked Lists, Stacks, Recursion", tags: ["Arrays", "DSA"], links: [
                { text: "GFG DSA Self-Paced", url: "https://www.geeksforgeeks.org/courses/dsa-self-paced", type: "course" },
                { text: "Abdul Bari Algorithms", url: "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O", type: "youtube" },
                { text: "Striver DSA Sheet", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz", type: "youtube" },
                { text: "DSA Cheatsheet GFG", url: "https://www.geeksforgeeks.org/top-algorithms-and-data-structures-for-competitive-programming/", type: "notes" },
              ]},
              { label: "Web Dev Basics", desc: "HTML, CSS, JavaScript — build your first webpage", tags: ["HTML", "CSS", "JS"], links: [
                { text: "freeCodeCamp Web", url: "https://www.freecodecamp.org/learn/responsive-web-design/", type: "course" },
                { text: "The Odin Project", url: "https://www.theodinproject.com/", type: "course" },
                { text: "Traversy HTML/CSS", url: "https://www.youtube.com/watch?v=UB1O30fR-EE", type: "youtube" },
                { text: "HTML Cheatsheet", url: "https://htmlcheatsheet.com/", type: "notes" },
              ]},
              { label: "Git & GitHub", desc: "Version control, branching, pull requests — essential skill", tags: ["Git", "GitHub"], links: [
                { text: "Git Handbook", url: "https://guides.github.com/introduction/git-handbook/", type: "course" },
                { text: "Git Crash Course", url: "https://www.youtube.com/watch?v=RGOj5yH7evk", type: "youtube" },
                { text: "Kunal Kushwaha Git", url: "https://www.youtube.com/watch?v=apGV9Kg7ics", type: "youtube" },
                { text: "Git Cheatsheet", url: "https://training.github.com/downloads/github-git-cheat-sheet.pdf", type: "notes" },
              ]},
              { label: "CS50 — Intro to CS", desc: "Harvard's legendary free CS course — highly recommended", tags: ["CS Fundamentals"], links: [
                { text: "CS50x (Free)", url: "https://cs50.harvard.edu/x/2024/", type: "course" },
                { text: "CS50 Lecture 0", url: "https://www.youtube.com/watch?v=3LPJfIKxwWc", type: "youtube" },
                { text: "CS50 Playlist", url: "https://www.youtube.com/playlist?list=PLhQjrBD2T381WAHyx1pq-sBfykqMBI7V4", type: "youtube" },
                { text: "CS50 Notes", url: "https://cs50.ai/", type: "notes" },
              ]},
            ].map(item => (
              <div key={item.label} className="rounded-xl border border-border bg-card/40 flex flex-col gap-2.5 p-4">
                <p className="font-semibold text-sm text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
                <div className="flex flex-wrap gap-1">
                  {item.tags.map(tag => <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{tag}</span>)}
                </div>
                <div className="flex flex-wrap gap-2 pt-2 mt-auto border-t border-border/50">
                  {item.links.map(link => {
                    const isYT = link.type === "youtube"
                    const isNotes = link.type === "notes"
                    const btnColor = isYT ? "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
                      : isNotes ? "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20"
                      : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                    return (
                      <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${btnColor}`}>
                        {isYT && <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>}
                        {isNotes && <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>}
                        {!isYT && !isNotes && <ExternalLink className="h-3.5 w-3.5 shrink-0" />}
                        {link.text}
                      </a>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Practice */}
      {activeTab === "practice" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">AI-powered practice tests — Aptitude, Coding/DSA, and Communication. Full quiz engine with instant explanations.</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Aptitude",      desc: "Percentages, Profit & Loss, Time & Work, Probability, Data Interpretation and more.", color: "#f59e0b", href: "/student/prep" },
              { label: "Coding / DSA",  desc: "Arrays, Strings, Linked Lists, Trees, Graphs, Dynamic Programming — topic by topic.", color: "#6366f1", href: "/student/prep" },
              { label: "Communication", desc: "Grammar, Vocabulary, Reading Comprehension, Para Jumbles, Email Writing.", color: "#10b981", href: "/student/prep" },
            ].map(track => (
              <a key={track.label} href={track.href}
                className="group rounded-2xl border p-5 flex flex-col gap-3 transition-all hover:scale-[1.02] hover:shadow-xl"
                style={{ borderColor: `${track.color}30`, background: `${track.color}08` }}>
                <p className="font-bold text-base text-foreground">{track.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">{track.desc}</p>
                <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: track.color }}>
                  Start <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Challenges */}
      {activeTab === "challenges" && (
        <div className="space-y-6">
          {/* Hero banner */}
          <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-600/10 via-violet-500/5 to-transparent p-5">
            <p className="text-lg font-black text-foreground">Coding Challenges</p>
            <p className="text-xs text-muted-foreground mt-1">
              {completedChallenges.length} challenge{completedChallenges.length !== 1 ? "s" : ""} completed · +{completedChallenges.length * 20} XP
            </p>
          </div>

          {(() => {
            // Flat pools — filter out completed, slice to visible window
            const visibleProjects = PROJECT_POOL.filter(c => !completedChallenges.includes(c.id)).slice(0, 6)
            const visibleDebug    = DEBUG_POOL.filter(c => !completedChallenges.includes(c.id)).slice(0, 3)

            return (
              <>
                {/* Project challenges */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                      <Zap className="h-3.5 w-3.5 text-violet-400" />Project Challenges
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      {PROJECT_POOL.length - PROJECT_POOL.filter(c => !completedChallenges.includes(c.id)).length} / {PROJECT_POOL.length} done
                    </span>
                  </div>
                  {visibleProjects.length === 0 ? (
                    <div className="text-center py-10 rounded-xl border border-dashed border-emerald-500/30">
                      <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-400 mb-2" />
                      <p className="text-sm font-semibold text-emerald-400">All project challenges complete!</p>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {visibleProjects.map(c => {
                        const bColor  = c.badge === "Beginner" ? "#10b981" : c.badge === "Intermediate" ? "#f59e0b" : "#ef4444"
                        const loading = completingChallenge === c.id
                        const isNew   = newChallenge === c.id
                        return (
                          <div key={c.id} className={`rounded-xl border p-4 flex flex-col gap-3 transition-all ${isNew ? "border-primary/60 bg-primary/5" : "border-border bg-card/40 hover:border-primary/30"}`}>
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-bold text-foreground">{c.title}</p>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {isNew && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary animate-pulse">New!</span>}
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background:`${bColor}20`, color:bColor }}>{c.badge}</span>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground flex-1">{c.desc}</p>
                            <div className="flex gap-2">
                              <a href={c.url} target="_blank" rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
                                style={{ background:`linear-gradient(135deg,${c.color},${c.color}cc)` }}>
                                <ExternalLink className="h-3 w-3" /> Try
                              </a>
                              <button onClick={() => markChallengeDone(c.id)} disabled={!!loading}
                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-all disabled:opacity-50">
                                {loading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <><CheckCircle2 className="h-3 w-3" /> Done</>}
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Debug challenges */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                      <Brain className="h-3.5 w-3.5 text-red-400" />Debug Challenges
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      {DEBUG_POOL.length - DEBUG_POOL.filter(c => !completedChallenges.includes(c.id)).length} / {DEBUG_POOL.length} done
                    </span>
                  </div>
                  {visibleDebug.length === 0 ? (
                    <div className="text-center py-10 rounded-xl border border-dashed border-emerald-500/30">
                      <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-400 mb-2" />
                      <p className="text-sm font-semibold text-emerald-400">All debug challenges complete!</p>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {visibleDebug.map(c => {
                        const loading = completingChallenge === c.id
                        const isNew   = newChallenge === c.id
                        const bColor  = c.badge === "Beginner" ? "#10b981" : c.badge === "Intermediate" ? "#f59e0b" : "#ef4444"
                        return (
                          <div key={c.id} className={`rounded-xl border p-4 flex flex-col gap-3 transition-all ${isNew ? "border-primary/60 bg-primary/5" : "border-border bg-card/40 hover:border-primary/30"}`}>
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-bold text-foreground">{c.title}</p>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background:`${bColor}20`, color:bColor }}>{c.badge}</span>
                                {isNew && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-primary/20 text-primary animate-pulse">New!</span>}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground flex-1">{c.desc}</p>
                            {/* Code snippet */}
                            <div className="rounded-lg bg-black/20 border border-border p-2.5 font-mono text-xs text-emerald-400 whitespace-pre leading-relaxed">{c.snippet}</div>
                            {/* Answer — collapsed */}
                            <details className="text-xs">
                              <summary className="cursor-pointer text-primary font-semibold hover:underline select-none">💡 Reveal Answer</summary>
                              <p className="mt-1.5 text-muted-foreground pl-1 border-l-2 border-primary/30">{c.fix}</p>
                            </details>
                            {/* Actions — same layout as project cards */}
                            <div className="flex gap-2 pt-1 border-t border-border/50">
                              <a href={c.url} target="_blank" rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
                                style={{ background:`linear-gradient(135deg,${c.color},${c.color}cc)` }}>
                                <ExternalLink className="h-3 w-3" /> Try
                              </a>
                              <button onClick={() => markChallengeDone(c.id)} disabled={!!loading}
                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-all disabled:opacity-50">
                                {loading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <><CheckCircle2 className="h-3 w-3" /> Done</>}
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </>
            )
          })()}

          {/* Skill badge challenges */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
              <Star className="h-3.5 w-3.5 text-amber-400" />Skill Badge Challenges — Earn Recognition
            </p>
            <p className="text-[11px] text-muted-foreground">Badges are awarded automatically when your linked platform stats meet the requirement. Completing a track unlocks the next one.</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(() => {
                // ── Full track pool (ordered — later tracks unlock when earlier ones finish) ──
                const ALL_TRACKS = [
                  // ── Initial 4 tracks ──────────────────────────────────────
                  { track:"arrays",    label:"Arrays",         color:"#3b82f6", url:"https://leetcode.com/tag/array/",
                    badges:[
                      { id:"badge-array-1", title:"Array Starter",   desc:"Solve 3 Easy problems",    xp:50,  required:3  },
                      { id:"badge-array-2", title:"Array Pro",        desc:"Solve 15 Easy problems",   xp:80,  required:15 },
                      { id:"badge-array-3", title:"Array Master",     desc:"Solve 30 Easy problems",   xp:150, required:30 },
                    ]},
                  { track:"algo",      label:"Algorithms",     color:"#10b981", url:"https://leetcode.com/problemset/?difficulty=EASY",
                    badges:[
                      { id:"badge-algo-1",  title:"Loop Learner",    desc:"Solve 3 Easy problems",    xp:40,  required:3  },
                      { id:"badge-algo-2",  title:"Loop Master",     desc:"Solve 10 total problems",   xp:70,  required:10 },
                      { id:"badge-algo-3",  title:"Algorithm Ace",   desc:"Solve 25 total problems",   xp:130, required:25 },
                    ]},
                  { track:"strings",   label:"Strings",        color:"#8b5cf6", url:"https://leetcode.com/tag/string/",
                    badges:[
                      { id:"badge-str-1",   title:"String Starter",  desc:"Solve 3 Easy problems",    xp:50,  required:3  },
                      { id:"badge-str-2",   title:"String Wizard",   desc:"Solve 15 problems",         xp:80,  required:15 },
                      { id:"badge-str-3",   title:"String Legend",   desc:"Solve 30 problems",         xp:140, required:30 },
                    ]},
                  { track:"git",       label:"Git",            color:"#f59e0b", url:"https://skills.github.com/",
                    badges:[
                      { id:"badge-git-1",   title:"Git Starter",          desc:"Create 1 GitHub repo",  xp:40,  required:1  },
                      { id:"badge-git-2",   title:"Git Committer",        desc:"Make 10 commits",        xp:70,  required:10 },
                      { id:"badge-git-3",   title:"Open Source Hero",     desc:"Make 50 commits",        xp:120, required:50 },
                    ]},
                  // ── Unlocked after completing initial tracks ───────────────
                  { track:"trees",     label:"Trees",          color:"#06b6d4", url:"https://leetcode.com/tag/tree/",
                    badges:[
                      { id:"badge-tree-1",  title:"Tree Sprout",     desc:"Solve 5 tree problems",     xp:60,  required:5  },
                      { id:"badge-tree-2",  title:"Tree Climber",    desc:"Solve 15 tree problems",     xp:90,  required:15 },
                      { id:"badge-tree-3",  title:"Tree Expert",     desc:"Solve 30 tree problems",     xp:160, required:30 },
                    ]},
                  { track:"dp",        label:"Dynamic Prog.",  color:"#ec4899", url:"https://leetcode.com/tag/dynamic-programming/",
                    badges:[
                      { id:"badge-dp-1",    title:"DP Initiate",     desc:"Solve 3 DP problems",        xp:60,  required:3  },
                      { id:"badge-dp-2",    title:"DP Practitioner", desc:"Solve 10 DP problems",       xp:100, required:10 },
                      { id:"badge-dp-3",    title:"DP Master",       desc:"Solve 20 DP problems",       xp:180, required:20 },
                    ]},
                  { track:"graphs",    label:"Graphs",         color:"#f97316", url:"https://leetcode.com/tag/graph/",
                    badges:[
                      { id:"badge-graph-1", title:"Graph Walker",    desc:"Solve 3 graph problems",     xp:60,  required:3  },
                      { id:"badge-graph-2", title:"Graph Traverser", desc:"Solve 10 graph problems",    xp:100, required:10 },
                      { id:"badge-graph-3", title:"Graph Master",    desc:"Solve 20 graph problems",    xp:180, required:20 },
                    ]},
                  { track:"sql",       label:"SQL",            color:"#14b8a6", url:"https://sqlzoo.net/wiki/SQL_Tutorial",
                    badges:[
                      { id:"badge-sql-1",   title:"SQL Beginner",    desc:"Solve 5 SQL problems",       xp:50,  required:5  },
                      { id:"badge-sql-2",   title:"SQL Writer",      desc:"Solve 15 SQL problems",      xp:80,  required:15 },
                      { id:"badge-sql-3",   title:"SQL Expert",      desc:"Solve 30 SQL problems",      xp:150, required:30 },
                    ]},
                  // ── Expert tracks (unlocked after advanced tracks complete) ──
                  { track:"binary",    label:"Binary Search",  color:"#a855f7", url:"https://leetcode.com/tag/binary-search/",
                    badges:[
                      { id:"badge-bin-1",   title:"Binary Initiate", desc:"Solve 5 BS problems",        xp:70,  required:5  },
                      { id:"badge-bin-2",   title:"Binary Searcher", desc:"Solve 15 BS problems",       xp:110, required:15 },
                      { id:"badge-bin-3",   title:"Binary Expert",   desc:"Solve 30 BS problems",       xp:180, required:30 },
                    ]},
                  { track:"sorting",   label:"Sorting",        color:"#f43f5e", url:"https://leetcode.com/tag/sorting/",
                    badges:[
                      { id:"badge-sort-1",  title:"Sort Learner",    desc:"Solve 5 sorting problems",   xp:70,  required:5  },
                      { id:"badge-sort-2",  title:"Sort Pro",        desc:"Solve 15 sorting problems",  xp:110, required:15 },
                      { id:"badge-sort-3",  title:"Sort Master",     desc:"Solve 25 sorting problems",  xp:180, required:25 },
                    ]},
                  { track:"recursion", label:"Recursion",      color:"#84cc16", url:"https://leetcode.com/tag/recursion/",
                    badges:[
                      { id:"badge-rec-1",   title:"Recursion Starter",desc:"Solve 3 recursion problems", xp:70, required:3  },
                      { id:"badge-rec-2",   title:"Recursion Pro",   desc:"Solve 10 recursion problems", xp:110, required:10 },
                      { id:"badge-rec-3",   title:"Recursion Master", desc:"Solve 20 recursion problems",xp:180, required:20 },
                    ]},
                  { track:"hashing",   label:"Hashing",        color:"#fb923c", url:"https://leetcode.com/tag/hash-table/",
                    badges:[
                      { id:"badge-hash-1",  title:"Hash Beginner",   desc:"Solve 5 hash problems",      xp:70,  required:5  },
                      { id:"badge-hash-2",  title:"Hash Builder",    desc:"Solve 15 hash problems",     xp:110, required:15 },
                      { id:"badge-hash-3",  title:"Hash Master",     desc:"Solve 25 hash problems",     xp:180, required:25 },
                    ]},
                ]

                // Always show exactly 4 tracks: the first 4 that aren't fully earned,
                // with already-completed ones replaced by the next available track.
                // Show up to 4 non-completed tracks — never show completed ones
                const displayTracks = ALL_TRACKS.filter(t =>
                  !t.badges.every(b => completedBadges.includes(b.id))
                ).slice(0, 4)

                if (displayTracks.length === 0) return (
                  <div className="col-span-4 text-center py-10 rounded-xl border border-dashed border-emerald-500/30">
                    <Trophy className="h-8 w-8 mx-auto text-emerald-400 mb-2" />
                    <p className="text-sm font-semibold text-emerald-400">All 36 badges earned — you've mastered every track!</p>
                  </div>
                )

                return displayTracks.map(t => {
                  const earnedInTrack = t.badges.filter(b => completedBadges.includes(b.id))
                  const currentIdx    = earnedInTrack.length
                  const allDone       = currentIdx === t.badges.length
                  const activeBadge   = t.badges[allDone ? t.badges.length - 1 : currentIdx]
                  const prog          = badgeProgress[activeBadge.id]
                  const cur           = prog?.current ?? 0
                  const req           = prog?.required ?? activeBadge.required
                  const pct           = allDone ? 100 : Math.min(100, Math.round((cur / req) * 100))
                  // Is this track newly unlocked (not in the initial 4)?
                  const isNewUnlock   = !["arrays","algo","strings","git"].includes(t.track) && earnedInTrack.length === 0

                  return (
                    <div key={t.track} className={`rounded-xl border p-4 flex flex-col gap-3 transition-all ${
                      allDone      ? "border-emerald-500/30 bg-emerald-500/5"
                      : isNewUnlock ? "border-primary/40 bg-primary/5"
                      :               "border-border bg-card/40"
                    }`}>
                      {/* Track label + count */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: t.color }}>{t.label}</p>
                          {isNewUnlock && (
                            <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">NEW</span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground">{earnedInTrack.length} / {t.badges.length}</p>
                      </div>
                      {/* Step dots */}
                      <div className="flex items-center gap-1">
                        {t.badges.map((b, i) => {
                          const done   = completedBadges.includes(b.id)
                          const isCurr = !allDone && i === currentIdx
                          return (
                            <div key={b.id} className="flex items-center gap-1 flex-1">
                              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-black transition-all ${done ? "text-white" : isCurr ? "border-2 text-foreground" : "border opacity-30 text-muted-foreground"}`}
                                style={{ background: done ? t.color : isCurr ? `${t.color}20` : "transparent", borderColor: isCurr ? t.color : "var(--border)" }}>
                                {done ? "✓" : i + 1}
                              </div>
                              {i < t.badges.length - 1 && (
                                <div className="h-px flex-1 transition-all" style={{ background: done ? t.color : "var(--border)" }} />
                              )}
                            </div>
                          )
                        })}
                      </div>
                      {/* Active badge info */}
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                          style={{ background:`${t.color}20`, color: allDone ? "#10b981" : t.color }}>
                          {allDone ? <CheckCircle2 className="h-4 w-4" /> : <Trophy className="h-3.5 w-3.5" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">{activeBadge.title}</p>
                          <p className="text-[9px] font-semibold" style={{ color: allDone ? "#10b981" : "#f59e0b" }}>
                            {allDone ? "✓ Track Complete" : `+${activeBadge.xp} XP`}
                          </p>
                        </div>
                      </div>
                      {/* Live progress bar */}
                      {!allDone && (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[9px] text-muted-foreground">
                            <span>{activeBadge.desc}</span>
                            <span className="font-semibold tabular-nums" style={{ color: t.color }}>{cur} / {req}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700"
                              style={{ width:`${pct}%`, background: t.color }} />
                          </div>
                          {pct === 100 && (
                            <p className="text-[9px] text-emerald-400 font-semibold">✓ Requirement met — badge will be awarded on next load</p>
                          )}
                        </div>
                      )}
                      {/* Practice link */}
                      {!allDone ? (
                        <a href={t.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 text-[10px] text-primary font-semibold py-1.5 rounded-lg border border-primary/20 hover:bg-primary/5 transition-all border-t border-t-border/50 pt-2 mt-auto">
                          <ExternalLink className="h-3 w-3" /> Practice on {t.label === "Git" ? "GitHub" : t.label === "SQL" ? "SQLZoo" : "LeetCode"}
                        </a>
                      ) : (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold border-t border-emerald-500/20 pt-2">
                          <CheckCircle2 className="h-3 w-3" /> All badges earned!
                        </div>
                      )}
                    </div>
                  )
                })
              })()}
            </div>
          </div>

        </div>
      )}

      {/* Resources */}
      {activeTab === "resources" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Curated courses, cheatsheets, and references — everything you need to build a solid foundation.</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "CS50x Harvard",     type: "Course", color: "#ef4444", desc: "The world's best intro CS course. Free, beginner-friendly.",             url: "https://cs50.harvard.edu/x/" },
              { title: "freeCodeCamp",      type: "Course", color: "#10b981", desc: "Full web dev + Python curriculum, completely free.",                      url: "https://www.freecodecamp.org/" },
              { title: "The Odin Project",  type: "Course", color: "#f97316", desc: "Project-based full-stack web dev path. Build real things.",               url: "https://www.theodinproject.com/" },
              { title: "Kaggle Learn",      type: "ML",     color: "#06b6d4", desc: "Hands-on Python, ML, and data science micro-courses.",                    url: "https://www.kaggle.com/learn" },
              { title: "GFG DSA",           type: "DSA",    color: "#8b5cf6", desc: "Comprehensive DSA — theory, problems, and solutions.",                    url: "https://www.geeksforgeeks.org/data-structures/" },
              { title: "Python Cheatsheet", type: "Notes",  color: "#f59e0b", desc: "Quick reference for Python syntax and common patterns.",                  url: "https://www.pythoncheatsheet.org/" },
              { title: "Git Cheatsheet",    type: "Notes",  color: "#3b82f6", desc: "All essential git commands in one place. Bookmark this.",                 url: "https://education.github.com/git-cheat-sheet-education.pdf" },
              { title: "DBMS Notes GFG",    type: "Notes",  color: "#14b8a6", desc: "Database fundamentals — ER models, normalization, SQL.",                  url: "https://www.geeksforgeeks.org/dbms/" },
            ].map(r => (
              <div key={r.title} className="rounded-xl border border-border bg-card/40 p-4 flex flex-col gap-2.5 hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{r.title}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: `${r.color}20`, color: r.color }}>{r.type}</span>
                </div>
                <p className="text-xs text-muted-foreground flex-1">{r.desc}</p>
                <a href={r.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold border border-border text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all">
                  <ExternalLink className="h-3.5 w-3.5" /> Open
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Soft Skills */}
      {activeTab === "soft" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Bite-sized modules on communication, teamwork, and growth mindset. Each takes under 10 minutes.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {SOFT_SKILLS.map(skill => {
              const done = completedSoftSkills.includes(skill.id)
              return (
                <div key={skill.id} className={`rounded-2xl border p-5 space-y-3 transition-all ${done ? "border-emerald-500/20 bg-emerald-500/5" : "border-border bg-card"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{skill.title}</p>
                        {done && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{skill.desc}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">{skill.duration}</span>
                      {done && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">{skill.badge}</span>}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {skill.steps.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[9px] mt-0.5">{i+1}</span>
                        {s}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <a href={skill.videoUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20 transition-all">
                      <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                      Watch
                    </a>
                    {!done && (
                      <button onClick={() => setCompletedSoftSkills(p => [...p, skill.id])}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 transition-all">
                        <CheckCircle2 className="h-3 w-3" /> Mark Done
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Self-check quizzes */}
      {activeTab === "quizzes" && !quizTopic && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Short 4-question quizzes to check your understanding. Encouraging feedback — no pressure.</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { id: "python", label: "Python Basics", icon: "PY", color: "#3b82f6", desc: "Variables, types, loops, functions" },
              { id: "dsa",    label: "DSA Intro",     icon: "DS", color: "#8b5cf6", desc: "Arrays, stacks, Big O basics" },
              { id: "git",    label: "Git & GitHub",  icon: "GH", color: "#10b981", desc: "Add, commit, push, branches" },
            ].map(q => {
              const done = completedQuizzes.includes(q.id)
              return (
                <button key={q.id} onClick={() => setQuizTopic(q.id)}
                  className="rounded-2xl border p-5 text-left transition-all hover:border-primary/30 hover:shadow-lg"
                  style={{ borderColor: done ? "#10b98130" : "var(--border)", background: done ? "rgba(16,185,129,0.05)" : "var(--card)" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold"
                      style={{ background: `${q.color}15`, border: `1px solid ${q.color}30`, color: q.color }}>
                      {q.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{q.label}</p>
                      {done && <span className="text-[10px] text-emerald-400 font-semibold">Completed</span>}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{q.desc}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold" style={{ color: q.color }}>
                    {done ? <RefreshCw className="h-3 w-3" /> : <Brain className="h-3 w-3" />}
                    {done ? "Retake Quiz" : "Start Quiz"} <ChevronRight className="h-3 w-3" />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
      {activeTab === "quizzes" && quizTopic && (
        <div className="max-w-lg mx-auto space-y-4">
          <button onClick={() => setQuizTopic(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight className="h-4 w-4 rotate-180" /> Back to topics
          </button>
          <div className="rounded-2xl border border-border bg-card p-5">
            <TopicQuiz topic={quizTopic} onComplete={() => { setCompletedQuizzes(p => p.includes(quizTopic) ? p : [...p, quizTopic]); setTimeout(() => setQuizTopic(null), 2000) }} />
          </div>
        </div>
      )}

      {/* Community — Discussion Board */}
      {activeTab === "community" && (
        <CommunityDiscussions student={student} />
      )}

      {/* Leaderboard */}
      {activeTab === "leaderboard" && <FirstYearLeaderboard />}

      {/* Library */}
      {activeTab === "library" && (
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <BookMarked className="h-4 w-4 text-primary" />Recommended Books
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {RECOMMENDED_BOOKS.map(b => (
                <a key={b.title} href={b.url} target="_blank" rel="noopener noreferrer"
                  className="rounded-xl border border-border bg-card/50 p-4 hover:border-primary/30 hover:shadow-md transition-all group flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{b.title}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold shrink-0">{b.tag}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">by {b.author}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{b.why}</p>
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-400" />Recommended Blogs & Resources
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {RECOMMENDED_BLOGS.map(b => (
                <a key={b.name} href={b.url} target="_blank" rel="noopener noreferrer"
                  className="rounded-xl border border-border bg-card/50 p-4 hover:border-primary/30 hover:shadow-md transition-all group flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{b.name}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-semibold shrink-0">{b.tag}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed flex-1">{b.desc}</p>
                  <p className="text-[10px] text-primary font-semibold flex items-center gap-1">Open <ChevronRight className="h-3 w-3" /></p>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
