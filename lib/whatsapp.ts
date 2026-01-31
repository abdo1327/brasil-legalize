import { Locale } from './i18n';

const WHATSAPP_MESSAGES: Record<Locale, Record<string, string>> = {
  en: {
    home: "Hello! I'm interested in Brasil Legalize immigration services.",
    pricing: "Hello! I'm interested in the {package} package.",
    eligibility: "Hello! I just completed the eligibility check.",
    book: "Hello! I'd like to book a consultation.",
    default: "Hello! I'd like to learn more about your services.",
  },
  'pt-br': {
    home: "Olá! Estou interessado nos serviços de imigração da Brasil Legalize.",
    pricing: "Olá! Estou interessado no pacote {package}.",
    eligibility: "Olá! Acabei de fazer a verificação de elegibilidade.",
    book: "Olá! Gostaria de agendar uma consulta.",
    default: "Olá! Gostaria de saber mais sobre os serviços.",
  },
  es: {
    home: "¡Hola! Estoy interesado en los servicios de inmigración de Brasil Legalize.",
    pricing: "¡Hola! Estoy interesado en el paquete {package}.",
    eligibility: "¡Hola! Acabo de completar la verificación de elegibilidad.",
    book: "¡Hola! Me gustaría reservar una consulta.",
    default: "¡Hola! Me gustaría saber más sobre sus servicios.",
  },
  ar: {
    home: "مرحبًا! أنا مهتم بخدمات الهجرة من براسيل ليغالايز.",
    pricing: "مرحبًا! أنا مهتم بالباقة {package}.",
    eligibility: "مرحبًا! لقد أكملت للتو فحص الأهلية.",
    book: "مرحبًا! أود حجز استشارة.",
    default: "مرحبًا! أود معرفة المزيد عن خدماتكم.",
  },
};

export function generateWhatsAppUrl(
  phoneNumber: string,
  pathname: string,
  locale: Locale,
  packageName?: string
): string {
  const messages = WHATSAPP_MESSAGES[locale] || WHATSAPP_MESSAGES.en;
  
  let messageKey = 'default';
  
  if (pathname.includes('/book')) {
    messageKey = 'book';
  } else if (pathname.includes('/pricing')) {
    messageKey = 'pricing';
  } else if (pathname.includes('/eligibility')) {
    messageKey = 'eligibility';
  } else if (pathname === `/${locale}` || pathname === `/${locale}/` || pathname === '/') {
    messageKey = 'home';
  }
  
  let message = messages[messageKey] || messages.default;
  
  if (packageName && message.includes('{package}')) {
    message = message.replace('{package}', packageName);
  } else {
    message = message.replace('{package}', '');
  }
  
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message.trim());
  
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export const WHATSAPP_NUMBER = '5511999999999'; // Configure your WhatsApp number
