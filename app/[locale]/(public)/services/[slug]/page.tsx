import { Metadata } from "next";
import Link from "next/link";
import { getDictionary, isRTL, type Locale, locales } from "../../../../../lib/i18n";
import { notFound } from "next/navigation";

// Valid service slugs (shared across all locales)
const validSlugs = [
  "visa-renewal",
  "residency-permit",
  "citizenship",
  "business-visa",
  "family-reunification",
  "deportation-defense"
];

export async function generateStaticParams() {
  // Generate paths for all locale + slug combinations
  const paths: { locale: Locale; slug: string }[] = [];
  for (const locale of locales) {
    for (const slug of validSlugs) {
      paths.push({ locale, slug });
    }
  }
  return paths;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!validSlugs.includes(slug)) {
    return { title: "Service Not Found" };
  }

  const dict = getDictionary(locale);
  const serviceKey = slug.replace(/-/g, "") as keyof typeof dict.services.items;
  const service = dict.services.items[serviceKey];

  if (!service) {
    return { title: "Service Not Found" };
  }

  return {
    title: service.title,
    description: service.description,
    alternates: {
      canonical: `/${locale}/services/${slug}`,
      languages: Object.fromEntries(
        locales.map((l) => [l === "pt-br" ? "pt-BR" : l, `/${l}/services/${slug}`])
      ),
    },
  };
}

// SVG Icon Components
function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconDocument({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string; locale: Locale }> }) {
  const { locale, slug } = await params;

  // Validate slug
  if (!validSlugs.includes(slug)) {
    notFound();
  }

  const dict = getDictionary(locale);
  const rtl = isRTL(locale);

  // Map slug to dictionary key (remove hyphens)
  const serviceKey = slug.replace(/-/g, "") as keyof typeof dict.services.items;
  const service = dict.services.items[serviceKey];

  if (!service) {
    notFound();
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-600 py-20">
        <div className="container">
          <div className="max-w-3xl">
            <div className="mb-4">
              <Link 
                href={`/${locale}/services`}
                className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points={rtl ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
                </svg>
                {dict.nav.services}
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-white md:text-5xl">
              {service.title}
            </h1>
            <p className="mt-4 text-lg text-white/90">
              {service.description}
            </p>
            <div className="mt-8">
              <Link href={`/${locale}/contact`} className="btn-secondary">
                {dict.cta.getStarted}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* What's Included */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                {dict.services.title}
              </h2>
              <ul className="space-y-3">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <IconCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service Details Card */}
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <IconClock className="h-6 w-6 text-secondary" />
                  <h3 className="text-lg font-semibold text-slate-800">
                    {dict.process.title}
                  </h3>
                </div>
                <p className="text-slate-600">
                  {dict.process.description}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <IconDocument className="h-6 w-6 text-secondary" />
                  <h3 className="text-lg font-semibold text-slate-800">
                    {dict.contact.form.message}
                  </h3>
                </div>
                <p className="text-sm text-slate-600">
                  {dict.contact.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/20 py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              {dict.cta.getStarted}
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              {dict.contact.subtitle}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href={`/${locale}/contact`} className="btn-primary px-8 py-3">
                {dict.cta.contactUs}
              </Link>
              <Link href={`/${locale}/services`} className="btn-outline px-8 py-3">
                {dict.cta.viewServices}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
