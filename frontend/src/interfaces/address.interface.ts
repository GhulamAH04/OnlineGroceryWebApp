export interface IExistingAddress {
  id: number;
  name: string;
  address: string;
  province: string;
  city: string;
  postalCode: string;
  isPrimary: boolean;
  userId: number;
  district: string;
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
