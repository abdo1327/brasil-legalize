import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";

/**
 * Sitemap Generation
 * Brasil Legalize - Immigration Law Services
 *
 * Generates sitemap.xml with all public pages in all 4 locales
 * Includes: home, services, process, about, faq, contact
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://brasillegalize.com";

  // Define all public routes
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

  // Generate entries for each locale + route combination
  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [
              l === "pt-br" ? "pt-BR" : l,
              `${baseUrl}/${l}${route}`,
            ])
          ),
        },
      });
    }
  }

  return sitemapEntries;
}
