/**
 * GET /api/student/project-challenges
 * Returns AI-generated project challenges — Basic → Intermediate → Advanced.
 * Infinite: each completion advances difficulty. Cached per user.
 *
 * POST ?action=refresh — force regeneration
 */
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getDatabase } from "@/lib/database"

const COLLECTION = "project_challenges"
const CHALLENGES_PER_LEVEL = 6  // complete 6 → advance to next tier

// 3 difficulty tiers — real-world, industry-relevant projects
const TIERS = [
  {
    level: "Beginner", color: "#10b981", xp: 30,
    desc: "Real-world mini apps that mirror actual products. Focus on core functionality, clean UI, and working logic. No frameworks needed — plain HTML/CSS/JS or Python.",
    examples: "QR code generator, URL shortener UI, Password strength checker, Markdown to HTML converter, Color palette generator, BMI calculator with health advice, Currency converter using exchange rate API, Random joke/quote generator, IP address lookup tool, Lyrics finder using an API",
  },
  {
    level: "Intermediate", color: "#f59e0b", xp: 50,
    desc: "Real apps people actually use — clones of popular products, API-powered tools, or data-driven dashboards. Requires multiple components, API integration, and state management.",
    examples: "Twitter/X clone (post, like, follow), Spotify playlist manager using Spotify API, YouTube video search and player, Reddit-style discussion board, Google Maps location tracker, Trello clone kanban board, Slack-style messaging UI, Instagram-style photo feed with filters, Amazon product search with cart, GitHub activity tracker dashboard",
  },
  {
    level: "Advanced", color: "#ef4444", xp: 80,
    desc: "Production-grade full-stack applications with authentication, real-time features, databases, and deployment. These are interview portfolio projects.",
    examples: "Netflix clone with video streaming and auth, Uber-like ride booking system, Food delivery app (Zomato/Swiggy clone), LinkedIn-style professional network, Airbnb property listing platform, Online code editor (like CodePen), Stock market dashboard with live prices, Hospital management system, Learning management system (LMS), SaaS project management tool with billing",
  },
]

function getTierInfo(projectSolved: number) {
  // 0-2 solved → Beginner, 3-5 → Intermediate, 6+ → Advanced (cycles back)
  const tierIdx = Math.min(Math.floor(projectSolved / CHALLENGES_PER_LEVEL), TIERS.length - 1)
  return TIERS[tierIdx]
}

async function generateProjects(tier: typeof TIERS[0], count: number, seed: number): Promise<any[]> {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error("No OPENAI_API_KEY")

  const ts = `${Date.now() + seed}`

  const prompt = `Generate exactly ${count} unique real-world project challenges for CS students.

Difficulty: ${tier.level}
Scope: ${tier.desc}
Inspiration (do NOT copy these, generate fresh real-world ideas): ${tier.examples}

Requirements for each project:
- Must mirror a REAL product or tool people actually use (clones, inspired-by, or real industry tools)
- Must be buildable and meaningful for a ${tier.level} student's portfolio
- Must have a clear, practical use case
- All ${count} must be DIFFERENT from each other

Return ONLY a valid JSON array, no markdown:
[
  {
    "id": "ai-proj-${ts}-1",
    "title": "Project name — real product inspired (e.g. 'Twitter Clone', 'Spotify Playlist Manager')",
    "desc": "1 sentence: what the student builds and which real product it mirrors",
    "problemStatement": "3-4 sentences explaining exactly what to build: core screens/pages, user interactions, what data is shown, and what the end result looks like. Be specific like a product brief.",
    "explanation": "2-3 sentences on the key technical concepts the student will practice (APIs, auth, state, real-time, etc.)",
    "badge": "${tier.level}",
    "color": "${tier.color}",
    "xp": ${tier.xp},
    "techHint": "Specific tech stack recommendation (e.g. 'React + Firebase', 'Next.js + MongoDB', 'Vanilla JS + OpenWeatherMap API')",
    "features": ["Core feature 1", "Core feature 2", "Core feature 3", "Core feature 4"]
  }
]`

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      max_tokens: 1500,
    }),
  })

  if (!res.ok) throw new Error(`OpenAI ${res.status}`)
  const data  = await res.json()
  const raw   = data.choices?.[0]?.message?.content?.trim() ?? ""
  const clean = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
  const parsed = JSON.parse(clean)
  return Array.isArray(parsed) ? parsed.slice(0, count) : []
}

