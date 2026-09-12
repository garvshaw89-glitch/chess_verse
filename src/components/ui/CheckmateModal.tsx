import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '../../store/gameStore';
import { Trophy, RotateCw, BarChart2, Home, Flag, Award, Users } from 'lucide-react';
import { Modal3D } from '../transitions/Modal3D';
import { Button3D } from './Button3D';

interface CheckmateModalProps {
  onNavigateHome: () => void;
  onNavigateAnalyze?: () => void;
}

export const CheckmateModal: React.FC<CheckmateModalProps> = ({
  onNavigateHome,
  onNavigateAnalyze
}) => {
  const {
    isGameOver,
    winner,
    winReason,
    history,
    resetGame,
    playerColor,
    gameMode,
    players,
    setTwoPlayerSetupOpen
  } = useGameStore();

  const isPlayerWinner = winner === playerColor;

  useEffect(() => {
    if (isGameOver && winner && winner !== 'draw') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  }, [isGameOver, winner]);

  if (!isGameOver) return null;

  const winnerDisplayName =
    winner === 'draw'
      ? 'Draw'
      : winner === 'w'
      ? players?.white || 'White'
      : players?.black || 'Black';

  return (
    <Modal3D isOpen={isGameOver} onClose={() => {}} maxWidth="max-w-md">
      <div className="relative w-full p-6 sm:p-8 text-center">
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-amber-500 rounded-full blur-[2px]" />

        {/* Victory Icon / Badge */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4 shadow-inner">
          {winner === 'draw' ? (
            <Award className="w-8 h-8" />
          ) : (
            <Trophy className="w-8 h-8 animate-bounce" />
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-100 font-display">
          {winner === 'draw'
            ? 'GAME DRAWN'
            : gameMode === 'local_2p'
            ? `${winnerDisplayName.toUpperCase()} WINS!`
            : `${winner === 'w' ? 'WHITE' : 'BLACK'} WINS!`}
        </h2>

        {/* Subtitle / Reason */}
        <p className="text-sm font-medium text-amber-400/90 mt-1 tracking-wider font-mono">
          {winReason || 'Victory achieved'}
        </p>

        {/* Match Statistics Card */}
        <div className="grid grid-cols-3 gap-2 my-6 p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 text-center font-mono">
          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-400 uppercase">Winner</span>
            <span className="text-sm font-bold text-neutral-200 mt-0.5 truncate px-1">
              {winnerDisplayName}
            </span>
          </div>

          <div className="flex flex-col border-x border-neutral-800">
            <span className="text-[10px] text-neutral-400 uppercase">Total Moves</span>
            <span className="text-sm font-bold text-amber-400 mt-0.5">
              {history.length}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-400 uppercase">Result</span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5">
              {winner === 'draw' ? '½ - ½' : winner === 'w' ? '1 - 0' : '0 - 1'}
            </span>
          </div>
        </div>

        {/* Action Buttons with 3D Interaction */}
        <div className="flex flex-col gap-2.5">
          <Button3D
            variant="primary"
            size="lg"
            onClick={() => resetGame()}
            icon={<RotateCw className="w-4 h-4" />}
            className="w-full"
          >
            PLAY AGAIN
          </Button3D>

          {gameMode === 'local_2p' && (
            <Button3D
              variant="secondary"
              size="md"
              onClick={() => {
                setTwoPlayerSetupOpen(true);
              }}
              icon={<Users className="w-4 h-4 text-amber-400" />}
              className="w-full"
            >
              SETUP NEW 2-PLAYER MATCH
            </Button3D>
          )}

          {onNavigateAnalyze && (
            <Button3D
              variant="secondary"
              size="md"
              onClick={onNavigateAnalyze}
              icon={<BarChart2 className="w-4 h-4 text-cyan-400" />}
              className="w-full"
            >
              ANALYZE GAME
            </Button3D>
          )}

          <Button3D
            variant="ghost"
            size="md"
            onClick={onNavigateHome}
            icon={<Home className="w-4 h-4" />}
            className="w-full"
          >
            MAIN MENU
          </Button3D>
        </div>
      </div>
    </Modal3D>
  );
};
