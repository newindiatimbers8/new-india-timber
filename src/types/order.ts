export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  company?: string;
  items: OrderItem[];
  requirements?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  totalAmount?: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  unit: string;
  unitPrice?: number;
  totalPrice?: number;
  notes?: string;
}

export interface OrderCreateRequest {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  company?: string;
  items: OrderItem[];
  requirements?: string;
}

export interface OrderUpdateRequest {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  company?: string;
  items?: OrderItem[];
  requirements?: string;
  status?: 'pending' | 'processing' | 'completed' | 'cancelled';
  notes?: string;
}

export interface OrderFilters {
  status?: 'pending' | 'processing' | 'completed' | 'cancelled';
  customerEmail?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface OrderSummary {
  id: string;
  customerName: string;
  customerEmail: string;
  itemCount: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface BulkOrderInquiry {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  company?: string;
  productType: string;
  quantity: number;
  specifications?: string;
  timeline?: string;
  budget?: string;
  additionalNotes?: string;
  source?: 'website' | 'phone' | 'email' | 'referral';
}


