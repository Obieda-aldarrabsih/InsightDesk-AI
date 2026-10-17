import React from 'react';
import { cn } from '@/lib/utils';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export type ConfidenceTier = 'high' | 'medium' | 'low';

interface ConfidenceBadgeProps {
  tier: ConfidenceTier;
  score?: number;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ tier }) => {
  const config = {
    high: {
      colorClass: 'bg-confidence-high text-white',
      icon: <ShieldCheck className="w-4 h-4 mr-1" />,
      label: 'High Confidence'
    },
    medium: {
      colorClass: 'bg-confidence-medium text-white',
      icon: <AlertTriangle className="w-4 h-4 mr-1" />,
      label: 'Medium Confidence'
    },
    low: {
      colorClass: 'bg-confidence-low text-white',
      icon: <ShieldAlert className="w-4 h-4 mr-1" />,
      label: 'Low Confidence - Please Verify'
    }
  };

  const { colorClass, icon, label } = config[tier];

  return (
    <div className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm",
      colorClass
    )}>
      {icon}
      {label}
    </div>
  );
};
