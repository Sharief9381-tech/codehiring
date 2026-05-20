/**
 * Job matching service.
 * Computes a match score (0–100) between a student profile and a job posting.
 *
 * Scoring breakdown:
 *   Skills match      — 50 pts  (% of required skills the student has)
 *   Problems solved   — 20 pts  (meets/exceeds minProblems)
 *   Rating            — 20 pts  (meets/exceeds minRating)
 *   Profile complete  — 10 pts  (has platforms linked, isOpenToWork)
 */

import type { JobDocument } from "@/lib/models/job"

export interface StudentMatchProfile {
  skills: string[]
  totalProblems: number
  rating: number
  platformCount: number
  isOpenToWork: boolean
}

export interface MatchedJob extends JobDocument {
  matchScore: number
  matchedSkills: string[]
  missingSkills: string[]
}

export function computeMatchScore(student: StudentMatchProfile, job: JobDocument): number {
  let score = 0

  // ── Skills (50 pts) ──────────────────────────────────────────────────────
  const studentSkillsLower = student.skills.map((s) => s.toLowerCase())
  const jobSkillsLower = job.skills.map((s) => s.toLowerCase())

  const matched = jobSkillsLower.filter((s) => studentSkillsLower.includes(s))
  const skillScore = jobSkillsLower.length > 0
    ? (matched.length / jobSkillsLower.length) * 50
    : 50 // no required skills = full points

  score += skillScore

  // ── Problems solved (20 pts) ─────────────────────────────────────────────
  const minProblems = job.minProblems ?? 0
  if (minProblems === 0) {
    score += 20
  } else {
    const ratio = Math.min(student.totalProblems / minProblems, 1)
    score += ratio * 20
  }

  // ── Rating (20 pts) ──────────────────────────────────────────────────────
  const minRating = job.minRating ?? 0
  if (minRating === 0) {
    score += 20
  } else {
    const ratio = Math.min(student.rating / minRating, 1)
    score += ratio * 20
  }

  // ── Profile completeness (10 pts) ────────────────────────────────────────
  if (student.isOpenToWork) score += 5
  if (student.platformCount > 0) score += 5

  return Math.round(score)
}

export function matchJobsToStudent(
  student: StudentMatchProfile,
  jobs: JobDocument[]
): MatchedJob[] {
  const studentSkillsLower = student.skills.map((s) => s.toLowerCase())

  return jobs
    .filter((j) => j.status === "active")
    .map((job) => {
      const jobSkillsLower = job.skills.map((s) => s.toLowerCase())
      const matchedSkills = job.skills.filter((s) =>
        studentSkillsLower.includes(s.toLowerCase())
      )
      const missingSkills = job.skills.filter(
        (s) => !studentSkillsLower.includes(s.toLowerCase())
      )
      const matchScore = computeMatchScore(student, job)

      return { ...job, matchScore, matchedSkills, missingSkills }
    })
    .sort((a, b) => b.matchScore - a.matchScore)
}
