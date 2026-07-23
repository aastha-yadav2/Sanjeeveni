import React, { useState, useEffect } from 'react';
import { Cpu, Sparkles } from 'lucide-react';

interface TypingIndicatorProps {
  statusText?: string;
}

const REASONING_STEPS = [
  "Google Gemma AI processing input...",
  "Analyzing clinical symptom entities...",
  "Evaluating urgency & triage criteria...",
  "Generating localized follow-up guidance..."
];

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ statusText }) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % REASONING_STEPS.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-start gap-3 my-4 animate-in fade-in duration-300">
      {/* Gemma Avatar */}
      <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20 shrink-0">
        <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
      </div>

      <div className="glass-card px-4 py-3 rounded-2xl border border-primary-100 shadow-sm max-w-md">
        <div className="flex items-center gap-2 mb-1.5">
          <Cpu className="w-3.5 h-3.5 text-primary-600" />
          <span className="text-[11px] font-bold text-primary-600 uppercase tracking-wider">
            Gemma AI Reasoning
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
          {/* Animated 3 dots */}
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 rounded-full bg-secondary-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>

          <span className="text-slate-500 italic">
            {statusText || REASONING_STEPS[stepIndex]}
          </span>
        </div>
      </div>
    </div>
  );
};
