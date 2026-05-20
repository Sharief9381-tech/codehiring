/**
 * Shared fetch utilities for all scrapers.
 * - Retry with exponential back-off
 * - Standard browser-like headers
 * - Safe JSON parsing
 */

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

export interface FetchOptions {
  method?: "GET" | "POST"
  headers?: Record<string, string>
  body?: string
  timeoutMs?: number
  retries?: number
}

/**
 * Fetch with timeout + retry.
 * Returns null instead of throwing on network errors.
 */
export async function safeFetch(
  url: string,
  options: FetchOptions = {}
): Promise<Response | null> {
  const { method = "GET", headers = {}, body, timeoutMs = 12000, retries = 2 } = options

  const mergedHeaders: Record<string, string> = {
    "User-Agent": BROWSER_UA,
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    ...headers,
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method,
        headers: mergedHeaders,
        body,
        signal: AbortSignal.timeout(timeoutMs),
      })
      return res
    } catch (err: unknown) {
      const isLast = attempt === retries
      if (!isLast) {
        // Exponential back-off: 500ms, 1000ms
        await sleep(500 * Math.pow(2, attempt))
        continue
      }
      console.warn(`[scraper] safeFetch failed after ${retries + 1} attempts: ${url}`, err)
      return null
    }
  }
  return null
}

/** Fetch JSON with retry. Returns null on any error. */
export async function fetchJSON<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<T | null> {
  const res = await safeFetch(url, {
    ...options,
    headers: { Accept: "application/json", ...options.headers },
  })
  if (!res || !res.ok) return null
  try {
    return (await res.json()) as T
  } catch {
    return null
  }
}

/** Fetch HTML text with retry. Returns null on any error. */
export async function fetchHTML(url: string, options: FetchOptions = {}): Promise<string | null> {
  const res = await safeFetch(url, options)
  if (!res || !res.ok) return null
  try {
    return await res.text()
  } catch {
    return null
  }
}

/** Extract first regex match as integer. Returns 0 if not found. */
export function extractInt(html: string, ...patterns: RegExp[]): number {
  for (const p of patterns) {
    const m = html.match(p)
    if (m) {
      const n = parseInt(m[1] ?? m[0])
      if (!isNaN(n)) return n
    }
  }
  return 0
}

/** Extract first regex match as string. Returns "" if not found. */
export function extractStr(html: string, ...patterns: RegExp[]): string {
  for (const p of patterns) {
    const m = html.match(p)
    if (m) return (m[1] ?? m[0]).trim()
  }
  return ""
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

/** Build a failed normalized result */
export function failResult(platform: string, username: string, reason: string) {
  return {
    platform,
    username,
    verified: false,
    profileUrl: "",
    fetchedAt: new Date().toISOString(),
    stats: { solved: 0, ranking: "", rating: 0, streak: 0, score: 0, contests: 0 },
    rawStats: {},
    error: reason,
  }
}
