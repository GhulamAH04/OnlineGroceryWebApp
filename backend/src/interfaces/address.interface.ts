export interface INewAddress {
  name: string;
  address: string;
  provinceId: number;
  cityId: number;
  postalCode: string;
  isPrimary: boolean;
  userId: number;
  districtId: number;
  phone: string;
}

export interface IShippingAddress {
  province: string;
  city: string;
  district: string;
}
