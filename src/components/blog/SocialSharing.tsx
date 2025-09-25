import type { BlogPost } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { NavigationIcon } from "@/components/navigation/Icon";
import { cn } from "@/lib/utils";

interface SocialSharingProps {
  post: Pick<BlogPost, "title" | "slug" | "summary">;
  className?: string;
}

export function SocialSharing({ post, className }: SocialSharingProps) {
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/blog/${post.slug}`
    : `https://newindiatimber.com/blog/${post.slug}`;

  const platforms = [
    {
      name: "WhatsApp",
      icon: "phone" as const,
      href: `https://wa.me/?text=${encodeURIComponent(`${post.title} — ${shareUrl}`)}`,
      accent: "bg-green-50 text-green-700 hover:bg-green-100",
    },
    {
      name: "LinkedIn",
      icon: "briefcase" as const,
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}&summary=${encodeURIComponent(post.summary || "")}"`,
      accent: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    },
    {
      name: "Facebook",
      icon: "info" as const,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      accent: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    },
  ];

  return (
    <section className={cn("space-y-3", className)} aria-label="Share this article">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Share insights with Bangalore builders
      </h2>
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => (
          <Button
            key={platform.name}
            variant="outline"
            asChild
            className={cn(
              "rounded-full border border-transparent px-4 py-2 text-xs font-semibold transition",
              platform.accent,
            )}
          >
            <a href={platform.href} target="_blank" rel="noopener noreferrer">
              <NavigationIcon name={platform.icon} className="mr-2" size={14} />
              {platform.name}
            </a>
          </Button>
        ))}
      </div>
    </section>
  );
}
