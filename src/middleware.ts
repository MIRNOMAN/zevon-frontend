import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DISCONTINUED_PRODUCTS = new Set([
  "/products/monochrome-heavy-knit-co-ord-set",
  "/products/vintage-washed-canvas-distressed-dad-cap",
  "/products/monochrome-ribbed-knit-two-piece-co-ord",
  "/products/high-waisted-tailored-pleated-trousers",
  "/products/280-gsm-acid-washed-boxy-tee",
  "/products/structured-oversized-trench-coat",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Intercept broken link / typo '/$' or '/%24'
  if (pathname === "/$" || pathname === "/%24") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url, 301);
  }

  // 2. Intercept discontinued products and redirect to /shop (301 Permanent Redirect)
  const normalizedPath = pathname.replace(/\/+$/, "");
  if (DISCONTINUED_PRODUCTS.has(normalizedPath)) {
    const url = request.nextUrl.clone();
    url.pathname = "/shop";
    return NextResponse.redirect(url, 301);
  }

  // 3. Fallback for /products itself to /shop
  if (normalizedPath === "/products") {
    const url = request.nextUrl.clone();
    url.pathname = "/shop";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, svgs, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

