import { Metadata } from "next";
import { getDictionary, isRTL, type Locale, locales } from "../../../../lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return {
    title: dict.process.title,
    description: dict.process.description,
    alternates: {
      canonical: `/${locale}/process`,
      languages: Object.fromEntries(
        locales.map((l) => [l === "pt-br" ? "pt-BR" : l, `/${l}/process`])
      ),
    },
  };
}

export default async function ProcessPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const rtl = isRTL(locale);

  const colors = ["bg-primary", "bg-secondary", "bg-accent", "bg-primary", "bg-secondary"];

  return (
    <div>
      {/* Hero */}
      <section className="bg-secondary py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            {dict.process.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            {dict.process.subtitle}
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2">
            {dict.process.steps.map((step, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg"
              >
                {/* Step Number Badge */}
                <div className={`absolute ${rtl ? 'left-6' : 'right-6'} top-6 flex h-14 w-14 items-center justify-center rounded-full ${colors[index % colors.length]} text-xl font-bold text-white shadow-lg`}>
                  {String(index + 1).padStart(2, '0')}
                </div>
                
                <div className={`${rtl ? 'pl-20' : 'pr-20'}`}>
                  <h3 className="text-xl font-bold text-slate-800">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Decorative line */}
                <div className={`absolute bottom-0 ${rtl ? 'right-0' : 'left-0'} h-1 w-0 ${colors[index % colors.length]} transition-all group-hover:w-full`} />
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="mb-6 text-lg text-slate-600">
              {dict.contact.subtitle}
            </p>
            <a href={`/${locale}/contact`} className="btn-primary text-lg px-8 py-4">
              {dict.cta.submit}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
