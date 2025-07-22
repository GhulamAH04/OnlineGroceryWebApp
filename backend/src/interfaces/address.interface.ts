export interface INewAddressFormData {
  name: string;
  address: string;
  province: string;
  city: string;
  postalCode: string;
  isPrimary: boolean;
  userId: number;
  district: string;
}

export interface IShippingAddress {
  province: string;
  city: string;
  district: string
}
