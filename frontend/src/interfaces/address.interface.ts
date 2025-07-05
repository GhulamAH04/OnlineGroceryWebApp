export interface IAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  phone: string;
};

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
};
