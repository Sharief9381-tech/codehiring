export interface KaggleStats {
  username: string
  tier: string
  competitions: number
  datasets: number
  notebooks: number
  discussions: number
  profileUrl: string
}

export async function fetchKaggleStats(username: string): Promise<KaggleStats | null> {
  try {
    let u = username.trim()
    const urlMatch = u.match(/kaggle\.com\/([^\/\?\s]+)/i)
    if (urlMatch) u = urlMatch[1]

    if (!u || !/^[a-zA-Z0-9_-]+$/.test(u)) return null


    const profileUrl = `https://www.kaggle.com/${u}`

    // Kaggle has a public API endpoint for user info
    const apiRes = await fetch(`https://www.kaggle.com/api/v1/users/${u}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept: 'application/json',
        Referer: 'https://www.kaggle.com/',
      },
      signal: AbortSignal.timeout(12000),
    })

    if (apiRes.status === 404) return null

    if (apiRes.ok) {
      const data = await apiRes.json()
      if (data && !data.error) {
        return {
          username: u,
          tier: data.tier || data.performanceTier || 'Novice',
          competitions: data.totalCompetitions || data.competitions || 0,
          datasets: data.totalDatasets || data.datasets || 0,
          notebooks: data.totalNotebooks || data.notebooks || 0,
          discussions: data.totalDiscussions || data.discussions || 0,
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

    if (lower.includes('user not found') || lower.includes('profile not found') || lower.includes('page not found')) return null
    if (html.length < 5000) return null

    // Try to extract tier from page
    const tierMatch = html.match(/(Novice|Contributor|Expert|Master|Grandmaster)/i)
    const tier = tierMatch ? tierMatch[1] : 'Novice'

    return { username: u, tier, competitions: 0, datasets: 0, notebooks: 0, discussions: 0, profileUrl }
  } catch (error) {
    console.error('Kaggle fetch error:', error)
    return null
  }
}
