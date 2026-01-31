/**
 * Terms and Conditions Page
 * Brasil Legalize - Legal Terms of Service
 *
 * Provides comprehensive terms of service that comply
 * with Brazilian law and international standards.
 *
 * @see app/[locale]/(public)/privacy/page.tsx for related privacy policy
 */

import { Metadata } from "next";
import Link from "next/link";
import {
  type Locale,
  getDictionary,
  isRTL,
  locales,
} from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface TermsPageProps {
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
}: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return {
    title: dict.terms.metaTitle,
    description: dict.terms.metaDescription,
    openGraph: {
      title: dict.terms.metaTitle,
      description: dict.terms.metaDescription,
      type: "website",
    },
  };
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const rtl = isRTL(locale);

  // Format the last update date
  const lastUpdateDate = new Date("2026-01-30").toLocaleDateString(
    locale === "pt-br" ? "pt-BR" : locale,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Section keys for rendering
  const sectionKeys = [
    "acceptance",
    "services",
    "userResponsibilities",
    "intellectualProperty",
    "limitation",
    "disputes",
    "governingLaw",
    "changes",
    "contact",
  ] as const;

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
              {dict.terms.title}
            </h1>
            <p className="text-sm text-slate-500">
              {dict.terms.lastUpdated}: {lastUpdateDate}
            </p>
          </header>

          {/* Quick Links */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-10">
            <p className="text-sm text-slate-600">
              {locale === "ar"
                ? "يرجى قراءة هذه الشروط بعناية قبل استخدام خدماتنا. اطلع أيضاً على "
                : locale === "es"
                ? "Por favor lee estos términos cuidadosamente antes de usar nuestros servicios. También consulta nuestra "
                : locale === "pt-br"
                ? "Por favor, leia estes termos com atenção antes de usar nossos serviços. Consulte também nossa "
                : "Please read these terms carefully before using our services. Also see our "}
              <Link
                href={`/${locale}/privacy`}
                className="text-primary hover:underline font-medium"
              >
                {dict.footer.privacy}
              </Link>
              .
            </p>
          </div>

          {/* Terms Content */}
          <article className="bg-white rounded-xl border border-slate-200 p-6 md:p-10">
            <div className="prose prose-slate max-w-none">
              {sectionKeys.map((key, index) => {
                const section = dict.terms.sections[key];
                return (
                  <section
                    key={key}
                    id={key}
                    className={cn("scroll-mt-20", index > 0 && "mt-10 pt-10 border-t border-slate-100")}
                  >
                    <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      {section.title}
                    </h2>
                    <p className="text-slate-600 leading-relaxed">
                      {section.content}
                    </p>
                  </section>
                );
              })}
            </div>
          </article>

          {/* Legal Notice */}
          <div className="mt-10 bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">
                  {locale === "ar"
                    ? "إشعار قانوني"
                    : locale === "es"
                    ? "Aviso Legal"
                    : locale === "pt-br"
                    ? "Aviso Legal"
                    : "Legal Notice"}
                </h3>
                <p className="text-sm text-amber-800">
                  {locale === "ar"
                    ? "هذه الشروط تخضع للقانون البرازيلي. باستخدام خدماتنا، فإنك توافق على الخضوع للاختصاص القضائي الحصري للمحاكم البرازيلية."
                    : locale === "es"
                    ? "Estos términos se rigen por la ley brasileña. Al usar nuestros servicios, aceptas someterte a la jurisdicción exclusiva de los tribunales brasileños."
                    : locale === "pt-br"
                    ? "Estes termos são regidos pela lei brasileira. Ao usar nossos serviços, você concorda em se submeter à jurisdição exclusiva dos tribunais brasileiros."
                    : "These terms are governed by Brazilian law. By using our services, you agree to submit to the exclusive jurisdiction of Brazilian courts."}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href={`/${locale}`}
              className="text-primary hover:underline font-medium"
            >
              ← {dict.common.back}
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              href={`/${locale}/privacy`}
              className="text-primary hover:underline font-medium"
            >
              {dict.footer.privacy}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
