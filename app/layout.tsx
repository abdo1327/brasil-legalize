/**
 * Root Layout
 * Brasil Legalize - Immigration Law Services
 *
 * DEFAULT LOCALE: Arabic (ar) - RTL
 *
 * This root layout provides:
 * - Arabic (Noto Sans Arabic) and Latin (Inter) fonts
 * - Global styles and design tokens
 * - RTL-ready base configuration
 *
 * @see lib/i18n.ts for i18n configuration
 * @see lib/design-tokens.ts for design system
 */

import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

// ============================================================================
// FONTS
// ============================================================================

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-noto-arabic",
  weight: ["300", "400", "500", "600", "700"],
});

// ============================================================================
// METADATA
// ============================================================================

export const metadata: Metadata = {
  title: {
    default: "برازيل ليجالايز | شريكك القانوني الموثوق في البرازيل",
    template: "%s | برازيل ليجالايز",
  },
  description:
    "خدمات قانونية متخصصة في الهجرة والإقامة والجنسية البرازيلية. نخدم العملاء بالعربية والإنجليزية والإسبانية والبرتغالية.",
  keywords: [
    "محامي هجرة برازيل",
    "تأشيرة برازيل",
    "إقامة برازيل",
    "جنسية برازيل",
    "Brazil immigration lawyer",
    "Brazilian visa",
  ],
  authors: [{ name: "Brasil Legalize" }],
  creator: "Brasil Legalize",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://brasillegalize.com"
  ),
  openGraph: {
    type: "website",
    locale: "ar",
    alternateLocale: ["en", "es", "pt_BR"],
    siteName: "برازيل ليجالايز",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@brasillegalize",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#00b27f", // Brazilian green
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// ============================================================================
// ROOT LAYOUT
// ============================================================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${inter.variable} ${notoSansArabic.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Remix Icons */}
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css"
          rel="stylesheet"
        />
        {/* Default to Arabic */}
        <link rel="alternate" hrefLang="ar" href="/ar" />
        <link rel="alternate" hrefLang="en" href="/en" />
        <link rel="alternate" hrefLang="es" href="/es" />
        <link rel="alternate" hrefLang="pt-br" href="/pt-br" />
        <link rel="alternate" hrefLang="x-default" href="/ar" />
      </head>
      <body className="min-h-screen bg-background font-arabic antialiased">
        {children}
      </body>
    </html>
  );
}
