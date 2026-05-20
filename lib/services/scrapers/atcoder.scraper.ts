/**
 * AtCoder scraper
 * Uses AtCoder's public JSON endpoints — no scraping needed.
 *   Profile verify : https://atcoder.jp/users/{u}
 *   Contest history: https://atcoder.jp/users/{u}/history/json
 *   AC rank        : https://kenkoooo.com/atcoder/atcoder-api/v3/user/ac_rank?user={u}
 */
import type { NormalizedPlatformStats } from "../scraper-types"
import { failResult, fetchHTML, fetchJSON } from "../scraper-utils"

const PLATFORM = "atcoder"

function rankFromRating(r: number): string {
  if (r >= 3200) return "Red"
  if (r >= 2800) return "Orange"
  if (r >= 2400) return "Yellow"
  if (r >= 2000) return "Blue"
  if (r >= 1600) return "Cyan"
  if (r >= 1200) return "Green"
  if (r >= 800)  return "Brown"
  if (r > 0)     return "Gray"
  return "Unrated"
}

export async function scrapeAtCoder(username: string): Promise<NormalizedPlatformStats> {
  let u = username.trim().replace(/^https?:\/\/atcoder\.jp\/users\//i, "").replace(/\/$/, "")
  if (!u || !/^[a-zA-Z0-9_]+$/.test(u)) return failResult(PLATFORM, username, "Invalid username")

  const profileUrl = `https://atcoder.jp/users/${u}`

  // 1. Verify profile exists
  const html = await fetchHTML(profileUrl, { timeoutMs: 12000 })
  if (!html) return failResult(PLATFORM, u, "Profile not found")
  if (html.includes("ユーザーが見つかりません") || html.includes("User not found")) {
    return failResult(PLATFORM, u, "User not found")
  }

  // 2. Contest history → current rating + highest rating
  let rating = 0, highestRating = 0, contests = 0
  const history = await fetchJSON<any[]>(`${profileUrl}/history/json`, { timeoutMs: 12000 })
  if (Array.isArray(history) && history.length > 0) {
    rating        = history[history.length - 1]?.NewRating ?? 0
    highestRating = Math.max(...history.map((c) => c.NewRating ?? 0))
    contests      = history.length
  }

  // 3. Problems solved via kenkoooo AC rank API
  let solved = 0
  const acRank = await fetchJSON<any>(
    `https://kenkoooo.com/atcoder/atcoder-api/v3/user/ac_rank?user=${u}`,
    { timeoutMs: 10000 }
  )
  if (acRank?.count !== undefined) solved = acRank.count

  const rank = rankFromRating(rating)

  return {
    platform: PLATFORM, username: u, verified: true, profileUrl,
    fetchedAt: new Date().toISOString(),
    stats: { solved, ranking: rank, rating, streak: 0, score: 0, contests },
    rawStats: { rating, highestRating, rank, problemsSolved: solved, contestsParticipated: contests },
  }
}
