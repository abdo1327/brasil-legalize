'use client';

import { useEffect, useState } from 'react';
import { Locale } from '@/lib/i18n';

interface CalendlyEmbedProps {
  locale: Locale;
}

const CALENDLY_URL = 'https://calendly.com/contact-mainsightsbi/30min';

const calendlyLocaleMap: Record<string, string> = {
  en: 'en',
  es: 'es',
  'pt-br': 'pt-BR',
  ar: 'en', // Fallback - Calendly doesn't support Arabic
};

export function CalendlyEmbed({ locale }: CalendlyEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    // Load Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => setError(true);
    document.body.appendChild(script);
    
    // Timeout for error fallback
    const errorTimeout = setTimeout(() => {
      if (!isLoaded) {
        setError(true);
      }
    }, 15000);
    
    return () => {
      clearTimeout(errorTimeout);
      // Don't remove script as it might be used elsewhere
    };
  }, [isLoaded]);
  
  const getCalendlyUrl = () => {
    const url = new URL(CALENDLY_URL);
    url.searchParams.set('hide_gdpr_banner', '1');
    url.searchParams.set('hide_landing_page_details', '1');
    return url.toString();
  };
  
  if (error) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
        <i className="ri-calendar-line text-4xl text-amber-500 mb-4" aria-hidden="true"></i>
        <p className="text-amber-800 mb-4">
          Unable to load booking calendar. Please use the direct link below.
        </p>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2"
        >
          Open Booking Calendar
          <i className="ri-external-link-line" aria-hidden="true"></i>
        </a>
      </div>
    );
  }
  
  return (
    <div className="relative">
      {!isLoaded && (
        <div className="flex items-center justify-center h-[650px] bg-neutral-50 rounded-xl">
          <div className="text-center">
            <i className="ri-loader-4-line text-4xl text-primary animate-spin mb-4" aria-hidden="true"></i>
            <p className="text-neutral-500">Loading booking calendar...</p>
          </div>
        </div>
      )}
      
      <div
        className="calendly-inline-widget"
        data-url={getCalendlyUrl()}
        style={{ 
          minWidth: '320px', 
          height: '700px',
          display: isLoaded ? 'block' : 'none'
        }}
      />
    </div>
  );
}
