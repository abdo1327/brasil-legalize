// ============================================
// ELIGIBILITY FLOW LOGIC
// Client-side state management and evaluation
// ============================================

import { Locale } from './i18n';

// Types for eligibility questions and answers
export interface EligibilityQuestion {
  id: number;
  step_number: number;
  question_key: string;
  question: string; // Localized question text
  question_type: 'single_select' | 'multi_select' | 'text' | 'country' | 'contact';
  is_required: boolean;
  is_conditional: boolean;
  parent_question_key?: string;
  parent_answer_value?: string;
  options?: EligibilityOption[];
}

export interface EligibilityOption {
  id: number;
  option_key: string;
  label: string; // Localized label
  icon?: string;
}

export interface EligibilityRule {
  id: number;
  rule_name: string;
  result_type: 'likely_eligible' | 'may_need_review' | 'contact_for_assessment';
  conditions: Record<string, string>;
  priority: number;
}

export interface EligibilityResult {
  result_type: 'likely_eligible' | 'may_need_review' | 'contact_for_assessment';
  icon: string;
  icon_color: string;
  bg_color: string;
  heading: string;
  description: string;
  primary_cta_text: string;
  primary_cta_link: string;
  secondary_cta_text: string;
  secondary_cta_link: string;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  consent: boolean;
}

export interface EligibilityAnswers {
  [questionKey: string]: string | string[] | ContactInfo;
}

