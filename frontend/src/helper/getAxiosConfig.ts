import { getAccessToken } from "@/utils/getAccessToken";

export function getAxiosConfig() {
  const token = getAccessToken();
  return {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };
}
