/**
 * Stats Aggregator
 * Reads all linked platform stats from a student's document and
 * computes unified stats that are stored in user.stats.
 *
 * Called after every platform sync so user.stats is always fresh.
 */

import { UserModel } from "@/lib/models/user"
import type { StudentStats } from "@/lib/types"

/**
 * Aggregate all platform stats for a student and persist to user.stats.
 * Returns the computed stats.
 */
export async function aggregateStudentStats(userId: string): Promise<StudentStats> {
  const user = await UserModel.findById(userId)
  if (!user) throw new Error("User not found")

  const platforms = (user.linkedPlatforms ?? {}) as Record<string, any>

  let totalProblems = 0
  let easyProblems = 0
  let mediumProblems = 0
  let hardProblems = 0
  let githubContributions = 0
  let contestsParticipated = 0
  let bestRating = 0

  for (const [platformId, platformData] of Object.entries(platforms)) {
    if (!platformData?.stats) continue
    const s = platformData.stats

    switch (platformId.toLowerCase()) {
      case "leetcode":
        totalProblems += s.totalSolved ?? 0
        easyProblems += s.easySolved ?? 0
        mediumProblems += s.mediumSolved ?? 0
        hardProblems += s.hardSolved ?? 0
        break

      case "codeforces":
        totalProblems += s.problemsSolved ?? 0
        contestsParticipated += s.contests?.length ?? 0
        if ((s.rating ?? 0) > bestRating) bestRating = s.rating ?? 0
        break

      case "codechef":
        totalProblems += s.problemsSolved ?? 0
        contestsParticipated += s.contests?.length ?? 0
        if ((s.currentRating ?? 0) > bestRating) bestRating = s.currentRating ?? 0
        break

      case "github":
        githubContributions += s.totalContributions ?? s.contributions ?? 0
        break

      case "hackerrank":
        totalProblems += s.totalScore ?? 0
        break

      case "hackerearth":
        totalProblems += s.problemsSolved ?? 0
        if ((s.rating ?? 0) > bestRating) bestRating = s.rating ?? 0
        break

      case "geeksforgeeks":
        totalProblems += s.problemsSolved ?? s.stats?.problemsSolved ?? 0
        break

      case "atcoder":
        totalProblems += s.problemsSolved ?? 0
        contestsParticipated += s.contests?.length ?? 0
        if ((s.rating ?? 0) > bestRating) bestRating = s.rating ?? 0
        break

      case "spoj":
        totalProblems += s.problemsSolved ?? s.solved ?? 0
        break

      case "kattis":
        totalProblems += s.problemsSolved ?? 0
        break

      case "topcoder":
        if ((s.rating ?? s.algorithmRating ?? 0) > bestRating)
          bestRating = s.rating ?? s.algorithmRating ?? 0
        break

      case "interviewbit":
        totalProblems += s.problemsSolved ?? 0
        break

      case "cses":
        totalProblems += s.problemsSolved ?? 0
        break

      case "codestudio":
        totalProblems += s.problemsSolved ?? 0
        break

      case "exercism":
        totalProblems += s.exercisesCompleted ?? s.problemsSolved ?? 0
        break

      case "kaggle":
        // Kaggle doesn't have problems in the traditional sense
        break

      default:
        // Generic / custom platforms
        totalProblems += s.totalSolved ?? s.problemsSolved ?? s.solved ?? 0
        if ((s.rating ?? s.currentRating ?? 0) > bestRating)
          bestRating = s.rating ?? s.currentRating ?? 0
        break
    }
  }

  const stats: StudentStats = {
    totalProblems,
    easyProblems,
    mediumProblems,
    hardProblems,
    githubContributions,
    contestsParticipated,
    rating: bestRating,
  }

  // Persist aggregated stats back to the user document
  await UserModel.update(userId, { stats })

  return stats
}

/**
 * Compute a live match score for a student against a job,
 * using the latest aggregated stats (no stale cache).
 */
export function computeLiveMatchScore(
  stats: StudentStats,
  skills: string[],
  isOpenToWork: boolean,
  platformCount: number,
  job: {
    skills: string[]
    minProblems?: number
    minRating?: number
  }
): {
  score: number
  matchedSkills: string[]
  missingSkills: string[]
  breakdown: {
    skills: number
    problems: number
    rating: number
    profile: number
  }
} {
  const studentSkillsLower = skills.map((s) => s.toLowerCase())
  const jobSkillsLower = job.skills.map((s) => s.toLowerCase())

  // Skills (50 pts)
  const matched = jobSkillsLower.filter((s) => studentSkillsLower.includes(s))
  const skillScore =
    jobSkillsLower.length > 0 ? (matched.length / jobSkillsLower.length) * 50 : 50

  // Problems (20 pts)
  const minProblems = job.minProblems ?? 0
  const problemScore =
    minProblems === 0
      ? 20
      : Math.min(stats.totalProblems / minProblems, 1) * 20

  // Rating (20 pts)
  const minRating = job.minRating ?? 0
  const ratingScore =
    minRating === 0
      ? 20
      : Math.min(stats.rating / minRating, 1) * 20

  // Profile completeness (10 pts)
  const profileScore = (isOpenToWork ? 5 : 0) + (platformCount > 0 ? 5 : 0)

  const total = Math.round(skillScore + problemScore + ratingScore + profileScore)

  return {
    score: total,
    matchedSkills: job.skills.filter((s) => studentSkillsLower.includes(s.toLowerCase())),
    missingSkills: job.skills.filter((s) => !studentSkillsLower.includes(s.toLowerCase())),
    breakdown: {
      skills: Math.round(skillScore),
      problems: Math.round(problemScore),
      rating: Math.round(ratingScore),
      profile: profileScore,
    },
  }
}
