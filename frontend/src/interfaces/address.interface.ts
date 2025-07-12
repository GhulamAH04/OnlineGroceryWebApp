export interface ICity {
  id: number;
  name: string;
  provinceId: number;
}

export interface IProvince {
  id: number;
  name: string;
}

export interface IAddress {
  id: number;
  name: string;
  address: string;
  provinces: IProvince;
  cities: ICity;
  postalCode: string;
  isPrimary: boolean;
  userId: number;
  latitude: number;
  longitude: number;
}

export interface IBillingDetails {
  firstName: string;
  lastName: string;
  companyName?: string;
  streetAddress: string;
  country: string;
  state: string;
  zipCode: string;
  email: string;
  phone: string;
}
