/**
 * Discussion model — community discussion board (LeetCode Discussions style)
 * Collection: `discussions`
 */
import { getDatabase } from "@/lib/database"
import { ObjectId } from "mongodb"

export type DiscussionTag =
  | "Question"
  | "Tip"
  | "Resource"
  | "Achievement"
  | "Help"
  | "General"

export interface DiscussionReply {
  _id: string
  authorId: string
  authorName: string
  authorAvatar: string     // initials
  content: string
  upvotes: string[]        // array of userId strings
  createdAt: string        // ISO string
}

export interface DiscussionDocument {
  _id?: string | ObjectId
  authorId: string
  authorName: string
  authorAvatar: string     // initials
  title: string
  content: string
  tag: DiscussionTag
  upvotes: string[]        // array of userId strings
  views: number
  replies: DiscussionReply[]
  pinned: boolean
  createdAt: Date
  updatedAt: Date
}

const COLLECTION = "discussions"

export const DiscussionModel = {
  async create(data: {
    authorId: string
    authorName: string
    authorAvatar: string
    title: string
    content: string
    tag: DiscussionTag
  }): Promise<DiscussionDocument> {
    const db = await getDatabase()
    const now = new Date()
    const doc: DiscussionDocument = {
      ...data,
      upvotes: [],
      views: 0,
      replies: [],
      pinned: false,
      createdAt: now,
      updatedAt: now,
    }
    const result = await db.collection(COLLECTION).insertOne(doc as any)
    return serialize({ ...doc, _id: result.insertedId })
  },

  async findAll(options: {
    tag?: DiscussionTag | "All"
    sort?: "latest" | "top" | "unanswered"
    limit?: number
    skip?: number
  } = {}): Promise<DiscussionDocument[]> {
    const db = await getDatabase()
    const { tag, sort = "latest", limit = 20, skip = 0 } = options

    const filter: any = {}
    if (tag && tag !== "All") filter.tag = tag

    let sortQuery: any = { pinned: -1, createdAt: -1 }
    if (sort === "top") sortQuery = { pinned: -1, "upvotes": -1, createdAt: -1 }
    if (sort === "unanswered") filter["replies.0"] = { $exists: false }

    const docs = await db.collection(COLLECTION)
      .find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .toArray()

    return docs.map(serialize)
  },

  async findById(id: string): Promise<DiscussionDocument | null> {
    const db = await getDatabase()
    const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) })
    return doc ? serialize(doc) : null
  },

  async incrementViews(id: string): Promise<void> {
    const db = await getDatabase()
    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      { $inc: { views: 1 }, $set: { updatedAt: new Date() } }
    )
  },

  async toggleUpvote(id: string, userId: string): Promise<{ upvotes: number; upvoted: boolean }> {
    const db = await getDatabase()
    const doc = await db.collection(COLLECTION).findOne(
      { _id: new ObjectId(id) },
      { projection: { upvotes: 1 } }
    )
    const upvotes: string[] = doc?.upvotes ?? []
    const alreadyUpvoted = upvotes.includes(userId)

    if (alreadyUpvoted) {
      await db.collection(COLLECTION).updateOne(
        { _id: new ObjectId(id) },
        { $pull: { upvotes: userId } as any, $set: { updatedAt: new Date() } }
      )
      return { upvotes: upvotes.length - 1, upvoted: false }
    } else {
      await db.collection(COLLECTION).updateOne(
        { _id: new ObjectId(id) },
        { $addToSet: { upvotes: userId } as any, $set: { updatedAt: new Date() } }
      )
      return { upvotes: upvotes.length + 1, upvoted: true }
    }
  },

  async addReply(id: string, reply: {
    authorId: string
    authorName: string
    authorAvatar: string
    content: string
  }): Promise<DiscussionReply> {
    const db = await getDatabase()
    const newReply: DiscussionReply = {
      _id: new ObjectId().toString(),
      ...reply,
      upvotes: [],
      createdAt: new Date().toISOString(),
    }
    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      {
        $push: { replies: newReply } as any,
        $set: { updatedAt: new Date() },
      }
    )
    return newReply
  },

  async toggleReplyUpvote(postId: string, replyId: string, userId: string): Promise<{ upvotes: number; upvoted: boolean }> {
    const db = await getDatabase()
    const doc = await db.collection(COLLECTION).findOne(
      { _id: new ObjectId(postId), "replies._id": replyId },
      { projection: { "replies.$": 1 } }
    )
    const reply: DiscussionReply | undefined = doc?.replies?.[0]
    const upvotes: string[] = reply?.upvotes ?? []
    const alreadyUpvoted = upvotes.includes(userId)

    if (alreadyUpvoted) {
      await db.collection(COLLECTION).updateOne(
        { _id: new ObjectId(postId), "replies._id": replyId },
        { $pull: { "replies.$.upvotes": userId } as any, $set: { updatedAt: new Date() } }
      )
      return { upvotes: upvotes.length - 1, upvoted: false }
    } else {
      await db.collection(COLLECTION).updateOne(
        { _id: new ObjectId(postId), "replies._id": replyId },
        { $addToSet: { "replies.$.upvotes": userId } as any, $set: { updatedAt: new Date() } }
      )
      return { upvotes: upvotes.length + 1, upvoted: true }
    }
  },

  async deletePost(id: string, authorId: string): Promise<boolean> {
    const db = await getDatabase()
    const result = await db.collection(COLLECTION).deleteOne({
      _id: new ObjectId(id),
      authorId,
    })
    return result.deletedCount > 0
  },

  async deleteReply(postId: string, replyId: string, authorId: string): Promise<void> {
    const db = await getDatabase()
    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(postId) },
      {
        $pull: { replies: { _id: replyId, authorId } } as any,
        $set: { updatedAt: new Date() },
      }
    )
  },

  async count(tag?: DiscussionTag | "All"): Promise<number> {
    const db = await getDatabase()
    const filter: any = {}
    if (tag && tag !== "All") filter.tag = tag
    return await db.collection(COLLECTION).countDocuments(filter)
  },
}

function serialize(doc: any): DiscussionDocument {
  return {
    ...doc,
    _id: doc._id?.toString(),
    createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt),
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt : new Date(doc.updatedAt),
  }
}
