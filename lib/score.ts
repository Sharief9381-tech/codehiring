/**
 * Canonical CodeHiring Score calculation.
 * Single source of truth — used by dashboard, profile, public profile, and API routes.
 *
 * Max 1000 pts breakdown:
 *   400 — Problems solved  (maxes at 500 problems)
 *   200 — Highest rating   (maxes at 1600)
 *   150 — GitHub contribs  (maxes at 365/year)
 *   150 — Contests         (maxes at 20)
 *   100 — Profile complete (5 checklist items × 20pts each)
 */
export function computeCodeHiringScore(student: any): number {
  const linkedPlatforms: Record<string, any> = student?.linkedPlatforms || {}

  let totalProblems = 0
  let highestRating = 0
  let githubContributions = 0
  let contestsAttended = 0

  Object.entries(linkedPlatforms).forEach(([pid, data]) => {
    if (!data || typeof data !== "object") return
    const s = (data as any).stats
    if (!s) return

    totalProblems += s.totalSolved || s.problemsSolved || 0

    if (pid === "github") {
      githubContributions = s.totalContributions || 0
    }

    const rating = Math.max(
      s.rating         || 0,
      s.currentRating  || 0,
      s.highestRating  || 0,
      s.contestRating  || 0,
      s.codingScore    || 0,
    )
    if (rating > highestRating) highestRating = rating

    contestsAttended +=
      s.contests?.length ||
      s.contestsParticipated ||
      s.attendedContestsCount ||
      0
  })

  // Profile completeness: 5 items × 20 pts = max 100 pts
  const platformCount = Object.keys(linkedPlatforms).filter(k => linkedPlatforms[k]).length
  const checklistDone = [
    platformCount > 0,
    !!student?.linkedinUrl,
    (student?.skills?.length ?? 0) > 0,
    !!student?.isOpenToWork,
    !!linkedPlatforms?.github,
  ].filter(Boolean).length

  const profileComplete = checklistDone * 20  // 0–100

  return Math.min(1000, Math.round(
    Math.min((totalProblems     / 500)  * 400, 400) +
    Math.min((highestRating     / 1600) * 200, 200) +
    Math.min((githubContributions / 365) * 150, 150) +
    Math.min((contestsAttended  / 20)   * 150, 150) +
    profileComplete,
  ))
}
