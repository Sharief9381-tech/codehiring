"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Users, Globe, Building2, TrendingUp, Star } from "lucide-react"

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

interface MyRank {
  globalRank: number | null
  collegeRank: number | null
  totalGlobal: number
  totalCollege: number
  myProblems: number
  myCollege: string | null
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/50">
      <Trophy className="h-4 w-4 text-yellow-400" />
    </div>
  )
  if (rank === 2) return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/50 border border-border">
      <Medal className="h-4 w-4 text-muted-foreground" />
    </div>
  )
  if (rank === 3) return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-700/20 border border-amber-700/50">
      <Award className="h-4 w-4 text-amber-600" />
    </div>
  )
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary border border-border">
      <span className="text-xs font-bold text-muted-foreground">#{rank}</span>
    </div>
  )
}

function LeaderboardRow({ entry, isMe }: { entry: LeaderboardEntry; isMe?: boolean }) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
      isMe
        ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
        : "border-border bg-card/50 hover:bg-secondary/50"
    }`}>
      <div className="w-10 shrink-0 text-center">
        <RankBadge rank={entry.rank} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground truncate block">{entry.name}</span>
          {isMe && <Badge className="text-xs bg-primary/10 text-primary border-primary/20 shrink-0">You</Badge>}
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
          {entry.collegeCode && <span>{entry.collegeCode}</span>}
          {entry.branch && <><span>·</span><span>{entry.branch}</span></>}
          {entry.graduationYear && <><span>·</span><span>{entry.graduationYear}</span></>}
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-6 text-sm">
        <div className="text-center">
          <div className={`font-bold ${isMe ? "text-primary" : "text-emerald-400"}`}>{entry.problems}</div>
          <div className="text-xs text-muted-foreground">Problems</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-blue-400">{entry.rating || "—"}</div>
          <div className="text-xs text-muted-foreground">Rating</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-purple-400">{entry.contests}</div>
          <div className="text-xs text-muted-foreground">Contests</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-orange-400">{entry.platforms.length}</div>
          <div className="text-xs text-muted-foreground">Platforms</div>
        </div>
      </div>
      <div className="sm:hidden font-bold text-lg text-emerald-400 w-16 text-right">
        {entry.problems}
      </div>
    </div>
  )
}

function TableHeader() {
  return (
    <div className="hidden sm:flex items-center gap-4 px-4 py-2 text-xs text-muted-foreground uppercase tracking-wider border-b border-border mb-2">
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
        <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card/50 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-3 bg-secondary rounded w-1/4" />
          </div>
          <div className="hidden sm:flex gap-6">
            {[1, 2, 3, 4].map(j => (
              <div key={j} className="text-center space-y-1">
                <div className="h-4 bg-muted rounded w-10" />
                <div className="h-3 bg-secondary rounded w-10" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function MyRankCard({ myRank }: { myRank: MyRank }) {
  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex flex-wrap gap-6 items-center">
      <div className="flex items-center gap-2">
        <Star className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Your Position</span>
      </div>
      <div className="flex flex-wrap gap-6">
        <div className="text-center">
          <p className="text-2xl font-black text-primary">
            {myRank.globalRank != null ? `#${myRank.globalRank}` : "—"}
          </p>
          <p className="text-xs text-muted-foreground">Global Rank</p>
          {myRank.totalGlobal > 0 && <p className="text-xs text-muted-foreground">of {myRank.totalGlobal}</p>}
        </div>
        {myRank.collegeRank != null && (
          <div className="text-center">
            <p className="text-2xl font-black text-emerald-500">#{myRank.collegeRank}</p>
            <p className="text-xs text-muted-foreground">College Rank</p>
            {myRank.totalCollege > 0 && <p className="text-xs text-muted-foreground">of {myRank.totalCollege}</p>}
          </div>
        )}
        <div className="text-center">
          <p className="text-2xl font-black text-foreground">{myRank.myProblems}</p>
          <p className="text-xs text-muted-foreground">Problems Solved</p>
        </div>
      </div>
    </div>
  )
}

function renderList(entries: LeaderboardEntry[], myEmail: string | null) {
  return (
    <>
      <TableHeader />
      <div className="space-y-2">
        {entries.map(entry => (
          <LeaderboardRow
            key={entry.email || entry.rank}
            entry={entry}
            isMe={!!myEmail && entry.email === myEmail}
          />
        ))}
      </div>
    </>
  )
}

