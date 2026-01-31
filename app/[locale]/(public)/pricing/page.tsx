import { PackageBuilder } from "../../../../components/PackageBuilder";
import { getDictionary, Locale } from "../../../../lib/i18n";
import { colors, borderRadius, spacing } from "../../../../lib/design-tokens";

// Translation helper for pricing page
const pricingTranslations: Record<Locale, Record<string, string>> = {
  ar: {
    'pricing.title': 'الباقات والأسعار',
    'pricing.subtitle': 'اختر الباقة المناسبة لك ولعائلتك',
    'pricing.includedServices': 'الخدمات المتضمنة',
    'pricing.yourPackage': 'باقتك',
    'pricing.additionalPersons': 'أشخاص إضافيون',
    'pricing.basePrice': 'السعر الأساسي',
    'pricing.additionalCost': 'تكلفة إضافية',
    'pricing.total': 'الإجمالي',
    'pricing.paymentTerms': 'شروط الدفع',
    'pricing.paymentTerms.upfront': 'عند التوقيع',
    'pricing.paymentTerms.susCompletion': 'عند إكمال تسجيل SUS',
    'pricing.paymentTerms.rnmSubmission': 'عند تقديم طلب RNM',
    'pricing.basePackage': 'الباقة الأساسية (شخصان بالغان + مولود جديد)',
    'pricing.form.title': 'احصل على تفاصيل الباقة',
    'pricing.form.name': 'الاسم',
    'pricing.form.email': 'البريد الإلكتروني',
    'pricing.form.submit': 'احصل على عرض سعر',
    'pricing.form.submitting': 'جارٍ الإرسال...',
    'pricing.form.success': 'شكراً! سنتواصل معك قريباً.',
    'pricing.form.errorRequired': 'يرجى ملء جميع الحقول',
    'pricing.form.errorGeneral': 'حدث خطأ ما',
    'pricing.packages.basic.name': 'الباقة الأساسية',
    'pricing.packages.basic.description': 'دعم أساسي للآباء المتوقعين',
    'pricing.packages.complete.name': 'الباقة الشاملة',
    'pricing.packages.complete.description': 'دعم شامل مع خدمات إضافية',
    'services.cpf.name': 'مساعدة CPF',
    'services.cpf.description': 'الحصول على رقم الضريبة البرازيلي',
    'services.sus.name': 'التسجيل في SUS',
    'services.sus.description': 'التأمين الصحي العام المجاني',
    'services.birthCertificate.name': 'شهادة الميلاد',
    'services.birthCertificate.description': 'تسجيل مولودك الجديد',
    'services.rnm.name': 'طلب RNM',
    'services.rnm.description': 'البطاقة الوطنية للمهاجر',
    'services.rg.name': 'خدمات RG',
    'services.rg.description': 'بطاقة الهوية للطفل',
    'services.passport.name': 'خدمات جواز السفر',
    'services.passport.description': 'جواز سفر للطفل',
    'services.airportPickup.name': 'استقبال من المطار',
    'services.airportPickup.description': 'نقل من المطار',
    'services.housingAssistance.name': 'المساعدة في الإسكان',
    'services.housingAssistance.description': 'إيجاد سكن مؤقت ودائم',
    'services.documentTranslation.name': 'ترجمة الوثائق',
    'services.documentTranslation.description': 'ترجمة مهنية',
    'services.documentLegalization.name': 'تصديق الوثائق',
    'services.documentLegalization.description': 'تصديق رسمي',
    'services.financialAdvice.name': 'استشارات مالية',
    'services.financialAdvice.description': 'تخطيط مالي',
    'services.bankAccount.name': 'فتح حساب بنكي',
    'services.bankAccount.description': 'المساعدة في فتح حساب',
    'services.culturalOrientation.name': 'توجيه ثقافي',
    'services.culturalOrientation.description': 'مقدمة للثقافة البرازيلية',
    'services.languageAssistance.name': 'مساعدة لغوية',
    'services.languageAssistance.description': 'دروس لغة برتغالية',
    'services.localGuidance.name': 'إرشادات محلية',
    'services.localGuidance.description': 'توصيات لوسائل الراحة',
    'services.emergency247.name': 'دعم طوارئ 24/7',
    'services.emergency247.description': 'رقم طوارئ',
    'services.emergencyTransport.name': 'نقل طوارئ',
    'services.emergencyTransport.description': 'تنسيق النقل',
    'pricing.notes.title': 'ملاحظات مهمة',
    'pricing.notes.item1': 'جميع الباقات مصممة لشخصين بالغين + مولود جديد واحد',
    'pricing.notes.item2': 'رسوم إضافية تطبق لأي أشخاص مرافقين',
    'pricing.notes.item3': 'جميع الأسعار لا تشمل الضرائب أو الرسوم الحكومية',
    'pricing.notes.item4': 'طرق الدفع: PIX، تحويل بنكي، نقداً',
    'pricing.notes.item5': 'جميع معلومات العملاء يتم التعامل معها بسرية تامة',
    'pricing.cta.title': 'هل لديك أسئلة؟',
    'pricing.cta.subtitle': 'فريقنا هنا لمساعدتك. تواصل معنا عبر واتساب أو البريد الإلكتروني.',
  },
  en: {
    'pricing.title': 'Packages & Pricing',
    'pricing.subtitle': 'Choose the perfect package for you and your family',
    'pricing.includedServices': 'Included Services',
    'pricing.yourPackage': 'Your Package',
    'pricing.additionalPersons': 'Additional Persons',
    'pricing.basePrice': 'Base Price',
    'pricing.additionalCost': 'Additional Cost',
    'pricing.total': 'Total',
    'pricing.paymentTerms': 'Payment Terms',
    'pricing.paymentTerms.upfront': 'upfront',
    'pricing.paymentTerms.susCompletion': 'upon SUS enrollment completion',
    'pricing.paymentTerms.rnmSubmission': 'upon RNM application submission',
    'pricing.basePackage': 'Base package (2 adults + 1 newborn)',
    'pricing.form.title': 'Get Package Details',
    'pricing.form.name': 'Your Name',
    'pricing.form.email': 'Your Email',
    'pricing.form.submit': 'Get Quote',
    'pricing.form.submitting': 'Submitting...',
    'pricing.form.success': 'Thank you! We will contact you soon.',
    'pricing.form.errorRequired': 'Please fill all fields',
    'pricing.form.errorGeneral': 'Something went wrong',
    'pricing.packages.basic.name': 'Basic Package',
    'pricing.packages.basic.description': 'Essential support for expecting parents',
    'pricing.packages.complete.name': 'Complete Package',
    'pricing.packages.complete.description': 'Comprehensive support with additional services',
    'services.cpf.name': 'CPF Assistance',
    'services.cpf.description': 'Get Brazilian tax number',
    'services.sus.name': 'SUS Enrollment',
    'services.sus.description': 'Free public health insurance',
    'services.birthCertificate.name': 'Birth Certificate',
    'services.birthCertificate.description': 'Register your newborn',
    'services.rnm.name': 'RNM Application',
    'services.rnm.description': 'National ID for immigrant',
    'services.rg.name': 'RG Services',
    'services.rg.description': 'ID card for baby',
    'services.passport.name': 'Passport Services',
    'services.passport.description': 'Passport for baby',
    'services.airportPickup.name': 'Airport Pickup',
    'services.airportPickup.description': 'Transportation from airport',
    'services.housingAssistance.name': 'Housing Assistance',
    'services.housingAssistance.description': 'Find temporary and long-term housing',
    'services.documentTranslation.name': 'Document Translation',
    'services.documentTranslation.description': 'Professional translation',
    'services.documentLegalization.name': 'Document Legalization',
    'services.documentLegalization.description': 'Official certification',
    'services.financialAdvice.name': 'Financial Advice',
    'services.financialAdvice.description': 'Financial planning',
    'services.bankAccount.name': 'Bank Account Setup',
    'services.bankAccount.description': 'Assistance opening account',
    'services.culturalOrientation.name': 'Cultural Orientation',
    'services.culturalOrientation.description': 'Introduction to Brazilian culture',
    'services.languageAssistance.name': 'Language Assistance',
    'services.languageAssistance.description': 'Portuguese language classes',
    'services.localGuidance.name': 'Local Guidance',
    'services.localGuidance.description': 'Recommendations for amenities',
    'services.emergency247.name': '24/7 Emergency Support',
    'services.emergency247.description': 'Emergency hotline',
    'services.emergencyTransport.name': 'Emergency Transport',
    'services.emergencyTransport.description': 'Transportation coordination',
    'pricing.notes.title': 'Important Notes',
    'pricing.notes.item1': 'All packages are designed for 2 adults + 1 newborn baby',
    'pricing.notes.item2': 'Additional charges apply for accompanying persons',
    'pricing.notes.item3': 'All prices do not include taxes or government fees',
    'pricing.notes.item4': 'Payments: PIX, bank transfer, or cash',
    'pricing.notes.item5': 'All client information is handled with strict confidentiality',
    'pricing.cta.title': 'Have Questions?',
    'pricing.cta.subtitle': 'Our team is here to help. Contact us via WhatsApp or email.',
  },
  es: {
    'pricing.title': 'Paquetes y Precios',
    'pricing.subtitle': 'Elige el paquete perfecto para ti y tu familia',
    'pricing.includedServices': 'Servicios Incluidos',
    'pricing.yourPackage': 'Tu Paquete',
    'pricing.additionalPersons': 'Personas Adicionales',
    'pricing.basePrice': 'Precio Base',
    'pricing.additionalCost': 'Costo Adicional',
    'pricing.total': 'Total',
    'pricing.paymentTerms': 'Términos de Pago',
    'pricing.paymentTerms.upfront': 'por adelantado',
    'pricing.paymentTerms.susCompletion': 'al completar la inscripción en SUS',
    'pricing.paymentTerms.rnmSubmission': 'al presentar la solicitud de RNM',
    'pricing.basePackage': 'Paquete base (2 adultos + 1 recién nacido)',
    'pricing.form.title': 'Obtener Detalles del Paquete',
    'pricing.form.name': 'Tu Nombre',
    'pricing.form.email': 'Tu Email',
    'pricing.form.submit': 'Obtener Cotización',
    'pricing.form.submitting': 'Enviando...',
    'pricing.form.success': '¡Gracias! Nos pondremos en contacto pronto.',
    'pricing.form.errorRequired': 'Por favor complete todos los campos',
    'pricing.form.errorGeneral': 'Algo salió mal',
    'pricing.packages.basic.name': 'Paquete Básico',
    'pricing.packages.basic.description': 'Soporte esencial para padres esperando',
    'pricing.packages.complete.name': 'Paquete Completo',
    'pricing.packages.complete.description': 'Soporte integral con servicios adicionales',
    'services.cpf.name': 'Asistencia CPF',
    'services.cpf.description': 'Obtener número de impuestos brasileño',
    'services.sus.name': 'Inscripción SUS',
    'services.sus.description': 'Seguro de salud público gratuito',
    'services.birthCertificate.name': 'Certificado de Nacimiento',
    'services.birthCertificate.description': 'Registrar a su recién nacido',
    'services.rnm.name': 'Solicitud RNM',
    'services.rnm.description': 'ID nacional para inmigrante',
    'services.rg.name': 'Servicios RG',
    'services.rg.description': 'Tarjeta de identidad para bebé',
    'services.passport.name': 'Servicios de Pasaporte',
    'services.passport.description': 'Pasaporte para bebé',
    'services.airportPickup.name': 'Recogida en el Aeropuerto',
    'services.airportPickup.description': 'Transporte desde el aeropuerto',
    'services.housingAssistance.name': 'Asistencia de Vivienda',
    'services.housingAssistance.description': 'Encontrar vivienda temporal y permanente',
    'services.documentTranslation.name': 'Traducción de Documentos',
    'services.documentTranslation.description': 'Traducción profesional',
    'services.documentLegalization.name': 'Legalización de Documentos',
    'services.documentLegalization.description': 'Certificación oficial',
    'services.financialAdvice.name': 'Asesoramiento Financiero',
    'services.financialAdvice.description': 'Planificación financiera',
    'services.bankAccount.name': 'Configuración de Cuenta Bancaria',
    'services.bankAccount.description': 'Asistencia para abrir cuenta',
    'services.culturalOrientation.name': 'Orientación Cultural',
    'services.culturalOrientation.description': 'Introducción a la cultura brasileña',
    'services.languageAssistance.name': 'Asistencia de Idioma',
    'services.languageAssistance.description': 'Clases de portugués',
    'services.localGuidance.name': 'Orientación Local',
    'services.localGuidance.description': 'Recomendaciones de servicios',
    'services.emergency247.name': 'Soporte de Emergencia 24/7',
    'services.emergency247.description': 'Línea de emergencia',
    'services.emergencyTransport.name': 'Transporte de Emergencia',
    'services.emergencyTransport.description': 'Coordinación de transporte',
    'pricing.notes.title': 'Notas Importantes',
    'pricing.notes.item1': 'Todos los paquetes son para 2 adultos + 1 recién nacido',
    'pricing.notes.item2': 'Cargos adicionales para personas acompañantes',
    'pricing.notes.item3': 'Los precios no incluyen impuestos ni tarifas gubernamentales',
    'pricing.notes.item4': 'Pagos: PIX, transferencia bancaria o efectivo',
    'pricing.notes.item5': 'Toda la información se maneja con estricta confidencialidad',
    'pricing.cta.title': '¿Tienes Preguntas?',
    'pricing.cta.subtitle': 'Nuestro equipo está aquí para ayudarte.',
  },
  'pt-br': {
    'pricing.title': 'Pacotes e Preços',
    'pricing.subtitle': 'Escolha o pacote perfeito para você e sua família',
    'pricing.includedServices': 'Serviços Incluídos',
    'pricing.yourPackage': 'Seu Pacote',
    'pricing.additionalPersons': 'Pessoas Adicionais',
    'pricing.basePrice': 'Preço Base',
    'pricing.additionalCost': 'Custo Adicional',
    'pricing.total': 'Total',
    'pricing.paymentTerms': 'Termos de Pagamento',
    'pricing.paymentTerms.upfront': 'adiantado',
    'pricing.paymentTerms.susCompletion': 'após conclusão da inscrição SUS',
    'pricing.paymentTerms.rnmSubmission': 'após submissão do pedido RNM',
    'pricing.basePackage': 'Pacote base (2 adultos + 1 recém-nascido)',
    'pricing.form.title': 'Obter Detalhes do Pacote',
    'pricing.form.name': 'Seu Nome',
    'pricing.form.email': 'Seu Email',
    'pricing.form.submit': 'Obter Cotação',
    'pricing.form.submitting': 'Enviando...',
    'pricing.form.success': 'Obrigado! Entraremos em contato em breve.',
    'pricing.form.errorRequired': 'Por favor, preencha todos os campos',
    'pricing.form.errorGeneral': 'Algo deu errado',
    'pricing.packages.basic.name': 'Pacote Básico',
    'pricing.packages.basic.description': 'Suporte essencial para pais esperando',
    'pricing.packages.complete.name': 'Pacote Completo',
    'pricing.packages.complete.description': 'Suporte abrangente com serviços adicionais',
    'services.cpf.name': 'Assistência CPF',
    'services.cpf.description': 'Obter número de imposto brasileiro',
    'services.sus.name': 'Inscrição SUS',
    'services.sus.description': 'Seguro de saúde público gratuito',
    'services.birthCertificate.name': 'Certidão de Nascimento',
    'services.birthCertificate.description': 'Registrar seu recém-nascido',
    'services.rnm.name': 'Aplicação RNM',
    'services.rnm.description': 'ID nacional para imigrante',
    'services.rg.name': 'Serviços RG',
    'services.rg.description': 'Cartão de identidade para bebê',
    'services.passport.name': 'Serviços de Passaporte',
    'services.passport.description': 'Passaporte para bebê',
    'services.airportPickup.name': 'Busca no Aeroporto',
    'services.airportPickup.description': 'Transporte do aeroporto',
    'services.housingAssistance.name': 'Assistência de Moradia',
    'services.housingAssistance.description': 'Encontrar moradia temporária e permanente',
    'services.documentTranslation.name': 'Tradução de Documentos',
    'services.documentTranslation.description': 'Tradução profissional',
    'services.documentLegalization.name': 'Legalização de Documentos',
    'services.documentLegalization.description': 'Certificação oficial',
    'services.financialAdvice.name': 'Aconselhamento Financeiro',
    'services.financialAdvice.description': 'Planejamento financeiro',
    'services.bankAccount.name': 'Configuração de Conta Bancária',
    'services.bankAccount.description': 'Assistência para abrir conta',
    'services.culturalOrientation.name': 'Orientação Cultural',
    'services.culturalOrientation.description': 'Introdução à cultura brasileira',
    'services.languageAssistance.name': 'Assistência de Idioma',
    'services.languageAssistance.description': 'Aulas de português',
    'services.localGuidance.name': 'Orientação Local',
    'services.localGuidance.description': 'Recomendações de serviços',
    'services.emergency247.name': 'Suporte de Emergência 24/7',
    'services.emergency247.description': 'Linha de emergência',
    'services.emergencyTransport.name': 'Transporte de Emergência',
    'services.emergencyTransport.description': 'Coordenação de transporte',
    'pricing.notes.title': 'Notas Importantes',
    'pricing.notes.item1': 'Todos os pacotes são para 2 adultos + 1 recém-nascido',
    'pricing.notes.item2': 'Taxas adicionais para pessoas acompanhantes',
    'pricing.notes.item3': 'Os preços não incluem impostos ou taxas governamentais',
    'pricing.notes.item4': 'Pagamentos: PIX, transferência bancária ou dinheiro',
    'pricing.notes.item5': 'Todas as informações são tratadas com estrita confidencialidade',
    'pricing.cta.title': 'Tem Dúvidas?',
    'pricing.cta.subtitle': 'Nossa equipe está aqui para ajudar.',
  },
};

