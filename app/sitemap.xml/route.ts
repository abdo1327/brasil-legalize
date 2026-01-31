import { NextResponse } from "next/server";
import { locales } from "@/lib/i18n";

const routes = [
  "",
  "/services",
  "/process",
  "/about",
  "/faq",
  "/contact",
  "/pricing",
  "/privacy",
];

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.APP_URL ||
    "https://maocean360.com"
  ).replace(/\/$/, "");
}

export const revalidate = 60 * 60 * 24;

export async function GET() {
  const baseUrl = getBaseUrl();
  const lastModified = new Date().toISOString();

  const urls = locales.flatMap((locale) =>
    routes.map((route) => {
      const path = route ? `/${locale}${route}` : `/${locale}`;
      return `  <url>\n    <loc>${baseUrl}${path}</loc>\n    <lastmod>${lastModified}</lastmod>\n    <changefreq>${route === "" ? "weekly" : "monthly"}</changefreq>\n    <priority>${route === "" ? "1.0" : "0.8"}</priority>\n  </url>`;
    })
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join(
    "\n"
  )}\n</urlset>\n`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}
