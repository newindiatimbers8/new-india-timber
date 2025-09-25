/**
 * Zod Validation Schemas for all entities
 * Provides runtime type validation and form validation
 */

import { z } from 'zod';

// Auth Schemas
export const UserRoleSchema = z.enum(['visitor', 'editor', 'admin']);
export const UserStatusSchema = z.enum(['active', 'inactive', 'suspended']);

export const UserAccountSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  email: z.string().email('Invalid email format'),
  passwordHash: z.string().min(1, 'Password hash is required'),
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  role: UserRoleSchema,
  status: UserStatusSchema,
  createdAt: z.string().datetime('Invalid creation date'),
  updatedAt: z.string().datetime('Invalid update date'),
  lastLoginAt: z.string().datetime().nullable(),
});

export const AdminProfileSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  displayName: z.string().min(1, 'Display name is required').max(255, 'Display name too long'),
  avatar: z.string().url('Invalid avatar URL').nullable(),
  bio: z.string().max(1000, 'Bio too long'),
  permissions: z.array(z.string()),
  createdAt: z.string().datetime('Invalid creation date'),
  updatedAt: z.string().datetime('Invalid update date'),
});

export const LoginRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Blog Schemas
export const BlogPostStatusSchema = z.enum(['draft', 'published', 'scheduled', 'unpublished']);

export const BlogPostSEOSchema = z.object({
  metaTitle: z.string().min(1, 'Meta title is required').max(60, 'Meta title too long'),
  metaDescription: z.string().min(1, 'Meta description is required').max(160, 'Meta description too long'),
  keywords: z.array(z.string()),
  canonicalUrl: z.string().url('Invalid canonical URL').nullable(),
  openGraphImage: z.string().url('Invalid OG image URL').nullable(),
});

export const BlogPostSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  summary: z.string().min(1, 'Summary is required').max(300, 'Summary too long'),
  content: z.string().min(1, 'Content is required'),
  coverImage: z.string().url('Invalid cover image URL').nullable(),
  authorId: z.string().min(1, 'Author ID is required'),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  status: BlogPostStatusSchema,
  publishedAt: z.string().datetime().nullable(),
  scheduledFor: z.string().datetime().nullable(),
  createdAt: z.string().datetime('Invalid creation date'),
  updatedAt: z.string().datetime('Invalid update date'),
  seo: BlogPostSEOSchema,
});

export const BlogCategorySchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().max(500, 'Description too long'),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid hex color'),
  postCount: z.number().int().min(0, 'Post count must be non-negative'),
  createdAt: z.string().datetime('Invalid creation date'),
  updatedAt: z.string().datetime('Invalid update date'),
});

export const BlogPostInputSchema = BlogPostSchema.pick({
  title: true,
  slug: true,
  summary: true,
  content: true,
  coverImage: true,
  categories: true,
  tags: true,
  status: true,
  publishedAt: true,
  scheduledFor: true,
  seo: true,
}).partial({
  slug: true,
  summary: true,
  coverImage: true,
  categories: true,
  tags: true,
  status: true,
  publishedAt: true,
  scheduledFor: true,
  seo: true,
});

// Product Schemas
export const ProductGradeSchema = z.enum(['premium', 'commercial', 'utility']);
export const ProductStatusSchema = z.enum(['active', 'inactive', 'out-of-stock']);
export const PriceRangeSchema = z.enum(['economy', 'commercial', 'luxury']);
export const MarketTrendSchema = z.enum(['stable', 'increasing', 'decreasing']);

export const ProductOverviewSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  keyBenefits: z.array(z.string()),
  premiumPositioning: z.string(),
  tagline: z.string().max(200, 'Tagline too long'),
  bangaloreContext: z.string().min(1, 'Bangalore context is required'),
});

