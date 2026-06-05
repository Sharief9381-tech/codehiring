import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Code2, Clock, Tag } from "lucide-react"
import { blogPosts, getPostBySlug } from "@/lib/blog-posts"
import type { Metadata } from "next"

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return { title: "Post Not Found — CodeHire" }
  return {
    title: `${post.title} — CodeHire Blog`,
    description: post.excerpt,
  }
}

// Render the plain-text markdown-like content into readable sections
function renderContent(content: string) {
  const lines = content.trim().split("\n")
  const elements: React.ReactNode[] = []
  let key = 0

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="text-xl font-bold text-foreground mt-10 mb-4">
          {trimmed.slice(3)}
        </h2>
      )
    } else if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="text-base font-semibold text-foreground mt-6 mb-2">
          {trimmed.slice(4)}
        </h3>
      )
    } else if (trimmed.startsWith("- ")) {
      elements.push(
        <li key={key++} className="text-sm text-muted-foreground leading-relaxed ml-4 list-disc">
          <span dangerouslySetInnerHTML={{ __html: trimmed.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
        </li>
      )
    } else {
      elements.push(
        <p key={key++} className="text-sm text-muted-foreground leading-relaxed">
          <span dangerouslySetInnerHTML={{ __html: trimmed.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
        </p>
      )
    }
  }
  return elements
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const otherPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <div className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-3xl px-6 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Code2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">CodeHire</span>
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
          <Link href="/blog" className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> All posts
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Post header */}
        <div className="mb-10">
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium mb-4 ${post.tagColor}`}>
            {post.tag}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-5 text-balance leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" /> {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {post.readTime}
            </span>
          </div>
        </div>

        {/* Excerpt callout */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 mb-10">
          <p className="text-sm text-muted-foreground leading-relaxed italic">{post.excerpt}</p>
        </div>

        {/* Article content */}
        <article className="space-y-4">
          {renderContent(post.content)}
        </article>

        {/* Divider */}
        <div className="mt-16 pt-10 border-t border-border">
          <h2 className="text-lg font-bold text-foreground mb-6">More from the blog</h2>
          <div className="space-y-3">
            {otherPosts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`}>
                <div className="group flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer">
                  <div>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium mb-1.5 ${p.tagColor}`}>
                      {p.tag}
                    </span>
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">{p.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{p.date} · {p.readTime}</p>
                  </div>
                  <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180 shrink-0 mt-1 group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
