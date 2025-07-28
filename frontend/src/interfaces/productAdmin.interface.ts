// === INTERFACE: PRODUCT (FRONTEND) ===

export interface Product {
  id: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  stock: number;
  description: string | null;
  storeId: number;
  storeName: string;
  categoryId: number;
  categoryName: string;
}

// === INTERFACE: CART ITEM (FRONTEND) ===

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
