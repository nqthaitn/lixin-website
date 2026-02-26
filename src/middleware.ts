import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip i18n for admin and API routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    return;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(vi|en|zh)/:path*", "/admin/:path*", "/api/:path*"],
};
