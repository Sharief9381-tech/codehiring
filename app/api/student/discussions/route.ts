/**
 * GET  /api/student/discussions        — list posts (tag, sort, page)
 * POST /api/student/discussions        — create a new post
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { DiscussionModel, DiscussionTag } from "@/lib/models/discussion"

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const tag = (searchParams.get("tag") ?? "All") as DiscussionTag | "All"
    const sort = (searchParams.get("sort") ?? "latest") as "latest" | "top" | "unanswered"
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
    const limit = 15
    const skip = (page - 1) * limit

    const [posts, total] = await Promise.all([
      DiscussionModel.findAll({ tag, sort, limit, skip }),
      DiscussionModel.count(tag),
    ])

    const userId = user._id?.toString()
    const serialized = posts.map(p => ({
      _id: p._id?.toString(),
      authorId: p.authorId,
      authorName: p.authorName,
      authorAvatar: p.authorAvatar,
      title: p.title,
      content: p.content,
      tag: p.tag,
      upvoteCount: p.upvotes.length,
      upvoted: p.upvotes.includes(userId ?? ""),
      views: p.views,
      replyCount: p.replies.length,
      pinned: p.pinned,
      createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
    }))

    return NextResponse.json({
      posts: serialized,
      total,
      page,
      pages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error("Discussions GET error:", err)
    return NextResponse.json({ error: "Failed to fetch discussions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const body = await request.json()
    const { title, content, tag } = body

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const validTags: DiscussionTag[] = ["Question", "Tip", "Resource", "Achievement", "Help", "General"]
    const safeTag: DiscussionTag = validTags.includes(tag) ? tag : "General"

    const initials = (user.name ?? "U")
      .split(" ")
      .map((w: string) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

    const post = await DiscussionModel.create({
      authorId: user._id?.toString() ?? "",
      authorName: user.name,
      authorAvatar: initials,
      title: title.trim(),
      content: content.trim(),
      tag: safeTag,
    })

    return NextResponse.json({ success: true, post: { ...post, _id: post._id?.toString() } })
  } catch (err) {
    console.error("Discussions POST error:", err)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
