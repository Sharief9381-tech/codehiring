/**
 * Platform-specific achievement system.
 * Each platform awards badges when the student hits specific milestones.
 * Detected after every sync — new ones prepend to student.achievements (max 5).
 */

export interface Achievement {
  id: string
  icon: string
  title: string
  desc: string        // e.g. "LeetCode · 50 problems solved"
  color: string
  bg: string
  platform: string
  earnedAt: string    // ISO string
}

export const ACHIEVEMENT_DEFINITIONS: Array<{
  id: string
  icon: string
  title: string
  desc: (s: any) => string
  color: string
  bg: string
  platform: string
  check: (s: any) => boolean
}> = [

  // ── LeetCode ────────────────────────────────────────────────────────
  {
    id: "lc_50",    platform: "leetcode",   icon: "⚡",
    title: "LeetCode — 50 Solved",
    desc:  s => `LeetCode · Solved ${s?.linkedPlatforms?.leetcode?.stats?.totalSolved ?? 0} problems`,
    color: "text-amber-400", bg: "bg-amber-400/10",
    check: s => (s?.linkedPlatforms?.leetcode?.stats?.totalSolved ?? 0) >= 50,
  },
  {
    id: "lc_100",   platform: "leetcode",   icon: "💯",
    title: "LeetCode — 100 Solved",
    desc:  s => `LeetCode · ${s?.linkedPlatforms?.leetcode?.stats?.totalSolved ?? 0} problems solved`,
    color: "text-amber-500", bg: "bg-amber-500/10",
    check: s => (s?.linkedPlatforms?.leetcode?.stats?.totalSolved ?? 0) >= 100,
  },
  {
    id: "lc_200",   platform: "leetcode",   icon: "🗡️",
    title: "LeetCode Knight",
    desc:  s => `LeetCode · ${s?.linkedPlatforms?.leetcode?.stats?.totalSolved ?? 0} problems solved`,
    color: "text-amber-500", bg: "bg-amber-500/10",
    check: s => (s?.linkedPlatforms?.leetcode?.stats?.totalSolved ?? 0) >= 200,
  },
  {
    id: "lc_500",   platform: "leetcode",   icon: "👑",
    title: "LeetCode Guardian",
    desc:  s => `LeetCode · ${s?.linkedPlatforms?.leetcode?.stats?.totalSolved ?? 0} problems solved`,
    color: "text-yellow-500", bg: "bg-yellow-500/10",
    check: s => (s?.linkedPlatforms?.leetcode?.stats?.totalSolved ?? 0) >= 500,
  },

  // ── Codeforces ──────────────────────────────────────────────────────
  {
    id: "cf_newbie",  platform: "codeforces", icon: "⬜",
    title: "Codeforces — Newbie",
    desc:  s => `Codeforces · Rating ${s?.linkedPlatforms?.codeforces?.stats?.rating ?? 0}`,
    color: "text-zinc-400",   bg: "bg-zinc-400/10",
    check: s => (s?.linkedPlatforms?.codeforces?.stats?.rating ?? 0) >= 1,
  },
  {
    id: "cf_pupil",   platform: "codeforces", icon: "🟢",
    title: "Codeforces — Pupil",
    desc:  s => `Codeforces · Rating ${s?.linkedPlatforms?.codeforces?.stats?.rating ?? 0}`,
    color: "text-green-500",  bg: "bg-green-500/10",
    check: s => (s?.linkedPlatforms?.codeforces?.stats?.rating ?? 0) >= 1200,
  },
  {
    id: "cf_spec",    platform: "codeforces", icon: "🔵",
    title: "Codeforces — Specialist",
    desc:  s => `Codeforces · Rating ${s?.linkedPlatforms?.codeforces?.stats?.rating ?? 0}`,
    color: "text-cyan-500",   bg: "bg-cyan-500/10",
    check: s => (s?.linkedPlatforms?.codeforces?.stats?.rating ?? 0) >= 1400,
  },
  {
    id: "cf_expert",  platform: "codeforces", icon: "🟣",
    title: "Codeforces — Expert",
    desc:  s => `Codeforces · Rating ${s?.linkedPlatforms?.codeforces?.stats?.rating ?? 0}`,
    color: "text-violet-500", bg: "bg-violet-500/10",
    check: s => (s?.linkedPlatforms?.codeforces?.stats?.rating ?? 0) >= 1600,
  },
  {
    id: "cf_cm",      platform: "codeforces", icon: "🏅",
    title: "Codeforces — Candidate Master",
    desc:  s => `Codeforces · Rating ${s?.linkedPlatforms?.codeforces?.stats?.rating ?? 0}`,
    color: "text-purple-500", bg: "bg-purple-500/10",
    check: s => (s?.linkedPlatforms?.codeforces?.stats?.rating ?? 0) >= 1900,
  },
  {
    id: "cf_master",  platform: "codeforces", icon: "🏆",
    title: "Codeforces — Master",
    desc:  s => `Codeforces · Rating ${s?.linkedPlatforms?.codeforces?.stats?.rating ?? 0}`,
    color: "text-amber-500",  bg: "bg-amber-500/10",
    check: s => (s?.linkedPlatforms?.codeforces?.stats?.rating ?? 0) >= 2100,
  },

  // ── CodeChef ────────────────────────────────────────────────────────
  {
    id: "cc_1star",  platform: "codechef", icon: "⭐",
    title: "CodeChef — 1 Star",
    desc:  s => `CodeChef · Rating ${s?.linkedPlatforms?.codechef?.stats?.currentRating ?? 0}`,
    color: "text-gray-400",   bg: "bg-gray-400/10",
    check: s => (s?.linkedPlatforms?.codechef?.stats?.currentRating ?? 0) >= 1,
  },
  {
    id: "cc_2star",  platform: "codechef", icon: "⭐⭐",
    title: "CodeChef — 2 Star",
    desc:  s => `CodeChef · Rating ${s?.linkedPlatforms?.codechef?.stats?.currentRating ?? 0}`,
    color: "text-amber-400",  bg: "bg-amber-400/10",
    check: s => (s?.linkedPlatforms?.codechef?.stats?.currentRating ?? 0) >= 1400,
  },
  {
    id: "cc_3star",  platform: "codechef", icon: "⭐⭐⭐",
    title: "CodeChef — 3 Star",
    desc:  s => `CodeChef · Rating ${s?.linkedPlatforms?.codechef?.stats?.currentRating ?? 0}`,
    color: "text-amber-500",  bg: "bg-amber-500/10",
    check: s => (s?.linkedPlatforms?.codechef?.stats?.currentRating ?? 0) >= 1600,
  },
  {
    id: "cc_4star",  platform: "codechef", icon: "🌟",
    title: "CodeChef — 4 Star",
    desc:  s => `CodeChef · Rating ${s?.linkedPlatforms?.codechef?.stats?.currentRating ?? 0}`,
    color: "text-orange-500", bg: "bg-orange-500/10",
    check: s => (s?.linkedPlatforms?.codechef?.stats?.currentRating ?? 0) >= 1800,
  },
  {
    id: "cc_5star",  platform: "codechef", icon: "🏅",
    title: "CodeChef — 5 Star",
    desc:  s => `CodeChef · Rating ${s?.linkedPlatforms?.codechef?.stats?.currentRating ?? 0}`,
    color: "text-red-500",    bg: "bg-red-500/10",
    check: s => (s?.linkedPlatforms?.codechef?.stats?.currentRating ?? 0) >= 2000,
  },

  // ── GeeksforGeeks ───────────────────────────────────────────────────
  {
    id: "gfg_50",   platform: "geeksforgeeks", icon: "🌿",
    title: "GFG — 50 Problems",
    desc:  s => `GeeksforGeeks · ${s?.linkedPlatforms?.geeksforgeeks?.stats?.problemsSolved ?? 0} problems solved`,
    color: "text-green-600",  bg: "bg-green-600/10",
    check: s => (s?.linkedPlatforms?.geeksforgeeks?.stats?.problemsSolved ?? 0) >= 50,
  },
  {
    id: "gfg_100",  platform: "geeksforgeeks", icon: "🌲",
    title: "GFG — 100 Problems",
    desc:  s => `GeeksforGeeks · ${s?.linkedPlatforms?.geeksforgeeks?.stats?.problemsSolved ?? 0} problems solved`,
    color: "text-green-500",  bg: "bg-green-500/10",
    check: s => (s?.linkedPlatforms?.geeksforgeeks?.stats?.problemsSolved ?? 0) >= 100,
  },
  {
    id: "gfg_200",  platform: "geeksforgeeks", icon: "🏆",
    title: "GFG — 200 Problems",
    desc:  s => `GeeksforGeeks · ${s?.linkedPlatforms?.geeksforgeeks?.stats?.problemsSolved ?? 0} problems solved`,
    color: "text-emerald-500",bg: "bg-emerald-500/10",
    check: s => (s?.linkedPlatforms?.geeksforgeeks?.stats?.problemsSolved ?? 0) >= 200,
  },

  // ── HackerRank ──────────────────────────────────────────────────────
  {
    id: "hr_1badge",  platform: "hackerrank", icon: "🥉",
    title: "HackerRank — First Badge",
    desc:  s => `HackerRank · ${s?.linkedPlatforms?.hackerrank?.stats?.badges?.length ?? 0} badges earned`,
    color: "text-green-400",  bg: "bg-green-400/10",
    check: s => (s?.linkedPlatforms?.hackerrank?.stats?.badges?.length ?? 0) >= 1,
  },
  {
    id: "hr_5badge",  platform: "hackerrank", icon: "🥈",
    title: "HackerRank — 5 Badges",
    desc:  s => `HackerRank · ${s?.linkedPlatforms?.hackerrank?.stats?.badges?.length ?? 0} badges earned`,
    color: "text-green-500",  bg: "bg-green-500/10",
    check: s => (s?.linkedPlatforms?.hackerrank?.stats?.badges?.length ?? 0) >= 5,
  },
  {
    id: "hr_10badge", platform: "hackerrank", icon: "🥇",
    title: "HackerRank — 10 Badges",
    desc:  s => `HackerRank · ${s?.linkedPlatforms?.hackerrank?.stats?.badges?.length ?? 0} badges earned`,
    color: "text-emerald-500",bg: "bg-emerald-500/10",
    check: s => (s?.linkedPlatforms?.hackerrank?.stats?.badges?.length ?? 0) >= 10,
  },

  // ── GitHub ──────────────────────────────────────────────────────────
  {
    id: "gh_50",    platform: "github", icon: "🐙",
    title: "GitHub — 50 Contributions",
    desc:  s => `GitHub · ${s?.linkedPlatforms?.github?.stats?.totalContributions ?? 0} contributions`,
    color: "text-emerald-500",bg: "bg-emerald-500/10",
    check: s => (s?.linkedPlatforms?.github?.stats?.totalContributions ?? 0) >= 50,
  },
  {
    id: "gh_200",   platform: "github", icon: "🦑",
    title: "GitHub — 200 Contributions",
    desc:  s => `GitHub · ${s?.linkedPlatforms?.github?.stats?.totalContributions ?? 0} contributions`,
    color: "text-emerald-600",bg: "bg-emerald-600/10",
    check: s => (s?.linkedPlatforms?.github?.stats?.totalContributions ?? 0) >= 200,
  },
  {
    id: "gh_500",   platform: "github", icon: "💚",
    title: "GitHub — 500 Contributions",
    desc:  s => `GitHub · ${s?.linkedPlatforms?.github?.stats?.totalContributions ?? 0} contributions`,
    color: "text-green-500",  bg: "bg-green-500/10",
    check: s => (s?.linkedPlatforms?.github?.stats?.totalContributions ?? 0) >= 500,
  },

  // ── AtCoder ─────────────────────────────────────────────────────────
  {
    id: "ac_50",    platform: "atcoder", icon: "🎯",
    title: "AtCoder — 50 Problems",
    desc:  s => `AtCoder · ${s?.linkedPlatforms?.atcoder?.stats?.problemsSolved ?? 0} problems solved`,
    color: "text-violet-400", bg: "bg-violet-400/10",
    check: s => (s?.linkedPlatforms?.atcoder?.stats?.problemsSolved ?? 0) >= 50,
  },
  {
    id: "ac_200",   platform: "atcoder", icon: "🏅",
    title: "AtCoder — 200 Problems",
    desc:  s => `AtCoder · ${s?.linkedPlatforms?.atcoder?.stats?.problemsSolved ?? 0} problems solved`,
    color: "text-violet-500", bg: "bg-violet-500/10",
    check: s => (s?.linkedPlatforms?.atcoder?.stats?.problemsSolved ?? 0) >= 200,
  },

  // ── HackerEarth ─────────────────────────────────────────────────────
  {
    id: "he_50",    platform: "hackerearth", icon: "🌐",
    title: "HackerEarth — 50 Problems",
    desc:  s => `HackerEarth · ${s?.linkedPlatforms?.hackerearth?.stats?.problemsSolved ?? 0} problems solved`,
    color: "text-indigo-500", bg: "bg-indigo-500/10",
    check: s => (s?.linkedPlatforms?.hackerearth?.stats?.problemsSolved ?? 0) >= 50,
  },

  // ── LeetCode Streak ─────────────────────────────────────────────────
  {
    id: "str_7",    platform: "leetcode", icon: "🔥",
    title: "LeetCode — 7 Day Streak",
    desc:  () => `LeetCode · 7 consecutive days`,
    color: "text-orange-400", bg: "bg-orange-400/10",
    check: s => (s?.linkedPlatforms?.leetcode?.stats?.streak ?? 0) >= 7,
  },
  {
    id: "str_30",   platform: "leetcode", icon: "🔥",
    title: "LeetCode — 30 Day Streak",
    desc:  () => `LeetCode · 30 consecutive days`,
    color: "text-orange-500", bg: "bg-orange-500/10",
    check: s => (s?.linkedPlatforms?.leetcode?.stats?.streak ?? 0) >= 30,
  },

  // ── Cross-platform ───────────────────────────────────────────────────
  {
    id: "plt_3",    platform: "all", icon: "🌐",
    title: "Multi-Platform Coder",
    desc:  s => `Active on ${platformCount(s)} coding platforms`,
    color: "text-sky-500",    bg: "bg-sky-500/10",
    check: s => platformCount(s) >= 3,
  },
  {
    id: "plt_6",    platform: "all", icon: "🌍",
    title: "Platform Master",
    desc:  s => `Active on ${platformCount(s)} coding platforms`,
    color: "text-blue-500",   bg: "bg-blue-500/10",
    check: s => platformCount(s) >= 6,
  },
]

function platformCount(s: any): number {
  return Object.keys(s?.linkedPlatforms ?? {}).filter(k => (s?.linkedPlatforms ?? {})[k]).length
}

/**
 * Called after each platform sync.
 * Detects newly unlocked achievements, prepends to student.achievements (max 5).
 */
export function detectNewAchievements(student: any, syncedPlatform: string): Achievement[] {
  const existing: Achievement[] = student.achievements ?? []
  const existingIds = new Set(existing.map((a: Achievement) => a.id))
  const now = new Date().toISOString()
  const newlyEarned: Achievement[] = []

  for (const def of ACHIEVEMENT_DEFINITIONS) {
    // Only evaluate achievements for the platform just synced (or cross-platform ones)
    if (def.platform !== "all" && def.platform !== syncedPlatform) continue
    if (existingIds.has(def.id)) continue
    if (def.check(student)) {
      newlyEarned.push({
        id:       def.id,
        icon:     def.icon,
        title:    def.title,
        desc:     def.desc(student),
        color:    def.color,
        bg:       def.bg,
        platform: def.platform,
        earnedAt: now,
      })
    }
  }

  if (newlyEarned.length === 0) return existing

  // Newest first, keep max 5
  return [...newlyEarned, ...existing].slice(0, 5)
}
