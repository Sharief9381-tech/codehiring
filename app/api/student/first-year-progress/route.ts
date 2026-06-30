/**
 * GET  /api/student/first-year-progress  — get progress, streak, badges
 * POST /api/student/first-year-progress  — update progress (complete milestone, update streak)
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDatabase } from "@/lib/database"
import { ObjectId } from "mongodb"

const COLLECTION = "first_year_progress"

const MILESTONES = [
  { id: "py-basics",    title: "Python / C Basics",      desc: "Variables, loops, functions",          xp: 50  },
  { id: "git-basics",   title: "Git & GitHub",            desc: "Clone, commit, push",                  xp: 30  },
  { id: "arrays",       title: "Arrays & Strings",        desc: "Basic DSA concepts",                   xp: 60  },
  { id: "web-basics",   title: "HTML/CSS/JS Intro",       desc: "Build your first webpage",             xp: 50  },
  { id: "lc-10",        title: "10 LeetCode Easy",        desc: "First 10 problems solved",             xp: 100 },
  { id: "lc-25",        title: "25 LeetCode Easy",        desc: "25 problems milestone",                xp: 150 },
  { id: "dsa-track",    title: "DSA Track Started",       desc: "Enrolled in a DSA course",             xp: 40  },
  { id: "streak-7",     title: "7-Day Streak",            desc: "7 consecutive days of practice",       xp: 75  },
  { id: "streak-30",    title: "30-Day Streak",           desc: "30 consecutive days",                  xp: 200 },
  { id: "profile-done", title: "Profile Complete",        desc: "All platform profiles linked",         xp: 80  },
  { id: "cs50",         title: "CS50 Started",            desc: "Began Harvard CS50x",                  xp: 60  },
  { id: "project-1",    title: "First Project",           desc: "Built and pushed a project to GitHub", xp: 120 },
]

const SKILL_BADGES: Record<string, { id: string; title: string; xp: number; track: string; level: number }> = {
  // ── Arrays track ─────────────────────────────────────────────────────────────
  "badge-array-1": { id: "badge-array-1", title: "Array Starter",    xp: 50,  track: "arrays",  level: 1 },
  "badge-array-2": { id: "badge-array-2", title: "Array Pro",        xp: 80,  track: "arrays",  level: 2 },
  "badge-array-3": { id: "badge-array-3", title: "Array Master",     xp: 150, track: "arrays",  level: 3 },
  // ── Algorithms track ─────────────────────────────────────────────────────────
  "badge-algo-1":  { id: "badge-algo-1",  title: "Loop Learner",     xp: 40,  track: "algo",    level: 1 },
  "badge-algo-2":  { id: "badge-algo-2",  title: "Loop Master",      xp: 70,  track: "algo",    level: 2 },
  "badge-algo-3":  { id: "badge-algo-3",  title: "Algorithm Ace",    xp: 130, track: "algo",    level: 3 },
  // ── Strings track ────────────────────────────────────────────────────────────
  "badge-str-1":   { id: "badge-str-1",   title: "String Starter",   xp: 50,  track: "strings", level: 1 },
  "badge-str-2":   { id: "badge-str-2",   title: "String Wizard",    xp: 80,  track: "strings", level: 2 },
  "badge-str-3":   { id: "badge-str-3",   title: "String Legend",    xp: 140, track: "strings", level: 3 },
  // ── Git track ────────────────────────────────────────────────────────────────
  "badge-git-1":   { id: "badge-git-1",   title: "Git Starter",      xp: 40,  track: "git",     level: 1 },
  "badge-git-2":   { id: "badge-git-2",   title: "Git Committer",    xp: 70,  track: "git",     level: 2 },
  "badge-git-3":   { id: "badge-git-3",   title: "Open Source Hero", xp: 120, track: "git",     level: 3 },
  // ── Trees track (unlocked after arrays complete) ──────────────────────────────
  "badge-tree-1":  { id: "badge-tree-1",  title: "Tree Sprout",      xp: 60,  track: "trees",   level: 1 },
  "badge-tree-2":  { id: "badge-tree-2",  title: "Tree Climber",     xp: 90,  track: "trees",   level: 2 },
  "badge-tree-3":  { id: "badge-tree-3",  title: "Tree Expert",      xp: 160, track: "trees",   level: 3 },
  // ── Dynamic Programming track ─────────────────────────────────────────────────
  "badge-dp-1":    { id: "badge-dp-1",    title: "DP Initiate",      xp: 60,  track: "dp",      level: 1 },
  "badge-dp-2":    { id: "badge-dp-2",    title: "DP Practitioner",  xp: 100, track: "dp",      level: 2 },
  "badge-dp-3":    { id: "badge-dp-3",    title: "DP Master",        xp: 180, track: "dp",      level: 3 },
  // ── Graphs track ─────────────────────────────────────────────────────────────
  "badge-graph-1": { id: "badge-graph-1", title: "Graph Walker",     xp: 60,  track: "graphs",  level: 1 },
  "badge-graph-2": { id: "badge-graph-2", title: "Graph Traverser",  xp: 100, track: "graphs",  level: 2 },
  "badge-graph-3": { id: "badge-graph-3", title: "Graph Master",     xp: 180, track: "graphs",  level: 3 },
  // ── SQL track ────────────────────────────────────────────────────────────────
  "badge-sql-1":   { id: "badge-sql-1",   title: "SQL Beginner",     xp: 50,  track: "sql",     level: 1 },
  "badge-sql-2":   { id: "badge-sql-2",   title: "SQL Writer",       xp: 80,  track: "sql",     level: 2 },
  "badge-sql-3":   { id: "badge-sql-3",   title: "SQL Expert",       xp: 150, track: "sql",     level: 3 },
  // ── Binary Search track ───────────────────────────────────────────────────────
  "badge-bin-1":   { id: "badge-bin-1",   title: "Binary Initiate",  xp: 70,  track: "binary",  level: 1 },
  "badge-bin-2":   { id: "badge-bin-2",   title: "Binary Searcher",  xp: 110, track: "binary",  level: 2 },
  "badge-bin-3":   { id: "badge-bin-3",   title: "Binary Expert",    xp: 180, track: "binary",  level: 3 },
  // ── Sorting track ────────────────────────────────────────────────────────────
  "badge-sort-1":  { id: "badge-sort-1",  title: "Sort Learner",     xp: 70,  track: "sorting", level: 1 },
  "badge-sort-2":  { id: "badge-sort-2",  title: "Sort Pro",         xp: 110, track: "sorting", level: 2 },
  "badge-sort-3":  { id: "badge-sort-3",  title: "Sort Master",      xp: 180, track: "sorting", level: 3 },
  // ── Recursion track ───────────────────────────────────────────────────────────
  "badge-rec-1":   { id: "badge-rec-1",   title: "Recursion Starter",xp: 70,  track: "recursion",level: 1 },
  "badge-rec-2":   { id: "badge-rec-2",   title: "Recursion Pro",    xp: 110, track: "recursion",level: 2 },
  "badge-rec-3":   { id: "badge-rec-3",   title: "Recursion Master", xp: 180, track: "recursion",level: 3 },
  // ── Hashing track ────────────────────────────────────────────────────────────
  "badge-hash-1":  { id: "badge-hash-1",  title: "Hash Beginner",    xp: 70,  track: "hashing", level: 1 },
  "badge-hash-2":  { id: "badge-hash-2",  title: "Hash Builder",     xp: 110, track: "hashing", level: 2 },
  "badge-hash-3":  { id: "badge-hash-3",  title: "Hash Master",      xp: 180, track: "hashing", level: 3 },
}

// First badge of each track — unlocked by default
const TRACK_FIRST: Record<string, string> = {
  arrays:  "badge-array-1",
  algo:    "badge-algo-1",
  strings: "badge-str-1",
  git:     "badge-git-1",
}

// What unlocks next after each badge
const BADGE_NEXT: Record<string, string | null> = {
  "badge-array-1": "badge-array-2", "badge-array-2": "badge-array-3", "badge-array-3": null,
  "badge-algo-1":  "badge-algo-2",  "badge-algo-2":  "badge-algo-3",  "badge-algo-3":  null,
  "badge-str-1":   "badge-str-2",   "badge-str-2":   "badge-str-3",   "badge-str-3":   null,
  "badge-git-1":   "badge-git-2",   "badge-git-2":   "badge-git-3",   "badge-git-3":   null,
  "badge-tree-1":  "badge-tree-2",  "badge-tree-2":  "badge-tree-3",  "badge-tree-3":  null,
  "badge-dp-1":    "badge-dp-2",    "badge-dp-2":    "badge-dp-3",    "badge-dp-3":    null,
  "badge-graph-1": "badge-graph-2", "badge-graph-2": "badge-graph-3", "badge-graph-3": null,
  "badge-sql-1":   "badge-sql-2",   "badge-sql-2":   "badge-sql-3",   "badge-sql-3":   null,
  "badge-bin-1":   "badge-bin-2",   "badge-bin-2":   "badge-bin-3",   "badge-bin-3":   null,
  "badge-sort-1":  "badge-sort-2",  "badge-sort-2":  "badge-sort-3",  "badge-sort-3":  null,
  "badge-rec-1":   "badge-rec-2",   "badge-rec-2":   "badge-rec-3",   "badge-rec-3":   null,
  "badge-hash-1":  "badge-hash-2",  "badge-hash-2":  "badge-hash-3",  "badge-hash-3":  null,
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const db = await getDatabase()
    const uid = user._id?.toString() ?? ""

    let progress = await db.collection(COLLECTION).findOne({ userId: uid })

    if (!progress) {
      const doc = {
        userId: uid,
        completed: [],
        completedBadges: [],
        streak: 0,
        lastActivity: null,
        totalXP: 0,
        onboardingSkillLevel: null,
        onboardingDone: false,
        monthlyChallengesSolved: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      await db.collection(COLLECTION).insertOne(doc)
      progress = doc
    }

    // ── Streak check ──────────────────────────────────────────────────────────
    const today = new Date(); today.setHours(0,0,0,0)
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)
    const lastAct = progress.lastActivity ? new Date(progress.lastActivity) : null
    let streak = progress.streak ?? 0
    if (lastAct) {
      const lastActDay = new Date(lastAct); lastActDay.setHours(0,0,0,0)
      if (lastActDay.getTime() < yesterday.getTime()) {
        streak = 0
        await db.collection(COLLECTION).updateOne({ userId: uid }, { $set: { streak: 0 } })
      }
    }

    // ── Auto-check badge eligibility from real platform stats ─────────────────
    const student = await db.collection("users").findOne(
      { _id: new ObjectId(uid) },
      { projection: { stats: 1, linkedPlatforms: 1 } }
    )

    const easyProblems  = student?.stats?.easyProblems  ?? 0
    const totalProblems = student?.stats?.totalProblems ?? 0
    const githubContrib = student?.stats?.githubContributions ?? 0
    const lcEasy        = student?.linkedPlatforms?.leetcode?.stats?.easySolved       ?? 0
    const lcMedium      = student?.linkedPlatforms?.leetcode?.stats?.mediumSolved     ?? 0
    const gfgProbs      = student?.linkedPlatforms?.geeksforgeeks?.stats?.problemsSolved ?? 0
    const ghRepos       = student?.linkedPlatforms?.github?.stats?.publicRepos        ?? 0
    const ghCommits     = student?.linkedPlatforms?.github?.stats?.totalCommits       ?? githubContrib
    const totalEasy     = Math.max(easyProblems, lcEasy)
    const totalAll      = Math.max(totalProblems, totalEasy + lcMedium)
    const strProbs      = Math.max(totalEasy, gfgProbs)

    // Current value per badge (for progress bars)
    const BADGE_CURRENT: Record<string, number> = {
      "badge-array-1": totalEasy,  "badge-array-2": totalEasy,  "badge-array-3": totalEasy,
      "badge-algo-1":  totalEasy,  "badge-algo-2":  totalAll,   "badge-algo-3":  totalAll,
      "badge-str-1":   strProbs,   "badge-str-2":   strProbs,   "badge-str-3":   strProbs,
      "badge-git-1":   ghRepos,    "badge-git-2":   ghCommits,  "badge-git-3":   ghCommits,
      // Advanced tracks — all use totalAll as proxy (all solved problems)
      "badge-tree-1":  totalAll,   "badge-tree-2":  totalAll,   "badge-tree-3":  totalAll,
      "badge-dp-1":    totalAll,   "badge-dp-2":    totalAll,   "badge-dp-3":    totalAll,
      "badge-graph-1": totalAll,   "badge-graph-2": totalAll,   "badge-graph-3": totalAll,
      "badge-sql-1":   totalAll,   "badge-sql-2":   totalAll,   "badge-sql-3":   totalAll,
      // Expert tracks
      "badge-bin-1":   totalAll,   "badge-bin-2":   totalAll,   "badge-bin-3":   totalAll,
      "badge-sort-1":  totalAll,   "badge-sort-2":  totalAll,   "badge-sort-3":  totalAll,
      "badge-rec-1":   totalAll,   "badge-rec-2":   totalAll,   "badge-rec-3":   totalAll,
      "badge-hash-1":  totalAll,   "badge-hash-2":  totalAll,   "badge-hash-3":  totalAll,
    }

    const BADGE_REQUIRED: Record<string, number> = {
      "badge-array-1": 3,  "badge-array-2": 15, "badge-array-3": 30,
      "badge-algo-1":  3,  "badge-algo-2":  10, "badge-algo-3":  25,
      "badge-str-1":   3,  "badge-str-2":   15, "badge-str-3":   30,
      "badge-git-1":   1,  "badge-git-2":   10, "badge-git-3":   50,
      // Advanced tracks (require more total problems)
      "badge-tree-1":  35,  "badge-tree-2":  60,  "badge-tree-3":  90,
      "badge-dp-1":    40,  "badge-dp-2":    70,  "badge-dp-3":    100,
      "badge-graph-1": 45,  "badge-graph-2": 75,  "badge-graph-3": 110,
      "badge-sql-1":   35,  "badge-sql-2":   60,  "badge-sql-3":   90,
      // Expert tracks (require significantly more problems — 100+)
      "badge-bin-1":   50,  "badge-bin-2":   80,  "badge-bin-3":   120,
      "badge-sort-1":  50,  "badge-sort-2":  80,  "badge-sort-3":  120,
      "badge-rec-1":   55,  "badge-rec-2":   90,  "badge-rec-3":   130,
      "badge-hash-1":  55,  "badge-hash-2":  90,  "badge-hash-3":  130,
    }

    // All badge IDs in processing order (level gates within each track)
    const orderedIds = [
      "badge-array-1","badge-array-2","badge-array-3",
      "badge-algo-1", "badge-algo-2", "badge-algo-3",
      "badge-str-1",  "badge-str-2",  "badge-str-3",
      "badge-git-1",  "badge-git-2",  "badge-git-3",
      "badge-tree-1", "badge-tree-2", "badge-tree-3",
      "badge-dp-1",   "badge-dp-2",   "badge-dp-3",
      "badge-graph-1","badge-graph-2","badge-graph-3",
      "badge-sql-1",  "badge-sql-2",  "badge-sql-3",
      "badge-bin-1",  "badge-bin-2",  "badge-bin-3",
      "badge-sort-1", "badge-sort-2", "badge-sort-3",
      "badge-rec-1",  "badge-rec-2",  "badge-rec-3",
      "badge-hash-1", "badge-hash-2", "badge-hash-3",
    ]

    // Check all badges in order — auto-award any newly eligible ones
    const alreadyEarned: string[] = progress.completedBadges ?? []
    const newlyAwarded: string[] = []
    let xpGained = 0

    const currentEarned = new Set(alreadyEarned)

    for (const badgeId of orderedIds) {
      if (currentEarned.has(badgeId)) continue

      const badge = SKILL_BADGES[badgeId]

      // Gate: previous level must be earned first
      if (badge.level > 1) {
        const prevId = Object.values(SKILL_BADGES).find(
          b => b.track === badge.track && b.level === badge.level - 1
        )?.id
        if (prevId && !currentEarned.has(prevId)) continue
      }

      const current  = BADGE_CURRENT[badgeId] ?? 0
      const required = BADGE_REQUIRED[badgeId] ?? 999
      if (current >= required) {
        currentEarned.add(badgeId)
        newlyAwarded.push(badgeId)
        xpGained += badge.xp
      }
    }

    // Persist newly awarded badges + XP
    if (newlyAwarded.length > 0) {
      await db.collection(COLLECTION).updateOne(
        { userId: uid },
        {
          $addToSet: { completedBadges: { $each: newlyAwarded } } as any,
          $inc: { totalXP: xpGained },
          $set: { updatedAt: new Date() },
        }
      )
      progress = { ...progress, totalXP: (progress.totalXP ?? 0) + xpGained }
    }

    // Build per-badge progress snapshot for the UI
    const badgeProgress: Record<string, { current: number; required: number }> = {}
    for (const id of orderedIds) {
      badgeProgress[id] = { current: BADGE_CURRENT[id] ?? 0, required: BADGE_REQUIRED[id] ?? 0 }
    }

    return NextResponse.json({
      progress: { ...progress, streak },
      milestones: MILESTONES,
      completedBadges: [...currentEarned] as string[],
      newlyAwarded,
      badgeProgress,
      completedChallenges: (progress.completedChallenges ?? []) as string[],
    })
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const body = await req.json()
    const { action, milestoneId, skillLevel } = body
    const db = await getDatabase()
    const uid = user._id?.toString()

    let progress = await db.collection(COLLECTION).findOne({ userId: uid }) as any
    if (!progress) {
      progress = { userId: uid, completed: [], streak: 0, lastActivity: null, totalXP: 0, onboardingSkillLevel: null, onboardingDone: false, monthlyChallengesSolved: 0, createdAt: new Date(), updatedAt: new Date() }
      await db.collection(COLLECTION).insertOne(progress)
    }

    if (action === "complete-challenge" && body.challengeId) {
      const alreadyDone = (progress.completedChallenges ?? []).includes(body.challengeId)
      if (alreadyDone) return NextResponse.json({ alreadyDone: true })
      await db.collection(COLLECTION).updateOne(
        { userId: uid },
        {
          $addToSet: { completedChallenges: body.challengeId } as any,
          $inc: { totalXP: 20 },
          $set: { lastActivity: new Date(), updatedAt: new Date() },
        }
      )
      return NextResponse.json({ success: true, xpGained: 20, newTotal: (progress.totalXP ?? 0) + 20 })
    }

    if (action === "complete-milestone" && milestoneId) {
      if (!progress.completed.includes(milestoneId)) {
        const ms = MILESTONES.find(m => m.id === milestoneId)
        const xpGain = ms?.xp ?? 0
        const today = new Date(); today.setHours(0,0,0,0)
        const lastAct = progress.lastActivity ? new Date(progress.lastActivity) : null
        const lastActDay = lastAct ? new Date(lastAct.setHours(0,0,0,0)) : null
        const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)

        let newStreak = progress.streak ?? 0
        if (!lastActDay || lastActDay.getTime() === yesterday.getTime()) newStreak += 1
        else if (lastActDay.getTime() === today.getTime()) newStreak = progress.streak // already counted today
        else newStreak = 1 // reset + start

        await db.collection(COLLECTION).updateOne(
          { userId: uid },
          { $addToSet: { completed: milestoneId }, $inc: { totalXP: xpGain }, $set: { streak: newStreak, lastActivity: new Date(), updatedAt: new Date() } }
        )
        return NextResponse.json({ success: true, xpGained: xpGain, newStreak, newTotal: (progress.totalXP ?? 0) + xpGain })
      }
    }

    if (action === "onboarding" && skillLevel) {
      await db.collection(COLLECTION).updateOne(
        { userId: uid },
        { $set: { onboardingSkillLevel: skillLevel, onboardingDone: true, updatedAt: new Date() } }
      )
      return NextResponse.json({ success: true })
    }

    if (action === "daily-challenge") {
      const today = new Date(); today.setHours(0,0,0,0)
      const lastAct = progress.lastActivity ? new Date(progress.lastActivity) : null
      const lastActDay = lastAct ? new Date(new Date(lastAct).setHours(0,0,0,0)) : null
      if (lastActDay?.getTime() === today.getTime()) {
        return NextResponse.json({ alreadyDone: true, streak: progress.streak })
      }
      const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)
      let newStreak = lastActDay?.getTime() === yesterday.getTime() ? (progress.streak ?? 0) + 1 : 1
      await db.collection(COLLECTION).updateOne(
        { userId: uid },
        { $set: { streak: newStreak, lastActivity: new Date(), updatedAt: new Date() }, $inc: { monthlyChallengesSolved: 1, totalXP: 10 } }
      )
      return NextResponse.json({ success: true, newStreak, totalXP: (progress.totalXP ?? 0) + 10 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
