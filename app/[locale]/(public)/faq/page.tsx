"use client";

import { useState } from "react";
import { getDictionary, isRTL, type Locale } from "../../../../lib/i18n";

// Note: Metadata cannot be exported from client components
// Parent layout handles SEO for this page

function IconChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function FAQItem({ question, answer, isOpen, onClick, rtl }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  rtl: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-md">
      <button
        onClick={onClick}
        className={`flex w-full items-center justify-between p-6 text-${rtl ? 'right' : 'left'} transition-colors hover:bg-slate-50`}
      >
        <span className="font-semibold text-slate-800">{question}</span>
        <span className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ease-in-out ${isOpen ? 'rotate-180 bg-secondary/80 text-white' : 'bg-primary/10 text-primary'}`}>
          <IconChevronDown className="h-5 w-5" />
        </span>
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="border-t border-slate-100 bg-slate-50 p-6">
            <p className="text-slate-600 leading-relaxed">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage({ params }: { params: { locale: Locale } }) {
  // Note: Client component - params are resolved synchronously by Next.js at render time
  const dict = getDictionary(params.locale);
  const rtl = isRTL(params.locale);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div>
      {/* Hero */}
      <section className="bg-secondary py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            {dict.faq.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            {dict.faq.subtitle}
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-4">
            {dict.faq.items.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                rtl={rtl}
              />
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mx-auto mt-16 max-w-2xl rounded-2xl bg-primary/5 p-8 text-center">
            <h3 className="text-xl font-bold text-slate-800">
              {dict.faq.contact.title}
            </h3>
            <p className="mt-2 text-slate-600">
              {dict.faq.contact.description}
            </p>
            <a
              href={`/${params.locale}/contact`}
              className="btn-secondary mt-6 inline-block"
            >
              {dict.nav.contact}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
