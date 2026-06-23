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

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const db = await getDatabase()
    let progress = await db.collection(COLLECTION).findOne({ userId: user._id?.toString() })

    if (!progress) {
      // Create default progress
      const doc = {
        userId: user._id?.toString(),
        completed: [],
        streak: 0,
        lastActivity: null,
        totalXP: 0,
        onboardingSkillLevel: null, // "beginner" | "some-coding" | "knows-basics"
        onboardingDone: false,
        monthlyChallengesSolved: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      await db.collection(COLLECTION).insertOne(doc)
      return NextResponse.json({ progress: doc, milestones: MILESTONES })
    }

    // Update streak: if last activity was yesterday, keep streak; if today already counted, no change; else reset
    const today = new Date(); today.setHours(0,0,0,0)
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)
    const lastAct = progress.lastActivity ? new Date(progress.lastActivity) : null
    let streak = progress.streak ?? 0
    if (lastAct) {
      const lastActDay = new Date(lastAct); lastActDay.setHours(0,0,0,0)
      if (lastActDay.getTime() < yesterday.getTime()) {
        // More than 1 day ago — reset streak
        streak = 0
        await db.collection(COLLECTION).updateOne(
          { userId: user._id?.toString() },
          { $set: { streak: 0 } }
        )
      }
    }

    return NextResponse.json({ progress: { ...progress, streak }, milestones: MILESTONES })
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
