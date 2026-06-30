/**
 * GET    /api/student/discussions/[id]              — get post + replies
 * POST   /api/student/discussions/[id]?action=reply — add a reply
 * POST   /api/student/discussions/[id]?action=upvote — toggle upvote on post
 * POST   /api/student/discussions/[id]?action=upvote-reply&replyId= — toggle upvote on reply
 * DELETE /api/student/discussions/[id]              — delete post (author only)
 * DELETE /api/student/discussions/[id]?replyId=     — delete reply (author only)
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { DiscussionModel } from "@/lib/models/discussion"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { id } = await params
    const post = await DiscussionModel.findById(id)
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 })

    // increment views (non-blocking)
    DiscussionModel.incrementViews(id).catch(() => {})

    const userId = user._id?.toString() ?? ""
    return NextResponse.json({
      post: {
        ...post,
        _id: post._id?.toString(),
        createdAt: post.createdAt instanceof Date ? post.createdAt.toISOString() : post.createdAt,
        updatedAt: post.updatedAt instanceof Date ? post.updatedAt.toISOString() : post.updatedAt,
        upvoteCount: post.upvotes.length,
        upvoted: post.upvotes.includes(userId),
        replies: post.replies.map(r => ({
          ...r,
          upvoteCount: r.upvotes.length,
          upvoted: r.upvotes.includes(userId),
        })),
      },
    })
  } catch (err) {
    console.error("Discussion GET error:", err)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const userId = user._id?.toString() ?? ""

    if (action === "upvote") {
      const result = await DiscussionModel.toggleUpvote(id, userId)
      return NextResponse.json(result)
    }

    if (action === "upvote-reply") {
      const replyId = searchParams.get("replyId")
      if (!replyId) return NextResponse.json({ error: "replyId required" }, { status: 400 })
      const result = await DiscussionModel.toggleReplyUpvote(id, replyId, userId)
      return NextResponse.json(result)
    }

    if (action === "reply") {
      const { content } = await request.json()
      if (!content?.trim()) {
        return NextResponse.json({ error: "Content is required" }, { status: 400 })
      }
      const initials = (user.name ?? "U")
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

      const reply = await DiscussionModel.addReply(id, {
        authorId: userId,
        authorName: user.name,
        authorAvatar: initials,
        content: content.trim(),
      })
      return NextResponse.json({ success: true, reply: { ...reply, upvoteCount: 0, upvoted: false } })
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch (err) {
    console.error("Discussion POST error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const replyId = searchParams.get("replyId")
    const userId = user._id?.toString() ?? ""

    if (replyId) {
      await DiscussionModel.deleteReply(id, replyId, userId)
      return NextResponse.json({ success: true })
    }

    const deleted = await DiscussionModel.deletePost(id, userId)
    if (!deleted) return NextResponse.json({ error: "Not found or not authorized" }, { status: 403 })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Discussion DELETE error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
