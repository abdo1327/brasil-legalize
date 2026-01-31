'use client';

import { useState, useEffect, ReactNode } from 'react';
import { AdminLocaleContext } from './Header';
import { type AdminLocale, getAdminDictionary } from '@/lib/admin/translations';

interface AdminLocaleProviderProps {
  children: ReactNode;
}

export function AdminLocaleProvider({ children }: AdminLocaleProviderProps) {
  const [locale, setLocale] = useState<AdminLocale>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem('adminLocale') as AdminLocale;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'pt-br')) {
      setLocale(savedLocale);
    }
    setIsLoaded(true);
  }, []);

  // Update localStorage when locale changes
  const handleSetLocale = (newLocale: AdminLocale) => {
    setLocale(newLocale);
    localStorage.setItem('adminLocale', newLocale);
  };

  // Don't render until we've loaded the locale from localStorage
  // This prevents hydration mismatch
  if (!isLoaded) {
    return null;
  }

  return (
    <AdminLocaleContext.Provider
      value={{
        locale,
        setLocale: handleSetLocale,
        t: getAdminDictionary(locale),
      }}
    >
      {children}
    </AdminLocaleContext.Provider>
  );
}
