import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceButtonProps {
  isListening: boolean;
  onToggle: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  onToggle,
  disabled = false,
  size = 'md',
}) => {
  const sizeMap = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
  };

  const iconSizeMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Waveform Pulse Ring when listening */}
      {isListening && (
        <>
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </>
      )}

      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`relative z-10 flex items-center justify-center rounded-2xl transition-all duration-300 ${sizeMap[size]} ${
          isListening
            ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 scale-105 ring-4 ring-red-200'
            : 'bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white border border-primary-200/80 shadow-sm'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
        title={isListening ? 'Stop Voice Recording' : 'Speak Symptoms (Voice Input)'}
      >
        {isListening ? (
          <MicOff className={iconSizeMap[size]} />
        ) : (
          <Mic className={iconSizeMap[size]} />
        )}
      </button>

      {/* Visualizer Wave Indicator during active listening */}
      {isListening && (
        <div className="absolute -bottom-6 flex items-center gap-0.5">
          <span className="w-1 h-3 bg-red-500 rounded-full animate-wave" style={{ animationDelay: '0ms' }}></span>
          <span className="w-1 h-4 bg-red-500 rounded-full animate-wave" style={{ animationDelay: '150ms' }}></span>
          <span className="w-1 h-5 bg-red-500 rounded-full animate-wave" style={{ animationDelay: '300ms' }}></span>
          <span className="w-1 h-3 bg-red-500 rounded-full animate-wave" style={{ animationDelay: '450ms' }}></span>
        </div>
      )}
    </div>
  );
};