export const ProductSpecificationsSchema = z.object({
  density: z.number().positive('Density must be positive'),
  hardness: z.number().positive('Hardness must be positive'),
  moistureContent: z.number().min(0, 'Moisture content must be non-negative').max(100, 'Invalid moisture content'),
  grainPattern: z.string().min(1, 'Grain pattern is required'),
  durability: z.string().min(1, 'Durability is required'),
  workability: z.string().min(1, 'Workability is required'),
  finishQuality: z.string().min(1, 'Finish quality is required'),
  dimensionalStability: z.string().min(1, 'Dimensional stability is required'),
});

export const ProductPricingSchema = z.object({
  pricePerSqFt: z.number().positive('Price must be positive'),
  priceRange: PriceRangeSchema,
  marketTrend: MarketTrendSchema,
  bulkDiscounts: z.boolean(),
});

export const ProductImageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  altText: z.string().min(1, 'Alt text is required'),
  caption: z.string().nullable(),
  isPrimary: z.boolean(),
});

export const ProductSEOSchema = z.object({
  metaTitle: z.string().min(1, 'Meta title is required').max(60, 'Meta title too long'),
  metaDescription: z.string().min(1, 'Meta description is required').max(160, 'Meta description too long'),
  keywords: z.array(z.string()),
});

export const ProductSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  scientificName: z.string().max(255, 'Scientific name too long').nullable(),
  category: z.string().min(1, 'Category is required'),
  grade: ProductGradeSchema,
  overview: ProductOverviewSchema,
  specifications: ProductSpecificationsSchema,
  pricing: ProductPricingSchema,
  images: z.array(ProductImageSchema),
  seo: ProductSEOSchema,
  status: ProductStatusSchema,
  createdAt: z.string().datetime('Invalid creation date'),
  updatedAt: z.string().datetime('Invalid update date'),
});

// Order Schemas
export const OrderPurposeSchema = z.enum(['residential', 'commercial', 'industrial']);
export const OrderStatusSchema = z.enum(['pending', 'confirmed', 'in-progress', 'completed', 'cancelled']);

export const CustomerInfoSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number too long'),
  address: z.string().max(500, 'Address too long').nullable(),
});

export const OrderDetailsSchema = z.object({
  purpose: OrderPurposeSchema,
  frames: z.number().int().positive('Number of frames must be positive'),
  deliveryRequired: z.boolean(),
  customization: z.string().max(1000, 'Customization details too long'),
});

export const OrderSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  orderNumber: z.string().min(1, 'Order number is required'),
  userId: z.string().nullable(),
  customerInfo: CustomerInfoSchema,
  orderDetails: OrderDetailsSchema,
  status: OrderStatusSchema,
  estimatedValue: z.number().positive('Estimated value must be positive').nullable(),
  notes: z.string().max(2000, 'Notes too long'),
  createdAt: z.string().datetime('Invalid creation date'),
  updatedAt: z.string().datetime('Invalid update date'),
});

// Content Schemas
export const PageTypeSchema = z.enum(['legal', 'info', 'landing']);

export const OpenGraphDataSchema = z.object({
  title: z.string().min(1, 'OG title is required'),
  description: z.string().min(1, 'OG description is required'),
  image: z.string().url('Invalid OG image URL').nullable(),
  type: z.string(),
  siteName: z.string(),
});

export const PageSEOSchema = z.object({
  metaTitle: z.string().min(1, 'Meta title is required').max(60, 'Meta title too long'),
  metaDescription: z.string().min(1, 'Meta description is required').max(160, 'Meta description too long'),
  keywords: z.array(z.string()),
  canonicalUrl: z.string().url('Invalid canonical URL').nullable(),
});

export const PageSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  content: z.string().min(1, 'Content is required'),
  type: PageTypeSchema,
  template: z.string(),
  seo: PageSEOSchema,
  published: z.boolean(),
  createdAt: z.string().datetime('Invalid creation date'),
  updatedAt: z.string().datetime('Invalid update date'),
});

