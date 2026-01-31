'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n';

// Types for API response
interface PackagePricing {
  id: number;
  slug: string;
  name: string;
  price: number;
  currency: string;
  is_popular: boolean;
  original_price?: number;
  discount_percent?: number;
  discount_active?: boolean;
}

interface PricingData {
  packages: PackagePricing[];
}

// Translations for the package section
const translations: Record<Locale, Record<string, string>> = {
  ar: {
    'packages.title': 'باقاتنا',
    'packages.subtitle': 'اختر الباقة المناسبة لاحتياجاتك',
    'packages.basic.name': 'الباقة الأساسية',
    'packages.basic.description': 'دعم أساسي للآباء المتوقعين يشمل جميع الخدمات الحكومية الضرورية',
    'packages.complete.name': 'الباقة الشاملة',
    'packages.complete.description': 'دعم شامل مع خدمات إضافية للراحة التامة',
    'packages.startingFrom': 'تبدأ من',
    'packages.forFamily': 'لشخصين بالغين + مولود جديد',
    'packages.included': 'الخدمات المتضمنة',
    'packages.notIncluded': 'غير متضمن',
    'packages.andMore': 'وغيرها الكثير',
    'packages.customize': 'هل تحتاج لتخصيص باقتك؟',
    'packages.customizeDesc': 'أضف أشخاص إضافيين أو خدمات حسب احتياجاتك',
    'packages.buildPackage': 'بناء باقة مخصصة',
    'packages.getQuote': 'احصل على عرض سعر',
    'packages.popular': 'الأكثر شعبية',
    // Services
    'service.cpf': 'مساعدة CPF (رقم الضريبة)',
    'service.cpf.desc': 'نساعدك في الحصول على رقم CPF الضريبي البرازيلي المطلوب لجميع المعاملات',
    'service.sus': 'التسجيل في SUS (التأمين الصحي)',
    'service.sus.desc': 'التسجيل في نظام الصحة العامة البرازيلي للحصول على الرعاية الصحية',
    'service.birthCert': 'شهادة الميلاد للطفل',
    'service.birthCert.desc': 'استخراج شهادة ميلاد برازيلية رسمية لطفلك المولود في البرازيل',
    'service.rnm': 'طلب RNM (هوية المهاجر)',
    'service.rnm.desc': 'الحصول على بطاقة التسجيل الوطني للأجانب، وثيقة الهوية الرسمية',
    'service.rg': 'بطاقة RG للطفل',
    'service.rg.desc': 'استخراج بطاقة الهوية البرازيلية RG لطفلك كمواطن برازيلي',
    'service.passport': 'جواز سفر الطفل',
    'service.passport.desc': 'المساعدة في استخراج جواز سفر برازيلي لطفلك',
    'service.govFees': 'الرسوم الحكومية',
    'service.govFees.desc': 'تغطية جميع الرسوم الحكومية المطلوبة للمعاملات الرسمية',
    'service.airport': 'استقبال من المطار',
    'service.airport.desc': 'استقبال شخصي من المطار والنقل إلى مكان إقامتك',
    'service.housing': 'المساعدة في الإسكان',
    'service.housing.desc': 'مساعدة في إيجاد سكن مناسب قريب من المستشفيات',
    'service.translation': 'ترجمة الوثائق',
    'service.translation.desc': 'ترجمة معتمدة لجميع وثائقك من وإلى البرتغالية',
    'service.legalization': 'تصديق الوثائق',
    'service.legalization.desc': 'تصديق وتوثيق الوثائق لدى الجهات الرسمية',
    'service.financial': 'استشارات مالية',
    'service.financial.desc': 'نصائح مالية حول النظام البنكي والتحويلات الدولية',
    'service.bank': 'فتح حساب بنكي',
    'service.bank.desc': 'المساعدة في فتح حساب بنكي برازيلي',
    'service.emergency': 'دعم طوارئ 24/7',
    'service.emergency.desc': 'خط دعم متاح على مدار الساعة لأي حالة طارئة',
    'service.cultural': 'توجيه ثقافي',
    'service.cultural.desc': 'معلومات عن الثقافة البرازيلية والعادات المحلية',
    'service.language': 'مساعدة لغوية',
    'service.language.desc': 'مترجم مرافق للمواعيد الرسمية والطبية',
    'service.rnmDelivery': 'توصيل RNM لأي مكان بالعالم',
    'service.rnmDelivery.desc': 'شحن وثيقة RNM إلى عنوانك في أي مكان بالعالم',
    // Form
    'form.title': 'طلب عرض سعر',
    'form.name': 'الاسم الكامل',
    'form.email': 'البريد الإلكتروني',
    'form.phone': 'رقم الهاتف',
    'form.message': 'رسالتك',
    'form.submit': 'إرسال الطلب',
    'form.success': 'شكراً! سنتواصل معك قريباً.',
    'form.close': 'إغلاق',
  },
  en: {
    'packages.title': 'Our Packages',
    'packages.subtitle': 'Choose the package that fits your needs',
    'packages.basic.name': 'Basic Package',
    'packages.basic.description': 'Essential support for expecting parents including all necessary government services',
    'packages.complete.name': 'Complete Package',
    'packages.complete.description': 'Comprehensive support with additional services for complete peace of mind',
    'packages.startingFrom': 'Starting from',
    'packages.forFamily': 'for 2 adults + 1 newborn',
    'packages.included': 'Included Services',
    'packages.notIncluded': 'Not Included',
    'packages.andMore': 'and many more',
    'packages.customize': 'Need to customize your package?',
    'packages.customizeDesc': 'Add additional persons or services based on your needs',
    'packages.buildPackage': 'Build Custom Package',
    'packages.getQuote': 'Get Quote',
    'packages.popular': 'Most Popular',
    // Services
    'service.cpf': 'CPF Assistance (Tax Number)',
    'service.cpf.desc': 'Help obtaining your Brazilian CPF tax number required for all transactions',
    'service.sus': 'SUS Enrollment (Health Insurance)',
    'service.sus.desc': 'Registration in the Brazilian public health system for healthcare access',
    'service.birthCert': 'Birth Certificate for Baby',
    'service.birthCert.desc': 'Obtaining an official Brazilian birth certificate for your baby',
    'service.rnm': 'RNM Application (Immigrant ID)',
    'service.rnm.desc': 'Obtaining the National Migrant Registration card, the official ID',
    'service.rg': 'RG Card for Baby',
    'service.rg.desc': 'Obtaining the Brazilian RG identity card for your child',
    'service.passport': 'Passport for Baby',
    'service.passport.desc': 'Assistance in obtaining a Brazilian passport for your baby',
    'service.govFees': 'Government Fees',
    'service.govFees.desc': 'Coverage of all government fees required for official documents',
    'service.airport': 'Airport Pickup',
    'service.airport.desc': 'Personal airport pickup and transfer to your accommodation',
    'service.housing': 'Housing Assistance',
    'service.housing.desc': 'Help finding suitable accommodation near hospitals',
    'service.translation': 'Document Translation',
    'service.translation.desc': 'Certified translation of documents to/from Portuguese',
    'service.legalization': 'Document Legalization',
    'service.legalization.desc': 'Authentication of documents at official agencies',
    'service.financial': 'Financial Advice',
    'service.financial.desc': 'Guidance on Brazilian banking and international transfers',
    'service.bank': 'Bank Account Setup',
    'service.bank.desc': 'Assistance in opening a Brazilian bank account',
    'service.emergency': '24/7 Emergency Support',
    'service.emergency.desc': 'Support line available 24/7 for any emergency',
    'service.cultural': 'Cultural Orientation',
    'service.cultural.desc': 'Information about Brazilian culture and local customs',
    'service.language': 'Language Assistance',
    'service.language.desc': 'Interpreter for official and medical appointments',
    'service.rnmDelivery': 'RNM Delivery Worldwide',
    'service.rnmDelivery.desc': 'Shipping your RNM document anywhere in the world',
    // Form
    'form.title': 'Request a Quote',
    'form.name': 'Full Name',
    'form.email': 'Email',
    'form.phone': 'Phone Number',
    'form.message': 'Your Message',
    'form.submit': 'Send Request',
    'form.success': 'Thank you! We will contact you soon.',
    'form.close': 'Close',
  },
  es: {
    'packages.title': 'Nuestros Paquetes',
    'packages.subtitle': 'Elige el paquete que se adapte a tus necesidades',
    'packages.basic.name': 'Paquete Básico',
    'packages.basic.description': 'Soporte esencial para padres esperando incluyendo servicios gubernamentales',
    'packages.complete.name': 'Paquete Completo',
    'packages.complete.description': 'Soporte integral con servicios adicionales para total tranquilidad',
    'packages.startingFrom': 'Desde',
    'packages.forFamily': 'para 2 adultos + 1 recién nacido',
    'packages.included': 'Servicios Incluidos',
    'packages.notIncluded': 'No Incluido',
    'packages.andMore': 'y mucho más',
    'packages.customize': '¿Necesitas personalizar tu paquete?',
    'packages.customizeDesc': 'Agrega personas o servicios según tus necesidades',
    'packages.buildPackage': 'Crear Paquete Personalizado',
    'packages.getQuote': 'Obtener Cotización',
    'packages.popular': 'Más Popular',
    'service.cpf': 'Asistencia CPF',
    'service.cpf.desc': 'Ayuda para obtener tu número CPF requerido para transacciones',
    'service.sus': 'Inscripción SUS',
    'service.sus.desc': 'Registro en el sistema de salud pública brasileño',
    'service.birthCert': 'Certificado de Nacimiento',
    'service.birthCert.desc': 'Obtención del certificado de nacimiento oficial',
    'service.rnm': 'Solicitud RNM',
    'service.rnm.desc': 'Obtención de la tarjeta de Registro Nacional de Migrante',
    'service.rg': 'Tarjeta RG para Bebé',
    'service.rg.desc': 'Obtención de la tarjeta de identidad RG para tu hijo',
    'service.passport': 'Pasaporte para Bebé',
    'service.passport.desc': 'Asistencia para obtener pasaporte brasileño',
    'service.govFees': 'Tarifas Gubernamentales',
    'service.govFees.desc': 'Cobertura de tarifas gubernamentales requeridas',
    'service.airport': 'Recogida en Aeropuerto',
    'service.airport.desc': 'Recogida personal en el aeropuerto y traslado',
    'service.housing': 'Asistencia de Vivienda',
    'service.housing.desc': 'Ayuda para encontrar alojamiento seguro',
    'service.translation': 'Traducción de Documentos',
    'service.translation.desc': 'Traducción certificada al/del portugués',
    'service.legalization': 'Legalización de Documentos',
    'service.legalization.desc': 'Autenticación de documentos en agencias oficiales',
    'service.financial': 'Asesoría Financiera',
    'service.financial.desc': 'Orientación sobre sistema bancario brasileño',
    'service.bank': 'Apertura de Cuenta',
    'service.bank.desc': 'Asistencia para abrir cuenta bancaria',
    'service.emergency': 'Soporte 24/7',
    'service.emergency.desc': 'Línea de soporte disponible 24/7',
    'service.cultural': 'Orientación Cultural',
    'service.cultural.desc': 'Información sobre cultura brasileña',
    'service.language': 'Asistencia de Idioma',
    'service.language.desc': 'Intérprete para citas oficiales y médicas',
    'service.rnmDelivery': 'Entrega de RNM Mundial',
    'service.rnmDelivery.desc': 'Envío de tu documento RNM a cualquier lugar',
    // Form
    'form.title': 'Solicitar Cotización',
    'form.name': 'Nombre Completo',
    'form.email': 'Email',
    'form.phone': 'Teléfono',
    'form.message': 'Tu Mensaje',
    'form.submit': 'Enviar Solicitud',
    'form.success': '¡Gracias! Nos pondremos en contacto pronto.',
    'form.close': 'Cerrar',
  },
  'pt-br': {
    'packages.title': 'Nossos Pacotes',
    'packages.subtitle': 'Escolha o pacote que atende às suas necessidades',
    'packages.basic.name': 'Pacote Básico',
    'packages.basic.description': 'Suporte essencial incluindo serviços governamentais necessários',
    'packages.complete.name': 'Pacote Completo',
    'packages.complete.description': 'Suporte abrangente com serviços adicionais para tranquilidade',
    'packages.startingFrom': 'A partir de',
    'packages.forFamily': 'para 2 adultos + 1 recém-nascido',
    'packages.included': 'Serviços Incluídos',
    'packages.notIncluded': 'Não Incluído',
    'packages.andMore': 'e muito mais',
    'packages.customize': 'Precisa personalizar seu pacote?',
    'packages.customizeDesc': 'Adicione pessoas ou serviços conforme suas necessidades',
    'packages.buildPackage': 'Criar Pacote Personalizado',
    'packages.getQuote': 'Obter Cotação',
    'packages.popular': 'Mais Popular',
    'service.cpf': 'Assistência CPF',
    'service.cpf.desc': 'Ajuda para obter seu número CPF necessário para transações',
    'service.sus': 'Inscrição SUS',
    'service.sus.desc': 'Registro no sistema de saúde pública brasileiro',
    'service.birthCert': 'Certidão de Nascimento',
    'service.birthCert.desc': 'Obtenção da certidão de nascimento oficial',
    'service.rnm': 'Aplicação RNM',
    'service.rnm.desc': 'Obtenção do cartão de Registro Nacional de Migrante',
    'service.rg': 'Cartão RG para Bebê',
    'service.rg.desc': 'Obtenção do cartão de identidade RG para seu filho',
    'service.passport': 'Passaporte para Bebê',
    'service.passport.desc': 'Assistência para obter passaporte brasileiro',
    'service.govFees': 'Taxas Governamentais',
    'service.govFees.desc': 'Cobertura de taxas governamentais necessárias',
    'service.airport': 'Busca no Aeroporto',
    'service.airport.desc': 'Busca pessoal no aeroporto e traslado',
    'service.housing': 'Assistência de Moradia',
    'service.housing.desc': 'Ajuda para encontrar moradia segura',
    'service.translation': 'Tradução de Documentos',
    'service.translation.desc': 'Tradução juramentada de/para português',
    'service.legalization': 'Legalização de Documentos',
    'service.legalization.desc': 'Autenticação de documentos em agências oficiais',
    'service.financial': 'Consultoria Financeira',
    'service.financial.desc': 'Orientação sobre sistema bancário brasileiro',
    'service.bank': 'Abertura de Conta',
    'service.bank.desc': 'Assistência para abrir conta bancária',
    'service.emergency': 'Suporte 24/7',
    'service.emergency.desc': 'Linha de suporte disponível 24/7',
    'service.cultural': 'Orientação Cultural',
    'service.cultural.desc': 'Informações sobre cultura brasileira',
    'service.language': 'Assistência de Idioma',
    'service.language.desc': 'Intérprete para compromissos oficiais e médicos',
    'service.rnmDelivery': 'Entrega de RNM Mundial',
    'service.rnmDelivery.desc': 'Envio do seu documento RNM para qualquer lugar',
    // Form
    'form.title': 'Solicitar Cotação',
    'form.name': 'Nome Completo',
    'form.email': 'Email',
    'form.phone': 'Telefone',
    'form.message': 'Sua Mensagem',
    'form.submit': 'Enviar Solicitação',
    'form.success': 'Obrigado! Entraremos em contato em breve.',
    'form.close': 'Fechar',
  },
};

