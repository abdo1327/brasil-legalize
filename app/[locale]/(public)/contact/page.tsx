"use client";

import { useState } from "react";
import { getDictionary, isRTL, type Locale } from "../../../../lib/i18n";

// Note: Metadata cannot be exported from client components
// Parent layout handles SEO for this page

// SVG Icon Components
function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function IconEmail({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function IconLocation({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function ContactPage({ params }: { params: { locale: Locale } }) {
  const dict = getDictionary(params.locale);
  const rtl = isRTL(params.locale);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-secondary py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            {dict.contact.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            {dict.contact.subtitle}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {dict.contact.info.title}
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                {dict.contact.description}
              </p>

              <div className="mt-8 space-y-6">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg hover:border-primary"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
                    <IconWhatsApp className="h-6 w-6 text-white" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-800">WhatsApp</h3>
                    <p className="text-slate-600">{dict.contact.info.phone}</p>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${dict.contact.info.email}`}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg hover:border-secondary"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    <IconEmail className="h-6 w-6 text-white" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-800">{dict.contact.form.email}</h3>
                    <p className="text-slate-600">{dict.contact.info.email}</p>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                    <IconLocation className="h-6 w-6 text-slate-800" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-800">{dict.contact.info.address}</h3>
                    <p className="text-slate-600">São Paulo, Brazil</p>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="mt-8 rounded-xl bg-slate-50 p-6">
                <h3 className="font-bold text-slate-800">{dict.contact.info.hours}</h3>
                <p className="mt-2 text-slate-600">
                  {dict.contact.info.hoursValue}
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-800">
                {dict.contact.form.message}
              </h2>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    {dict.contact.form.name}
                  </label>
                  <input
                    type="text"
                    required
                    className="input mt-2"
                    placeholder={dict.contact.form.namePlaceholder}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    {dict.contact.form.email}
                  </label>
                  <input
                    type="email"
                    required
                    className="input mt-2"
                    placeholder={dict.contact.form.emailPlaceholder}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    {dict.contact.form.phone}
                  </label>
                  <input
                    type="tel"
                    className="input mt-2"
                    placeholder={dict.contact.form.phonePlaceholder}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    {dict.contact.form.message}
                  </label>
                  <textarea
                    rows={5}
                    required
                    className="input mt-2 resize-none"
                    placeholder={dict.contact.form.messagePlaceholder}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn-primary w-full text-lg py-4 text-white">
                  {dict.cta.sendMessage}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
