import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  withCredentials: true, // kalau pakai cookie (opsional)
});

// Tambahkan token ke setiap request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Token yg dikirim:", token); // 🔍 debug log
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
