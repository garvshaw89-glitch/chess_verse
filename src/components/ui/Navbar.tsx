import React from 'react';
import { 
  Sword, 
  Users, 
  Puzzle, 
  GraduationCap, 
  User, 
  Volume2, 
  VolumeX, 
  Settings,
  Sparkles,
  ArrowLeft,
  Palette
} from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useNavigationStore } from '../../store/navigationStore';
import { useGameStore } from '../../store/gameStore';
import { Button3D } from './Button3D';

export type NavPage = 'landing' | 'play' | '2player' | 'learn' | 'puzzles' | 'profile';

interface NavbarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  onOpenSettings: () => void;
  onOpenThemes?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenSettings,
  onOpenThemes
}) => {
  const { sound, updateSound } = useSettingsStore();
  const { navigateBack, openThemesModal } = useNavigationStore();
  const { setTwoPlayerSetupOpen } = useGameStore();

  const handleOpenThemes = onOpenThemes || openThemesModal;

  const handleItemClick = (pageId: NavPage) => {
    onNavigate(pageId);
  };

  const navItems: { id: NavPage; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'play', label: 'Play', icon: Sword },
    { id: '2player', label: '2 Player', icon: Users },
    { id: 'learn', label: 'Learn', icon: GraduationCap },
    { id: 'puzzles', label: 'Puzzles', icon: Puzzle },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <>
      {/* Desktop & Tablet Top Navigation */}
      <header className="sticky top-0 z-40 w-full bg-neutral-950/85 border-b border-neutral-800/80 backdrop-blur-md px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Left Side: Brand Logo & Contextual 3D Back Button */}
        <div className="flex items-center gap-3">
          {currentPage !== 'landing' && (
            <Button3D
              variant="secondary"
              size="sm"
              onClick={navigateBack}
              icon={<ArrowLeft className="w-3.5 h-3.5" />}
              className="text-xs font-mono font-bold text-amber-400 border-amber-500/40"
              title="Return to previous screen"
            >
              BACK
            </Button3D>
          )}

          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 group text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <span className="text-neutral-950 font-black text-lg font-serif">♔</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-brand text-base sm:text-lg font-bold tracking-wider text-neutral-100">
                  CHESS VERSE
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  3D
                </span>
              </div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 hidden sm:block">
                Master the board
              </span>
            </div>
          </button>
        </div>

        {/* Primary Nav Links with 3D Button Interactivity */}
        <nav className="hidden md:flex items-center gap-1.5 bg-neutral-900/70 p-1.5 rounded-xl border border-neutral-800/90 shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <Button3D
                key={item.id}
                variant={isActive ? 'amber' : 'ghost'}
                size="sm"
                onClick={() => handleItemClick(item.id)}
                icon={<Icon className={`w-3.5 h-3.5 ${isActive ? 'text-neutral-950' : 'text-neutral-400'}`} />}
                className={isActive ? 'shadow-md shadow-amber-500/25' : ''}
              >
                <span>{item.label}</span>
              </Button3D>
            );
          })}
        </nav>

        {/* Action Controls (Sound & Themes & Settings & Profile) */}
        <div className="flex items-center gap-2">
          {/* Board & Piece Themes 3D Button */}
          <Button3D
            variant="secondary"
            size="sm"
            onClick={handleOpenThemes}
            title="Board & Piece Themes Studio"
            icon={<Palette className="w-3.5 h-3.5 text-amber-400" />}
            className="hidden sm:inline-flex text-xs font-semibold text-neutral-200 border-amber-500/30 hover:border-amber-500/60"
          >
            <span>Themes</span>
          </Button3D>

          {/* Mobile Icon Button for Themes */}
          <Button3D
            variant="secondary"
            size="icon"
            onClick={handleOpenThemes}
            title="Board & Piece Themes"
            className="sm:hidden w-8 h-8 !p-0"
          >
            <Palette className="w-4 h-4 text-amber-400" />
          </Button3D>

          <Button3D
            variant="secondary"
            size="icon"
            onClick={() => updateSound({ enabled: !sound.enabled })}
            title={sound.enabled ? 'Mute Audio' : 'Enable Audio'}
            className="w-8 h-8 !p-0"
          >
            {sound.enabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-500" />
            )}
          </Button3D>

          <Button3D
            variant="secondary"
            size="icon"
            onClick={onOpenSettings}
            title="Open Settings"
            className="w-8 h-8 !p-0"
          >
            <Settings className="w-4 h-4 text-neutral-300" />
          </Button3D>

          <Button3D
            variant="secondary"
            size="sm"
            onClick={() => onNavigate('profile')}
            className="hidden sm:inline-flex gap-2 !px-2.5 !py-1"
          >
            <div className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center border border-amber-500/40 text-[9px] text-amber-300 font-bold font-mono">
              GM
            </div>
            <span className="text-xs font-semibold text-neutral-200">Player</span>
          </Button3D>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar with 3D Touch feedback */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 border-t border-neutral-800/80 backdrop-blur-lg px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-transform active:scale-95 cursor-pointer ${
                isActive ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
