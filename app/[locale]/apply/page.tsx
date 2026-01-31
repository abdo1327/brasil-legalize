'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Locale, getDictionary, isRTL } from '@/lib/i18n';

interface ApplyFormData {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  country: string;
  city: string;
  service_type: string;
  message: string;
  family_adults: number;
  family_children: number;
  expected_travel_date: string;
  consent: boolean;
}

const translations = {
  en: {
    title: 'Apply Now',
    subtitle: 'Fill out the form below and our team will get back to you within 24 hours.',
    personal: 'Personal Information',
    name: 'Full Name',
    namePlaceholder: 'Enter your full name',
    email: 'Email Address',
    emailPlaceholder: 'Enter your email',
    phone: 'Phone Number',
    phonePlaceholder: '+1234567890',
    whatsapp: 'WhatsApp Number',
    whatsappPlaceholder: 'Same as phone if empty',
    location: 'Location',
    country: 'Country',
    selectCountry: 'Select your country',
    city: 'City',
    cityPlaceholder: 'Your city',
    service: 'Service Details',
    serviceType: 'Service Type',
    selectService: 'Select a service',
    visa: 'Visa Services',
    residency: 'Residency Permit',
    birth_tourism: 'Birth Tourism',
    citizenship: 'Citizenship',
    document: 'Document Services',
    consultation: 'Consultation',
    familySize: 'Family Size',
    adults: 'Adults',
    children: 'Children',
    travelDate: 'Expected Travel Date',
    additionalInfo: 'Additional Information',
    message: 'Tell us about your needs',
    messagePlaceholder: 'Describe your situation and any specific requirements...',
    consent: 'I agree to the privacy policy and consent to be contacted regarding my application.',
    submit: 'Submit Application',
    submitting: 'Submitting...',
    success: 'Application Submitted!',
    successMessage: 'Thank you! We\'ve received your application. Our team will contact you within 24 hours.',
    error: 'Something went wrong. Please try again.',
    required: 'Required field',
  },
  ar: {
    title: 'تقديم طلب',
    subtitle: 'املأ النموذج أدناه وسيتواصل معك فريقنا خلال 24 ساعة.',
    personal: 'المعلومات الشخصية',
    name: 'الاسم الكامل',
    namePlaceholder: 'أدخل اسمك الكامل',
    email: 'البريد الإلكتروني',
    emailPlaceholder: 'أدخل بريدك الإلكتروني',
    phone: 'رقم الهاتف',
    phonePlaceholder: '+966123456789',
    whatsapp: 'رقم الواتساب',
    whatsappPlaceholder: 'نفس رقم الهاتف إذا ترك فارغاً',
    location: 'الموقع',
    country: 'البلد',
    selectCountry: 'اختر بلدك',
    city: 'المدينة',
    cityPlaceholder: 'مدينتك',
    service: 'تفاصيل الخدمة',
    serviceType: 'نوع الخدمة',
    selectService: 'اختر خدمة',
    visa: 'خدمات التأشيرة',
    residency: 'تصريح الإقامة',
    birth_tourism: 'سياحة الولادة',
    citizenship: 'الجنسية',
    document: 'خدمات الوثائق',
    consultation: 'استشارة',
    familySize: 'عدد أفراد الأسرة',
    adults: 'البالغين',
    children: 'الأطفال',
    travelDate: 'تاريخ السفر المتوقع',
    additionalInfo: 'معلومات إضافية',
    message: 'أخبرنا عن احتياجاتك',
    messagePlaceholder: 'اشرح وضعك وأي متطلبات خاصة...',
    consent: 'أوافق على سياسة الخصوصية وأوافق على التواصل معي بشأن طلبي.',
    submit: 'إرسال الطلب',
    submitting: 'جاري الإرسال...',
    success: 'تم إرسال الطلب!',
    successMessage: 'شكراً لك! لقد استلمنا طلبك. سيتواصل معك فريقنا خلال 24 ساعة.',
    error: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    required: 'حقل مطلوب',
  },
  es: {
    title: 'Aplicar Ahora',
    subtitle: 'Complete el formulario y nuestro equipo se pondrá en contacto con usted en 24 horas.',
    personal: 'Información Personal',
    name: 'Nombre Completo',
    namePlaceholder: 'Ingrese su nombre completo',
    email: 'Correo Electrónico',
    emailPlaceholder: 'Ingrese su correo',
    phone: 'Número de Teléfono',
    phonePlaceholder: '+1234567890',
    whatsapp: 'Número de WhatsApp',
    whatsappPlaceholder: 'Igual al teléfono si está vacío',
    location: 'Ubicación',
    country: 'País',
    selectCountry: 'Seleccione su país',
    city: 'Ciudad',
    cityPlaceholder: 'Su ciudad',
    service: 'Detalles del Servicio',
    serviceType: 'Tipo de Servicio',
    selectService: 'Seleccione un servicio',
    visa: 'Servicios de Visa',
    residency: 'Permiso de Residencia',
    birth_tourism: 'Turismo de Nacimiento',
    citizenship: 'Ciudadanía',
    document: 'Servicios de Documentos',
    consultation: 'Consulta',
    familySize: 'Tamaño de la Familia',
    adults: 'Adultos',
    children: 'Niños',
    travelDate: 'Fecha de Viaje Esperada',
    additionalInfo: 'Información Adicional',
    message: 'Cuéntenos sobre sus necesidades',
    messagePlaceholder: 'Describa su situación y requisitos específicos...',
    consent: 'Acepto la política de privacidad y consiento ser contactado sobre mi solicitud.',
    submit: 'Enviar Solicitud',
    submitting: 'Enviando...',
    success: '¡Solicitud Enviada!',
    successMessage: '¡Gracias! Hemos recibido su solicitud. Nuestro equipo se comunicará con usted en 24 horas.',
    error: 'Algo salió mal. Por favor intente de nuevo.',
    required: 'Campo requerido',
  },
  'pt-br': {
    title: 'Aplicar Agora',
    subtitle: 'Preencha o formulário abaixo e nossa equipe entrará em contato em 24 horas.',
    personal: 'Informações Pessoais',
    name: 'Nome Completo',
    namePlaceholder: 'Digite seu nome completo',
    email: 'E-mail',
    emailPlaceholder: 'Digite seu e-mail',
    phone: 'Telefone',
    phonePlaceholder: '+5511999999999',
    whatsapp: 'WhatsApp',
    whatsappPlaceholder: 'Mesmo que o telefone se vazio',
    location: 'Localização',
    country: 'País',
    selectCountry: 'Selecione seu país',
    city: 'Cidade',
    cityPlaceholder: 'Sua cidade',
    service: 'Detalhes do Serviço',
    serviceType: 'Tipo de Serviço',
    selectService: 'Selecione um serviço',
    visa: 'Serviços de Visto',
    residency: 'Permissão de Residência',
    birth_tourism: 'Turismo de Nascimento',
    citizenship: 'Cidadania',
    document: 'Serviços de Documentos',
    consultation: 'Consultoria',
    familySize: 'Tamanho da Família',
    adults: 'Adultos',
    children: 'Crianças',
    travelDate: 'Data de Viagem Prevista',
    additionalInfo: 'Informações Adicionais',
    message: 'Conte-nos sobre suas necessidades',
    messagePlaceholder: 'Descreva sua situação e requisitos específicos...',
    consent: 'Concordo com a política de privacidade e autorizo o contato sobre minha solicitação.',
    submit: 'Enviar Solicitação',
    submitting: 'Enviando...',
    success: 'Solicitação Enviada!',
    successMessage: 'Obrigado! Recebemos sua solicitação. Nossa equipe entrará em contato em 24 horas.',
    error: 'Algo deu errado. Por favor, tente novamente.',
    required: 'Campo obrigatório',
  },
};

