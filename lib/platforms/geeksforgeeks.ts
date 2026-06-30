export interface GeeksforGeeksStats {
  username: string
  codingScore: number
  problemsSolved: number
  instituteRank: string
  articlesPublished: number
  currentStreak: number
  longestStreak: number
  potdsSolved: number
  profileUrl: string
}

export async function fetchGeeksforGeeksStats(username: string): Promise<GeeksforGeeksStats | null> {
  try {
    let u = username.trim()

    // Extract username from URL
    for (const pattern of [
      /(?:https?:\/\/)?(?:auth\.|www\.)?geeksforgeeks\.org\/user\/([^\/\?\s#]+)/i,
      /(?:https?:\/\/)?(?:auth\.|www\.)?geeksforgeeks\.org\/profile\/([^\/\?\s#]+)/i,
    ]) {
      const m = u.match(pattern)
      if (m) { u = m[1]; break }
    }
    u = u.replace(/\/+$/, '').trim()
    if (!u) return null


    // GFG profile page embeds data as escaped JSON in a <script> tag.
    // The URL /user/{username} redirects to /profile/{username} which contains the data.
    const res = await fetch(`https://www.geeksforgeeks.org/user/${encodeURIComponent(u)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(20000),
    }).catch(e => { console.error('[GFG] fetch error:', e.message); return null })

    if (!res) return null


    // 404 = user doesn't exist
    if (res.status === 404) {
      return null
    }

    if (!res.ok) {
      return null
    }

    const html = await res.text()

    // GFG embeds profile data as escaped JSON inside a React server component script.
    // Pattern: \"score\":0,\"monthly_score\":0,\"total_problems_solved\":0,...
    const scoreMatch       = html.match(/\\"score\\":(\d+)/)
    const problemsMatch    = html.match(/\\"total_problems_solved\\":(\d+)/)
    const rankMatch        = html.match(/\\"institute_rank\\":\\"([^\\"]*)\\"|\\\"institute_rank\\\":\\\"([^\\\"]*)\\\"/)
    const podLongestMatch  = html.match(/\\"pod_solved_longest_streak\\":(\d+)/)
    const podCurrentMatch  = html.match(/\\"pod_solved_current_streak\\":(\d+)/)
    const streakMatch      = html.match(/\\"current_streak\\":(\d+)/)

    // Also try unescaped patterns (some pages serve unescaped)
    const scoreMatch2      = html.match(/"score":(\d+)/)
    const problemsMatch2   = html.match(/"total_problems_solved":(\d+)/)
    const rankMatch2       = html.match(/"institute_rank":"([^"]*)"/)
    const podLongestMatch2 = html.match(/"pod_solved_longest_streak":(\d+)/)
    const podCurrentMatch2 = html.match(/"pod_solved_current_streak":(\d+)/)
    const streakMatch2     = html.match(/"current_streak":(\d+)/)

    const score       = Number(scoreMatch?.[1]    ?? scoreMatch2?.[1]    ?? 0)
    const problems    = Number(problemsMatch?.[1] ?? problemsMatch2?.[1] ?? 0)
    const rank        = rankMatch?.[1] ?? rankMatch?.[2] ?? rankMatch2?.[1] ?? ''
    const podLongest  = Number(podLongestMatch?.[1]  ?? podLongestMatch2?.[1]  ?? 0)
    const podCurrent  = Number(podCurrentMatch?.[1]  ?? podCurrentMatch2?.[1]  ?? 0)
    const streak      = Number(streakMatch?.[1]  ?? streakMatch2?.[1]  ?? 0)


    // If page loaded but no data found, user might exist but have no activity
    // Check for "not found" signals
    const lower = html.toLowerCase()
    if (
      lower.includes('user not found') ||
      lower.includes('profile not found') ||
      lower.includes('this user does not exist') ||
      html.length < 5000
    ) {
      return null
    }

    return {
      username: u,
      codingScore:       score,
      problemsSolved:    problems,
      instituteRank:     rank,
      articlesPublished: 0,
      currentStreak:     streak || podCurrent,
      longestStreak:     podLongest,
      potdsSolved:       podCurrent,
      profileUrl:        `https://www.geeksforgeeks.org/user/${u}/`,
    }
  } catch (error) {
    console.error('[GFG] Unexpected error:', error)
    return null
  }
}
