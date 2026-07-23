import React from 'react';
import { HealthSummary } from '../../types/triage';
import { UrgencyBadge } from '../ui/UrgencyBadge';
import { FileText, RotateCcw, AlertOctagon, Activity, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';

interface HealthSummarySidebarProps {
  summary: HealthSummary;
  onClearSession: () => void;
}

export const HealthSummarySidebar: React.FC<HealthSummarySidebarProps> = ({
  summary,
  onClearSession,
}) => {
  const navigate = useNavigate();
  const { t } = useI18n();

  const handleDownloadReportClick = () => {
    navigate('/report');
  };

  return (
    <div className="space-y-4">
      {/* Main Glass Card */}
      <div className="glass-card p-5 border border-white/80 shadow-xl space-y-4 relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 tracking-tight">{t('summary.title')}</h3>
              <p className="text-[10px] text-slate-400 font-medium">Google Gemma Engine Active</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Sparkles className="w-3 h-3" /> Live
          </span>
        </div>

        {/* Emergency Alert Banner if summary.emergency is true */}
        {summary.emergency && (
          <div className="p-3.5 bg-red-600 text-white rounded-2xl shadow-lg shadow-red-600/30 animate-pulse space-y-1.5">
            <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider">
              <AlertOctagon className="w-5 h-5 shrink-0" />
              <span>{t('chat.emergencyAlertTitle')}</span>
            </div>
            <p className="text-xs text-red-100 leading-snug font-medium">
              {t('chat.emergencyAlertDesc')}
            </p>
          </div>
        )}

        {/* Urgency Level Rating */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t('summary.urgencyTitle')}
          </label>
          <div>
            <UrgencyBadge level={summary.urgency} size="lg" />
          </div>
        </div>

        {/* Reported Symptoms */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t('summary.symptomsTitle')}
          </label>
          {summary.symptoms.length === 0 ? (
            <p className="text-xs text-slate-400 italic">{t('summary.noSymptoms')}</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {summary.symptoms.map((symptom, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200/60"
                >
                  {symptom}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Duration & Timeline */}
        <div className="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-primary-500" /> {t('report.duration')}
          </span>
          <span className="font-bold text-slate-800">{summary.duration || 'Unspecified'}</span>
        </div>

        {/* Gemma Recommendation Box */}
        <div className="p-3.5 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl border border-primary-100 space-y-1">
          <span className="text-[10px] font-bold text-primary-700 uppercase tracking-wider block">
            {t('summary.carePathwayTitle')}
          </span>
          <p className="text-xs text-slate-700 font-medium leading-relaxed">
            {summary.recommendation || 'Provide symptoms to view care recommendation.'}
          </p>
        </div>

        {/* AI Confidence Meter */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>{t('summary.confidenceTitle')}</span>
            <span className="text-primary-600 font-extrabold">{summary.confidence}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-600 to-secondary-500 rounded-full transition-all duration-500"
              style={{ width: `${summary.confidence}%` }}
            ></div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-2 border-t border-slate-100">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>{t('summary.disclaimer')}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleDownloadReportClick}
          className="w-full gradient-button py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>{t('chat.exportReport')}</span>
        </button>

        <button
          onClick={onClearSession}
          className="w-full bg-white/80 hover:bg-slate-100 border border-slate-200 text-slate-700 py-2.5 px-4 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t('chat.clearSession')}</span>
        </button>
      </div>
    </div>
  );
};
