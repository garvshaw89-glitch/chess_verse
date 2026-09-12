import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { ChessCanvas } from '../3d/ChessCanvas';
import { useGameStore } from '../store/gameStore';
import { NavPage } from '../components/ui/Navbar';
import { 
  Puzzle, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCw, 
  ChevronRight, 
  Eye, 
  Award,
  Zap,
  Lightbulb
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button3D } from '../components/ui/Button3D';

interface PuzzleDef {
  id: string;
  title: string;
  theme: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Master';
  rating: number;
  fen: string;
  playerColor: 'w' | 'b';
  // Array of moves [playerMove, opponentResponse, playerMove...]
  solution: string[];
  explanation: string;
}

const PUZZLES: PuzzleDef[] = [
  {
    id: 'puz-1',
    title: 'Back-Rank Mate in One',
    theme: 'Back Rank Mate',
    difficulty: 'Easy',
    rating: 1150,
    fen: '3r2k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1',
    playerColor: 'w',
    solution: ['d1d8'],
    explanation: 'Back-Rank Checkmate: Black is trapped behind its pawn shield. Rxd8# delivers immediate checkmate.'
  },
  {
    id: 'puz-2',
    title: 'Royal Knight Fork',
    theme: 'Knight Fork',
    difficulty: 'Medium',
    rating: 1420,
    fen: '2r3k1/5ppp/8/3N4/8/8/5PPP/6K1 w - - 0 1',
    playerColor: 'w',
    solution: ['d5e7', 'g8f8', 'e7c8'],
    explanation: 'Ne7+ forks King and Rook! After the king moves away, Nxc8 claims the full rook with a winning endgame.'
  },
  {
    id: 'puz-3',
    title: 'Morphy’s Opera House Mate',
    theme: 'Decoy & Checkmate',
    difficulty: 'Master',
    rating: 2100,
    fen: '4kb1r/p2n1ppp/4q3/4p1B1/8/1Q6/PPP2PPP/2KR4 w k - 0 16',
    playerColor: 'w',
    solution: ['b3b8', 'd7b8', 'd1d8'],
    explanation: 'The immortal Queen sacrifice! 1. Qb8+! Nxb8 2. Rd8# delivers Morphy’s legendary opera house checkmate.'
  },
  {
    id: 'puz-4',
    title: 'Rank Skewer on the Eighth',
    theme: 'Absolute Skewer',
    difficulty: 'Hard',
    rating: 1750,
    fen: '4k3/8/8/8/8/8/1r6/R3K3 w Q - 0 1',
    playerColor: 'w',
    solution: ['a1a8', 'e8f7', 'a8a7'],
    explanation: 'Ra8+ forces the king out, then Ra7+ skewers the king and wins the enemy rook.'
  },
  {
    id: 'puz-5',
    title: 'Classic Smothered Mate',
    theme: 'Smothered Mate',
    difficulty: 'Medium',
    rating: 1580,
    fen: '6rk/6pp/7N/8/8/8/8/4K2R w - - 0 1',
    playerColor: 'w',
    solution: ['h6f7'],
    explanation: 'Smothered Mate! The enemy king is trapped by its own defenders. Nf7# seals the game instantly.'
  }
];

interface PuzzlesViewProps {
  onNavigate: (page: NavPage) => void;
  onOpenSettings: () => void;
}

