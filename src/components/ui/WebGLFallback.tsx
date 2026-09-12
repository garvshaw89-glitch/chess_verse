import React from 'react';
import { Square } from 'chess.js';
import { useGameStore } from '../../store/gameStore';
import { useSettingsStore } from '../../store/settingsStore';
import { PieceType, PieceColor } from '../../types/chess';

// High-detail SVG Unicode Chess Glyphs
const PIECE_GLYPHS: Record<string, string> = {
  'w-k': '♔',
  'w-q': '♕',
  'w-r': '♖',
  'w-b': '♗',
  'w-n': '♘',
  'w-p': '♙',
  'b-k': '♚',
  'b-q': '♛',
  'b-r': '♜',
  'b-b': '♝',
  'b-n': '♞',
  'b-p': '♟'
};

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export const WebGLFallback: React.FC = () => {
  const {
    chess,
    selectedSquare,
    legalMoves,
    lastMove,
    isCheck,
    turn,
    selectSquare,
    makeMove,
    boardOrientation
  } = useGameStore();

  const { gameplay, toggleViewMode } = useSettingsStore();

  const displayFiles = boardOrientation === 'w' ? FILES : [...FILES].reverse();
  const displayRanks = boardOrientation === 'w' ? RANKS : [...RANKS].reverse();

  const handleSquareClick = (sq: string) => {
    if (selectedSquare) {
      if (legalMoves.includes(sq)) {
        makeMove(selectedSquare, sq);
      } else {
        selectSquare(sq);
      }
    } else {
      selectSquare(sq);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-2 sm:p-4 bg-neutral-950/80 select-none">
      <div className="relative w-full max-w-[540px] aspect-square bg-neutral-900 border border-neutral-700/60 rounded-xl shadow-2xl p-2.5 sm:p-3.5 flex flex-col">
        {/* Board Header Indicator */}
        <div className="flex items-center justify-between pb-2 px-1 text-xs text-neutral-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>2D TACTICAL BOARD ACTIVE</span>
          </div>
          <button
            onClick={toggleViewMode}
            className="text-amber-400 hover:text-amber-300 transition-colors font-sans font-medium text-xs underline cursor-pointer"
          >
            Switch to 3D View
          </button>
        </div>

        {/* 8x8 Grid */}
        <div className="flex-1 grid grid-cols-8 grid-rows-8 rounded-lg overflow-hidden border border-neutral-800 shadow-inner">
          {displayRanks.map((rank, rIdx) =>
            displayFiles.map((file, fIdx) => {
              const sq = `${file}${rank}`;
              const isLight = (fIdx + rIdx) % 2 === 0;
              const piece = chess.get(sq as Square);
              const isSelected = selectedSquare === sq;
              const isLegal = gameplay.showLegalMoves && legalMoves.includes(sq);
              const isLast = lastMove && (lastMove.from === sq || lastMove.to === sq);
              const isKingInCheck = isCheck && piece && piece.type === 'k' && piece.color === turn;

              let tileBg = isLight ? 'bg-amber-100/90 text-neutral-900' : 'bg-amber-900/60 text-amber-100';
              if (isSelected) tileBg = 'bg-amber-400/80 text-neutral-950 font-bold';
              else if (isKingInCheck) tileBg = 'bg-red-600 text-white animate-pulse';
              else if (isLast) tileBg = isLight ? 'bg-sky-200/90 text-neutral-900' : 'bg-sky-800/80 text-sky-100';

              return (
                <div
                  key={sq}
                  onClick={() => handleSquareClick(sq)}
                  className={`relative flex items-center justify-center cursor-pointer transition-colors duration-150 ${tileBg}`}
                >
                  {/* Square Coordinate Labels */}
                  {gameplay.showCoordinates && (
                    <>
                      {fIdx === 0 && (
                        <span className="absolute top-0.5 left-1 text-[9px] font-mono font-bold opacity-60 pointer-events-none">
                          {rank}
                        </span>
                      )}
                      {rIdx === 7 && (
                        <span className="absolute bottom-0.5 right-1 text-[9px] font-mono font-bold opacity-60 pointer-events-none">
                          {file}
                        </span>
                      )}
                    </>
                  )}

                  {/* Piece Glyph */}
                  {piece && (
                    <span
                      className={`text-3xl sm:text-4xl select-none leading-none drop-shadow-sm transition-transform ${
                        isSelected ? 'scale-115 -translate-y-1' : 'hover:scale-105'
                      }`}
                      style={{
                        color: piece.color === 'w' ? '#ffffff' : '#111827',
                        textShadow: piece.color === 'w' ? '0 1px 3px rgba(0,0,0,0.8)' : '0 1px 2px rgba(255,255,255,0.4)'
                      }}
                    >
                      {PIECE_GLYPHS[`${piece.color}-${piece.type}`]}
                    </span>
                  )}

                  {/* Legal move indicator dot */}
                  {isLegal && !piece && (
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80 shadow-md ring-2 ring-emerald-300/50" />
                  )}

                  {/* Legal capture target indicator */}
                  {isLegal && piece && (
                    <div className="absolute inset-0 rounded-none border-2 border-red-500/90 bg-red-500/10 pointer-events-none" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
