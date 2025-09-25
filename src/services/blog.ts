/**
 * Enhanced Blog Service (2025 Best Practices)
 * Handles blog posts, categories, analytics, and AI integration
 */

import {
  BlogPost,
  BlogCategory,
  BlogPostCreateRequest,
  BlogPostUpdateRequest,
  BlogCategoryCreateRequest,
  BlogSearchFilters,
  TableOfContentsItem,
  calculateReadingTime,
  generateTableOfContents,
  validateBlogPost,
  validateCreateBlogPostRequest,
  getDefaultBlogPostSEO,
  BlogSearchResult,
  BlogPostSummary,
  BlogAnalytics
} from '@/types/blog';
import { loadCollection, saveCollection } from '@/utils/dataLoader';

const POSTS_COLLECTION = 'blog-posts';
const CATEGORIES_COLLECTION = 'blog-categories';

// In-memory cache for better performance
let postsCache: BlogPost[] | null = null;
let categoriesCache: BlogCategory[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get blog posts with advanced filtering and pagination
 */
export async function getBlogPosts(filters: BlogSearchFilters = {}): Promise<BlogSearchResult> {
  try {
    const posts = await loadBlogPosts();
    let filteredPosts = posts;

    // Apply filters
    if (filters.status) {
      filteredPosts = filteredPosts.filter(post => post.status === filters.status);
    }

    if (filters.category) {
      filteredPosts = filteredPosts.filter(post =>
        post.categoryIds?.includes(filters.category!)
      );
    }

    if (filters.tag) {
      filteredPosts = filteredPosts.filter(post =>
        post.tags.includes(filters.tag!)
      );
    }

    if (filters.author) {
      filteredPosts = filteredPosts.filter(post => post.authorId === filters.author);
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filteredPosts = filteredPosts.filter(post =>
        new Date(post.publishedAt || post.createdAt) >= fromDate
      );
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      filteredPosts = filteredPosts.filter(post =>
        new Date(post.publishedAt || post.createdAt) <= toDate
      );
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.summary.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Sort by published date (newest first)
    filteredPosts.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt);
      const dateB = new Date(b.publishedAt || b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

    // Convert to summaries
    const summaries: BlogPostSummary[] = filteredPosts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      coverImage: post.coverImage,
      author: post.author,
      categories: post.categoryIds || [],
      publishedAt: post.publishedAt,
      readingTime: post.readingTime,
      viewCount: post.viewCount,
      status: post.status
    }));

    // Pagination
    const page = 1; // Simplified pagination
    const limit = 10;
    const startIndex = 0;
    const endIndex = Math.min(limit, summaries.length);
    const paginatedSummaries = summaries.slice(startIndex, endIndex);

    // Generate facets
    const facets = generateSearchFacets(filteredPosts);

    return {
      posts: paginatedSummaries,
      pagination: {
        page,
        limit,
        total: summaries.length,
        pages: Math.ceil(summaries.length / limit),
        hasNext: endIndex < summaries.length,
        hasPrev: false
      },
      facets,
      totalResults: summaries.length,
      searchTime: Date.now() // Simplified
    };

  } catch (error) {
    console.error('Error getting blog posts:', error);
    return {
      posts: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
        hasNext: false,
        hasPrev: false
      },
      facets: {
        categories: [],
        tags: [],
        authors: []
      },
      totalResults: 0,
      searchTime: Date.now()
    };
  }
}

/**
 * Get single blog post by ID with analytics tracking
 */
export async function getBlogPostById(id: string, incrementView = false): Promise<BlogPost | null> {
  try {
    const posts = await loadBlogPosts();
    const post = posts.find(p => p.id === id);

    if (!post) return null;

    // Increment view count if requested
    if (incrementView) {
      await incrementPostViewCount(id);
    }

    return post;

  } catch (error) {
    console.error('Error getting blog post by ID:', error);
    return null;
  }
}

