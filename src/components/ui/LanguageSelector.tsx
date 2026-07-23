import React from 'react';
import { Globe, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '../../data/languages';

interface LanguageSelectorProps {
  currentLang: string;
  onChange: (langCode: string) => void;
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLang,
  onChange,
  compact = false,
}) => {
  const activeLanguage = getLanguageByCode(currentLang);

  if (compact) {
    return (
      <select
        value={currentLang}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/80 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm cursor-pointer"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.nativeName}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-md p-2 rounded-2xl border border-slate-200/80 shadow-sm">
      <div className="flex items-center gap-2 px-3 py-1.5 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <Globe className="w-4 h-4 text-primary-600" />
        <span>Select Triage Language</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = currentLang === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => onChange(lang.code)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-primary-600 text-white font-bold shadow-sm shadow-primary-500/30'
                  : 'bg-white/90 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.nativeName}</span>
              </span>
              {isSelected && <Check className="w-3.5 h-3.5 ml-1" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
