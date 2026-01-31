export function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="py-12">
      <div className="container">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
