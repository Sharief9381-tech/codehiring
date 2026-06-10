/**
 * Assessment model — complete test engine for CodeHiring hiring drives
 * Supports: MCQ, Coding, SQL, Aptitude, Debugging, Case Study
 */
import { getDatabase } from "@/lib/database"
import { ObjectId } from "mongodb"

export type QuestionType = "mcq" | "coding" | "sql" | "aptitude" | "debugging" | "case_study"
export type Difficulty = "easy" | "medium" | "hard"

export interface MCQOption { id: string; text: string }

export interface Question {
  _id?: string
  type: QuestionType
  difficulty: Difficulty
  title: string
  description: string
  points: number
  timeLimit?: number          // seconds per question
  // MCQ / Aptitude / Debugging
  options?: MCQOption[]
  correctOptionId?: string
  // Coding / SQL
  starterCode?: string
  testCases?: { input: string; expectedOutput: string; isHidden: boolean }[]
  solutionCode?: string
  // Case Study
  context?: string
  rubric?: string
  tags?: string[]
}

export interface AssessmentSection {
  name: string
  type: QuestionType
  questions: Question[]
  timeLimit: number           // minutes for this section
  passingScore?: number       // minimum % to pass section
}

export interface AssessmentDocument {
  _id?: string | ObjectId
  driveId: string             // linked hiring drive
  recruiterId: string
  title: string
  description?: string
  totalTime: number           // total minutes
  totalPoints: number
  passingScore: number        // % needed to pass overall
  sections: AssessmentSection[]
  status: "draft" | "active" | "closed"
  instructions?: string
  allowedAttempts: number
  shuffleQuestions: boolean
  showResultsAfter: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AssessmentAttempt {
  _id?: string | ObjectId
  assessmentId: string
  driveId: string
  studentId: string
  studentName: string
  startedAt: Date
  submittedAt?: Date
  status: "in_progress" | "submitted" | "evaluated" | "timed_out"
  answers: {
    questionId: string
    type: QuestionType
    selectedOptionId?: string   // MCQ
    code?: string               // Coding / SQL
    text?: string               // Case Study
    timeTaken?: number          // seconds
  }[]
  // Evaluation
  scores: {
    sectionName: string
    raw: number
    max: number
    percentage: number
  }[]
  totalScore: number
  totalMax: number
  percentage: number
  rank?: number
  aiEvaluation?: {
    strengths: string[]
    weaknesses: string[]
    summary: string
    codeQuality?: number        // 0-10
    problemSolving?: number     // 0-10
  }
  passed: boolean
  createdAt: Date
  updatedAt: Date
}

const ASSESSMENTS = "assessments"
const ATTEMPTS    = "assessment_attempts"

export const AssessmentModel = {
  // ── Assessments ──────────────────────────────────────────────
  async create(data: Omit<AssessmentDocument, "_id" | "createdAt" | "updatedAt">): Promise<AssessmentDocument> {
    const db  = await getDatabase()
    const now = new Date()
    const doc = { ...data, createdAt: now, updatedAt: now }
    const res = await db.collection(ASSESSMENTS).insertOne(doc)
    return { ...doc, _id: res.insertedId.toString() }
  },

  async findById(id: string): Promise<AssessmentDocument | null> {
    const db  = await getDatabase()
    const doc = await db.collection(ASSESSMENTS).findOne({ _id: new ObjectId(id) })
    return doc ? serializeAssessment(doc) : null
  },

  async findByDrive(driveId: string): Promise<AssessmentDocument | null> {
    const db  = await getDatabase()
    const doc = await db.collection(ASSESSMENTS).findOne({ driveId })
    return doc ? serializeAssessment(doc) : null
  },

  async findByRecruiter(recruiterId: string): Promise<AssessmentDocument[]> {
    const db   = await getDatabase()
    const docs = await db.collection(ASSESSMENTS).find({ recruiterId }).sort({ createdAt: -1 }).toArray()
    return docs.map(serializeAssessment)
  },

  async update(id: string, data: Partial<AssessmentDocument>): Promise<void> {
    const db = await getDatabase()
    await db.collection(ASSESSMENTS).updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } }
    )
  },

  async delete(id: string): Promise<void> {
    const db = await getDatabase()
    await db.collection(ASSESSMENTS).deleteOne({ _id: new ObjectId(id) })
  },

  // ── Attempts ─────────────────────────────────────────────────
  async createAttempt(data: Omit<AssessmentAttempt, "_id" | "createdAt" | "updatedAt">): Promise<AssessmentAttempt> {
    const db  = await getDatabase()
    const now = new Date()
    const doc = { ...data, createdAt: now, updatedAt: now }
    const res = await db.collection(ATTEMPTS).insertOne(doc)
    return { ...doc, _id: res.insertedId.toString() }
  },

  async findAttempt(assessmentId: string, studentId: string): Promise<AssessmentAttempt | null> {
    const db  = await getDatabase()
    const doc = await db.collection(ATTEMPTS).findOne({ assessmentId, studentId })
    return doc ? serializeAttempt(doc) : null
  },

  async findAttemptById(id: string): Promise<AssessmentAttempt | null> {
    const db  = await getDatabase()
    const doc = await db.collection(ATTEMPTS).findOne({ _id: new ObjectId(id) })
    return doc ? serializeAttempt(doc) : null
  },

  async findAttemptsByAssessment(assessmentId: string): Promise<AssessmentAttempt[]> {
    const db   = await getDatabase()
    const docs = await db.collection(ATTEMPTS).find({ assessmentId }).sort({ percentage: -1 }).toArray()
    return docs.map(serializeAttempt)
  },

  async findAttemptsByStudent(studentId: string): Promise<AssessmentAttempt[]> {
    const db   = await getDatabase()
    const docs = await db.collection(ATTEMPTS).find({ studentId }).sort({ createdAt: -1 }).toArray()
    return docs.map(serializeAttempt)
  },

  async updateAttempt(id: string, data: Partial<AssessmentAttempt>): Promise<void> {
    const db = await getDatabase()
    await db.collection(ATTEMPTS).updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } }
    )
  },

  // ── Ranking ──────────────────────────────────────────────────
  async computeRankings(assessmentId: string): Promise<void> {
    const db      = await getDatabase()
    const attempts = await db.collection(ATTEMPTS)
      .find({ assessmentId, status: "evaluated" })
      .sort({ percentage: -1, submittedAt: 1 })
      .toArray()

    const bulkOps = attempts.map((a, i) => ({
      updateOne: {
        filter: { _id: a._id },
        update: { $set: { rank: i + 1, updatedAt: new Date() } },
      },
    }))
    if (bulkOps.length) await db.collection(ATTEMPTS).bulkWrite(bulkOps)
  },
}

function serializeAssessment(doc: any): AssessmentDocument {
  return { ...doc, _id: doc._id?.toString() }
}

function serializeAttempt(doc: any): AssessmentAttempt {
  return { ...doc, _id: doc._id?.toString() }
}
