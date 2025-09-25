/**
 * Order Service
 * Handles order management and form submissions
 */

import type { 
  Order, 
  OrderInput,
  OrderFilters,
  OrderStatus
} from '@/types/product';
import { storageService } from './storage';

export class OrderService {
  // Order Management
  async getOrders(
    filters: OrderFilters = {}, 
    pagination: { page?: number; limit?: number } = {}
  ): Promise<{
    orders: Order[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const result = await storageService.paginate<Order>(
      'orders',
      {
        page: pagination.page || 1,
        limit: pagination.limit || 20,
        filter: (order: Order) => this.matchesFilters(order, filters),
        sort: (a: Order, b: Order) => {
          // Sort by creation date desc (newest first)
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        },
      }
    );

    return {
      orders: result.items,
      pagination: result.pagination,
    };
  }

  private matchesFilters(order: Order, filters: OrderFilters): boolean {
    if (filters.status && order.status !== filters.status) return false;
    if (filters.purpose && order.orderDetails.purpose !== filters.purpose) return false;
    if (filters.customerEmail) {
      const emailMatch = order.customerInfo.email.toLowerCase().includes(filters.customerEmail.toLowerCase());
      if (!emailMatch) return false;
    }
    if (filters.dateFrom) {
      const orderDate = new Date(order.createdAt);
      if (orderDate < new Date(filters.dateFrom)) return false;
    }
    if (filters.dateTo) {
      const orderDate = new Date(order.createdAt);
      if (orderDate > new Date(filters.dateTo)) return false;
    }
    return true;
  }

  async getOrder(id: string): Promise<Order | null> {
    return storageService.get<Order>('orders', id);
  }

  async createOrder(input: OrderInput): Promise<Order> {
    // Validate required fields
    if (!input.customerInfo.name?.trim()) {
      throw new Error('Customer name is required');
    }
    if (!input.customerInfo.email?.trim()) {
      throw new Error('Customer email is required');
    }
    if (!input.customerInfo.phone?.trim()) {
      throw new Error('Customer phone is required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.customerInfo.email)) {
      throw new Error('Invalid email format');
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(input.customerInfo.phone.replace(/\s/g, ''))) {
      throw new Error('Invalid phone number');
    }

    // Validate order details
    if (input.orderDetails.frames < 1) {
      throw new Error('Number of frames must be at least 1');
    }

    const orderNumber = this.generateOrderNumber();

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      userId: input.userId || null,
      customerInfo: {
        name: input.customerInfo.name.trim(),
        email: input.customerInfo.email.toLowerCase().trim(),
        phone: input.customerInfo.phone.trim(),
        address: input.customerInfo.address || null,
      },
      orderDetails: {
        purpose: input.orderDetails.purpose,
        frames: input.orderDetails.frames,
        deliveryRequired: input.orderDetails.deliveryRequired,
        customization: input.orderDetails.customization || '',
      },
      status: 'pending',
      estimatedValue: null,
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return storageService.create('orders', newOrder);
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
    const existingOrder = await storageService.get<Order>('orders', id);
    if (!existingOrder) {
      return null;
    }

    // Validate status transition if status is being updated
    if (updates.status && !this.isValidStatusTransition(existingOrder.status, updates.status)) {
      throw new Error(`Invalid status transition from ${existingOrder.status} to ${updates.status}`);
    }

    return storageService.update<Order>('orders', id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  async deleteOrder(id: string): Promise<boolean> {
    const order = await storageService.get<Order>('orders', id);
    if (!order) {
      return false;
    }

    // Only allow deletion of pending or cancelled orders
    if (!['pending', 'cancelled'].includes(order.status)) {
      throw new Error('Cannot delete orders that are in progress or completed');
    }

    return storageService.delete('orders', id);
  }

  // Order Status Management
  async confirmOrder(id: string, estimatedValue?: number, notes?: string): Promise<Order | null> {
    const updates: Partial<Order> = {
      status: 'confirmed',
    };
    
    if (estimatedValue !== undefined) {
      updates.estimatedValue = estimatedValue;
    }
    
    if (notes !== undefined) {
      updates.notes = notes;
    }

    return this.updateOrder(id, updates);
  }

  async startOrderProcessing(id: string, notes?: string): Promise<Order | null> {
    const updates: Partial<Order> = {
      status: 'in-progress',
    };
    
    if (notes !== undefined) {
      updates.notes = notes;
    }

    return this.updateOrder(id, updates);
  }

  async completeOrder(id: string, notes?: string): Promise<Order | null> {
    const updates: Partial<Order> = {
      status: 'completed',
    };
    
    if (notes !== undefined) {
      updates.notes = notes;
    }

    return this.updateOrder(id, updates);
  }

  async cancelOrder(id: string, reason?: string): Promise<Order | null> {
    const updates: Partial<Order> = {
      status: 'cancelled',
    };
    
    if (reason) {
      updates.notes = `Cancelled: ${reason}`;
    }

    return this.updateOrder(id, updates);
  }

  // Customer-specific queries
  async getOrdersByCustomerEmail(email: string): Promise<Order[]> {
    return storageService.query<Order>('orders', order => 
      order.customerInfo.email.toLowerCase() === email.toLowerCase()
    );
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return storageService.query<Order>('orders', order => 
      order.userId === userId
    );
  }

  // Analytics and reporting
  async getOrderStats(): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    totalEstimatedValue: number;
    averageOrderValue: number;
    purposeBreakdown: Record<string, number>;
  }> {
    const orders = await storageService.getAll<Order>('orders');
    
    const stats = {
      total: orders.length,
      pending: 0,
      confirmed: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
      totalEstimatedValue: 0,
      averageOrderValue: 0,
      purposeBreakdown: {} as Record<string, number>,
    };

    let totalValue = 0;
    let ordersWithValue = 0;

    orders.forEach(order => {
      // Status counts
      switch (order.status) {
        case 'pending':
          stats.pending++;
          break;
        case 'confirmed':
          stats.confirmed++;
          break;
        case 'in-progress':
          stats.inProgress++;
          break;
        case 'completed':
          stats.completed++;
          break;
        case 'cancelled':
          stats.cancelled++;
          break;
      }

      // Value calculations
      if (order.estimatedValue && order.estimatedValue > 0) {
        totalValue += order.estimatedValue;
        ordersWithValue++;
      }

      // Purpose breakdown
      const purpose = order.orderDetails.purpose;
      stats.purposeBreakdown[purpose] = (stats.purposeBreakdown[purpose] || 0) + 1;
    });

    stats.totalEstimatedValue = totalValue;
    stats.averageOrderValue = ordersWithValue > 0 ? totalValue / ordersWithValue : 0;

    return stats;
  }

  // Bulk operations
  async updateOrderStatus(orderIds: string[], status: OrderStatus, notes?: string): Promise<Order[]> {
    const updatedOrders: Order[] = [];

    for (const id of orderIds) {
      try {
        const updated = await this.updateOrder(id, { status, notes });
        if (updated) {
          updatedOrders.push(updated);
        }
      } catch (error) {
        console.error(`Failed to update order ${id}:`, error);
      }
    }

    return updatedOrders;
  }

  // Helper methods
  private generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const timestamp = Date.now().toString().slice(-4);
    
    return `ORD-${year}${month}${day}-${timestamp}`;
  }

  private isValidStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['in-progress', 'cancelled'],
      'in-progress': ['completed', 'cancelled'],
      'completed': [], // Final state
      'cancelled': [], // Final state
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  // Search functionality
  async searchOrders(query: string): Promise<Order[]> {
    const queryLower = query.toLowerCase();
    
    return storageService.query<Order>('orders', order => 
      order.orderNumber.toLowerCase().includes(queryLower) ||
      order.customerInfo.name.toLowerCase().includes(queryLower) ||
      order.customerInfo.email.toLowerCase().includes(queryLower) ||
      order.customerInfo.phone.includes(query)
    );
  }

  // Recent orders for dashboard
  async getRecentOrders(limit: number = 10): Promise<Order[]> {
    const orders = await storageService.getAll<Order>('orders');
    
    return orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}

// Export singleton instance and methods
export const orderService = new OrderService();

// Export individual methods for contract tests compatibility
export const getOrders = (filters?: OrderFilters, pagination?: { page?: number; limit?: number }) => 
  orderService.getOrders(filters, pagination);
export const getOrder = (id: string) => orderService.getOrder(id);
export const createOrder = (input: OrderInput) => orderService.createOrder(input);
export const updateOrder = (id: string, updates: Partial<Order>) => orderService.updateOrder(id, updates);
export const deleteOrder = (id: string) => orderService.deleteOrder(id);
export const confirmOrder = (id: string, estimatedValue?: number, notes?: string) => 
  orderService.confirmOrder(id, estimatedValue, notes);
export const startOrderProcessing = (id: string, notes?: string) => orderService.startOrderProcessing(id, notes);
export const completeOrder = (id: string, notes?: string) => orderService.completeOrder(id, notes);
export const cancelOrder = (id: string, reason?: string) => orderService.cancelOrder(id, reason);

export default orderService;
