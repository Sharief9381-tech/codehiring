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
}

export async function fetchHackerEarthStats(username: string): Promise<HackerEarthStats | null> {
  try {
    let u = username.trim().replace(/^@/, '')
    const urlMatch = u.match(/hackerearth\.com\/@?([^\/\?\s]+)/i)
    if (urlMatch) u = urlMatch[1]

    if (!u || !/^[a-zA-Z0-9_-]+$/.test(u)) return null

    console.log(`Fetching HackerEarth stats for: ${u}`)

    // HackerEarth has a public API for user profiles
    const res = await fetch(`https://www.hackerearth.com/api/user/${u}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.hackerearth.com/',
      },
      signal: AbortSignal.timeout(12000),
    })

    if (res.status === 404) return null

    if (res.ok) {
      const data = await res.json()
      if (data && !data.error) {
        return {
          username: u,
          name: data.name || data.full_name || u,
          country: data.country || '',
          school: data.school || '',
          company: data.company || '',
          avatar: data.avatar || data.profile_pic || '',
          rating: data.rating || data.current_rating || 0,
          maxRating: data.max_rating || data.highest_rating || data.rating || 0,
          globalRank: data.global_rank || data.rank || 0,
          countryRank: data.country_rank || 0,
          problemsSolved: data.problems_solved || data.solved_count || 0,
          contests: data.contests || [],
          badges: data.badges || [],
          skills: data.skills || [],
        }
      }
    }

    // Fallback: verify profile page exists
    const pageRes = await fetch(`https://www.hackerearth.com/@${u}`, {
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'text/html' },
      signal: AbortSignal.timeout(12000),
    })

    if (!pageRes.ok) return null
    const html = await pageRes.text()
    if (html.includes('Page not found') || html.includes('User not found') || html.includes('404 Not Found')) return null

    return {
      username: u, name: u, country: '', school: '', company: '', avatar: '',
      rating: 0, maxRating: 0, globalRank: 0, countryRank: 0,
      problemsSolved: 0, contests: [], badges: [], skills: [],
    }
  } catch (error) {
    console.error('HackerEarth fetch error:', error)
    return null
  }
}
