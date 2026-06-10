"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Flame, Activity } from "lucide-react"

interface ActivityHeatmapProps {
  // LeetCode submission calendar: unix timestamp → count
  lcCalendar?: Record<string, number>
  // Codeforces submissions with real timestamps
  cfSubmissions?: { creationTimeSeconds: number; verdict: string }[]
  // GitHub contributions total
  ghContributions?: number
  // recentActivity events (platform, timestamp, type)
  recentActivity?: { platform: string; timestamp: string | Date; type: string }[]
  streak?: number
}

interface DayData {
  date: Date
  dateStr: string    // YYYY-MM-DD
  total: number
  platforms: Record<string, number>
}

const PLATFORM_COLORS: Record<string, string> = {
  leetcode:     "#FFA116",
  codeforces:   "#1890FF",
  github:       "#238636",
  codechef:     "#f97316",
  hackerrank:   "#00EA64",
  geeksforgeeks:"#2F8D46",
  hackerearth:  "#6366f1",
  atcoder:      "#8b5cf6",
}

const PLATFORM_LABELS: Record<string, string> = {
  leetcode:     "LeetCode",
  codeforces:   "Codeforces",
  github:       "GitHub",
  codechef:     "CodeChef",
  hackerrank:   "HackerRank",
  geeksforgeeks:"GeeksforGeeks",
  hackerearth:  "HackerEarth",
  atcoder:      "AtCoder",
}

