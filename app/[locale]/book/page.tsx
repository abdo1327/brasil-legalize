import { Metadata } from 'next';
import { CalendlyEmbed } from '@/components/CalendlyEmbed';
import { Locale } from '@/lib/i18n';

interface BookingPageProps {
  params: { locale: Locale };
}

const translations = {
  en: {
    title: 'Book a Consultation',
    subtitle: 'Schedule a free 30-minute consultation to discuss your immigration needs.',
    benefit1: 'Free Consultation',
    benefit2: '30 Minutes',
    benefit3: 'Expert Guidance',
    alternativeContact: 'Prefer to reach out another way?',
    whatsapp: 'WhatsApp Us',
    email: 'Send Email',
  },
  'pt-br': {
    title: 'Agende uma Consulta',
    subtitle: 'Agende uma consulta gratuita de 30 minutos para discutir suas necessidades de imigração.',
    benefit1: 'Consulta Gratuita',
    benefit2: '30 Minutos',
    benefit3: 'Orientação Especializada',
    alternativeContact: 'Prefere entrar em contato de outra forma?',
    whatsapp: 'WhatsApp',
    email: 'Enviar Email',
  },
  es: {
    title: 'Reservar una Consulta',
    subtitle: 'Programe una consulta gratuita de 30 minutos para discutir sus necesidades de inmigración.',
    benefit1: 'Consulta Gratuita',
    benefit2: '30 Minutos',
    benefit3: 'Orientación Experta',
    alternativeContact: '¿Prefiere contactarnos de otra manera?',
    whatsapp: 'WhatsApp',
    email: 'Enviar Email',
  },
  ar: {
    title: 'احجز استشارة',
    subtitle: 'حدد موعدًا لاستشارة مجانية مدتها 30 دقيقة لمناقشة احتياجات الهجرة الخاصة بك.',
    benefit1: 'استشارة مجانية',
    benefit2: '30 دقيقة',
    benefit3: 'إرشاد متخصص',
    alternativeContact: 'تفضل التواصل بطريقة أخرى؟',
    whatsapp: 'واتساب',
    email: 'إرسال بريد إلكتروني',
  },
};

export async function generateMetadata({ params }: BookingPageProps): Promise<Metadata> {
  const t = translations[params.locale] || translations.en;
  
  return {
    title: t.title,
    description: t.subtitle,
  };
}

export default function BookingPage({ params }: BookingPageProps) {
  const { locale } = params;
  const t = translations[locale] || translations.en;
  const isRTL = locale === 'ar';
  
  return (
    <div className={`min-h-screen bg-gradient-to-b from-neutral-50 to-white ${isRTL ? 'rtl' : ''}`}>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              {t.title}
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </div>
          
          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-neutral-200 rounded-xl p-4 text-center shadow-sm">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="ri-gift-line text-xl text-primary" aria-hidden="true"></i>
              </div>
              <p className="text-sm font-medium text-neutral-700">{t.benefit1}</p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-4 text-center shadow-sm">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="ri-time-line text-xl text-primary" aria-hidden="true"></i>
              </div>
              <p className="text-sm font-medium text-neutral-700">{t.benefit2}</p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-4 text-center shadow-sm">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="ri-user-star-line text-xl text-primary" aria-hidden="true"></i>
              </div>
              <p className="text-sm font-medium text-neutral-700">{t.benefit3}</p>
            </div>
          </div>
          
          {/* Calendly Embed */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
            <CalendlyEmbed locale={locale} />
          </div>
          
          {/* Alternative Contact */}
          <div className="mt-8 text-center">
            <p className="text-neutral-500 mb-4">
              {t.alternativeContact}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white rounded-lg hover:bg-[#20BD5C] transition-colors"
              >
                <i className="ri-whatsapp-line text-lg" aria-hidden="true"></i>
                {t.whatsapp}
              </a>
              <a
                href="mailto:contact@brasillegalize.com"
                className="btn-outline inline-flex items-center gap-2"
              >
                <i className="ri-mail-line text-lg" aria-hidden="true"></i>
                {t.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
