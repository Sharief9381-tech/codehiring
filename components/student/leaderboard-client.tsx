"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award, Users, Globe, Building2, TrendingUp } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  name: string
  email: string
  collegeCode: string
  branch: string
  graduationYear: number | null
  problems: number
  rating: number
  contests: number
  platforms: string[]
}

interface LeaderboardData {
  global: LeaderboardEntry[]
  college: Record<string, LeaderboardEntry[]>
  totalStudents: number
}

// ── Sub-components ────────────────────────────────────────────────────────────

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/50">
        <Trophy className="h-4 w-4 text-yellow-400" />
      </div>
    )
  if (rank === 2)
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-400/20 border border-gray-400/50">
        <Medal className="h-4 w-4 text-gray-300" />
      </div>
    )
  if (rank === 3)
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-700/20 border border-amber-700/50">
        <Award className="h-4 w-4 text-amber-600" />
      </div>
    )
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 border border-gray-700">
      <span className="text-xs font-bold text-gray-400">#{rank}</span>
    </div>
  )
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-800 bg-gray-900/50 hover:bg-gray-800/50 transition-all">
      <div className="w-10 shrink-0 text-center">
        <RankBadge rank={entry.rank} />
      </div>

      <div className="flex-1 min-w-0">
        <span className="font-semibold text-white truncate block">{entry.name}</span>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
          {entry.collegeCode && <span>{entry.collegeCode}</span>}
          {entry.branch && (
            <>
              <span>·</span>
              <span>{entry.branch}</span>
            </>
          )}
          {entry.graduationYear && (
            <>
              <span>·</span>
              <span>{entry.graduationYear}</span>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-6 text-sm">
        <div className="text-center">
          <div className="font-bold text-emerald-400">{entry.problems}</div>
          <div className="text-xs text-gray-500">Problems</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-blue-400">{entry.rating || "—"}</div>
          <div className="text-xs text-gray-500">Rating</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-purple-400">{entry.contests}</div>
          <div className="text-xs text-gray-500">Contests</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-orange-400">{entry.platforms.length}</div>
          <div className="text-xs text-gray-500">Platforms</div>
        </div>
      </div>

      {/* Mobile: just problems */}
      <div className="sm:hidden font-bold text-lg text-emerald-400 w-16 text-right">
        {entry.problems}
      </div>
    </div>
  )
}

function TableHeader() {
  return (
    <div className="hidden sm:flex items-center gap-4 px-4 py-2 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-800 mb-2">
      <div className="w-10 text-center">Rank</div>
      <div className="flex-1">Student</div>
      <div className="flex items-center gap-6 text-right">
        <div className="w-16 text-center">Problems</div>
        <div className="w-16 text-center">Rating</div>
        <div className="w-16 text-center">Contests</div>
        <div className="w-16 text-center">Platforms</div>
      </div>
    </div>
  )
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-lg border border-gray-800 bg-gray-900/50 animate-pulse"
        >
          <div className="w-8 h-8 rounded-full bg-gray-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-700 rounded w-1/3" />
            <div className="h-3 bg-gray-800 rounded w-1/4" />
          </div>
          <div className="hidden sm:flex gap-6">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="text-center space-y-1">
                <div className="h-4 bg-gray-700 rounded w-10" />
                <div className="h-3 bg-gray-800 rounded w-10" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function LeaderboardClient() {
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCollege, setSelectedCollege] = useState<string>("")

  useEffect(() => {
    fetch("/api/student/leaderboard")
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        // Default to first college in the list
        const colleges = Object.keys(d.college ?? {})
        if (colleges.length > 0) setSelectedCollege(colleges[0])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const topSolver = data?.global[0]
  const colleges = Object.keys(data?.college ?? {})
  const collegeEntries = selectedCollege ? (data?.college[selectedCollege] ?? []) : []

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 border-blue-700">
          <CardContent className="p-4 flex items-center gap-3">
            <Globe className="h-8 w-8 text-blue-400" />
            <div>
              <div className="text-2xl font-bold text-white">
                {loading ? "—" : (data?.totalStudents ?? 0)}
              </div>
              <div className="text-sm text-blue-300">Total Students</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 border-emerald-700">
          <CardContent className="p-4 flex items-center gap-3">
            <Building2 className="h-8 w-8 text-emerald-400" />
            <div>
              <div className="text-2xl font-bold text-white">
                {loading ? "—" : colleges.length}
              </div>
              <div className="text-sm text-emerald-300">Colleges</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900 via-yellow-800 to-yellow-900 border-yellow-700">
          <CardContent className="p-4 flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold text-white truncate max-w-[120px]">
                {loading ? "—" : (topSolver?.name ?? "—")}
              </div>
              <div className="text-sm text-yellow-300">
                Top Solver · {topSolver?.problems ?? 0} problems
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="global">
        <TabsList className="bg-gray-900 border border-gray-700">
          <TabsTrigger
            value="global"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white gap-2"
          >
            <Globe className="h-4 w-4" />
            Global
          </TabsTrigger>
          <TabsTrigger
            value="college"
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white gap-2"
          >
            <Building2 className="h-4 w-4" />
            By College
          </TabsTrigger>
        </TabsList>

        {/* ── Global tab ── */}
        <TabsContent value="global" className="mt-4">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-white">
                <Globe className="h-5 w-5 text-blue-400" />
                Global Rankings
              </CardTitle>
              <CardDescription className="text-gray-400">
                All students ranked by total problems solved across all platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <LeaderboardSkeleton />
              ) : data?.global.length ? (
                <>
                  <TableHeader />
                  <div className="space-y-2">
                    {data.global.map((entry) => (
                      <LeaderboardRow key={entry.email || entry.rank} entry={entry} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                  <p className="text-gray-400">No students found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Students will appear here once they connect platforms and sync stats
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── College tab ── */}
        <TabsContent value="college" className="mt-4">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-white">
                <Building2 className="h-5 w-5 text-emerald-400" />
                College Rankings
              </CardTitle>
              <CardDescription className="text-gray-400">
                Students ranked within their college
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* College selector */}
              {colleges.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {colleges.map((code) => (
                    <button
                      key={code}
                      onClick={() => setSelectedCollege(code)}
                      className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                        selectedCollege === code
                          ? "bg-emerald-600 border-emerald-500 text-white"
                          : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              )}

              {loading ? (
                <LeaderboardSkeleton />
              ) : collegeEntries.length ? (
                <>
                  <TableHeader />
                  <div className="space-y-2">
                    {collegeEntries.map((entry) => (
                      <LeaderboardRow key={entry.email || entry.rank} entry={entry} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                  <p className="text-gray-400">No college data available</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Students need a college code set in their profile to appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
