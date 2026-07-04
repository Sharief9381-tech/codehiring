export interface GitHubStats {
  username: string
  name: string
  bio: string
  avatarUrl: string
  publicRepos: number
  followers: number
  following: number
  totalContributions: number
  repositories: {
    name: string
    description: string
    language: string
    stars: number
    forks: number
    url: string
  }[]
  languages: Record<string, number>
  contributionCalendar: {
    totalContributions: number
    weeks: {
      contributionDays: {
        date: string
        contributionCount: number
      }[]
    }[]
  }
}

// ── helpers ────────────────────────────────────────────────────────────────────

function authHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN
  return {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "CodeHiring/1.0",
    ...(token && token !== "your-github-token"
      ? { Authorization: `Bearer ${token}` }
      : {}),
  }
}

function cleanUsername(raw: string): string {
  const m = raw.trim().match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/\?\s#]+)/i)
  return m ? m[1] : raw.trim()
}

/** Parse the public GitHub contribution SVG to get total + per-day data */
async function scrapeContributionCalendar(username: string): Promise<{
  totalContributions: number
  weeks: { contributionDays: { date: string; contributionCount: number }[] }[]
}> {
  try {
    const url = `https://github.com/users/${username}/contributions`
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: `https://github.com/${username}`,
      },
      signal: AbortSignal.timeout(12000),
    })

    if (!res.ok) return { totalContributions: 0, weeks: [] }

    const html = await res.text()

    // Extract total contribution count from the heading
    // e.g. "1,234 contributions in the last year"
    const totalMatch = html.match(/(\d[\d,]*)\s+contributions?\s+in\s+(?:the\s+)?(?:last\s+year|past\s+year|\d{4})/i)
    const total = totalMatch ? parseInt(totalMatch[1].replace(/,/g, ""), 10) : 0

    // Parse <td> or <rect> elements with data-date and data-level/data-count
    // GitHub uses: data-date="2024-01-01" data-count="3" data-level="1"
    const dayRegex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-count="(\d+)"/g
    const days: { date: string; contributionCount: number }[] = []
    let m: RegExpExecArray | null
    while ((m = dayRegex.exec(html)) !== null) {
      days.push({ date: m[1], contributionCount: parseInt(m[2], 10) })
    }

    // Group into weeks of 7
    const weeks: { contributionDays: { date: string; contributionCount: number }[] }[] = []
    for (let i = 0; i < days.length; i += 7) {
      weeks.push({ contributionDays: days.slice(i, i + 7) })
    }

    // If we found day data, sum it up for a more accurate total
    const sumFromDays = days.reduce((s, d) => s + d.contributionCount, 0)

    return {
      totalContributions: sumFromDays > 0 ? sumFromDays : total,
      weeks,
    }
  } catch {
    return { totalContributions: 0, weeks: [] }
  }
}

/** Use GraphQL if token available — more accurate */
async function fetchContributionsViaGraphQL(username: string): Promise<{
  totalContributions: number
  weeks: { contributionDays: { date: string; contributionCount: number }[] }[]
} | null> {
  const token = process.env.GITHUB_TOKEN
  if (!token || token === "your-github-token") return null

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "CodeHiring/1.0", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        query: `query($username:String!){user(login:$username){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}}}}`,
        variables: { username },
      }),
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.data?.user?.contributionsCollection?.contributionCalendar ?? null
  } catch {
    return null
  }
}

// ── Main export ────────────────────────────────────────────────────────────────

export async function fetchGitHubStats(username: string): Promise<GitHubStats | null> {
  try {
    const u = cleanUsername(username)
    if (!u) return null

    // 1. Fetch basic user info
    const userRes = await fetch(`https://api.github.com/users/${u}`, {
      headers: authHeaders(),
      signal: AbortSignal.timeout(10000),
    })

    if (userRes.status === 404) {
      console.error(`GitHub: user "${u}" not found`)
      return null
    }
    if (userRes.status === 403 || userRes.status === 429) {
      console.warn(`GitHub: rate limited for "${u}"`)
      // Still try to return partial data via HTML scraping
    }
    if (!userRes.ok) {
      console.error(`GitHub API error: ${userRes.status} for user "${u}"`)
      return null
    }

    const userData = await userRes.json()

    // 2. Fetch repos
    let reposData: any[] = []
    try {
      const reposRes = await fetch(
        `https://api.github.com/users/${u}/repos?sort=updated&per_page=20`,
        { headers: authHeaders(), signal: AbortSignal.timeout(10000) }
      )
      if (reposRes.ok) reposData = await reposRes.json()
    } catch { /* skip */ }

    // 3. Language breakdown
    const languages: Record<string, number> = {}
    for (const repo of reposData) {
      if (repo.language) languages[repo.language] = (languages[repo.language] || 0) + 1
    }

    // 4. Contribution calendar — try GraphQL first, then HTML scrape
    let calendar = await fetchContributionsViaGraphQL(u)
    if (!calendar || calendar.totalContributions === 0) {
      calendar = await scrapeContributionCalendar(u)
    }

    // 5. Fallback: public events API (last ~90 days)
    if (calendar.totalContributions === 0) {
      try {
        const evRes = await fetch(
          `https://api.github.com/users/${u}/events/public?per_page=100`,
          { headers: authHeaders(), signal: AbortSignal.timeout(8000) }
        )
        if (evRes.ok) {
          const events: any[] = await evRes.json()
          const pushTotal = events
            .filter((e: any) => e.type === "PushEvent")
            .reduce((s: number, e: any) => s + (e.payload?.commits?.length ?? 1), 0)
          const otherTotal = events.filter((e: any) =>
            ["PullRequestEvent","IssuesEvent","CreateEvent","CommitCommentEvent"].includes(e.type)
          ).length
          calendar.totalContributions = pushTotal + otherTotal
        }
      } catch { /* skip */ }
    }

    return {
      username: u,
      name: userData.name || u,
      bio: userData.bio || "",
      avatarUrl: userData.avatar_url || "",
      publicRepos: userData.public_repos || 0,
      followers: userData.followers || 0,
      following: userData.following || 0,
      totalContributions: calendar.totalContributions,
      repositories: reposData.slice(0, 10).map((repo: any) => ({
        name: repo.name,
        description: repo.description || "",
        language: repo.language || "Unknown",
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        url: repo.html_url,
      })),
      languages,
      contributionCalendar: calendar,
    }
  } catch (err) {
    console.error("fetchGitHubStats error:", err)
    return null
  }
}
