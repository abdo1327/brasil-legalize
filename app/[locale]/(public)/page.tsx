import Link from "next/link";
import { getDictionary } from "../../../lib/i18n";
import { Section } from "../../../components/Section";

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: { params: Promise<{ locale: "en" | "ar" | "es" | "pt-br" }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <div>
      <section className="bg-slate-50 py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <span className="badge">Trusted migration specialists</span>
              <h1 className="mt-4 text-4xl font-semibold text-slate-900">{dict.home.hero.title}</h1>
              <p className="mt-4 text-base text-slate-600">{dict.home.hero.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link className="btn-primary" href={`/${locale}/eligibility`}>{dict.cta.checkEligibility}</Link>
                <Link className="btn-outline" href={`/${locale}/book`}>{dict.cta.scheduleConsult}</Link>
                <a className="btn-outline" href="https://wa.me/000000000">{dict.cta.sendMessage}</a>
              </div>
            </div>
            <div className="card p-6">
              <h3 className="text-lg font-semibold">Success-driven process</h3>
              <p className="mt-3 text-sm text-slate-600">Before travel, during processing, after arrival. Clear milestones, no logins.</p>
              <div className="mt-6 grid gap-3">
                <div className="card p-4">Eligibility → Consultation → Docs → Submission</div>
                <div className="card p-4">Milestone updates via private link</div>
                <div className="card p-4">Secure uploads with expiring tokens</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section title="Services" subtitle="Citizenship, residency, and documentation support">
        <div className="grid gap-4 md:grid-cols-3">
          {["Citizenship by descent", "Residency pathways", "Document translation"].map((item) => (
            <div key={item} className="card p-6">
              <h3 className="text-base font-semibold">{item}</h3>
              <p className="mt-2 text-sm text-slate-600">Who it’s for, what we do, required documents, and timelines.</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Process" subtitle="Step-by-step end-to-end journey">
        <div className="grid gap-4 md:grid-cols-4">
          {["Before travel", "During travel", "After arrival", "Final approval"].map((step) => (
            <div key={step} className="card p-5 text-sm text-slate-600">{step}</div>
          ))}
        </div>
      </Section>

      <Section title="Trust & Results" subtitle="Credentials, partners, and client outcomes">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="text-base font-semibold">Licensed partners</h3>
            <p className="mt-2 text-sm text-slate-600">Partnered with accredited legal advisors and translation services.</p>
          </div>
          <div className="card p-6">
            <h3 className="text-base font-semibold">Client success stories</h3>
            <p className="mt-2 text-sm text-slate-600">Real outcomes, no confidential details.</p>
          </div>
        </div>
      </Section>
    </div>
  );
}
