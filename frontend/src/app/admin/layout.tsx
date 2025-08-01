// frontend/src/app/admin/layout.tsx
"use client";

import AdminLayout from "@/components/features2/dashboard/LayoutAdmin";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "@/utils/isTokenExpired";

export default function AdminPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      // Jika token tidak ada atau expired → redirect ke login
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      router.replace("/admin/login");
    }
  }, [router]);

  return <AdminLayout>{children}</AdminLayout>;
}