// ============================================
// DEFAULT QUESTIONS (Fallback if API fails)
// ============================================
export const defaultQuestions: Record<Locale, EligibilityQuestion[]> = {
  ar: [
    {
      id: 1,
      step_number: 1,
      question_key: 'service_interest',
      question: 'ما نوع الخدمة التي تهتم بها؟',
      question_type: 'single_select',
      is_required: true,
      is_conditional: false,
      options: [
        { id: 1, option_key: 'visa', label: 'خدمات التأشيرات', icon: 'passport' },
        { id: 2, option_key: 'residency', label: 'الإقامة', icon: 'home' },
        { id: 3, option_key: 'citizenship', label: 'الجنسية', icon: 'flag' },
        { id: 4, option_key: 'documents', label: 'خدمات الوثائق', icon: 'document' },
        { id: 5, option_key: 'not_sure', label: 'غير متأكد', icon: 'question' },
      ],
    },
    {
      id: 2,
      step_number: 2,
      question_key: 'visa_status',
      question: 'ما هي حالة تأشيرتك الحالية؟',
      question_type: 'single_select',
      is_required: true,
      is_conditional: true,
      parent_question_key: 'service_interest',
      parent_answer_value: 'visa',
      options: [
        { id: 6, option_key: 'tourist', label: 'تأشيرة سياحية', icon: 'plane' },
        { id: 7, option_key: 'business', label: 'تأشيرة عمل', icon: 'briefcase' },
        { id: 8, option_key: 'no_visa', label: 'لا تأشيرة حالية', icon: 'x-circle' },
        { id: 9, option_key: 'other', label: 'أخرى', icon: 'dots' },
      ],
    },
    {
      id: 3,
      step_number: 2,
      question_key: 'residency_status',
      question: 'هل لديك إقامة حالية في البرازيل؟',
      question_type: 'single_select',
      is_required: true,
      is_conditional: true,
      parent_question_key: 'service_interest',
      parent_answer_value: 'residency',
      options: [
        { id: 10, option_key: 'yes_temporary', label: 'نعم - مؤقتة', icon: 'clock' },
        { id: 11, option_key: 'yes_permanent', label: 'نعم - دائمة', icon: 'check-circle' },
        { id: 12, option_key: 'no', label: 'لا', icon: 'x-circle' },
      ],
    },
    {
      id: 4,
      step_number: 2,
      question_key: 'citizenship_status',
      question: 'ما هي حالة جنسيتك الحالية؟',
      question_type: 'single_select',
      is_required: true,
      is_conditional: true,
      parent_question_key: 'service_interest',
      parent_answer_value: 'citizenship',
      options: [
        { id: 13, option_key: 'brazilian_descent', label: 'برازيلي بالنسب', icon: 'family' },
        { id: 14, option_key: 'married_brazilian', label: 'متزوج من برازيلي', icon: 'heart' },
        { id: 15, option_key: 'resident_4_years', label: 'مقيم لأكثر من 4 سنوات', icon: 'calendar' },
        { id: 16, option_key: 'none', label: 'لا شيء مما سبق', icon: 'x-circle' },
      ],
    },
    {
      id: 5,
      step_number: 2,
      question_key: 'document_type',
      question: 'ما خدمة الوثائق التي تحتاجها؟',
      question_type: 'single_select',
      is_required: true,
      is_conditional: true,
      parent_question_key: 'service_interest',
      parent_answer_value: 'documents',
      options: [
        { id: 17, option_key: 'legalization', label: 'تصديق الوثائق', icon: 'stamp' },
        { id: 18, option_key: 'translation', label: 'ترجمة معتمدة', icon: 'language' },
        { id: 19, option_key: 'apostille', label: 'أبوستيل', icon: 'certificate' },
        { id: 20, option_key: 'other', label: 'أخرى', icon: 'dots' },
      ],
    },
    {
      id: 6,
      step_number: 3,
      question_key: 'timeline',
      question: 'متى تحتاج إلى إكمال هذا؟',
      question_type: 'single_select',
      is_required: true,
      is_conditional: false,
      options: [
        { id: 21, option_key: 'urgent', label: 'عاجل (خلال شهر)', icon: 'bolt' },
        { id: 22, option_key: 'soon', label: 'قريباً (1-3 أشهر)', icon: 'clock' },
        { id: 23, option_key: 'flexible', label: 'مرن (أكثر من 3 أشهر)', icon: 'calendar' },
        { id: 24, option_key: 'not_sure', label: 'غير متأكد', icon: 'question' },
      ],
    },
    {
      id: 7,
      step_number: 4,
      question_key: 'location',
      question: 'أين تتواجد حالياً؟',
      question_type: 'country',
      is_required: true,
      is_conditional: false,
    },
    {
      id: 8,
      step_number: 5,
      question_key: 'contact',
      question: 'كيف يمكننا التواصل معك؟',
      question_type: 'contact',
      is_required: true,
      is_conditional: false,
    },
  ],
  en: [
    {
      id: 1,
      step_number: 1,
      question_key: 'service_interest',
      question: 'What type of service are you interested in?',
      question_type: 'single_select',
      is_required: true,
      is_conditional: false,
      options: [
        { id: 1, option_key: 'visa', label: 'Visa Services', icon: 'passport' },
        { id: 2, option_key: 'residency', label: 'Residency', icon: 'home' },
        { id: 3, option_key: 'citizenship', label: 'Citizenship', icon: 'flag' },
        { id: 4, option_key: 'documents', label: 'Document Services', icon: 'document' },
        { id: 5, option_key: 'not_sure', label: 'Not Sure', icon: 'question' },
      ],
    },
    {
      id: 2,
      step_number: 2,
      question_key: 'visa_status',
      question: 'What is your current visa status?',
      question_type: 'single_select',
      is_required: true,
      is_conditional: true,
      parent_question_key: 'service_interest',
      parent_answer_value: 'visa',
      options: [
        { id: 6, option_key: 'tourist', label: 'Tourist Visa', icon: 'plane' },
        { id: 7, option_key: 'business', label: 'Business Visa', icon: 'briefcase' },
        { id: 8, option_key: 'no_visa', label: 'No Current Visa', icon: 'x-circle' },
        { id: 9, option_key: 'other', label: 'Other', icon: 'dots' },
      ],
    },
    {
      id: 3,
      step_number: 2,
      question_key: 'residency_status',
      question: 'Do you currently have any residency in Brazil?',
      question_type: 'single_select',
      is_required: true,
      is_conditional: true,
      parent_question_key: 'service_interest',
      parent_answer_value: 'residency',
      options: [
        { id: 10, option_key: 'yes_temporary', label: 'Yes - Temporary', icon: 'clock' },
        { id: 11, option_key: 'yes_permanent', label: 'Yes - Permanent', icon: 'check-circle' },
        { id: 12, option_key: 'no', label: 'No', icon: 'x-circle' },
      ],
    },
    {
      id: 4,
      step_number: 2,
      question_key: 'citizenship_status',
      question: 'What is your current citizenship status?',
      question_type: 'single_select',
      is_required: true,
      is_conditional: true,
      parent_question_key: 'service_interest',
      parent_answer_value: 'citizenship',
      options: [
        { id: 13, option_key: 'brazilian_descent', label: 'Brazilian by Descent', icon: 'family' },
        { id: 14, option_key: 'married_brazilian', label: 'Married to Brazilian', icon: 'heart' },
        { id: 15, option_key: 'resident_4_years', label: 'Resident for 4+ Years', icon: 'calendar' },
        { id: 16, option_key: 'none', label: 'None of the Above', icon: 'x-circle' },
      ],
    },
    {
      id: 5,
      step_number: 2,
      question_key: 'document_type',
      question: 'What document service do you need?',
      question_type: 'single_select',
      is_required: true,
      is_conditional: true,
      parent_question_key: 'service_interest',
      parent_answer_value: 'documents',
      options: [
        { id: 17, option_key: 'legalization', label: 'Document Legalization', icon: 'stamp' },
        { id: 18, option_key: 'translation', label: 'Certified Translation', icon: 'language' },
        { id: 19, option_key: 'apostille', label: 'Apostille', icon: 'certificate' },
        { id: 20, option_key: 'other', label: 'Other', icon: 'dots' },
      ],
    },
    {
      id: 6,
      step_number: 3,
      question_key: 'timeline',
      question: 'When do you need this completed?',
      question_type: 'single_select',
      is_required: true,
      is_conditional: false,
      options: [
        { id: 21, option_key: 'urgent', label: 'Urgent (within 1 month)', icon: 'bolt' },
        { id: 22, option_key: 'soon', label: 'Soon (1-3 months)', icon: 'clock' },
        { id: 23, option_key: 'flexible', label: 'Flexible (3+ months)', icon: 'calendar' },
        { id: 24, option_key: 'not_sure', label: 'Not Sure', icon: 'question' },
      ],
    },
    {
      id: 7,
      step_number: 4,
      question_key: 'location',
      question: 'Where are you currently located?',
      question_type: 'country',
      is_required: true,
      is_conditional: false,
    },
    {
      id: 8,
      step_number: 5,
      question_key: 'contact',
      question: 'How can we reach you?',
      question_type: 'contact',
      is_required: true,
      is_conditional: false,
    },
  ],
  es: [
    {
      id: 1,
      step_number: 1,
      question_key: 'service_interest',
      question: '¿Qué tipo de servicio te interesa?',
      question_type: 'single_select',
      is_required: true,
      is_conditional: false,
      options: [
        { id: 1, option_key: 'visa', label: 'Servicios de Visa', icon: 'passport' },
        { id: 2, option_key: 'residency', label: 'Residencia', icon: 'home' },
        { id: 3, option_key: 'citizenship', label: 'Ciudadanía', icon: 'flag' },
        { id: 4, option_key: 'documents', label: 'Servicios de Documentos', icon: 'document' },
        { id: 5, option_key: 'not_sure', label: 'No estoy seguro', icon: 'question' },
      ],
    },
    {
      id: 2,
      step_number: 2,
      question_key: 'visa_status',
      question: '¿Cuál es tu estatus de visa actual?',
      question_type: 'single_select',
      is_required: true,
      is_conditional: true,
      parent_question_key: 'service_interest',
      parent_answer_value: 'visa',
      options: [
        { id: 6, option_key: 'tourist', label: 'Visa de Turista', icon: 'plane' },
        { id: 7, option_key: 'business', label: 'Visa de Negocios', icon: 'briefcase' },
        { id: 8, option_key: 'no_visa', label: 'Sin Visa Actual', icon: 'x-circle' },
        { id: 9, option_key: 'other', label: 'Otro', icon: 'dots' },
      ],
    },
    {
      id: 3,
      step_number: 2,
      question_key: 'residency_status',
      question: '¿Actualmente tienes residencia en Brasil?',
      question_type: 'single_select',
      is_required: true,
      is_conditional: true,
      parent_question_key: 'service_interest',
      parent_answer_value: 'residency',
      options: [
        { id: 10, option_key: 'yes_temporary', label: 'Sí - Temporal', icon: 'clock' },
        { id: 11, option_key: 'yes_permanent', label: 'Sí - Permanente', icon: 'check-circle' },
        { id: 12, option_key: 'no', label: 'No', icon: 'x-circle' },
      ],
    },
    {
      id: 4,
      step_number: 2,
      question_key: 'citizenship_status',
      question: '¿Cuál es tu estatus de ciudadanía actual?',
      question_type: 'single_select',
      is_required: true,
      is_conditional: true,
      parent_question_key: 'service_interest',
      parent_answer_value: 'citizenship',
      options: [
        { id: 13, option_key: 'brazilian_descent', label: 'Brasileño por Descendencia', icon: 'family' },
        { id: 14, option_key: 'married_brazilian', label: 'Casado con Brasileño', icon: 'heart' },
        { id: 15, option_key: 'resident_4_years', label: 'Residente por 4+ Años', icon: 'calendar' },
        { id: 16, option_key: 'none', label: 'Ninguno de los Anteriores', icon: 'x-circle' },
      ],
    },
    {
      id: 5,
      step_number: 2,
      question_key: 'document_type',
      question: '¿Qué servicio de documentos necesitas?',
      question_type: 'single_select',
      is_required: true,
      is_conditional: true,
      parent_question_key: 'service_interest',
      parent_answer_value: 'documents',
      options: [
        { id: 17, option_key: 'legalization', label: 'Legalización de Documentos', icon: 'stamp' },
        { id: 18, option_key: 'translation', label: 'Traducción Certificada', icon: 'language' },
        { id: 19, option_key: 'apostille', label: 'Apostilla', icon: 'certificate' },
        { id: 20, option_key: 'other', label: 'Otro', icon: 'dots' },
      ],
    },
    {
      id: 6,
      step_number: 3,
      question_key: 'timeline',
      question: '¿Cuándo necesitas completar esto?',
      question_type: 'single_select',
      is_required: true,
      is_conditional: false,
      options: [
        { id: 21, option_key: 'urgent', label: 'Urgente (dentro de 1 mes)', icon: 'bolt' },
        { id: 22, option_key: 'soon', label: 'Pronto (1-3 meses)', icon: 'clock' },
        { id: 23, option_key: 'flexible', label: 'Flexible (3+ meses)', icon: 'calendar' },
        { id: 24, option_key: 'not_sure', label: 'No estoy seguro', icon: 'question' },
      ],
    },
    {
      id: 7,
      step_number: 4,
      question_key: 'location',
      question: '¿Dónde te encuentras actualmente?',
      question_type: 'country',
      is_required: true,
      is_conditional: false,
    },
    {
      id: 8,
      step_number: 5,
      question_key: 'contact',
      question: '¿Cómo podemos contactarte?',
      question_type: 'contact',
      is_required: true,
      is_conditional: false,
    },
  ],
  'pt-br': [
    {
      id: 1,
      step_number: 1,
      question_key: 'service_interest',
      question: 'Que tipo de serviço você está interessado?',
      question_type: 'single_select',
      is_required: true,
      is_conditional: false,
      options: [
        { id: 1, option_key: 'visa', label: 'Serviços de Visto', icon: 'passport' },
        { id: 2, option_key: 'residency', label: 'Residência', icon: 'home' },
        { id: 3, option_key: 'citizenship', label: 'Cidadania', icon: 'flag' },
        { id: 4, option_key: 'documents', label: 'Serviços de Documentos', icon: 'document' },
        { id: 5, option_key: 'not_sure', label: 'Não tenho certeza', icon: 'question' },
      ],
    },
    {
      id: 2,
      step_number: 2,
      question_key: 'visa_status',
      question: 'Qual é o seu status de visto atual?',
      question_type: 'single_select',
      is_required: true,
      is_conditional: true,
      parent_question_key: 'service_interest',
      parent_answer_value: 'visa',
      options: [
        { id: 6, option_key: 'tourist', label: 'Visto de Turista', icon: 'plane' },
        { id: 7, option_key: 'business', label: 'Visto de Negócios', icon: 'briefcase' },
        { id: 8, option_key: 'no_visa', label: 'Sem Visto Atual', icon: 'x-circle' },
        { id: 9, option_key: 'other', label: 'Outro', icon: 'dots' },
      ],
    },
    {
      id: 3,
      step_number: 2,
      question_key: 'residency_status',
      question: 'Você atualmente tem residência no Brasil?',
      question_type: 'single_select',
      is_required: true,
      is_conditional: true,
      parent_question_key: 'service_interest',
      parent_answer_value: 'residency',
      options: [
        { id: 10, option_key: 'yes_temporary', label: 'Sim - Temporária', icon: 'clock' },
        { id: 11, option_key: 'yes_permanent', label: 'Sim - Permanente', icon: 'check-circle' },
        { id: 12, option_key: 'no', label: 'Não', icon: 'x-circle' },
      ],
    },
    {
      id: 4,
      step_number: 2,
      question_key: 'citizenship_status',
      question: 'Qual é o seu status de cidadania atual?',
      question_type: 'single_select',
      is_required: true,
      is_conditional: true,
      parent_question_key: 'service_interest',
      parent_answer_value: 'citizenship',
      options: [
        { id: 13, option_key: 'brazilian_descent', label: 'Brasileiro por Descendência', icon: 'family' },
        { id: 14, option_key: 'married_brazilian', label: 'Casado com Brasileiro', icon: 'heart' },
        { id: 15, option_key: 'resident_4_years', label: 'Residente por 4+ Anos', icon: 'calendar' },
        { id: 16, option_key: 'none', label: 'Nenhuma das Anteriores', icon: 'x-circle' },
      ],
    },
    {
      id: 5,
      step_number: 2,
      question_key: 'document_type',
      question: 'Qual serviço de documentos você precisa?',
      question_type: 'single_select',
      is_required: true,
      is_conditional: true,
      parent_question_key: 'service_interest',
      parent_answer_value: 'documents',
      options: [
        { id: 17, option_key: 'legalization', label: 'Legalização de Documentos', icon: 'stamp' },
        { id: 18, option_key: 'translation', label: 'Tradução Juramentada', icon: 'language' },
        { id: 19, option_key: 'apostille', label: 'Apostila', icon: 'certificate' },
        { id: 20, option_key: 'other', label: 'Outro', icon: 'dots' },
      ],
    },
    {
      id: 6,
      step_number: 3,
      question_key: 'timeline',
      question: 'Quando você precisa que isso seja concluído?',
      question_type: 'single_select',
      is_required: true,
      is_conditional: false,
      options: [
        { id: 21, option_key: 'urgent', label: 'Urgente (dentro de 1 mês)', icon: 'bolt' },
        { id: 22, option_key: 'soon', label: 'Em breve (1-3 meses)', icon: 'clock' },
        { id: 23, option_key: 'flexible', label: 'Flexível (3+ meses)', icon: 'calendar' },
        { id: 24, option_key: 'not_sure', label: 'Não tenho certeza', icon: 'question' },
      ],
    },
    {
      id: 7,
      step_number: 4,
      question_key: 'location',
      question: 'Onde você está localizado atualmente?',
      question_type: 'country',
      is_required: true,
      is_conditional: false,
    },
    {
      id: 8,
      step_number: 5,
      question_key: 'contact',
      question: 'Como podemos entrar em contato?',
      question_type: 'contact',
      is_required: true,
      is_conditional: false,
    },
  ],
};

