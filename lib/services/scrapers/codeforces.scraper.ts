/**
 * Codeforces scraper
 * Uses the official public REST API — no scraping needed.
 */
import type { NormalizedPlatformStats } from "../scraper-types"
import { failResult, fetchJSON } from "../scraper-utils"

const PLATFORM = "codeforces"

export async function scrapeCodeforces(username: string): Promise<NormalizedPlatformStats> {
  const u = username.trim().replace(/^https?:\/\/codeforces\.com\/profile\//i, "").replace(/\/$/, "")
  if (!u) return failResult(PLATFORM, username, "Invalid username")

  // 1. User info
  const info = await fetchJSON<any>(`https://codeforces.com/api/user.info?handles=${u}`, { timeoutMs: 10000 })
  if (!info || info.status !== "OK" || !info.result?.[0]) {
    return failResult(PLATFORM, u, "User not found")
  }
  const user = info.result[0]

  // 2. Contest history (for contests count)
  const ratingData = await fetchJSON<any>(`https://codeforces.com/api/user.rating?handle=${u}`, { timeoutMs: 10000 })
  const contests = ratingData?.status === "OK" ? (ratingData.result?.length ?? 0) : 0

  // 3. Submissions (count distinct AC problems)
  const subsData = await fetchJSON<any>(`https://codeforces.com/api/user.status?handle=${u}&from=1&count=1000`, { timeoutMs: 12000 })
  let solved = 0
  if (subsData?.status === "OK") {
    const acSet = new Set<string>()
    for (const s of subsData.result ?? []) {
      if (s.verdict === "OK") acSet.add(`${s.problem.contestId}-${s.problem.index}`)
    }
    solved = acSet.size
  }

  const rating = user.rating ?? 0
  const maxRating = user.maxRating ?? 0
  const rank = user.rank ?? "unrated"

  return {
    platform: PLATFORM,
    username: u,
    verified: true,
    profileUrl: `https://codeforces.com/profile/${u}`,
    fetchedAt: new Date().toISOString(),
    stats: { solved, ranking: rank, rating, streak: 0, score: 0, contests },
    rawStats: { rating, maxRating, rank, maxRank: user.maxRank ?? "unrated", contribution: user.contribution ?? 0, friendOfCount: user.friendOfCount ?? 0, avatar: user.avatar ?? "" },
  }
}
