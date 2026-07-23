import { TranslationSchema } from './types';
import { en } from './translations/en';
import { hi } from './translations/hi';
import { es } from './translations/es';
import { bn } from './translations/bn';
import { ta } from './translations/ta';
import { te } from './translations/te';
import { mr } from './translations/mr';
import { gu } from './translations/gu';
import { fr } from './translations/fr';
import { de } from './translations/de';

export const TRANSLATIONS: Record<string, TranslationSchema> = {
  en,
  hi,
  es,
  bn,
  ta,
  te,
  mr,
  gu,
  fr,
  de,
};

export const getTranslations = (langCode: string): TranslationSchema => {
  return TRANSLATIONS[langCode] || TRANSLATIONS.en;
};

export type { TranslationSchema };