/**
 * Get blog post by slug
 */
export async function getBlogPostBySlug(slug: string, incrementView = false): Promise<BlogPost | null> {
  try {
    const posts = await loadBlogPosts();
    const post = posts.find(p => p.slug === slug);

    if (!post) return null;

    if (incrementView) {
      await incrementPostViewCount(post.id);
    }

    return post;

  } catch (error) {
    console.error('Error getting blog post by slug:', error);
    return null;
  }
}

/**
 * Create new blog post
 */
export async function createBlogPost(request: CreateBlogPostRequest, userId: string): Promise<BlogPost> {
  try {
    // Validate request
    const errors = validateCreateBlogPostRequest(request);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    // Generate slug if not provided
    const slug = request.slug || generateSlug(request.title);

    // Check for unique slug
    const existingPosts = await loadBlogPosts();
    const slugExists = existingPosts.some(post => post.slug === slug);
    if (slugExists) {
      throw new Error(`Blog post with slug "${slug}" already exists`);
    }

    // Calculate reading time
    const readingTime = calculateReadingTime(request.content);

    // Generate table of contents
    const tableOfContents = generateTableOfContents(request.content);

    // Set default SEO if not provided
    const seo = getDefaultBlogPostSEO();

    // Create post
    const now = new Date().toISOString();
    const newPost: BlogPost = {
      id: generatePostId(),
      title: request.title,
      slug,
      summary: request.summary,
      content: request.content,
      coverImage: request.coverImage || null,
      authorId: userId,
      categoryIds: request.categoryIds || [],
      tags: request.tags || [],
      status: request.status || 'draft',
      publishedAt: request.status === 'published' ? now : null,
      scheduledFor: request.scheduledFor || null,
      readingTime,
      viewCount: 0,
      socialShares: {
        facebook: 0,
        twitter: 0,
        linkedin: 0,
        whatsapp: 0
      },
      relatedPosts: [],
      tableOfContents,
      seo,
      performance: {
        imageOptimized: false,
        criticalCSSInlined: false,
        lazyLoadEnabled: true
      },
      aiGenerated: request.aiGenerated || false,
      aiPrompt: request.aiPrompt || undefined,
      humanEdited: false,
      createdAt: now,
      updatedAt: now
    };

    // Save to storage
    const updatedPosts = [...existingPosts, newPost];
    await saveCollection(POSTS_COLLECTION, updatedPosts);

    // Invalidate cache
    postsCache = null;

    return newPost;

  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
}

/**
 * Update blog post
 */
export async function updateBlogPost(id: string, updates: UpdateBlogPostRequest): Promise<BlogPost | null> {
  try {
    const posts = await loadBlogPosts();
    const postIndex = posts.findIndex(post => post.id === id);

    if (postIndex === -1) return null;

    const existingPost = posts[postIndex];

    // Validate updates
    const updatedPost = { ...existingPost, ...updates };
    const errors = validateBlogPost(updatedPost);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    // Handle slug uniqueness
    if (updates.slug && updates.slug !== existingPost.slug) {
      const slugExists = posts.some(post => post.id !== id && post.slug === updates.slug);
      if (slugExists) {
        throw new Error(`Blog post with slug "${updates.slug}" already exists`);
      }
    }

    // Update reading time if content changed
    if (updates.content) {
      updatedPost.readingTime = calculateReadingTime(updates.content);
      updatedPost.tableOfContents = generateTableOfContents(updates.content);
    }

    // Update timestamp
    updatedPost.updatedAt = new Date().toISOString();

    // Handle status changes
    if (updates.status === 'published' && existingPost.status !== 'published') {
      updatedPost.publishedAt = new Date().toISOString();
    }

    posts[postIndex] = updatedPost;
    await saveCollection(POSTS_COLLECTION, posts);

    // Invalidate cache
    postsCache = null;

    return updatedPost;

  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
}

/**
 * Delete blog post (soft delete - mark as unpublished)
 */
export async function deleteBlogPost(id: string): Promise<boolean> {
  try {
    const posts = await loadBlogPosts();
    const postIndex = posts.findIndex(post => post.id === id);

    if (postIndex === -1) return false;

    const post = posts[postIndex];
    const updatedPost: BlogPost = {
      ...post,
      status: 'unpublished',
      updatedAt: new Date().toISOString()
    };

    posts[postIndex] = updatedPost;
    await saveCollection(POSTS_COLLECTION, posts);

    // Invalidate cache
    postsCache = null;

    return true;

  } catch (error) {
    console.error('Error deleting blog post:', error);
    return false;
  }
}

/**
 * Publish blog post
 */
export async function publishBlogPost(id: string, scheduledFor?: string): Promise<BlogPost | null> {
  try {
    const now = new Date().toISOString();
    const updates: Partial<BlogPost> = {
      status: scheduledFor ? 'scheduled' : 'published',
      publishedAt: scheduledFor ? null : now,
      scheduledFor: scheduledFor || null,
      updatedAt: now
    };

    return await updateBlogPost(id, updates);

  } catch (error) {
    console.error('Error publishing blog post:', error);
    return null;
  }
}

/**
 * Unpublish blog post
 */
export async function unpublishBlogPost(id: string): Promise<BlogPost | null> {
  try {
    const updates: Partial<BlogPost> = {
      status: 'unpublished',
      publishedAt: null,
      scheduledFor: null,
      updatedAt: new Date().toISOString()
    };

    return await updateBlogPost(id, updates);

  } catch (error) {
    console.error('Error unpublishing blog post:', error);
    return null;
  }
}

/**
 * Get blog categories
 */
export async function getBlogCategories(includeEmpty = false): Promise<BlogCategory[]> {
  try {
    const categories = await loadBlogCategories();
    let filteredCategories = categories;

    if (!includeEmpty) {
      // Get post counts
      const posts = await loadBlogPosts();
      const categoryCounts: Record<string, number> = {};

      posts.forEach(post => {
        if (post.categoryIds && Array.isArray(post.categoryIds)) {
          post.categoryIds.forEach(categoryId => {
            categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
          });
        }
      });

      filteredCategories = categories.filter(category =>
        categoryCounts[category.slug] > 0
      );
    }

    // Sort by post count and then by order
    return filteredCategories.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return b.postCount - a.postCount;
    });

  } catch (error) {
    console.error('Error getting blog categories:', error);
    return [];
  }
}

