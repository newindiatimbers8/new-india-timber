import { Link } from "react-router-dom";
import type { BlogPost } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { NavigationIcon } from "@/components/navigation/Icon";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface BlogPostDetailProps {
  post: BlogPost;
  breadcrumbs?: Array<{ label: string; href: string; icon?: string }>;
  showReadingProgress?: boolean;
}

export function BlogPostDetail({
  post,
  breadcrumbs,
  showReadingProgress = true,
}: BlogPostDetailProps) {
  const formattedDate = post.publishedAt
    ? format(new Date(post.publishedAt), "PPP")
    : null;

  const wordCount = post.content?.split(/\s+/).length ?? 0;
  const readingTime = post.readingTime ?? Math.ceil(wordCount / 200);

  return (
    <article className="relative">
      {showReadingProgress && <ReadingProgress target="#blog-content" />}

      <div className="container mx-auto grid gap-12 px-4 py-10 lg:grid-cols-[minmax(0,_2fr)_minmax(280px,_1fr)]">
        <div className="space-y-6">
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <Breadcrumbs items={breadcrumbs} className="text-xs" />
          ) : null}

          <div className="space-y-3">
            <h1 className="text-3xl font-bold leading-tight text-forest-900 md:text-4xl">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {formattedDate && <time dateTime={post.publishedAt ?? undefined}>{formattedDate}</time>}
              <span aria-hidden="true">•</span>
              <span>{readingTime} min read</span>
              {post.viewCount ? (
                <span className="inline-flex items-center gap-1">
                  <NavigationIcon name="bar-chart-3" size={14} />
                  {post.viewCount.toLocaleString()} views
                </span>
              ) : null}
            </div>
          </div>

          {post.coverImage ? (
            <div className="overflow-hidden rounded-3xl border border-timber-100 shadow-lg">
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {post.tags?.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-full border-timber-200 text-xs font-medium"
              >
                #{tag}
              </Badge>
            ))}
          </div>

          <div
            id="blog-content"
            className="prose prose-neutral max-w-none prose-h2:mt-10 prose-h2:text-forest-900 prose-a:text-timber-600"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <Separator className="my-8" />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="font-semibold text-forest-900">Share:</span>
              {[
                { label: "LinkedIn", href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(location.href)}` },
                { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}` },
                { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(location.href)}` },
              ].map((share) => (
                <a
                  key={share.label}
                  href={share.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-timber-200 px-4 py-2 text-xs font-medium text-timber-700 transition hover:border-timber-300 hover:bg-timber-50"
                >
                  {share.label}
                </a>
              ))}
            </div>
            <Link
              to="/blog"
              className="text-sm font-medium text-timber-600 hover:text-timber-700"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>

        <aside className="space-y-6">
          <Card className="rounded-3xl border-timber-100 bg-timber-50/50 p-6 shadow-none">
            <div className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Table of Contents
              </h2>

              {post.tableOfContents && post.tableOfContents.length > 0 ? (
                <nav aria-label="Table of contents">
                  <ul className="space-y-2 text-sm text-forest-900">
                    {post.tableOfContents.map((item) => (
                      <li key={item.id} style={{ marginLeft: `${(item.level - 1) * 8}px` }}>
                        <a
                          href={`#${item.id}`}
                          className="inline-flex items-center gap-2 rounded-md px-2 py-1 transition hover:bg-timber-100/70"
                        >
                          <span className="text-xs text-muted-foreground">{String(item.level).padStart(2, "0")}</span>
                          <span>{item.text}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Headings will automatically appear here once content is structured with H2 and H3 tags.
                </p>
              )}
            </div>
          </Card>

          <Card className="rounded-3xl border-timber-100 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                About New India Timber
              </h2>
              <p className="text-sm text-muted-foreground">
                Serving Bangalore and Karnataka with premium timber solutions for over 25 years.
                Our blog shares practical advice for builders, architects, and homeowners navigating the
                timber market in South India.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-sm font-medium text-timber-600 hover:text-timber-700"
              >
                <NavigationIcon name="phone" size={16} />
                Speak with a timber specialist
              </Link>
            </div>
          </Card>
        </aside>
      </div>
    </article>
  );
}