interface PricingPageProps {
  params: {
    locale: Locale;
  };
}

export default function PricingPage({ params }: PricingPageProps) {
  const { locale } = params;
  const t = pricingTranslations[locale] || pricingTranslations.en;
  const isRTL = locale === 'ar';

  return (
    <main className="min-h-screen" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Hero Section */}
      <section
        className="text-center"
        style={{
          background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)`,
          color: '#ffffff',
          padding: `${spacing[16]} ${spacing[6]}`,
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t['pricing.title']}
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            {t['pricing.subtitle']}
          </p>
        </div>
      </section>

      {/* Package Builder */}
      <section
        style={{
          padding: `${spacing[16]} ${spacing[6]}`,
          background: colors.neutral[50],
        }}
      >
        <PackageBuilder locale={locale} translations={t} />
      </section>

      {/* Important Notes */}
      <section
        style={{
          padding: `${spacing[16]} ${spacing[6]}`,
          background: '#ffffff',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div
            style={{
              background: colors.primary[50],
              borderLeft: isRTL ? 'none' : `4px solid ${colors.primary[500]}`,
              borderRight: isRTL ? `4px solid ${colors.primary[500]}` : 'none',
              padding: spacing[6],
              borderRadius: borderRadius.lg,
              marginBottom: spacing[8],
            }}
          >
            <h3
              className="text-xl font-semibold mb-4"
              style={{
                color: colors.primary[700],
                textAlign: isRTL ? 'right' : 'left',
              }}
            >
              {t['pricing.notes.title']}
            </h3>
            <ul
              className="text-sm leading-relaxed"
              style={{
                listStyle: 'disc',
                paddingLeft: isRTL ? '0' : spacing[6],
                paddingRight: isRTL ? spacing[6] : '0',
                color: colors.neutral[700],
                textAlign: isRTL ? 'right' : 'left',
              }}
            >
              <li className="mb-2">{t['pricing.notes.item1']}</li>
              <li className="mb-2">{t['pricing.notes.item2']}</li>
              <li className="mb-2">{t['pricing.notes.item3']}</li>
              <li className="mb-2">{t['pricing.notes.item4']}</li>
              <li>{t['pricing.notes.item5']}</li>
            </ul>
          </div>

          {/* Contact CTA */}
          <div
            className="text-center"
            style={{
              padding: spacing[12],
              background: colors.neutral[50],
              borderRadius: borderRadius.xl,
            }}
          >
            <h3 className="text-2xl font-bold mb-4" style={{ color: colors.neutral[900] }}>
              {t['pricing.cta.title']}
            </h3>
            <p className="text-base mb-6" style={{ color: colors.neutral[600] }}>
              {t['pricing.cta.subtitle']}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="https://wa.me/5541984548337"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-transform hover:scale-105"
                style={{
                  background: colors.primary[500],
                  color: '#ffffff',
                  borderRadius: borderRadius.full,
                  textDecoration: 'none',
                }}
              >
                <i className="ri-whatsapp-line text-xl" />
                WhatsApp
              </a>
              <a
                href="mailto:info@brasillegalize.com"
                className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-transform hover:scale-105"
                style={{
                  background: 'transparent',
                  color: colors.primary[500],
                  border: `2px solid ${colors.primary[500]}`,
                  borderRadius: borderRadius.full,
                  textDecoration: 'none',
                }}
              >
                <i className="ri-mail-line text-xl" />
                Email
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
