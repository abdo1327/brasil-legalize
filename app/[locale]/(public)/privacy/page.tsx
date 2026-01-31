/**
 * Privacy Policy Page
 * Brasil Legalize - LGPD Compliant Privacy Policy
 *
 * Implements full LGPD (Lei Geral de Proteção de Dados) requirements:
 * - Comprehensive privacy policy content
 * - Data subject rights information
 * - Cookie policy details
 * - Consent management interface
 *
 * @see lib/consent.ts for consent management logic
 * @see components/ConsentManager.tsx for consent UI
 */

import { Metadata } from "next";
import Link from "next/link";
import {
  type Locale,
  getDictionary,
  isRTL,
  locales,
} from "@/lib/i18n";
import { getCookieList, CURRENT_POLICY_VERSION } from "@/lib/consent";
import { ConsentManager } from "@/components/ConsentManager";
import { cn } from "@/lib/utils";

interface PrivacyPageProps {
  params: Promise<{ locale: Locale }>;
}

// Generate static params for all locales
export async function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

// Generate metadata
export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return {
    title: dict.privacy.metaTitle,
    description: dict.privacy.metaDescription,
    openGraph: {
      title: dict.privacy.metaTitle,
      description: dict.privacy.metaDescription,
      type: "website",
    },
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const rtl = isRTL(locale);
  const cookieList = getCookieList();

  // Format the last update date
  const lastUpdateDate = new Date("2026-01-30").toLocaleDateString(
    locale === "pt-br" ? "pt-BR" : locale,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div
      className={cn("min-h-screen bg-slate-50", rtl && "text-right")}
      dir={rtl ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              {dict.privacy.title}
            </h1>
            <p className="text-sm text-slate-500">
              {dict.privacy.lastUpdated}: {lastUpdateDate} • v{CURRENT_POLICY_VERSION}
            </p>
          </header>

          {/* Consent Manager Card */}
          <section className="mb-10">
            <ConsentManager locale={locale} />
          </section>

          {/* Table of Contents */}
          <nav
            className="bg-white rounded-xl border border-slate-200 p-6 mb-10"
            aria-label={dict.privacy.tableOfContents}
          >
            <h2 className="text-sm font-semibold uppercase text-slate-500 mb-4 tracking-wider">
              {dict.privacy.tableOfContents}
            </h2>
            <ul className="space-y-2 text-sm">
              {Object.entries(dict.privacy.toc).map(([key, label]) => (
                <li key={key}>
                  <a
                    href={`#${key}`}
                    className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/30 rounded"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Privacy Policy Content */}
          <article className="bg-white rounded-xl border border-slate-200 p-6 md:p-10">
            <div className="prose prose-slate max-w-none">
              {/* Introduction */}
              <section id="introduction" className="mb-10 scroll-mt-20">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  {dict.privacy.sections.introduction.title}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {dict.privacy.sections.introduction.content}
                </p>
              </section>

              {/* Data Controller */}
              <section id="dataController" className="mb-10 scroll-mt-20">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  {dict.privacy.sections.dataController.title}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {dict.privacy.sections.dataController.content}
                </p>
                <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                  <p className="font-medium text-slate-900">Brasil Legalize</p>
                  <p className="text-slate-600">São Paulo, Brazil</p>
                  <p className="text-slate-600">
                    <a
                      href="mailto:privacy@brasillegalize.com"
                      className="text-primary hover:underline"
                    >
                      privacy@brasillegalize.com
                    </a>
                  </p>
                </div>
              </section>

              {/* Data Collected */}
              <section id="dataCollected" className="mb-10 scroll-mt-20">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  {dict.privacy.sections.dataCollected.title}
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  {dict.privacy.sections.dataCollected.content}
                </p>
                <ul className={cn("space-y-2", rtl ? "pr-4" : "pl-4")}>
                  {dict.privacy.sections.dataCollected.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-slate-600 flex items-start gap-2"
                    >
                      <span className="text-primary mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Data Use */}
              <section id="dataUse" className="mb-10 scroll-mt-20">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  {dict.privacy.sections.dataUse.title}
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  {dict.privacy.sections.dataUse.content}
                </p>
                <ul className={cn("space-y-2", rtl ? "pr-4" : "pl-4")}>
                  {dict.privacy.sections.dataUse.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-slate-600 flex items-start gap-2"
                    >
                      <span className="text-primary mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Legal Basis */}
              <section id="legalBasis" className="mb-10 scroll-mt-20">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  {dict.privacy.sections.legalBasis.title}
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  {dict.privacy.sections.legalBasis.content}
                </p>
                <ul className={cn("space-y-2", rtl ? "pr-4" : "pl-4")}>
                  {dict.privacy.sections.legalBasis.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-slate-600 flex items-start gap-2"
                    >
                      <span className="text-primary mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Data Sharing */}
              <section id="dataSharing" className="mb-10 scroll-mt-20">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  {dict.privacy.sections.dataSharing.title}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {dict.privacy.sections.dataSharing.content}
                </p>
              </section>

              {/* Data Retention */}
              <section id="dataRetention" className="mb-10 scroll-mt-20">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  {dict.privacy.sections.dataRetention.title}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {dict.privacy.sections.dataRetention.content}
                </p>
              </section>

              {/* Your Rights */}
              <section id="yourRights" className="mb-10 scroll-mt-20">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  {dict.privacy.sections.yourRights.title}
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  {dict.privacy.sections.yourRights.content}
                </p>
                <ul className={cn("space-y-2", rtl ? "pr-4" : "pl-4")}>
                  {dict.privacy.sections.yourRights.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-slate-600 flex items-start gap-2"
                    >
                      <span className="text-green-600 mt-1">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Cookies */}
              <section id="cookies" className="mb-10 scroll-mt-20">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  {dict.privacy.sections.cookies.title}
                </h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {dict.privacy.sections.cookies.content}
                </p>

                {/* Cookie Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className={cn("p-3 font-medium text-slate-700", rtl ? "text-right" : "text-left")}>
                          {dict.privacy.cookieTable.name}
                        </th>
                        <th className={cn("p-3 font-medium text-slate-700", rtl ? "text-right" : "text-left")}>
                          {dict.privacy.cookieTable.purpose}
                        </th>
                        <th className={cn("p-3 font-medium text-slate-700", rtl ? "text-right" : "text-left")}>
                          {dict.privacy.cookieTable.type}
                        </th>
                        <th className={cn("p-3 font-medium text-slate-700", rtl ? "text-right" : "text-left")}>
                          {dict.privacy.cookieTable.duration}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cookieList.map((cookie, idx) => (
                        <tr
                          key={cookie.name}
                          className={cn(
                            "border-t border-slate-200",
                            idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                          )}
                        >
                          <td className="p-3 font-mono text-xs text-slate-600">
                            {cookie.name}
                          </td>
                          <td className="p-3 text-slate-600">{cookie.purpose}</td>
                          <td className="p-3">
                            <span
                              className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                cookie.type === "functional"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-amber-100 text-amber-700"
                              )}
                            >
                              {cookie.type}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600">{cookie.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Security */}
              <section id="security" className="mb-10 scroll-mt-20">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  {dict.privacy.sections.security.title}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {dict.privacy.sections.security.content}
                </p>
              </section>

              {/* Contact */}
              <section id="contact" className="scroll-mt-20">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  {dict.privacy.sections.contact.title}
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  {dict.privacy.sections.contact.content}
                </p>
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <a
                    href={`mailto:${dict.privacy.sections.contact.email}`}
                    className="text-primary font-medium hover:underline"
                  >
                    {dict.privacy.sections.contact.email}
                  </a>
                </div>
              </section>
            </div>
          </article>

          {/* Back to Home Link */}
          <div className="mt-10 text-center">
            <Link
              href={`/${locale}`}
              className="text-primary hover:underline text-sm font-medium"
            >
              ← {dict.common.back}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
