import { Link } from "react-router-dom";
import type { BlogPostSummary } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface BlogPostCardProps {
  post: BlogPostSummary;
  className?: string;
  showExcerpt?: boolean;
  showCategories?: boolean;
}

export function BlogPostCard({
  post,
  className,
  showExcerpt = true,
  showCategories = true,
}: BlogPostCardProps) {
  const formattedDate = post.publishedAt
    ? format(new Date(post.publishedAt), "PPP")
    : null;

  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden border border-timber-100/60 bg-white shadow-sm transition",
        "hover:-translate-y-1 hover:border-timber-200 hover:shadow-xl",
        className,
      )}
    >
      {post.coverImage ? (
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {post.readingTime && (
            <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-forest-900 shadow-sm">
              {post.readingTime} min read
            </span>
          )}
        </div>
      ) : null}

      <CardContent className="flex grow flex-col px-6 pb-4 pt-6">
        {showCategories && post.categories && post.categories.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="rounded-full bg-timber-50 text-xs font-medium text-timber-700"
              >
                {category.replace(/-/g, " ")}
              </Badge>
            ))}
          </div>
        )}

        <Link to={`/blog/${post.slug}`} className="space-y-3">
          <CardTitle className="text-xl leading-tight text-forest-900 transition group-hover:text-timber-600">
            {post.title}
          </CardTitle>
          {showExcerpt && post.summary && (
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {post.summary}
            </p>
          )}
        </Link>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-timber-100/80 bg-timber-50/40 px-6 py-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          {formattedDate && <time dateTime={post.publishedAt ?? undefined}>{formattedDate}</time>}
          {formattedDate && post.readingTime ? <span aria-hidden="true">•</span> : null}
          {post.readingTime ? <span>{post.readingTime} min read</span> : null}
        </div>
        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 text-forest-900 transition hover:text-timber-600"
        >
          Read more
          <span aria-hidden="true" className="text-timber-400">→</span>
        </Link>
      </CardFooter>
    </Card>
  );
}
