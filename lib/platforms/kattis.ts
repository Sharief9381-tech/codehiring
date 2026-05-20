export interface KattisStats {
  username: string
  problemsSolved: number
  score: number
  rank: number
  country: string
  university: string
  profileUrl: string
}

export async function fetchKattisStats(username: string): Promise<KattisStats | null> {
  try {
    let u = username.trim()
    const urlMatch = u.match(/kattis\.com\/users\/([^\/\?\s]+)/i)
    if (urlMatch) u = urlMatch[1]

    if (!u || !/^[a-zA-Z0-9_.-]+$/.test(u)) return null

    console.log(`Fetching Kattis stats for: ${u}`)

    const profileUrl = `https://open.kattis.com/users/${u}`

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

    let problemsSolved = 0, score = 0, rank = 0, country = '', university = ''

    const solvedMatch = html.match(/(\d+)\s*problems?\s*solved/i) || html.match(/Solved[:\s]*(\d+)/i)
    const scoreMatch = html.match(/Score[:\s]*([\d.]+)/i) || html.match(/([\d.]+)\s*points?/i)
    const rankMatch = html.match(/Rank[:\s]*(\d+)/i) || html.match(/#(\d+)/i)
    const countryMatch = html.match(/Country[:\s]*([A-Za-z ]+)/i)
    const uniMatch = html.match(/University[:\s]*([^<\n]+)/i) || html.match(/Institution[:\s]*([^<\n]+)/i)

    if (solvedMatch) problemsSolved = parseInt(solvedMatch[1])
    if (scoreMatch) score = parseFloat(scoreMatch[1])
    if (rankMatch) rank = parseInt(rankMatch[1])
    if (countryMatch) country = countryMatch[1].trim()
    if (uniMatch) university = uniMatch[1].trim()

    return { username: u, problemsSolved, score, rank, country, university, profileUrl }
  } catch (error) {
    console.error('Kattis fetch error:', error)
    return null
  }
}
