export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  lastUpdated: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  isPublished?: boolean;
  template?: string;
  metadata?: Record<string, any>;
}

export interface PageCreateRequest {
  title: string;
  slug: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  template?: string;
  metadata?: Record<string, any>;
}

export interface PageUpdateRequest {
  title?: string;
  slug?: string;
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  isPublished?: boolean;
  template?: string;
  metadata?: Record<string, any>;
}

export interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'video' | 'quote' | 'code' | 'list';
  content: string;
  metadata?: Record<string, any>;
  order: number;
}

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  blocks: ContentBlock[];
  variables?: Record<string, any>;
}

export interface ContentFilters {
  type?: 'page' | 'post' | 'template';
  status?: 'draft' | 'published' | 'archived';
  search?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ContentListResponse {
  items: (Page | BlogPost)[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Re-export from blog types to avoid circular imports
export type { BlogPost } from './blog';