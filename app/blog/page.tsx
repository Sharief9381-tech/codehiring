import Link from "next/link"
import { ArrowLeft, Code2, ArrowRight } from "lucide-react"
import { SpotlightCard } from "@/components/landing/spotlight-card"
import { blogPosts } from "@/lib/blog-posts"

export const metadata = {
  title: "Blog — CodeHire",
  description: "Insights on tech hiring, coding performance, and campus placements.",
}

export default function BlogPage() {
  const featured = blogPosts[0]
  const rest = blogPosts.slice(1)

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <div className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Code2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">CodeHire</span>
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">Blog</span>
          <Link href="/" className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Header */}
        <div className="mb-14">
          <p className="text-sm text-primary font-semibold uppercase tracking-widest mb-3">Blog</p>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Insights on hiring, performance & placements.
          </h1>
          <p className="text-muted-foreground max-w-xl leading-relaxed">
            Practical guides, data-backed research, and product deep-dives for students, colleges, and recruiters.
          </p>
        </div>

        {/* Featured post */}
        <Link href={`/blog/${featured.slug}`}>
          <div className="group mb-10 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all p-8 cursor-pointer">
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium mb-4 ${featured.tagColor}`}>
              {featured.tag}
            </span>
            <h2 className="text-2xl font-bold text-foreground mb-3 text-balance group-hover:text-primary transition-colors">{featured.title}</h2>
            <p className="text-muted-foreground leading-relaxed mb-5 max-w-2xl">{featured.excerpt}</p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">{featured.date}</span>
              <span className="text-xs text-muted-foreground">{featured.readTime}</span>
              <span className="flex items-center gap-1 text-sm font-medium text-primary ml-auto group-hover:gap-2 transition-all">
                Read more <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </Link>

        {/* Post grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <SpotlightCard
                spotlightColor="rgba(139,92,246,0.13)"
                className="flex flex-col cursor-pointer hover:border-primary/40 h-full"
              >
                <div className="group p-6 flex flex-col h-full">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium mb-3 w-fit ${post.tagColor}`}>
                    {post.tag}
                  </span>
                  <h3 className="font-semibold text-foreground mb-2 leading-snug text-balance group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">{post.date} · {post.readTime}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </SpotlightCard>
            </Link>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-14 rounded-xl border border-border bg-secondary/30 p-8 text-center">
          <h2 className="text-lg font-bold text-foreground mb-2">Stay in the loop</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Get new articles, hiring insights, and platform updates delivered to your inbox.
          </p>
          <a
            href="mailto:newsletter@codehire.io?subject=Subscribe to CodeHire Blog"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Subscribe via email
          </a>
        </div>
      </div>
    </div>
  )
}
