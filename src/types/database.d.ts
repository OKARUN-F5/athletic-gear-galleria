
// Define database-related types for type safety
export interface ProductInventory {
  id: string;
  product_id: string;
  size: string;
  color: string;
  quantity: number;
  last_updated: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  images: string[]; // Make this required since we use it
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  cat_id: string | null;
  images: string[] | null;
  available_sizes: string[] | null;
  available_colors: string[] | null;
  stock_quantity: number | null;
  created_at: string;
  updated_at: string;
  brand: string; // Make these required since we use them
  bestseller: boolean;
  color: string | null;
}

export interface Order {
  id: string;
  user_id: string | null;
  date: string | null;
  status: string | null;
  total: string;
  shipping_option_id: string | null;
  shipping_address: any | null;
  payment_intent_id: string | null;
  items: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface OrderItem {
  id: string;
  order_id: string | null;
  product_id: string | null;
  quantity: number;
  price: string;
  size: string | null;
  color: string | null;
  created_at: string | null;
}

export interface ShippingOption {
  id: string;
  name: string;
  region: string;
  base_cost: number;
  delivery_time_min: number | null;
  delivery_time_max: number | null;
  created_at: string | null;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Role {
  id: string;
  name: string;
}
