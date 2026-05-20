/**
 * Shortlist model — stored in the `shortlists` MongoDB collection.
 * Recruiters create shortlists and add candidates (students) to them.
 */
import { getDatabase } from "@/lib/database"
import { ObjectId } from "mongodb"

export interface ShortlistCandidate {
  studentId: string
  name: string
  college: string
  branch?: string
  year?: number
  matchScore?: number
  stage: "Screening" | "Technical Interview" | "HR Interview" | "Offer Sent" | "Accepted" | "Rejected"
  scheduledDate?: string
  addedAt: Date
}

export interface ShortlistDocument {
  _id?: string | ObjectId
  recruiterId: string
  name: string
  description?: string
  status: "active" | "reviewing" | "closed"
  candidates: ShortlistCandidate[]
  createdAt: Date
  updatedAt: Date
}

const COLLECTION = "shortlists"

export const ShortlistModel = {
  async create(data: Omit<ShortlistDocument, "_id" | "createdAt" | "updatedAt">): Promise<ShortlistDocument> {
    const db = await getDatabase()
    const now = new Date()
    const doc: ShortlistDocument = { ...data, createdAt: now, updatedAt: now }
    const result = await db.collection(COLLECTION).insertOne(doc)
    return { ...doc, _id: result.insertedId.toString() }
  },

  async findByRecruiter(recruiterId: string): Promise<ShortlistDocument[]> {
    const db = await getDatabase()
    const docs = await db.collection(COLLECTION).find({ recruiterId }).sort({ updatedAt: -1 }).toArray()
    return docs.map(serialize)
  },

  async findById(id: string): Promise<ShortlistDocument | null> {
    const db = await getDatabase()
    const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) })
    return doc ? serialize(doc) : null
  },

  async update(id: string, updates: Partial<ShortlistDocument>): Promise<void> {
    const db = await getDatabase()
    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } }
    )
  },

  async delete(id: string): Promise<void> {
    const db = await getDatabase()
    await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) })
  },

  async addCandidate(shortlistId: string, candidate: ShortlistCandidate): Promise<void> {
    const db = await getDatabase()
    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(shortlistId) },
      {
        $push: { candidates: candidate } as any,
        $set: { updatedAt: new Date() },
      }
    )
  },

  async removeCandidate(shortlistId: string, studentId: string): Promise<void> {
    const db = await getDatabase()
    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(shortlistId) },
      {
        $pull: { candidates: { studentId } } as any,
        $set: { updatedAt: new Date() },
      }
    )
  },

  async updateCandidateStage(shortlistId: string, studentId: string, stage: ShortlistCandidate["stage"], scheduledDate?: string): Promise<void> {
    const db = await getDatabase()
    const updateFields: Record<string, any> = {
      "candidates.$.stage": stage,
      updatedAt: new Date(),
    }
    if (scheduledDate !== undefined) {
      updateFields["candidates.$.scheduledDate"] = scheduledDate
    }
    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(shortlistId), "candidates.studentId": studentId },
      { $set: updateFields }
    )
  },
}

function serialize(doc: any): ShortlistDocument {
  return {
    ...doc,
    _id: doc._id?.toString(),
    createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt),
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt : new Date(doc.updatedAt),
  }
}
