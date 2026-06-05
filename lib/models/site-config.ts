/**
 * SiteConfig — stores admin-editable landing page content in MongoDB.
 * Only ONE document exists (upserted by key "landing").
 */
import { getDatabase } from "@/lib/database"

export interface HeroConfig {
  badge: string
  headline: string
  headlineHighlight: string
  subtext: string
  ctaPrimary: string
  ctaSecondary: string
}

export interface Testimonial {
  name: string
  role: string       // e.g. "Student, IIT Bombay"
  avatar: string     // initials fallback e.g. "AS"
  text: string
}

export interface FeaturedCompany {
  name: string
}

export interface SiteConfigDocument {
  key: string        // always "landing"
  hero: HeroConfig
  testimonials: Testimonial[]
  featuredCompanies: FeaturedCompany[]
  announcementBar: string   // empty string = hidden
  updatedAt: Date
}

const COLLECTION = "site_config"
const KEY = "landing"

const DEFAULT_CONFIG: Omit<SiteConfigDocument, "updatedAt"> = {
  key: KEY,
  hero: {
    badge: "AI-Powered Campus Recruitment",
    headline: "Where Coding Skills",
    headlineHighlight: "Meet Opportunities",
    subtext:
      "CodeHiring unifies student coding performance across all platforms, gives colleges placement analytics, and helps recruiters find verified talent — all in one place.",
    ctaPrimary: "Get Started Free",
    ctaSecondary: "Sign In",
  },
  testimonials: [],
  featuredCompanies: [
    { name: "Google" },
    { name: "Microsoft" },
    { name: "Amazon" },
    { name: "Flipkart" },
    { name: "Razorpay" },
    { name: "Swiggy" },
    { name: "Zepto" },
    { name: "PhonePe" },
  ],
  announcementBar: "",
}

export const SiteConfigModel = {
  async get(): Promise<SiteConfigDocument> {
    const db = await getDatabase()
    const doc = await db.collection(COLLECTION).findOne({ key: KEY })
    if (!doc) return { ...DEFAULT_CONFIG, updatedAt: new Date() }
    return {
      key: doc.key,
      hero: doc.hero ?? DEFAULT_CONFIG.hero,
      testimonials: doc.testimonials ?? DEFAULT_CONFIG.testimonials,
      featuredCompanies: doc.featuredCompanies ?? DEFAULT_CONFIG.featuredCompanies,
      announcementBar: doc.announcementBar ?? "",
      updatedAt: doc.updatedAt ?? new Date(),
    }
  },

  async upsert(data: Partial<Omit<SiteConfigDocument, "key" | "updatedAt">>): Promise<void> {
    const db = await getDatabase()
    await db.collection(COLLECTION).updateOne(
      { key: KEY },
      { $set: { ...data, key: KEY, updatedAt: new Date() } },
      { upsert: true }
    )
  },

  getDefault(): Omit<SiteConfigDocument, "updatedAt"> {
    return DEFAULT_CONFIG
  },
}
