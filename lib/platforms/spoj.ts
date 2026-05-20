export interface SPOJStats {
  username: string
  problemsSolved: number
  score: number
  rank: number
  worldRank: number
  countryRank: number
  institutionRank: number
  joinDate: string
  lastLogin: string
  profileUrl: string
}

export async function fetchSPOJStats(username: string): Promise<SPOJStats | null> {
  try {
    let u = username.trim()
    const urlMatch = u.match(/spoj\.com\/users\/([^\/\?\s]+)/i)
    if (urlMatch) u = urlMatch[1]

    if (!u || !/^[a-zA-Z0-9_-]+$/.test(u)) return null

    console.log(`Fetching SPOJ stats for: ${u}`)

    const profileUrl = `https://www.spoj.com/users/${u}/`

    const res = await fetch(profileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'text/html',
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!res.ok) return null

    const html = await res.text()
    const lower = html.toLowerCase()

    if (lower.includes('user not found') || lower.includes('does not exist') || html.length < 3000) return null

    // Extract stats
    let problemsSolved = 0, score = 0, worldRank = 0, countryRank = 0, institutionRank = 0
    let joinDate = '', lastLogin = ''

    const solvedMatch = html.match(/Problems\s*solved[^<]*<[^>]*>(\d+)/i) || html.match(/(\d+)\s*problems?\s*solved/i)
    const scoreMatch = html.match(/Score[^<]*<[^>]*>([\d.]+)/i) || html.match(/Score[:\s]*([\d.]+)/i)
    const worldRankMatch = html.match(/World\s*[Rr]ank[^<]*<[^>]*>(\d+)/i) || html.match(/World\s*[Rr]ank[:\s]*(\d+)/i)
    const countryRankMatch = html.match(/Country\s*[Rr]ank[^<]*<[^>]*>(\d+)/i) || html.match(/Country\s*[Rr]ank[:\s]*(\d+)/i)
    const instRankMatch = html.match(/Institution\s*[Rr]ank[^<]*<[^>]*>(\d+)/i)
    const joinMatch = html.match(/(\d{4}-\d{2}-\d{2})/)
    const lastMatch = html.match(/Last\s*[Ll]ogin[^<]*<[^>]*>([^<]+)/i)

    if (solvedMatch) problemsSolved = parseInt(solvedMatch[1])
    if (scoreMatch) score = parseFloat(scoreMatch[1])
    if (worldRankMatch) worldRank = parseInt(worldRankMatch[1])
    if (countryRankMatch) countryRank = parseInt(countryRankMatch[1])
    if (instRankMatch) institutionRank = parseInt(instRankMatch[1])
    if (joinMatch) joinDate = joinMatch[1]
    if (lastMatch) lastLogin = lastMatch[1].trim()

    return {
      username: u, problemsSolved, score, rank: worldRank,
      worldRank, countryRank, institutionRank, joinDate, lastLogin, profileUrl,
    }
  } catch (error) {
    console.error('SPOJ fetch error:', error)
    return null
  }
}
