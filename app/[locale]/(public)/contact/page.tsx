"use client";

import { useState } from "react";
import { getDictionary, isRTL, type Locale } from "../../../../lib/i18n";

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

function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function IconLoader({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" className="animate-spin origin-center" />
    </svg>
  );
}

export default function ContactPage({ params }: { params: { locale: Locale } }) {
  // Note: Client component - params are resolved synchronously by Next.js at render time
  const dict = getDictionary(params.locale);
  const rtl = isRTL(params.locale);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          locale: params.locale,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success message translations
  const successMessages = {
    en: {
      title: "Message Sent!",
      description: "Thank you for contacting us. Our team will get back to you within 24 hours.",
      sendAnother: "Send Another Message",
    },
    ar: {
      title: "تم إرسال الرسالة!",
      description: "شكراً لتواصلك معنا. سيتواصل معك فريقنا خلال 24 ساعة.",
      sendAnother: "إرسال رسالة أخرى",
    },
    es: {
      title: "¡Mensaje Enviado!",
      description: "Gracias por contactarnos. Nuestro equipo se comunicará con usted dentro de las 24 horas.",
      sendAnother: "Enviar Otro Mensaje",
    },
    "pt-br": {
      title: "Mensagem Enviada!",
      description: "Obrigado por entrar em contato. Nossa equipe responderá em até 24 horas.",
      sendAnother: "Enviar Outra Mensagem",
    },
  };

  const successText = successMessages[params.locale] || successMessages.en;

  return (
    <div dir={rtl ? 'rtl' : 'ltr'}>
      {/* Hero - Smaller heading */}
      <section className="bg-secondary py-10 md:py-12">
        <div className="container text-center">
          <h1 className="text-xl font-bold text-white md:text-2xl">
            {dict.contact.title}
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-white/90 md:text-base">
            {dict.contact.subtitle}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-10 md:py-12">
        <div className="container">
          <div className={`grid gap-8 lg:grid-cols-2 lg:gap-12 ${rtl ? 'lg:grid-flow-dense' : ''}`}>
            {/* Contact Info */}
            <div className={rtl ? 'lg:col-start-2' : ''}>
              <h2 className="text-lg font-bold text-slate-800 md:text-xl">
                {dict.contact.info.title}
              </h2>
              <p className="mt-3 text-slate-600 leading-relaxed">
                {dict.contact.description}
              </p>

              <div className="mt-6 space-y-3">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:shadow-lg hover:border-primary"
                  dir="ltr"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
                    <IconWhatsApp className="h-4 w-4 text-white" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">WhatsApp</h3>
                    <p className="text-sm text-slate-600">{dict.contact.info.phone}</p>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${dict.contact.info.email}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:shadow-lg hover:border-secondary"
                  dir="ltr"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
                    <IconEmail className="h-4 w-4 text-white" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">{dict.contact.form.email}</h3>
                    <p className="text-sm text-slate-600">{dict.contact.info.email}</p>
                  </div>
                </a>

                {/* Location */}
                <div 
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"
                  dir="ltr"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent">
                    <IconLocation className="h-4 w-4 text-slate-800" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">{dict.contact.info.address}</h3>
                    <p className="text-sm text-slate-600">São Paulo, Brazil</p>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="mt-5 rounded-xl bg-slate-50 p-4" dir="ltr">
                <h3 className="text-sm font-semibold text-slate-800">{dict.contact.info.hours}</h3>
                <p className="mt-1 text-sm text-slate-600">
                  {dict.contact.info.hoursValue}
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className={`rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm ${rtl ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
                    <IconCheck className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-3">
                    {successText.title}
                  </h2>
                  <p className="text-slate-600 max-w-sm mb-6">
                    {successText.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-secondary hover:text-secondary/80 font-semibold underline-offset-4 hover:underline"
                  >
                    {successText.sendAnother}
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-slate-800 md:text-2xl">
                    {dict.contact.form.message}
                  </h2>

                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700">
                        {dict.contact.form.message}
                      </label>
                      <textarea
                        rows={4}
                        required
                        className="input mt-2 resize-none"
                        placeholder={dict.contact.form.messagePlaceholder}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        disabled={isSubmitting}
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="btn-primary w-full text-base py-3 text-white flex items-center justify-center gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <IconLoader className="h-5 w-5 animate-spin" />
                          <span>{rtl ? 'جاري الإرسال...' : 'Sending...'}</span>
                        </>
                      ) : (
                        dict.cta.sendMessage
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
