'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Locale } from '../../../../lib/i18n';

// Service items with full details
const allServices = [
  // Core Services - Green
  { key: 'cpf', icon: 'ri-bank-card-line', category: 'core', color: 'primary', basePrice: 150, perPerson: true },
  { key: 'sus', icon: 'ri-heart-pulse-line', category: 'core', color: 'primary', basePrice: 100, perPerson: true },
  { key: 'birthCert', icon: 'ri-file-text-line', category: 'core', color: 'primary', basePrice: 200, perPerson: false },
  { key: 'rnm', icon: 'ri-shield-user-line', category: 'core', color: 'primary', basePrice: 400, perPerson: true },
  { key: 'rg', icon: 'ri-id-card-line', category: 'core', color: 'primary', basePrice: 150, perPerson: true },
  { key: 'passport', icon: 'ri-passport-line', category: 'core', color: 'primary', basePrice: 300, perPerson: true },
  { key: 'govFees', icon: 'ri-government-line', category: 'core', color: 'primary', basePrice: 500, perPerson: false },
  // Housing & Travel - Blue
  { key: 'airport', icon: 'ri-plane-line', category: 'travel', color: 'secondary', basePrice: 150, perPerson: false },
  { key: 'housing', icon: 'ri-home-4-line', category: 'travel', color: 'secondary', basePrice: 300, perPerson: false },
  // Documents - Gold
  { key: 'translation', icon: 'ri-translate-2', category: 'documents', color: 'accent', basePrice: 200, perPerson: false },
  { key: 'legalization', icon: 'ri-file-shield-line', category: 'documents', color: 'accent', basePrice: 250, perPerson: false },
  // Support - Blue
  { key: 'financial', icon: 'ri-money-dollar-circle-line', category: 'support', color: 'secondary', basePrice: 200, perPerson: false },
  { key: 'bank', icon: 'ri-bank-line', category: 'support', color: 'secondary', basePrice: 150, perPerson: true },
  { key: 'emergency', icon: 'ri-alarm-warning-line', category: 'support', color: 'secondary', basePrice: 400, perPerson: false },
  { key: 'cultural', icon: 'ri-global-line', category: 'support', color: 'secondary', basePrice: 100, perPerson: false },
  { key: 'language', icon: 'ri-character-recognition-line', category: 'support', color: 'secondary', basePrice: 150, perPerson: false },
  // Premium - Gold
  { key: 'rnmDelivery', icon: 'ri-truck-line', category: 'premium', color: 'accent', basePrice: 350, perPerson: true },
];

