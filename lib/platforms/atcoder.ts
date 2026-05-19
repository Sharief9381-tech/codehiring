export interface AtCoderStats {
  username: string
  rating: number
  highestRating: number
  rank: string
  problemsSolved: number
  contests: Array<{ name: string; rank: number; rating: number; date: string }>
  profileUrl: string
}

function getRankFromRating(rating: number): string {
  if (rating >= 3200) return "Red"
  if (rating >= 2800) return "Orange"
  if (rating >= 2400) return "Yellow"
  if (rating >= 2000) return "Blue"
  if (rating >= 1600) return "Cyan"
  if (rating >= 1200) return "Green"
  if (rating >= 800) return "Brown"
  if (rating > 0) return "Gray"
  return "Unrated"
}

export async function fetchAtCoderStats(username: string): Promise<AtCoderStats | null> {
  try {
    let u = username.trim()
    const urlMatch = u.match(/atcoder\.jp\/users\/([^\/\?\s]+)/i)
    if (urlMatch) u = urlMatch[1]

    if (!u || !/^[a-zA-Z0-9_]+$/.test(u)) return null

    const profileUrl = `https://atcoder.jp/users/${u}`
    const historyUrl = `https://atcoder.jp/users/${u}/history/json`

    // 1. Verify profile exists (404 = user doesn't exist)
    const profileRes = await fetch(profileUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(10000),
    })
    if (!profileRes.ok) return null

    const html = await profileRes.text()
    if (html.includes("ユーザーが見つかりません") || html.includes("User not found")) return null

    // 2. Get contest history JSON (real AtCoder public API)
    let rating = 0
    let highestRating = 0
    let contests: AtCoderStats["contests"] = []

    try {
      const histRes = await fetch(historyUrl, {
        headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
        signal: AbortSignal.timeout(10000),
      })
      if (histRes.ok) {
        const history: any[] = await histRes.json()
        if (Array.isArray(history) && history.length > 0) {
          const latest = history[history.length - 1]
          rating = latest.NewRating ?? 0
          highestRating = Math.max(...history.map((c) => c.NewRating ?? 0))
          contests = history.slice(-10).reverse().map((c) => ({
            name: c.ContestScreenName || c.ContestName || "Contest",
            rank: c.Place || 0,
            rating: c.NewRating || 0,
            date: c.EndTime || "",
          }))
        }
      }
    } catch (_) {}

    // 3. Problems solved from kenkoooo AC rank API (real public API)
    let problemsSolved = 0
    try {
      const acRes = await fetch(
        `https://kenkoooo.com/atcoder/atcoder-api/v3/user/ac_rank?user=${u}`,
        { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(8000) }
      )
      if (acRes.ok) {
        const acData = await acRes.json()
        problemsSolved = acData.count ?? 0
      }
    } catch (_) {}

    return {
      username: u,
      rating,
      highestRating,
      rank: getRankFromRating(rating),
      problemsSolved,
      contests,
      profileUrl,
    }
  } catch (error) {
    console.error("AtCoder fetch error:", error)
    return null
  }
}
