/**
 * HackerRank scraper
 * Uses HackerRank's public REST endpoints:
 *   /rest/hackers/{username}          → profile + badges
 *   /rest/hackers/{username}/badges   → badge list
 *   /rest/contests/master/hackers/{username}/certificate → certs
 */
import type { NormalizedPlatformStats } from "../scraper-types"
import { failResult, fetchJSON } from "../scraper-utils"

const PLATFORM = "hackerrank"
const BASE = "https://www.hackerrank.com"
const HEADERS = { Referer: BASE + "/", Accept: "application/json" }

export async function scrapeHackerRank(username: string): Promise<NormalizedPlatformStats> {
  let u = username.trim().replace(/^https?:\/\/(?:www\.)?hackerrank\.com\/(?:profile\/)?/i, "").replace(/\/$/, "")
  if (!u) return failResult(PLATFORM, username, "Invalid username")

  // 1. Profile
  const profile = await fetchJSON<any>(`${BASE}/rest/hackers/${u}`, { headers: HEADERS, timeoutMs: 12000 })
  if (!profile?.model) return failResult(PLATFORM, u, "User not found")

  const m = profile.model

  // 2. Badges
  const badgesData = await fetchJSON<any>(`${BASE}/rest/hackers/${u}/badges`, { headers: HEADERS, timeoutMs: 10000 })
  const badges: any[] = badgesData?.models ?? []

  // 3. Certifications (best-effort)
  const certData = await fetchJSON<any>(`${BASE}/rest/hackers/${u}/certificates`, { headers: HEADERS, timeoutMs: 10000 })
  const certifications: any[] = certData?.models ?? []

  const totalScore = m.score ?? 0
  const globalRank = m.rank ?? 0

  return {
    platform: PLATFORM, username: u, verified: true,
    profileUrl: `${BASE}/profile/${u}`,
    fetchedAt: new Date().toISOString(),
    stats: {
      solved: 0,
      ranking: globalRank > 0 ? `#${globalRank}` : "",
      rating: totalScore,
      streak: 0,
      score: totalScore,
      contests: 0,
    },
    rawStats: {
      name: m.name ?? u,
      country: m.country ?? "",
      school: m.school ?? "",
      company: m.company ?? "",
      avatar: m.avatar ?? "",
      level: m.level ?? 0,
      totalScore,
      globalRank,
      countryRank: m.country_rank ?? 0,
      badges: badges.map((b: any) => ({ name: b.display_name ?? b.name, level: b.level ?? "", earnedDate: b.earned_date ?? "" })),
      certifications: certifications.map((c: any) => ({ name: c.certificate_name ?? c.name, level: c.level ?? "", issuedDate: c.issued_date ?? "" })),
    },
  }
}
