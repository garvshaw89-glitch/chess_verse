import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Clock, Zap } from 'lucide-react';

function formatSeconds(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const GameClock: React.FC = () => {
  const { whiteTime, blackTime, turn, clockActive, isGameOver, timeControl, players, gameMode } = useGameStore();

  const isWhiteActive = turn === 'w' && clockActive && !isGameOver;
  const isBlackActive = turn === 'b' && clockActive && !isGameOver;

  const whiteLow = whiteTime < 30;
  const blackLow = blackTime < 30;

  const whiteDisplayName = players?.white || 'White';
  const blackDisplayName = players?.black || 'Black';

  return (
    <div className="flex items-center gap-2 sm:gap-3 w-full max-w-lg mx-auto py-1 px-2">
      {/* White Clock */}
      <div
        className={`flex-1 flex items-center justify-between px-3 sm:px-3.5 py-2 rounded-xl border transition-all duration-200 ${
          isWhiteActive
            ? 'bg-neutral-800/95 border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
            : 'bg-neutral-900/70 border-neutral-800/80 text-neutral-400'
        }`}
      >
        <div className="flex flex-col min-w-0 pr-1.5">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isWhiteActive ? 'bg-amber-400 animate-pulse' : 'bg-neutral-600'
              }`}
            />
            <span className="text-xs font-bold text-neutral-100 truncate max-w-[90px] sm:max-w-[120px]">
              {whiteDisplayName}
            </span>
          </div>
          <span className="text-[10px] font-mono text-neutral-400 pl-3.5">WHITE</span>
        </div>
        <div
          className={`font-mono text-lg sm:text-xl font-bold tracking-tight shrink-0 ${
            whiteLow && isWhiteActive ? 'text-red-400 animate-pulse' : 'text-neutral-100'
          }`}
        >
          {formatSeconds(whiteTime)}
        </div>
      </div>

      {/* Preset Badge */}
      <div className="flex flex-col items-center justify-center px-1 text-[10px] font-mono text-neutral-400 shrink-0">
        <span className="flex items-center gap-1 text-amber-500/90 font-bold bg-neutral-900/90 px-2 py-1 rounded-md border border-neutral-800">
          <Zap className="w-3 h-3" /> {timeControl.initialMinutes}+{timeControl.incrementSeconds}
        </span>
      </div>

      {/* Black Clock */}
      <div
        className={`flex-1 flex items-center justify-between px-3 sm:px-3.5 py-2 rounded-xl border transition-all duration-200 ${
          isBlackActive
            ? 'bg-neutral-800/95 border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
            : 'bg-neutral-900/70 border-neutral-800/80 text-neutral-400'
        }`}
      >
        <div className="flex flex-col min-w-0 pr-1.5">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isBlackActive ? 'bg-amber-400 animate-pulse' : 'bg-neutral-600'
              }`}
            />
            <span className="text-xs font-bold text-neutral-100 truncate max-w-[90px] sm:max-w-[120px]">
              {blackDisplayName}
            </span>
          </div>
          <span className="text-[10px] font-mono text-neutral-400 pl-3.5">BLACK</span>
        </div>
        <div
          className={`font-mono text-lg sm:text-xl font-bold tracking-tight shrink-0 ${
            blackLow && isBlackActive ? 'text-red-400 animate-pulse' : 'text-neutral-100'
          }`}
        >
          {formatSeconds(blackTime)}
        </div>
      </div>
    </div>
  );
};