/**
 * Create new blog category
 */
export async function createBlogCategory(request: CreateBlogCategoryRequest): Promise<BlogCategory> {
  try {
    // Validate required fields
    if (!request.name) {
      throw new Error('Name is required');
    }

    // Generate slug if not provided
    const slug = request.slug || generateSlug(request.name);

    // Check for unique slug
    const existingCategories = await loadBlogCategories();
    const slugExists = existingCategories.some(category => category.slug === slug);
    if (slugExists) {
      throw new Error('Category with this slug already exists');
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      throw new Error('Slug must contain only lowercase letters, numbers, and hyphens');
    }

    const now = new Date().toISOString();
    const newCategory: BlogCategory = {
      id: generateCategoryId(),
      name: request.name,
      slug,
      description: request.description || '',
      color: request.color || '#3b82f6',
      postCount: 0,
      order: request.order || 0,
      createdAt: now,
      updatedAt: now
    };

    const updatedCategories = [...existingCategories, newCategory];
    await saveCollection(CATEGORIES_COLLECTION, updatedCategories);

    // Invalidate cache
    categoriesCache = null;

    return newCategory;

  } catch (error) {
    console.error('Error creating blog category:', error);
    throw error;
  }
}

/**
 * Update blog category
 */
export async function updateBlogCategory(id: string, updates: Partial<BlogCategory>): Promise<BlogCategory | null> {
  try {
    const categories = await loadBlogCategories();
    const categoryIndex = categories.findIndex(category => category.id === id);

    if (categoryIndex === -1) return null;

    const existingCategory = categories[categoryIndex];

    // Handle slug uniqueness
    if (updates.slug && updates.slug !== existingCategory.slug) {
      const slugExists = categories.some(category => category.id !== id && category.slug === updates.slug);
      if (slugExists) {
        throw new Error('Category with this slug already exists');
      }
    }

    const updatedCategory: BlogCategory = {
      ...existingCategory,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    categories[categoryIndex] = updatedCategory;
    await saveCollection(CATEGORIES_COLLECTION, categories);

    // Invalidate cache
    categoriesCache = null;

    return updatedCategory;

  } catch (error) {
    console.error('Error updating blog category:', error);
    throw error;
  }
}

/**
 * Delete blog category
 */
export async function deleteBlogCategory(id: string): Promise<boolean> {
  try {
    const categories = await loadBlogCategories();
    const categoryIndex = categories.findIndex(category => category.id === id);

    if (categoryIndex === -1) return false;

    const category = categories[categoryIndex];

    // Check if category has posts
    const posts = await loadBlogPosts();
    const hasPosts = posts.some(post => post.categoryIds?.includes(category.id));
    if (hasPosts) {
      throw new Error('Cannot delete category with existing posts');
    }

    categories.splice(categoryIndex, 1);
    await saveCollection(CATEGORIES_COLLECTION, categories);

    // Invalidate cache
    categoriesCache = null;

    return true;

  } catch (error) {
    console.error('Error deleting blog category:', error);
    throw error;
  }
}

/**
 * Get posts by category slug
 */
export async function getBlogPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  try {
    // First, find the category by slug to get its ID
    const categories = await loadBlogCategories();
    const category = categories.find(cat => cat.slug === categorySlug);
    
    if (!category) {
      return [];
    }
    
    const posts = await loadBlogPosts();
    return posts.filter(post => 
      post.categoryIds?.includes(category.id) && post.status === 'published'
    );
  } catch (error) {
    console.error('Error getting posts by category:', error);
    return [];
  }
}