export const SEOSettingSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  page: z.string().min(1, 'Page identifier is required'),
  metaTitle: z.string().min(1, 'Meta title is required').max(60, 'Meta title too long'),
  metaDescription: z.string().min(1, 'Meta description is required').max(160, 'Meta description too long'),
  keywords: z.array(z.string()),
  canonicalUrl: z.string().url('Invalid canonical URL').nullable(),
  structuredData: z.record(z.unknown()).nullable(),
  openGraph: OpenGraphDataSchema,
  createdAt: z.string().datetime('Invalid creation date'),
  updatedAt: z.string().datetime('Invalid update date'),
});

// Media Schemas
export const MediaTypeSchema = z.enum(['image', 'video', 'document', 'other']);
export const OptimizationStatusSchema = z.enum(['pending', 'processing', 'optimized', 'failed']);

export const MediaMetadataSchema = z.object({
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  format: z.string().optional(),
  quality: z.number().min(1).max(100).optional(),
  checksum: z.string().optional(),
  lastModified: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  usageCount: z.number().int().min(0).optional(),
  lastUsed: z.string().datetime().optional(),
});

export const MediaAssetSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  filename: z.string().min(1, 'Filename is required'),
  originalFilename: z.string().min(1, 'Original filename is required'),
  path: z.string().min(1, 'Path is required'),
  url: z.string().url('Invalid URL'),
  publicUrl: z.string().url('Invalid public URL'),
  mimeType: z.string().min(1, 'MIME type is required'),
  size: z.number().int().positive('Size must be positive'),
  type: MediaTypeSchema,
  altText: z.string().min(1, 'Alt text is required'),
  caption: z.string().nullable(),
  usage: z.array(z.string()),
  optimized: z.boolean(),
  optimizationStatus: OptimizationStatusSchema,
  metadata: MediaMetadataSchema,
  createdAt: z.string().datetime('Invalid creation date'),
  updatedAt: z.string().datetime('Invalid update date'),
});

// Form validation schemas (for frontend forms)
export const ContactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number too long'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
  message: z.string().min(1, 'Message is required').max(2000, 'Message too long'),
});

export const BulkOrderFormSchema = z.object({
  purpose: OrderPurposeSchema,
  frames: z.number().int().positive('Number of frames must be positive'),
  deliveryRequired: z.boolean(),
  address: z.string().max(500, 'Address too long').optional(),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number too long'),
  customization: z.string().max(1000, 'Customization details too long').optional(),
});

// Export all schemas as a collection for easy access
export const ValidationSchemas = {
  // Auth
  UserAccount: UserAccountSchema,
  AdminProfile: AdminProfileSchema,
  LoginRequest: LoginRequestSchema,
  
  // Blog
  BlogPost: BlogPostSchema,
  BlogCategory: BlogCategorySchema,
  BlogPostInput: BlogPostInputSchema,
  BlogPostSEO: BlogPostSEOSchema,
  
  // Product
  Product: ProductSchema,
  ProductOverview: ProductOverviewSchema,
  ProductSpecifications: ProductSpecificationsSchema,
  ProductPricing: ProductPricingSchema,
  ProductImage: ProductImageSchema,
  ProductSEO: ProductSEOSchema,
  
  // Order
  Order: OrderSchema,
  CustomerInfo: CustomerInfoSchema,
  OrderDetails: OrderDetailsSchema,
  
  // Content
  Page: PageSchema,
  PageSEO: PageSEOSchema,
  SEOSetting: SEOSettingSchema,
  OpenGraphData: OpenGraphDataSchema,
  
  // Media
  MediaAsset: MediaAssetSchema,
  MediaMetadata: MediaMetadataSchema,
  
  // Forms
  ContactForm: ContactFormSchema,
  BulkOrderForm: BulkOrderFormSchema,
} as const;

// Type inference helpers
export type ValidationSchema = keyof typeof ValidationSchemas;
export type InferredType<T extends ValidationSchema> = z.infer<typeof ValidationSchemas[T]>;
