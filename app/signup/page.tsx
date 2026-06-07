"use client"

import React from "react"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, GraduationCap, Building2, Briefcase, Award, Eye, EyeOff, Search, MapPin, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { searchColleges, type CollegeEntry } from "@/lib/colleges-data"
import Loading from "./loading"

type Role = "student" | "college" | "recruiter" | "graduate"

const roles = [
  {
    id: "student" as Role,
    label: "Student",
    description: "Currently enrolled — track coding progress and get matched with jobs",
    icon: GraduationCap,
  },
  {
    id: "graduate" as Role,
    label: "Graduate",
    description: "Already passed out — showcase your profile and get hired",
    icon: Award,
  },
  {
    id: "college" as Role,
    label: "College",
    description: "Monitor student performance and manage placements",
    icon: Building2,
  },
  {
    id: "recruiter" as Role,
    label: "Recruiter",
    description: "Find and hire top coding talent with AI matching",
    icon: Briefcase,
  },
]

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<"role" | "details">("role")
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [collegeSuggestions, setCollegeSuggestions] = useState<CollegeEntry[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Student specific
    collegeCode: "",
    rollNumber: "",
    branch: "",
    graduationYear: "",
    // College specific
    collegeName: "",
    location: "",
    // Recruiter specific
    companyName: "",
    designation: "",
  })

  useEffect(() => {
    const roleParam = searchParams.get("role") as Role | null
    if (roleParam && roles.some((r) => r.id === roleParam)) {
      setSelectedRole(roleParam)
      setStep("details")
    }
  }, [searchParams])

  const handleCollegeNameChange = (value: string) => {
    setFormData(prev => ({ ...prev, collegeName: value }))
    const results = searchColleges(value)
    setCollegeSuggestions(results)
    setShowSuggestions(results.length > 0)
  }

  const selectCollege = (college: CollegeEntry) => {
    setFormData(prev => ({
      ...prev,
      collegeName: college.name,
      collegeCode: college.code,
      email: prev.email || college.email,
      location: college.location,
    }))
    setCollegeSuggestions([])
    setShowSuggestions(false)
  }

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role)
    setStep("details")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          // Graduate signs up as student with isGraduate flag
          role: selectedRole === "graduate" ? "student" : selectedRole,
          isGraduate: selectedRole === "graduate",
          isOpenToWork: selectedRole === "graduate" ? true : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Signup failed")
      }

      if (data.redirectTo) {
        router.push(data.redirectTo)
      } else {
        // Graduates go to student dashboard
        const portalRole = selectedRole === "graduate" ? "student" : selectedRole
        router.push(`/${portalRole}/dashboard`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.52_0.24_285/0.08),transparent)] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center">
            <Image src="/codehiring-logo.svg" alt="CodeHiring" width={160} height={40} className="h-10 w-auto block dark:hidden" />
            <Image src="/codehiring-logo-dark.svg" alt="CodeHiring" width={160} height={40} className="h-10 w-auto hidden dark:block" />
          </Link>
        </div>

        <Card className="border-border/60 shadow-lg rounded-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {step === "role" ? "Join CodeHiring" : "Create your account"}
            </CardTitle>
            <CardDescription>
              {step === "role"
                ? "Select your role to get started"
                : selectedRole === "graduate"
                  ? "Create your graduate profile"
                  : `Sign up as a ${selectedRole}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "role" ? (
              <div className="space-y-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleSelect(role.id)}
                    className={cn(
                      "w-full flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors text-left",
                      selectedRole === role.id && "border-primary bg-primary/5"
                    )}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <role.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{role.label}</p>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">
                    {selectedRole === "college" ? "TPO / Contact Person Name" : "Full Name"}
                  </Label>
                  <Input
                    id="name"
                    placeholder={selectedRole === "college" ? "Dr. Ramesh Kumar (Placement Officer)" : "John Doe"}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  {selectedRole === "college" && (
                    <p className="text-xs text-muted-foreground">
                      Name of the Training & Placement Officer managing this account.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    {selectedRole === "college" ? "Official Email" : "Email"}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={selectedRole === "college" ? "principal@college.ac.in" : "you@example.com"}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-9"
                      required
                    />
                  </div>
                  {selectedRole === "college" && (
                    <p className="text-xs text-muted-foreground">Auto-filled from college database. You can edit if needed.</p>
                  )}
                </div>

                {/* Role-specific fields */}
                {selectedRole === "student" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="collegeCode">College Code</Label>
                      <Input
                        id="collegeCode"
                        placeholder="IITD (e.g., IITD, NITK, BITS)"
                        value={formData.collegeCode}
                        onChange={(e) => setFormData({ ...formData, collegeCode: e.target.value.toUpperCase() })}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter your college's unique code. Contact your college if you don't know it.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rollNumber">Roll Number</Label>
                      <Input
                        id="rollNumber"
                        placeholder="21CS001 (e.g., 21CS001, 2021BCS001)"
                        value={formData.rollNumber}
                        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value.toUpperCase() })}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter your college roll number for easy identification.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="branch">Branch</Label>
                        <Input
                          id="branch"
                          placeholder="CSE"
                          value={formData.branch}
                          onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="graduationYear">Graduation Year</Label>
                        <Input
                          id="graduationYear"
                          placeholder="2026"
                          value={formData.graduationYear}
                          onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {selectedRole === "graduate" && (
                  <>
                    <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 px-4 py-3 text-xs text-blue-600 mb-2">
                      🎓 As a graduate, you get the full student dashboard — connect your platforms, build your public profile, and get matched with jobs.
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="branch">Branch / Degree</Label>
                        <Input
                          id="branch"
                          placeholder="CSE / B.Tech"
                          value={formData.branch}
                          onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="graduationYear">Graduation Year</Label>
                        <Input
                          id="graduationYear"
                          placeholder="2024"
                          value={formData.graduationYear}
                          onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="collegeCode">College Code <span className="text-muted-foreground text-xs">(optional)</span></Label>
                      <Input
                        id="collegeCode"
                        placeholder="IITD, VIT, BITS..."
                        value={formData.collegeCode}
                        onChange={(e) => setFormData({ ...formData, collegeCode: e.target.value.toUpperCase() })}
                      />
                    </div>
                  </>
                )}

                {selectedRole === "college" && (
                  <>
                    {/* College Name with autocomplete */}
                    <div className="space-y-2 relative">
                      <Label htmlFor="collegeName">College Name</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="collegeName"
                          placeholder="Search college name..."
                          value={formData.collegeName}
                          onChange={e => handleCollegeNameChange(e.target.value)}
                          onFocus={() => formData.collegeName.length >= 2 && setShowSuggestions(collegeSuggestions.length > 0)}
                          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                          className="pl-9"
                          autoComplete="off"
                          required
                        />
                      </div>
                      {/* Suggestions dropdown */}
                      {showSuggestions && (
                        <div className="absolute z-50 w-full mt-1 rounded-xl border border-border bg-background shadow-lg overflow-hidden">
                          {collegeSuggestions.map(c => (
                            <button
                              key={c.code}
                              type="button"
                              onMouseDown={() => selectCollege(c)}
                              className="w-full flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left border-b border-border/40 last:border-0"
                            >
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold mt-0.5">
                                {c.code.slice(0, 2)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />{c.location}
                                  </span>
                                  <span className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{c.code}</span>
                                  <span className={`text-xs px-1.5 py-0.5 rounded ${c.state === "TG" ? "bg-blue-500/10 text-blue-600" : "bg-emerald-500/10 text-emerald-600"}`}>{c.state}</span>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Search for AP / Telangana colleges — code, location and email will fill automatically.
                      </p>
                    </div>

                    {/* College Code — auto-filled */}
                    <div className="space-y-2">
                      <Label htmlFor="collegeCode">College Code</Label>
                      <Input
                        id="collegeCode"
                        placeholder="Auto-filled on college select"
                        value={formData.collegeCode}
                        onChange={e => setFormData(prev => ({ ...prev, collegeCode: e.target.value.toUpperCase() }))}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Students use this code to link to your college.
                      </p>
                    </div>

                    {/* Location — auto-filled */}
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          placeholder="Auto-filled on college select"
                          value={formData.location}
                          onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {selectedRole === "recruiter" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        placeholder="Tech Corp"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation</Label>
                      <Input
                        id="designation"
                        placeholder="HR Manager"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        required
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="pr-10"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                      className="pr-10"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setStep("role")
                      setSelectedRole(null)
                    }}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SignupForm />
    </Suspense>
  )
}
