/**
 * POST /api/student/debug-challenges/[id]
 * Body: { answer: string }
 * Checks student answer. Returns correct/incorrect + explanation either way.
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDatabase } from "@/lib/database"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { id } = await params
    const db  = await getDatabase()
    const uid = user._id?.toString() ?? ""

    // ── Reveal action — just return the answer without marking complete ────────
    const url = new URL(request.url)
    if (url.searchParams.get("action") === "reveal") {
      const cached = await db.collection("debug_challenges").findOne({ userId: uid })
      const challenge = cached?.challenges?.find((c: any) => c.id === id)
      if (!challenge) return NextResponse.json({ error: "Not found" }, { status: 404 })
      return NextResponse.json({
        answer: challenge.answer,
        explanation: challenge.explanation,
      })
    }

    // ── Submit answer ─────────────────────────────────────────────────────────
    const { answer } = await request.json()
    if (!answer?.trim()) return NextResponse.json({ error: "Answer required" }, { status: 400 })

    // Get cached challenges (which store the correct answers)
    const cached = await db.collection("debug_challenges").findOne({ userId: uid })
    if (!cached?.challenges) return NextResponse.json({ error: "No active challenges" }, { status: 404 })

    const challenge = cached.challenges.find((c: any) => c.id === id)
    if (!challenge) return NextResponse.json({ error: "Challenge not found" }, { status: 404 })

    // Already solved?
    const progress  = await db.collection("first_year_progress").findOne({ userId: uid })
    const completed: string[] = progress?.completedChallenges ?? []
    if (completed.includes(id)) {
      return NextResponse.json({ alreadySolved: true, correct: true, explanation: challenge.explanation })
    }

    // ── Flexible answer matching ──────────────────────────────────────────────
    const norm = (s: string) =>
      s.toLowerCase()
        .trim()
        .replace(/\s+/g, " ")
        .replace(/[.,!?'"`;:]/g, "")
        .replace(/\bthe\b|\ba\b|\ban\b/g, "")  // strip articles
        .trim()

    const student   = norm(answer)
    const correct   = norm(challenge.answer ?? "")
    const alts: string[] = (challenge.answerAlternatives ?? []).map(norm)

    // 1. Exact match after normalization
    let isCorrect = student === correct || alts.some(a => student === a)

    // 2. Student answer contains the key term (for longer answers)
    if (!isCorrect && correct.length >= 3) {
      isCorrect = student.includes(correct) || alts.some(a => a.length >= 3 && student.includes(a))
    }

    // 3. Correct answer contains student's answer (student gave the core keyword)
    if (!isCorrect && student.length >= 3) {
      isCorrect = correct.includes(student) || alts.some(a => a.includes(student))
    }

    // 4. Word overlap — if student hits >50% of the key words in correct answer
    if (!isCorrect) {
      const correctWords = correct.split(" ").filter(w => w.length > 2)
      const studentWords = new Set(student.split(" "))
      if (correctWords.length > 0) {
        const overlap = correctWords.filter(w => studentWords.has(w)).length
        isCorrect = overlap / correctWords.length >= 0.5
      }
    }

    if (!isCorrect) {
      return NextResponse.json({
        correct: false,
        correctAnswer: challenge.answer,   // reveal correct on wrong so student can learn
        explanation: challenge.explanation,
      })
    }

    // ── Award XP ──────────────────────────────────────────────────────────────
    const xpReward = challenge.xp ?? 25

    if (!progress) {
      await db.collection("first_year_progress").insertOne({
        userId: uid, completed: [], completedChallenges: [id], completedBadges: [],
        streak: 0, lastActivity: new Date(), totalXP: xpReward,
        onboardingDone: false, monthlyChallengesSolved: 0,
        createdAt: new Date(), updatedAt: new Date(),
      })
    } else {
      await db.collection("first_year_progress").updateOne(
        { userId: uid },
        {
          $addToSet: { completedChallenges: id } as any,
          $inc: { totalXP: xpReward },
          $set: { lastActivity: new Date(), updatedAt: new Date() },
        }
      )
    }

    return NextResponse.json({
      correct: true,
      xpGained: xpReward,
      newTotal: (progress?.totalXP ?? 0) + xpReward,
      explanation: challenge.explanation,
    })
  } catch (err) {
    console.error("debug-challenges submit:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
