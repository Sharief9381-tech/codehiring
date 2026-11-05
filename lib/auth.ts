// lib/auth.ts - safe to import in route handlers AND server components

import { UserModel } from "./models/user"
import { SessionModel } from "./models/session"
import type {
  UserRole,
  StudentProfile,
  CollegeProfile,
  RecruiterProfile,
  AdminProfile,
} from "./types"

// -- Password hashing ----------------------------------------------

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "codetrack_salt_2024")
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return (await hashPassword(password)) === hash
}

// -- Token generation ----------------------------------------------

export async function generateToken(): Promise<string> {
  const arr = new Uint8Array(32)
  crypto.getRandomValues(arr)
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("")
}

// -- Session management --------------------------------------------

export async function createSession(userId: string, role: UserRole): Promise<string> {
  const token = await generateToken()

  // Increment the user's sessionSeq — this invalidates all previous sessions
  const { getDatabase } = await import("./database")
  const { ObjectId } = await import("mongodb")
  const db = await getDatabase()

  const result = await db.collection("users").findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $inc: { sessionSeq: 1 } },
    { returnDocument: "after", projection: { sessionSeq: 1 } }
  )
  const seq: number = (result as any)?.sessionSeq ?? 1

  // Optionally clean up old sessions for this user (fire-and-forget)
  db.collection("sessions").deleteMany({ userId, seq: { $lt: seq } }).catch(() => {})

  await SessionModel.create(token, userId, role, seq)
  return token
}

export async function getSession(token: string) {
  return await SessionModel.findByToken(token)
}

export async function deleteSession(token: string) {
  await SessionModel.delete(token)
}

// -- User creation -------------------------------------------------

export async function createStudent(
  data: Omit<StudentProfile, "_id" | "createdAt" | "updatedAt"> & { password: string }
) {
  const hashedPassword = await hashPassword(data.password)
  return await UserModel.create({ ...data, password: hashedPassword, role: "student" as UserRole })
}

export async function createCollege(
  data: Omit<CollegeProfile, "_id" | "createdAt" | "updatedAt"> & { password: string }
) {
  const hashedPassword = await hashPassword(data.password)
  return await UserModel.create({ ...data, password: hashedPassword, role: "college" as UserRole })
}

export async function createRecruiter(
  data: Omit<RecruiterProfile, "_id" | "createdAt" | "updatedAt"> & { password: string }
) {
  const hashedPassword = await hashPassword(data.password)
  return await UserModel.create({ ...data, password: hashedPassword, role: "recruiter" as UserRole })
}

// -- User helpers --------------------------------------------------

export async function findUserByEmail(email: string) {
  return await UserModel.findByEmail(email)
}

export async function findUserByResetToken(token: string) {
  const users = await UserModel.findAll({ resetToken: token })
  if (users.length === 0) return null
  const user = users[0]
  if (!user.resetTokenExpires || !(user.resetTokenExpires instanceof Date) || user.resetTokenExpires < new Date()) {
    return null
  }
  return user
}

export async function clearPasswordResetToken(userId: string) {
  await UserModel.update(userId, { resetToken: null, resetTokenExpires: null })
}

export async function updateUser(userId: string, updates: Record<string, any>) {
  await UserModel.update(userId, updates)
}

export async function getUsers() {
  return await UserModel.findAll()
}

// -- Current user - uses dynamic import to avoid bundling next/headers in route handlers --

export type SessionInvalidReason = "logged_out_elsewhere" | "session_expired" | "not_authenticated"

export interface CurrentUserResult {
  user: any | null
  reason?: SessionInvalidReason
}

export async function getCurrentUserWithReason(): Promise<CurrentUserResult> {
  try {
    const { cookies } = await import("next/headers")
    const cookieStore = await cookies()
    const token = cookieStore.get("session_token")?.value
    if (!token) return { user: null, reason: "not_authenticated" }

    const session = await getSession(token)
    if (!session) return { user: null, reason: "session_expired" }

    const user = await UserModel.findById(session.userId)
    if (!user) return { user: null, reason: "not_authenticated" }

    // Check session sequence — if user has a newer session, this one was superseded
    const currentSeq: number = user.sessionSeq ?? 0
    if (session.seq !== undefined && session.seq < currentSeq) {
      // This session was invalidated by a newer login elsewhere
      await deleteSession(token)
      return { user: null, reason: "logged_out_elsewhere" }
    }

    const { password, ...rest } = user
    return { user: rest as any }
  } catch (error) {
    console.error("getCurrentUser error:", error)
    return { user: null, reason: "not_authenticated" }
  }
}

export async function getCurrentUser(): Promise<
  | Omit<StudentProfile, "password">
  | Omit<CollegeProfile, "password">
  | Omit<RecruiterProfile, "password">
  | Omit<AdminProfile, "password">
  | null
> {
  const { user } = await getCurrentUserWithReason()
  return user
}