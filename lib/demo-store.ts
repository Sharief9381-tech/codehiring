// Shared in-memory store for demo user's linked platforms
// Persists for the lifetime of the Next.js server process

const demoLinkedPlatforms: Record<string, { username: string; linkedAt: Date; isActive: boolean; stats?: any }> = {}

export function getDemoLinkedPlatforms() {
  return { ...demoLinkedPlatforms }
}

export function setDemoPlatform(platform: string, username: string, platformUrl?: string) {
  demoLinkedPlatforms[platform] = {
    username,
    linkedAt: new Date(),
    isActive: true,
  }
}

export function removeDemoPlatform(platform: string) {
  delete demoLinkedPlatforms[platform]
}
