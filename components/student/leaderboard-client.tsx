"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award, Users, Globe, Building2, Star } from "lucide-react"

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
  isMe: boolean
}

interface LeaderboardData {
  global: LeaderboardEntry[]
  college: LeaderboardEntry[]
  myCollege: string | null
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/50">
      <Trophy className="h-4 w-4 text-yellow-400" />
    </div>
  )
  if (rank === 2) return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-400/20 border border-gray-400/50">
      <Medal className="h-4 w-4 text-gray-300" />
    </div>
  )
  if (rank === 3) return (
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
    <div className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
      entry.isMe
        ? "bg-blue-900/30 border-blue-500/50 shadow-lg shadow-blue-500/10"
        : "bg-gray-900/50 border-gray-800 hover:bg-gray-800/50"
    }`}>
      {/* Rank column */}
      <div className="w-10 shrink-0 text-center">
        <RankBadge rank={entry.rank} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-semibold truncate ${entry.isMe ? "text-blue-300" : "text-white"}`}>
            {entry.name}
          </span>
          {entry.isMe && (
            <Badge className="bg-blue-600 text-white border-blue-500 text-xs shrink-0">You</Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
          {entry.collegeCode && <span>{entry.collegeCode}</span>}
          {entry.branch && <><span>·</span><span>{entry.branch}</span></>}
          {entry.graduationYear && <><span>·</span><span>{entry.graduationYear}</span></>}
        </div>
      </div>

      {/* Problems Solved */}
      <div className={`font-bold text-lg w-20 text-right ${entry.isMe ? "text-blue-300" : "text-emerald-400"}`}>
        {entry.problems}
      </div>
    </div>
  )
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-gray-800 bg-gray-900/50 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-gray-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-700 rounded w-1/3" />
            <div className="h-3 bg-gray-800 rounded w-1/4" />
          </div>
          <div className="hidden sm:flex gap-6">
            {[1,2,3,4].map(j => (
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

function TableHeader() {
  return (
    <div className="flex items-center gap-4 px-4 py-2 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-800 mb-2">
      <div className="w-10 text-center">Rank</div>
      <div className="flex-1">Student</div>
      <div className="w-20 text-right">Problems</div>
    </div>
  )
}

export function LeaderboardClient() {
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/student/leaderboard")
      .then(r => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      {/* Stats summary */}
      {data && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 border-blue-700">
            <CardContent className="p-4 flex items-center gap-3">
              <Globe className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{data.global.length}</div>
                <div className="text-sm text-blue-300">Global Students</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 border-emerald-700">
            <CardContent className="p-4 flex items-center gap-3">
              <Building2 className="h-8 w-8 text-emerald-400" />
              <div>
                <div className="text-2xl font-bold text-white">{data.college.length}</div>
                <div className="text-sm text-emerald-300">
                  {data.myCollege ? `${data.myCollege} Students` : "College Students"}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 border-purple-700">
            <CardContent className="p-4 flex items-center gap-3">
              <Star className="h-8 w-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  #{data.global.find(e => e.isMe)?.rank ?? "—"}
                </div>
                <div className="text-sm text-purple-300">Your Global Rank</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="global">
        <TabsList className="bg-gray-900 border border-gray-700">
          <TabsTrigger value="global" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white gap-2">
            <Globe className="h-4 w-4" />
            Global Leaderboard
          </TabsTrigger>
          <TabsTrigger value="college" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white gap-2">
            <Building2 className="h-4 w-4" />
            College Leaderboard
          </TabsTrigger>
        </TabsList>

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
                    {data.global.map(entry => (
                      <LeaderboardRow key={entry.email || entry.rank} entry={entry} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                  <p className="text-gray-400">No students found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="college" className="mt-4">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-white">
                <Building2 className="h-5 w-5 text-emerald-400" />
                {data?.myCollege ? `${data.myCollege} Rankings` : "College Rankings"}
              </CardTitle>
              <CardDescription className="text-gray-400">
                Students from your college ranked by total problems solved
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <LeaderboardSkeleton />
              ) : data?.college.length ? (
                <>
                  <TableHeader />
                  <div className="space-y-2">
                    {data.college.map(entry => (
                      <LeaderboardRow key={entry.email || entry.rank} entry={entry} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                  <p className="text-gray-400 mb-1">No college data available</p>
                  <p className="text-sm text-gray-500">
                    {data?.myCollege
                      ? `No other students found for ${data.myCollege}`
                      : "Your college code may not be set in your profile"}
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
