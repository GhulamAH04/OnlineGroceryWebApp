// File: src/interfaces/product.interface.ts
// === INTERFACE: PRODUCT ADMIN ===

export interface CreateProductInput {
  name: string;
  slug?: string; // auto-generate dari name
  description?: string;
  price: number;
  stock: number;
  weight: number;
  categoryId: number;
  branchId?: number | null;
}
// src/interfaces/productAdmin.interface.ts

export interface ProductAdminItem {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  price: number;
  stock: number;
  branchId: number | null; // ✅ BUKAN hanya number
  branchName: string;
  categoryName: string;
  description: string;
}
