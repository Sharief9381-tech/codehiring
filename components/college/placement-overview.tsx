"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, TrendingUp } from "lucide-react"
import Link from "next/link"

interface PlacementData {
  total: number
  placed: number
  interviewing: number
  searching: number
  placementRate: number
}

export function PlacementOverview() {
  const [placementData, setPlacementData] = useState<PlacementData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlacementData()
  }, [])

  const fetchPlacementData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/college/dashboard')
      if (response.ok) {
        const data = await response.json()
        setPlacementData(data.placement)
      } else {
        console.error('Failed to fetch placement data:', response.status)
      }
    } catch (error) {
      console.error('Error fetching placement data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Placement Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center p-3 bg-secondary border border-border rounded-lg animate-pulse">
                <div className="h-8 w-16 bg-muted rounded mx-auto mb-2" />
                <div className="h-4 w-20 bg-muted rounded mx-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!placementData || placementData.total === 0) {
    return (
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Placement Overview</CardTitle>
          <button
            onClick={fetchPlacementData}
            disabled={loading}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No placement data available</p>
            <p className="text-sm text-muted-foreground mt-1">
              Students need to register to see placement statistics
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Placement Overview</CardTitle>
        <button
          onClick={fetchPlacementData}
          disabled={loading}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </CardHeader>
      <CardContent>
        {/* Summary Statistics Only */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/college/students">
            <div className="text-center p-3 bg-secondary border border-border rounded-lg cursor-pointer hover:border-primary/40 hover:bg-secondary/70 transition-colors">
              <p className="text-2xl font-bold text-foreground">{placementData.total}</p>
              <p className="text-xs text-muted-foreground">Total Students</p>
            </div>
          </Link>
          <Link href="/college/placements">
            <div className="text-center p-3 bg-green-900 border border-green-700 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-800 transition-colors">
              <p className="text-2xl font-bold text-green-400">{placementData.placed}</p>
              <p className="text-xs text-green-300">Placed</p>
            </div>
          </Link>
          <Link href="/college/placements">
            <div className="text-center p-3 bg-amber-900 border border-amber-700 rounded-lg cursor-pointer hover:border-amber-500 hover:bg-amber-800 transition-colors">
              <p className="text-2xl font-bold text-amber-400">{placementData.interviewing}</p>
              <p className="text-xs text-amber-300">Interviewing</p>
            </div>
          </Link>
          <Link href="/college/students">
            <div className="text-center p-3 bg-red-900 border border-red-700 rounded-lg cursor-pointer hover:border-red-500 hover:bg-red-800 transition-colors">
              <p className="text-2xl font-bold text-red-400">{placementData.searching}</p>
              <p className="text-xs text-red-300">Searching</p>
            </div>
          </Link>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Overall Placement Rate: <span className="font-semibold text-foreground">{placementData.placementRate}%</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
