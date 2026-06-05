/**
 * POST /api/feedback  — authenticated user submits feedback (type 1 or type 2)
 * GET  /api/feedback  — returns approved general feedback for landing page testimonials
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { FeedbackModel } from "@/lib/models/feedback"
import { isDatabaseAvailable } from "@/lib/database"

export const revalidate = 60

export async function GET() {
  if (!isDatabaseAvailable()) return NextResponse.json({ feedback: [] })
  try {
    const feedback = await FeedbackModel.findApproved()
    return NextResponse.json({ feedback })
  } catch {
    return NextResponse.json({ feedback: [] })
  }
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 })
  if (!isDatabaseAvailable()) return NextResponse.json({ error: "Database unavailable" }, { status: 503 })

  try {
    const body = await req.json()
    const { type, text, rating, answers } = body

    if (!type || !["general", "specific"].includes(type)) {
      return NextResponse.json({ error: "Invalid feedback type" }, { status: 400 })
    }

    // Validate type 1
    if (type === "general") {
      if (!text || typeof text !== "string" || text.trim().length < 10)
        return NextResponse.json({ error: "Feedback must be at least 10 characters" }, { status: 400 })
      if (!rating || rating < 1 || rating > 5)
        return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Validate type 2
    if (type === "specific") {
      if (!answers || !Array.isArray(answers) || answers.length === 0)
        return NextResponse.json({ error: "Answers are required" }, { status: 400 })
    }

    // One feedback per user
    const already = await FeedbackModel.hasSubmitted(user._id?.toString() ?? "")
    if (already) return NextResponse.json({ error: "You have already submitted feedback" }, { status: 409 })

    const role = buildRoleLabel(user as any)
    const initials = (user.name ?? "U").split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)

    await FeedbackModel.create({
      userId: user._id?.toString() ?? "",
      name: user.name ?? "Anonymous",
      role,
      avatar: initials,
      type,
      text: type === "general" ? text.trim() : undefined,
      rating: type === "general" ? Math.round(rating) : undefined,
      answers: type === "specific" ? answers : undefined,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Feedback POST error:", error)
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 })
  }
}

function buildRoleLabel(user: any): string {
  if (user.role === "student") {
    const parts = [user.branch, user.collegeName ?? user.collegeCode].filter(Boolean)
    return parts.length > 0 ? `Student, ${parts[parts.length - 1]}` : "Student"
  }
  if (user.role === "recruiter") {
    return `${user.designation ?? "Recruiter"}, ${user.companyName ?? ""}`.replace(/,\s*$/, "")
  }
  if (user.role === "college") {
    return `TPO, ${user.collegeName ?? user.collegeCode ?? "College"}`
  }
  return user.role ?? "User"
}
