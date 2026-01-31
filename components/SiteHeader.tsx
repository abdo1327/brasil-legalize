/**
 * Site Header Component
 * Brasil Legalize - Immigration Law Services
 *
 * Responsive navigation header with:
 * - RTL-aware layout for Arabic
 * - Language switcher
 * - Mobile menu
 * - Brazilian color scheme
 *
 * @see lib/i18n.ts for translations
 * @see lib/design-tokens.ts for design system
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type Locale,
  locales,
  localeNames,
  getDictionary,
  isRTL,
  localizePathname,
} from "../lib/i18n";
import { cn } from "../lib/utils";

// ============================================================================
// ICON COMPONENTS
// ============================================================================

function IconMenu({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function IconClose({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconGlobe({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function IconChevron({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// Flag Icons for Language Selector
function FlagArabic({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 18" fill="none">
      <rect width="24" height="6" fill="#006C35" />
      <rect y="6" width="24" height="6" fill="#FFFFFF" />
      <rect y="12" width="24" height="6" fill="#000000" />
      <polygon points="0,0 8,9 0,18" fill="#CE1126" />
    </svg>
  );
}

function FlagEnglish({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 18" fill="none">
      <rect width="24" height="18" fill="#012169" />
      <path d="M0,0 L24,18 M24,0 L0,18" stroke="#FFFFFF" strokeWidth="3" />
      <path d="M0,0 L24,18 M24,0 L0,18" stroke="#C8102E" strokeWidth="2" />
      <path d="M12,0 V18 M0,9 H24" stroke="#FFFFFF" strokeWidth="5" />
      <path d="M12,0 V18 M0,9 H24" stroke="#C8102E" strokeWidth="3" />
    </svg>
  );
}

function FlagSpanish({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 18" fill="none">
      <rect width="24" height="4.5" fill="#AA151B" />
      <rect y="4.5" width="24" height="9" fill="#F1BF00" />
      <rect y="13.5" width="24" height="4.5" fill="#AA151B" />
    </svg>
  );
}

function FlagPortuguese({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 18" fill="none">
      <rect width="9" height="18" fill="#006600" />
      <rect x="9" width="15" height="18" fill="#FF0000" />
      <circle cx="9" cy="9" r="4" fill="#FFCC00" />
      <circle cx="9" cy="9" r="3" fill="#003399" />
    </svg>
  );
}

const localeFlags: Record<Locale, React.ComponentType<{ className?: string }>> = {
  ar: FlagArabic,
  en: FlagEnglish,
  es: FlagSpanish,
  "pt-br": FlagPortuguese,
};

// ============================================================================
// SITE HEADER COMPONENT
// ============================================================================

interface SiteHeaderProps {
  locale: Locale;
}

export function SiteHeader({ locale }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const pathname = usePathname();
  const dict = getDictionary(locale);
  const rtl = isRTL(locale);
  
  // Ensure locale is valid for flag lookup
  const safeLocale = locales.includes(locale) ? locale : 'en';

  const navLinks = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/services`, label: dict.nav.services },
    { href: `/${locale}/process`, label: dict.nav.process },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/faq`, label: dict.nav.faq },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        "border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <div className="container">
        <div
          className={cn(
            "flex h-16 items-center justify-between",
            rtl && "flex-row-reverse"
          )}
        >
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 text-lg font-bold text-foreground hover:text-primary transition-colors"
          >
            <span className="text-2xl">🇧🇷</span>
            <span>{dict.brand.name}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className={cn(
              "hidden lg:flex items-center gap-1",
              rtl && "flex-row-reverse"
            )}
          >
            {(rtl ? [...navLinks].reverse() : navLinks).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "nav-link",
                  isActive(link.href) && "nav-link-active"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div
            className={cn(
              "flex items-center gap-3",
              rtl && "flex-row-reverse"
            )}
          >
            {/* Language Switcher (Desktop) */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                onBlur={() => setTimeout(() => setLangMenuOpen(false), 200)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2",
                  "text-sm text-muted-foreground hover:text-foreground",
                  "border border-transparent hover:border-border",
                  "transition-all duration-200"
                )}
                aria-label={dict.common.language}
              >
                {(() => {
                  const CurrentFlag = localeFlags[safeLocale];
                  return CurrentFlag ? <CurrentFlag className="h-4 w-6 rounded-sm shadow-sm" /> : null;
                })()}
                <span>{localeNames[safeLocale]}</span>
                <IconChevron
                  className={cn(
                    "h-4 w-4 transition-transform",
                    langMenuOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Language Dropdown */}
              {langMenuOpen && (
                <div
                  className={cn(
                    "absolute top-full mt-2 w-44 rounded-lg border border-border bg-background shadow-lg",
                    rtl ? "left-0" : "right-0"
                  )}
                >
                  <div className="p-1">
                    {locales.map((loc) => {
                      const FlagIcon = localeFlags[loc];
                      if (!FlagIcon) return null;
                      return (
                        <Link
                          key={loc}
                          href={localizePathname(pathname, loc)}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm",
                            "transition-colors hover:bg-muted",
                            loc === locale
                              ? "text-primary font-medium bg-primary/5"
                              : "text-muted-foreground"
                          )}
                        >
                          <FlagIcon className="h-4 w-6 rounded-sm shadow-sm" />
                          <span className={loc === "ar" ? "font-arabic" : ""}>
                            {localeNames[loc]}
                          </span>
                          {loc === locale && (
                            <span className="mr-auto text-primary">✓</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <Link
              href={`/${locale}/eligibility`}
              className="hidden sm:inline-flex btn-outline text-sm px-4 py-2"
            >
              {dict.cta.checkEligibility}
            </Link>
            <Link
              href={`/${locale}/apply`}
              className="btn-primary text-sm px-4 py-2"
            >
              {dict.cta.submit}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
              aria-label={dict.common.menu}
            >
              {mobileMenuOpen ? (
                <IconClose className="h-6 w-6" />
              ) : (
                <IconMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className={cn(
              "lg:hidden border-t border-border py-4",
              rtl && "text-right"
            )}
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-base transition-colors",
                    isActive(link.href)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Language Switcher */}
              <div className="mt-4 px-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {dict.common.language}
                </p>
                <div className="flex flex-wrap gap-2">
                  {locales.map((loc) => {
                    const FlagIcon = localeFlags[loc];
                    if (!FlagIcon) return null;
                    return (
                      <Link
                        key={loc}
                        href={localizePathname(pathname, loc)}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors",
                          loc === locale
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        )}
                      >
                        <FlagIcon className="h-4 w-6 rounded-sm shadow-sm" />
                        <span className={loc === "ar" ? "font-arabic" : ""}>
                          {localeNames[loc]}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
