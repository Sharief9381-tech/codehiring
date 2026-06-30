import { NextResponse } from "next/server"
import { isDatabaseAvailable } from "@/lib/database"
import { Analytics, getVisitorInfo } from "@/lib/analytics"
import type { UserRole } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const dbAvailable = isDatabaseAvailable()

    if (!dbAvailable) {
      // Forward the request to the fallback API
      const fallbackResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/signup-fallback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(await request.json()),
      })

      const fallbackData = await fallbackResponse.json()
      return NextResponse.json(fallbackData, { status: fallbackResponse.status })
    }

    // Import database functions only when database is available
    const { createStudent, createCollege, createRecruiter, createSession, findUserByEmail } = await import("@/lib/auth")
    const { cookies } = await import("next/headers")
    const cookieStore = await cookies()

    const body = await request.json()
    const { email, password, name, role, ...additionalData } = body

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const validRoles: UserRole[] = ["student", "college", "recruiter"]
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      )
    }

    // Check if user already exists
    try {
      const existingUser = await findUserByEmail(email)
      if (existingUser) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        )
      }
    } catch (dbError) {
      console.error("Database error checking user:", dbError)
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      )
    }

    // Build user data based on role
    let userData: Record<string, unknown> = {
      email,
      password,
      name,
    }

    let user: any

    try {
      if (role === "student") {
        userData = {
          ...userData,
          role: "student",
          collegeCode: (additionalData.collegeCode || "").trim().toUpperCase().replace(/[\s\-\.]+/g, "") || "",
          rollNumber: additionalData.rollNumber || "",
          graduationYear: parseInt(additionalData.graduationYear) || new Date().getFullYear() + 4,
          branch: additionalData.branch || "",
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
          skills: [],
          isOpenToWork: true,
        }
        user = await createStudent(userData as any)

        // Auto-register college if not already in the system
        const collegeCode = (additionalData.collegeCode || "").trim().toUpperCase().replace(/[\s\-\.]+/g, "")
        if (collegeCode) {
          try {
            const { getDatabase } = await import("@/lib/database")
            const db = await getDatabase()
            const existingCollege = await db.collection("users").findOne({ role: "college", collegeCode })
            if (!existingCollege) {
              // Try to fetch real college name from Hipolabs universities API
              let resolvedName = collegeCode
              let resolvedLocation = ""
              let resolvedWebsite = null
              try {
                const apiRes = await fetch(
                  `http://universities.hipolabs.com/search?name=${encodeURIComponent(collegeCode)}`,
                  { signal: AbortSignal.timeout(4000) }
                )
                if (apiRes.ok) {
                  const results = await apiRes.json()
                  if (Array.isArray(results) && results.length > 0) {
                    const indian = results.find((r: any) => r.country === "India") ?? results[0]
                    resolvedName = indian.name ?? collegeCode
                    resolvedLocation = indian.country ?? ""
                    resolvedWebsite = indian.web_pages?.[0] ?? null
                  }
                }
              } catch {
                // API unavailable — use code as name
              }

              await db.collection("users").insertOne({
                name: resolvedName,
                email: `auto-${collegeCode.toLowerCase()}@CodeHiring.internal`,
                password: "",
                role: "college",
                collegeName: resolvedName,
                collegeCode,
                location: resolvedLocation,
                website: resolvedWebsite,
                departments: [],
                totalStudents: 1,
                placementOfficerName: null,
                isAutoCreated: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              })
            } else {
              // Increment student count
              await db.collection("users").updateOne(
                { role: "college", collegeCode },
                { $inc: { totalStudents: 1 }, $set: { updatedAt: new Date() } }
              )
            }
          } catch (collegeErr) {
            console.error("College auto-register error (non-fatal):", collegeErr)
          }
        }
      } else if (role === "college") {
        userData = {
          ...userData,
          role: "college",
          name: additionalData.collegeName || name,
          collegeName: additionalData.collegeName || name,
          collegeCode: additionalData.collegeCode || "",
          location: additionalData.location || "",
          website: additionalData.website || "",
          placementOfficerName: name,
          placementOfficerEmail: email,
          totalStudents: 0,
          departments: additionalData.departments || [],
        }
        user = await createCollege(userData as any)
      } else if (role === "recruiter") {
        userData = {
          ...userData,
          role: "recruiter",
          companyName: additionalData.companyName || "",
          companyWebsite: additionalData.companyWebsite || "",
          companySize: additionalData.companySize || "",
          industry: additionalData.industry || "",
          designation: additionalData.designation || "",
          hiringFor: additionalData.hiringFor || [],
          preferredSkills: additionalData.preferredSkills || [],
        }
        user = await createRecruiter(userData as any)
      }
    } catch (createError) {
      console.error("Error creating user:", createError)
      return NextResponse.json(
        { error: `Failed to create user: ${createError instanceof Error ? createError.message : 'Unknown error'}` },
        { status: 500 }
      )
    }

    try {
      const token = await createSession(user._id as string, role)

      cookieStore.set("session_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      })
    } catch (sessionError) {
      console.error("Error creating session:", sessionError)
      return NextResponse.json(
        { error: `Failed to create session: ${sessionError instanceof Error ? sessionError.message : 'Unknown error'}` },
        { status: 500 }
      )
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    const redirectTo = `/${role}/dashboard`

    // Seed welcome notification (non-blocking)
    import("@/lib/models/notification").then(({ NotificationModel }) => {
      NotificationModel.seedWelcome(user._id?.toString() ?? "", user.name, role).catch(() => {})
    }).catch(() => {})

    // Send email verification (non-blocking)
    if (process.env.NEXTAUTH_URL) {
      import("@/lib/auth").then(({ generateToken }) => generateToken()).then(async (token) => {
        const { UserModel } = await import("@/lib/models/user")
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
        await UserModel.update(user._id as string, { emailVerificationToken: token, emailVerificationExpires: expires })
        const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`
        if (process.env.RESEND_API_KEY) {
          fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: "CodeHiring <onboarding@resend.dev>",
              to: [user.email],
              subject: "Verify your CodeHiring email",
              html: `<h2>Welcome to CodeHiring!</h2><p>Hi ${user.name}, verify your email: <a href="${verifyUrl}">Click here</a></p>`,
            }),
          }).catch(() => {})
        }
      }).catch(() => {})
    }

    // Track signup event
    const visitorInfo = getVisitorInfo(request)
    await Analytics.track({
      type: 'user_signup',
      userId: user._id?.toString(),
      userRole: role,
      metadata: {
        email: user.email,
        name: user.name,
        collegeCode: role === 'student' ? additionalData.collegeCode : undefined,
        companyName: role === 'recruiter' ? additionalData.companyName : undefined
      }
    }, visitorInfo)

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      redirectTo,
    })
  } catch (error) {
    console.error("Signup error:", error)
    const message = error instanceof Error ? error.message : "Failed to create account"
    return NextResponse.json({
      error: `Signup failed: ${message}`,
    }, { status: 500 })
  }
}
