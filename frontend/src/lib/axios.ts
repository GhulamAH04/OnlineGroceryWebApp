import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { isTokenExpired } from "@/utils/isTokenExpired";
import { JwtPayload } from "@/interfaces/jwtPayload";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // ✅ Cek apakah token expired
          if (isTokenExpired(token)) {
            console.warn("Token expired. Menghapus token...");
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "/login";
            return Promise.reject(new Error("Token expired"));
          }

          // ✅ Decode dan simpan role jika belum tersimpan
          const decoded: JwtPayload = jwtDecode(token);
          if (!localStorage.getItem("role") && decoded?.role) {
            localStorage.setItem("role", decoded.role);
          }

          // ✅ Pasang token ke header
          if (config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("Token yg dikirim:", token);
          }
        } catch (err) {
          console.error("Token invalid atau gagal didecode:", err);
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          window.location.href = "/login";
          return Promise.reject(new Error("Invalid token"));
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
