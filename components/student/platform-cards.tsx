"use client"

import { useEffect, useState } from "react"
import { ExternalLink, Loader2, RefreshCw, Trash2, CheckCircle2, Plus } from "lucide-react"
import type { StudentProfile } from "@/lib/types"
import type { LeetCodeStats } from "@/lib/platforms/leetcode"
import type { GitHubStats } from "@/lib/platforms/github"
import type { CodeforcesStats } from "@/lib/platforms/codeforces"
import type { CodeChefStats } from "@/lib/platforms/codechef"

interface PlatformCardsProps {
  student: StudentProfile
}

type PlatformStats = {
  leetcode: LeetCodeStats | null
  github: GitHubStats | null
  codeforces: CodeforcesStats | null
  codechef: CodeChefStats | null
}

const PLATFORMS = [
  { id: "leetcode",    name: "LeetCode",    color: "#FFA116", icon: "</>", bg: "#FFA11615", url: "https://leetcode.com" },
  { id: "github",      name: "GitHub",      color: "#238636", icon: "⌥",   bg: "#23863615", url: "https://github.com"  },
  { id: "codeforces",  name: "Codeforces",  color: "#1890FF", icon: "CF",  bg: "#1890FF15", url: "https://codeforces.com" },
  { id: "codechef",    name: "CodeChef",    color: "#5B4638", icon: "CC",  bg: "#8B6B5715", url: "https://codechef.com" },
]

