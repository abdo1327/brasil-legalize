/**
 * Home Page - Localized Marketing Landing
 * Brasil Legalize - Immigration Law Services
 *
 * DEFAULT LOCALE: Arabic (ar) - RTL
 *
 * This page serves as the main marketing landing page featuring:
 * - Hero section with CTA
 * - Features/Why Choose Us
 * - Services overview
 * - Process steps
 * - Stats/Social proof
 * - Testimonials preview
 *
 * @see lib/i18n.ts for translations
 * @see lib/design-tokens.ts for design system
 */

import { Metadata } from "next";
import Link from "next/link";
import {
  type Locale,
  getDictionary,
  isRTL,
  locales,
} from "../../lib/i18n";
import { cn } from "../../lib/utils";

// ============================================================================
// METADATA
// ============================================================================

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return {
    title: dict.home.hero.title,
    description: dict.home.hero.description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        locales.map((l) => [l === "pt-br" ? "pt-BR" : l, `/${l}`])
      ),
    },
  };
}

// ============================================================================
// ICON COMPONENTS (Remix Icons style - outline)
// ============================================================================

function IconScale({ className }: { className?: string }) {
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
      <path d="M12 3v18" />
      <path d="m4 8 3-3 3 3" />
      <path d="m4 16 3 3 3-3" />
      <path d="m14 8 3-3 3 3" />
      <path d="m14 16 3 3 3-3" />
      <path d="M4 12h16" />
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

function IconEye({ className }: { className?: string }) {
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
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconTrophy({ className }: { className?: string }) {
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
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function IconArrowRight({ className }: { className?: string }) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const rtl = isRTL(locale);

  const featureIcons = [IconScale, IconGlobe, IconEye, IconTrophy];

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section
        className={cn(
          "relative overflow-hidden py-20 md:py-32",
          "bg-white border-b border-border/50"
        )}
      >
        {/* Decorative background - subtle shapes */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className={cn(
              "absolute -top-24 h-96 w-96 rounded-full bg-primary/5",
              rtl ? "-right-24" : "-left-24"
            )}
          />
          <div
            className={cn(
              "absolute -bottom-24 h-80 w-80 rounded-full bg-secondary/5",
              rtl ? "-left-24" : "-right-24"
            )}
          />
        </div>

        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-sm font-medium text-primary">
                {dict.home.hero.subtitle}
              </span>
            </div>

            {/* Title */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              {dict.home.hero.title}
            </h1>

            {/* Description */}
            <p className="mb-10 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              {dict.home.hero.description}
            </p>

            {/* CTA Buttons */}
            <div
              className={cn(
                "flex flex-col sm:flex-row items-center justify-center gap-4",
                rtl && "sm:flex-row-reverse"
              )}
            >
              <Link
                href={`/${locale}/book`}
                className="btn-primary group w-full sm:w-auto px-8 py-3.5 text-base shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
              >
                {dict.cta.submit}
                <IconArrowRight
                  className={cn(
                    "h-5 w-5 transition-transform group-hover:translate-x-1",
                    rtl && "rotate-180 group-hover:-translate-x-1"
                  )}
                />
              </Link>
              <Link
                href={`/${locale}/services`}
                className="btn-secondary w-full sm:w-auto px-8 py-3.5 text-base"
              >
                {dict.cta.viewServices}
              </Link>
            </div>

            {/* Trust indicators */}
            <div className={cn(
              "mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground",
              rtl && "text-right"
            )}>
              <div className={cn("flex items-center gap-2", rtl && "flex-row-reverse")}>
                <IconCheck className="h-5 w-5 text-primary" />
                <span>{locale === "ar" ? "استشارة مجانية" : "Free Consultation"}</span>
              </div>
              <div className={cn("flex items-center gap-2", rtl && "flex-row-reverse")}>
                <IconCheck className="h-5 w-5 text-primary" />
                <span>{locale === "ar" ? "متابعة شفافة" : "Transparent Tracking"}</span>
              </div>
              <div className={cn("flex items-center gap-2", rtl && "flex-row-reverse")}>
                <IconCheck className="h-5 w-5 text-secondary" />
                <span>{locale === "ar" ? "دعم متعدد اللغات" : "Multilingual Support"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="section bg-background">
        <div className="container">
          <div className="section-header mb-16">
            <h2 className="section-title">{dict.home.features.title}</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {dict.home.features.items.map((feature, index) => {
              const Icon = featureIcons[index];
              return (
                <div
                  key={index}
                  className={cn(
                    "card-glass p-6 text-center",
                    "transition-all duration-300 hover:-translate-y-1"
                  )}
                >
                  <div
                    className={cn(
                      "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl",
                      index === 0 && "bg-primary/10 text-primary",
                      index === 1 && "bg-secondary/10 text-secondary",
                      index === 2 && "bg-accent/20 text-accent-600",
                      index === 3 && "bg-primary/10 text-primary"
                    )}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== SERVICES PREVIEW SECTION ===== */}
      <section className="section bg-muted/30">
        <div className="container">
          <div className="section-header mb-16">
            <h2 className="section-title">{dict.services.title}</h2>
            <p className="section-subtitle">{dict.services.subtitle}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(dict.services.items)
              .slice(0, 6)
              .map(([key, service]) => (
                <Link
                  key={key}
                  href={`/${locale}/services/${key}`}
                  className={cn(
                    "card group p-6",
                    "transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
                  )}
                >
                  <h3 className="mb-3 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.slice(0, 3).map((feat, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <IconCheck className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </Link>
              ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href={`/${locale}/services`}
              className="btn-outline px-8 py-3"
            >
              {dict.cta.viewServices}
              <IconArrowRight
                className={cn("h-5 w-5", rtl && "rotate-180")}
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PROCESS SECTION ===== */}
      <section className="section bg-muted/20">
        <div className="container">
          <div className="section-header mb-16">
            <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
              {dict.process.subtitle}
            </span>
            <h2 className="section-title">{dict.process.title}</h2>
            <p className="section-subtitle">{dict.process.description}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {dict.process.steps.map((step, index) => (
              <div
                key={index}
                className={cn(
                  "relative bg-white rounded-xl p-6 shadow-sm border border-border/50",
                  "hover:shadow-md hover:border-primary/30 transition-all duration-300",
                  rtl && "text-right"
                )}
              >
                {/* Step number badge */}
                <div
                  className={cn(
                    "absolute -top-3 flex h-8 w-8 items-center justify-center rounded-full",
                    "bg-primary text-primary-foreground font-bold text-sm shadow-md",
                    rtl ? "right-4" : "left-4"
                  )}
                >
                  {index + 1}
                </div>

                {/* Connector line (hidden on mobile and last item) */}
                {index < dict.process.steps.length - 1 && (
                  <div
                    className={cn(
                      "hidden xl:block absolute top-1/2 w-6 border-t-2 border-dashed border-primary/30",
                      rtl ? "-left-6" : "-right-6"
                    )}
                  />
                )}

                {/* Content */}
                <div className="pt-4">
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link
              href={`/${locale}/process`}
              className="btn-secondary inline-flex items-center gap-2 px-6 py-3"
            >
              {dict.cta.learnMore}
              <IconArrowRight className={cn("h-4 w-4", rtl && "rotate-180")} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="section bg-primary text-primary-foreground">
        <div className="container">
          <h2 className="text-center text-3xl font-bold mb-12">
            {dict.home.stats.title}
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "1000+", label: dict.home.stats.cases },
              { value: "50+", label: dict.home.stats.countries },
              { value: "98%", label: dict.home.stats.satisfaction },
              { value: "15+", label: dict.home.stats.experience },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-2 text-4xl font-bold text-accent md:text-5xl">
                  {stat.value}
                </div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="section bg-secondary/5">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              {dict.faq.contact.title}
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              {dict.faq.contact.description}
            </p>
            <div
              className={cn(
                "flex flex-col sm:flex-row items-center justify-center gap-4",
                rtl && "sm:flex-row-reverse"
              )}
            >
              <Link
                href={`/${locale}/contact`}
                className="btn-primary px-8 py-3.5 text-base"
              >
                {dict.cta.contactUs}
              </Link>
              <Link
                href={`/${locale}/book`}
                className="btn-outline px-8 py-3.5 text-base"
              >
                {dict.cta.scheduleConsult}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
