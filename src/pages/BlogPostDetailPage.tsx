/**
 * Blog Post Detail Page
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { BlogPostDetail } from "@/components/blog/BlogPostDetail";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { SocialSharing } from "@/components/blog/SocialSharing";
import { getBlogPostBySlug } from "@/services/blog";
import type { BlogPost } from "@/types/blog";

const BlogPostDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const loadPost = async () => {
      try {
        setIsLoading(true);
        const blogPost = await getBlogPostBySlug(slug, true); // Increment view count
        
        if (blogPost) {
          setPost(blogPost);
        } else {
          setError("Blog post not found");
        }
      } catch (err) {
        console.error("Failed to load blog post:", err);
        setError("Failed to load blog post");
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="space-y-6">
            <div className="h-8 w-64 animate-pulse rounded bg-timber-100" />
            <div className="h-96 animate-pulse rounded-2xl bg-timber-50" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <Helmet>
          <title>Blog Post Not Found | New India Timber</title>
        </Helmet>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-forest-900 mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "The requested blog post could not be found."}</p>
          <a href="/blog" className="text-timber-600 hover:text-timber-700 underline">
            ← Back to Blog
          </a>
        </div>
      </Layout>
    );
  }

  const breadcrumbs = [
    { label: "Blog", href: "/blog", icon: "newspaper" },
    { label: post.title, href: `/blog/${post.slug}` }
  ];

  // Mock related posts for now
  const relatedPosts = [
    {
      id: "related-1",
      title: "Teak Wood Maintenance in Bangalore Climate",
      slug: "teak-maintenance-bangalore",
      summary: "Essential tips for maintaining teak wood furniture during Karnataka's monsoon season.",
      categories: ["timber-tips-bangalore"],
      tags: ["maintenance", "teak", "bangalore"],
      readingTime: 5,
      viewCount: 245,
      status: "published" as const,
      publishedAt: new Date().toISOString(),
      coverImage: null,
      author: undefined
    },
    {
      id: "related-2", 
      title: "Choosing Plywood for Bangalore Homes",
      slug: "plywood-selection-bangalore",
      summary: "Complete guide to selecting the right plywood for Karnataka's humidity and temperature conditions.",
      categories: ["timber-tips-bangalore"],
      tags: ["plywood", "bangalore", "selection"],
      readingTime: 7,
      viewCount: 189,
      status: "published" as const,
      publishedAt: new Date().toISOString(),
      coverImage: null,
      author: undefined
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>{post.seo?.metaTitle || post.title} | New India Timber Blog</title>
        <meta 
          name="description" 
          content={post.seo?.metaDescription || post.summary} 
        />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.summary} />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
        <meta property="og:type" content="article" />
        <meta property="article:author" content={post.author?.name || "New India Timber"} />
        <meta property="article:published_time" content={post.publishedAt || post.createdAt} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Helmet>

      <BlogPostDetail 
        post={post} 
        breadcrumbs={breadcrumbs}
        showReadingProgress={true}
      />

      <section className="container mx-auto px-4 py-12">
        <SocialSharing post={post} className="mb-12" />
        <RelatedPosts posts={relatedPosts} />
      </section>
    </Layout>
  );
};

export default BlogPostDetailPage;
