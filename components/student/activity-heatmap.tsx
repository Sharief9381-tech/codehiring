"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Flame, Activity, Hash } from "lucide-react"

interface ActivityHeatmapProps {
  linkedPlatforms?: Record<string, any>
  lcCalendar?: Record<string, number>
  cfSubmissions?: { creationTimeSeconds: number; verdict: string }[]
  recentActivity?: { platform: string; timestamp: string | Date; type: string }[]
  streak?: number
  ghContributions?: number
}

interface DayData {
  date: Date
  dateStr: string
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
  spoj:         "#f97316",
  kattis:       "#a855f7",
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
  spoj:         "SPOJ",
  kattis:       "Kattis",
}

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

function toDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function levelColor(n: number): string {
  if (n === 0) return "bg-zinc-800"
  if (n <= 1)  return "bg-emerald-950"
  if (n <= 3)  return "bg-emerald-700"
  if (n <= 7)  return "bg-emerald-500"
  return              "bg-emerald-300"
}

function buildMap(
  linkedPlatforms: Record<string, any>,
  lcCalendar?: Record<string, number>,
  cfSubmissions?: { creationTimeSeconds: number; verdict: string }[],
  recentActivity?: { platform: string; timestamp: string | Date; type: string }[]
): Record<string, DayData> {

  // Build Jan 1 → Dec 31 of current year
  const year = new Date().getFullYear()
  const map: Record<string, DayData> = {}
  const cur = new Date(year, 0, 1)
  const end = new Date(year, 11, 31)
  while (cur <= end) {
    const s = toDateStr(cur)
    map[s] = { date: new Date(cur), dateStr: s, total: 0, platforms: {} }
    cur.setDate(cur.getDate() + 1)
  }

  Object.entries(linkedPlatforms).forEach(([pid, pd]) => {
    if (!pd || typeof pd !== "object") return
    const s = pd.stats
    if (!s) return

    if (pid === "leetcode") {
      if (s.submissionCalendar && typeof s.submissionCalendar === "object") {
        Object.entries(s.submissionCalendar as Record<string, number>).forEach(([ts, cnt]) => {
          const d = new Date(Number(ts) * 1000); d.setHours(0,0,0,0)
          const k = toDateStr(d)
          if (map[k]) { map[k].platforms.leetcode = (map[k].platforms.leetcode||0)+Number(cnt); map[k].total += Number(cnt) }
        })
      }
      // No fallback — if no calendar data, show nothing
    }

    if (pid === "codeforces") {
      const subs: any[] = s.submissions || []
      // Only plot actual timestamped submissions
      subs.filter((x: any) => x.verdict === "OK").forEach((sub: any) => {
        const d = new Date(sub.creationTimeSeconds * 1000); d.setHours(0,0,0,0)
        const k = toDateStr(d)
        if (map[k]) { map[k].platforms.codeforces = (map[k].platforms.codeforces||0)+1; map[k].total += 1 }
      })
    }

    if (pid === "github") {
      const weeks = s.contributionCalendar?.weeks
      if (weeks && Array.isArray(weeks) && weeks.length > 0) {
        weeks.forEach((w: any) => {
          ;(w.contributionDays || []).forEach((day: any) => {
            const k: string = day.date
            const cnt = day.contributionCount || 0
            if (k && map[k] && cnt > 0) { map[k].platforms.github = (map[k].platforms.github||0)+cnt; map[k].total += cnt }
          })
        })
      }
      // No calendar without GITHUB_TOKEN — show nothing for github
    }

    if (pid === "codechef") {
      // heatMap from codechef-api.vercel.app: { "YYYY-MM-DD": count }
      if (s.heatMap && typeof s.heatMap === "object") {
        Object.entries(s.heatMap as Record<string, number>).forEach(([date, cnt]) => {
          const k = date.slice(0, 10) // ensure YYYY-MM-DD
          if (map[k] && cnt > 0) {
            map[k].platforms.codechef = (map[k].platforms.codechef || 0) + Number(cnt)
            map[k].total += Number(cnt)
          }
        })
      }
      // No heatmap data → show nothing
    }

    // AtCoder: acSubmissions[] from kenkoooo API { epoch_second, problem_id }
    if (pid === "atcoder") {
      const acSubs: any[] = s.acSubmissions || []
      acSubs.forEach((sub: any) => {
        if (!sub.epoch_second) return
        const d = new Date(sub.epoch_second * 1000); d.setHours(0,0,0,0)
        const k = toDateStr(d)
        if (map[k]) { map[k].platforms.atcoder = (map[k].platforms.atcoder||0)+1; map[k].total += 1 }
      })
    }
  })

  // Legacy fallback
  if (lcCalendar && !linkedPlatforms.leetcode) {
    Object.entries(lcCalendar).forEach(([ts, cnt]) => {
      const d = new Date(Number(ts) * 1000); d.setHours(0,0,0,0)
      const k = toDateStr(d)
      if (map[k]) { map[k].platforms.leetcode = (map[k].platforms.leetcode||0)+Number(cnt); map[k].total += Number(cnt) }
    })
  }
  if (cfSubmissions && !linkedPlatforms.codeforces) {
    cfSubmissions.filter(x => x.verdict === "OK").forEach(sub => {
      const d = new Date(sub.creationTimeSeconds * 1000); d.setHours(0,0,0,0)
      const k = toDateStr(d)
      if (map[k]) { map[k].platforms.codeforces = (map[k].platforms.codeforces||0)+1; map[k].total += 1 }
    })
  }
  if (recentActivity) {
    recentActivity.forEach(act => {
      if (act.type !== "problem_solved" && act.type !== "contribution") return
      const d = new Date(act.timestamp); d.setHours(0,0,0,0)
      const k = toDateStr(d)
      if (map[k] && !map[k].platforms[act.platform]) { map[k].platforms[act.platform] = 1; map[k].total += 1 }
    })
  }

  return map
}

