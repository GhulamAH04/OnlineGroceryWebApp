import { getAxiosConfig } from "@/helper/getAxiosConfig";
import axios from "axios";

interface OrderData {
  cartId: number;
  addressId: number;
  paymentMethod: string;
  shippingCost?: number;
  courier?: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const getOrders = async (
  limit: number,
  id?: number,
  date?: string,
  no_order?: string
) => {
  try {
    let url = `${apiUrl}/api/order?limit=${limit}`;
    if (typeof id !== "undefined" && id !== null) {
      url += `&id=${id}`;
    }
    if (date) {
      url += `&date=${date}`;
    }
    if (no_order) {
      url += `&no_order=${no_order}`;
    }

    const response = await axios.get(url, getAxiosConfig());
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createOrder = async (orderData: OrderData) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/order`,
      orderData,
      getAxiosConfig()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadPaymentProof = async (
  orderId: number,
  paymentProof: File
) => {
  const formData = new FormData();
  formData.append("paymentProof", paymentProof);

  try {
    const response = await axios.post(
      `${apiUrl}/api/order/payment/${orderId}`,
      formData,
      {
        ...getAxiosConfig(),
        headers: {
          ...getAxiosConfig().headers,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const cancelOrder = async (orderId: number) => {
  try {
    const response = await axios.put(
      `${apiUrl}/api/order/cancel/${orderId}`,
      {},
      getAxiosConfig()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const confirmOrder = async (orderId: number) => {
  try {
    const response = await axios.put(
      `${apiUrl}/api/order/confirm/${orderId}`,
      {},
      getAxiosConfig()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
