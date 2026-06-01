import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  DASHBOARD_AUTH_COOKIE,
  verifySessionToken,
} from "@/lib/dashboard-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/dashboard/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(DASHBOARD_AUTH_COOKIE)?.value;
  if (await verifySessionToken(token)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/dashboard/login", request.url);
  if (pathname !== "/dashboard") {
    loginUrl.searchParams.set("from", pathname);
  }
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
