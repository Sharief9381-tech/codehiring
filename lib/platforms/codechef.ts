export interface CodeChefStats {
  username: string
  currentRating: number
  highestRating: number
  stars: string
  globalRank: number
  countryRank: number
  problemsSolved: number
  // Daily heatmap: { "YYYY-MM-DD": count } — last 6 months from codechef-api
  heatMap?: Record<string, number>
}

export async function fetchCodeChefStats(username: string): Promise<CodeChefStats | null> {
  try {
    let cleanUsername = username.trim()

    // Extract username from CodeChef URL if provided
    const urlPattern = /(?:https?:\/\/)?(?:www\.)?codechef\.com\/users\/([^\/\?\s]+)/i
    const match = cleanUsername.match(urlPattern)
    if (match) cleanUsername = match[1]


    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      return null
    }

    // ── 1. Community API (most reliable, returns structured JSON) ──────────
    try {
      const apiUrl = `https://codechef-api.vercel.app/${cleanUsername}`
      const res = await fetch(apiUrl, {
        headers: { Accept: 'application/json', 'User-Agent': 'CodeTrack/1.0' },
        signal: AbortSignal.timeout(10000),
      })

      if (res.ok) {
        const data = await res.json()

        if (data && !data.error && (data.currentRating !== undefined || data.rating !== undefined)) {
          const currentRating = data.currentRating ?? data.rating ?? 0
          const highestRating = data.highestRating ?? data.maxRating ?? currentRating
          const globalRank   = data.globalRank   ?? data.global_rank   ?? 0
          const countryRank  = data.countryRank  ?? data.country_rank  ?? 0
          const problemsSolved =
            data.problemsSolved ??
            data.fullySolved?.count ??
            data.solved ??
            data.totalSolved ??
            0
          const stars = data.stars ?? getStarsFromRating(currentRating)

          // heatMap comes as array of { date: "YYYY-MM-DD", value: N }
          // or as object { "YYYY-MM-DD": N } — normalise to Record<string,number>
          let heatMap: Record<string, number> | undefined
          if (Array.isArray(data.heatMap)) {
            heatMap = {}
            for (const entry of data.heatMap) {
              if (entry.date && entry.value != null) heatMap[entry.date] = Number(entry.value)
            }
          } else if (data.heatMap && typeof data.heatMap === "object") {
            heatMap = data.heatMap as Record<string, number>
          }

          return { username: cleanUsername, currentRating, highestRating, stars, globalRank, countryRank, problemsSolved, heatMap }
        }
      }
    } catch (e: any) {
    }

    // ── 2. Web scraping fallback ───────────────────────────────────────────
    try {
      const profileUrl = `https://www.codechef.com/users/${cleanUsername}`
      const res = await fetch(profileUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: AbortSignal.timeout(12000),
      })

      if (res.ok) {
        const html = await res.text()

        // Rating
        let currentRating = 0
        const ratingPatterns = [
          /"currentRating"\s*:\s*(\d+)/,
          /"rating"\s*:\s*(\d+)/,
          /Rating:\s*(\d+)/i,
          /rating[^>]*>\s*(\d{3,4})\s*</i,
        ]
        for (const p of ratingPatterns) {
          const m = html.match(p)
          if (m) { const r = parseInt(m[1]); if (r >= 400 && r <= 4000) { currentRating = r; break } }
        }

        // Highest rating
        let highestRating = 0
        const highestPatterns = [/"highestRating"\s*:\s*(\d+)/, /Highest Rating:\s*(\d+)/i]
        for (const p of highestPatterns) {
          const m = html.match(p); if (m) { highestRating = parseInt(m[1]); break }
        }

        // Global rank
        let globalRank = 0
        const globalRankPatterns = [
          /"globalRank"\s*:\s*(\d+)/,
          /Global Rank:\s*(\d+)/i,
          /global[_\s]rank[^>]*>\s*(\d+)/i,
        ]
        for (const p of globalRankPatterns) {
          const m = html.match(p); if (m) { globalRank = parseInt(m[1]); break }
        }

        // Country rank
        let countryRank = 0
        const countryRankPatterns = [
          /"countryRank"\s*:\s*(\d+)/,
          /Country Rank:\s*(\d+)/i,
          /country[_\s]rank[^>]*>\s*(\d+)/i,
        ]
        for (const p of countryRankPatterns) {
          const m = html.match(p); if (m) { countryRank = parseInt(m[1]); break }
        }

        // Problems solved
        let problemsSolved = 0
        const problemsPatterns = [
          /Total Problems Solved:\s*(\d+)/i,
          /"problemsSolved"\s*:\s*(\d+)/,
          /fully["\s]*solved["\s]*:\s*(\d+)/i,
          /(\d+)\s*problems?\s*solved/i,
        ]
        for (const p of problemsPatterns) {
          const m = html.match(p); if (m) { problemsSolved = parseInt(m[1]); break }
        }

        // Stars
        let stars = getStarsFromRating(currentRating)
        const starsMatch = html.match(/(\d+)[★*]\s*(?:Coder|rated)/i)
        if (starsMatch) stars = starsMatch[1] + '*'

        if (currentRating > 0 || problemsSolved > 0 || globalRank > 0) {
          return { username: cleanUsername, currentRating, highestRating: highestRating || currentRating, stars, globalRank, countryRank, problemsSolved }
        }
      }
    } catch (e: any) {
    }

    return null
  } catch (error) {
    console.error('Error fetching CodeChef stats:', error)
    return null
  }
}

function getStarsFromRating(rating: number): string {
  if (rating >= 2500) return '7*'
  if (rating >= 2200) return '6*'
  if (rating >= 2000) return '5*'
  if (rating >= 1800) return '4*'
  if (rating >= 1600) return '3*'
  if (rating >= 1400) return '2*'
  return '1*'
}
