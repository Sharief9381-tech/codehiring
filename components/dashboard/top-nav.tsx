"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Code2, BarChart3, Trophy, Briefcase, User,
  Settings, LogOut, Search, RefreshCw, Sun, Moon, GraduationCap,
  Building2, Users, FileText, Orbit, Zap,
} from "lucide-react"
import { useState, useEffect } from "react"
import type { StudentProfile, CollegeProfile, RecruiterProfile } from "@/lib/types"

interface TopNavProps {
  user: StudentProfile | CollegeProfile | RecruiterProfile
}

const studentLinks = [
  { href: "/student/dashboard",  label: "Dashboard",   icon: LayoutDashboard },
  { href: "/student/platforms",  label: "Platforms",   icon: Code2 },
  { href: "/student/analytics",  label: "Analytics",   icon: BarChart3 },
  { href: "/student/leaderboard",label: "Leaderboard", icon: Trophy },
  { href: "/student/jobs",       label: "Job Matches", icon: Briefcase },
  { href: "/student/profile",    label: "Profile",     icon: User },
]

const collegeLinks = [
  { href: "/college/dashboard",  label: "Dashboard",   icon: LayoutDashboard },
  { href: "/college/students",   label: "Students",    icon: GraduationCap },
  { href: "/college/analytics",  label: "Analytics",   icon: BarChart3 },
  { href: "/college/placements", label: "Placements",  icon: Briefcase },
  { href: "/college/settings",   label: "Settings",    icon: Settings },
]

const recruiterLinks = [
  { href: "/recruiter/dashboard", label: "Dashboard",     icon: LayoutDashboard },
  { href: "/recruiter/search",    label: "Search Talent", icon: Search },
  { href: "/recruiter/shortlists",label: "Shortlists",    icon: Users },
  { href: "/recruiter/jobs",      label: "Job Postings",  icon: FileText },
  { href: "/recruiter/analytics", label: "Analytics",     icon: BarChart3 },
]

export function TopNav({ user }: TopNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [syncing, setSyncing] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => setMounted(true), [])

  const links =
    user.role === "student" ? studentLinks :
    user.role === "college" ? collegeLinks : recruiterLinks

  const initials = user.name
    ? user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "?"

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {})
    router.push("/")
    router.refresh()
  }

  const handleSync = async () => {
    if (user.role !== "student") return
    setSyncing(true)
    await fetch("/api/platforms/sync", { method: "POST" }).catch(() => {})
    setSyncing(false)
    router.refresh()
  }

  const isDark = mounted ? theme === "dark" : true

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/8 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center gap-4 px-4 lg:px-6">

        {/* Logo */}
        <Link href={`/${user.role}/dashboard`} className="flex items-center gap-2 shrink-0 mr-2">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/30">
            <Orbit className="h-4 w-4 text-white" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-teal-400 shadow-sm shadow-teal-400/50" />
          </div>
          <span className="hidden font-bold text-sm tracking-tight sm:block">
            <span className="text-white">Orbit</span>
            <span className="text-purple-400"> of Hire</span>
          </span>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/")
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200",
                  active
                    ? "text-white"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                )}
              >
                {active && (
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30" />
                )}
                <Icon className="relative h-3.5 w-3.5" />
                <span className="relative">{label}</span>
                {active && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-purple-400" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Sync — student only */}
          {user.role === "student" && (
            <button
              onClick={handleSync}
              disabled={syncing}
              title="Sync platforms"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", syncing && "animate-spin")} />
            </button>
          )}

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              title="Toggle theme"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          )}

          {/* Avatar + dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 text-xs font-bold text-white shadow-md shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
            >
              {initials}
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-10 z-50 w-52 rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/8">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-white/40 truncate">{user.email}</p>
                    <span className="mt-1 inline-block text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 capitalize">
                      {user.role}
                    </span>
                  </div>
                  <div className="p-1">
                    {user.role === "student" && (
                      <Link
                        href="/student/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <User className="h-4 w-4" /> Profile
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all"
          >
            <Zap className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-white/8 px-4 py-2 flex gap-1 overflow-x-auto scrollbar-none">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                active
                  ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          )
        })}
      </div>
    </header>
  )
}