function toDateStr(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function levelColor(count: number): string {
  if (count === 0) return "bg-muted dark:bg-zinc-800/60"
  if (count <= 1)  return "bg-emerald-200 dark:bg-emerald-900"
  if (count <= 3)  return "bg-emerald-400 dark:bg-emerald-700"
  if (count <= 6)  return "bg-emerald-500 dark:bg-emerald-500"
  return                  "bg-emerald-700 dark:bg-emerald-400"
}

export function ActivityHeatmap({
  lcCalendar = {},
  cfSubmissions = [],
  ghContributions = 0,
  recentActivity = [],
  streak = 0,
}: ActivityHeatmapProps) {
  const [tooltip, setTooltip] = useState<{ day: DayData; x: number; y: number } | null>(null)

  // Build day map for last 365 days
  const { days, totalActive, months } = useMemo(() => {
    const map: Record<string, DayData> = {}

    // Fill all 365 days with empty entries
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const s = toDateStr(d)
      map[s] = { date: d, dateStr: s, total: 0, platforms: {} }
    }

    // LeetCode submission calendar (unix timestamp keys)
    Object.entries(lcCalendar).forEach(([ts, count]) => {
      const d = new Date(Number(ts) * 1000)
      d.setHours(0, 0, 0, 0)
      const s = toDateStr(d)
      if (map[s]) {
        map[s].platforms.leetcode = (map[s].platforms.leetcode || 0) + Number(count)
        map[s].total += Number(count)
      }
    })

    // Codeforces submissions with real timestamps
    cfSubmissions.filter(s => s.verdict === "OK").forEach(sub => {
      const d = new Date(sub.creationTimeSeconds * 1000)
      d.setHours(0, 0, 0, 0)
      const s = toDateStr(d)
      if (map[s]) {
        map[s].platforms.codeforces = (map[s].platforms.codeforces || 0) + 1
        map[s].total += 1
      }
    })

    // recentActivity events (approximate — only have ~20 entries)
    recentActivity.forEach(act => {
      if (act.type !== "problem_solved" && act.type !== "contribution") return
      const d = new Date(act.timestamp)
      d.setHours(0, 0, 0, 0)
      const s = toDateStr(d)
      if (map[s] && act.platform !== "leetcode" && act.platform !== "codeforces") {
        map[s].platforms[act.platform] = (map[s].platforms[act.platform] || 0) + 1
        map[s].total += 1
      }
    })

    // Sort days oldest → newest
    const allDays = Object.values(map).sort((a, b) => a.date.getTime() - b.date.getTime())

    // Build week columns (pad so first day starts on correct weekday)
    const firstDay = allDays[0]
    const startPad = firstDay.date.getDay() // 0=Sun
    const paddedDays: (DayData | null)[] = [...Array(startPad).fill(null), ...allDays]

    // Group into weeks
    const weeks: (DayData | null)[][] = []
    for (let i = 0; i < paddedDays.length; i += 7) {
      weeks.push(paddedDays.slice(i, i + 7))
    }

    // Month labels
    const monthLabels: { label: string; col: number }[] = []
    let lastMonth = -1
    weeks.forEach((week, wi) => {
      const firstReal = week.find(d => d !== null)
      if (firstReal) {
        const m = firstReal.date.getMonth()
        if (m !== lastMonth) {
          monthLabels.push({ label: firstReal.date.toLocaleString("default", { month: "short" }), col: wi })
          lastMonth = m
        }
      }
    })

    const totalActive = allDays.filter(d => d.total > 0).length

    return { days: weeks, totalActive, months: monthLabels }
  }, [lcCalendar, cfSubmissions, recentActivity])

  const weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

  return (
    <div className="relative">
      {/* Month labels */}
      <div className="flex mb-1 ml-8">
        {months.map(({ label, col }) => (
          <div key={`${label}-${col}`} className="text-[10px] text-muted-foreground absolute"
            style={{ left: `${col * 14 + 32}px` }}>
            {label}
          </div>
        ))}
        <div className="h-4" />
      </div>

      <div className="flex gap-1 mt-3">
        {/* Day labels */}
        <div className="flex flex-col gap-0.5 mr-1">
          {weekdays.map((d, i) => (
            <div key={d} className="text-[9px] text-muted-foreground h-[11px] leading-[11px]">
              {i % 2 === 1 ? d.slice(0,3) : ""}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-0.5 overflow-x-auto pb-1">
          {days.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((day, di) => {
                if (!day) return <div key={di} className="w-[11px] h-[11px]" />
                return (
                  <div
                    key={di}
                    className={`w-[11px] h-[11px] rounded-[2px] cursor-default transition-all ${levelColor(day.total)} hover:ring-1 hover:ring-primary/60 hover:scale-110`}
                    onMouseEnter={e => {
                      const rect = (e.target as HTMLElement).getBoundingClientRect()
                      setTooltip({ day, x: rect.left, y: rect.top })
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-2 text-[10px] text-muted-foreground">
        <span>Less</span>
        {["bg-muted dark:bg-zinc-800/60","bg-emerald-200 dark:bg-emerald-900","bg-emerald-400 dark:bg-emerald-700","bg-emerald-500","bg-emerald-700 dark:bg-emerald-400"].map((c,i)=>(
          <div key={i} className={`w-[11px] h-[11px] rounded-[2px] ${c}`}/>
        ))}
        <span>More</span>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-6 mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-500"/>
          <div>
            <p className="text-sm font-bold text-foreground tabular-nums">{streak} Days</p>
            <p className="text-[10px] text-muted-foreground">Current Streak</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-500"/>
          <div>
            <p className="text-sm font-bold text-foreground tabular-nums">{totalActive} Days</p>
            <p className="text-[10px] text-muted-foreground">Total Active Days</p>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 pointer-events-none"
            style={{ left: tooltip.x - 60, top: tooltip.y - (Object.keys(tooltip.day.platforms).length > 0 ? 80 : 50) }}>
            <div className="bg-popover border border-border rounded-xl shadow-xl px-3 py-2.5 min-w-[140px]">
              <p className="text-[11px] font-semibold text-foreground mb-1.5">
                {tooltip.day.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
              </p>
              {tooltip.day.total === 0 ? (
                <p className="text-[10px] text-muted-foreground">No activity</p>
              ) : (
                <>
                  <p className="text-[11px] font-bold text-foreground mb-1.5">
                    {tooltip.day.total} submission{tooltip.day.total !== 1 ? "s" : ""}
                  </p>
                  <div className="space-y-1">
                    {Object.entries(tooltip.day.platforms).map(([pid, count]) => (
                      <div key={pid} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: PLATFORM_COLORS[pid] || "#64748b" }}/>
                          <span className="text-[10px] text-muted-foreground">
                            {PLATFORM_LABELS[pid] || pid}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-foreground tabular-nums">{count}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
