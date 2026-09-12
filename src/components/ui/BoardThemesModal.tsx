import React, { useState } from 'react';
import { 
  X, 
  Palette, 
  Sparkles, 
  RotateCw, 
  Check, 
  Layers, 
  Crown, 
  Box, 
  TreePine, 
  ShieldAlert, 
  Cpu, 
  Award,
  Maximize2
} from 'lucide-react';
import { BoardThemeId, PieceThemeId, PieceType } from '../../types/chess';
import { useSettingsStore } from '../../store/settingsStore';
import { Modal3D } from '../transitions/Modal3D';
import { Button3D } from './Button3D';
import { ThemePreview3D } from '../../3d/ThemePreview3D';
import { soundService } from '../../services/sound';

interface BoardThemesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PieceThemeOption {
  id: PieceThemeId;
  name: string;
  subtitle: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  previewClass: string;
}

interface BoardThemeOption {
  id: BoardThemeId;
  name: string;
  subtitle: string;
  lightColor: string;
  darkColor: string;
  borderColor: string;
  accentBorder: string;
}

interface ThemePreset {
  id: string;
  name: string;
  description: string;
  pieceTheme: PieceThemeId;
  boardTheme: BoardThemeId;
  tag: string;
}

const PIECE_THEMES: PieceThemeOption[] = [
  {
    id: 'marble',
    name: 'Carrara Marble',
    subtitle: 'Luxury Sculpted Italian Stone',
    badge: 'Popular',
    description: 'Pristine crystalline white Carrara with obsidian dark marble, deep specular shine, and luxury clearcoat.',
    icon: Crown,
    accentColor: '#f8fafc',
    previewClass: 'from-slate-100 to-slate-400 text-slate-950'
  },
  {
    id: 'minimalist',
    name: 'Minimalist Bauhaus',
    subtitle: 'Modern Architectural Geometry',
    badge: 'Modern',
    description: 'Clean architectural cylinders, bevels, and pure geometric silhouettes with a refined satin finish.',
    icon: Box,
    accentColor: '#e2e8f0',
    previewClass: 'from-neutral-200 to-neutral-500 text-neutral-950'
  },
  {
    id: 'wood',
    name: 'Classic Wood',
    subtitle: 'Hand-Carved Walnut & Boxwood',
    badge: 'Traditional',
    description: 'Warm natural timber grain, hand-turned Staunton profiles, and soft tournament lacquer finish.',
    icon: TreePine,
    accentColor: '#d97706',
    previewClass: 'from-amber-200 to-amber-700 text-amber-950'
  },
  {
    id: 'metal',
    name: 'Brushed Metal',
    subtitle: 'Machined Titanium & Gunmetal',
    badge: 'Industrial',
    description: 'Aerospace-grade machined aluminum and dark gunmetal with high-contrast specular reflections.',
    icon: ShieldAlert,
    accentColor: '#94a3b8',
    previewClass: 'from-slate-300 to-zinc-600 text-zinc-950'
  },
  {
    id: 'futuristic',
    name: 'Luminous Cyber',
    subtitle: 'High-Tech Neon Matrix',
    badge: 'Sci-Fi',
    description: 'Translucent synthetic polymers with pulsing cyan & magenta core illumination and chrome trims.',
    icon: Cpu,
    accentColor: '#06b6d4',
    previewClass: 'from-cyan-400 to-fuchsia-600 text-neutral-950'
  },
  {
    id: 'classic',
    name: 'Classic Lacquer',
    subtitle: 'Ebony & Ivory Tournament Spec',
    badge: 'Official',
    description: 'FIDE-inspired high-gloss tournament pieces with felt bases and balanced weight distribution.',
    icon: Award,
    accentColor: '#fef08a',
    previewClass: 'from-amber-100 to-neutral-800 text-amber-200'
  }
];

