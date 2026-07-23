import React, { createContext, useContext, useState, useEffect } from 'react';
import { TranslationSchema, getTranslations, TRANSLATIONS } from './index';

interface I18nContextType {
  currentLang: string;
  setLanguage: (code: string) => void;
  translations: TranslationSchema;
  t: (path: string, fallback?: string) => string;
}

const STORAGE_KEY = 'sanjeevani_selected_language';

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLangState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || 'en';
  });

  const [translations, setTranslations] = useState<TranslationSchema>(() => {
    return getTranslations(currentLang);
  });

  const setLanguage = (code: string) => {
    const validCode = TRANSLATIONS[code] ? code : 'en';
    setCurrentLangState(validCode);
    setTranslations(getTranslations(validCode));
    localStorage.setItem(STORAGE_KEY, validCode);
  };

  useEffect(() => {
    setTranslations(getTranslations(currentLang));
  }, [currentLang]);

  /**
   * Safe path-based string translation resolver (e.g. t('hero.startVoiceBtn'))
   */
  const t = (path: string, fallback?: string): string => {
    const keys = path.split('.');
    let current: any = translations;
    let fallbackCurrent: any = TRANSLATIONS.en;

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        current = undefined;
      }
      if (fallbackCurrent && fallbackCurrent[key] !== undefined) {
        fallbackCurrent = fallbackCurrent[key];
      } else {
        fallbackCurrent = undefined;
      }
    }

    if (typeof current === 'string') return current;
    if (typeof fallbackCurrent === 'string') return fallbackCurrent;
    return fallback || path;
  };

  return (
    <I18nContext.Provider value={{ currentLang, setLanguage, translations, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
