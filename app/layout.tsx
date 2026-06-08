import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { AnalyticsProvider } from '@/components/analytics/analytics-provider'
import './globals.css'

// Brand headings & hero text
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
})

// UI, body, content
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300","400","500","600","700"],
})

// Scores, rankings, code, numbers
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400","500","600","700","800"],
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
      <body className={`${geist.variable} ${inter.variable} ${jetbrainsMono.variable} font-ui antialiased`} suppressHydrationWarning>
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
