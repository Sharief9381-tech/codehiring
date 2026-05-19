/**
 * Demo DB — no auth required.
 * A single demo student document lives in MongoDB under a fixed _id.
 * All platform link/unlink/sync operations read and write this document.
 */

import { getDatabase, isDatabaseAvailable } from "@/lib/database"
import { ObjectId } from "mongodb"

// Fixed ObjectId for the demo student — same across all requests
export const DEMO_STUDENT_OID = new ObjectId("aaaaaaaaaaaaaaaaaaaaaaaa")
export const DEMO_STUDENT_ID = DEMO_STUDENT_OID.toHexString()

const COLLECTION = "users"

/** Ensure the demo student document exists in MongoDB */
export async function ensureDemoStudent() {
  const db = await getDatabase()
  const existing = await db.collection(COLLECTION).findOne({ _id: DEMO_STUDENT_OID })
  if (!existing) {
    await db.collection(COLLECTION).insertOne({
      _id: DEMO_STUDENT_OID,
      email: "student@demo.com",
      name: "Demo Student",
      role: "student",
      collegeCode: "DEMO",
      rollNumber: "21CS001",
      graduationYear: 2025,
      branch: "CSE",
      skills: ["JavaScript", "Python", "C++"],
      linkedPlatforms: {},
      stats: {
        totalProblems: 0,
        easyProblems: 0,
        mediumProblems: 0,
        hardProblems: 0,
        githubContributions: 0,
        contestsParticipated: 0,
        rating: 0,
      },
      isOpenToWork: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
  return existing || (await db.collection(COLLECTION).findOne({ _id: DEMO_STUDENT_OID }))
}

/** Get the demo student document */
export async function getDemoStudent() {
  if (!isDatabaseAvailable()) return null
  const db = await getDatabase()
  const doc = await db.collection(COLLECTION).findOne({ _id: DEMO_STUDENT_OID })
  if (!doc) return await ensureDemoStudent()
  return doc
}

/** Link a platform for the demo student */
export async function linkDemoPlatform(platform: string, username: string, platformUrl?: string) {
  if (!isDatabaseAvailable()) return false
  const db = await getDatabase()
  await ensureDemoStudent()
  await db.collection(COLLECTION).updateOne(
    { _id: DEMO_STUDENT_OID },
    {
      $set: {
        [`linkedPlatforms.${platform}`]: {
          username,
          linkedAt: new Date(),
          isActive: true,
          ...(platformUrl ? { platformUrl } : {}),
        },
        updatedAt: new Date(),
      },
    }
  )
  return true
}

/** Unlink a platform for the demo student */
export async function unlinkDemoPlatform(platform: string) {
  if (!isDatabaseAvailable()) return false
  const db = await getDatabase()
  await db.collection(COLLECTION).updateOne(
    { _id: DEMO_STUDENT_OID },
    {
      $unset: { [`linkedPlatforms.${platform}`]: "" },
      $set: { updatedAt: new Date() },
    }
  )
  return true
}

/** Serialize a MongoDB doc to a plain JSON-safe object */
export function serializeDemoDoc(doc: any) {
  if (!doc) return null
  const { _id, ...rest } = doc
  return { ...rest, _id: _id.toHexString() }
}
