/**
 * HackerRank fetcher
 *
 * HackerRank's REST API (/rest/hackers/{username}) now requires a session
 * cookie for most endpoints. The only reliable public signal is the profile
 * page HTTP status:
 *   200  → user exists
 *   404  → user does not exist
 *
 * We fetch the profile page, confirm it's a real profile, then try to
 * extract badge/score data from the embedded JSON. If extraction fails we
 * still return a valid (zero-stats) object so the user can connect.
 */

export interface HackerRankStats {
  username: string
  name: string
  country: string
  school: string
  company: string
  avatar: string
  level: number
  badges: { name: string; level: string; badge_type: string; earned_date: string }[]
  certifications: { name: string; level: string; issued_date: string; certificate_url: string }[]
  skills: { name: string; level: number; max_score: number; score: number; percentage: number; stars: number }[]
  contests: { name: string; rank: number; score: number; participants: number }[]
  totalScore: number
  globalRank: number
  countryRank: number
}

export async function fetchHackerRankStats(username: string): Promise<HackerRankStats | null> {
  try {
    let u = username.trim()

    // Extract username from URL if provided
    const urlMatch = u.match(/(?:https?:\/\/)?(?:www\.)?hackerrank\.com\/(?:profile\/)?([^\/\?\s]+)/i)
    if (urlMatch) u = urlMatch[1]

    // Remove leading @ if present
    u = u.replace(/^@/, "")

    if (!u || !/^[a-zA-Z0-9_-]+$/.test(u)) return null

    console.log(`Fetching HackerRank stats for: ${u}`)

    const profileUrl = `https://www.hackerrank.com/profile/${u}`

    // ── 1. Fetch profile page ─────────────────────────────────────────────
    const res = await fetch(profileUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(15000),
    })

    // 404 = user genuinely doesn't exist
    if (res.status === 404) {
      console.log(`HackerRank: 404 for ${u}`)
      return null
    }

    if (!res.ok) {
      // Any other non-200 (e.g. 429 rate limit) — don't block the user
      console.log(`HackerRank: HTTP ${res.status} for ${u}, returning basic profile`)
      return buildBasic(u)
    }

    const html = await res.text()

    // Explicit "not found" strings in the rendered HTML
    const notFoundSignals = [
      "page not found",
      "user not found",
      "profile not found",
      "this page doesn't exist",
      "404 | hackerrank",
    ]
    const lower = html.toLowerCase()
    if (notFoundSignals.some((s) => lower.includes(s))) {
      console.log(`HackerRank: profile not found for ${u}`)
      return null
    }

    // ── 2. Try to extract stats from embedded JSON ────────────────────────
    let totalScore = 0
    let globalRank = 0
    let name = u
    let country = ""
    let avatar = ""
    let badges: HackerRankStats["badges"] = []
    let certifications: HackerRankStats["certifications"] = []

    // HackerRank embeds profile data in window.__INITIAL_STATE__ or similar
    const jsonMatch =
      html.match(/window\.__INITIAL_STATE__\s*=\s*(\{.+?\});\s*<\/script>/) ||
      html.match(/"hacker"\s*:\s*(\{[^}]+\})/)

    if (jsonMatch) {
      try {
        const obj = JSON.parse(jsonMatch[1])
        const hacker = obj.hacker ?? obj
        name       = hacker.name       ?? hacker.username ?? u
        country    = hacker.country    ?? ""
        avatar     = hacker.avatar     ?? ""
        totalScore = hacker.score      ?? hacker.total_score ?? 0
        globalRank = hacker.rank       ?? hacker.global_rank ?? 0
      } catch { /* ignore */ }
    }

    // Fallback regex extraction
    if (totalScore === 0) {
      const sm = html.match(/"score"\s*:\s*(\d+)/)
      if (sm) totalScore = parseInt(sm[1])
    }
    if (globalRank === 0) {
      const rm = html.match(/"rank"\s*:\s*(\d+)/)
      if (rm) globalRank = parseInt(rm[1])
    }
    const nameMatch = html.match(/<title>([^|<]+)/)
    if (nameMatch && nameMatch[1].trim() !== "HackerRank") {
      name = nameMatch[1].trim()
    }

    // ── 3. Try the public badges endpoint (no auth needed) ───────────────
    try {
      const badgesRes = await fetch(
        `https://www.hackerrank.com/rest/hackers/${u}/badges`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0",
            Accept: "application/json",
            Referer: "https://www.hackerrank.com/",
          },
          signal: AbortSignal.timeout(8000),
        }
      )
      if (badgesRes.ok) {
        const bd = await badgesRes.json()
        badges = (bd.models ?? []).map((b: any) => ({
          name: b.display_name ?? b.name ?? "",
          level: b.level ?? "",
          badge_type: b.badge_type ?? "",
          earned_date: b.earned_date ?? "",
        }))
      }
    } catch { /* badges are optional */ }

    console.log(`HackerRank: verified ${u}, score=${totalScore}, rank=${globalRank}, badges=${badges.length}`)

    return {
      username: u,
      name,
      country,
      school: "",
      company: "",
      avatar,
      level: 0,
      badges,
      certifications,
      skills: [],
      contests: [],
      totalScore,
      globalRank,
      countryRank: 0,
    }
  } catch (error) {
    console.error("HackerRank fetch error:", error)
    return null
  }
}

function buildBasic(u: string): HackerRankStats {
  return {
    username: u, name: u, country: "", school: "", company: "", avatar: "",
    level: 0, badges: [], certifications: [], skills: [], contests: [],
    totalScore: 0, globalRank: 0, countryRank: 0,
  }
}
