import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ShieldCheck, Cpu, Eye, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-secondary-400 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Sanjeevani <span className="text-secondary-400">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Multilingual, voice-first health triage assistant powered by Google Gemma. Intelligent symptom guidance in your language.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> HIPAA/Privacy-Conscious
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/assessment" className="text-slate-400 hover:text-white transition-colors">Start Health Assessment</Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">About & Technology</Link>
              </li>
              <li>
                <a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a>
              </li>
              <li>
                <a href="#faq" className="text-slate-400 hover:text-white transition-colors">FAQ</a>
              </li>
            </ul>
          </div>

          {/* Core Pillars */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Core Principles</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary-400" />
                <span>Google Gemma AI Engine</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-secondary-400" />
                <span>Privacy-First Architecture</span>
              </li>
              <li className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>Accessibility Compliant</span>
              </li>
            </ul>
          </div>

          {/* Healthcare Disclaimer Callout */}
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <span>⚠️ Important Disclaimer</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sanjeevani AI provides educational health triage guidance only. It does <strong>NOT</strong> diagnose medical conditions, provide prescriptions, or replace human doctors. If experiencing a medical emergency, call 911 / 108 immediately.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Sanjeevani AI. Powered by Google Gemma. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="https://github.com/aastha-yadav2/Sanjeeveni" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1">
              GitHub Repo <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <Link to="/about" className="hover:text-white">Privacy & Safety</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
