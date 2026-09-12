import React, { useState } from 'react';
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
import { Shield, Sparkles, AlertCircle, Users, History, RotateCw } from 'lucide-react';
import { Button3D } from '../components/ui/Button3D';
import { useDevice } from '../services/deviceTier';

interface PlayViewProps {
  onNavigate: (page: NavPage) => void;
  onOpenSettings: () => void;
}

export const PlayView: React.FC<PlayViewProps> = ({ onNavigate, onOpenSettings }) => {
  const [historySheetOpen, setHistorySheetOpen] = useState(false);
  const device = useDevice();
  const {
    gameMode,
    turn,
    isCheck,
    isGameOver,
    playerColor,
    players,
    history,
    toggleOrientation,
    setTwoPlayerSetupOpen,
    setGameMode
  } = useGameStore();

  const currentTurnPlayer = turn === 'w' ? players.white : players.black;
  const isLandscapeMobile = device.isLandscape && (device.isMobile || device.height < 520);

  return (
    <div className="relative w-full h-[calc(100dvh-56px)] md:h-[calc(100dvh-60px)] flex flex-col overflow-hidden bg-neutral-950">
      {/* Centered Max-Width Container for Desktop and Ultrawide monitors */}
      <div className="w-full max-w-7xl mx-auto h-full flex flex-col lg:flex-row overflow-hidden flex-1">
        
        {/* 3D Chess Board Stage */}
        <div className="relative flex-1 h-full flex flex-col items-center justify-between p-1.5 sm:p-3 overflow-hidden min-h-0">
          
          {/* Top Status Strip */}
          <div className="w-full max-w-xl flex items-center justify-between z-10 px-2 py-1 gap-1.5 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-200 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="text-neutral-100">{players.white}</span>
                  <span className="text-amber-500 font-bold text-xs">vs</span>
                  <span className="text-neutral-300">{players.black}</span>
                </span>
              </span>

              {/* Quick Players / Clock Setup Button */}
              <Button3D
                variant="secondary"
                size="sm"
                onClick={() => setTwoPlayerSetupOpen(true)}
                icon={<Users className="w-3 h-3 text-amber-400" />}
                title="Edit player names or time control"
                className="!py-1 !px-2 text-[11px]"
              >
                <span>Players & Clock</span>
              </Button3D>
            </div>

            {/* Turn / Check Indicator Banner */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900/80 border border-neutral-800 text-[11px] sm:text-xs font-semibold backdrop-blur-md">
              {isCheck ? (
                <span className="text-red-400 flex items-center gap-1.5 animate-bounce">
                  <AlertCircle className="w-3.5 h-3.5" /> CHECK! ({currentTurnPlayer})
                </span>
              ) : (
                <span className="text-neutral-200">
                  <span className="font-bold text-amber-400">{currentTurnPlayer}</span>
                  <span className="text-neutral-400 ml-1">({turn === 'w' ? 'White' : 'Black'})</span>
                </span>
              )}
            </div>
          </div>

          {/* 3D Canvas Container */}
          <div className="relative w-full flex-1 min-h-0 flex items-center justify-center touch-none">
            <ChessCanvas />
          </div>

          {/* Clocks & Mobile Controls Row */}
          <div className="w-full max-w-xl z-10 flex flex-col gap-1.5 pb-1 lg:pb-0">
            <GameClock />

            {/* Mobile Bottom Quick Actions (Moves Drawer, Flip, Controls) */}
            <div className="flex items-center justify-between gap-1.5 lg:hidden px-1">
              <Button3D
                variant="secondary"
                size="sm"
                onClick={() => setHistorySheetOpen(true)}
                icon={<History className="w-3.5 h-3.5 text-amber-400" />}
                className="flex-1 !py-1.5 text-xs font-semibold"
                title="Open move history and captured pieces"
              >
                <span>Moves ({Math.ceil(history.length / 2)})</span>
              </Button3D>

              <Button3D
                variant="secondary"
                size="sm"
                onClick={toggleOrientation}
                icon={<RotateCw className="w-3.5 h-3.5 text-neutral-300" />}
                className="!py-1.5 !px-3 text-xs"
                title="Flip board view"
              >
                <span>Flip</span>
              </Button3D>
            </div>
          </div>
        </div>

        {/* Right Sidebar: History, Captured, Controls (Permanently docked on Desktop & Landscape) */}
        <div className="hidden lg:flex w-80 xl:w-96 h-full bg-neutral-950/95 border-l border-neutral-800/80 p-3 xl:p-4 flex-col gap-3 z-10 overflow-y-auto">
          {/* Captured Material Widget */}
          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300 mb-2">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Material Advancements</span>
            </div>
            <CapturedPieces />
          </div>

          {/* Move History Panel */}
          <div className="flex-1 min-h-[160px] overflow-hidden">
            <MoveHistoryPanel />
          </div>

          {/* Game Action Controls */}
          <GameControlsBar onOpenSettings={onOpenSettings} />
        </div>
      </div>

      {/* Mobile Move History Bottom Sheet */}
      <MoveHistoryBottomSheet
        isOpen={historySheetOpen}
        onClose={() => setHistorySheetOpen(false)}
      />

      {/* Overlays */}
      <PromotionModal />
      <CheckmateModal onNavigateHome={() => onNavigate('landing')} />
    </div>
  );
};
