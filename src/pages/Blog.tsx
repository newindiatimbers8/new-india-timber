import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Helmet } from "react-helmet-async";
import { generateBlogListingStructuredData } from "@/services/seo";
import { getStaticBlogSummaries } from "@/services/blog";

const BLOG_BREADCRUMBS = [{ label: "Blog", href: "/blog", icon: "newspaper" }];

const BlogPage = () => {
  const posts = getStaticBlogSummaries();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>Timber & Wood Blog | Expert Tips for Bangalore Builders</title>
        <meta
          name="description"
          content="Expert timber and wood advice for Bangalore builders, architects, and homeowners. Learn about teak wood, plywood selection, and construction tips."
        />
        <meta
          name="keywords"
          content="timber blog bangalore, wood advice bangalore, teak wood tips bangalore, plywood selection guide bangalore, construction timber advice karnataka, wood care tips bangalore, timber maintenance bangalore, wood selection guide bangalore, construction materials blog bangalore, timber industry news bangalore"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "New India Timbers Blog",
            "description": "Expert timber and wood advice for builders and homeowners",
            "publisher": {
              "@type": "Organization",
              "name": "New India Timbers"
            }
          })}
        </script>
      </Helmet>

      <ReadingProgress target="#blog-list" className="top-14" />

      <section className="container mx-auto px-4 py-12">
        <Breadcrumbs items={BLOG_BREADCRUMBS} withHomeLink className="text-xs" />
        <header className="mt-6 max-w-2xl space-y-3">
          <h1 className="text-3xl font-bold text-forest-900 md:text-4xl">
            Bangalore Timber Insights
          </h1>
          <p className="text-sm text-muted-foreground">
            Curated articles helping architects, contractors, and homeowners make informed timber decisions across Karnataka.
          </p>
        </header>

        <div id="blog-list" className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;