// ============================================
// DEFAULT RULES (Fallback)
// ============================================
export const defaultRules: EligibilityRule[] = [
  { id: 1, rule_name: 'Citizenship - Married to Brazilian', result_type: 'likely_eligible', conditions: { service_interest: 'citizenship', citizenship_status: 'married_brazilian' }, priority: 100 },
  { id: 2, rule_name: 'Citizenship - Brazilian Descent', result_type: 'likely_eligible', conditions: { service_interest: 'citizenship', citizenship_status: 'brazilian_descent' }, priority: 100 },
  { id: 3, rule_name: 'Residency - Has Temporary', result_type: 'likely_eligible', conditions: { service_interest: 'residency', residency_status: 'yes_temporary' }, priority: 90 },
  { id: 4, rule_name: 'Visa - Tourist', result_type: 'likely_eligible', conditions: { service_interest: 'visa', visa_status: 'tourist' }, priority: 80 },
  { id: 5, rule_name: 'Visa - Business', result_type: 'likely_eligible', conditions: { service_interest: 'visa', visa_status: 'business' }, priority: 80 },
  { id: 6, rule_name: 'Citizenship - Resident 4+ Years', result_type: 'may_need_review', conditions: { service_interest: 'citizenship', citizenship_status: 'resident_4_years' }, priority: 70 },
  { id: 7, rule_name: 'Residency - No Current', result_type: 'may_need_review', conditions: { service_interest: 'residency', residency_status: 'no' }, priority: 70 },
  { id: 8, rule_name: 'Documents - Legalization', result_type: 'likely_eligible', conditions: { service_interest: 'documents', document_type: 'legalization' }, priority: 60 },
  { id: 9, rule_name: 'Documents - Apostille', result_type: 'likely_eligible', conditions: { service_interest: 'documents', document_type: 'apostille' }, priority: 60 },
  { id: 10, rule_name: 'Documents - Translation', result_type: 'likely_eligible', conditions: { service_interest: 'documents', document_type: 'translation' }, priority: 60 },
  { id: 11, rule_name: 'Not Sure - Default', result_type: 'contact_for_assessment', conditions: { service_interest: 'not_sure' }, priority: 50 },
  { id: 12, rule_name: 'Citizenship - None', result_type: 'contact_for_assessment', conditions: { service_interest: 'citizenship', citizenship_status: 'none' }, priority: 50 },
];

