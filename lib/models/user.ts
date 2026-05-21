import { getDatabase } from '@/lib/database'
import { ObjectId } from 'mongodb'
import type { StudentProfile, CollegeProfile, RecruiterProfile, UserRole } from '@/lib/types'

export interface UserDocument {
  _id?: ObjectId
  email: string
  password: string
  name: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
  // Role-specific fields will be merged in
  [key: string]: any
}

export class UserModel {
  private static collection = 'users'

  static async create(userData: any): Promise<UserDocument> {
    const db = await getDatabase()
    const user = {
      ...userData,
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as UserDocument

    await db.collection(this.collection).insertOne(user)
    return user
  }

  static async findByEmail(email: string): Promise<UserDocument | null> {
    const db = await getDatabase()
    return await db.collection(this.collection).findOne({ email }) as UserDocument | null
  }

  static async findById(id: string): Promise<UserDocument | null> {
    const db = await getDatabase()
    return await db.collection(this.collection).findOne({ _id: new ObjectId(id) }) as UserDocument | null
  }

  static async update(id: string, updates: Record<string, any>): Promise<void> {
    const db = await getDatabase()

    const setDoc: Record<string, any> = {}
    const unsetDoc: Record<string, any> = {}

    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === undefined) {
        unsetDoc[key] = ''
      } else {
        setDoc[key] = value
      }
    }

    const mongoUpdate: Record<string, any> = {
      $set: { ...setDoc, updatedAt: new Date() },
    }
    if (Object.keys(unsetDoc).length > 0) {
      mongoUpdate.$unset = unsetDoc
    }

    await db.collection(this.collection).updateOne(
      { _id: new ObjectId(id) },
      mongoUpdate
    )
  }

  static async delete(id: string): Promise<void> {
    const db = await getDatabase()
    await db.collection(this.collection).deleteOne({ _id: new ObjectId(id) })
  }

  static async findAll(filter: any = {}): Promise<UserDocument[]> {
    const db = await getDatabase()
    return await db.collection(this.collection).find(filter).toArray() as UserDocument[]
  }

  static async findByRole(role: UserRole): Promise<UserDocument[]> {
    return await this.findAll({ role })
  }
}