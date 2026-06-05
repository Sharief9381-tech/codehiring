/**
 * Blog model — stored in the `blogs` MongoDB collection.
 * Falls back to hardcoded posts from lib/blog-posts.ts if DB unavailable.
 */
import { getDatabase } from "@/lib/database"
import { ObjectId } from "mongodb"

export interface BlogDocument {
  _id?: string | ObjectId
  slug: string
  title: string
  excerpt: string
  content: string
  tag: string
  tagColor: string
  date: string
  readTime: string
  published: boolean
  createdAt: Date
  updatedAt: Date
}

const COLLECTION = "blogs"

export const BlogModel = {
  async findAll(publishedOnly = true): Promise<BlogDocument[]> {
    const db = await getDatabase()
    const filter = publishedOnly ? { published: true } : {}
    const docs = await db.collection(COLLECTION).find(filter).sort({ createdAt: -1 }).toArray()
    return docs.map(serialize)
  },

  async findBySlug(slug: string): Promise<BlogDocument | null> {
    const db = await getDatabase()
    const doc = await db.collection(COLLECTION).findOne({
      slug: { $regex: new RegExp(`^${slug}$`, "i") },
    })
    return doc ? serialize(doc) : null
  },

  async create(data: Omit<BlogDocument, "_id" | "createdAt" | "updatedAt">): Promise<BlogDocument> {
    const db = await getDatabase()
    const now = new Date()
    const doc = { ...data, createdAt: now, updatedAt: now }
    const result = await db.collection(COLLECTION).insertOne(doc)
    return { ...doc, _id: result.insertedId.toString() }
  },

  async update(id: string, data: Partial<BlogDocument>): Promise<void> {
    const db = await getDatabase()
    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } }
    )
  },

  async delete(id: string): Promise<void> {
    const db = await getDatabase()
    await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) })
  },
}

function serialize(doc: any): BlogDocument {
  return {
    ...doc,
    _id: doc._id?.toString(),
    createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt),
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt : new Date(doc.updatedAt),
  }
}