// ============================================
// DEFAULT RESULTS (Fallback)
// ============================================
export const defaultResults: Record<Locale, Record<string, EligibilityResult>> = {
  ar: {
    likely_eligible: {
      result_type: 'likely_eligible',
      icon: 'check-circle',
      icon_color: 'text-green-500',
      bg_color: 'bg-green-50',
      heading: 'أخبار سارة! من المرجح أنك مؤهل',
      description: 'بناءً على إجاباتك، يبدو أنك تستوفي المعايير الأساسية لهذه الخدمة. احجز استشارة لمناقشة الخطوات التالية.',
      primary_cta_text: 'احجز استشارة',
      primary_cta_link: '/book',
      secondary_cta_text: 'عرض الباقات',
      secondary_cta_link: '/pricing',
    },
    may_need_review: {
      result_type: 'may_need_review',
      icon: 'info-circle',
      icon_color: 'text-yellow-500',
      bg_color: 'bg-yellow-50',
      heading: 'حالتك تحتاج مراجعة',
      description: 'قد يتطلب وضعك وثائق إضافية أو تحقق. حدد موعدًا لتقييم مجاني لمناقشة خياراتك.',
      primary_cta_text: 'حدد موعد تقييم مجاني',
      primary_cta_link: '/book',
      secondary_cta_text: 'اتصل بنا',
      secondary_cta_link: '/contact',
    },
    contact_for_assessment: {
      result_type: 'contact_for_assessment',
      icon: 'chat-bubble',
      icon_color: 'text-blue-500',
      bg_color: 'bg-blue-50',
      heading: 'دعنا نناقش خياراتك',
      description: 'وضعك فريد ويستحق اهتمامًا شخصيًا. دعنا نساعدك على فهم خياراتك وإنشاء خطة.',
      primary_cta_text: 'احجز استشارة',
      primary_cta_link: '/book',
      secondary_cta_text: 'واتساب',
      secondary_cta_link: 'https://wa.me/5511999999999',
    },
  },
  en: {
    likely_eligible: {
      result_type: 'likely_eligible',
      icon: 'check-circle',
      icon_color: 'text-green-500',
      bg_color: 'bg-green-50',
      heading: 'Good News! You Likely Qualify',
      description: 'Based on your answers, you appear to meet the basic criteria for this service. Book a consultation to discuss the next steps.',
      primary_cta_text: 'Book Consultation',
      primary_cta_link: '/book',
      secondary_cta_text: 'View Packages',
      secondary_cta_link: '/pricing',
    },
    may_need_review: {
      result_type: 'may_need_review',
      icon: 'info-circle',
      icon_color: 'text-yellow-500',
      bg_color: 'bg-yellow-50',
      heading: 'Your Case Needs Review',
      description: 'Your situation may require additional documentation or verification. Schedule a free assessment to discuss your options.',
      primary_cta_text: 'Schedule Free Assessment',
      primary_cta_link: '/book',
      secondary_cta_text: 'Contact Us',
      secondary_cta_link: '/contact',
    },
    contact_for_assessment: {
      result_type: 'contact_for_assessment',
      icon: 'chat-bubble',
      icon_color: 'text-blue-500',
      bg_color: 'bg-blue-50',
      heading: "Let's Discuss Your Options",
      description: 'Your situation is unique and deserves personalized attention. Let us help you understand your options and create a plan.',
      primary_cta_text: 'Book a Consultation',
      primary_cta_link: '/book',
      secondary_cta_text: 'WhatsApp Us',
      secondary_cta_link: 'https://wa.me/5511999999999',
    },
  },
  es: {
    likely_eligible: {
      result_type: 'likely_eligible',
      icon: 'check-circle',
      icon_color: 'text-green-500',
      bg_color: 'bg-green-50',
      heading: '¡Buenas Noticias! Probablemente Calificas',
      description: 'Según tus respuestas, pareces cumplir con los criterios básicos para este servicio. Reserva una consulta para discutir los próximos pasos.',
      primary_cta_text: 'Reservar Consulta',
      primary_cta_link: '/book',
      secondary_cta_text: 'Ver Paquetes',
      secondary_cta_link: '/pricing',
    },
    may_need_review: {
      result_type: 'may_need_review',
      icon: 'info-circle',
      icon_color: 'text-yellow-500',
      bg_color: 'bg-yellow-50',
      heading: 'Tu Caso Necesita Revisión',
      description: 'Tu situación puede requerir documentación adicional o verificación. Programa una evaluación gratuita para discutir tus opciones.',
      primary_cta_text: 'Programar Evaluación Gratuita',
      primary_cta_link: '/book',
      secondary_cta_text: 'Contáctanos',
      secondary_cta_link: '/contact',
    },
    contact_for_assessment: {
      result_type: 'contact_for_assessment',
      icon: 'chat-bubble',
      icon_color: 'text-blue-500',
      bg_color: 'bg-blue-50',
      heading: 'Hablemos de Tus Opciones',
      description: 'Tu situación es única y merece atención personalizada. Permítenos ayudarte a entender tus opciones y crear un plan.',
      primary_cta_text: 'Reservar Consulta',
      primary_cta_link: '/book',
      secondary_cta_text: 'WhatsApp',
      secondary_cta_link: 'https://wa.me/5511999999999',
    },
  },
  'pt-br': {
    likely_eligible: {
      result_type: 'likely_eligible',
      icon: 'check-circle',
      icon_color: 'text-green-500',
      bg_color: 'bg-green-50',
      heading: 'Boas Notícias! Você Provavelmente Se Qualifica',
      description: 'Com base nas suas respostas, você parece atender aos critérios básicos para este serviço. Agende uma consulta para discutir os próximos passos.',
      primary_cta_text: 'Agendar Consulta',
      primary_cta_link: '/book',
      secondary_cta_text: 'Ver Pacotes',
      secondary_cta_link: '/pricing',
    },
    may_need_review: {
      result_type: 'may_need_review',
      icon: 'info-circle',
      icon_color: 'text-yellow-500',
      bg_color: 'bg-yellow-50',
      heading: 'Seu Caso Precisa de Revisão',
      description: 'Sua situação pode exigir documentação adicional ou verificação. Agende uma avaliação gratuita para discutir suas opções.',
      primary_cta_text: 'Agendar Avaliação Gratuita',
      primary_cta_link: '/book',
      secondary_cta_text: 'Entre em Contato',
      secondary_cta_link: '/contact',
    },
    contact_for_assessment: {
      result_type: 'contact_for_assessment',
      icon: 'chat-bubble',
      icon_color: 'text-blue-500',
      bg_color: 'bg-blue-50',
      heading: 'Vamos Discutir Suas Opções',
      description: 'Sua situação é única e merece atenção personalizada. Deixe-nos ajudá-lo a entender suas opções e criar um plano.',
      primary_cta_text: 'Agendar Consulta',
      primary_cta_link: '/book',
      secondary_cta_text: 'WhatsApp',
      secondary_cta_link: 'https://wa.me/5511999999999',
    },
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get the applicable questions based on current answers
 * Filters conditional questions based on parent question answers
 */
export function getApplicableQuestions(
  questions: EligibilityQuestion[],
  answers: EligibilityAnswers
): EligibilityQuestion[] {
  return questions.filter((q) => {
    // Non-conditional questions are always included
    if (!q.is_conditional) return true;

    // Check if parent question has the required answer
    if (q.parent_question_key && q.parent_answer_value) {
      const parentAnswer = answers[q.parent_question_key];
      return parentAnswer === q.parent_answer_value;
    }

    return true;
  });
}

/**
 * Group questions by step number
 */
export function groupQuestionsByStep(
  questions: EligibilityQuestion[]
): Map<number, EligibilityQuestion[]> {
  const grouped = new Map<number, EligibilityQuestion[]>();

  questions.forEach((q) => {
    const existing = grouped.get(q.step_number) || [];
    grouped.set(q.step_number, [...existing, q]);
  });

  return grouped;
}

/**
 * Evaluate eligibility based on answers and rules
 */
export function evaluateEligibility(
  answers: EligibilityAnswers,
  rules: EligibilityRule[]
): string {
  // Sort rules by priority (highest first)
  const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);

  for (const rule of sortedRules) {
    let matches = true;

    for (const [key, value] of Object.entries(rule.conditions)) {
      const answer = answers[key];
      if (typeof answer === 'string' && answer !== value) {
        matches = false;
        break;
      }
    }

    if (matches) {
      return rule.result_type;
    }
  }

  // Default to contact for assessment
  return 'contact_for_assessment';
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(
  currentStep: number,
  totalSteps: number
): number {
  return Math.round((currentStep / totalSteps) * 100);
}

/**
 * Validate contact info
 */
export function validateContactInfo(info: ContactInfo): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!info.name || info.name.trim().length < 2) {
    errors.name = 'Name is required';
  }

  if (!info.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
    errors.email = 'Valid email is required';
  }

  if (!info.consent) {
    errors.consent = 'Consent is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Country list for location selection
 */
export const countries = [
  { code: 'BR', name: { en: 'Brazil', ar: 'البرازيل', es: 'Brasil', 'pt-br': 'Brasil' } },
  { code: 'US', name: { en: 'United States', ar: 'الولايات المتحدة', es: 'Estados Unidos', 'pt-br': 'Estados Unidos' } },
  { code: 'AE', name: { en: 'UAE', ar: 'الإمارات', es: 'EAU', 'pt-br': 'EAU' } },
  { code: 'SA', name: { en: 'Saudi Arabia', ar: 'السعودية', es: 'Arabia Saudita', 'pt-br': 'Arábia Saudita' } },
  { code: 'EG', name: { en: 'Egypt', ar: 'مصر', es: 'Egipto', 'pt-br': 'Egito' } },
  { code: 'PT', name: { en: 'Portugal', ar: 'البرتغال', es: 'Portugal', 'pt-br': 'Portugal' } },
  { code: 'ES', name: { en: 'Spain', ar: 'إسبانيا', es: 'España', 'pt-br': 'Espanha' } },
  { code: 'DE', name: { en: 'Germany', ar: 'ألمانيا', es: 'Alemania', 'pt-br': 'Alemanha' } },
  { code: 'FR', name: { en: 'France', ar: 'فرنسا', es: 'Francia', 'pt-br': 'França' } },
  { code: 'GB', name: { en: 'United Kingdom', ar: 'المملكة المتحدة', es: 'Reino Unido', 'pt-br': 'Reino Unido' } },
  { code: 'AR', name: { en: 'Argentina', ar: 'الأرجنتين', es: 'Argentina', 'pt-br': 'Argentina' } },
  { code: 'MX', name: { en: 'Mexico', ar: 'المكسيك', es: 'México', 'pt-br': 'México' } },
  { code: 'CO', name: { en: 'Colombia', ar: 'كولومبيا', es: 'Colombia', 'pt-br': 'Colômbia' } },
  { code: 'OTHER', name: { en: 'Other', ar: 'أخرى', es: 'Otro', 'pt-br': 'Outro' } },
];
