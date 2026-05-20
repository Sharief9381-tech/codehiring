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
    let u = username.trim()

    for (const pattern of [
      /(?:https?:\/\/)?(?:auth\.|www\.)?geeksforgeeks\.org\/user\/([^\/\?\s]+)(?:\/profile)?/i,
      /(?:https?:\/\/)?(?:auth\.|www\.)?geeksforgeeks\.org\/profile\/([^\/\?\s]+)/i,
    ]) {
      const m = u.match(pattern)
      if (m) { u = m[1]; break }
    }

    if (!u) return null

    const profileUrl = `https://www.geeksforgeeks.org/user/${u}/`
    console.log(`Fetching GFG stats for: ${u}`)

    // Primary: GFG unofficial stats API
    const apiRes = await fetch(
      `https://geeks-for-geeks-stats-api.vercel.app/?raw=Y&userName=${encodeURIComponent(u)}`,
      {
        headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(15000),
      }
    ).catch(() => null)

    if (apiRes?.ok) {
      const data = await apiRes.json()
      console.log('GFG API raw response:', JSON.stringify(data).slice(0, 300))

      if (data?.error) {
        console.log(`GFG user not found: ${u}`)
        return null
      }

      if (data?.info) {
        const info = data.info
        const solved = data.solvedStats ?? {}
        const easy   = solved?.easy?.count   ?? solved?.School?.count ?? 0
        const medium = solved?.medium?.count ?? solved?.Medium?.count ?? 0
        const hard   = solved?.hard?.count   ?? solved?.Hard?.count   ?? 0
        const basic  = solved?.basic?.count  ?? solved?.Basic?.count  ?? 0
        const school = solved?.school?.count ?? 0
        const totalSolved = easy + medium + hard + basic + school

        return {
          username: u,
          codingScore:       Number(info.codingScore)       || 0,
          problemsSolved:    totalSolved || Number(info.totalProblemsSolved) || 0,
          instituteRank:     Number(info.instituteRank)     || 0,
          articlesPublished: Number(info.articlesPublished) || 0,
          currentStreak:     Number(info.currentStreak)     || 0,
          longestStreak:     Number(info.longestStreak)     || 0,
          potdsSolved:       Number(info.pod_solved ?? info.potdSolved ?? info.pod_solved_longest_streak) || 0,
          profileUrl,
        }
      }
    }

    // Fallback: second unofficial mirror
    const mirror = await fetch(
      `https://gfgstatsapi.vercel.app/api/${encodeURIComponent(u)}`,
      {
        headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(12000),
      }
    ).catch(() => null)

    if (mirror?.ok) {
      const d = await mirror.json()
      if (d && !d.error && (d.codingScore !== undefined || d.totalProblemsSolved !== undefined)) {
        return {
          username: u,
          codingScore:       Number(d.codingScore)         || 0,
          problemsSolved:    Number(d.totalProblemsSolved) || 0,
          instituteRank:     Number(d.instituteRank)       || 0,
          articlesPublished: Number(d.articlesPublished)   || 0,
          currentStreak:     Number(d.currentStreak)       || 0,
          longestStreak:     Number(d.longestStreak)       || 0,
          potdsSolved:       Number(d.pod_solved)          || 0,
          profileUrl,
        }
      }
    }

    // Last resort: verify profile page exists
    const pageRes = await fetch(profileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
        Accept: 'text/html',
      },
      signal: AbortSignal.timeout(12000),
    }).catch(() => null)

    if (!pageRes?.ok) {
      console.log(`GFG profile page not found for ${u}`)
      return null
    }

    const html = await pageRes.text()
    const lower = html.toLowerCase()
    if (lower.includes('user not found') || lower.includes('profile not found') || lower.includes('this user does not exist')) {
      return null
    }
    if (html.length < 10000) return null

    console.log(`GFG: user ${u} exists but API returned no data, returning zeros`)
    return {
      username: u,
      codingScore: 0, problemsSolved: 0, instituteRank: 0,
      articlesPublished: 0, currentStreak: 0, longestStreak: 0, potdsSolved: 0,
      profileUrl,
    }
  } catch (error) {
    console.error('GFG fetch error:', error)
    return null
  }
}

export async function extractGeeksforGeeksStats(html: string, username: string): Promise<GeeksforGeeksStats | null> {
  return null
}
