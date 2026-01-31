/**
 * Locale-Aware Layout
 * Brasil Legalize - Immigration Law Services
 *
 * Handles RTL/LTR direction, locale-specific rendering,
 * and provides site-wide header/footer.
 *
 * DEFAULT LOCALE: Arabic (ar) - RTL
 *
 * @see lib/i18n.ts for translations
 * @see lib/design-tokens.ts for design system
 */

import { ReactNode } from "react";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { CookieBanner } from "../../components/CookieBanner";
import { WhatsAppButton } from "../../components/WhatsAppButton";
import { PageTracker } from "../../components/PageTracker";
import {
  type Locale,
  getDictionary,
  getDirection,
  isRTL,
} from "../../lib/i18n";
import { cn } from "../../lib/utils";

export const dynamic = "force-dynamic";

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  const direction = getDirection(locale);
  const rtl = isRTL(locale);
  const dict = getDictionary(locale);

  return (
    <div
      dir={direction}
      data-locale={locale}
      className={cn(
        "min-h-screen flex flex-col",
        rtl && "font-arabic text-right"
      )}
    >
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className={cn(
          "sr-only focus:not-sr-only focus:fixed focus:z-50",
          "focus:top-4 focus:bg-primary focus:text-primary-foreground",
          "focus:px-4 focus:py-2 focus:rounded-md focus:outline-none",
          rtl ? "focus:right-4" : "focus:left-4"
        )}
      >
        {dict.common.menu}
      </a>

      {/* Site Header */}
      <SiteHeader locale={locale} />

      {/* Main Content */}
      <main
        id="main-content"
        className={cn("flex-1", rtl && "text-right")}
        role="main"
      >
        {children}
      </main>

      {/* Site Footer */}
      <SiteFooter locale={locale} />

      {/* Cookie Consent Banner */}
      <CookieBanner locale={locale} />

      {/* WhatsApp Floating Button */}
      <WhatsAppButton locale={locale} />

      {/* Page Visit Tracker */}
      <PageTracker />
    </div>
  );
}
