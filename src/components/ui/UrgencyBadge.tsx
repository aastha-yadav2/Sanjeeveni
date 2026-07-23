import React from 'react';
import { UrgencyLevel } from '../../types/triage';
import { CheckCircle2, AlertCircle, AlertTriangle, Flame } from 'lucide-react';

interface UrgencyBadgeProps {
  level: UrgencyLevel | string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({
  level,
  size = 'md',
  showLabel = true,
}) => {
  const normalizedLevel = (level || 'Low').toLowerCase();

  const config: Record<string, { label: string; bg: string; icon: any }> = {
    low: {
      label: 'Low Urgency',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
    },
    moderate: {
      label: 'Moderate Urgency',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: AlertCircle,
    },
    high: {
      label: 'High Urgency',
      bg: 'bg-amber-50 text-amber-700 border-amber-300',
      icon: AlertTriangle,
    },
    emergency: {
      label: 'EMERGENCY',
      bg: 'bg-red-600 text-white border-red-700 animate-pulse font-extrabold',
      icon: Flame,
    },
  };

  const current = config[normalizedLevel] || config.low;
  const Icon = current.icon;

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-xs font-bold gap-2',
    lg: 'px-4 py-2 text-sm font-extrabold gap-2.5 shadow-md',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-all ${current.bg} ${sizeClasses[size]}`}
    >
      <Icon className={size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      {showLabel && <span>{current.label}</span>}
    </span>
  );
};
