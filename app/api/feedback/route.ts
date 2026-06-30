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

    // Send email notification to admin
    await sendFeedbackEmail({
      fromName: user.name ?? "Anonymous",
      fromRole: role,
      type,
      text: type === "general" ? text.trim() : undefined,
      rating: type === "general" ? Math.round(rating) : undefined,
      answers: type === "specific" ? answers : undefined,
    }).catch((e) => console.error("Email send failed:", e))

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

async function sendFeedbackEmail(data: {
  fromName: string
  fromRole: string
  type: string
  text?: string
  rating?: number
  answers?: { question: string; answer: string }[]
}) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const TO_EMAIL = "sharief9381@gmail.com"

  const stars = data.rating
    ? "★".repeat(data.rating) + "☆".repeat(5 - data.rating)
    : ""

  const htmlBody = data.type === "general"
    ? `
      <h2>New General Feedback on CodeHiring</h2>
      <p><strong>From:</strong> ${data.fromName} (${data.fromRole})</p>
      <p><strong>Rating:</strong> ${stars} (${data.rating}/5)</p>
      <hr/>
      <p><em>"${data.text}"</em></p>
    `
    : `
      <h2>New Specific Feedback on CodeHiring</h2>
      <p><strong>From:</strong> ${data.fromName} (${data.fromRole})</p>
      <hr/>
      ${data.answers?.map((a) => `
        <p><strong>Q:</strong> ${a.question}</p>
        <p><strong>A:</strong> ${a.answer}</p>
        <br/>
      `).join("") ?? ""}
    `

  const textBody = data.type === "general"
    ? `New General Feedback\nFrom: ${data.fromName} (${data.fromRole})\nRating: ${stars}\n\n"${data.text}"`
    : `New Specific Feedback\nFrom: ${data.fromName} (${data.fromRole})\n\n${data.answers?.map((a) => `Q: ${a.question}\nA: ${a.answer}`).join("\n\n") ?? ""}`

  // Use Resend API if key is available
  if (RESEND_API_KEY) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "CodeHiring <onboarding@resend.dev>",
        to: [TO_EMAIL],
        subject: `[CodeHiring Feedback] ${data.type === "general" ? `${stars} from ${data.fromName}` : `Specific answers from ${data.fromName}`}`,
        html: htmlBody,
        text: textBody,
      }),
    })
  } else {
    // Fallback: log to console (visible in server logs / Vercel logs)
  }
}