export function PlatformCards({ student }: PlatformCardsProps) {
  const [stats, setStats] = useState<PlatformStats>({ leetcode: null, github: null, codeforces: null, codechef: null })
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [showConnect, setShowConnect] = useState(false)
  const [connectPlatform, setConnectPlatform] = useState("")
  const [connectUsername, setConnectUsername] = useState("")
  const [connectLoading, setConnectLoading] = useState(false)
  const [connectError, setConnectError] = useState("")

  const linkedPlatforms = student.linkedPlatforms || {}

  const fetchStats = async (platform: string, username: string) => {
    setLoading(p => ({ ...p, [platform]: true }))
    try {
      const res = await fetch(`/api/platforms?platform=${platform}&username=${username}`)
      if (res.ok) {
        const data = await res.json()
        setStats(p => ({ ...p, [platform]: data.stats }))
      }
    } catch {}
    finally { setLoading(p => ({ ...p, [platform]: false })) }
  }

  useEffect(() => {
    for (const [platform, platformData] of Object.entries(linkedPlatforms)) {
      if (platformData) {
        const username = typeof platformData === "object" ? (platformData as any).username : platformData
        if (username) fetchStats(platform, username)
      }
    }
  }, [])

  const handleConnect = async () => {
    if (!connectPlatform || !connectUsername.trim()) return
    setConnectLoading(true)
    setConnectError("")
    try {
      const res = await fetch("/api/student/link-platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: connectPlatform, username: connectUsername.trim() }),
      })
      if (res.ok) {
        await fetchStats(connectPlatform, connectUsername.trim())
        setShowConnect(false)
        setConnectUsername("")
        window.location.reload()
      } else {
        setConnectError("Failed to link. Check the username and try again.")
      }
    } catch { setConnectError("Network error") }
    finally { setConnectLoading(false) }
  }

  const handleRemove = async (platformId: string) => {
    try {
      await fetch("/api/student/link-platform", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: platformId }),
      })
      setStats(p => ({ ...p, [platformId]: null }))
      window.location.reload()
    } catch {}
  }

  const getUsername = (platformId: string): string | null => {
    const raw = linkedPlatforms[platformId as keyof typeof linkedPlatforms]
    if (!raw) return null
    return typeof raw === "object" ? (raw as any).username : raw
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-foreground">Connected Platforms</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Link your coding profiles to track progress</p>
        </div>
        <button
          onClick={() => { setShowConnect(v => !v); setConnectError("") }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white transition-all"
          style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
          <Plus className="h-3.5 w-3.5" /> Link Platform
        </button>
      </div>

      {/* Connect form */}
      {showConnect && (
        <div className="rounded-xl border border-primary/30 bg-card p-4 space-y-3">
          <p className="text-sm font-semibold text-foreground">Link a Platform</p>
          {/* Platform selector */}
          <div className="grid grid-cols-4 gap-2">
            {PLATFORMS.map(p => (
              <button key={p.id} onClick={() => setConnectPlatform(p.id)}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all text-xs font-semibold"
                style={{
                  borderColor: connectPlatform === p.id ? p.color : "transparent",
                  background: connectPlatform === p.id ? p.bg : "rgba(255,255,255,0.04)",
                  color: connectPlatform === p.id ? p.color : "#71717a",
                }}>
                <span className="text-base font-black">{p.icon}</span>
                {p.name}
              </button>
            ))}
          </div>
          {/* Username input */}
          <div className="flex gap-2">
            <input
              value={connectUsername}
              onChange={e => setConnectUsername(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleConnect()}
              placeholder={connectPlatform ? `Your ${PLATFORMS.find(p=>p.id===connectPlatform)?.name} username` : "Select a platform first"}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
            <button onClick={handleConnect}
              disabled={!connectPlatform || !connectUsername.trim() || connectLoading}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-40 transition-all"
              style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
              {connectLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Link"}
            </button>
          </div>
          {connectError && <p className="text-xs text-red-400">{connectError}</p>}
        </div>
      )}

      {/* Platform cards — LeetCode style */}
      <div className="grid gap-4 sm:grid-cols-2">
        {PLATFORMS.map(platform => {
          const username   = getUsername(platform.id)
          const pStats     = stats[platform.id as keyof PlatformStats]
          const isLoading  = loading[platform.id]
          const isLinked   = !!username

          return (
            <div key={platform.id}
              className="rounded-2xl border overflow-hidden"
              style={{ borderColor: isLinked ? `${platform.color}30` : "rgba(255,255,255,0.08)", background: "#18181b" }}>

              {/* Orange left bar (like screenshot) */}
              <div className="flex" style={{ borderLeft: `3px solid ${isLinked ? platform.color : "transparent"}` }}>
                <div className="flex-1 p-4 space-y-3">

                  {/* Top row: icon + name + total solved */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black"
                        style={{ background: platform.bg, color: platform.color }}>
                        {platform.icon}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{platform.name}</p>
                        {username
                          ? <p className="text-xs text-muted-foreground">@{username}</p>
                          : <p className="text-xs text-muted-foreground">Not connected</p>}
                      </div>
                    </div>
                    {isLinked && !isLoading && pStats && platform.id === "leetcode" && (
                      <p className="text-sm font-black text-foreground">
                        {(pStats as LeetCodeStats).totalSolved} <span className="font-normal text-muted-foreground text-xs">solved</span>
                      </p>
                    )}
                    {isLinked && !isLoading && pStats && platform.id === "codeforces" && (
                      <p className="text-sm font-black" style={{ color: platform.color }}>
                        {(pStats as CodeforcesStats).rating} <span className="font-normal text-muted-foreground text-xs">rating</span>
                      </p>
                    )}
                    {isLinked && !isLoading && pStats && platform.id === "github" && (
                      <p className="text-sm font-black text-foreground">
                        {(pStats as GitHubStats).totalContributions} <span className="font-normal text-muted-foreground text-xs">contrib</span>
                      </p>
                    )}
                    {isLinked && !isLoading && pStats && platform.id === "codechef" && (
                      <p className="text-sm font-black" style={{ color: platform.color }}>
                        {(pStats as CodeChefStats).stars} <span className="font-normal text-muted-foreground text-xs">stars</span>
                      </p>
                    )}
                  </div>

                  {/* Stats body */}
                  {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : !isLinked ? (
                    <button onClick={() => { setShowConnect(true); setConnectPlatform(platform.id) }}
                      className="w-full py-2 rounded-xl border border-dashed border-border text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all">
                      + Connect {platform.name}
                    </button>
                  ) : !pStats ? (
                    <p className="text-xs text-muted-foreground text-center py-2">Click refresh to load stats</p>
                  ) : (
                    <>
                      {/* LeetCode stats */}
                      {platform.id === "leetcode" && (() => {
                        const s = pStats as LeetCodeStats
                        return (
                          <div className="space-y-2">
                            <p className="text-[11px] text-muted-foreground">Problems Solved</p>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="text-center">
                                <p className="text-xl font-black text-green-400">{s.easySolved}</p>
                                <p className="text-[10px] text-muted-foreground">Easy</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xl font-black text-yellow-400">{s.mediumSolved}</p>
                                <p className="text-[10px] text-muted-foreground">Medium</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xl font-black text-red-400">{s.hardSolved}</p>
                                <p className="text-[10px] text-muted-foreground">Hard</p>
                              </div>
                            </div>
                            {((s as any).ranking || (s as any).contributionPoints) && (
                              <div className="grid grid-cols-2 gap-2 pt-1">
                                {(s as any).ranking && (
                                  <div className="text-center">
                                    <p className="text-sm font-black text-blue-400">{Number((s as any).ranking).toLocaleString()}</p>
                                    <p className="text-[10px] text-muted-foreground">Global Ranking</p>
                                  </div>
                                )}
                                {(s as any).contributionPoints && (
                                  <div className="text-center">
                                    <p className="text-sm font-black text-purple-400">{(s as any).contributionPoints}</p>
                                    <p className="text-[10px] text-muted-foreground">Contribution Points</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })()}

                      {/* GitHub stats */}
                      {platform.id === "github" && (() => {
                        const s = pStats as GitHubStats
                        return (
                          <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-lg bg-white/5 p-3 text-center">
                              <p className="text-lg font-black text-green-400">{s.totalContributions}</p>
                              <p className="text-[10px] text-muted-foreground">Contributions</p>
                            </div>
                            <div className="rounded-lg bg-white/5 p-3 text-center">
                              <p className="text-lg font-black text-foreground">{s.publicRepos}</p>
                              <p className="text-[10px] text-muted-foreground">Repositories</p>
                            </div>
                            {(s as any).followers !== undefined && (
                              <div className="rounded-lg bg-white/5 p-3 text-center">
                                <p className="text-lg font-black text-foreground">{(s as any).followers}</p>
                                <p className="text-[10px] text-muted-foreground">Followers</p>
                              </div>
                            )}
                            {(s as any).stars !== undefined && (
                              <div className="rounded-lg bg-white/5 p-3 text-center">
                                <p className="text-lg font-black text-yellow-400">{(s as any).stars}</p>
                                <p className="text-[10px] text-muted-foreground">Stars</p>
                              </div>
                            )}
                          </div>
                        )
                      })()}

                      {/* Codeforces stats */}
                      {platform.id === "codeforces" && (() => {
                        const s = pStats as CodeforcesStats
                        return (
                          <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-lg bg-white/5 p-3 text-center">
                              <p className="text-lg font-black" style={{ color: platform.color }}>{s.rating}</p>
                              <p className="text-[10px] text-muted-foreground">Rating</p>
                            </div>
                            <div className="rounded-lg bg-white/5 p-3 text-center">
                              <p className="text-sm font-black text-foreground capitalize">{s.rank}</p>
                              <p className="text-[10px] text-muted-foreground">Rank</p>
                            </div>
                            {s.maxRating && (
                              <div className="rounded-lg bg-white/5 p-3 text-center">
                                <p className="text-lg font-black text-purple-400">{s.maxRating}</p>
                                <p className="text-[10px] text-muted-foreground">Max Rating</p>
                              </div>
                            )}
                          </div>
                        )
                      })()}

                      {/* CodeChef stats */}
                      {platform.id === "codechef" && (() => {
                        const s = pStats as CodeChefStats
                        return (
                          <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-lg bg-white/5 p-3 text-center">
                              <p className="text-lg font-black" style={{ color: platform.color }}>{s.currentRating || "—"}</p>
                              <p className="text-[10px] text-muted-foreground">Rating</p>
                            </div>
                            <div className="rounded-lg bg-white/5 p-3 text-center">
                              <p className="text-lg font-black text-yellow-400">{s.stars}</p>
                              <p className="text-[10px] text-muted-foreground">Stars</p>
                            </div>
                            {s.globalRank && (
                              <div className="rounded-lg bg-white/5 p-3 text-center">
                                <p className="text-sm font-black text-blue-400">{s.globalRank}</p>
                                <p className="text-[10px] text-muted-foreground">Global Rank</p>
                              </div>
                            )}
                            {s.problemsSolved && (
                              <div className="rounded-lg bg-white/5 p-3 text-center">
                                <p className="text-lg font-black text-green-400">{s.problemsSolved}</p>
                                <p className="text-[10px] text-muted-foreground">Solved</p>
                              </div>
                            )}
                          </div>
                        )
                      })()}
                    </>
                  )}

                  {/* Bottom bar */}
                  {isLinked && (
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
                      <a href={`${platform.url}/${username}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:opacity-80"
                        style={{ color: platform.color }}>
                        <ExternalLink className="h-3.5 w-3.5" /> View Details
                      </a>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" /> Verified
                        </span>
                        <button onClick={() => username && fetchStats(platform.id, username)} disabled={isLoading}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground transition-all">
                          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                        </button>
                        <button onClick={() => handleRemove(platform.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
