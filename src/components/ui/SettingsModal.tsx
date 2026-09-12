import React, { useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { 
  X, 
  Monitor, 
  Volume2, 
  Gamepad2, 
  Eye, 
  Palette,
  Check
} from 'lucide-react';
import { BoardThemeId, PieceThemeId } from '../../types/chess';
import { Modal3D } from '../transitions/Modal3D';
import { Button3D } from './Button3D';
import { soundService } from '../../services/sound';
import { useNavigationStore } from '../../store/navigationStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'graphics' | 'sound' | 'gameplay' | 'accessibility';

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('gameplay');
  const { openThemesModal } = useNavigationStore();

  const {
    graphics,
    updateGraphics,
    sound,
    updateSound,
    gameplay,
    updateGameplay,
    accessibility,
    updateAccessibility,
    setBoardTheme,
    setPieceTheme
  } = useSettingsStore();

  if (!isOpen) return null;

  const boardThemes: { id: BoardThemeId; label: string; previewColor: string }[] = [
    { id: 'classic', label: 'Classic Wood', previewColor: '#eedbb0' },
    { id: 'midnight', label: 'Midnight Slate', previewColor: '#2d3748' },
    { id: 'royal', label: 'Royal Sapphire', previewColor: '#1e3a8a' },
    { id: 'marble', label: 'Carrara Marble', previewColor: '#f1f5f9' },
    { id: 'wood', label: 'Warm Ash', previewColor: '#e9d5a1' },
    { id: 'cyber', label: 'Cyber Grid', previewColor: '#06b6d4' }
  ];

  const pieceThemes: { id: PieceThemeId; label: string }[] = [
    { id: 'marble', label: 'Carrara Marble' },
    { id: 'minimalist', label: 'Minimalist Bauhaus' },
    { id: 'wood', label: 'Classic Wood' },
    { id: 'metal', label: 'Brushed Metal' },
    { id: 'futuristic', label: 'Luminous Cyber' },
    { id: 'classic', label: 'Classic Lacquer' }
  ];

  return (
    <Modal3D isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      <div className="relative w-full overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70">
          <h2 className="text-lg font-bold text-neutral-100 font-display flex items-center gap-2">
            <span>Settings & Preferences</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/30 px-6 gap-1 overflow-x-auto">
          {[
            { id: 'gameplay' as const, label: 'Gameplay & Themes', icon: Gamepad2 },
            { id: 'graphics' as const, label: 'Graphics & 3D', icon: Monitor },
            { id: 'sound' as const, label: 'Audio', icon: Volume2 },
            { id: 'accessibility' as const, label: 'Accessibility', icon: Eye }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-3 border-b-2 text-xs font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'gameplay' && (
            <div className="space-y-5">
              {/* Themes Studio Banner */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/30 flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-neutral-100 font-brand">Interactive 3D Themes Studio</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      Real-time Preview
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Rotate, zoom, and inspect marble, minimalist, and wood sets under physical studio lighting.
                  </p>
                </div>
                <Button3D
                  variant="amber"
                  size="sm"
                  onClick={() => {
                    onClose();
                    openThemesModal();
                  }}
                  className="font-bold text-neutral-950 text-xs"
                >
                  <span>Open Studio →</span>
                </Button3D>
              </div>

              {/* Board Theme */}
              <div>
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2">
                  Board Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {boardThemes.map((bt) => (
                    <button
                      key={bt.id}
                      onClick={() => setBoardTheme(bt.id)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        gameplay.boardTheme === bt.id
                          ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                          : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-neutral-600 shadow-sm"
                        style={{ backgroundColor: bt.previewColor }}
                      />
                      <span className="text-xs font-medium">{bt.label}</span>
                      {gameplay.boardTheme === bt.id && <Check className="w-3.5 h-3.5 ml-auto text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Piece Theme */}
              <div>
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2">
                  Piece Material Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {pieceThemes.map((pt) => (
                    <button
                      key={pt.id}
                      onClick={() => setPieceTheme(pt.id)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                        gameplay.pieceTheme === pt.id
                          ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                          : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      {pt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gameplay Toggles */}
              <div className="divide-y divide-neutral-800/60 pt-2">
                <div className="flex items-center justify-between py-2.5">
                  <div>
                    <span className="text-xs font-medium text-neutral-200 block">Show Legal Moves</span>
                    <span className="text-[11px] text-neutral-400">Illuminates valid destination squares</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={gameplay.showLegalMoves}
                    onChange={(e) => updateGameplay({ showLegalMoves: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between py-2.5">
                  <div>
                    <span className="text-xs font-medium text-neutral-200 block">Show Coordinates</span>
                    <span className="text-[11px] text-neutral-400">Rank (1-8) and file (a-h) edge coordinates</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={gameplay.showCoordinates}
                    onChange={(e) => updateGameplay({ showCoordinates: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between py-2.5">
                  <div>
                    <span className="text-xs font-medium text-neutral-200 block">Auto-Promote to Queen</span>
                    <span className="text-[11px] text-neutral-400">Automatically promote pawns to Queens without modal</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={gameplay.autoQueen}
                    onChange={(e) => updateGameplay({ autoQueen: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'graphics' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2">
                  Rendering Quality
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['auto', 'high', 'medium', 'low'] as const).map((q) => (
                    <button
                      key={q}
                      onClick={() => updateGraphics({ quality: q })}
                      className={`py-2 px-2.5 rounded-lg border text-xs font-bold uppercase transition-all cursor-pointer ${
                        graphics.quality === q
                          ? 'bg-amber-500 text-neutral-950 border-amber-500'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-neutral-800/60">
                <div className="flex items-center justify-between py-2.5">
                  <div>
                    <span className="text-xs font-medium text-neutral-200 block">Soft Shadows</span>
                    <span className="text-[11px] text-neutral-400">High-resolution piece drop shadows</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={graphics.shadows}
                    onChange={(e) => updateGraphics({ shadows: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between py-2.5">
                  <div>
                    <span className="text-xs font-medium text-neutral-200 block">Atmospheric Particles</span>
                    <span className="text-[11px] text-neutral-400">Subtle floating ambient sparks and motes</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={graphics.particles}
                    onChange={(e) => updateGraphics({ particles: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between py-2.5">
                  <div>
                    <span className="text-xs font-medium text-neutral-200 block">View Mode</span>
                    <span className="text-[11px] text-neutral-400">Toggle between 3D Perspective and 2D Tactical</span>
                  </div>
                  <button
                    onClick={() => updateGraphics({ viewMode: graphics.viewMode === '3d' ? '2d' : '3d' })}
                    className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-mono font-bold text-neutral-200 rounded-lg cursor-pointer"
                  >
                    {graphics.viewMode.toUpperCase()}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sound' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-200 block">Master Sound</span>
                  <span className="text-[11px] text-neutral-400">Enable or disable all synthesized audio</span>
                </div>
                <input
                  type="checkbox"
                  checked={sound.enabled}
                  onChange={(e) => updateSound({ enabled: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              {sound.enabled && (
                <div>
                  <div className="flex items-center justify-between mb-1.5 text-xs text-neutral-300">
                    <span>Master Volume</span>
                    <span className="font-mono font-bold">{Math.round(sound.masterVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={sound.masterVolume}
                    onChange={(e) => updateSound({ masterVolume: parseFloat(e.target.value) })}
                    className="w-full accent-amber-500 bg-neutral-800 rounded-lg h-1.5 cursor-pointer"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'accessibility' && (
            <div className="space-y-3 divide-y divide-neutral-800/60">
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-xs font-medium text-neutral-200 block">Reduced Motion</span>
                  <span className="text-[11px] text-neutral-400">Minimize animations and camera easing</span>
                </div>
                <input
                  type="checkbox"
                  checked={accessibility.reducedMotion}
                  onChange={(e) => updateAccessibility({ reducedMotion: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-xs font-medium text-neutral-200 block">High Contrast Mode</span>
                  <span className="text-[11px] text-neutral-400">Enhance board border and square contrast</span>
                </div>
                <input
                  type="checkbox"
                  checked={accessibility.highContrast}
                  onChange={(e) => updateAccessibility({ highContrast: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-neutral-800 bg-neutral-950/60">
          <Button3D
            variant="primary"
            size="sm"
            onClick={onClose}
            className="!px-6 !py-2"
          >
            DONE
          </Button3D>
        </div>
      </div>
    </Modal3D>
  );
};
