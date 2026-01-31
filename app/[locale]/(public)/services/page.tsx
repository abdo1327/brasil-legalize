import { Metadata } from "next";
import Link from "next/link";
import { getDictionary, isRTL, type Locale, locales } from "../../../../lib/i18n";
import { PackageSection } from "../../../../components/PackageSection";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return {
    title: dict.services.title,
    description: dict.services.description,
    alternates: {
      canonical: `/${locale}/services`,
      languages: Object.fromEntries(
        locales.map((l) => [l === "pt-br" ? "pt-BR" : l, `/${l}/services`])
      ),
    },
  };
}

// Service icon mapping with colors
const serviceIcons: Record<string, { icon: string; color: string }> = {
  visa: { icon: 'ri-passport-line', color: 'primary' },
  residency: { icon: 'ri-home-4-line', color: 'secondary' },
  citizenship: { icon: 'ri-flag-line', color: 'accent' },
  business: { icon: 'ri-briefcase-line', color: 'secondary' },
  family: { icon: 'ri-parent-line', color: 'primary' },
  deportation: { icon: 'ri-shield-user-line', color: 'accent' },
};

export default async function ServicesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const rtl = isRTL(locale);
  const services = dict.services.items;

  return (
    <div dir={rtl ? 'rtl' : 'ltr'}>
      {/* Hero */}
      <section className="bg-primary py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            {dict.services.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            {dict.services.subtitle}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(services).map(([key, service]) => {
              const iconData = serviceIcons[key] || { icon: 'ri-service-line', color: 'primary' };
              const colorClasses: Record<string, { text: string; bg: string; border: string }> = {
                primary: { text: 'text-primary', bg: 'bg-primary/10', border: 'border-primary' },
                secondary: { text: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary' },
                accent: { text: 'text-accent', bg: 'bg-accent/10', border: 'border-accent' },
              };
              const colors = colorClasses[iconData.color] || colorClasses.primary;

              return (
                <div
                  key={key}
                  className={`bg-white border-2 border-neutral-200 rounded-2xl p-6 hover:${colors.border} hover:shadow-lg transition-all group`}
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}>
                    <i className={`${iconData.icon} text-2xl ${colors.text}`}></i>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-neutral-600 mb-4 text-sm">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {service.features.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-neutral-700">
                        <i className={`ri-check-line ${colors.text}`}></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <PackageSection locale={locale} />

      {/* CTA */}
      <section className="bg-neutral-100 py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-neutral-900">
            {dict.contact.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-neutral-600">
            {dict.contact.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <a
              href="https://wa.me/5541984548337"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
            >
              <i className="ri-whatsapp-line text-xl"></i>
              WhatsApp
            </a>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary bg-white px-8 py-4 font-bold text-primary transition-all hover:bg-primary hover:text-white"
            >
              <i className="ri-mail-line text-xl"></i>
              {dict.cta.submit}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
