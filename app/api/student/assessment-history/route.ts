/**
 * GET  /api/student/assessment-history  — get all past attempts
 * POST /api/student/assessment-history  — save a new attempt
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDatabase } from "@/lib/database"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const db = await getDatabase()
    const history = await db.collection("assessment_history")
      .find({ userId: user._id?.toString() })
      .sort({ completedAt: -1 })
      .limit(50)
      .toArray()

    return NextResponse.json({ history })
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const body = await req.json()
    const {
      company, companyName, sections, overallScore,
      sectionScores, timeTaken, violations, readinessScore,
      selectionProbability, verdict,
    } = body

    const db = await getDatabase()

    // Get rank among all students for this company
    const allScores = await db.collection("assessment_history")
      .find({ company })
      .project({ overallScore: 1 })
      .toArray()

    const rank = allScores.filter((s: any) => s.overallScore > overallScore).length + 1
    const totalParticipants = allScores.length + 1
    const percentile = Math.round(((totalParticipants - rank) / totalParticipants) * 100)

    const doc = {
      _id: new ObjectId(),
      userId: user._id?.toString(),
      userName: (user as any).name,
      collegeCode: (user as any).collegeCode ?? "",
      company,
      companyName,
      sections,
      overallScore,
      sectionScores: sectionScores ?? {},
      timeTaken: timeTaken ?? 0,
      violations: violations ?? {},
      readinessScore: readinessScore ?? 0,
      selectionProbability: selectionProbability ?? 0,
      verdict: verdict ?? "",
      rank,
      percentile,
      totalParticipants,
      completedAt: new Date(),
    }

    await db.collection("assessment_history").insertOne(doc)

    // Update user's best scores
    const existing = await db.collection("users").findOne(
      { _id: new ObjectId(user._id as string) },
      { projection: { "assessmentBests": 1 } }
    )
    const bests = (existing as any)?.assessmentBests ?? {}
    if (!bests[company] || overallScore > bests[company]) {
      await db.collection("users").updateOne(
        { _id: new ObjectId(user._id as string) },
        { $set: { [`assessmentBests.${company}`]: overallScore, updatedAt: new Date() } }
      )
    }

    return NextResponse.json({ success: true, rank, percentile, totalParticipants, id: doc._id.toString() })
  } catch (err) {
    console.error("Save assessment history error:", err)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}
