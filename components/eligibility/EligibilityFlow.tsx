'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Locale, getDictionary } from '@/lib/i18n';
import {
  EligibilityQuestion,
  EligibilityAnswers,
  EligibilityResult,
  ContactInfo,
  defaultQuestions,
  defaultRules,
  defaultResults,
  getApplicableQuestions,
  evaluateEligibility,
  validateContactInfo,
  calculateProgress,
  countries,
} from '@/lib/eligibility';

// Icons component
const Icons = {
  passport: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  home: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  flag: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
    </svg>
  ),
  document: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  question: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  plane: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  briefcase: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  clock: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'check-circle': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'x-circle': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  family: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  heart: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  calendar: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  stamp: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  language: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
    </svg>
  ),
  certificate: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  bolt: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  dots: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
  ),
  'info-circle': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'chat-bubble': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  'arrow-left': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  'arrow-right': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
};

const getIcon = (iconName?: string) => {
  if (!iconName) return null;
  return Icons[iconName as keyof typeof Icons] || Icons.question;
};

// Progress Bar Component
function ProgressBar({ progress, isRTL }: { progress: number; isRTL: boolean }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm text-slate-600 mb-2">
        <span>{isRTL ? 'التقدم' : 'Progress'}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}

// Option Button Component
function OptionButton({
  option,
  isSelected,
  onClick,
  isRTL,
}: {
  option: { option_key: string; label: string; icon?: string };
  isSelected: boolean;
  onClick: () => void;
  isRTL: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full p-4 rounded-xl border-2 transition-all text-${isRTL ? 'right' : 'left'} flex items-center gap-4 ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <span className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
      }`}>
        {getIcon(option.icon)}
      </span>
      <span className={`flex-1 font-medium ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
        {option.label}
      </span>
      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
        isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
      }`}>
        {isSelected && (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
    </motion.button>
  );
}

// Country Select Component
function CountrySelect({
  locale,
  value,
  onChange,
  isRTL,
  dict,
}: {
  locale: Locale;
  value: string;
  onChange: (v: string) => void;
  isRTL: boolean;
  dict: ReturnType<typeof getDictionary>;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {countries.map((country) => (
        <motion.button
          key={country.code}
          onClick={() => onChange(country.code)}
          className={`p-3 rounded-xl border-2 transition-all text-center ${
            value === country.code
              ? 'border-blue-500 bg-blue-50 shadow-md'
              : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className={`text-sm font-medium ${value === country.code ? 'text-blue-700' : 'text-slate-700'}`}>
            {country.name[locale] || country.name.en}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

// Contact Form Component
function ContactForm({
  value,
  onChange,
  errors,
  isRTL,
  dict,
}: {
  value: ContactInfo;
  onChange: (v: ContactInfo) => void;
  errors: Record<string, string>;
  isRTL: boolean;
  dict: ReturnType<typeof getDictionary>;
}) {
  const eligibilityDict = dict.eligibility || {};
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {eligibilityDict.name || 'Full Name'} *
        </label>
        <input
          type="text"
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:border-blue-500 ${
            errors.name ? 'border-red-400' : 'border-slate-200'
          }`}
          placeholder={eligibilityDict.namePlaceholder || 'Enter your full name'}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {eligibilityDict.email || 'Email Address'} *
        </label>
        <input
          type="email"
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:border-blue-500 ${
            errors.email ? 'border-red-400' : 'border-slate-200'
          }`}
          placeholder={eligibilityDict.emailPlaceholder || 'your@email.com'}
          dir="ltr"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {eligibilityDict.phone || 'Phone / WhatsApp'}
        </label>
        <input
          type="tel"
          value={value.phone || ''}
          onChange={(e) => onChange({ ...value, phone: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 transition-all focus:outline-none focus:border-blue-500"
          placeholder={eligibilityDict.phonePlaceholder || '+1 234 567 8900'}
          dir="ltr"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {eligibilityDict.city || 'City'}
        </label>
        <input
          type="text"
          value={value.city || ''}
          onChange={(e) => onChange({ ...value, city: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 transition-all focus:outline-none focus:border-blue-500"
          placeholder={eligibilityDict.cityPlaceholder || 'Your city'}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </div>

      <div className="flex items-start gap-3 pt-2">
        <input
          type="checkbox"
          id="consent"
          checked={value.consent}
          onChange={(e) => onChange({ ...value, consent: e.target.checked })}
          className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="consent" className="text-sm text-slate-600">
          {eligibilityDict.consentText || 'I agree to the privacy policy and consent to being contacted regarding my inquiry.'} *
        </label>
      </div>
      {errors.consent && <p className="text-red-500 text-xs">{errors.consent}</p>}
    </div>
  );
}

// Result Display Component
function ResultDisplay({
  result,
  locale,
  isRTL,
}: {
  result: EligibilityResult;
  locale: Locale;
  isRTL: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-8 ${result.bg_color}`}
    >
      <div className="text-center mb-6">
        <span className={`inline-flex w-16 h-16 rounded-full items-center justify-center ${result.bg_color} ${result.icon_color}`}>
          <span className="w-10 h-10">{getIcon(result.icon)}</span>
        </span>
      </div>
      
      <h2 className={`text-2xl font-bold text-center mb-4 ${result.icon_color.replace('text-', 'text-').replace('-500', '-700')}`}>
        {result.heading}
      </h2>
      
      <p className="text-center text-slate-600 mb-8">
        {result.description}
      </p>

      <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <a
          href={`/${locale}${result.primary_cta_link}`}
          className="btn-primary px-8 py-3 text-center"
        >
          {result.primary_cta_text}
        </a>
        <a
          href={result.secondary_cta_link.startsWith('http') ? result.secondary_cta_link : `/${locale}${result.secondary_cta_link}`}
          className="btn-outline px-8 py-3 text-center"
          target={result.secondary_cta_link.startsWith('http') ? '_blank' : undefined}
          rel={result.secondary_cta_link.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {result.secondary_cta_text}
        </a>
      </div>
    </motion.div>
  );
}

// Main EligibilityFlow Component
export default function EligibilityFlow({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const isRTL = locale === 'ar';
  
  // Get questions for locale
  const allQuestions = defaultQuestions[locale] || defaultQuestions.en;
  const rules = defaultRules;
  const results = defaultResults[locale] || defaultResults.en;

  // State
  const [answers, setAnswers] = useState<EligibilityAnswers>({});
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    consent: false,
  });
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultType, setResultType] = useState<string>('');

  // Get applicable questions based on answers
  const applicableQuestions = useMemo(
    () => getApplicableQuestions(allQuestions, answers),
    [allQuestions, answers]
  );

  // Get unique step numbers
  const steps = useMemo(() => {
    const stepSet = new Set(applicableQuestions.map((q) => q.step_number));
    return Array.from(stepSet).sort((a, b) => a - b);
  }, [applicableQuestions]);

  // Current step state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStepNumber = steps[currentStepIndex];

  // Questions for current step
  const currentQuestions = useMemo(
    () => applicableQuestions.filter((q) => q.step_number === currentStepNumber),
    [applicableQuestions, currentStepNumber]
  );

  // Progress
  const progress = calculateProgress(currentStepIndex + 1, steps.length);

  // Handle answer selection
  const handleAnswer = useCallback((questionKey: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: value }));
  }, []);

  // Handle location selection
  const handleLocationSelect = useCallback((country: string) => {
    setAnswers((prev) => ({ ...prev, location: country }));
    setContactInfo((prev) => ({ ...prev, country }));
  }, []);

  // Check if current step is complete
  const isStepComplete = useMemo(() => {
    if (currentQuestions.length === 0) return true;
    
    const currentQ = currentQuestions[0];
    
    if (currentQ.question_type === 'contact') {
      const validation = validateContactInfo(contactInfo);
      return validation.valid;
    }
    
    return currentQuestions.every((q) => {
      const answer = answers[q.question_key];
      return !q.is_required || (answer && answer !== '');
    });
  }, [currentQuestions, answers, contactInfo]);

  // Navigation
  const goNext = useCallback(async () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Final step - validate and submit
      const validation = validateContactInfo(contactInfo);
      if (!validation.valid) {
        setContactErrors(validation.errors);
        return;
      }
      setContactErrors({});
      
      setIsSubmitting(true);
      
      try {
        // Evaluate eligibility
        const result = evaluateEligibility(answers, rules);
        setResultType(result);

        // Submit lead
        await fetch('/api/leads.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...contactInfo,
            answers,
            eligibility_result: result,
            locale,
          }),
        });

        setShowResult(true);
      } catch (error) {
        console.error('Error submitting:', error);
        // Still show result even if API fails
        const result = evaluateEligibility(answers, rules);
        setResultType(result);
        setShowResult(true);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [currentStepIndex, steps.length, contactInfo, answers, rules, locale]);

  const goBack = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  // Render current step content
  const renderStepContent = () => {
    if (currentQuestions.length === 0) return null;

    const question = currentQuestions[0];

    switch (question.question_type) {
      case 'single_select':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <OptionButton
                key={option.option_key}
                option={option}
                isSelected={answers[question.question_key] === option.option_key}
                onClick={() => handleAnswer(question.question_key, option.option_key)}
                isRTL={isRTL}
              />
            ))}
          </div>
        );

      case 'country':
        return (
          <CountrySelect
            locale={locale}
            value={(answers[question.question_key] as string) || ''}
            onChange={(v) => handleLocationSelect(v)}
            isRTL={isRTL}
            dict={dict}
          />
        );

      case 'contact':
        return (
          <ContactForm
            value={contactInfo}
            onChange={setContactInfo}
            errors={contactErrors}
            isRTL={isRTL}
            dict={dict}
          />
        );

      default:
        return null;
    }
  };

  // Eligibility translations
  const eligibilityDict = dict.eligibility || {};

  if (showResult && resultType) {
    const result = results[resultType];
    return (
      <div className="max-w-2xl mx-auto">
        <ResultDisplay result={result} locale={locale} isRTL={isRTL} />
        
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setShowResult(false);
              setResultType('');
              setAnswers({});
              setContactInfo({ name: '', email: '', phone: '', city: '', country: '', consent: false });
              setCurrentStepIndex(0);
            }}
            className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
          >
            {eligibilityDict.startOver || 'Start Over'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <ProgressBar progress={progress} isRTL={isRTL} />

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index <= currentStepIndex ? 'bg-blue-600 w-3' : 'bg-slate-300'
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepNumber}
          initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8"
        >
          {currentQuestions.length > 0 && (
            <>
              <h2 className={`text-xl md:text-2xl font-semibold mb-6 text-${isRTL ? 'right' : 'left'}`}>
                {currentQuestions[0].question}
              </h2>

              {renderStepContent()}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className={`flex items-center justify-between mt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button
          onClick={goBack}
          disabled={currentStepIndex === 0}
          className={`flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {isRTL ? Icons['arrow-right'] : Icons['arrow-left']}
          <span>{eligibilityDict.back || 'Back'}</span>
        </button>

        <button
          onClick={goNext}
          disabled={!isStepComplete || isSubmitting}
          className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {isSubmitting ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>
                {currentStepIndex === steps.length - 1
                  ? eligibilityDict.submit || 'Get Results'
                  : eligibilityDict.next || 'Continue'}
              </span>
              {isRTL ? Icons['arrow-left'] : Icons['arrow-right']}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
