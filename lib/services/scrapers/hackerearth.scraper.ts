/**
 * HackerEarth scraper
 * HackerEarth has no public API. We scrape the profile page HTML.
 * Profile URL: https://www.hackerearth.com/@{username}
 */
import type { NormalizedPlatformStats } from "../scraper-types"
import { failResult, fetchHTML, extractInt, extractStr } from "../scraper-utils"

const PLATFORM = "hackerearth"

export async function scrapeHackerEarth(username: string): Promise<NormalizedPlatformStats> {
  let u = username.trim().replace(/^https?:\/\/(?:www\.)?hackerearth\.com\/@?/i, "").replace(/\/$/, "")
  if (!u) return failResult(PLATFORM, username, "Invalid username")

  const profileUrl = `https://www.hackerearth.com/@${u}`
  const html = await fetchHTML(profileUrl, { timeoutMs: 15000 })

  if (!html) return failResult(PLATFORM, u, "Profile not found")
  if (html.includes("Page Not Found") || html.includes("404") || html.includes("user-not-found")) {
    return failResult(PLATFORM, u, "User not found")
  }

  // HackerEarth embeds JSON in window.__INITIAL_STATE__ or similar
  // Also try direct regex on visible text
  const rating   = extractInt(html, /"rating"\s*:\s*(\d+)/, /Rating[:\s]+(\d+)/i)
  const solved   = extractInt(html, /"problems_solved"\s*:\s*(\d+)/, /Problems Solved[:\s]+(\d+)/i, /(\d+)\s*problems?\s*solved/i)
  const gRank    = extractInt(html, /"global_rank"\s*:\s*(\d+)/, /Global Rank[:\s]+(\d+)/i)
  const score    = extractInt(html, /"score"\s*:\s*(\d+)/, /Score[:\s]+(\d+)/i)
  const name     = extractStr(html, /<title>([^|<]+)/i, /"full_name"\s*:\s*"([^"]+)"/)

  // Verify the page actually belongs to this user
  if (!html.toLowerCase().includes(u.toLowerCase()) && rating === 0 && solved === 0) {
    return failResult(PLATFORM, u, "User not found")
  }

  return {
    platform: PLATFORM, username: u, verified: true, profileUrl,
    fetchedAt: new Date().toISOString(),
    stats: { solved, ranking: gRank > 0 ? `#${gRank}` : "", rating, streak: 0, score, contests: 0 },
    rawStats: { name: name || u, rating, globalRank: gRank, problemsSolved: solved, score },
  }
}
