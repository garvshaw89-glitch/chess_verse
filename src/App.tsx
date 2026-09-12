/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navbar, NavPage } from './components/ui/Navbar';
import { HeroSection } from './components/landing/HeroSection';
import { PlayView } from './pages/PlayView';
import { TwoPlayerView } from './pages/TwoPlayerView';
import { PuzzlesView } from './pages/PuzzlesView';
import { LearnView } from './pages/LearnView';
import { ProfileView } from './pages/ProfileView';
import { SettingsModal } from './components/ui/SettingsModal';
import { BoardThemesModal } from './components/ui/BoardThemesModal';
import { TwoPlayerSetupModal } from './components/ui/TwoPlayerSetupModal';
import { ToastNotification } from './components/ui/ToastNotification';
import { useNavigationStore } from './store/navigationStore';
import { PageTransition } from './components/transitions/PageTransition';
import { TransitionOverlay } from './components/transitions/TransitionOverlay';

export default function App() {
  const { 
    currentPage, 
    navigateWithTransition, 
    settingsOpen, 
    openSettings, 
    closeSettings,
    themesModalOpen,
    openThemesModal,
    closeThemesModal
  } = useNavigationStore();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Top and Mobile Navigation with 3D button interactions */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateWithTransition}
        onOpenSettings={openSettings}
        onOpenThemes={openThemesModal}
      />

      {/* Main Page Routing with 3D Page Transition System */}
      <main className="flex-1 relative flex flex-col overflow-hidden">
        <PageTransition>
          {currentPage === 'landing' && <HeroSection onNavigate={navigateWithTransition} />}
          {currentPage === 'play' && (
            <PlayView onNavigate={navigateWithTransition} onOpenSettings={openSettings} />
          )}
          {currentPage === '2player' && (
            <TwoPlayerView onNavigate={navigateWithTransition} onOpenSettings={openSettings} />
          )}
          {currentPage === 'puzzles' && (
            <PuzzlesView onNavigate={navigateWithTransition} onOpenSettings={openSettings} />
          )}
          {currentPage === 'learn' && (
            <LearnView onNavigate={navigateWithTransition} onOpenSettings={openSettings} />
          )}
          {currentPage === 'profile' && <ProfileView onNavigate={navigateWithTransition} />}
        </PageTransition>
      </main>

      {/* Global 3D Cinematic Transition Overlay */}
      <TransitionOverlay />

      {/* Persistent Floating Controls & 3D Modals */}
      <TwoPlayerSetupModal onStartPlaying={() => navigateWithTransition('play')} />
      <SettingsModal isOpen={settingsOpen} onClose={closeSettings} />
      <BoardThemesModal isOpen={themesModalOpen} onClose={closeThemesModal} />
      <ToastNotification />
    </div>
  );
}

