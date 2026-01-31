'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Locale } from '@/lib/i18n';
import { generateWhatsAppUrl, WHATSAPP_NUMBER } from '@/lib/whatsapp';

interface WhatsAppButtonProps {
  locale: Locale;
}

export function WhatsAppButton({ locale }: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  
  const isRTL = locale === 'ar';
  
  // Delay appearance for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleClick = () => {
    const url = generateWhatsAppUrl(WHATSAPP_NUMBER, pathname, locale);
    window.open(url, '_blank');
  };
  
  if (!isVisible) return null;
  
  return (
    <button
      onClick={handleClick}
      className={`
        fixed z-50 w-14 h-14 rounded-full shadow-lg
        flex items-center justify-center
        bg-[#25D366] hover:bg-[#20BD5C] transition-all
        hover:scale-110 active:scale-95
        ${isRTL ? 'left-4 md:left-6' : 'right-4 md:right-6'}
        bottom-20 md:bottom-6
      `}
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <i className="ri-whatsapp-line text-white text-2xl" aria-hidden="true"></i>
    </button>
  );
}
