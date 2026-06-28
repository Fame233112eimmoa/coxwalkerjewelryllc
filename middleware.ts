import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { siteRouteMap } from "./lib/site-routes";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next/") || pathname.startsWith("/assets/")) {
    return NextResponse.next();
  }

  const normalizedPathname =
    pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const fileName = siteRouteMap.get(normalizedPathname);

  if (fileName) {
    return NextResponse.rewrite(new URL(`/${fileName}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/((?!_next|.*\\..*).*)"],
};
