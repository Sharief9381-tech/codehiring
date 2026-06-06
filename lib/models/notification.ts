import { getDatabase } from "@/lib/database"
import { ObjectId } from "mongodb"

export type NotificationType =
  | "job_match"       // new job matches student profile
  | "platform_sync"  // platform sync completed
  | "shortlist"      // recruiter shortlisted student
  | "application"    // application update
  | "announcement"   // general platform announcement
  | "welcome"        // welcome on signup

export interface NotificationDocument {
  _id?: string | ObjectId
  userId: string
  type: NotificationType
  title: string
  message: string
  href?: string       // link to relevant page
  read: boolean
  createdAt: Date
}

const COLLECTION = "notifications"

export const NotificationModel = {
  async findByUser(userId: string, limit = 20): Promise<NotificationDocument[]> {
    const db = await getDatabase()
    const docs = await db.collection(COLLECTION)
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()
    return docs.map(serialize)
  },

  async countUnread(userId: string): Promise<number> {
    const db = await getDatabase()
    return await db.collection(COLLECTION).countDocuments({ userId, read: false })
  },

  async create(data: Omit<NotificationDocument, "_id" | "read" | "createdAt">): Promise<NotificationDocument> {
    const db = await getDatabase()
    const doc = { ...data, read: false, createdAt: new Date() }
    const result = await db.collection(COLLECTION).insertOne(doc)
    return { ...doc, _id: result.insertedId.toString() }
  },

  async markRead(id: string, userId: string): Promise<void> {
    const db = await getDatabase()
    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id), userId },
      { $set: { read: true } }
    )
  },

  async markAllRead(userId: string): Promise<void> {
    const db = await getDatabase()
    await db.collection(COLLECTION).updateMany(
      { userId, read: false },
      { $set: { read: true } }
    )
  },

  async deleteOne(id: string, userId: string): Promise<void> {
    const db = await getDatabase()
    await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id), userId })
  },

  // Seed a welcome notification for new users
  async seedWelcome(userId: string, name: string, role: string): Promise<void> {
    const roleMessages: Record<string, { title: string; message: string; href: string }> = {
      student: {
        title: "Welcome to CodeHiring! 🎉",
        message: "Connect your coding platforms to build your verified profile and get matched with jobs.",
        href: "/student/platforms",
      },
      college: {
        title: "Welcome to CodeHiring! 🎉",
        message: "Start onboarding students and track placement activity from your dashboard.",
        href: "/college/students",
      },
      recruiter: {
        title: "Welcome to CodeHiring! 🎉",
        message: "Search for verified developer talent and post your first job opening.",
        href: "/recruiter/search",
      },
    }
    const msg = roleMessages[role] ?? {
      title: "Welcome to CodeHiring! 🎉",
      message: "Your account is ready. Explore the platform to get started.",
      href: "/",
    }
    await NotificationModel.create({ userId, type: "welcome", ...msg })
  },
}

function serialize(doc: any): NotificationDocument {
  return {
    ...doc,
    _id: doc._id?.toString(),
    createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt),
  }
}
