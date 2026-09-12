import { create } from 'zustand';
import { GameSettings, BoardThemeId, PieceThemeId } from '../types/chess';
import { StorageService, DEFAULT_SETTINGS } from '../services/storage';
import { soundService } from '../services/sound';

interface SettingsStore extends GameSettings {
  updateGraphics: (partial: Partial<GameSettings['graphics']>) => void;
  updateSound: (partial: Partial<GameSettings['sound']>) => void;
  updateGameplay: (partial: Partial<GameSettings['gameplay']>) => void;
  updateAccessibility: (partial: Partial<GameSettings['accessibility']>) => void;
  setBoardTheme: (theme: BoardThemeId) => void;
  setPieceTheme: (theme: PieceThemeId) => void;
  toggleViewMode: () => void;
}

const savedSettings = StorageService.getSettings() || DEFAULT_SETTINGS;

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...savedSettings,

  updateGraphics: (partial) => {
    const updated = { ...get().graphics, ...partial };
    set({ graphics: updated });
    StorageService.saveSettings(get());
  },

  updateSound: (partial) => {
    const updated = { ...get().sound, ...partial };
    set({ sound: updated });
    if (partial.enabled !== undefined) soundService.setEnabled(partial.enabled);
    if (partial.masterVolume !== undefined) soundService.setVolume(partial.masterVolume);
    StorageService.saveSettings(get());
  },

  updateGameplay: (partial) => {
    const updated = { ...get().gameplay, ...partial };
    set({ gameplay: updated });
    StorageService.saveSettings(get());
  },

  updateAccessibility: (partial) => {
    const updated = { ...get().accessibility, ...partial };
    set({ accessibility: updated });
    StorageService.saveSettings(get());
  },

  setBoardTheme: (boardTheme) => {
    const updated = { ...get().gameplay, boardTheme };
    set({ gameplay: updated });
    StorageService.saveSettings(get());
  },

  setPieceTheme: (pieceTheme) => {
    const updated = { ...get().gameplay, pieceTheme };
    set({ gameplay: updated });
    StorageService.saveSettings(get());
  },

  toggleViewMode: () => {
    const current = get().graphics.viewMode;
    const viewMode: '3d' | '2d' = current === '3d' ? '2d' : '3d';
    const updated = { ...get().graphics, viewMode };
    set({ graphics: updated });
    StorageService.saveSettings(get());
  }
}));