/**
 * Get blog analytics
 */
export async function getBlogAnalytics(postId: string, period: '24h' | '7d' | '30d' | '90d' | '1y' = '30d'): Promise<BlogAnalytics | null> {
  try {
    const post = await getBlogPostById(postId);
    if (!post) return null;

    // Calculate date range
    const now = new Date();
    const periodMs = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000
    };

    const startDate = new Date(now.getTime() - periodMs[period]);

    // Generate mock analytics data (in production, this would come from analytics service)
    const days = Math.ceil((now.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
    const timeline = Array.from({ length: days }, (_, i) => {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      return {
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 100) + 10
      };
    });

    const totalViews = timeline.reduce((sum, day) => sum + day.views, 0);
    const uniqueViews = Math.floor(totalViews * 0.7); // Estimate unique views

    return {
      postId,
      period,
      views: {
        total: totalViews,
        unique: uniqueViews,
        timeline
      },
      socialShares: { ...post.socialShares },
      readingStats: {
        averageTimeOnPage: Math.floor(Math.random() * 300) + 120, // 2-7 minutes
        bounceRate: Math.floor(Math.random() * 40) + 30, // 30-70%
        completionRate: Math.floor(Math.random() * 30) + 20 // 20-50%
      },
      topReferrers: [
        { source: 'google.com', visits: Math.floor(Math.random() * 50) + 20 },
        { source: 'facebook.com', visits: Math.floor(Math.random() * 30) + 10 },
        { source: 'direct', visits: Math.floor(Math.random() * 40) + 15 }
      ],
      queryTime: 150 // milliseconds
    };

  } catch (error) {
    console.error('Error getting blog analytics:', error);
    return null;
  }
}