export function LeaderboardClient() {
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [myRank, setMyRank] = useState<MyRank | null>(null)
  const [myEmail, setMyEmail] = useState<string | null>(null)
  const [isGraduate, setIsGraduate] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedCollege, setSelectedCollege] = useState<string>("")

  useEffect(() => {
    const safeJson = (url: string) =>
      fetch(url)
        .then(r => (r.ok ? r.json() : null))
        .catch(() => null)

    Promise.all([
      safeJson("/api/student/leaderboard"),
      safeJson("/api/student/ranking"),
      safeJson("/api/auth/user"),
    ]).then(([leaderboard, ranking, user]) => {
      if (leaderboard) setData(leaderboard)
      if (ranking)     setMyRank(ranking)
      const u = user?.user
      if (u) {
        setMyEmail(u?.email ?? null)
        const grad = !!u?.isGraduate || (u?.graduationYear && u.graduationYear <= new Date().getFullYear())
        setIsGraduate(!!grad)
        const myCollege = ranking?.myCollege
        if (!grad && myCollege && leaderboard?.college?.[myCollege]) {
          setSelectedCollege(myCollege)
        }
      }
    }).finally(() => setLoading(false))
  }, [])

  const topSolver = data?.global[0]
  const colleges = Object.keys(data?.college ?? {})
  const myCollege = myRank?.myCollege ?? ""
  const collegeEntries = selectedCollege ? (data?.college[selectedCollege] ?? []) : []

  return (
    <div className="space-y-6">

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/student/leaderboard">
          <Card className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 border-blue-700 cursor-pointer hover:scale-[1.02] transition-transform">
            <CardContent className="p-4 flex items-center gap-3">
              <Globe className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-foreground">{loading ? "—" : (data?.totalStudents ?? 0)}</div>
                <div className="text-sm text-blue-300">Total Students</div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/student/leaderboard">
          <Card className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 border-emerald-700 cursor-pointer hover:scale-[1.02] transition-transform">
            <CardContent className="p-4 flex items-center gap-3">
              <Trophy className="h-8 w-8 text-emerald-400" />
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {loading ? "—" : myRank?.globalRank != null ? `#${myRank.globalRank}` : "—"}
                </div>
                <div className="text-sm text-emerald-300">Your Global Rank</div>
              </div>
            </CardContent>
          </Card>
        </Link>        <Link href="/student/leaderboard">
          <Card className="bg-gradient-to-br from-yellow-900 via-yellow-800 to-yellow-900 border-yellow-700 cursor-pointer hover:scale-[1.02] transition-transform">
            <CardContent className="p-4 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-foreground truncate max-w-[120px]">{loading ? "—" : (topSolver?.name ?? "—")}</div>
                <div className="text-sm text-yellow-300">Top Solver · {topSolver?.problems ?? 0} problems</div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Tabs defaultValue="global">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="global" className="data-[state=active]:bg-blue-600 data-[state=active]:text-foreground gap-2">
            <Globe className="h-4 w-4" />Global
          </TabsTrigger>
          {!isGraduate && (
            <TabsTrigger value="college" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-foreground gap-2">
              <Building2 className="h-4 w-4" />By College
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="global" className="mt-4">
          <Card className="bg-card/50 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Globe className="h-5 w-5 text-blue-400" />Global Rankings
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                All students ranked by total problems solved
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? <LeaderboardSkeleton /> : data?.global.length
                ? renderList(data.global, myEmail)
                : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No students found</p>
                    <p className="text-sm text-muted-foreground mt-1">Connect platforms and sync stats to appear here</p>
                  </div>
                )
              }
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="college" className="mt-4">
          <Card className="bg-card/50 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Building2 className="h-5 w-5 text-emerald-400" />My College
                {selectedCollege && (
                  <span className="text-base font-semibold text-emerald-500 ml-1">— {selectedCollege}</span>
                )}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {collegeEntries.length} student{collegeEntries.length !== 1 ? "s" : ""} ranked within your college
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? <LeaderboardSkeleton /> : collegeEntries.length
                ? renderList(collegeEntries, myEmail)
                : (
                  <div className="text-center py-12">
                    <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No college data available</p>
                    <p className="text-sm text-muted-foreground mt-1">Make sure your college code is set in your profile</p>
                  </div>
                )
              }
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
