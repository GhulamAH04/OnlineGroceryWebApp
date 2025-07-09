export interface IOrder {
  id: string;
  date: string;
  total: number;
  productCount: number;
  status: "Processing" | "On the way" | "Completed";
};
