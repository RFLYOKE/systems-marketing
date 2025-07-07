import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Izinkan akses ke path publik
  const publicPaths = ["/login"];
  const isPublicPath =
    publicPaths.includes(pathname) || pathname.startsWith("/api/auth");

  if (isPublicPath) return NextResponse.next();

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  console.log("Token di middleware:", token);

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname === "/") {
    const role = token.role as string;

    const redirectTo = {
      admin: "/admin/dashboard",
      koordinator: "/koordinator/dashboard",
      sales: "/sales/dashboard",
    }[role];

    if (redirectTo) {
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }

    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/koordinator/:path*", "/sales/:path*", "/"],
};
