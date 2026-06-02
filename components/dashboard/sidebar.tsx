"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import React, { useState } from "react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Code2, Trophy, Briefcase, User, Settings,
  LogOut, GraduationCap, Building2, Users, BarChart3, Search,
  FileText, Sun, Moon, Bell, Menu, X, Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { StudentProfile, CollegeProfile, RecruiterProfile } from "@/lib/types"

interface DashboardSidebarProps {
  user: StudentProfile | CollegeProfile | RecruiterProfile
}

const studentLinks = [
  { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/platforms", label: "Platforms", icon: Code2 },
  { href: "/student/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/student/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/student/jobs", label: "Job Matches", icon: Briefcase },
  { href: "/student/ai", label: "AI Insights", icon: Sparkles },
]

const collegeLinks = [
  { href: "/college/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/college/students", label: "Students", icon: GraduationCap },
  { href: "/college/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/college/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/college/placements", label: "Placements", icon: Briefcase },
  { href: "/college/settings", label: "Settings", icon: Settings },
]

const recruiterLinks = [
  { href: "/recruiter/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/recruiter/search", label: "Search Talent", icon: Search },
  { href: "/recruiter/shortlists", label: "Shortlists", icon: Users },
  { href: "/recruiter/jobs", label: "Job Postings", icon: FileText },
  { href: "/recruiter/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/recruiter/settings", label: "Settings", icon: Settings },
]

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  React.useEffect(() => setMounted(true), [])

  const links =
    user.role === "student" ? studentLinks
    : user.role === "college" ? collegeLinks
    : recruiterLinks

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
      router.refresh()
    } catch {}
  }

  const isDark = mounted && theme === "dark"

  return (
    <>
      {/* ── Top Navbar ─────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-4 md:px-6">

          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Code2 className="h-4 w-4" />
            </div>
            <span className="font-bold text-foreground hidden sm:block">CodeTrack</span>
            <span className="text-xs text-muted-foreground hidden sm:block capitalize border border-border rounded-full px-2 py-0.5">
              {user.role}
            </span>
          </Link>

          {/* Center: Nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="h-9 w-9 rounded-lg"
              aria-label="Toggle theme"
            >
              {isDark
                ? <Sun className="h-4 w-4" />
                : <Moon className="h-4 w-4" />
              }
            </Button>

            {/* Bell */}
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
            </Button>

            {/* Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full hover:ring-2 hover:ring-primary/40 transition-all">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link href={`/${user.role}/profile`} className="gap-2 cursor-pointer">
                    <User className="h-4 w-4" /> View Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-3 space-y-1">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </div>
        )}
      </header>

      {/* Spacer so content doesn't hide under fixed navbar */}
      <div className="h-16" />
    </>
  )
}
