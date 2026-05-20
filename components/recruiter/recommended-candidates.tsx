"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sparkles, Star, ExternalLink, Loader2 } from "lucide-react"
import Link from "next/link"

interface Candidate {
  _id: string
  name: string
  college: string
  branch: string
  year: number | null
  matchScore: number
  problems: number
  rating: number
  skills: string[]
  platforms: string[]
  isOpenToWork: boolean
}



export function RecommendedCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/recruiter/search?sort=match&openToWork=true")
      .then((r) => r.json())
      .then((data) => setCandidates((data.candidates ?? []).slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center gap-2">
        <Sparkles className="h-5 w-5 text-chart-3" />
        <CardTitle>Top Candidates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : candidates.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-6">
            No candidates found yet. Students need to register and link their platforms.
          </p>
        ) : (
          candidates.map((candidate) => (
            <div
              key={candidate._id}
              className="flex flex-col gap-4 rounded-lg border border-border bg-secondary/30 p-4 sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {candidate.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{candidate.name}</p>
                    <Badge className="gap-1 bg-primary/20 text-primary">
                      <Star className="h-3 w-3" />
                      {candidate.matchScore}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {candidate.college}
                    {candidate.branch ? ` • ${candidate.branch}` : ""}
                    {candidate.year ? ` • ${candidate.year}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex flex-1 flex-wrap items-center gap-2">
                {candidate.skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                ))}
                {candidate.skills.length > 3 && (
                  <Badge variant="secondary" className="text-xs">+{candidate.skills.length - 3}</Badge>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium text-foreground">{candidate.problems} problems</p>
                </div>
              </div>
            </div>
          ))
        )}
        <Button variant="outline" className="w-full bg-transparent" asChild>
          <Link href="/recruiter/search">View All Candidates</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