// Service items with icons and colors
const basicServices = [
  { key: 'cpf', icon: 'ri-bank-card-line', color: 'primary' },
  { key: 'sus', icon: 'ri-heart-pulse-line', color: 'primary' },
  { key: 'birthCert', icon: 'ri-file-text-line', color: 'secondary' },
  { key: 'rnm', icon: 'ri-shield-user-line', color: 'primary' },
  { key: 'rg', icon: 'ri-contacts-book-line', color: 'secondary' },
  { key: 'passport', icon: 'ri-passport-line', color: 'accent' },
  { key: 'govFees', icon: 'ri-government-line', color: 'primary' },
];

const completeOnlyServices = [
  { key: 'airport', icon: 'ri-plane-line', color: 'secondary' },
  { key: 'housing', icon: 'ri-home-4-line', color: 'secondary' },
  { key: 'translation', icon: 'ri-translate-2', color: 'accent' },
  { key: 'legalization', icon: 'ri-file-shield-line', color: 'accent' },
  { key: 'financial', icon: 'ri-money-dollar-circle-line', color: 'accent' },
  { key: 'bank', icon: 'ri-bank-line', color: 'secondary' },
  { key: 'emergency', icon: 'ri-alarm-warning-line', color: 'primary' },
  { key: 'cultural', icon: 'ri-global-line', color: 'secondary' },
  { key: 'language', icon: 'ri-character-recognition-line', color: 'accent' },
  { key: 'rnmDelivery', icon: 'ri-truck-line', color: 'primary' },
];

