"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Menu, X, Sun, Moon } from "lucide-react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = theme === "dark"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center">
          {/* Light mode logo */}
          <Image
            src="/codehiring-logo.svg"
            alt="CodeHiring"
            width={200}
            height={44}
            className="h-10 w-auto block dark:hidden"
            priority
          />
          {/* Dark mode logo */}
          <Image
            src="/codehiring-logo-dark.svg"
            alt="CodeHiring"
            width={200}
            height={44}
            className="h-10 w-auto hidden dark:block"
            priority
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How it Works
          </Link>
          <Link href="#platforms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Platforms
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {/* Theme toggle mobile */}
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}
          <button
            type="button"
            className="text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4">
          <div className="flex flex-col gap-4">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">How it Works</Link>
            <Link href="#platforms" className="text-sm text-muted-foreground hover:text-foreground">Platforms</Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              <Link href="/login">
                <Button variant="ghost" className="w-full justify-start">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
