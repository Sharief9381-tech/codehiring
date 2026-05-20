/**
 * LeetCode scraper
 * Uses the official public GraphQL API — no scraping needed.
 */
import type { NormalizedPlatformStats } from "../scraper-types"
import { failResult, fetchJSON } from "../scraper-utils"

const PLATFORM = "leetcode"
const GQL_URL = "https://leetcode.com/graphql"

const QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      submitStats: submitStatsGlobal {
        acSubmissionNum { difficulty count }
      }
      profile { ranking }
      contributions { points }
      userCalendar { streak }
    }
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
    }
  }
`

export async function scrapeLeetCode(username: string): Promise<NormalizedPlatformStats> {
  const u = username.trim().replace(/^https?:\/\/leetcode\.com\/(?:u\/)?/i, "").replace(/\/$/, "")
  if (!u) return failResult(PLATFORM, username, "Invalid username")

  const data = await fetchJSON<any>(GQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Referer: "https://leetcode.com" },
    body: JSON.stringify({ query: QUERY, variables: { username: u } }),
    timeoutMs: 15000,
  })

  if (!data?.data?.matchedUser) {
    return failResult(PLATFORM, u, "User not found")
  }

  const user = data.data.matchedUser
  const subs: any[] = user.submitStats?.acSubmissionNum ?? []
  const easy   = subs.find((s: any) => s.difficulty === "Easy")?.count   ?? 0
  const medium = subs.find((s: any) => s.difficulty === "Medium")?.count ?? 0
  const hard   = subs.find((s: any) => s.difficulty === "Hard")?.count   ?? 0
  const solved = easy + medium + hard

  const contest = data.data.userContestRanking
  const rating    = Math.round(contest?.rating ?? 0)
  const contests  = contest?.attendedContestsCount ?? 0
  const globalRank = contest?.globalRanking ?? 0
  const ranking   = globalRank > 0 ? `#${globalRank}` : user.profile?.ranking > 0 ? `#${user.profile.ranking}` : ""
  const streak    = user.userCalendar?.streak ?? 0

  const raw = { easySolved: easy, mediumSolved: medium, hardSolved: hard, ranking: user.profile?.ranking ?? 0, contributionPoints: user.contributions?.points ?? 0, contestRating: rating, contestsAttended: contests, globalRanking: globalRank }

  return {
    platform: PLATFORM,
    username: u,
    verified: true,
    profileUrl: `https://leetcode.com/u/${u}/`,
    fetchedAt: new Date().toISOString(),
    stats: { solved, ranking, rating, streak, score: user.contributions?.points ?? 0, contests },
    rawStats: raw,
  }
}
