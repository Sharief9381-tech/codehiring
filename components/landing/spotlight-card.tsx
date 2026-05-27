"use client"

import { useRef, useState, type MouseEvent, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  /** CSS color for the spotlight glow, e.g. "rgba(139,92,246,0.15)" */
  spotlightColor?: string
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(139,92,246,0.13)",
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card transition-[border-color] duration-300",
        className
      )}
    >
      {/* Spotlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(280px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />
      {/* Content sits above the overlay */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
