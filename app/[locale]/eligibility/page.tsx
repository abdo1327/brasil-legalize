import { Metadata } from 'next';
import { getDictionary, Locale } from '@/lib/i18n';
import EligibilityFlow from '@/components/eligibility/EligibilityFlow';

export async function generateMetadata({ 
  params 
}: { 
  params: { locale: Locale } 
}): Promise<Metadata> {
  const dict = getDictionary(params.locale);
  const eligibilityDict = dict.eligibility || {};
  
  return {
    title: eligibilityDict.pageTitle || 'Check Your Eligibility | Brasil Legalize',
    description: eligibilityDict.pageDescription || 'Find out if you qualify for Brazilian visa, residency, or citizenship services with our quick eligibility check.',
  };
}

export default function EligibilityPage({ 
  params 
}: { 
  params: { locale: Locale } 
}) {
  const dict = getDictionary(params.locale);
  const isRTL = params.locale === 'ar';
  const eligibilityDict = dict.eligibility || {};

  return (
    <div className="bg-gradient-to-b from-blue-50/50 via-white to-amber-50/30 py-12 md:py-20">
      <div className="container px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {eligibilityDict.title || 'Check Your Eligibility'}
          </h1>
          <p className="text-lg text-slate-600">
            {eligibilityDict.subtitle || 'Answer a few questions to find out which services best fit your situation.'}
          </p>
        </div>

        {/* Eligibility Flow */}
        <EligibilityFlow locale={params.locale} />
      </div>
    </div>
  );
}

