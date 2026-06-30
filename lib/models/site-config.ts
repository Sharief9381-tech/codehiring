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

export interface SeniorStory {
  name: string       // e.g. "Priya S."
  year: string       // e.g. "Now at Google (SWE)"
  story: string
  tip: string
  avatar: string     // initials e.g. "PS"
}

export interface SiteConfigDocument {
  key: string        // always "landing"
  hero: HeroConfig
  testimonials: Testimonial[]
  featuredCompanies: FeaturedCompany[]
  announcementBar: string   // empty string = hidden
  communityDiscordUrl: string
  seniorStories: SeniorStory[]
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
  communityDiscordUrl: "https://discord.com/invite/DvYWXNr4yR",
  seniorStories: [
    {
      name: "Priya S.",
      year: "Now at Google (SWE)",
      story: "I started in 1st year not knowing what a variable was. CS50 on YouTube changed everything. By 3rd year I had 3 internships. Start early, stay consistent.",
      tip: "Do CS50. Seriously. Just do it.",
      avatar: "PS",
    },
    {
      name: "Rahul M.",
      year: "Now at Swiggy (SDE-2)",
      story: "Failed my first coding interview badly in 2nd year. Instead of quitting, I started solving 1 LeetCode Easy per day. 200 days later I was getting calls from product companies.",
      tip: "1 problem per day beats 10 in one day.",
      avatar: "RM",
    },
    {
      name: "Anjali K.",
      year: "Placed at Infosys, now upskilling",
      story: "I focused on Python and web dev in first year instead of competitive programming. Built 2 projects that I showed in every interview. Projects > grades for placements.",
      tip: "Build something. Anything. Then build something better.",
      avatar: "AK",
    },
  ],
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
      communityDiscordUrl: doc.communityDiscordUrl ?? DEFAULT_CONFIG.communityDiscordUrl,
      seniorStories: doc.seniorStories ?? DEFAULT_CONFIG.seniorStories,
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
