/**
 * TopCoder scraper
 * Uses TopCoder's public v5 REST API — no scraping needed.
 *   Member info : https://api.topcoder.com/v5/members/{username}
 *   Member stats: https://api.topcoder.com/v5/members/{username}/stats
 */
import type { NormalizedPlatformStats } from "../scraper-types"
import { failResult, fetchJSON } from "../scraper-utils"

const PLATFORM = "topcoder"
const BASE = "https://api.topcoder.com/v5/members"

function rankFromRating(r: number): string {
  if (r >= 3000) return "Target"
  if (r >= 2200) return "Red"
  if (r >= 1500) return "Yellow"
  if (r >= 1200) return "Blue"
  if (r >= 900)  return "Green"
  if (r > 0)     return "Gray"
  return "Unrated"
}

export async function scrapeTopCoder(username: string): Promise<NormalizedPlatformStats> {
  let u = username.trim().replace(/^https?:\/\/(?:www\.)?topcoder\.com\/members\//i, "").replace(/\/$/, "")
  if (!u) return failResult(PLATFORM, username, "Invalid username")

  const profileUrl = `https://www.topcoder.com/members/${u}`

  // 1. Member info
  const info = await fetchJSON<any>(`${BASE}/${u}`, {
    headers: { Accept: "application/json" },
    timeoutMs: 12000,
  })

  if (!info || (!info.handle && !info.userId)) {
    return failResult(PLATFORM, u, "User not found")
  }

  // 2. Member stats (best-effort)
  const statsData = await fetchJSON<any>(`${BASE}/${u}/stats`, {
    headers: { Accept: "application/json" },
    timeoutMs: 12000,
  })

  // TopCoder stats structure: { DATA_SCIENCE: { SRM: { challenges, wins, ... } }, DEVELOP: {...} }
  const srm      = statsData?.DATA_SCIENCE?.SRM ?? {}
  const develop  = statsData?.DEVELOP ?? {}
  const contests = (srm.challenges ?? 0) + (develop.challenges ?? 0)
  const wins     = (srm.wins ?? 0) + (develop.wins ?? 0)

  const rating   = info.maxRating?.rating ?? srm.maxRating ?? 0
  const rank     = rankFromRating(rating)

  return {
    platform: PLATFORM, username: u, verified: true, profileUrl,
    fetchedAt: new Date().toISOString(),
    stats: { solved: 0, ranking: rank, rating, streak: 0, score: 0, contests },
    rawStats: {
      handle: info.handle ?? u,
      rating,
      maxRating: info.maxRating?.rating ?? 0,
      rank,
      wins,
      contestsParticipated: contests,
      tracks: Object.keys(statsData ?? {}),
    },
  }
}
