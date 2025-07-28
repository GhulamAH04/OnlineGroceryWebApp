import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export default async function middleware(req: NextRequest) {
  try {
    const cookieStore = await cookies();

    const protectedRoute =
      req.nextUrl.pathname === "/profile" || "/profile/:path*";

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
  matcher: ["/profile/:path*"], // Apply middleware to all paths under /profile
};