import { databases, appwriteConfig } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';

// Types based on existing data structure
export interface WoodProduct {
  id: string;
  name: string;
  scientificName?: string;
  category: 'teak' | 'plywood' | 'hardwood' | 'softwood' | 'engineered';
  grade: 'premium' | 'commercial' | 'budget';
  overview: {
    description: string;
    keyBenefits: string[];
    premiumPositioning: string;
    tagline: string;
  };
  specifications: {
    density: number;
    hardness: number;
    moistureContent: number;
    grainPattern: string;
    durability: string;
    workability: string;
    finishQuality: string;
    dimensionalStability: string;
  };
  pricing: {
    pricePerSqFt: number;
    priceRange: string;
    marketTrend: string;
  };
  images?: string[]; // Appwrite file IDs
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  purpose: 'commercial' | 'residential';
  frames: number;
  deliveryRequired: boolean;
  address?: string;
  name: string;
  email: string;
  phone: string;
  customization?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  estimatedValue?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Estimate {
  id: string;
  userId?: string;
  woodType: string;
  dimensions: {
    length: number;
    width: number;
    thickness: number;
  };
  quantity: number;
  customization?: string;
  totalPrice: number;
  createdAt: string;
}

class DatabaseService {
  // Products
  async getProducts(limit: number = 50, offset: number = 0): Promise<WoodProduct[]> {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collectionIds.products,
        [
          Query.limit(limit),
          Query.offset(offset),
          Query.orderDesc('$createdAt')
        ]
      );
      return response.documents as WoodProduct[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch products');
    }
  }

  async getProduct(productId: string): Promise<WoodProduct> {
    try {
      const product = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collectionIds.products,
        productId
      );
      return product as WoodProduct;
    } catch (error: any) {
      throw new Error(error.message || 'Product not found');
    }
  }

  async createProduct(productData: Omit<WoodProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<WoodProduct> {
    try {
      const product = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collectionIds.products,
        ID.unique(),
        productData
      );
      return product as WoodProduct;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create product');
    }
  }

  async updateProduct(productId: string, updates: Partial<WoodProduct>): Promise<WoodProduct> {
    try {
      const product = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collectionIds.products,
        productId,
        updates
      );
      return product as WoodProduct;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update product');
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collectionIds.products,
        productId
      );
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete product');
    }
  }

  async getProductsByCategory(category: string): Promise<WoodProduct[]> {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collectionIds.products,
        [
          Query.equal('category', category),
          Query.orderDesc('$createdAt')
        ]
      );
      return response.documents as WoodProduct[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch products by category');
    }
  }

  // Orders
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    try {
      const order = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collectionIds.orders,
        ID.unique(),
        orderData
      );
      return order as Order;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create order');
    }
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collectionIds.orders,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt')
        ]
      );
      return response.documents as Order[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch orders');
    }
  }

  async getOrder(orderId: string): Promise<Order> {
    try {
      const order = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collectionIds.orders,
        orderId
      );
      return order as Order;
    } catch (error: any) {
      throw new Error(error.message || 'Order not found');
    }
  }

  async updateOrder(orderId: string, updates: Partial<Order>): Promise<Order> {
    try {
      const order = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collectionIds.orders,
        orderId,
        updates
      );
      return order as Order;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update order');
    }
  }

  async getAllOrders(limit: number = 50, offset: number = 0): Promise<Order[]> {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collectionIds.orders,
        [
          Query.limit(limit),
          Query.offset(offset),
          Query.orderDesc('$createdAt')
        ]
      );
      return response.documents as Order[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch orders');
    }
  }

  // Estimates
  async createEstimate(estimateData: Omit<Estimate, 'id' | 'createdAt'>): Promise<Estimate> {
    try {
      const estimate = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collectionIds.estimates,
        ID.unique(),
        estimateData
      );
      return estimate as Estimate;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create estimate');
    }
  }

  async getUserEstimates(userId: string): Promise<Estimate[]> {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collectionIds.estimates,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt')
        ]
      );
      return response.documents as Estimate[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch estimates');
    }
  }

  async getEstimate(estimateId: string): Promise<Estimate> {
    try {
      const estimate = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collectionIds.estimates,
        estimateId
      );
      return estimate as Estimate;
    } catch (error: any) {
      throw new Error(error.message || 'Estimate not found');
    }
  }

  // Search functionality
  async searchProducts(query: string): Promise<WoodProduct[]> {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collectionIds.products,
        [
          Query.search('name', query),
          Query.orderDesc('$createdAt')
        ]
      );
      return response.documents as WoodProduct[];
    } catch (error: any) {
      throw new Error(error.message || 'Search failed');
    }
  }
}

export const dbService = new DatabaseService();
export default dbService;
