/**
 * Base JSON Storage Service
 * Provides CRUD operations for JSON-based data storage
 */

import type { DataCollection, DataMetadata } from '@/utils/dataLoader';

// Static imports for production build compatibility
import usersData from '@/data/users';
import adminProfilesData from '@/data/admin-profiles';
import blogCategoriesData from '@/data/blog-categories';
import blogPostsData from '@/data/blog-posts';
import mediaAssetsData from '@/data/media-assets';
import navigationData from '@/data/navigation';
import ordersData from '@/data/orders';
import pagesData from '@/data/pages';
import productsData from '@/data/products';
import seoSettingsData from '@/data/seo-settings';

export interface StorageService {
  get<T>(collection: string, id: string): Promise<T | null>;
  getAll<T>(collection: string): Promise<T[]>;
  query<T>(collection: string, filter: (item: T) => boolean): Promise<T[]>;
  create<T extends { id: string }>(collection: string, data: T): Promise<T>;
  update<T extends { id: string }>(collection: string, id: string, updates: Partial<T>): Promise<T | null>;
  delete(collection: string, id: string): Promise<boolean>;
}

class JSONStorageService implements StorageService {
  private cache = new Map<string, any[]>();
  private metadata: DataMetadata | null = null;

  constructor() {
    this.loadMetadata();
  }

  private async loadMetadata(): Promise<void> {
    try {
      const response = await fetch('/src/data/_metadata.json');
      if (response?.ok) {
        this.metadata = await response.json();
      } else {
        // Fallback for test environment
        this.metadata = { collections: {} };
      }
    } catch (error) {
      console.warn('Failed to load metadata:', error);
      // Fallback for test environment
      this.metadata = { collections: {} };
    }
  }

  private async loadCollection<T>(collection: string): Promise<T[]> {
    // Check cache first
    if (this.cache.has(collection)) {
      return this.cache.get(collection);
    }

    // Use static imports for all environments
    try {
      const data = this.getStaticData(collection);
      const items = Array.isArray(data) ? data : [];

      // Cache the data
      this.cache.set(collection, items);

      return items;
    } catch (error) {
      console.error(`Error loading collection ${collection}:`, error);
      // Fallback
      this.cache.set(collection, []);
      return [];
    }
  }

  private getStaticData(collection: string): any[] {
    // Use static imports for all environments
    switch (collection) {
      case 'users':
        return usersData;
      case 'admin-profiles':
        return adminProfilesData;
      case 'blog-posts':
        return blogPostsData;
      case 'blog-categories':
        return blogCategoriesData;
      case 'products':
        return productsData;
      case 'orders':
        return ordersData;
      case 'pages':
        return pagesData;
      case 'navigation':
        return navigationData;
      case 'seo-settings':
        return seoSettingsData;
      case 'media-assets':
        return mediaAssetsData;
      default:
        return [];
    }
  }

  private saveToCache<T>(collection: string, items: T[]): void {
    this.cache.set(collection, items);
    
    // In a real implementation, this would save to persistent storage
    // For now, we'll just update the cache and log the operation
    console.log(`Updated ${collection} collection with ${items.length} items`);
  }

