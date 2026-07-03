/**
 * GET  /api/student/first-year-progress  - get progress, streak, badges
 * POST /api/student/first-year-progress  - update progress (complete milestone, update streak, award badge)
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDatabase } from "@/lib/database"
import { TOPIC_QUESTIONS } from "@/lib/topic-questions"

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

// Build a flat map of all badge IDs → xp from TOPIC_QUESTIONS
const BADGE_XP_MAP: Record<string, number> = {}
for (const topic of TOPIC_QUESTIONS) {
  for (const q of topic.questions) {
    BADGE_XP_MAP[q.id] = q.xp
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const db = await getDatabase()
    const uid = user._id?.toString() ?? ""

    // Get/create progress doc
    let progress = await db.collection(COLLECTION).findOne({ userId: uid }) as any
    if (!progress) {
      const doc: any = {
        userId: uid, completed: [], completedBadges: [], streak: 0, lastActivity: null,
        totalXP: 0, onboardingSkillLevel: null, onboardingDone: false, monthlyChallengesSolved: 0,
        createdAt: new Date(), updatedAt: new Date(),
      }
      await db.collection(COLLECTION).insertOne(doc)
      progress = doc
    }

    // Check streak — reset if last activity was before yesterday
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

    const completedBadges: string[] = progress.completedBadges ?? []

    // Return
    return NextResponse.json({
      progress: { ...progress, streak },
      milestones: MILESTONES,
      completedBadges,
      newlyAwarded: [],
      badgeProgress: {},
      completedChallenges: (progress.completedChallenges ?? []) as string[],
      pendingBadges: [],
    })
  } catch (err) {
    console.error("first-year-progress GET error:", err)
    return NextResponse.json({
      error: "Failed",
      detail: err instanceof Error ? err.message : String(err),
    }, { status: 500 })
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
      progress = {
        userId: uid, completed: [], completedBadges: [], streak: 0, lastActivity: null,
        totalXP: 0, onboardingSkillLevel: null, onboardingDone: false, monthlyChallengesSolved: 0,
        createdAt: new Date(), updatedAt: new Date(),
      }
      await db.collection(COLLECTION).insertOne(progress)
    }

    // Award a skill badge (called from badge-try flow or direct mark)
    if (action === "award-badge" && body.badgeId) {
      const badgeId = body.badgeId as string
      const alreadyEarned = (progress.completedBadges ?? []).includes(badgeId)
      if (alreadyEarned) return NextResponse.json({ alreadyEarned: true })
      const xpGain = BADGE_XP_MAP[badgeId] ?? 20
      await db.collection(COLLECTION).updateOne(
        { userId: uid },
        {
          $addToSet: { completedBadges: badgeId } as any,
          $inc: { totalXP: xpGain },
          $set: { lastActivity: new Date(), updatedAt: new Date() },
        }
      )
      return NextResponse.json({ success: true, xpGained: xpGain, newTotal: (progress.totalXP ?? 0) + xpGain })
    }

    // Complete a challenge (debug / project)
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

    // Complete a learning milestone
    if (action === "complete-milestone" && milestoneId) {
      if (!(progress.completed ?? []).includes(milestoneId)) {
        const ms = MILESTONES.find(m => m.id === milestoneId)
        const xpGain = ms?.xp ?? 0
        const today = new Date(); today.setHours(0,0,0,0)
        const lastAct = progress.lastActivity ? new Date(progress.lastActivity) : null
        const lastActDay = lastAct ? new Date(new Date(lastAct).setHours(0,0,0,0)) : null
        const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)
        let newStreak = progress.streak ?? 0
        if (!lastActDay || lastActDay.getTime() === yesterday.getTime()) newStreak += 1
        else if (lastActDay.getTime() === today.getTime()) newStreak = progress.streak
        else newStreak = 1
        await db.collection(COLLECTION).updateOne(
          { userId: uid },
          {
            $addToSet: { completed: milestoneId } as any,
            $inc: { totalXP: xpGain },
            $set: { streak: newStreak, lastActivity: new Date(), updatedAt: new Date() },
          }
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
      const newStreak = lastActDay?.getTime() === yesterday.getTime() ? (progress.streak ?? 0) + 1 : 1
      await db.collection(COLLECTION).updateOne(
        { userId: uid },
        {
          $set: { streak: newStreak, lastActivity: new Date(), updatedAt: new Date() },
          $inc: { monthlyChallengesSolved: 1, totalXP: 10 },
        }
      )
      return NextResponse.json({ success: true, newStreak, totalXP: (progress.totalXP ?? 0) + 10 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("first-year-progress POST error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
