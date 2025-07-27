import { IExistingAddress } from "./address.interface";

export interface IBranch {
  id: number;
  name: string;
  addresses: IExistingAddress;
}

export interface INewStore {
    userId: number;
    name: string;
    phone: string;
    address: string;
    provinceId: number;
    cityId: number;
    districtId: number;
    postalCode: string;
    latitude: number;
    longitude: number;
}

export interface IStore {
  id: number
  userId: number;
  name: string;
  phone: string;
  address: string;
  provinceId: number;
  cityId: number;
  districtId: number;
  postalCode: string;
  latitude: number;
  longitude: number;
}
