/**
 * Coding Ninjas (CodeStudio) scraper
 * Profile URL: https://www.naukri.com/code360/profile/{username}
 *              (old: https://www.codingninjas.com/studio/profile/{username})
 *
 * Coding Ninjas migrated to Naukri Code360. Both URLs redirect to the same page.
 * The page is a React SPA — stats are embedded in a <script id="__NEXT_DATA__"> tag.
 */
import type { NormalizedPlatformStats } from "../scraper-types"
import { failResult, fetchHTML, extractInt, extractStr } from "../scraper-utils"

const PLATFORM = "codingninjas"

export async function scrapeCodingNinjas(username: string): Promise<NormalizedPlatformStats> {
  let u = username.trim()
    .replace(/^https?:\/\/(?:www\.)?(?:naukri\.com\/code360|codingninjas\.com\/studio)\/profile\//i, "")
    .replace(/\/$/, "")
  if (!u) return failResult(PLATFORM, username, "Invalid username")

  // Try both URLs — Naukri Code360 is the current one
  const urls = [
    `https://www.naukri.com/code360/profile/${u}`,
    `https://www.codingninjas.com/studio/profile/${u}`,
  ]

  let html: string | null = null
  let profileUrl = urls[0]

  for (const url of urls) {
    const { fetchHTML: fh } = await import("../scraper-utils")
    html = await fh(url, { timeoutMs: 15000 })
    if (html && !html.includes("404") && !html.includes("Page Not Found")) {
      profileUrl = url
      break
    }
  }

  if (!html) return failResult(PLATFORM, u, "Profile not found")
  if (html.includes("User not found") || html.includes("Profile not found")) {
    return failResult(PLATFORM, u, "User not found")
  }

  // Try __NEXT_DATA__ first
  let solved = 0, score = 0, rank = 0, streak = 0

  const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]+?)<\/script>/)
  if (nextDataMatch) {
    try {
      const nd = JSON.parse(nextDataMatch[1])
      const props = nd?.props?.pageProps ?? nd?.props ?? {}
      // Navigate common paths
      const profile = props?.profileData ?? props?.userProfile ?? props?.data ?? {}
      solved = profile?.problemsSolved ?? profile?.problems_solved ?? profile?.totalSolved ?? 0
      score  = profile?.score ?? profile?.points ?? 0
      rank   = profile?.rank ?? profile?.globalRank ?? 0
      streak = profile?.streak ?? profile?.currentStreak ?? 0
    } catch { /* ignore parse errors */ }
  }

  // Fallback: regex on raw HTML
  if (solved === 0) solved = extractInt(html, /"problems_solved"\s*:\s*(\d+)/, /Problems Solved[:\s]+(\d+)/i, /(\d+)\s*problems?\s*solved/i)
  if (score  === 0) score  = extractInt(html, /"score"\s*:\s*(\d+)/, /Score[:\s]+(\d+)/i)
  if (rank   === 0) rank   = extractInt(html, /"rank"\s*:\s*(\d+)/, /Rank[:\s]+#?(\d+)/i)
  if (streak === 0) streak = extractInt(html, /"streak"\s*:\s*(\d+)/, /Streak[:\s]+(\d+)/i)

  if (!html.toLowerCase().includes(u.toLowerCase()) && solved === 0 && score === 0) {
    return failResult(PLATFORM, u, "User not found")
  }

  return {
    platform: PLATFORM, username: u, verified: true, profileUrl,
    fetchedAt: new Date().toISOString(),
    stats: { solved, ranking: rank > 0 ? `#${rank}` : "", rating: score, streak, score, contests: 0 },
    rawStats: { problemsSolved: solved, score, rank, streakDays: streak },
  }
}
