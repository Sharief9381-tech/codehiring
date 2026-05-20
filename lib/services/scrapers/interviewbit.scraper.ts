/**
 * InterviewBit scraper
 * InterviewBit has no public API. We scrape the profile page HTML.
 * Profile URL: https://www.interviewbit.com/profile/{username}
 *
 * The page embeds a JSON blob in a <script> tag with keys like:
 *   score, rank, problems_solved, streak_days
 */
import type { NormalizedPlatformStats } from "../scraper-types"
import { failResult, fetchHTML, extractInt, extractStr } from "../scraper-utils"

const PLATFORM = "interviewbit"

export async function scrapeInterviewBit(username: string): Promise<NormalizedPlatformStats> {
  let u = username.trim().replace(/^https?:\/\/(?:www\.)?interviewbit\.com\/profile\//i, "").replace(/\/$/, "")
  if (!u) return failResult(PLATFORM, username, "Invalid username")

  const profileUrl = `https://www.interviewbit.com/profile/${u}`
  const html = await fetchHTML(profileUrl, { timeoutMs: 15000 })

  if (!html) return failResult(PLATFORM, u, "Profile not found")
  if (html.includes("User not found") || html.includes("Profile not found") || html.includes("404 Not Found")) {
    return failResult(PLATFORM, u, "User not found")
  }

  // InterviewBit embeds stats in JSON inside <script> tags
  // Try to extract from JSON blobs first
  let score = 0, rank = 0, solved = 0, streak = 0

  // JSON blob patterns
  const jsonMatch = html.match(/"score"\s*:\s*(\d+)/)
  if (jsonMatch) score = parseInt(jsonMatch[1])

  rank   = extractInt(html, /"rank"\s*:\s*(\d+)/, /Rank[:\s]+#?(\d+)/i)
  solved = extractInt(html, /"problems_solved"\s*:\s*(\d+)/, /"solved"\s*:\s*(\d+)/, /Problems Solved[:\s]+(\d+)/i)
  streak = extractInt(html, /"streak_days"\s*:\s*(\d+)/, /Streak[:\s]+(\d+)/i)

  // If score still 0, try visible text patterns
  if (score === 0) {
    score = extractInt(html, /Score[:\s]+(\d+)/i, /(\d+)\s*points?/i)
  }

  // Confirm the page belongs to this user
  if (!html.toLowerCase().includes(u.toLowerCase()) && score === 0 && solved === 0) {
    return failResult(PLATFORM, u, "User not found")
  }

  const name = extractStr(html, /<title>([^|<-]+)/i, /"name"\s*:\s*"([^"]+)"/)

  return {
    platform: PLATFORM, username: u, verified: true, profileUrl,
    fetchedAt: new Date().toISOString(),
    stats: { solved, ranking: rank > 0 ? `#${rank}` : "", rating: score, streak, score, contests: 0 },
    rawStats: { name: name.trim() || u, score, rank, problemsSolved: solved, streakDays: streak },
  }
}
