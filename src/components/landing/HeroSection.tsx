import React from 'react';
import { ChessCanvas } from '../../3d/ChessCanvas';
import { NavPage } from '../ui/Navbar';
import { useGameStore } from '../../store/gameStore';
import { Button3D } from '../ui/Button3D';
import { StaggerContainer } from '../transitions/StaggerContainer';
import { 
  Play, 
  Users, 
  Puzzle, 
  GraduationCap, 
  Sparkles,
  Palette
} from 'lucide-react';
import { useNavigationStore } from '../../store/navigationStore';

interface HeroSectionProps {
  onNavigate: (page: NavPage) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { setGameMode, resetGame, setTwoPlayerSetupOpen } = useGameStore();
  const { openThemesModal } = useNavigationStore();

  const handlePlayNow = () => {
    setGameMode('play');
    resetGame();
    onNavigate('play');
  };

  const handleLocal2P = () => {
    setTwoPlayerSetupOpen(true);
  };

  return (
    <div className="relative min-h-[calc(100vh-60px)] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      {/* Background 3D Canvas with cinematic camera orbit */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-auto">
        <ChessCanvas isHeroPreview={true} interactive={false} />
      </div>

      {/* Atmospheric Ambient Glows & Subtle Vignette */}
      <div className="absolute inset-0 z-1 pointer-events-none bg-radial-gradient from-transparent via-neutral-950/40 to-neutral-950/90" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Content Overlay with Staggered Entrance */}
      <StaggerContainer 
        staggerMs={70} 
        baseDelayMs={50}
        className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8 flex flex-col items-center text-center"
      >
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/80 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium backdrop-blur-md shadow-lg shadow-amber-500/5 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>NEXT-GENERATION 3D CHESS BATTLEFIELD</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-neutral-100 font-display max-w-3xl leading-[1.08] drop-shadow-2xl">
          CHESSVERSE <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">3D</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-neutral-300 max-w-xl mt-3 font-normal leading-relaxed drop-shadow">
          Master the board. Enter another dimension.
        </p>

        {/* Primary Command Grid: PLAY, 2 PLAYER, LEARN CHESS, PUZZLES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-8 w-full max-w-lg">
          <Button3D
            variant="primary"
            size="lg"
            onClick={handlePlayNow}
            icon={<Play className="w-4 h-4 fill-current" />}
            className="w-full"
          >
            PLAY
          </Button3D>

          <Button3D
            variant="secondary"
            size="lg"
            onClick={() => onNavigate('2player')}
            icon={<Users className="w-4 h-4 text-sky-400" />}
            className="w-full border-sky-500/30 text-neutral-100"
          >
            2 PLAYER
          </Button3D>

          <Button3D
            variant="secondary"
            size="lg"
            onClick={() => onNavigate('learn')}
            icon={<GraduationCap className="w-4 h-4 text-purple-400" />}
            className="w-full border-purple-500/30 text-neutral-100"
          >
            LEARN CHESS
          </Button3D>

          <Button3D
            variant="secondary"
            size="lg"
            onClick={() => onNavigate('puzzles')}
            icon={<Puzzle className="w-4 h-4 text-emerald-400" />}
            className="w-full border-emerald-500/30 text-neutral-100"
          >
            PUZZLES
          </Button3D>
        </div>

        {/* Board Themes Studio Quick Link */}
        <div className="flex items-center justify-center mt-4">
          <Button3D
            variant="ghost"
            size="sm"
            onClick={openThemesModal}
            icon={<Palette className="w-3.5 h-3.5 text-amber-400" />}
            className="text-xs text-amber-300/80 hover:text-amber-300 border border-amber-500/20 hover:border-amber-500/40 bg-neutral-900/50"
          >
            CUSTOMIZE BOARD & PIECE THEMES
          </Button3D>
        </div>
      </StaggerContainer>

      {/* Feature Strip at Bottom */}
      <div className="relative z-10 w-full border-t border-neutral-800/60 bg-neutral-950/70 backdrop-blur-md py-4 px-4 sm:px-8 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-amber-400">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-200 uppercase">3D Academy</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Interactive lessons, practice drills & tactics</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-amber-400">
              <Puzzle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-200 uppercase">Tactical Puzzles</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Curated tactical challenges & master studies</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-200 uppercase">Pass & Play 2P</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Local 2-player battles with customizable clocks</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-200 uppercase">Procedural 3D Audio</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Tactile synthesized impact thuds & fanfares</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
