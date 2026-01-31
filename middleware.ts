import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["ar", "en", "es", "pt-br"];
const defaultLocale = "ar";

// Admin pages that were moved to dashboard folder - redirect old URLs
const adminRedirects: Record<string, string> = {
  '/admin/clients': '/admin/dashboard/clients',
  '/admin/contacts': '/admin/dashboard/contacts',
  '/admin/documents': '/admin/dashboard/documents',
  '/admin/pricing': '/admin/dashboard/pricing',
  '/admin/notifications': '/admin/dashboard/notifications',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Handle admin redirects for moved pages
  for (const [oldPath, newPath] of Object.entries(adminRedirects)) {
    if (pathname === oldPath || pathname.startsWith(oldPath + '/')) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.replace(oldPath, newPath);
      return NextResponse.redirect(url);
    }
  }

  // Skip locale redirect for design-system and admin routes
  if (pathname.startsWith("/design-system") || pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const hasLocale = locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
  if (!hasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"]
};
