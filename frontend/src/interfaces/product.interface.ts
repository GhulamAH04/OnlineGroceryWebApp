import { IExistingAddress } from "./address.interface";

interface IProduct {
  id: number;
  name: string;
  price: number;
  weight: number;
  image: string;
  categoryId: number;
}

interface IBranch {
  id: number;
  name: string;
  addresses: IExistingAddress;
}

export interface ICartItems {
  id: number;
  branchs: IBranch;
  products: IProduct;
  quantity: number;
}