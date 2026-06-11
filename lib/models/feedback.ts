import { getDatabase } from "@/lib/database"
import { ObjectId } from "mongodb"

export type FeedbackType = "general" | "specific"

export interface SpecificAnswer {
  question: string   // question text
  answer: string     // selected answer
}

export interface FeedbackDocument {
  _id?: string | ObjectId
  userId: string
  name: string
  role: string
  avatar: string
  type: FeedbackType
  // Type 1 — General
  text?: string
  rating?: number    // 1–5
  // Type 2 — Specific
  answers?: SpecificAnswer[]
  status: "pending" | "approved" | "rejected"
  createdAt: Date
  updatedAt: Date
}

const COLLECTION = "feedback"

export const FeedbackModel = {
  async create(data: Omit<FeedbackDocument, "_id" | "status" | "createdAt" | "updatedAt">): Promise<FeedbackDocument> {
    const db = await getDatabase()
    const now = new Date()
    const doc: FeedbackDocument = { ...data, status: "pending", createdAt: now, updatedAt: now }
    const result = await db.collection(COLLECTION).insertOne(doc as any)
    return { ...doc, _id: result.insertedId.toString() }
  },

  async findApproved(): Promise<FeedbackDocument[]> {
    const db = await getDatabase()
    const docs = await db.collection(COLLECTION)
      .find({ status: "approved" })
      .sort({ createdAt: -1 })
      .toArray()
    return docs.map(serialize)
  },

  async findAll(): Promise<FeedbackDocument[]> {
    const db = await getDatabase()
    const docs = await db.collection(COLLECTION)
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    return docs.map(serialize)
  },

  async updateStatus(id: string, status: "approved" | "rejected"): Promise<void> {
    const db = await getDatabase()
    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    )
  },

  async hasSubmitted(userId: string): Promise<boolean> {
    const db = await getDatabase()
    const doc = await db.collection(COLLECTION).findOne({ userId })
    return !!doc
  },
}

function serialize(doc: any): FeedbackDocument {
  return {
    ...doc,
    _id: doc._id?.toString(),
    createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt),
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt : new Date(doc.updatedAt),
  }
}
