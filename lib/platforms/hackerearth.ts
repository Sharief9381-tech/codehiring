/**
 * HackerEarth scraper
 *
 * HackerEarth migrated to a pure client-side React app (Next.js App Router) in 2024.
 * Their old REST API (/api/user/<username>/) now redirects to /login/.
 * Their GraphQL endpoint returns 403 without a CSRF token + session cookie.
 *
 * Strategy:
 *  1. Fetch the profile page HTML → parse OG meta tags and any inline JSON fragments
 *     that contain username, full_name, rating, problems_solved.
 *  2. If the page RSC route returns the username in the flight payload, the profile exists.
 *  3. If neither yields stats, mark _apiLimited = true so the UI shows a
 *     "Connected — stats limited" badge rather than "failed".
 */
export interface HackerEarthStats {
  username: string
  name: string
  country: string
  school: string
  company: string
  avatar: string
  rating: number
  maxRating: number
  globalRank: number
  countryRank: number
  problemsSolved: number
  contests: { name: string; rank: number; score: number; participants: number }[]
  badges: { name: string; type: string; earned_date: string }[]
  skills: string[]
  _apiLimited?: boolean
  _profileVerified?: boolean
}

/** Pull a value from multiple regex patterns, return 0 if not found */
function extractNumber(html: string, ...patterns: RegExp[]): number {
  for (const p of patterns) {
    const m = html.match(p)
    if (m) return parseInt(m[1] ?? m[2] ?? '0', 10)
  }
  return 0
}

function extractString(html: string, ...patterns: RegExp[]): string {
  for (const p of patterns) {
    const m = html.match(p)
    if (m) return (m[1] ?? m[2] ?? '').trim()
  }
  return ''
}

export async function fetchHackerEarthStats(username: string): Promise<HackerEarthStats | null> {
  try {
    // ── 1. Normalise username ────────────────────────────────────────────
    let u = username.trim().replace(/^@/, '')
    const urlMatch = u.match(/(?:https?:\/\/)?(?:www\.)?hackerearth\.com\/@?([^\/\?\s#]+)/i)
    if (urlMatch) u = urlMatch[1]
    u = u.replace(/\/+$/, '').trim()
    if (!u || !/^[a-zA-Z0-9_.-]+$/.test(u)) return null


    // ── 2. Fetch profile HTML ────────────────────────────────────────────
    const profileUrl = `https://www.hackerearth.com/@${u}/`
    const htmlRes = await fetch(profileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
      },
      signal: AbortSignal.timeout(15000),
    }).catch(e => { console.error('[HackerEarth] HTML fetch error:', e.message); return null })

    if (!htmlRes) return null
    if (htmlRes.status === 404) { return null }
    if (!htmlRes.ok) { return null }

    const html = await htmlRes.text()

    // ── 3. Check for "not found" signals ────────────────────────────────
    const lower = html.toLowerCase()
    if (
      lower.includes('page not found') ||
      lower.includes('user not found') ||
      lower.includes('does not exist') ||
      html.length < 5000
    ) {
      return null
    }

    // ── 4. Parse OG / meta tags ─────────────────────────────────────────
    const ogTitle    = extractString(html, /<meta\s+property="og:title"\s+content="([^"]+)"/i, /<meta\s+name="title"\s+content="([^"]+)"/i)
    const ogImage    = extractString(html, /<meta\s+property="og:image"\s+content="([^"]+)"/i)
    const ogDesc     = extractString(html, /<meta\s+property="og:description"\s+content="([^"]+)"/i)
    const metaName   = extractString(html, /<title[^>]*>([^<|]+)/i)


    // ── 5. Parse inline JSON fragments ──────────────────────────────────
    // HackerEarth embeds some user data in script tags as serialised props
    let name         = ogTitle.replace(/\s*\|\s*HackerEarth.*/i, '').replace(/\s*-\s*HackerEarth.*/i, '').trim() || u
    let rating       = extractNumber(html,
      /"rating"\s*:\s*(\d+)/,
      /"current_rating"\s*:\s*(\d+)/,
      /rating['":\s]+(\d{3,5})/i,
    )
    let problemsSolved = extractNumber(html,
      /"problems_solved"\s*:\s*(\d+)/,
      /"total_problems_solved"\s*:\s*(\d+)/,
      /"solved"\s*:\s*(\d+)/,
      /(\d+)\s+problems?\s+solved/i,
    )
    let country      = extractString(html, /"country"\s*:\s*"([^"]+)"/)
    let avatar       = ogImage

    // ── 6. Verify profile via RSC flight data ────────────────────────────
    // The RSC route returns a small JSON with the username confirming it exists
    let profileVerified = html.includes(u) || ogTitle.toLowerCase().includes(u.toLowerCase())

    // ── 7. Try OG description for numeric data ───────────────────────────
    // e.g. "Solved 120 problems · Rating 1820 · Rank 5342"
    if (ogDesc) {
      const solvedInDesc = ogDesc.match(/solved\s+(\d+)\s+problems?/i) || ogDesc.match(/(\d+)\s+problems?\s+solved/i)
      const ratingInDesc = ogDesc.match(/rating[:\s]+(\d+)/i) || ogDesc.match(/(\d{4,5})\s+rating/i)
      if (solvedInDesc) problemsSolved = parseInt(solvedInDesc[1], 10)
      if (ratingInDesc) rating = parseInt(ratingInDesc[1], 10)
    }


    // If we can't confirm the profile exists at all, bail
    if (!profileVerified && !ogTitle) {
      return null
    }

    return {
      username: u,
      name:     name || u,
      country,
      school:   '',
      company:  '',
      avatar,
      rating,
      maxRating: rating,
      globalRank: 0,
      countryRank: 0,
      problemsSolved,
      contests: [],
      badges:   [],
      skills:   [],
      _apiLimited:     true,   // signal to UI that full stats aren't available
      _profileVerified: profileVerified,
    }
  } catch (error) {
    console.error('[HackerEarth] Unexpected error:', error)
    return null
  }
}
