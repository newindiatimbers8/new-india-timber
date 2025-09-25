export interface AdminProfile {
  userId: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  permissions?: string[];
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalBlogPosts: number;
  recentOrders: OrderSummary[];
  recentPosts: BlogPostSummary[];
}

export interface OrderSummary {
  id: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface BlogPostSummary {
  id: string;
  title: string;
  status: string;
  authorName: string;
  publishedAt?: string;
  updatedAt: string;
}

export interface ProductSummary {
  id: string;
  name: string;
  category: string;
  price: number;
  isActive: boolean;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface AdminSettings {
  siteName: string;
  contactEmail: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  defaultUserRole: 'Visitor' | 'Editor';
}