const FALLBACK: Record<string, any[]> = {
  Beginner: [
    { id:"fb-p-b1", title:"QR Code Generator",
      desc:"Build a tool that converts any URL or text into a downloadable QR code.",
      problemStatement:"Build a QR code generator where the user types any URL or text into an input field and clicks Generate. The app displays the QR code instantly using a free QR API (e.g. api.qrserver.com). Add a Download button to save the QR code as a PNG. Show a preview of the entered URL below the QR code.",
      explanation:"Practice API integration using a simple GET request with query params, dynamic DOM updates, and triggering file downloads using the anchor download attribute.",
      badge:"Beginner", color:"#10b981", xp:30, techHint:"HTML/CSS/JS + qrserver.com API",
      features:["Text/URL input","Instant QR generation","QR code preview","Download as PNG"] },
    { id:"fb-p-b2", title:"Password Strength Checker",
      desc:"Real-time password strength meter like those on signup pages.",
      problemStatement:"Build a password input field that evaluates strength in real time as the user types. Show a colored strength bar (Weak/Fair/Strong/Very Strong) based on criteria: length ≥ 8, has uppercase, has number, has special character. Display which criteria are met with green checkmarks and unmet ones in red. Add a show/hide password toggle.",
      explanation:"Practice string analysis with regex, conditional logic for scoring, and live DOM updates on input events. Each criterion adds to the score and updates the bar color.",
      badge:"Beginner", color:"#10b981", xp:30, techHint:"HTML/CSS/JS",
      features:["Real-time strength meter","Criteria checklist","Color-coded bar","Show/hide toggle"] },
    { id:"fb-p-b3", title:"Currency Converter",
      desc:"Live currency converter using a free exchange rate API.",
      problemStatement:"Build a currency converter where the user enters an amount, selects a source currency, and selects a target currency from a dropdown. On Convert, fetch the live exchange rate from a free API (e.g. exchangerate.host or frankfurter.app) and display the converted amount. Show the rate used and a last-updated timestamp.",
      explanation:"Practice making API requests with fetch(), parsing JSON responses, and populating dynamic dropdowns. Handle loading and error states gracefully.",
      badge:"Beginner", color:"#10b981", xp:30, techHint:"HTML/CSS/JS + exchangerate API",
      features:["Live exchange rates","Currency dropdown","Conversion result","Last updated time"] },
    { id:"fb-p-b4", title:"Random Quote Generator",
      desc:"Inspirational quote machine that tweets the quote — like brainyquote.com.",
      problemStatement:"Build a quote generator that fetches a random inspirational quote from a public API (e.g. quotable.io) on page load and on button click. Display the quote text and author with a smooth fade transition. Add a Tweet button that opens Twitter with the quote pre-filled. Add a Copy to Clipboard button.",
      explanation:"Practice fetch API calls, CSS transitions for smooth quote changes, and using the Web Share API or Twitter intent URLs for sharing.",
      badge:"Beginner", color:"#10b981", xp:30, techHint:"HTML/CSS/JS + quotable.io",
      features:["Random quote fetch","Author display","Tweet button","Copy to clipboard"] },
    { id:"fb-p-b5", title:"IP Address Tracker",
      desc:"Look up any IP address and show location on a map — like whatismyipaddress.com.",
      problemStatement:"Build an IP address tracker where the user enters an IP address and clicks Search. Use the ipapi.co or ip-api.com free API to fetch location data: city, region, country, timezone, and ISP. Display this info in a clean card layout. Show the location on an embedded map using Leaflet.js (free, no API key needed).",
      explanation:"Practice API calls with dynamic query params, JSON parsing, and embedding an interactive map with Leaflet.js. Handle the user's own IP by default on page load.",
      badge:"Beginner", color:"#10b981", xp:30, techHint:"HTML/CSS/JS + ipapi.co + Leaflet.js",
      features:["IP lookup","Location details","Map pin","Default to user IP"] },
    { id:"fb-p-b6", title:"Age Calculator",
      desc:"Calculate exact age in years, months, and days — like the one on timeanddate.com.",
      problemStatement:"Build an age calculator where the user enters their date of birth using a date picker. On Calculate, show the exact age broken down into years, months, and days. Also show the day of the week they were born, how many days until their next birthday, and their age in total days, hours, and minutes.",
      explanation:"Practice JavaScript Date object manipulation, arithmetic with dates, and formatting numbers. Calculate the difference between today and the birth date using getTime() for precision.",
      badge:"Beginner", color:"#10b981", xp:30, techHint:"HTML/CSS/JS",
      features:["Date picker","Years/months/days","Next birthday countdown","Day of week born"] },
  ],
  Intermediate: [
    { id:"fb-p-i1", title:"GitHub Activity Dashboard",
      desc:"A developer analytics dashboard like GitHub's own profile page.",
      problemStatement:"Build a GitHub analytics dashboard where users search for any GitHub username. Display profile info (avatar, bio, followers, following), a list of their most starred repos, programming languages used as a pie chart, contribution stats, and recent commit activity. Use the GitHub REST API — no auth key needed for public data.",
      explanation:"Practice consuming a real REST API with pagination, aggregating data for charts using Chart.js, and rendering complex nested JSON responses. Handle rate limiting and 404 errors gracefully.",
      badge:"Intermediate", color:"#f59e0b", xp:50, techHint:"React + GitHub API + Chart.js",
      features:["User profile","Starred repos","Language chart","Commit activity"] },
    { id:"fb-p-i2", title:"YouTube Clone",
      desc:"A video browsing app using the YouTube Data API — like YouTube's homepage.",
      problemStatement:"Build a YouTube-style video browser using the YouTube Data API v3. Show a grid of trending or searched videos with thumbnail, title, channel name, view count, and upload date. Clicking a video opens a detail page with the embedded player, video description, and a list of related videos. Implement a search bar that fetches results in real time.",
      explanation:"Practice working with a real production API with an API key, building a multi-page SPA with React Router, and rendering dynamic lists of media content with lazy loading.",
      badge:"Intermediate", color:"#f59e0b", xp:50, techHint:"React + YouTube Data API v3",
      features:["Video grid","YouTube player","Search","Related videos"] },
    { id:"fb-p-i3", title:"Twitter/X Clone",
      desc:"A social feed app where users post, like, and follow — mirroring Twitter's core.",
      problemStatement:"Build a Twitter/X-style social feed with user authentication. After login, users see a feed of posts from people they follow. They can create posts (text, max 280 chars), like posts, follow/unfollow users, and view any user's profile page with their post history. Use localStorage or a simple backend for persistence.",
      explanation:"Practice component-based architecture, state management for a dynamic feed, optimistic UI updates for likes, and implementing a follow/unfollow relationship between users.",
      badge:"Intermediate", color:"#f59e0b", xp:50, techHint:"React + localStorage or Firebase",
      features:["Post feed","Like system","Follow/unfollow","User profiles"] },
    { id:"fb-p-i4", title:"Spotify Playlist Manager",
      desc:"Browse your Spotify playlists and manage tracks — using the Spotify Web API.",
      problemStatement:"Build a Spotify playlist manager using OAuth 2.0 authentication with the Spotify Web API. After login, display the user's playlists. Clicking a playlist shows all tracks with cover art, duration, and artist. Allow the user to remove tracks from playlists and search for new tracks to add. Show the currently playing track if any.",
      explanation:"Practice OAuth 2.0 authorization flow, making authenticated API requests with Bearer tokens, and implementing CRUD operations on playlist tracks using Spotify's API endpoints.",
      badge:"Intermediate", color:"#f59e0b", xp:50, techHint:"React + Spotify Web API + OAuth 2.0",
      features:["OAuth login","Playlist display","Track management","Search & add"] },
    { id:"fb-p-i5", title:"Reddit Clone",
      desc:"A community discussion board with posts, votes, and comments — like Reddit.",
      problemStatement:"Build a Reddit-style discussion board where users can create topic communities (subreddits), post text or links, upvote/downvote posts, comment on posts, and sort by Hot/New/Top. Show vote scores next to each post. Implement user accounts with post/comment history. Use a database for persistence.",
      explanation:"Practice relational data modeling (users → posts → comments), vote aggregation queries, and implementing a sorting algorithm (hot score = upvotes - downvotes / age).",
      badge:"Intermediate", color:"#f59e0b", xp:50, techHint:"Next.js + MongoDB",
      features:["Communities","Posts & voting","Comments","Sort by Hot/New/Top"] },
    { id:"fb-p-i6", title:"Trello Clone",
      desc:"A Kanban task board with drag-and-drop — mirroring Trello.",
      problemStatement:"Build a Trello-style kanban board where users create boards, add columns (lists), and add cards to columns. Cards can be dragged between columns using drag-and-drop. Each card has a title, description, due date, and color label. Support multiple boards per user, with board data persisted in localStorage or a database.",
      explanation:"Practice the HTML5 Drag and Drop API or react-beautiful-dnd, complex nested state management (boards → columns → cards), and CRUD operations at multiple levels.",
      badge:"Intermediate", color:"#f59e0b", xp:50, techHint:"React + react-beautiful-dnd + localStorage",
      features:["Boards & columns","Drag-and-drop cards","Card details","Multiple boards"] },
  ],
  Advanced: [
    { id:"fb-p-a1", title:"Netflix Clone",
      desc:"A video streaming platform with auth, genres, and movie details — like Netflix.",
      problemStatement:"Build a Netflix-style streaming platform using the TMDB API for movie/show data. Implement user authentication with JWT. Show a hero banner with a featured movie, genre rows with horizontally scrollable movie cards, and a detail page for each title (trailer via YouTube API, cast, ratings). Add a My List feature to save favorites. Deploy to Vercel.",
      explanation:"Practice JWT auth with refresh tokens, TMDB API integration, video embedding, and implementing smooth horizontal scroll carousels. Use React Query or SWR for efficient data fetching and caching.",
      badge:"Advanced", color:"#ef4444", xp:80, techHint:"Next.js + MongoDB + TMDB API + JWT",
      features:["JWT auth","Movie rows by genre","Trailer player","My List feature"] },
    { id:"fb-p-a2", title:"Food Delivery App",
      desc:"A Zomato/Swiggy-style food ordering platform with real-time order tracking.",
      problemStatement:"Build a food delivery app with three user roles: customer, restaurant owner, and delivery agent. Customers browse restaurants, add items to cart, place orders, and track delivery status in real time. Restaurant owners manage their menu and incoming orders. Delivery agents see assigned orders and update delivery status. Use WebSockets for real-time order status updates.",
      explanation:"Practice role-based access control, WebSocket-driven real-time status updates, complex relational data (users → orders → order items → restaurants), and multi-panel dashboards for different user roles.",
      badge:"Advanced", color:"#ef4444", xp:80, techHint:"Next.js + PostgreSQL + Socket.io",
      features:["3 user roles","Cart & checkout","Real-time order tracking","Restaurant dashboard"] },
    { id:"fb-p-a3", title:"LinkedIn Clone",
      desc:"A professional networking platform with profiles, connections, and job posts.",
      problemStatement:"Build a LinkedIn-style professional network. Users create profiles with work experience, education, and skills. They can connect with others, send connection requests, post updates to a feed, and like/comment on posts. Include a jobs section where companies post openings and users can apply. Build a messaging system between connected users.",
      explanation:"Practice graph-style relationship modeling (connections), a news feed algorithm sorting by recency and engagement, full-text search on profiles and job posts, and a real-time messaging system using WebSockets.",
      badge:"Advanced", color:"#ef4444", xp:80, techHint:"Next.js + PostgreSQL + Socket.io",
      features:["Profile & connections","News feed","Jobs board","Real-time messaging"] },
    { id:"fb-p-a4", title:"Online Code Editor",
      desc:"A browser-based code editor like CodePen — run HTML/CSS/JS in the browser.",
      problemStatement:"Build an online code editor with three panels: HTML, CSS, and JavaScript editors. The output panel renders the combined code in a sandboxed iframe that updates in real time as the user types. Support saving pens to a database with shareable URLs, a gallery of public pens, forking others' pens, and syntax highlighting in the editors.",
      explanation:"Practice using CodeMirror or Monaco Editor for syntax highlighting, sandboxed iframe communication for safe code execution, debouncing live preview updates, and generating short shareable URL slugs.",
      badge:"Advanced", color:"#ef4444", xp:80, techHint:"React + MongoDB + CodeMirror",
      features:["HTML/CSS/JS editors","Live preview","Save & share","Syntax highlighting"] },
    { id:"fb-p-a5", title:"Airbnb Clone",
      desc:"A property listing and booking platform — mirroring Airbnb's core flow.",
      problemStatement:"Build an Airbnb-style rental platform where hosts list properties with photos, descriptions, pricing, amenities, and availability calendars. Guests can search by location and date, filter by price/amenities, view property details with a photo gallery, and book available dates. Implement a review system after completed stays and a host/guest messaging system.",
      explanation:"Practice geolocation-based search with a map integration (Leaflet.js), a date availability calendar, image upload to cloud storage (Cloudinary), and a booking conflict detection system.",
      badge:"Advanced", color:"#ef4444", xp:80, techHint:"Next.js + MongoDB + Cloudinary + Leaflet",
      features:["Property listings","Search & filters","Booking with calendar","Reviews & messaging"] },
    { id:"fb-p-a6", title:"SaaS Project Management Tool",
      desc:"A Notion/Asana-style workspace with teams, projects, tasks, and billing.",
      problemStatement:"Build a SaaS project management tool where organizations create workspaces and invite team members. Each workspace has projects with kanban boards, task assignments, due dates, priorities, and file attachments. Implement role-based permissions (admin, member, viewer), a real-time activity feed, and Stripe-powered subscription billing with a free tier (3 projects) and pro tier (unlimited).",
      explanation:"Practice multi-tenant SaaS architecture, Stripe webhook integration for subscription events, role-based access control middleware, and real-time notifications using WebSockets or Server-Sent Events.",
      badge:"Advanced", color:"#ef4444", xp:80, techHint:"Next.js + PostgreSQL + Stripe + Socket.io",
      features:["Team workspaces","Kanban + assignments","Role permissions","Stripe billing"] },
  ],
}

