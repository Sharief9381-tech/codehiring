export interface CodeforcesStats {
  username: string
  rating: number
  maxRating: number
  rank: string
  maxRank: string
  contribution: number
  friendOfCount: number
  avatar: string
  problemsSolved: number
  contests: {
    contestId: number
    contestName: string
    rank: number
    oldRating: number
    newRating: number
    ratingChange: number
  }[]
  submissions: {
    problem: {
      name: string
      rating: number
      tags: string[]
    }
    verdict: string
    language: string
    creationTimeSeconds: number
  }[]
}

// In-memory cooldown to avoid hammering Codeforces API
const _cfLastCall: Record<string, number> = {}
const CF_COOLDOWN_MS = 10_000 // 10 seconds between calls per user

async function cfFetch(url: string): Promise<Response> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; CodeTrack/1.0)" },
    signal: AbortSignal.timeout(10000),
  })
  if (res.status === 429) throw new Error("Codeforces rate limit hit — try again later")
  return res
}

export async function fetchCodeforcesStats(username: string): Promise<CodeforcesStats | null> {
  try {
    let cleanUsername = username.trim()
    const urlPattern = /(?:https?:\/\/)?(?:www\.)?codeforces\.com\/profile\/([^\/\?\s]+)/i
    const match = cleanUsername.match(urlPattern)
    if (match) cleanUsername = match[1]

    // Cooldown check — prevent hammering the API
    const now = Date.now()
    const last = _cfLastCall[cleanUsername] || 0
    if (now - last < CF_COOLDOWN_MS) {
      console.log(`Codeforces cooldown active for ${cleanUsername}, skipping fetch`)
      return null
    }
    _cfLastCall[cleanUsername] = now

    console.log(`Fetching Codeforces stats for: ${cleanUsername}`)

    // Method 1: cp-rating-api (faster, no rate limit issues)
    try {
      const cpRes = await fetch(`https://cp-rating-api.vercel.app/codeforces/${cleanUsername}`, {
        headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(8000),
      })
      if (cpRes.ok) {
        const cpData = await cpRes.json()
        if (cpData && !cpData.error && cpData.success !== false) {
          return {
            username: cleanUsername,
            rating: cpData.rating || cpData.current_rating || 0,
            maxRating: cpData.max_rating || cpData.highest_rating || cpData.rating || 0,
            rank: cpData.rank || 'unrated',
            maxRank: cpData.max_rank || cpData.rank || 'unrated',
            contribution: cpData.contribution || 0,
            friendOfCount: cpData.friend_of_count || 0,
            avatar: cpData.avatar || 'https://userpic.codeforces.org/no-avatar.jpg',
            problemsSolved: cpData.problems_solved || cpData.solved || 0,
            contests: cpData.contests || [],
            submissions: cpData.submissions || [],
          }
        }
      }
    } catch { /* fall through to official API */ }

    // Method 2: Official Codeforces API with rate-limit-aware helper
    const userRes = await cfFetch(`https://codeforces.com/api/user.info?handles=${cleanUsername}`)
    if (!userRes.ok) return null

    const userData = await userRes.json()
    if (userData.status !== "OK" || !userData.result?.[0]) return null
    const user = userData.result[0]

    // Rating history
    let contests: CodeforcesStats["contests"] = []
    try {
      const ratingRes = await cfFetch(`https://codeforces.com/api/user.rating?handle=${cleanUsername}`)
      if (ratingRes.ok) {
        const ratingData = await ratingRes.json()
        if (ratingData.status === "OK") {
          contests = ratingData.result.slice(-10).reverse().map((c: any) => ({
            contestId: c.contestId,
            contestName: c.contestName,
            rank: c.rank,
            oldRating: c.oldRating,
            newRating: c.newRating,
            ratingChange: c.newRating - c.oldRating,
          }))
        }
      }
    } catch { /* ignore rating fetch error */ }

    // Submissions — reduced count to avoid rate limits
    let submissions: CodeforcesStats["submissions"] = []
    let problemsSolved = 0
    try {
      const subRes = await cfFetch(`https://codeforces.com/api/user.status?handle=${cleanUsername}&from=1&count=50`)
      if (subRes.ok) {
        const subData = await subRes.json()
        if (subData.status === "OK") {
          const solvedSet = new Set<string>()
          for (const sub of subData.result) {
            if (sub.verdict === "OK") solvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`)
          }
          problemsSolved = solvedSet.size
          submissions = subData.result.slice(0, 10).map((sub: any) => ({
            problem: { name: sub.problem.name, rating: sub.problem.rating || 0, tags: sub.problem.tags || [] },
            verdict: sub.verdict,
            language: sub.programmingLanguage,
            creationTimeSeconds: sub.creationTimeSeconds,
          }))
        }
      }
    } catch { /* ignore submissions fetch error */ }

    return {
      username: cleanUsername,
      rating: user.rating || 0,
      maxRating: user.maxRating || 0,
      rank: user.rank || "unrated",
      maxRank: user.maxRank || "unrated",
      contribution: user.contribution || 0,
      friendOfCount: user.friendOfCount || 0,
      avatar: user.avatar || user.titlePhoto || "",
      problemsSolved,
      contests,
      submissions,
    }
  } catch (error: any) {
    console.error("Codeforces fetch error:", error.message)
    return null
  }
}

function getRankFromRating(rating: number): string {
  if (rating >= 3000) return "legendary grandmaster"
  if (rating >= 2600) return "international grandmaster"
  if (rating >= 2400) return "grandmaster"
  if (rating >= 2300) return "international master"
  if (rating >= 2100) return "master"
  if (rating >= 1900) return "candidate master"
  if (rating >= 1600) return "expert"
  if (rating >= 1400) return "specialist"
  if (rating >= 1200) return "pupil"
  return "newbie"
}
