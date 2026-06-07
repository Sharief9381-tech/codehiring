"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Menu, X, Sun, Moon, LayoutDashboard } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState<{ role: string; email: string } | null>(null)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    // Check if user is already logged in
    fetch("/api/auth/user")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.user) setLoggedInUser(d.user) })
      .catch(() => {})
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isDark = theme === "dark"
  const dashboardHref = loggedInUser
    ? (loggedInUser.role === "admin" || loggedInUser.email === "sharief9381@gmail.com"
        ? "/admin"
        : `/${loggedInUser.role}/dashboard`)
    : null

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 h-14 transition-all duration-300 ${
      scrolled
        ? "bg-background/90 backdrop-blur-xl border-b border-white/8 shadow-lg shadow-black/20"
        : "bg-transparent"
    }`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 h-full">

        {/* Logo + tagline */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <Image src="/codehiring-logo.svg" alt="CodeHiring" width={130} height={32} className="h-7 w-auto block dark:hidden" />
          <Image src="/codehiring-logo-dark.svg" alt="CodeHiring" width={130} height={32} className="h-7 w-auto hidden dark:block" />
          <div className="hidden sm:flex flex-col">
            <span className="text-[9px] text-zinc-600 font-medium leading-none tracking-wide">
              Skills First Recruitment
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {[
            { href: "#features", label: "Features" },
            { href: "#how-it-works", label: "How it Works" },
            { href: "#platforms", label: "Platforms" },
            { href: "#stats", label: "Live Stats" },
            { href: "/blog", label: "Blog" },
            { href: "/about", label: "About" },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden items-center gap-2 md:flex">
          {mounted && (
            <button onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/8 transition-all">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}
          {dashboardHref ? (
            <Link href={dashboardHref}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white border-0 shadow-lg shadow-violet-500/25 gap-2">
                  <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
                </Button>
              </motion.div>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-white/8">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white border-0 shadow-lg shadow-violet-500/25">
                    Get Started
                  </Button>
                </motion.div>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          {mounted && (
            <button onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:text-white transition-all">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:text-white transition-all">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/8 bg-background/95 backdrop-blur-xl px-6 py-4 space-y-1">
            {[
              { href: "#features", label: "Features" },
              { href: "#how-it-works", label: "How it Works" },
              { href: "#platforms", label: "Platforms" },
              { href: "#stats", label: "Live Stats" },
              { href: "/blog", label: "Blog" },
              { href: "/about", label: "About" },
            ].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                {item.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-3 border-t border-white/8">
              {dashboardHref ? (
                <Link href={dashboardHref} className="flex-1">
                  <Button className="w-full bg-violet-600 hover:bg-violet-500 text-white border-0 gap-2">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" className="w-full border-white/15 text-zinc-300 hover:text-white hover:bg-white/8">Sign In</Button>
                  </Link>
                  <Link href="/signup" className="flex-1">
                    <Button className="w-full bg-violet-600 hover:bg-violet-500 text-white border-0">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
