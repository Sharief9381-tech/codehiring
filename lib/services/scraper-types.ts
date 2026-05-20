/**
 * Normalized platform response — every scraper returns this shape.
 * Platform-specific extras live in `rawStats` for display purposes.
 */
export interface NormalizedPlatformStats {
  platform: string
  username: string
  verified: boolean
  profileUrl: string
  fetchedAt: string          // ISO timestamp
  stats: {
    solved: number           // total problems solved
    ranking: string          // rank label (e.g. "Expert", "3*", "1500")
    rating: number           // numeric rating / score
    streak: number           // current streak (days or contests)
    score: number            // platform-specific score / points
    contests: number         // number of contests participated
  }
  rawStats: Record<string, unknown>  // full platform-specific data
  error?: string             // set when verified=false
}

export type ScraperFn = (username: string) => Promise<NormalizedPlatformStats>
