export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  authorId: string;
  categoryIds?: string[];
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt: string | null;
  updatedAt: string;
  coverImage?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  readingTime?: number;
  tableOfContents?: TableOfContentsItem[];
  scheduledFor?: string | null;
  viewCount?: number;
  socialShares?: {
    facebook: number;
    twitter: number;
    linkedin: number;
    whatsapp: number;
  };
  relatedPosts?: string[];
  seo?: any;
  performance?: {
    imageOptimized: boolean;
    criticalCSSInlined: boolean;
  };
  author?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  color?: string;
  postCount?: number;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TableOfContentsItem {
  level: number;
  text: string;
  id: string;
}

export interface BlogPostCreateRequest {
  title: string;
  content: string;
  summary: string;
  categoryIds?: string[];
  tags?: string[];
  coverImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  status?: 'draft' | 'published';
}

export interface BlogPostUpdateRequest {
  title?: string;
  content?: string;
  summary?: string;
  categoryIds?: string[];
  tags?: string[];
  coverImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  status?: 'draft' | 'published' | 'archived';
}

export interface BlogCategoryCreateRequest {
  name: string;
  slug?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  color?: string;
}

export interface BlogSearchResult {
  posts: BlogPostSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  facets: {
    categories: Array<{ slug: string; name: string; count: number }>;
    tags: Array<{ name: string; count: number }>;
    authors: Array<{ id: string; name: string; count: number }>;
  };
  totalResults: number;
  searchTime: number;
}

export interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverImage?: string;
  author?: string;
  categories: string[];
  publishedAt?: string;
  readingTime: number;
  viewCount: number;
  status: string;
}

export interface BlogAnalytics {
  postId: string;
  period: string;
  views: {
    total: number;
    unique: number;
    timeline: Array<{ date: string; views: number }>;
  };
  socialShares: {
    facebook: number;
    twitter: number;
    linkedin: number;
    whatsapp: number;
  };
  readingStats: {
    averageTimeOnPage: number;
    bounceRate: number;
    completionRate: number;
  };
  topReferrers: Array<{ source: string; visits: number }>;
  queryTime: number;
}

export interface BlogPostListResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Utility functions for blog validation and SEO
export function validateBlogPost(post: Partial<BlogPost>): string[] {
  const errors: string[] = [];
  
  if (!post.title || post.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (!post.slug || post.slug.trim().length === 0) {
    errors.push('Slug is required');
  }
  
  if (!post.content || post.content.trim().length === 0) {
    errors.push('Content is required');
  }
  
  if (!post.categoryIds || post.categoryIds.length === 0) {
    errors.push('Category is required');
  }
  
  if (post.title && post.title.length > 100) {
    errors.push('Title must be less than 100 characters');
  }
  
  if (post.metaDescription && post.metaDescription.length > 160) {
    errors.push('Meta description must be less than 160 characters');
  }
  
  return errors;
}

export function validateCreateBlogPostRequest(request: CreateBlogPostRequest): string[] {
  const errors: string[] = [];
  
  if (!request.title || request.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (!request.content || request.content.trim().length === 0) {
    errors.push('Content is required');
  }
  
  if (!request.categoryIds || request.categoryIds.length === 0) {
    errors.push('Category is required');
  }
  
  if (request.title && request.title.length > 100) {
    errors.push('Title must be less than 100 characters');
  }
  
  if (request.seoDescription && request.seoDescription.length > 160) {
    errors.push('SEO description must be less than 160 characters');
  }
  
  return errors;
}

export function getDefaultBlogPostSEO(): Partial<BlogPost> {
  return {
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    canonicalUrl: '',
    openGraph: {
      title: '',
      description: '',
      image: '',
      type: 'article',
      siteName: 'New India Timber'
    },
    twitterCard: {
      card: 'summary_large_image',
      title: '',
      description: '',
      image: ''
    },
    robots: 'index, follow',
    noindex: false,
    nofollow: false
  };
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function generateTableOfContents(content: string): Array<{id: string, title: string, level: number}> {
  const headings: Array<{id: string, title: string, level: number}> = [];
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    headings.push({ id, title, level });
  }
  
  return headings;
}