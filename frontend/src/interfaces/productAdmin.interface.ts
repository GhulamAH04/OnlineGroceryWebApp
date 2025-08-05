// === FILE: productAdmin.interface.ts ===

export interface Product {
  id: number;
  name: string;
  slug?: string;
  image?: string;
  price: number;
  stock: number;
  weight: number;
  branchId: number;
  branchName?: string;
  categoryId: number;
  categoryName?: string;
  description?: string;
}

export interface CreateProductInput {
  name: string;
  price: number;
  stock: number;
  weight: number;
  description?: string;
  branchId: number;
  categoryId: number;
}
// === INTERFACE: CART ITEM (FRONTEND) ===

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string | undefined;
}

export interface ProductSummary {
  id: number;
  name: string;
}
