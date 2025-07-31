"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Hapus cookie 'token' dengan cara mengatur expired date ke masa lalu
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=strict";
    router.replace("/admin/login");
  }, [router]);

  return <p>Logging out...</p>;
}
