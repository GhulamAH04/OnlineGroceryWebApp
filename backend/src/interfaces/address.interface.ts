export interface INewAddress {
  name: string;
  address: string;
  province: string;
  city: string;
  postalCode: string;
  isPrimary: boolean;
  userId: number;
  district: string;
  phone: string;
}

export interface IShippingAddress {
  province: string;
  city: string;
  district: string
}