const countries = [
  { code: 'SA', name: { en: 'Saudi Arabia', ar: 'السعودية' } },
  { code: 'AE', name: { en: 'UAE', ar: 'الإمارات' } },
  { code: 'KW', name: { en: 'Kuwait', ar: 'الكويت' } },
  { code: 'QA', name: { en: 'Qatar', ar: 'قطر' } },
  { code: 'BH', name: { en: 'Bahrain', ar: 'البحرين' } },
  { code: 'OM', name: { en: 'Oman', ar: 'عمان' } },
  { code: 'EG', name: { en: 'Egypt', ar: 'مصر' } },
  { code: 'JO', name: { en: 'Jordan', ar: 'الأردن' } },
  { code: 'LB', name: { en: 'Lebanon', ar: 'لبنان' } },
  { code: 'IQ', name: { en: 'Iraq', ar: 'العراق' } },
  { code: 'SY', name: { en: 'Syria', ar: 'سوريا' } },
  { code: 'PS', name: { en: 'Palestine', ar: 'فلسطين' } },
  { code: 'YE', name: { en: 'Yemen', ar: 'اليمن' } },
  { code: 'LY', name: { en: 'Libya', ar: 'ليبيا' } },
  { code: 'TN', name: { en: 'Tunisia', ar: 'تونس' } },
  { code: 'DZ', name: { en: 'Algeria', ar: 'الجزائر' } },
  { code: 'MA', name: { en: 'Morocco', ar: 'المغرب' } },
  { code: 'SD', name: { en: 'Sudan', ar: 'السودان' } },
  { code: 'US', name: { en: 'United States', ar: 'الولايات المتحدة' } },
  { code: 'BR', name: { en: 'Brazil', ar: 'البرازيل' } },
  { code: 'OTHER', name: { en: 'Other', ar: 'أخرى' } },
];

