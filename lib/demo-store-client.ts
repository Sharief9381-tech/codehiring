// Client-side demo store using localStorage
// Persists linked platforms across page navigations

const STORAGE_KEY = "demo_linked_platforms"

export type DemoPlatformEntry = {
  username: string
  linkedAt: string
  isActive: boolean
}

export function getClientLinkedPlatforms(): Record<string, DemoPlatformEntry> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function setClientPlatform(platform: string, username: string) {
  if (typeof window === "undefined") return
  const platforms = getClientLinkedPlatforms()
  platforms[platform] = { username, linkedAt: new Date().toISOString(), isActive: true }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(platforms))
}

export function removeClientPlatform(platform: string) {
  if (typeof window === "undefined") return
  const platforms = getClientLinkedPlatforms()
  delete platforms[platform]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(platforms))
}
