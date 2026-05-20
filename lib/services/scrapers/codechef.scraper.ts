/**
 * CodeChef scraper
 * Primary: community JSON API
 * Fallback: HTML scraping of profile page
 */
import type { NormalizedPlatformStats } from "../scraper-types"
import { failResult, fetchJSON, fetchHTML, extractInt, extractStr } from "../scraper-utils"

const PLATFORM = "codechef"

function starsFromRating(r: number): string {
  if (r >= 2500) return "7*"
  if (r >= 2200) return "6*"
  if (r >= 2000) return "5*"
  if (r >= 1800) return "4*"
  if (r >= 1600) return "3*"
  if (r >= 1400) return "2*"
  return "1*"
}

export async function scrapeCodeChef(username: string): Promise<NormalizedPlatformStats> {
  const u = username.trim().replace(/^https?:\/\/(?:www\.)?codechef\.com\/users\//i, "").replace(/\/$/, "")
  if (!u || !/^[a-zA-Z0-9_]+$/.test(u)) return failResult(PLATFORM, username, "Invalid username")

  // ── 1. Community JSON API ──────────────────────────────────────────────
  const api = await fetchJSON<any>(`https://codechef-api.vercel.app/${u}`, { timeoutMs: 10000 })
  if (api && !api.error && (api.currentRating !== undefined || api.rating !== undefined)) {
    const rating   = api.currentRating ?? api.rating ?? 0
    const highest  = api.highestRating ?? api.maxRating ?? rating
    const gRank    = api.globalRank ?? api.global_rank ?? 0
    const cRank    = api.countryRank ?? api.country_rank ?? 0
    const solved   = api.problemsSolved ?? api.fullySolved?.count ?? api.solved ?? 0
    const stars    = api.stars ?? starsFromRating(rating)
    const contests = api.ratingData?.length ?? 0

    return {
      platform: PLATFORM, username: u, verified: true,
      profileUrl: `https://www.codechef.com/users/${u}`,
      fetchedAt: new Date().toISOString(),
      stats: { solved, ranking: stars, rating, streak: 0, score: 0, contests },
      rawStats: { currentRating: rating, highestRating: highest, stars, globalRank: gRank, countryRank: cRank, problemsSolved: solved },
    }
  }

  // ── 2. HTML scraping fallback ──────────────────────────────────────────
  const html = await fetchHTML(`https://www.codechef.com/users/${u}`, { timeoutMs: 14000 })
  if (!html) return failResult(PLATFORM, u, "Profile not found")

  if (html.includes("User not found") || html.includes("404")) {
    return failResult(PLATFORM, u, "User not found")
  }

  const rating   = extractInt(html, /"currentRating"\s*:\s*(\d+)/, /Rating:\s*(\d+)/i)
  const highest  = extractInt(html, /"highestRating"\s*:\s*(\d+)/, /Highest Rating:\s*(\d+)/i)
  const gRank    = extractInt(html, /"globalRank"\s*:\s*(\d+)/, /Global Rank:\s*(\d+)/i)
  const cRank    = extractInt(html, /"countryRank"\s*:\s*(\d+)/, /Country Rank:\s*(\d+)/i)
  const solved   = extractInt(html, /Total Problems Solved:\s*(\d+)/i, /"problemsSolved"\s*:\s*(\d+)/)
  const stars    = extractStr(html, /(\d+)[★*]\s*(?:Coder|rated)/i) || starsFromRating(rating)

  if (rating === 0 && solved === 0 && gRank === 0) {
    return failResult(PLATFORM, u, "Could not parse profile data")
  }

  return {
    platform: PLATFORM, username: u, verified: true,
    profileUrl: `https://www.codechef.com/users/${u}`,
    fetchedAt: new Date().toISOString(),
    stats: { solved, ranking: stars, rating, streak: 0, score: 0, contests: 0 },
    rawStats: { currentRating: rating, highestRating: highest || rating, stars, globalRank: gRank, countryRank: cRank, problemsSolved: solved },
  }
}
