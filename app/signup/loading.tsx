import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image src="/codehiring-logo.svg" alt="CodeHiring" width={160} height={40} className="h-10 w-auto" />
        </div>
        <Card className="border-border">
          <CardHeader className="text-center">
            <div className="h-8 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4 mx-auto" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-12 bg-muted rounded animate-pulse" />
              <div className="h-12 bg-muted rounded animate-pulse" />
              <div className="h-12 bg-muted rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
