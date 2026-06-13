/**
 * InterviewBit scraper — v3 (definitive)
 *
 * Deep investigation (June 2026) confirmed:
 *  - /profile/<username> returns a Next.js App Router shell with NO server-rendered data
 *  - ALL stat endpoints (/username?id=, /username/streak/?id=, /problems_solved_overview_count)
 *    return 404 without a valid session cookie
 *  - /api/v3/badges/ and /v2/problem_list/ return the same generic catalogue for every user
 *    (not user-specific)
 *  - No OG/meta tags, no __NEXT_DATA__, no title tag in the HTML
 *  - The ONLY user-specific data in the unauthenticated HTML is the escaped JSON fragment
 *    {\"username\":\"<the-username>\"} embedded in the RSC flight payload
 *
 * Strategy:
 *  1. Fetch /profile/<username> and look for {"username":"<username>"} in the RSC payload
 *     — confirms the profile exists
 *  2. Return _apiLimited: true so the UI shows "Connected" instead of a broken state
 *  3. Score/rank/problems stay 0 — there is no public data surface
 *
 * If InterviewBit ever re-exposes public profile data, update the stat extraction below.
 */
export interface InterviewBitStats {
  username: string
  score: number
  rank: number
  problemsSolved: number
  streakDays: number
  profileUrl: string
  name?: string
  avatar?: string
  _apiLimited: true
}

/** Decode RSC flight payload chunks into a single flat string */
function decodeRscPayload(html: string): string {
  const chunks: string[] = []
  const regex = /self\.__next_f\.push\(\[1\s*,\s*"((?:[^"\\]|\\.)*)"\]\)/g
  let m: RegExpExecArray | null
  while ((m = regex.exec(html)) !== null) {
    try {
      chunks.push(JSON.parse(`"${m[1]}"`))
    } catch {
      chunks.push(m[1])
    }
  }
  return chunks.join('\n')
}

export async function fetchInterviewBitStats(
  username: string
): Promise<InterviewBitStats | null> {
  try {
    // ── 1. Normalise input ────────────────────────────────────────────────
    let u = username.trim()

    // Accept profile URL or bare username
    const urlMatch = u.match(
      /(?:https?:\/\/)?(?:www\.)?interviewbit\.com\/(?:profile\/|users\/)([^\/\?\s#]+)/i
    )
    if (urlMatch) u = urlMatch[1]
    u = u.replace(/\/+$/, '').replace(/^@/, '').trim()

    if (!u || !/^[a-zA-Z0-9_.-]+$/.test(u)) {
      console.log('[InterviewBit] Invalid username:', username)
      return null
    }

    console.log(`[InterviewBit] Verifying profile for: ${u}`)

    const profileUrl = `https://www.interviewbit.com/profile/${u}/`

    // ── 2. Fetch profile page ─────────────────────────────────────────────
    const res = await fetch(profileUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
      },
      signal: AbortSignal.timeout(15000),
    }).catch(e => {
      console.error('[InterviewBit] fetch error:', e.message)
      return null
    })

    if (!res) return null

    console.log(`[InterviewBit] HTTP ${res.status} for ${u}`)

    // Hard 404 = profile definitely doesn't exist
    if (res.status === 404) return null
    if (!res.ok) return null

    const html = await res.text()
    console.log(`[InterviewBit] Page length: ${html.length}`)

    // Too short = CDN error / maintenance page
    if (html.length < 5000) return null

    // ── 3. Verify the profile exists via RSC payload ──────────────────────
    // The RSC flight data always contains: {\"username\":\"<u>\"} for valid profiles
    // For invalid profiles the fragment is absent or contains a different value
    const rscText = decodeRscPayload(html)

    // Primary check: exact username match in RSC
    const usernameInRsc =
      rscText.includes(`"username":"${u}"`) ||
      rscText.includes(`"username": "${u}"`) ||
      rscText.includes(`\\"username\\":\\"${u}\\"`) ||
      html.includes(`\\"username\\":\\"${u}\\"`) ||
      html.includes(`"username":"${u}"`)

    // Secondary check: the page HTML contains the username somewhere
    const usernameInHtml = html.includes(u)

    console.log(
      `[InterviewBit] RSC match: ${usernameInRsc}, HTML match: ${usernameInHtml}`
    )

    if (!usernameInRsc && !usernameInHtml) {
      // Profile doesn't exist or username typo
      console.log(`[InterviewBit] Profile not found for ${u}`)
      return null
    }

    // ── 4. Return confirmed-but-limited result ────────────────────────────
    // All stat endpoints require an authenticated session — no public data available
    console.log(`[InterviewBit] Profile verified for ${u} — stats not publicly accessible`)

    return {
      username:       u,
      score:          0,
      rank:           0,
      problemsSolved: 0,
      streakDays:     0,
      profileUrl,
      name:           u,
      _apiLimited:    true,
    }
  } catch (error) {
    console.error('[InterviewBit] Unexpected error:', error)
    return null
  }
}
