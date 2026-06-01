export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  email: string;
  phone_number?: string;
  phone_verified?: boolean;
  role: UserRole;
  created_at: string;
}

export interface SellerProfile {
  id: string;
  user_id: string;
  store_name: string;
  store_description?: string;
}

export interface Category {
  id: string;
  name: string;
  created_at?: string;
}

export interface Product {
  id: string;
  seller_id: string;
  category_id: string | null;
  title: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface ProductFormData {
  title: string;
  description: string;
  category_id: string;
  custom_category_name?: string;
  price: string;
  stock: string;
  image_file?: File | null;
  image_url?: string | null;
  is_active: boolean;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  product?: Product;
}

export interface Cart {
  id: string;
  buyer_id: string;
  created_at?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price?: number;
  seller_id?: string;
  seller_status?: string;
  product?: Product;
}

export interface Order {
  id: string;
  buyer_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_price: number;
  created_at: string;
}

export interface BuyerOrder extends Order {
  items: OrderItem[];
}
