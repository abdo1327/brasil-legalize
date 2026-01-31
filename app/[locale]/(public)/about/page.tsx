import { Metadata } from "next";
import { getDictionary, isRTL, type Locale, locales } from "../../../../lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return {
    title: dict.about.title,
    description: dict.about.description,
    alternates: {
      canonical: `/${locale}/about`,
      languages: Object.fromEntries(
        locales.map((l) => [l === "pt-br" ? "pt-BR" : l, `/${l}/about`])
      ),
    },
  };
}

// SVG Icon Components for Values
function IconHandshake({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
    </svg>
  );
}

function IconBolt({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function IconGlobe({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function IconStar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}

const ValueIcons = [IconHandshake, IconBolt, IconGlobe, IconStar];

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const rtl = isRTL(locale);

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            {dict.about.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            {dict.about.subtitle}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              {dict.about.mission.title}
            </span>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              {dict.about.mission.description}
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-20">
        <div className="container">
          <h2 className="text-center text-3xl font-bold text-slate-800">
            {dict.about.values.title}
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {dict.about.values.items.map((value, index) => {
              const Icon = ValueIcons[index % ValueIcons.length];
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white p-8 text-center shadow-sm transition-all hover:shadow-lg"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-800">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-slate-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-slate-800">
              {dict.about.team.title}
            </h2>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              {dict.about.team.description}
            </p>
          </div>

          {/* Stats */}
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            <div className="rounded-2xl border-2 border-primary bg-primary/5 p-8 text-center">
              <span className="text-4xl font-bold text-primary">500+</span>
              <p className="mt-2 text-slate-600">{dict.home.stats.cases}</p>
            </div>
            <div className="rounded-2xl border-2 border-secondary bg-secondary/5 p-8 text-center">
              <span className="text-4xl font-bold text-secondary">50+</span>
              <p className="mt-2 text-slate-600">{dict.home.stats.countries}</p>
            </div>
            <div className="rounded-2xl border-2 border-accent bg-accent/5 p-8 text-center">
              <span className="text-4xl font-bold text-accent-dark">98%</span>
              <p className="mt-2 text-slate-600">{dict.home.stats.satisfaction}</p>
            </div>
            <div className="rounded-2xl border-2 border-primary bg-primary/5 p-8 text-center">
              <span className="text-4xl font-bold text-primary">10+</span>
              <p className="mt-2 text-slate-600">{dict.home.stats.experience}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-white">
            {dict.contact.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/90">
            {dict.contact.subtitle}
          </p>
          <a
            href={`/${locale}/contact`}
            className="mt-8 inline-block rounded-xl bg-white px-8 py-4 font-bold text-secondary shadow-lg transition-all hover:shadow-xl hover:scale-105"
          >
            {dict.cta.submit}
          </a>
        </div>
      </section>
    </div>
  );
}
