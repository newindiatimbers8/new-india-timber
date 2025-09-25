export interface MediaAsset {
  id: string;
  filename: string;
  path: string;
  url: string;
  altText?: string;
  mimeType: string;
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
  usage?: string[];
  uploadedBy?: string;
  uploadedAt: string;
  updatedAt: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface MediaUploadRequest {
  file: File;
  altText?: string;
  usage?: string[];
  tags?: string[];
}

export interface MediaUpdateRequest {
  altText?: string;
  usage?: string[];
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface MediaFilters {
  mimeType?: string;
  usage?: string[];
  tags?: string[];
  uploadedBy?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface MediaListResponse {
  assets: MediaAsset[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  progressive?: boolean;
}

export interface ImageOptimizationResult {
  original: MediaAsset;
  optimized: MediaAsset[];
  savings: {
    bytes: number;
    percentage: number;
  };
}

export interface MediaProcessingJob {
  id: string;
  assetId: string;
  type: 'optimization' | 'conversion' | 'resize' | 'thumbnail';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  options?: Record<string, any>;
  result?: MediaAsset | MediaAsset[];
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaStorageStats {
  totalAssets: number;
  totalSize: number;
  byType: Record<string, number>;
  byUsage: Record<string, number>;
  recentUploads: number;
  storageUsed: number;
  storageLimit?: number;
}