import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Sparkles, Menu, X, Globe, HeartPulse } from 'lucide-react';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '../../data/languages';

interface NavbarProps {
  currentLang?: string;
  onSelectLang?: (code: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentLang = 'en', onSelectLang }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const activeLang = getLanguageByCode(currentLang);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Health Assessment', path: '/assessment' },
    { name: 'Features', path: '/#features' },
    { name: 'About', path: '/about' },
    { name: 'FAQ', path: '/#faq' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6.5 h-6.5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Sanjeevani <span className="gradient-text">AI</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-50 text-primary-600 border border-primary-200">
                  Gemma Powered
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Multilingual Triage Assistant</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/60 p-1.5 rounded-full border border-slate-200/80 shadow-sm backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                    : 'text-slate-600 hover:text-primary-600 hover:bg-slate-100/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons & Language Selector */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Language Selector Dropdown */}
            {onSelectLang && (
              <div className="relative">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
                >
                  <Globe className="w-4 h-4 text-primary-600" />
                  <span>{activeLang.flag} {activeLang.nativeName}</span>
                </button>

                {langDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/95 rounded-2xl shadow-xl border border-slate-200 py-2 z-50 backdrop-blur-lg">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          onSelectLang(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left font-medium transition-colors ${
                          currentLang === lang.code
                            ? 'bg-primary-50 text-primary-600 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-base">{lang.flag}</span>
                        <span>{lang.nativeName} ({lang.name})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Link
              to="/assessment"
              className="gradient-button px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md shadow-primary-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Assessment</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card mx-4 mb-4 p-4 border border-slate-200/80 rounded-2xl shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-base font-semibold ${
                  isActive(link.path)
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {onSelectLang && (
              <div className="mt-2 pt-2 border-t border-slate-200">
                <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Language</p>
                <div className="grid grid-cols-2 gap-2">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onSelectLang(lang.code);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${
                        currentLang === lang.code
                          ? 'bg-primary-100 text-primary-700 font-bold border border-primary-300'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span className="truncate">{lang.nativeName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Link
              to="/assessment"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-3 w-full gradient-button py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Health Assessment</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
