/**
 * Data Loader Utilities for TypeScript-based storage
 * Handles loading and saving TypeScript data files
 */

import type { UserAccount } from '@/types/auth';
import type { AdminProfile } from '@/types/admin';
import type { BlogPost } from '@/types/blog';
import type { BlogCategory } from '@/types/blog';
import type { Product } from '@/types/product';
import type { Order } from '@/types/order';
import type { Page } from '@/types/content';
import type { NavigationMenu } from '@/types/navigation';
import type { SEOSetting } from '@/types/seo';
import type { MediaAsset } from '@/types/media';

// Import the TypeScript data files directly
import usersData from '@/data/users';
import adminProfilesData from '@/data/admin-profiles';
import blogPostsData from '@/data/blog-posts';
import blogCategoriesData from '@/data/blog-categories';
import productsData from '@/data/products';
import ordersData from '@/data/orders';
import pagesData from '@/data/pages';
import navigationData from '@/data/navigation';
import seoSettingsData from '@/data/seo-settings';
import mediaAssetsData from '@/data/media-assets';

export interface DataCollection {
  [key: string]: any;
}

export interface CollectionMetadata {
  file: string;
  count: number;
  lastUpdated: string;
}

export interface DataMetadata {
  version: string;
  lastMigration: string;
  migrationSource: string;
  collections: Record<string, CollectionMetadata>;
}

/**
 * Load data from TypeScript files
 */
export async function loadCollection<T>(collectionName: string): Promise<T[]> {
  try {
    switch (collectionName) {
      case 'users':
        return usersData as T[];
      case 'admin-profiles':
        return adminProfilesData as T[];
      case 'blog-posts':
        return blogPostsData as T[];
      case 'blog-categories':
        return blogCategoriesData as T[];
      case 'products':
        return productsData as T[];
      case 'orders':
        return ordersData as T[];
      case 'pages':
        return pagesData as T[];
      case 'navigation':
        return navigationData as T[];
      case 'seo-settings':
        return seoSettingsData as T[];
      case 'media-assets':
        return mediaAssetsData as T[];
      default:
        console.warn(`Unknown collection: ${collectionName}`);
        return [];
    }
  } catch (error) {
    console.error(`Error loading collection ${collectionName}:`, error);
    return [];
  }
}

/**
 * Load metadata about data collections
 */
export async function loadMetadata(): Promise<DataMetadata | null> {
  try {
    const collections = [
      'users', 'admin-profiles', 'blog-posts', 'blog-categories',
      'products', 'orders', 'pages', 'navigation', 'seo-settings', 'media-assets'
    ];
    
    const collectionMetadata: Record<string, CollectionMetadata> = {};
    
    for (const collection of collections) {
      const data = await loadCollection(collection);
      collectionMetadata[collection] = {
        file: `${collection}.ts`,
        count: data.length,
        lastUpdated: new Date().toISOString()
      };
    }
    
    return {
      version: '1.0.0',
      lastMigration: new Date().toISOString(),
      migrationSource: 'appwrite-to-typescript',
      collections: collectionMetadata
    };
  } catch (error) {
    console.error('Error loading metadata:', error);
    return null;
  }
}

/**
 * Save collection data (for development/migration purposes)
 * Note: This would typically be server-side in production
 */
export function saveCollection<T>(collectionName: string, data: T[]): void {
  // In a real implementation, this would make an API call to save data
  // For now, we'll log the operation
  console.log(`Saving ${data.length} items to ${collectionName}`);
  
  // For development, you could implement file system writes here
  // or integrate with a simple API endpoint
}

/**
 * Update metadata after data changes
 */
export function updateMetadata(collectionName: string, count: number): void {
  // In a real implementation, this would update the metadata file
  console.log(`Updating metadata for ${collectionName}: ${count} items`);
}

/**
 * Data validation helper
 */
export function validateData<T>(data: any[], validator: (item: any) => item is T): T[] {
  return data.filter(validator);
}

/**
 * Generate UUID for new records
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return prefix ? `${prefix}-${timestamp}${random}` : `${timestamp}${random}`;
}

/**
 * Convert Appwrite date format to ISO string
 */
export function convertAppwriteDate(appwriteDate: string): string {
  return new Date(appwriteDate).toISOString();
}
