"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts"
import { TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react"

interface MonthData { month: string; problems: number }

// Custom dot that animates in
function AnimatedDot(props: any) {
  const { cx, cy, value } = props
  if (!value) return null
  return (
    <circle
      cx={cx} cy={cy} r={5}
      fill="#818cf8"
      stroke="hsl(var(--card))"
      strokeWidth={2}
      style={{ filter: "drop-shadow(0 0 4px rgba(129,140,248,0.6))" }}
    />
  )
}

// Custom tooltip
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-border bg-popover shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-foreground mb-0.5">{label}</p>
      <p className="text-violet-400 font-bold text-base">{payload[0].value} problems</p>
    </div>
  )
}

export function MonthlyProblemsChart() {
  const [data, setData]           = useState<MonthData[]>([])
  const [year, setYear]           = useState(new Date().getFullYear())
  const [availableYears, setAvailableYears] = useState<number[]>([new Date().getFullYear()])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/student/monthly-stats?year=${year}`)
      .then(r => r.json())
      .then(d => {
        setData(d.data || [])
        if (d.availableYears?.length) setAvailableYears(d.availableYears)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [year])

  // Trend: compare current month vs previous month
  const now = new Date()
  const curMonthIdx  = now.getFullYear() === year ? now.getMonth() : data.length - 1
  const prevMonthIdx = curMonthIdx - 1
  const curVal  = data[curMonthIdx]?.problems  ?? 0
  const prevVal = data[prevMonthIdx]?.problems ?? 0
  const diff    = curVal - prevVal
  const trendPct = prevVal > 0 ? Math.round(Math.abs(diff / prevVal) * 100) : null

  const TrendIcon  = diff > 0 ? TrendingUp : diff < 0 ? TrendingDown : Minus
  const trendColor = diff > 0 ? "text-emerald-500" : diff < 0 ? "text-red-500" : "text-muted-foreground"
  const trendLabel = diff > 0
    ? `+${diff} vs ${data[prevMonthIdx]?.month ?? "prev"}`
    : diff < 0
    ? `${diff} vs ${data[prevMonthIdx]?.month ?? "prev"}`
    : "Same as last month"

  const maxVal = Math.max(...data.map(d => d.problems), 1)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4 text-violet-500" />
              Problems Solved Per Month
            </CardTitle>
            <CardDescription className="mt-0.5">Monthly coding activity overview</CardDescription>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Trend indicator */}
            <div className={`flex items-center gap-1.5 text-xs font-semibold ${trendColor}`}>
              <TrendIcon className="h-3.5 w-3.5" />
              <span>{trendLabel}</span>
              {trendPct !== null && <span className="text-muted-foreground font-normal">({trendPct}%)</span>}
            </div>

            {/* Year filter */}
            <select
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className="text-xs rounded-lg border border-border bg-background text-foreground px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
            >
              {availableYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[260px]">
            <div className="h-5 w-5 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                domain={[0, Math.ceil(maxVal * 1.15)]}
              />

              <Tooltip
                cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1, strokeDasharray: "4 2" }}
                content={<CustomTooltip />}
              />

              {/* Highlight current month */}
              {data[curMonthIdx] && (
                <ReferenceLine
                  x={data[curMonthIdx].month}
                  stroke="hsl(var(--border))"
                  strokeDasharray="4 2"
                  label={{ value: "now", position: "top", fill: "#94a3b8", fontSize: 10 }}
                />
              )}

              <Line
                type="monotone"
                dataKey="problems"
                stroke="#818cf8"
                strokeWidth={2.5}
                dot={<AnimatedDot />}
                activeDot={{ r: 7, fill: "#818cf8", stroke: "hsl(var(--card))", strokeWidth: 2 }}
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-out"
                name="Problems"
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {/* Month summary strip */}
        {!loading && (
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1 mt-3 pt-3 border-t border-border">
            {data.map((d, i) => {
              const isCurrent = i === curMonthIdx
              const pct = maxVal > 0 ? (d.problems / maxVal) * 100 : 0
              return (
                <div key={d.month} className="flex flex-col items-center gap-1">
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isCurrent ? "bg-violet-400" : "bg-violet-500/50"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className={`text-[9px] leading-none ${isCurrent ? "text-violet-400 font-semibold" : "text-muted-foreground/60"}`}>
                    {d.month}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