const BOARD_THEMES: BoardThemeOption[] = [
  {
    id: 'classic',
    name: 'Classic Wood',
    subtitle: 'Natural ash and rich dark walnut',
    lightColor: '#eedbb0',
    darkColor: '#936a46',
    borderColor: '#2e1c0c',
    accentBorder: 'border-amber-600'
  },
  {
    id: 'marble',
    name: 'Carrara Marble',
    subtitle: 'Veined white marble & charcoal slate',
    lightColor: '#f1f5f9',
    darkColor: '#334155',
    borderColor: '#1e293b',
    accentBorder: 'border-slate-400'
  },
  {
    id: 'midnight',
    name: 'Midnight Slate',
    subtitle: 'Charcoal graphite with icy cyan rim',
    lightColor: '#2d3748',
    darkColor: '#171923',
    borderColor: '#0f1117',
    accentBorder: 'border-cyan-500'
  },
  {
    id: 'royal',
    name: 'Royal Sapphire',
    subtitle: 'Pearl alabaster with imperial navy',
    lightColor: '#e2e8f0',
    darkColor: '#1e3a8a',
    borderColor: '#0f172a',
    accentBorder: 'border-blue-500'
  },
  {
    id: 'wood',
    name: 'Warm Ash',
    subtitle: 'Golden teakwood & smoked cedar',
    lightColor: '#e9d5a1',
    darkColor: '#8b5a2b',
    borderColor: '#4a2c0f',
    accentBorder: 'border-amber-700'
  },
  {
    id: 'cyber',
    name: 'Cyber Grid',
    subtitle: 'Neon wireframe matrix on dark glass',
    lightColor: '#1e293b',
    darkColor: '#090d16',
    borderColor: '#030712',
    accentBorder: 'border-cyan-400'
  }
];

const PRESETS: ThemePreset[] = [
  {
    id: 'p_classic',
    name: 'Championship Classic',
    description: 'Carved wood pieces on warm ash board',
    pieceTheme: 'wood',
    boardTheme: 'classic',
    tag: 'Tournament'
  },
  {
    id: 'p_marble',
    name: 'Imperial Carrara',
    description: 'Pure marble stone pieces on veined marble board',
    pieceTheme: 'marble',
    boardTheme: 'marble',
    tag: 'Luxury'
  },
  {
    id: 'p_bauhaus',
    name: 'Modernist Bauhaus',
    description: 'Minimalist geometric pieces on midnight slate',
    pieceTheme: 'minimalist',
    boardTheme: 'midnight',
    tag: 'Minimal'
  },
  {
    id: 'p_cyber',
    name: 'Cyberpunk 2077',
    description: 'Luminous neon pieces on cyber grid board',
    pieceTheme: 'futuristic',
    boardTheme: 'cyber',
    tag: 'Sci-Fi'
  }
];

