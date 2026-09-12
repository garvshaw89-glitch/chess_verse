import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useSettingsStore } from '../../store/settingsStore';
import { 
  Undo2, 
  RotateCw, 
  Flag, 
  Handshake, 
  Camera, 
  Volume2, 
  VolumeX, 
  Settings, 
  Layers,
  Sparkles,
  Palette
} from 'lucide-react';
import { CameraPreset } from '../../types/chess';
import { Button3D } from './Button3D';
import { useNavigationStore } from '../../store/navigationStore';

interface GameControlsBarProps {
  onOpenSettings: () => void;
}

export const GameControlsBar: React.FC<GameControlsBarProps> = ({ onOpenSettings }) => {
  const { openThemesModal } = useNavigationStore();
  const {
    undoMove,
    resetGame,
    resign,
    offerDraw,
    toggleOrientation,
    cameraPreset,
    setCameraPreset,
    isGameOver,
    history
  } = useGameStore();

  const { sound, updateSound, graphics, toggleViewMode } = useSettingsStore();

  const cameraPresets: { id: CameraPreset; label: string }[] = [
    { id: 'player_w', label: 'White' },
    { id: 'player_b', label: 'Black' },
    { id: 'top', label: 'Top' },
    { id: 'isometric', label: 'Iso' },
    { id: 'cinematic', label: 'Cinema' }
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-neutral-900/90 border border-neutral-800 rounded-xl shadow-xl backdrop-blur-md text-xs">
      {/* Primary Action Buttons with 3D button interactions */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Button3D
          variant="secondary"
          size="sm"
          onClick={undoMove}
          disabled={history.length === 0 || isGameOver}
          title="Undo last move"
          icon={<Undo2 className="w-3.5 h-3.5 text-neutral-400" />}
        >
          <span>Undo</span>
        </Button3D>

        <Button3D
          variant="secondary"
          size="sm"
          onClick={() => resetGame()}
          title="RESTART GAME"
          icon={<RotateCw className="w-3.5 h-3.5 text-amber-400" />}
        >
          <span>Restart</span>
        </Button3D>

        <Button3D
          variant="danger"
          size="sm"
          onClick={() => resign()}
          disabled={isGameOver}
          title="Resign Game"
          icon={<Flag className="w-3.5 h-3.5 text-red-400" />}
        >
          <span>Resign</span>
        </Button3D>

        <Button3D
          variant="secondary"
          size="sm"
          onClick={offerDraw}
          disabled={isGameOver}
          title="Offer Draw"
          icon={<Handshake className="w-3.5 h-3.5 text-amber-400" />}
        >
          <span>Draw</span>
        </Button3D>

        <Button3D
          variant="secondary"
          size="sm"
          onClick={toggleOrientation}
          title="Flip Board Orientation"
          icon={<RotateCw className="w-3.5 h-3.5 text-neutral-400" />}
        >
          <span>Flip</span>
        </Button3D>
      </div>

      {/* Camera & Display controls */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Camera Preset Selector */}
        {graphics.viewMode === '3d' && (
          <div className="hidden sm:flex items-center bg-neutral-950/60 p-0.5 rounded-lg border border-neutral-800">
            <Camera className="w-3.5 h-3.5 text-neutral-400 ml-1.5 mr-1" />
            {cameraPresets.map((p) => (
              <button
                key={p.id}
                onClick={() => setCameraPreset(p.id)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  cameraPreset === p.id
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* 2D / 3D Switch */}
        <Button3D
          variant="secondary"
          size="sm"
          onClick={toggleViewMode}
          title={`Switch to ${graphics.viewMode === '3d' ? '2D Tactical' : '3D Immersive'} view`}
          icon={<Layers className="w-3.5 h-3.5 text-cyan-400" />}
        >
          <span className="font-mono text-[11px] font-bold">{graphics.viewMode.toUpperCase()}</span>
        </Button3D>

        {/* Board & Piece Themes Button */}
        <Button3D
          variant="secondary"
          size="sm"
          onClick={openThemesModal}
          title="Customize Board & 3D Piece Themes"
          icon={<Palette className="w-3.5 h-3.5 text-amber-400" />}
        >
          <span className="hidden sm:inline">Themes</span>
        </Button3D>

        {/* Sound Toggle */}
        <Button3D
          variant="secondary"
          size="icon"
          onClick={() => updateSound({ enabled: !sound.enabled })}
          title={sound.enabled ? 'Mute Sound' : 'Enable Sound'}
          className="w-7 h-7 !p-0"
        >
          {sound.enabled ? (
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
          )}
        </Button3D>

        {/* Settings Modal Button */}
        <Button3D
          variant="secondary"
          size="icon"
          onClick={onOpenSettings}
          title="Open Settings"
          className="w-7 h-7 !p-0"
        >
          <Settings className="w-3.5 h-3.5 text-neutral-300" />
        </Button3D>
      </div>
    </div>
  );
};
