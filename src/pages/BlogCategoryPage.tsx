/**
 * Blog Category Page
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { getBlogPosts, getBlogCategories } from "@/services/blog";
import type { BlogPostSummary, BlogCategory } from "@/types/blog";

const BlogCategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryInfo, setCategoryInfo] = useState<BlogCategory | null>(null);

  const categoryDisplayName = categoryInfo?.name || category?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Category';

  useEffect(() => {
    if (!category) return;

    const loadCategoryPosts = async () => {
      try {
        setIsLoading(true);
        
        // First, get all categories to find the one with matching slug
        const categories = await getBlogCategories();
        const foundCategory = categories.find(cat => cat.slug === category);
        
        if (!foundCategory) {
          setError("Category not found");
          return;
        }
        
        setCategoryInfo(foundCategory);
        
        // Now get posts for this category using the category ID
        const result = await getBlogPosts({ category: foundCategory.id, status: 'published' });
        setPosts(result.posts);
      } catch (err) {
        console.error("Failed to load category posts:", err);
        setError("Failed to load blog posts");
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryPosts();
  }, [category]);

  const breadcrumbs = [
    { label: "Blog", href: "/blog", icon: "newspaper" },
    { label: categoryDisplayName, href: `/blog/category/${category}` }
  ];

  return (
    <Layout>
      <Helmet>
        <title>{categoryDisplayName} | Bangalore Timber Blog | New India Timber</title>
        <meta
          name="description"
          content={`Read expert articles about ${categoryDisplayName.toLowerCase()} for Bangalore and Karnataka timber projects. Professional insights and practical guides.`}
        />
      </Helmet>

      <section className="container mx-auto px-4 py-12">
        <Breadcrumbs items={breadcrumbs} withHomeLink className="text-xs mb-6" />
        
        <header className="max-w-2xl space-y-3 mb-10">
          <h1 className="text-3xl font-bold text-forest-900 md:text-4xl">
            {categoryDisplayName}
          </h1>
          <p className="text-muted-foreground">
            Expert insights and practical guides for {categoryDisplayName.toLowerCase()} in Bangalore and Karnataka.
          </p>
        </header>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-96 animate-pulse rounded-2xl bg-timber-50" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-forest-900 mb-4">Unable to Load Posts</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <a href="/blog" className="text-timber-600 hover:text-timber-700 underline">
              ← Back to Blog
            </a>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-forest-900 mb-4">No Posts Found</h2>
            <p className="text-muted-foreground mb-6">
              No blog posts found in the {categoryDisplayName.toLowerCase()} category yet.
            </p>
            <a href="/blog" className="text-timber-600 hover:text-timber-700 underline">
              ← Browse All Posts
            </a>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default BlogCategoryPage;
