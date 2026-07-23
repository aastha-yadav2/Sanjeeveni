import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import {
  HeartPulse,
  Cpu,
  Lock,
  Globe2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  Eye
} from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

export const AboutPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-primary-500 selection:text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-16 pb-20 bg-gradient-to-b from-primary-900 via-slate-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-primary-500/20 text-primary-400 border border-primary-500/30 uppercase tracking-wider">
            {t('about.title')}
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            {t('about.subtitle')}
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t('about.missionDesc')}
          </p>
        </div>
      </section>

      {/* Content Body */}
      <main className="flex-1 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          {/* Mission Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider">
                <HeartPulse className="w-4 h-4" /> {t('about.missionTitle')}
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Empowering Patients with Natural Voice-First Triage
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                {t('about.missionDesc')}
              </p>
            </div>

            <div className="md:col-span-5">
              <div className="glass-card p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4 bg-gradient-to-br from-primary-50 to-secondary-50">
                <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center font-bold">
                  <Globe2 className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-slate-900">Multilingual Equity</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Language should never be a barrier to understanding your health. Sanjeevani AI natively supports English, Hindi, Spanish, Bengali, Tamil, Telugu, Marathi, Gujarati, French, and German.
                </p>
              </div>
            </div>
          </div>

          {/* How Gemma is Used Section */}
          <div className="glass-card p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-secondary-500 text-white flex items-center justify-center shadow-lg">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('about.techTitle')}</h2>
                <p className="text-xs text-slate-500 font-semibold">Lightweight, High-Precision Clinical Model Architecture</p>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed text-sm font-medium">
              {t('about.techDesc')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary-600" /> Context Awareness
                </h4>
                <p className="text-xs text-slate-500">Intelligent follow-up questions tailored to patient history.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary-600" /> Red Flag Detection
                </h4>
                <p className="text-xs text-slate-500">Instant identification of acute emergency symptoms.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary-600" /> Low Latency
                </h4>
                <p className="text-xs text-slate-500 font-medium">Fast, local voice response processing.</p>
              </div>
            </div>
          </div>

          {/* Pillars: Accessibility & Privacy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Accessibility */}
            <div className="glass-card p-8 rounded-3xl border border-slate-200 shadow-lg space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Accessibility Standards</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Designed according to WCAG AAA contrast guidelines with large touch targets, keyboard navigation support, high-contrast badges, and full Web Speech API voice readout.
              </p>
            </div>

            {/* Privacy */}
            <div className="glass-card p-8 rounded-3xl border border-slate-200 shadow-lg space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary-100 text-secondary-600 flex items-center justify-center font-bold">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{t('about.safetyTitle')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('about.safetyDesc')}
              </p>
            </div>

          </div>

          {/* Healthcare Disclaimer Callout */}
          <div className="p-8 bg-amber-500/10 border-2 border-amber-500/30 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-amber-700 font-extrabold text-sm uppercase tracking-wider">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>{t('about.disclaimerTitle')}</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              {t('about.disclaimerDesc')}
            </p>
          </div>

          {/* CTA Banner */}
          <div className="glass-card p-10 rounded-3xl border-2 border-primary-500/30 bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-center space-y-6 shadow-2xl">
            <h2 className="text-3xl font-black tracking-tight">{t('nav.startAssessment')}</h2>
            <p className="text-primary-100 text-sm max-w-xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-slate-100 px-8 py-4 rounded-2xl font-extrabold text-base shadow-xl transition-all"
            >
              <Sparkles className="w-5 h-5" />
              <span>{t('nav.startAssessment')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
