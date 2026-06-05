"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Loader2 } from "lucide-react"
import Link from "next/link"

export default function LogoutPage() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [loggedOut, setLoggedOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setLoggedOut(true)
      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 1500)
    } catch (error) {
      console.error("Logout error:", error)
      setIsLoggingOut(false)
    }
  }

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
            <CardTitle className="text-2xl">
              {loggedOut ? "Logged Out Successfully!" : "Logout"}
            </CardTitle>
            <CardDescription>
              {loggedOut 
                ? "Redirecting to homepage..." 
                : "Click below to logout and see the homepage"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loggedOut ? (
              <div className="text-center">
                <div className="text-green-600 mb-4">✅ Successfully logged out!</div>
                <div className="text-sm text-muted-foreground">
                  Redirecting to homepage in a moment...
                </div>
              </div>
            ) : (
              <>
                <Button 
                  onClick={handleLogout} 
                  disabled={isLoggingOut}
                  className="w-full"
                  variant="destructive"
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </>
                  )}
                </Button>
                
                <div className="text-center">
                  <Link href="/" className="text-sm text-primary hover:underline">
                    Go to Homepage
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}