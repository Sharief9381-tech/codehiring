// lib/auth-server.ts — Server Component only (uses next/headers cookies)
// Import this ONLY in Server Components and page.tsx files, NOT in route handlers.

import { cookies } from "next/headers"
import { UserModel } from "./models/user"
import { getSession } from "./auth"
import type { StudentProfile, CollegeProfile, RecruiterProfile } from "./types"

export async function getCurrentUser(): Promise<
  | Omit<StudentProfile, "password">
  | Omit<CollegeProfile, "password">
  | Omit<RecruiterProfile, "password">
  | null
> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("session_token")?.value
    if (!token) return null

    const session = await getSession(token)
    if (!session) return null

    const user = await UserModel.findById(session.userId)
    if (!user) return null

    const { password, ...rest } = user
    return rest as any
  } catch (error) {
    console.error("getCurrentUser error:", error)
    return null
  }
}