interface PackageSectionProps {
  locale: Locale;
}

// Service item component - description shown on hover (desktop) or always visible below on mobile
function ServiceItem({ 
  serviceKey, 
  icon, 
  color, 
  t,
  isRTL 
}: { 
  serviceKey: string; 
  icon: string; 
  color: string;
  t: Record<string, string>;
  isRTL: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  const colorClasses: Record<string, { text: string; bg: string }> = {
    primary: { text: 'text-primary', bg: 'bg-primary/10' },
    secondary: { text: 'text-secondary', bg: 'bg-secondary/10' },
    accent: { text: 'text-amber-500', bg: 'bg-amber-500/10' },
  };
  
  const colors = colorClasses[color] || colorClasses.primary;

  return (
    <li 
      className="group relative text-neutral-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
          <i className={`${icon} text-lg ${colors.text}`} aria-hidden="true"></i>
        </div>
        <span className="text-sm flex-1">{t[`service.${serviceKey}`]}</span>
      </div>
      {/* Description - visible on hover (desktop) or always visible on mobile */}
      <div className={`mt-1 ${isRTL ? 'mr-11' : 'ml-11'} text-xs text-neutral-500 md:hidden`}>
        {t[`service.${serviceKey}.desc`]}
      </div>
      {/* Desktop tooltip on hover */}
      {isHovered && (
        <div className={`hidden md:block absolute bottom-full ${isRTL ? 'right-0' : 'left-0'} mb-2 z-20 w-64`}>
          <div className="bg-neutral-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
            {t[`service.${serviceKey}.desc`]}
            <div className={`absolute top-full ${isRTL ? 'right-4' : 'left-4'} w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-neutral-900`}></div>
          </div>
        </div>
      )}
    </li>
  );
}

// Compact service item for Complete package grid - no tooltip, clean display
function CompleteServiceItem({ 
  serviceKey, 
  icon, 
  color, 
  t,
  isRTL 
}: { 
  serviceKey: string; 
  icon: string; 
  color: string;
  t: Record<string, string>;
  isRTL: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  const colorClasses: Record<string, { text: string; bg: string }> = {
    primary: { text: 'text-primary', bg: 'bg-primary/10' },
    secondary: { text: 'text-secondary', bg: 'bg-secondary/10' },
    accent: { text: 'text-amber-500', bg: 'bg-amber-500/10' },
  };
  
  const colors = colorClasses[color] || colorClasses.primary;

  return (
    <div 
      className="relative text-neutral-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2">
        <div className={`w-7 h-7 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
          <i className={`${icon} text-base ${colors.text}`} aria-hidden="true"></i>
        </div>
        <span className="text-xs flex-1">{t[`service.${serviceKey}`]}</span>
      </div>
      {/* Desktop tooltip on hover */}
      {isHovered && (
        <div className={`hidden md:block absolute bottom-full ${isRTL ? 'right-0' : 'left-0'} mb-2 z-20 w-56`}>
          <div className="bg-neutral-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
            {t[`service.${serviceKey}.desc`]}
            <div className={`absolute top-full ${isRTL ? 'right-4' : 'left-4'} w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-neutral-900`}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PackageSection({ locale }: PackageSectionProps) {
  const t = translations[locale] || translations.en;
  const isRTL = locale === 'ar';
  const [showForm, setShowForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Dynamic pricing state
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [pricingLoading, setPricingLoading] = useState(true);

  // Fetch pricing from API
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch(`/api/pricing?locale=${locale}`);
        if (response.ok) {
          const data = await response.json();
          setPricing(data);
        }
      } catch (error) {
        console.error('Failed to fetch pricing:', error);
      } finally {
        setPricingLoading(false);
      }
    };
    
    fetchPricing();
  }, [locale]);

  // Get package price info by slug (includes discount)
  const getPackageInfo = (slug: string): { price: number; originalPrice: number; discountPercent: number; hasDiscount: boolean } => {
    if (!pricing?.packages) {
      // Fallback prices if API is not available
      const fallbackPrice = slug === 'basic' ? 3000 : 5000;
      return { price: fallbackPrice, originalPrice: fallbackPrice, discountPercent: 0, hasDiscount: false };
    }
    const pkg = pricing.packages.find(p => p.slug === slug);
    if (!pkg) {
      const fallbackPrice = slug === 'basic' ? 3000 : 5000;
      return { price: fallbackPrice, originalPrice: fallbackPrice, discountPercent: 0, hasDiscount: false };
    }
    const hasDiscount = Boolean(pkg.discount_active && (pkg.discount_percent || 0) > 0);
    return {
      price: pkg.price,
      originalPrice: pkg.original_price || pkg.price,
      discountPercent: pkg.discount_percent || 0,
      hasDiscount,
    };
  };

  // Format price for display
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const openForm = (packageName: string) => {
    setSelectedPackage(packageName);
    setShowForm(true);
    setSubmitSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          serviceType: 'package-interest',
          answers: { package: selectedPackage, message },
          consent: true,
          consentVersion: 'v1',
          source: 'package-quote',
          locale,
        }),
      });
      setSubmitSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            {t['packages.title']}
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            {t['packages.subtitle']}
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Basic Package */}
          <div className="relative bg-white border-2 border-neutral-200 rounded-2xl overflow-hidden hover:border-primary transition-colors flex flex-col">
            <div className="p-8 flex-1">
              {/* Package Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <i className="ri-user-heart-line text-2xl text-primary" aria-hidden="true"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900">
                    {t['packages.basic.name']}
                  </h3>
                </div>
              </div>

              <p className="text-neutral-600 mb-6">
                {t['packages.basic.description']}
              </p>

              {/* Price */}
              <div className="mb-8">
                <div className="text-sm text-neutral-500 mb-1">{t['packages.startingFrom']}</div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  {pricingLoading ? (
                    <div className="h-10 w-32 bg-neutral-200 animate-pulse rounded"></div>
                  ) : (
                    <>
                      {(() => {
                        const info = getPackageInfo('basic');
                        return (
                          <>
                            <span className="text-4xl font-bold text-primary">${formatPrice(info.price)}</span>
                            <span className="text-neutral-500">USD</span>
                            {info.hasDiscount && (
                              <>
                                <span className="text-lg text-neutral-400 line-through">${formatPrice(info.originalPrice)}</span>
                                <span className="text-sm font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-full">-{info.discountPercent}%</span>
                              </>
                            )}
                          </>
                        );
                      })()}
                    </>
                  )}
                </div>
                <div className="text-sm text-neutral-500 mt-1">{t['packages.forFamily']}</div>
              </div>

              {/* Included Services */}
              <div className="mb-6">
                <div className="text-sm font-semibold text-neutral-700 mb-4 flex items-center gap-2">
                  <i className="ri-checkbox-circle-fill text-primary" aria-hidden="true"></i>
                  {t['packages.included']}
                </div>
                <ul className="space-y-3">
                  {basicServices.map((service) => (
                    <ServiceItem 
                      key={service.key} 
                      serviceKey={service.key}
                      icon={service.icon}
                      color={service.color}
                      t={t}
                      isRTL={isRTL}
                    />
                  ))}
                </ul>
              </div>

              {/* Not Included */}
              <div className="pt-4 border-t border-neutral-100">
                <div className="text-sm font-semibold text-neutral-400 mb-3 flex items-center gap-2">
                  <i className="ri-close-circle-line" aria-hidden="true"></i>
                  {t['packages.notIncluded']}
                </div>
                <div className="flex flex-wrap gap-2">
                  {completeOnlyServices.slice(0, 3).map((service) => (
                    <span key={service.key} className="text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded">
                      {t[`service.${service.key}`]}
                    </span>
                  ))}
                  <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded font-medium">
                    {t['packages.andMore']}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="p-6 bg-neutral-50 border-t border-neutral-100">
              <button
                onClick={() => openForm(t['packages.basic.name'])}
                className="w-full py-3 px-6 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <i className="ri-file-list-3-line" aria-hidden="true"></i>
                {t['packages.getQuote']}
              </button>
            </div>
          </div>

          {/* Complete Package */}
          <div className="relative bg-white border-2 border-secondary rounded-2xl overflow-hidden shadow-lg flex flex-col">
            {/* Popular Badge - Top Center */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0">
              <div className="bg-secondary text-white text-xs font-bold px-4 py-2 rounded-b-xl">
                {t['packages.popular']}
              </div>
            </div>

            <div className="p-8 pt-12 flex-1">
              {/* Package Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center">
                  <i className="ri-vip-crown-line text-2xl text-white" aria-hidden="true"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900">
                    {t['packages.complete.name']}
                  </h3>
                </div>
              </div>

              <p className="text-neutral-600 mb-6">
                {t['packages.complete.description']}
              </p>

              {/* Price */}
              <div className="mb-8">
                <div className="text-sm text-neutral-500 mb-1">{t['packages.startingFrom']}</div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  {pricingLoading ? (
                    <div className="h-10 w-32 bg-neutral-200 animate-pulse rounded"></div>
                  ) : (
                    <>
                      {(() => {
                        const info = getPackageInfo('complete');
                        return (
                          <>
                            <span className="text-4xl font-bold text-secondary">${formatPrice(info.price)}</span>
                            <span className="text-neutral-500">USD</span>
                            {info.hasDiscount && (
                              <>
                                <span className="text-lg text-neutral-400 line-through">${formatPrice(info.originalPrice)}</span>
                                <span className="text-sm font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-full">-{info.discountPercent}%</span>
                              </>
                            )}
                          </>
                        );
                      })()}
                    </>
                  )}
                </div>
                <div className="text-sm text-neutral-500 mt-1">{t['packages.forFamily']}</div>
              </div>

              {/* All Services */}
              <div className="mb-6">
                <div className="text-sm font-semibold text-neutral-700 mb-4 flex items-center gap-2">
                  <i className="ri-checkbox-circle-fill text-secondary" aria-hidden="true"></i>
                  {t['packages.included']}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[...basicServices, ...completeOnlyServices].map((service) => (
                    <CompleteServiceItem 
                      key={service.key}
                      serviceKey={service.key}
                      icon={service.icon}
                      color={service.color}
                      t={t}
                      isRTL={isRTL}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="p-6 bg-secondary/5 border-t border-secondary/10">
              <button
                onClick={() => openForm(t['packages.complete.name'])}
                className="w-full py-3 px-6 rounded-full bg-secondary text-white font-semibold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
              >
                <i className="ri-file-list-3-line" aria-hidden="true"></i>
                {t['packages.getQuote']}
              </button>
            </div>
          </div>
        </div>

        {/* Customize CTA */}
        <div className="text-center bg-neutral-50 rounded-2xl p-8 border border-neutral-200">
          <i className="ri-settings-4-line text-4xl text-amber-500 mb-4 block" aria-hidden="true"></i>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">
            {t['packages.customize']}
          </h3>
          <p className="text-neutral-600 mb-6 max-w-md mx-auto">
            {t['packages.customizeDesc']}
          </p>
          <Link
            href={`/${locale}/builder`}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors"
          >
            <i className="ri-tools-line text-xl" aria-hidden="true"></i>
            {t['packages.buildPackage']}
          </Link>
        </div>
      </div>

      {/* Quote Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h3 className="text-xl font-bold text-neutral-900">
                {t['form.title']}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
              >
                <i className="ri-close-line text-xl" aria-hidden="true"></i>
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <i className="ri-checkbox-circle-line text-4xl text-primary" aria-hidden="true"></i>
                </div>
                <p className="text-lg text-neutral-700">{t['form.success']}</p>
                <button
                  onClick={() => setShowForm(false)}
                  className="mt-6 px-6 py-2 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                >
                  {t['form.close']}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Selected Package */}
                <div className="bg-neutral-50 rounded-xl p-4 flex items-center gap-3">
                  <i className="ri-gift-line text-2xl text-primary" aria-hidden="true"></i>
                  <div>
                    <div className="text-xs text-neutral-500">Selected Package</div>
                    <div className="font-semibold text-neutral-900">{selectedPackage}</div>
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder={t['form.name']}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder={t['form.email']}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder={t['form.phone']}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                  />
                </div>
                <div>
                  <textarea
                    placeholder={t['form.message']}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <i className="ri-loader-4-line animate-spin" aria-hidden="true"></i>
                  ) : (
                    <>
                      <i className="ri-send-plane-line" aria-hidden="true"></i>
                      {t['form.submit']}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
