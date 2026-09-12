import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { PieceType } from '../../types/chess';

const PIECE_VALUES: Record<PieceType, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0
};

const PIECE_SYMBOLS: Record<string, string> = {
  p: '♟',
  n: '♞',
  b: '♝',
  r: '♜',
  q: '♛'
};

export const CapturedPieces: React.FC = () => {
  const { capturedWhite, capturedBlack } = useGameStore();

  const whiteVal = capturedBlack.reduce((acc, p) => acc + PIECE_VALUES[p], 0);
  const blackVal = capturedWhite.reduce((acc, p) => acc + PIECE_VALUES[p], 0);

  const whiteAdvantage = whiteVal - blackVal;
  const blackAdvantage = blackVal - whiteVal;

  return (
    <div className="flex flex-col gap-1 w-full text-xs select-none">
      {/* Captured by White (Black pieces lost) */}
      <div className="flex items-center justify-between px-2 py-1 bg-neutral-900/50 rounded border border-neutral-800/60">
        <div className="flex items-center gap-1 overflow-x-auto max-w-[80%]">
          <span className="text-[10px] uppercase font-mono text-neutral-400 mr-1">White:</span>
          {capturedBlack.map((p, idx) => (
            <span key={idx} className="text-neutral-300 text-sm leading-none">
              {PIECE_SYMBOLS[p] || '♟'}
            </span>
          ))}
          {capturedBlack.length === 0 && (
            <span className="text-neutral-400 text-[10px] italic">None</span>
          )}
        </div>
        {whiteAdvantage > 0 && (
          <span className="font-mono font-bold text-amber-400 text-[11px]">+{whiteAdvantage}</span>
        )}
      </div>

      {/* Captured by Black (White pieces lost) */}
      <div className="flex items-center justify-between px-2 py-1 bg-neutral-900/50 rounded border border-neutral-800/60">
        <div className="flex items-center gap-1 overflow-x-auto max-w-[80%]">
          <span className="text-[10px] uppercase font-mono text-neutral-400 mr-1">Black:</span>
          {capturedWhite.map((p, idx) => (
            <span key={idx} className="text-neutral-400 text-sm leading-none">
              {PIECE_SYMBOLS[p] || '♙'}
            </span>
          ))}
          {capturedWhite.length === 0 && (
            <span className="text-neutral-400 text-[10px] italic">None</span>
          )}
        </div>
        {blackAdvantage > 0 && (
          <span className="font-mono font-bold text-amber-400 text-[11px]">+{blackAdvantage}</span>
        )}
      </div>
    </div>
  );
};
