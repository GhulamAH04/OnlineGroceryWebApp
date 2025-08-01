import { getAxiosConfig } from "@/helper/getAxiosConfig";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const getBranches = async () => {
  try {
    let url = `${apiUrl}/api/admin/branches`;
    const response = await axios.get(url, getAxiosConfig());
    return response.data;
  } catch (error) {
    throw error;
  }
};