  private generateId(prefix: string = ''): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return prefix ? `${prefix}-${timestamp}${random}` : `${timestamp}${random}`;
  }

  async get<T>(collection: string, id: string): Promise<T | null> {
    const items = await this.loadCollection<T>(collection);
    const item = items.find((item: any) => item.id === id);
    return item || null;
  }

  async getAll<T>(collection: string): Promise<T[]> {
    return this.loadCollection<T>(collection);
  }

  async query<T>(collection: string, filter: (item: T) => boolean): Promise<T[]> {
    const items = await this.loadCollection<T>(collection);
    return items.filter(filter);
  }

  async create<T extends { id: string }>(collection: string, data: T): Promise<T> {
    const items = await this.loadCollection<T>(collection);
    
    // Ensure ID is set
    if (!data.id) {
      (data as any).id = this.generateId();
    }

    // Add timestamps if not present
    const now = new Date().toISOString();
    if (!(data as any).createdAt) {
      (data as any).createdAt = now;
    }
    (data as any).updatedAt = now;

    // Add to collection
    const newItems = [...items, data];
    this.saveToCache(collection, newItems);

    return data;
  }

  async update<T extends { id: string }>(collection: string, id: string, updates: Partial<T>): Promise<T | null> {
    const items = await this.loadCollection<T>(collection);
    const itemIndex = items.findIndex((item: any) => item.id === id);
    
    if (itemIndex === -1) {
      return null;
    }

    // Merge updates
    const updatedItem = {
      ...items[itemIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Update in collection
    const newItems = [...items];
    newItems[itemIndex] = updatedItem;
    this.saveToCache(collection, newItems);

    return updatedItem;
  }

  async delete(collection: string, id: string): Promise<boolean> {
    const items = await this.loadCollection(collection);
    const itemIndex = items.findIndex((item: any) => item.id === id);
    
    if (itemIndex === -1) {
      return false;
    }

    // Remove from collection
    const newItems = items.filter((item: any) => item.id !== id);
    this.saveToCache(collection, newItems);

    return true;
  }

  // Utility methods
  async exists(collection: string, id: string): Promise<boolean> {
    const item = await this.get(collection, id);
    return item !== null;
  }

  async count(collection: string): Promise<number> {
    const items = await this.loadCollection(collection);
    return items.length;
  }

  async findBy<T>(collection: string, field: keyof T, value: any): Promise<T | null> {
    const items = await this.loadCollection<T>(collection);
    const item = items.find((item: any) => item[field] === value);
    return item || null;
  }

  async findManyBy<T>(collection: string, field: keyof T, value: any): Promise<T[]> {
    const items = await this.loadCollection<T>(collection);
    return items.filter((item: any) => item[field] === value);
  }

  // Pagination support
  async paginate<T>(
    collection: string, 
    options: {
      page?: number;
      limit?: number;
      filter?: (item: T) => boolean;
      sort?: (a: T, b: T) => number;
    } = {}
  ): Promise<{
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    let items = await this.loadCollection<T>(collection);

    // Apply filter
    if (options.filter) {
      items = items.filter(options.filter);
    }

    // Apply sort
    if (options.sort) {
      items = items.sort(options.sort);
    }

    const total = items.length;
    const page = options.page || 1;
    const limit = options.limit || 20;
    const pages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;

    const paginatedItems = items.slice(offset, offset + limit);

    return {
      items: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    };
  }

  // Cache management
  clearCache(collection?: string): void {
    if (collection) {
      this.cache.delete(collection);
    } else {
      this.cache.clear();
    }
  }

  // Bulk operations
  async bulkCreate<T extends { id: string }>(collection: string, items: T[]): Promise<T[]> {
    const existingItems = await this.loadCollection<T>(collection);
    const now = new Date().toISOString();

    const newItems = items.map(item => {
      if (!item.id) {
        (item as any).id = this.generateId();
      }
      if (!(item as any).createdAt) {
        (item as any).createdAt = now;
      }
      (item as any).updatedAt = now;
      return item;
    });

    const allItems = [...existingItems, ...newItems];
    this.saveToCache(collection, allItems);

    return newItems;
  }

  async bulkUpdate<T extends { id: string }>(collection: string, updates: Array<{ id: string; data: Partial<T> }>): Promise<T[]> {
    const items = await this.loadCollection<T>(collection);
    const now = new Date().toISOString();
    const updatedItems: T[] = [];

    const newItems = items.map((item: any) => {
      const update = updates.find(u => u.id === item.id);
      if (update) {
        const updatedItem = {
          ...item,
          ...update.data,
          updatedAt: now,
        };
        updatedItems.push(updatedItem);
        return updatedItem;
      }
      return item;
    });

    this.saveToCache(collection, newItems);
    return updatedItems;
  }
}

// Singleton instance
export const storageService = new JSONStorageService();
export default storageService;