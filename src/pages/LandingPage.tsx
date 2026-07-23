import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Mic,
  Globe2,
  BrainCircuit,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Lock,
  Eye,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Activity,
  HeartPulse,
  Thermometer,
  Zap,
  Activity as HeadacheIcon
} from 'lucide-react';
import { FAQ_DATA } from '../data/faqData';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useI18n } from '../i18n/I18nContext';

export const LandingPage: React.FC = () => {
  const { t, currentLang } = useI18n();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedDemoLang, setSelectedDemoLang] = useState('en');

  const demoPhrases: Record<string, { prompt: string; reply: string }> = {
    en: {
      prompt: "I have had fever and cough for two days.",
      reply: "I understand. To evaluate your symptoms, what is your age and are you having any difficulty breathing?"
    },
    hi: {
      prompt: "मुझे 2 दिनों से तेज़ बुखार और खांसी है।",
      reply: "समझ गया। आपके लक्षणों का आकलन करने के लिए, आपकी उम्र क्या है और क्या आपको सांस लेने में कोई तकलीफ है?"
    },
    es: {
      prompt: "He tenido fiebre y tos durante dos días.",
      reply: "Entendido. Para evaluar sus síntomas, ¿cuál es su edad y tiene alguna dificultad para respirar?"
    },
    bn: {
      prompt: "আমার ২ দিন ধরে জ্বর ও কাশি আছে।",
      reply: "বুঝতে পেরেছি। আপনার উপসর্গ মূল্যায়ন করতে, আপনার বয়স কত এবং শ্বাসকষ্ট হচ্ছে কি?"
    },
    ta: {
      prompt: "எனக்கு 2 நாட்களாக காய்ச்சல் மற்றும் இருமல் உள்ளது.",
      reply: "புரிந்தது. உங்கள் அறிகுறிகளை மதிப்பிட, உங்கள் வயது என்ன மற்றும் மூச்சுத்திணறல் உள்ளதா?"
    }
  };

  const currentDemo = demoPhrases[selectedDemoLang] || demoPhrases.en;

  const quickActionCards = [
    {
      title: t('quickActions.fever'),
      subtitle: t('quickActions.feverSub'),
      query: 'I have fever and body aches',
      icon: Thermometer,
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      title: t('quickActions.chestPain'),
      subtitle: t('quickActions.chestPainSub'),
      query: 'I have chest pain and shortness of breath',
      icon: Zap,
      gradient: 'from-red-500 to-rose-600',
    },
    {
      title: t('quickActions.headache'),
      subtitle: t('quickActions.headacheSub'),
      query: 'I have severe headache',
      icon: HeadacheIcon,
      gradient: 'from-purple-500 to-indigo-600',
    },
    {
      title: t('quickActions.stomachPain'),
      subtitle: t('quickActions.stomachPainSub'),
      query: 'I have stomach pain and nausea',
      icon: Activity,
      gradient: 'from-emerald-500 to-teal-600',
    },
  ];

  const features = [
    {
      icon: Globe2,
      title: t('features.f1Title'),
      description: t('features.f1Desc'),
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: Mic,
      title: t('features.f2Title'),
      description: t('features.f2Desc'),
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      icon: BrainCircuit,
      title: t('features.f3Title'),
      description: t('features.f3Desc'),
      gradient: "from-purple-500 to-primary-600"
    },
    {
      icon: AlertTriangle,
      title: t('features.f4Title'),
      description: t('features.f4Desc'),
      gradient: "from-amber-500 to-red-500"
    },
    {
      icon: FileText,
      title: t('features.f5Title'),
      description: t('features.f5Desc'),
      gradient: "from-emerald-500 to-teal-600"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-primary-500 selection:text-white">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Decorative Ambient Radial Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-primary-500/15 to-secondary-400/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">

              {/* Gemma Powered Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-primary-200/80 shadow-sm backdrop-blur-md">
                <span className="flex h-2.5 w-2.5 rounded-full bg-primary-600 animate-ping"></span>
                <span className="text-xs font-bold text-slate-800">
                  {t('hero.badge')}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-primary-100 text-primary-700 font-extrabold uppercase">
                  v4.0
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                {t('hero.title1')} <br className="hidden sm:block" />
                <span className="gradient-text">{t('hero.title2')}</span>
              </h1>

              {/* Subheading */}
              <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {t('hero.subtitle')}
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/assessment"
                  className="w-full sm:w-auto gradient-button px-8 py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-3 shadow-xl shadow-primary-500/30 scale-100 hover:scale-105 transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{t('hero.startVoiceBtn')}</span>
                </Link>

                <a
                  href="#features"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-base flex items-center justify-center gap-2 hover:bg-slate-100/80 transition-all shadow-sm"
                >
                  <span>{t('hero.viewDemoBtn')}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </a>
              </div>

              {/* Quick Actions Starter Grid */}
              <div className="pt-4 space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('hero.quickActionTitle')}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {quickActionCards.map((card, index) => {
                    const CardIcon = card.icon;
                    return (
                      <Link
                        key={index}
                        to={`/assessment?q=${encodeURIComponent(card.query)}`}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-white/90 border border-slate-200/80 hover:border-primary-400 hover:bg-primary-50/50 shadow-sm transition-all group"
                      >
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${card.gradient} text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                          <CardIcon className="w-4 h-4" />
                        </div>
                        <div className="text-left overflow-hidden">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-primary-600 transition-colors truncate">{card.title}</h4>
                          <p className="text-[11px] text-slate-500 truncate">{card.subtitle}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-bold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t('hero.trust1')}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary-500" /> {t('hero.trust2')}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-secondary-500" /> {t('hero.trust3')}
                </span>
              </div>
            </div>

            {/* Right Hero Interactive Visual */}
            <div className="lg:col-span-5 relative">

              {/* Main Visual Glass Card */}
              <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/80 shadow-2xl space-y-6 relative z-10 backdrop-blur-xl">

                {/* Visual Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200/70">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center text-white shadow-md">
                      <HeartPulse className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 block">Interactive Gemma Preview</span>
                      <span className="text-[10px] text-slate-400 font-semibold">Select language to preview AI response</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ● Live Engine
                  </span>
                </div>

                {/* Interactive Language Selector Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {['en', 'hi', 'es', 'bn', 'ta'].map((langCode) => (
                    <button
                      key={langCode}
                      onClick={() => setSelectedDemoLang(langCode)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        selectedDemoLang === langCode
                          ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                          : 'bg-white/80 text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {SUPPORTED_LANGUAGES.find(l => l.code === langCode)?.flag} {SUPPORTED_LANGUAGES.find(l => l.code === langCode)?.nativeName}
                    </button>
                  ))}
                </div>

                {/* Simulated Conversation Bubble */}
                <div className="space-y-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-primary-600 text-white text-xs font-semibold shadow-md shadow-primary-600/20 ml-6">
                    <div className="flex items-center gap-1.5 text-[10px] text-primary-200 mb-1">
                      <Mic className="w-3 h-3" /> User Voice Input ({selectedDemoLang.toUpperCase()})
                    </div>
                    "{currentDemo.prompt}"
                  </div>

                  <div className="p-4 rounded-2xl glass-card border-primary-100 text-slate-800 text-xs font-medium space-y-2 mr-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary-600" />
                      <span className="font-bold text-primary-600 text-[11px]">Google Gemma AI</span>
                    </div>
                    <p className="leading-relaxed">"{currentDemo.reply}"</p>
                  </div>
                </div>

                {/* Floating Interactive Badges */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-bold border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-secondary-500" /> Urgency: Moderate
                  </span>
                  <span className="flex items-center gap-1 text-primary-600">
                    <Sparkles className="w-3.5 h-3.5" /> 95% Confidence
                  </span>
                </div>
              </div>

              {/* Floating Decorative Cards */}
              <div className="absolute -top-6 -left-6 glass-card p-3 rounded-2xl shadow-xl border border-white hidden sm:flex items-center gap-2 text-xs font-bold text-slate-700 animate-float">
                <Mic className="w-4 h-4 text-secondary-500" /> Real-time Speech-to-Text
              </div>

              <div className="absolute -bottom-6 -right-6 glass-card p-3.5 rounded-2xl shadow-xl border border-white hidden sm:flex items-center gap-2 text-xs font-bold text-slate-700 animate-float" style={{ animationDelay: '2s' }}>
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Zero Data Selling
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 bg-white/70 backdrop-blur-md relative border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-primary-100 text-primary-700 uppercase tracking-wider">
              Intelligent Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t('features.title')}
            </h2>
            <p className="text-slate-600 font-medium text-base">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="glass-card glass-card-hover p-8 rounded-3xl border border-slate-200/80 space-y-5 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${feature.gradient} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-primary-600">
                    <span>Explore feature</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}

            {/* Special Callout Feature Card */}
            <div className="glass-card p-8 rounded-3xl border-2 border-primary-500/30 bg-gradient-to-br from-primary-600 to-secondary-600 text-white space-y-6 flex flex-col justify-between shadow-xl">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
                  <Sparkles className="w-7 h-7 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <h3 className="text-xl font-black tracking-tight">Ready to Test Sanjeevani AI?</h3>
                <p className="text-sm text-primary-100 leading-relaxed">
                  Start your interactive health assessment right now with our simulated Gemma AI Triage Engine.
                </p>
              </div>

              <Link
                to="/assessment"
                className="w-full bg-white text-primary-700 hover:bg-slate-100 py-3.5 px-6 rounded-2xl font-extrabold text-sm text-center flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>Launch Health Chat</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">

            <div className="space-y-4">
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-primary-500/20 text-primary-400 border border-primary-500/30 uppercase tracking-wider">
                Built on Trust
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Safety & Transparency at the Core
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                We believe healthcare AI must be responsible, transparent, and respectful of individual privacy.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">

              <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-white">✓ AI Assisted</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Augments patient understanding without replacing certified medical clinicians.
                </p>
              </div>

              <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-white">✓ Privacy Focused</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Zero local data retention, no selling of user profiles or medical queries.
                </p>
              </div>

              <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-secondary-500/20 text-secondary-400 flex items-center justify-center font-bold">
                  <Eye className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-white">✓ Accessibility First</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Full WCAG contrast compliance, voice-enabled controls, and keyboard navigation.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center space-y-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-secondary-100 text-secondary-700 uppercase tracking-wider">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t('faq.title')}
            </h2>
            <p className="text-slate-600 font-medium text-base">
              {t('faq.subtitle')}
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_DATA.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="glass-card rounded-2xl border border-slate-200/80 overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                  >
                    <span className="font-extrabold text-base text-slate-900">{item.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-primary-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
