/**
 * Simple in-process TTL cache for scraper results.
 * Prevents hammering external APIs on repeated requests.
 * TTL default: 5 minutes.
 */

interface CacheEntry {
  data: unknown
  expiresAt: number
}

const store = new Map<string, CacheEntry>()

const DEFAULT_TTL_MS = 5 * 60 * 1000 // 5 minutes

export const ScraperCache = {
  key(platform: string, username: string): string {
    return `${platform.toLowerCase()}:${username.toLowerCase()}`
  },

  get<T>(platform: string, username: string): T | null {
    const entry = store.get(ScraperCache.key(platform, username))
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
      store.delete(ScraperCache.key(platform, username))
      return null
    }
    return entry.data as T
  },

  set(platform: string, username: string, data: unknown, ttlMs = DEFAULT_TTL_MS): void {
    store.set(ScraperCache.key(platform, username), {
      data,
      expiresAt: Date.now() + ttlMs,
    })
  },

  invalidate(platform: string, username: string): void {
    store.delete(ScraperCache.key(platform, username))
  },

  clear(): void {
    store.clear()
  },
}
