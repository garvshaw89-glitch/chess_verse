import { create } from 'zustand';
import { NavPage } from '../components/ui/Navbar';
import { ANIMATION_CONFIG, prefersReducedMotion } from '../config/animationConfig';
import { soundService } from '../services/sound';
import { useGameStore } from './gameStore';

export type TransitionPhase = 'idle' | 'exit' | 'curtain' | 'enter';

interface NavigationState {
  currentPage: NavPage;
  previousPage: NavPage | null;
  targetPage: NavPage | null;
  isTransitioning: boolean;
  transitionPhase: TransitionPhase;
  isNavigatingBack: boolean;
  historyStack: NavPage[];
  settingsOpen: boolean;
  themesModalOpen: boolean;

  // Actions
  navigateWithTransition: (target: NavPage, customLabel?: string) => Promise<void>;
  navigateBack: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  openThemesModal: () => void;
  closeThemesModal: () => void;
  resetTransitionSafety: () => void;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  currentPage: 'landing',
  previousPage: null,
  targetPage: null,
  isTransitioning: false,
  transitionPhase: 'idle',
  isNavigatingBack: false,
  historyStack: ['landing'],
  settingsOpen: false,
  themesModalOpen: false,

  openThemesModal: () => {
    soundService.playButton3DPress('secondary');
    set({ themesModalOpen: true });
  },

  closeThemesModal: () => {
    soundService.playClick();
    set({ themesModalOpen: false });
  },

  openSettings: () => {
    soundService.playButton3DPress('secondary');
    set({ settingsOpen: true });
  },

  closeSettings: () => {
    soundService.playClick();
    set({ settingsOpen: false });
  },

  navigateBack: () => {
    const { historyStack, isTransitioning } = get();
    if (isTransitioning) return;
    if (historyStack.length > 1) {
      const prev = historyStack[historyStack.length - 2];
      set({ isNavigatingBack: true });
      get().navigateWithTransition(prev);
    } else {
      get().navigateWithTransition('landing');
    }
  },

  resetTransitionSafety: () => {
    set({
      isTransitioning: false,
      transitionPhase: 'idle',
      targetPage: null,
      isNavigatingBack: false
    });
  },

  navigateWithTransition: async (target: NavPage, customLabel?: string) => {
    const { currentPage, isTransitioning, historyStack, isNavigatingBack } = get();

    // Prevent navigation if already on that page or currently in transition
    if (target === currentPage && !isTransitioning) return;
    if (isTransitioning) return;

    const reducedMotion = prefersReducedMotion();

    // Handle Reduced Motion: fast immediate swap
    if (reducedMotion) {
      soundService.playClick();
      set({
        currentPage: target,
        previousPage: currentPage,
        historyStack: isNavigatingBack 
          ? historyStack.slice(0, -1) 
          : [...historyStack, target],
        isNavigatingBack: false
      });
      return;
    }

    // Begin Full AAA 3D Cinematic Transition
    set({
      isTransitioning: true,
      transitionPhase: 'exit',
      targetPage: target,
    });

    // Sound effect
    soundService.playTransitionWhoosh();

    // Context-aware camera preset sync in 3D world
    const pageTheme = ANIMATION_CONFIG.pageThemes[target];
    if (pageTheme && pageTheme.cameraPreset) {
      try {
        useGameStore.getState().setCameraPreset(pageTheme.cameraPreset);
      } catch {}
    }

    // Safety timeout to prevent any freeze under any circumstance
    const safetyTimer = setTimeout(() => {
      get().resetTransitionSafety();
    }, 2500);

    // Phase 1: Current Page recedes into depth (Exit Phase)
    await new Promise((r) => setTimeout(r, ANIMATION_CONFIG.pageTransition.exitDurationMs));

    // Phase 2: Obsidian Glass Curtain & Flying 3D Piece Active
    set({
      transitionPhase: 'curtain',
      currentPage: target,
      previousPage: currentPage,
      historyStack: isNavigatingBack
        ? (historyStack.length > 1 ? historyStack.slice(0, -1) : ['landing'])
        : [...historyStack, target],
      isNavigatingBack: false
    });

    // Phase 3: Curtain Peak
    await new Promise((r) => setTimeout(r, ANIMATION_CONFIG.pageTransition.curtainPeakMs));

    // Phase 4: Destination Page moves forward from depth (Enter Phase)
    set({ transitionPhase: 'enter' });

    await new Promise((r) => setTimeout(r, ANIMATION_CONFIG.pageTransition.enterDurationMs));

    // Settle cleanly
    clearTimeout(safetyTimer);
    set({
      isTransitioning: false,
      transitionPhase: 'idle',
      targetPage: null
    });
  }
}));
