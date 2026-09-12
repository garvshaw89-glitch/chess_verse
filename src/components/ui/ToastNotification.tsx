import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toast } = useGameStore();

  if (!toast) return null;

  const icons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    danger: AlertCircle
  };

  const borders = {
    info: 'border-blue-500/50 bg-neutral-900/95 text-blue-200',
    success: 'border-emerald-500/50 bg-neutral-900/95 text-emerald-200',
    warning: 'border-amber-500/50 bg-neutral-900/95 text-amber-200',
    danger: 'border-red-500/60 bg-neutral-900/95 text-red-200'
  };

  const Icon = icons[toast.type] || Info;

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md text-xs font-semibold ${
          borders[toast.type]
        }`}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
