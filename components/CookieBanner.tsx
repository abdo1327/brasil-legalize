"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  hasConsentChoice,
  acceptConsent,
  rejectConsent,
} from "@/lib/consent";
import { type Locale, getDictionary, isRTL } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface CookieBannerProps {
  locale: Locale;
}

export function CookieBanner({ locale }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const dict = getDictionary(locale);
  const rtl = isRTL(locale);

  useEffect(() => {
    // Check if user has already made a choice
    if (!hasConsentChoice()) {
      // Small delay for better UX - let the page load first
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setIsAnimating(true);
    acceptConsent();
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleReject = () => {
    setIsAnimating(true);
    rejectConsent();
    setTimeout(() => setIsVisible(false), 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-white border-t border-slate-200 shadow-lg",
        "transform transition-transform duration-300 ease-out",
        isAnimating ? "translate-y-full" : "translate-y-0"
      )}
      dir={rtl ? "rtl" : "ltr"}
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
    >
      <div className="container mx-auto px-4 py-4 md:py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Text Content */}
          <div className="flex-1">
            <h2 id="cookie-banner-title" className="sr-only">
              {dict.cookies.title}
            </h2>
            <p
              id="cookie-banner-description"
              className="text-sm text-slate-600"
            >
              {dict.cookies.bannerText}{" "}
              <Link
                href={`/${locale}/privacy`}
                className="text-primary underline hover:no-underline font-medium"
              >
                {dict.cookies.learnMore}
              </Link>
            </p>
          </div>

          {/* Buttons - Equal prominence as per LGPD */}
          <div className={cn(
            "flex flex-col sm:flex-row gap-3",
            rtl && "sm:flex-row-reverse"
          )}>
            {/* Reject Button - Equal prominence (not hidden or diminished) */}
            <button
              onClick={handleReject}
              className={cn(
                "px-6 py-2.5 text-sm font-medium rounded-lg transition-colors",
                "border border-slate-300 text-slate-700 bg-white",
                "hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500",
                "min-w-[120px] min-h-[44px]" // Touch-friendly size
              )}
            >
              {dict.cookies.reject}
            </button>

            {/* Accept Button - Primary style */}
            <button
              onClick={handleAccept}
              className={cn(
                "px-6 py-2.5 text-sm font-medium rounded-lg transition-colors",
                "text-white bg-primary hover:bg-primary/90",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                "min-w-[120px] min-h-[44px]" // Touch-friendly size
              )}
            >
              {dict.cookies.accept}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
