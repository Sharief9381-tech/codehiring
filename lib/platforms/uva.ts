export interface UVaStats {
  username: string
  problemsSolved: number
  submissions: number
  rank: number
  country: string
  profileUrl: string
}

export async function fetchUVaStats(username: string): Promise<UVaStats | null> {
  try {
    // Clean the username - handle both username and full URL
    let cleanUsername = username.trim()
    
    // Extract username from UVa URL if provided
    const urlPattern = /(?:https?:\/\/)?(?:uhunt\.)?onlinejudge\.org\/id\/([^\/\?\s]+)/i
    const match = cleanUsername.match(urlPattern)
    if (match) {
      cleanUsername = match[1]
    }
    
    
    const profileUrl = `https://uhunt.onlinejudge.org/id/${cleanUsername}`
    
    // Method 1: Try third-party APIs
    const thirdPartyApis = [
      `https://competitive-coding-api.herokuapp.com/api/uva/${cleanUsername}`,
      `https://cp-api.vercel.app/uva/${cleanUsername}`,
    ]

    for (const apiUrl of thirdPartyApis) {
      try {
        const response = await fetch(apiUrl, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; StatsBot/1.0)',
          },
          signal: AbortSignal.timeout(8000),
        })

        if (response.ok) {
          const data = await response.json()
          
          if (data && !data.error && data.success !== false) {
            return {
              username: cleanUsername,
              problemsSolved: data.problems_solved || data.solved || 0,
              submissions: data.submissions || 0,
              rank: data.rank || 0,
              country: data.country || '',
              profileUrl
            }
          }
        }
      } catch (apiError) {
        continue
      }
    }
    
    // Method 2: Try UVa profile scraping
    try {
      const response = await fetch(profileUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
        signal: AbortSignal.timeout(15000)
      })
      
      if (!response.ok) {
        return null
      }
      
      const html = await response.text()
      
      // Check if profile exists
      if (html.includes('User not found') || html.includes('404') || html.includes('does not exist')) {
        return null
      }
      
      
      // Extract stats from HTML
      let problemsSolved = 0
      let submissions = 0
      let rank = 0
      let country = ''
      
      // Enhanced regex patterns for UVa
      const problemsMatch = html.match(/problems?[_\s]*solved["\s]*:[\s]*(\d+)/gi) ||
                           html.match(/solved["\s]*:[\s]*(\d+)/gi) ||
                           html.match(/(\d+)\s*problems?\s*solved/gi) ||
                           html.match(/AC["\s]*:[\s]*(\d+)/gi)
      
      const submissionsMatch = html.match(/submissions?["\s]*:[\s]*(\d+)/gi) ||
                              html.match(/(\d+)\s*submissions?/gi)
      
      const rankMatch = html.match(/rank["\s]*:[\s]*(\d+)/gi) ||
                       html.match(/(\d+)\s*rank/gi)
      
      const countryMatch = html.match(/country["\s]*:[\s]*"([^"]+)"/gi) ||
                          html.match(/country["\s]*:[\s]*([A-Za-z\s]+)/gi)
      
      if (problemsMatch && problemsMatch[0].match(/\d+/)) {
        problemsSolved = parseInt(problemsMatch[0].match(/\d+/)![0])
      }
      if (submissionsMatch && submissionsMatch[0].match(/\d+/)) {
        submissions = parseInt(submissionsMatch[0].match(/\d+/)![0])
      }
      if (rankMatch && rankMatch[0].match(/\d+/)) {
        rank = parseInt(rankMatch[0].match(/\d+/)![0])
      }
      if (countryMatch) {
        country = countryMatch[0].replace(/["\[\]]/g, '').trim()
      }
      
      
      const stats: UVaStats = {
        username: cleanUsername,
        problemsSolved: problemsSolved,
        submissions: submissions,
        rank: rank,
        country: country,
        profileUrl
      }
      
      return stats
      
    } catch (error) {
    }

    // Method 3: Basic profile validation (fallback)
    if (cleanUsername && cleanUsername.length > 0 && /^[a-zA-Z0-9_-]+$/.test(cleanUsername)) {
      
      return {
        username: cleanUsername,
        problemsSolved: 0,
        submissions: 0,
        rank: 0,
        country: '',
        profileUrl
      }
    }
    
    return null
  } catch (error) {
    console.error("Error fetching UVa real-time stats:", error)
    return null
  }
}