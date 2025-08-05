import { IExistingAddress } from "./address.interface";
import { IBranch } from "./store.interface";

export interface IProductBranch {
  id: number;
  stock: number;
  branchs: IBranch;
  products: IProduct;
}

export interface IProduct {
  id: number;
  name: string;
  price: number;
  weight: number;
  image: string;
  categoryId: number;
}

export interface ICartItems {
  id: number;
  product_branchs: IProductBranch;
  cartId: number;
  quantity: number;
}

export interface IProductCart {
  id: number;
  quantity: number;
  cartId: number;
  productBranches: IProductBranch;
}

export interface IGroupedItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  weightInGrams: number;
  storeName: string;
  storeAddress: IExistingAddress; // ID kota asal untuk API RajaOngkir
  imageUrl: string;
}