export default function ApplyPage({ params }: { params: { locale: Locale } }) {
  const router = useRouter();
  const locale = params.locale;
  const t = translations[locale] || translations.en;
  const rtl = isRTL(locale);
  
  const [formData, setFormData] = useState<ApplyFormData>({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    country: '',
    city: '',
    service_type: '',
    message: '',
    family_adults: 1,
    family_children: 0,
    expected_travel_date: '',
    consent: false,
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          locale,
          source: 'website_application',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || t.error);
      }
    } catch (err) {
      setError(t.error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={`min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 ${rtl ? 'rtl' : ''}`}>
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-check-line text-4xl text-green-600"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.success}</h1>
          <p className="text-gray-600 mb-8">{t.successMessage}</p>
          <a
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <i className="ri-home-line"></i>
            {locale === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 ${rtl ? 'rtl' : ''}`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-file-text-line text-3xl text-white"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-8">
          {/* Personal Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <i className="ri-user-line text-primary"></i>
              {t.personal}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.name} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t.namePlaceholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.email} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t.emailPlaceholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.phone} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t.phonePlaceholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  dir="ltr"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.whatsapp}
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder={t.whatsappPlaceholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <i className="ri-map-pin-line text-primary"></i>
              {t.location}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.country} <span className="text-red-500">*</span>
                </label>
                <select
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">{t.selectCountry}</option>
                  {countries.map(c => (
                    <option key={c.code} value={c.code}>
                      {locale === 'ar' ? c.name.ar : c.name.en}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.city}
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder={t.cityPlaceholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <i className="ri-briefcase-line text-primary"></i>
              {t.service}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.serviceType} <span className="text-red-500">*</span>
                </label>
                <select
                  name="service_type"
                  required
                  value={formData.service_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">{t.selectService}</option>
                  <option value="visa">{t.visa}</option>
                  <option value="residency">{t.residency}</option>
                  <option value="birth_tourism">{t.birth_tourism}</option>
                  <option value="citizenship">{t.citizenship}</option>
                  <option value="document">{t.document}</option>
                  <option value="consultation">{t.consultation}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.adults}
                  </label>
                  <input
                    type="number"
                    name="family_adults"
                    min="1"
                    max="10"
                    value={formData.family_adults}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.children}
                  </label>
                  <input
                    type="number"
                    name="family_children"
                    min="0"
                    max="10"
                    value={formData.family_children}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.travelDate}
                </label>
                <input
                  type="date"
                  name="expected_travel_date"
                  value={formData.expected_travel_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <i className="ri-chat-3-line text-primary"></i>
              {t.additionalInfo}
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.message}
              </label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder={t.messagePlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Consent */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              name="consent"
              id="consent"
              required
              checked={formData.consent}
              onChange={handleChange}
              className="mt-1 w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
            />
            <label htmlFor="consent" className="text-sm text-gray-600">
              {t.consent} <span className="text-red-500">*</span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <i className="ri-error-warning-line"></i>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <i className="ri-loader-4-line animate-spin"></i>
                {t.submitting}
              </>
            ) : (
              <>
                <i className="ri-send-plane-line"></i>
                {t.submit}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
