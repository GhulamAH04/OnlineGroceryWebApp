import { apiUrl } from "@/config";
import { IExistingAddress } from "@/interfaces/address.interface";
import axios from "axios";

export async function getCategories() {
  const data = await axios.get(`${apiUrl}/api/categories/`);
  if (!data) throw new Error("Error fetching main products");
  return data.data;
}

export async function getShippingOptions(
  origin: IExistingAddress,
  destination: IExistingAddress,
  weight: number
) {
  const data = await axios.post(`${apiUrl}/api/shipping-cost`, {
    origin,
    destination,
    weight,
  });
  if (!data) throw new Error("Error fetching shipping options");
  return data.data;
}

export async function getMainAddress(userId: number, token: string) {
  const { data } = await axios.get(
    `${apiUrl}/api/users/address/main/${userId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!data) throw new Error("Error fetching main address");
  return data.data;
}

export async function getUserAddresses(userId: number) {
  const data = await axios.get(`${apiUrl}/api/addresses/${userId}`);
  if (!data) throw new Error("Error fetching user addresses");
  return data.data;
}
