/**
 * Hiring Drive model — end-to-end recruitment drive
 * Maps the full 11-step CodeHiring workflow
 */
import { getDatabase } from "@/lib/database"
import { ObjectId } from "mongodb"

export type DriveStatus =
  | "pending_review"    // Step 1: Company submitted, awaiting CodeHiring verification
  | "verified"          // Step 2: Verified by CodeHiring team
  | "active"            // Step 3: Drive live, candidates can apply
  | "assessment"        // Step 6: Assessment phase active
  | "evaluating"        // Step 7: AI evaluation in progress
  | "shortlisted"       // Step 8: Shortlist generated
  | "screening"         // Step 9: Company reviewing candidates
  | "interviews"        // Step 10: Interview process
  | "completed"         // Step 11: Drive closed, offers sent
  | "cancelled"

export interface EligibilityCriteria {
  graduationYears?: number[]       // e.g. [2025, 2026]
  degrees?: string[]               // e.g. ["B.Tech", "B.E."]
  branches?: string[]              // e.g. ["CSE", "IT", "ECE"]
  minCGPA?: number
  requiredSkills?: string[]
  minProblems?: number             // minimum total problems solved
  minRating?: number               // minimum competitive rating
  allowGraduates?: boolean
  collegeCodes?: string[]          // specific colleges only (empty = all)
}

export interface DriveDocument {
  _id?: string | ObjectId
  // Who created it
  recruiterId: string
  recruiterName: string
  companyName: string
  companyWebsite?: string
  companyLogo?: string
  verifiedBy?: string              // CodeHiring admin who verified
  verifiedAt?: Date

  // Step 1 — Hiring Request Details
  title: string                    // Job role
  type: "Internship" | "Full-time" | "Contract"
  description: string
  location: string
  salary: string
  openPositions: number
  hiringTimeline: string           // e.g. "March 2026"

  // Step 3 — Drive Config
  applicationDeadline: string      // ISO date
  assessmentDate?: string          // ISO date
  resultDate?: string              // ISO date
  joiningDate?: string             // ISO date
  selectionProcess: string[]       // e.g. ["Aptitude Test", "Technical Interview", "HR"]

  // Eligibility
  eligibility: EligibilityCriteria

  // Linked assessment
  assessmentId?: string

  // Workflow status
  status: DriveStatus
  statusHistory: { status: DriveStatus; at: Date; note?: string }[]

  // Stats
  notifiedCount: number            // candidates notified
  applicationCount: number
  shortlistedCount: number
  hiredCount: number

  // Applicants embedded (small drives) or referenced
  applicants?: {
    studentId: string
    name: string
    email: string
    college: string
    branch?: string
    graduationYear?: number
    skills?: string[]
    totalProblems?: number
    highestRating?: number
    codeHiringScore?: number
    appliedAt: Date
    status: "applied" | "shortlisted" | "rejected" | "hired" | "offer_sent"
    assessmentScore?: number
    assessmentRank?: number
    interviewStage?: string
    notes?: string
  }[]

  createdAt: Date
  updatedAt: Date
}

const COLLECTION = "drives"

export const DriveModel = {
  async create(data: Omit<DriveDocument, "_id" | "createdAt" | "updatedAt" | "notifiedCount" | "applicationCount" | "shortlistedCount" | "hiredCount">): Promise<DriveDocument> {
    const db  = await getDatabase()
    const now = new Date()
    const doc: DriveDocument = {
      ...data,
      notifiedCount: 0,
      applicationCount: 0,
      shortlistedCount: 0,
      hiredCount: 0,
      applicants: [],
      createdAt: now,
      updatedAt: now,
    }
    const res = await db.collection(COLLECTION).insertOne(doc)
    return { ...doc, _id: res.insertedId.toString() }
  },

  async findById(id: string): Promise<DriveDocument | null> {
    const db  = await getDatabase()
    const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) })
    return doc ? serialize(doc) : null
  },

  async findAll(filter: Record<string, any> = {}): Promise<DriveDocument[]> {
    const db   = await getDatabase()
    const docs = await db.collection(COLLECTION).find(filter).sort({ createdAt: -1 }).toArray()
    return docs.map(serialize)
  },

  async findByRecruiter(recruiterId: string): Promise<DriveDocument[]> {
    return DriveModel.findAll({ recruiterId })
  },

  async findActive(): Promise<DriveDocument[]> {
    return DriveModel.findAll({ status: { $in: ["active", "assessment"] } })
  },

  async findEligibleFor(student: {
    graduationYear?: number
    degree?: string
    branch?: string
    skills?: string[]
    totalProblems?: number
    highestRating?: number
    collegeCode?: string
  }): Promise<DriveDocument[]> {
    const db   = await getDatabase()
    const all  = await db.collection(COLLECTION).find({ status: { $in: ["active", "assessment"] } }).toArray()
    return all.map(serialize).filter(d => isEligible(student, d.eligibility))
  },

  async update(id: string, data: Partial<DriveDocument>): Promise<void> {
    const db = await getDatabase()
    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } }
    )
  },

  async advanceStatus(id: string, newStatus: DriveStatus, note?: string): Promise<void> {
    const db = await getDatabase()
    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { status: newStatus, updatedAt: new Date() },
        $push: { statusHistory: { status: newStatus, at: new Date(), note } } as any,
      }
    )
  },

  async addApplicant(driveId: string, applicant: NonNullable<DriveDocument["applicants"]>[number]): Promise<void> {
    const db = await getDatabase()
    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(driveId) },
      {
        $push: { applicants: applicant } as any,
        $inc: { applicationCount: 1 },
        $set: { updatedAt: new Date() },
      }
    )
  },

  async updateApplicantStatus(driveId: string, studentId: string, status: string, extra: Record<string, any> = {}): Promise<void> {
    const db = await getDatabase()
    const setFields: Record<string, any> = {
      "applicants.$.status": status,
      updatedAt: new Date(),
      ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [`applicants.$.${k}`, v])),
    }
    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(driveId), "applicants.studentId": studentId },
      { $set: setFields }
    )
  },

  async delete(id: string): Promise<void> {
    const db = await getDatabase()
    await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) })
  },
}

function isEligible(student: any, e: EligibilityCriteria): boolean {
  if (e.graduationYears?.length && student.graduationYear && !e.graduationYears.includes(student.graduationYear)) return false
  if (e.degrees?.length && student.degree && !e.degrees.some((d: string) => student.degree?.toLowerCase().includes(d.toLowerCase()))) return false
  if (e.branches?.length && !e.branches.some((b: string) => b === "All" || b.toLowerCase() === student.branch?.toLowerCase())) return false
  if (e.minCGPA && student.cgpa && student.cgpa < e.minCGPA) return false
  if (e.minProblems && (student.totalProblems ?? 0) < e.minProblems) return false
  if (e.minRating && (student.highestRating ?? 0) < e.minRating) return false
  if (e.collegeCodes?.length && student.collegeCode && !e.collegeCodes.includes(student.collegeCode)) return false
  return true
}

function serialize(doc: any): DriveDocument {
  return { ...doc, _id: doc._id?.toString() }
}
