/**
 * Job model — stored in the `jobs` MongoDB collection.
 * Recruiters create jobs; students see matched jobs.
 */
import { getDatabase, isDatabaseAvailable } from "@/lib/database"
import { ObjectId } from "mongodb"

export interface JobDocument {
  _id?: string | ObjectId
  // Who posted it
  recruiterId: string        // recruiter user _id
  recruiterName: string
  companyName: string
  companyWebsite?: string

  // Job details
  title: string
  type: "Internship" | "Full-time" | "Contract" | "Part-time"
  location: string
  salary: string
  description: string
  skills: string[]           // required skills (lowercase for matching)
  deadline?: string          // ISO date string

  // Minimum requirements for matching
  minProblems?: number       // min total problems solved
  minRating?: number         // min competitive rating
  minCGPA?: number           // min CGPA (optional)

  // Status
  status: "active" | "draft" | "closed"
  applications: number       // counter
  views: number              // counter

  createdAt: Date
  updatedAt: Date
}

const COLLECTION = "jobs"

export const JobModel = {
  async create(data: Omit<JobDocument, "_id" | "createdAt" | "updatedAt" | "applications" | "views">): Promise<JobDocument> {
    const db = await getDatabase()
    const now = new Date()
    const doc: JobDocument = {
      ...data,
      applications: 0,
      views: 0,
      createdAt: now,
      updatedAt: now,
    }
    const result = await db.collection(COLLECTION).insertOne(doc)
    return { ...doc, _id: result.insertedId.toString() }
  },

  async findAll(filter: Record<string, any> = {}): Promise<JobDocument[]> {
    const db = await getDatabase()
    const docs = await db.collection(COLLECTION).find(filter).sort({ createdAt: -1 }).toArray()
    return docs.map(serialize)
  },

  async findById(id: string): Promise<JobDocument | null> {
    const db = await getDatabase()
    const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) })
    return doc ? serialize(doc) : null
  },

  async update(id: string, updates: Partial<JobDocument>): Promise<void> {
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

  async incrementViews(id: string): Promise<void> {
    const db = await getDatabase()
    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      { $inc: { views: 1 } }
    )
  },

  async incrementApplications(id: string): Promise<void> {
    const db = await getDatabase()
    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      { $inc: { applications: 1 } }
    )
  },
}

function serialize(doc: any): JobDocument {
  return {
    ...doc,
    _id: doc._id?.toString(),
    createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt),
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt : new Date(doc.updatedAt),
  }
}
