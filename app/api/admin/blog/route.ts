/**
 * Admin blog CRUD
 * GET    /api/admin/blog         — all posts
 * POST   /api/admin/blog         — create post
 * PATCH  /api/admin/blog?id=     — update post
 * DELETE /api/admin/blog?id=     — delete post
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { BlogModel } from "@/lib/models/blog"

async function requireAdmin() {
  const user = await getCurrentUser()
  return user?.role === "admin" ? user : null
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const posts = await BlogModel.findAll(false)
    return NextResponse.json({ posts })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const body = await req.json()
    const { title, slug, excerpt, content, tag, tagColor, date, readTime, published = false } = body
    if (!title || !slug || !content) {
      return NextResponse.json({ error: "title, slug, and content are required" }, { status: 400 })
    }
    const post = await BlogModel.create({ title, slug, excerpt, content, tag, tagColor, date, readTime, published })
    return NextResponse.json({ post }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    const body = await req.json()
    await BlogModel.update(id, body)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    await BlogModel.delete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
