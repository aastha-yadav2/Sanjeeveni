import React, { useState } from 'react';
import { ChatMessage } from '../../types/triage';
import { Sparkles, User, Volume2, ChevronDown, ChevronUp, Cpu, Mic } from 'lucide-react';
import { UrgencyBadge } from '../ui/UrgencyBadge';
import { speechService } from '../../services/speechService';

interface ChatBubbleProps {
  message: ChatMessage;
  languageCode?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, languageCode = 'en' }) => {
  const isGemma = message.sender === 'gemma';
  const [showThoughtProcess, setShowThoughtProcess] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (isSpeaking) {
      speechService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speechService.speakText(message.text, languageCode, () => setIsSpeaking(false));
    }
  };

  return (
    <div
      className={`flex items-start gap-3 my-4 ${
        isGemma ? 'justify-start' : 'justify-end'
      } animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      {/* Gemma Avatar (Left side) */}
      {isGemma && (
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
      )}

      <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
        {/* Message Card */}
        <div
          className={`p-4 sm:p-5 rounded-2xl shadow-sm relative transition-all ${
            isGemma
              ? 'glass-card border-primary-100 text-slate-800 rounded-tl-sm'
              : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md shadow-primary-600/20 rounded-tr-sm'
          }`}
        >
          {/* Header row for Gemma */}
          {isGemma && (
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-primary-600 tracking-tight">
                  Google Gemma AI
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-100 font-bold">
                  Clinical Model 2.0
                </span>
              </div>

              {/* Text to Speech Button */}
              <button
                onClick={handleSpeak}
                className={`p-1.5 rounded-lg transition-colors ${
                  isSpeaking
                    ? 'bg-secondary-500 text-white animate-pulse'
                    : 'text-slate-400 hover:text-primary-600 hover:bg-slate-100'
                }`}
                title="Read aloud with Voice Speech"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* User message voice badge indicator */}
          {!isGemma && message.isVoiceInput && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-primary-200 mb-1">
              <Mic className="w-3 h-3" /> Voice Input
            </div>
          )}

          {/* Urgency Badge Alert if attached */}
          {isGemma && message.urgencyLevel && (
            <div className="mb-3">
              <UrgencyBadge level={message.urgencyLevel} size="sm" />
            </div>
          )}

          {/* Text Content */}
          <p className={`text-sm sm:text-base leading-relaxed whitespace-pre-line ${
            isGemma ? 'text-slate-800 font-normal' : 'text-white font-medium'
          }`}>
            {message.text}
          </p>

          {/* Thought Process Accordion for Gemma */}
          {isGemma && message.thoughtProcess && message.thoughtProcess.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowThoughtProcess(!showThoughtProcess)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary-600 transition-colors"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Gemma Clinical Reasoning</span>
                {showThoughtProcess ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showThoughtProcess && (
                <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-xs text-slate-600 font-mono">
                  {message.thoughtProcess.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-primary-500 font-bold">›</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Timestamp */}
          <div
            className={`text-[10px] mt-2 font-medium text-right ${
              isGemma ? 'text-slate-400' : 'text-primary-200'
            }`}
          >
            {message.timestamp}
          </div>
        </div>
      </div>

      {/* User Avatar (Right side) */}
      {!isGemma && (
        <div className="w-10 h-10 rounded-2xl bg-slate-800 text-white flex items-center justify-center shadow-md shrink-0">
          <User className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
