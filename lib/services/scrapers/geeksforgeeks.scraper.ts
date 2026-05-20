/**
 * GeeksforGeeks scraper
 *
 * GFG is a Next.js SPA — stats are NOT in __NEXT_DATA__ but are embedded
 * as an escaped JSON string inside a <script> tag near the bottom of the HTML.
 *
 * The blob contains keys like:
 *   score, monthly_score, total_problems_solved, institute_rank,
 *   pod_solved_current_streak, pod_solved_longest_streak,
 *   pod_solved_global_longest_streak, pod_correct_submissions_count
 *
 * We also read articleCount.total_articles_published from the same blob.
 *
 * Profile URL format (2024+): https://www.geeksforgeeks.org/user/{username}/
 */
import type { NormalizedPlatformStats } from "../scraper-types"
import { failResult, fetchHTML, fetchJSON } from "../scraper-utils"

const PLATFORM = "geeksforgeeks"

export async function scrapeGeeksforGeeks(username: string): Promise<NormalizedPlatformStats> {
  // ── Clean username ────────────────────────────────────────────────────
  let u = username.trim()
  for (const p of [
    /(?:https?:\/\/)?(?:auth\.)?geeksforgeeks\.org\/user\/([^\/\?\s]+)/i,
    /(?:https?:\/\/)?(?:www\.)?geeksforgeeks\.org\/user\/([^\/\?\s]+)/i,
  ]) {
    const m = u.match(p)
    if (m) { u = m[1]; break }
  }
  u = u.replace(/\/$/, "")
  if (!u) return failResult(PLATFORM, username, "Invalid username")

  const profileUrl = `https://www.geeksforgeeks.org/user/${u}/`

  // ── Primary: unofficial stats API ────────────────────────────────────
  // Returns { info: {...}, solvedStats: {...} } or { error: "..." }
  const api = await fetchJSON<any>(
    `https://geeks-for-geeks-stats-api.vercel.app/?userName=${encodeURIComponent(u)}`,
    { timeoutMs: 15000 }
  )

  if (api && !api.error && api.info) {
    const info   = api.info
    const solved = api.solvedStats ?? {}
    const easy   = solved?.easy?.count   ?? solved?.Easy?.count   ?? 0
    const medium = solved?.medium?.count ?? solved?.Medium?.count ?? 0
    const hard   = solved?.hard?.count   ?? solved?.Hard?.count   ?? 0
    const basic  = solved?.basic?.count  ?? solved?.Basic?.count  ?? 0
    const school = solved?.school?.count ?? solved?.School?.count ?? 0
    const totalSolved = easy + medium + hard + basic + school || Number(info.totalProblemsSolved) || 0

    return {
      platform: PLATFORM, username: u, verified: true, profileUrl,
      fetchedAt: new Date().toISOString(),
      stats: {
        solved: totalSolved,
        ranking: info.instituteRank ? `Institute #${info.instituteRank}` : "",
        rating: Number(info.codingScore) || 0,
        streak: Number(info.currentStreak) || 0,
        score: Number(info.codingScore) || 0,
        contests: 0,
      },
      rawStats: {
        codingScore: Number(info.codingScore) || 0,
        problemsSolved: totalSolved,
        instituteRank: Number(info.instituteRank) || 0,
        articlesPublished: Number(info.articlesPublished) || 0,
        currentStreak: Number(info.currentStreak) || 0,
        longestStreak: Number(info.longestStreak) || 0,
        potdsSolved: Number(info.pod_solved ?? info.potdSolved) || 0,
        easy, medium, hard, basic, school,
      },
    }
  }

  // ── Fallback: parse embedded JSON from HTML ───────────────────────────
  // GFG embeds stats as an escaped JSON string inside a <script> tag.
  const html = await fetchHTML(profileUrl, { timeoutMs: 15000 })
  if (!html) return failResult(PLATFORM, u, "Profile not found")

  // Look for the userData blob that contains score, institute_rank, etc.
  const blobMatch = html.match(/"userData"\s*:\s*\{[^}]*"data"\s*:\s*\{([^}]+)\}/)
  let score = 0, totalSolved = 0, instituteRank = 0, currentStreak = 0, longestStreak = 0, articles = 0

  if (blobMatch) {
    const blob = blobMatch[1]
    const num = (key: string) => {
      const m = blob.match(new RegExp(`"${key}"\\s*:\\s*(\\d+)`))
      return m ? parseInt(m[1]) : 0
    }
    score         = num("score")
    totalSolved   = num("total_problems_solved")
    instituteRank = num("institute_rank") // may be 0 if empty string
    currentStreak = num("pod_solved_current_streak")
    longestStreak = num("pod_solved_longest_streak")
  }

  // Articles count lives in a separate key
  const artMatch = html.match(/"total_articles_published"\s*:\s*(\d+)/)
  if (artMatch) articles = parseInt(artMatch[1])

  // If we got nothing useful, the user probably doesn't exist
  if (score === 0 && totalSolved === 0 && !html.includes(u)) {
    return failResult(PLATFORM, u, "User not found")
  }

  return {
    platform: PLATFORM, username: u, verified: true, profileUrl,
    fetchedAt: new Date().toISOString(),
    stats: {
      solved: totalSolved,
      ranking: instituteRank > 0 ? `Institute #${instituteRank}` : "",
      rating: score,
      streak: currentStreak,
      score,
      contests: 0,
    },
    rawStats: {
      codingScore: score,
      problemsSolved: totalSolved,
      instituteRank,
      articlesPublished: articles,
      currentStreak,
      longestStreak,
      potdsSolved: 0,
    },
  }
}
