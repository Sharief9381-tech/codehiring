"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import React, { useState } from "react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Users, BarChart3, Building2, Briefcase,
  MessageSquare, LogOut, Sun, Moon, Menu, X, Crown,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const adminLinks = [
  { tab: "overview",     label: "Overview",     icon: LayoutDashboard },
  { tab: "users",        label: "Users",        icon: Users },
  { tab: "verification", label: "Verification", icon: Building2 },
  { tab: "jobs",         label: "Jobs",         icon: Briefcase },
  { tab: "feedback",     label: "Feedback",     icon: MessageSquare },
  { tab: "analytics",    label: "Analytics",    icon: BarChart3 },
]

interface AdminSidebarProps {
  user: any
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function AdminSidebar({ user, activeTab, onTabChange }: AdminSidebarProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  React.useEffect(() => setMounted(true), [])

  const isDark = mounted && theme === "dark"
  const initials = (user.name ?? "A").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()

  // Use prop if provided
  const currentTab = activeTab ?? "overview"

  const handleTabClick = (tab: string) => {
    setMobileOpen(false)
    if (onTabChange) {
      onTabChange(tab)
    } else {
      const url = tab === "overview" ? "/admin" : `/admin?tab=${tab}`
      router.push(url)
    }
  }

  const handleLogout = async () => {
    try { await fetch("/api/auth/logout", { method: "POST" }) } catch {}
    router.push("/")
    router.refresh()
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="flex h-full items-center justify-between px-4 md:px-5 max-w-screen-2xl mx-auto">

          {/* Logo */}
          <button onClick={() => handleTabClick("overview")} className="flex items-center gap-2.5 shrink-0 group">
            <Image src="/codehiring-logo.svg"      alt="CodeHiring" width={130} height={32} className="h-7 w-auto block dark:hidden transition-opacity group-hover:opacity-80" />
            <Image src="/codehiring-logo-dark.svg" alt="CodeHiring" width={130} height={32} className="h-7 w-auto hidden dark:block transition-opacity group-hover:opacity-80" />
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full hidden sm:block bg-red-500/10 text-red-600 dark:text-red-400">
              Admin
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {adminLinks.map(({ tab, label, icon: Icon }) => {
              const active = currentTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={cn(
                    "relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                    active
                      ? "text-primary bg-primary/8"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{label}</span>
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-primary" />
                  )}
                </button>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
              aria-label="Toggle theme"
            >
              {mounted && isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <div className="w-px h-5 bg-border/60 mx-1 hidden sm:block" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg pl-1 pr-2 py-1 hover:bg-secondary/80 transition-all">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-foreground hidden sm:block max-w-[80px] truncate">
                    {(user.name ?? "Admin").split(" ")[0]}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-border/60">
                <div className="px-3 py-2.5 border-b border-border/60">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Crown className="h-3 w-3 text-red-500" />
                    <span className="text-xs font-semibold text-red-600 dark:text-red-400">Administrator</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <div className="p-1">
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
            {adminLinks.map(({ tab, label, icon: Icon }) => {
              const active = currentTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              )
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        )}
      </header>

      <div className="h-14" />
    </>
  )
}
