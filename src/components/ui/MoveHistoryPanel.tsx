import React, { useRef, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { 
  ChevronFirst, 
  ChevronLeft, 
  ChevronRight, 
  ChevronLast, 
  Copy, 
  Check, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Button3D } from './Button3D';

export const MoveHistoryPanel: React.FC = () => {
  const { history, viewingMoveIndex, jumpToMove, showToast } = useGameStore();
  const [copied, setCopied] = React.useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Group moves into pairs (White move, Black move)
  const movePairs = React.useMemo(() => {
    const pairs: { moveNumber: number; white: any; black?: any; whiteIdx: number; blackIdx?: number }[] = [];
    for (let i = 0; i < history.length; i += 2) {
      pairs.push({
        moveNumber: Math.floor(i / 2) + 1,
        white: history[i],
        black: history[i + 1],
        whiteIdx: i,
        blackIdx: history[i + 1] ? i + 1 : undefined
      });
    }
    return pairs;
  }, [history]);

  // Auto-scroll to bottom on new move if not reviewing
  useEffect(() => {
    if (viewingMoveIndex === -1 && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history.length, viewingMoveIndex]);

  const handleCopyPGN = () => {
    if (history.length === 0) return;
    let pgn = '';
    movePairs.forEach((pair) => {
      pgn += `${pair.moveNumber}. ${pair.white.san} ${pair.black ? pair.black.san + ' ' : ''}`;
    });
    navigator.clipboard.writeText(pgn.trim()).then(() => {
      setCopied(true);
      showToast('PGN copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleFirst = () => jumpToMove(0);
  const handlePrev = () => {
    if (viewingMoveIndex === -1) {
      if (history.length > 0) jumpToMove(history.length - 2);
    } else if (viewingMoveIndex > 0) {
      jumpToMove(viewingMoveIndex - 1);
    }
  };
  const handleNext = () => {
    if (viewingMoveIndex !== -1) {
      if (viewingMoveIndex + 1 >= history.length) {
        jumpToMove(-1); // back to live
      } else {
        jumpToMove(viewingMoveIndex + 1);
      }
    }
  };
  const handleLast = () => jumpToMove(-1);

  return (
    <div className="flex flex-col h-full bg-neutral-900/80 border border-neutral-800 rounded-xl overflow-hidden shadow-lg backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-neutral-800 bg-neutral-950/40">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-200">
            Move Log ({history.length})
          </span>
        </div>
        <button
          onClick={handleCopyPGN}
          disabled={history.length === 0}
          title="Copy PGN notation"
          className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-neutral-200 transition-colors disabled:opacity-40 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>PGN</span>
        </button>
      </div>

      {/* Viewing Notice */}
      {viewingMoveIndex !== -1 && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-amber-500/10 border-b border-amber-500/20 text-[11px] text-amber-300">
          <span>Viewing move #{viewingMoveIndex + 1}</span>
          <button
            onClick={() => jumpToMove(-1)}
            className="flex items-center gap-1 hover:underline font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Live Board
          </button>
        </div>
      )}

      {/* Move History Table */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto divide-y divide-neutral-800/40 font-mono text-xs p-1"
      >
        {movePairs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-28 text-neutral-400 text-xs italic">
            <span>No moves played yet</span>
            <span className="text-[10px] mt-1">Make a move to start the log</span>
          </div>
        ) : (
          movePairs.map((pair) => (
            <div key={pair.moveNumber} className="flex items-center py-1 px-2 hover:bg-neutral-800/30 rounded">
              <span className="w-8 text-neutral-400 font-medium select-none">
                {pair.moveNumber}.
              </span>
              {/* White Move */}
              <button
                onClick={() => jumpToMove(pair.whiteIdx)}
                className={`flex-1 text-left px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  viewingMoveIndex === pair.whiteIdx
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'text-neutral-200 hover:bg-neutral-700/50'
                }`}
              >
                {pair.white.san}
              </button>
              {/* Black Move */}
              {pair.black && (
                <button
                  onClick={() => jumpToMove(pair.blackIdx!)}
                  className={`flex-1 text-left px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    viewingMoveIndex === pair.blackIdx
                      ? 'bg-amber-500 text-neutral-950 font-bold'
                      : 'text-neutral-200 hover:bg-neutral-700/50'
                  }`}
                >
                  {pair.black.san}
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Navigation Controls Bar with 3D Interaction */}
      <div className="flex items-center justify-center gap-1.5 p-2 border-t border-neutral-800 bg-neutral-950/40">
        <Button3D
          variant="secondary"
          size="icon"
          onClick={handleFirst}
          disabled={history.length === 0}
          title="Jump to Start"
          className="w-7 h-7 !p-0"
        >
          <ChevronFirst className="w-3.5 h-3.5" />
        </Button3D>
        <Button3D
          variant="secondary"
          size="icon"
          onClick={handlePrev}
          disabled={history.length === 0}
          title="PREVIOUS MOVE"
          className="w-7 h-7 !p-0"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </Button3D>
        <Button3D
          variant="secondary"
          size="icon"
          onClick={handleNext}
          disabled={viewingMoveIndex === -1}
          title="NEXT MOVE"
          className="w-7 h-7 !p-0"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </Button3D>
        <Button3D
          variant="secondary"
          size="icon"
          onClick={handleLast}
          disabled={viewingMoveIndex === -1}
          title="Jump to Latest"
          className="w-7 h-7 !p-0"
        >
          <ChevronLast className="w-3.5 h-3.5" />
        </Button3D>
      </div>
    </div>
  );
};
