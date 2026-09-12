import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Sparkles, X } from 'lucide-react';
import { Modal3D } from '../transitions/Modal3D';

export const PromotionModal: React.FC = () => {
  const { promotionPending, completePromotion, cancelPromotion, turn } = useGameStore();
  const { gameplay } = useSettingsStore();

  if (!promotionPending) return null;

  // If autoQueen is enabled in settings, auto-promote to Queen
  if (gameplay.autoQueen) {
    completePromotion('q');
    return null;
  }

  const promoPieces = [
    { type: 'q' as const, name: 'Queen', symbol: turn === 'w' ? '♕' : '♛', desc: 'Maximum mobility and power' },
    { type: 'n' as const, name: 'Knight', symbol: turn === 'w' ? '♘' : '♞', desc: 'Tactical jumping fork capability' },
    { type: 'r' as const, name: 'Rook', symbol: turn === 'w' ? '♖' : '♜', desc: 'Ranks and files domination' },
    { type: 'b' as const, name: 'Bishop', symbol: turn === 'w' ? '♗' : '♝', desc: 'Long diagonal sniper' }
  ];

  return (
    <Modal3D isOpen={Boolean(promotionPending)} onClose={cancelPromotion} maxWidth="max-w-sm">
      <div className="relative w-full p-5 overflow-hidden">
        {/* Glow Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-neutral-100 font-display">Pawn Promotion</h3>
          </div>
          <button
            onClick={cancelPromotion}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-neutral-400 my-3">
          Select the piece to replace your advancing pawn:
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          {promoPieces.map((p) => (
            <button
              key={p.type}
              onClick={() => completePromotion(p.type)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-neutral-800/80 hover:bg-amber-500/20 hover:border-amber-500/60 border border-neutral-700/50 transition-all group cursor-pointer active:scale-95"
            >
              <span className="text-4xl text-neutral-100 group-hover:scale-110 transition-transform mb-1">
                {p.symbol}
              </span>
              <span className="text-xs font-bold text-neutral-200 group-hover:text-amber-300">
                {p.name}
              </span>
              <span className="text-[10px] text-neutral-400 text-center leading-tight mt-0.5">
                {p.desc}
              </span>
            </button>
          ))}
        </div>
      </div>
    </Modal3D>
  );
};
