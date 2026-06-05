'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { LANGUAGES, Locale, translate } from '@/lib/i18n';

const STORAGE_KEY = 'tradam-language';

interface LanguageContextType {
  locale: Locale;
  setLanguage: (lang: Locale) => void;
  languages: typeof LANGUAGES;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored && LANGUAGES.some((item) => item.code === stored)) {
        setLocale(stored);
      } else {
        const browserLang = navigator.language?.slice(0, 2).toLowerCase();
        if (browserLang === 'fr') {
          setLocale('fr');
        }
      }
    } catch (error) {
      // silent fallback
    }
    setIsInitialized(true);
  }, []);

  const setLanguage = (lang: Locale) => {
    setLocale(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      // ignore storage errors
    }
  };

  const t = useMemo(() => {
    return (key: string) => translate(locale, key);
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    setLanguage,
    languages: LANGUAGES,
    t
  }), [locale, t]);

  // Avoid flash of untranslated content if possible, 
  // though for SSR we default to 'en'.
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
