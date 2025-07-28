export interface IExistingAddress {
  id: number;
  name: string;
  phone: string;
  address: string;
  provinces: ILocation;
  cities: ILocation;
  postalCode: string;
  isPrimary: boolean;
  userId: number;
  districts: ILocation;
}

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

export interface ILocation {
  id: number;
  name: string;
}