export const PuzzlesView: React.FC<PuzzlesViewProps> = ({ onNavigate, onOpenSettings }) => {
  const { loadCustomFen, setPlayerColor, setGameMode, showToast, history, makeMove } = useGameStore();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [puzzleStep, setPuzzleStep] = useState(0);
  const [status, setStatus] = useState<'solving' | 'correct' | 'failed'>('solving');
  const [solvedCount, setSolvedCount] = useState(0);
  const [rating, setRating] = useState(1200);

  const activePuzzle = PUZZLES[currentIdx];

  // Initialize puzzle
  useEffect(() => {
    loadCustomFen(activePuzzle.fen);
    setPlayerColor(activePuzzle.playerColor);
    setGameMode('puzzle');
    setPuzzleStep(0);
    setStatus('solving');
  }, [currentIdx]);

  // Monitor move made by player in gameStore
  useEffect(() => {
    if (history.length === 0 || status !== 'solving') return;

    const last = history[history.length - 1];
    // If the last move was made by the opponent, ignore it for player validation
    if (last.color !== activePuzzle.playerColor) return;

    const expectedMove = activePuzzle.solution[puzzleStep];
    if (!expectedMove) return;

    const moveUci = `${last.from}${last.to}${last.promotion || ''}`;

    if (moveUci.toLowerCase().startsWith(expectedMove.toLowerCase())) {
      // Step matched!
      const nextStep = puzzleStep + 1;
      if (nextStep >= activePuzzle.solution.length) {
        setStatus('correct');
        setSolvedCount((c) => c + 1);
        setRating((r) => r + 15);
        try {
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        } catch {}
        showToast('Puzzle Solved! +15 Rating points', 'success');
      } else {
        // Opponent automatic response
        const opponentMove = activePuzzle.solution[nextStep];
        setPuzzleStep(nextStep + 1);
        showToast('Best move! Opponent responding...', 'info');
        if (opponentMove && opponentMove.length >= 4) {
          const from = opponentMove.slice(0, 2);
          const to = opponentMove.slice(2, 4);
          const promo = opponentMove.length > 4 ? opponentMove[4] : undefined;
          setTimeout(() => {
            makeMove(from, to, promo);
          }, 450);
        }
      }
    } else {
      setStatus('failed');
      showToast('Incorrect move. Think carefully and retry!', 'danger');
    }
  }, [history.length]);

  const handleRestartPuzzle = () => {
    loadCustomFen(activePuzzle.fen);
    setPuzzleStep(0);
    setStatus('solving');
  };

  const handleNextPuzzle = () => {
    const nextIdx = (currentIdx + 1) % PUZZLES.length;
    setCurrentIdx(nextIdx);
  };

  const handleShowHint = () => {
    const expected = activePuzzle.solution[puzzleStep];
    if (expected && expected.length >= 2) {
      const from = expected.slice(0, 2);
      showToast(`Tactical Hint: Focus on the piece on ${from.toUpperCase()}`, 'info');
    }
  };

  // Keyboard navigation for tactical puzzles
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea', 'select'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;

      if (e.key === 'r' || e.key === 'R') {
        handleRestartPuzzle();
      } else if (e.key === 'n' || e.key === 'N' || (status === 'correct' && (e.key === 'Enter' || e.key === ' '))) {
        handleNextPuzzle();
      } else if (e.key === 'h' || e.key === 'H') {
        handleShowHint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, currentIdx]);

  return (
    <div className="relative w-full h-[calc(100dvh-56px)] md:h-[calc(100dvh-60px)] flex flex-col overflow-hidden bg-neutral-950">
      <div className="w-full max-w-7xl mx-auto h-full flex flex-col lg:flex-row overflow-hidden flex-1">
        {/* 3D Board Area */}
        <div className="relative flex-1 h-[52vh] sm:h-[55vh] lg:h-full flex flex-col items-center justify-between p-1.5 sm:p-4 overflow-hidden min-h-0">
          {/* Header Ribbon */}
          <div className="w-full max-w-xl flex items-center justify-between z-10 px-2 py-1 gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-neutral-900/80 px-3 py-1.5 rounded-xl border border-neutral-800 backdrop-blur-md">
              <Puzzle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs font-bold text-neutral-200 truncate max-w-[160px] sm:max-w-none">{activePuzzle.title}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                {activePuzzle.difficulty}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-neutral-300 bg-neutral-900/80 px-3 py-1 rounded-lg border border-neutral-800">
                Rating: {rating}
              </span>
            </div>
          </div>

          {/* 3D Canvas Board */}
          <div className="relative w-full h-full flex-1 flex items-center justify-center min-h-0 touch-none">
            <ChessCanvas />
          </div>

          {/* Bottom banner feedback */}
          <div className="w-full max-w-xl z-10 px-1 pb-1 sm:pb-0">
          {status === 'correct' && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 backdrop-blur-md animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Puzzle Solved! {activePuzzle.explanation}</span>
              </div>
              <Button3D
                variant="primary"
                size="sm"
                onClick={handleNextPuzzle}
                icon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                <span>NEXT</span>
              </Button3D>
            </div>
          )}

          {status === 'failed' && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 backdrop-blur-md animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-bold">
                <XCircle className="w-4 h-4 text-red-400" />
                <span>That is not the best move. Try again!</span>
              </div>
              <Button3D
                variant="secondary"
                size="sm"
                onClick={handleRestartPuzzle}
                icon={<RotateCw className="w-3.5 h-3.5" />}
              >
                <span>RETRY</span>
              </Button3D>
            </div>
          )}

          {status === 'solving' && (
            <div className="flex items-center justify-center p-2 rounded-lg bg-neutral-900/60 border border-neutral-800 text-xs font-mono text-neutral-400">
              <span>Find the best tactical sequence for {activePuzzle.playerColor === 'w' ? 'White' : 'Black'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar: Details & List */}
      <div className="w-full lg:w-84 xl:w-96 h-[45vh] lg:h-full bg-neutral-950/95 border-t lg:border-t-0 lg:border-l border-neutral-800/80 p-4 flex flex-col justify-between z-10 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200 font-mono">
              Tactical Training
            </h3>
            <span className="text-xs font-mono text-amber-400 font-bold">
              Solved: {solvedCount} / {PUZZLES.length}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Theme</span>
              <span className="text-xs font-bold text-neutral-200">{activePuzzle.theme}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Target Rating</span>
              <span className="text-xs font-mono font-bold text-amber-400">{activePuzzle.rating} ELO</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Side to Move</span>
              <span className="text-xs font-bold text-neutral-200">
                {activePuzzle.playerColor === 'w' ? '⚪ White' : '⚫ Black'}
              </span>
            </div>
          </div>

          {/* Puzzle List Selection */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">
              Tactical Archive
            </span>
            {PUZZLES.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setCurrentIdx(idx)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs text-left transition-all cursor-pointer ${
                  currentIdx === idx
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                    : 'bg-neutral-900/40 border-neutral-800/60 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <span>{p.title}</span>
                <span className="text-[10px] font-mono text-neutral-500">{p.difficulty}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Actions with 3D button interactions */}
        <div className="pt-4 border-t border-neutral-800 flex items-center gap-2">
          <Button3D
            variant="secondary"
            size="md"
            onClick={handleShowHint}
            icon={<Lightbulb className="w-3.5 h-3.5 text-amber-400" />}
            title="Reveal tactical hint (Shortcut: H)"
          >
            <span className="hidden sm:inline">HINT</span>
          </Button3D>
          <Button3D
            variant="secondary"
            size="md"
            onClick={handleRestartPuzzle}
            icon={<RotateCw className="w-3.5 h-3.5" />}
            className="flex-1"
            title="Reset puzzle (Shortcut: R)"
          >
            <span>RESET</span>
          </Button3D>
          <Button3D
            variant="primary"
            size="md"
            onClick={handleNextPuzzle}
            icon={<ChevronRight className="w-3.5 h-3.5" />}
            className="flex-1"
            title="Next puzzle (Shortcut: Space or N)"
          >
            <span>NEXT</span>
          </Button3D>
        </div>
      </div>
    </div>
  </div>
);
};
