"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import React, { useState } from "react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Trophy, Briefcase, User, Settings, Code2,
  LogOut, GraduationCap, Users, BarChart3, Search,
  FileText, Sun, Moon, Menu, X, Sparkles, MessageSquarePlus,
  Megaphone, Handshake, Flag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FeedbackForm } from "@/components/feedback/feedback-form"
import { NotificationBell } from "@/components/dashboard/notification-bell"
import type { StudentProfile, CollegeProfile, RecruiterProfile, AdminProfile } from "@/lib/types"

interface DashboardSidebarProps {
  user: StudentProfile | CollegeProfile | RecruiterProfile | AdminProfile
}

const studentLinks = [
  { href: "/student/dashboard",  label: "Dashboard",    icon: LayoutDashboard },
  { href: "/student/platforms",  label: "Platforms",    icon: Code2 },
  { href: "/student/analytics",  label: "Analytics",    icon: BarChart3 },
  { href: "/student/leaderboard",label: "Leaderboard",  icon: Trophy },
  { href: "/student/jobs",       label: "Career Hub",   icon: Briefcase },
  { href: "/student/prep",       label: "Prep Track",   icon: Flag },
  { href: "/student/ai",         label: "AI Insights",  icon: Sparkles },
]
const collegeLinks = [
  { href: "/college/dashboard",     label: "Dashboard",    icon: LayoutDashboard },
  { href: "/college/students",      label: "Students",     icon: GraduationCap },
  { href: "/college/drives",        label: "Drives",       icon: Briefcase },
  { href: "/college/companies",     label: "Companies",    icon: Handshake },
  { href: "/college/announcements", label: "Announce",     icon: Megaphone },
  { href: "/college/reports",       label: "Reports",      icon: FileText },
]
const recruiterLinks = [
  { href: "/recruiter/dashboard", label: "Dashboard",    icon: LayoutDashboard },
  { href: "/recruiter/drives",    label: "Drives",       icon: Briefcase },
  { href: "/recruiter/search",    label: "Search Talent",icon: Search },
  { href: "/recruiter/shortlists",label: "Shortlists",   icon: Users },
  { href: "/recruiter/jobs",      label: "Job Postings", icon: FileText },
  { href: "/recruiter/analytics", label: "Analytics",    icon: BarChart3 },
  { href: "/recruiter/settings",  label: "Settings",     icon: Settings },
]

// Support link shown in mobile nav for all roles
const supportLink = { href: "/feedback", label: "Support & Feedback", icon: MessageSquarePlus }

const roleColor: Record<string, string> = {
  student: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  college: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  recruiter: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  React.useEffect(() => setMounted(true), [])

  const links =
    user.role === "student" ? studentLinks :
    user.role === "college" ? collegeLinks : recruiterLinks

  const initials = user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
  const isDark = mounted && theme === "dark"

  const handleLogout = async () => {
    try { await fetch("/api/auth/logout", { method: "POST" }) } catch {}
    router.push("/")
    router.refresh()
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-14 glass border-b border-border/50">
        <div className="flex h-full items-center justify-between px-4 md:px-5 max-w-screen-2xl mx-auto">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <Image src="/codehiring-logo.svg" alt="CodeHiring" width={130} height={32} className="h-7 w-auto block dark:hidden transition-opacity group-hover:opacity-80" />
            <Image src="/codehiring-logo-dark.svg" alt="CodeHiring" width={130} height={32} className="h-7 w-auto hidden dark:block transition-opacity group-hover:opacity-80" />
            <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize hidden sm:block", roleColor[user.role])}>
              {user.role}
            </span>
          </Link>

          {/* Nav — desktop */}
          <nav className="hidden md:flex items-center gap-0.5">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "text-primary bg-primary/8"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-primary" />
                  )}
                </Link>
              )
            })}
            {/* Support & Feedback — desktop */}
            
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
              aria-label="Toggle theme"
            >
              {mounted && isDark
                ? <Sun className="h-4 w-4" />
                : <Moon className="h-4 w-4" />
              }
            </button>

            {/* Notifications */}
            <NotificationBell />

            {/* Divider */}
            <div className="w-px h-5 bg-border/60 mx-1 hidden sm:block" />

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg pl-1 pr-2 py-1 hover:bg-secondary/80 transition-all group">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-[10px] font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-foreground hidden sm:block max-w-[80px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-border/60">
                <div className="px-3 py-2.5 border-b border-border/60">
                  <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <div className="p-1">
                  <DropdownMenuItem asChild>
                    <Link href={`/${user.role}/profile`} className="gap-2 cursor-pointer rounded-lg">
                      <User className="h-4 w-4" /> View Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFeedbackOpen(true)}
                    className="gap-2 cursor-pointer rounded-lg"
                  >
                    <MessageSquarePlus className="h-4 w-4" /> Support & Feedback
                  </DropdownMenuItem>
                  {(user.role === "college" || user.role === "recruiter") && (
                    <DropdownMenuItem asChild>
                      <Link href={`/${user.role}/settings`} className="gap-2 cursor-pointer rounded-lg">
                        <Settings className="h-4 w-4" /> Settings
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="gap-2 cursor-pointer rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile hamburger */}
            <button
              className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all ml-1"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur px-4 py-3 space-y-1">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
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

      {/* Navbar spacer */}
      <div className="h-14" />

      {/* Feedback dialog */}
      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Share Your Feedback</DialogTitle>
          </DialogHeader>
          <FeedbackForm onSuccess={() => setFeedbackOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
