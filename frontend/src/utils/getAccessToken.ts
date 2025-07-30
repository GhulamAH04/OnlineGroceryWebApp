import { getCookie } from "cookies-next";

export function getAccessToken() {
  return getCookie("access_token");
}
