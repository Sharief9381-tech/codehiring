/**
 * Admin PYQ management API
 * GET    /api/admin/pyq?status=pending&company=tcs&section=quantitative&page=1
 * POST   /api/admin/pyq        — add new PYQ manually
 * PUT    /api/admin/pyq        — update / approve / reject a PYQ
 * DELETE /api/admin/pyq?id=xxx — delete a PYQ
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getPYQCollection, type PYQDoc } from "@/lib/models/pyq"
import { ObjectId } from "mongodb"

function isAdmin(user: any) {
  return user?.role === "admin" || user?.email === "sharief9381@gmail.com"
}

// ── GET — list PYQs with filters ──────────────────────────────────────────────
export async function GET(req: Request) {
  const user = await getCurrentUser()
  if (!isAdmin(user)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const url = new URL(req.url)
  const status  = url.searchParams.get("status") ?? "pending"
  const company = url.searchParams.get("company") ?? undefined
  const section = url.searchParams.get("section") ?? undefined
  const page    = parseInt(url.searchParams.get("page") ?? "1")
  const limit   = 20

  const col = await getPYQCollection()
  const filter: Record<string, any> = {}
  if (status !== "all") filter.status = status
  if (company) filter.company = company
  if (section) filter.section = section

  const [docs, total] = await Promise.all([
    col.find(filter, { projection: { embedding: 0 } })
       .sort({ submittedAt: -1 })
       .skip((page - 1) * limit)
       .limit(limit)
       .toArray(),
    col.countDocuments(filter),
  ])

  // Count by status
  const counts = {
    pending:  await col.countDocuments({ status: "pending" }),
    approved: await col.countDocuments({ status: "approved" }),
    rejected: await col.countDocuments({ status: "rejected" }),
  }

  return NextResponse.json({ docs, total, page, pages: Math.ceil(total / limit), counts })
}

// ── POST — add PYQ manually ───────────────────────────────────────────────────
export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!isAdmin(user)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { company, section, topic, difficulty, year, question, options, correct, explanation, companyName } = body

  if (!company || !section || !question || !options || correct === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const doc: PYQDoc = {
    company, companyName: companyName ?? company.toUpperCase(),
    section, topic: topic ?? "General",
    difficulty: difficulty ?? "Medium",
    year: year ?? new Date().getFullYear(),
    question, options, correct: Number(correct),
    explanation: explanation ?? "",
    status: "approved", // admin-added = auto-approved
    source: "admin",
    submittedAt: new Date(),
    approvedAt: new Date(),
    approvedBy: user._id?.toString(),
    ragSeeded: false,
    upvotes: 0,
    reportCount: 0,
  }

  const col = await getPYQCollection()
  const result = await col.insertOne(doc)

  // Try to seed into RAG if OpenAI key is available
  if (process.env.OPENAI_API_KEY) {
    try {
      const { upsertPYQ } = await import("@/lib/rag/vector-store")
      await upsertPYQ({ company, section, topic: doc.topic, difficulty: doc.difficulty, year: doc.year, question, options, correct: doc.correct, explanation: doc.explanation })
      await col.updateOne({ _id: result.insertedId }, { $set: { ragSeeded: true } })
    } catch (e) {
      console.warn("RAG seed failed for new PYQ:", e)
    }
  }

  return NextResponse.json({ success: true, id: result.insertedId })
}

// ── PUT — update / approve / reject ───────────────────────────────────────────
export async function PUT(req: Request) {
  const user = await getCurrentUser()
  if (!isAdmin(user)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { id, action, ...updates } = body

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const col = await getPYQCollection()
  const _id = new ObjectId(id)

  if (action === "approve") {
    await col.updateOne({ _id }, { $set: { status: "approved", approvedAt: new Date(), approvedBy: user._id?.toString() } })

    // Seed into RAG
    if (process.env.OPENAI_API_KEY) {
      try {
        const doc = await col.findOne({ _id })
        if (doc) {
          const { upsertPYQ } = await import("@/lib/rag/vector-store")
          await upsertPYQ({ company: doc.company, section: doc.section, topic: doc.topic, difficulty: doc.difficulty, year: doc.year, question: doc.question, options: doc.options, correct: doc.correct, explanation: doc.explanation })
          await col.updateOne({ _id }, { $set: { ragSeeded: true } })
        }
      } catch (e) {
        console.warn("RAG seed on approve failed:", e)
      }
    }
    return NextResponse.json({ success: true })
  }

  if (action === "reject") {
    await col.updateOne({ _id }, { $set: { status: "rejected" } })
    return NextResponse.json({ success: true })
  }

  // General update
  const allowed = ["question","options","correct","explanation","topic","difficulty","year","section","company"]
  const safeUpdates: Record<string, any> = {}
  for (const k of allowed) {
    if (updates[k] !== undefined) safeUpdates[k] = updates[k]
  }
  await col.updateOne({ _id }, { $set: safeUpdates })
  return NextResponse.json({ success: true })
}

// ── DELETE ────────────────────────────────────────────────────────────────────
export async function DELETE(req: Request) {
  const user = await getCurrentUser()
  if (!isAdmin(user)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const url = new URL(req.url)
  const id = url.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const col = await getPYQCollection()
  await col.deleteOne({ _id: new ObjectId(id) })
  return NextResponse.json({ success: true })
}
