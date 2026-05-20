export interface CSESStats {
  username: string
  problemsSolved: number
  totalProblems: number
  completionRate: number
  profileUrl: string
}

export async function fetchCSESStats(username: string): Promise<CSESStats | null> {
  try {
    let u = username.trim()
    const urlMatch = u.match(/cses\.fi\/user\/([^\/\?\s]+)/i)
    if (urlMatch) u = urlMatch[1]

    if (!u || !/^[a-zA-Z0-9_-]+$/.test(u)) return null

    console.log(`Fetching CSES stats for: ${u}`)

    const profileUrl = `https://cses.fi/user/${u}`

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
    // CSES redirects to /list if user doesn't exist
    if (res.url && res.url.includes('/list')) return null

    let problemsSolved = 0
    const totalProblems = 300 // CSES Problem Set has ~300 problems

    // CSES profile shows solved count as "X / 300"
    const solvedMatch = html.match(/(\d+)\s*\/\s*\d+/) || html.match(/Solved[:\s]*(\d+)/i)
    if (solvedMatch) problemsSolved = parseInt(solvedMatch[1])

    const completionRate = totalProblems > 0 ? Math.round((problemsSolved / totalProblems) * 100) : 0

    return { username: u, problemsSolved, totalProblems, completionRate, profileUrl }
  } catch (error) {
    console.error('CSES fetch error:', error)
    return null
  }
}
