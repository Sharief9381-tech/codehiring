export interface LeetCodeStats {
  username: string
  totalSolved: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  ranking: number
  contributionPoints: number
  reputation: number
  submissionCalendar?: Record<string, number>  // unix timestamp (day) → count
}

export async function fetchLeetCodeStats(username: string): Promise<LeetCodeStats | null> {
  try {
    // Clean the username - handle both username and full URL
    let cleanUsername = username.trim()
    
    // Extract username from LeetCode URL if provided
    const urlPattern = /(?:https?:\/\/)?(?:www\.)?leetcode\.com\/(?:u\/)?([^\/\?\s]+)/i
    const match = cleanUsername.match(urlPattern)
    if (match) {
      cleanUsername = match[1]
    }
    
    
    // Using the public LeetCode GraphQL API
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          profile {
            ranking
          }
          contributions {
            points
          }
          submissionCalendar
        }
      }
    `

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://leetcode.com",
        "User-Agent": "Mozilla/5.0 (compatible; CodeTrack/1.0)",
      },
      body: JSON.stringify({
        query,
        variables: { username: cleanUsername },
      }),
    })

    if (!response.ok) {
      console.error("LeetCode API error:", response.status, response.statusText)
      return null
    }

    const data = await response.json()
    
    // Check for GraphQL errors
    if (data.errors) {
      console.error("LeetCode GraphQL errors:", data.errors)
      return null
    }
    
    if (!data.data?.matchedUser) {
      return null // Return null instead of fake data when profile doesn't exist
    }

    const user = data.data.matchedUser
    const submissions = user.submitStats?.acSubmissionNum || []
    
    const easySolved = submissions.find((s: { difficulty: string }) => s.difficulty === "Easy")?.count || 0
    const mediumSolved = submissions.find((s: { difficulty: string }) => s.difficulty === "Medium")?.count || 0
    const hardSolved = submissions.find((s: { difficulty: string }) => s.difficulty === "Hard")?.count || 0

    return {
      username: cleanUsername,
      totalSolved: easySolved + mediumSolved + hardSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      ranking: user.profile?.ranking || 0,
      contributionPoints: user.contributions?.points || 0,
      reputation: 0,
      // submissionCalendar: JSON string like '{"1735689600":3,"1735776000":1,...}'
      // Keys are unix timestamps (day start), values are submission counts
      submissionCalendar: user.submissionCalendar
        ? JSON.parse(user.submissionCalendar)
        : undefined,
    }
  } catch (error) {
    console.error("Error fetching LeetCode stats:", error)
    return null
  }
}
