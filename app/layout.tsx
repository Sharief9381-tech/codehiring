import React from "react"
import type { Metadata } from 'next'
<<<<<<< HEAD
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
=======
<<<<<<< HEAD
import { Geist, Geist_Mono, Inter, JetBrains_Mono } from 'next/font/google'
=======
import { Barlow, Barlow_Condensed } from 'next/font/google'
>>>>>>> 6941afd (Add AI company prep module, Barlow fonts, live jobs expire filter, 3-col grids, placement drives auto-expire)
>>>>>>> fa191379276f47ebf9aec1dc7ac9ea965a345f20
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { AnalyticsProvider } from '@/components/analytics/analytics-provider'
import './globals.css'

<<<<<<< HEAD
// Primary font — warm, professional, premium SaaS feel
const jakarta = Plus_Jakarta_Sans({
=======
<<<<<<< HEAD
// Brand headings & hero text
const geist = Geist({
>>>>>>> fa191379276f47ebf9aec1dc7ac9ea965a345f20
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300","400","500","600","700","800"],
  display: "swap",
})

// Scores, rankings, code, numbers
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400","500","600","700","800"],
<<<<<<< HEAD
  display: "swap",
=======
=======
// F1-style display font — Barlow Condensed: wide, clean, technical
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
})

// Body font — Barlow: clean readable companion
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
>>>>>>> 6941afd (Add AI company prep module, Barlow fonts, live jobs expire filter, 3-col grids, placement drives auto-expire)
>>>>>>> fa191379276f47ebf9aec1dc7ac9ea965a345f20
})

export const metadata: Metadata = {
  title: 'CodeHiring - Where Coding Skills Meet Opportunities',
  description: 'CodeHiring unifies student coding performance across all platforms, gives colleges placement analytics, and helps recruiters find verified talent.',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png',  media: '(prefers-color-scheme: dark)'  },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
<<<<<<< HEAD
      <body className={`${jakarta.variable} ${jetbrainsMono.variable} font-sans antialiased`} suppressHydrationWarning>
=======
<<<<<<< HEAD
      <body className={`${geist.variable} ${inter.variable} ${jetbrainsMono.variable} font-ui antialiased`} suppressHydrationWarning>
=======
      <body className={`${barlowCondensed.variable} ${barlow.variable} antialiased`} suppressHydrationWarning>
>>>>>>> 6941afd (Add AI company prep module, Barlow fonts, live jobs expire filter, 3-col grids, placement drives auto-expire)
>>>>>>> fa191379276f47ebf9aec1dc7ac9ea965a345f20
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="codehiring-theme"
        >
          <AnalyticsProvider>
            {children}
            <Toaster />
          </AnalyticsProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