/**
 * Get static blog summaries for demo/fallback
 */
export function getStaticBlogSummaries(): BlogPostSummary[] {
  return [
    {
      id: "teak-maintenance-bangalore",
      title: "Teak Wood Maintenance in Bangalore Climate",
      slug: "teak-maintenance-bangalore",
      summary: "Essential tips for maintaining teak wood furniture during Karnataka's monsoon season and high humidity.",
      coverImage: null,
      categories: ["timber-tips-bangalore"],
      publishedAt: new Date().toISOString(),
      readingTime: 5,
      viewCount: 245,
      status: "published"
    },
    {
      id: "plywood-selection-bangalore",
      title: "Choosing the Right Plywood for Bangalore Homes",
      slug: "plywood-selection-bangalore", 
      summary: "Complete guide to selecting plywood that performs well in Karnataka's climate conditions.",
      coverImage: null,
      categories: ["timber-tips-bangalore"],
      publishedAt: new Date().toISOString(),
      readingTime: 7,
      viewCount: 189,
      status: "published"
    },
    {
      id: "sustainable-timber-sourcing",
      title: "Sustainable Timber Sourcing in South India",
      slug: "sustainable-timber-sourcing",
      summary: "How New India Timber ensures responsible sourcing practices across Karnataka and neighboring states.",
      coverImage: null,
      categories: ["sustainability"],
      publishedAt: new Date().toISOString(),
      readingTime: 6,
      viewCount: 156,
      status: "published"
    }
  ];
}

// Private helper functions

async function loadBlogPosts(): Promise<BlogPost[]> {
  const now = Date.now();
  if (postsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return postsCache;
  }

  const posts = await loadCollection<BlogPost>(POSTS_COLLECTION);
  postsCache = posts;
  cacheTimestamp = now;

  return posts;
}

async function loadBlogCategories(): Promise<BlogCategory[]> {
  const now = Date.now();
  if (categoriesCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return categoriesCache;
  }

  const categories = await loadCollection<BlogCategory>(CATEGORIES_COLLECTION);
  categoriesCache = categories;
  cacheTimestamp = now;

  return categories;
}

function generatePostId(): string {
  return `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateCategoryId(): string {
  return `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateSlug(title: string): string {
    return title
      .toLowerCase()
    .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .slice(0, 100); // Limit length
}

async function incrementPostViewCount(postId: string): Promise<void> {
  try {
    const posts = await loadBlogPosts();
    const postIndex = posts.findIndex(post => post.id === postId);

    if (postIndex >= 0) {
      posts[postIndex] = {
        ...posts[postIndex],
        viewCount: posts[postIndex].viewCount + 1,
        updatedAt: new Date().toISOString()
      };

      await saveCollection(POSTS_COLLECTION, posts);
      postsCache = posts; // Update cache
    }
  } catch (error) {
    console.error('Error incrementing view count:', error);
    // Don't throw - view counting failures shouldn't break the app
  }
}

function generateSearchFacets(posts: BlogPost[]): BlogSearchResult['facets'] {
  const categories: Record<string, number> = {};
  const tags: Record<string, number> = {};
  const authors: Record<string, number> = {};

  posts.forEach(post => {
    // Categories
    post.categoryIds?.forEach(category => {
      categories[category] = (categories[category] || 0) + 1;
    });

    // Tags
    post.tags.forEach(tag => {
      tags[tag] = (tags[tag] || 0) + 1;
    });

    // Authors
    authors[post.authorId] = (authors[post.authorId] || 0) + 1;
  });

  return {
    categories: Object.entries(categories).map(([slug, count]) => ({
      slug,
      name: slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' '),
      count
    })),
    tags: Object.entries(tags).map(([name, count]) => ({ name, count })),
    authors: Object.entries(authors).map(([id, count]) => ({ id, name: `Author ${id}`, count }))
  };
}