"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiUrl } from "@/config";

export default function AdminLoginPage() {
  // === STATE ===
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // === AUTO REDIRECT jika sudah login ===
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/admin/products");
    }
  }, [router]);

  // === HANDLE INPUT ===
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // === VALIDASI MANUAL ===
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimal 6 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // === HANDLE SUBMIT ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const res = await fetch(`${apiUrl}/api/admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success && data.data.token) {
        const token = data.data.token;

        // === Simpan token ke cookie dan localStorage ===
        document.cookie = `token=${token}; path=/; secure; samesite=strict`;
        localStorage.setItem("token", token);

        // === Reset form ===
        setFormData({ email: "", password: "" });

        // === Redirect ke dashboard ===
        router.push("/admin/products");
      } else {
        setLoginError(data.message || "Login gagal");
      }
    } catch {
      setLoginError("Server error. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // === RENDER ===
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Masuk ke dashboard admin
          </p>
        </div>

        {loginError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {loginError}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="Email address"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Memproses..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link
            href="/"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
