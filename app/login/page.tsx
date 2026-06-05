import Image from "next/image"
import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/auth/login-form"
import { ClientOnly } from "@/components/client-only"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center">
            <Image src="/codehiring-logo.svg" alt="CodeHiring" width={160} height={40} className="h-10 w-auto block dark:hidden" />
            <Image src="/codehiring-logo-dark.svg" alt="CodeHiring" width={160} height={40} className="h-10 w-auto hidden dark:block" />
          </Link>
        </div>

        <Card className="border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <ClientOnly fallback={<div className="h-32 animate-pulse bg-muted rounded" />}>
              <LoginForm />
            </ClientOnly>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