// Translations
const translations: Record<string, Record<string, string>> = {
  ar: {
    'builder.title': 'بناء باقتك المخصصة',
    'builder.subtitle': 'اختر الخدمات التي تحتاجها وحدد عدد الأشخاص',
    'builder.back': 'العودة للخدمات',
    'builder.adults': 'عدد البالغين',
    'builder.children': 'عدد الأطفال',
    'builder.selectServices': 'اختر الخدمات',
    'builder.selectAll': 'اختر الكل',
    'builder.deselectAll': 'إلغاء الكل',
    'builder.perPerson': 'لكل شخص',
    'builder.fixed': 'سعر ثابت',
    'builder.summary': 'ملخص الطلب',
    'builder.selectedServices': 'الخدمات المختارة',
    'builder.totalPersons': 'إجمالي الأشخاص',
    'builder.subtotal': 'المجموع الفرعي',
    'builder.total': 'الإجمالي',
    'builder.requestQuote': 'طلب عرض سعر',
    'builder.name': 'الاسم الكامل',
    'builder.email': 'البريد الإلكتروني',
    'builder.phone': 'رقم الهاتف',
    'builder.notes': 'ملاحظات إضافية',
    'builder.submit': 'إرسال الطلب',
    'builder.success': 'شكراً! سنتواصل معك قريباً.',
    'builder.noServices': 'لم يتم اختيار أي خدمة',
    'category.core': 'الخدمات الأساسية',
    'category.travel': 'السفر والإقامة',
    'category.documents': 'الوثائق',
    'category.support': 'الدعم',
    'category.premium': 'خدمات مميزة',
    // Services
    'service.cpf': 'مساعدة CPF (رقم الضريبة)',
    'service.cpf.desc': 'نساعدك في الحصول على رقم CPF الضريبي البرازيلي المطلوب لجميع المعاملات المالية والبنكية',
    'service.sus': 'التسجيل في SUS (التأمين الصحي)',
    'service.sus.desc': 'التسجيل في نظام الصحة العامة البرازيلي للحصول على الرعاية الصحية المجانية',
    'service.birthCert': 'شهادة الميلاد للطفل',
    'service.birthCert.desc': 'استخراج شهادة ميلاد برازيلية رسمية لطفلك المولود في البرازيل',
    'service.rnm': 'طلب RNM (هوية المهاجر)',
    'service.rnm.desc': 'الحصول على بطاقة التسجيل الوطني للأجانب، وثيقة الهوية الرسمية للمقيمين',
    'service.rg': 'بطاقة RG للطفل',
    'service.rg.desc': 'استخراج بطاقة الهوية البرازيلية RG لطفلك كمواطن برازيلي',
    'service.passport': 'جواز سفر الطفل',
    'service.passport.desc': 'المساعدة في استخراج جواز سفر برازيلي لطفلك المولود في البرازيل',
    'service.govFees': 'الرسوم الحكومية',
    'service.govFees.desc': 'تغطية جميع الرسوم الحكومية المطلوبة للمعاملات والوثائق الرسمية',
    'service.airport': 'استقبال من المطار',
    'service.airport.desc': 'استقبال شخصي من المطار والنقل إلى مكان إقامتك مع ترحيب حار',
    'service.housing': 'المساعدة في الإسكان',
    'service.housing.desc': 'مساعدة في إيجاد سكن مناسب وآمن قريب من المستشفيات والخدمات',
    'service.translation': 'ترجمة الوثائق',
    'service.translation.desc': 'ترجمة معتمدة لجميع وثائقك من وإلى البرتغالية بواسطة مترجمين محلفين',
    'service.legalization': 'تصديق الوثائق',
    'service.legalization.desc': 'تصديق وتوثيق الوثائق لدى الجهات الرسمية والقنصليات',
    'service.financial': 'استشارات مالية',
    'service.financial.desc': 'نصائح مالية حول النظام البنكي البرازيلي والتحويلات الدولية',
    'service.bank': 'فتح حساب بنكي',
    'service.bank.desc': 'المساعدة في فتح حساب بنكي برازيلي لتسهيل معاملاتك المالية',
    'service.emergency': 'دعم طوارئ 24/7',
    'service.emergency.desc': 'خط دعم متاح على مدار الساعة لأي حالة طارئة أو استفسار عاجل',
    'service.cultural': 'توجيه ثقافي',
    'service.cultural.desc': 'معلومات عن الثقافة البرازيلية والعادات المحلية لتسهيل تأقلمك',
    'service.language': 'مساعدة لغوية',
    'service.language.desc': 'مترجم مرافق للمواعيد الرسمية والطبية لضمان التواصل الفعال',
    'service.rnmDelivery': 'توصيل RNM لأي مكان بالعالم',
    'service.rnmDelivery.desc': 'شحن وثيقة RNM إلى عنوانك في أي مكان بالعالم بعد استلامها',
  },
  en: {
    'builder.title': 'Build Your Custom Package',
    'builder.subtitle': 'Select the services you need and specify the number of people',
    'builder.back': 'Back to Services',
    'builder.adults': 'Number of Adults',
    'builder.children': 'Number of Children',
    'builder.selectServices': 'Select Services',
    'builder.selectAll': 'Select All',
    'builder.deselectAll': 'Deselect All',
    'builder.perPerson': 'per person',
    'builder.fixed': 'fixed price',
    'builder.summary': 'Order Summary',
    'builder.selectedServices': 'Selected Services',
    'builder.totalPersons': 'Total Persons',
    'builder.subtotal': 'Subtotal',
    'builder.total': 'Total',
    'builder.requestQuote': 'Request Quote',
    'builder.name': 'Full Name',
    'builder.email': 'Email',
    'builder.phone': 'Phone Number',
    'builder.notes': 'Additional Notes',
    'builder.submit': 'Submit Request',
    'builder.success': 'Thank you! We will contact you soon.',
    'builder.noServices': 'No services selected',
    'category.core': 'Core Services',
    'category.travel': 'Travel & Housing',
    'category.documents': 'Documents',
    'category.support': 'Support',
    'category.premium': 'Premium Services',
    'service.cpf': 'CPF Assistance (Tax Number)',
    'service.cpf.desc': 'Help obtaining your Brazilian CPF tax number required for all financial and banking transactions',
    'service.sus': 'SUS Enrollment (Health Insurance)',
    'service.sus.desc': 'Registration in the Brazilian public health system for free healthcare access',
    'service.birthCert': 'Birth Certificate for Baby',
    'service.birthCert.desc': 'Obtaining an official Brazilian birth certificate for your baby born in Brazil',
    'service.rnm': 'RNM Application (Immigrant ID)',
    'service.rnm.desc': 'Obtaining the National Migrant Registration card, the official ID for residents',
    'service.rg': 'RG Card for Baby',
    'service.rg.desc': 'Obtaining the Brazilian RG identity card for your child as a Brazilian citizen',
    'service.passport': 'Passport for Baby',
    'service.passport.desc': 'Assistance in obtaining a Brazilian passport for your baby born in Brazil',
    'service.govFees': 'Government Fees',
    'service.govFees.desc': 'Coverage of all government fees required for official transactions and documents',
    'service.airport': 'Airport Pickup',
    'service.airport.desc': 'Personal airport pickup and transfer to your accommodation with a warm welcome',
    'service.housing': 'Housing Assistance',
    'service.housing.desc': 'Help finding suitable and safe accommodation near hospitals and services',
    'service.translation': 'Document Translation',
    'service.translation.desc': 'Certified translation of all your documents to/from Portuguese by sworn translators',
    'service.legalization': 'Document Legalization',
    'service.legalization.desc': 'Authentication and legalization of documents at official agencies and consulates',
    'service.financial': 'Financial Advice',
    'service.financial.desc': 'Financial guidance on Brazilian banking system and international transfers',
    'service.bank': 'Bank Account Setup',
    'service.bank.desc': 'Assistance in opening a Brazilian bank account to facilitate your transactions',
    'service.emergency': '24/7 Emergency Support',
    'service.emergency.desc': 'Support line available 24/7 for any emergency or urgent inquiry',
    'service.cultural': 'Cultural Orientation',
    'service.cultural.desc': 'Information about Brazilian culture and local customs to ease your adaptation',
    'service.language': 'Language Assistance',
    'service.language.desc': 'Accompanying interpreter for official and medical appointments',
    'service.rnmDelivery': 'RNM Delivery Worldwide',
    'service.rnmDelivery.desc': 'Shipping your RNM document to your address anywhere in the world',
  },
  es: {
    'builder.title': 'Crea Tu Paquete Personalizado',
    'builder.subtitle': 'Selecciona los servicios que necesitas y especifica el número de personas',
    'builder.back': 'Volver a Servicios',
    'builder.adults': 'Número de Adultos',
    'builder.children': 'Número de Niños',
    'builder.selectServices': 'Seleccionar Servicios',
    'builder.selectAll': 'Seleccionar Todo',
    'builder.deselectAll': 'Deseleccionar Todo',
    'builder.perPerson': 'por persona',
    'builder.fixed': 'precio fijo',
    'builder.summary': 'Resumen del Pedido',
    'builder.selectedServices': 'Servicios Seleccionados',
    'builder.totalPersons': 'Total de Personas',
    'builder.subtotal': 'Subtotal',
    'builder.total': 'Total',
    'builder.requestQuote': 'Solicitar Cotización',
    'builder.name': 'Nombre Completo',
    'builder.email': 'Email',
    'builder.phone': 'Teléfono',
    'builder.notes': 'Notas Adicionales',
    'builder.submit': 'Enviar Solicitud',
    'builder.success': '¡Gracias! Nos pondremos en contacto pronto.',
    'builder.noServices': 'No hay servicios seleccionados',
    'category.core': 'Servicios Básicos',
    'category.travel': 'Viaje y Alojamiento',
    'category.documents': 'Documentos',
    'category.support': 'Soporte',
    'category.premium': 'Servicios Premium',
    'service.cpf': 'Asistencia CPF (Número Fiscal)',
    'service.cpf.desc': 'Ayuda para obtener tu número CPF brasileño requerido para transacciones financieras',
    'service.sus': 'Inscripción SUS (Seguro de Salud)',
    'service.sus.desc': 'Registro en el sistema de salud pública brasileño para atención médica gratuita',
    'service.birthCert': 'Certificado de Nacimiento',
    'service.birthCert.desc': 'Obtención del certificado de nacimiento oficial brasileño para tu bebé',
    'service.rnm': 'Solicitud RNM (ID de Inmigrante)',
    'service.rnm.desc': 'Obtención de la tarjeta de Registro Nacional de Migrante, el ID oficial para residentes',
    'service.rg': 'Tarjeta RG para Bebé',
    'service.rg.desc': 'Obtención de la tarjeta de identidad RG brasileña para tu hijo como ciudadano',
    'service.passport': 'Pasaporte para Bebé',
    'service.passport.desc': 'Asistencia para obtener pasaporte brasileño para tu bebé nacido en Brasil',
    'service.govFees': 'Tarifas Gubernamentales',
    'service.govFees.desc': 'Cobertura de todas las tarifas gubernamentales requeridas para documentos oficiales',
    'service.airport': 'Recogida en Aeropuerto',
    'service.airport.desc': 'Recogida personal en el aeropuerto y traslado a tu alojamiento',
    'service.housing': 'Asistencia de Vivienda',
    'service.housing.desc': 'Ayuda para encontrar alojamiento seguro cerca de hospitales y servicios',
    'service.translation': 'Traducción de Documentos',
    'service.translation.desc': 'Traducción certificada de documentos al/del portugués por traductores jurados',
    'service.legalization': 'Legalización de Documentos',
    'service.legalization.desc': 'Autenticación y legalización de documentos en agencias oficiales',
    'service.financial': 'Asesoría Financiera',
    'service.financial.desc': 'Orientación sobre el sistema bancario brasileño y transferencias internacionales',
    'service.bank': 'Apertura de Cuenta Bancaria',
    'service.bank.desc': 'Asistencia para abrir cuenta bancaria brasileña para facilitar transacciones',
    'service.emergency': 'Soporte de Emergencia 24/7',
    'service.emergency.desc': 'Línea de soporte disponible 24/7 para emergencias o consultas urgentes',
    'service.cultural': 'Orientación Cultural',
    'service.cultural.desc': 'Información sobre cultura brasileña y costumbres locales para tu adaptación',
    'service.language': 'Asistencia de Idioma',
    'service.language.desc': 'Intérprete acompañante para citas oficiales y médicas',
    'service.rnmDelivery': 'Entrega de RNM Mundial',
    'service.rnmDelivery.desc': 'Envío de tu documento RNM a cualquier dirección en el mundo',
  },
  'pt-br': {
    'builder.title': 'Crie Seu Pacote Personalizado',
    'builder.subtitle': 'Selecione os serviços que precisa e especifique o número de pessoas',
    'builder.back': 'Voltar para Serviços',
    'builder.adults': 'Número de Adultos',
    'builder.children': 'Número de Crianças',
    'builder.selectServices': 'Selecionar Serviços',
    'builder.selectAll': 'Selecionar Tudo',
    'builder.deselectAll': 'Desmarcar Tudo',
    'builder.perPerson': 'por pessoa',
    'builder.fixed': 'preço fixo',
    'builder.summary': 'Resumo do Pedido',
    'builder.selectedServices': 'Serviços Selecionados',
    'builder.totalPersons': 'Total de Pessoas',
    'builder.subtotal': 'Subtotal',
    'builder.total': 'Total',
    'builder.requestQuote': 'Solicitar Cotação',
    'builder.name': 'Nome Completo',
    'builder.email': 'Email',
    'builder.phone': 'Telefone',
    'builder.notes': 'Notas Adicionais',
    'builder.submit': 'Enviar Solicitação',
    'builder.success': 'Obrigado! Entraremos em contato em breve.',
    'builder.noServices': 'Nenhum serviço selecionado',
    'category.core': 'Serviços Essenciais',
    'category.travel': 'Viagem e Hospedagem',
    'category.documents': 'Documentos',
    'category.support': 'Suporte',
    'category.premium': 'Serviços Premium',
    'service.cpf': 'Assistência CPF (Número Fiscal)',
    'service.cpf.desc': 'Ajuda para obter seu número CPF brasileiro necessário para transações financeiras',
    'service.sus': 'Inscrição SUS (Seguro de Saúde)',
    'service.sus.desc': 'Registro no sistema de saúde pública brasileiro para acesso a atendimento gratuito',
    'service.birthCert': 'Certidão de Nascimento',
    'service.birthCert.desc': 'Obtenção da certidão de nascimento oficial brasileira para seu bebê',
    'service.rnm': 'Aplicação RNM (ID de Imigrante)',
    'service.rnm.desc': 'Obtenção do cartão de Registro Nacional de Migrante, o ID oficial para residentes',
    'service.rg': 'Cartão RG para Bebê',
    'service.rg.desc': 'Obtenção do cartão de identidade RG brasileiro para seu filho como cidadão',
    'service.passport': 'Passaporte para Bebê',
    'service.passport.desc': 'Assistência para obter passaporte brasileiro para seu bebê nascido no Brasil',
    'service.govFees': 'Taxas Governamentais',
    'service.govFees.desc': 'Cobertura de todas as taxas governamentais necessárias para documentos oficiais',
    'service.airport': 'Busca no Aeroporto',
    'service.airport.desc': 'Busca pessoal no aeroporto e traslado para sua acomodação',
    'service.housing': 'Assistência de Moradia',
    'service.housing.desc': 'Ajuda para encontrar moradia segura perto de hospitais e serviços',
    'service.translation': 'Tradução de Documentos',
    'service.translation.desc': 'Tradução juramentada de documentos de/para português por tradutores certificados',
    'service.legalization': 'Legalização de Documentos',
    'service.legalization.desc': 'Autenticação e legalização de documentos em agências oficiais',
    'service.financial': 'Consultoria Financeira',
    'service.financial.desc': 'Orientação sobre sistema bancário brasileiro e transferências internacionais',
    'service.bank': 'Abertura de Conta Bancária',
    'service.bank.desc': 'Assistência para abrir conta bancária brasileira para facilitar transações',
    'service.emergency': 'Suporte de Emergência 24/7',
    'service.emergency.desc': 'Linha de suporte disponível 24/7 para emergências ou consultas urgentes',
    'service.cultural': 'Orientação Cultural',
    'service.cultural.desc': 'Informações sobre cultura brasileira e costumes locais para adaptação',
    'service.language': 'Assistência de Idioma',
    'service.language.desc': 'Intérprete acompanhante para compromissos oficiais e médicos',
    'service.rnmDelivery': 'Entrega de RNM Mundial',
    'service.rnmDelivery.desc': 'Envio do seu documento RNM para qualquer endereço no mundo',
  },
};

