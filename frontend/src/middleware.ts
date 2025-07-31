// === FILE: middleware.ts ===
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  const adminToken = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  // === Bypass halaman login admin & login user ===
  if (path === "/admin/login" || path === "/login") {
    return NextResponse.next();
  }

  // === Proteksi halaman user ===
  const isUserProtected = path.startsWith("/profile");
  if (isUserProtected && !accessToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // === Proteksi halaman admin ===
  const isAdminProtected = path.startsWith("/admin");
  if (isAdminProtected && !adminToken) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/admin/:path*", "/checkout"],
};

/*
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export default async function middleware(req: NextRequest) {
  try {
    const cookieStore = await cookies();

    const protectedRoute =
      req.nextUrl.pathname === "/profile" || "/profile/:path*" || "/checkout";

    const access_token = cookieStore.get("access_token")?.value || "";

    if (protectedRoute && !access_token) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  } catch (err) {
    console.log(err);
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
}

export const config = {
  matcher: ["/profile/:path*", "/admin/:path*", "/checkout"], // Final matcher dari versi aktif
};
*/
