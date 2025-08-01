import { getAxiosConfig } from "@/helper/getAxiosConfig";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const getOrdersAdmin = async (
  page: number,
  limit: number,
  branchId?: number
) => {
  try {
    let url = `${apiUrl}/api/admin/order?limit=${limit}`;
    if (branchId) {
      url += `&branchId=${branchId}`;
    }
    if (page) {
      url += `&page=${page}`;
    }

    const response = await axios.get(url, getAxiosConfig());
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ConfirmPaymentAdmin = async (orderId: number, status: string) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/admin/order/confirm-payment/${orderId}`,
      { status },
      getAxiosConfig()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const shipOrderAdmin = async (orderId: number) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/admin/order/ship/${orderId}`,
      {},
      getAxiosConfig()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelOrderAdmin = async (orderId: number) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/admin/order/cancel/${orderId}`,
      {},
      getAxiosConfig()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrdersByBranchAdmin = async (branchId: number) => {
  try {
    const response = await axios.get(`${apiUrl}/api/admin/order/branch`, {
      params: { branchId },
      ...getAxiosConfig(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
