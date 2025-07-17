"use client";
import AdminLayout from "@/components/features2/dashboard/LayoutAdmin";

export default function AdminPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
