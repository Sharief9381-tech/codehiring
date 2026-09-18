/**
 * POST /api/student/submit-pyq
 * Students submit PYQs they saw in real campus exams.
 * Goes into MongoDB as "pending" for admin approval.
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getPYQCollection } from "@/lib/models/pyq"
import { ALL_COMPANIES } from "@/lib/companies-data"

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const body = await req.json()
    const { company, section, topic, difficulty, year, question, options, correct, explanation } = body

    // Validation
    if (!company || !section || !question?.trim()) {
      return NextResponse.json({ error: "company, section, and question are required" }, { status: 400 })
    }
    if (!Array.isArray(options) || options.length !== 4) {
      return NextResponse.json({ error: "Exactly 4 options required" }, { status: 400 })
    }
    if (correct === undefined || correct < 0 || correct > 3) {
      return NextResponse.json({ error: "correct must be 0-3" }, { status: 400 })
    }

    const companyName = ALL_COMPANIES.find(c => c.id === company)?.name ?? company.toUpperCase()
    const col = await getPYQCollection()

    // Check for duplicate
    const existing = await col.findOne({ company, section, question: question.trim() })
    if (existing) {
      // Upvote instead of duplicate
      await col.updateOne({ _id: existing._id }, { $inc: { upvotes: 1 } })
      return NextResponse.json({ success: true, duplicate: true, message: "Question already exists — your upvote was recorded!" })
    }

    await col.insertOne({
      company, companyName, section,
      topic: topic ?? "General",
      difficulty: (["Easy","Medium","Hard"].includes(difficulty) ? difficulty : "Medium") as any,
      year: year ? Number(year) : new Date().getFullYear(),
      question: question.trim(),
      options: options.map((o: string) => o.trim()),
      correct: Number(correct),
      explanation: explanation?.trim() ?? "",
      status: "pending",
      source: "student",
      submittedBy: user._id?.toString(),
      submittedAt: new Date(),
      ragSeeded: false,
      upvotes: 1, // submitter's implicit upvote
      reportCount: 0,
    })

    return NextResponse.json({
      success: true,
      message: "Thank you! Your question has been submitted for review. It will appear in assessments after admin approval.",
    })
  } catch (err: any) {
    console.error("submit-pyq error:", err)
    return NextResponse.json({ error: "Failed to submit question" }, { status: 500 })
  }
}
