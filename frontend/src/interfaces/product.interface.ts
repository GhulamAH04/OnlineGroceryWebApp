import { IBranch } from "./store.interface";

interface IProduct {
  id: number;
  name: string;
  price: number;
  weight: number;
  image: string;
  categoryId: number;
}



export interface ICartItems {
  id: number;
  branchs: IBranch;
  products: IProduct;
  quantity: number;
}