interface IProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  categoryId: number;
}

export interface IBranchesProducts {
  id: number;
  branchs: {id: number};
  products: IProduct;
}