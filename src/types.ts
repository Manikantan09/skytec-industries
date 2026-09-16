export type ProductCategory = 'Ceiling' | 'Wall Mount' | 'Table' | 'Pedestal';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  features: string[];
  image: string;
  inStock: boolean;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  productInterest: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin';
}

export interface AdminUserWithTimestamp extends AdminUser {
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: AdminUser;
  error?: string;
}
