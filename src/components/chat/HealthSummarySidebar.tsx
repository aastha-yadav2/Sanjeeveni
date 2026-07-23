import React from 'react';
import { HealthSummary } from '../../types/triage';
import { UrgencyBadge } from '../ui/UrgencyBadge';
import { FileText, RotateCcw, AlertOctagon, Activity, Sparkles, Stethoscope, Clock, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HealthSummarySidebarProps {
  summary: HealthSummary;
  onClearSession: () => void;
}

export const HealthSummarySidebar: React.FC<HealthSummarySidebarProps> = ({
  summary,
  onClearSession,
}) => {
  const navigate = useNavigate();

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
              <h3 className="font-extrabold text-sm text-slate-800 tracking-tight">Live Health Summary</h3>
              <p className="text-[10px] text-slate-400 font-medium">Real-time Gemma AI Extraction</p>
            </div>
          </div>
          
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Sparkles className="w-3 h-3" /> Live
          </span>
        </div>

        {/* Emergency Alert Banner if Emergency Status is true */}
        {summary.emergencyStatus && (
          <div className="p-3.5 bg-red-600 text-white rounded-2xl shadow-lg shadow-red-600/30 animate-pulse space-y-1.5">
            <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider">
              <AlertOctagon className="w-5 h-5 shrink-0" />
              <span>EMERGENCY ALERT</span>
            </div>
            <p className="text-xs text-red-100 leading-snug font-medium">
              Immediate medical evaluation required. Call 911 or emergency services now.
            </p>
          </div>
        )}

        {/* Urgency Level Rating */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Urgency Assessment
          </label>
          <div>
            <UrgencyBadge level={summary.urgency} size="lg" />
          </div>
        </div>

        {/* Reported Symptoms */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Identified Symptoms
          </label>
          {summary.symptoms.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No symptoms reported yet. Describe how you feel...</p>
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
            <Clock className="w-4 h-4 text-primary-500" /> Duration
          </span>
          <span className="font-bold text-slate-800">{summary.duration || 'Not specified'}</span>
        </div>

        {/* Suggested Department */}
        <div className="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1.5">
            <Stethoscope className="w-4 h-4 text-secondary-500" /> Care Pathway
          </span>
          <span className="font-bold text-slate-800">{summary.suggestedDepartment}</span>
        </div>

        {/* Gemma Recommendation Box */}
        <div className="p-3.5 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl border border-primary-100 space-y-1">
          <span className="text-[10px] font-bold text-primary-700 uppercase tracking-wider block">
            Recommended Action
          </span>
          <p className="text-xs text-slate-700 font-medium leading-relaxed">
            {summary.recommendation}
          </p>
        </div>

        {/* AI Confidence Meter */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>AI Confidence Score</span>
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
          <span>Triage assistance only. Not a medical diagnosis.</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleDownloadReportClick}
          className="w-full gradient-button py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25"
        >
          <FileText className="w-4 h-4" />
          <span>Generate & Download Report</span>
        </button>

        <button
          onClick={onClearSession}
          className="w-full bg-white/80 hover:bg-slate-100 border border-slate-200 text-slate-700 py-2.5 px-4 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Current Session</span>
        </button>
      </div>
    </div>
  );
};
