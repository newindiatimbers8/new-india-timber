export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText: string;
  context: string;
  sequence: number;
  dimensions: {
    width: number;
    height: number;
    aspectRatio: string;
  };
  metadata: {
    generatedAt: string;
    prompt: string;
    optimized: boolean;
    seoKeywords: string[];
  };
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  grade: string;
  description: string;
  specifications?: Record<string, any>;
  pricing?: {
    type: 'quote_based' | 'fixed';
    displayText: string;
    ctaButton: {
      text: string;
      action: string;
      style: string;
    };
    internalPricing: {
      basePrice: number | null;
      currency: string;
      unit: string;
      priceRange?: string;
      bulkDiscount?: string;
    };
    isVisible: boolean;
  };
  images: (string | ProductImage)[];
  primaryImage?: string;
  isActive: boolean;
  tags?: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  benefits?: string[];
  applications?: string[];
  serviceAreas?: string[];
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCreateRequest {
  name: string;
  category: string;
  grade: string;
  description: string;
  specifications?: Record<string, any>;
  pricing?: {
    basePrice: number;
    currency: string;
    unit: string;
  };
  images?: string[];
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit: string;
  };
}

export interface ProductUpdateRequest {
  name?: string;
  category?: string;
  grade?: string;
  description?: string;
  specifications?: Record<string, any>;
  pricing?: {
    basePrice: number;
    currency: string;
    unit: string;
  };
  images?: string[];
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  isActive?: boolean;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit: string;
  };
}

export interface ProductFilters {
  category?: string;
  grade?: string;
  isActive?: boolean;
  priceMin?: number;
  priceMax?: number;
  search?: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  filters: {
    categories: string[];
    grades: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };
}