export const BoardThemesModal: React.FC<BoardThemesModalProps> = ({ isOpen, onClose }) => {
  const { gameplay, setBoardTheme, setPieceTheme } = useSettingsStore();

  const [activeCategory, setActiveCategory] = useState<'pieces' | 'boards' | 'presets'>('pieces');
  const [focusedPiece, setFocusedPiece] = useState<PieceType | 'all'>('all');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  if (!isOpen) return null;

  const currentPieceTheme = gameplay.pieceTheme;
  const currentBoardTheme = gameplay.boardTheme;

  const handleSelectPieceTheme = (themeId: PieceThemeId) => {
    soundService.playButton3DPress('secondary');
    setPieceTheme(themeId);
  };

  const handleSelectBoardTheme = (themeId: BoardThemeId) => {
    soundService.playButton3DPress('secondary');
    setBoardTheme(themeId);
  };

  const handleApplyPreset = (preset: ThemePreset) => {
    soundService.playButton3DPress('primary');
    setPieceTheme(preset.pieceTheme);
    setBoardTheme(preset.boardTheme);
  };

  return (
    <Modal3D isOpen={isOpen} onClose={onClose} maxWidth="max-w-5xl">
      <div className="relative w-full overflow-hidden flex flex-col max-h-[90dvh] sm:max-h-[92vh] bg-neutral-950 text-neutral-100">
        {/* Header with Title and Close */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-neutral-950 shadow-md shadow-amber-500/20">
              <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-lg font-bold font-brand tracking-wide text-neutral-100">
                  Board & Piece Themes Studio
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  Real-time 3D
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-sans hidden sm:block">
                Select high-fidelity materials, wood grains, and sculpted piece styles with instant 3D inspection.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/80 transition-colors cursor-pointer border border-transparent hover:border-neutral-700"
            title="Close Themes Studio"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Studio Body: Split View (Left: 3D Stage | Right: Selection Cards) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0">
          {/* LEFT: Real-time 3D Viewport Stage */}
          <div className="lg:col-span-6 bg-radial from-neutral-900 to-neutral-950 border-b lg:border-b-0 lg:border-r border-neutral-800/80 flex flex-col relative h-[210px] sm:h-[260px] lg:h-auto lg:min-h-[480px] shrink-0">
            {/* 3D Canvas Container */}
            <div className="flex-1 relative w-full h-full">
              <ThemePreview3D
                boardTheme={currentBoardTheme}
                pieceTheme={currentPieceTheme}
                focusedPiece={focusedPiece}
                autoRotate={autoRotate}
              />
            </div>

            {/* Viewport Control Bar */}
            <div className="p-3 bg-neutral-950/90 border-t border-neutral-800/80 backdrop-blur-md flex items-center justify-between gap-2 flex-wrap z-10">
              {/* Piece Inspection Filters */}
              <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                <span className="text-[11px] font-mono font-bold text-neutral-400 mr-1 hidden sm:inline">
                  INSPECT:
                </span>
                {[
                  { id: 'all' as const, label: 'All' },
                  { id: 'k' as PieceType, label: '♔ King' },
                  { id: 'q' as PieceType, label: '♕ Queen' },
                  { id: 'n' as PieceType, label: '♘ Knight' },
                  { id: 'b' as PieceType, label: '♗ Bishop' },
                  { id: 'r' as PieceType, label: '♖ Rook' },
                  { id: 'p' as PieceType, label: '♙ Pawn' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      soundService.playClick();
                      setFocusedPiece(item.id);
                    }}
                    className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                      focusedPiece === item.id
                        ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-xs'
                        : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Turntable Auto-Rotate Toggle */}
              <button
                onClick={() => {
                  soundService.playClick();
                  setAutoRotate(!autoRotate);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all cursor-pointer ${
                  autoRotate
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-200'
                }`}
                title="Toggle automatic turntable rotation"
              >
                <RotateCw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                <span>{autoRotate ? 'Rotating' : 'Paused'}</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Selectable Themes Tabs & Cards */}
          <div className="lg:col-span-6 flex flex-col min-h-0 bg-neutral-950">
            {/* Category Navigation */}
            <div className="flex border-b border-neutral-800 bg-neutral-900/40 px-4 sm:px-6 gap-2 pt-3">
              {[
                { id: 'pieces' as const, label: 'Piece Sets', icon: Crown, count: PIECE_THEMES.length },
                { id: 'boards' as const, label: 'Board Themes', icon: Layers, count: BOARD_THEMES.length },
                { id: 'presets' as const, label: 'Curated Presets', icon: Sparkles, count: PRESETS.length }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      soundService.playClick();
                      setActiveCategory(tab.id);
                    }}
                    className={`flex items-center gap-2 pb-3 px-3 border-b-2 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                      isActive
                        ? 'border-amber-500 text-amber-400'
                        : 'border-transparent text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-amber-500/20 text-amber-300' : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Cards Scroll Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {/* PIECE SETS TAB */}
              {activeCategory === 'pieces' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                      Select 3D Piece Architecture & Materials
                    </span>
                    <span className="text-xs text-amber-400 font-semibold">
                      Current: {PIECE_THEMES.find(p => p.id === currentPieceTheme)?.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {PIECE_THEMES.map((theme) => {
                      const Icon = theme.icon;
                      const isSelected = currentPieceTheme === theme.id;
                      return (
                        <div
                          key={theme.id}
                          onClick={() => handleSelectPieceTheme(theme.id)}
                          className={`group relative p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500/90 shadow-md shadow-amber-500/15 ring-1 ring-amber-500/40'
                              : 'bg-neutral-900/70 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${theme.previewClass} flex items-center justify-center shadow-sm font-bold text-sm`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <h3 className={`text-xs font-bold font-sans ${isSelected ? 'text-amber-300' : 'text-neutral-200'}`}>
                                  {theme.name}
                                </h3>
                                <p className="text-[10px] text-neutral-400">
                                  {theme.subtitle}
                                </p>
                              </div>
                            </div>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-800/90 text-neutral-300 border border-neutral-700/60">
                              {theme.badge}
                            </span>
                          </div>

                          <p className="text-[11px] text-neutral-400/90 leading-relaxed mb-3 line-clamp-2">
                            {theme.description}
                          </p>

                          <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60 text-[11px]">
                            <span className={`font-mono text-[10px] ${isSelected ? 'text-amber-400 font-bold' : 'text-neutral-400'}`}>
                              {isSelected ? 'ACTIVE SET' : 'CLICK TO SELECT'}
                            </span>
                            {isSelected ? (
                              <div className="flex items-center gap-1 text-amber-400 font-bold text-[11px]">
                                <Check className="w-3.5 h-3.5" />
                                <span>Equipped</span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-neutral-400 group-hover:text-neutral-200 transition-colors">
                                Preview in 3D →
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* BOARD THEMES TAB */}
              {activeCategory === 'boards' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                      Select Chessboard Veneer & Grid Colors
                    </span>
                    <span className="text-xs text-amber-400 font-semibold">
                      Current: {BOARD_THEMES.find(b => b.id === currentBoardTheme)?.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {BOARD_THEMES.map((theme) => {
                      const isSelected = currentBoardTheme === theme.id;
                      return (
                        <div
                          key={theme.id}
                          onClick={() => handleSelectBoardTheme(theme.id)}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500/90 shadow-md shadow-amber-500/15 ring-1 ring-amber-500/40'
                              : 'bg-neutral-900/70 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2.5">
                              {/* Swatch Mini Checkered Pattern */}
                              <div className="w-8 h-8 rounded-lg overflow-hidden border border-neutral-700 grid grid-cols-2 grid-rows-2 shadow-sm flex-shrink-0">
                                <div style={{ backgroundColor: theme.lightColor }} />
                                <div style={{ backgroundColor: theme.darkColor }} />
                                <div style={{ backgroundColor: theme.darkColor }} />
                                <div style={{ backgroundColor: theme.lightColor }} />
                              </div>

                              <div>
                                <h3 className={`text-xs font-bold ${isSelected ? 'text-amber-300' : 'text-neutral-200'}`}>
                                  {theme.name}
                                </h3>
                                <p className="text-[10px] text-neutral-400">
                                  {theme.subtitle}
                                </p>
                              </div>
                            </div>
                            {isSelected && (
                              <span className="p-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                                <Check className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60 text-[10px] font-mono text-neutral-400">
                            <span>BORDER: {theme.borderColor}</span>
                            <span className={isSelected ? 'text-amber-400 font-bold' : ''}>
                              {isSelected ? 'APPLIED' : 'SELECT'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CURATED PRESETS TAB */}
              {activeCategory === 'presets' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                      Cohesive Aesthetic Combinations
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PRESETS.map((preset) => {
                      const isMatches = currentPieceTheme === preset.pieceTheme && currentBoardTheme === preset.boardTheme;
                      return (
                        <div
                          key={preset.id}
                          onClick={() => handleApplyPreset(preset)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isMatches
                              ? 'bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/20 ring-1 ring-amber-500/40'
                              : 'bg-neutral-900/70 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <h3 className={`text-sm font-bold font-brand ${isMatches ? 'text-amber-300' : 'text-neutral-100'}`}>
                                {preset.name}
                              </h3>
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-amber-400 border border-neutral-700">
                                {preset.tag}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-400 mb-3">
                              {preset.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-neutral-800/70 text-xs">
                            <span className="text-[11px] font-mono text-neutral-400">
                              {preset.pieceTheme.toUpperCase()} + {preset.boardTheme.toUpperCase()}
                            </span>
                            <span className={`font-semibold text-xs ${isMatches ? 'text-amber-400' : 'text-neutral-300'}`}>
                              {isMatches ? 'Active Preset ✓' : 'Apply Preset →'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action Bar */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between gap-3">
              <div className="text-xs text-neutral-400">
                <span>Active: </span>
                <span className="text-neutral-200 font-bold">
                  {PIECE_THEMES.find(p => p.id === currentPieceTheme)?.name}
                </span>
                <span className="text-neutral-400"> on </span>
                <span className="text-neutral-200 font-bold">
                  {BOARD_THEMES.find(b => b.id === currentBoardTheme)?.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button3D
                  variant="amber"
                  size="md"
                  onClick={() => {
                    soundService.playButton3DPress('primary');
                    onClose();
                  }}
                  icon={<Check className="w-4 h-4 text-neutral-950" />}
                  className="font-bold text-neutral-950"
                >
                  <span>Apply & Close</span>
                </Button3D>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal3D>
  );
};
