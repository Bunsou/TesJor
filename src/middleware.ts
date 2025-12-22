import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/server/services/auth";
import { log } from "@/shared/utils/logger";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public routes (sign-in page and auth API)
  const publicRoutes = ["/sign-in", "/api/auth"];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow homepage to handle its own redirect logic
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Get session
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Protect authenticated routes
  if (
    pathname.startsWith("/(main)") ||
    pathname.includes("/explore") ||
    pathname.includes("/map") ||
    pathname.includes("/saved") ||
    pathname.includes("/profile")
  ) {
    if (!session) {
      log.warn("Unauthorized access attempt", { pathname });
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // Protect admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!session) {
      log.warn("Unauthorized admin access attempt", { pathname });
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const user = session.user as { role?: string };
    if (user.role !== "admin") {
      log.warn("Non-admin user attempted admin access", {
        pathname,
        userId: session.user.id,
        email: session.user.email,
      });
      return NextResponse.redirect(new URL("/explore", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|fonts|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
