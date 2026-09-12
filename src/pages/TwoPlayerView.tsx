import React, { useState, useEffect } from 'react';
import { ChessCanvas } from '../3d/ChessCanvas';
import { GameClock } from '../components/ui/GameClock';
import { CapturedPieces } from '../components/ui/CapturedPieces';
import { MoveHistoryPanel } from '../components/ui/MoveHistoryPanel';
import { MoveHistoryBottomSheet } from '../components/ui/MoveHistoryBottomSheet';
import { GameControlsBar } from '../components/ui/GameControlsBar';
import { PromotionModal } from '../components/ui/PromotionModal';
import { CheckmateModal } from '../components/ui/CheckmateModal';
import { useGameStore } from '../store/gameStore';
import { NavPage } from '../components/ui/Navbar';
import { 
  Users, 
  RotateCw, 
  History, 
  AlertCircle, 
  Swords, 
  Settings, 
  Sparkles,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { Button3D } from '../components/ui/Button3D';
import { useDevice } from '../services/deviceTier';

interface TwoPlayerViewProps {
  onNavigate: (page: NavPage) => void;
  onOpenSettings: () => void;
}

export const TwoPlayerView: React.FC<TwoPlayerViewProps> = ({ onNavigate, onOpenSettings }) => {
  const [historySheetOpen, setHistorySheetOpen] = useState(false);
  const device = useDevice();
  const {
    gameMode,
    turn,
    isCheck,
    isGameOver,
    players,
    history,
    autoFlipBoard,
    setAutoFlipBoard,
    toggleOrientation,
    setTwoPlayerSetupOpen,
    setGameMode,
    resetGame,
    setCameraPreset,
    showToast
  } = useGameStore();

  // On mount, ensure game mode is local 2-player and set camera perspective
  useEffect(() => {
    setGameMode('local_2p');
    setCameraPreset('player_w');
  }, [setGameMode, setCameraPreset]);

  // Turn tracking
  const isWhiteTurn = turn === 'w';
  const currentActiveName = isWhiteTurn ? players.white : players.black;
  const waitingPlayerName = isWhiteTurn ? players.black : players.white;

  return (
    <div className="relative w-full h-[calc(100dvh-56px)] md:h-[calc(100dvh-60px)] flex flex-col overflow-hidden bg-neutral-950">
      {/* Container with max width bounds for widescreen readability */}
      <div className="w-full max-w-7xl mx-auto h-full flex flex-col lg:flex-row overflow-hidden flex-1">
        
        {/* 3D Chess Board Stage */}
        <div className="relative flex-1 h-full flex flex-col items-center justify-between p-1.5 sm:p-3 overflow-hidden min-h-0">
          
          {/* Top Pass & Play Status Strip */}
          <div className="w-full max-w-xl flex items-center justify-between z-10 px-2 py-1 gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                  isWhiteTurn 
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                    : 'text-neutral-400 bg-neutral-900 border border-neutral-800'
                }`}>
                  ♔ {players.white} (White)
                </span>
                <span className="text-neutral-500 font-bold">vs</span>
                <span className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                  !isWhiteTurn 
                    ? 'bg-sky-400/20 text-sky-300 border border-sky-400/40 shadow-[0_0_10px_rgba(56,189,248,0.2)]' 
                    : 'text-neutral-400 bg-neutral-900 border border-neutral-800'
                }`}>
                  ♚ {players.black} (Black)
                </span>
              </div>

              {/* Quick Setup Modal Button */}
              <Button3D
                variant="secondary"
                size="sm"
                onClick={() => setTwoPlayerSetupOpen(true)}
                icon={<Users className="w-3 h-3 text-sky-400" />}
                title="Change player names or clock format"
                className="!py-1 !px-2 text-[11px]"
              >
                <span>Edit</span>
              </Button3D>
            </div>

            {/* Turn Announcement Banner */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs font-semibold backdrop-blur-md">
              {isCheck ? (
                <span className="text-red-400 flex items-center gap-1.5 animate-bounce font-bold">
                  <AlertCircle className="w-3.5 h-3.5" /> CHECK! ({currentActiveName})
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: isWhiteTurn ? '#f59e0b' : '#38bdf8' }} />
                  <span className="text-neutral-100 font-bold">{currentActiveName}'s Turn</span>
                </span>
              )}
            </div>
          </div>

          {/* 3D Interactive Canvas */}
          <div className="relative w-full flex-1 min-h-0 flex items-center justify-center touch-none">
            <ChessCanvas />
          </div>

          {/* Clock & Secondary Controls */}
          <div className="w-full max-w-xl z-10 flex flex-col gap-1.5 pb-1 lg:pb-0">
            <GameClock />

            {/* Quick Action Bar for 2-Player */}
            <div className="flex items-center justify-between gap-1.5 px-1 flex-wrap">
              {/* Flip Board Button */}
              <Button3D
                variant="secondary"
                size="sm"
                onClick={toggleOrientation}
                icon={<RotateCw className="w-3.5 h-3.5 text-neutral-300" />}
                className="!py-1.5 !px-3 text-xs"
                title="Rotate board perspective 180 degrees"
              >
                <span>Flip Board</span>
              </Button3D>

              {/* Auto Flip Toggle */}
              <Button3D
                variant={autoFlipBoard ? 'cyan' : 'secondary'}
                size="sm"
                onClick={() => {
                  setAutoFlipBoard(!autoFlipBoard);
                  showToast(
                    !autoFlipBoard ? 'Auto-flip enabled: Board will flip on each move' : 'Auto-flip disabled',
                    'info'
                  );
                }}
                className="!py-1.5 !px-3 text-xs"
                title="Automatically flip board perspective after each turn"
              >
                <span>Auto-Flip: {autoFlipBoard ? 'ON' : 'OFF'}</span>
              </Button3D>

              {/* Mobile Moves Drawer */}
              <div className="lg:hidden flex-1">
                <Button3D
                  variant="secondary"
                  size="sm"
                  onClick={() => setHistorySheetOpen(true)}
                  icon={<History className="w-3.5 h-3.5 text-amber-400" />}
                  className="w-full !py-1.5 text-xs font-semibold"
                  title="View move history and material"
                >
                  <span>Moves ({Math.ceil(history.length / 2)})</span>
                </Button3D>
              </div>
            </div>

            {/* Game Controls Bar: Resign, Draw, Restart, Undo */}
            <div className="mt-1">
              <GameControlsBar onOpenSettings={onOpenSettings} />
            </div>
          </div>
        </div>

        {/* Desktop Sidebar: Move History and Captured Pieces */}
        <div className="hidden lg:flex w-80 xl:w-96 flex-col border-l border-neutral-800/80 bg-neutral-900/40 backdrop-blur-md p-3 gap-3 overflow-hidden">
          <div className="shrink-0 p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Swords className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-200 font-mono">
                  Material Advantage
                </h3>
              </div>
            </div>
            <CapturedPieces />
          </div>

          <div className="flex-1 min-h-0">
            <MoveHistoryPanel />
          </div>
        </div>
      </div>

      {/* Promotion and Checkmate Modals */}
      <PromotionModal />
      <CheckmateModal onNavigateHome={() => onNavigate('landing')} />

      {/* Mobile Move History Bottom Sheet */}
      <MoveHistoryBottomSheet
        isOpen={historySheetOpen}
        onClose={() => setHistorySheetOpen(false)}
      />
    </div>
  );
};