export function ActivityHeatmap({
  linkedPlatforms = {},
  lcCalendar,
  cfSubmissions,
  recentActivity = [],
  streak = 0,
}: ActivityHeatmapProps) {
  const [tooltip, setTooltip] = useState<{ day: DayData; x: number; y: number } | null>(null)

  const { weeks, months, totalActive, totalSubmissions } = useMemo(() => {
    const map = buildMap(linkedPlatforms, lcCalendar, cfSubmissions, recentActivity)
    const allDays = Object.values(map).sort((a, b) => a.date.getTime() - b.date.getTime())

    // Pad the first week so Jan 1 starts on the correct weekday
    const startPad = allDays[0].date.getDay() // 0=Sun
    const padded: (DayData | null)[] = [...Array(startPad).fill(null), ...allDays]

    const wks: (DayData | null)[][] = []
    for (let i = 0; i < padded.length; i += 7) wks.push(padded.slice(i, i + 7))

    // One month label per month — placed at the week column where that month first appears
    const monthLabels: { label: string; col: number }[] = []
    let lastMonth = -1
    wks.forEach((week, wi) => {
      const first = week.find(d => d !== null)
      if (first && first.date.getMonth() !== lastMonth) {
        lastMonth = first.date.getMonth()
        monthLabels.push({ label: MONTH_NAMES[lastMonth], col: wi })
      }
    })

    const totalActive = allDays.filter(d => d.total > 0).length
    const totalSubmissions = allDays.reduce((acc, d) => acc + d.total, 0)

    return { weeks: wks, months: monthLabels, totalActive, totalSubmissions }
  }, [linkedPlatforms, lcCalendar, cfSubmissions, recentActivity])

  // cell = 12px, gap = 2px → 14px per column
  const CELL = 14

  return (
    <div className="select-none w-full">

      {/* Outer layout: fixed weekday labels + scrollable (months + grid) together */}
      <div className="flex gap-0.5">

        {/* Weekday labels — fixed, not scrollable */}
        <div className="flex flex-col w-7 shrink-0">
          {/* spacer for month labels row */}
          <div className="h-4 mb-1" />
          {/* day labels */}
          {["","Mon","","Wed","","Fri",""].map((lbl, i) => (
            <div key={i} className="text-[9px] text-muted-foreground h-[12px] leading-[12px] text-right pr-1 mb-[2px]">{lbl}</div>
          ))}
        </div>

        {/* Scrollable area — months row + grid cells scroll together */}
        <div className="overflow-x-auto pb-1 flex-1">

          {/* Month labels row */}
          <div className="relative h-4 mb-1" style={{ minWidth: `${weeks.length * CELL}px` }}>
            {months.map(({ label, col }) => (
              <span
                key={label}
                className="absolute text-[10px] text-muted-foreground leading-none whitespace-nowrap"
                style={{ left: `${col * CELL}px` }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Grid cells */}
          <div className="flex gap-[2px]" style={{ minWidth: `${weeks.length * CELL}px` }}>
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[2px] shrink-0">
                {week.map((day, di) =>
                  !day ? (
                    <div key={di} className="w-[12px] h-[12px]" />
                  ) : (
                    <div
                      key={di}
                      className={`w-[12px] h-[12px] rounded-[2px] cursor-default ${levelColor(day.total)} hover:ring-1 hover:ring-white/30 hover:scale-125 transition-transform`}
                      onMouseEnter={e => {
                        const r = (e.target as HTMLElement).getBoundingClientRect()
                        setTooltip({ day, x: r.left, y: r.top })
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  )
                )}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Platform breakdown — problems solved per platform */}
      {(() => {
        const platformTotals: Record<string, number> = {}
        Object.values(weeks).forEach(week =>
          week.forEach(day => {
            if (!day) return
            Object.entries(day.platforms).forEach(([pid, cnt]) => {
              platformTotals[pid] = (platformTotals[pid] || 0) + cnt
            })
          })
        )
        const entries = Object.entries(platformTotals).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])
        if (!entries.length) return null
        return (
          <div className="flex flex-wrap gap-2 mt-3">
            {entries.map(([pid, cnt]) => (
              <div key={pid} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary border border-border text-xs">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PLATFORM_COLORS[pid] || "#64748b" }} />
                <span className="text-muted-foreground">{PLATFORM_LABELS[pid] || pid}</span>
                <span className="font-bold text-foreground tabular-nums">{cnt}</span>
              </div>
            ))}
          </div>
        )
      })()}

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-2 text-[10px] text-muted-foreground">
        <span>Less</span>
        {[0,1,3,5,9].map((n, i) => (
          <div key={i} className={`w-[12px] h-[12px] rounded-[2px] shrink-0 ${levelColor(n)}`} />
        ))}
        <span>More</span>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-5 mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-500 shrink-0" />
          <div>
            <p className="text-sm font-bold text-foreground tabular-nums">{streak} Days</p>
            <p className="text-[10px] text-muted-foreground">Current Streak</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-500 shrink-0" />
          <div>
            <p className="text-sm font-bold text-foreground tabular-nums">{totalActive}</p>
            <p className="text-[10px] text-muted-foreground">Active Days</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-blue-400 shrink-0" />
          <div>
            <p className="text-sm font-bold text-foreground tabular-nums">{totalSubmissions.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">Total Activity</p>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.1 }}
            className="fixed z-50 pointer-events-none"
            style={{ left: Math.max(8, tooltip.x - 75), top: tooltip.y - (Object.keys(tooltip.day.platforms).length ? 95 : 55) }}
          >
            <div className="bg-popover border border-border rounded-xl shadow-2xl px-3 py-2.5 min-w-[155px]">
              <p className="text-[11px] font-semibold text-foreground mb-1.5">
                {tooltip.day.date.toLocaleDateString("en-US", { weekday:"short", month:"short", day:"numeric", year:"numeric" })}
              </p>
              {tooltip.day.total === 0 ? (
                <p className="text-[10px] text-muted-foreground">No activity</p>
              ) : (
                <>
                  <p className="text-[11px] font-bold text-emerald-400 mb-1.5">
                    {tooltip.day.total} problem{tooltip.day.total !== 1 ? "s" : ""}
                  </p>
                  <div className="space-y-1">
                    {Object.entries(tooltip.day.platforms).map(([pid, cnt]) => (
                      <div key={pid} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PLATFORM_COLORS[pid] || "#64748b" }} />
                          <span className="text-[10px] text-muted-foreground">{PLATFORM_LABELS[pid] || pid}</span>
                        </div>
                        <span className="text-[10px] font-bold text-foreground tabular-nums">{cnt}</span>
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