function sanitize(c: any) {
  return c  // projects don't have secret answers, return as-is
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const db  = await getDatabase()
    const uid = user._id?.toString() ?? ""

    const progress     = await db.collection("first_year_progress").findOne({ userId: uid })
    const completedIds: string[] = progress?.completedChallenges ?? []

    // Count only NEW-style project completions (ai-proj- or fb-p- prefixes)
    // Old static pool IDs (p1-, p2-, p3-) are excluded so they don't inflate the level
    const projectSolved = completedIds.filter((id: string) =>
      id.startsWith("ai-proj-") || id.startsWith("fb-p-b") || id.startsWith("fb-p-i") || id.startsWith("fb-p-a")
    ).length

    const tier     = getTierInfo(projectSolved)
    const cacheKey = `${tier.level}-v3`

    // Use cache if same tier and still have enough unsolved
    const cached = await db.collection(COLLECTION).findOne({ userId: uid })
    if (cached?.challenges?.length > 0 && cached.cacheKey === cacheKey) {
      const active = (cached.challenges as any[]).filter(c => !completedIds.includes(c.id))
      if (active.length >= 3) {
        return NextResponse.json({
          challenges: active.slice(0, 6).map(sanitize),
          tier: tier.level, projectSolved,
        })
      }
      // Not enough active — fall through to generate a fresh batch
    }

    // Generate fresh batch (6 so we have buffer for replacements)
    let challenges: any[] = []
    try {
      challenges = await generateProjects(tier, 6, Math.floor(Math.random() * 100000))
    } catch {
      challenges = FALLBACK[tier.level] ?? FALLBACK.Beginner
    }
    if (challenges.length < 3) challenges = FALLBACK[tier.level] ?? FALLBACK.Beginner

    await db.collection(COLLECTION).updateOne(
      { userId: uid },
      { $set: { userId: uid, challenges, cacheKey, tier: tier.level, generatedAt: new Date() } },
      { upsert: true }
    )

    const active = challenges.filter((c: any) => !completedIds.includes(c.id))
    return NextResponse.json({
      challenges: active.slice(0, 6).map(sanitize),
      tier: tier.level, projectSolved,
    })
  } catch (err) {
    console.error("project-challenges GET:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    if (searchParams.get("action") !== "refresh") return NextResponse.json({ error: "Unknown" }, { status: 400 })

    const db  = await getDatabase()
    const uid = user._id?.toString() ?? ""
    await db.collection(COLLECTION).deleteOne({ userId: uid })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
