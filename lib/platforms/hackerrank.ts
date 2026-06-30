export interface HackerRankStats {
  username: string
  name: string
  country: string
  school: string
  company: string
  avatar: string
  level: number
  badges: {
    name: string
    stars: number
    points: number
    badge_type: string
    solved: number
  }[]
  certifications: { name: string; certificate_url: string }[]
  skills: string[]
  contests: { name: string; rank: number; score: number; participants: number }[]
  totalScore: number
  globalRank: number
  countryRank: number
}

export async function fetchHackerRankStats(username: string): Promise<HackerRankStats | null> {
  try {
    let u = username.trim()

    // Extract username from URL
    const urlMatch = u.match(/(?:https?:\/\/)?(?:www\.)?hackerrank\.com\/(?:profile\/)?([^\/\?\s#]+)/i)
    if (urlMatch) u = urlMatch[1]
    u = u.replace(/^@/, '').trim()

    if (!u || !/^[a-zA-Z0-9_-]+$/.test(u)) return null


    // ── Step 1: Fetch profile via public REST API ─────────────────────────
    // Confirmed working: returns model with id, username, name, level, rank, avatar, etc.
    const profileRes = await fetch(`https://www.hackerrank.com/rest/hackers/${encodeURIComponent(u)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.hackerrank.com/',
        'Origin': 'https://www.hackerrank.com',
      },
      signal: AbortSignal.timeout(15000),
    }).catch(e => { console.error('[HackerRank] profile fetch error:', e.message); return null })

    if (!profileRes) return null


    if (profileRes.status === 404) {
      return null
    }

    if (!profileRes.ok) {
      return null
    }

    const profileData = await profileRes.json()
    const m = profileData?.model

    if (!m || m.deleted) {
      return null
    }


    // ── Step 2: Fetch badges ──────────────────────────────────────────────
    // Confirmed working: returns models array with badge_name, stars, total_points, solved, etc.
    const badgesRes = await fetch(`https://www.hackerrank.com/rest/hackers/${encodeURIComponent(u)}/badges`, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
        'Referer': 'https://www.hackerrank.com/',
      },
      signal: AbortSignal.timeout(10000),
    }).catch(e => { console.error('[HackerRank] badges fetch error:', e.message); return null })

    let badges: HackerRankStats['badges'] = []
    if (badgesRes?.ok) {
      const badgesData = await badgesRes.json()
      badges = (badgesData.models ?? []).map((b: any) => ({
        name:       b.badge_name    ?? b.display_name ?? b.name ?? '',
        stars:      Number(b.stars  ?? b.total_stars  ?? 0),
        points:     Number(b.total_points ?? b.current_points ?? 0),
        badge_type: b.badge_type    ?? b.badge_category ?? '',
        solved:     Number(b.solved ?? 0),
      }))
    }

    // ── Step 3: Fetch recent contest submissions for score ────────────────
    let totalScore = Number(m.score ?? m.total_score ?? 0)
    // If score not in profile, sum badge points
    if (totalScore === 0 && badges.length > 0) {
      totalScore = badges.reduce((sum, b) => sum + b.points, 0)
    }


    return {
      username:     u,
      name:         m.name         ?? m.username ?? u,
      country:      m.country      ?? '',
      school:       m.school       ?? '',
      company:      m.company      ?? '',
      avatar:       m.avatar       ?? '',
      level:        Number(m.level ?? 0),
      badges,
      certifications: [],
      skills:       m.languages    ? (Array.isArray(m.languages) ? m.languages : [m.languages]) : [],
      contests:     [],
      totalScore,
      globalRank:   Number(m.rank  ?? 0),
      countryRank:  0,
    }
  } catch (error) {
    console.error('[HackerRank] Unexpected error:', error)
    return null
  }
}
