export interface ExercismStats {
  username: string
  completedExercises: number
  languages: string[]
  reputation: number
  badges: number
  profileUrl: string
}

export async function fetchExercismStats(username: string): Promise<ExercismStats | null> {
  try {
    let u = username.trim()
    const urlMatch = u.match(/exercism\.org\/profiles\/([^\/\?\s]+)/i)
    if (urlMatch) u = urlMatch[1]

    if (!u || !/^[a-zA-Z0-9_-]+$/.test(u)) return null

    console.log(`Fetching Exercism stats for: ${u}`)

    const profileUrl = `https://exercism.org/profiles/${u}`

    // Exercism has a public API
    const apiRes = await fetch(`https://exercism.org/api/v2/profiles/${u}`, {
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' },
      signal: AbortSignal.timeout(12000),
    })

    if (apiRes.status === 404) return null

    if (apiRes.ok) {
      const data = await apiRes.json()
      if (data?.profile) {
        const p = data.profile
        return {
          username: u,
          completedExercises: p.num_solutions_published || p.num_completed || 0,
          languages: p.tracks_joined || [],
          reputation: p.reputation || 0,
          badges: p.num_badges_earned || 0,
          profileUrl,
        }
      }
    }

    // Fallback: check profile page
    const pageRes = await fetch(profileUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'text/html' },
      signal: AbortSignal.timeout(12000),
    })

    if (!pageRes.ok) return null
    const html = await pageRes.text()
    const lower = html.toLowerCase()

    if (lower.includes('user not found') || lower.includes('profile not found') || lower.includes("doesn't exist")) return null
    if (html.length < 5000) return null

    return { username: u, completedExercises: 0, languages: [], reputation: 0, badges: 0, profileUrl }
  } catch (error) {
    console.error('Exercism fetch error:', error)
    return null
  }
}
