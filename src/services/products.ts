/**
 * Product Service
 * Handles product catalog management and operations
 */

import type { 
  Product, 
  ProductInput,
  ProductFilters,
  ProductImage,
  ProductStatus
} from '@/types/product';
import { loadCollection } from '@/utils/dataLoader';
import { storageService } from './storage';

export class ProductService {
  // Product Management
  async getProducts(
    filters: ProductFilters = {}, 
    pagination: { page?: number; limit?: number } = {}
  ): Promise<{
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    try {
      const products = await loadCollection<Product>('products');
      
      // Apply filters
      let filteredProducts = products.filter(product => this.matchesFilters(product, filters));
      
      // Sort by createdAt desc (newest first)
      filteredProducts.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      // Apply pagination
      const page = pagination.page || 1;
      const limit = pagination.limit || 20;
      const total = filteredProducts.length;
      const pages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

      return {
        products: paginatedProducts,
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      };
    } catch (error) {
      console.error('Error loading products:', error);
      return {
        products: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 }
      };
    }
  }

  private matchesFilters(product: Product, filters: ProductFilters): boolean {
    if (filters.status && product.status !== filters.status) return false;
    if (filters.category && product.category !== filters.category) return false;
    if (filters.grade && product.grade !== filters.grade) return false;
    if (filters.priceRange && product.pricing.priceRange !== filters.priceRange) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const searchMatch = 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchLower)));
      if (!searchMatch) return false;
    }
    return true;
  }

  async getProduct(id: string): Promise<Product | null> {
    return storageService.get<Product>('products', id);
  }

  async createProduct(input: ProductInput): Promise<Product> {
    // Validate required fields
    if (!input.name?.trim()) {
      throw new Error('Name is required');
    }

    // Validate specifications
    this.validateProductSpecifications(input);

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: input.name.trim(),
      scientificName: input.scientificName || null,
      category: input.category,
      grade: input.grade,
      overview: input.overview,
      specifications: input.specifications,
      pricing: input.pricing,
      images: input.images || [],
      seo: input.seo || this.generateDefaultSEO(input.name),
      status: input.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return storageService.create('products', newProduct);
  }

  async updateProduct(id: string, updates: Partial<ProductInput>): Promise<Product | null> {
    const existingProduct = await storageService.get<Product>('products', id);
    if (!existingProduct) {
      return null;
    }

    // Validate specifications if they're being updated
    if (updates.specifications) {
      this.validateProductSpecifications({ 
        ...existingProduct, 
        specifications: updates.specifications 
      });
    }

    return storageService.update<Product>('products', id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  async deleteProduct(id: string): Promise<boolean> {
    return storageService.delete('products', id);
  }

  // Product Image Management
  async addProductImage(id: string, image: ProductImage): Promise<Product | null> {
    const product = await storageService.get<Product>('products', id);
    if (!product) {
      return null;
    }

    // If this image is set as primary, make all others non-primary
    if (image.isPrimary) {
      product.images = product.images.map(img => ({ ...img, isPrimary: false }));
    }

    const updatedImages = [...product.images, image];
    
    return storageService.update<Product>('products', id, {
      images: updatedImages,
    });
  }

  async removeProductImage(id: string, imageUrl: string): Promise<Product | null> {
    const product = await storageService.get<Product>('products', id);
    if (!product) {
      return null;
    }

    const updatedImages = product.images.filter(img => img.url !== imageUrl);
    
    return storageService.update<Product>('products', id, {
      images: updatedImages,
    });
  }

  async setPrimaryImage(id: string, imageUrl: string): Promise<Product | null> {
    const product = await storageService.get<Product>('products', id);
    if (!product) {
      return null;
    }

    const updatedImages = product.images.map(img => ({
      ...img,
      isPrimary: img.url === imageUrl,
    }));
    
    return storageService.update<Product>('products', id, {
      images: updatedImages,
    });
  }

  // Product Status Management
  async activateProduct(id: string): Promise<Product | null> {
    return this.updateProductStatus(id, 'active');
  }

  async deactivateProduct(id: string): Promise<Product | null> {
    return this.updateProductStatus(id, 'inactive');
  }

  async setOutOfStock(id: string): Promise<Product | null> {
    return this.updateProductStatus(id, 'out-of-stock');
  }

  private async updateProductStatus(id: string, status: ProductStatus): Promise<Product | null> {
    return storageService.update<Product>('products', id, { status });
  }

  // Category-based queries
  async getProductsByCategory(category: string): Promise<Product[]> {
    return storageService.query<Product>('products', product => 
      product.category === category && product.status === 'active'
    );
  }

  // Search functionality
  async searchProducts(query: string): Promise<Product[]> {
    const filters: ProductFilters = { search: query, status: 'active' };
    const result = await this.getProducts(filters, { limit: 50 });
    return result.products;
  }

  // Bulk operations
  async getProductsByIds(ids: string[]): Promise<Product[]> {
    const products: Product[] = [];
    for (const id of ids) {
      const product = await storageService.get<Product>('products', id);
      if (product) {
        products.push(product);
      }
    }
    return products;
  }

  async updateProductPricing(id: string, pricing: Product['pricing']): Promise<Product | null> {
    return storageService.update<Product>('products', id, { 
      pricing,
      updatedAt: new Date().toISOString(),
    });
  }

  // Analytics and reporting
  async getProductStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    outOfStock: number;
    categories: Record<string, number>;
    priceRanges: Record<string, number>;
  }> {
    const products = await storageService.getAll<Product>('products');
    
    const stats = {
      total: products.length,
      active: 0,
      inactive: 0,
      outOfStock: 0,
      categories: {} as Record<string, number>,
      priceRanges: {} as Record<string, number>,
    };

    products.forEach(product => {
      // Status counts
      switch (product.status) {
        case 'active':
          stats.active++;
          break;
        case 'inactive':
          stats.inactive++;
          break;
        case 'out-of-stock':
          stats.outOfStock++;
          break;
      }

      // Category counts
      stats.categories[product.category] = (stats.categories[product.category] || 0) + 1;

      // Price range counts
      stats.priceRanges[product.pricing.priceRange] = (stats.priceRanges[product.pricing.priceRange] || 0) + 1;
    });

    return stats;
  }

  // Helper methods
  private validateProductSpecifications(input: Partial<ProductInput>): void {
    if (!input.specifications) return;

    const { specifications } = input;

    if (specifications.density <= 0) {
      throw new Error('Density must be positive');
    }
    if (specifications.hardness <= 0) {
      throw new Error('Hardness must be positive');
    }
    if (specifications.moistureContent < 0 || specifications.moistureContent > 100) {
      throw new Error('Moisture content must be between 0 and 100');
    }
    if (!specifications.grainPattern?.trim()) {
      throw new Error('Grain pattern is required');
    }
    if (!specifications.durability?.trim()) {
      throw new Error('Durability is required');
    }
    if (!specifications.workability?.trim()) {
      throw new Error('Workability is required');
    }
    if (!specifications.finishQuality?.trim()) {
      throw new Error('Finish quality is required');
    }
    if (!specifications.dimensionalStability?.trim()) {
      throw new Error('Dimensional stability is required');
    }
  }

  private generateDefaultSEO(productName: string): Product['seo'] {
    return {
      metaTitle: `${productName} - Premium Wood | New India Timber`,
      metaDescription: `High-quality ${productName} for your construction and furniture projects. Premium timber supplier in Bangalore, Karnataka.`,
      keywords: [
        productName.toLowerCase(),
        'premium wood',
        'bangalore timber',
        'karnataka',
        'construction wood',
        'furniture wood',
      ],
    };
  }

  // Inventory management
  async getFeaturedProducts(limit: number = 6): Promise<Product[]> {
    const products = await storageService.query<Product>('products', product => 
      product.status === 'active' && product.grade === 'premium'
    );

    // Sort by creation date (newest first) and limit
    return products
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async getPopularProducts(limit: number = 8): Promise<Product[]> {
    // For now, return products sorted by premium grade and creation date
    // In a real implementation, this could be based on view counts or sales data
    const products = await storageService.query<Product>('products', product => 
      product.status === 'active'
    );

    return products
      .sort((a, b) => {
        // Priority: premium > commercial > utility
        const gradeOrder = { premium: 3, commercial: 2, utility: 1 };
        const gradeA = gradeOrder[a.grade] || 0;
        const gradeB = gradeOrder[b.grade] || 0;
        
        if (gradeA !== gradeB) {
          return gradeB - gradeA;
        }
        
        // Secondary sort by creation date
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .slice(0, limit);
  }
}

// Export singleton instance and methods
export const productService = new ProductService();

// Export individual methods for contract tests compatibility
export const getProducts = (filters?: ProductFilters, pagination?: { page?: number; limit?: number }) => 
  productService.getProducts(filters, pagination);
export const getProduct = (id: string) => productService.getProduct(id);
export const createProduct = (input: ProductInput) => productService.createProduct(input);
export const updateProduct = (id: string, updates: Partial<ProductInput>) => productService.updateProduct(id, updates);
export const deleteProduct = (id: string) => productService.deleteProduct(id);
export const addProductImage = (id: string, image: ProductImage) => productService.addProductImage(id, image);
export const removeProductImage = (id: string, imageUrl: string) => productService.removeProductImage(id, imageUrl);
export const setPrimaryImage = (id: string, imageUrl: string) => productService.setPrimaryImage(id, imageUrl);
export const activateProduct = (id: string) => productService.activateProduct(id);
export const deactivateProduct = (id: string) => productService.deactivateProduct(id);
export const setOutOfStock = (id: string) => productService.setOutOfStock(id);
export const getProductsByCategory = (category: string) => productService.getProductsByCategory(category);
export const searchProducts = (query: string) => productService.searchProducts(query);
export const getFeaturedProducts = (limit?: number) => productService.getFeaturedProducts(limit);
export const getPopularProducts = (limit?: number) => productService.getPopularProducts(limit);

export default productService;
