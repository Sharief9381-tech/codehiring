export interface GeeksforGeeksStats {
  username: string
  codingScore: number
  problemsSolved: number
  instituteRank: number
  articlesPublished: number
  currentStreak: number
  longestStreak: number
  potdsSolved: number
  profileUrl: string
}

export async function fetchGeeksforGeeksStats(username: string): Promise<GeeksforGeeksStats | null> {
  try {
    let cleanUsername = username.trim()

    // Extract username from URL if provided
    const urlPatterns = [
      /(?:https?:\/\/)?(?:auth\.)?geeksforgeeks\.org\/user\/([^\/\?\s]+)/i,
      /(?:https?:\/\/)?(?:www\.)?geeksforgeeks\.org\/user\/([^\/\?\s]+)/i,
    ]
    for (const pattern of urlPatterns) {
      const m = cleanUsername.match(pattern)
      if (m) { cleanUsername = m[1]; break }
    }

    if (!cleanUsername) return null

    const profileUrl = `https://www.geeksforgeeks.org/user/${cleanUsername}/`

    console.log(`Fetching GFG stats for: ${cleanUsername}`)

    // ── Primary: GFG unofficial stats API ──────────────────────────────────
    // This API reads GFG's own internal data and returns real JSON.
    const apiRes = await fetch(
      `https://geeks-for-geeks-stats-api.vercel.app/?userName=${encodeURIComponent(cleanUsername)}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0",
        },
        signal: AbortSignal.timeout(15000),
      }
    )

    if (apiRes.ok) {
      const data = await apiRes.json()
      console.log("GFG API raw response:", JSON.stringify(data).slice(0, 300))

      // API returns { error: "..." } for unknown users
      if (data?.error) {
        console.log(`GFG user not found: ${cleanUsername}`)
        return null
      }

      if (data?.info) {
        const info = data.info
        const solved = data.solvedStats ?? {}

        const easy   = solved?.easy?.count   ?? solved?.School?.count  ?? 0
        const medium = solved?.medium?.count ?? solved?.Medium?.count  ?? 0
        const hard   = solved?.hard?.count   ?? solved?.Hard?.count    ?? 0
        const basic  = solved?.basic?.count  ?? solved?.Basic?.count   ?? 0
        const school = solved?.school?.count ?? solved?.School?.count  ?? 0
        const totalSolved = easy + medium + hard + basic + school

        return {
          username: cleanUsername,
          codingScore:      Number(info.codingScore)    || 0,
          problemsSolved:   totalSolved || Number(info.totalProblemsSolved) || 0,
          instituteRank:    Number(info.instituteRank)  || 0,
          articlesPublished:Number(info.articlesPublished) || 0,
          currentStreak:    Number(info.currentStreak)  || 0,
          longestStreak:    Number(info.longestStreak)  || 0,
          potdsSolved:      Number(info.pod_solved ?? info.potdSolved) || 0,
          profileUrl,
        }
      }
    }

    // ── Fallback: second unofficial mirror ─────────────────────────────────
    const mirror = await fetch(
      `https://gfgstatsapi.vercel.app/api/${encodeURIComponent(cleanUsername)}`,
      {
        headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(12000),
      }
    ).catch(() => null)

    if (mirror?.ok) {
      const d = await mirror.json()
      if (d && !d.error && (d.codingScore !== undefined || d.totalProblemsSolved !== undefined)) {
        return {
          username: cleanUsername,
          codingScore:       Number(d.codingScore)       || 0,
          problemsSolved:    Number(d.totalProblemsSolved) || 0,
          instituteRank:     Number(d.instituteRank)     || 0,
          articlesPublished: Number(d.articlesPublished) || 0,
          currentStreak:     Number(d.currentStreak)     || 0,
          longestStreak:     Number(d.longestStreak)     || 0,
          potdsSolved:       Number(d.pod_solved)        || 0,
          profileUrl,
        }
      }
    }

    // ── Last resort: verify the profile page at least loads ────────────────
    // GFG is a React SPA — we can't parse stats from HTML, but we can
    // confirm the user exists (200 vs 404) and return zeros rather than null.
    const pageRes = await fetch(profileUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(12000),
    }).catch(() => null)

    if (!pageRes || !pageRes.ok) {
      console.log(`GFG profile page not found for ${cleanUsername}`)
      return null
    }

    // User exists but API gave no data — return zeros
    console.log(`GFG: user ${cleanUsername} exists but API returned no data, returning zeros`)
    return {
      username: cleanUsername,
      codingScore: 0,
      problemsSolved: 0,
      instituteRank: 0,
      articlesPublished: 0,
      currentStreak: 0,
      longestStreak: 0,
      potdsSolved: 0,
      profileUrl,
    }
  } catch (error) {
    console.error("GFG fetch error:", error)
    return null
  }
}
