export interface InterviewBitStats {
  username: string
  score: number
  rank: number
  problemsSolved: number
  streakDays: number
  profileUrl: string
}

export async function fetchInterviewBitStats(username: string): Promise<InterviewBitStats | null> {
  try {
    let u = username.trim()
    const urlMatch = u.match(/interviewbit\.com\/profile\/([^\/\?\s]+)/i)
    if (urlMatch) u = urlMatch[1]

    if (!u || !/^[a-zA-Z0-9_-]+$/.test(u)) return null

    console.log(`Fetching InterviewBit stats for: ${u}`)

    const profileUrl = `https://www.interviewbit.com/profile/${u}`

    // InterviewBit profile page — check existence via HTTP status
    const res = await fetch(profileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(12000),
    })

    if (!res.ok) return null

    const html = await res.text()
    const lower = html.toLowerCase()

    if (lower.includes('user not found') || lower.includes('profile not found') || lower.includes('page not found')) return null
    // InterviewBit profile pages contain this marker when valid
    if (!lower.includes('interviewbit') || html.length < 5000) return null

    // Extract score
    let score = 0, rank = 0, problemsSolved = 0, streakDays = 0

    const scoreMatch = html.match(/"score"\s*:\s*(\d+)/) || html.match(/(\d+)\s*Score/i)
    const rankMatch = html.match(/"rank"\s*:\s*(\d+)/) || html.match(/Rank[:\s#]*(\d+)/i)
    const solvedMatch = html.match(/"problems_solved"\s*:\s*(\d+)/) || html.match(/(\d+)\s*Problems?\s*Solved/i)
    const streakMatch = html.match(/"streak"\s*:\s*(\d+)/) || html.match(/(\d+)\s*[Dd]ay[s]?\s*[Ss]treak/)

    if (scoreMatch) score = parseInt(scoreMatch[1])
    if (rankMatch) rank = parseInt(rankMatch[1])
    if (solvedMatch) problemsSolved = parseInt(solvedMatch[1])
    if (streakMatch) streakDays = parseInt(streakMatch[1])

    return { username: u, score, rank, problemsSolved, streakDays, profileUrl }
  } catch (error) {
    console.error('InterviewBit fetch error:', error)
    return null
  }
}
