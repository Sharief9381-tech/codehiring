import { getDatabase } from "@/lib/database"
import { ObjectId } from "mongodb"

export interface CareerPosting {
  _id?: string | ObjectId
  title: string
  team: string
  location: string
  type: "Full-time" | "Part-time" | "Contract" | "Internship"
  desc: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}

const COLLECTION = "careers"

export const CareerModel = {
  async findAll(onlyActive = false): Promise<CareerPosting[]> {
    const db = await getDatabase()
    const filter = onlyActive ? { active: true } : {}
    const docs = await db.collection(COLLECTION).find(filter).sort({ createdAt: -1 }).toArray()
    return docs.map(serialize)
  },

  async findById(id: string): Promise<CareerPosting | null> {
    const db = await getDatabase()
    const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) })
    return doc ? serialize(doc) : null
  },

  async create(data: Omit<CareerPosting, "_id" | "createdAt" | "updatedAt">): Promise<CareerPosting> {
    const db = await getDatabase()
    const now = new Date()
    const doc = { ...data, createdAt: now, updatedAt: now }
    const result = await db.collection(COLLECTION).insertOne(doc)
    return { ...doc, _id: result.insertedId.toString() }
  },

  async update(id: string, data: Partial<CareerPosting>): Promise<void> {
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

function serialize(doc: any): CareerPosting {
  return {
    ...doc,
    _id: doc._id?.toString(),
    createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt),
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt : new Date(doc.updatedAt),
  }
}
