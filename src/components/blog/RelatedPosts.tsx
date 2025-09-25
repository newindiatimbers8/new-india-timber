import { Link } from "react-router-dom";
import type { BlogPostSummary } from "@/types/blog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RelatedPostsProps {
  posts: BlogPostSummary[];
  title?: string;
  className?: string;
}

export function RelatedPosts({ posts, title = "Related Articles", className }: RelatedPostsProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className={className} aria-label={title}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-forest-900 md:text-xl">
          {title}
        </h2>
        <Link to="/blog" className="text-xs font-medium text-timber-600 hover:text-timber-700">
          View all →
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="group overflow-hidden border border-timber-100/70 bg-white shadow-none transition hover:-translate-y-1 hover:border-timber-200 hover:shadow-lg"
          >
            <CardContent className="space-y-3 px-5 py-4">
              <Link
                to={`/blog/${post.slug}`}
                className="block space-y-2"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {post.categories?.[0]?.replace(/-/g, " ") ?? "Blog"}
                </p>
                <h3 className="text-base font-semibold text-forest-900 transition group-hover:text-timber-600">
                  {post.title}
                </h3>
                {post.summary && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {post.summary}
                  </p>
                )}
              </Link>
              <div className="flex flex-wrap gap-2">
                {(post.tags ?? []).slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="rounded-full border-timber-200 text-[11px] font-normal"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
