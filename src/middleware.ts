import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getBaseUrl(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = request.headers.get("host") ?? forwardedHost ?? new URL(request.url).host;
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  return `${proto}://${forwardedHost ?? host}`;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = request.cookies.get("admin_session");
    if (!session?.value || session.value !== "1") {
      const baseUrl = getBaseUrl(request);
      return NextResponse.redirect(new URL("/admin/login", baseUrl));
    }
  }

  const res = NextResponse.next();
  // Prevent caching admin pages so Server Action IDs stay in sync after redeploys
  if (pathname.startsWith("/admin")) {
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  }
  return res;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
