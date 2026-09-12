import React, { useEffect } from 'react';
import { X, Shield, History } from 'lucide-react';
import { MoveHistoryPanel } from './MoveHistoryPanel';
import { CapturedPieces } from './CapturedPieces';
import { Button3D } from './Button3D';

interface MoveHistoryBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MoveHistoryBottomSheet: React.FC<MoveHistoryBottomSheetProps> = ({
  isOpen,
  onClose
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-950/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-Up Bottom Sheet */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Move History and Captured Material"
        className="relative w-full max-h-[75dvh] bg-neutral-950 border-t border-neutral-800 rounded-t-2xl shadow-2xl p-4 flex flex-col gap-3 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] transform transition-transform duration-300 ease-out animate-in slide-in-from-bottom"
      >
        {/* Drag handle */}
        <div className="flex justify-center -mt-1 mb-1">
          <div className="w-12 h-1.5 rounded-full bg-neutral-750/80 cursor-grab" onClick={onClose} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-wide font-mono">
              Match Moves & Material
            </h3>
          </div>
          <Button3D
            variant="ghost"
            size="icon"
            onClick={onClose}
            title="Close panel"
            className="w-8 h-8 !p-0"
          >
            <X className="w-4 h-4 text-neutral-400" />
          </Button3D>
        </div>

        {/* Captured Material */}
        <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-xl p-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300 mb-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Captured Advantage</span>
          </div>
          <CapturedPieces />
        </div>

        {/* Scrollable Move History */}
        <div className="flex-1 min-h-[200px] overflow-hidden">
          <MoveHistoryPanel />
        </div>
      </div>
    </div>
  );
};