const categories = ['core', 'travel', 'documents', 'support', 'premium'] as const;

export default function BuilderPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const t = translations[locale] || translations.en;
  const isRTL = locale === 'ar';

  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'cpf', 'sus', 'birthCert', 'rnm', 'rg', 'passport', 'govFees'
  ]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const totalPersons = adults + children;

  const toggleService = (key: string) => {
    setSelectedServices(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const selectAll = () => {
    setSelectedServices(allServices.map(s => s.key));
  };

  const deselectAll = () => {
    setSelectedServices([]);
  };

  const calculateTotal = () => {
    return allServices
      .filter(s => selectedServices.includes(s.key))
      .reduce((total, service) => {
        return total + (service.perPerson ? service.basePrice * totalPersons : service.basePrice);
      }, 0);
  };

  const getColorClass = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors: Record<string, Record<string, string>> = {
      primary: { bg: 'bg-primary', text: 'text-primary', border: 'border-primary' },
      secondary: { bg: 'bg-secondary', text: 'text-secondary', border: 'border-secondary' },
      accent: { bg: 'bg-accent', text: 'text-accent', border: 'border-accent' },
    };
    return colors[color]?.[type] || colors.primary[type];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedServiceNames = allServices
      .filter(s => selectedServices.includes(s.key))
      .map(s => t[`service.${s.key}`])
      .join(', ');

    try {
      await fetch('/api/leads.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          message: `Custom Package Request:\n\nAdults: ${adults}\nChildren: ${children}\nTotal: $${calculateTotal()} USD\n\nSelected Services:\n${selectedServiceNames}\n\nNotes: ${notes}`,
          source: 'package-builder',
        }),
      });
      setSubmitSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-white rounded-2xl p-12 text-center max-w-md shadow-lg">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <i className="ri-checkbox-circle-line text-5xl text-primary"></i>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">{t['builder.success']}</h2>
          <Link
            href={`/${locale}/services`}
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <i className="ri-arrow-left-line"></i>
            {t['builder.back']}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/${locale}/services`}
              className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary transition-colors"
            >
              <i className={`ri-arrow-${isRTL ? 'right' : 'left'}-line text-xl`}></i>
              {t['builder.back']}
            </Link>
            <div className="text-lg font-bold text-primary">
              ${calculateTotal()} USD
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
            {t['builder.title']}
          </h1>
          <p className="text-neutral-600 max-w-xl mx-auto">
            {t['builder.subtitle']}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Services Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* People Counter */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
              <div className="grid grid-cols-2 gap-6">
                {/* Adults */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-3">
                    <i className="ri-user-line text-primary mr-2"></i>
                    {t['builder.adults']}
                  </label>
                  <div className="flex items-center gap-4 bg-neutral-50 rounded-xl p-3">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      disabled={adults <= 1}
                      className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-50"
                    >
                      <i className="ri-subtract-line"></i>
                    </button>
                    <span className="flex-1 text-center text-2xl font-bold text-neutral-900">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90"
                    >
                      <i className="ri-add-line"></i>
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-3">
                    <i className="ri-parent-line text-secondary mr-2"></i>
                    {t['builder.children']}
                  </label>
                  <div className="flex items-center gap-4 bg-neutral-50 rounded-xl p-3">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      disabled={children <= 0}
                      className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-50"
                    >
                      <i className="ri-subtract-line"></i>
                    </button>
                    <span className="flex-1 text-center text-2xl font-bold text-neutral-900">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(children + 1)}
                      className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center hover:bg-secondary/90"
                    >
                      <i className="ri-add-line"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Selection Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-neutral-900">
                {t['builder.selectServices']}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-sm text-primary hover:underline"
                >
                  {t['builder.selectAll']}
                </button>
                <span className="text-neutral-300">|</span>
                <button
                  onClick={deselectAll}
                  className="text-sm text-neutral-500 hover:underline"
                >
                  {t['builder.deselectAll']}
                </button>
              </div>
            </div>

            {/* Services by Category */}
            {categories.map(category => {
              const categoryServices = allServices.filter(s => s.category === category);
              return (
                <div key={category} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                  <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${
                      category === 'core' ? 'bg-primary' :
                      category === 'travel' || category === 'support' ? 'bg-secondary' :
                      'bg-accent'
                    }`}></span>
                    {t[`category.${category}`]}
                  </h3>
                  <div className="space-y-3">
                    {categoryServices.map(service => {
                      const isSelected = selectedServices.includes(service.key);
                      const price = service.perPerson ? service.basePrice * totalPersons : service.basePrice;
                      return (
                        <div
                          key={service.key}
                          onClick={() => toggleService(service.key)}
                          className={`group relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? `${getColorClass(service.color, 'border')} bg-neutral-50`
                              : 'border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Checkbox */}
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                              isSelected
                                ? `${getColorClass(service.color, 'bg')} ${getColorClass(service.color, 'border')} text-white`
                                : 'border-neutral-300'
                            }`}>
                              {isSelected && <i className="ri-check-line text-sm"></i>}
                            </div>

                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isSelected ? `${getColorClass(service.color, 'bg')}/10` : 'bg-neutral-100'
                            }`}>
                              <i className={`${service.icon} text-xl ${
                                isSelected ? getColorClass(service.color, 'text') : 'text-neutral-500'
                              }`}></i>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="font-semibold text-neutral-900">
                                  {t[`service.${service.key}`]}
                                </h4>
                                <div className="text-right flex-shrink-0">
                                  <div className={`font-bold ${isSelected ? getColorClass(service.color, 'text') : 'text-neutral-700'}`}>
                                    ${price}
                                  </div>
                                  <div className="text-xs text-neutral-500">
                                    {service.perPerson ? t['builder.perPerson'] : t['builder.fixed']}
                                  </div>
                                </div>
                              </div>
                              {/* Tooltip Description */}
                              <p className="text-sm text-neutral-500 mt-1">
                                {t[`service.${service.key}.desc`]}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 sticky top-24">
              <div className="p-6 border-b border-neutral-200">
                <h3 className="text-lg font-bold text-neutral-900">
                  {t['builder.summary']}
                </h3>
              </div>

              <div className="p-6 space-y-4">
                {/* People */}
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">{t['builder.totalPersons']}</span>
                  <span className="font-semibold text-neutral-900">{totalPersons}</span>
                </div>

                {/* Selected Services Count */}
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">{t['builder.selectedServices']}</span>
                  <span className="font-semibold text-neutral-900">{selectedServices.length}</span>
                </div>

                <hr className="border-neutral-200" />

                {/* Selected Services List */}
                {selectedServices.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {allServices
                      .filter(s => selectedServices.includes(s.key))
                      .map(service => {
                        const price = service.perPerson ? service.basePrice * totalPersons : service.basePrice;
                        return (
                          <div key={service.key} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <i className={`${service.icon} ${getColorClass(service.color, 'text')}`}></i>
                              <span className="text-neutral-700 truncate">{t[`service.${service.key}`]}</span>
                            </div>
                            <span className="font-medium text-neutral-900">${price}</span>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-500 text-center py-4">
                    {t['builder.noServices']}
                  </p>
                )}

                <hr className="border-neutral-200" />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-neutral-900">{t['builder.total']}</span>
                  <span className="text-2xl font-bold text-primary">${calculateTotal()} USD</span>
                </div>
              </div>

              {/* CTA */}
              <div className="p-6 border-t border-neutral-200">
                {!showForm ? (
                  <button
                    onClick={() => setShowForm(true)}
                    disabled={selectedServices.length === 0}
                    className="w-full py-4 px-6 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t['builder.requestQuote']}
                  </button>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="text"
                      placeholder={t['builder.name']}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                    <input
                      type="email"
                      placeholder={t['builder.email']}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                    <input
                      type="tel"
                      placeholder={t['builder.phone']}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                    <textarea
                      placeholder={t['builder.notes']}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <i className="ri-loader-4-line animate-spin"></i>
                      ) : (
                        t['builder.submit']
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
