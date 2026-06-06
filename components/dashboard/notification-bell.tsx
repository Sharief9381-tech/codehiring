"use client"

import { useEffect, useRef, useState } from "react"
import { Bell, Check, Briefcase, RefreshCw, Trophy, Megaphone, PartyPopper, X, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Notification {
  _id: string
  type: string
  title: string
  message: string
  href?: string
  read: boolean
  createdAt: string
}

const TYPE_ICON: Record<string, React.ElementType> = {
  job_match: Briefcase,
  platform_sync: RefreshCw,
  shortlist: Trophy,
  application: Check,
  announcement: Megaphone,
  welcome: PartyPopper,
}

const TYPE_COLOR: Record<string, string> = {
  job_match: "bg-primary/10 text-primary",
  platform_sync: "bg-emerald-500/10 text-emerald-500",
  shortlist: "bg-amber-500/10 text-amber-500",
  application: "bg-cyan-500/10 text-cyan-500",
  announcement: "bg-violet-500/10 text-violet-500",
  welcome: "bg-rose-500/10 text-rose-500",
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/notifications")
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications ?? [])
        setUnread(data.unread ?? 0)
      }
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => {
    fetchNotifications()
    // Poll every 60 seconds
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const markRead = async (id: string) => {
    await fetch(`/api/notifications/read?id=${id}`, { method: "POST" }).catch(() => {})
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    )
    setUnread((c) => Math.max(0, c - 1))
  }

  const markAllRead = async () => {
    await fetch("/api/notifications/read?all=1", { method: "POST" }).catch(() => {})
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnread(0)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open) fetchNotifications() }}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors relative"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 rounded-xl border border-border bg-background shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-foreground" />
              <span className="text-sm font-semibold text-foreground">Notifications</span>
              {unread > 0 && (
                <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                  {unread}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded"
                  title="Mark all as read"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  All read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground p-1 rounded transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col gap-2 p-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="h-8 w-8 rounded-lg bg-secondary shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-3/4 rounded bg-secondary" />
                      <div className="h-2.5 w-full rounded bg-secondary" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center px-4">
                <Bell className="h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = TYPE_ICON[n.type] ?? Bell
                const colorClass = TYPE_COLOR[n.type] ?? "bg-secondary text-muted-foreground"
                const content = (
                  <div
                    key={n._id}
                    className={cn(
                      "flex gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors cursor-pointer border-b border-border/50 last:border-0",
                      !n.read && "bg-primary/5"
                    )}
                    onClick={() => { if (!n.read) markRead(n._id); if (!n.href) setOpen(false) }}
                  >
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", colorClass)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn("text-xs font-semibold leading-snug", n.read ? "text-foreground/70" : "text-foreground")}>
                          {n.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">{timeAgo(n.createdAt)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                    {!n.read && (
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                )
                return n.href ? (
                  <Link key={n._id} href={n.href} onClick={() => setOpen(false)}>
                    {content}
                  </Link>
                ) : content
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
